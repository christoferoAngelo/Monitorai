import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import "./GradeCurricular.css";

export default function GradeCurricular() {
    const [cursos, setCursos] = useState([]);
    const [disciplinas, setDisciplinas] = useState([]);
    const [tab, setTab] = useState('cursos'); // 'cursos' | 'disciplinas' | 'grade'
    const [loading, setLoading] = useState(true);
    
    // Para formulário
    const [mostrarForm, setMostrarForm] = useState(false);
    const [editando, setEditando] = useState(null);
    const [form, setForm] = useState({ nome: "", codigo: "" });
    
    // Course selected for grade
    const [cursoSelecionado, setCursoSelecionado] = useState(null);
    const [disciplinasCurso, setDisciplinasCurso] = useState([]);
    
    const navigate = useNavigate();

    useEffect(() => {
        carregarDados();
    }, []);

    async function carregarDados() {
        const token = localStorage.getItem('token');
        if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        try {
            const [resCursos, resDisciplinas] = await Promise.all([
                api.get("/cursos"),
                api.get("/disciplinas")
            ]);
            setCursos(resCursos.data);
            setDisciplinas(resDisciplinas.data);
        } catch (err) {
            console.error("Erro ao carregar:", err);
        }
        setLoading(false);
    }

    // ========== CRUD CURSOS ==========
    async function salvarCurso(e) {
        e.preventDefault();
        try {
            if (editando) {
                await api.put(`/cursos/${editando.id}`, form);
            } else {
                await api.post("/cursos", form);
            }
            carregarDados();
            setMostrarForm(false);
            setEditando(null);
            setForm({ nome: "", codigo: "" });
        } catch (error) {
            alert("Erro ao salvar");
        }
    }

    async function excluirCurso(id) {
        if (!window.confirm("Deseja excluir este curso?")) return;
        try {
            await api.delete(`/cursos/${id}`);
            carregarDados();
        } catch (error) {
            alert("Erro ao excluir");
        }
    }

    function editarCurso(curso) {
        setEditando(curso);
        setForm({ nome: curso.nome, codigo: curso.codigo });
        setMostrarForm(true);
    }

    // ========== CRUD DISCIPLINAS ==========
    async function salvarDisciplina(e) {
        e.preventDefault();
        try {
            if (editando) {
                const payload = {
                    nome: form.nome,
                    codigo: form.codigo,
                    cursosIds: []
                };
                await api.put(`/disciplinas/${editando.id}`, payload);
            } else {
                await api.post("/disciplinas", form);
            }
            carregarDados();
            setMostrarForm(false);
            setEditando(null);
            setForm({ nome: "", codigo: "" });
        } catch (error) {
            alert("Erro ao salvar");
        }
    }

    async function excluirDisciplina(id) {
        if (!window.confirm("Deseja excluir esta disciplina?")) return;
        try {
            await api.delete(`/disciplinas/${id}`);
            carregarDados();
        } catch (error) {
            alert("Erro ao excluir");
        }
    }

    function editarDisciplina(disciplina) {
        setEditando(disciplina);
        setForm({ nome: disciplina.nome, codigo: disciplina.codigo });
        setMostrarForm(true);
    }

    // ========== GRADE (Vincular) ==========
    async function selecionarCurso(curso) {
        setCursoSelecionado(curso);
        const res = await api.get(`/cursos/${curso.id}/disciplinas`);
        setDisciplinasCurso(res.data);
    }

    async function adicionarDisciplinaGrade(disciplinaId) {
        if (!cursoSelecionado) return;
        try {
            await api.post(`/cursos/${cursoSelecionado.id}/disciplinas/${disciplinaId}`);
            await selecionarCurso(cursoSelecionado);
        } catch (error) {
            alert("Erro ao adicionar");
        }
    }

    async function removerDisciplinaGrade(disciplinaId) {
        if (!cursoSelecionado) return;
        if (!window.confirm("Remover esta disciplina do curso?")) return;
        try {
            await api.delete(`/cursos/${cursoSelecionado.id}/disciplinas/${disciplinaId}`);
            await selecionarCurso(cursoSelecionado);
        } catch (error) {
            alert("Erro ao remover");
        }
    }

    const disciplinasDisponiveis = disciplinas.filter(
        d => !disciplinasCurso.some(dc => dc.id === d.id)
    );

    function iniciarNovo() {
        setEditando(null);
        setForm({ nome: "", codigo: "" });
        setMostrarForm(true);
    }

    function cancelarForm() {
        setMostrarForm(false);
        setEditando(null);
        setForm({ nome: "", codigo: "" });
    }

    if (loading) return <div className="admin-loading"><div className="spinner"></div></div>;

    return (
        <div className="grade-page">
            <div className="grade-header">
                <h1>Gerenciamento de Cursos e Disciplinas</h1>
                <p>Gerencie a grade curricular completa</p>
            </div>

            {/* ABAS */}
            <div className="tabs">
                <button className={tab === 'cursos' ? 'active' : ''} onClick={() => setTab('cursos')}>Cursos</button>
                <button className={tab === 'disciplinas' ? 'active' : ''} onClick={() => setTab('disciplinas')}>Disciplinas</button>
                <button className={tab === 'grade' ? 'active' : ''} onClick={() => setTab('grade')}>Vincular Grade</button>
            </div>

            {/* TAB CURSOS */}
            {tab === 'cursos' && (
                <div className="tab-content">
                    <div className="tab-header">
                        <h2>Cursos</h2>
                        <button className="btn-new" onClick={iniciarNovo}>➕ Novo Curso</button>
                    </div>
                    
                    {mostrarForm && (
                        <form className="form-card" onSubmit={salvarCurso}>
                            <h3>{editando ? 'Editar Curso' : 'Novo Curso'}</h3>
                            <input placeholder="Nome do curso" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} required />
                            <div className="form-actions">
                                <button type="submit" className="btn-save">Salvar</button>
                                <button type="button" className="btn-cancel" onClick={cancelarForm}>Cancelar</button>
                            </div>
                        </form>
                    )}

                    <div className="items-grid">
                        {cursos.map(c => (
                            <div key={c.id} className="item-card">
                                <div className="item-info">
                                    <strong>{c.nome}</strong>
                                    <span>{c.codigo}</span>
                                </div>
                                <div className="item-actions">
                                    <button onClick={() => editarCurso(c)}>✏️</button>
                                    <button onClick={() => excluirCurso(c.id)}>🗑️</button>
                                </div>
                            </div>
                        ))}
                        {cursos.length === 0 && <p className="empty">Nenhum curso cadastrado</p>}
                    </div>
                </div>
            )}

            {/* TAB DISCIPLINAS */}
            {tab === 'disciplinas' && (
                <div className="tab-content">
                    <div className="tab-header">
                        <h2>Disciplinas</h2>
                        <button className="btn-new" onClick={iniciarNovo}>➕ Nova Disciplina</button>
                    </div>
                    
                    {mostrarForm && (
                        <form className="form-card" onSubmit={salvarDisciplina}>
                            <h3>{editando ? 'Editar Disciplina' : 'Nova Disciplina'}</h3>
                            <input placeholder="Nome da disciplina" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} required />
                            <input placeholder="Código (opcional)" value={form.codigo} onChange={e => setForm({...form, codigo: e.target.value})} />
                            <div className="form-actions">
                                <button type="submit" className="btn-save">Salvar</button>
                                <button type="button" className="btn-cancel" onClick={cancelarForm}>Cancelar</button>
                            </div>
                        </form>
                    )}

                    <div className="items-grid">
                        {disciplinas.map(d => (
                            <div key={d.id} className="item-card">
                                <div className="item-info">
                                    <strong>{d.nome}</strong>
                                    <span>{d.codigo}</span>
                                </div>
                                <div className="item-actions">
                                    <button onClick={() => editarDisciplina(d)}>✏️</button>
                                    <button onClick={() => excluirDisciplina(d.id)}>🗑️</button>
                                </div>
                            </div>
                        ))}
                        {disciplinas.length === 0 && <p className="empty">Nenhuma disciplina cadastrada</p>}
                    </div>
                </div>
            )}

            {/* TAB GRADE */}
            {tab === 'grade' && (
                <div className="tab-content">
                    <div className="grade-selector">
                        <label>Selecione o Curso:</label>
                        <div className="curso-buttons">
                            {cursos.map(c => (
                                <button 
                                    key={c.id} 
                                    className={cursoSelecionado?.id === c.id ? 'selected' : ''}
                                    onClick={() => selecionarCurso(c)}
                                >
                                    {c.nome}
                                </button>
                            ))}
                        </div>
                    </div>

                    {cursoSelecionado && (
                        <div className="grade-columns">
                            <div className="grade-column">
                                <h3>{cursoSelecionado.nome}</h3>
                                <p>Disciplinas vinculadas</p>
                                <div className="grade-list">
                                    {disciplinasCurso.map(d => (
                                        <div key={d.id} className="grade-item">
                                            <span>{d.nome} ({d.codigo})</span>
                                            <button onClick={() => removerDisciplinaGrade(d.id)}>🗑️</button>
                                        </div>
                                    ))}
                                    {disciplinasCurso.length === 0 && <p className="empty">Nenhuma</p>}
                                </div>
                            </div>
                            <div className="grade-column">
                                <h3>Adicionar</h3>
                                <p>Disciplinas disponíveis</p>
                                <div className="grade-list">
                                    {disciplinasDisponiveis.map(d => (
                                        <div key={d.id} className="grade-item add">
                                            <span>{d.nome} ({d.codigo})</span>
                                            <button onClick={() => adicionarDisciplinaGrade(d.id)}>➕</button>
                                        </div>
                                    ))}
                                    {disciplinasDisponiveis.length === 0 && <p className="empty">Todas vinculadas</p>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}