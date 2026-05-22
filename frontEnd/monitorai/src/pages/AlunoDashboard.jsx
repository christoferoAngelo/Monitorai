import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './AlunoDashboard.css';

function AlunoDashboard() {
  const [usuario, setUsuario] = useState(null);
  const [disciplinas, setDisciplinas] = useState([]); // Novo estado para as disciplinas
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fazemos as duas requisições ao mesmo tempo para a tela carregar mais rápido
    const carregarDados = async () => {
      try {
        const [userRes, disciplinasRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/disciplinas') // Busca as disciplinas da sua API
        ]);
        
        setUsuario(userRes.data);
        setDisciplinas(disciplinasRes.data);
      } catch (error) {
        console.error("Erro ao carregar dados do painel:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div>
          <h2 className="sidebar-title">🎓 Portal Aluno</h2>

          <div className="sidebar-menu">
            <button className="sidebar-btn" onClick={() => navigate('/disciplinas')}>
              📚 Materiais
            </button>

            <button className="sidebar-btn" onClick={() => navigate('/perfil/salvos')}>
              💾 Meus Salvos
            </button>

            <button className="sidebar-btn" onClick={() => navigate('/perfil')}>
              👤 Meu Perfil
            </button>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Sair
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Bem-vindo, {usuario.username}</h1>
          <p>Seu ambiente de estudos e monitorias.</p>
        </header>

        {/* Hero Section com a lista de disciplinas EMBUTIDA */}
        <div className="hero-section">
          {/* O zIndex garante que o texto e os cards fiquem acima do efeito diagonal de fundo */}
          <div className="cartinhas" style={{ position: 'relative', zIndex: 1 }}>
            <div>
              <h2>Explore seus materiais acadêmicos</h2>
              <p>
                Selecione uma disciplina abaixo para acessar os conteúdos e agendar monitorias.
              </p>
            </div>

            {disciplinas.length === 0 ? (
              <p className="no-data-text">Nenhuma disciplina disponível no momento.</p>
            ) : (
              <div className="cards-grid">
                {disciplinas.map((disp) => (
                  <div 
                    key={disp.id} 
                    className="card disciplina-card-aluno" 
                    onClick={() => navigate(`/disciplina/${disp.id}`)}
                  >
                    <div className="disciplina-card-header">
                      <h4>{disp.nome}</h4>
                      {disp.codigo && <span className="disciplina-code">{disp.codigo}</span>}
                    </div>
                    
                    <div className="disciplina-card-body">
                      <p>
                        <strong>Monitor:</strong> {disp.monitorNome || "Sem monitor atribuído"}
                      </p>
                      <p>
                        <strong>Cursos:</strong> {disp.cursosNomes && disp.cursosNomes.length > 0 
                          ? disp.cursosNomes.join(" | ") 
                          : "Geral"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AlunoDashboard;