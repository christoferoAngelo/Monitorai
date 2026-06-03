import { useEffect, useState } from "react";
import api from "../../../services/api";

export default function MonitoriaModal({ monitoramento, onClose, onSave }) {
  const [cursos, setCursos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    api.get("/cursos").then(r => setCursos(r.data));
    api.get("/disciplinas").then(r => setDisciplinas(r.data));
  }, []);

  useEffect(() => {
    if (monitoramento) {
      const disciplina = monitoramento.disciplina;
      let cursoId = "";
      
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

  useEffect(() => {
    if (!cursoSelecionado) {
      setDisciplinaFiltrada(disciplinas);
    } else {
      const filtradas = disciplinas.filter(d => d.cursosIds?.includes(parseInt(cursoSelecionado)));
      setDisciplinaFiltrada(filtradas);
    }
  }, [cursoSelecionado, disciplinas]);

  const buscarMonitor = async () => {
    if (!busca.trim() || busca.length < 2) return;
    try {
      const r = await api.get(`/usuarios?search=${busca}`);
      // Filtra só alunos (ou quem ainda não é monitor)
      const alunos = r.data.filter(u => u.role === 'ALUNO' || u.role === 'USER');
      setResultadosBusca(alunos);
      setMostrarBusca(true);
    } catch (e) { 
      console.error(e); 
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (busca.length >= 2) buscarMonitor();
    }, 300);
    return () => clearTimeout(timer);
  }, [busca]);

  async function salvar(e) {
    e.preventDefault();
    
    if (!monitorSelecionado) return alert("Selecione um monitor");
    if (!form.disciplinaId) return alert("Selecione uma disciplina");
    if (!form.diaSemana) return alert("Selecione o dia da semana");
    if (form.horarioInicio >= form.horarioFim) return alert("Horário inválido");
    if (!form.sala) return alert("Informe a sala");

    setLoading(true);
    
    try {
      const payload = {
        monitorId: monitorSelecionado.id,
        disciplinaId: parseInt(form.disciplinaId),
        diaSemana: form.diaSemana,
        horarioInicio: form.horarioInicio,
        horarioFim: form.horarioFim,
        sala: form.sala,
      };

      console.log("Salvando monitoria:", payload);  // DEBUG

      if (isEditing) {
        await api.put(`/monitorias/${monitoramento.id}`, payload);
      } else {
        const res = await api.post("/monitorias", payload);
        console.log("Resposta:", res.data);  // DEBUG
      }
      onSave();
    } catch (error) {
      console.error("Erro completo:", error);
      const msg = error.response?.data?.message || error.message || "Erro ao salvar";
      alert(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? "Editar Monitoria" : "Nova Monitoria"}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={salvar}>
          <div className="form-group">
            <label>Buscar Monitor *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Digite nome ou RA..."
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

          <div className="form-group">
            <label>Disciplina *</label>
            <select
              className="form-select"
              value={form.disciplinaId}
              onChange={e => setForm({ ...form, disciplinaId: e.target.value })}
              required
            >
              <option value="">Selecione...</option>
              {disciplinaFiltrada.map(d => <option key={d.id} value={d.id}>{d.nome} ({d.semestre}º sem)</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Dia da Semana *</label>
            <select
              className="form-select"
              value={form.diaSemana}
              onChange={e => setForm({ ...form, diaSemana: e.target.value })}
              required
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

          <div className="form-row">
            <div className="form-group">
              <label>Início *</label>
              <input type="time" className="form-input" value={form.horarioInicio}
                onChange={e => setForm({...form, horarioInicio: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Fim *</label>
              <input type="time" className="form-input" value={form.horarioFim}
                onChange={e => setForm({...form, horarioFim: e.target.value})} required />
            </div>
          </div>

          <div className="form-group">
            <label>Local *</label>
            <input type="text" className="form-input" placeholder="Ex. Laboratório 3 / Sala 7" value={form.sala}
              onChange={e => setForm({...form, sala: e.target.value})} required />
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