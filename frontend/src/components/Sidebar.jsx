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
        <aside className="fixed left-0 top-0 bottom-0 w-sidebar-width z-40 flex flex-col px-4 py-6 bg-gradient-to-b from-surface/90 via-surface/70 to-surface/50 backdrop-blur-2xl border-r border-overlay/10 shadow-2xl shadow-black/20 overflow-y-auto custom-scrollbar">
            
            {/* Header */}
            <div className="flex items-center mb-8 px-2 pb-5 border-b border-overlay/10">
                <div className="relative mr-3 shrink-0">
                    <img
                        src={dbuLogo}
                        alt="DBU"
                        className="h-10 w-10 rounded-xl object-cover ring-2 ring-primary/20 shadow-lg shadow-primary/10"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-surface shadow-sm" />
                </div>
                <div className="flex-1 min-w-0">
                    <h5 className="font-extrabold m-0 text-textPrimary tracking-tight text-sm leading-tight truncate">
                        Command OS
                    </h5>
                    <span className="text-[10px] text-primary uppercase font-bold tracking-[0.18em] opacity-80">
                        {user?.role} Dashboard
                    </span>
                </div>
            </div>

            {/* Navigation Links */}
            <ul className="flex-1 flex flex-col gap-1 m-0 p-0 list-none">
                {links.map((link) => (
                    <li key={link.path}>
                        <NavLink
                            to={link.path}
                            end={link.path === `/${user?.role}`}
                            className={({ isActive }) =>
                                `flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 no-underline font-medium group relative ${
                                    isActive
                                        ? 'bg-gradient-to-r from-primary/20 to-secondary/10 text-primary border border-primary/25 shadow-md shadow-primary/10'
                                        : 'text-textSecondary hover:text-textPrimary hover:bg-overlay/8 border border-transparent hover:border-overlay/10 hover:shadow-sm'
                                }`
                            }
                        >
                            {/* Active indicator bar */}
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-primary opacity-0 group-[.active]:opacity-100 transition-opacity duration-200" />

                            <span className="mr-3 transition-all duration-200 group-hover:scale-110 group-hover:text-primary shrink-0">
                                {link.icon}
                            </span>
                            <span className="text-sm flex-1 leading-none">{link.label}</span>
                            {link.badge > 0 && (
                                <Motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="ml-2 bg-danger text-white rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center text-[10px] font-bold shadow-md shadow-danger/40 leading-none"
                                >
                                    {link.badge > 9 ? '9+' : link.badge}
                                </Motion.span>
                            )}
                        </NavLink>
                    </li>
                ))}
            </ul>

        </aside>
    );
};

export default Sidebar;