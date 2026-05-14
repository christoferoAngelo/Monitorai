import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Inicial from './pages/Inicial';
import Curso from './pages/Curso';
import Aluno from './pages/Aluno';
import Disciplina from './pages/Disciplina';
import Monitoria from './pages/Monitoria';
import RegistrarRelatorio from './pages/RegistrarRelatorio';
import MeusMateriais from './pages/MeusMateriais';

const PrivateRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('token');

    return isAuthenticated
        ? children
        : <Navigate to="/" />;
};

function AppRoutes() {

    return (
        <Routes>

            {/* LOGIN */}
            <Route path="/" element={<Login />} />

            {/* DASHBOARD */}
            <Route
                path="/dashboard"
                element={
                    <PrivateRoute>
                        <Inicial />
                    </PrivateRoute>
                }
            />

            {/* CURSOS */}
            <Route
                path="/cursos"
                element={
                    <PrivateRoute>
                        <Curso />
                    </PrivateRoute>
                }
            />

            {/* DISCIPLINAS */}
            <Route
                path="/disciplinas"
                element={
                    <PrivateRoute>
                        <Disciplina />
                    </PrivateRoute>
                }
            />

            {/* ALUNOS */}
            <Route
                path="/alunos"
                element={
                    <PrivateRoute>
                        <Aluno />
                    </PrivateRoute>
                }
            />

            {/* MONITORIAS */}
            <Route
                path="/monitorias"
                element={
                    <PrivateRoute>
                        <Monitoria />
                    </PrivateRoute>
                }
            />

            {/* MEUS MATERIAIS - Somente para Monitores */}
            <Route path="/meus-materiais" element={<PrivateRoute><MeusMateriais /></PrivateRoute>} />

            {/* 404 */}
            <Route
                path="*"
                element={<h1>Página não encontrada (404)</h1>}
            />

        <Route path="/relatorios/novo" element={<RegistrarRelatorio />} />

        </Routes>
    );
}

export default AppRoutes;