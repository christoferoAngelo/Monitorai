import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './MonitorDashboard.css';

function MonitorDashboard() {
  const [usuario, setUsuario] = useState(null);
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Busca dados do usuário e todas as disciplinas simultaneamente
    const carregarDados = async () => {
      try {
        const [userRes, disciplinasRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/disciplinas')
        ]);
        
        setUsuario(userRes.data);
        setDisciplinas(disciplinasRes.data);
      } catch (error) {
        console.error("Erro ao carregar dados do painel do monitor:", error);
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
          <h2 className="sidebar-title">👨‍🏫 Portal Monitor</h2>

          <div className="sidebar-menu">
            {/* --- MENU DO MONITOR --- */}
            <div className="menu-section-title">Ações do Monitor</div>
            <button className="sidebar-btn" onClick={() => navigate('/gerenciar-recursos')}>
              📎 Gerenciar Recursos
            </button>
            <button className="sidebar-btn" onClick={() => navigate('/relatorios/novo')}>
              📊 Relatórios
            </button>

            {/* --- MENU DO ALUNO --- */}
            <div className="menu-section-title" style={{ marginTop: '20px' }}>Área do Aluno</div>
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
          <p>Seu painel de gerenciamento de monitoria e ambiente de estudos.</p>
        </header>

        {/* 1. SEÇÃO DE GERENCIAMENTO (Exclusiva do Monitor) */}
        <h2 className="section-title">Suas Ferramentas</h2>
        <div className="cards-grid" style={{ marginBottom: '40px' }}>
          <div className="card" onClick={() => navigate('/gerenciar-recursos')}>
            📎 Recursos
            <small>Poste PDFs, Vídeos e Quizzes</small>
          </div>
          <div className="card" onClick={() => navigate('/relatorios/novo')}>
            📊 Relatórios
            <small>Registre suas atividades semanais</small>
          </div>
        </div>

        {/* 2. SEÇÃO DE ALUNO (Hero Section com Disciplinas) */}
        <div className="hero-section">
          <div className="cartinhas" style={{ position: 'relative', zIndex: 1 }}>
            <div>
              <h2>Visão Geral das Disciplinas</h2>
              <p>
                Acesse outras matérias para estudar, ou clique na sua própria monitoria para ver como os alunos a enxergam.
              </p>
            </div>

            {disciplinas.length === 0 ? (
              <p className="no-data-text">Nenhuma disciplina disponível no momento.</p>
            ) : (
              <div className="cards-grid">
                {disciplinas.map((disp) => {
                  // Verifica se o monitor logado é o dono dessa disciplina
                  const isMinhaMonitoria = disp.monitorNome === usuario.username;

                  return (
                    <div 
                      key={disp.id} 
                      className={`card disciplina-card-aluno ${isMinhaMonitoria ? 'minha-disciplina' : ''}`}
                      onClick={() => navigate(`/disciplina/${disp.id}`)}
                    >
                      <div className="disciplina-card-header">
                        <h4>
                          {disp.nome} 
                          {isMinhaMonitoria && <span title="Esta é a sua monitoria!"> ⭐</span>}
                        </h4>
                        {disp.codigo && <span className="disciplina-code">{disp.codigo}</span>}
                      </div>
                      
                      <div className="disciplina-card-body">
                        <p>
                          <strong>Monitor:</strong> {disp.monitorNome || "Sem monitor atribuído"}
                          {isMinhaMonitoria && <span className="tag-voce"> (Você)</span>}
                        </p>
                        <p>
                          <strong>Cursos:</strong> {disp.cursosNomes && disp.cursosNomes.length > 0 
                            ? disp.cursosNomes.join(" | ") 
                            : "Geral"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default MonitorDashboard;