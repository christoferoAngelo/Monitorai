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
  
  // Estados para redefinição de senha
  const [precisaRedefinir, setPrecisaRedefinir] = useState(false);
  const [usuarioId, setUsuarioId] = useState(null);
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  // Modal de solicitar redefinição
  const [mostrarModalEsqueci, setMostrarModalEsqueci] = useState(false);
  const [userEsqueci, setUserEsqueci] = useState('');

  const [showSenha, setShowSenha] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    setError('');
    setSuccess('');
    setShowSenha(false);
  }, [isLoginView]);

  // Função para verificar se precisa redefinir senha
  async function verificarRedefinicao(userId) {
    try {
      const response = await api.get(`/usuarios/${userId}/verificar-senha`);
      if (response.data.precisaRedefinir) {
        setPrecisaRedefinir(true);
        setUsuarioId(userId);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Erro ao verificar redefinição:", err);
      return false;
    }
  }

  // Função para solicitar redefinição de senha
  const handleSolicitarRedefinicao = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!userEsqueci.trim()) {
      setError('Preencha seu usuário ou e-mail.');
      return;
    }

    try {
      // Busca o usuário pelo username ou email
      const usuarios = await api.get('/usuarios');
      const usuario = usuarios.data.find(u => 
        u.username === userEsqueci || u.email === userEsqueci
      );

      if (!usuario) {
        setError('Usuário não encontrado.');
        return;
      }

      if (usuario.role === 'ADMIN') {
        setError('Administradores não podem solicitar redefinição.');
        return;
      }

      await api.put(`/usuarios/${usuario.id}/solicitar-redefinicao`);
      
      setSuccess('Solicitação enviada! Entre em contato com o administrador para aprovar.');
      setMostrarModalEsqueci(false);
      setUserEsqueci('');

    } catch (err) {
      const msg = err.response?.data || 'Erro ao solicitar redefinição.';
      setError(typeof msg === 'string' ? msg : 'Erro ao solicitar redefinição.');
    }
  };

  // Função de Login
const handleLogin = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  if (!username.trim()) {
    setError('Por favor, preencha o campo de Email ou Usuário.');
    return;
  }

  // Primeiro: verifica se TEM AUTORIZAÇÃO para redefinir
  try {
    // Aceita email OU username
    const verif = await api.get(`/usuarios/verificar-solicitacao?termo=${username}`);
    const dados = verif.data;
    
    // Se já tem autorização aprovada, vai direto para redefinição
    if (dados.existe && dados.aprovado) {
      setPrecisaRedefinir(true);
      setUsuarioId(dados.userId);
      setSuccess('Você tem autorização para redefinir a senha. Defina uma nova senha.');
      return;
    }
  } catch (err) {
    // Continua normal se não conseguir verificar
  }

  // Segundo: tenta fazer login normal (só aqui precisa da senha)
  if (!senha) {
    setError('Por favor, preencha o campo de Senha.');
    return;
  }

  try {
      const response = await api.post('/auth/login', { username, senha });
      const tokenGerado = response.data.token;

      localStorage.setItem('token', tokenGerado);
      api.defaults.headers.common['Authorization'] = `Bearer ${tokenGerado}`;

      const userResponse = await api.get('/auth/me/perfil');
      const userId = userResponse.data.id;
      
      const precisa = await verificarRedefinicao(userId);
      
      if (precisa) {
        setSuccess('Você precisa definir uma nova senha.');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      // NOVA LÓGICA DE CAPTURA DE ERRO AQUI:
      const status = error.response?.status;
      const dataMsg = error.response?.data;

      // Se o backend retornou 403 (Forbidden), é porque o usuário está inativo
      if (status === 403) {
        setError(typeof dataMsg === 'string' ? dataMsg : 'Sua conta está inativa.');
        return; // Para a execução aqui, não tenta fazer as validações de senha abaixo
      }

      // Login falhou por outros motivos (senha errada, etc) - continua sua lógica original
      try {
        const verif = await api.get(`/usuarios/verificar-solicitacao?termo=${username}`);
        const dados = verif.data;
        
        if (dados.existe && dados.aprovado) {
          setPrecisaRedefinir(true);
          setSuccess('Senha incorreta. Você tem autorização para redefinir! Defina uma nova senha.');
        } else if (dados.existe && dados.temSolicitacao) {
          setError('Senha incorreta. Sua solicitação está aguardando aprovação.');
        } else {
          setError('Email/Usuário ou senha inválidos');
        }
      } catch {
        // Se a própria requisição da mensagem der erro ou retornar mensagem customizada do backend
        setError(typeof dataMsg === 'string' ? dataMsg : 'Email/Usuário ou senha inválidos');
      }
    }
  };

  // Função de redefinir senha
  const handleRedefinirSenha = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!novaSenha) {
      setError('Digite a nova senha.');
      return;
    }
    if (novaSenha.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.');
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setError('As senhas não conferem.');
      return;
    }

    try {
      await api.put(`/usuarios/${usuarioId}/nova-senha`, {
        novaSenha: novaSenha
      });

      setSuccess('Senha redefinida com sucesso! Faça login.');
      setPrecisaRedefinir(false);
      setNovaSenha('');
      setConfirmarSenha('');
      setSenha('');
      setUsername('');
      
      setTimeout(() => {
        setIsLoginView(true);
      }, 2000);

    } catch (error) {
      const msg = error.response?.data || 'Erro ao redefinir senha.';
      setError(typeof msg === 'string' ? msg : 'Erro ao redefinir senha.');
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
      setError("Por favor, insira um formato de e-mail válido.");
      return;
    }

    const userRegex = /^[a-zA-Z0-9]+$/;
    if (!userRegex.test(username) || username.length > 20 || username.includes(' ') || username.length < 3) {
      setError("Usuário inválido! Use apenas letras e números (entre 3 e 20 caracteres).");
      return;
    }

    if (!email.endsWith("@fatec.sp.gov.br") && !email.endsWith("@aluno.cps.sp.gov.br")) {
      setError("Use e-mail institucional (@fatec.sp.gov.br ou @aluno.cps.sp.gov.br).");
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
            <h1 className="loginTitle">
              {precisaRedefinir 
                ? 'Redefina sua Senha' 
                : isLoginView ? 'Monitoraí' : 'Crie sua conta!'}
            </h1>
            <p className="loginSubtitle">
              {precisaRedefinir 
                ? 'Sua senha expirou. Defina uma nova senha para continuar.'
                : isLoginView 
                  ? 'Acesse sua conta para continuar.' 
                  : 'Cadastre-se para acessar o Monitoraí!'}
            </p>
          </div>

          <form
            className="loginForm"
            onSubmit={
              precisaRedefinir 
                ? handleRedefinirSenha 
                : isLoginView ? handleLogin : handleRegister
            }
            noValidate
          >
            {precisaRedefinir ? (
              <>
                <div className="field">
                  <label className="label" htmlFor="novaSenha">Nova Senha</label>
                  <div className="passwordFieldContainer">
                    <input
                      id="novaSenha"
                      type={showSenha ? 'text' : 'password'}
                      placeholder="Mínimo 8 caracteres"
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                      className="passwordInput"
                    />
                    <button
                      type="button"
                      className="togglePasswordButton"
                      onClick={() => setShowSenha(!showSenha)}
                    >
                      <img 
                        src={showSenha ? "/olho.png" : "/olho_aberto.png"} 
                        alt="Mostrar/Ocultar"
                        className="eyeIcon"
                      />
                    </button>
                  </div>
                </div>

                <div className="field">
                  <label className="label" htmlFor="confirmarSenha">Confirmar Nova Senha</label>
                  <div className="passwordFieldContainer">
                    <input
                      id="confirmarSenha"
                      type={showSenha ? 'text' : 'password'}
                      placeholder="Digite a nova senha novamente"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      className="passwordInput"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
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
              </>
            )}

            {!precisaRedefinir && (
              <div className="field">
                <label className="label" htmlFor="senha">Senha</label>
                <div className="passwordFieldContainer">
                  <input
                    id="senha"
                    type={showSenha ? 'text' : 'password'}
                    placeholder="Sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    autoComplete={isLoginView ? 'current-password' : 'new-password'}
                    className="passwordInput"
                  />
                  <button
                    type="button"
                    className="togglePasswordButton"
                    onClick={() => setShowSenha(!showSenha)}
                  >
                    <img 
                      src={showSenha ? "/olho.png" : "/olho_aberto.png"} 
                      alt={showSenha ? "Esconder" : "Mostrar"}
                      className="eyeIcon"
                    />
                  </button>
                </div>
              </div>
            )}

            <div className={`feedbackContainer ${error || success ? 'show' : ''}`}>
              <div className="feedbackContent">
                {error && <div className="errorMessage" role="alert">{error}</div>}
                {success && <div className="successMessage" role="alert">{success}</div>}
              </div>
            </div>

            <button className="primaryButton" type="submit">
              {precisaRedefinir 
                ? 'Definir Nova Senha' 
                : isLoginView ? 'Entrar' : 'Cadastrar'}
            </button>
          </form>

<div className="loginFooter">
  {!precisaRedefinir && (
    <>
      {isLoginView && (
        <button
          className="linkButton"
          type="button"
          onClick={() => setMostrarModalEsqueci(true)}
        >
          Esqueceu a senha?
        </button>
      )}
      <button
        className="linkButton"
        type="button"
        onClick={() => setIsLoginView(!isLoginView)}
      >
        {isLoginView ? 'Não tem uma conta? Cadastre-se' : 'Já tem conta? Faça login'}
      </button>
    </>
  )}
</div>
        </section>
      </div>

      {/* MODAL DE ESQUECI A SENHA */}
      {mostrarModalEsqueci && (
        <div className="modal-overlay" onClick={() => setMostrarModalEsqueci(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Esqueceu a senha?</h2>
              <button className="modal-close" onClick={() => setMostrarModalEsqueci(false)}>✕</button>
            </div>
            
            <p style={{ marginBottom: '16px', color: '#64748b' }}>
              Digite seu usuário ou e-mail institucional para solicitar a redefinição de senha. O administrador recibirá sua solicitação.
            </p>

            <form onSubmit={handleSolicitarRedefinicao}>
              <div className="field">
                <label className="label" htmlFor="userEsqueci">Usuário ou E-mail</label>
                <input
                  id="userEsqueci"
                  type="text"
                  placeholder="Seu usuário ou e-mail"
                  value={userEsqueci}
                  onChange={(e) => setUserEsqueci(e.target.value)}
                />
              </div>

              <div className="feedbackContainer">
                {error && <div className="errorMessage">{error}</div>}
                {success && <div className="successMessage">{success}</div>}
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-save">Solicitar Redefinição</button>
                <button type="button" className="btn-cancel" onClick={() => setMostrarModalEsqueci(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default Login;