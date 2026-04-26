import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
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
    'Plumbing',
    'Electrician',
    'ICT Technician',
    'HVAC / Cooling',
    'Carpentry',
    'Painting / Finishing'
];

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
            <img src={dbuLogo} alt="DBU" className="me-4 d-none d-md-block" style={{ height: '48px' }} />
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
                style={{ width: '50px', height: '50px' }}
                title="Open active queue"
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

const RequestDetailsModal = ({ request, logs, loading, technicians, onAssign, onClose }) => {
    return (
        <PremiumModal
            isOpen={!!request}
            onClose={onClose}
            title={request ? `Request #${request.id}` : 'Request Details'}
            maxWidth="860px"
            showFooter={false}
            dialogClassName="request-details-modal"
            bodyClassName="request-details-modal__body"
        >
            {request && (
                <div className="request-details-modal__content">
                    <div className="p-4 rounded-4 bg-primary bg-opacity-10 border border-primary border-opacity-10">
                        <div className="d-flex justify-content-between flex-wrap gap-3">
                            <div>
                                <h5 className="fw-800 text-main mb-1">{request.title}</h5>
                                <p className="smallest text-muted mb-0">{request.description}</p>
                            </div>
                            <span className={`status-badge ${statusClassName(request.status)}`}>{request.status}</span>
                        </div>
                    </div>

                    <div className="row g-4">
                        <div className="col-md-6">
                            <label className="smallest fw-800 uppercase tracking-widest text-muted mb-2">Student</label>
                            <div className="fw-800 text-main">{request.student_name}</div>
                            <div className="smallest text-muted">{request.student_code}</div>
                            <div className="smallest text-muted d-flex align-items-center mt-1">
                                <Phone size={13} className="me-2 text-primary" />
                                {request.student_phone || 'No phone number'}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <label className="smallest fw-800 uppercase tracking-widest text-muted mb-2">Location</label>
                            <div className="fw-800 text-main d-flex align-items-center">
                                <MapPin size={14} className="me-2 text-primary" />
                                {request.location}
                            </div>
                            <div className="smallest text-muted mt-2">Priority: {request.priority}</div>
                            <div className="smallest text-muted">Category: {request.category}</div>
                        </div>
                    </div>

                    <div className="row g-4">
                        <div className="col-lg-6">
                            {request.status !== 'Completed' ? (
                                <>
                                    <label className="smallest fw-800 uppercase tracking-widest text-muted mb-2 d-block">Assign Technician</label>
                                    <div className="d-flex gap-2">
                                        <select
                                            className="form-select py-3 px-4 bg-surface border-secondary border-opacity-10 rounded-4 fw-bold text-main shadow-sm"
                                            defaultValue={request.technician_id ? String(request.technician_id) : ''}
                                            onChange={(event) => event.target.value && onAssign(request.id, event.target.value)}
                                        >
                                            <option value="">Select technician</option>
                                            {technicians.map((technician) => (
                                                <option key={technician.id} value={technician.id}>
                                                    {technician.name} - {technician.skills}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            ) : (
                                <label className="smallest fw-800 uppercase tracking-widest text-muted mb-2 d-block">Assigned Technician</label>
                            )}
                            {request.technician_name && (
                                <div className="mt-3 p-3 rounded-4 bg-surface border border-secondary border-opacity-10">
                                    <div className="fw-800 text-main">{request.technician_name}</div>
                                    <div className="smallest text-muted">{request.technician_skills || 'Technician'}</div>
                                    <div className="smallest text-muted d-flex align-items-center mt-1">
                                        <Phone size={13} className="me-2 text-primary" />
                                        {request.technician_phone || 'No phone number'}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="col-lg-6">
                            <label className="smallest fw-800 uppercase tracking-widest text-muted mb-2 d-block">Progress Timeline</label>
                            <div className="d-flex flex-column gap-3 request-details-modal__timeline">
                                {loading ? (
                                    <div className="text-center py-4">
                                        <Loader2 size={24} className="animate-spin text-primary" />
                                    </div>
                                ) : logs.length > 0 ? (
                                    logs.map((log) => (
                                        <div key={log.id} className="p-3 rounded-4 bg-surface border border-secondary border-opacity-10 request-details-modal__timeline-item">
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
                                    <div className="text-center py-4 text-muted">No timeline entries yet.</div>
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

    const activeCount = useMemo(() => requests.filter((request) => request.status !== 'Completed').length, [requests]);
    const completedCount = useMemo(() => requests.filter((request) => request.status === 'Completed').length, [requests]);
    const technicianCount = useMemo(() => users.filter((user) => user.role === 'technician').length, [users]);
    const studentCount = useMemo(() => users.filter((user) => user.role === 'student').length, [users]);
    const categoryCounts = useMemo(
        () => REQUEST_CATEGORIES.map((category) => requests.filter((request) => request.category === category).length),
        [requests]
    );
    const statusCounts = useMemo(() => [
        requests.filter((request) => request.status === 'Pending').length,
        requests.filter((request) => request.status === 'Assigned').length,
        requests.filter((request) => request.status === 'In Progress').length,
        requests.filter((request) => request.status === 'On Hold').length,
        requests.filter((request) => request.status === 'Completed').length
    ], [requests]);

    const handleNotificationClick = async () => {
        await markNotificationsRead();
        navigate('/admin/requests');
    };

    return (
        <div className="container-fluid">
            <DashboardHeader
                title="Admin Overview"
                subtitle="Monitor live maintenance requests, users, and technician workload"
                unreadCount={unreadCount}
                onReadNotifications={handleNotificationClick}
                onLogout={logout}
            />

            <div className="row g-4 mb-4">
                {[
                    { label: 'All Users', value: users.length, icon: <Users size={22} />, note: `${studentCount} students` },
                    { label: 'Technicians', value: technicianCount, icon: <Wrench size={22} />, note: 'Active technicians' },
                    { label: 'Active Queue', value: activeCount, icon: <ClipboardList size={22} />, note: 'Needs tracking' },
                    { label: 'Completed', value: completedCount, icon: <CheckCircle2 size={22} />, note: 'Stored in history' }
                ].map((item) => (
                    <div key={item.label} className="col-md-6 col-xl-3">
                        <div className="premium-card p-4 bg-glass border-secondary border-opacity-10 shadow-22xl h-100">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-4">{item.icon}</div>
                                <span className="smallest text-muted">{item.note}</span>
                            </div>
                            <h2 className="fw-800 text-main mb-1">{item.value}</h2>
                            <p className="smallest text-muted mb-0">{item.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4">
                <div className="col-xl-7">
                    <div className="premium-card p-4 bg-glass border-secondary border-opacity-10 shadow-22xl h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h4 className="fw-800 text-main mb-1">Requests by Category</h4>
                                <p className="smallest text-muted mb-0">Chart.js updates whenever the queue changes</p>
                            </div>
                            <button type="button" className={`btn btn-surface rounded-circle p-3 border-secondary border-opacity-10 ${loading ? 'animate-spin' : ''}`} onClick={refreshData}>
                                <Activity size={18} />
                            </button>
                        </div>
                        <div style={{ height: '320px' }}>
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

                <div className="col-xl-5">
                    <div className="premium-card p-4 bg-glass border-secondary border-opacity-10 shadow-22xl h-100">
                        <div className="mb-4">
                            <h4 className="fw-800 text-main mb-1">Queue Status</h4>
                            <p className="smallest text-muted mb-0">Pending, assigned, in progress, on hold, and completed requests</p>
                        </div>
                        <Doughnut
                            data={{
                                labels: ['Pending', 'Assigned', 'In Progress', 'On Hold', 'Completed'],
                                datasets: [
                                    {
                                        data: statusCounts,
                                        backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#6b7280', '#10b981'],
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
            </div>
        </div>
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
        <div className="container-fluid">
            <DashboardHeader
                title="Active Queue"
                subtitle="Review request details and assign the right technician"
                unreadCount={unreadCount}
                onReadNotifications={handleNotificationClick}
                onLogout={logout}
            />

            <div className="premium-card p-4 bg-glass border-secondary border-opacity-10 shadow-22xl">
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                    <div>
                        <h4 className="fw-800 text-main mb-1">Active Requests</h4>
                        <p className="smallest text-muted mb-0">Every update from students and technicians appears here live</p>
                    </div>
                    <button type="button" className={`btn btn-surface rounded-circle p-3 border-secondary border-opacity-10 ${loading ? 'animate-spin' : ''}`} onClick={refreshData}>
                        <RefreshCcw size={18} />
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
                                <th className="pb-3 text-main">Assign Technician</th>
                                <th className="pb-3 text-end text-main">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-5">
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
                                        <td className="py-4">
                                            <select
                                                className="form-select py-2 px-3 bg-surface border-secondary border-opacity-10 rounded-4 fw-bold text-main shadow-sm"
                                                value={request.technician_id || ''}
                                                onChange={(event) => assignTechnician(request.id, event.target.value)}
                                                disabled={assigningId === request.id}
                                            >
                                                <option value="">Select technician</option>
                                                {technicians.map((technician) => (
                                                    <option key={technician.id} value={technician.id}>
                                                        {technician.name} - {technician.skills}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="py-4 text-end">
                                            <button type="button" className="btn btn-surface rounded-pill px-3 py-2 border-secondary border-opacity-10" onClick={() => loadRequestDetails(request)}>
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-5 text-muted">
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
        </div>
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
        <div className="container-fluid">
            <DashboardHeader
                title="Admin History"
                subtitle="Completed work that can stay in history or be deleted"
                unreadCount={unreadCount}
                onReadNotifications={handleNotificationClick}
                onLogout={logout}
            />

            <div className="premium-card p-4 bg-glass border-secondary border-opacity-10 shadow-22xl">
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                    <div>
                        <h4 className="fw-800 text-main mb-1">Completed Requests</h4>
                        <p className="smallest text-muted mb-0">Admin can keep them in history or delete them permanently</p>
                    </div>
                    <button type="button" className="btn btn-danger rounded-pill px-4 py-3 fw-800 uppercase smallest tracking-widest" onClick={purgeAllCompleted}>
                        <Trash2 size={16} className="me-2" />
                        Delete All Completed
                    </button>
                </div>

                <div className="table-responsive">
                    <table className="table align-middle table-borderless">
                        <thead>
                            <tr className="smallest text-uppercase text-muted fw-800 tracking-widest border-bottom border-secondary border-opacity-10">
                                <th className="pb-3 text-main">Problem</th>
                                <th className="pb-3 text-main">Student</th>
                                <th className="pb-3 text-main">Technician</th>
                                <th className="pb-3 text-main">Completed</th>
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
                                            <div className="fw-800 text-main">{request.technician_name || 'Not assigned'}</div>
                                            <div className="smallest text-muted">{request.technician_phone || 'No phone number'}</div>
                                        </td>
                                        <td className="py-4">{new Date(request.updated_at).toLocaleString()}</td>
                                        <td className="py-4 text-end">
                                            <div className="d-flex justify-content-end gap-2">
                                                <button type="button" className="btn btn-surface rounded-pill px-3 py-2 border-secondary border-opacity-10" onClick={() => viewLogs(request)}>
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
        </div>
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
    const [newUser, setNewUser] = useState({
        name: '',
        user_code: '',
        role: 'student',
        skills: ''
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
        const interval = setInterval(fetchUsers, 20000);
        return () => clearInterval(interval);
    }, [fetchUsers]);

    const registerUser = async (event) => {
        event.preventDefault();
        setRegistering(true);
        setRegisterError('');
        setFeedback(null);

        try {
            const res = await axios.post('index.php?action=createUser', {
                name: newUser.name,
                user_code: newUser.user_code,
                role: newUser.role,
                skills: newUser.role === 'technician' ? newUser.skills : ''
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
                role: 'student',
                skills: ''
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
        <div className="container-fluid">
            <DashboardHeader
                title="User Registration"
                subtitle="Register students and technicians with system-generated default passwords"
                unreadCount={unreadCount}
                onReadNotifications={handleNotificationClick}
                onLogout={logout}
            />

            <div className="d-flex justify-content-end mb-4">
                <button
                    type="button"
                    className="btn btn-primary rounded-pill px-4 py-3 fw-800 uppercase smallest tracking-widest d-inline-flex align-items-center"
                    onClick={() => {
                        setRegisterError('');
                        setShowRegisterModal(true);
                    }}
                >
                    <UserPlus size={16} className="me-2" />
                    Register User
                </button>
            </div>

            <div className="premium-card p-4 bg-glass border-secondary border-opacity-10 shadow-22xl">
                {feedback && (
                    <div className={`alert border-0 rounded-4 mb-4 ${feedback.type === 'success' ? 'alert-success bg-success bg-opacity-10 text-success' : 'alert-danger bg-danger bg-opacity-10 text-danger'}`}>
                        {feedback.message}
                    </div>
                )}

                <div className="table-responsive">
                    <table className="table align-middle table-borderless">
                        <thead>
                            <tr className="smallest text-uppercase text-muted fw-800 tracking-widest border-bottom border-secondary border-opacity-10">
                                <th className="pb-3 text-main">Name</th>
                                <th className="pb-3 text-main">User ID</th>
                                <th className="pb-3 text-main">Role</th>
                                <th className="pb-3 text-main">Ability</th>
                                <th className="pb-3 text-main">Registration</th>
                                <th className="pb-3 text-end text-main">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-5">
                                        <Loader2 size={28} className="animate-spin text-primary" />
                                    </td>
                                </tr>
                            ) : users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id} className="border-bottom border-secondary border-opacity-5">
                                        <td className="py-4">
                                            <div className="fw-800 text-main">{user.name}</div>
                                            <div className="smallest text-muted text-capitalize">{user.role} account</div>
                                        </td>
                                        <td className="py-4">{user.user_code}</td>
                                        <td className="py-4 text-capitalize">{user.role}</td>
                                        <td className="py-4">{user.skills || '-'}</td>
                                        <td className="py-4">
                                            <div className="d-flex flex-column gap-2">
                                                <span className={`status-badge ${user.status === 'active' ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'}`}>
                                                    {user.status === 'active' ? 'Registered' : user.status}
                                                </span>
                                                <span className="smallest text-muted">{new Date(user.created_at).toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-end">
                                            <div className="d-flex justify-content-end gap-2">
                                                <button type="button" className="btn btn-surface rounded-pill px-3 py-2 border-secondary border-opacity-10 d-inline-flex align-items-center" onClick={() => resetPassword(user.user_code)}>
                                                    <RefreshCcw size={15} className="me-2" />
                                                    Reset
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger rounded-pill px-3 py-2"
                                                    onClick={() => deleteUser(user.id)}
                                                    disabled={deletingUserId === user.id}
                                                >
                                                    {deletingUserId === user.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-5 text-muted">
                                        No users found yet. Registered students and technicians will appear here.
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
                title="Register Student or Technician"
                showFooter={false}
                maxWidth="760px"
            >
                <form onSubmit={registerUser}>
                    {registerError && <div className="alert alert-danger border-0 bg-danger bg-opacity-10 rounded-4">{registerError}</div>}
                    <div className="row g-4">
                        <div className="col-md-6">
                            <label className="form-label smallest fw-800 uppercase tracking-widest text-muted">Full Name</label>
                            <input
                                type="text"
                                className="form-control py-3 px-4 bg-surface border-secondary border-opacity-10 rounded-4 fw-bold text-main shadow-sm"
                                value={newUser.name}
                                onChange={(event) => setNewUser((prev) => ({ ...prev, name: event.target.value }))}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label smallest fw-800 uppercase tracking-widest text-muted">User ID</label>
                            <input
                                type="text"
                                className="form-control py-3 px-4 bg-surface border-secondary border-opacity-10 rounded-4 fw-bold text-main shadow-sm"
                                placeholder="DBU1601069"
                                value={newUser.user_code}
                                onChange={(event) => setNewUser((prev) => ({ ...prev, user_code: event.target.value.toUpperCase() }))}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label smallest fw-800 uppercase tracking-widest text-muted">Role</label>
                            <select
                                className="form-select py-3 px-4 bg-surface border-secondary border-opacity-10 rounded-4 fw-bold text-main shadow-sm"
                                value={newUser.role}
                                onChange={(event) => setNewUser((prev) => ({ ...prev, role: event.target.value, skills: event.target.value === 'technician' ? prev.skills : '' }))}
                            >
                                <option value="student">Student</option>
                                <option value="technician">Technician</option>
                            </select>
                        </div>
                        {newUser.role === 'technician' && (
                            <div className="col-md-12">
                                <label className="form-label smallest fw-800 uppercase tracking-widest text-muted">Technician Ability</label>
                                <select
                                    className="form-select py-3 px-4 bg-surface border-secondary border-opacity-10 rounded-4 fw-bold text-main shadow-sm"
                                    value={newUser.skills}
                                    onChange={(event) => setNewUser((prev) => ({ ...prev, skills: event.target.value }))}
                                    required
                                >
                                    <option value="">Select ability</option>
                                    {TECHNICIAN_SKILLS.map((skill) => (
                                        <option key={skill} value={skill}>
                                            {skill}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div className="col-12">
                            <div className="p-3 rounded-4 bg-primary bg-opacity-10 border border-primary border-opacity-10 smallest text-primary">
                                The system will generate a default password automatically after registration.
                            </div>
                        </div>
                        <div className="col-12 d-flex gap-3">
                            <button type="button" className="btn btn-surface flex-grow-1 rounded-pill py-3 border-secondary border-opacity-10" onClick={() => setShowRegisterModal(false)}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary flex-grow-1 rounded-pill py-3 fw-800 uppercase smallest tracking-widest" disabled={registering}>
                                {registering ? <Loader2 size={16} className="animate-spin" /> : 'Register'}
                            </button>
                        </div>
                    </div>
                </form>
            </PremiumModal>

            <PremiumModal
                isOpen={!!generatedCredentials}
                onClose={() => setGeneratedCredentials(null)}
                onConfirm={() => setGeneratedCredentials(null)}
                title="Default Password Generated"
                type="success"
                confirmText="Close"
            >
                <p className="text-muted">The user must sign in with this temporary password and change it immediately on the login page.</p>
                <div className="p-4 rounded-4 bg-surface border border-secondary border-opacity-10">
                    <div className="mb-3">
                        <span className="smallest text-muted d-block">User ID</span>
                        <strong>{generatedCredentials?.user_code}</strong>
                    </div>
                    <div>
                        <span className="smallest text-muted d-block">Temporary Password</span>
                        <strong>{generatedCredentials?.temporary_password}</strong>
                    </div>
                </div>
            </PremiumModal>
        </div>
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
        <div className="container-fluid">
            <DashboardHeader
                title="Password Reset"
                subtitle="Enter a user ID like DBU1601069 and generate a new temporary password"
                unreadCount={unreadCount}
                onReadNotifications={handleNotificationClick}
                onLogout={logout}
            />

            <div className="row justify-content-center">
                <div className="col-xl-8">
                    <div className="premium-card p-5 bg-glass border-secondary border-opacity-10 shadow-22xl">
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <Shield size={24} className="text-primary" />
                            <div>
                                <h4 className="fw-800 text-main mb-1">Reset Student or Technician Password</h4>
                                <p className="smallest text-muted mb-0">The generated password will force a password change on the next login</p>
                            </div>
                        </div>

                        <form onSubmit={handleReset}>
                            <div className="row g-3">
                                <div className="col-md-8">
                                    <input
                                        type="text"
                                        className="form-control py-3 px-4 bg-surface border-secondary border-opacity-10 rounded-4 fw-bold text-main shadow-sm"
                                        placeholder="DBU1601069"
                                        value={userCode}
                                        onChange={(event) => setUserCode(event.target.value.toUpperCase())}
                                        required
                                    />
                                </div>
                                <div className="col-md-4">
                                    <button type="submit" className="btn btn-primary w-100 py-3 rounded-pill fw-800 uppercase smallest tracking-widest" disabled={loading}>
                                        {loading ? <Loader2 size={16} className="animate-spin" /> : 'Generate Password'}
                                    </button>
                                </div>
                            </div>
                        </form>

                        {error && <div className="alert alert-danger border-0 bg-danger bg-opacity-10 rounded-4 mt-4 mb-0">{error}</div>}
                    </div>
                </div>
            </div>

            <PremiumModal
                isOpen={!!generatedCredentials}
                onClose={() => setGeneratedCredentials(null)}
                onConfirm={() => setGeneratedCredentials(null)}
                title="Temporary Password Ready"
                type="success"
                confirmText="Close"
            >
                <p className="text-muted">Give this password to the user. They will be redirected to change it on the login page.</p>
                <div className="p-4 rounded-4 bg-surface border border-secondary border-opacity-10">
                    <div className="mb-3">
                        <span className="smallest text-muted d-block">User ID</span>
                        <strong>{generatedCredentials?.user_code}</strong>
                    </div>
                    <div>
                        <span className="smallest text-muted d-block">Temporary Password</span>
                        <strong>{generatedCredentials?.temporary_password}</strong>
                    </div>
                </div>
            </PremiumModal>
        </div>
    );
};

const AdminDashboard = () => (
    <div className="min-vh-100 position-relative">
        <div className="app-backdrop">
            <div className="fullscreen-bg-fixed" style={{ backgroundImage: `url(${techBg})` }}></div>
            <div className="bg-overlay"></div>
        </div>

        <Sidebar />
        <div className="main-content-area text-main">
            <AnimatePresence mode="wait">
                <Routes>
                    <Route index element={<div><AdminOverview /></div>} />
                    <Route path="requests" element={<div><ActiveQueue /></div>} />
                    <Route path="history" element={<div><AdminHistory /></div>} />
                    <Route path="users" element={<div><UsersPage /></div>} />
                    <Route path="security" element={<div><SecurityPage /></div>} />
                </Routes>
            </AnimatePresence>
        </div>
    </div>
);

export default AdminDashboard;
