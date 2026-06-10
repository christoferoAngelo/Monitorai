import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import "./Monitoria.css";
import MonitoriaModal from "./MonitoriaModal";  

export default function Monitoria() {
  const [monitorias, setMonitorias] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [monitoriaEditando, setMonitoriaEditando] = useState(null);

  const [busca, setBusca] = useState("");
const [filtroStatus, setFiltroStatus] = useState("ativas");
  const [filtroCurso, setFiltroCurso] = useState("");

  const navigate = useNavigate();

  async function carregarMonitorias() {
  try {
    const response = await api.get("/monitorias");
    console.log("Dados recebidos da API:", response.data); // <--- Adicione isso!
    
    // Verifique se o dado é realmente um array
    if (Array.isArray(response.data)) {
      setMonitorias(response.data);
    } else {
      console.warn("A API não retornou um array!", response.data);
      setMonitorias([]); // Garante que fique vazio ao invés de quebrar
    }
  } catch (error) {
    console.error("Erro ao carregar monitorias", error);
    setMonitorias([]);
  }
}

  async function carregarCursos() {
    try {
      const response = await api.get("/cursos");
      setCursos(response.data);
    } catch (error) {
      console.error("Erro ao carregar cursos", error);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    carregarMonitorias();
    carregarCursos();
  }, []);

  const monitoriasFiltradas = Array.isArray(monitorias) 
  ? monitorias.filter(m => {
      if (filtroStatus === "ativas" && !m.ativa) return false;
      if (filtroStatus === "inativas" && m.ativa) return false;
      return true;
    })
  : []; // Se não for array, retorna array vazio

  function criarNova() {
    setMonitoriaEditando(null);
    setMostrarModal(true);
  }

  function editarMonitoria(monitoria) {
    setMonitoriaEditando(monitoria);
    setMostrarModal(true);
  }

  async function toggleAtivar(monitoria) {
    const acao = monitoria.ativa ? "desativar" : "ativar";
    if (!window.confirm(`Deseja ${acao} esta monitoria?`)) return;
    
    try {
      if (monitoria.ativa) {
        await api.delete(`/monitorias/${monitoria.id}`);
      } else {
        await api.put(`/monitorias/${monitoria.id}/reativar`);
      }
      carregarMonitorias();
    } catch (error) {
      console.error(error);
      alert("Erro ao alterar status");
    }
  }

  // NOVA FUNÇÃO: Ir para Histórico
  function irParaHistorico() {
    navigate('/historico-monitorias');
  }

  // NOVA FUNÇÃO: Ir para Relatórios
  function verRelatorios(monitoriaId) {
    navigate(`/relatorios/novo?monitoriaId=${monitoriaId}`);
  }

    // FUNÇÃO: Finalizar Semestre
  async function finalizarSemestre() {
    if (!window.confirm("⚠️ FINALIZAR SEMESTRE?\n\nOs monitores serão desvinculados das monitorias e elas ficarão inativas.\n\nTem certeza que deseja continuar?")) {
      return;
    }
    
    try {
      await api.post("/monitorias/finalizar-semestre");
      alert("✅ Semestre finalizado com sucesso!");
      carregarMonitorias();
    } catch (error) {
      alert("Erro ao finalizar semestre");
    }
  }

  const ativas = Array.isArray(monitorias) ? monitorias.filter(m => m.ativa).length : 0;
  const inativas = Array.isArray(monitorias) ? monitorias.filter(m => !m.ativa).length : 0;

  return (
    <div className="monitoria-page">
<header className="page-header">
        <div>
          <h1>Gerenciamento de Monitorias</h1>
          <p className="page-subtitle">Cadastre e gerencie as monitorias ativas por semestre</p>
        </div>
        {/* Header limpo, apenas título */}
      </header>


<div className="stats-row">
        <div className="stat-box verde">
          {/* Aplicando a cor e tamanho diretamente na tag */}
          <span style={{ display: "block", fontSize: "34px", fontWeight: "700", color: "#0f172a", marginBottom: "10px" }}>
            {ativas}
          </span>
          <span className="stat-label">Ativas</span>
        </div>
        
        <div className="stat-box vermelho">
          <span style={{ display: "block", fontSize: "34px", fontWeight: "700", color: "#0f172a", marginBottom: "10px" }}>
            {inativas}
          </span>
          <span className="stat-label">Inativas</span>
        </div>
        
        <div className="stat-box azul">
          <span style={{ display: "block", fontSize: "34px", fontWeight: "700", color: "#0f172a", marginBottom: "10px" }}>
            {monitorias.length}
          </span>
          <span className="stat-label">Total</span>
        </div>
      </div>

<div className="controls-row">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select className="filter-select" value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="ativas">Apenas Ativas</option>
            <option value="inativas">Apenas Inativas</option>
          </select>
          
          {/* Botões movidos para cá */}
          <button className="btn-historic" onClick={irParaHistorico}>📜 Histórico</button>
          <button className="btn-new" onClick={criarNova}>➕ Nova Monitoria</button>
        </div>
      </div>

      <div className="list-card">
        <div className="list-header">
          <h2>Todas as Monitorias ({monitoriasFiltradas.length})</h2>
        </div>

        {monitoriasFiltradas.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📚</div>
            <h3>Nenhuma monitoria encontrada</h3>
          </div>
        ) : (
          <div className="monitorias-grid">
            {monitoriasFiltradas.map((m) => (
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
                    <span className="info-text">Monitor: <strong>{m.monitor?.usuario?.username || '—'}</strong></span>
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
                  <button className="btn-edit" onClick={() => editarMonitoria(m)}>✏️ Editar</button>
                  <button className="btn-report" onClick={() => verRelatorios(m.id)}>📋 Relatórios</button>
                  <button className={`btn-toggle ${m.ativa ? 'btn-disable' : 'btn-enable'}`} onClick={() => toggleAtivar(m)}>
                    {m.ativa ? '⏸️ Inativar' : '▶️ Ativar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

       
      </div>

      <div className="footer-actions">
        <button className="btn-finalizar" onClick={finalizarSemestre}>
          🏁 Finalizar Semestre
        </button>
      </div>

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