import { useEffect, useState } from "react";
import api from "../../../services/api";
import "./Monitoria.css";
import MonitoriaModal from "./MonitoriaModal";  

export default function Monitoria() {
  const [monitorias, setMonitorias] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [monitoriaEditando, setMonitoriaEditando] = useState(null);

  // Filtros
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos"); // todos, ativas, inativas
  const [filtroCurso, setFiltroCurso] = useState("");

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

// =========================
// FILTRAR LISTA
// =========================
const monitoriasFiltradas = monitorias.filter(m => {
  // Filtro por status
  if (filtroStatus === "ativas" && !m.ativa) return false;
  if (filtroStatus === "inativas" && m.ativa) return false;

  // Filtro por curso
  if (filtroCurso) {
    const cursoId = parseInt(filtroCurso);
    
    // Tenta diferentes formas de acessar os cursos
    let cursosMonitoria = [];
    
    if (m.disciplina?.cursosIds) {
      cursosMonitoria = m.disciplina.cursosIds;
    } else if (m.disciplina?.cursos) {
      cursosMonitoria = m.disciplina.cursos.map(c => typeof c === 'object' ? c.id : c);
    } else if (m.disciplina?.curso?.id) {
      cursosMonitoria = [m.disciplina.curso.id];
    }
    
    // Se não tem curso vinculados, mostra só se não tiver filtro
    if (cursosMonitoria.length > 0 && !cursosMonitoria.includes(cursoId)) {
      return false;
    }
  }

  // Filtro por busca
  if (busca) {
    const termo = busca.toLowerCase();
    const matchDisciplina = m.disciplina?.nome?.toLowerCase().includes(termo);
    const matchMonitor = m.monitor?.usuario?.username?.toLowerCase().includes(termo);
    const matchSala = m.sala?.toLowerCase().includes(termo);
    const matchDia = m.diaSemana?.toLowerCase().includes(termo);
    
    if (!matchDisciplina && !matchMonitor && !matchSala && !matchDia) return false;
  }

  return true;
});
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

      {/* FILTROS */}
      <div className="filters-row">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar monitoria, monitor, sala ou dia..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <select
            className="filter-select"
            value={filtroStatus}
            onChange={e => setFiltroStatus(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="ativas">Apenas Ativas</option>
            <option value="inativas">Apenas Inativas</option>
          </select>

          <select
            className="filter-select"
            value={filtroCurso}
            onChange={e => setFiltroCurso(e.target.value)}
          >
            <option value="">Todos os Cursos</option>
            {cursos.map(c => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>
      </div>

      {/* LISTA */}
      <div className="list-card">
        <div className="list-header">
          <h2>Todas as Monitorias ({monitoriasFiltradas.length})</h2>
        </div>

        {monitoriasFiltradas.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📚</div>
            <h3>Nenhuma monitoria encontrada</h3>
            <p>Tente ajustar os filtros de busca.</p>
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