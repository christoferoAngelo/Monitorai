import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import GlobalSearch from '../GlobalSearch/GlobalSearch';
import './SharedLayout.css'; 

function SharedLayout() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  // NOVO: Estado para controlar a visibilidade da pesquisa
  const [showSearch, setShowSearch] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/auth/me')
      .then(res => {
        setUsuario(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro de autenticação:", err);
        navigate('/login');
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return <div className="loading">Carregando ambiente...</div>;

  const isMonitor = usuario?.role === 'MONITOR' || usuario?.role === 'ROLE_MONITOR';

  const menuItems = [];

  // NOVO: Botão de pesquisa fixo para todos (inserido antes dos outros)
  menuItems.push({
    id: 'Pesquisar',
    label: 'Pesquisar',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    ),
    action: () => setShowSearch(true)
  });

  if (isMonitor) {
    menuItems.push(
      { 
        id: 'GerenciarRecursos', 
        label: 'Gerenciar Recursos', 
        icon: <img src="/icone_clipe.png" alt="Recursos" width="20" height="20" />, 
        action: () => navigate('/gerenciar-recursos') 
      },
      { 
        id: 'Relatorios', 
        label: 'Relatórios', 
        icon: <img src="/icone_editais.png" alt="Relatórios" width="20" height="20" />, 
        action: () => navigate('/monitor/relatorio') 
      }
    );
  }

  // Itens comuns visíveis para todos
  menuItems.push(
    { 
      id: 'Monitorias', 
      label: 'Monitorias', 
      icon: <img src="/icone_monitorias.png" alt="Monitorias" width="20" height="20" />, 
      action: () => navigate(isMonitor ? '/monitor-dashboard' : '/aluno-dashboard') 
    },
    { 
      id: 'MeusSalvos', 
      label: 'Meus Salvos', 
      icon: <img src="/icone_salvo.png" alt="Meus Salvos" width="20" height="20" />, 
      action: () => navigate('/perfil/salvos') 
    }
  );

  return (
    <div className="dashboard-container">
      {/* SIDEBAR MANTIDA IGUAL */}
      <aside className={`dashboard-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-top-wrapper">
          <div className="sidebar-header">
            {!collapsed && (
              <div className="logo-area">
                <div className="logo-icon">
                  <img src="/icone_chapeu.png" alt="Logo" width="24" height="24" />
                </div>
                <div>
                  <h2>Monitoraí</h2>
                  <span>{isMonitor ? "Portal Monitor" : "Portal Aluno"}</span>
                </div>
              </div>
            )}

            <button
              className="collapse-toggle"
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? "Expandir Menu" : "Recolher Menu"}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
                {collapsed ? <path d="M13 12h5" /> : <path d="M18 12h-5" />}
              </svg>
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
                <span className="btn-icon">
                  {item.icon}
                </span>
                {!collapsed && <span className="btn-label">{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        <div className="sidebar-user">
          {!collapsed ? (
            <>
              <div className="user-info">
                <strong>{usuario?.username || 'Usuário'}</strong>
                <span>{isMonitor ? "Monitor" : "Aluno"}</span>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                <img src="/icone_sair.png" alt="Sair" width="16" height="16" />
                Sair
              </button>
            </>
          ) : (
            <button 
              className="logout-btn collapsed-logout" 
              onClick={handleLogout} 
              title="Sair do sistema"
            >
              <img src="/icone_sair.png" alt="Sair" width="20" height="20" />
            </button>
          )}
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL DINÂMICO */}
      <main className="dashboard-main">
        {/* NOVO: Passando a função onClose para o GlobalSearch e renderizando condicionalmente */}
        {showSearch && <GlobalSearch onClose={() => setShowSearch(false)} />}
        <Outlet context={{ usuario }} />
      </main>
    </div>
  );
}

export default SharedLayout;