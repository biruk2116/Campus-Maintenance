import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
    LayoutDashboard, 
    PlusCircle, 
    ClipboardList, 
    Users, 
    Settings, 
    LogOut, 
    Wrench,
    UserCircle,
    Activity,
    Sun,
    Moon
} from 'lucide-react';

const Sidebar = () => {
    const { user, logout, isDarkMode, toggleDarkMode } = useAuth();
    const navigate = useNavigate();

    const roleLinks = {
        student: [
            { path: '/student', icon: <LayoutDashboard size={18} />, label: 'Overview' },
            { path: '/student/new-request', icon: <PlusCircle size={18} />, label: 'Log Fault' },
            { path: '/student/my-requests', icon: <ClipboardList size={18} />, label: 'My Tickets' },
        ],
        technician: [
            { path: '/technician', icon: <LayoutDashboard size={18} />, label: 'Task Board' },
            { path: '/technician/performance', icon: <Activity size={18} />, label: 'Field Output' },
        ],
        admin: [
            { path: '/admin', icon: <LayoutDashboard size={18} />, label: 'Operations' },
            { path: '/admin/requests', icon: <ClipboardList size={18} />, label: 'Active Queue' },
            { path: '/admin/users', icon: <Users size={18} />, label: 'Personnel' },
            { path: '/admin/settings', icon: <Settings size={18} />, label: 'System' },
        ]
    };

    const links = roleLinks[user?.role] || [];

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="d-flex flex-column flex-shrink-0 p-4 bg-surface border-end border-secondary border-opacity-10" 
            style={{ width: '280px', position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 1000 }}
        >
            <div className="d-flex align-items-center mb-5 ps-2">
                <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3">
                    <Wrench className="text-primary" size={24} />
                </div>
                <div>
                    <h5 className="fw-bold mb-0 text-main tracking-tighter">Maintain<span className="text-primary text-opacity-70">OS</span></h5>
                    <span className="smaller text-muted text-uppercase fw-800 tracking-widest" style={{ fontSize: '0.65rem' }}>{user?.role} Unit</span>
                </div>
            </div>

            <div className="text-muted smaller fw-bold mb-3 px-2 tracking-widest opacity-50 uppercase">Primary Navigation</div>
            <ul className="nav nav-pills flex-column mb-auto">
                {links.map((link, i) => (
                    <motion.li 
                        key={i} 
                        className="nav-item mb-1"
                        whileHover={{ x: 4 }}
                    >
                        <NavLink 
                            to={link.path} 
                            end={link.path === `/${user?.role}`}
                            className={({ isActive }) => 
                                `nav-link d-flex align-items-center p-3 rounded-3 border-0 transition-all ${
                                    isActive 
                                    ? 'bg-primary bg-opacity-10 text-primary fw-bold' 
                                    : 'text-muted hover-bg-surface-hover fw-medium'
                                }`
                            }
                        >
                            <span className="me-3">{link.icon}</span>
                            <span className="flex-grow-1 smaller">{link.label}</span>
                            {({ isActive }) => isActive && (
                                <motion.div layoutId="activeInd" className="bg-primary rounded-pill me-n2" style={{ width: '3px', height: '16px' }} />
                            )}
                        </NavLink>
                    </motion.li>
                ))}
            </ul>

            <div className="mt-auto">
                {/* Theme Toggle Button */}
                <button 
                    onClick={toggleDarkMode}
                    className="btn btn-surface border-secondary border-opacity-10 w-100 mb-3 p-3 rounded-3 d-flex align-items-center justify-content-between transition-all"
                >
                    <div className="d-flex align-items-center">
                        {isDarkMode ? <Sun size={18} className="text-warning me-2" /> : <Moon size={18} className="text-primary me-2" />}
                        <span className="smaller fw-bold">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                    </div>
                </button>

                <div className="premium-card p-3 border-secondary border-opacity-10 bg-surface-hover bg-opacity-40 mb-3">
                    <div className="d-flex align-items-center mb-3">
                        <div className="p-2 rounded-circle bg-background text-primary me-2 border border-secondary border-opacity-10">
                            <UserCircle size={18} />
                        </div>
                        <div className="overflow-hidden">
                            <h6 className="fw-bold mb-0 smaller text-main text-truncate">{user?.name}</h6>
                            <p className="smaller text-muted mb-0 opacity-50 text-truncate">{user?.user_code}</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="btn btn-outline-danger btn-sm w-100 border-0 bg-danger bg-opacity-10 py-2 rounded-3 d-flex align-items-center justify-content-center"
                    >
                        <LogOut size={14} className="me-2" />
                        <span className="smaller fw-bold">Terminate Session</span>
                    </button>
                </div>
                <div className="text-center">
                    <p className="smaller text-muted opacity-30 mb-0">Platform v3.0.0-Adaptive</p>
                </div>
            </div>
        </motion.div>
    );
};

export default Sidebar;
