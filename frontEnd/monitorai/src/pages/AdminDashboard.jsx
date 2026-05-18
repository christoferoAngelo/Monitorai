import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Inicial.css';  // Seu CSS atual

function AdminDashboard() {
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
    delete api.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando painel administrativo...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">👑</span>
            <h3>Painel Admin</h3>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <button className="nav-item active" onClick={() => navigate("/admin-dashboard")}>
            <span>📊</span>
            <span>Dashboard</span>
          </button>
          
          <button className="nav-item" onClick={() => navigate("/cursos")}>
            <span>🏛️</span>
            <span>Cursos</span>
          </button>
          
          <button className="nav-item" onClick={() => navigate("/alunos")}>
            <span>👥</span>
            <span>Alunos</span>
          </button>
          
          <button className="nav-item" onClick={() => navigate("/disciplinas")}>
            <span>📚</span>
            <span>Disciplinas</span>
          </button>
          
          <button className="nav-item" onClick={() => navigate("/monitorias")}>
            <span>📋</span>
            <span>Monitorias</span>
          </button>
          
          <div className="nav-divider"></div>
          
          <button className="nav-item" onClick={() => navigate("/relatorios/novo")}>
            <span>📊</span>
            <span>Relatórios</span>
          </button>
        </nav>
        
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Sair
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>Painel Administrativo</h1>
          <div className="user-profile">
            <span>Bem-vindo, <strong>{usuario?.username}</strong></span>
            <div className="role-badge admin">ADMIN</div>
          </div>
        </header>

        <section className="stats-grid">
          <div className="stat-card alunos">
            <div className="stat-icon">👥</div>
            <div>
              <div className="stat-number">1247</div>
              <div className="stat-label">Alunos Ativos</div>
            </div>
          </div>
          
          <div className="stat-card monitores">
            <div className="stat-icon">👨‍🏫</div>
            <div>
              <div className="stat-number">82</div>
              <div className="stat-label">Monitores</div>
            </div>
          </div>
          
          <div className="stat-card materiais">
            <div className="stat-icon">📚</div>
            <div>
              <div className="stat-number">3563</div>
              <div className="stat-label">Materiais</div>
            </div>
          </div>
          
          <div className="stat-card relatorios">
            <div className="stat-icon">📊</div>
            <div>
              <div className="stat-number">892</div>
              <div className="stat-label">Relatórios</div>
            </div>
          </div>
        </section>

<section className="action-cards">
  <div className="action-card" onClick={() => navigate("/alunos")}>
    <div className="action-icon">👥</div>
    <h3>Gerenciar Alunos</h3>
    <p>Ativar/desativar contas e promover monitores</p>
  </div>
  
  <div className="action-card" onClick={() => navigate("/disciplinas")}>
    <div className="action-icon">📚</div>
    <h3>Disciplinas</h3>
    <p>Configurar disciplinas vigentes e monitores</p>
  </div>
  
  <div className="action-card" onClick={() => navigate("/monitorias")}>
    <div className="action-icon">📋</div>
    <h3>Monitorias</h3>
    <p>Gerenciar horários e salas das monitorias</p>
  </div>
  
  <div className="action-card" onClick={() => navigate("/cursos")}>
    <div className="action-icon">🏛️</div>
    <h3>Cursos</h3>
    <p>Gerenciar cursos e semestres</p>
  </div>
</section>

{/* QUICK ACTIONS */}
<section className="quick-actions">
  <h3>Ações Rápidas</h3>
  <div className="quick-buttons">
    <button className="quick-btn primary" onClick={() => navigate("/alunos")}>
      ➕ Novo Aluno
    </button>
    <button className="quick-btn secondary" onClick={() => navigate("/relatorios/novo")}>
      📊 Ver Relatórios
    </button>
    <button className="quick-btn danger" onClick={() => navigate("/disciplinas")}>
      ⚙️ Configurar Disciplina
    </button>
  </div>
</section>
      </main>
    </div>
  );
}

export default AdminDashboard;