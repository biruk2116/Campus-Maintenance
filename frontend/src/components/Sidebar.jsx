import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';

// Assets
import dbuLogo from '../assets/images/dbu-logo.png';

import { 
    LayoutDashboard, 
    PlusCircle, 
    ClipboardList, 
    Users, 
    Settings, 
    LogOut, 
    Wrench,
    User,
    Sun,
    Moon,
    Shield,
    ChevronRight,
    Bell,
    Activity,
    Target
} from 'lucide-react';

const Sidebar = () => {
    const { user, logout, isDarkMode, toggleDarkMode } = useAuth();
    const navigate = useNavigate();
    const [pendingCount, setPendingCount] = React.useState(0);

    const fetchNotifications = React.useCallback(async () => {
        if (user?.role === 'admin') {
            try {
                const res = await axios.get('index.php?action=getAllRequests');
                if (res.data.success) {
                    setPendingCount(res.data.data.filter(r => r.status === 'Pending').length);
                }
            } catch (err) { console.warn("Operations Sync Failed"); }
        }
    }, [user]);

    React.useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000); 
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const roleLinks = {
        student: [
            { path: '/student', icon: <Target size={18} />, label: 'Strategic Hub' },
            { path: '/student/new-request', icon: <PlusCircle size={18} />, label: 'Log Dispatch' },
        ],
        technician: [
            { path: '/technician', icon: <Wrench size={18} />, label: 'Field Terminal' },
        ],
        admin: [
            { path: '/admin', icon: <Activity size={18} />, label: 'Operations Pulse' },
            { path: '/admin/requests', icon: <ClipboardList size={18} />, label: 'Strategic Queue' },
            { path: '/admin/users', icon: <Users size={18} />, label: 'Personnel Registry' },
        ]
    };

    const links = roleLinks[user?.role] || [];

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <motion.div 
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            className="d-flex flex-column flex-shrink-0 p-4 bg-glass border-end border-secondary border-opacity-10 shadow-22xl" 
            style={{ width: '280px', position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 1100 }}
        >
            <div className="d-flex align-items-center mb-5 ps-2">
                <img src={dbuLogo} alt="DBU" className="me-3" style={{ height: '38px' }} />
                <div>
                    <h5 className="fw-800 mb-0 text-main tracking-tighter">Command OS</h5>
                    <span className="smallest text-primary text-uppercase fw-800 tracking-widest">{user?.role} Unit</span>
                </div>
            </div>

            <ul className="nav nav-pills flex-column mb-auto">
                {links.map((link, i) => (
                    <li key={i} className="nav-item mb-2">
                        <NavLink 
                            to={link.path} 
                            end={link.path === `/${user?.role}`}
                            className={({ isActive }) => 
                                `nav-link d-flex align-items-center p-3 rounded-4 border-0 transition-all ${
                                    isActive 
                                    ? 'bg-primary text-white shadow-lg fw-800' 
                                    : 'text-muted hover-bg-surface-hover fw-bold'
                                }`
                            }
                        >
                            <span className="me-3">{link.icon}</span>
                            <span className="smaller">{link.label}</span>
                            {link.path === '/admin/requests' && pendingCount > 0 && (
                                <span className="badge bg-danger rounded-circle p-2 ms-auto animate-pulse" style={{ fontSize: '0.6rem' }}>
                                    {pendingCount}
                                </span>
                            )}
                        </NavLink>
                    </li>
                ))}
            </ul>

            <div className="mt-auto">
                <div className="premium-card p-4 border-secondary border-opacity-10 bg-surface shadow-md mb-3">
                    <div className="d-flex align-items-center mb-4">
                        <div className="p-2 rounded-circle bg-primary bg-opacity-10 text-primary me-3 border border-primary border-opacity-20 shadow-sm">
                            <User size={20} />
                        </div>
                        <div className="overflow-hidden">
                            <h6 className="fw-800 mb-0 smaller text-main text-truncate">{user?.name}</h6>
                            <p className="smallest text-muted mb-0 opacity-75 uppercase fw-bold tracking-widest">{user?.user_code}</p>
                        </div>
                    </div>
                    <div className="d-flex gap-3">
                        <button onClick={toggleDarkMode} className="btn btn-surface btn-sm flex-grow-1 p-2 border-secondary border-opacity-10 rounded-3">
                            {isDarkMode ? <Sun size={14} className="text-warning" /> : <Moon size={14} className="text-primary" />}
                        </button>
                        <button onClick={handleLogout} className="btn btn-danger btn-sm flex-grow-1 p-2 bg-danger bg-opacity-10 border-0 text-danger fw-800 rounded-3 smallest tracking-widest uppercase">
                            EXIT
                        </button>
                    </div>
                </div>
                <div className="text-center">
                    <p className="smallest text-muted opacity-30 uppercase fw-bold tracking-widest">v2.4 Strategic Grid</p>
                </div>
            </div>
        </motion.div>
    );
};

export default Sidebar;
