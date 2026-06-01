import { useEffect, useState } from "react";
import api from "../../../services/api";
import "./Usuarios.css";

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [monitores, setMonitores] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [aba, setAba] = useState('alunos');
    const [busca, setBusca] = useState('');
    const [mostrarModal, setMostrarModal] = useState(false);
    const [usuarioEditando, setUsuarioEditando] = useState(null);
    const [tipoSelecionado, setTipoSelecionado] = useState('ALUNO');
    
    const [form, setForm] = useState({
        username: '',
        email: '',
        senha: '',
        ra: '',
        role: 'ALUNO'
    });

    const [error, setError] = useState('');
    const [showSenha, setShowSenha] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        carregarDados();
    }, []);

    async function carregarDados() {
        try {
            const [resUsers, resMonitores] = await Promise.all([
                api.get('/usuarios'),
                api.get('/monitores/ativos')
            ]);
            setUsuarios(resUsers.data);
            setMonitores(resMonitores.data);
        } catch (err) {
            console.error("Erro:", err);
        }
        setLoading(false);
    }

    function getMonitoriaDoMonitor(usuarioId) {
        const monitor = monitores.find(m => m.usuario?.id === usuarioId);
        if (!monitor) return null;
        
        return {
            disciplina: monitor.disciplina,
            sala: monitor.sala,
            diaSemana: monitor.diaSemana,
            horarioInicio: monitor.horarioInicio,
            horarioFim: monitor.horarioFim
        };
    }

    const usuariosFiltrados = usuarios.filter(u => {
        if (aba === 'alunos' && u.role !== 'ALUNO') return false;
        if (aba === 'monitores' && u.role !== 'MONITOR') return false;
        if (aba === 'admins' && u.role !== 'ADMIN') return false;
        
        if (busca) {
            const termo = busca.toLowerCase();
            if (!u.username?.toLowerCase().includes(termo) && 
                !u.email?.toLowerCase().includes(termo) &&
                !u.ra?.toLowerCase().includes(termo)) return false;
        }
        
        return true;
    });

    const totalAlunos = usuarios.filter(u => u.role === 'ALUNO').length;
    const totalMonitores = usuarios.filter(u => u.role === 'MONITOR').length;
    const totalAdmins = usuarios.filter(u => u.role === 'ADMIN').length;

    function criarNovo(novoTipo) {
        setUsuarioEditando(null);
        setTipoSelecionado(novoTipo);
        setForm({
            username: '',
            email: '',
            senha: '',
            ra: '',
            role: novoTipo
        });
        setError('');
        setMostrarModal(true);
    }

    function editarUsuario(u) {
        setUsuarioEditando(u);
        setTipoSelecionado(u.role);
        setForm({
            username: u.username,
            email: u.email,
            senha: '',
            ra: u.ra || '',
            role: u.role
        });
        setError('');
        setMostrarModal(true);
    }

    async function inativarUsuario(usuario) {
        const msg = usuario.role === 'MONITOR' 
            ? `Inativar o monitor ${usuario.username}?`
            : `Inativar o usuário ${usuario.username}?`;
        
        if (!window.confirm(msg)) return;

        try {
            await api.put(`/usuarios/${usuario.id}/inativar`);
            alert("Usuário inativado!");
            carregarDados();
        } catch (err) {
            alert("Erro ao inativar usuário");
        }
    }

    function handleTipoChange(novoTipo) {
        setTipoSelecionado(novoTipo);
        setForm({
            username: '',
            email: '',
            senha: '',
            ra: '',
            role: novoTipo
        });
        setError('');
    }

    async function salvar(e) {
        e.preventDefault();
        setError('');

        if (!form.username.trim()) {
            setError('O Usuário é obrigatório.');
            return;
        }
        
        const userRegex = /^[a-zA-Z0-9]+$/;
        if (!userRegex.test(form.username) || form.username.length > 20 || form.username.includes(' ') || form.username.length < 3) {
            setError("Usuário inválido! Use apenas letras e números (3 a 20 caracteres).");
            return;
        }

        if (!form.email.trim()) {
            setError('O E-mail é obrigatório.');
            return;
        }

        if (tipoSelecionado === 'ALUNO') {
            if (!form.email.endsWith("@fatec.sp.gov.br") && !form.email.endsWith("@aluno.cps.sp.gov.br")) {
                setError("Use e-mail institucional.");
                return;
            }
            if (!form.ra.trim()) {
                setError('O RA é obrigatório para alunos.');
                return;
            }
            const raRegex = /^\d{13}$/;
            if (!raRegex.test(form.ra)) {
                setError("O RA deve ter 13 dígitos.");
                return;
            }
        }

        if (tipoSelecionado === 'ADMIN') {
            if (!form.email.endsWith("@fatec.sp.gov.br")) {
                setError("Use e-mail institucional.");
                return;
            }
        }

        if (!usuarioEditando && !form.senha) {
            setError('A Senha é obrigatória.');
            return;
        }
        if (form.senha && form.senha.length < 8) {
            setError('A senha deve ter pelo menos 8 caracteres.');
            return;
        }

        try {
            if (usuarioEditando) {
                const data = {
                    username: form.username,
                    email: form.email,
                    role: form.role
                };
                if (form.senha) data.senha = form.senha;
                await api.put(`/usuarios/${usuarioEditando.id}`, data);
                alert("Usuário atualizado!");
            } else {
                await api.post("/auth/register", form);
                alert("Usuário criado com sucesso!");
            }
            setMostrarModal(false);
            carregarDados();
        } catch (err) {
            setError(err.response?.data || "Erro ao salvar usuário");
        }
    }

    if (loading) return <div className="admin-loading">Carregando...</div>;

    const botaoTipo = aba === 'admins' ? 'ADMIN' : 'ALUNO';

    // ==========================================
    // FUNÇÕES DE RENDERIZAÇÃO DA TABELA
    // ==========================================
    const renderTableHeaders = () => {
        if (aba === 'admins') {
            return (
                <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            );
        }
        if (aba === 'monitores') {
            return (
                <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Disciplina</th>
                    <th>Dia</th>
                    <th>Horário</th>
                    <th>Sala</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            );
        }
        // Alunos (Padrão)
        return (
            <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>RA</th>
                <th>Status</th>
                <th>Ações</th>
            </tr>
        );
    };

    return (
        <div className="usuarios-page">
            <div className="page-header">
                <div>
                    <h1>👥 Gerenciamento de Usuários</h1>
                    <p>Cadastre e gerencie alunos e administradores</p>
                </div>
                <button className="btn-new" onClick={() => criarNovo(botaoTipo)}>
                    ➕ Novo Usuário
                </button>
            </div>

            <div className="abas">
                <button className={`aba-btn ${aba === 'alunos' ? 'active' : ''}`} onClick={() => setAba('alunos')}>
                    👨‍🎓 Alunos ({totalAlunos})
                </button>
                <button className={`aba-btn ${aba === 'monitores' ? 'active' : ''}`} onClick={() => setAba('monitores')}>
                    🎓 Monitores ({totalMonitores})
                </button>
                <button className={`aba-btn ${aba === 'admins' ? 'active' : ''}`} onClick={() => setAba('admins')}>
                    ⚙️ Administradores ({totalAdmins})
                </button>
            </div>

            <div className="filters-row">
                <div className="search-box">
                    <span>🔍</span>
                    <input type="text" placeholder="Buscar..." value={busca} onChange={e => setBusca(e.target.value)} />
                </div>
            </div>

            <div className="usuarios-list">
                {usuariosFiltrados.length === 0 ? (
                    <div className="empty-state">
                        <h3>Nenhum usuário encontrado</h3>
                    </div>
                ) : (
                    <table className="usuarios-table">
                        <thead>
                            {renderTableHeaders()}
                        </thead>
                        <tbody>
                            {usuariosFiltrados.map(u => {
                                // Ajuste isAtivo de acordo com o retorno da sua API (ex: u.status === 'ATIVO')
                                const isAtivo = u.ativo !== false; 
                                
                                const acoesNode = (
                                    <div className="action-buttons">
                                        <button className="btn-action btn-edit" onClick={() => editarUsuario(u)} title="Editar">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                        </button>
                                        <button className="btn-action btn-delete" onClick={() => inativarUsuario(u)} title="Inativar">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            </svg>
                                        </button>
                                    </div>
                                );

                                // Renderização específica para ADMIN
                                if (aba === 'admins') {
                                    return (
                                        <tr key={u.id}>
                                            <td><strong>{u.username}</strong></td>
                                            <td>{u.email}</td>
                                            <td><span className={`status-badge ${isAtivo ? 'ativo' : 'inativo'}`}>{isAtivo ? 'Ativo' : 'Inativo'}</span></td>
                                            <td>{acoesNode}</td>
                                        </tr>
                                    );
                                }

                                // Renderização específica para MONITOR
                                if (aba === 'monitores') {
                                    const monitoria = getMonitoriaDoMonitor(u.id);
                                    return (
                                        <tr key={u.id}>
                                            <td><strong>{u.username}</strong></td>
                                            <td>{u.email}</td>
                                            <td>{monitoria?.disciplina?.nome || '—'}</td>
                                            <td>{monitoria?.diaSemana || '—'}</td>
                                            <td>{monitoria ? `${monitoria.horarioInicio} às ${monitoria.horarioFim}` : '—'}</td>
                                            <td>{monitoria?.sala || '—'}</td>
                                            <td><span className={`status-badge ${isAtivo ? 'ativo' : 'inativo'}`}>{isAtivo ? 'Ativo' : 'Inativo'}</span></td>
                                            <td>{acoesNode}</td>
                                        </tr>
                                    );
                                }

                                // Renderização específica para ALUNO (Default)
                                return (
                                    <tr key={u.id}>
                                        <td><strong>{u.username}</strong></td>
                                        <td>{u.email}</td>
                                        <td>{u.ra || '—'}</td>
                                        <td><span className={`status-badge ${isAtivo ? 'ativo' : 'inativo'}`}>{isAtivo ? 'Ativo' : 'Inativo'}</span></td>
                                        <td>{acoesNode}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal - MANTIDO IGUAL AO SEU CÓDIGO ORIGINAL */}
            {mostrarModal && (
                <div className="modal-overlay" onClick={() => setMostrarModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{usuarioEditando ? 'Editar' : 'Novo'} {tipoSelecionado === 'ADMIN' ? 'Administrador' : 'Aluno'}</h2>
                            <button className="modal-close" onClick={() => setMostrarModal(false)}>✕</button>
                        </div>

                        <form onSubmit={salvar}>
                            {!usuarioEditando && (
                                <div className="form-group">
                                    <label>Tipo de Usuário</label>
                                    <div className="tipo-select-group">
                                        <button type="button" className={`tipo-btn ${tipoSelecionado === 'ALUNO' ? 'active' : ''}`} onClick={() => handleTipoChange('ALUNO')}>
                                            👨‍🎓 Aluno
                                        </button>
                                        <button type="button" className={`tipo-btn ${tipoSelecionado === 'ADMIN' ? 'active' : ''}`} onClick={() => handleTipoChange('ADMIN')}>
                                            ⚙️ Administrador
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="form-group">
                                <label>Nome *</label>
                                <input type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
                            </div>

                            <div className="form-group">
                                <label>Email *</label>
                                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                            </div>

                            {tipoSelecionado === 'ALUNO' && (
                                <div className="form-group">
                                    <label>RA *</label>
                                    <input type="text" value={form.ra} onChange={e => setForm({...form, ra: e.target.value.replace(/\D/g, '').slice(0, 13)})} maxLength={13} required />
                                </div>
                            )}

                            <div className="form-group">
                                <label>{usuarioEditando ? 'Nova Senha (opcional)' : 'Senha *'}</label>
                                <div className="passwordFieldContainer">
                                    <input type={showSenha ? 'text' : 'password'} value={form.senha} onChange={e => setForm({...form, senha: e.target.value})} placeholder="Mínimo 8 caracteres" />
                                    <button type="button" className="togglePasswordButton" onClick={() => setShowSenha(!showSenha)}>
                                        <img src={showSenha ? "/olho.png" : "/olho_aberto.png"} alt="Mostrar/Ocultar senha" style={{width: 20, height: 20}} />
                                    </button>
                                </div>
                            </div>

                            {error && <div className="error-message">{error}</div>}

                            <div className="modal-actions">
                                <button type="submit" className="btn-save">{usuarioEditando ? 'Salvar' : 'Criar Usuário'}</button>
                                <button type="button" className="btn-cancel" onClick={() => setMostrarModal(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}