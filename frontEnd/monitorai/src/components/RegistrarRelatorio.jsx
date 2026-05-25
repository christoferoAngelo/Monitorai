import { useEffect, useState } from "react";
import api from "../services/api";
import "./RegistrarRelatorio.css";

export default function RegistrarRelatorio() {
    const [user, setUser] = useState(null);
    const [monitorias, setMonitorias] = useState([]);
    const [monitoriaSelecionada, setMonitoriaSelecionada] = useState(null);
    const [historico, setHistorico] = useState([]);
    const [media, setMedia] = useState(0);
    
    // Modo: 'list' (lista) ou 'form' (formulário)
    const [modo, setModo] = useState('list');
    const [relatorioEditando, setRelatorioEditando] = useState(null);

    const [form, setForm] = useState({
        quantidadeAlunos: "",
        conteudoAbordado: "",
        observacoes: "",
        data: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        api.get("/auth/me").then(res => {
            setUser(res.data);
            if (res.data.role === 'MONITOR') {
                api.get(`/monitorias/monitor/${res.data.username}`).then(mRes => {
                    const monitoriaAtiva = mRes.data.find(m => m.ativa);
                    if (monitoriaAtiva) {
                        setMonitoriaSelecionada(monitoriaAtiva);
                        carregarHistorico(monitoriaAtiva.id);
                    }
                });
            } else {
                api.get("/monitorias/ativas").then(mRes => setMonitorias(mRes.data));
            }
        });
    }, []);

    async function carregarHistorico(id) {
        const res = await api.get(`/relatorios/monitoria/${id}`);
        setHistorico(res.data);
        const total = res.data.reduce((acc, curr) => acc + curr.quantidadeAlunos, 0);
        setMedia(res.data.length ? (total / res.data.length).toFixed(1) : 0);
    }

    function abrirFormulario(relatorio = null) {
        if (relatorio) {
            setRelatorioEditando(relatorio);
            setForm({
                quantidadeAlunos: relatorio.quantidadeAlunos,
                conteudoAbordado: relatorio.conteudoAbordado,
                observacoes: relatorio.observacoes || "",
                data: relatorio.data
            });
        } else {
            setRelatorioEditando(null);
            setForm({
                quantidadeAlunos: "",
                conteudoAbordado: "",
                observacoes: "",
                data: new Date().toISOString().split('T')[0]
            });
        }
        setModo('form');
    }

    function cancelarFormulario() {
        setModo('list');
        setRelatorioEditando(null);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!monitoriaSelecionada) return alert("Selecione uma monitoria");
        
        try {
            if (relatorioEditando) {
                await api.put(`/relatorios/${relatorioEditando.id}`, {
                    ...form,
                    monitoriaId: monitoriaSelecionada.id
                });
                alert("Relatório atualizado!");
            } else {
                await api.post("/relatorios", {
                    ...form,
                    monitoriaId: monitoriaSelecionada.id
                });
                alert("Relatório salvo!");
            }
            cancelarFormulario();
            carregarHistorico(monitoriaSelecionada.id);
        } catch (error) {
            alert("Erro ao salvar");
        }
    };

    async function excluirRelatorio(id) {
        if (!window.confirm("Deseja excluir este relatório?")) return;
        try {
            await api.delete(`/relatorios/${id}`);
            carregarHistorico(monitoriaSelecionada.id);
            alert("Relatório excluído!");
        } catch (error) {
            alert("Erro ao excluir");
        }
    }

    return (
        <div className="relatorio-page">
            <div className="relatorio-header">
                <h1>Relatórios de Monitoria</h1>
                <p>Gerencie os registros de atendimentos</p>
            </div>

            {/* SELECÃO DE MONITORIA */}
            <div className="selecao-monitoria">
                {user?.role === 'ADMIN' && (
                    <div className="filtro-admin">
                        <label>Selecione a Monitoria: </label>
                        <select className="filtro-select" onChange={async (e) => {
                            const m = monitorias.find(it => it.id === parseInt(e.target.value));
                            setMonitoriaSelecionada(m);
                            if (m) carregarHistorico(m.id);
                            setModo('list');
                        }} value={monitoriaSelecionada?.id || ""}>
                            <option value="">--- Selecione ---</option>
                            {monitorias.map(m => (
                                <option key={m.id} value={m.id}>
                                    {m.disciplina?.nome || 'Disciplina'} - {m.monitor?.usuario?.username} ({m.diaSemana})
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {monitoriaSelecionada && modo === 'form' && (
                <>
                    {/* INFO DA MONITORIA */}
                    <div className="monitoria-info-card">
                        <div className="monitoria-info-item">
                            <label>Disciplina</label>
                            <span>{monitoriaSelecionada.disciplina?.nome}</span>
                        </div>
                        <div className="monitoria-info-item">
                            <label>Local</label>
                            <span>{monitoriaSelecionada.sala}</span>
                        </div>
                        <div className="monitoria-info-item">
                            <label>Horário</label>
                            <span>{monitoriaSelecionada.horarioInicio} - {monitoriaSelecionada.horarioFim}</span>
                        </div>
                    </div>

                    {/* FORMULÁRIO */}
                    <form className="relatorio-form" onSubmit={handleSubmit}>
                        <h3>{relatorioEditando ? 'Editar Relatório' : 'Novo Relatório'}</h3>
                        
                        <label>Data</label>
                        <input 
                            type="date" 
                            value={form.data} 
                            onChange={e => setForm({...form, data: e.target.value})} 
                            required 
                        />
                        
                        <label>Quantidade de Alunos</label>
                        <input 
                            type="number" 
                            placeholder="Número de alunos presentes" 
                            value={form.quantidadeAlunos} 
                            onChange={e => setForm({...form, quantidadeAlunos: e.target.value})} 
                            required 
                        />
                        
                        <label>Conteúdo Abordado</label>
                        <textarea 
                            placeholder="O que foi abordado na sessão" 
                            value={form.conteudoAbordado} 
                            onChange={e => setForm({...form, conteudoAbordado: e.target.value})} 
                            required 
                        />
                        
                        <label>Observações (opcional)</label>
                        <textarea 
                            placeholder="Observações adicionais" 
                            value={form.observacoes} 
                            onChange={e => setForm({...form, observacoes: e.target.value})} 
                        />
                        
                        <div className="form-actions">
                            <button type="submit" className="btn-salvar-relatorio">
                                {relatorioEditando ? 'Atualizar' : 'Salvar'}
                            </button>
                            <button type="button" className="btn-cancelar" onClick={cancelarFormulario}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </>
            )}

            {monitoriaSelecionada && modo === 'list' && (
                <div className="relatorio-historico">
                    <div className="historico-header">
                        <h2>Histórico de Atendimentos</h2>
                        <button className="btn-novo" onClick={() => abrirFormulario()}>
                            ➕ Novo Relatório
                        </button>
                    </div>
                    
                    {user?.role === 'ADMIN' && media > 0 && (
                        <div className="media-alunos">
                            📊 Média de alunos por sessão: {media}
                        </div>
                    )}
                    
                    {historico.length === 0 ? (
                        <div className="empty-state">
                            <div className="icon">📝</div>
                            <p>Nenhum relatório ainda</p>
                            <button className="btn-novo" onClick={() => abrirFormulario()}>
                                ➕ Primeiro Relatório
                            </button>
                        </div>
                    ) : (
                        <table className="historico-table">
                            <thead>
                                <tr>
                                    <th>Data</th>
                                    <th>Alunos</th>
                                    <th>Conteúdo</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historico.map(h => (
                                    <tr key={h.id}>
                                        <td>{h.data}</td>
                                        <td>{h.quantidadeAlunos}</td>
                                        <td>{h.conteudoAbordado}</td>
                                        <td className="acoes">
                                            <button 
                                                className="btn-action edit" 
                                                onClick={() => abrirFormulario(h)}
                                            >
                                                ✏️ Editar
                                            </button>
                                            <button 
                                                className="btn-action delete" 
                                                onClick={() => excluirRelatorio(h.id)}
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {!monitoriaSelecionada && (
                <div className="empty-state">
                    <div className="icon">📋</div>
                    <p>Selecione uma monitoria acima para ver os relatórios</p>
                </div>
            )}
        </div>
    );
}