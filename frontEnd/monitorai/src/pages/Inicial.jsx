import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Inicial() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Busca os dados do usuário logado no Back-end
    const fetchUsuario = async () => {
      try {
        const response = await api.get('/auth/me');
        setUsuario(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário", error);
        handleLogout(); // Se der erro no token, desloga por segurança
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove o token
    navigate('/'); // Volta para o login
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Painel Principal</h1>
      
      <div style={{ 
        backgroundColor: '#f4f4f4', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '20px' 
      }}>
        <p>Bem-vindo, <strong>{usuario?.username}</strong>!</p>
        <p>Você está logado como: <span style={{ 
          backgroundColor: '#007bff', 
          color: 'white', 
          padding: '2px 8px', 
          borderRadius: '4px',
          fontSize: '0.9rem'
        }}>
          {usuario?.role}
        </span></p>
      </div>

      <button 
        onClick={handleLogout}
        style={{
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Sair do Sistema
      </button>
    </div>
  );
}

export default Inicial;