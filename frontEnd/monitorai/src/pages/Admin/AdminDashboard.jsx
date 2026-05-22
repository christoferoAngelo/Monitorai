import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

// Componentes Locais
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import MonitoriasTable from './components/MonitoriasTable';
import QuickActions from './components/QuickActions';
import AlertsPanel from "./components/AlertsPanel";

import './AdminDashboard.css';

function AdminDashboard() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [monitorias, setMonitorias] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  // Função para limpar objetos ruins antes de renderizar
  const sanitizeMonitorias = (data) => {
    if (!Array.isArray(data)) return [];
    return data.map(m => ({
      ...m,
      disciplina: typeof m.disciplina === 'object' ? m.disciplina?.nome || '—' : m.disciplina || '—',
      monitor: typeof m.monitor === 'object' ? m.monitor?.username || m.monitor?.usuario || '—' : m.monitor || '—',
      sala: m.sala || '—',
      ativa: Boolean(m.ativa)
    }));
  };

  // Buscar dados ao carregar
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Só busca o que com certeza funciona:
    // 1. /auth/me (usuário logado)
    // 2. /usuarios/stats (números)
    // 3. /monitorias (lista)
    Promise.all([
      api.get('/auth/me'),
      api.get('/usuarios/stats'),
      api.get('/monitorias')
    ])
    .then(([resUser, resStats, resMonitorias]) => {
      const userData = resUser.data;
      setUsuario({
        username: userData.username || userData.usuario || 'Admin',
        role: userData.role || 'ADMIN'
      });
      
      const s = resStats.data || {};
      const monitoriasData = sanitizeMonitorias(resMonitorias.data || []);
      const inativas = monitoriasData.filter(m => !m.ativa).length;

      setStats({
        totalUsuarios: (Number(s.totalAlunos) || 0) + (Number(s.totalMonitores) || 0) + (Number(s.totalAdmins) || 0),
        totalMateriais: Number(s.totalMateriais) || 0, // do stats fixo
        totalRelatorios: Number(s.totalRelatorios) || 0, // do stats fixo
        breakdown: [
          { name: 'Alunos', value: Number(s.totalAlunos) || 0 },
          { name: 'Monitores', value: Number(s.totalMonitores) || 0 },
          { name: 'Admins', value: Number(s.totalAdmins) || 0 }
        ]
      });

      setMonitorias(monitoriasData);

      // Alertas dinâmicos
      const novosAlertas = [];
      if (inativas > 0) {
        novosAlertas.push({ type: 'danger', message: `${inativas} monitorias inativas` });
      }
      // Se tiver relatórios no stats
      if (Number(s.totalRelatorios) > 0) {
        novosAlertas.push({ type: 'warning', message: `${s.totalRelatorios} relatórios enviados` });
      }
      novosAlertas.push({ type: 'info', message: 'Sistema online' });
      setAlertas(novosAlertas);

      setLoading(false);
    })
    .catch((err) => {
      console.error('❌ Erro ao carregar:', err);
      navigate('/login');
    });
  }, [navigate]);

  // Filtrar monitorias baseadas na busca
  const monitoriasFiltradas = monitorias.filter(m => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      m.disciplina?.toLowerCase().includes(term) ||
      m.monitor?.toLowerCase().includes(term) ||
      m.sala?.toLowerCase().includes(term)
    );
  });

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
      case 'Configurações': navigate('/perfil'); break;
      default: alert(`Página "${page}" em desenvolvimento`);
    }
  };

  const handleQuickAction = (action) => {
    switch(action) {
      case 'Novo Usuário': navigate('/alunos'); break;
      case 'Nova Monitoria': navigate('/monitorias'); break;
      case 'Novo Relatório': navigate('/relatorios/novo'); break;
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
    navigate('/monitorias');
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Carregando painel...</p>
      </div>
    );
  }

  const dataAtual = new Date().toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="admin-layout">

      <Sidebar 
        usuario={usuario} 
        onLogout={handleLogout}
        onNavigate={handleNavClick}
      />

      <main className="admin-main">

        <header className="main-header">
          <div>
            <h1>Bem-vindo, {usuario?.username || 'Administrador'}</h1>
            <p>Gerencie usuários, monitorias, relatórios e conteúdos.</p>
          </div>
          <div className="header-date">{dataAtual}</div>
        </header>

        <section className="stats-grid">
          <StatCard 
            title="Usuários" 
            value={Number(stats.totalUsuarios) || 0} 
            subtitle="Total de usuários" 
            variant="blue" 
          />
          <StatCard 
            title="Monitorias" 
            value={Number(monitorias.length) || 0} 
            subtitle={`${(monitorias.filter(m => !m.ativa) || []).length} inativas`} 
            variant="red" 
          />
          <StatCard 
            title="Materiais" 
            value={Number(stats.totalMateriais) || 0} 
            subtitle="Total de materiais" 
            variant="dark" 
          />
          <StatCard 
            title="Relatórios" 
            value={Number(stats.totalRelatorios) || 0} 
            subtitle="Total de relatórios" 
            variant="blue" 
          />
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