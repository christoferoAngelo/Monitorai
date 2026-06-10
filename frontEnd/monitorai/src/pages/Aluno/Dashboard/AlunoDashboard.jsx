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
        const monitoriasRes = await api.get('/monitorias/ativas');
        
        // --- ADICIONE ESTE LOG PARA DEBUGAR ---
        console.log("DADOS RECEBIDOS DA API:", monitoriasRes.data);
        
        // Verifica se é array, caso contrário, tenta acessar alguma chave comum (como .content ou .data)
        // ou força o estado para um array vazio para não quebrar a tela.
        if (Array.isArray(monitoriasRes.data)) {
          setMonitorias(monitoriasRes.data);
        } else if (monitoriasRes.data && typeof monitoriasRes.data === 'object') {
           // Se a API retornar um objeto com os dados dentro, ajuste aqui
           // Ex: setMonitorias(monitoriasRes.data.content); 
           console.warn("A API retornou um objeto, não um array. Verifique a estrutura.");
           setMonitorias([]); 
        } else {
          setMonitorias([]);
        }
      } catch (error) {
        console.error("Erro ao carregar monitorias do painel:", error);
        setMonitorias([]); // Define como vazio para evitar que o .map quebre
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
        <h1>Bem-vindo(a), {usuario.username?.substring(0, 1)?.toUpperCase() + usuario.username?.substring(1) || "Usuário"}!</h1>
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
                  // 1. URL CORRIGIDA: Usa disciplinaId direto da raiz do objeto
                  onClick={() => navigate(`/disciplina/${monitoria.disciplinaId}`)}
                >
                  <div className="disciplina-card-header">
                    {/* 2. NOME DA DISCIPLINA CORRIGIDO */}
                    <h4>{monitoria.disciplinaNome}</h4>
                    {monitoria.disciplinaCodigo && (
                      <span className="disciplina-code">{monitoria.disciplinaCodigo}</span>
                    )}
                  </div>
                  
                  <div className="disciplina-card-body">
                    <p>
                      {/* 3. NOME DO MONITOR CORRIGIDO */}
                      <strong>Monitor:</strong> {monitoria.monitorNome 
                        ? monitoria.monitorNome.substring(0, 1).toUpperCase() + monitoria.monitorNome.substring(1) 
                        : "Sem monitor atribuído"}
                    </p>
                    <p>
                      {/* 4. CURSOS CORRIGIDO */}
                      <strong>Cursos:</strong> {monitoria.cursosNomes && monitoria.cursosNomes.length > 0 
                        ? monitoria.cursosNomes.join(" | ") 
                        : "Geral"}
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