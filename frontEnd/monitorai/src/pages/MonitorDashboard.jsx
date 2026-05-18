import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './MonitorDashboard.css';

function MonitorDashboard() {
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
        <h2 className="sidebar-title">👨‍🏫 Portal Monitor</h2>

        <div className="sidebar-menu">
          <button className="sidebar-btn" onClick={() => navigate('/gerenciar-recursos')}>
            📎 Recursos
          </button>

          <button className="sidebar-btn" onClick={() => navigate('/relatorios/novo')}>
            📊 Relatórios
          </button>

          <button className="sidebar-btn" onClick={() => navigate('/disciplinas')}>
            📚 Disciplinas
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
        <p>Painel de gerenciamento do monitor.</p>
      </header>

      <div className="hero-section">
        <h2>Gerencie materiais e acompanhe atividades</h2>
      </div>

      <div className="cards-grid">
        <div className="card" onClick={() => navigate('/gerenciar-recursos')}>
          📎 Recursos
          <small>PDFs e Quizzes</small>
        </div>

        <div className="card" onClick={() => navigate('/relatorios/novo')}>
          📊 Relatórios
          <small>Minhas atividades</small>
        </div>

        <div className="card" onClick={() => navigate('/disciplinas')}>
          📚 Disciplinas
          <small>Meus conteúdos</small>
        </div>
      </div>
    </main>
  </div>
);
  
}

export default MonitorDashboard;