import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import api from '../../services/api';
// Você pode criar um SharedLayout.css e colocar as classes .dashboard-container, .dashboard-sidebar e .dashboard-main nele
import './SharedLayout.css'; 

function SharedLayout() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // O Layout busca quem é o usuário uma única vez
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

  // Verifica a role (ajuste a string 'MONITOR' de acordo com o que seu backend retorna)
  const isMonitor = usuario?.role === 'MONITOR' || usuario?.role === 'ROLE_MONITOR';

  return (
    <div className="dashboard-container">
      {/* SIDEBAR INTELIGENTE (Fixa na esquerda) */}
      <aside className="dashboard-sidebar">
        <div>
          <h2 className="sidebar-title">
            {isMonitor ? "👨‍🏫 Portal Monitor" : "🎓 Portal Aluno"}
          </h2>

          <div className="sidebar-menu">
            
            {/* Renderiza itens específicos do Monitor SE ele for monitor */}
            {isMonitor && (
              <>
                <div className="menu-section-title">Ações do Monitor</div>
                <button className="sidebar-btn" onClick={() => navigate('/gerenciar-recursos')}>
                  📎 Gerenciar Recursos
                </button>
                <button className="sidebar-btn" onClick={() => navigate('/relatorios/novo')}>
                  📊 Relatórios
                </button>
                <div className="menu-section-title" style={{ marginTop: '20px' }}>Área do Aluno</div>
              </>
            )}

            {/* Botões comuns para TODOS (Alunos e Monitores) */}
            <button className="sidebar-btn" onClick={() => navigate(isMonitor ? '/monitor-dashboard' : '/aluno-dashboard')}>
              🏠 Monitorias
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

      {/* CONTEÚDO PRINCIPAL (Scrollável na direita) */}
      <main className="dashboard-main">
        {/* O <Outlet /> é onde as páginas (Dashboards ou Disciplina) vão aparecer! */}
        {/* Passamos o usuário via context para as páginas filhas não precisarem fazer outro api.get('/auth/me') */}
        <Outlet context={{ usuario }} />
      </main>
    </div>
  );
}

export default SharedLayout;