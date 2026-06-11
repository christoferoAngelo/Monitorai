import { useEffect, useState, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import "./RegistrarRelatorio.css";

export default function RegistrarRelatorio() {
    const [user, setUser] = useState(null);
    const [monitorias, setMonitorias] = useState([]);
    const [monitoriaSelecionada, setMonitoriaSelecionada] = useState(null);
    const [historico, setHistorico] = useState([]);
    const [media, setMedia] = useState(0);
    
    const [modo, setModo] = useState('list');
    const [relatorioEditando, setRelatorioEditando] = useState(null);
    const [buscaMonitoria, setBuscaMonitoria] = useState('');
    const [dropdownAberto, setDropdownAberto] = useState(false);
    
    const wrapperRef = useRef(null);
    const inputRef = useRef(null);

    const [searchParams] = useSearchParams();
    const monitoriaIdFromUrl = searchParams.get('monitoriaId');

    const [form, setForm] = useState({
        quantidadeAlunos: "",
        conteudoAbordado: "",
        observacoes: "",
        data: new Date().toISOString().split('T')[0]
    });

    // Fechar dropdown ao clicar fora
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef && !wrapperRef.current.contains(event.target)) {
                setDropdownAberto(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        api.get("/auth/me").then(res => {
            setUser(res.data);
            
            if (monitoriaIdFromUrl) {
                api.get(`/monitorias/${monitoriaIdFromUrl}`).then(mRes => {
                    setMonitoriaSelecionada(mRes.data);
                    carregarHistorico(mRes.data.id);
                });
            } else if (res.data.role === 'MONITOR') {
                api.get(`/monitorias/monitor/${res.data.username}`).then(mRes => {
                    const monitoriaAtiva = mRes.data.find(m => m.ativa);
                    if (monitoriaAtiva) {
                        setMonitoriaSelecionada(monitoriaAtiva);
                        carregarHistorico(monitoriaAtiva.id);
                    }
                });
            } else {
                api.get("/monitorias").then(mRes => {
                    console.log("DEBUG - Primeira monitoria:", mRes.data[0]); 
                    setMonitorias(mRes.data);
                });
            }
        });
    }, [monitoriaIdFromUrl]);

    // Filtro da busca
    const monitoriasFiltradas = useMemo(() => {
        if (!buscaMonitoria) return monitorias.slice(0, 10); // Mostra até 10 se não buscar
        const term = buscaMonitoria.toLowerCase();
        return monitorias.filter(m => 
            (m.disciplinaNome || '').toLowerCase().includes(term) ||
            (m.monitorNome || '').toLowerCase().includes(term) ||
            (m.diaSemana || '').toLowerCase().includes(term)
        ).slice(0, 10); // Limita a 10 resultados
    }, [monitorias, buscaMonitoria]);

    function selecionarMonitoria(monitoria) {
        setMonitoriaSelecionada(monitoria);
        setBuscaMonitoria(`${monitoria.disciplinaNome} - ${monitoria.monitorNome} (${monitoria.diaSemana})`);
        setDropdownAberto(false);
        carregarHistorico(monitoria.id);
        setModo('list');
    }

    function limparSelecao() {
        setMonitoriaSelecionada(null);
        setBuscaMonitoria('');
        setHistorico([]);
    }

    async function carregarHistorico(id) {
        if (!id) return;
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
                {user?.role === 'ADMIN' && !monitoriaIdFromUrl && (
                    <div className="filtro-admin" ref={wrapperRef}>
                        <label>Buscar Monitoria:</label>
                        
                        {/* Se já tiver selecionado, mostra tag clicável */}
                        {monitoriaSelecionada ? (
                            <div className="tag-selecionada">
                                <div className="info">
                                    <span className="disciplina">{monitoriaSelecionada.disciplinaNome}</span>
                                    <span className="detalhes">{monitoriaSelecionada.monitorNome} • {monitoriaSelecionada.diaSemana}</span>
                                </div>
                                <button type="button" onClick={limparSelecao} title="Limpar">✕</button>
                            </div>
                        ) : (
                            <div className="input-busca-wrapper">
                                {/* Ícone de lupa SVG */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                                
                                <input 
                                    ref={inputRef}
                                    type="text" 
                                    className="filtro-select"
                                    placeholder="Digite disciplina, monitor ou dia..."
                                    value={buscaMonitoria}
                                    onChange={(e) => {
                                        setBuscaMonitoria(e.target.value);
                                        setDropdownAberto(true);
                                    }}
                                    onFocus={() => setDropdownAberto(true)}
                                />
                                
                                {/* Dropdown customizado */}
                                {dropdownAberto && monitoriasFiltradas.length > 0 && (
                                    <div className="dropdown-resultados">
                                        {monitoriasFiltradas.map(m => (
                                            <div 
                                                key={m.id} 
                                                className="dropdown-item"
                                                onClick={() => selecionarMonitoria(m)}
                                            >
                                                <strong>{m.disciplinaNome}</strong>
                                                <span>{m.monitorNome} • {m.diaSemana}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Mostrar se nãoachou resultados */}
                                {dropdownAberto && monitoriasFiltradas.length === 0 && buscaMonitoria && (
                                    <div className="dropdown-resultados">
                                        <div className="dropdown-vazio">
                                            Nenhuma monitoria encontrada
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {monitoriaSelecionada && modo === 'form' && (
                <>
                    <div className="monitoria-info-card">
                        <div className="monitoria-info-item">
                            <label>Disciplina</label>
                            <span>{monitoriaSelecionada.disciplinaNome}</span>
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
                                            <button className="btn-action edit" onClick={() => abrirFormulario(h)}>✏️</button>
                                            <button className="btn-action delete" onClick={() => excluirRelatorio(h.id)}>🗑️</button>
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