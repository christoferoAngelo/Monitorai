import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './GlobalSearch.css';

// Mapa para traduzir os dias da semana vindos do back-end
const diasSemanaMap = {
  'MONDAY': 'Segunda-feira', 'TUESDAY': 'Terça-feira', 'WEDNESDAY': 'Quarta-feira',
  'THURSDAY': 'Quinta-feira', 'FRIDAY': 'Sexta-feira', 'SATURDAY': 'Sábado', 'SUNDAY': 'Domingo',
  'SEGUNDA': 'Segunda-feira', 'TERCA': 'Terça-feira', 'QUARTA': 'Quarta-feira',
  'QUINTA': 'Quinta-feira', 'SEXTA': 'Sexta-feira', 'SABADO': 'Sábado', 'DOMINGO': 'Domingo'
};

// Utilitário para formatar o LocalTime do Java (ex: "14:00:00" para "14:00")
const formatarHora = (hora) => {
  if (!hora) return '';
  return hora.length > 5 ? hora.substring(0, 5) : hora;
};

function GlobalSearch({ onClose }) {
  const [termo, setTermo] = useState('');
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
      // Como o backend já devolve a lista de MonitoriaResponseDTO, 
      // basta salvar direto no estado.
      const response = await api.get('/monitorias/ativas');
      setMonitorias(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar monitorias:', error);
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

  // Filtro otimizado usando os campos exatos da sua DTO Java
  const monitoriasFiltradas = useMemo(() => {
    if (!termo) return [];
    const t = termo.toLowerCase();
    
    return monitorias.filter((m) => 
      (m.disciplinaNome && m.disciplinaNome.toLowerCase().includes(t)) ||
      (m.disciplinaCodigo && m.disciplinaCodigo.toLowerCase().includes(t)) ||
      (m.monitorNome && m.monitorNome.toLowerCase().includes(t)) ||
      (m.sala && m.sala.toLowerCase().includes(t))
    );
  }, [monitorias, termo]);

  const handleResultClick = (monitoria) => {
    if (onClose) onClose(); 
    // Usando o disciplinaId da DTO para o redirecionamento
    if (monitoria.disciplinaId) {
      navigate(`/disciplina/${monitoria.disciplinaId}`);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setTermo(value);
    setShowResults(value.trim() !== '');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (monitoriasFiltradas.length > 0) {
        setShowResults(false);
        setTermo('');
        inputRef.current?.blur();
      }
    }
  };

  const hasResults = monitoriasFiltradas.length > 0;

  return (
    <div className="global-search" ref={searchRef}>
      
      <div className="search-input-wrapper">
        <button className="close-search-btn" onClick={() => onClose && onClose()} title="Fechar pesquisa">
          <img src="/icone_voltar.png" alt="Voltar" width="20" height="20" />
        </button>

        <div className="input-and-results-container">
          <input
            ref={inputRef}
            type="text"
            placeholder="Pesquisar monitorias ativas (disciplina, monitor, sala)..."
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
                  {hasResults && (
                    <>
                      <div className="search-category">
                        MONITORIAS ATIVAS ({monitoriasFiltradas.length})
                      </div>

                      {monitoriasFiltradas.map((m) => {
                        // Tratando a exibição usando a DTO
                        const diaStr = diasSemanaMap[m.diaSemana] || m.diaSemana;
                        const horarioStr = m.horarioInicio && m.horarioFim 
                          ? `${formatarHora(m.horarioInicio)} - ${formatarHora(m.horarioFim)}` 
                          : null;

                        return (
                          <div
                            key={`monitoria-${m.id}`}
                            className="search-result-item"
                            onClick={() => handleResultClick(m)}
                          >
                            <div className="search-result-title">
                              <strong>{m.disciplinaNome}</strong>
                              {m.disciplinaCodigo && <span className="codigo-badge"> {m.disciplinaCodigo}</span>}
                            </div>
                            
                            <div className="search-result-monitor">Monitor(a): {m.monitorNome}</div>
                            
                            {diaStr && horarioStr && (
                              <div className="search-result-horario">
                                {diaStr} • {horarioStr}
                              </div>
                            )}
                            
                            {m.sala && <div className="search-result-local">Sala: {m.sala}</div>}
                          </div>
                        );
                      })}
                    </>
                  )}

                  {!hasResults && (
                    <div className="search-no-results">
                      Nenhuma monitoria encontrada para "{termo}"
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