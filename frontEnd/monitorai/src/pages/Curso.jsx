import { useEffect, useState } from "react";
import axios from "axios";

export default function Curso() {
  const [cursos, setCursos] = useState([]);
  const [nome, setNome] = useState("");
  const [filtro, setFiltro] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [disciplinas, setDisciplinas] = useState([]);
  const [cursoSelecionado, setCursoSelecionado] = useState(null);


  const API = "http://localhost:8080/cursos";

  // =========================
  // LISTAR CURSOS
  // =========================
  async function carregarCursos() {
	
    try {
      const response = await axios.get(API);
      setCursos(response.data);
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
    }
  }
  
  async function filtrarCursos() {

    try {

      // se o filtro estiver vazio
      if (filtro.trim() === "") {

        carregarCursos();

        return;
      }

      const response = await axios.get(
        `${API}/filtro?nome=${filtro}`
      );

      setCursos(response.data);

    } catch (error) {

      console.error(
        "Erro ao filtrar cursos:",
        error
      );
    }
  }
  

  useEffect(() => {
    async function fetchCursos() {
      await carregarCursos();
    }

    fetchCursos();
  }, []);

  // =========================
  // CRIAR / ATUALIZAR
  // =========================
  async function salvarCurso(e) {
    e.preventDefault();

    try {
      if (editandoId) {
        // UPDATE
        await axios.put(`${API}/${editandoId}`, {
          nome,
        });

        alert("Curso atualizado!");
      } else {
        // CREATE
        await axios.post(API, {
          nome,
        });

        alert("Curso criado!");
      }

      setNome("");
      setEditandoId(null);

      carregarCursos();
    } catch (error) {
      console.error("Erro ao salvar curso:", error);
    }
  }

  // =========================
  // EDITAR
  // =========================
  function editarCurso(curso) {
    setNome(curso.nome);
    setEditandoId(curso.id);
  }
  
  
  
  // =========================
    // ABRIR CURSO
    // =========================
  
  async function abrirCurso(curso) {

    try {

      const response = await axios.get(
        `http://localhost:8080/disciplinas/curso/${curso.id}`
      );

      setDisciplinas(response.data);

      setCursoSelecionado(curso);

    } catch (error) {

      console.error(
        "Erro ao carregar disciplinas:",
        error
      );
    }
  }

  
  // =========================
  // DELETE
  // =========================
  async function deletarCurso(id) {
    try {
      await axios.delete(`${API}/${id}`);

      alert("Curso deletado!");

      carregarCursos();
    } catch (error) {
      console.error("Erro ao deletar curso:", error);
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>CRUD Cursos</h1>

      <form onSubmit={salvarCurso}>
        <input
          type="text"
          placeholder="Nome do curso"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <button type="submit">
          {editandoId ? "Atualizar" : "Criar"}
        </button>
      </form>

      <hr />
	  
	  <input
	    type="text"
	    placeholder="Filtrar por nome"
	    value={filtro}
	    onChange={(e) => setFiltro(e.target.value)}
	  />

	  <button onClick={filtrarCursos}>
	    Filtrar
	  </button>

	  <button onClick={carregarCursos}>
	    Limpar
	  </button>

	  <br />
	  <br />

      <h2>Lista de Cursos</h2>

      {cursos.map((curso) => (
        <div
          key={curso.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <p><strong>ID:</strong> {curso.id}</p>
          <p><strong>Nome:</strong> {curso.nome}</p>
          <p><strong>Código:</strong> {curso.codigo}</p>

          <button onClick={() => editarCurso(curso)}>
            Editar
          </button>
		  
		  <button
		    onClick={() => abrirCurso(curso)}
		    style={{ marginLeft: "10px" }}
		  >
		    Ver Disciplinas
		  </button>

          <button
            onClick={() => deletarCurso(curso.id)}
            style={{ marginLeft: "10px" }}
          >
            Deletar
          </button>
		  
        </div>
      ))}
	  
	  <hr />

	  {
	    cursoSelecionado && (
	      <div>

	        <h2>
	          Disciplinas de {cursoSelecionado.nome}
	        </h2>

	        {
	          disciplinas.map((disciplina) => (

	            <div
	              key={disciplina.id}
	              style={{
	                border: "1px solid #999",
	                padding: "10px",
	                marginBottom: "10px",
	              }}
	            >

	              <p>
	                <strong>Nome:</strong>
	                {" "}
	                {disciplina.nome}
	              </p>

	              <p>
	                <strong>Código:</strong>
	                {" "}
	                {disciplina.codigo}
	              </p>

	            </div>
	          ))
	        }

	      </div>
	    )
	  }
	  
    </div>
  );
}