import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import api from "/src/services/api"; 
import "./MonitorRelatorio.css";

export default function MonitorRelatorio() {
    // Puxa o usuário que o SharedLayout já carregou!
    const { usuario } = useOutletContext();
    
    const [minhaMonitoria, setMinhaMonitoria] = useState(null);
    const [historico, setHistorico] = useState([]);
    const [media, setMedia] = useState(0);
    const [loading, setLoading] = useState(true);
    
    const [modo, setModo] = useState('list'); // 'list' ou 'form'
    const [relatorioEditando, setRelatorioEditando] = useState(null);

    const [form, setForm] = useState({
        quantidadeAlunos: "",
        conteudoAbordado: "",
        observacoes: "",
        data: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
    // Se o SharedLayout ainda não disponibilizou o objeto usuario, esperamos
    if (!usuario) return;

    const carregarDados = async () => {
        try {
            // 1. Verificamos se temos o username textual
            if (usuario.username) {
                
                // 2. Usamos a rota "/usuarios/buscar" que JÁ EXISTE no seu UsuarioController
                const searchRes = await api.get(`/usuarios/buscar?termo=${usuario.username}`);
                
                // O back-end retorna uma lista. Achamos exatamente o cara com o mesmo username:
                const usuarioCompleto = searchRes.data.find(u => u.username === usuario.username);
                const idNumerico = usuarioCompleto?.id;

                if (idNumerico) {
                    // 3. Agora sim, com o ID numérico, buscamos a monitoria sem dar erro 500!
                    const mRes = await api.get(`/monitorias/monitor/${idNumerico}`);
                    
                    if (mRes.data && Array.isArray(mRes.data)) {
                        const monitoriaAtiva = mRes.data.find(m => m.ativa);
                        
                        if (monitoriaAtiva) {
                            setMinhaMonitoria(monitoriaAtiva);
                            await carregarHistorico(monitoriaAtiva.id);
                        }
                    }
                } else {
                    console.error("Não foi possível encontrar o ID numérico para o username:", usuario.username);
                }
            } else {
                console.error("O objeto usuario não possui a propriedade username:", usuario);
            }
        } catch (error) {
            console.error("Erro no fluxo de busca de monitoria:", error);
        } finally {
            // Garante que o estado de loading saia da tela
            setLoading(false);
        }
    };

    carregarDados();
  }, [usuario]);

    const carregarHistorico = async (monitoriaId) => {
        try {
            const res = await api.get(`/relatorios/monitoria/${monitoriaId}`);
            setHistorico(res.data);
            const total = res.data.reduce((acc, curr) => acc + curr.quantidadeAlunos, 0);
            setMedia(res.data.length ? (total / res.data.length).toFixed(1) : 0);
        } catch (error) {
            console.error("Erro ao carregar histórico:", error);
        }
    };

    const abrirFormulario = (relatorio = null) => {
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
    };

    const cancelarFormulario = () => {
        setModo('list');
        setRelatorioEditando(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!minhaMonitoria) return alert("Erro: Monitoria não encontrada.");
        
        try {
            if (relatorioEditando) {
                await api.put(`/relatorios/${relatorioEditando.id}`, {
                    ...form,
                    monitoriaId: minhaMonitoria.id
                });
                alert("Relatório atualizado com sucesso!");
            } else {
                await api.post("/relatorios", {
                    ...form,
                    monitoriaId: minhaMonitoria.id
                });
                alert("Relatório salvo com sucesso!");
            }
            cancelarFormulario();
            carregarHistorico(minhaMonitoria.id);
        } catch (error) {
            alert("Erro ao salvar o relatório. Tente novamente.");
        }
    };

    const excluirRelatorio = async (id) => {
        if (!window.confirm("Deseja excluir este relatório? Essa ação não pode ser desfeita.")) return;
        try {
            await api.delete(`/relatorios/${id}`);
            carregarHistorico(minhaMonitoria.id);
            alert("Relatório excluído!");
        } catch (error) {
            alert("Erro ao excluir o relatório.");
        }
    };

    if (loading) return <div className="loading">Carregando seus relatórios...</div>;

    return (
        <div className="monitor-relatorio-container">
            <header className="dashboard-header" style={{ marginBottom: '30px' }}>
                <h1>Meus Relatórios de Monitoria</h1>
                <p>Registre os atendimentos e acompanhe suas estatísticas de monitoria.</p>
            </header>

            {!minhaMonitoria ? (
                <div className="empty-state-card">
                    <div className="icon">⚠️</div>
                    <h3>Você não possui uma monitoria ativa</h3>
                    <p>Entre em contato com a coordenação caso acredite que isto seja um erro.</p>
                </div>
            ) : (
                <>
                    {/* CARD DE INFORMAÇÕES DA MONITORIA DO ALUNO */}
                    <div className="monitoria-info-card">
                        <div className="monitoria-info-item">
                            <label>Sua Disciplina</label>
                            <span>{minhaMonitoria.disciplina?.nome}</span>
                        </div>
                        <div className="monitoria-info-item">
                            <label>Local de Atendimento</label>
                            <span>{minhaMonitoria.sala}</span>
                        </div>
                        <div className="monitoria-info-item">
                            <label>Horário Fixo ({minhaMonitoria.diaSemana})</label>
                            <span>{minhaMonitoria.horarioInicio} - {minhaMonitoria.horarioFim}</span>
                        </div>
                    </div>

                    {/* MODO FORMULÁRIO */}
                    {modo === 'form' && (
                        <div className="form-wrapper animacao-deslizar">
                            <form className="relatorio-form" onSubmit={handleSubmit}>
                                <h3>{relatorioEditando ? '✏️ Editar Relatório' : '📝 Novo Relatório de Atendimento'}</h3>
                                
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Data da Monitoria</label>
                                        <input 
                                            type="date" 
                                            value={form.data} 
                                            onChange={e => setForm({...form, data: e.target.value})} 
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Alunos Presentes</label>
                                        <input 
                                            type="number" 
                                            min="0"
                                            placeholder="Ex: 5" 
                                            value={form.quantidadeAlunos} 
                                            onChange={e => setForm({...form, quantidadeAlunos: e.target.value})} 
                                            required 
                                        />
                                    </div>
                                </div>
                                
                                <label>Conteúdo Abordado / Dúvidas Frequentes</label>
                                <textarea 
                                    placeholder="Descreva brevemente o que foi ensinado hoje..." 
                                    value={form.conteudoAbordado} 
                                    onChange={e => setForm({...form, conteudoAbordado: e.target.value})} 
                                    required 
                                />
                                
                                <label>Observações Adicionais (opcional)</label>
                                <textarea 
                                    placeholder="Alguma dificuldade geral da turma? Algum aviso?" 
                                    value={form.observacoes} 
                                    onChange={e => setForm({...form, observacoes: e.target.value})} 
                                />
                                
                                <div className="form-actions">
                                    <button type="button" className="btn-cancelar" onClick={cancelarFormulario}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn-salvar-relatorio">
                                        {relatorioEditando ? 'Salvar Alterações' : 'Salvar Relatório'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* MODO LISTAGEM */}
                    {modo === 'list' && (
                        <div className="relatorio-historico">
                            <div className="historico-header">
                                <h2>Histórico de Atendimentos</h2>
                                <button className="btn-novo" onClick={() => abrirFormulario()}>
                                    ➕ Registrar Atendimento
                                </button>
                            </div>
                            
                            {media > 0 && (
                                <div className="media-alunos">
                                    📊 Média atual: <strong>{media} alunos</strong> por sessão
                                </div>
                            )}
                            
                            {historico.length === 0 ? (
                                <div className="empty-state">
                                    <div className="icon">📝</div>
                                    <p>Nenhum relatório foi registrado para esta disciplina ainda.</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="historico-table">
                                        <thead>
                                            <tr>
                                                <th>Data</th>
                                                <th>Alunos</th>
                                                <th>Conteúdo Resumido</th>
                                                <th>Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {historico.map(h => (
                                                <tr key={h.id}>
                                                    <td>{h.data.split('-').reverse().join('/')}</td>
                                                    <td>
                                                        <span className="badge-alunos">{h.quantidadeAlunos}</span>
                                                    </td>
                                                    <td>{h.conteudoAbordado}</td>
                                                    <td className="acoes">
                                                        <button className="btn-action edit" title="Editar" onClick={() => abrirFormulario(h)}>✏️</button>
                                                        <button className="btn-action delete" title="Excluir" onClick={() => excluirRelatorio(h.id)}>🗑️</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}