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
    const [error, setError] = useState('');
    const [showSenha, setShowSenha] = useState(false);

    // Efeito para preencher o formulário quando o modal abre (para edição ou criação)
    useEffect(() => {
        if (isOpen) {
            if (usuarioEditando) {
                setTipoSelecionado(usuarioEditando.role);
                setForm({
                    username: usuarioEditando.username,
                    email: usuarioEditando.email,
                    senha: '', // A senha vem vazia por segurança
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
        setError('');
    }

    async function salvar(e) {
        e.preventDefault();
        setError('');

        // Validações
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

        if (!usuarioEditando && !form.senha) {
            return setError('A Senha é obrigatória para novos usuários.');
        }
        if (form.senha && form.senha.length < 8) {
            return setError('A senha deve ter pelo menos 8 caracteres.');
        }

        // Chamadas para a API
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
            
            // Avisa o componente pai que deu certo e ele pode fechar o modal e recarregar os dados
            onSuccess(); 
        } catch (err) {
            setError(err.response?.data || "Erro ao salvar usuário");
        }
    }

    // Se o modal não estiver aberto, não renderiza nada
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

                    <div className="form-group">
                        <label>{usuarioEditando ? 'Nova Senha (opcional)' : 'Senha *'}</label>
                        <div className="passwordFieldContainer">
                            <input 
                                type={showSenha ? 'text' : 'password'} 
                                value={form.senha} 
                                onChange={e => setForm({...form, senha: e.target.value})} 
                                placeholder="Mínimo 8 caracteres" 
                            />
                            <button type="button" className="togglePasswordButton" onClick={() => setShowSenha(!showSenha)}>
                                <img src={showSenha ? "/olho.png" : "/olho_aberto.png"} alt="Mostrar/Ocultar senha" style={{width: 20, height: 20}} />
                            </button>
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

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