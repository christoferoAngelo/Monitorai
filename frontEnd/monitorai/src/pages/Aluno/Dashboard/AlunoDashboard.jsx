import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import api from '/src/services/api';

function AlunoDashboard() {
  // Consome os dados do usuário que o seu SharedLayout já buscou do back-end
  const { usuario } = useOutletContext(); 
  
  const [monitorias, setMonitorias] = useState([]); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarMonitorias = async () => {
      try {
        // Agora busca apenas as monitorias ativas, já que o usuário vem do layout
        const monitoriasRes = await api.get('/monitorias/ativas');
        setMonitorias(monitoriasRes.data);
      } catch (error) {
        console.error("Erro ao carregar monitorias do painel:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarMonitorias();
  }, []);

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    // Retornamos apenas o fragmento/conteúdo principal que vai preencher o <Outlet />
    <>
      <header className="dashboard-header">
        <h1>Bem-vindo, {usuario?.username}</h1>
        <p>Seu ambiente de estudos e monitorias.</p>
      </header>

      <div className="hero-section">
        <div className="cartinhas" style={{ position: 'relative', zIndex: 1 }}>
          <div>
            <h2>Explore seus materiais acadêmicos</h2>
            <p>
              Selecione uma disciplina abaixo para acessar os conteúdos e agendar monitorias.
            </p>
          </div>

          {monitorias.length === 0 ? (
            <p className="no-data-text">Nenhuma monitoria disponível no momento.</p>
          ) : (
            <div className="cards-grid">
              {monitorias.map((monitoria) => (
                <div 
                  key={monitoria.id} 
                  className="card disciplina-card-aluno" 
                  onClick={() => navigate(`/disciplina/${monitoria.disciplina?.id}`)}
                >
                  <div className="disciplina-card-header">
                    <h4>{monitoria.disciplina?.nome}</h4>
                    {monitoria.disciplina?.codigo && (
                      <span className="disciplina-code">{monitoria.disciplina.codigo}</span>
                    )}
                  </div>
                  
                  <div className="disciplina-card-body">
                    <p>
                      <strong>Monitor:</strong> {monitoria.monitor?.usuario?.username || "Sem monitor atribuído"}
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
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AlunoDashboard;