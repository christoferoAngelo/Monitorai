import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Login() {
  // Estado para alternar entre as telas (true = Login, false = Registro)
  const [isLoginView, setIsLoginView] = useState(true);

  // Estados para o formulário
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [email, setEmail] = useState('');
  const [ra, setRa] = useState('');
  
  const navigate = useNavigate();

  // Função de Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { username, senha });
      const tokenGerado = response.data.token; // Armazene em uma constante

      localStorage.setItem('token', tokenGerado);
      api.defaults.headers.common['Authorization'] = `Bearer ${tokenGerado}`;

      navigate('/dashboard');
    } catch (error) {
      alert("Usuário ou senha inválidos");
    }
  };

  // Função de Registro
  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validação básica do Front-end
    if (ra.length !== 13) {
        alert("O RA deve conter exatamente 13 caracteres.");
        return;
    }

    try {
      await api.post('/auth/register', { 
          username, 
          email, 
          senha, 
          ra,
          role: 'ALUNO' // Por padrão, todo mundo que se cadastra pelo site é ALUNO
      });
      
      alert("Cadastro realizado com sucesso! Agora você pode fazer login.");
      // Limpa as senhas/email e volta pra tela de login
      setSenha('');
      setEmail('');
      setRa('');
      setIsLoginView(true); 

    } catch (error) {
      // Pega a mensagem de erro que o Spring Boot mandou (ex: "Usuário já existe")
      alert(error.response?.data || "Erro ao realizar o cadastro.");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>{isLoginView ? 'Login - MonitorAi' : 'Cadastro - MonitorAi'}</h1>
      
      <form 
        onSubmit={isLoginView ? handleLogin : handleRegister} 
        style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
      >
        <input 
          type="text" 
          placeholder="Usuário" 
          value={username}
          onChange={(e) => setUsername(e.target.value)} 
          required
        />

        {/* Campos extras que só aparecem no Cadastro */}
        {!isLoginView && (
          <>
            <input 
              type="email" 
              placeholder="E-mail" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
            <input 
              type="text" 
              placeholder="RA (13 dígitos)" 
              maxLength={13}
              value={ra}
              onChange={(e) => setRa(e.target.value)} 
              required
            />
          </>
        )}

        <input 
          type="password" 
          placeholder="Senha" 
          value={senha}
          onChange={(e) => setSenha(e.target.value)} 
          required
        />

        <button type="submit" style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
            {isLoginView ? 'Entrar' : 'Cadastrar'}
        </button>
      </form>

      {/* Botão para alternar entre as telas */}
      <button 
        onClick={() => setIsLoginView(!isLoginView)}
        style={{ marginTop: '10px', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
      >
        {isLoginView ? 'Não tem uma conta? Cadastre-se' : 'Já tem conta? Faça login'}
      </button>
    </div>
  );
}

export default Login;