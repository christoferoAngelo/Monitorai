import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Inicial() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      api.get('/auth/me')
        .then(res => {
          console.log("🔐 Role:", res.data.role);
          
          // 👈 REDIRECIONA PARA DASHBOARDS
          switch(res.data.role) {
            case 'ADMIN':
              navigate('/admin-dashboard');
              break;
            case 'MONITOR':
              navigate('/monitor-dashboard');
              break;
            case 'ALUNO':
              navigate('/aluno-dashboard');
              break;
            default:
              navigate('/disciplinas');
          }
        })
        .catch(err => {
          console.error('Erro:', err);
          localStorage.removeItem('token');
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div style={{
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <div style={{
        width: '60px', height: '60px',
        border: '6px solid rgba(255,255,255,0.3)',
        borderTop: '6px solid white',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '2rem'
      }}></div>
      <h2>Redirecionando...</h2>
    </div>
  );
}

export default Inicial;