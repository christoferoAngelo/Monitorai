import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';

import StatCard from '../components/StatCard';
import MonitoriasTable from '../components/MonitoriasTable';
import QuickActions from '../components/QuickActions';
import AlertsPanel from "../components/AlertsPanel";
import MonitoriaModal from '../GerenciarMonitoria/MonitoriaModal'; 
import AdminSearch from '../../../components/GlobalSearch/AdminSearch';

import './AdminDashboard.css';

function AdminDashboard() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [monitorias, setMonitorias] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [modalAberto, setModalAberto] = useState(false);
  const [monitoriaEditando, setMonitoriaEditando] = useState(null);

  const navigate = useNavigate();

const formatMonitoria = (m) => {
    // Pega direto do DTO (m.disciplinaNome) ou faz o fallback caso venha aninhado
    const nomeDisciplina = m.disciplinaNome || m.disciplina?.nome || '—';
    const nomeMonitor = m.monitorNome || m.monitor?.usuario?.username || m.monitor?.nome || '—';

    return {
      ...m,
      disciplina: nomeDisciplina,
      monitor: nomeMonitor,
      sala: m.sala || '—',
      ativa: Boolean(m.ativa)
    };
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    async function carregarDados() {
      try {
        const [resUser, resStats, resMonitorias, resMateriais, resRelatorios] = await Promise.all([
          api.get('/auth/me'),
          api.get('/usuarios/stats'),
          api.get('/monitorias'),
          api.get('/materiais'),
          api.get('/relatorios')
        ]);

        setUsuario({
          username: resUser.data.username || 'Admin',
          role: resUser.data.role || 'ADMIN'
        });

        const monitoriasFormatadas = (resMonitorias.data || []).map(formatMonitoria);
        
        const s = resStats.data || {};

        const listaMateriais = resMateriais.data || [];
        const listaRelatorios = resRelatorios.data || [];

        setStats({
          totalUsuarios: (Number(s.totalAlunos) || 0) + (Number(s.totalMonitores) || 0) + (Number(s.totalAdmins) || 0),
          totalMateriais: listaMateriais.length,
          totalRelatorios: listaRelatorios.length
        });

        setMonitorias(monitoriasFormatadas);

        const inativas = monitoriasFormatadas.filter(m => !m.ativa).length;
        
        setAlertas([
          inativas > 0 && { type: 'danger', message: `${inativas} monitorias inativas` },
          listaRelatorios.length > 0 && { type: 'warning', message: `${listaRelatorios.length} relatórios cadastrados` },
          { type: 'info', message: 'Sistema online' }
        ].filter(Boolean));

      } catch (err) {
        console.error('Erro ao carregar:', err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [navigate]);

  const monitoriasFiltradas = useMemo(() => {
    const ativas = monitorias.filter(m => m.ativa);

    if (!searchTerm) return ativas;
    
    const term = searchTerm.toLowerCase();
    return ativas.filter(m => 
      (m.disciplinaNome || '').toLowerCase().includes(term) ||
      (m.monitorNome || '').toLowerCase().includes(term) ||
      (m.sala || '').toLowerCase().includes(term)
    );
  }, [monitorias, searchTerm]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  const handleNavClick = (page) => {
    switch(page) {
      case 'Dashboard': break;
      case 'Usuários': navigate('/alunos'); break;
      case 'Monitorias': navigate('/monitorias'); break;
      case 'Relatórios': navigate('/relatorios/novo'); break;
      case 'Pagamentos': alert('Em breve!'); break;
      case 'Grade Curricular': navigate('/grade-curricular'); break;
      case 'Configurações': navigate('/perfil'); break;
      default: alert(`Página "${page}" em desenvolvimento`);
    }
  };

  const handleQuickAction = (action) => {
    switch(action) {
      case 'Novo Usuário': navigate('/alunos'); break;
      case 'Nova Monitoria': navigate('/monitorias'); break;
      case 'Novo Relatório': navigate('/relatorios/novo'); break;
      case 'Grade Curricular': navigate('/grade-curricular'); break; 
      case 'Lançar Pagamento': alert('Em breve!'); break;
      default: alert(`Ação "${action}" em desenvolvimento`);
    }
  };

  const handleEditMonitoria = (monitoria) => {
    setMonitoriaEditando(monitoria);
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setMonitoriaEditando(null);
  };

  const handleSalvarModal = () => {
    setModalAberto(false);
    setMonitoriaEditando(null);
    window.location.reload();
  };

  const handleNovaMonitoria = () => {
    navigate('/admin-monitorias');
  };

  if (loading) return <div className="admin-loading">Carregando painel...</div>;

  return (
    <div className="admin-layout">
      <main className="admin-main">
        <div className="admin-header">
          <AdminSearch />
        </div>

        <header className="main-header">
          <div>
            <h1>Bem-vindo, {usuario?.username}</h1>
            <p>Gerencie usuários, monitorias, relatórios e conteúdos.</p>
          </div>
          <div className="header-date">
            {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </header>

        <section className="stats-grid">
          <StatCard title="Usuários" value={stats.totalUsuarios} subtitle="Total" variant="blue" />
          <StatCard title="Monitorias" value={monitorias.length} subtitle={`${monitorias.filter(m => !m.ativa).length} inativas`} variant="red" />
          <StatCard title="Materiais" value={stats.totalMateriais} subtitle="Total" variant="dark" />
          <StatCard title="Relatórios" value={stats.totalRelatorios} subtitle="Total" variant="blue" />
        </section>

        <section className="content-grid">
          <MonitoriasTable 
            monitorias={monitoriasFiltradas} 
            onEdit={handleEditMonitoria}
            onNova={handleNovaMonitoria}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          <div className="right-panel">
            <QuickActions onAction={handleQuickAction} />
            <AlertsPanel alertas={alertas} />
          </div>
        </section>
      </main>
      {modalAberto && (
        <MonitoriaModal 
          monitoramento={monitoriaEditando} 
          onClose={handleFecharModal} 
          onSave={handleSalvarModal} 
        />
      )}
    </div>
  );
}

export default AdminDashboard;