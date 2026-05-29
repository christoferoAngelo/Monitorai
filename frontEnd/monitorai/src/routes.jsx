import { Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/home';
import Login from './pages/Login/Login';
import Inicial from './pages/Inicial';

// DASHBOARDS
import AdminDashboard from './pages/Admin/dashboard/AdminDashboard';
import MonitorDashboard from './pages/MonitorDashboard';
import AlunoDashboard from './pages/AlunoDashboard';
import AlunoDisciplina from './pages/AlunoDisciplina/AlunoDisciplina';

// PÁGINAS
import Curso from './pages/Curso/Curso';
import Aluno from './pages/Aluno';
import RegistrarRelatorio from './components/RegistrarRelatorio';
import MeusMateriais from './pages/MeusMateriais';
import Disciplina from './pages/AdminDisciplina/AdminDisciplina';
import GerenciarRecursos from './pages/Materiais/GerenciarRecursos';
import Perfil from './pages/Perfil';
import GerenciarMonitoria from './pages/Admin/GerenciarMonitoria/Monitoria';
import GradeCurricular from './pages/Admin/GerenciarGrade/GradeCurricular';

// Layouts
import AdminLayout from './pages/Admin/components/AdminLayout';

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

            {/* DASHBOARDS */}
            <Route path="/monitor-dashboard" element={<PrivateRoute><MonitorDashboard /></PrivateRoute>} />
            <Route path="/aluno-dashboard" element={<PrivateRoute><AlunoDashboard /></PrivateRoute>} />

            {/* PÁGINAS */}
            <Route path="/cursos" element={<PrivateRoute><Curso /></PrivateRoute>} />
            <Route path="/alunos" element={<PrivateRoute><Aluno /></PrivateRoute>} />
            <Route path="/disciplinas" element={<PrivateRoute><Disciplina /></PrivateRoute>} />
            <Route path="/meus-materiais" element={<PrivateRoute><MeusMateriais /></PrivateRoute>} />
            <Route path="/gerenciar-recursos" element={<PrivateRoute><GerenciarRecursos /></PrivateRoute>} />
            <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
            <Route path="/perfil/salvos" element={<PrivateRoute><Perfil /></PrivateRoute>} />
            <Route path="/disciplina/:id" element={<PrivateRoute><AlunoDisciplina /></PrivateRoute>} />

            {/* ADMIN COM LAYOUT (Sidebar fixa) - AGORA INCLUI O DASHBOARD */}
            <Route element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/admin-monitorias" element={<GerenciarMonitoria />} />
                <Route path="/relatorios/novo" element={<RegistrarRelatorio />} />
                <Route path="/grade-curricular" element={<GradeCurricular />} />
            </Route>

            <Route path="*" element={<div>404 - Página não encontrada</div>} />
        </Routes>
    );
}

export default AppRoutes;