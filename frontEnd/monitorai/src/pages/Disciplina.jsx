
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import axios from "axios";

export default function Disciplina() {

  const [disciplinas, setDisciplinas] = useState([]);
  const [cursos, setCursos] = useState([]);

  const [nome, setNome] = useState("");
  const [codigo, setCodigo] = useState("");
  const [cursoId, setCursoId] = useState("");
  const [monitorId, setMonitorId] = useState("");
  const [monitores, setMonitores] = useState([]);


  const [editandoId, setEditandoId] = useState(null);

  const API = "http://localhost:8080/disciplinas";
  const API_CURSOS = "http://localhost:8080/cursos";
  const API_MONITORES = "http://localhost:8080/disciplinas/monitores";

  // =====================================
  // FUNÇÃO ÚNICA PARA CARREGAR DADOS
  // =====================================

  async function carregarDados() {
    try {
      const [disciplinasRes, cursosRes] = await Promise.all([
        axios.get(API),
        axios.get(API_CURSOS)
      ]);
      setDisciplinas(disciplinasRes.data);
      setCursos(cursosRes.data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  }
  
  async function carregarMonitores() {
    try {
      const response = await axios.get(API_MONITORES);
      setMonitores(response.data);
    } catch (error) {
      console.error("Erro ao carregar monitores:", error);
    }
  }
  
  // =====================================
  // USEEFFECT
  // =====================================

  useEffect(() => {
    carregarDados();
	carregarMonitores();
  }, []);

  // =====================================
  // SALVAR
  // =====================================

  async function salvarDisciplina(e) {
    e.preventDefault();

    const dados = {
      nome,
      codigo,
      cursoId: Number(cursoId),
      monitorId: monitorId ? Number(monitorId) : null,
    };

    try {
      if (editandoId) {
        await axios.put(`${API}/${editandoId}`, dados);
        alert("Disciplina atualizada!");
      } else {
        await axios.post(API, dados);
        alert("Disciplina criada!");
      }

      limparFormulario();
      carregarDados();

    } catch (error) {
      console.error("Erro ao salvar disciplina:", error);
    }
  }

  // =====================================
  // EDITAR
  // =====================================

  function editarDisciplina(disciplina) {
    setNome(disciplina.nome);
    setCodigo(disciplina.codigo);
    setCursoId(disciplina.cursoId);
    setMonitorId(disciplina.monitorId);
    setEditandoId(disciplina.id);
  }

  // =====================================
  // DELETAR
  // =====================================

  async function deletarDisciplina(id) {
    try {
      await axios.delete(`${API}/${id}`);
      alert("Disciplina deletada!");
      carregarDados();
    } catch (error) {
      console.error("Erro ao deletar disciplina:", error);
    }
  }

  // =====================================
  // LIMPAR
  // =====================================

  function limparFormulario() {
    setNome("");
    setCodigo("");
    setCursoId("");
    setMonitorId("");
    setEditandoId(null);
  }

  // =====================================
  // JSX
  // =====================================

  return (
    <div style={{ padding: "20px" }}>

      <h1>CRUD Disciplinas</h1>

      <form onSubmit={salvarDisciplina}>

        <input
          type="text"
          placeholder="Nome da disciplina"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <br /><br />

        <input
          type="text"
          placeholder="Código"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
		  disabled 
        />

        <br /><br />

        <select
          value={cursoId}
          onChange={(e) => setCursoId(e.target.value)}
        >
          <option value="">Selecione um curso</option>
          {cursos.map((curso) => (
            <option key={curso.id} value={curso.id}>
              {curso.nome}
            </option>
          ))}
        </select>

        <br /><br />

		<select
		  value={monitorId}
		  onChange={(e) => setMonitorId(e.target.value)}
		>
		  <option value="">Selecione um monitor (opcional)</option>
		  {monitores.map((monitor) => (
		    <option key={monitor.id} value={monitor.id}>
		      {monitor.username}
		    </option>
		  ))}
		</select>

        <br /><br />

        <button type="submit">
          {editandoId ? "Atualizar" : "Criar"}
        </button>

      </form>

      <hr />

      <h2>Lista de Disciplinas</h2>

      {disciplinas.map((disciplina) => (
        <div
          key={disciplina.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <p><strong>ID:</strong> {disciplina.id}</p>
          <p><strong>Nome:</strong> {disciplina.nome}</p>
          <p><strong>Código:</strong> {disciplina.codigo}</p>
          <p><strong>Curso:</strong> {disciplina.cursoNome || "Nenhum"}</p>
          <p><strong>Monitor:</strong> {disciplina.monitorNome || "Nenhum"}</p>

          <button onClick={() => editarDisciplina(disciplina)}>
            Editar
          </button>

          <button
            onClick={() => deletarDisciplina(disciplina.id)}
            style={{ marginLeft: "10px" }}
          >
            Deletar
          </button>
        </div>
      ))}
    </div>
  );
}