import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';

import dbuLogo from '../assets/images/dbu-logo.png';

import {
    Activity,
    ClipboardList,
    History,
    Moon,
    PlusCircle,
    Shield,
    Sun,
    Target,
    Users,
    Wrench
} from 'lucide-react';

const Sidebar = () => {
    const { user, isDarkMode, toggleDarkMode } = useAuth();
    const [notificationCount, setNotificationCount] = React.useState(0);

    const fetchNotifications = React.useCallback(async () => {
        if (!user) return;

        try {
            const res = await axios.get('index.php?action=getNotificationCounts');
            if (res.data.success) {
                setNotificationCount(res.data.data.unread || 0);
            }
        } catch {
            setNotificationCount(0);
        }
    }, [user]);

    React.useEffect(() => {
        void (async () => {
            await fetchNotifications();
        })();
        const interval = setInterval(fetchNotifications, 20000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const roleLinks = {
        student: [
            { path: '/student', icon: <Target size={18} />, label: 'Active Requests', badge: notificationCount },
            { path: '/student/new-request', icon: <PlusCircle size={18} />, label: 'New Request' },
            { path: '/student/history', icon: <History size={18} />, label: 'History' }
        ],
        technician: [
            { path: '/technician', icon: <Wrench size={18} />, label: 'Assigned Work', badge: notificationCount },
            { path: '/technician/history', icon: <History size={18} />, label: 'History' }
        ],
        admin: [
            { path: '/admin', icon: <Activity size={18} />, label: 'Overview' },
            { path: '/admin/requests', icon: <ClipboardList size={18} />, label: 'Active Queue', badge: notificationCount },
            { path: '/admin/history', icon: <History size={18} />, label: 'History' },
            { path: '/admin/users', icon: <Users size={18} />, label: 'Users' },
            { path: '/admin/security', icon: <Shield size={18} />, label: 'Password Reset' }
        ]
    };

    const links = roleLinks[user?.role] || [];

    return (
        <aside
            className="d-flex flex-column flex-shrink-0 p-4 bg-glass border-end border-secondary border-opacity-10 shadow-22xl"
            style={{ width: '280px', position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 1100 }}
        >
            <div className="d-flex align-items-center mb-5 ps-2">
                <img src={dbuLogo} alt="DBU" className="me-3" style={{ height: '38px' }} />
                <div>
                    <h5 className="fw-800 mb-0 text-main tracking-tighter">Command OS</h5>
                    <span className="smallest text-primary text-uppercase fw-800 tracking-widest">{user?.role} Dashboard</span>
                </div>
            </div>

            <ul className="nav nav-pills flex-column mb-auto">
                {links.map((link) => (
                    <li key={link.path} className="nav-item mb-2">
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
                            {link.badge > 0 && (
                                <span className="badge bg-danger rounded-circle p-2 ms-auto animate-pulse" style={{ fontSize: '0.6rem' }}>
                                    {link.badge}
                                </span>
                            )}
                        </NavLink>
                    </li>
                ))}
            </ul>

            <div className="sidebar-theme-panel mt-4 pt-4 border-top border-secondary border-opacity-10">
                <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
                    <div>
                        <div className="smallest text-muted text-uppercase fw-800 tracking-widest">Appearance</div>
                        <div className="smaller text-main">{isDarkMode ? 'Dark mode' : 'Light mode'}</div>
                    </div>
                    <button
                        type="button"
                        className="btn theme-toggle-btn border-0 p-2 rounded-circle shadow-sm d-inline-flex align-items-center justify-content-center"
                        onClick={toggleDarkMode}
                        aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
                        title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
                    >
                        {isDarkMode ? <Sun size={18} className="text-warning" /> : <Moon size={18} className="text-primary" />}
                    </button>
                </div>
                <button
                    type="button"
                    className="btn btn-surface w-100 rounded-pill py-3 border-secondary border-opacity-10 fw-800 smallest tracking-widest text-uppercase d-inline-flex align-items-center justify-content-center gap-2"
                    onClick={toggleDarkMode}
                >
                    {isDarkMode ? <Sun size={15} className="text-warning" /> : <Moon size={15} className="text-primary" />}
                    {isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
