import { useEffect, useState } from "react";
import api from "../../../services/api";
import "./GradeCurricular.css";
import { useSearchParams, useLocation } from 'react-router-dom'; // NOVO IMPORT PARA ADMIN SEARCH

export default function GradeCurricular() {
    const [cursos, setCursos] = useState([]);
    const [disciplinas, setDisciplinas] = useState([]);
    const [tab, setTab] = useState('cursos');
    const [loading, setLoading] = useState(true);
	const [searchParams] = useSearchParams(); 
    
    // Filtros
    const [cursoSelecionado, setCursoSelecionado] = useState(null);
    const [semestreSelecionado, setSemestreSelecionado] = useState("");
    const [disciplinasFiltradas, setDisciplinasFiltradas] = useState([]);
    
    // Formulário
    const [mostrarForm, setMostrarForm] = useState(false);
    const [editando, setEditando] = useState(null);
    const [form, setForm] = useState({ nome: "", semestre: "" });
    
    // Grade
    const [gradeCurso, setGradeCurso] = useState(null);
    const [disciplinasGrade, setDisciplinasGrade] = useState([]);
	

    useEffect(() => { carregarDados(); }, []);

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
            setDisciplinasFiltradas(resDisciplinas.data);
        } catch (err) { console.error("Erro:", err); }
        setLoading(false);
    }

    // Filtro: Curso + Semestre
    useEffect(() => {
        let lista = disciplinas;
        
        if (cursoSelecionado) {
            lista = lista.filter(d => d.cursosIds?.includes(cursoSelecionado.id));
        }
        
        if (semestreSelecionado) {
            lista = lista.filter(d => d.semestre === parseInt(semestreSelecionado));
        }
        
        setDisciplinasFiltradas(lista);
    }, [cursoSelecionado, semestreSelecionado, disciplinas]);

	// useEffect para capturar disciplina vinda do AdminSearch
	useEffect(() => {
	  const tabParam = searchParams.get('tab');
	  const editarId = searchParams.get('editar');

	  
	  // Se veio da busca, muda para a aba de disciplinas
	  if (tabParam === 'disciplinas') {
	    setTab('disciplinas');
	  }
	  
	  if (tabParam === 'cursos') {  
	     setTab('cursos');
	   }
	  
	  // Se tem ID para editar, abre o formulário com a disciplina
	  if (editarId) {
	    const disciplina = disciplinas.find(d => d.id === parseInt(editarId));
	    if (disciplina) {
	      editarDisciplina(disciplina);
	      setMostrarForm(true);
	    }
		
		
	    // Limpa os parâmetros da URL
	    window.history.replaceState({}, document.title, '/grade-curricular');
	  }
	  
	  if (editarId && cursos.length > 0 && tabParam === 'cursos') {
	     const curso = cursos.find(c => c.id === parseInt(editarId));
	     if (curso) {
	       editarCurso(curso);
	       setMostrarForm(true);
	     }
	     window.history.replaceState({}, document.title, '/grade-curricular');
	   }
	  
	}, [searchParams, disciplinas, cursos]);
	
	
	// ========== CURSOS ==========
    async function salvarCurso(e) {
        e.preventDefault();
        try {
            if (editando) await api.put(`/cursos/${editando.id}`, form);
            else await api.post("/cursos", form);
            carregarDados();
            setMostrarForm(false);
            setEditando(null);
            setForm({ nome: "", semestre: "" });
        } catch { alert("Erro ao salvar"); }
    }
    async function excluirCurso(id) {
        if (!window.confirm("Excluir curso?")) return;
        try { await api.delete(`/cursos/${id}`); carregarDados(); }
        catch { alert("Erro ao excluir"); }
    }
    function editarCurso(c) { setEditando(c); setForm({ nome: c.nome, semestre: "" }); setMostrarForm(true); }

    // ========== DISCIPLINAS ==========
    async function salvarDisciplina(e) {
        e.preventDefault();
        try {
            const payload = {
                nome: form.nome,
                semestre: form.semestre ? parseInt(form.semestre) : null
            };
            if (editando) {
                await api.put(`/disciplinas/${editando.id}`, payload);
            } else {
                await api.post("/disciplinas", payload);
            }
            carregarDados();
            setMostrarForm(false);
            setEditando(null);
            setForm({ nome: "", semestre: "" });
        } catch { alert("Erro ao salvar"); }
    }
    async function excluirDisciplina(id) {
        if (!window.confirm("Excluir disciplina?")) return;
        try { await api.delete(`/disciplinas/${id}`); carregarDados(); }
        catch { alert("Erro ao excluir"); }
    }
    function editarDisciplina(d) { 
        setEditando(d); 
        setForm({ nome: d.nome, semestre: d.semestre?.toString() || "" }); 
        setMostrarForm(true); 
    }

    // ========== GRADE ==========
    async function selecionarCursoGrade(c) {
        setGradeCurso(c);
        const res = await api.get(`/cursos/${c.id}/disciplinas`);
        setDisciplinasGrade(res.data);
    }
    async function adicionarDisciplinaGrade(id) {
        if (!gradeCurso) return;
        try {
            await api.post(`/cursos/${gradeCurso.id}/disciplinas/${id}`);
            await selecionarCursoGrade(gradeCurso);
        } catch { alert("Erro ao adicionar"); }
    }
    async function removerDisciplinaGrade(id) {
        if (!gradeCurso || !window.confirm("Remover?")) return;
        try {
            await api.delete(`/cursos/${gradeCurso.id}/disciplinas/${id}`);
            await selecionarCursoGrade(gradeCurso);
        } catch { alert("Erro ao remover"); }
    }

    const disciplinasDisponiveis = disciplinas.filter(d => !disciplinasGrade.some(dg => dg.id === d.id));

    function iniciarNovo() {
        setEditando(null);
        setForm({ nome: "", semestre: "" });
        setMostrarForm(true);
    }
    function cancelar() { 
        setMostrarForm(false); 
        setEditando(null); 
        setForm({ nome: "", semestre: "" }); 
    }
    
    function limparFiltros() {
        setCursoSelecionado(null);
        setSemestreSelecionado("");
    }

    // Lista semestres únicos disponíveis
    const semestresDisponiveis = [...new Set(disciplinas.map(d => d.semestre).filter(s => s))].sort();

    if (loading) return <div className="admin-loading"><div className="spinner"></div></div>;

    return (
        <div className="grade-page">
            <div className="grade-header">
                <h1>Cursos e Disciplinas</h1>
                <p>Gerencie a grade curricular</p>
            </div>

            <div className="tabs">
                <button className={tab === 'cursos' ? 'active' : ''} onClick={() => setTab('cursos')}>Cursos</button>
                <button className={tab === 'disciplinas' ? 'active' : ''} onClick={() => setTab('disciplinas')}>Disciplinas</button>
                <button className={tab === 'grade' ? 'active' : ''} onClick={() => setTab('grade')}>Vincular</button>
            </div>

            {/* TAB CURSOS */}
            {tab === 'cursos' && (
                <div className="tab-content">
                    <div className="tab-header">
                        <h2>Cursos</h2>
                        <button className="btn-new" onClick={iniciarNovo}>+ Novo</button>
                    </div>
                    {mostrarForm && (
                        <form className="form-card" onSubmit={salvarCurso}>
                            <h3>{editando ? 'Editar' : 'Novo Curso'}</h3>
                            <input placeholder="Nome do curso" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} required />
                            <div className="form-actions">
                                <button type="submit" className="btn-save">Salvar</button>
                                <button type="button" className="btn-cancel" onClick={cancelar}>Cancelar</button>
                            </div>
                        </form>
                    )}
                    <div className="items-grid">
                        {cursos.map(c => (
                            <div key={c.id} className="item-card">
                                <div className="item-info"><strong>{c.nome}</strong><span>{c.codigo}</span></div>
                                <div className="item-actions">
                                    <button onClick={() => editarCurso(c)}>✏️</button>
                                    <button onClick={() => excluirCurso(c.id)}>🗑️</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB DISCIPLINAS com filtros */}
            {tab === 'disciplinas' && (
                <div className="tab-content">
                    <div className="tab-header">
                        <h2>Disciplinas</h2>
                        <button className="btn-new" onClick={iniciarNovo}>+ Nova</button>
                    </div>
                    
                    {/* FILTROS */}
                    <div className="filtros">
                        <select value={cursoSelecionado?.id || ""} onChange={e => {
                            const id = parseInt(e.target.value);
                            setCursoSelecionado(id ? cursos.find(c => c.id === id) : null);
                        }}>
                            <option value="">Todos os Cursos</option>
                            {cursos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                        </select>
                        
                        <select value={semestreSelecionado} onChange={e => setSemestreSelecionado(e.target.value)}>
                            <option value="">Todos os Semestres</option>
                            {semestresDisponiveis.map(s => <option key={s} value={s}>{s}º Semestre</option>)}
                        </select>
                        
                        {(cursoSelecionado || semestreSelecionado) && (
                            <button className="btn-clear" onClick={limparFiltros}>Limpar</button>
                        )}
                    </div>

                    {mostrarForm && (
                        <form className="form-card" onSubmit={salvarDisciplina}>
                            <h3>{editando ? 'Editar' : 'Nova Disciplina'}</h3>
                            <input placeholder="Nome da disciplina" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} required />
                            <input type="number" placeholder="Semestre (1, 2, 3...)" value={form.semestre} onChange={e => setForm({...form, semestre: e.target.value})} />
                            <div className="form-actions">
                                <button type="submit" className="btn-save">Salvar</button>
                                <button type="button" className="btn-cancel" onClick={cancelar}>Cancelar</button>
                            </div>
                        </form>
                    )}
                    
                    <div className="items-grid">
                        {disciplinasFiltradas.map(d => (
                            <div key={d.id} className="item-card">
                                <div className="item-info">
                                    <strong>{d.nome}</strong>
                                    <span>{d.codigo} • {d.semestre}º Semestre</span>
                                </div>
                                <div className="item-actions">
                                    <button onClick={() => editarDisciplina(d)}>✏️</button>
                                    <button onClick={() => excluirDisciplina(d.id)}>🗑️</button>
                                </div>
                            </div>
                        ))}
                        {disciplinasFiltradas.length === 0 && <p className="empty">Nenhuma disciplina encontrada</p>}
                    </div>
                </div>
            )}

            {/* TAB VINCULAR */}
            {tab === 'grade' && (
                <div className="tab-content">
                    <div className="grade-selector">
                        <label>Selecione o Curso:</label>
                        <div className="curso-buttons">
                            {cursos.map(c => (
                                <button key={c.id} className={gradeCurso?.id === c.id ? 'selected' : ''} onClick={() => selecionarCursoGrade(c)}>
                                    {c.nome}
                                </button>
                            ))}
                        </div>
                    </div>
                    {gradeCurso && (
                        <div className="grade-columns">
                            <div className="grade-column">
                                <h3>Vínculadas</h3>
                                <div className="grade-list">
                                    {disciplinasGrade.map(d => (
                                        <div key={d.id} className="grade-item">
                                            <span>{d.nome} ({d.codigo}) - {d.semestre}º sem</span>
                                            <button onClick={() => removerDisciplinaGrade(d.id)}>🗑️</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="grade-column">
                                <h3>Disponíveis</h3>
                                <div className="grade-list">
                                    {disciplinasDisponiveis.map(d => (
                                        <div key={d.id} className="grade-item add">
                                            <span>{d.nome} ({d.codigo})</span>
                                            <button onClick={() => adicionarDisciplinaGrade(d.id)}>➕</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}