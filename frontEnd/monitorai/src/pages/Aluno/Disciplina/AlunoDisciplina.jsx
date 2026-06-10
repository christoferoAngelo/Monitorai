import { useEffect, useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import api from '../../../services/api';
import './AlunoDisciplina.css';
import {
  FaHeart,
  FaRegHeart,
  FaBookmark,
  FaRegBookmark,
  FaComment,
  FaPaperPlane
} from "react-icons/fa";

function AlunoDisciplina() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const { usuario } = useOutletContext() || {}; 
  
  const [disciplina, setDisciplina] = useState(null);
  const [materiais, setMateriais] = useState([]);
  
  const [monitoria, setMonitoria] = useState(null); 
  const [loading, setLoading] = useState(true);
  
  // Estados dos filtros
  const [termoBusca, setTermoBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('TODOS');
  const [ordenacao, setOrdenacao] = useState('recente');

  // Estados dos cards
  const [curtidos, setCurtidos] = useState([]);
  const [salvos, setSalvos] = useState([]);

  const [modalComentarios, setModalComentarios] = useState(false);
  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState("");
  const [materialSelecionado, setMaterialSelecionado] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [discRes, matRes, monitoriasRes] = await Promise.all([
          api.get(`/disciplinas/${id}`),
          api.get(`/materiais/disciplina/${id}`),
          api.get('/monitorias/ativas') 
        ]);
        
        setDisciplina(discRes.data);
        setMateriais(matRes.data);

        // 1. ATUALIZADO: Busca baseada na nova estrutura do DTO (disciplinaId)
        const monitoriaEncontrada = monitoriasRes.data.find(
          m => m.disciplinaId === Number(id)
        );
        setMonitoria(monitoriaEncontrada);

        const curtidosUsuario = matRes.data
        .filter(m => m.curtidoPorMim)
        .map(m => m.id);

        setCurtidos(curtidosUsuario);

      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      } finally {
        setLoading(false);
      }
    };

    const carregarSalvos = async () => {
      try {
        const res = await api.get("/usuarios/me/salvos");
        const ids = res.data.map(material => material.id);
        setSalvos(ids);
      } catch (err) {
        console.error("Erro ao buscar salvos:", err);
      }
    };

    Promise.all([
      carregarDados(),
      carregarSalvos()
    ]);
  }, [id]);

  // Lógica de filtragem
  const materiaisFiltrados = materiais.filter((item) => {
    const atendeBusca = item.titulo.toLowerCase().includes(termoBusca.toLowerCase()) || 
                        (item.conteudo && item.conteudo.toLowerCase().includes(termoBusca.toLowerCase()));
    const atendeTipo = filtroTipo === 'TODOS' || item.tipo === filtroTipo;
    
    return atendeBusca && atendeTipo;
  }).sort((a, b) => {
    return ordenacao === 'recente' ? b.id - a.id : a.id - b.id;
  });

  const renderizarIconeTipo = (tipo) => {
    if (tipo === 'DOCUMENTO') return '📄';
    if (tipo === 'QUIZ' || tipo === 'QUIZZ') return '🧩';
    if (tipo === 'VIDEO') return '▶️';
    return '📁';
  };

  const toggleCurtida = async(materialId) => {
    try {
        const res = await api.post(`/materiais/${materialId}/curtir`);
        setMateriais(prev =>
            prev.map(material =>
                material.id === materialId
                ? {
                    ...material,
                    curtidas: res.data.curtidas,
                    curtido: res.data.curtido
                  }
                : material
            )
        );
    } catch(err) {
        console.error("Erro ao curtir:", err);
    }
  };

  if (loading) return <div className="loading">Carregando detalhes da disciplina...</div>;
  if (!disciplina) return <div className="error-message">Disciplina não encontrada.</div>;

  // 2. ATUALIZADO: Verificação usando o DTO (monitorNome)
  const isMinhaMonitoria = monitoria?.monitorNome === usuario?.username;

  const toggleSalvo = async (materialId) => {
    try {
        const jaSalvo = salvos.includes(materialId);
        if(jaSalvo){
            await api.delete(`/materiais/${materialId}/salvar`);
            setSalvos(prev => prev.filter(id => id !== materialId));
        } else {
            await api.post(`/materiais/${materialId}/salvar`);
            setSalvos(prev => [...prev, materialId]);
        }
    } catch(err) {
        console.error("Erro ao salvar material", err);
    }
  };

  const enviarComentario = async () => {
    if(!novoComentario.trim()) return;
    try {
      await api.post("/comentarios", {
        texto: novoComentario,
        materialId: materialSelecionado
      });
      abrirComentarios(materialSelecionado);
      setNovoComentario("");
    } catch(err) {
      console.error(err);
    }
  };

  const abrirComentarios = async (materialId) => {
    setMaterialSelecionado(materialId);
    try {
      const res = await api.get(`/comentarios/material/${materialId}`);
      setComentarios(res.data);
      setModalComentarios(true);
    } catch(err) {
      console.error(err);
    }
  };

  const excluirComentario = async (comentarioId) => {
    try {
      await api.delete(`/comentarios/${comentarioId}`);
      setComentarios(prev => prev.filter(c => c.id !== comentarioId));
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className="disciplina-detalhe-container">
      {/* Cabeçalho superior */}
      <header className="disciplina-detalhe-header">
        <div className="header-title-row">
          <h1>{disciplina.nome}</h1>
          {disciplina.codigo && <span className="detalhe-code">{disciplina.codigo}</span>}
        </div>
      </header>

      {/* Grid Layout Dividido */}
      <div className="disciplina-detalhe-layout">
        
        {/* COLUNA ESQUERDA: LISTA DE MATERIAIS */}
        <main className="layout-principal-materiais">
          <section className="repositorio-card">
            <div className="repositorio-header">
              <h2>📚 Materiais de Estudo</h2>
              <p>Explore os PDFs, vídeos e quizzes postados pelo monitor.</p>
            </div>

            {/* BARRA DE FILTROS E PESQUISA */}
            <div className="filtros-container">
              <input 
                type="text" 
                placeholder="🔍 Buscar por título ou descrição..." 
                className="input-busca"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
              
              <select 
                className="select-filtro" 
                value={filtroTipo} 
                onChange={(e) => setFiltroTipo(e.target.value)}
              >
                <option value="TODOS">Todos os tipos</option>
                <option value="DOCUMENTO">📄 PDFs</option>
                <option value="QUIZ">🧩 Quizzes</option>
                <option value="VIDEO">▶️ Vídeos</option>
              </select>

              <select 
                className="select-filtro" 
                value={ordenacao} 
                onChange={(e) => setOrdenacao(e.target.value)}
              >
                <option value="recente">Mais recentes</option>
                <option value="antigo">Mais antigos</option>
              </select>
            </div>

            {/* LISTAGEM DOS MATERIAIS FILTRADOS */}
            <div className="materiais-grid">
              {materiaisFiltrados.length === 0 ? (
                <p className="materiais-vazio">Nenhum material encontrado com esses filtros.</p>
              ) : materiaisFiltrados.map((material) => (
                <div key={material.id} className="material-card">
                  
                  <div className="material-card-header">
                    <div className="material-tipo-badge">
                      {renderizarIconeTipo(material.tipo)} {material.tipo === 'DOCUMENTO' ? 'PDF' : material.tipo}
                    </div>
                  </div>

                  <h4>{material.titulo}</h4>
                  {material.conteudo && <p>{material.conteudo}</p>}
                  
                  <div className="material-actions">
                    <div className="material-footer">
                      <div className="material-actions">
                          <button
                              className={`icon-btn like-btn ${material.curtido ? "active" : ""}`}
                              onClick={() => toggleCurtida(material.id)}
                          >
                              {material.curtido ? <FaHeart /> : <FaRegHeart />}
                              <span className="curtidas-count">{material.curtidas}</span>
                          </button>

                          <button 
                              className={`icon-btn bookmark-btn ${salvos.includes(material.id) ? "active" : ""}`}
                              onClick={() => toggleSalvo(material.id)}
                          >
                              {salvos.includes(material.id) ? <FaBookmark /> : <FaRegBookmark />}
                          </button>

                          <button className="icon-btn" onClick={() => abrirComentarios(material.id)}>
                              <FaComment />
                          </button>
                      </div>

                      <a
                          href={material.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-acessar-material"
                      >
                          Acessar Material 🔗
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* COLUNA DIREITA: INFORMAÇÕES */}
        <aside className="layout-lateral-infos">
          <div className="info-geral-card">
            <h3>📋 Detalhes Acadêmicos</h3>
            <div className="info-divider"></div>
            
            <div className="info-row">
              <strong>Monitor Responsável:</strong>
              {/* 3. ATUALIZADO: Exibição do nome com base no DTO */}
              <span>
                {monitoria?.monitorNome 
                  ? monitoria.monitorNome.substring(0,1).toUpperCase() + monitoria.monitorNome.substring(1) 
                  : "Nenhum monitor alocado"}
                {isMinhaMonitoria && <span className="tag-voce" style={{ color: '#10b981', fontWeight: 'bold' }}> (Você)</span>}
              </span>
            </div>
            
            <div className="info-row">
              <strong>Curso(s):</strong>
              <span>
                {disciplina.cursosNomes && disciplina.cursosNomes.length > 0 
                  ? disciplina.cursosNomes.join(" | ") 
                  : "Grade Geral"}
              </span>
            </div>
          </div>

          <div className="info-geral-card">
            <h3>📅 Agenda de Monitorias</h3>
            {/* 4. ATUALIZADO: Segurança extra adicionada nas strings de data e hora */}
            <p>
              {monitoria 
                ? `Atendimento toda(o) ${monitoria.diaSemana?.toLowerCase() || ''} das ${monitoria.horarioInicio?.substring(0,5) || ''} às ${monitoria.horarioFim?.substring(0,5) || ''} na(o) ${monitoria.sala?.toLowerCase() || ''}.` 
                : "Área reservada para você verificar os dias de atendimento e reservar seu horário de dúvidas."}
            </p>
          </div>
        </aside>

      </div>

      {/* MODAL DE COMENTÁRIOS */}
      {modalComentarios && (
        <div className="modal-overlay" onClick={() => setModalComentarios(false)}>
          <div className="modal-comentarios" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Comentários</h2>
              <button className="btn-fechar-modal" onClick={() => setModalComentarios(false)}>✕</button>
            </div>

            <div className="comentarios-lista">
              {comentarios.map(comentario => (
                <div key={comentario.id} className="comentario-item">
                  <div className="comentario-header">
                    <strong>{comentario.username}</strong>
                    {comentario.podeExcluir && (
                      <button
                        className="btn-excluir-comentario"
                        onClick={() => {
                          if(window.confirm("Tem certeza que deseja excluir este comentário?")) {
                            excluirComentario(comentario.id);
                          }
                        }} 
                      >✕</button>
                    )}
                  </div>
                  <p>{comentario.texto}</p>
                </div>
              ))}
            </div>

            <div className="comentario-input-area">
              <input
                type="text"
                placeholder="Escreva um comentário..."
                value={novoComentario}
                onChange={(e) => setNovoComentario(e.target.value)}
              />
              <button onClick={enviarComentario}>
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AlunoDisciplina;