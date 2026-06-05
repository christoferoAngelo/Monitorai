import './home.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Home() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [monitorias, setMonitorias] = useState([]);
  const [editais, setEditais] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    buscarDados();
  }, []);

  async function buscarDados() {
    try {
      const [resMonitorias, resEditais] = await Promise.all([
        api.get('/monitorias/ativas'),
        api.get('/editais')
      ]);
      setMonitorias(resMonitorias.data);
      setEditais(resEditais.data);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    }
  }

  // Função para abrir PDF do edital
  async function verPdf(edital) {
    try {
      const response = await api.get(`/editais/${edital.id}/pdf`, {
        responseType: 'blob'
      });
      
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
    } catch (err) {
      console.error('Erro ao carregar PDF:', err);
      alert('Erro ao carregar PDF');
    }
  }

  // Filtros
  const editaisVagas = editais.filter(e => e.tipo === 'VAGAS' && e.status === 'ATIVO');
  const editaisResultados = editais.filter(e => e.tipo === 'RESULTADO');

  return (
    <div className="home-container">
      {/* HEADER */}
      <header className={`home-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="logo-area">
          <div className="logo-icon">🎓</div>
          <div>
            <h2>Fatec Monitorias</h2>
            <p>Apoio que transforma aprendizado</p>
          </div>
        </div>

        <nav className="menu-nav">
          <a href="#hero">Início</a>
          <a href="#editais">Editais</a>
          <a href="#resultados">Resultados</a>
          <a href="#monitorias">Monitorias</a>
          <a href="#cta">Contato</a>
        </nav>

        <div className="header-buttons">
          <button className="btn-ghost" onClick={() => navigate('/login')}>
            Entrar
          </button>
          <button className="btn-primary" onClick={() => navigate('/login')}>
            Criar conta
          </button>
        </div>
      </header>

      {/* HERO */}
      <section id="hero" className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">Plataforma Oficial Fatec</div>
          <h1 className="hero-title">
            Aprenda mais. <span>Vá mais longe.</span>
          </h1>
          <p className="hero-description">
            Conectamos alunos e monitores com materiais de qualidade, 
            videoaulas, exercícios e suporte acadêmico completo.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary btn-large" onClick={() => navigate('/login')}>
              Começar agora
            </button>
            <button className="btn-secondary btn-large" onClick={() => navigate('/materiais')}>
              Ver materiais
            </button>
          </div>
          <div className="hero-stats">
            <span>🎓 Gratuito para alunos Fatec</span>
            <span>•</span>
            <span>{monitorias.length} monitorias disponíveis</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">
            <div className="card-icon">📚</div>
            <p>Materiais</p>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">👨‍🏫</div>
            <p>Monitores</p>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon">💬</div>
            <p>Interação</p>
          </div>
          <div className="hero-gradient"></div>
        </div>
      </section>

      {/* EDITAIS DE VAGAS */}
      <section id="editais" className="editais-section">
        <div className="section-header">
          <h2>📋 Programa de Monitoria</h2>
          <p>Inscrições abertas para monitores</p>
        </div>
        
        <div className="editais-container">
          {editaisVagas.length === 0 ? (
            <div className="empty-state">
              <p>Nenhuma inscrição aberta no momento.</p>
            </div>
          ) : (
            editaisVagas.map(edital => (
              <div key={edital.id} className="edital-card-full">
                <div className="edital-header">
                  <span className="edital-number">EDITAL Nº {edital.numeroEdital}</span>
                  <span className="edital-status">📝 Inscrições Abertas</span>
                </div>
                
                <h3>{edital.titulo}</h3>
                <p className="edital-periodo">
                  📅 Período: {edital.periodoInicio} até {edital.periodoFim}
                </p>
                <p className="edital-descricao">{edital.descricao}</p>
                
                <button className="btn-edital-pdf">
                  📄 Clique aqui e leia o edital na íntegra
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* RESULTADOS */}
      <section id="resultados" className="resultados-section">
        <div className="section-header">
          <h2>🏆 Resultados</h2>
          <p>Classificação final dos Editais</p>
        </div>
        
        <div className="resultados-container">
          {editaisResultados.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum resultado publicado.</p>
            </div>
          ) : (
            editaisResultados.map(edital => (
              <div key={edital.id} className="resultado-card">
                <div className="resultado-header">
                  <span>EDITAL Nº {edital.numeroEdital}</span>
                  <span>{edital.dataPublicacao}</span>
                </div>
                <h3>{edital.titulo}</h3>
                
                <button 
                  className="btn-resultado-pdf"
                  onClick={() => verPdf(edital)}
                >
                  📄 Ver resultado em PDF
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* MONITORIAS ATIVAS */}
      <section id="monitorias" className="monitorias-section">
        <div className="section-header">
          <h2>📚 Monitorias Disponíveis</h2>
          <p>Agende seu atendimento com os monitores</p>
        </div>

        {monitorias.length === 0 ? (
          <div className="empty-monitorias">
            <p>Nenhuma monitoria disponível no momento.</p>
          </div>
        ) : (
          <div className="monitorias-grid">
            {monitorias.map(monitoria => (
              <div key={monitoria.id} className="monitoria-card">
                <div className="monitoria-header">
                  <span className="disciplina-badge">
                    {monitoria.disciplina?.nome || 'Disciplina'}
                  </span>
                </div>
                <div className="monitoria-info">
                  <h3>{monitoria.monitor?.usuario?.username || 'Monitor'}</h3>
                  <p className="sala">📍 {monitoria.sala || 'A definir'}</p>
                  <p className="horario">
                    🕐 {monitoria.horarioInicio?.substring(0,5)} - {monitoria.horarioFim?.substring(0,5)}
                  </p>
                  <p className="dia">📅 {monitoria.diaSemana || 'A combinar'}</p>
                </div>
                <div className="monitoria-actions">
                  <button className="btn-agendar">Agendar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section id="cta" className="cta-section">
        <div className="cta-content">
          <h2>Comece sua jornada acadêmica agora</h2>
          <p>Junte-se a milhares de alunos que já estão aproveitando o melhor apoio acadêmico.</p>
        </div>
        <button className="btn-primary btn-large" onClick={() => navigate('/login')}>
          Criar conta gratuita
        </button>
      </section>
    </div>
  );
}