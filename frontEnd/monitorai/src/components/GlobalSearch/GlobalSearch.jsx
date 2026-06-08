import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './GlobalSearch.css';

function GlobalSearch() {
  const [termo, setTermo] = useState('');
  const [disciplinas, setDisciplinas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    carregarDisciplinas();
  }, []);

  const carregarDisciplinas = async () => {
    try {
      const response = await api.get('/disciplinas');
      setDisciplinas(response.data);
    } catch (error) {
      console.error('Erro ao carregar disciplinas:', error);
    }
  };

  const resultados = disciplinas.filter((disciplina) =>
    disciplina.nome?.toLowerCase().includes(termo.toLowerCase())
  );

  return (
    <div className="global-search">
      <input
        type="text"
        placeholder="Pesquisar disciplina..."
        value={termo}
        onChange={(e) => setTermo(e.target.value)}
        className="global-search-input"
      />

      {termo.trim() !== '' && (
        <div className="search-results">
          {resultados.length > 0 ? (
            resultados.map((disciplina) => (
              <div
                key={disciplina.id}
                className="search-result-item"
                onClick={() => navigate(`/disciplina/${disciplina.id}`)}
              >
                {disciplina.nome}
              </div>
            ))
          ) : (
            <div className="search-no-results">
              Nenhuma disciplina encontrada
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GlobalSearch;