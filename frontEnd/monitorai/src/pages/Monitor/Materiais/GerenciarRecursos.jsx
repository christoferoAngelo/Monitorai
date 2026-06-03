import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '/src/services/api';
import './GerenciarRecursos.css';

export default function GerenciarRecursos() {
  const navigate = useNavigate();

  // Estados do formulário
  const [formAberto, setFormAberto] = useState(false); // 🔥 Controla se o form está visível
  const [abaAtiva, setAbaAtiva] = useState('pdf'); // 'pdf', 'quizz', 'video'
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [url, setUrl] = useState('');
  const [arquivoPdf, setArquivoPdf] = useState(null);
  const [carregando, setCarregando] = useState(false);
  
  // Estado da listagem
  const [meusMateriais, setMeusMateriais] = useState([]);

  const CLOUD_NAME = "dk7bgyams";
  const UPLOAD_PRESET = "ml_unsigned";

  const [termoBusca, setTermoBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('TODOS');
  const [ordenacao, setOrdenacao] = useState('recente'); // 'recente' ou 'antigo'

  // Lógica de filtragem (O "filtro dinâmico")
  const materiaisFiltrados = meusMateriais.filter((item) => {
    const atendeBusca = item.titulo.toLowerCase().includes(termoBusca.toLowerCase());
    const atendeTipo = filtroTipo === 'TODOS' || item.tipo === filtroTipo;
    return atendeBusca && atendeTipo;
  }).sort((a, b) => {
      return ordenacao === 'recente' ? b.id - a.id : a.id - b.id;
    });

  // Busca os materiais do monitor ao carregar a tela
  useEffect(() => {
    carregarMeusMateriais();
  }, []);

  const carregarMeusMateriais = async () => {
    try {
      const resposta = await api.get('/materiais/meus');
      setMeusMateriais(resposta.data);
      console.log("Dados recebidos:", resposta.data);
    } catch (error) {
      console.error("Erro ao buscar materiais:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  const fazerUploadCloudinary = async (arquivo) => {
    const formData = new FormData();
    formData.append("file", arquivo);
    formData.append("upload_preset", UPLOAD_PRESET);

    const resposta = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return resposta.data.secure_url;
  };

  const handleExcluir = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este material?")) {
      try {
        await api.delete(`/materiais/${id}`);
        // Atualiza a lista removendo o item que foi deletado
        carregarMeusMateriais(); 
        alert("Material excluído!");
      } catch (error) {
        alert("Erro ao excluir material.");
      }
    }
  };

  const handleSalvarRecurso = async (e) => {
    e.preventDefault();
    setCarregando(true);

    try {
      let urlFinal = url;

      if (abaAtiva === 'pdf') {
        if (!arquivoPdf) {
          alert("Por favor, selecione um arquivo PDF!");
          setCarregando(false);
          return;
        }
        
        let urlObtida = await fazerUploadCloudinary(arquivoPdf);
        
        // 🔥 O TRUQUE DE OURO AQUI:
        // Removemos qualquer extensão errada que o Cloudinary mande (ex: .png, .webp) 
        // e colamos um .pdf no final da URL
        if (urlObtida.includes('.')) {
          urlObtida = urlObtida.substring(0, urlObtida.lastIndexOf('.')) + '.pdf';
        } else {
          urlObtida = urlObtida + '.pdf';
        }

        urlFinal = urlObtida;
      }

      const dadosMaterial = {
        titulo: titulo,
        conteudo: conteudo,
        url: urlFinal
      };

      // Dispara para a rota correta baseada na aba ativa
      if (abaAtiva === 'pdf') {
        await api.post('/materiais/pdf', dadosMaterial);
        alert("Material em PDF publicado com sucesso!");
      } else if (abaAtiva === 'quizz') {
        await api.post('/materiais/quizz', dadosMaterial);
        alert("Quizz publicado com sucesso!");
      } else if (abaAtiva === 'video') {
        await api.post('/materiais/video', dadosMaterial);
        alert("Vídeo publicado com sucesso!");
      }

      // Limpa os campos e esconde o form após salvar
      setTitulo('');
      setConteudo('');
      setUrl('');
      setArquivoPdf(null);
      setFormAberto(false); 
      
      // Atualiza a lista de materiais automaticamente
      carregarMeusMateriais();

    } catch (error) {
      console.error("Erro ao salvar:", error);
      if (error.response && error.response.data) {
        alert(`Erro do servidor: ${JSON.stringify(error.response.data)}`);
      } else {
        alert("Erro ao salvar material.");
      }
    } finally {
      setCarregando(false);
    }
  };

  // Função auxiliar para definir o ícone correto na listagem
  const renderizarIconeTipo = (tipo) => {
    if (tipo === 'DOCUMENTO') return '📄';
    if (tipo === 'QUIZZ' || tipo === 'QUIZZ') return '🧩';
    if (tipo === 'VIDEO') return '▶️';
    return '📁';
  };

  return (
    <div className="recursos-container">
      <header className="recursos-header-principal">
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem' }}>👨‍🏫 Gerenciar Recursos</h1>
          <p style={{ margin: '0.25rem 0 0 0', opacity: 0.9 }}>
            Publique e gerencie os materiais da sua turma
          </p>
        </div>
      </header>

      {/* ✅ BARRA DE AÇÕES (Botão de Novo Material) */}
      <div className="recursos-acoes">
        <h2>Meus Materiais Publicados</h2>
        <button 
          className={`btn-toggle-form ${formAberto ? 'fechar' : 'abrir'}`}
          onClick={() => setFormAberto(!formAberto)}
        >
          {formAberto ? '❌ Cancelar Publicação' : '➕ Novo Material'}
        </button>
      </div>

      {/* ✅ FORMULÁRIO COLAPSÁVEL */}
      {formAberto && (
        <div className="recursos-card-form animacao-deslizar">
          <nav className="recursos-abas-nav">
            <button
              className={`aba-btn ${abaAtiva === 'pdf' ? 'ativa' : ''}`}
              onClick={() => { setAbaAtiva('pdf'); setUrl(''); }}
            >
              📄 Upload de PDF
            </button>
            <button
              className={`aba-btn ${abaAtiva === 'quizz' ? 'ativa' : ''}`}
              onClick={() => { setAbaAtiva('quizz'); setArquivoPdf(null); }}
            >
              🧩 Link de Quizz
            </button>
            <button
              className={`aba-btn ${abaAtiva === 'video' ? 'ativa' : ''}`}
              onClick={() => { setAbaAtiva('video'); setArquivoPdf(null); }}
            >
              ▶️ Vídeo YouTube
            </button>
          </nav>

          <h3>
            {abaAtiva === 'pdf' && "Novo Arquivo de Apoio (PDF)"}
            {abaAtiva === 'quizz' && "Novo Link de Questionário"}
            {abaAtiva === 'video' && "Novo Link de Vídeo"}
          </h3>

          <form onSubmit={handleSalvarRecurso} className="recursos-form">
            <div className="recursos-group">
              <label>Título do Material <span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                placeholder={
                  abaAtiva === 'pdf' ? "Ex: Lista de Exercícios - Álgebra" : 
                  abaAtiva === 'quizz' ? "Ex: Simulado para a P1" : 
                  "Ex: Aula de Revisão - YouTube"
                }
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>

            <div className="recursos-group">
              <label>Descrição (Opcional)</label>
              <textarea
                placeholder="Orientações para os alunos..."
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)}
                rows="3"
              />
            </div>

            {abaAtiva === 'pdf' ? (
              <div className="recursos-group">
                <label>Arquivo PDF <span style={{ color: 'red' }}>*</span></label>
                <div className="file-upload-wrapper">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setArquivoPdf(e.target.files[0])}
                    id="pdf-file-input"
                    required
                  />
                  <label htmlFor="pdf-file-input" className="file-upload-label">
                    {arquivoPdf ? `📁 ${arquivoPdf.name}` : "Escolha o arquivo PDF"}
                  </label>
                </div>
              </div>
            ) : (
              <div className="recursos-group">
                <label>
                  {abaAtiva === 'video' ? 'Link do YouTube' : 'URL do Quizz'} <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="url"
                  placeholder={abaAtiva === 'video' ? "https://youtube.com/watch?v=..." : "https://forms.gle/..."}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </div>
            )}

            <button type="submit" className="recursos-btn-submit" disabled={carregando}>
              {carregando ? "⏳ Publicando..." : "🚀 Publicar Material"}
            </button>
          </form>
        </div>
      )}

      {/* ✅ BARRA DE FILTROS E PESQUISA */}
      <div className="filtros-container">
        <input 
          type="text" 
          placeholder="🔍 Buscar por título..." 
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
          <option value="QUIZZ">🧩 Quizzes</option>
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

      {/* ✅ LISTAGEM DOS MATERIAIS (Agora usando materiaisFiltrados) */}
      <div className="materiais-grid">
        {materiaisFiltrados.length === 0 ? (
          <p className="materiais-vazio">Nenhum material encontrado com esses filtros.</p>
        ) : materiaisFiltrados.map((material) => (
        <div key={material.id} className="material-card">
          
          {/* ✅ Header com Badge e Botão de Excluir */}
          <div className="material-card-header">
            <div className="material-tipo-badge">
              {renderizarIconeTipo(material.tipo)} {material.tipo}
            </div>
            <button 
              className="btn-excluir-icon" 
              onClick={() => handleExcluir(material.id)}
              title="Excluir material"
            >
              <img src="/excluir.png" alt="Excluir" />
            </button>
          </div>

          <h4>{material.titulo}</h4>
          {material.conteudo && <p>{material.conteudo}</p>}
          <a href={material.url} target="_blank" rel="noopener noreferrer" className="btn-acessar-material">
            Acessar Material 🔗
          </a>
        </div>
      ))}
      </div>
    </div>
  );
}