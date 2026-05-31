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
    const roleLabel = user?.role ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)}` : 'User';

    return (
        <aside className="fixed left-0 top-16 bottom-0 w-sidebar-width z-40 flex flex-col px-4 pt-5 pb-5 bg-gradient-to-b from-white via-sky-50/95 to-emerald-50/85 dark:from-surface/95 dark:via-slate-900/90 dark:to-slate-950/95 backdrop-blur-2xl border-r border-sky-200/70 dark:border-overlay/10 shadow-2xl shadow-sky-200/60 dark:shadow-black/30 overflow-y-auto custom-scrollbar">
            
            {/* Header */}
            <div className="relative mb-7 px-2 pb-5 border-b border-sky-200/80 dark:border-overlay/10">
                <div className="absolute -top-4 -right-6 h-24 w-24 rounded-full bg-emerald-300/20 dark:bg-emerald-400/10 blur-2xl pointer-events-none" />
                <div className="relative flex items-center rounded-2xl border border-emerald-200/90 dark:border-emerald-400/20 bg-white/80 dark:bg-surface/40 p-3 shadow-lg shadow-emerald-100/70 dark:shadow-black/20">
                    <div className="relative mr-3 shrink-0">
                        <img
                            src={dbuLogo}
                            alt="DBU"
                            className="h-12 w-12 rounded-2xl object-cover bg-white ring-2 ring-emerald-300/70 dark:ring-emerald-400/35 shadow-lg shadow-emerald-200/70 dark:shadow-emerald-950/30"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-lime-400 rounded-full border-2 border-white dark:border-surface shadow-[0_0_12px_rgba(132,204,22,0.85)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="m-0 text-[10px] font-black uppercase tracking-[0.18em] text-lime-600 dark:text-lime-300">Active Now</p>
                        <h5 className="font-extrabold m-0 text-slate-950 dark:text-textPrimary tracking-tight text-sm leading-tight truncate">
                            {roleLabel}
                        </h5>
                        <span className="text-[10px] text-emerald-600 dark:text-lime-300 uppercase font-bold tracking-[0.18em]">
                            Dashboard
                        </span>
                    </div>
                </div>
            </div>

            {/* Navigation Links */}
            <ul className="flex-1 flex flex-col gap-1.5 m-0 p-0 list-none">
                {links.map((link) => (
                    <li key={link.path}>
                        <NavLink
                            to={link.path}
                            end={link.path === `/${user?.role}`}
                            className={({ isActive }) =>
                                `flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 no-underline font-bold group relative ${
                                    isActive
                                        ? 'bg-gradient-to-r from-lime-100 via-emerald-50 to-cyan-50 dark:from-lime-400/18 dark:via-emerald-400/12 dark:to-cyan-400/10 text-emerald-700 dark:text-lime-200 border border-emerald-200/90 dark:border-lime-300/20 shadow-md shadow-emerald-200/70 dark:shadow-lime-950/20'
                                        : 'text-slate-600 dark:text-textSecondary hover:text-slate-950 dark:hover:text-textPrimary hover:bg-white/80 dark:hover:bg-overlay/8 border border-transparent hover:border-sky-200/80 dark:hover:border-overlay/10 hover:shadow-sm'
                                }`
                            }
                        >
                            {/* Active indicator bar */}
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-lime-400 opacity-0 group-[.active]:opacity-100 transition-opacity duration-200 shadow-[0_0_14px_rgba(132,204,22,0.8)]" />

                            <span className="mr-3 transition-all duration-200 group-hover:scale-110 group-hover:text-emerald-600 dark:group-hover:text-lime-300 shrink-0">
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
