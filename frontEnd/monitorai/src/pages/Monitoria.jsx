import { useEffect, useState } from "react";
import api from "../services/api";

export default function Monitoria() {
  const [monitorias, setMonitorias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);

  const [busca, setBusca] = useState("");
  const [monitorSelecionado, setMonitorSelecionado] = useState(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    disciplinaId: "",
    diaSemana: "",
    horarioInicio: "",
    horarioFim: "",
    sala: "",
  });

  const [loading, setLoading] = useState(false);

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

  async function carregarDisciplinas() {
    try {
      const response = await api.get("/disciplinas");
      setDisciplinas(response.data);
    } catch (error) {
      console.error("Erro ao carregar disciplinas", error);
    }
  }

  useEffect(() => {
    carregarMonitorias();
    carregarDisciplinas();
  }, []);

  // =========================
  // BUSCAR ALUNO
  // =========================
  async function buscarUsuarios() {
    if (!busca.trim()) {
      setUsuarios([]);
      return;
    }
    try {
      const response = await api.get(`/usuarios/buscar?termo=${busca}`);
      setUsuarios(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários", error);
    }
  }

  // =========================
  // SALVAR (CRIAR OU EDITAR)
  // =========================
  async function salvarMonitoria(e) {
    e.preventDefault();

    if (!monitorSelecionado) {
      alert("Selecione um aluno/monitor.");
      return;
    }

    // Validação de Horário no Front-end
    if (form.horarioInicio >= form.horarioFim) {
        alert("Erro: O horário de início deve ser anterior ao horário de fim.");
        return;
    }

    try {
      setLoading(true);

      const payload = {
        monitorId: monitorSelecionado.id,
        disciplinaId: form.disciplinaId,
        diaSemana: form.diaSemana,
        horarioInicio: form.horarioInicio,
        horarioFim: form.horarioFim,
        sala: form.sala,
        // O semestreReferencia foi removido pois o backend calcula sozinho
      };

      if (isEditing) {
        await api.put(`/monitorias/${editId}`, payload);
        alert("Monitoria atualizada com sucesso!");
      } else {
        await api.post("/monitorias", payload);
        alert("Monitoria criada com sucesso!");
      }

      cancelarEdicao();
      carregarMonitorias();
    } catch (error) {
      console.error(error);
      // Tratamento de erro aprimorado: tenta pegar a mensagem do backend
      const mensagemErro = error.response?.data?.message || error.response?.data || "Erro ao salvar monitoria";
      alert(mensagemErro);
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // PREPARAR EDIÇÃO
  // =========================
  function prepararEdicao(monitoria) {
    setIsEditing(true);
    setEditId(monitoria.id);
    setMonitorSelecionado(monitoria.monitor?.usuario);
    
    setForm({
      disciplinaId: monitoria.disciplina?.id || "",
      diaSemana: monitoria.diaSemana || "",
      horarioInicio: monitoria.horarioInicio || "",
      horarioFim: monitoria.horarioFim || "",
      sala: monitoria.sala || "",
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelarEdicao() {
    setIsEditing(false);
    setEditId(null);
    setMonitorSelecionado(null);
    setBusca("");
    setUsuarios([]);
    setForm({
      disciplinaId: "",
      diaSemana: "",
      horarioInicio: "",
      horarioFim: "",
      sala: "",
    });
  }

  // =========================
  // DESATIVAR MONITORIA
  // =========================
  async function desativarMonitoria(id) {
    if(window.confirm("Deseja realmente desativar esta monitoria?")) {
      try {
        await api.delete(`/monitorias/${id}`);
        alert("Monitoria desativada com sucesso!");
        carregarMonitorias();
      } catch (error) {
        console.error(error);
        alert("Erro ao remover monitoria");
      }
    }
  }

  return (
    <div style={{ padding: "30px", fontFamily: "sans-serif" }}>
      <h1>Gerenciamento de Monitorias</h1>
      <hr />

      <h2>{isEditing ? "Editar Monitoria" : "Criar Monitoria"}</h2>

      {isEditing && (
        <div style={{ background: "#fff3cd", padding: "15px", borderRadius: "5px", marginBottom: "15px", maxWidth: "600px", color: "#856404", border: "1px solid #ffeeba" }}>
          <strong>⚠️ Atenção:</strong> Só altere a disciplina para corrigir erros de digitação. 
          Se for um novo semestre ou ciclo, <strong>não edite</strong>! Desative esta monitoria e crie uma nova para preservar o histórico.
        </div>
      )}

      <form
        onSubmit={salvarMonitoria}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          maxWidth: "600px",
          padding: "20px",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}
      >
        {/* BUSCAR ALUNO */}
        <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="Buscar aluno por nome, RA ou email"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{ flex: 1, padding: "8px" }}
            />
            <button type="button" onClick={buscarUsuarios}>Buscar</button>
        </div>

        {/* RESULTADOS DA BUSCA */}
        {usuarios.length > 0 && (
          <div style={{ border: "1px solid #ccc", background: "white", maxHeight: "200px", overflowY: "auto" }}>
            {usuarios.map((usuario) => (
              <div
                key={usuario.id}
                style={{ borderBottom: "1px solid #eee", padding: "10px", cursor: "pointer" }}
                onClick={() => {
                  setMonitorSelecionado(usuario);
                  setUsuarios([]);
                  setBusca("");
                }}
              >
                <strong>{usuario.username}</strong>
                <div style={{ fontSize: "0.85em", color: "#666" }}>
                    {usuario.email} | RA: {usuario.ra} | {usuario.role}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MONITOR SELECIONADO */}
        {monitorSelecionado && (
          <div style={{ background: "#e8f5e9", padding: "12px", borderRadius: "8px", border: "1px solid #c8e6c9" }}>
            <strong>✅ Selecionado:</strong> {monitorSelecionado.username} ({monitorSelecionado.email})
          </div>
        )}

        {/* CAMPOS DO FORMULÁRIO */}
        <label>Disciplina:</label>
        <select
          value={form.disciplinaId}
          onChange={(e) => setForm({ ...form, disciplinaId: e.target.value })}
          required
          style={{ padding: "8px" }}
        >
          <option value="">Selecione a disciplina</option>
          {disciplinas.map((disciplina) => (
            <option key={disciplina.id} value={disciplina.id}>
              {disciplina.nome}
            </option>
          ))}
        </select>

        <label>Dia da Semana:</label>
        <select 
          value={form.diaSemana}
          onChange={(e) => setForm({ ...form, diaSemana: e.target.value })}
          required
          style={{ padding: "8px" }}
        >
            <option value="">Selecione o dia</option>
            <option value="Segunda-feira">Segunda-feira</option>
            <option value="Terça-feira">Terça-feira</option>
            <option value="Quarta-feira">Quarta-feira</option>
            <option value="Quinta-feira">Quinta-feira</option>
            <option value="Sexta-feira">Sexta-feira</option>
            <option value="Sábado">Sábado</option>
        </select>

        <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ flex: 1 }}>
                <label>Início:</label>
                <input
                  type="time"
                  value={form.horarioInicio}
                  onChange={(e) => setForm({ ...form, horarioInicio: e.target.value })}
                  required
                  style={{ width: "100%", padding: "8px" }}
                />
            </div>
            <div style={{ flex: 1 }}>
                <label>Fim:</label>
                <input
                  type="time"
                  value={form.horarioFim}
                  onChange={(e) => setForm({ ...form, horarioFim: e.target.value })}
                  required
                  style={{ width: "100%", padding: "8px" }}
                />
            </div>
        </div>

        <label>Local/Sala:</label>
        <input
          type="text"
          placeholder="Ex: Laboratório 3, Sala 102"
          value={form.sala}
          onChange={(e) => setForm({ ...form, sala: e.target.value })}
          required
          style={{ padding: "8px" }}
        />

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button type="submit" disabled={loading} style={{ flex: 2, padding: "12px", backgroundColor: isEditing ? "#007bff" : "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            {loading ? "Processando..." : isEditing ? "Atualizar Monitoria" : "Cadastrar Monitoria"}
          </button>
          
          {isEditing && (
            <button type="button" onClick={cancelarEdicao} style={{ flex: 1, backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <hr style={{ margin: "40px 0" }} />

      <h2>Monitorias Cadastradas</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {monitorias.map((monitoria) => (
            <div
              key={monitoria.id}
              style={{
                border: "1px solid #ddd",
                padding: "20px",
                borderRadius: "12px",
                backgroundColor: monitoria.ativa ? "white" : "#f1f1f1",
                boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                opacity: monitoria.ativa ? 1 : 0.7
              }}
            >
              <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>
                {monitoria.disciplina?.nome} {!monitoria.ativa && <span style={{ color: "red", fontSize: "0.8em" }}>(Inativa)</span>}
              </h3>
              <p><strong>Monitor:</strong> {monitoria.monitor?.usuario?.username}</p>
              <p><strong>Período:</strong> {monitoria.semestreReferencia}</p>
              <p><strong>Horário:</strong> {monitoria.diaSemana}, das {monitoria.horarioInicio} às {monitoria.horarioFim}</p>
              <p><strong>Local:</strong> {monitoria.sala}</p>
           
              <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                <button 
                    onClick={() => prepararEdicao(monitoria)}
                    style={{ flex: 1, padding: "8px", cursor: "pointer" }}
                >
                  Editar
                </button>

                <button 
                    onClick={() => desativarMonitoria(monitoria.id)} 
                    style={{ flex: 1, padding: "8px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                >
                  Desativar
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}