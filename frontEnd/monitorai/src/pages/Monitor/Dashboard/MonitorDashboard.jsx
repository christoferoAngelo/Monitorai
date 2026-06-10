import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import api from '/src/services/api';
import './MonitorDashboard.css';

function MonitorDashboard() {
  // Consome os dados do usuário injetados pelo SharedLayout pai
  const { usuario } = useOutletContext();
  
  const [monitorias, setMonitorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarMonitorias = async () => {
      try {
        // Buscando da rota atualizada de monitorias
        const monitoriasRes = await api.get('/monitorias/ativas');
        
        if (Array.isArray(monitoriasRes.data)) {
          setMonitorias(monitoriasRes.data);
        } else {
          setMonitorias([]);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do painel do monitor:", error);
        setMonitorias([]);
      } finally {
        setLoading(false);
      }
    };

    carregarMonitorias();
  }, []);

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <>
      <header className="dashboard-header">
        <h1>Bem-vindo, {usuario?.username?.substring(0, 1)?.toUpperCase() + usuario?.username?.substring(1) || "Usuário"}!</h1>
        <p>Seu painel de gerenciamento de monitoria e ambiente de estudos.</p>
      </header>

      {/* 1. SEÇÃO DE GERENCIAMENTO (Exclusiva do Monitor) */}
      <h2 className="section-title">Suas Ferramentas</h2>
      <div className="cards-grid" style={{ marginBottom: '40px' }}>
        
        <div className="card" onClick={() => navigate('/gerenciar-recursos')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <img src="/icone_clipe.png" alt="Recursos" width="20" height="20"/>
            <strong>Recursos</strong>
          </div>
          <small>Poste PDFs, Vídeos e Quizzes</small>
        </div>

        <div className="card" onClick={() => navigate('/monitor/relatorio')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <img src="/icone_editais.png" alt="Relatórios" width="20" height="20"/>
            <strong>Relatórios</strong>
          </div>
          <small>Registre suas atividades semanais</small>
        </div>

      </div>

      {/* 2. SEÇÃO DE ALUNO (Hero Section com as Monitorias Ativas) */}
      <div className="hero-section">
        <div className="cartinhas" style={{ position: 'relative', zIndex: 1 }}>
          <div>
            <h2>Visão Geral das Disciplinas</h2>
            <p>
              Acesse outras matérias para estudar, ou clique na sua própria monitoria para ver como os alunos a enxergam.
            </p>
          </div>

          {monitorias.length === 0 ? (
            <p className="no-data-text">Nenhuma monitoria disponível no momento.</p>
          ) : (
            <div className="cards-grid">
              {monitorias.map((monitoria) => {
                // Checagem atualizada para a estrutura plana do DTO
                const isMinhaMonitoria = monitoria.monitorNome === usuario?.username;

                return (
                  <div 
                    key={monitoria.id} 
                    className={`card disciplina-card-aluno ${isMinhaMonitoria ? 'minha-disciplina' : ''}`}
                    // Redirecionamento atualizado
                    onClick={() => navigate(`/disciplina/${monitoria.disciplinaId}`)}
                  >
                    <div className="disciplina-card-header">
                      <h4>
                        {/* Nome da disciplina atualizado */}
                        {monitoria.disciplinaNome} 
                        {isMinhaMonitoria && <span title="Esta é a sua monitoria!"> ⭐</span>}
                      </h4>
                      {/* Código da disciplina atualizado */}
                      {monitoria.disciplinaCodigo && (
                        <span className="disciplina-code">{monitoria.disciplinaCodigo}</span>
                      )}
                    </div>
                    
                    <div className="disciplina-card-body">
                      <p>
                        {/* Nome do monitor formatado e atualizado */}
                        <strong>Monitor:</strong> {monitoria.monitorNome 
                          ? monitoria.monitorNome.substring(0, 1).toUpperCase() + monitoria.monitorNome.substring(1) 
                          : "Sem monitor atribuído"}
                        {isMinhaMonitoria && <span className="tag-voce"> (Você)</span>}
                      </p>
                      <p>
                        {/* Cursos atualizados de forma simplificada */}
                        <strong>Cursos:</strong> {monitoria.cursosNomes && monitoria.cursosNomes.length > 0 
                          ? monitoria.cursosNomes.join(" | ") 
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
    </>
  );
}

export default MonitorDashboard;