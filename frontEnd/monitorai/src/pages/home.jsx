import './home.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Home() {
  const navigate = useNavigate();
  
  // Estados de UI
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Estados de Dados Principais
  const [monitorias, setMonitorias] = useState([]);
  const [editais, setEditais] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [semestres, setSemestres] = useState([]);

  // Estados de Filtro
  const [filtroCurso, setFiltroCurso] = useState("");
  const [filtroSemestre, setFiltroSemestre] = useState("");
  const [filtroDisciplina, setFiltroDisciplina] = useState("");

  
  // Estado para controlar qual editable tem o PDF aberto (inline)
  const [editalPdfExpandido, setEditalPdfExpandido] = useState(null);


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    buscarDados();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (editais.length > 0 && !editalPdfExpandido) {
      const editalComPdf = editais.find(e => e.urlPdf);
      
      if (editalComPdf) {
        setEditalPdfExpandido(editalComPdf.id); 
      }
    }
  }, [editais]);


  // Função para alternar o PDF aberto
  function togglePdf(edital) {
    if (editalPdfExpandido === edital.id) {  
      setEditalPdfExpandido(null);
    } else {
      setEditalPdfExpandido(edital.id);
    }
  }

  async function buscarDados() {
    try {
      const [resMonitorias, resEditais, resCursos, resDisciplinas] = await Promise.allSettled([
        api.get('/monitorias/ativas'),
        api.get('/editais'),
        api.get('/cursos'),
        api.get('/disciplinas')
      ]);

      if (resMonitorias.status === 'fulfilled') {
        const apenasAtivas = resMonitorias.value.data.filter(m => m.ativa === true);
        setMonitorias(apenasAtivas);
      }

      if (resEditais.status === 'fulfilled') {
        const listaEditais = resEditais.value.data.sort((a, b) => 
          new Date(b.dataPublicacao) - new Date(a.dataPublicacao)
        );
        setEditais(listaEditais);
      }

      if (resCursos.status === 'fulfilled') {
        setCursos(resCursos.value.data);
      }
      
      if (resDisciplinas.status === 'fulfilled') {
        const listaDisciplinas = resDisciplinas.value.data;
        setDisciplinas(listaDisciplinas);
        
        const sems = [...new Set(listaDisciplinas.map(d => d.semestre).filter(s => s))].sort();
        setSemestres(sems);
      }

    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    }
  }

  const acessarMonitoria = (disciplinaId) => {
    if(disciplinaId) {
      navigate(`/disciplina/${disciplinaId}`);
    } else {
      alert("Disciplina não encontrada para esta monitoria.");
    }
  };

  function limparFiltros() {
    setFiltroCurso("");
    setFiltroSemestre("");
  }
  
  
  
  //DISCIPLINAS
  const disciplinasFiltradas = disciplinas.filter(d => {

    if (
      filtroSemestre &&
      d.semestre !== parseInt(filtroSemestre)
    ) {
      return false;
    }

    if (
      filtroCurso &&
      !d.cursosIds?.includes(parseInt(filtroCurso))
    ) {
      return false;
    }

    return true;
  });
  
  // Lógica de filtro
  
  const monitoriasFiltradas = monitorias.filter(m => {
    let passaFiltro = true;
    
    if (filtroSemestre && m.disciplina?.semestre !== parseInt(filtroSemestre)) {
      passaFiltro = false;
    }
    
    if (filtroCurso && !m.disciplina?.cursosIds?.includes(parseInt(filtroCurso))) {
      passaFiltro = false;
    } 
	
	if (
	  filtroDisciplina &&
	  m.disciplina?.id !== parseInt(filtroDisciplina)
	) {
	  passaFiltro = false;
	}
    
    return passaFiltro;
  });

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
          
          <div className="dropdown">
            <a href="#monitorias" className="dropbtn">Monitorias ▾</a>
            <div className="dropdown-content">
              <span onClick={() => navigate('/?filtro=curso#monitorias')}>Por Curso</span>
              <span onClick={() => navigate('/monitorias/semestre')}>Por Semestre</span>
              <span onClick={() => navigate('/monitorias/disciplina')}>Por Disciplina</span>
            </div>
          </div>

          <a href="#editais">Editais</a>
          <a href="#resultados">Resultados</a>
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
            <button className="btn-secondary btn-large" onClick={() => navigate('/perfil/salvos')}>
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

      {/* MONITORIAS COM FILTROS */}
      <section id="monitorias" className="monitorias-section">
        <div className="section-header">
          <h2>📚 Monitorias Disponíveis</h2>
          <p>Encontre a disciplina e acesso os materiais de estudo</p>
        </div>

        <div className="filtros-home" style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '30px' }}>
            <select 
              value={filtroCurso} 
              onChange={e => setFiltroCurso(e.target.value)} 
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none' }}
            >
                <option value="">Todos os Cursos</option>
                {cursos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
            
            <select 
              value={filtroSemestre} 
              onChange={e => setFiltroSemestre(e.target.value)} 
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none' }}
            >
                <option value="">Todos os Semestres</option>
                {semestres.map(s => <option key={s} value={s}>{s}º Semestre</option>)}
            </select>
			
			<select
			  value={filtroDisciplina}
			  onChange={e => setFiltroDisciplina(e.target.value)}
			  style={{
			    padding: '10px',
			    borderRadius: '6px',
			    border: '1px solid #ccc',
			    outline: 'none'
			  }}
			>
			  <option value="">Todas as Disciplinas</option>

			  {disciplinasFiltradas.map(d => (
			    <option key={d.id} value={d.id}>
			      {d.nome}
			    </option>
			  ))}
			</select>

            {(filtroCurso || filtroSemestre) && (
                <button 
                  onClick={limparFiltros} 
                  className="btn-ghost" 
                  style={{ padding: '10px 16px' }}
                >
                  Limpar Filtros
                </button>
            )}
        </div>

        {monitoriasFiltradas.length === 0 ? (
          <div className="empty-monitorias" style={{ textAlign: 'center', padding: '40px' }}>
            <p>Nenhuma monitoria disponível com estes filtros no momento.</p>
          </div>
        ) : (
          <div className="monitorias-grid">
            {monitoriasFiltradas.map(monitoria => (
              <div key={monitoria.id} className="monitoria-card">
                <div className="monitoria-header">
                  <span className="disciplina-badge">
                   {monitoria.disciplinaNome || 'Disciplina'}
                  </span>
                </div>
                <div className="monitoria-info">
                  <h3>{monitoria.monitorNome || 'Monitor'}</h3>
                  <p className="sala">📍 {monitoria.sala || 'A definir'}</p>
                  <p className="horario">
                    🕐 {monitoria.horarioInicio?.substring(0,5)} - {monitoria.horarioFim?.substring(0,5)}
                  </p>
                  <p className="dia">📅 {monitoria.diaSemana || 'A combinar'}</p>
                </div>
                <div className="monitoria-actions">
                  <button 
                    className="btn-agendar" 
                    onClick={() => acessarMonitoria(monitoria.disciplinaid)}
                  >
                    Acessar Materiais
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
                
                {/* Botão para expandir/fechar o PDF */}
                <button 
                  className="btn-edital-pdf"
                  onClick={() => togglePdf(edital)}
                >
                  {editalPdfExpandido === edital.id 
                    ? "📄 Fechar PDF" 
                    : "📄 Clique aqui e leia o edital na íntegra"}
                </button>

                {/* PDF Incorporado (aparece abaixo se estiver expandido) */}
                {editalPdfExpandido === edital.id && edital.urlPdf && (
                  <div className="pdf-inline-container">
                    <embed 
                      src={edital.urlPdf} 
                      type="application/pdf" 
                      width="100%" 
                      height="500px" 
                    />
                  </div>
                )}
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
                  onClick={() => togglePdf(edital)}
                >
                  {editalPdfExpandido === edital.id 
                    ? "📄 Fechar PDF" 
                    : "📄 Ver resultado em PDF"}
                </button>

                {editalPdfExpandido === edital.id && edital.urlPdf && (
                  <div className="pdf-inline-container">
                    <embed 
                      src={edital.urlPdf} 
                      type="application/pdf" 
                      width="100%" 
                      height="500px" 
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
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