import { useState, useEffect } from "react";
import api from "../../../services/api";

export default function UsuarioModal({ 
    isOpen, 
    onClose, 
    onSuccess, 
    usuarioEditando, 
    tipoInicial 
}) {
    const [tipoSelecionado, setTipoSelecionado] = useState(tipoInicial || 'ALUNO');
    const [form, setForm] = useState({
        username: '',
        email: '',
        senha: '',
        ra: '',
        role: tipoInicial || 'ALUNO'
    });
    
    // Novos campos para segurança
    const [senhaAtual, setSenhaAtual] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [erroConfirmacao, setErroConfirmacao] = useState('');
    
    const [error, setError] = useState('');
    const [showSenha, setShowSenha] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (usuarioEditando) {
                setTipoSelecionado(usuarioEditando.role);
                setForm({
                    username: usuarioEditando.username,
                    email: usuarioEditando.email,
                    senha: '',
                    ra: usuarioEditando.ra || '',
                    role: usuarioEditando.role
                });
            } else {
                setTipoSelecionado(tipoInicial);
                setForm({
                    username: '',
                    email: '',
                    senha: '',
                    ra: '',
                    role: tipoInicial
                });
            }
            // Limpa campos de senha
            setSenhaAtual('');
            setConfirmarSenha('');
            setErroConfirmacao('');
            setError('');
            setShowSenha(false);
        }
    }, [isOpen, usuarioEditando, tipoInicial]);

    function handleTipoChange(novoTipo) {
        setTipoSelecionado(novoTipo);
        setForm({
            username: '',
            email: '',
            senha: '',
            ra: '',
            role: novoTipo
        });
        setSenhaAtual('');
        setConfirmarSenha('');
        setError('');
    }

    async function salvar(e) {
        e.preventDefault();
        setError('');
        setErroConfirmacao('');

        // Validações básicas
        if (!form.username.trim()) {
            return setError('O Usuário é obrigatório.');
        }
        
        const userRegex = /^[a-zA-Z0-9]+$/;
        if (!userRegex.test(form.username) || form.username.length > 20 || form.username.includes(' ') || form.username.length < 3) {
            return setError("Usuário inválido! Use apenas letras e números (3 a 20 caracteres).");
        }

        if (!form.email.trim()) {
            return setError('O E-mail é obrigatório.');
        }

        if (tipoSelecionado === 'ALUNO') {
            if (!form.email.endsWith("@fatec.sp.gov.br") && !form.email.endsWith("@aluno.cps.sp.gov.br")) {
                return setError("Use e-mail institucional.");
            }
            if (!form.ra.trim()) {
                return setError('O RA é obrigatório para alunos.');
            }
            const raRegex = /^\d{13}$/;
            if (!raRegex.test(form.ra)) {
                return setError("O RA deve ter 13 dígitos.");
            }
        }

        if (tipoSelecionado === 'ADMIN') {
            if (!form.email.endsWith("@fatec.sp.gov.br")) {
                return setError("Use e-mail institucional.");
            }
        }

        // ========== VALIDAÇÕES DE SENHA ==========
        
        if (!usuarioEditando) {
            // CRIAR USUÁRIO: senha obrigatória + confirmação
            if (!form.senha) {
                return setError('A Senha é obrigatória.');
            }
            if (form.senha.length < 8) {
                return setError('A senha deve ter pelo menos 8 caracteres.');
            }
            if (form.senha !== confirmarSenha) {
                return setErroConfirmacao('As senhas não conferem!');
            }
        } else {
            // EDITAR USUÁRIO: se quiser mudar senha
            if (form.senha || senhaAtual || confirmarSenha) {
                // Se preencher pelo menos um campo de senha, todos são obrigatórios
                if (!senhaAtual) {
                    return setError('Digite a senha atual.');
                }
                if (!form.senha) {
                    return setError('Digite a nova senha.');
                }
                if (form.senha.length < 8) {
                    return setError('A nova senha deve ter pelo menos 8 caracteres.');
                }
                if (form.senha !== confirmarSenha) {
                    return setErroConfirmacao('As senhas não conferem!');
                }
            }
        }

        // ========== ENVIO PARA API ==========
        
        try {
            if (usuarioEditando) {
                if (form.senha) {
                    // Tem senha para alterar - usa endpoint específico
                    await api.put(`/usuarios/${usuarioEditando.id}/senha`, {
                        senhaAtual: senhaAtual,
                        novaSenha: form.senha
                    });
                    alert("Senha alterada com sucesso!");
                }
                
                // Sempre atualiza username, email e role
                const data = {
                    username: form.username,
                    email: form.email,
                    role: form.role
                };
                await api.put(`/usuarios/${usuarioEditando.id}`, data);
                alert("Usuário atualizado!");
            } else {
                await api.post("/auth/register", {
                    ...form,
                    ra: tipoSelecionado === 'ALUNO' ? form.ra : null
                });
                alert("Usuário criado com sucesso!");
            }
            
            onSuccess(); 
        } catch (err) {
            const msg = err.response?.data || "Erro ao salvar usuário";
            setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
        }
    }

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{usuarioEditando ? 'Editar' : 'Novo'} {tipoSelecionado === 'ADMIN' ? 'Administrador' : 'Aluno'}</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={salvar}>
                    {!usuarioEditando && (
                        <div className="form-group">
                            <label>Tipo de Usuário</label>
                            <div className="tipo-select-group">
                                <button 
                                    type="button" 
                                    className={`tipo-btn ${tipoSelecionado === 'ALUNO' ? 'active' : ''}`} 
                                    onClick={() => handleTipoChange('ALUNO')}
                                >
                                    👨‍🎓 Aluno
                                </button>
                                <button 
                                    type="button" 
                                    className={`tipo-btn ${tipoSelecionado === 'ADMIN' ? 'active' : ''}`} 
                                    onClick={() => handleTipoChange('ADMIN')}
                                >
                                    ⚙️ Administrador
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Nome *</label>
                        <input 
                            type="text" 
                            value={form.username} 
                            onChange={e => setForm({...form, username: e.target.value})} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Email *</label>
                        <input 
                            type="email" 
                            value={form.email} 
                            onChange={e => setForm({...form, email: e.target.value})} 
                            required 
                        />
                    </div>

                    {tipoSelecionado === 'ALUNO' && (
                        <div className="form-group">
                            <label>RA *</label>
                            <input 
                                type="text" 
                                value={form.ra} 
                                onChange={e => setForm({...form, ra: e.target.value.replace(/\D/g, '').slice(0, 13)})} 
                                maxLength={13} 
                                required 
                            />
                        </div>
                    )}

                    {/* ========== CAMPOS DE SENHA ========== */}
                    
                    {usuarioEditando && form.senha && (
                        <div className="form-group">
                            <label>Senha Atual *</label>
                            <div className="passwordFieldContainer">
                                <input 
                                    type={showSenha ? 'text' : 'password'} 
                                    value={senhaAtual} 
                                    onChange={e => setSenhaAtual(e.target.value)} 
                                    placeholder="Digite a senha atual"
                                />
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label>
                            {usuarioEditando ? 'Nova Senha' : 'Senha *'}
                            {usuarioEditando && <span className="label-hint"> (deixe em branco para manter a atual)</span>}
                        </label>
                        <div className="passwordFieldContainer">
                            <input 
                                type={showSenha ? 'text' : 'password'} 
                                value={form.senha} 
                                onChange={e => setForm({...form, senha: e.target.value})} 
                                placeholder={usuarioEditando ? "Nova senha (mínimo 8 caracteres)" : "Mínimo 8 caracteres"}
                            />
                            <button type="button" className="togglePasswordButton" onClick={() => setShowSenha(!showSenha)}>
                                <img src={showSenha ? "/olho.png" : "/olho_aberto.png"} alt="Mostrar/Ocultar senha" style={{width: 20, height: 20}} />
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>
                            {usuarioEditando ? 'Confirmar Nova Senha' : 'Confirmar Senha *'}
                        </label>
                        <div className="passwordFieldContainer">
                            <input 
                                type={showSenha ? 'text' : 'password'} 
                                value={confirmarSenha} 
                                onChange={e => setConfirmarSenha(e.target.value)} 
                                placeholder={usuarioEditando ? "Confirme a nova senha" : "Confirme a senha"}
                            />
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {erroConfirmacao && <div className="error-message confirm-error">{erroConfirmacao}</div>}

                    <div className="modal-actions">
                        <button type="submit" className="btn-save">
                            {usuarioEditando ? 'Salvar' : 'Criar Usuário'}
                        </button>
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}