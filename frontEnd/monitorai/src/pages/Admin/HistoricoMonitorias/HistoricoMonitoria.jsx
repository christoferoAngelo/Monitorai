import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../../services/api';
import './HistoricoMonitoria.css';

export default function HistoricoMonitoria() {
    const [historico, setHistorico] = useState([]);
    const [monitores, setMonitores] = useState([]);
    const [disciplinas, setDisciplinas] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Filtros
    const [filtroMonitor, setFiltroMonitor] = useState('');
    const [filtroDisciplina, setFiltroDisciplina] = useState('');
    const [filtroAno, setFiltroAno] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('inativa');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        carregarDados();
    }, []);

    async function carregarDados() {
        try {
            const [resAtuacoes, resMonitores, resDisciplinas] = await Promise.all([
                api.get('/atuacoes'),
                api.get('/monitores'),
                api.get('/disciplinas')
            ]);
            setHistorico(resAtuacoes.data);
            setMonitores(resMonitores.data);
            setDisciplinas(resDisciplinas.data);
        } catch (err) {
            console.error("Erro:", err);
        }
        setLoading(false);
    }

    // Filtrar histórico
    const historicoFiltrado = historico.filter(a => {
        // Filtro por status da atuação
        if (filtroStatus === 'ativa' && a.ativa) return true;
        if (filtroStatus === 'inativa' && !a.ativa) return true;
        if (filtroStatus === 'todos') return true;
        
        // Filtro por monitor
        if (filtroMonitor && a.monitor?.usuario?.id !== parseInt(filtroMonitor)) return false;
        
        // Filtro por disciplina
        if (filtroDisciplina && a.monitoria?.disciplina?.id !== parseInt(filtroDisciplina)) return false;
        
        // Filtro por ano/semestre
        if (filtroAno && a.monitoria?.semestreReferencia !== filtroAno) return false;
        
        return true;
    });

    // Gerar PDF (simulação)
    function gerarPDF() {
        alert("Funcionalidade de PDF em desenvolvimento!");
    }

    // Listar relatórios de uma atuação
    async function verRelatorios(atuacaoId) {
        try {
            const res = await api.get(`/relatorios/atuacao/${atuacaoId}`);
            if (res.data.length === 0) {
                alert("Nenhum relatório encontrado para esta atuação.");
            } else {
                alert(`Esta atuamção teve ${res.data.length} relatórios.`);
            }
        } catch (err) {
            alert("Erro ao buscar relatórios");
        }
    }

    // Anos-semestres únicos
    const anosUnicos = [...new Set(historico.map(a => a.monitoria?.semestreReferencia).filter(Boolean))].sort().reverse();

    if (loading) return <div className="admin-loading"><div className="spinner"></div></div>;

    return (
        <div className="historico-page">
            <div className="page-header">
                <div>
                    <h1>📜 Histórico de Monitorias</h1>
                    <p className="page-subtitle">Visualize todas as monitorias anteriores</p>
                </div>
                <div className="header-actions">
                    <button className="btn-voltar" onClick={() => navigate('/admin-monitorias')}>
                        ← Voltar
                    </button>
                    <button className="btn-pdf" onClick={gerarPDF}>
                        📄 Gerar PDF
                    </button>
                </div>
            </div>

            {/* Filtros */}
            <div className="filtros">
                <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
                    <option value="todos">Todos os Status</option>
                    <option value="ativa">Apenas Ativas</option>
                    <option value="inativa">Apenas Encerradas</option>
                </select>
                
                <select value={filtroMonitor} onChange={e => setFiltroMonitor(e.target.value)}>
                    <option value="">Todos os Monitores</option>
                    {monitores.map(m => (
                        <option key={m.id} value={m.usuario?.id}>
                            {m.usuario?.username}
                        </option>
                    ))}
                </select>
                
                <select value={filtroDisciplina} onChange={e => setFiltroDisciplina(e.target.value)}>
                    <option value="">Todas as Disciplinas</option>
                    {disciplinas.map(d => (
                        <option key={d.id} value={d.id}>{d.nome}</option>
                    ))}
                </select>
                
                <select value={filtroAno} onChange={e => setFiltroAno(e.target.value)}>
                    <option value="">Todos os Períodos</option>
                    {anosUnicos.map(a => (
                        <option key={a} value={a}>{a}</option>
                    ))}
                </select>
                
                {(filtroMonitor || filtroDisciplina || filtroAno || filtroStatus !== 'todos') && (
                    <button className="btn-limpar" onClick={() => {
                        setFiltroMonitor('');
                        setFiltroDisciplina('');
                        setFiltroAno('');
                        setFiltroStatus('inativa');
                    }}>
                        Limpar Filtros
                    </button>
                )}
            </div>

            {/* Stats */}
            <div className="stats-row">
                <div className="stat-box">
                    <span className="stat-number">{historicoFiltrado.length}</span>
                    <span className="stat-label">Total de Atuações</span>
                </div>
                <div className="stat-box">
                    <span className="stat-number">{new Set(historicoFiltrado.map(a => a.monitor?.usuario?.id)).size}</span>
                    <span className="stat-label">Monitores Diferentes</span>
                </div>
                <div className="stat-box">
                    <span className="stat-number">{anosUnicos.length}</span>
                    <span className="stat-label">Períodos</span>
                </div>
            </div>

            {/* Lista */}
            <div className="historico-list">
                {historicoFiltrado.length === 0 ? (
                    <div className="empty-state">
                        <div className="icon">📭</div>
                        <h3>Nenhum histórico encontrado</h3>
                        <p>Tente ajustar os filtros de busca.</p>
                    </div>
                ) : (
                    <table className="historico-table">
                        <thead>
                            <tr>
                                <th>Monitor</th>
                                <th>Disciplina</th>
                                <th>Período</th>
                                <th>Início</th>
                                <th>Fim</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historicoFiltrado.map(a => (
                                <tr key={a.id}>
                                    <td>
                                        <div className="cell-monitor">
                                            <strong>{a.monitor?.usuario?.username || '—'}</strong>
                                        </div>
                                    </td>
                                    <td>{a.monitoria?.disciplina?.nome || '—'}</td>
                                    <td>{a.monitoria?.semestreReferencia || '—'}</td>
                                    <td>{a.dataInicio ? new Date(a.dataInicio).toLocaleDateString('pt-BR') : '—'}</td>
                                    <td>{a.dataFim ? new Date(a.dataFim).toLocaleDateString('pt-BR') : 'Em andamento'}</td>
                                    <td>
                                        <span className={`status-badge ${a.ativa ? 'ativa' : 'encerrada'}`}>
                                            {a.ativa ? 'Em Andamento' : 'Encerrada'}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn-action" onClick={() => verRelatorios(a.id)}>
                                            📋 Relatórios
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}