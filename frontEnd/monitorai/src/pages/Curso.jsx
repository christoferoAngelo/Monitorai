import { useEffect, useState } from "react";
import axios from "axios";

export default function Curso() {
  const [cursos, setCursos] = useState([]);
  const [nome, setNome] = useState("");
  const [editandoId, setEditandoId] = useState(null);

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

  //oi//
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
            onClick={() => deletarCurso(curso.id)}
            style={{ marginLeft: "10px" }}
          >
            Deletar
          </button>
        </div>
      ))}
    </div>
  );
}