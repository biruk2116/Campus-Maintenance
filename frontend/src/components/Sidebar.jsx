import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
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
            { path: '/student', icon: <Target size={20} />, label: 'Active Requests', badge: notificationCount },
            { path: '/student/new-request', icon: <PlusCircle size={20} />, label: 'New Request' },
            { path: '/student/history', icon: <History size={20} />, label: 'History' }
        ],
        technician: [
            { path: '/technician', icon: <Wrench size={20} />, label: 'Assigned Work', badge: notificationCount },
            { path: '/technician/history', icon: <History size={20} />, label: 'History' }
        ],
        admin: [
            { path: '/admin', icon: <Activity size={20} />, label: 'Overview' },
            { path: '/admin/requests', icon: <ClipboardList size={20} />, label: 'Active Queue', badge: notificationCount },
            { path: '/admin/history', icon: <History size={20} />, label: 'History' },
            { path: '/admin/users', icon: <Users size={20} />, label: 'Users' },
            { path: '/admin/security', icon: <Shield size={20} />, label: 'Password Reset' }
        ]
    };

    const links = roleLinks[user?.role] || [];

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-[280px] z-50 flex flex-col p-6 glass-panel border-r border-white/5">
            <div className="flex items-center mb-8 px-2">
                <img src={dbuLogo} alt="DBU" className="h-10 mr-4" />
                <div>
                    <h5 className="font-extrabold m-0 text-textPrimary tracking-tight">Command OS</h5>
                    <span className="text-xs text-primary uppercase font-extrabold tracking-widest">{user?.role} Dashboard</span>
                </div>
            </div>

            <ul className="flex-1 flex flex-col gap-2 m-0 p-0 list-none">
                {links.map((link) => (
                    <li key={link.path}>
                        <NavLink
                            to={link.path}
                            end={link.path === `/${user?.role}`}
                            className={({ isActive }) =>
                                `flex items-center p-3 rounded-xl transition-all duration-300 no-underline ${
                                    isActive
                                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20 font-bold'
                                        : 'text-textSecondary hover:bg-white/5 hover:text-textPrimary font-medium'
                                }`
                            }
                        >
                            <span className="mr-3">{link.icon}</span>
                            <span className="text-sm">{link.label}</span>
                            {link.badge > 0 && (
                                <Motion.span 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="ml-auto bg-danger text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-md shadow-danger/40 animate-pulse"
                                >
                                    {link.badge}
                                </Motion.span>
                            )}
                        </NavLink>
                    </li>
                ))}
            </ul>

            <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between gap-3 mb-4">
                    <div>
                        <div className="text-[10px] text-textSecondary uppercase font-extrabold tracking-widest">Appearance</div>
                        <div className="text-sm text-textPrimary font-medium">{isDarkMode ? 'Dark mode' : 'Light mode'}</div>
                    </div>
                    <Motion.button
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        className="p-2 rounded-full bg-surface shadow-sm hover:bg-surface-hover transition-colors"
                        onClick={toggleDarkMode}
                        aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
                        title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
                    >
                        {isDarkMode ? <Sun size={18} className="text-warning" /> : <Moon size={18} className="text-primary" />}
                    </Motion.button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
