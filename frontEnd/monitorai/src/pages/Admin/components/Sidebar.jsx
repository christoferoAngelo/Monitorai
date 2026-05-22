import React from 'react';
import { useNavigate } from 'react-router-dom';

function Sidebar({ usuario, onLogout, onNavigate }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (onLogout) onLogout();
    navigate('/login');
  };

  const handleNav = (page) => {
    if (onNavigate) onNavigate(page);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="logo-area">
          <div className="logo-icon">🎓</div>
          <div>
            <h2>Fatec Monitorias</h2>
            <span>Painel Administrativo</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-btn active" onClick={() => handleNav('Dashboard')}>
            📊 Dashboard
          </button>
          <button className="nav-btn" onClick={() => handleNav('Usuários')}>
            👥 Usuários
          </button>
          <button className="nav-btn" onClick={() => handleNav('Monitorias')}>
            📚 Monitorias
          </button>
          <button className="nav-btn" onClick={() => handleNav('Relatórios')}>
            📝 Relatórios
          </button>
          <button className="nav-btn" onClick={() => handleNav('Pagamentos')}>
            💰 Pagamentos
          </button>
          <button className="nav-btn" onClick={() => handleNav('Configurações')}>
            ⚙️ Configurações
          </button>
        </nav>
      </div>

      <div className="sidebar-user">
        <div>
          <strong>{usuario?.username}</strong>
          <span>Administrador</span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;