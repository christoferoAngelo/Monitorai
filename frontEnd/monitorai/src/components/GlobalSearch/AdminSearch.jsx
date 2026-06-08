/* eslint-disable react-hooks/immutability */
/* eslint-disable no-unused-vars */
import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './AdminSearch.css';
// src/components/GlobalSearch/AdminSearch.jsx
import { useUsuario } from './UsuarioContext'; 

function AdminSearch() {
  const [termo, setTermo] = useState('');
  const [disciplinas, setDisciplinas] = useState([]);
  const [monitorias, setMonitorias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
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

      const monitoriasRes = await api.get('/monitorias');
      setMonitorias(monitoriasRes.data || []);
      
      const usuariosRes = await api.get('/usuarios');
      setUsuarios(usuariosRes.data || []);
      
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

  const monitoriasFiltradas = Array.isArray(monitorias)
    ? monitorias.filter((monitoria) => {
        const termoLower = termo.toLowerCase();
        
        if (monitoria?.disciplina?.nome?.toLowerCase().includes(termoLower)) return true;
        if (monitoria?.monitor?.usuario?.nome?.toLowerCase().includes(termoLower)) return true;
        if (monitoria?.monitor?.usuario?.username?.toLowerCase().includes(termoLower)) return true;
        if (monitoria?.sala?.toLowerCase().includes(termoLower)) return true;
        
        return false;
      })
    : [];

  const usuariosFiltrados = Array.isArray(usuarios)
    ? usuarios.filter((usuario) => {
        const termoLower = termo.toLowerCase();
        
        return (
          usuario?.nome?.toLowerCase().includes(termoLower) ||
          usuario?.email?.toLowerCase().includes(termoLower) ||
          usuario?.username?.toLowerCase().includes(termoLower) ||
          usuario?.role?.toLowerCase().includes(termoLower)
        );
      })
    : [];

	const handleResultClick = (tipo, item) => {
	  console.log('Admin navegando para:', tipo, item);
	  
	  setShowResults(false);
	  setTermo('');
	  inputRef.current?.blur();
	  
	  switch (tipo) {
	    case 'disciplina':
			navigate(`/grade-curricular?tab=disciplinas&editar=${item.id}`);
	      break;
	    case 'monitoria':
	      if (item?.disciplina?.id) {
	        navigate(`/disciplina/${item.disciplina.id}`);
	      } else if (item?.disciplinaId) {
	        navigate(`/disciplina/${item.disciplinaId}`);
	      } else {
	        console.error('Monitoria sem disciplina associada:', item);
	      }
	      break;
	    case 'usuario':
	      // Vai para a página de edição de usuário com o ID
		  navigate('/admin-usuarios', { state: { usuarioParaEditar: item } }); break;
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
      if (monitoriasFiltradas.length > 0 || disciplinasFiltradas.length > 0 || usuariosFiltrados.length > 0) {
        setShowResults(false);
        setTermo('');
        inputRef.current?.blur();
      }
    }
  };

  const hasResults = 
    disciplinasFiltradas.length > 0 ||
    monitoriasFiltradas.length > 0 ||
    usuariosFiltrados.length > 0;

  return (
    <div className="admin-search" ref={searchRef}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Buscar disciplinas, monitorias ou usuários..."
        value={termo}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        onFocus={() => termo.trim() !== '' && setShowResults(true)}
        className="admin-search-input"
      />

      {showResults && termo.trim() !== '' && (
        <div className="admin-search-results">
          {isLoading && (
            <div className="admin-search-loading">Carregando...</div>
          )}

          {!isLoading && (
            <>
              {/* USUÁRIOS */}
              {usuariosFiltrados.length > 0 && (
                <>
                  <div className="admin-search-category">
                    USUÁRIOS ({usuariosFiltrados.length})
                  </div>

                  {usuariosFiltrados.map((usuario) => (
                    <div
                      key={`user-${usuario.id}`}
                      className="admin-search-result-item"
                      onClick={() => handleResultClick('usuario', usuario)}
                    >
                      <div className="admin-search-result-content">
                        <div className="admin-search-result-title">
                          <strong>{usuario.nome || usuario.username}</strong>
                        </div>
                        <div className="admin-search-result-subtitle">
                          {usuario.email} • {usuario.role || 'Usuário'}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* MONITORIAS */}
              {monitoriasFiltradas.length > 0 && (
                <>
                  <div className="admin-search-category">
                    MONITORIAS ({monitoriasFiltradas.length})
                  </div>

                  {monitoriasFiltradas.map((monitoria) => {
                    const disciplinaNome = monitoria?.disciplina?.nome || 'Monitoria';
                    const monitorNome = monitoria?.monitor?.usuario?.nome || 'N/A';
                    
                    return (
                      <div
                        key={`monitoria-${monitoria.id}`}
                        className="admin-search-result-item"
                        onClick={() => handleResultClick('monitoria', monitoria)}
                      >
                        <div className="admin-search-result-content">
                          <div className="admin-search-result-title">
                            <strong>{disciplinaNome}</strong>
                            <span className={`admin-search-badge ${monitoria?.ativa ? 'active' : 'inactive'}`}>
                              {monitoria?.ativa ? 'Ativa' : 'Inativa'}
                            </span>
                          </div>
                          <div className="admin-search-result-subtitle">
                            Monitor: {monitorNome} • Sala: {monitoria?.sala || 'N/A'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

              {/* DISCIPLINAS */}
              {disciplinasFiltradas.length > 0 && (
                <>
                  <div className="admin-search-category">
                    DISCIPLINAS ({disciplinasFiltradas.length})
                  </div>

                  {disciplinasFiltradas.map((disciplina) => (
                    <div
                      key={`d-${disciplina.id}`}
                      className="admin-search-result-item"
                      onClick={() => handleResultClick('disciplina', disciplina)}
                    >
                      <div className="admin-search-result-content">
                        <div className="admin-search-result-title">
                          <strong>{disciplina.nome}</strong>
                        </div>
                        {disciplina.codigo && (
                          <div className="admin-search-result-subtitle">
                            Código: {disciplina.codigo}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* NENHUM RESULTADO */}
              {!hasResults && (
                <div className="admin-search-no-results">
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

export default AdminSearch;