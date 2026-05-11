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

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    setError('');
    setSuccess('');
  }, [isLoginView]);

  // Função de Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validação de campos obrigatórios (Substitutos do 'required')
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

    // 1. Validação de campos vazios (Substitutos do 'required')
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

    // 2. Validação de formato básico de e-mail (Evita coisas como "a@", "a@a" ou "email-invalido")
    const emailFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailFormatRegex.test(email)) {
      setError("Por favor, insira um formato de e-mail válido (exemplo@dominio.com).");
      return;
    }

    // 3. Validação de Usuário (Palavra única, sem especiais)
    const userRegex = /^[a-zA-Z0-9]+$/;
    if (!userRegex.test(username) || username.length > 20 || username.includes(' ') || username.length < 3) {
      setError("Usuário inválido! Use apenas letras e números (entre 3 e 20 caracteres).");
      return;
    }

    // 4. Validação de E-mail Institucional específico
    if (!email.endsWith("@fatec.sp.gov.br") && !email.endsWith("@aluno.cps.sp.gov.br")) {
      setError("Por favor, utilize seu e-mail institucional (@fatec.sp.gov.br ou @aluno.cps.sp.gov.br).");
      return;
    }

    // 5. Validação de RA (Apenas números e 13 dígitos)
    const raRegex = /^\d{13}$/;
    if (!raRegex.test(ra)) {
      setError("O RA deve conter exatamente 13 números.");
      return;
    }

    // 6. Validação de Senha (Tamanho mínimo)
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
            <div className="loginBadge">MonitorAí</div>
            <h1 className="loginTitle">{isLoginView ? 'Login' : 'Cadastro'}</h1>
            <p className="loginSubtitle">
              {isLoginView ? 'Acesse sua conta para continuar.' : 'Crie sua conta em poucos segundos.'}
            </p>
          </div>

          {/* O segredo está aqui: noValidate desativa os balões nativos chatos do navegador */}
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
              <input
                id="senha"
                type="password"
                placeholder="Sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                autoComplete={isLoginView ? 'current-password' : 'new-password'}
              />
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