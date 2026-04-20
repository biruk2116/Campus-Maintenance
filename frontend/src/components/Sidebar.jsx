import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';

import dbuLogo from '../assets/images/dbu-logo.png';

import {
    Activity,
    ClipboardList,
    History,
    PlusCircle,
    Shield,
    Target,
    Users,
    Wrench
} from 'lucide-react';

const Sidebar = () => {
    const { user } = useAuth();
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
        </aside>
    );
};

export default Sidebar;
