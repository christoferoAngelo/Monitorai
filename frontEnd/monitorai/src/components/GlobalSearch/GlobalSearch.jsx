import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './GlobalSearch.css';

function GlobalSearch({ onClose }) {
  const [termo, setTermo] = useState('');
  const [disciplinas, setDisciplinas] = useState([]);
  const [monitorias, setMonitorias] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Autofocus ao abrir a pesquisa
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const carregarDados = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Primeiro buscamos as monitorias ativas
      const monitoriasRes = await api.get('/monitorias/ativas');
      const monitoriasAtivas = monitoriasRes.data || [];
      setMonitorias(monitoriasAtivas);

      // 2. Buscamos as disciplinas
      const disciplinasRes = await api.get('/disciplinas');
      const todasDisciplinas = disciplinasRes.data || [];

      // 3. Lógica para filtrar APENAS disciplinas que têm monitoria ativa
      const idsDisciplinasComMonitoria = new Set(
        monitoriasAtivas.map(m => m.disciplina?.id || m.disciplinaId)
      );
      
      const disciplinasAtivas = todasDisciplinas.filter(d => 
        idsDisciplinasComMonitoria.has(d.id)
      );
      
      setDisciplinas(disciplinasAtivas);
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // Fechar toda a pesquisa ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        if (onClose) onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Fechar resultados OU a pesquisa inteira ao pressionar ESC
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        if (showResults) {
          setShowResults(false);
        } else {
          if (onClose) onClose();
        }
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showResults, onClose]);

  const disciplinasFiltradas = Array.isArray(disciplinas)
    ? disciplinas.filter(
        (disciplina) =>
          disciplina?.nome?.toLowerCase().includes(termo.toLowerCase()) ||
          disciplina?.codigo?.toLowerCase().includes(termo.toLowerCase())
      )
    : [];

  const monitoriasFiltradas = Array.isArray(monitorias)
    ? monitorias.filter((monitoria) => {
        const termoLower = termo.toLowerCase();
        
        if (monitoria?.titulo?.toLowerCase().includes(termoLower)) return true;
        if (monitoria?.descricao?.toLowerCase().includes(termoLower)) return true;
        if (monitoria?.disciplina?.nome?.toLowerCase().includes(termoLower)) return true;
        if (monitoria?.disciplina?.codigo?.toLowerCase().includes(termoLower)) return true;
        
        if (monitoria?.monitor?.usuario?.nome?.toLowerCase().includes(termoLower)) return true;
        if (monitoria?.monitor?.usuario?.username?.toLowerCase().includes(termoLower)) return true;
        if (monitoria?.monitor?.usuario?.email?.toLowerCase().includes(termoLower)) return true;
        
        if (monitoria?.sala?.toLowerCase().includes(termoLower)) return true;
        
        return false;
      })
    : [];

  const handleResultClick = (tipo, item) => {
    if (onClose) onClose(); 
    
    switch (tipo) {
      case 'disciplina':
        navigate(`/disciplina/${item.id}`);
        break;
      case 'monitoria':
        if (item?.disciplina?.id) {
          navigate(`/disciplina/${item.disciplina.id}`);
        } else if (item?.disciplinaId) {
          navigate(`/disciplina/${item.disciplinaId}`);
        }
        break;
      default:
        break;
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setTermo(value);
    setShowResults(value.trim() !== '');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (monitoriasFiltradas.length > 0 || disciplinasFiltradas.length > 0) {
        setShowResults(false);
        setTermo('');
        inputRef.current?.blur();
      }
    }
  };

  const getMonitorNome = (monitoria) => {
    if (monitoria?.monitor?.usuario?.nome) return monitoria.monitor.usuario.nome;
    if (monitoria?.monitor?.usuario?.username) return monitoria.monitor.usuario.username;
    if (monitoria?.monitor?.nome) return monitoria.monitor.nome;
    return null;
  };

  const hasResults = disciplinasFiltradas.length > 0 || monitoriasFiltradas.length > 0;

  const diasSemanaMap = {
    'MONDAY': 'Segunda-feira', 'TUESDAY': 'Terça-feira', 'WEDNESDAY': 'Quarta-feira',
    'THURSDAY': 'Quinta-feira', 'FRIDAY': 'Sexta-feira', 'SATURDAY': 'Sábado', 'SUNDAY': 'Domingo',
    'SEGUNDA': 'Segunda-feira', 'TERCA': 'Terça-feira', 'QUARTA': 'Quarta-feira',
    'QUINTA': 'Quinta-feira', 'SEXTA': 'Sexta-feira', 'SABADO': 'Sábado', 'DOMINGO': 'Domingo'
  };

  return (
    <div className="global-search" ref={searchRef}>
      
      {/* Wrapper flex para colocar o botão e o input lado a lado */}
      <div className="search-input-wrapper">
        
        {/* Botão de voltar/fechar */}
        <button className="close-search-btn" onClick={() => onClose && onClose()} title="Fechar pesquisa">
          <img src="/icone_voltar.png" alt="Voltar" width="20" height="20" />
        </button>

        {/* Container relativo para prender os resultados embaixo do input */}
        <div className="input-and-results-container">
          <input
            ref={inputRef}
            type="text"
            placeholder="Pesquisar disciplinas ou monitorias ativas..."
            value={termo}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            onFocus={() => termo.trim() !== '' && setShowResults(true)}
            className="global-search-input"
          />

          {showResults && termo.trim() !== '' && (
            <div className="search-results">
              {isLoading && (
                <div className="search-loading">Carregando...</div>
              )}

              {!isLoading && (
                <>
                  {/* MONITORIAS ATIVAS */}
                  {monitoriasFiltradas.length > 0 && (
                    <>
                      <div className="search-category">
                        MONITORIAS ATIVAS ({monitoriasFiltradas.length})
                      </div>

                      {monitoriasFiltradas.map((monitoria) => {
                        const monitorNome = getMonitorNome(monitoria);
                        const disciplinaNome = monitoria?.disciplina?.nome;
                        const diaSemana = diasSemanaMap[monitoria?.dia_semana] || monitoria?.dia_semana;
                        const horario = monitoria?.horario_inicio && monitoria?.horario_fim 
                          ? `${monitoria.horario_inicio} - ${monitoria.horario_fim}` : null;
                        
                        return (
                          <div
                            key={`monitoria-${monitoria.id}`}
                            className="search-result-item"
                            onClick={() => handleResultClick('monitoria', monitoria)}
                          >
                            <div className="search-result-title">
                              <strong>{disciplinaNome || 'Monitoria'}</strong>
                            </div>
                            {monitorNome && <div className="search-result-monitor">{monitorNome}</div>}
                            {diaSemana && horario && <div className="search-result-horario">{diaSemana} • {horario}</div>}
                            {monitoria?.sala && <div className="search-result-local">{monitoria.sala}</div>}
                          </div>
                        );
                      })}
                    </>
                  )}

                  {/* DISCIPLINAS */}
                  {disciplinasFiltradas.length > 0 && (
                    <>
                      <div className="search-category">
                        DISCIPLINAS COM MONITORIA ({disciplinasFiltradas.length})
                      </div>

                      {disciplinasFiltradas.map((disciplina) => (
                        <div
                          key={`d-${disciplina.id}`}
                          className="search-result-item"
                          onClick={() => handleResultClick('disciplina', disciplina)}
                        >
                          <div className="search-result-title">
                             <strong>{disciplina.nome}</strong>
                          </div>
                          {disciplina.codigo && (
                            <div className="search-result-codigo">Código: {disciplina.codigo}</div>
                          )}
                        </div>
                      ))}
                    </>
                  )}

                  {/* NENHUM RESULTADO */}
                  {!hasResults && (
                    <div className="search-no-results">
                      Nenhum resultado encontrado para "{termo}"
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GlobalSearch;