import { useEffect, useState } from "react";
import api from "../services/api"; 

export default function Aluno() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const ENDPOINT = "/usuarios";

  async function carregarUsuarios() {
    try {
      setLoading(true);
      // Usando 'api' ao invés de 'axios'
      const response = await api.get(ENDPOINT);
      setUsuarios(response.data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function fetchUsuarios() {
      await carregarUsuarios();
    }
    fetchUsuarios();
  }, []);

  async function promoverParaMonitor(usuario) {
    try {
      await api.put(`${ENDPOINT}/${usuario.id}`, {
        role: "MONITOR",
      });

      alert("Usuário promovido para MONITOR!");
      carregarUsuarios();
    } catch (error) {
      console.error("Erro ao promover usuário:", error);
      alert("Falha ao promover usuário.");
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Gerenciar Usuários (Alunos / Promover)</h1>

      {loading ? <p>Carregando...</p> : null}

      <hr />

      <h2>Lista de Usuários</h2>

      {usuarios.map((usuario) => (
        <div
          key={usuario.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <p>
            <strong>ID:</strong> {usuario.id}
          </p>
          <p>
            <strong>Username:</strong> {usuario.username}
          </p>
          <p>
            <strong>E-mail:</strong> {usuario.email}
          </p>
          <p>
            <strong>Role:</strong> {usuario.role}
          </p>

          {usuario.role !== "ADMIN" && usuario.role !== "MONITOR" ? (
            <button onClick={() => promoverParaMonitor(usuario)}>
              Promover para MONITOR
            </button>
          ) : (
            <span style={{ fontWeight: 600, color: "#0a7" }}>Impossível promover</span>
          )}
        </div>
      ))}
    </div>
  );
}