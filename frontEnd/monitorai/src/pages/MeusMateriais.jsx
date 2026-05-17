import { useState, useEffect } from 'react';
import api from '../services/api';

function MeusMateriais() {
  const [materiais, setMateriais] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. CARREGAR MATERIAIS DO BANCO AO ENTRAR NA TELA (Evita o sumiço no F5)
  useEffect(() => {
    api.get('/materiais/meus')
      .then(res => {
        setMateriais(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar materiais:", err);
        setLoading(false);
      });
  }, []);

  const getYouTubeEmbedUrl = (urlStr) => {
    try {
      const urlObj = new URL(urlStr);
      let videoId = '';
      if (urlObj.hostname.includes('youtube.com')) {
        videoId = urlObj.searchParams.get('v');
      } else if (urlObj.hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.slice(1);
      }
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      return null;
    }
  };

  // 2. SALVAR DE VERDADE NO BANCO VIA API
  const handleCadastrarMaterial = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.post('/materiais', {
        titulo,
        conteudo,
        url
      });
      
      // Adiciona o material retornado do banco na lista da tela
      setMateriais([...materiais, response.data]);
      
      // Limpa os campos
      setTitulo(''); 
      setConteudo(''); 
      setUrl('');
      alert('Vídeo publicado com sucesso!');
    } catch (error) {
      console.error("Erro ao salvar material:", error);
      alert('Erro ao salvar o material no banco de dados.');
    }
  };

  if (loading) return <p>Carregando seus materiais...</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Meus Materiais (Área do Monitor)</h2>

      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '30px' }}>
        <h3>Adicionar Novo Vídeo</h3>
        <form onSubmit={handleCadastrarMaterial} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
          <input 
            type="text" placeholder="Título da Aula" required 
            value={titulo} onChange={(e) => setTitulo(e.target.value)} 
            style={{ padding: '8px' }}
          />
          <textarea 
            placeholder="Breve descrição (opcional)" 
            value={conteudo} onChange={(e) => setConteudo(e.target.value)} 
            style={{ padding: '8px' }}
          />
          <input 
            type="url" placeholder="Link do YouTube" required 
            value={url} onChange={(e) => setUrl(e.target.value)} 
            style={{ padding: '8px' }}
          />
          <button type="submit" style={{ padding: '10px', backgroundColor: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Postar Vídeo
          </button>
        </form>
      </div>

      <h3>Vídeos Publicados</h3>
      {materiais.length === 0 ? (
        <p>Você ainda não publicou nenhum material.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {materiais.map((mat) => {
            const embedUrl = getYouTubeEmbedUrl(mat.url);
            return (
              <div key={mat.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', backgroundColor: '#f9f9f9' }}>
                <h4 style={{ margin: '0 0 10px 0' }}>{mat.titulo}</h4>
                {embedUrl ? (
                  <iframe 
                    width="100%" height="200" src={embedUrl} title={mat.titulo}
                    frameBorder="0" allowFullScreen style={{ borderRadius: '4px' }}
                  ></iframe>
                ) : (
                  <a href={mat.url} target="_blank" rel="noopener noreferrer">Link Externo</a>
                )}
                <p style={{ fontSize: '14px', color: '#555', marginTop: '10px' }}>{mat.conteudo}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MeusMateriais;