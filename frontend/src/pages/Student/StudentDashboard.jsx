import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
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
    if (status === 'Completed') return 'bg-success bg-opacity-10 text-success';
    if (status === 'Pending') return 'bg-danger bg-opacity-10 text-danger';
    if (status === 'On Hold') return 'bg-secondary bg-opacity-10 text-secondary';
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
                title="Open requests"
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
                <div className="p-4 rounded-4 bg-primary bg-opacity-10 border border-primary border-opacity-10 mb-4">
                    <div className="d-flex justify-content-between flex-wrap gap-3">
                        <div>
                            <h5 className="fw-800 text-main mb-1">{request.title}</h5>
                            <p className="smallest text-muted mb-0">{request.location}</p>
                        </div>
                        <span className={`status-badge ${statusClassName(request.status)}`}>{request.status}</span>
                    </div>
                    <p className="smallest text-muted mt-3 mb-0">{request.description}</p>
                </div>

                <div className="d-flex flex-column gap-3">
                    {loading ? (
                        <div className="text-center py-4">
                            <Loader2 size={24} className="animate-spin text-primary" />
                        </div>
                    ) : logs.length > 0 ? (
                        logs.map((log) => (
                            <div key={log.id} className="p-3 rounded-4 bg-surface border border-secondary border-opacity-10">
                                <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
                                    <div>
                                        <div className="fw-800 text-main">{log.action_taken}</div>
                                        <div className="smallest text-muted">{log.action_by}</div>
                                    </div>
                                    <span className="smallest text-muted">{new Date(log.created_at).toLocaleString()}</span>
                                </div>
                                <p className="small text-main mb-2">{log.remarks}</p>
                                <span className="smallest text-primary fw-bold">Progress: {log.progress_percentage ?? 0}%</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-4 text-muted">No updates yet.</div>
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

    const handleNotificationClick = async () => {
        await markNotificationsRead();
        navigate('/student');
    };

    return (
        <div className="container-fluid">
            <DashboardHeader
                title="New Request"
                subtitle="Send a maintenance problem to the admin team"
                unreadCount={unreadCount}
                onReadNotifications={handleNotificationClick}
                onLogout={logout}
            />

            <div className="row justify-content-center">
                <div className="col-xl-8">
                    <div className="premium-card p-5 bg-glass border-secondary border-opacity-10 shadow-22xl">
                        {error && <div className="alert alert-danger border-0 bg-danger bg-opacity-10 rounded-4">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="row g-4">
                                <div className="col-12">
                                    <label className="form-label smallest fw-800 uppercase tracking-widest text-muted">Problem Title</label>
                                    <input
                                        type="text"
                                        className="form-control py-3 px-4 bg-surface border-secondary border-opacity-10 rounded-4 fw-bold text-main shadow-sm"
                                        value={formData.title}
                                        onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
                                        placeholder="Example: Water leakage in Block B"
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label smallest fw-800 uppercase tracking-widest text-muted">Category</label>
                                    <select
                                        className="form-select py-3 px-4 bg-surface border-secondary border-opacity-10 rounded-4 fw-bold text-main shadow-sm"
                                        value={formData.category}
                                        onChange={(event) => setFormData((prev) => ({ ...prev, category: event.target.value }))}
                                    >
                                        {REQUEST_CATEGORIES.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label smallest fw-800 uppercase tracking-widest text-muted">Priority</label>
                                    <select
                                        className="form-select py-3 px-4 bg-surface border-secondary border-opacity-10 rounded-4 fw-bold text-main shadow-sm"
                                        value={formData.priority}
                                        onChange={(event) => setFormData((prev) => ({ ...prev, priority: event.target.value }))}
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Emergency">Emergency</option>
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label smallest fw-800 uppercase tracking-widest text-muted">Dorm</label>
                                    <input
                                        type="text"
                                        className="form-control py-3 px-4 bg-surface border-secondary border-opacity-10 rounded-4 fw-bold text-main shadow-sm"
                                        value={formData.dorm}
                                        onChange={(event) => setFormData((prev) => ({ ...prev, dorm: event.target.value }))}
                                        placeholder="Example: Dorm A"
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label smallest fw-800 uppercase tracking-widest text-muted">Block</label>
                                    <input
                                        type="text"
                                        className="form-control py-3 px-4 bg-surface border-secondary border-opacity-10 rounded-4 fw-bold text-main shadow-sm"
                                        value={formData.block}
                                        onChange={(event) => setFormData((prev) => ({ ...prev, block: event.target.value }))}
                                        placeholder="Example: Block B"
                                        required
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label smallest fw-800 uppercase tracking-widest text-muted">Description</label>
                                    <textarea
                                        className="form-control py-3 px-4 bg-surface border-secondary border-opacity-10 rounded-4 fw-bold text-main shadow-sm"
                                        rows="5"
                                        value={formData.description}
                                        onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
                                        placeholder="Describe the maintenance problem clearly"
                                        required
                                    />
                                </div>

                                <div className="col-12">
                                    <button type="submit" className="btn btn-primary px-4 py-3 rounded-pill fw-800 uppercase smallest tracking-widest shadow-22xl d-inline-flex align-items-center" disabled={saving}>
                                        {saving ? <Loader2 size={18} className="me-2 animate-spin" /> : <Send size={18} className="me-2" />}
                                        {saving ? 'Sending...' : 'Submit Request'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
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
                <p className="mb-0 text-muted">Your maintenance request was sent to the admin queue successfully.</p>
            </PremiumModal>
        </div>
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

    const handleNotificationClick = async () => {
        await markNotificationsRead();
        navigate('/student');
    };

    return (
        <div className="container-fluid text-main">
            <DashboardHeader
                title="Student Dashboard"
                subtitle="Track the problem you reported and see technician updates"
                unreadCount={unreadCount}
                onReadNotifications={handleNotificationClick}
                onLogout={logout}
            />

            <div className="row g-4 mb-4">
                <div className="col-xl-4">
                    <div className="premium-card p-4 h-100 bg-glass border-secondary border-opacity-10 shadow-22xl">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h4 className="fw-800 text-main mb-1">My Request Summary</h4>
                                <p className="smallest text-muted mb-0">Live counts from your dashboard</p>
                            </div>
                            <Activity size={22} className="text-primary" />
                        </div>
                        <Doughnut
                            data={{
                                labels: ['Assigned', 'In Progress', 'On Hold', 'Completed'],
                                datasets: [
                                    {
                                        data: [statusCounts.assigned, statusCounts.progress, statusCounts.holding, statusCounts.completed],
                                        backgroundColor: ['#f59e0b', '#3b82f6', '#6b7280', '#10b981'],
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
                    <div className="premium-card p-4 h-100 bg-glass border-secondary border-opacity-10 shadow-22xl">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h4 className="fw-800 text-main mb-1">Category Activity</h4>
                                <p className="smallest text-muted mb-0">Chart.js updates whenever your requests change</p>
                            </div>
                            <button type="button" className={`btn btn-surface rounded-circle p-3 border-secondary border-opacity-10 ${loading ? 'animate-spin' : ''}`} onClick={refreshData}>
                                <Activity size={18} />
                            </button>
                        </div>
                        <div style={{ height: '300px' }}>
                            <Bar
                                data={{
                                    labels: REQUEST_CATEGORIES,
                                    datasets: [
                                        {
                                            label: 'Requests',
                                            data: categoryCounts,
                                            backgroundColor: '#3b82f6',
                                            borderRadius: 10
                                        }
                                    ]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-12">
                    <div className="premium-card p-4 bg-glass border-secondary border-opacity-10 shadow-22xl">
                        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                            <div>
                                <h4 className="fw-800 text-main mb-1">Active Requests</h4>
                                <p className="smallest text-muted mb-0">See the current status, assigned technician name, and phone number</p>
                            </div>
                            <Link to="/student/new-request" className="btn btn-primary rounded-pill px-4 py-3 fw-800 uppercase smallest tracking-widest d-inline-flex align-items-center">
                                <Plus size={16} className="me-2" />
                                New Request
                            </Link>
                        </div>

                        <div className="table-responsive">
                            <table className="table align-middle table-borderless">
                                <thead>
                                    <tr className="smallest text-uppercase text-muted fw-800 tracking-widest border-bottom border-secondary border-opacity-10">
                                        <th className="pb-3 text-main">Problem</th>
                                        <th className="pb-3 text-main">Location</th>
                                        <th className="pb-3 text-main">Status</th>
                                        <th className="pb-3 text-main">Assigned Technician</th>
                                        <th className="pb-3 text-end text-main">Actions</th>
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
                                                    <div className="d-flex align-items-center text-muted">
                                                        <MapPin size={14} className="me-2 text-primary" />
                                                        {request.location}
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <span className={`status-badge ${statusClassName(request.status)}`}>{request.status}</span>
                                                    <div className="smallest text-muted mt-2">Progress: {request.progress_percentage}%</div>
                                                </td>
                                                <td className="py-4">
                                                    {request.technician_name ? (
                                                        <>
                                                            <div className="fw-800 text-main">{request.technician_name}</div>
                                                            <div className="smallest text-muted d-flex align-items-center mt-1">
                                                                <Phone size={13} className="me-2 text-primary" />
                                                                {request.technician_phone || 'No phone number'}
                                                            </div>
                                                            <div className="smallest text-muted d-flex align-items-center mt-1">
                                                                <Wrench size={13} className="me-2 text-primary" />
                                                                {request.technician_skills || 'Technician'}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <span className="smallest text-muted">Waiting for admin assignment</span>
                                                    )}
                                                </td>
                                                <td className="py-4 text-end">
                                                    <div className="d-flex justify-content-end gap-2">
                                                        <button type="button" className="btn btn-surface rounded-pill px-3 py-2 border-secondary border-opacity-10" onClick={() => openTimeline(request)}>
                                                            View
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger rounded-pill px-3 py-2"
                                                            onClick={() => deleteRequest(request.id)}
                                                            disabled={deletingId === request.id}
                                                        >
                                                            {deletingId === request.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-5 text-muted">
                                                No active requests right now.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
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
        </div>
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

    const handleNotificationClick = async () => {
        await markNotificationsRead();
        navigate('/student');
    };

    return (
        <div className="container-fluid text-main">
            <DashboardHeader
                title="Request History"
                subtitle="Completed tasks you can review or delete permanently"
                unreadCount={unreadCount}
                onReadNotifications={handleNotificationClick}
                onLogout={logout}
            />

            <div className="premium-card p-4 bg-glass border-secondary border-opacity-10 shadow-22xl">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <CheckCircle size={22} className="text-success" />
                    <div>
                        <h4 className="fw-800 text-main mb-1">Completed Requests</h4>
                        <p className="smallest text-muted mb-0">Deleting a request here removes it from admin and technician dashboards too</p>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table align-middle table-borderless">
                        <thead>
                            <tr className="smallest text-uppercase text-muted fw-800 tracking-widest border-bottom border-secondary border-opacity-10">
                                <th className="pb-3 text-main">Problem</th>
                                <th className="pb-3 text-main">Technician</th>
                                <th className="pb-3 text-main">Completed</th>
                                <th className="pb-3 text-end text-main">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-5">
                                        <Loader2 size={28} className="animate-spin text-primary" />
                                    </td>
                                </tr>
                            ) : completedRequests.length > 0 ? (
                                completedRequests.map((request) => (
                                    <tr key={request.id} className="border-bottom border-secondary border-opacity-5">
                                        <td className="py-4">
                                            <div className="fw-800 text-main">{request.title}</div>
                                            <div className="smallest text-muted d-flex align-items-center mt-1">
                                                <MapPin size={13} className="me-2 text-primary" />
                                                {request.location}
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="fw-800 text-main">{request.technician_name || 'Not assigned'}</div>
                                            <div className="smallest text-muted d-flex align-items-center mt-1">
                                                <Phone size={13} className="me-2 text-primary" />
                                                {request.technician_phone || 'No phone number'}
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="small text-main">{new Date(request.updated_at).toLocaleString()}</div>
                                        </td>
                                        <td className="py-4 text-end">
                                            <div className="d-flex justify-content-end gap-2">
                                                <button type="button" className="btn btn-surface rounded-pill px-3 py-2 border-secondary border-opacity-10" onClick={() => openTimeline(request)}>
                                                    View
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger rounded-pill px-3 py-2"
                                                    onClick={() => deleteRequest(request.id)}
                                                    disabled={deletingId === request.id}
                                                >
                                                    {deletingId === request.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-5 text-muted">
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
        </div>
    );
};

const StudentDashboard = () => (
    <div className="min-vh-100 position-relative">
        <div className="app-backdrop">
            <div className="fullscreen-bg-fixed" style={{ backgroundImage: `url(${techBg})` }}></div>
            <div className="bg-overlay"></div>
        </div>

        <Sidebar />
        <div className="main-content-area text-main">
            <AnimatePresence mode="wait">
                <Routes>
                    <Route index element={<div><StudentOverview /></div>} />
                    <Route path="new-request" element={<div><NewRequestForm /></div>} />
                    <Route path="history" element={<div><StudentHistory /></div>} />
                </Routes>
            </AnimatePresence>
        </div>
    </div>
);

export default StudentDashboard;
