import { Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Inicial from './pages/Inicial';

// 👈 DASHBOARDS NOVOS
import AdminDashboard from './pages/AdminDashboard';
import MonitorDashboard from './pages/MonitorDashboard';
import AlunoDashboard from './pages/AlunoDashboard';
import AlunoDisciplina from './pages/AlunoDisciplina/AlunoDisciplina';

// PÁGINAS EXISTENTES
import Curso from "./pages/Curso/Curso";
import Aluno from './pages/Aluno';
import Monitoria from './pages/Monitoria';
import RegistrarRelatorio from './pages/RegistrarRelatorio';
import MeusMateriais from './pages/MeusMateriais';
import Disciplina from './pages/AdminDisciplina/AdminDisciplina';
import GerenciarRecursos from './pages/Materiais/GerenciarRecursos';
import Perfil from './pages/Perfil';

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

            {/* 👈 DASHBOARDS DEDICADOS */}
            <Route path="/admin-dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
            <Route path="/monitor-dashboard" element={<PrivateRoute><MonitorDashboard /></PrivateRoute>} />
            <Route path="/aluno-dashboard" element={<PrivateRoute><AlunoDashboard /></PrivateRoute>} />

            {/* EXISTENTES */}
            <Route path="/cursos" element={<PrivateRoute><Curso /></PrivateRoute>} />
            <Route path="/alunos" element={<PrivateRoute><Aluno /></PrivateRoute>} />
            <Route path="/disciplinas" element={<PrivateRoute><Disciplina /></PrivateRoute>} />
            <Route path="/monitorias" element={<PrivateRoute><Monitoria /></PrivateRoute>} />
            <Route path="/meus-materiais" element={<PrivateRoute><MeusMateriais /></PrivateRoute>} />
            <Route path="/gerenciar-recursos" element={<PrivateRoute><GerenciarRecursos /></PrivateRoute>} />
            <Route path="/relatorios/novo" element={<PrivateRoute><RegistrarRelatorio /></PrivateRoute>} />
            <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
            <Route path="/perfil/salvos" element={<PrivateRoute><Perfil /></PrivateRoute>} />
            <Route path="/disciplina/:id" element={<PrivateRoute><AlunoDisciplina /></PrivateRoute>} />

            <Route path="*" element={<div>404 - Página não encontrada</div>} />
        </Routes>
    );
}

export default AppRoutes;