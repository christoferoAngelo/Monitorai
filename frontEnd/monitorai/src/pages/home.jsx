import './Home.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Home() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="home-container">
      {/* HEADER MODERNO */}
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
          <a href="#features">Funcionalidades</a>
          <a href="#stats">Impacto</a>
          <a href="#cta">Começar</a>
        </nav>

        <div className="header-buttons">
          <button
            className="btn-ghost"
            onClick={() => navigate('/login')}
          >
            Entrar
          </button>
          <button
            className="btn-primary"
            onClick={() => navigate('/login')}
          >
            Criar conta
          </button>
        </div>
      </header>

      {/* HERO MODERNO */}
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
            <button 
              className="btn-primary btn-large"
              onClick={() => navigate('/login')}
            >
              Começar agora
            </button>
            <button className="btn-secondary btn-large">
              Ver materiais
            </button>
          </div>
          <div className="hero-stats">
            <span>🎓 Gratuito para alunos Fatec</span>
            <span>•</span>
            <span>+3.500 materiais disponíveis</span>
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

      {/* FEATURES */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2>Por que escolher a Fatec Monitorias?</h2>
          <p>Recursos pensados para potencializar seu aprendizado</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Materiais Completos</h3>
            <p>PDFs, videoaulas, resumos, mapas mentais e exercícios organizados por disciplina e semestre.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👨‍🏫</div>
            <h3>Monitores Qualificados</h3>
            <p>Suporte direto de monitores experientes para tirar suas dúvidas.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Relatórios de Monitoria</h3>
            <p>Acompanhe todas as atividades presenciais realizadas.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Interação Completa</h3>
            <p>Comente, curta, salve e entre em contato com monitores via Teams.</p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section id="stats" className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">+1.200</div>
            <div className="stat-label">Alunos Ativos</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">+80</div>
            <div className="stat-label">Monitores</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">+3.500</div>
            <div className="stat-label">Materiais</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">+8.000</div>
            <div className="stat-label">Interações</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="cta-section">
        <div className="cta-content">
          <h2>Comece sua jornada acadêmica agora</h2>
          <p>Junte-se a milhares de alunos que já estão aproveitando o melhor apoio acadêmico.</p>
        </div>
        <button 
          className="btn-primary btn-large"
          onClick={() => navigate('/login')}
        >
          Criar conta gratuita
        </button>
      </section>
    </div>
  );
}