import { useEffect, useState } from "react";
import api from "../../../services/api";
import UsuarioModal from "./UsuarioModal"; // Importando o modal que criamos
import "./Usuarios.css";

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [monitorias, setMonitorias] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [aba, setAba] = useState('alunos');
    const [busca, setBusca] = useState('');
    
    // Controles do Modal
    const [mostrarModal, setMostrarModal] = useState(false);
    const [usuarioEditando, setUsuarioEditando] = useState(null);
    const [tipoModal, setTipoModal] = useState('ALUNO');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        carregarDados();
    }, []);

    async function carregarDados() {
        try {
            const [resUsers, resMonitorias] = await Promise.all([
                api.get('/usuarios'),
                api.get('/monitorias/ativas') // Endpoint correto para pegar horários/salas
            ]);
            setUsuarios(resUsers.data);
            setMonitorias(resMonitorias.data);
        } catch (err) {
            console.error("Erro ao carregar dados:", err);
        }
        setLoading(false);
    }

    // Busca os horários e salas cruzando o usuário com a monitoria ativa
    function getDadosMonitoriaDoUsuario(usuarioId) {
        const monitoria = monitorias.find(m => m.monitor?.usuario?.id === usuarioId);
        if (!monitoria) return null;
        
        return {
            disciplina: monitoria.disciplina,
            sala: monitoria.sala,
            diaSemana: monitoria.diaSemana,
            horarioInicio: monitoria.horarioInicio,
            horarioFim: monitoria.horarioFim
        };
    }

    // Filtros e Listas
    const usuariosFiltrados = usuarios.filter(u => {
        if (aba === 'alunos' && u.role !== 'ALUNO' && u.role !== 'MONITOR') return false;
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

    const totalAlunos = usuarios.filter(u => u.role === 'ALUNO' || u.role === 'MONITOR').length;
    const totalMonitores = usuarios.filter(u => u.role === 'MONITOR').length;
    const totalAdmins = usuarios.filter(u => u.role === 'ADMIN').length;

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

    if (loading) return <div className="admin-loading">Carregando...</div>;

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
                <button className="btn-new" onClick={abrirNovoModal}>
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
                    <input 
                        type="text" 
                        placeholder="Buscar por nome, email ou RA..." 
                        value={busca} 
                        onChange={e => setBusca(e.target.value)} 
                    />
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
                                        <button className="btn-action btn-delete" onClick={() => inativarUsuario(u)} title="Inativar">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            </svg>
                                        </button>
                                    </div>
                                );

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

                                if (aba === 'monitores') {
                                    const monitoria = getDadosMonitoriaDoUsuario(u.id);
                                    return (
                                        <tr key={u.id}>
                                            <td><strong>{u.username}</strong></td>
                                            <td>{u.email}</td>
                                            <td>{monitoria?.disciplina?.nome || '—'}</td>
                                            <td>{monitoria?.diaSemana || '—'}</td>
                                            <td>{monitoria ? `${monitoria.horarioInicio.substring(0,5)} às ${monitoria.horarioFim.substring(0,5)}` : '—'}</td>
                                            <td>{monitoria?.sala || '—'}</td>
                                            <td><span className={`status-badge ${isAtivo ? 'ativo' : 'inativo'}`}>{isAtivo ? 'Ativo' : 'Inativo'}</span></td>
                                            <td>{acoesNode}</td>
                                        </tr>
                                    );
                                }

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

            {/* Chamada do nosso componente isolado */}
            <UsuarioModal 
                isOpen={mostrarModal}
                onClose={fecharModal}
                onSuccess={lidarComSucessoModal}
                usuarioEditando={usuarioEditando}
                tipoInicial={tipoModal}
            />

        </div>
    );
}