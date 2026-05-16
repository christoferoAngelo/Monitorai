/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import axios from "axios";
import "./Disciplina.css";


export default function Disciplina() {
  // Controle de Abas ("listar" ou "criar")
  const [abaAtiva, setAbaAtiva] = useState("listar");

  const [disciplinas, setDisciplinas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [monitores, setMonitores] = useState([]);

  // Estados dos formulários
  const [nome, setNome] = useState("");
  const [codigo, setCodigo] = useState("");
  const [cursosIds, setCursosIds] = useState([]);
  const [monitorId, setMonitorId] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  const API = "http://localhost:8080/disciplinas";
  const API_CURSOS = "http://localhost:8080/cursos";
  const API_MONITORES = "http://localhost:8080/disciplinas/monitores";

  async function carregarDados() {
    try {
      const [disciplinasRes, cursosRes, monitoresRes] = await Promise.all([
        axios.get(API),
        axios.get(API_CURSOS),
        axios.get(API_MONITORES)
      ]);
      setDisciplinas(disciplinasRes.data);
      setCursos(cursosRes.data);
      setMonitores(monitoresRes.data);
    } catch (error) {
      console.error("Erro ao carregar ecossistema de dados:", error);
    }
  }
  
  useEffect(() => {
    carregarDados();
  }, []);

  function handleCursoCheckboxChange(cursoId) {
    if (cursosIds.includes(cursoId)) {
      setCursosIds(cursosIds.filter(id => id !== cursoId));
    } else {
      setCursosIds([...cursosIds, cursoId]);
    }
  }

  // Ação de Cadastrar uma Nova Disciplina (Sem vincular na hora se não quiser)
  async function cadastrarNova(e) {
    e.preventDefault();
    const dados = { nome, codigo: null, cursosIds: [], monitorId: null };
    
    try {
      await axios.post(API, dados);
      alert("Nova disciplina criada com sucesso!");
      limparFormulario();
      carregarDados();
      setAbaAtiva("listar"); // Volta para a listagem para vincular
    } catch (error) {
      console.error("Erro ao criar disciplina:", error);
    }
  }

  // Ação de Salvar Alterações de Vínculo
  async function salvarVinculos(e) {
    e.preventDefault();
    const dados = {
      nome,
      codigo,
      cursosIds,
      monitorId: monitorId ? Number(monitorId) : null,
    };

    try {
      await axios.put(`${API}/${editandoId}`, dados);
      alert("Vínculos atualizados com sucesso!");
      limparFormulario();
      carregarDados();
    } catch (error) {
      console.error("Erro ao atualizar vínculos:", error);
    }
  }

  // Prepara o formulário de alteração na mesma tela
  function prepararEdicaoVinculo(disciplina) {
    setEditandoId(disciplina.id);
    setNome(disciplina.nome);
    setCodigo(disciplina.codigo);
    setCursosIds(disciplina.cursosIds || []);
    setMonitorId(disciplina.monitorId || "");
  }

  async function deletarDisciplina(id) {
    if (!window.confirm("Deseja realmente excluir esta disciplina?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      alert("Disciplina removida do sistema!");
      carregarDados();
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  }

  function limparFormulario() {
    setNome("");
    setCodigo("");
    setCursosIds([]);
    setMonitorId("");
    setEditandoId(null);
  }

  return (
    <div className="disciplina-container">
      
      <header className="disciplina-header">
        <h1>Matriz de Disciplinas</h1>
        <p>Gerencie o ciclo de vida das disciplinas e suas distribuições nos cursos</p>
      </header>

      {/* Navegação por Abas */}
      <nav className="tabs-container">
        <button 
          className={`tab-btn ${abaAtiva === "listar" && !editandoId ? "active" : ""}`}
          onClick={() => { setAbaAtiva("listar"); limparFormulario(); }}
        >
          Listar Disciplinas & Vínculos
        </button>
        <button 
          className={`tab-btn ${abaAtiva === "criar" ? "active" : ""}`}
          onClick={() => { setAbaAtiva("criar"); limparFormulario(); }}
        >
          Criar Nova Disciplina
        </button>
        {editandoId && (
          <button className="tab-btn active">
            Alterando Vínculos de: {nome}
          </button>
        )}
      </nav>

      {/* CONTEÚDO DINÂMICO BASEADO NAS ABAS */}
      <main className="content-section">
        
        {/* CASO 1: Formulário de Nova Disciplina */}
        {abaAtiva === "criar" && !editandoId && (
          <div className="cadastro-box">
            <h2>Cadastrar Disciplina Básica</h2>
            <form onSubmit={cadastrarNova}>
              <div className="form-group">
                <label>Nome da Disciplina:</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Banco de Dados I"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-primary">Criar Registro</button>
            </form>
          </div>
        )}

        {/* CASO 2: Formulário de Edição de Vínculos Ativo */}
        {editandoId && (
          <div className="cadastro-box">
            <h2>Gerenciar Vínculos da Grade</h2>
            <form onSubmit={salvarVinculos}>
              <div className="form-group">
                <label>Nome da Disciplina (Altera o cadastro principal):</label>
                <input
                  type="text"
                  className="form-input"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Selecione os Cursos que possuem esta matéria:</label>
                <fieldset className="fieldset-cursos">
                  {cursos.map((curso) => (
                    <div key={curso.id} className="checkbox-group">
                      <input
                        type="checkbox"
                        id={`edit-curso-${curso.id}`}
                        value={curso.id}
                        checked={cursosIds.includes(curso.id)}
                        onChange={() => handleCursoCheckboxChange(curso.id)}
                      />
                      <label htmlFor={`edit-curso-${curso.id}`}>{curso.nome}</label>
                    </div>
                  ))}
                </fieldset>
              </div>

              <div className="form-group">
                <label>Atribuir Monitor:</label>
                <select
                  className="form-select"
                  value={monitorId}
                  onChange={(e) => setMonitorId(e.target.value)}
                >
                  <option value="">Sem monitor atribuído</option>
                  {monitores.map((m) => (
                    <option key={m.id} value={m.id}>{m.username}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" className="btn-primary">Atualizar Grade</button>
                <button type="button" className="btn-secondary" onClick={limparFormulario}>Cancelar</button>
              </div>
            </form>
          </div>
        )}

        {/* CASO 3: Listagem Geral das Disciplinas Cadastradas */}
        {abaAtiva === "listar" && !editandoId && (
          <div>
            {disciplinas.length === 0 ? (
              <p className="no-data">Nenhuma disciplina cadastrada no sistema.</p>
            ) : (
              <div className="grid-cards">
                {disciplinas.map((disp) => (
                  <section key={disp.id} className="card-disciplina">
                    <div>
                      <header className="card-header">
                        <h3>{disp.nome}</h3>
                        <span className="card-id">ID: {disp.id}</span>
                      </header>
                      <div className="card-body">
                        <p><strong>Código:</strong> {disp.codigo}</p>
                        <p>
                          <strong>Curso(s) Vinculado(s):</strong>{" "}
                          {disp.cursosNomes && disp.cursosNomes.length > 0 
                            ? disp.cursosNomes.join(" | ") 
                            : "Nenhum"}
                        </p>
                        <p><strong>Monitor:</strong> {disp.monitorNome || "Sem monitor atribuído"}</p>
                      </div>
                    </div>
                    <footer className="card-footer">
                      <button className="btn-secondary" onClick={() => prepararEdicaoVinculo(disp)}>
                        Editar Vínculos
                      </button>
                      <button className="btn-danger" onClick={() => deletarDisciplina(disp.id)}>
                        Deletar
                      </button>
                    </footer>
                  </section>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}