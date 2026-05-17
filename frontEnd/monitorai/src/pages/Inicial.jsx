import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';


function Inicial() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
        api.get('/auth/me')
           .then(res => {
              console.log("DADOS DO USUARIO:", res.data);
               setUsuario(res.data);
               setLoading(false); // <--- Importante!
           })
           .catch(err => {
               console.error(err);
               localStorage.removeItem('token'); // Se deu erro, o token pode estar podre
               navigate('/');
           });
    } else {
        navigate('/');
    }
}, [navigate]);
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove o token
    navigate('/'); // Volta para o login
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Painel</h1>
      
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
	  
	  
	  
	  {
    //  só adm poder acessar
       usuario?.role === 'ADMIN' && (
         <>
		 
			 
           <button onClick={() => navigate("/cursos")}>
             Gerenciar Cursos
           </button> <br></br>
		  
		   
           <button onClick={() => navigate("/alunos")}>
             Gerenciar Alunos
           </button> <br></br>
		   
		   <button onClick={() => navigate("/disciplinas")}>
		   	       Gerenciar Disciplinas
		   	     </button> <br></br>
        
        <button onClick={() => navigate("/monitorias")}>
		   	       Gerenciar Monitorias
		   	     </button> <br></br>
		   { (usuario?.role === 'ADMIN' || usuario?.role === 'MONITOR') && (
    <button 
      onClick={() => navigate("/relatorios/novo")}
      style={{ backgroundColor: '#28a745', color: 'white', marginTop: '10px' }}
    >
      {usuario?.role === 'ADMIN' ? "Gerenciar Relatórios (Geral)" : "Registrar Minha Atividade"}
    </button>
)}
		  
         </>
       )
    }

    {
        // Menu exclusivo do Monitor
        usuario?.role === 'MONITOR' && (
          <>
             <button 
               onClick={() => navigate("/meus-materiais")}
               style={{ backgroundColor: '#8b5cf6', color: 'white', marginBottom: '10px' }}
             >
               Gerenciar Meus Materiais
             </button> <br></br>
			 
			 <button 
			            onClick={() => navigate("/gerenciar-recursos")}
			            style={{ backgroundColor: '#8b5cf6', color: 'white', marginBottom: '10px', width: '100%' }}
			          >
			            Gerenciar Recursos (PDFs e Quizzes)
			          </button> <br />
			 		 
			 
          </>
        )
      }
	  
	  
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