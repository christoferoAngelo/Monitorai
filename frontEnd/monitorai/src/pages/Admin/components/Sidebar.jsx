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

  // Mapeamento dos itens do menu utilizando os arquivos .png da pasta public
  const menuItems = [
    { 
      id: 'Dashboard', 
      label: 'Dashboard', 
      icon: <img src="/icone_dashboard.png" alt="Dashboard" width="20" height="20" />, 
      action: () => onNavigate('Dashboard') 
    },
    { 
      id: 'Usuarios', 
      label: 'Usuários', 
      icon: <img src="/icone_users.png" alt="Usuários" width="20" height="20" />, 
      action: () => navigate('/admin-usuarios') 
    },
    { 
      id: 'Monitorias', 
      label: 'Monitorias', 
      icon: <img src="/icone_monitorias.png" alt="Monitorias" width="20" height="20" />, 
      action: () => navigate('/admin-monitorias') 
    },
    { 
      id: 'Relatorios', 
      label: 'Relatórios', 
      icon: <img src="/icone_relatorios.png" alt="Relatórios" width="20" height="20" />, 
      action: () => navigate('/relatorios/novo') 
    },
    { 
      id: 'GradeCurricular', 
      label: 'Grade Curricular', 
      icon: <img src="/icone_grade.png" alt="Grade Curricular" width="20" height="20" />, 
      action: () => navigate('/grade-curricular') 
    }
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && (
          <div className="logo-area">
            <div className="logo-icon">
              {/* Substituído o emoji de formatura pelo ícone de monitorias ou grade (ajuste se preferir outro) */}
              <img src="/icone_chapeu.png" alt="Logo" width="24" height="24" />
            </div>
            <div>
              <h2>Monitoraí</h2>
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
              <path d="M13 9l3 3-3 3"></path>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
            </svg>
          )}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className="nav-btn"
            onClick={item.action}
            title={collapsed ? item.label : ''}
          >
            <span className="btn-icon" style={{ display: 'flex', alignItems: 'center' }}>
              {item.icon}
            </span>
            {!collapsed && <span className="btn-label">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-user">
        {!collapsed ? (
          <>
            <div className="user-info">
              <strong>{usuario?.username || 'Usuário'}</strong>
              <span>Administrador</span>
            </div>
            <button className="logout-btn" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src="/icone_sair.png" alt="Sair" width="16" height="16" />
              Sair
            </button>
          </>
        ) : (
          <button 
            className="logout-btn" 
            onClick={handleLogout} 
            title="Sair do sistema"
            style={{ padding: '12px 0', display: 'flex', justifyContent: 'center', width: '100%' }}
          >
            {/* Substituído o emoji de porta pelo icone_sair.png */}
            <img src="/icone_sair.png" alt="Sair" width="20" height="20" />
          </button>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;