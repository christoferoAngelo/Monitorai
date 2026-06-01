import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './AlunoDashboard.css';

function AlunoDashboard() {
  const [usuario, setUsuario] = useState(null);
  // Renomeamos de disciplinas para monitorias para fazer mais sentido com a nova busca
  const [monitorias, setMonitorias] = useState([]); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [userRes, monitoriasRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/monitorias/ativas') // Buscando da rota correta de monitorias do seu Controller
        ]);
        
        setUsuario(userRes.data);
        setMonitorias(monitoriasRes.data);
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

        <div className="hero-section">
          <div className="cartinhas" style={{ position: 'relative', zIndex: 1 }}>
            <div>
              <h2>Explore seus materiais acadêmicos</h2>
              <p>
                Selecione uma disciplina abaixo para acessar os conteúdos e agendar monitorias.
              </p>
            </div>

            {monitorias.length === 0 ? (
              <p className="no-data-text">Nenhuma monitoria disponível no momento.</p>
            ) : (
              <div className="cards-grid">
                {/* Agora fazemos o map em monitorias */}
                {monitorias.map((monitoria) => (
                  <div 
                    key={monitoria.id} 
                    className="card disciplina-card-aluno" 
                    // Se você quiser manter a navegação pelo ID da disciplina:
                    onClick={() => navigate(`/disciplina/${monitoria.disciplina?.id}`)}
                  >
                    <div className="disciplina-card-header">
                      {/* Pegamos o nome direto do objeto disciplina aninhado na monitoria */}
                      <h4>{monitoria.disciplina?.nome}</h4>
                      {monitoria.disciplina?.codigo && (
                        <span className="disciplina-code">{monitoria.disciplina.codigo}</span>
                      )}
                    </div>
                    
                    <div className="disciplina-card-body">
                      <p>
                        {/* Acessamos a relação: Monitoria -> Monitor -> Usuario -> username/nome */}
                        <strong>Monitor:</strong> {monitoria.monitor?.usuario?.username || "Sem monitor atribuído"}
                      </p>
                      <p>
                        <strong>Cursos:</strong> {monitoria.cursosNomes && monitoria.cursosNomes.length > 0 
                          ? monitoria.cursosNomes.join(" | ") 
                          : (monitoria.disciplina?.cursosNomes && monitoria.disciplina.cursosNomes.length > 0 
                              ? monitoria.disciplina.cursosNomes.join(" | ") 
                              : "Geral")}
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