import { useEffect, useState } from "react";
import api from "../../../services/api";
import UsuarioModal from "./UsuarioModal";
import "./Usuarios.css";
import { useLocation } from "react-router-dom"; 

export default function Usuarios() {
    const location = useLocation(); 
    const [usuarios, setUsuarios] = useState([]);
    const [monitorias, setMonitorias] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [aba, setAba] = useState('alunos');
    const [busca, setBusca] = useState('');
    const [filtroAtivo, setFiltroAtivo] = useState('ativos');
    
    // Controles do Modal
    const [mostrarModal, setMostrarModal] = useState(false);
    const [usuarioEditando, setUsuarioEditando] = useState(null);
    const [tipoModal, setTipoModal] = useState('ALUNO');

    // Controles do Modal de Pedidos de Senha
    const [mostrarModalPedidos, setMostrarModalPedidos] = useState(false);
    const [pedidosSenha, setPedidosSenha] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        carregarDados();
    }, []);
    
    useEffect(() => {
        if (location.state?.usuarioParaEditar) {
            const usuario = location.state.usuarioParaEditar;
            setUsuarioEditando(usuario);
            setTipoModal(usuario.role);
            setMostrarModal(true);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    async function carregarDados() {
        try {
            const [resUsers, resMonitorias, resPedidos] = await Promise.all([
                api.get('/usuarios'),
                api.get('/monitorias/ativas'),
                api.get('/usuarios/pedidos-senha')
            ]);
            setUsuarios(resUsers.data);
            setMonitorias(resMonitorias.data);
            setPedidosSenha(resPedidos.data);
        } catch (err) {
            console.error("Erro ao carregar dados:", err);
        }
        setLoading(false);
    }

    // ALTERADO: Agora busca pelo nome (monitorNome) vindo do DTO
    function getDadosMonitoriaDoUsuario(usuario) {
        const monitoria = monitorias.find(m => m.monitorNome === usuario.username);
        if (!monitoria) return null;
        
        return monitoria;
    }

    const usuariosFiltrados = usuarios.filter(u => {
        if (aba === 'alunos' && u.role !== 'ALUNO' && u.role !== 'MONITOR') return false;
        if (aba === 'monitores' && u.role !== 'MONITOR') return false;
        if (aba === 'admins' && u.role !== 'ADMIN') return false;
        
        const isAtivo = u.ativo !== false;
        if (filtroAtivo === 'ativos' && !isAtivo) return false;
        if (filtroAtivo === 'inativos' && isAtivo) return false;
        
        if (busca) {
            const termo = busca.toLowerCase();
            if (!u.username?.toLowerCase().includes(termo) && 
                !u.email?.toLowerCase().includes(termo) &&
                !u.ra?.toLowerCase().includes(termo)) return false;
        }
        
        return true;
    });

    const totalAlunos = usuarios.filter(u => (u.role === 'ALUNO' || u.role === 'MONITOR') && u.ativo !== false).length;
    const totalMonitores = usuarios.filter(u => u.role === 'MONITOR' && u.ativo !== false).length;
    const totalAdmins = usuarios.filter(u => u.role === 'ADMIN' && u.ativo !== false).length;

    // Ações de Botões
    function abrirNovoModal() {
        setUsuarioEditando(null);
        setTipoModal(aba === 'admins' ? 'ADMIN' : 'ALUNO');
        setMostrarModal(true);
    }

    function abrirEditarModal(u) {
        setUsuarioEditando(u);
        setTipoModal(u.role);
        setMostrarModal(true);
    }

    function fecharModal() {
        setMostrarModal(false);
        setUsuarioEditando(null);
    }

    function lidarComSucessoModal() {
        fecharModal();
        carregarDados();
    }

    // ========== PEDIDOS DE SENHA ==========
    function abrirModalPedidos() {
        setMostrarModalPedidos(true);
    }

    function fecharModalPedidos() {
        setMostrarModalPedidos(false);
    }

    async function autorizarPedido(usuario) {
        if (!window.confirm(`Autorizar redefinição de senha para ${usuario.username}?`)) return;

        try {
            await api.put(`/usuarios/${usuario.id}/aprovar-redefinicao`);
            alert("Pedido autorizado! O usuário poderá redefinir a senha.");
            carregarDados();
            setMostrarModalPedidos(false);
        } catch (err) {
            alert("Erro ao autorizar pedido");
        }
    }

    async function negarPedido(usuario) {
        if (!window.confirm(`Negar redefinição de senha para ${usuario.username}?`)) return;

        try {
            await api.put(`/usuarios/${usuario.id}/negar-redefinicao`);
            alert("Pedido negado!");
            carregarDados();
        } catch (err) {
            alert("Erro ao negar pedido");
        }
    }

    async function toggleAtivo(usuario) {
        const isAtivo = usuario.ativo !== false;

        // NOVA VALIDAÇÃO: Impede inativar se for o último admin ativo
        if (isAtivo && usuario.role === 'ADMIN' && totalAdmins <= 1) {
            alert("Ação negada: O sistema deve ter pelo menos um administrador ativo.");
            return; // Interrompe a função aqui
        }

        const msg = isAtivo 
            ? `Inativar o usuário ${usuario.username}?`
            : `Ativar o usuário ${usuario.username}?`;
        
        if (!window.confirm(msg)) return;

        try {
            await api.put(`/usuarios/${usuario.id}/alternar-status`);
            alert(isAtivo ? "Usuário inativado!" : "Usuário ativado!");
            carregarDados();
        } catch (err) {
            alert("Erro ao atualizar usuário");
        }
    }

    if (loading) return <div className="admin-loading">Carregando...</div>;

    const renderTableHeaders = () => {
        if (aba === 'admins') {
            return (
                <tr>
                    <th>Nome</th>
                    <th>Email</th>
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
                    <th>Ações</th>
                </tr>
            );
        }
        return (
            <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>RA</th>
                <th>Ações</th>
            </tr>
        );
    };

    return (
        <div className="usuarios-page">
            <div className="page-header">
                <div>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src="/icone_users.png" alt="" width="28" height="28" />
                        Gerenciamento de Usuários
                    </h1>
                    <p>Cadastre e gerencie alunos e administradores</p>
                </div>
                
                <div className="header-actions">
                    <button 
                        className="btn-pedidos" 
                        onClick={abrirModalPedidos}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    >
                        <img src="/icone_chave.png" alt="" width="16" height="16" />
                        Pedidos de Senha
                        {pedidosSenha.length > 0 && (
                            <span className="badge-pedidos">{pedidosSenha.length}</span>
                        )}
                    </button>
                    <button 
                        className="btn-new" 
                        onClick={abrirNovoModal}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    >
                        <img src="/icone_mais.png" alt="" width="14" height="14" />
                        Novo Usuário
                    </button>
                </div>
            </div>

            <div className="abas">
                <button 
                    className={`aba-btn ${aba === 'alunos' ? 'active' : ''}`} 
                    onClick={() => setAba('alunos')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                    <img src="/icone_chapeu.png" alt="" width="16" height="16" />
                    Alunos ({totalAlunos})
                </button>
                <button 
                    className={`aba-btn ${aba === 'monitores' ? 'active' : ''}`} 
                    onClick={() => setAba('monitores')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                    <img src="/icone_monitorias.png" alt="" width="16" height="16" />
                    Monitores ({totalMonitores})
                </button>
                <button 
                    className={`aba-btn ${aba === 'admins' ? 'active' : ''}`} 
                    onClick={() => setAba('admins')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                    <img src="/icone_engrenagem.png" alt="" width="16" height="16" />
                    Administradores ({totalAdmins})
                </button>
            </div>

            <div className="filters-row">
                <div className="search-box" style={{ display: 'flex', alignItems: 'center' }}>
                    <img src="/icone_busca.png" alt="" width="16" height="16" style={{ marginRight: '8px' }} />
                    <input 
                        type="text" 
                        placeholder="Buscar por nome, email ou RA..." 
                        value={busca} 
                        onChange={e => setBusca(e.target.value)} 
                    />
                </div>
                
                <div className="status-filter">
                    <button 
                        className={`filter-btn ${filtroAtivo === 'ativos' ? 'active' : ''}`}
                        onClick={() => setFiltroAtivo('ativos')}
                    >
                        Ativos
                    </button>
                    <button 
                        className={`filter-btn ${filtroAtivo === 'inativos' ? 'active' : ''}`}
                        onClick={() => setFiltroAtivo('inativos')}
                    >
                        Inativos
                    </button>
                    <button 
                        className={`filter-btn ${filtroAtivo === 'todos' ? 'active' : ''}`}
                        onClick={() => setFiltroAtivo('todos')}
                    >
                        Todos
                    </button>
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
                                const isAtivo = u.ativo !== false; 
                                
                                const acoesNode = (
                                    <div className="action-buttons">
                                        <button className="btn-action btn-edit" onClick={() => abrirEditarModal(u)} title="Editar">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                        </button>
                                        <button 
                                            className={`btn-action ${isAtivo ? 'btn-delete' : 'btn-activate'}`} 
                                            onClick={() => toggleAtivo(u)} 
                                            title={isAtivo ? "Inativar" : "Ativar"}
                                        >
                                            {isAtivo ? (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                </svg>
                                            ) : (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                );

                                if (aba === 'admins') {
                                    return (
                                        <tr key={u.id} className={!isAtivo ? 'row-inactive' : ''}>
                                            <td><strong>{u.username}</strong></td>
                                            <td>{u.email}</td>
                                            <td>{acoesNode}</td>
                                        </tr>
                                    );
                                }

                                // ALTERADO: Mapeamento de propriedades ajustado ao MonitoriaResponseDTO
                                if (aba === 'monitores') {
                                    const monitoria = getDadosMonitoriaDoUsuario(u);
                                    return (
                                        <tr key={u.id} className={!isAtivo ? 'row-inactive' : ''}>
                                            <td><strong>{u.username}</strong></td>
                                            <td>{u.email}</td>
                                            <td>{monitoria?.disciplinaNome || '—'}</td>
                                            <td>{monitoria?.diaSemana || '—'}</td>
                                            <td>{monitoria ? `${monitoria.horarioInicio.substring(0,5)} às ${monitoria.horarioFim.substring(0,5)}` : '—'}</td>
                                            <td>{monitoria?.sala || '—'}</td>
                                            <td>{acoesNode}</td>
                                        </tr>
                                    );
                                }

                                return (
                                    <tr key={u.id} className={!isAtivo ? 'row-inactive' : ''}>
                                        <td><strong>{u.username}</strong></td>
                                        <td>{u.email}</td>
                                        <td>{u.ra || '—'}</td>
                                        <td>{acoesNode}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            <UsuarioModal 
                isOpen={mostrarModal}
                onClose={fecharModal}
                onSuccess={lidarComSucessoModal}
                usuarioEditando={usuarioEditando}
                tipoInicial={tipoModal}
            />

            {/* MODAL DE PEDIDOS DE SENHA */}
            {mostrarModalPedidos && (
                <div className="modal-overlay" onClick={fecharModalPedidos}>
                    <div className="modal-content pedidos-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <img src="/icone_chave.png" alt="" width="20" height="20" />
                                Pedidos de Redefinição de Senha
                            </h2>
                            <button className="modal-close" onClick={fecharModalPedidos}>✕</button>
                        </div>
                        
                        {pedidosSenha.length === 0 ? (
                            <div className="empty-pedidos">
                                <p>Nenhum pedido pendente.</p>
                            </div>
                        ) : (
                            <div className="pedidos-list">
                                {pedidosSenha.map(p => (
                                    <div key={p.id} className="pedido-item">
                                        <div className="pedido-info">
                                            <strong>{p.username}</strong>
                                            <span>{p.email}</span>
                                            <span className="pedido-data">
                                                Solicitado em: {p.dataSolicitacaoSenha ? 
                                                    new Date(p.dataSolicitacaoSenha).toLocaleString('pt-BR') : '-'}
                                            </span>
                                        </div>
                                        <div className="pedido-actions">
                                            <button className="btn-autorizar" onClick={() => autorizarPedido(p)}>✓ Autorizar</button>
                                            <button className="btn-negar" onClick={() => negarPedido(p)}>✕ Negar</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}