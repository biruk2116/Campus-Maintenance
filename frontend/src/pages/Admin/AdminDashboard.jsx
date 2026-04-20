import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../../components/Sidebar';
import axios from '../../api/axios';
import PremiumModal from '../../components/PremiumModal';
import { fadeInUp, staggerContainer } from '../../utils/animations';

// Assets
import dbuLogo from '../../assets/images/dbu-logo.png';
import techBg from '../../assets/images/tech-bg.png';

import { 
    Users, Trash2, Key, CheckCircle, Clock, TrendingUp, Plus, UserPlus,
    AlertCircle, Search, Bell, Settings, Download, Activity, Shield, Loader2, LogIn, RefreshCcw,
    Activity as Pulse, MapPin, X, Save, User as UserIcon, UserCheck, Wrench, BarChart2,
    PieChart, Layout as LayoutIcon
} from 'lucide-react';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
    ArcElement, PointElement, LineElement, Filler
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useAuth } from '../../context/AuthContext';

ChartJS.register(
    CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, 
    ArcElement, PointElement, LineElement, Filler
);

const DashboardHeader = ({ title, subtitle, unreadCount }) => {
    useEffect(() => {
        if (unreadCount > 0) {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.play().catch(e => console.log("Audio Pulse Blocked"));
        }
    }, [unreadCount]);

    return (
        <div className="d-flex justify-content-between align-items-center mb-5 mt-2">
            <div className="d-flex align-items-center">
                <img src={dbuLogo} alt="DBU" className="me-4 d-none d-md-block" style={{ height: '55px' }} />
                <div>
                    <h2 className="fw-800 tracking-tighter mb-1 text-main">{title}</h2>
                    <p className="text-muted smaller mb-0 fw-800 uppercase tracking-widest opacity-75">{subtitle}</p>
                </div>
            </div>
            <div className="d-flex align-items-center gap-4">
                <div className="position-relative">
                    <div 
                        onClick={async () => {
                            try {
                                await axios.post('index.php?action=markNotificationsRead');
                                if (window.location.reload) window.location.reload();
                            } catch (e) { console.error("Pulse acknowledgment failed"); }
                        }}
                        className="bg-glass border border-secondary border-opacity-10 p-2 rounded-circle text-muted shadow-sm cursor-pointer d-flex align-items-center justify-content-center" 
                        style={{ width: '45px', height: '45px' }}
                    >
                        <Bell size={22} className={unreadCount > 0 ? "animate-pulse text-danger" : ""} />
                    </div>
                    {unreadCount > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger border-2 border-surface shadow-22xl animate__animated animate__heartBeat animate__infinite" style={{ width: '22px', height: '22px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '800' }}>
                            {unreadCount}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

// ========================
// 1. ADMIN OVERVIEW
// ========================
const AdminOverview = () => {
    const [requests, setRequests] = useState([]);
    const [usersCount, setUsersCount] = useState(0);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const { isDarkMode } = useAuth();

    const fetchData = useCallback(async () => {
        try {
            const [reqRes, usersRes, unreadRes] = await Promise.all([
                axios.get('index.php?action=getAllRequests'),
                axios.get('index.php?action=getAllUsers'),
                axios.get('index.php?action=getNotificationCounts')
            ]);
            
            if (reqRes.data.success) setRequests(reqRes.data.data);
            if (usersRes.data.success) setUsersCount(usersRes.data.data.length);
            if (unreadRes.data.success) setUnreadCount(unreadRes.data.data.unread);
        } catch (err) { console.error("Operational Fetch failed", err); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const stats = useMemo(() => {
        const pending = requests.filter(r => r.status === 'Pending').length;
        const active = requests.filter(r => r.status === 'Assigned' || r.status === 'In Progress').length;
        const completed = requests.filter(r => r.status === 'Completed').length;
        const pulse = requests.length > 0 ? (completed / requests.length) * 100 : 0;
        return { pending, active, completed, pulse };
    }, [requests]);

    if (loading) return <div className="p-5 text-center"><Loader2 size={40} className="text-primary animate-spin" /></div>;

    return (
        <div className="container-fluid">
            <DashboardHeader title="Strategic Command" subtitle="Institutional Infrastructure Pulse Hub" unreadCount={unreadCount} />
            
            <motion.div 
                variants={staggerContainer}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                className="row g-4 mb-5"
            >
                {[
                    { label: 'Personnel Grid', count: usersCount, color: 'primary', icon: <Users size={24} />, note: 'Verified Assets' },
                    { label: 'Strategic Queue', count: stats.pending, color: 'danger', icon: <Clock size={24} />, note: 'Needs Action' },
                    { label: 'Tactical Pulse', count: Math.round(stats.pulse) + '%', color: 'success', icon: <Pulse size={24} />, note: 'Stability Index' },
                    { label: 'Field Assets', count: stats.active, color: 'warning', icon: <TrendingUp size={24} />, note: 'Engaged Units' }
                ].map((s, i) => (
                    <motion.div variants={fadeInUp} key={i} className="col-md-3">
                        <div className="premium-card p-4 border-secondary border-opacity-10 h-100 bg-glass text-center text-md-start">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className={`text-${s.color} bg-${s.color} bg-opacity-10 p-3 rounded-4 shadow-sm`}>{s.icon}</div>
                                <span className="smallest text-muted fw-800 uppercase tracking-widest">{s.note}</span>
                            </div>
                            <h1 className="fw-800 mb-1 text-main tracking-tighter" style={{ fontSize: '2.5rem' }}>{s.count}</h1>
                            <p className="text-muted smallest fw-800 uppercase mb-0 tracking-widest">{s.label}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="row g-4">
                <div className="col-lg-12">
                    <div className="premium-card p-5 bg-glass border-secondary border-opacity-10 shadow-22xl h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-800 mb-0 tracking-tighter text-main">Infrastructure Stability Metrics</h4>
                            <div className="bg-surface p-2 rounded-3 border border-secondary border-opacity-10 shadow-sm">
                                <span className="smallest text-muted fw-bold uppercase tracking-widest">Live Pulse</span>
                            </div>
                        </div>
                        <div style={{ height: '300px' }}>
                            <Bar 
                                data={{
                                    labels: ['Structural', 'Electricity', 'Plumbing', 'ICT / Grid'],
                                    datasets: [{
                                        label: 'Maintenance Frequency',
                                        data: [
                                            requests.filter(r => r.category === 'Structural').length,
                                            requests.filter(r => r.category === 'Electricity').length,
                                            requests.filter(r => r.category === 'Plumbing').length,
                                            requests.filter(r => r.category === 'ICT Technician' || r.category === 'Network').length,
                                        ],
                                        backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.6)',
                                        borderRadius: 8,
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: {
                                        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'gray' } },
                                        x: { grid: { display: false }, ticks: { color: 'gray' } }
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// ========================
// 2. STRATEGIC QUEUE (REQUESTS)
// ========================
const StrategicQueue = () => {
    const [requests, setRequests] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            const [reqRes, techRes] = await Promise.all([
                axios.get('index.php?action=getAllRequests'),
                axios.get('index.php?action=getTechnicians')
            ]);
            if (reqRes.data.success) setRequests(reqRes.data.data);
            if (techRes.data.success) setTechnicians(techRes.data.data);
        } catch (err) { console.error("Link Failure"); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleAssign = async (requestId, technicianId) => {
        if (!technicianId) return;
        try {
            const params = new URLSearchParams();
            params.append('request_id', requestId);
            params.append('technician_id', technicianId);
            const res = await axios.post('index.php?action=assignTechnician', params);
            if (res.data.success) {
                setSelectedRequest(null);
                fetchData();
            }
        } catch (err) { console.error("Assignment Interrupted"); }
    };

    const handleDelete = async () => {
        if (!confirmDelete) return;
        try {
            const params = new URLSearchParams();
            params.append('id', confirmDelete.id);
            const res = await axios.post('index.php?action=deleteRequest', params);
            if (res.data.success) {
                setConfirmDelete(null);
                fetchData();
            }
        } catch (err) { console.error("Purge Failed"); }
    };

    const handlePurge = async () => {
        try {
            const res = await axios.post('index.php?action=purgeRequests');
            if (res.data.success) {
                fetchData();
            }
        } catch (err) { console.error("Purge Link Failure"); }
    };

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <DashboardHeader title="Strategic Queue" subtitle="Active Institutional Dispatch Registry" />
                <button 
                    onClick={handlePurge} 
                    className="btn btn-surface btn-sm px-4 py-2 rounded-pill border-danger border-opacity-10 text-danger fw-800 uppercase smallest tracking-widest shadow-sm hover-bg-danger hover-text-white transition-all"
                >
                    <Trash2 size={16} className="me-2" /> Purge Completed
                </button>
            </div>
            
            <div className="premium-card p-5 bg-glass border-secondary border-opacity-10 shadow-22xl">
                <div className="table-responsive">
                    <table className="table align-middle table-borderless">
                        <thead>
                            <tr className="smallest text-uppercase text-muted fw-800 tracking-widest border-bottom border-secondary border-opacity-10">
                                <th className="pb-3 text-main">Discovery / Student</th>
                                <th className="pb-3 text-main">Site ID</th>
                                <th className="pb-3 text-center text-main">Status</th>
                                <th className="pb-3 text-main">Assigned Asset</th>
                                <th className="pb-3 text-end text-main">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((r, i) => (
                                <tr key={r.id} className="border-bottom border-secondary border-opacity-5 hover-bg-surface-hover transition-all">
                                    <td className="py-4">
                                        <div className="d-flex align-items-center mb-1">
                                            <div className="fw-800 text-main me-2">{r.title}</div>
                                            <button onClick={() => setSelectedRequest(r)} className="btn btn-link btn-sm p-0 smallest text-primary border-0"><Info size={14} /></button>
                                        </div>
                                        <div className="smallest text-muted fw-bold uppercase tracking-widest">{r.student_name}</div>
                                    </td>
                                    <td className="py-4">
                                        <div className="d-flex align-items-center text-muted fw-bold smaller uppercase tracking-widest">
                                            <MapPin size={14} className="text-primary me-2 shadow-sm" /> {r.location}
                                        </div>
                                    </td>
                                    <td className="py-4 text-center">
                                        <span className={`status-badge bg-${r.status === 'Completed' ? 'success' : (r.status === 'Pending' ? 'danger' : 'warning')} bg-opacity-10 text-${r.status === 'Completed' ? 'success' : (r.status === 'Pending' ? 'danger' : 'warning')} shadow-sm`}>
                                            {r.status}
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        {r.technician_name ? (
                                            <div className="d-flex align-items-center">
                                                <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary me-3"><Wrench size={14} /></div>
                                                <div>
                                                    <div className="smallest fw-800 text-main uppercase tracking-widest">{r.technician_name}</div>
                                                    <div className="progress rounded-pill bg-surface mt-1" style={{ height: '4px', width: '60px' }}>
                                                        <div className="progress-bar bg-primary" style={{ width: `${r.progress_percentage}%` }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <select 
                                                className="form-select smallest fw-800 uppercase tracking-widest bg-surface border-secondary border-opacity-10 rounded-pill px-3 py-2 text-muted"
                                                onChange={(e) => handleAssign(r.id, e.target.value)}
                                                defaultValue=""
                                            >
                                                <option value="" disabled>Assign Field Unit</option>
                                                {technicians.map(t => (
                                                    <option key={t.id} value={t.id}>{t.name} ({t.skills})</option>
                                                ))}
                                            </select>
                                        )}
                                    </td>
                                    <td className="py-4 text-end">
                                        <button onClick={() => setConfirmDelete(r)} className="btn btn-surface btn-sm p-3 rounded-circle text-danger border-0 shadow-sm hover-bg-danger hover-text-white transition-all"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Request Detail Modal */}
            <PremiumModal
                isOpen={!!selectedRequest}
                onClose={() => setSelectedRequest(null)}
                title="Operational Telemetry"
                maxWidth="700px"
                showFooter={false}
            >
                {selectedRequest && (
                    <div className="py-2">
                        <div className="mb-5 p-4 rounded-4 bg-primary bg-opacity-5 border border-primary border-opacity-10">
                            <div className="d-flex align-items-center gap-3 mb-2">
                                <Activity size={20} className="text-primary" />
                                <h5 className="fw-800 mb-0 text-main">{selectedRequest.title}</h5>
                            </div>
                            <p className="smallest text-muted fw-bold uppercase tracking-widest mb-0 opacity-75">Discovery ID: {selectedRequest.id} | Priority: {selectedRequest.priority}</p>
                        </div>

                        <div className="row g-4 mb-5">
                            <div className="col-md-6">
                                <label className="smallest fw-800 uppercase tracking-widest text-muted mb-2">Reporting Entity</label>
                                <div className="smaller fw-bold text-main">{selectedRequest.student_name}</div>
                            </div>
                            <div className="col-md-6">
                                <label className="smallest fw-800 uppercase tracking-widest text-muted mb-2">Deployment Site</label>
                                <div className="smaller fw-bold text-main">{selectedRequest.location}</div>
                            </div>
                            <div className="col-12">
                                <label className="smallest fw-800 uppercase tracking-widest text-muted mb-2">Technical Description</label>
                                <div className="smaller text-muted p-4 bg-surface border border-secondary border-opacity-5 rounded-4 border-start border-primary border-3 lh-relaxed fw-medium">
                                    {selectedRequest.description}
                                </div>
                            </div>
                        </div>

                        {!selectedRequest.technician_id && (
                            <div className="pt-4 border-top border-secondary border-opacity-5">
                                <label className="smallest fw-800 uppercase tracking-widest text-primary mb-3 d-block">Assign Strategic Personnel</label>
                                <div className="row g-3">
                                    {technicians.length > 0 ? technicians.map(t => (
                                        <div key={t.id} className="col-md-6">
                                            <div 
                                                onClick={() => handleAssign(selectedRequest.id, t.id)}
                                                className="p-3 rounded-4 bg-surface border border-secondary border-opacity-5 hover-border-primary cursor-pointer transition-all d-flex align-items-center shadow-sm"
                                            >
                                                <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary me-3"><UserCheck size={18} /></div>
                                                <div>
                                                    <div className="smaller fw-800 text-main uppercase">{t.name}</div>
                                                    <div className="smallest text-muted fw-bold text-primary">{t.skills}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="col-12 text-center py-4 bg-surface rounded-4">
                                            <p className="smallest text-muted fw-800 uppercase tracking-widest mb-0 opacity-50">No field engineers available in local grid.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </PremiumModal>

            <PremiumModal
                isOpen={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                onConfirm={handleDelete}
                title="Strategic Data Purge"
                type="danger"
                confirmText="Purge Asset"
            >
                <p className="text-muted fw-bold uppercase smallest tracking-widest mb-3">Confirming permanent deletion of:</p>
                <div className="p-3 rounded-4 bg-danger bg-opacity-10 border border-danger border-opacity-10 mb-2">
                    <h5 className="fw-800 mb-0 text-main">{confirmDelete?.title}</h5>
                </div>
                <p className="smallest text-muted fw-bold">This operation is irreversible and will remove all associated logs from the grid.</p>
            </PremiumModal>
        </div>
    );
};

// ========================
// 3. PERSONNEL REGISTRY (USERS)
// ========================
const PersonnelRegistry = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRegister, setShowRegister] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [registrationResult, setRegistrationResult] = useState(null);
    const [newUser, setNewUser] = useState({ name: '', user_code: '', email: '', phone_number: '', role: 'technician', skills: '' });

    const fetchUsers = useCallback(async () => {
        try {
            const res = await axios.get('index.php?action=getAllUsers');
            if (res.data.success) setUsers(res.data.data);
        } catch (err) { console.error("Registry Sync Failed"); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const handleResetPassword = async (userCode) => {
        try {
            const params = new URLSearchParams();
            params.append('user_code', userCode);
            const res = await axios.post('index.php?action=resetUserPassword', params);
            if (res.data.success) {
                // Ensure the reset password result is displayed in the strategic modal
                setRegistrationResult({
                    user_code: userCode,
                    temporary_password: res.data.data.temporary_password
                });
            }
        } catch (err) { console.error("Strategic Reset Failed"); }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const params = new URLSearchParams();
            params.append('name', newUser.name);
            params.append('user_code', newUser.user_code);
            params.append('email', newUser.email);
            params.append('phone_number', newUser.phone_number);
            params.append('role', newUser.role);
            params.append('skills', newUser.skills);
            
            const res = await axios.post('index.php?action=createUser', params);
            if (res.data.success) {
                setRegistrationResult(res.data.data);
                setShowRegister(false);
                setNewUser({ name: '', user_code: '', email: '', phone_number: '', role: 'technician', skills: '' });
                fetchUsers();
            }
        } catch (err) { console.error("Registration Halted"); }
    };

    const deleteUser = async () => {
        if (!confirmDelete) return;
        try {
            const params = new URLSearchParams();
            params.append('user_id', confirmDelete.id);
            await axios.post('index.php?action=deleteUser', params);
            setConfirmDelete(null);
            fetchUsers();
        } catch (err) { console.error("Purge Failed"); }
    };

    return (
        <div className="container-fluid">
            <DashboardHeader title="Personnel Registry" subtitle="Operational Asset Management Terminal" />

            <div className="d-flex justify-content-end mb-4">
                <button onClick={() => setShowRegister(true)} className="btn btn-primary px-4 py-3 rounded-pill fw-800 uppercase smallest tracking-widest shadow-22xl d-flex align-items-center">
                    <UserPlus size={18} className="me-2" /> Initialize New Personnel
                </button>
            </div>

            <div className="premium-card p-5 bg-glass border-secondary border-opacity-10 shadow-22xl">
                <div className="table-responsive">
                    <table className="table align-middle table-borderless">
                        <thead>
                            <tr className="smallest text-uppercase text-muted fw-800 tracking-widest border-bottom border-secondary border-opacity-10">
                                <th className="pb-3 text-main">Identification / Name</th>
                                <th className="pb-3 text-main">Strategic Role</th>
                                <th className="pb-3 text-main">Operational Status</th>
                                <th className="pb-3 text-end text-main">Registry Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u, i) => (
                                <tr key={u.id} className="border-bottom border-secondary border-opacity-5 hover-bg-surface-hover transition-all">
                                    <td className="py-4">
                                        <div className="fw-800 text-main mb-1">{u.name}</div>
                                        <div className="smallest text-muted fw-bold uppercase tracking-widest bg-surface px-2 py-1 rounded d-inline-block">{u.user_code}</div>
                                    </td>
                                    <td className="py-4">
                                        <span className={`smallest fw-800 uppercase tracking-widest d-flex align-items-center ${u.role === 'student' ? 'text-info' : 'text-primary'}`}>
                                            {u.role === 'student' ? <Shield size={14} className="me-2" /> : <Wrench size={14} className="me-2" />} {u.role}
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        <span className={`status-badge bg-success bg-opacity-10 text-success border border-success border-opacity-10 shadow-sm`}>{u.status}</span>
                                    </td>
                                    <td className="py-4 text-end">
                                        <div className="d-flex align-items-center justify-content-end gap-2">
                                            <button 
                                                onClick={() => handleResetPassword(u.user_code)} 
                                                className="btn btn-surface btn-sm p-3 rounded-circle text-primary border-0 shadow-sm hover-bg-primary hover-text-white transition-all"
                                                title="Strategic Key Reset"
                                            >
                                                <RefreshCcw size={16} />
                                            </button>
                                            <button 
                                                onClick={() => setConfirmDelete(u)} 
                                                className="btn btn-surface btn-sm p-3 rounded-circle text-danger border-0 shadow-sm hover-bg-danger hover-text-white transition-all"
                                                title="Purge Personnel"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <PremiumModal
                isOpen={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                onConfirm={deleteUser}
                title="Personnel Purge Protocol"
                type="danger"
                confirmText="Purge Personnel"
            >
                <p className="text-muted fw-bold uppercase smallest tracking-widest mb-3">Permanently purge this personnel asset?</p>
                <div className="p-3 rounded-4 bg-danger bg-opacity-10 border border-danger border-opacity-10 mb-2">
                    <h5 className="fw-800 mb-0 text-main">{confirmDelete?.name}</h5>
                    <p className="smallest text-muted mb-0">{confirmDelete?.user_code}</p>
                </div>
                <p className="smallest text-muted fw-bold">This will remove all strategic access for this identity. Operations may be impacted.</p>
            </PremiumModal>

            {/* Registration Modal Overlay */}
            <AnimatePresence>
                {showRegister && (
                    <div className="modal-backdrop-custom d-flex align-items-center justify-content-center p-4" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 2000, backdropFilter: 'blur(10px)' }}>
                        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="premium-card p-5 bg-glass border-secondary border-opacity-10 shadow-22xl text-main" style={{maxWidth: '600px', width: '100%'}}>
                            <div className="d-flex justify-content-between align-items-center mb-5">
                                <h4 className="fw-800 mb-0 tracking-tighter">Personnel Initialization</h4>
                                <button onClick={() => setShowRegister(false)} className="btn btn-surface btn-sm p-2 rounded-circle border-0"><X size={18} /></button>
                            </div>
                            <form onSubmit={handleRegister}>
                                <div className="row g-4">
                                    <div className="col-12">
                                        <label className="smallest fw-800 uppercase tracking-widest text-muted mb-2">Display Name</label>
                                        <input type="text" className="form-control py-3 px-4 bg-surface border-secondary border-opacity-10 rounded-4 fw-bold text-main shadow-sm" required value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="smallest fw-800 uppercase tracking-widest text-muted mb-2">Institutional ID</label>
                                        <input type="text" className="form-control py-3 px-4 bg-surface border-secondary border-opacity-10 rounded-4 fw-bold text-main shadow-sm" placeholder="DBU1601069" required value={newUser.user_code} onChange={e => setNewUser({...newUser, user_code: e.target.value})} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="smallest fw-800 uppercase tracking-widest text-muted mb-2">Strategic Phone</label>
                                        <input type="text" className="form-control py-3 px-4 bg-surface border-secondary border-opacity-10 rounded-4 fw-bold text-main shadow-sm" placeholder="+251..." required value={newUser.phone_number || ''} onChange={e => setNewUser({...newUser, phone_number: e.target.value})} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="smallest fw-800 uppercase tracking-widest text-muted mb-2">Institutional Email</label>
                                        <input type="email" className="form-control py-3 px-4 bg-surface border-secondary border-opacity-10 rounded-4 fw-bold text-main shadow-sm" placeholder="Optional" value={newUser.email || ''} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="smallest fw-800 uppercase tracking-widest text-muted mb-2">Role Priority</label>
                                        <select className="form-select py-3 px-4 bg-surface border-secondary border-opacity-10 rounded-4 fw-bold text-main shadow-sm" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                                            <option value="student">Student Investigator</option>
                                            <option value="technician">Field Engineer</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="smallest fw-800 uppercase tracking-widest text-muted mb-2">Technical Expertise</label>
                                        <select className="form-select py-3 px-4 bg-surface border-secondary border-opacity-10 rounded-4 fw-bold text-main shadow-sm" disabled={newUser.role !== 'technician'} value={newUser.skills} onChange={e => setNewUser({...newUser, skills: e.target.value})}>
                                            <option value="">N/A</option>
                                            <option value="Plumbing">Plumbing</option>
                                            <option value="Electrician">Electrician</option>
                                            <option value="ICT Technician">ICT Technician</option>
                                            <option value="HVAC / Cooling">HVAC / Cooling</option>
                                            <option value="Carpentry">Carpentry</option>
                                        </select>
                                    </div>
                                    <div className="col-12 mt-5">
                                        <button type="submit" className="btn btn-primary w-100 py-3 rounded-pill fw-800 uppercase smallest tracking-widest shadow-22xl">Commit Entry</button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <PremiumModal
                isOpen={!!registrationResult}
                onClose={() => setRegistrationResult(null)}
                title="Personnel Credentials Generated"
                type="success"
                confirmText="Securely Copied"
                onConfirm={() => setRegistrationResult(null)}
            >
                <div className="text-center py-4">
                    <div className="bg-success bg-opacity-10 p-4 rounded-circle d-inline-block mb-4 shadow-sm border border-success border-opacity-10">
                        <Key size={48} className="text-success animate-bounce" />
                    </div>
                    <h5 className="fw-800 mb-0 text-main">Activation Sequence Ready</h5>
                    <p className="smallest text-muted fw-bold uppercase tracking-widest mt-2 mb-5">Provide these credentials to the field unit.</p>
                    
                    <div className="bg-surface p-4 rounded-4 border border-secondary border-opacity-10 text-start shadow-inner">
                        <div className="mb-3">
                            <label className="smallest fw-800 uppercase tracking-widest text-muted d-block mb-1">Access Identity</label>
                            <code className="h5 fw-800 text-primary">{registrationResult?.user_code}</code>
                        </div>
                        <div>
                            <label className="smallest fw-800 uppercase tracking-widest text-muted d-block mb-1">Temporary Strategic Key</label>
                            <code className="h5 fw-800 text-success">{registrationResult?.temporary_password}</code>
                        </div>
                    </div>
                    <p className="smallest text-danger fw-bold mt-4 mb-0 animate-pulse">! DATA WILL BE PURGED FROM THIS VIEW ON CLOSURE !</p>
                </div>
            </PremiumModal>
        </div>
    );
};


const AdminDashboard = () => {
    return (
        <div className="min-vh-100 position-relative">
            <div className="app-backdrop">
                <div 
                    className="fullscreen-bg-fixed" 
                    style={{ backgroundImage: `url(${techBg})` }}
                ></div>
                <div className="bg-overlay"></div>
            </div>

            <Sidebar />
            <div className="main-content-area text-main">
                <AnimatePresence mode="wait">
                    <Routes>
                        <Route index element={<motion.div key="analytics" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><AdminOverview /></motion.div>} />
                        <Route path="requests" element={<motion.div key="requests" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><StrategicQueue /></motion.div>} />
                        <Route path="users" element={<motion.div key="users" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><PersonnelRegistry /></motion.div>} />
                    </Routes>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminDashboard;

