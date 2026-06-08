/* eslint-disable react-hooks/immutability */
/* eslint-disable no-unused-vars */
import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './GlobalSearch.css';

function GlobalSearch() {
  const [termo, setTermo] = useState('');
  const [disciplinas, setDisciplinas] = useState([]);
  const [materiais, setMateriais] = useState([]);
  const [monitorias, setMonitorias] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const carregarDados = useCallback(async () => {
    setIsLoading(true);
    try {
      const disciplinasRes = await api.get('/disciplinas');
      setDisciplinas(disciplinasRes.data || []);

      const monitoriasRes = await api.get('/monitorias/ativas');
      setMonitorias(monitoriasRes.data || []);
      
      try {
        const materiaisRes = await api.get('/materiais');
        setMateriais(materiaisRes.data || []);
      } catch (error) {
        console.warn('Endpoint /materiais não disponível');
        setMateriais([]);
      }
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // Fechar resultados ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fechar ao pressionar ESC
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setShowResults(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  const disciplinasFiltradas = Array.isArray(disciplinas)
    ? disciplinas.filter(
        (disciplina) =>
          disciplina?.nome?.toLowerCase().includes(termo.toLowerCase()) ||
          disciplina?.codigo?.toLowerCase().includes(termo.toLowerCase())
      )
    : [];

  const materiaisFiltrados = Array.isArray(materiais) && materiais.length > 0
    ? materiais.filter(
        (material) =>
          material?.titulo?.toLowerCase().includes(termo.toLowerCase()) ||
          material?.conteudo?.toLowerCase().includes(termo.toLowerCase())
      )
    : [];

  const monitoriasFiltradas = Array.isArray(monitorias)
    ? monitorias.filter((monitoria) => {
        const termoLower = termo.toLowerCase();
        
        if (monitoria?.titulo?.toLowerCase().includes(termoLower)) return true;
        if (monitoria?.descricao?.toLowerCase().includes(termoLower)) return true;
        if (monitoria?.disciplina?.nome?.toLowerCase().includes(termoLower)) return true;
        if (monitoria?.disciplina?.codigo?.toLowerCase().includes(termoLower)) return true;
        
        // Busca no nome do monitor via usuario
        if (monitoria?.monitor?.usuario?.nome?.toLowerCase().includes(termoLower)) return true;
        if (monitoria?.monitor?.usuario?.username?.toLowerCase().includes(termoLower)) return true;
        if (monitoria?.monitor?.usuario?.email?.toLowerCase().includes(termoLower)) return true;
        
        if (monitoria?.sala?.toLowerCase().includes(termoLower)) return true;
        
        return false;
      })
    : [];

	const handleResultClick = (tipo, item) => {
	  console.log('Navegando para:', tipo, item);
	  
	  // Fecha os resultados
	  setShowResults(false);
	  setTermo('');
	  inputRef.current?.blur();
	  
	  switch (tipo) {
	    case 'disciplina':
	      // Navega para a página da disciplina
	      navigate(`/disciplina/${item.id}`);
	      break;
	    case 'monitoria':
	      // Navega para a página da disciplina relacionada à monitoria
	      if (item?.disciplina?.id) {
	        navigate(`/disciplina/${item.disciplina.id}`);
	      } else if (item?.disciplinaId) {
	        navigate(`/disciplina/${item.disciplinaId}`);
	      } else {
	        console.error('Monitoria sem disciplina associada:', item);
	      }
	      break;
	    case 'material':
	      if (item.id) navigate(`/material/${item.id}`);
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
      // Se tiver resultados, fecha e limpa
      if (monitoriasFiltradas.length > 0 || disciplinasFiltradas.length > 0 || materiaisFiltrados.length > 0) {
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

  const hasResults = 
    disciplinasFiltradas.length > 0 ||
    materiaisFiltrados.length > 0 ||
    monitoriasFiltradas.length > 0;

  // Mapeia dias da semana
  const diasSemanaMap = {
    'MONDAY': 'Segunda-feira',
    'TUESDAY': 'Terça-feira',
    'WEDNESDAY': 'Quarta-feira',
    'THURSDAY': 'Quinta-feira',
    'FRIDAY': 'Sexta-feira',
    'SATURDAY': 'Sábado',
    'SUNDAY': 'Domingo',
    'SEGUNDA': 'Segunda-feira',
    'TERCA': 'Terça-feira',
    'QUARTA': 'Quarta-feira',
    'QUINTA': 'Quinta-feira',
    'SEXTA': 'Sexta-feira',
    'SABADO': 'Sábado',
    'DOMINGO': 'Domingo'
  };

  return (
    <div className="global-search" ref={searchRef}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Pesquisar disciplinas, monitorias ou monitores..."
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
                    const horarioInicio = monitoria?.horario_inicio;
                    const horarioFim = monitoria?.horario_fim;
                    const horario = horarioInicio && horarioFim 
                      ? `${horarioInicio} - ${horarioFim}`
                      : null;
                    
                    return (
                      <div
                        key={`monitoria-${monitoria.id}`}
                        className="search-result-item"
                        onClick={() => handleResultClick('monitoria', monitoria)}
                      >
                        <div className="search-result-title">
                          <strong>{disciplinaNome || 'Monitoria'}</strong>
                        </div>
                        
                        {monitorNome && (
                          <div className="search-result-monitor">
                             {monitorNome}
                          </div>
                        )}
                        
                        {diaSemana && horario && (
                          <div className="search-result-horario">
                             {diaSemana} • {horario}
                          </div>
                        )}
                        
                        {monitoria?.sala && (
                          <div className="search-result-local">
                             {monitoria.sala}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              )}

              {/* MATERIAIS */}
              {materiaisFiltrados.length > 0 && (
                <>
                  <div className="search-category">
                    MATERIAIS ({materiaisFiltrados.length})
                  </div>

                  {materiaisFiltrados.map((material) => (
                    <div
                      key={`m-${material.id}`}
                      className="search-result-item"
                      onClick={() => handleResultClick('material', material)}
                    >
                      <div className="search-result-title">
                        <strong>{material.titulo}</strong>
                      </div>
                      
                      {material.conteudo && (
                        <div className="search-result-desc">
                          {material.conteudo.substring(0, 100)}
                          {material.conteudo.length > 100 && '...'}
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}

              {/* DISCIPLINAS */}
              {disciplinasFiltradas.length > 0 && (
                <>
                  <div className="search-category">
                    DISCIPLINAS ({disciplinasFiltradas.length})
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
                        <div className="search-result-codigo">
                          Código: {disciplina.codigo}
                        </div>
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
  );
}

export default GlobalSearch;