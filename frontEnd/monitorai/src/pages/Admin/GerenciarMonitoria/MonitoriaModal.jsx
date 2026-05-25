import { useEffect, useState } from "react";
import api from "../../../services/api";

export default function MonitoriaModal({ monitoramento, onClose, onSave }) {
  const [cursos, setCursos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [busca, setBusca] = useState("");
  const [resultadosBusca, setResultadosBusca] = useState([]);
  const [mostrarBusca, setMostrarBusca] = useState(false);
  
  const [cursoSelecionado, setCursoSelecionado] = useState("");
  const [disciplinaFiltrada, setDisciplinaFiltrada] = useState([]);
  
  const [monitorSelecionado, setMonitorSelecionado] = useState(null);
  
  const [form, setForm] = useState({
    disciplinaId: "",
    diaSemana: "",
    horarioInicio: "",
    horarioFim: "",
    sala: "",
  });

  const [loading, setLoading] = useState(false);
  const isEditing = !!monitoramento;

  // =========================
  // CARREGAR CURSOS/DISCIPLINAS
  // =========================
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    api.get("/cursos").then(r => setCursos(r.data));
    api.get("/disciplinas").then(r => setDisciplinas(r.data));
  }, []);

  // =========================
  // SE FOR EDIÇÃO - CARREGAR DADOS
  // =========================
 
// =========================
// SE FOR EDIÇÃO - CARREGAR DADOS
// =========================
useEffect(() => {
  if (monitoramento) {
    // Pega dados da disciplina
    const disciplina = monitoramento.disciplina;
    
    let cursoId = "";
    
    // Tenta pegar o curso de diferentes formas
    if (disciplina?.cursosIds && disciplina.cursosIds.length > 0) {
      cursoId = String(disciplina.cursosIds[0]);
    } else if (disciplina?.cursos && disciplina.cursos.length > 0) {
      const primeiroCurso = disciplina.cursos[0];
      cursoId = typeof primeiroCurso === 'object' ? String(primeiroCurso.id) : String(primeiroCurso);
    }
    
    setCursoSelecionado(cursoId);
    setMonitorSelecionado(monitoramento.monitor?.usuario);
    
    setForm({
      disciplinaId: String(disciplina?.id || ""),
      diaSemana: monitoramento.diaSemana || "",
      horarioInicio: monitoramento.horarioInicio || "",
      horarioFim: monitoramento.horarioFim || "",
      sala: monitoramento.sala || "",
    });
  }
}, [monitoramento]);

  // =========================
  // FILTRAR DISCIPLINA POR CURSO
  // =========================
  useEffect(() => {
    if (!cursoSelecionado) {
      setDisciplinaFiltrada(disciplinas);
    } else {
      const filtradas = disciplinas.filter(d => 
        d.cursosIds?.includes(parseInt(cursoSelecionado))
      );
      setDisciplinaFiltrada(filtradas);
    }
  }, [cursoSelecionado, disciplinas]);

// =========================
// BUSCAR MONITOR
// =========================
const buscarMonitor = async () => {
  if (!busca.trim() || busca.length < 1) return;
  try {
    const r = await api.get(`/usuarios/buscar?termo=${busca}`);
    setResultadosBusca(r.data);
    setMostrarBusca(true);
  } catch (e) { 
    console.error(e); 
  }
};

  useEffect(() => {
    const timer = setTimeout(() => {
      if (busca.length >= 1) buscarMonitor();
    }, 300);
    return () => clearTimeout(timer);
  }, [busca]);

  // =========================
  // SALVAR
  // =========================
  async function salvar(e) {
    e.preventDefault();
    if (!monitorSelecionado) return alert("Selecione um monitor");
    if (form.horarioInicio >= form.horarioFim) return alert("Horário inválido");

    try {
      setLoading(true);
      const payload = {
        monitorId: monitorSelecionado.id,
        disciplinaId: form.disciplinaId,
        diaSemana: form.diaSemana,
        horarioInicio: form.horarioInicio,
        horarioFim: form.horarioFim,
        sala: form.sala,
      };

      if (isEditing) {
        await api.put(`/monitorias/${monitoramento.id}`, payload);
      } else {
        await api.post("/monitorias", payload);
      }
      onSave();
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao salvar");
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // RENDER
  // =========================
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? "Editar Monitoria" : "Nova Monitoria"}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={salvar}>
          {/* BUSCA MONITOR */}
          <div className="form-group">
            <label>Buscar Monitor</label>
            <input
              type="text"
              className="form-input"
              placeholder="Digite nome, RA ou email..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />
            {mostrarBusca && resultadosBusca.length > 0 && (
              <div className="search-dropdown">
                {resultadosBusca.map(u => (
                  <div key={u.id} className="search-item" onClick={() => {
                    setMonitorSelecionado(u);
                    setBusca(u.username);
                    setMostrarBusca(false);
                  }}>
                    <strong>{u.username}</strong>
                    <small>{u.email}</small>
                  </div>
                ))}
              </div>
            )}
          </div>

          {monitorSelecionado && (
            <div className="selected-badge">
              ✓ Monitor: {monitorSelecionado.username}
            </div>
          )}

          {/* CURSO */}
          <div className="form-group">
            <label>Curso</label>
            <select
              className="form-select"
              value={cursoSelecionado}
              onChange={e => {
                setCursoSelecionado(e.target.value);
                setForm({ ...form, disciplinaId: "" });
              }}
            >
              <option value="">Selecione...</option>
              {cursos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>

          {/* DISCIPLINA */}
          <div className="form-group">
            <label>Disciplina</label>
            <select
              className="form-select"
              value={form.disciplinaId}
              onChange={e => setForm({ ...form, disciplinaId: e.target.value })}
              required
            >
              <option value="">Selecione...</option>
              {disciplinaFiltrada.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
            </select>
          </div>

          {/* DIA */}
          <div className="form-group">
            <label>Dia da Semana</label>
            <select
              className="form-select"
              value={form.diaSemana}
              onChange={e => setForm({ ...form, diaSemana: e.target.value })}
            >
              <option value="">Selecione...</option>
              <option value="Segunda-feira">Segunda-feira</option>
              <option value="Terça-feira">Terça-feira</option>
              <option value="Quarta-feira">Quarta-feira</option>
              <option value="Quinta-feira">Quinta-feira</option>
              <option value="Sexta-feira">Sexta-feira</option>
              <option value="Sábado">Sábado</option>
            </select>
          </div>

          {/* HORÁRIOS */}
          <div className="form-row">
            <div className="form-group">
              <label>Início</label>
              <input type="time" className="form-input" value={form.horarioInicio}
                onChange={e => setForm({...form, horarioInicio: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Fim</label>
              <input type="time" className="form-input" value={form.horarioFim}
                onChange={e => setForm({...form, horarioFim: e.target.value})} />
            </div>
          </div>

          {/* SALA */}
          <div className="form-group">
            <label>Sala</label>
            <input type="text" className="form-input" placeholder="Laboratório 3" value={form.sala}
              onChange={e => setForm({...form, sala: e.target.value})} />
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}