import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    Bell,
    CheckCircle,
    Loader2,
    LogOut,
    MapPin,
    Phone,
    Plus,
    Send,
    Trash2,
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

const REQUEST_CATEGORIES = [
    'Plumbing',
    'Electricity',
    'ICT Technician',
    'Carpentry',
    'HVAC / Cooling',
    'Painting / Finishing'
];

const statusClassName = (status) => {
    if (status === 'Completed') return 'bg-success/10 text-success border border-success/20';
    if (status === 'Pending') return 'bg-danger/10 text-danger border border-danger/20';
    if (status === 'On Hold') return 'bg-textSecondary/10 text-textSecondary border border-textSecondary/20';
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
                className="relative p-3 rounded-full bg-surface/50 border border-overlay/10 hover:bg-surface transition-colors"
                title="Open requests"
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

const RequestTimelineModal = ({ request, logs, loading, onClose }) => (
    <PremiumModal
        isOpen={!!request}
        onClose={onClose}
        title={request ? `Request #${request.id} Timeline` : 'Request Timeline'}
        maxWidth="760px"
        showFooter={false}
    >
        {request && (
            <div>
                <div className="p-5 rounded-2xl bg-primary/10 border border-primary/20 mb-6">
                    <div className="flex flex-wrap justify-between items-start gap-4">
                        <div>
                            <h5 className="text-lg font-extrabold text-textPrimary mb-1">{request.title}</h5>
                            <p className="text-xs text-textSecondary mb-0 font-medium">{request.location}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusClassName(request.status)}`}>{request.status}</span>
                    </div>
                    <p className="text-sm text-textSecondary mt-4 mb-0">{request.description}</p>
                </div>

                <div className="flex flex-col gap-4">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 size={32} className="animate-spin text-primary" />
                        </div>
                    ) : logs.length > 0 ? (
                        logs.map((log, idx) => (
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={log.id} 
                                className="p-4 rounded-xl bg-surface/50 border border-overlay/5 shadow-sm"
                            >
                                <div className="flex justify-between items-start gap-4 mb-3">
                                    <div>
                                        <div className="font-extrabold text-textPrimary text-sm">{log.action_taken}</div>
                                        <div className="text-xs text-textSecondary mt-1">{log.action_by}</div>
                                    </div>
                                    <span className="text-xs text-textSecondary font-medium">{new Date(log.created_at).toLocaleString()}</span>
                                </div>
                                <p className="text-sm text-textPrimary mb-3">{log.remarks}</p>
                                <span className="inline-block px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold border border-primary/20">Progress: {log.progress_percentage ?? 0}%</span>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-textSecondary font-medium">No updates yet.</div>
                    )}
                </div>
            </div>
        )}
    </PremiumModal>
);

const NewRequestForm = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { unreadCount, markNotificationsRead } = useStudentDashboardData();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Plumbing',
        dorm: '',
        block: '',
        priority: 'Medium'
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError('');

        try {
            const payload = {
                ...formData,
                location: `${formData.dorm}, Block ${formData.block}`
            };
            const res = await axios.post('index.php?action=createRequest', payload);

            if (!res.data.success) {
                throw new Error(res.data.message || 'Unable to submit request');
            }

            setSuccess(true);
            setFormData({
                title: '',
                description: '',
                category: 'Plumbing',
                dorm: '',
                block: '',
                priority: 'Medium'
            });
        } catch (error) {
            setError(error.message || 'Unable to submit request');
        } finally {
            setSaving(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6"
        >
            <DashboardHeader
                title="New Request"
                subtitle="Send a maintenance problem to the admin team"
                unreadCount={unreadCount}
                onReadNotifications={markNotificationsRead}
                onLogout={logout}
            />

            <div className="max-w-4xl mx-auto">
                <div className="glass-card p-8 shadow-2xl">
                    <AnimatePresence>
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 p-4 rounded-xl bg-danger/10 text-danger text-sm font-bold border border-danger/20"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-textSecondary mb-2 uppercase tracking-widest">Problem Title</label>
                                <input
                                    type="text"
                                    className="w-full py-3 px-4 bg-surface/50 border border-overlay/10 text-textPrimary rounded-xl font-bold placeholder-textSecondary/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
                                    value={formData.title}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
                                    placeholder="Example: Water leakage in Block B"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-textSecondary mb-2 uppercase tracking-widest">Category</label>
                                <select
                                    className="w-full py-3 px-4 bg-surface/50 border border-overlay/10 text-textPrimary rounded-xl font-bold focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner appearance-none"
                                    value={formData.category}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, category: event.target.value }))}
                                >
                                    {REQUEST_CATEGORIES.map((category) => (
                                        <option key={category} value={category} className="bg-surface text-textPrimary">
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-textSecondary mb-2 uppercase tracking-widest">Priority</label>
                                <select
                                    className="w-full py-3 px-4 bg-surface/50 border border-overlay/10 text-textPrimary rounded-xl font-bold focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner appearance-none"
                                    value={formData.priority}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, priority: event.target.value }))}
                                >
                                    <option value="Low" className="bg-surface">Low</option>
                                    <option value="Medium" className="bg-surface">Medium</option>
                                    <option value="High" className="bg-surface">High</option>
                                    <option value="Emergency" className="bg-surface">Emergency</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-textSecondary mb-2 uppercase tracking-widest">Dorm</label>
                                <input
                                    type="text"
                                    className="w-full py-3 px-4 bg-surface/50 border border-overlay/10 text-textPrimary rounded-xl font-bold placeholder-textSecondary/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
                                    value={formData.dorm}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, dorm: event.target.value }))}
                                    placeholder="Example: Dorm A"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-textSecondary mb-2 uppercase tracking-widest">Block</label>
                                <input
                                    type="text"
                                    className="w-full py-3 px-4 bg-surface/50 border border-overlay/10 text-textPrimary rounded-xl font-bold placeholder-textSecondary/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
                                    value={formData.block}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, block: event.target.value }))}
                                    placeholder="Example: Block B"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-textSecondary mb-2 uppercase tracking-widest">Description</label>
                                <textarea
                                    className="w-full py-3 px-4 bg-surface/50 border border-overlay/10 text-textPrimary rounded-xl font-bold placeholder-textSecondary/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
                                    rows="5"
                                    value={formData.description}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
                                    placeholder="Describe the maintenance problem clearly"
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit" 
                                className="btn-primary w-full md:w-auto px-8 py-4 rounded-xl text-sm font-extrabold tracking-widest uppercase flex items-center justify-center gap-2" 
                                disabled={saving}
                            >
                                {saving ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                {saving ? 'Sending...' : 'Submit Request'}
                            </motion.button>
                        </div>
                    </form>
                </div>
            </div>

            <PremiumModal
                isOpen={success}
                onClose={() => setSuccess(false)}
                onConfirm={() => navigate('/student')}
                title="Request Sent"
                type="success"
                confirmText="Go to Dashboard"
            >
                <div className="text-center py-4">
                    <p className="text-textSecondary font-medium leading-relaxed">
                        Your maintenance request was sent to the admin queue successfully. You can track its status on your dashboard.
                    </p>
                </div>
            </PremiumModal>
        </motion.div>
    );
};

const useStudentDashboardData = () => {
    const [requests, setRequests] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const refreshData = useCallback(async () => {
        try {
            const [requestRes, notificationRes] = await Promise.all([
                axios.get('index.php?action=getStudentRequests'),
                axios.get('index.php?action=getNotificationCounts')
            ]);

            if (requestRes.data.success) {
                setRequests(requestRes.data.data);
            }

            if (notificationRes.data.success) {
                setUnreadCount(notificationRes.data.data.unread || 0);
            }
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

const StudentOverview = () => {
    const { requests, unreadCount, loading, refreshData, markNotificationsRead } = useStudentDashboardData();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [historyLogs, setHistoryLogs] = useState([]);
    const [timelineLoading, setTimelineLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const activeRequests = useMemo(() => requests.filter((request) => request.status !== 'Completed'), [requests]);
    const historyRequests = useMemo(() => requests.filter((request) => request.status === 'Completed'), [requests]);

    const statusCounts = useMemo(() => ({
        assigned: requests.filter((request) => request.status === 'Assigned').length,
        progress: requests.filter((request) => request.status === 'In Progress').length,
        holding: requests.filter((request) => request.status === 'On Hold').length,
        completed: historyRequests.length
    }), [historyRequests.length, requests]);

    const categoryCounts = useMemo(
        () => REQUEST_CATEGORIES.map((category) => requests.filter((request) => request.category === category).length),
        [requests]
    );

    const openTimeline = async (request) => {
        setSelectedRequest(request);
        setTimelineLoading(true);

        try {
            const res = await axios.get(`index.php?action=getRequestProgress&request_id=${request.id}`);
            if (res.data.success) {
                setHistoryLogs(res.data.data);
            } else {
                setHistoryLogs([]);
            }
        } finally {
            setTimelineLoading(false);
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

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6"
        >
            <DashboardHeader
                title="Student Dashboard"
                subtitle="Track the problem you reported and see technician updates"
                unreadCount={unreadCount}
                onReadNotifications={markNotificationsRead}
                onLogout={logout}
            />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                <div className="xl:col-span-1">
                    <div className="glass-card p-6 h-full flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h4 className="text-lg font-extrabold text-textPrimary mb-1">Request Summary</h4>
                                <p className="text-xs text-textSecondary font-medium m-0">Live status distribution</p>
                            </div>
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Activity size={20} />
                            </div>
                        </div>
                        <div className="flex-1 flex items-center justify-center min-h-[250px]">
                            <Doughnut
                                data={{
                                    labels: ['Assigned', 'In Progress', 'On Hold', 'Completed'],
                                    datasets: [
                                        {
                                            data: [statusCounts.assigned, statusCounts.progress, statusCounts.holding, statusCounts.completed],
                                            backgroundColor: ['#f59e0b', '#3b82f6', '#6b7280', '#10b981'],
                                            borderWidth: 0,
                                            hoverOffset: 4
                                        }
                                    ]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { 
                                        legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: 'Inter', weight: 600 } } } 
                                    },
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
                                <h4 className="text-lg font-extrabold text-textPrimary mb-1">Category Activity</h4>
                                <p className="text-xs text-textSecondary font-medium m-0">Requests by department</p>
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
                        <div className="flex-1 min-h-[250px]">
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
            </div>

            <div className="glass-card p-6">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <div>
                        <h4 className="text-lg font-extrabold text-textPrimary mb-1">Active Requests</h4>
                        <p className="text-xs text-textSecondary font-medium m-0">Monitor your ongoing maintenance reports</p>
                    </div>
                    <Link to="/student/new-request" className="btn-primary flex items-center gap-2 text-xs font-extrabold tracking-widest uppercase py-3 rounded-xl">
                        <Plus size={16} />
                        New Request
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-overlay/10 text-xs text-textSecondary font-extrabold uppercase tracking-widest">
                                <th className="pb-4 px-4 whitespace-nowrap">Problem</th>
                                <th className="pb-4 px-4 whitespace-nowrap">Location</th>
                                <th className="pb-4 px-4 whitespace-nowrap">Status</th>
                                <th className="pb-4 px-4 whitespace-nowrap">Technician</th>
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
                                            <div className="flex items-center text-xs text-textSecondary font-medium">
                                                <MapPin size={14} className="mr-2 text-primary shrink-0" />
                                                <span className="truncate max-w-[150px]">{request.location}</span>
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
                                            {request.technician_name ? (
                                                <div>
                                                    <div className="font-extrabold text-textPrimary text-sm whitespace-nowrap">{request.technician_name}</div>
                                                    <div className="flex items-center text-[10px] text-textSecondary mt-1 font-medium whitespace-nowrap">
                                                        <Phone size={12} className="mr-1.5 text-primary" />
                                                        {request.technician_phone || 'No phone'}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-textSecondary font-medium italic">Pending assignment</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <motion.button 
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => openTimeline(request)}
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
                                        No active requests right now.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <RequestTimelineModal
                request={selectedRequest}
                logs={historyLogs}
                loading={timelineLoading}
                onClose={() => {
                    setSelectedRequest(null);
                    setHistoryLogs([]);
                }}
            />
        </motion.div>
    );
};

const StudentHistory = () => {
    const { requests, unreadCount, loading, refreshData, markNotificationsRead } = useStudentDashboardData();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [historyLogs, setHistoryLogs] = useState([]);
    const [timelineLoading, setTimelineLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const completedRequests = useMemo(() => requests.filter((request) => request.status === 'Completed'), [requests]);

    const openTimeline = async (request) => {
        setSelectedRequest(request);
        setTimelineLoading(true);

        try {
            const res = await axios.get(`index.php?action=getRequestProgress&request_id=${request.id}`);
            if (res.data.success) {
                setHistoryLogs(res.data.data);
            } else {
                setHistoryLogs([]);
            }
        } finally {
            setTimelineLoading(false);
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

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6"
        >
            <DashboardHeader
                title="Request History"
                subtitle="Completed tasks you can review or delete permanently"
                unreadCount={unreadCount}
                onReadNotifications={markNotificationsRead}
                onLogout={logout}
            />

            <div className="glass-card p-6">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 rounded-xl bg-success/20 text-success shadow-inner border border-success/20">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <h4 className="text-lg font-extrabold text-textPrimary mb-1">Completed Requests</h4>
                        <p className="text-xs text-textSecondary font-medium m-0">Deleting a request here removes it permanently.</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-overlay/10 text-xs text-textSecondary font-extrabold uppercase tracking-widest">
                                <th className="pb-4 px-4 whitespace-nowrap">Problem</th>
                                <th className="pb-4 px-4 whitespace-nowrap">Technician</th>
                                <th className="pb-4 px-4 whitespace-nowrap">Completed On</th>
                                <th className="pb-4 px-4 text-right whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="py-12 text-center">
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
                                            <div className="flex items-center text-xs text-textSecondary mt-1 font-medium">
                                                <MapPin size={12} className="mr-1.5 text-primary" />
                                                {request.location}
                                            </div>
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
                                                {new Date(request.updated_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <motion.button 
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => openTimeline(request)}
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
                                    <td colSpan="4" className="py-12 text-center text-textSecondary font-medium">
                                        No completed requests in history.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <RequestTimelineModal
                request={selectedRequest}
                logs={historyLogs}
                loading={timelineLoading}
                onClose={() => {
                    setSelectedRequest(null);
                    setHistoryLogs([]);
                }}
            />
        </motion.div>
    );
};

const StudentDashboard = () => (
    <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-cover bg-center opacity-30 blur-md scale-105" style={{ backgroundImage: `url(${techBg})` }}></div>
            <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/80 to-surface/90"></div>
            <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] rounded-full bg-primary/10 blur-[100px] animate-pulse-slow"></div>
            <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>

        <Sidebar />
        
        <div className="relative z-10 lg:pl-[280px] min-h-screen">
            <AnimatePresence mode="wait">
                <Routes>
                    <Route index element={<StudentOverview />} />
                    <Route path="new-request" element={<NewRequestForm />} />
                    <Route path="history" element={<StudentHistory />} />
                </Routes>
            </AnimatePresence>
        </div>
    </div>
);

export default StudentDashboard;

