import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Sidebar({ usuario, onLogout, onNavigate }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (onLogout) onLogout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: '📊', action: () => onNavigate('Dashboard') },
    { id: 'Usuarios', label: 'Usuários', icon: '👥', action: () => navigate('/alunos') },
    { id: 'Monitorias', label: 'Monitorias', icon: '📚', action: () => navigate('/monitorias') },
    { id: 'Relatorios', label: 'Relatórios', icon: '📝', action: () => navigate('/relatorios/novo') },
    { id: 'Pagamentos', label: 'Pagamentos', icon: '💰', action: () => alert('Em breve') },
    { id: 'Configuracoes', label: 'Configurações', icon: '⚙️', action: () => navigate('/perfil') }
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>

      {/* HEADER */}
      <div className="sidebar-header">
        {!collapsed && (
          <div className="logo-area">
            <div className="logo-icon">🎓</div>
            <div>
              <h2>Fatec Monitorias</h2>
              <span>Painel</span>
            </div>
          </div>
        )}

<button
          className="collapse-toggle"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expandir Menu" : "Recolher Menu"}
        >
          {collapsed ? (
            /* Ícone de Expandir (Menu fechado - com setinha) */
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
              <path d="M13 9l3 3-3 3"></path>
            </svg>
          ) : (
            /* Ícone de Recolher (Menu aberto - apenas a barra) */
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
            </svg>
          )}
        </button>
      </div>

      {/* MENU */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className="nav-btn"
            onClick={item.action}
            title={collapsed ? item.label : ''}
          >
            <span className="btn-icon">{item.icon}</span>
            {!collapsed && <span className="btn-label">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* USUÁRIO */}
      <div className="sidebar-user">
        {!collapsed ? (
          <>
            <div className="user-info">
              <strong>{usuario?.username || 'Usuário'}</strong>
              <span>Administrador</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Sair
            </button>
          </>
        ) : (
          <button 
            className="logout-btn" 
            onClick={handleLogout} 
            title="Sair do sistema"
            style={{ padding: '12px 0' }}
          >
            🚪
          </button>
        )}
      </div>

    </aside>
  );
}

export default Sidebar;