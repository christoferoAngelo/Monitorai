import { useEffect, useState } from "react";
import axios from "axios";
import "./Curso.css";

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

        alert("Curso updated!");
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

	    console.log("RESPOSTA DO BACKEND:", response.data);

	    setDisciplinas(response.data);
	    setCursoSelecionado(curso);

	  } catch (error) {
	    console.error("Erro ao carregar disciplinas:", error);
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
    <div className="curso-container">
      <header className="curso-header">
        <h1>CRUD Cursos</h1>
      </header>

      <div className="cadastro-box">
        <form onSubmit={salvarCurso}>
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="Nome do curso"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-success">
            {editandoId ? "Atualizar" : "Criar"}
          </button>
        </form>
      </div>

      <hr />
	  
      <section className="acoes-bar">
        <input
          type="text"
          className="input-busca"
          placeholder="Filtrar por nome"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />

        <button onClick={filtrarCursos} className="btn-primary">
          Filtrar
        </button>

        <button onClick={carregarCursos} className="btn-secondary">
          Limpar
        </button>
      </section>

	  <br />

      <h2>Lista de Cursos</h2>

      <div className="grid-cards">
        {cursos.map((curso) => (
          <div key={curso.id} className="card-curso">
            <div>
              <header className="card-header">
                <h3>{curso.nome}</h3>
                <span className="card-id">ID: {curso.id}</span>
              </header>
              <div className="card-body">
                <p><strong>Código:</strong> {curso.codigo}</p>
              </div>
            </div>

            <footer className="card-footer">
              <button onClick={() => editarCurso(curso)} className="btn-primary">
                Editar
              </button>
              
              <button onClick={() => abrirCurso(curso)} className="btn-secondary">
                Ver Disciplinas
              </button>

              <button onClick={() => deletarCurso(curso.id)} className="btn-danger">
                Deletar
              </button>
            </footer>
          </div>
        ))}
      </div>
	  
	  <hr />

	  {
	    cursoSelecionado && (
	      <div className="disciplinas-panel">
	        <h2>
	          Disciplinas de: <span style={{ color: "#28a745" }}>{cursoSelecionado.nome}</span>
	        </h2>

	        <div className="disciplinas-grid">
	          {
	            disciplinas.map((disciplina) => (
	              <div key={disciplina.id} className="mini-card-disciplina">
	                <p>
	                  <strong>Nome:</strong>
	                  {" "}
	                  {disciplina.nome}
	                </p>

	                <p style={{ color: "#666", fontSize: "12px" }}>
	                  <strong>Código:</strong>
	                  {" "}
	                  {disciplina.codigo}
	                </p>
	              </div>
	            ))
	          }
	        </div>
	      </div>
	    )
	  }
	  
    </div>
  );
}