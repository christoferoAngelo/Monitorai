import { Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/home';
import Login from './pages/Login/Login';
import Inicial from './pages/Inicial';

// DASHBOARDS
import AdminDashboard from './pages/Admin/dashboard/AdminDashboard';
import MonitorDashboard from './pages/Monitor/Dashboard/MonitorDashboard';
import AlunoDashboard from './pages/Aluno/Dashboard/AlunoDashboard';

// PÁGINAS
import Curso from './pages/Curso/Curso';
import RegistrarRelatorio from './components/RegistrarRelatorio';
import Disciplina from './pages/AdminDisciplina/AdminDisciplina';
import GerenciarRecursos from './pages/Monitor/Materiais/GerenciarRecursos';
import Perfil from './pages/Perfil';
import GerenciarMonitoria from './pages/Admin/GerenciarMonitoria/Monitoria';
import GradeCurricular from './pages/Admin/GerenciarGrade/GradeCurricular';
import HistoricoMonitoria from './pages/Admin/HistoricoMonitorias/HistoricoMonitoria';
import Usuarios from './pages/Admin/Usuarios/Usuarios';
import AlunoDisciplina from './pages/Aluno/Disciplina/AlunoDisciplina';
import MonitorRelatorio from './pages/Monitor/Relatorios/MonitorRelatorio';

// Layouts
import AdminLayout from './pages/Admin/components/AdminLayout';
import SharedLayout from './components/SharedLayout/SharedLayout';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? <Navigate to="/dashboard" /> : children;
};

function AppRoutes() {
    return (
        <Routes>
            {/* PÚBLICAS */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

            {/* REDIRECIONADOR */}
            <Route path="/dashboard" element={<PrivateRoute><Inicial /></PrivateRoute>} />


            

            {/* PÁGINAS */}
            <Route path="/cursos" element={<PrivateRoute><Curso /></PrivateRoute>} />
            <Route path="/disciplinas" element={<PrivateRoute><Disciplina /></PrivateRoute>} />
            
            
            
            
            {/* LAYOUT COMPARTILHADO (Aluno e Monitor) */}
            <Route element={<PrivateRoute><SharedLayout /></PrivateRoute>}>
                <Route path="/aluno-dashboard" element={<AlunoDashboard />} />
                <Route path="/monitor/relatorio" element={<MonitorRelatorio />} />
                <Route path="/monitor-dashboard" element={<MonitorDashboard />} />
                <Route path="/disciplina/:id" element={<AlunoDisciplina />} />
                <Route path="/gerenciar-recursos" element={<PrivateRoute><GerenciarRecursos /></PrivateRoute>} />
                <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
                <Route path="/perfil/salvos" element={<PrivateRoute><Perfil /></PrivateRoute>} />
                <Route path="/perfil/salvos" element={<PrivateRoute><Perfil /></PrivateRoute>} />
            </Route>

            {/*LAYOUT DO ADMIN (Sidebar fixa)*/}
            <Route element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/admin-monitorias" element={<GerenciarMonitoria />} />
                <Route path="/historico-monitorias" element={<HistoricoMonitoria />} />
                <Route path="/relatorios/novo" element={<RegistrarRelatorio />} />
                <Route path="/grade-curricular" element={<GradeCurricular />} />
                <Route path="/admin-usuarios" element={<PrivateRoute><Usuarios /></PrivateRoute>} />
            </Route>

            <Route path="*" element={<div>404 - Página não encontrada</div>} />
        </Routes>
    );
}

export default AppRoutes;