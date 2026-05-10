import { useEffect, useState } from "react";
import api from "../services/api";

export default function RegistrarRelatorio() {
    const [user, setUser] = useState(null);
    const [monitorias, setMonitorias] = useState([]); // Para o Admin escolher
    const [monitoriaSelecionada, setMonitoriaSelecionada] = useState(null);
    const [historico, setHistorico] = useState([]);
    const [media, setMedia] = useState(0);

    const [form, setForm] = useState({
        quantidadeAlunos: "",
        conteudoAbordado: "",
        observacoes: "",
        data: new Date().toISOString().split('T')[0] // Data de hoje padrão
    });

    useEffect(() => {
        // 1. Pega dados do usuário logado
        api.get("/auth/me").then(res => {
            setUser(res.data);
            if (res.data.role === 'MONITOR') {
                // Se for monitor, busca a monitoria dele automaticamente pelo ID de usuário
                api.get(`/monitorias/monitor/${res.data.id}`).then(mRes => {
                    setMonitoriaSelecionada(mRes.data[0]); // Pega a primeira ativa
                    carregarHistorico(mRes.data[0].id);
                });
            } else {
                // Se for admin, carrega todas para ele escolher
                api.get("/monitorias/ativas").then(mRes => setMonitorias(mRes.data));
            }
        });
    }, []);

    async function carregarHistorico(id) {
        const res = await api.get(`/relatorios/monitoria/${id}`);
        setHistorico(res.data);
        // Calcula média simples no front ou busca do back
        const total = res.data.reduce((acc, curr) => acc + curr.quantidadeAlunos, 0);
        setMedia(res.data.length ? (total / res.data.length).toFixed(1) : 0);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/relatorios", {
                ...form,
                monitoriaId: monitoriaSelecionada.id
            });
            alert("Relatório salvo com sucesso!");
            carregarHistorico(monitoriaSelecionada.id);
        } catch (error) {
            alert("Erro ao salvar relatório");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Relatório de Monitoria</h1>

            {user?.role === 'ADMIN' && (
                <div style={{ marginBottom: '20px', border: '1px solid blue', padding: '10px' }}>
                    <label>Selecione a Monitoria (Modo Admin): </label>
                    <select onChange={(e) => {
                        const m = monitorias.find(it => it.id === parseInt(e.target.value));
                        setMonitoriaSelecionada(m);
                        carregarHistorico(m.id);
                    }}>
                        <option value="">--- Selecione ---</option>
                        {monitorias.map(m => (
                            <option key={m.id} value={m.id}>
                                {m.disciplina.nome} - {m.monitor.usuario.username} ({m.diaSemana})
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {monitoriaSelecionada && (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '500px' }}>
                    <div style={{ background: '#eee', padding: '10px' }}>
                        <p><strong>Disciplina:</strong> {monitoriaSelecionada.disciplina.nome}</p>
                        <p><strong>Local:</strong> Sala {monitoriaSelecionada.sala}</p>
                        <p><strong>Horário:</strong> {monitoriaSelecionada.horarioInicio} às {monitoriaSelecionada.horarioFim}</p>
                    </div>

                    <input type="date" value={form.data} onChange={e => setForm({...form, data: e.target.value})} />
                    <input type="number" placeholder="Qtd de Alunos" value={form.quantidadeAlunos} onChange={e => setForm({...form, quantidadeAlunos: e.target.value})} required />
                    <textarea placeholder="Conteúdo abordado" value={form.conteudoAbordado} onChange={e => setForm({...form, conteudoAbordado: e.target.value})} />
                    <button type="submit">Enviar Relatório</button>
                </form>
            )}

            <hr />
            <h2>Histórico e Estatísticas</h2>
            {user?.role === 'ADMIN' && <p><strong>Média de frequência desta monitoria:</strong> {media} alunos/sessão</p>}
            
            <table border="1" width="100%">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Alunos</th>
                        <th>Conteúdo</th>
                    </tr>
                </thead>
                <tbody>
                    {historico.map(h => (
                        <tr key={h.id}>
                            <td>{h.data}</td>
                            <td>{h.quantidadeAlunos}</td>
                            <td>{h.conteudoAbordado}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}