import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    Bell,
    CheckCircle2,
    ClipboardList,
    Loader2,
    LogOut,
    MapPin,
    Phone,
    RefreshCcw,
    Shield,
    Trash2,
    UserPlus,
    Users,
    Wrench
} from 'lucide-react';
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Tooltip
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

import Sidebar from '../../components/Sidebar';
import PremiumModal from '../../components/PremiumModal';
import axios from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

import dbuLogo from '../../assets/images/dbu-logo.png';
import techBg from '../../assets/images/tech-bg.png';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const TECHNICIAN_SKILLS = [
    'Electrical',
    'Plumbing',
    'Network',
    'Hardware',
    'Civil'
];

const REQUEST_CATEGORIES = [
    'Network Equipment',
    'Audio Visual',
    'HVAC',
    'Plumbing Equipment',
    'Computer Hardware',
    'Workshop Equipment'
];

const isValidFullName = (name) => /^[A-Za-z]+(?:[ .'-][A-Za-z]+)+$/.test(name.trim());
const isValidUserCode = (userCode) => /^DBU\d{7}$/i.test(userCode.trim());

const statusClassName = (status) => {
    if (status === 'Completed') return 'bg-success/10 text-success border border-success/20';
    if (status === 'Pending') return 'bg-danger/10 text-danger border border-danger/20';
    if (status === 'On Hold') return 'bg-textSecondary/10 text-textSecondary border border-textSecondary/20';
    return 'bg-warning/10 text-warning border border-warning/20';
};

const DashboardHeader = ({ title, subtitle, unreadCount, onReadNotifications, onLogout }) => (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4 mt-1">
        <div className="flex items-center gap-4">
            <img src={dbuLogo} alt="DBU" className="hidden md:block h-10" />
            <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-textPrimary mb-0.5">{title}</h2>
                <p className="text-[11px] text-textSecondary uppercase font-extrabold tracking-widest opacity-75 m-0">{subtitle}</p>
            </div>
        </div>
        <div className="flex items-center gap-3">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onReadNotifications}
                className="relative p-2.5 rounded-full bg-surface/50 border border-overlay/10 hover:bg-surface transition-colors"
                title="Open active queue"
            >
                <Bell size={19} className={unreadCount > 0 ? 'text-danger' : 'text-textSecondary'} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 min-w-[20px] h-[20px] flex items-center justify-center text-[10px] font-bold text-white bg-danger rounded-full shadow-md">
                        {unreadCount}
                    </span>
                )}
            </motion.button>
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLogout} 
                className="flex items-center gap-2 px-4 py-2 bg-danger/10 text-danger hover:bg-danger hover:text-white rounded-full text-[11px] font-extrabold uppercase tracking-widest transition-colors border border-danger/20"
            >
                <LogOut size={16} />
                Logout
            </motion.button>
        </div>
    </div>
);

const RequestDetailsModal = ({ request, logs, loading, technicians, onAssign, onClose }) => {
    return (
        <PremiumModal
            isOpen={!!request}
            onClose={onClose}
            title={request ? `Request #${request.id}` : 'Request Details'}
            maxWidth="860px"
            showFooter={false}
        >
            {request && (
                <div>
                    <div className="p-5 rounded-2xl bg-primary/10 border border-primary/20 mb-6">
                        <div className="flex flex-wrap justify-between items-start gap-4">
                            <div>
                                <h5 className="text-lg font-extrabold text-textPrimary mb-1">{request.title}</h5>
                                <p className="text-sm text-textSecondary mb-0 font-medium">{request.description}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${statusClassName(request.status)}`}>{request.status}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <label className="block text-xs font-bold text-textSecondary mb-3 uppercase tracking-widest">Student</label>
                            <div className="font-extrabold text-textPrimary text-sm">{request.student_name}</div>
                            <div className="text-xs text-textSecondary mt-1 font-medium">{request.student_code}</div>
                            <div className="flex items-center text-xs text-textSecondary mt-2 font-medium">
                                <Phone size={14} className="mr-2 text-primary" />
                                {request.student_phone || 'No phone number'}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-textSecondary mb-3 uppercase tracking-widest">Location</label>
                            <div className="flex items-center font-extrabold text-textPrimary text-sm">
                                <MapPin size={16} className="mr-2 text-primary" />
                                {request.location}
                            </div>
                            <div className="text-xs text-textSecondary mt-2 font-medium">Priority: <span className="font-bold">{request.priority}</span></div>
                            <div className="text-xs text-textSecondary mt-1 font-medium">Category: <span className="font-bold">{request.category}</span></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            {request.status !== 'Completed' ? (
                                <>
                                    <label className="block text-xs font-bold text-textSecondary mb-3 uppercase tracking-widest">Assign Technician</label>
                                    <select
                                        className="w-full py-3 px-4 bg-surface/50 border border-overlay/10 text-textPrimary rounded-xl font-bold focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner appearance-none"
                                        defaultValue={request.technician_id ? String(request.technician_id) : ''}
                                        onChange={(event) => event.target.value && onAssign(request.id, event.target.value)}
                                    >
                                        <option value="" className="bg-surface text-textSecondary">Select technician</option>
                                        {technicians.map((technician) => (
                                            <option key={technician.id} value={technician.id} className="bg-surface text-textPrimary">
                                                {technician.name} - {technician.skills}
                                            </option>
                                        ))}
                                    </select>
                                </>
                            ) : (
                                <label className="block text-xs font-bold text-textSecondary mb-3 uppercase tracking-widest">Assigned Technician</label>
                            )}
                            
                            {request.technician_name && (
                                <div className="mt-4 p-4 rounded-xl bg-surface/30 border border-overlay/5 shadow-sm">
                                    <div className="font-extrabold text-textPrimary text-sm">{request.technician_name}</div>
                                    <div className="text-xs text-textSecondary mt-1 font-medium">{request.technician_skills || 'Technician'}</div>
                                    <div className="flex items-center text-xs text-textSecondary mt-2 font-medium">
                                        <Phone size={14} className="mr-2 text-primary" />
                                        {request.technician_phone || 'No phone number'}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-textSecondary mb-3 uppercase tracking-widest">Progress Timeline</label>
                            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                                {loading ? (
                                    <div className="flex justify-center py-8">
                                        <Loader2 size={32} className="animate-spin text-primary" />
                                    </div>
                                ) : logs.length > 0 ? (
                                    logs.map((log, idx) => (
                                        <motion.div 
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            key={log.id} 
                                            className="p-4 rounded-xl bg-surface/30 border border-overlay/5 shadow-sm"
                                        >
                                            <div className="flex justify-between items-start gap-4 mb-2">
                                                <div>
                                                    <div className="font-extrabold text-textPrimary text-sm">{log.action_taken}</div>
                                                    <div className="text-xs text-textSecondary mt-1">{log.action_by}</div>
                                                </div>
                                                <span className="text-[10px] font-bold text-textSecondary">{new Date(log.created_at).toLocaleString()}</span>
                                            </div>
                                            <div className="text-sm text-textPrimary">{log.remarks}</div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-sm text-textSecondary font-medium">No timeline entries yet.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PremiumModal>
    );
};

const useAdminNotifications = () => {
    const [unreadCount, setUnreadCount] = useState(0);

    const refreshNotifications = useCallback(async () => {
        const res = await axios.get('index.php?action=getNotificationCounts');
        if (res.data.success) {
            setUnreadCount(res.data.data.unread || 0);
        }
    }, []);

    const markNotificationsRead = useCallback(async () => {
        await axios.post('index.php?action=markNotificationsRead');
        await refreshNotifications();
    }, [refreshNotifications]);

    useEffect(() => {
        void (async () => {
            await refreshNotifications();
        })();
        const interval = setInterval(refreshNotifications, 15000);
        return () => clearInterval(interval);
    }, [refreshNotifications]);

    return { unreadCount, refreshNotifications, markNotificationsRead };
};

const AdminOverview = () => {
    const { unreadCount, refreshNotifications, markNotificationsRead } = useAdminNotifications();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const refreshData = useCallback(async () => {
        try {
            const [requestRes, userRes] = await Promise.all([
                axios.get('index.php?action=getAllRequests'),
                axios.get('index.php?action=getAllUsers')
            ]);

            if (requestRes.data.success) setRequests(requestRes.data.data);
            if (userRes.data.success) setUsers(userRes.data.data);
            await refreshNotifications();
        } finally {
            setLoading(false);
        }
    }, [refreshNotifications]);

    useEffect(() => {
        refreshData();
        const interval = setInterval(refreshData, 15000);
        return () => clearInterval(interval);
    }, [refreshData]);

    const totalRequests = useMemo(() => requests.length, [requests]);
    const pendingCount = useMemo(() => requests.filter((request) => request.status === 'Pending').length, [requests]);
    const assignedCount = useMemo(() => requests.filter((request) => request.status === 'Assigned').length, [requests]);
    const inProgressCount = useMemo(() => requests.filter((request) => request.status === 'In Progress').length, [requests]);
    const completedCount = useMemo(() => requests.filter((request) => request.status === 'Completed').length, [requests]);
    const technicianCount = useMemo(() => users.filter((user) => user.role === 'technician').length, [users]);
    const studentCount = useMemo(() => users.filter((user) => user.role === 'student').length, [users]);
    const categoryCounts = useMemo(
        () => REQUEST_CATEGORIES.map((category) => requests.filter((request) => request.category === category).length),
        [requests]
    );
    const statusCounts = useMemo(() => [
        pendingCount,
        assignedCount,
        inProgressCount,
        requests.filter((request) => request.status === 'On Hold').length,
        completedCount
    ], [pendingCount, assignedCount, inProgressCount, completedCount, requests]);
    const completionRate = totalRequests === 0 ? 0 : Math.round((completedCount / totalRequests) * 100);

    const handleNotificationClick = async () => {
        await markNotificationsRead();
        navigate('/admin/requests');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-2 md:p-4 text-[0.94rem]"
        >
            <DashboardHeader
                title="Admin Dashboard"
                subtitle="Monitor live maintenance requests, users, and technician workload"
                unreadCount={unreadCount}
                onReadNotifications={handleNotificationClick}
                onLogout={logout}
            />

            <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 md:gap-3 mb-3">
                {[
                    {
                        label: 'Total Requests',
                        value: totalRequests,
                        icon: <ClipboardList size={20} className="text-primary" />,
                        note: 'All submitted issues'
                    },
                    {
                        label: 'Pending',
                        value: pendingCount,
                        icon: <Activity size={20} className="text-warning" />,
                        note: 'Need review'
                    },
                    {
                        label: 'In Progress',
                        value: inProgressCount,
                        icon: <Wrench size={20} className="text-info" />,
                        note: 'Technicians active'
                    },
                    {
                        label: 'Completed',
                        value: completedCount,
                        icon: <CheckCircle2 size={20} className="text-success" />,
                        note: 'Closed requests'
                    }
                ].map((item, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={item.label} 
                        whileHover={{ y: -4, scale: 1.01 }}
                        className="glass-card p-4 relative overflow-hidden"
                    >
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-info to-success opacity-70" />
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-textSecondary">{item.label}</p>
                                <h2 className="text-3xl font-extrabold text-textPrimary mt-1 tracking-tight">{item.value}</h2>
                            </div>
                            <div className="p-2 rounded-xl bg-surface/70 border border-overlay/10 shadow-sm">{item.icon}</div>
                        </div>
                        <p className="text-xs text-textSecondary">{item.note}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-2 md:gap-3 mb-3">
                <div className="xl:col-span-2 glass-card p-4">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h4 className="text-lg font-extrabold text-textPrimary mb-1">Queue Status</h4>
                            <p className="text-xs text-textSecondary font-medium m-0">Overall request status distribution</p>
                        </div>
                        <motion.button 
                            whileHover={{ scale: 1.1, rotate: 15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={refreshData}
                            className={`p-2 rounded-lg bg-surface border border-overlay/5 text-textSecondary hover:text-primary transition-colors ${loading ? 'animate-spin text-primary' : ''}`}
                        >
                            <Activity size={20} />
                        </motion.button>
                    </div>
                    <div className="h-[210px]">
                        <Doughnut
                            data={{
                                labels: ['Pending', 'Assigned', 'In Progress', 'On Hold', 'Completed'],
                                datasets: [
                                    {
                                        data: statusCounts,
                                        backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#6b7280', '#10b981'],
                                        borderWidth: 0,
                                        hoverOffset: 6
                                    }
                                ]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: 'Inter', weight: 600 } } } },
                                cutout: '68%'
                            }}
                        />
                    </div>
                </div>

                <div className="glass-card p-4">
                    <div className="flex items-center justify-between mb-3 gap-4">
                        <div>
                            <h4 className="text-lg font-extrabold text-textPrimary mb-1">Completion</h4>
                            <p className="text-xs text-textSecondary font-medium m-0">Completed {completedCount} of {totalRequests} requests</p>
                        </div>
                        <span className="rounded-full bg-success/10 text-success text-xs font-bold px-3 py-1">{completionRate}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-overlay/20 overflow-hidden mb-3">
                        <div className="h-full rounded-full bg-success" style={{ width: `${completionRate}%` }} />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="p-3 rounded-xl bg-surface/50 border border-overlay/10">
                            <p className="text-[10px] uppercase tracking-[0.14em] text-textSecondary mb-1">Assigned</p>
                            <span className="text-xl font-extrabold text-textPrimary">{assignedCount}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-surface/50 border border-overlay/10">
                            <p className="text-[10px] uppercase tracking-[0.14em] text-textSecondary mb-1">Working</p>
                            <span className="text-xl font-extrabold text-textPrimary">{inProgressCount}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-surface/50 border border-overlay/10">
                            <p className="text-[10px] uppercase tracking-[0.14em] text-textSecondary mb-1">Done</p>
                            <span className="text-xl font-extrabold text-textPrimary">{completedCount}</span>
                        </div>
                    </div>
                </div>
                <div className="xl:col-span-2 glass-card p-4 h-full flex flex-col">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h4 className="text-lg font-extrabold text-textPrimary mb-1">Requests by Category</h4>
                                <p className="text-xs text-textSecondary font-medium m-0">Live queue breakdown</p>
                            </div>
                            <motion.button 
                                whileHover={{ scale: 1.1, rotate: 15 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={refreshData}
                                className={`p-2 rounded-lg bg-surface border border-overlay/5 text-textSecondary hover:text-primary transition-colors ${loading ? 'animate-spin text-primary' : ''}`}
                            >
                                <Activity size={20} />
                            </motion.button>
                        </div>
                        <div className="flex-1 min-h-[210px]">
                            <Bar
                                data={{
                                    labels: REQUEST_CATEGORIES,
                                    datasets: [
                                        {
                                            label: 'Requests',
                                            data: categoryCounts,
                                            backgroundColor: '#6366f1',
                                            borderRadius: 6,
                                            hoverBackgroundColor: '#8b5cf6'
                                        }
                                    ]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: {
                                        y: { ticks: { color: '#94a3b8', stepSize: 1 }, grid: { color: 'rgba(255,255,255,0.05)' } },
                                        x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
                                    }
                                }}
                            />
                        </div>
                </div>
            </div>
        </motion.div>
    );
};

const ActiveQueue = () => {
    const { unreadCount, refreshNotifications, markNotificationsRead } = useAdminNotifications();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [selectedLogs, setSelectedLogs] = useState([]);
    const [logsLoading, setLogsLoading] = useState(false);
    const [assigningId, setAssigningId] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshData = useCallback(async () => {
        try {
            const [requestRes, technicianRes] = await Promise.all([
                axios.get('index.php?action=getAllRequests'),
                axios.get('index.php?action=getTechnicians')
            ]);

            if (requestRes.data.success) setRequests(requestRes.data.data);
            if (technicianRes.data.success) setTechnicians(technicianRes.data.data);
            await refreshNotifications();
        } finally {
            setLoading(false);
        }
    }, [refreshNotifications]);

    useEffect(() => {
        refreshData();
        const interval = setInterval(refreshData, 15000);
        return () => clearInterval(interval);
    }, [refreshData]);

    const activeRequests = useMemo(() => requests.filter((request) => request.status !== 'Completed'), [requests]);

    const loadRequestDetails = async (request) => {
        setSelectedRequest(request);
        setLogsLoading(true);

        try {
            const res = await axios.get(`index.php?action=getRequestProgress&request_id=${request.id}`);
            if (res.data.success) {
                setSelectedLogs(res.data.data);
            } else {
                setSelectedLogs([]);
            }
        } finally {
            setLogsLoading(false);
        }
    };

    const assignTechnician = async (requestId, technicianId) => {
        setAssigningId(requestId);
        try {
            await axios.post('index.php?action=assignTechnician', {
                request_id: requestId,
                technician_id: technicianId
            });
            await refreshData();

            if (selectedRequest?.id === requestId) {
                const updated = activeRequests.find((request) => request.id === requestId);
                if (updated) setSelectedRequest(updated);
            }
        } finally {
            setAssigningId(null);
        }
    };

    const handleNotificationClick = async () => {
        await markNotificationsRead();
        navigate('/admin/requests');
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6"
        >
            <DashboardHeader
                title="Active Queue"
                subtitle="Review request details and assign the right technician"
                unreadCount={unreadCount}
                onReadNotifications={handleNotificationClick}
                onLogout={logout}
            />

            <div className="glass-card p-6">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <div>
                        <h4 className="text-lg font-extrabold text-textPrimary mb-1">Active Requests</h4>
                        <p className="text-xs text-textSecondary font-medium m-0">Live updates from all campuses</p>
                    </div>
                    <motion.button 
                        whileHover={{ scale: 1.1, rotate: 15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={refreshData}
                        className={`p-2 rounded-lg bg-surface border border-overlay/5 text-textSecondary hover:text-primary transition-colors ${loading ? 'animate-spin text-primary' : ''}`}
                    >
                        <RefreshCcw size={20} />
                    </motion.button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-overlay/10 text-xs text-textSecondary font-extrabold uppercase tracking-widest">
                                <th className="pb-4 px-4 whitespace-nowrap">Problem</th>
                                <th className="pb-4 px-4 whitespace-nowrap">Student</th>
                                <th className="pb-4 px-4 whitespace-nowrap">Location</th>
                                <th className="pb-4 px-4 whitespace-nowrap">Status</th>
                                <th className="pb-4 px-4 whitespace-nowrap">Assign Technician</th>
                                <th className="pb-4 px-4 text-right whitespace-nowrap">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center">
                                        <Loader2 size={32} className="animate-spin text-primary mx-auto" />
                                    </td>
                                </tr>
                            ) : activeRequests.length > 0 ? (
                                activeRequests.map((request, idx) => (
                                    <motion.tr 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        key={request.id} 
                                        className="hover:bg-overlay/[0.02] transition-colors"
                                    >
                                        <td className="py-4 px-4">
                                            <div className="font-extrabold text-textPrimary text-sm">{request.title}</div>
                                            <div className="text-xs text-textSecondary mt-1 font-medium">{request.category}</div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="font-extrabold text-textPrimary text-sm whitespace-nowrap">{request.student_name}</div>
                                            <div className="text-xs text-textSecondary font-medium">{request.student_code}</div>
                                            <div className="flex items-center text-[10px] text-textSecondary mt-1 font-medium whitespace-nowrap">
                                                <Phone size={12} className="mr-1.5 text-primary" />
                                                {request.student_phone || 'No phone'}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center text-xs text-textSecondary font-medium">
                                                <MapPin size={14} className="mr-2 text-primary shrink-0" />
                                                <span className="truncate max-w-[120px]">{request.location}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${statusClassName(request.status)}`}>
                                                {request.status}
                                            </span>
                                            <div className="text-[10px] text-textSecondary mt-2 font-bold uppercase tracking-wider">
                                                Progress: {request.progress_percentage}%
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <select
                                                className="w-full py-2 px-3 bg-surface border border-overlay/10 text-textPrimary text-xs rounded-lg font-bold focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner appearance-none disabled:opacity-50"
                                                value={request.technician_id || ''}
                                                onChange={(event) => assignTechnician(request.id, event.target.value)}
                                                disabled={assigningId === request.id}
                                            >
                                                <option value="" className="bg-surface">Select technician</option>
                                                {technicians.map((technician) => (
                                                    <option key={technician.id} value={technician.id} className="bg-surface">
                                                        {technician.name} - {technician.skills}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <motion.button 
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => loadRequestDetails(request)}
                                                className="btn-secondary px-4 py-2 rounded-lg text-xs font-bold"
                                            >
                                                View
                                            </motion.button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-textSecondary font-medium">
                                        No active requests in the queue.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <RequestDetailsModal
                request={selectedRequest}
                logs={selectedLogs}
                loading={logsLoading}
                technicians={technicians}
                onAssign={assignTechnician}
                onClose={() => {
                    setSelectedRequest(null);
                    setSelectedLogs([]);
                }}
            />
        </motion.div>
    );
};

const AdminHistory = () => {
    const { unreadCount, refreshNotifications, markNotificationsRead } = useAdminNotifications();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [selectedLogs, setSelectedLogs] = useState([]);
    const [logsLoading, setLogsLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshData = useCallback(async () => {
        try {
            const requestRes = await axios.get('index.php?action=getAllRequests');
            if (requestRes.data.success) setRequests(requestRes.data.data);
            await refreshNotifications();
        } finally {
            setLoading(false);
        }
    }, [refreshNotifications]);

    useEffect(() => {
        refreshData();
        const interval = setInterval(refreshData, 15000);
        return () => clearInterval(interval);
    }, [refreshData]);

    const completedRequests = useMemo(() => requests.filter((request) => request.status === 'Completed'), [requests]);

    const viewLogs = async (request) => {
        setSelectedRequest(request);
        setLogsLoading(true);

        try {
            const res = await axios.get(`index.php?action=getRequestProgress&request_id=${request.id}`);
            if (res.data.success) {
                setSelectedLogs(res.data.data);
            } else {
                setSelectedLogs([]);
            }
        } finally {
            setLogsLoading(false);
        }
    };

    const deleteRequest = async (requestId) => {
        setDeletingId(requestId);
        try {
            await axios.post('index.php?action=deleteRequest', { id: requestId });
            await refreshData();
        } finally {
            setDeletingId(null);
        }
    };

    const purgeAllCompleted = async () => {
        await axios.post('index.php?action=purgeRequests');
        await refreshData();
    };

    const handleNotificationClick = async () => {
        await markNotificationsRead();
        navigate('/admin/requests');
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6"
        >
            <DashboardHeader
                title="Admin History"
                subtitle="Completed work that can stay in history or be deleted"
                unreadCount={unreadCount}
                onReadNotifications={handleNotificationClick}
                onLogout={logout}
            />

            <div className="glass-card p-6">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                    <div>
                        <h4 className="text-lg font-extrabold text-textPrimary mb-1">Completed Requests</h4>
                        <p className="text-xs text-textSecondary font-medium m-0">Permanent record of resolved issues</p>
                    </div>
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={purgeAllCompleted}
                        className="flex items-center gap-2 px-5 py-3 bg-danger/10 text-danger hover:bg-danger hover:text-white rounded-xl text-xs font-extrabold uppercase tracking-widest transition-colors border border-danger/20"
                    >
                        <Trash2 size={16} />
                        Purge All Completed
                    </motion.button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-overlay/10 text-xs text-textSecondary font-extrabold uppercase tracking-widest">
                                <th className="pb-4 px-4 whitespace-nowrap">Problem</th>
                                <th className="pb-4 px-4 whitespace-nowrap">Student</th>
                                <th className="pb-4 px-4 whitespace-nowrap">Technician</th>
                                <th className="pb-4 px-4 whitespace-nowrap">Completed On</th>
                                <th className="pb-4 px-4 text-right whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center">
                                        <Loader2 size={32} className="animate-spin text-primary mx-auto" />
                                    </td>
                                </tr>
                            ) : completedRequests.length > 0 ? (
                                completedRequests.map((request, idx) => (
                                    <motion.tr 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        key={request.id} 
                                        className="hover:bg-overlay/[0.02] transition-colors"
                                    >
                                        <td className="py-4 px-4">
                                            <div className="font-extrabold text-textPrimary text-sm">{request.title}</div>
                                            <div className="text-xs text-textSecondary mt-1 font-medium">{request.category}</div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="font-extrabold text-textPrimary text-sm whitespace-nowrap">{request.student_name}</div>
                                            <div className="text-xs text-textSecondary font-medium">{request.student_code}</div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="font-extrabold text-textPrimary text-sm whitespace-nowrap">{request.technician_name || 'Not assigned'}</div>
                                            <div className="flex items-center text-[10px] text-textSecondary mt-1 font-medium whitespace-nowrap">
                                                <Phone size={12} className="mr-1.5 text-primary" />
                                                {request.technician_phone || 'No phone'}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="text-sm text-textSecondary font-medium whitespace-nowrap">
                                                {new Date(request.updated_at).toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <motion.button 
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => viewLogs(request)}
                                                    className="btn-secondary px-4 py-2 rounded-lg text-xs font-bold"
                                                >
                                                    View
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => deleteRequest(request.id)}
                                                    disabled={deletingId === request.id}
                                                    className="p-2 rounded-lg bg-danger/10 text-danger hover:bg-danger hover:text-white border border-danger/20 transition-colors"
                                                >
                                                    {deletingId === request.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                                </motion.button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-textSecondary font-medium">
                                        No completed requests in history.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <RequestDetailsModal
                request={selectedRequest}
                logs={selectedLogs}
                loading={logsLoading}
                technicians={[]}
                onAssign={() => {}}
                onClose={() => {
                    setSelectedRequest(null);
                    setSelectedLogs([]);
                }}
            />
        </motion.div>
    );
};

const UsersPage = () => {
    const { unreadCount, markNotificationsRead } = useAdminNotifications();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [registering, setRegistering] = useState(false);
    const [registerError, setRegisterError] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [generatedCredentials, setGeneratedCredentials] = useState(null);
    const [deletingUserId, setDeletingUserId] = useState(null);
    const [formOptions, setFormOptions] = useState({ departments: [], roles: ['Student', 'Staff', 'Technician'], specializations: TECHNICIAN_SKILLS });
    const [newUser, setNewUser] = useState({
        name: '',
        user_code: '',
        email: '',
        phone_number: '',
        department_id: '',
        role: 'student',
        specialization: '',
        experience_years: 0,
        availability_status: 'Available'
    });

    const fetchUsers = useCallback(async () => {
        try {
            const res = await axios.get('index.php?action=getAllUsers');
            if (res.data.success) {
                setUsers(res.data.data);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
        axios.get('index.php?action=getUserFormOptions').then((res) => {
            if (res.data.success) {
                setFormOptions(res.data.data);
            }
        }).catch(() => {});
        const interval = setInterval(fetchUsers, 20000);
        return () => clearInterval(interval);
    }, [fetchUsers]);

    const registerUser = async (event) => {
        event.preventDefault();
        setRegistering(true);
        setRegisterError('');
        setFeedback(null);

        const name = newUser.name.trim();
        const userCode = newUser.user_code.trim().toUpperCase();

        if (!isValidFullName(name)) {
            setRegistering(false);
            setRegisterError('Enter first and last name using letters only.');
            return;
        }

        if (!isValidUserCode(userCode)) {
            setRegistering(false);
            setRegisterError('User ID must use the format DBU followed by 7 digits, for example DBU1601069.');
            return;
        }

        if (newUser.role === 'technician' && !newUser.specialization) {
            setRegistering(false);
            setRegisterError('Select the technician specialization before registering.');
            return;
        }

        try {
            const res = await axios.post('index.php?action=createUser', {
                name,
                user_code: userCode,
                email: newUser.email.trim(),
                phone_number: newUser.phone_number.trim(),
                department_id: newUser.department_id || null,
                role: newUser.role,
                skills: newUser.role === 'technician' ? newUser.specialization : '',
                specialization: newUser.role === 'technician' ? newUser.specialization : '',
                experience_years: newUser.role === 'technician' ? newUser.experience_years : 0,
                availability_status: newUser.role === 'technician' ? newUser.availability_status : 'Available'
            });

            if (!res.data.success) {
                throw new Error(res.data.message || 'Unable to register user');
            }

            setGeneratedCredentials(res.data.data);
            setFeedback({
                type: 'success',
                message: `${res.data.data.name} (${res.data.data.user_code}) registered successfully.`
            });
            setShowRegisterModal(false);
            setNewUser({
                name: '',
                user_code: '',
                email: '',
                phone_number: '',
                department_id: '',
                role: 'student',
                specialization: '',
                experience_years: 0,
                availability_status: 'Available'
            });
            await fetchUsers();
        } catch (error) {
            const message = error.message || 'Unable to register user';
            setRegisterError(message);
            setFeedback({
                type: 'danger',
                message
            });
        } finally {
            setRegistering(false);
        }
    };

    const resetPassword = async (userCode) => {
        setFeedback(null);
        const res = await axios.post('index.php?action=resetUserPassword', { user_code: userCode });
        if (res.data.success) {
            setGeneratedCredentials(res.data.data);
            setFeedback({
                type: 'success',
                message: `Temporary password generated successfully for ${userCode}.`
            });
            await fetchUsers();
        } else {
            setFeedback({
                type: 'danger',
                message: res.data.message || `Unable to reset password for ${userCode}.`
            });
        }
    };

    const deleteUser = async (userId) => {
        setDeletingUserId(userId);
        setFeedback(null);

        try {
            const res = await axios.post('index.php?action=deleteUser', { user_id: userId });
            if (!res.data.success) {
                throw new Error(res.data.message || 'Unable to delete user');
            }

            setFeedback({
                type: 'success',
                message: 'User deleted successfully.'
            });
            await fetchUsers();
        } catch (error) {
            setFeedback({
                type: 'danger',
                message: error.message || 'Unable to delete user'
            });
        } finally {
            setDeletingUserId(null);
        }
    };

    const handleNotificationClick = async () => {
        await markNotificationsRead();
        navigate('/admin/requests');
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-3 md:p-4"
        >
            <DashboardHeader
                title="User Management"
                subtitle="Register students and technicians with auto-generated passwords"
                unreadCount={unreadCount}
                onReadNotifications={handleNotificationClick}
                onLogout={logout}
            />

            <div className="flex justify-end mb-4">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                        setRegisterError('');
                        setShowRegisterModal(true);
                    }}
                    className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-extrabold uppercase tracking-widest shadow-md"
                >
                    <UserPlus size={18} />
                    Register User
                </motion.button>
            </div>

            <div className="glass-card p-4 md:p-5">
                <AnimatePresence>
                    {feedback && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0, mb: 0 }}
                            animate={{ opacity: 1, height: 'auto', mb: 24 }}
                            exit={{ opacity: 0, height: 0, mb: 0 }}
                            className={`p-4 rounded-xl text-sm font-bold border ${feedback.type === 'success' ? 'bg-success/10 text-success border-success/20' : 'bg-danger/10 text-danger border-danger/20'}`}
                        >
                            {feedback.message}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-overlay/10 text-xs text-textSecondary font-extrabold uppercase tracking-widest">
                                <th className="pb-4 px-4 whitespace-nowrap">User</th>
                                <th className="pb-4 px-4 whitespace-nowrap">ID Code</th>
                                <th className="pb-4 px-4 whitespace-nowrap">Role</th>
                                <th className="pb-4 px-4 whitespace-nowrap">Department</th>
                                <th className="pb-4 px-4 whitespace-nowrap">Specialization</th>
                                <th className="pb-4 px-4 whitespace-nowrap">Status</th>
                                <th className="pb-4 px-4 text-right whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="py-12 text-center">
                                        <Loader2 size={32} className="animate-spin text-primary mx-auto" />
                                    </td>
                                </tr>
                            ) : users.length > 0 ? (
                                users.map((user, idx) => (
                                    <motion.tr 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        key={user.id} 
                                        className="hover:bg-overlay/[0.02] transition-colors"
                                    >
                                        <td className="py-4 px-4">
                                            <div className="font-extrabold text-textPrimary text-sm whitespace-nowrap">{user.name}</div>
                                            <div className="text-[10px] text-textSecondary mt-1 font-bold uppercase tracking-wider">{user.email || user.phone_number || `${user.role} account`}</div>
                                        </td>
                                        <td className="py-4 px-4 font-bold text-textPrimary text-sm">{user.user_code}</td>
                                        <td className="py-4 px-4 capitalize text-sm font-medium text-textSecondary">{user.role}</td>
                                        <td className="py-4 px-4 text-sm font-medium text-textSecondary whitespace-nowrap">{user.department_name || '-'}</td>
                                        <td className="py-4 px-4 text-sm font-medium text-textSecondary whitespace-nowrap">{user.specialization || user.skills || '-'}</td>
                                        <td className="py-4 px-4">
                                            <div className="flex flex-col gap-2">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap border ${user.status === 'active' ? 'bg-success/10 text-success border-success/20' : 'bg-textSecondary/10 text-textSecondary border-textSecondary/20'}`}>
                                                    {user.status === 'active' ? 'Registered' : user.status}
                                                </span>
                                                <span className="text-[10px] text-textSecondary font-bold whitespace-nowrap">{new Date(user.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <motion.button 
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => resetPassword(user.user_code)}
                                                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface border border-overlay/10 hover:border-overlay/20 text-textPrimary text-xs font-bold transition-colors"
                                                >
                                                    <RefreshCcw size={14} />
                                                    Reset
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => deleteUser(user.id)}
                                                    disabled={deletingUserId === user.id}
                                                    className="p-2 rounded-lg bg-danger/10 text-danger hover:bg-danger hover:text-white border border-danger/20 transition-colors"
                                                >
                                                    {deletingUserId === user.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                                </motion.button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-textSecondary font-medium">
                                        No users found yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <PremiumModal
                isOpen={showRegisterModal}
                onClose={() => setShowRegisterModal(false)}
                title="Register User"
                showFooter={false}
                maxWidth="720px"
            >
                <form onSubmit={registerUser} className="space-y-5">
                    <AnimatePresence>
                        {registerError && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="p-4 rounded-xl bg-danger/10 text-danger text-sm font-bold border border-danger/20"
                            >
                                {registerError}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="rounded-2xl border border-primary/15 bg-primary/10 p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-surface/80 border border-overlay/10 text-primary">
                                <UserPlus size={20} />
                            </div>
                            <div>
                                <h4 className="text-base font-extrabold text-textPrimary">Create a campus account</h4>
                                <p className="text-xs text-textSecondary font-medium m-0">Choose a role first. Technician ability appears only when needed.</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-textSecondary mb-2 uppercase tracking-widest">Full Name</label>
                            <input
                                type="text"
                                className="w-full py-3 px-4 bg-surface/50 border border-overlay/10 text-textPrimary rounded-xl font-bold placeholder-textSecondary/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
                                placeholder="First Last"
                                value={newUser.name}
                                onChange={(event) => setNewUser((prev) => ({ ...prev, name: event.target.value }))}
                                minLength={5}
                                pattern="[A-Za-z]+([ .'-][A-Za-z]+)+"
                                title="Use at least first and last name with letters only"
                                required
                            />
                            <p className="mt-2 text-[11px] text-textSecondary font-medium">Use at least first and last name.</p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-textSecondary mb-2 uppercase tracking-widest">User ID</label>
                            <input
                                type="text"
                                className="w-full py-3 px-4 bg-surface/50 border border-overlay/10 text-textPrimary rounded-xl font-bold placeholder-textSecondary/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner uppercase"
                                placeholder="DBU1601069"
                                value={newUser.user_code}
                                onChange={(event) => setNewUser((prev) => ({ ...prev, user_code: event.target.value.toUpperCase() }))}
                                pattern="DBU[0-9]{7}"
                                title="Use DBU followed by 7 digits"
                                required
                            />
                            <p className="mt-2 text-[11px] text-textSecondary font-medium">Format: DBU followed by 7 digits.</p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-textSecondary mb-2 uppercase tracking-widest">Role</label>
                            <select
                                className="w-full py-3 px-4 bg-surface/50 border border-overlay/10 text-textPrimary rounded-xl font-bold focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
                                value={newUser.role}
                                onChange={(event) => setNewUser((prev) => ({ ...prev, role: event.target.value, skills: event.target.value === 'technician' ? prev.skills : '' }))}
                            >
                                <option value="student" className="bg-surface text-textPrimary">Student</option>
                                <option value="technician" className="bg-surface text-textPrimary">Technician</option>
                            </select>
                        </div>
                        {newUser.role === 'technician' && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                className="rounded-2xl border border-info/20 bg-info/10 p-4"
                            >
                                <label className="block text-xs font-bold text-textSecondary mb-2 uppercase tracking-widest">Technician Ability</label>
                                <select
                                    className="w-full py-3 px-4 bg-surface/80 border border-overlay/10 text-textPrimary rounded-xl font-bold focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
                                    value={newUser.skills}
                                    onChange={(event) => setNewUser((prev) => ({ ...prev, skills: event.target.value }))}
                                    required
                                >
                                    <option value="" className="bg-surface text-textSecondary">Select ability</option>
                                    {TECHNICIAN_SKILLS.map((skill) => (
                                        <option key={skill} value={skill} className="bg-surface text-textPrimary">
                                            {skill}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-2 text-[11px] text-textSecondary font-medium">This helps admins assign the right maintenance work.</p>
                            </motion.div>
                        )}
                        
                        <div className="md:col-span-2">
                            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center gap-3">
                                <Shield size={18} className="shrink-0" />
                                The system will generate a temporary password automatically after registration.
                            </div>
                        </div>

                        <div className="md:col-span-2 flex gap-4 mt-2">
                            <button type="button" className="btn-secondary flex-1 py-4 text-xs font-extrabold tracking-widest uppercase rounded-xl" onClick={() => setShowRegisterModal(false)}>
                                Cancel
                            </button>
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit" 
                                className="btn-primary flex-1 py-4 flex items-center justify-center text-xs font-extrabold tracking-widest uppercase rounded-xl" 
                                disabled={registering}
                            >
                                {registering ? <Loader2 size={16} className="animate-spin mr-2" /> : 'Register User'}
                            </motion.button>
                        </div>
                    </div>
                </form>
            </PremiumModal>

            <PremiumModal
                isOpen={!!generatedCredentials}
                onClose={() => setGeneratedCredentials(null)}
                onConfirm={() => setGeneratedCredentials(null)}
                title="Credentials Generated"
                type="success"
                confirmText="Done"
            >
                <div className="text-center py-4">
                    <p className="text-textSecondary font-medium leading-relaxed mb-6">
                        Provide these credentials to the user. They must use them to sign in and will be prompted to change their password immediately.
                    </p>
                    <div className="p-6 rounded-2xl bg-surface/50 border border-overlay/10 shadow-inner max-w-sm mx-auto text-left">
                        <div className="mb-4">
                            <span className="block text-xs font-bold text-textSecondary uppercase tracking-widest mb-1">User ID</span>
                            <span className="block text-2xl font-extrabold text-textPrimary tracking-wider">{generatedCredentials?.user_code}</span>
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-textSecondary uppercase tracking-widest mb-1">Temporary Password</span>
                            <span className="block text-2xl font-extrabold text-primary tracking-wider">{generatedCredentials?.temporary_password}</span>
                        </div>
                    </div>
                </div>
            </PremiumModal>
        </motion.div>
    );
};

const SecurityPage = () => {
    const { unreadCount, markNotificationsRead } = useAdminNotifications();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [userCode, setUserCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [generatedCredentials, setGeneratedCredentials] = useState(null);

    const handleReset = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await axios.post('index.php?action=resetUserPassword', {
                user_code: userCode.toUpperCase()
            });

            if (!res.data.success) {
                throw new Error(res.data.message || 'Unable to reset password');
            }

            setGeneratedCredentials(res.data.data);
            setUserCode('');
        } catch (error) {
            setError(error.message || 'Unable to reset password');
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationClick = async () => {
        await markNotificationsRead();
        navigate('/admin/requests');
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6"
        >
            <DashboardHeader
                title="Security Hub"
                subtitle="Reset user credentials manually"
                unreadCount={unreadCount}
                onReadNotifications={handleNotificationClick}
                onLogout={logout}
            />

            <div className="max-w-3xl mx-auto mt-8">
                <div className="glass-card p-8 md:p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Shield size={200} className="text-primary" />
                    </div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-4 rounded-2xl bg-primary/20 text-primary shadow-inner border border-primary/20">
                                <Shield size={32} />
                            </div>
                            <div>
                                <h4 className="text-2xl font-extrabold text-textPrimary mb-1">Credential Regeneration</h4>
                                <p className="text-sm text-textSecondary font-medium m-0">Generate a new temporary password for any user</p>
                            </div>
                        </div>

                        <form onSubmit={handleReset} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-textSecondary mb-2 uppercase tracking-widest">Target User ID</label>
                                <div className="flex flex-col md:flex-row gap-4">
                                    <input
                                        type="text"
                                        className="flex-1 py-4 px-5 bg-surface/50 border border-overlay/10 text-textPrimary rounded-xl font-bold placeholder-textSecondary/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner uppercase"
                                        placeholder="E.g. DBU1601069"
                                        value={userCode}
                                        onChange={(event) => setUserCode(event.target.value.toUpperCase())}
                                        required
                                    />
                                    <motion.button 
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit" 
                                        className="btn-primary py-4 px-8 rounded-xl font-extrabold text-xs uppercase tracking-widest whitespace-nowrap flex items-center justify-center min-w-[200px]" 
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 size={18} className="animate-spin" /> : 'Generate Password'}
                                    </motion.button>
                                </div>
                            </div>
                        </form>

                        <AnimatePresence>
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0, mt: 0 }}
                                    animate={{ opacity: 1, height: 'auto', mt: 24 }}
                                    exit={{ opacity: 0, height: 0, mt: 0 }}
                                    className="p-4 rounded-xl bg-danger/10 text-danger text-sm font-bold border border-danger/20"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <PremiumModal
                isOpen={!!generatedCredentials}
                onClose={() => setGeneratedCredentials(null)}
                onConfirm={() => setGeneratedCredentials(null)}
                title="Credentials Generated"
                type="success"
                confirmText="Done"
            >
                <div className="text-center py-4">
                    <p className="text-textSecondary font-medium leading-relaxed mb-6">
                        Provide these credentials to the user. They must use them to sign in and will be prompted to change their password immediately.
                    </p>
                    <div className="p-6 rounded-2xl bg-surface/50 border border-overlay/10 shadow-inner max-w-sm mx-auto text-left">
                        <div className="mb-4">
                            <span className="block text-xs font-bold text-textSecondary uppercase tracking-widest mb-1">User ID</span>
                            <span className="block text-2xl font-extrabold text-textPrimary tracking-wider">{generatedCredentials?.user_code}</span>
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-textSecondary uppercase tracking-widest mb-1">Temporary Password</span>
                            <span className="block text-2xl font-extrabold text-primary tracking-wider">{generatedCredentials?.temporary_password}</span>
                        </div>
                    </div>
                </div>
            </PremiumModal>
        </motion.div>
    );
};

const AdminDashboard = () => (
    <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-cover bg-center opacity-30 blur-md scale-105" style={{ backgroundImage: `url(${techBg})` }}></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-background/90 via-background/80 to-surface/90"></div>
            <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] animate-pulse-slow"></div>
            <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>

        <Sidebar />
        
        <div className="relative z-10 lg:pl-[280px] min-h-screen">
            <AnimatePresence mode="wait">
                <Routes>
                    <Route index element={<AdminOverview />} />
                    <Route path="requests" element={<ActiveQueue />} />
                    <Route path="history" element={<AdminHistory />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="security" element={<SecurityPage />} />
                </Routes>
            </AnimatePresence>
        </div>
    </div>
);

export default AdminDashboard;
