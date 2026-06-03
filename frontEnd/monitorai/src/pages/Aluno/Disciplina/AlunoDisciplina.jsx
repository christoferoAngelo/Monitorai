import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import './AlunoDisciplina.css';
import {
  FaHeart,
  FaRegHeart,
  FaBookmark,
  FaRegBookmark,
  FaComment
} from "react-icons/fa";

function AlunoDisciplina() {
  const { id } = useParams(); // Pega o ID da disciplina na URL
  const navigate = useNavigate();
  
  const [disciplina, setDisciplina] = useState(null);
  const [materiais, setMateriais] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados dos filtros (Idêntico ao do GerenciarRecursos)
  const [termoBusca, setTermoBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('TODOS');
  const [ordenacao, setOrdenacao] = useState('recente'); // 'recente' ou 'antigo'

  // cons dos cards
  const [curtidos, setCurtidos] = useState([]);
  const [salvos, setSalvos] = useState([]);

  useEffect(() => {
    // Busca a disciplina e os materiais dela ao mesmo tempo
    const carregarDados = async () => {
      try {
        const [discRes, matRes] = await Promise.all([
          api.get(`/disciplinas/${id}`),
          api.get(`/materiais/disciplina/${id}`) // <--- Chama a nova rota do backend!
        ]);
        
        setDisciplina(discRes.data);
        setMateriais(matRes.data);
        const curtidosUsuario = matRes.data
        .filter(m => m.curtidoPorMim)
        .map(m => m.id);

        setCurtidos(curtidosUsuario);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [id]);

  // Lógica de filtragem (O "filtro dinâmico" do Monitor)
  const materiaisFiltrados = materiais.filter((item) => {
    const atendeBusca = item.titulo.toLowerCase().includes(termoBusca.toLowerCase()) || 
                        (item.conteudo && item.conteudo.toLowerCase().includes(termoBusca.toLowerCase()));
    const atendeTipo = filtroTipo === 'TODOS' || item.tipo === filtroTipo;
    
    return atendeBusca && atendeTipo;
  }).sort((a, b) => {
    return ordenacao === 'recente' ? b.id - a.id : a.id - b.id;
  });

  // Função auxiliar para definir o ícone correto na listagem
  const renderizarIconeTipo = (tipo) => {
    if (tipo === 'DOCUMENTO') return '📄';
    if (tipo === 'QUIZ' || tipo === 'QUIZZ') return '🧩';
    if (tipo === 'VIDEO') return '▶️';
    return '📁';
  };

  const toggleCurtida = async(id)=>{

    const res = await api.post(
        `/materiais/${id}/curtir`
    );

    setMateriais(prev =>
        prev.map(material =>

            material.id === id
            ? {
                ...material,
                curtidas: res.data.curtidas,
                curtido: res.data.curtido
              }
            : material
        )
    );
};

  const toggleSalvo = (id) => {
    setSalvos(prev =>
      prev.includes(id)
      ? prev.filter(item => item !== id)
      : [...prev, id]
    );
  };

  if (loading) return <div className="loading">Carregando detalhes da disciplina...</div>;
  if (!disciplina) return <div className="error-message">Disciplina não encontrada.</div>;

  return (
    <div className="disciplina-detalhe-container">
      {/* Cabeçalho superior */}
      <header className="disciplina-detalhe-header">
        <div className="header-title-row">
          <h1>{disciplina.nome}</h1>
          {disciplina.codigo && <span className="detalhe-code">{disciplina.codigo}</span>}
        </div>
      </header>

      {/* Grid Layout Dividido (Esquerda: Materiais | Direita: Infos) */}
      <div className="disciplina-detalhe-layout">
        
        {/* COLUNA ESQUERDA: LISTA DE MATERIAIS */}
        <main className="layout-principal-materiais">
          <section className="repositorio-card">
            <div className="repositorio-header">
              <h2>📚 Materiais de Estudo</h2>
              <p>Explore os PDFs, vídeos e quizzes postados pelo monitor.</p>
            </div>

            {/* BARRA DE FILTROS E PESQUISA */}
            <div className="filtros-container">
              <input 
                type="text" 
                placeholder="🔍 Buscar por título ou descrição..." 
                className="input-busca"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
              
              <select 
                className="select-filtro" 
                value={filtroTipo} 
                onChange={(e) => setFiltroTipo(e.target.value)}
              >
                <option value="TODOS">Todos os tipos</option>
                <option value="DOCUMENTO">📄 PDFs</option>
                <option value="QUIZ">🧩 Quizzes</option>
                <option value="VIDEO">▶️ Vídeos</option>
              </select>

              <select 
                className="select-filtro" 
                value={ordenacao} 
                onChange={(e) => setOrdenacao(e.target.value)}
              >
                <option value="recente">Mais recentes</option>
                <option value="antigo">Mais antigos</option>
              </select>
            </div>

            {/* LISTAGEM DOS MATERIAIS FILTRADOS */}
            <div className="materiais-grid">
              {materiaisFiltrados.length === 0 ? (
                <p className="materiais-vazio">Nenhum material encontrado com esses filtros.</p>
              ) : materiaisFiltrados.map((material) => (
                <div key={material.id} className="material-card">
                  
                  {/* Header com Badge */}
                  <div className="material-card-header">
                    <div className="material-tipo-badge">
                      {renderizarIconeTipo(material.tipo)} {material.tipo === 'DOCUMENTO' ? 'PDF' : material.tipo}
                    </div>
                  </div>

                  <h4>{material.titulo}</h4>
                  {material.conteudo && <p>{material.conteudo}</p>}
                  
                  <div className="material-actions">


  <div className="material-footer">

    <div className="material-actions">

        <button
            className={`icon-btn like-btn ${
                material.curtido ? "active" : ""
            }`}
            onClick={() => toggleCurtida(material.id)}
        >
            <FaHeart />

        <span className="curtidas-count">
            {material.curtidas}
        </span>
        
        </button>


        <button className="icon-btn">
            <FaRegBookmark />
        </button>

        <button className="icon-btn">
            <FaComment />
        </button>

    </div>

    <a
        href={material.url}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-acessar-material"
    >
        Acessar Material 🔗
    </a>

</div>

</div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* COLUNA DIREITA: INFORMAÇÕES */}
        <aside className="layout-lateral-infos">
          <div className="info-geral-card">
            <h3>📋 Detalhes Acadêmicos</h3>
            <div className="info-divider"></div>
            
            <div className="info-row">
              <strong>Monitor Responsável:</strong>
              <span>{disciplina.monitorNome || "Nenhum monitor alocado"}</span>
            </div>
            
            <div className="info-row">
              <strong>Curso(s):</strong>
              <span>
                {disciplina.cursosNomes && disciplina.cursosNomes.length > 0 
                  ? disciplina.cursosNomes.join(" | ") 
                  : "Grade Geral"}
              </span>
            </div>
          </div>

          <div className="card-placeholder-futuro">
            <h3>📅 Agenda de Monitorias</h3>
            <p>Área reservada para você verificar os dias de atendimento e reservar seu horário de dúvidas.</p>
          </div>
        </aside>

      </div>
    </div>
  );
}

export default AlunoDisciplina;