import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
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
    if (status === 'Completed') return 'bg-success bg-opacity-10 text-success';
    if (status === 'On Hold') return 'bg-secondary bg-opacity-10 text-secondary';
    if (status === 'Assigned') return 'bg-primary bg-opacity-10 text-primary';
    return 'bg-warning bg-opacity-10 text-warning';
};

const DashboardHeader = ({ title, subtitle, unreadCount, onReadNotifications, onLogout }) => (
    <div className="d-flex justify-content-between align-items-center mb-4 mt-2 flex-wrap gap-3">
        <div className="d-flex align-items-center">
            <img src={dbuLogo} alt="DBU" className="me-4 d-none d-md-block" style={{ height: '46px' }} />
            <div>
                <h2 className="fw-800 tracking-tighter mb-1 text-main">{title}</h2>
                <p className="text-muted smallest fw-800 uppercase tracking-widest opacity-75 mb-0">{subtitle}</p>
            </div>
        </div>
        <div className="d-flex align-items-center gap-2">
            <button
                type="button"
                onClick={onReadNotifications}
                className="btn btn-surface position-relative rounded-circle p-3 border-secondary border-opacity-10"
                style={{ width: '48px', height: '48px' }}
                title="Open assigned work"
            >
                <Bell size={20} className={unreadCount > 0 ? 'text-danger' : 'text-muted'} />
                {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger" style={{ minWidth: '22px', minHeight: '22px', fontSize: '0.65rem' }}>
                        {unreadCount}
                    </span>
                )}
            </button>
            <button type="button" onClick={onLogout} className="btn btn-danger rounded-pill px-4 py-2 fw-800 uppercase smallest tracking-widest d-inline-flex align-items-center">
                <LogOut size={15} className="me-2" />
                Logout
            </button>
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
                    <div className="p-4 rounded-4 bg-primary bg-opacity-10 border border-primary border-opacity-10 mb-4">
                        <h5 className="fw-800 text-main mb-1">{request.title}</h5>
                        <div className="smallest text-muted d-flex align-items-center">
                            <MapPin size={13} className="me-2 text-primary" />
                            {request.location}
                        </div>
                    </div>

                    <div className="row g-4 mb-4">
                        <div className="col-md-6">
                            <label className="form-label smallest fw-800 uppercase tracking-widest text-muted">Status</label>
                            <select
                                className="form-select py-3 px-4 bg-surface border-secondary border-opacity-10 rounded-4 fw-bold text-main shadow-sm"
                                value={status}
                                onChange={(event) => setStatus(event.target.value)}
                            >
                                <option value="Assigned">Assigned</option>
                                <option value="In Progress">In Progress</option>
                                <option value="On Hold">On Hold</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label smallest fw-800 uppercase tracking-widest text-muted">Progress ({progress}%)</label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                className="form-range"
                                value={progress}
                                onChange={(event) => setProgress(event.target.value)}
                            />
                        </div>
                        <div className="col-12">
                            <label className="form-label smallest fw-800 uppercase tracking-widest text-muted">Remarks</label>
                            <textarea
                                className="form-control py-3 px-4 bg-surface border-secondary border-opacity-10 rounded-4 fw-bold text-main shadow-sm"
                                rows="4"
                                value={remarks}
                                onChange={(event) => setRemarks(event.target.value)}
                                placeholder="Explain what you did or what is blocking the task"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label smallest fw-800 uppercase tracking-widest text-muted">Previous Updates</label>
                        <div className="d-flex flex-column gap-3" style={{ maxHeight: '220px', overflowY: 'auto' }}>
                            {loadingHistory ? (
                                <div className="text-center py-4">
                                    <Loader2 size={24} className="animate-spin text-primary" />
                                </div>
                            ) : history.length > 0 ? (
                                history.map((log) => (
                                    <div key={log.id} className="p-3 rounded-4 bg-surface border border-secondary border-opacity-10">
                                        <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
                                            <div>
                                                <div className="fw-800 text-main">{log.action_taken}</div>
                                                <div className="smallest text-muted">{log.action_by}</div>
                                            </div>
                                            <span className="smallest text-muted">{new Date(log.created_at).toLocaleString()}</span>
                                        </div>
                                        <div className="small text-main">{log.remarks}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-muted">No previous updates yet.</div>
                            )}
                        </div>
                    </div>

                    <div className="d-flex gap-3">
                        <button type="button" className="btn btn-surface flex-grow-1 rounded-pill py-3 border-secondary border-opacity-10" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary flex-grow-1 rounded-pill py-3 fw-800 uppercase smallest tracking-widest d-inline-flex align-items-center justify-content-center" disabled={saving}>
                            {saving ? <Loader2 size={16} className="animate-spin me-2" /> : <Save size={16} className="me-2" />}
                            Save Update
                        </button>
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
        <div className="container-fluid">
            <DashboardHeader
                title="Technician Dashboard"
                subtitle="Receive assigned work, update status, and send progress back to admin and students"
                unreadCount={unreadCount}
                onReadNotifications={handleNotificationClick}
                onLogout={logout}
            />

            <div className="row g-4 mb-4">
                <div className="col-xl-4">
                    <div className="premium-card p-4 bg-glass border-secondary border-opacity-10 shadow-22xl h-100">
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <Activity size={22} className="text-primary" />
                            <div>
                                <h4 className="fw-800 text-main mb-1">Workload Summary</h4>
                                <p className="smallest text-muted mb-0">Live chart of your assigned work</p>
                            </div>
                        </div>
                        <Doughnut
                            data={{
                                labels: ['Assigned', 'In Progress', 'On Hold', 'Completed'],
                                datasets: [
                                    {
                                        data: chartData,
                                        backgroundColor: ['#3b82f6', '#f59e0b', '#6b7280', '#10b981'],
                                        borderWidth: 0
                                    }
                                ]
                            }}
                            options={{
                                responsive: true,
                                plugins: { legend: { position: 'bottom' } }
                            }}
                        />
                    </div>
                </div>

                <div className="col-xl-8">
                    <div className="premium-card p-4 bg-glass border-secondary border-opacity-10 shadow-22xl h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h4 className="fw-800 text-main mb-1">Assigned Requests</h4>
                                <p className="smallest text-muted mb-0">Open each request and send your status update</p>
                            </div>
                            <button type="button" className={`btn btn-surface rounded-circle p-3 border-secondary border-opacity-10 ${loading ? 'animate-spin' : ''}`} onClick={refreshData}>
                                <Activity size={18} />
                            </button>
                        </div>

                        <div className="table-responsive">
                            <table className="table align-middle table-borderless">
                                <thead>
                                    <tr className="smallest text-uppercase text-muted fw-800 tracking-widest border-bottom border-secondary border-opacity-10">
                                        <th className="pb-3 text-main">Problem</th>
                                        <th className="pb-3 text-main">Student</th>
                                        <th className="pb-3 text-main">Location</th>
                                        <th className="pb-3 text-main">Status</th>
                                        <th className="pb-3 text-end text-main">Update</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="5" className="text-center py-5">
                                                <Loader2 size={28} className="animate-spin text-primary" />
                                            </td>
                                        </tr>
                                    ) : activeRequests.length > 0 ? (
                                        activeRequests.map((request) => (
                                            <tr key={request.id} className="border-bottom border-secondary border-opacity-5">
                                                <td className="py-4">
                                                    <div className="fw-800 text-main">{request.title}</div>
                                                    <div className="smallest text-muted mt-1">{request.category}</div>
                                                </td>
                                                <td className="py-4">
                                                    <div className="fw-800 text-main">{request.student_name}</div>
                                                    <div className="smallest text-muted">{request.student_code}</div>
                                                    <div className="smallest text-muted d-flex align-items-center mt-1">
                                                        <Phone size={13} className="me-2 text-primary" />
                                                        {request.student_phone || 'No phone number'}
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <div className="d-flex align-items-center text-muted">
                                                        <MapPin size={14} className="me-2 text-primary" />
                                                        {request.location}
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <span className={`status-badge ${statusClassName(request.status)}`}>{request.status}</span>
                                                    <div className="smallest text-muted mt-2">Progress: {request.progress_percentage}%</div>
                                                </td>
                                                <td className="py-4 text-end">
                                                    <button type="button" className="btn btn-primary rounded-pill px-4 py-2 fw-800 uppercase smallest tracking-widest" onClick={() => setSelectedRequest(request)}>
                                                        Update
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-5 text-muted">
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
        </div>
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
        <div className="container-fluid">
            <DashboardHeader
                title="Technician History"
                subtitle="Completed assignments you can review or remove from history"
                unreadCount={unreadCount}
                onReadNotifications={handleNotificationClick}
                onLogout={logout}
            />

            <div className="premium-card p-4 bg-glass border-secondary border-opacity-10 shadow-22xl">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <CheckCircle2 size={22} className="text-success" />
                    <div>
                        <h4 className="fw-800 text-main mb-1">Completed Requests</h4>
                        <p className="smallest text-muted mb-0">These are the jobs you already marked as completed</p>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table align-middle table-borderless">
                        <thead>
                            <tr className="smallest text-uppercase text-muted fw-800 tracking-widest border-bottom border-secondary border-opacity-10">
                                <th className="pb-3 text-main">Problem</th>
                                <th className="pb-3 text-main">Student</th>
                                <th className="pb-3 text-main">Location</th>
                                <th className="pb-3 text-main">Completed</th>
                                <th className="pb-3 text-end text-main">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-5">
                                        <Loader2 size={28} className="animate-spin text-primary" />
                                    </td>
                                </tr>
                            ) : completedRequests.length > 0 ? (
                                completedRequests.map((request) => (
                                    <tr key={request.id} className="border-bottom border-secondary border-opacity-5">
                                        <td className="py-4">
                                            <div className="fw-800 text-main">{request.title}</div>
                                            <div className="smallest text-muted mt-1">{request.category}</div>
                                        </td>
                                        <td className="py-4">
                                            <div className="fw-800 text-main">{request.student_name}</div>
                                            <div className="smallest text-muted">{request.student_code}</div>
                                        </td>
                                        <td className="py-4">
                                            <div className="d-flex align-items-center text-muted">
                                                <MapPin size={14} className="me-2 text-primary" />
                                                {request.location}
                                            </div>
                                        </td>
                                        <td className="py-4">{new Date(request.updated_at).toLocaleString()}</td>
                                        <td className="py-4 text-end">
                                            <button
                                                type="button"
                                                className="btn btn-danger rounded-pill px-3 py-2"
                                                onClick={() => deleteCompletedTask(request.id)}
                                                disabled={deletingId === request.id}
                                            >
                                                {deletingId === request.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted">
                                        No completed requests in history.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const TechnicianDashboard = () => (
    <div className="min-vh-100 position-relative">
        <div className="app-backdrop">
            <div className="fullscreen-bg-fixed" style={{ backgroundImage: `url(${techBg})` }}></div>
            <div className="bg-overlay"></div>
        </div>

        <Sidebar />
        <div className="main-content-area text-main">
            <AnimatePresence mode="wait">
                <Routes>
                    <Route index element={<div><TechnicianOverview /></div>} />
                    <Route path="history" element={<div><TechnicianHistory /></div>} />
                </Routes>
            </AnimatePresence>
        </div>
    </div>
);

export default TechnicianDashboard;
