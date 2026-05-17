import { useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../../services/api'; // <-- Mesmo import que você usa na tela de vídeos
import './GerenciarRecursos.css';

export default function GerenciarRecursos() {
  //const navigate = useNavigate();

  // Controle de Abas: 'pdf' ou 'quizz'
  const [abaAtiva, setAbaAtiva] = useState('pdf');

  // Estados dos campos - Seguindo exatamente os mesmos nomes que funcionam no seu form de vídeo
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [url, setUrl] = useState(''); 
  
  // Estado para o arquivo físico do PDF
  const [arquivoPdf, setArquivoPdf] = useState(null);
  const [carregando, setCarregando] = useState(false);

  // Configurações do seu Cloudinary
  const CLOUD_NAME = "dglfyhzto"; 
  const UPLOAD_PRESET = "eva_monitorai"; // Coloque o seu preset Unsigned aqui!

  /**
   * Upload para o Cloudinary (Igual ao fluxo de imagem/mídia que roda no front)
   */
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

  /**
   * Salvar Recurso - Segue a exata lógica de envio do botão de vídeo
   */
  const handleSalvarRecurso = async (e) => {
    e.preventDefault();
    setCarregando(true);

    try {
      let urlFinal = url;

      // Se for PDF, faz o upload primeiro para conseguir a URL string igual à do vídeo
      if (abaAtiva === 'pdf') {
        if (!arquivoPdf) {
          alert("Por favor, selecione um arquivo PDF!");
          setCarregando(false);
          return;
        }
        urlFinal = await fazerUploadCloudinary(arquivoPdf);
      }

      // Monta o payload exatamente igual ao formato aceito no salvarVideo
      const dadosMaterial = {
        titulo: titulo,
        conteudo: conteudo,
        url: urlFinal
      };

      // Dispara para o endpoint correto usando a instância 'api' que já tem o token salvo
      if (abaAtiva === 'pdf') {
        await api.post('/materiais/pdf', dadosMaterial);
        alert("Material em PDF publicado com sucesso!");
      } else {
        await api.post('/materiais/quizz', dadosMaterial);
        alert("Quizz publicado com sucesso!");
      }

      // Limpa o formulário após o sucesso
      setTitulo('');
      setConteudo('');
      setUrl('');
      setArquivoPdf(null);
      
    } catch (error) {
      console.error("Erro ao salvar o recurso:", error);
      // Se o backend devolver uma mensagem de erro, mostra ela no alert para sabermos o que foi
      if (error.response && error.response.data) {
        alert(`Erro do servidor: ${JSON.stringify(error.response.data)}`);
      } else {
        alert("Ocorreu um erro ao salvar o material. Verifique o console.");
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="recursos-container">
      <header className="recursos-header">
        <h2>Gerenciamento de Materiais Complementares</h2>
        <p>Publique questionários ou arquivos de revisão diretamente para a sua turma.</p>
      </header>

      <nav className="recursos-abas-nav">
        <button 
          type="button"
          className={`aba-btn ${abaAtiva === 'pdf' ? 'ativa' : ''}`}
          onClick={() => { setAbaAtiva('pdf'); setUrl(''); }}
        >
          📄 Upload de PDF
        </button>
        <button 
          type="button"
          className={`aba-btn ${abaAtiva === 'quizz' ? 'ativa' : ''}`}
          onClick={() => { setAbaAtiva('quizz'); setArquivoPdf(null); }}
        >
          🧩 Inserir Quizz / Link
        </button>
      </nav>

      <div className="recursos-card-form">
        <h3>{abaAtiva === 'pdf' ? "Novo Arquivo de Apoio (PDF)" : "Novo Link de Questionário"}</h3>
        
        <form onSubmit={handleSalvarRecurso} className="recursos-form">
          <div className="recursos-group">
            <label>Título do Material</label>
            <input 
              type="text" 
              placeholder={abaAtiva === 'pdf' ? "Ex: Lista de Exercícios - Álgebra" : "Ex: Simulado para a P1"}
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>

          <div className="recursos-group">
            <label>Descrição / Instruções (Opcional)</label>
            <textarea 
              placeholder="Adicione observações importantes sobre como utilizar este conteúdo..."
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              rows="3"
            />
          </div>

          {abaAtiva === 'pdf' ? (
            <div className="recursos-group">
              <label>Selecione o Arquivo PDF</label>
              <div className="file-upload-wrapper">
                <input 
                  type="file" 
                  accept="application/pdf"
                  onChange={(e) => setArquivoPdf(e.target.files[0])}
                  id="pdf-file-input"
                />
                <label htmlFor="pdf-file-input" className="file-upload-label">
                  {arquivoPdf ? `📁 ${arquivoPdf.name}` : "Clique aqui para escolher o arquivo PDF"}
                </label>
              </div>
            </div>
          ) : (
            <div className="recursos-group">
              <label>URL do Quizz / Formulário</label>
              <input 
                type="url" 
                placeholder="https://forms.gle/... ou link do Kahoot"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required={abaAtiva === 'quizz'}
              />
            </div>
          )}

          <button 
            type="submit" 
            className="recursos-btn-submit"
            disabled={carregando}
          >
            {carregando ? "Processando e Salvando..." : abaAtiva === 'pdf' ? "🚀 Publicar PDF" : "🚀 Publicar Quizz"}
          </button>
        </form>
      </div>
    </div>
  );
}