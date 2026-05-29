import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

import './login.css';

function Login() {
  const [isLoginView, setIsLoginView] = useState(true);

  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [email, setEmail] = useState('');
  const [ra, setRa] = useState('');

  // ESTADO DO OLHINHO: true = oculta, false = visível
  const [showSenha, setShowSenha] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    setError('');
    setSuccess('');
    // Reseta o olho ao alternar entre Login e Cadastro
    setShowSenha(false); 
  }, [isLoginView]);

  // Função de Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim()) {
      setError('Por favor, preencha o campo de Usuário.');
      return;
    }
    if (!senha) {
      setError('Por favor, preencha o campo de Senha.');
      return;
    }

    try {
      const response = await api.post('/auth/login', { username, senha });
      const tokenGerado = response.data.token;

      localStorage.setItem('token', tokenGerado);
      api.defaults.headers.common['Authorization'] = `Bearer ${tokenGerado}`;

      navigate('/dashboard');
    } catch (error) {
      const msg = error.response?.data || 'Usuário ou senha inválidos';
      setError(typeof msg === 'string' ? msg : 'Usuário ou senha inválidos');
    }
  };

  // Função de Registro
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim()) {
      setError('O Usuário é obrigatório.');
      return;
    }
    if (!email.trim()) {
      setError('O E-mail é obrigatório.');
      return;
    }
    if (!ra.trim()) {
      setError('O RA é obrigatório.');
      return;
    }
    if (!senha) {
      setError('A Senha é obrigatória.');
      return;
    }

    const emailFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailFormatRegex.test(email)) {
      setError("Por favor, insira um formato de e-mail válido (exemplo@dominio.com).");
      return;
    }

    const userRegex = /^[a-zA-Z0-9]+$/;
    if (!userRegex.test(username) || username.length > 20 || username.includes(' ') || username.length < 3) {
      setError("Usuário inválido! Use apenas letras e números (entre 3 e 20 caracteres).");
      return;
    }

    if (!email.endsWith("@fatec.sp.gov.br") && !email.endsWith("@aluno.cps.sp.gov.br")) {
      setError("Por favor, utilize seu e-mail institucional (@fatec.sp.gov.br ou @aluno.cps.sp.gov.br).");
      return;
    }

    const raRegex = /^\d{13}$/;
    if (!raRegex.test(ra)) {
      setError("O RA deve conter exatamente 13 números.");
      return;
    }

    if (senha.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    try {
      await api.post('/auth/register', {
        username,
        email,
        senha,
        ra,
        role: 'ALUNO',
      });

      setSuccess('Cadastro realizado com sucesso! Agora você pode fazer login.');

      setSenha('');
      setEmail('');
      setRa('');
      
      setTimeout(() => {
        setIsLoginView(true);
      }, 2500);

    } catch (error) {
      const msg = error.response?.data || 'Erro ao realizar o cadastro.';
      setError(typeof msg === 'string' ? msg : 'Erro ao realizar o cadastro.');
    }
  };

  return (
    <main className="loginPage">
      <div className="loginShell">
        <section className="loginCard" aria-label="Tela de login">
          <div className="loginHeader">
            <h1 className="loginTitle">{isLoginView ? 'Monitoraí' : 'Crie sua conta!'}</h1>
            <p className="loginSubtitle">
              {isLoginView ? 'Acesse sua conta para continuar.' : 'Cadastre-se para acessar o Monitoraí e aproveitar todos os recursos disponíveis!'}
            </p>
          </div>

          <form
            className="loginForm"
            onSubmit={isLoginView ? handleLogin : handleRegister}
            noValidate
          >
            <div className="field">
              <label className="label" htmlFor="username">Usuário</label>
              <input
                id="username"
                type="text"
                placeholder="Seu usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>

            {!isLoginView && (
              <div className="loginGrid">
                <div className="field">
                  <label className="label" htmlFor="email">E-mail</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="voce@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>

                <div className="field">
                  <label className="label" htmlFor="ra">RA</label>
                  <input
                    id="ra"
                    type="text"
                    placeholder="13 dígitos"
                    maxLength={13}
                    value={ra}
                    onChange={(e) => {
                      const apenasNumeros = e.target.value.replace(/\D/g, '');
                      setRa(apenasNumeros);
                    }}
                    inputMode="numeric"
                    autoComplete="off"
                  />
                </div>
              </div>
            )}

            <div className="field">
              <label className="label" htmlFor="senha">Senha</label>
              {/* Adicionado o container para alinhar o botão */}
              <div className="passwordFieldContainer">
                <input
                  id="senha"
                  // MUDANÇA AQUI: Dinâmico baseado no estado showSenha
                  type={showSenha ? 'text' : 'password'}
                  placeholder="Sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  autoComplete={isLoginView ? 'current-password' : 'new-password'}
                  className="passwordInput"
                />
                {/* Botão de Toggle do Olhinho com imagens da pasta public */}
                <button
                  type="button"
                  className="togglePasswordButton"
                  onClick={() => setShowSenha(!showSenha)}
                  aria-label={showSenha ? "Esconder senha" : "Mostrar senha"}
                >
                  <img 
                    src={showSenha ? "/olho.png" : "/olho_aberto.png"} 
                    alt={showSenha ? "Ícone de esconder senha" : "Ícone de mostrar senha"}
                    className="eyeIcon"
                  />
                </button>
              </div>
            </div>

            <div className={`feedbackContainer ${error || success ? 'show' : ''}`}>
              <div className="feedbackContent">
                {error && <div className="errorMessage" role="alert">{error}</div>}
                {success && <div className="successMessage" role="alert">{success}</div>}
              </div>
            </div>

            <button className="primaryButton" type="submit">
              {isLoginView ? 'Entrar' : 'Cadastrar'}
            </button>
          </form>

          <div className="loginFooter">
            <button
              className="linkButton"
              type="button"
              onClick={() => setIsLoginView(!isLoginView)}
            >
              {isLoginView ? 'Não tem uma conta? Cadastre-se' : 'Já tem conta? Faça login'}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;