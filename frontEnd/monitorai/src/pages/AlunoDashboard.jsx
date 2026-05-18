import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './AlunoDashboard.css';

function AlunoDashboard() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/auth/me').then(res => {
      setUsuario(res.data);
      setLoading(false);
    });
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
        <h2>Explore seus materiais acadêmicos</h2>
        <button className="cta-btn" onClick={() => navigate('/disciplinas')}>
          Acessar disciplinas
        </button>
      </div>

      <div className="cards-grid">
        <div className="card" onClick={() => navigate('/perfil/salvos')}>
          💾 Materiais Salvos
        </div>

        <div className="card" onClick={() => navigate('/disciplinas')}>
          📚 Buscar Conteúdos
        </div>
      </div>
    </main>
  </div>
);

}

export default AlunoDashboard;