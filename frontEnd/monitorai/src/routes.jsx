import { Routes, Route, Navigate } from 'react-router-dom';

// Importe suas páginas aqui (vamos criar nomes genéricos por enquanto)
import Login from './pages/Login';

// Exemplo de uma "Rota Protegida" simples
const PrivateRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('token'); // Verifica se existe token
    return isAuthenticated ? children : <Navigate to="/" />;
};

function AppRoutes() {
    return (
        <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<Login />} />

            {/* Rotas Protegidas (Só acessa se estiver logado) */}
            <Route 
                path="/dashboard" 
                element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                } 
            />

            {/* Rota de "Não Encontrado" */}
            <Route path="*" element={<h1>Página não encontrada (404)</h1>} />
        </Routes>
    );
}

export default AppRoutes;