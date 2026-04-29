import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    Bell,
    CheckCircle2,
    Loader2,
    LogOut,
    MapPin,
    Phone,
    Save,
    Trash2,
} from 'lucide-react';
import {
    ArcElement,
    Chart as ChartJS,
    Legend,
    Tooltip
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

import Sidebar from '../../components/Sidebar';
import PremiumModal from '../../components/PremiumModal';
import axios from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

import dbuLogo from '../../assets/images/dbu-logo.png';
import techBg from '../../assets/images/tech-bg.png';

ChartJS.register(ArcElement, Tooltip, Legend);

const statusClassName = (status) => {
    if (status === 'Completed') return 'bg-success/10 text-success border border-success/20';
    if (status === 'On Hold') return 'bg-textSecondary/10 text-textSecondary border border-textSecondary/20';
    if (status === 'Assigned') return 'bg-primary/10 text-primary border border-primary/20';
    return 'bg-warning/10 text-warning border border-warning/20';
};

const DashboardHeader = ({ title, subtitle, unreadCount, onReadNotifications, onLogout }) => (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-8 mt-2">
        <div className="flex items-center gap-4">
            <img src={dbuLogo} alt="DBU" className="hidden md:block h-12" />
            <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-textPrimary mb-1">{title}</h2>
                <p className="text-xs text-textSecondary uppercase font-extrabold tracking-widest opacity-75 m-0">{subtitle}</p>
            </div>
        </div>
        <div className="flex items-center gap-3">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onReadNotifications}
                className="relative p-3 rounded-full bg-surface/50 border border-white/10 hover:bg-surface transition-colors"
                title="Open assigned work"
            >
                <Bell size={22} className={unreadCount > 0 ? 'text-danger' : 'text-textSecondary'} />
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
                className="flex items-center gap-2 px-5 py-2.5 bg-danger/10 text-danger hover:bg-danger hover:text-white rounded-full text-xs font-extrabold uppercase tracking-widest transition-colors border border-danger/20"
            >
                <LogOut size={16} />
                Logout
            </motion.button>
        </div>
    </div>
);

const useTechnicianData = () => {
    const [requests, setRequests] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const refreshData = useCallback(async () => {
        try {
            const [requestRes, notificationRes] = await Promise.all([
                axios.get('index.php?action=getAssignedRequests'),
                axios.get('index.php?action=getNotificationCounts')
            ]);

            if (requestRes.data.success) setRequests(requestRes.data.data);
            if (notificationRes.data.success) setUnreadCount(notificationRes.data.data.unread || 0);
        } finally {
            setLoading(false);
        }
    }, []);

    const markNotificationsRead = useCallback(async () => {
        await axios.post('index.php?action=markNotificationsRead');
        await refreshData();
    }, [refreshData]);

    useEffect(() => {
        void (async () => {
            await refreshData();
        })();
        const interval = setInterval(refreshData, 15000);
        return () => clearInterval(interval);
    }, [refreshData]);

    return { requests, unreadCount, loading, refreshData, markNotificationsRead };
};

const ProgressModal = ({ request, onClose, onSaved }) => {
    const [progress, setProgress] = useState(() => request?.progress_percentage || 0);
    const [status, setStatus] = useState(() => request?.status || 'In Progress');
    const [remarks, setRemarks] = useState('');
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!request) return;

        const fetchHistory = async () => {
            setLoadingHistory(true);
            try {
                const res = await axios.get(`index.php?action=getRequestProgress&request_id=${request.id}`);
                if (res.data.success) {
                    setHistory(res.data.data);
                } else {
                    setHistory([]);
                }
            } finally {
                setLoadingHistory(false);
            }
        };

        fetchHistory();
    }, [request]);

    const saveProgress = async (event) => {
        event.preventDefault();
        setSaving(true);

        try {
            await axios.post('index.php?action=updateProgress', {
                request_id: request.id,
                progress_percentage: progress,
                status,
                remarks
            });
            await onSaved();
            onClose();
        } finally {
            setSaving(false);
        }
    };

    return (
        <PremiumModal
            isOpen={!!request}
            onClose={onClose}
            title={request ? `Update Request #${request.id}` : 'Update Request'}
            maxWidth="760px"
            showFooter={false}
        >
            {request && (
                <form onSubmit={saveProgress}>
                    <div className="p-5 rounded-2xl bg-primary/10 border border-primary/20 mb-6">
                        <h5 className="text-lg font-extrabold text-textPrimary mb-2">{request.title}</h5>
                        <div className="flex items-center text-xs text-textSecondary font-medium">
                            <MapPin size={14} className="mr-2 text-primary" />
                            {request.location}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-xs font-bold text-textSecondary mb-2 uppercase tracking-widest">Status</label>
                            <select
                                className="w-full py-3 px-4 bg-surface/50 border border-white/10 text-textPrimary rounded-xl font-bold focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner appearance-none"
                                value={status}
                                onChange={(event) => setStatus(event.target.value)}
                            >
                                <option value="Assigned" className="bg-surface">Assigned</option>
                                <option value="In Progress" className="bg-surface">In Progress</option>
                                <option value="On Hold" className="bg-surface">On Hold</option>
                                <option value="Completed" className="bg-surface">Completed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-textSecondary mb-2 uppercase tracking-widest">Progress ({progress}%)</label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-primary mt-3"
                                value={progress}
                                onChange={(event) => setProgress(event.target.value)}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-textSecondary mb-2 uppercase tracking-widest">Remarks</label>
                            <textarea
                                className="w-full py-3 px-4 bg-surface/50 border border-white/10 text-textPrimary rounded-xl font-bold placeholder-textSecondary/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
                                rows="4"
                                value={remarks}
                                onChange={(event) => setRemarks(event.target.value)}
                                placeholder="Explain what you did or what is blocking the task"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-xs font-bold text-textSecondary mb-3 uppercase tracking-widest">Previous Updates</label>
                        <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto custom-scrollbar pr-2">
                            {loadingHistory ? (
                                <div className="flex justify-center py-6">
                                    <Loader2 size={24} className="animate-spin text-primary" />
                                </div>
                            ) : history.length > 0 ? (
                                history.map((log, idx) => (
                                    <motion.div 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        key={log.id} 
                                        className="p-4 rounded-xl bg-surface/30 border border-white/5 shadow-sm"
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
                                <div className="text-center py-6 text-sm text-textSecondary font-medium">No previous updates yet.</div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button type="button" className="btn-secondary flex-1 py-4 text-xs font-extrabold tracking-widest uppercase rounded-xl" onClick={onClose}>
                            Cancel
                        </button>
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit" 
                            className="btn-primary flex-1 py-4 flex items-center justify-center text-xs font-extrabold tracking-widest uppercase rounded-xl" 
                            disabled={saving}
                        >
                            {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
                            {saving ? 'Saving...' : 'Save Update'}
                        </motion.button>
                    </div>
                </form>
            )}
        </PremiumModal>
    );
};

const TechnicianOverview = () => {
    const { requests, unreadCount, loading, refreshData, markNotificationsRead } = useTechnicianData();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [selectedRequest, setSelectedRequest] = useState(null);

    const activeRequests = useMemo(() => requests.filter((request) => request.status !== 'Completed'), [requests]);
    const completedRequests = useMemo(() => requests.filter((request) => request.status === 'Completed'), [requests]);
    const chartData = useMemo(() => [
        requests.filter((request) => request.status === 'Assigned').length,
        requests.filter((request) => request.status === 'In Progress').length,
        requests.filter((request) => request.status === 'On Hold').length,
        completedRequests.length
    ], [completedRequests.length, requests]);

    const handleNotificationClick = async () => {
        await markNotificationsRead();
        navigate('/technician');
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6"
        >
            <DashboardHeader
                title="Technician Dashboard"
                subtitle="Receive assigned work, update status, and send progress back"
                unreadCount={unreadCount}
                onReadNotifications={handleNotificationClick}
                onLogout={logout}
            />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                <div className="xl:col-span-1">
                    <div className="glass-card p-6 h-full flex flex-col">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-xl bg-primary/10 text-primary shadow-inner border border-primary/20">
                                <Activity size={24} />
                            </div>
                            <div>
                                <h4 className="text-lg font-extrabold text-textPrimary mb-1">Workload Summary</h4>
                                <p className="text-xs text-textSecondary font-medium m-0">Live assigned work status</p>
                            </div>
                        </div>
                        <div className="flex-1 flex items-center justify-center min-h-[250px]">
                            <Doughnut
                                data={{
                                    labels: ['Assigned', 'In Progress', 'On Hold', 'Completed'],
                                    datasets: [
                                        {
                                            data: chartData,
                                            backgroundColor: ['#3b82f6', '#f59e0b', '#6b7280', '#10b981'],
                                            borderWidth: 0,
                                            hoverOffset: 4
                                        }
                                    ]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: 'Inter', weight: 600 } } } },
                                    cutout: '70%'
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="xl:col-span-2">
                    <div className="glass-card p-6 h-full flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h4 className="text-lg font-extrabold text-textPrimary mb-1">Assigned Requests</h4>
                                <p className="text-xs text-textSecondary font-medium m-0">Open requests to send status updates</p>
                            </div>
                            <motion.button 
                                whileHover={{ scale: 1.1, rotate: 15 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={refreshData}
                                className={`p-2 rounded-lg bg-surface border border-white/5 text-textSecondary hover:text-primary transition-colors ${loading ? 'animate-spin text-primary' : ''}`}
                            >
                                <Activity size={20} />
                            </motion.button>
                        </div>

                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-xs text-textSecondary font-extrabold uppercase tracking-widest">
                                        <th className="pb-4 px-4 whitespace-nowrap">Problem</th>
                                        <th className="pb-4 px-4 whitespace-nowrap">Student</th>
                                        <th className="pb-4 px-4 whitespace-nowrap">Location</th>
                                        <th className="pb-4 px-4 whitespace-nowrap">Status</th>
                                        <th className="pb-4 px-4 text-right whitespace-nowrap">Update</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="5" className="py-12 text-center">
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
                                                className="hover:bg-white/[0.02] transition-colors"
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
                                                <td className="py-4 px-4 text-right">
                                                    <motion.button 
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => setSelectedRequest(request)}
                                                        className="btn-primary px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap shadow-md"
                                                    >
                                                        Update
                                                    </motion.button>
                                                </td>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="py-12 text-center text-textSecondary font-medium">
                                                No active requests assigned right now.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <ProgressModal key={selectedRequest?.id || 'empty'} request={selectedRequest} onClose={() => setSelectedRequest(null)} onSaved={refreshData} />
        </motion.div>
    );
};

const TechnicianHistory = () => {
    const { requests, unreadCount, loading, refreshData, markNotificationsRead } = useTechnicianData();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [deletingId, setDeletingId] = useState(null);

    const completedRequests = useMemo(() => requests.filter((request) => request.status === 'Completed'), [requests]);

    const deleteCompletedTask = async (requestId) => {
        setDeletingId(requestId);
        try {
            await axios.post('index.php?action=deleteRequest', { id: requestId });
            await refreshData();
        } finally {
            setDeletingId(null);
        }
    };

    const handleNotificationClick = async () => {
        await markNotificationsRead();
        navigate('/technician');
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6"
        >
            <DashboardHeader
                title="Technician History"
                subtitle="Completed assignments you can review or remove from history"
                unreadCount={unreadCount}
                onReadNotifications={handleNotificationClick}
                onLogout={logout}
            />

            <div className="glass-card p-6">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 rounded-xl bg-success/20 text-success shadow-inner border border-success/20">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <h4 className="text-lg font-extrabold text-textPrimary mb-1">Completed Requests</h4>
                        <p className="text-xs text-textSecondary font-medium m-0">These are the jobs you already marked as completed</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-xs text-textSecondary font-extrabold uppercase tracking-widest">
                                <th className="pb-4 px-4 whitespace-nowrap">Problem</th>
                                <th className="pb-4 px-4 whitespace-nowrap">Student</th>
                                <th className="pb-4 px-4 whitespace-nowrap">Location</th>
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
                                        className="hover:bg-white/[0.02] transition-colors"
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
                                            <div className="flex items-center text-xs text-textSecondary font-medium">
                                                <MapPin size={12} className="mr-1.5 text-primary shrink-0" />
                                                <span className="truncate max-w-[150px]">{request.location}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="text-sm text-textSecondary font-medium whitespace-nowrap">
                                                {new Date(request.updated_at).toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => deleteCompletedTask(request.id)}
                                                disabled={deletingId === request.id}
                                                className="p-2 inline-flex rounded-lg bg-danger/10 text-danger hover:bg-danger hover:text-white border border-danger/20 transition-colors"
                                            >
                                                {deletingId === request.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                            </motion.button>
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
        </motion.div>
    );
};

const TechnicianDashboard = () => (
    <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-cover bg-center opacity-30 blur-md scale-105" style={{ backgroundImage: `url(${techBg})` }}></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-background/90 via-surface/80 to-background/90"></div>
            <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] rounded-full bg-primary/10 blur-[120px] animate-pulse-slow"></div>
            <div className="absolute bottom-[10%] right-[20%] w-[300px] h-[300px] rounded-full bg-accent/10 blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>

        <Sidebar />
        
        <div className="relative z-10 lg:pl-[280px] min-h-screen">
            <AnimatePresence mode="wait">
                <Routes>
                    <Route index element={<TechnicianOverview />} />
                    <Route path="history" element={<TechnicianHistory />} />
                </Routes>
            </AnimatePresence>
        </div>
    </div>
);

export default TechnicianDashboard;
