import { useEffect, useState } from "react";
import api from "../../../services/api";
import "./Monitoria.css";
import MonitoriaModal from "./MonitoriaModal";  

export default function Monitoria() {
  const [monitorias, setMonitorias] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [monitoriaEditando, setMonitoriaEditando] = useState(null);

  // =========================
  // CARREGAR DADOS
  // =========================
  async function carregarMonitorias() {
    try {
      const response = await api.get("/monitorias");
      setMonitorias(response.data);
    } catch (error) {
      console.error("Erro ao carregar monitorias", error);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    carregarMonitorias();
  }, []);

  // =========================
  // ABRIR MODAL
  // =========================
  function criarNova() {
    setMonitoriaEditando(null);
    setMostrarModal(true);
  }

  function editarMonitoria(monitoria) {
    setMonitoriaEditando(monitoria);
    setMostrarModal(true);
  }

// =========================
// ATIVAR/DESATIVAR
// =========================
async function toggleAtivar(monitoria) {
  const acao = monitoria.ativa ? "desativar" : "ativar";
  if (acao === "desativar") {
    if (!window.confirm("Deseja desativar esta monitoria?")) return;
  } else {
    if (!window.confirm("Deseja reativar esta monitoria?")) return;
  }
  
  try {
    if (monitoria.ativa) {
      await api.delete(`/monitorias/${monitoria.id}`);
      alert("Monitoria desativada!");
    } else {
      await api.put(`/monitorias/${monitoria.id}/reativar`);
      alert("Monitoria reativada!");
    }
    carregarMonitorias();
  } catch (error) {
    console.error(error);
    alert("Erro ao alterar status");
  }
}
  // =========================
  // CONTADORES
  // =========================
  const ativas = monitorias.filter(m => m.ativa).length;
  const inativas = monitorias.filter(m => !m.ativa).length;

  // =========================
  // RENDER
  // =========================
  return (
    <div className="monitoria-page">
      {/* HEADER */}
      <header className="page-header">
        <div>
          <h1>Gerenciamento de Monitorias</h1>
          <p className="page-subtitle">Cadastre e gerencie as monitorias ativas por semestre</p>
        </div>
        <button className="btn-new" onClick={criarNova}>
          ➕ Nova Monitoria
        </button>
      </header>

      {/* STATS */}
      <div className="stats-row">
        <div className="stat-box">
          <span className="stat-number">{ativas}</span>
          <span className="stat-label">Ativas</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">{inativas}</span>
          <span className="stat-label">Inativas</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">{monitorias.length}</span>
          <span className="stat-label">Total</span>
        </div>
      </div>

      {/* LISTA */}
      <div className="list-card">
        <div className="list-header">
          <h2>Todas as Monitorias</h2>
        </div>

        {monitorias.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📚</div>
            <h3>Nenhuma monitoria encontrada</h3>
            <p>Clique em "Nova Monitoria" para começar.</p>
          </div>
        ) : (
          <div className="monitorias-grid">
            {monitorias.map((m) => (
              <div key={m.id} className={`monitoria-card ${!m.ativa ? 'inactive' : ''}`}>
                <div className="monitoria-header">
                  <span className="monitoria-discipline">
                    {m.disciplina?.nome || 'Disciplina não informada'}
                  </span>
                  <span className={`monitoria-badge ${m.ativa ? 'active' : 'inactive'}`}>
                    {m.ativa ? 'Ativa' : 'Inativa'}
                  </span>
                </div>
                
                <div className="monitoria-info">
                  <div className="info-row">
                    <span className="info-icon">👤</span>
                    <span className="info-text">
                      Monitor: <strong>{m.monitor?.usuario?.username || '—'}</strong>
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-icon">📅</span>
                    <span className="info-text">{m.diaSemana || '—'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-icon">🕐</span>
                    <span className="info-text">{m.horarioInicio} - {m.horarioFim}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-icon">📍</span>
                    <span className="info-text">{m.sala || '—'}</span>
                  </div>
                </div>

                <div className="monitoria-actions">
                  <button className="btn-edit" onClick={() => editarMonitoria(m)}>
                    ✏️ Editar
                  </button>
                  <button className={`btn-toggle ${m.ativa ? 'btn-disable' : 'btn-enable'}`} onClick={() => toggleAtivar(m)}>
                    {m.ativa ? '⏸️ Inativar' : '▶️ Ativar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {mostrarModal && (
        <MonitoriaModal 
          monitoramento={monitoriaEditando} 
          onClose={() => setMostrarModal(false)}
          onSave={() => {
            setMostrarModal(false);
            carregarMonitorias();
          }}
        />
      )}
    </div>
  );
}