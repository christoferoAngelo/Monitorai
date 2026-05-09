import { useEffect, useState } from "react";
import api from "../services/api";

export default function Monitoria() {
  const [monitorias, setMonitorias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);

  const [busca, setBusca] = useState("");

  const [monitorSelecionado, setMonitorSelecionado] = useState(null);

  const [form, setForm] = useState({
    disciplinaId: "",
    diaSemana: "",
    horarioInicio: "",
    horarioFim: "",
    sala: "",
    semestreReferencia: "",
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
  // CRIAR MONITORIA
  // =========================

  async function criarMonitoria(e) {
    e.preventDefault();

    if (!monitorSelecionado) {
      alert("Selecione um aluno.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/monitorias", {
        monitorId: monitorSelecionado.id,
        disciplinaId: form.disciplinaId,
        diaSemana: form.diaSemana,
        horarioInicio: form.horarioInicio,
        horarioFim: form.horarioFim,
        sala: form.sala,
        semestreReferencia: form.semestreReferencia,
      });

      alert("Monitoria criada com sucesso!");

      setForm({
        disciplinaId: "",
        diaSemana: "",
        horarioInicio: "",
        horarioFim: "",
        sala: "",
        semestreReferencia: "",
      });

      setMonitorSelecionado(null);
      setBusca("");
      setUsuarios([]);

      carregarMonitorias();
    } catch (error) {
      console.error(error);
      alert("Erro ao criar monitoria");
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // DESATIVAR MONITORIA
  // =========================

  async function desativarMonitoria(id) {
    try {
      await api.delete(`/monitorias/${id}`);

      alert("Monitoria removida");

      carregarMonitorias();
    } catch (error) {
      console.error(error);
      alert("Erro ao remover monitoria");
    }
  }

  // =========================
  // TROCAR MONITOR
  // =========================

  async function trocarMonitor(monitoriaId, novoMonitorId) {
    try {
      await api.put(
        `/monitorias/${monitoriaId}/trocar-monitor/${novoMonitorId}`
      );

      alert("Monitor trocado com sucesso!");

      carregarMonitorias();
    } catch (error) {
      console.error(error);
      alert("Erro ao trocar monitor");
    }
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Gerenciamento de Monitorias</h1>

      <hr />

      {/* ================================= */}
      {/* FORMULÁRIO */}
      {/* ================================= */}

      <h2>Criar Monitoria</h2>

      <form
        onSubmit={criarMonitoria}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "500px",
        }}
      >
        {/* BUSCAR ALUNO */}

        <input
          type="text"
          placeholder="Buscar aluno por nome, RA ou email"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        <button type="button" onClick={buscarUsuarios}>
          Buscar Aluno
        </button>

        {/* RESULTADOS */}

        {usuarios.length > 0 ? (
          <div
            style={{
              border: "1px solid #ccc",
              padding: "10px",
            }}
          >
            {usuarios.map((usuario) => (
              <div
                key={usuario.id}
                style={{
                  borderBottom: "1px solid #eee",
                  padding: "8px",
                  cursor: "pointer",
                }}
                onClick={() => setMonitorSelecionado(usuario)}
              >
                <strong>{usuario.username}</strong>

                <p>{usuario.email}</p>

                <p>RA: {usuario.ra}</p>

                <p>{usuario.role}</p>
              </div>
            ))}
          </div>
        ) : busca ? (
          <div>
            <p>Aluno não encontrado.</p>

            <button
              type="button"
              onClick={() => (window.location.href = "/")}
            >
              Criar Usuário
            </button>
          </div>
        ) : null}

        {/* MONITOR SELECIONADO */}

        {monitorSelecionado && (
          <div
            style={{
              background: "#e8f5e9",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            <strong>Aluno Selecionado:</strong>

            <p>{monitorSelecionado.username}</p>

            <p>{monitorSelecionado.email}</p>
          </div>
        )}

        {/* DISCIPLINA */}

        <select
          value={form.disciplinaId}
          onChange={(e) =>
            setForm({ ...form, disciplinaId: e.target.value })
          }
          required
        >
          <option value="">Selecione a disciplina</option>

          {disciplinas.map((disciplina) => (
            <option key={disciplina.id} value={disciplina.id}>
              {disciplina.nome}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Dia da semana"
          value={form.diaSemana}
          onChange={(e) =>
            setForm({ ...form, diaSemana: e.target.value })
          }
          required
        />

        <input
          type="time"
          value={form.horarioInicio}
          onChange={(e) =>
            setForm({ ...form, horarioInicio: e.target.value })
          }
          required
        />

        <input
          type="time"
          value={form.horarioFim}
          onChange={(e) =>
            setForm({ ...form, horarioFim: e.target.value })
          }
          required
        />

        <input
          type="text"
          placeholder="Sala"
          value={form.sala}
          onChange={(e) =>
            setForm({ ...form, sala: e.target.value })
          }
          required
        />

        <input
          type="text"
          placeholder="Semestre Referência"
          value={form.semestreReferencia}
          onChange={(e) =>
            setForm({
              ...form,
              semestreReferencia: e.target.value,
            })
          }
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Criando..." : "Criar Monitoria"}
        </button>
      </form>

      <hr />

      {/* ================================= */}
      {/* LISTA */}
      {/* ================================= */}

      <h2>Monitorias Cadastradas</h2>

      {monitorias.map((monitoria) => (
        <div
          key={monitoria.id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "10px",
          }}
        >
          <h3>{monitoria.disciplina?.nome}</h3>

          <p>
            <strong>Monitor:</strong>{" "}
            {monitoria.monitor?.usuario?.username}
          </p>

          <p>
            <strong>Dia:</strong> {monitoria.diaSemana}
          </p>

          <p>
            <strong>Horário:</strong>{" "}
            {monitoria.horarioInicio} às {monitoria.horarioFim}
          </p>

          <p>
            <strong>Sala:</strong> {monitoria.sala}
          </p>

          <p>
            <strong>Semestre:</strong>{" "}
            {monitoria.semestreReferencia}
          </p>

          <button
            onClick={() => desativarMonitoria(monitoria.id)}
            style={{
              marginRight: "10px",
            }}
          >
            Excluir
          </button>

          {/* TROCAR MONITOR */}

          <button
            onClick={() => {
const novoUsuarioId = prompt(
  "Digite o ID do usuário"
);

if (novoUsuarioId) {
  trocarMonitor(
    monitoria.id,
    parseInt(novoUsuarioId)
  );
}
            }}
          >
            Trocar Monitor
          </button>
        </div>
      ))}
    </div>
  );
}