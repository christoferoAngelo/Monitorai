import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import api from '../../../services/api';
import Sidebar from './Sidebar';
import './AdminLayout.css';

export default function AdminLayout() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            api.get('/auth/me').then(res => {
                setUsuario({
                    username: res.data.username,
                    role: res.data.role
                });
            }).catch(() => {
                localStorage.removeItem('token');
                navigate('/login');
            });
        }
    }, []);

    function handleLogout() {
        localStorage.removeItem('token');
        navigate('/login');
    }

    function handleNavClick(page) {
        switch(page) {
            case 'Dashboard': navigate('/admin-dashboard'); break;
            case 'Usuários': navigate('/alunos'); break;
            case 'Monitorias': navigate('/admin-monitorias'); break;
            case 'Relatórios': navigate('/relatorios/novo'); break;
            case 'Grade Curricular': navigate('/grade-curricular'); break;
            case 'Pagamentos': alert('Em breve!'); break;
            case 'Configurações': navigate('/perfil'); break;
            default: alert('Em desenvolvimento');
        }
    }

    return (
        <div className="admin-layout">
            <Sidebar 
                usuario={usuario}
                onLogout={handleLogout}
                onNavigate={handleNavClick}
            />
            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
}