import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import api from '/src/services/api';
import './MonitorDashboard.css';

function MonitorDashboard() {
  // Consome os dados do usuário injetados pelo SharedLayout pai
  const { usuario } = useOutletContext();
  
  // Atualizado para usar o estado de monitorias igual ao AlunoDashboard
  const [monitorias, setMonitorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarMonitorias = async () => {
      try {
        // Buscando da rota correta e atualizada de monitorias
        const monitoriasRes = await api.get('/monitorias/ativas');
        setMonitorias(monitoriasRes.data);
      } catch (error) {
        console.error("Erro ao carregar dados do painel do monitor:", error);
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
        <h1>Bem-vindo, {usuario?.username}!</h1>
        <p>Seu painel de gerenciamento de monitoria e ambiente de estudos.</p>
      </header>

      {/* 1. SEÇÃO DE GERENCIAMENTO (Exclusiva do Monitor) */}
      <h2 className="section-title">Suas Ferramentas</h2>
      <div className="cards-grid" style={{ marginBottom: '40px' }}>
        <div className="card" onClick={() => navigate('/gerenciar-recursos')}>
          Recursos
          <small>Poste PDFs, Vídeos e Quizzes</small>
        </div>
        <div className="card" onClick={() => navigate('/monitor/relatorio')}>
          Relatórios
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
                // Modificado para checar o username dentro da nova estrutura de objetos aninhados
                const isMinhaMonitoria = monitoria.monitor?.usuario?.username === usuario?.username;

                return (
                  <div 
                    key={monitoria.id} 
                    className={`card disciplina-card-aluno ${isMinhaMonitoria ? 'minha-disciplina' : ''}`}
                    onClick={() => navigate(`/disciplina/${monitoria.disciplina?.id}`)}
                  >
                    <div className="disciplina-card-header">
                      <h4>
                        {monitoria.disciplina?.nome} 
                        {isMinhaMonitoria && <span title="Esta é a sua monitoria!"> ⭐</span>}
                      </h4>
                      {monitoria.disciplina?.codigo && (
                        <span className="disciplina-code">{monitoria.disciplina.codigo}</span>
                      )}
                    </div>
                    
                    <div className="disciplina-card-body">
                      <p>
                        {/* Exibe o nome usando a mesma associação mapeada no AlunoDashboard */}
                        <strong>Monitor:</strong> {monitoria.monitor?.usuario?.username || "Sem monitor atribuído"}
                        {isMinhaMonitoria && <span className="tag-voce"> (Você)</span>}
                      </p>
                      <p>
                        <strong>Cursos:</strong> {monitoria.cursosNomes && monitoria.cursosNomes.length > 0 
                          ? monitoria.cursosNomes.join(" | ") 
                          : (monitoria.disciplina?.cursosNomes && monitoria.disciplina.cursosNomes.length > 0 
                              ? monitoria.disciplina.cursosNomes.join(" | ") 
                              : "Geral")}
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