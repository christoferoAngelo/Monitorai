import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';

import StatCard from '../components/StatCard';
import MonitoriasTable from '../components/MonitoriasTable';
import QuickActions from '../components/QuickActions';
import AlertsPanel from "../components/AlertsPanel";
import AdminSearch from '../../../components/GlobalSearch/AdminSearch';

import './AdminDashboard.css';

function AdminDashboard() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [monitorias, setMonitorias] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  // Função simplificada para mapear os dados da API (DTO)
  const formatMonitoria = (m) => ({
    ...m,
    id: m.id,
    // Acessa as propriedades de forma direta e segura
    disciplina: m.disciplinaNome|| '—',
    monitor: m.monitorNome || '—',
    sala: m.sala || '—',
    ativa: Boolean(m.ativa)
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    async function carregarDados() {
      try {
        const [resUser, resStats, resMonitorias] = await Promise.all([
          api.get('/auth/me'),
          api.get('/usuarios/stats'),
          api.get('/monitorias')
        ]);

        setUsuario({
          username: resUser.data.username || 'Admin',
          role: resUser.data.role || 'ADMIN'
        });

        const s = resStats.data || {};
        const monitoriasFormatadas = (resMonitorias.data || []).map(formatMonitoria);

        setStats({
          totalUsuarios: (Number(s.totalAlunos) || 0) + (Number(s.totalMonitores) || 0) + (Number(s.totalAdmins) || 0),
          totalMateriais: Number(s.totalMateriais) || 0,
          totalRelatorios: Number(s.totalRelatorios) || 0
        });

        setMonitorias(monitoriasFormatadas);

        // Gerar Alertas
        const inativas = monitoriasFormatadas.filter(m => !m.ativa).length;
        setAlertas([
          inativas > 0 && { type: 'danger', message: `${inativas} monitorias inativas` },
          Number(s.totalRelatorios) > 0 && { type: 'warning', message: `${s.totalRelatorios} relatórios pendentes` },
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

  // Uso de useMemo para performance ao filtrar
  const monitoriasFiltradas = useMemo(() => {
    if (!searchTerm) return monitorias;
    const term = searchTerm.toLowerCase();
    return monitorias.filter(m => 
      m.disciplina.toLowerCase().includes(term) ||
      m.monitor.toLowerCase().includes(term) ||
      m.sala.toLowerCase().includes(term)
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
    const confirmar = window.confirm(
      `Deseja editar a monitoria de ${monitoria.disciplina}?\n\nMonitor: ${monitoria.monitor}\nSala: ${monitoria.sala}`
    );
    if (confirmar) {
      alert(`Abrir modal de edição da monitoria ID: ${monitoria.id}\n(Em desenvolvimento)`);
    }
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
    </div>
  );
}

export default AdminDashboard;