import { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // ✅ CORRETO
import axios from 'axios';
import api from '../../services/api';
import './GerenciarRecursos.css';

export default function GerenciarRecursos() {
  const navigate = useNavigate();  // ✅ CORRETO

  const [abaAtiva, setAbaAtiva] = useState('pdf');
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [url, setUrl] = useState(''); 
  const [arquivoPdf, setArquivoPdf] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const CLOUD_NAME = "dglfyhzto"; 
  const UPLOAD_PRESET = "eva_monitorai";

  // ✅ FUNÇÃO LOGOUT (MOVER AQUI)
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
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
      formData
    );
    return resposta.data.secure_url; 
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
        urlFinal = await fazerUploadCloudinary(arquivoPdf);
      }

      const dadosMaterial = {
        titulo: titulo,
        conteudo: conteudo,
        url: urlFinal
      };

      if (abaAtiva === 'pdf') {
        await api.post('/materiais/pdf', dadosMaterial);
        alert("Material em PDF publicado com sucesso!");
      } else {
        await api.post('/materiais/quizz', dadosMaterial);
        alert("Quizz publicado com sucesso!");
      }

      setTitulo('');
      setConteudo('');
      setUrl('');
      setArquivoPdf(null);
      
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

  return (
    <div className="recursos-container">
      {/* ✅ HEADER COM LOGOUT (ÚNICO HEADER) */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 2rem',
        background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
        color: 'white',
        borderRadius: '16px',
        marginBottom: '2rem',
        boxShadow: '0 10px 30px rgba(139,92,246,0.3)'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem' }}>👨‍🏫 Gerenciar Recursos</h1>
          <p style={{ margin: '0.25rem 0 0 0', opacity: 0.9 }}>
            Publique PDFs e quizzes para sua turma
          </p>
        </div>
        <button 
          onClick={handleLogout}
          style={{
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.3)',
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: '600',
            backdropFilter: 'blur(10px)'
          }}
        >
          🚪 Sair
        </button>
      </header>

      {/* ✅ NAV DE ABAS */}
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
          🧩 Inserir Quizz / Link
        </button>
      </nav>

      {/* ✅ FORMULÁRIO (SEU CÓDIGO ORIGINAL) */}
      <div className="recursos-card-form">
        <h3>{abaAtiva === 'pdf' ? "Novo Arquivo de Apoio (PDF)" : "Novo Link de Questionário"}</h3>
        
        <form onSubmit={handleSalvarRecurso} className="recursos-form">
          <div className="recursos-group">
            <label>Título do Material <span style={{color: 'red'}}>*</span></label>
            <input 
              type="text" 
              placeholder={abaAtiva === 'pdf' ? "Ex: Lista de Exercícios - Álgebra" : "Ex: Simulado para a P1"}
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
              <label>Arquivo PDF <span style={{color: 'red'}}>*</span></label>
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
              <label>URL do Quizz <span style={{color: 'red'}}>*</span></label>
              <input 
                type="url" 
                placeholder="https://forms.gle/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
          )}

          <button 
            type="submit" 
            className="recursos-btn-submit"
            disabled={carregando}
          >
            {carregando ? "⏳ Publicando..." : `🚀 Publicar ${abaAtiva === 'pdf' ? 'PDF' : 'Quizz'}`}
          </button>
        </form>
      </div>
    </div>
  );
}