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
        <aside className="fixed left-0 top-0 bottom-0 w-sidebar-width z-40 flex flex-col p-6 bg-gradient-to-b from-surface/80 to-surface/40 backdrop-blur-xl border-r border-overlay/10 shadow-lg overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-center mb-8 px-2 pb-4 border-b border-overlay/10">
                <img src={dbuLogo} alt="DBU" className="h-10 mr-3 rounded-lg" />
                <div className="flex-1">
                    <h5 className="font-extrabold m-0 text-textPrimary tracking-tight text-sm">Command OS</h5>
                    <span className="text-xs text-primary uppercase font-bold tracking-widest">{user?.role} Dashboard</span>
                </div>
            </div>

            {/* Navigation Links */}
            <ul className="flex-1 flex flex-col gap-2 m-0 p-0 list-none">
                {links.map((link, idx) => (
                    <li key={link.path}>
                        <NavLink
                            to={link.path}
                            end={link.path === `/${user?.role}`}
                            className={({ isActive }) =>
                                `flex items-center p-3 rounded-lg transition-all duration-300 no-underline font-medium group relative ${
                                    isActive
                                        ? 'bg-gradient-to-r from-primary/20 to-secondary/10 text-primary border border-primary/30 shadow-lg shadow-primary/10'
                                        : 'text-textSecondary hover:text-textPrimary hover:bg-overlay/5 border border-transparent'
                                }`
                            }
                        >
                            <span className="mr-3 transition-transform group-hover:scale-110">{link.icon}</span>
                            <span className="text-sm flex-1">{link.label}</span>
                            {link.badge > 0 && (
                                <Motion.span 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="ml-2 bg-danger text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-md shadow-danger/40"
                                >
                                    {link.badge > 9 ? '9+' : link.badge}
                                </Motion.span>
                            )}
                        </NavLink>
                    </li>
                ))}
            </ul>

            {/* Footer Section */}
            <div className="mt-6 pt-6 border-t border-overlay/10 space-y-3">
                <button
                    onClick={toggleDarkMode}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-textSecondary hover:text-primary hover:bg-overlay/5 border border-transparent hover:border-primary/20 transition-all text-sm font-medium"
                >
                    {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
