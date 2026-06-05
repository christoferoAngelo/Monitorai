import { useState, useEffect } from 'react';
import api from '../../../services/api';
import AdminEditaisModal from './AdminEditaisModal';
import "./AdminEditais.css";

export default function AdminEditais() {
  const [editais, setEditais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    carregarEditais();
  }, []);

  async function carregarEditais() {
    try {
      const response = await api.get('/editais');
      setEditais(response.data);
    } catch (err) {
      console.error('Erro ao carregar editais:', err);
    }
    setLoading(false);
  }

  function abrirNovoModal() {
    setEditando(null);
    setMostrarModal(true);
  }

  function abrirEditar(edital) {
    setEditando(edital);
    setMostrarModal(true);
  }

  async function excluir(id) {
    const edital = editais.find(e => e.id === id);
    
    const mensagem = `
⚠️ ATENÇÃO! Você está prestes a EXCLUIR DEFINITIVAMENTE este edital:

📋 Edital nº ${edital.numeroEdital}
📌 Tipo: ${edital.tipo}
📅 Publicação: ${edital.dataPublicacao}
${edital.urlPdf ? '📎 Anexo: Sim (PDF será removido do Cloudinary)' : '📎 Anexo: Não'}

❌ Esta ação não pode ser desfeita!
Todos os dados serão perdidos permanentemente.
    `.trim();

    if (!window.confirm(mensagem)) return;
    
    try {
      await api.delete(`/editais/${id}`);
      carregarEditais();
    } catch (err) {
      alert('Erro ao excluir');
    }
  }

  function fecharModal() {
    setMostrarModal(false);
    setEditando(null);
  }

  function lidarComSucesso() {
    setMostrarModal(false);
    setEditando(null);
    carregarEditais();
  }

  if (loading) return <div className="admin-loading">Carregando...</div>;

  return (
    <div className="editais-page">
      <div className="page-header">
        <div>
          <h1>📋 Gerenciamento de Editais</h1>
          <p>Publique editais e resultados de monitoria</p>
        </div>
        <button className="btn-primary" onClick={abrirNovoModal}>
          ➕ Novo Edital
        </button>
      </div>

      <div className="editais-list">
        {editais.length === 0 ? (
          <div className="empty-state">
            <h3>Nenhum edital publicado</h3>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Edital</th>
                <th>Tipo</th>
                <th>Período</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {editais.map(edital => (
                <tr key={edital.id}>
                  <td>
                    <strong>Edital nº {edital.numeroEdital}</strong>
                    <br />
                    <small>{edital.titulo}</small>
                  </td>
                  <td>
                    <span className={`badge ${edital.tipo?.toLowerCase()}`}>
                      {edital.tipo === 'RESULTADO' ? '🏆 Resultado' : '📝 Vagas'}
                    </span>
                  </td>
                  <td>
                    {edital.periodoInicio && edital.periodoFim // ❌ ERRADO AINDA
                      ? `${edital.periodoInicio} até ${edital.periodoFim}` 
                      : '—'}
                  </td>
                  <td>
                    <span className={`badge-status ${edital.status?.toLowerCase()}`}>
                      {edital.status === 'ATIVO' ? '✅ Ativo' : '❌ Encerrado'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-edit" onClick={() => abrirEditar(edital)}>
                        ✏️ Editar
                      </button>
                      <button className="btn-delete" onClick={() => excluir(edital.id)}>
                        🗑️ Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {mostrarModal && (
        <AdminEditaisModal 
          edital={editando}
          onClose={fecharModal}
          onSuccess={lidarComSucesso}
        />
      )}
    </div>
  );
}