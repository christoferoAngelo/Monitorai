import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Inicial from './pages/Inicial'; // Importe aqui

const PrivateRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('token');
    return isAuthenticated ? children : <Navigate to="/" />;
};

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />

            <Route 
                path="/dashboard" 
                element={
                    <PrivateRoute>
                        <Inicial /> {/* Use o componente aqui */}
                    </PrivateRoute>
                } 
            />

            <Route path="*" element={<h1>Página não encontrada (404)</h1>} />
        </Routes>
    );
}

export default AppRoutes;