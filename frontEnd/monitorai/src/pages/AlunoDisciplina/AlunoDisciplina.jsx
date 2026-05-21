import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './AlunoDisciplina.css';
import axios from 'axios';

function AlunoDisciplina() {
  const { id } = useParams(); // Pega o ID vindo da URL
  const navigate = useNavigate();
  const [disciplina, setDisciplina] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca os dados da disciplina específica no backend
    api.get(`/disciplinas/${id}`)
      .then(res => {
        setDisciplina(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar detalhes da disciplina:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="loading">Carregando detalhes da disciplina...</div>;
  if (!disciplina) return <div className="error-message">Disciplina não encontrada.</div>;

  return (
    <div className="disciplina-detalhe-container">
      {/* Cabeçalho superior com botão de voltar */}
      <header className="disciplina-detalhe-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ⬅ Voltar para o Painel
        </button>
        <div className="header-title-row">
          <h1>{disciplina.nome}</h1>
          {disciplina.codigo && <span className="detalhe-code">{disciplina.codigo}</span>}
        </div>
      </header>

      <main className="disciplina-detalhe-main">
        {/* Card de Informações Atuais */}
        <div className="info-geral-card">
          <h3>📋 Detalhes Acadêmicos</h3>
          <div className="info-divider"></div>
          
          <div className="info-row">
            <strong>Monitor de Referência:</strong>
            <span>{disciplina.monitorNome || "Nenhum monitor alocado no momento"}</span>
          </div>
          
          <div className="info-row">
            <strong>Curso(s) Destinatário(s):</strong>
            <span>
              {disciplina.cursosNomes && disciplina.cursosNomes.length > 0 
                ? disciplina.cursosNomes.join(" | ") 
                : "Grade Geral"}
            </span>
          </div>
        </div>

        {/* Espaço reservado para as próximas features */}
        <div className="placeholders-futuros-grid">
          <div className="card-placeholder-futuro">
            <h3>📚 Repositório de Materiais</h3>
            <p>Os PDFs, slides de aula e listas de exercícios que o monitor postar aparecerão organizados aqui muito em breve.</p>
          </div>

          <div className="card-placeholder-futuro">
            <h3>📅 Agenda de Monitorias</h3>
            <p>Área reservada para você verificar os dias de atendimento do monitor e reservar o seu horário de dúvidas.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AlunoDisciplina;