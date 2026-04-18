import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../../components/Sidebar';
import axios from '../../api/axios';
import { 
    Users, Trash2, Key, CheckCircle, Clock, TrendingUp, Plus, UserPlus,
    AlertCircle, Search, Bell, Settings, Download, Activity, Shield, Loader2, LogIn, RefreshCcw
} from 'lucide-react';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
    ArcElement, PointElement, LineElement, Filler
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { useAuth } from '../../context/AuthContext';

ChartJS.register(
    CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, 
    ArcElement, PointElement, LineElement, Filler
);

const DashboardHeader = ({ title, subtitle, unreadCount }) => {
    const { logout } = useAuth();

    return (
        <div className="d-flex justify-content-between align-items-center mb-5 mt-1">
            <div>
                <h2 className="fw-bold tracking-tighter mb-1 text-main">{title}</h2>
                <p className="text-muted small mb-0 fw-medium">{subtitle}</p>
            </div>
            <div className="d-flex align-items-center gap-4">
                <div className="position-relative">
                    <motion.div 
                        whileHover={{ scale: 1.1 }}
                        className="bg-surface border-secondary border-opacity-10 p-2 rounded-circle text-muted shadow-sm cursor-pointer d-flex align-items-center justify-content-center"
                        style={{ width: '42px', height: '42px' }}
                    >
                        <Bell size={20} />
                    </motion.div>
                    {unreadCount > 0 && (
                        <span 
                            className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger border border-white" 
                            style={{ 
                                width: '20px', 
                                height: '20px', 
                                padding: '0', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                fontSize: '10px',
                                marginTop: '5px',
                                marginLeft: '-5px',
                                boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)'
                            }}
                        >
                            {unreadCount}
                        </span>
                    )}
                </div>
                <div className="d-flex gap-2">
                    <motion.button 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }}
                        onClick={logout}
                        className="btn btn-danger btn-sm px-4 rounded-pill fw-bold smaller shadow-sm border-0 d-flex align-items-center bg-danger bg-opacity-75"
                    >
                        <LogIn size={14} className="me-2" style={{ transform: 'rotate(180deg)' }} /> EXIT
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

const AdminAnalytics = () => {
    const [requests, setRequests] = useState([]);
    const [usersCount, setUsersCount] = useState(0);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const { isDarkMode } = useAuth();

    const fetchData = async () => {
        try {
            const [reqRes, usersRes, unreadRes] = await Promise.all([
                axios.get('index.php?action=getAllRequests'),
                axios.get('index.php?action=getAllUsers'),
                axios.get('index.php?action=getNotificationCounts')
            ]);
            
            if (reqRes.data.success) setRequests(reqRes.data.data);
            if (usersRes.data.success) setUsersCount(usersRes.data.data.length);
            if (unreadRes.data.success) setUnreadCount(unreadRes.data.data.unread);
        } catch (err) { 
            console.error("Operational Intelligence Fetch Failed:", err);
        }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const stats = useMemo(() => {
        const pending = requests.filter(r => r.status === 'Pending').length;
        const active = requests.filter(r => r.status === 'Assigned' || r.status === 'In Progress').length;
        const completed = requests.filter(r => r.status === 'Completed').length;
        const pulse = requests.length > 0 ? (completed / requests.length) * 100 : 0;
        
        return { pending, active, completed, pulse };
    }, [requests]);

    const velocityData = useMemo(() => {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0];
        });

        const counts = last7Days.map(date => {
            return requests.filter(r => r.created_at.startsWith(date)).length;
        });

        return {
            labels: last7Days.map(d => new Date(d).toLocaleDateString('en-US', { weekday: 'short' })),
            datasets: [{
                label: 'Stress Velocity',
                data: counts,
                fill: true,
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderColor: '#3b82f6',
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#3b82f6',
            }]
        };
    }, [requests]);

    if (loading) return <div className="p-5 text-center"><div className="spinner-border text-primary"></div></div>;

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false }, ticks: { color: isDarkMode ? '#a1a1aa' : '#71717a' } },
            y: { grid: { color: isDarkMode ? 'rgba(161, 161, 170, 0.1)' : 'rgba(113, 113, 122, 0.1)' }, min: 0, ticks: { stepSize: 1, color: isDarkMode ? '#a1a1aa' : '#71717a' } }
        }
    };

    return (
        <div className="container-fluid text-main">
            <DashboardHeader 
                title="Operational Awareness" 
                subtitle="System-wide infrastructure pulse and member logistics." 
                unreadCount={unreadCount}
            />
            
            <div className="row g-4 mb-5">
                {[
                    { label: 'Authorized Personell', count: usersCount, color: 'primary', icon: <Users />, note: 'All Roles' },
                    { label: 'Unassigned Dispatch', count: stats.pending, color: 'danger', icon: <Clock />, note: 'Urgent Action' },
                    { label: 'Units in Deployment', count: stats.active, color: 'warning', icon: <Activity />, note: 'On-site Repair' },
                    { label: 'Logistics Shield', count: 'Active', color: 'success', icon: <Shield />, note: 'System Integrity' }
                ].map((s, i) => (
                    <div key={i} className="col-md-3">
                        <div className="premium-card p-4 shadow-sm border-secondary border-opacity-10 h-100">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className={`bg-primary bg-opacity-10 p-2 rounded-2 text-${s.color}`}>{s.icon}</div>
                                <span className="smaller text-muted fw-bold">{s.note}</span>
                            </div>
                            <h2 className="fw-bold mb-0 text-main tracking-tighter">{s.count}</h2>
                            <p className="text-muted smaller fw-bold text-uppercase mb-0">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="premium-card p-4 p-lg-5 h-100 shadow-sm border-secondary border-opacity-10">
                        <h6 className="fw-bold mb-5 text-main d-flex align-items-center">
                            <TrendingUp className="me-3 text-primary opacity-50" size={18} /> Infrastructure Stress Velocity (7-Day Trend)
                        </h6>
                        <div style={{ height: '320px' }}>
                            <Line data={velocityData} options={barOptions} />
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="premium-card p-4 p-lg-5 h-100 shadow-sm border-secondary border-opacity-10 bg-surface-hover bg-opacity-30">
                        <h6 className="fw-bold mb-4 text-main">Engineering Pulse</h6>
                        <div className="mb-5">
                            <h1 className="fw-bold mb-0 text-main tracking-tighter">{stats.pulse.toFixed(1)}%</h1>
                            <p className={`${stats.pulse > 50 ? 'text-success' : 'text-danger'} smaller fw-bold mb-0`}>
                                {stats.pulse > 50 ? 'Above Baseline' : 'Requires Optimization'}
                            </p>
                        </div>
                        <div className="d-flex flex-column gap-4">
                            {[
                                { label: 'Resolution Rate', val: `${stats.pulse.toFixed(0)}%`, color: 'success' },
                                { label: 'Deployment Load', val: `${requests.length > 0 ? (stats.active / requests.length * 100).toFixed(0) : 0}%`, color: 'primary' },
                                { label: 'Queue Pressure', val: `${requests.length > 0 ? (stats.pending / requests.length * 100).toFixed(0) : 0}%`, color: 'danger' }
                            ].map((p, i) => (
                                <div key={i}>
                                    <div className="d-flex justify-content-between mb-2 smaller fw-bold text-muted uppercase">
                                        <span>{p.label}</span>
                                        <span className="text-main">{p.val}</span>
                                    </div>
                                    <div className="progress bg-background" style={{ height: '4px' }}>
                                        <div className={`progress-bar bg-${p.color}`} style={{ width: p.val }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [successModal, setSuccessModal] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', role: 'student', user_code: '', skills: '' });
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');
    const [showList, setShowList] = useState(false);
    const [resetCode, setResetCode] = useState('');
    const [resetting, setResetting] = useState(false);

    const fetchData = async () => {
        try {
            const res = await axios.get('index.php?action=getAllUsers');
            if (res.data.success) setUsers(res.data.data);
        } catch (err) { 
            console.error("Member Intelligence Fetch Failed:", err);
            setError("Tactical sync failed.");
        }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreating(true);
        setError('');
        try {
            const res = await axios.post('index.php?action=createUser', formData);
            if (res.data.success) {
                setModal(false);
                setSuccessModal(res.data.data);
                setFormData({ name: '', email: '', role: 'student', user_code: '', skills: '' });
                fetchData();
            } else {
                setError(res.data.message || "Failed to provision member.");
            }
        } catch (err) { 
            setError(err.response?.data?.message || "Operational outage.");
        }
        finally { setCreating(false); }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!resetCode) return;
        setResetting(true);
        setError('');
        try {
            const res = await axios.post('index.php?action=resetUserPassword', { user_code: resetCode });
            if (res.data.success) {
                setSuccessModal(res.data.data);
                setResetCode('');
            } else {
                setError(res.data.message || "Reset failed.");
            }
        } catch (err) {
            setError("Reset protocol interrupted.");
        } finally {
            setResetting(false);
        }
    };

    if (loading) return <div className="p-5 text-center"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="container-fluid text-main">
            <div className="d-flex justify-content-between align-items-center mb-5 mt-1">
                <div>
                    <h2 className="fw-bold tracking-tighter mb-1 text-main">Member Intelligence</h2>
                    <p className="text-muted small mb-0 fw-medium">Administer security and personnel across the maintenance unit.</p>
                </div>
                <div className="d-flex gap-3">
                    <button 
                        className={`btn ${showList ? 'btn-surface' : 'btn-outline-primary'} rounded-3 px-4 py-2 shadow-sm fw-bold smaller border-secondary border-opacity-10`} 
                        onClick={() => setShowList(!showList)}
                    >
                        {showList ? 'Hide Registry' : <><Users size={16} className="me-2"/> View Registry</>}
                    </button>
                    <button 
                        className="btn btn-primary d-flex align-items-center rounded-3 px-4 py-2 shadow-sm fw-bold smaller" 
                        onClick={() => setModal(true)}
                    >
                        <UserPlus size={18} className="me-2" /> Provision Member
                    </button>
                </div>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-lg-12">
                   <div className="premium-card p-4 p-lg-5 shadow-sm border-secondary border-opacity-10 bg-surface bg-opacity-50">
                        <h6 className="fw-bold mb-4 text-main d-flex align-items-center">
                            <Key size={18} className="me-3 text-primary opacity-50" /> Strategic Password Reset
                        </h6>
                        <form onSubmit={handleResetPassword} className="row g-3 align-items-end">
                            <div className="col-md-9">
                                <label className="form-label smaller fw-bold text-muted mb-2">TARGET USER CODE (STUDENT ID / TECH ID)</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Enter user code to generate new temporary credentials..." 
                                    value={resetCode}
                                    onChange={e => setResetCode(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-md-3">
                                <button className="btn btn-primary w-100 py-3 fw-bold shadow-sm" disabled={resetting}>
                                    {resetting ? <Loader2 size={16} className="animate-spin me-2" /> : <RefreshCcw size={16} className="me-2" />}
                                    Reset Credentials
                                </button>
                            </div>
                        </form>
                   </div>
                </div>
            </div>

            {showList && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="premium-card p-4 p-lg-5 shadow-sm border-secondary border-opacity-10">
                    <div className="table-responsive">
                        <table className="table align-middle">
                            <thead>
                                <tr className="smaller text-uppercase text-muted fw-bold">
                                    <th>Account Code</th>
                                    <th>Access Tier</th>
                                    <th>Identity</th>
                                    <th>Network State</th>
                                    <th className="text-end">Manage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td className="py-3 fw-bold text-primary smaller">{u.user_code}</td>
                                        <td className="py-3"><span className="badge bg-surface border border-secondary border-opacity-10 text-muted px-3 py-2 rounded-3 text-capitalize smaller fw-bold">{u.role}</span></td>
                                        <td className="py-3">
                                            <div className="fw-bold text-main small">{u.name}</div>
                                            <div className="smaller text-muted opacity-50">{u.email}</div>
                                        </td>
                                        <td className="py-3">
                                            <span className={`smaller fw-bold ${u.status === 'active' ? 'text-success' : 'text-danger'}`}>
                                                {u.status === 'active' ? 'Verified Active' : 'Suspended'}
                                            </span>
                                        </td>
                                        <td className="py-3 text-end">
                                            <button className="btn btn-sm btn-surface border-0 p-2 text-muted shadow-none" onClick={() => setResetCode(u.user_code)}><Key size={18} /></button>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && <tr><td colSpan="5" className="text-center py-5 text-muted">Registry Empty.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}

            <AnimatePresence>
                {modal && (
                    <div className="modal-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3" style={{ zIndex: 1200, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="premium-card p-4 p-lg-5 w-100 bg-surface shadow-22xl" style={{ maxWidth: '500px' }}>
                            <h4 className="fw-bold text-center text-main tracking-tighter mb-4">Provision New Identity</h4>
                            
                            <AnimatePresence>
                                {error && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="alert alert-danger smaller fw-bold mb-4 p-3 rounded-4 d-flex align-items-center border-0 bg-danger bg-opacity-10 text-danger">
                                        <AlertCircle size={16} className="me-2" /> {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={handleCreate}>
                                <div className="mb-4">
                                    <label className="form-label smaller fw-bold text-muted mb-2">FULL LEGAL NAME</label>
                                    <input type="text" className="form-control text-main" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required autoComplete="off" />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label smaller fw-bold text-muted mb-2">AUTH CODE (STUDENT ID/TECH ID)</label>
                                    <input type="text" className="form-control text-main" placeholder="DBU1601069" value={formData.user_code} onChange={e => setFormData({...formData, user_code: e.target.value})} required autoComplete="off" />
                                </div>
                                <div className="row g-4 mb-5">
                                    <div className="col-md-6">
                                        <label className="form-label smaller fw-bold text-muted mb-2">IDENTIFICATION EMAIL</label>
                                        <input type="email" className="form-control text-main" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required autoComplete="off" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label smaller fw-bold text-muted mb-2">AUTHORITY LEVEL</label>
                                        <select className="form-select text-main" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                                            <option value="student">Student</option>
                                            <option value="technician">Field Technician</option>
                                        </select>
                                    </div>
                                    {formData.role === 'technician' && (
                                        <div className="col-12 mt-4">
                                            <label className="form-label smaller fw-bold text-muted mb-2 uppercase">Technical Specialization</label>
                                            <select className="form-select text-main border-primary border-opacity-25" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} required>
                                                <option value="">Select Primary Skill</option>
                                                <option value="Plumbing">Plumbing Specialist</option>
                                                <option value="Electrical">Electrical Engineer</option>
                                                <option value="Carpentry">Carpentry & Structural</option>
                                                <option value="Masonry">Masonry & Grounds</option>
                                                <option value="ICT">ICT & Network Infrastructure</option>
                                            </select>
                                        </div>
                                    )}
                                </div>
                                <div className="d-flex gap-3">
                                    <button type="button" className="btn btn-surface border-secondary border-opacity-10 w-100 py-3 rounded-3 fw-bold text-main" onClick={() => setModal(false)}>Cancel Action</button>
                                    <button type="submit" className="btn btn-primary w-100 py-3 rounded-3 fw-bold shadow-lg" disabled={creating}>
                                        {creating ? <Loader2 size={16} className="animate-spin text-white" /> : 'Confirm Provisioning'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {successModal && (
                    <div className="modal-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3" style={{ zIndex: 1300, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(15px)' }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="premium-card p-5 w-100 bg-surface shadow-22xl text-center" style={{ maxWidth: '450px' }}>
                            <div className="bg-success bg-opacity-10 p-4 rounded-circle d-inline-block text-success mb-4">
                                <Shield size={48} />
                            </div>
                            <h3 className="fw-bold text-main mb-2 tracking-tighter">{successModal.temporary_password ? 'Identity Provisioned' : 'Credentials Reset'}</h3>
                            <p className="text-muted smaller mb-5 fw-medium">The following temporary access key has been generated. Please communicate it securely to the member.</p>
                            
                            <div className="bg-background p-4 rounded-4 border border-secondary border-opacity-10 mb-5">
                                <label className="smallest fw-bold text-muted uppercase tracking-widest mb-2 d-block">Temporary Access Key</label>
                                <h2 className="fw-bold text-primary tracking-widest mb-0">{successModal.temporary_password || successModal.new_password}</h2>
                            </div>

                            <button className="btn btn-primary w-100 py-3 rounded-pill fw-bold" onClick={() => setSuccessModal(null)}>Clear Protocol</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const AdminRequests = () => {
    const [requests, setRequests] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [assignModal, setAssignModal] = useState(null);
    const [assigning, setAssigning] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('active');

    const fetchData = async () => {
        try {
            const [reqRes, techRes] = await Promise.all([
                axios.get('index.php?action=getAllRequests'),
                axios.get('index.php?action=getTechnicians')
            ]);
            if (reqRes.data.success) {
                setRequests(reqRes.data.data);
                // Mark as seen on request list load
                await axios.post('index.php?action=markNotificationsRead');
            }
            if (techRes.data.success) setTechnicians(techRes.data.data);
        } catch (err) { setError("Dispatch registry sync failed."); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleDeleteRequest = async (id) => {
        if (!window.confirm("Commence Tactical Purge? This will permanently erase the report from the registry.")) return;
        setDeleting(id);
        try {
            const res = await axios.post('index.php?action=deleteRequest', { id });
            if (res.data.success) {
                fetchData();
            } else {
                setError(res.data.message || "Purge protocol failed.");
            }
        } catch (err) {
            setError("Purge outage.");
        } finally {
            setDeleting(false);
        }
    };

    const handleAssign = async (techId) => {
        setAssigning(techId);
        setError('');
        try {
            const res = await axios.post('index.php?action=assignTechnician', {
                request_id: assignModal.id,
                technician_id: techId
            });
            if (res.data.success) {
                setAssignModal(null);
                fetchData();
            } else {
                setError(res.data.message || "Technician assignment failed.");
            }
        } catch (err) { 
            setError("Strategic assignment outage.");
        }
        finally { setAssigning(false); }
    };

    const activeRequests = requests.filter(r => r.status === 'Pending');
    const historyRequests = requests.filter(r => r.status !== 'Pending');

    if (loading) return <div className="p-5 text-center"><Loader2 className="animate-spin text-primary mx-auto" size={40} /></div>;

    return (
        <div className="container-fluid text-main">
            <DashboardHeader title="Strategic Dispatch" subtitle="Real-time infrastructure fault reporting and tactical dispatch." />
            
            <div className="premium-card p-4 p-lg-5 shadow-sm border-secondary border-opacity-10">
                <div className="d-flex justify-content-between align-items-center mb-5 border-bottom border-secondary border-opacity-10 pb-3">
                    <div className="d-flex gap-4">
                        <button 
                            className={`btn btn-link p-0 text-decoration-none fw-bold smaller transition-all ${activeTab === 'active' ? 'text-primary' : 'text-muted'}`}
                            onClick={() => setActiveTab('active')}
                        >
                             ACTIVE QUEUE ({activeRequests.length})
                        </button>
                        <button 
                            className={`btn btn-link p-0 text-decoration-none fw-bold smaller transition-all ${activeTab === 'history' ? 'text-primary' : 'text-muted'}`}
                            onClick={() => setActiveTab('history')}
                        >
                            DEPLOIMENT HISTORY ({historyRequests.length})
                        </button>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table align-middle">
                        <thead>
                            <tr className="smaller text-uppercase text-muted fw-bold">
                                <th>Report Detail</th>
                                <th>Location & Priority</th>
                                <th>Fleet Status</th>
                                <th className="text-end">Command</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(activeTab === 'active' ? activeRequests : historyRequests).map(r => (
                                <tr key={r.id}>
                                    <td className="py-3">
                                        <div className="fw-bold text-main small">{r.title}</div>
                                        <div className="smallest text-muted opacity-70 mb-1">{r.student_name}</div>
                                        <div className="smallest text-muted text-truncate" style={{ maxWidth: '200px' }}>{r.description}</div>
                                    </td>
                                    <td className="py-3">
                                        <div className="d-flex align-items-center mb-1">
                                            <Search size={12} className="text-primary me-2" />
                                            <span className="smaller fw-bold text-main">{r.location}</span>
                                        </div>
                                        <span className={`badge bg-${r.priority === 'High' || r.priority === 'Emergency' || r.priority === 'Critical' ? 'danger' : r.priority === 'Medium' ? 'warning' : 'info'} bg-opacity-10 text-${r.priority === 'High' || r.priority === 'Emergency' || r.priority === 'Critical' ? 'danger' : r.priority === 'Medium' ? 'warning' : 'info'} smallest px-2 py-1`}>{r.priority}</span>
                                    </td>
                                    <td className="py-3">
                                        <span className={`badge rounded-pill px-3 py-2 smaller fw-bold mb-1 d-inline-block ${r.status === 'Pending' ? 'bg-danger bg-opacity-10 text-danger' : r.status === 'Assigned' ? 'bg-primary bg-opacity-10 text-primary' : 'bg-success bg-opacity-10 text-success'}`}>
                                            {r.status.toUpperCase()}
                                        </span>
                                        {r.technician_name && <div className="smallest text-muted fw-bold opacity-50 uppercase tracking-widest ps-1">{r.technician_name}</div>}
                                    </td>
                                    <td className="py-3 text-end d-flex gap-2 justify-content-end">
                                        {r.status === 'Pending' && (
                                            <button className="btn btn-primary btn-sm px-3 rounded-pill fw-bold smaller d-flex align-items-center shadow-sm" onClick={() => setAssignModal(r)}>
                                                <Activity size={12} className="me-2" /> Assign Tech
                                            </button>
                                        )}
                                        {r.status === 'Completed' && (
                                            <button 
                                                className="btn btn-outline-danger btn-sm p-2 rounded-circle border-0 bg-danger bg-opacity-10 text-danger shadow-none"
                                                title="Permanent Purge"
                                                onClick={() => handleDeleteRequest(r.id)}
                                                disabled={deleting === r.id}
                                            >
                                                {deleting === r.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {(activeTab === 'active' ? activeRequests : historyRequests).length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center py-5 text-muted small">
                                        Registry section empty. System at rest.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {assignModal && (
                    <div className="modal-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3" style={{ zIndex: 1200, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="premium-card p-4 p-lg-5 w-100 bg-surface shadow-22xl" style={{ maxWidth: '500px' }}>
                            <h4 className="fw-bold text-center text-main tracking-tighter mb-2">Tactical Dispatch</h4>
                            <p className="smaller text-muted text-center mb-4">Select a field engineer for <strong>{assignModal.title}</strong> at <strong>{assignModal.location}</strong>.</p>
                            
                            {error && (
                                <div className="alert alert-danger smaller fw-bold mb-4 p-3 rounded-4 border-0 bg-danger bg-opacity-10 text-danger">
                                    <AlertCircle size={16} className="me-2" /> {error}
                                </div>
                            )}

                            <div className="d-flex flex-column gap-3 mb-5">
                                {technicians.map(t => (
                                    <button 
                                        key={t.id} 
                                        className="btn btn-surface border-secondary border-opacity-10 text-start p-3 rounded-4 d-flex align-items-center justify-content-between hover-primary transition-all text-main shadow-sm"
                                        onClick={() => handleAssign(t.id)}
                                        disabled={assigning}
                                    >
                                        <div className="d-flex align-items-center">
                                            <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3"><Users size={16} className="text-primary" /></div>
                                            <div>
                                                <div className="fw-bold small">{t.name}</div>
                                                {t.skills && <div className="smallest text-primary fw-bold text-uppercase opacity-75">{t.skills} Engineers</div>}
                                            </div>
                                        </div>
                                        {assigning === t.id ? <Loader2 size={16} className="animate-spin text-primary" /> : <Plus size={16} className="text-muted" />}
                                    </button>
                                ))}
                            </div>

                            <button className="btn btn-surface border-0 w-100 py-3 text-muted fw-bold smaller" onClick={() => setAssignModal(null)}>Cancel Deployment</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const AdminDashboard = () => {
    const { isDarkMode } = useAuth();
    
    return (
        <div className={`min-vh-100 ${isDarkMode ? 'bg-background' : 'bg-light'}`}>
            <Sidebar />
            <div className="main-content-area" style={{ marginLeft: '280px', padding: '40px' }}>
                <AnimatePresence mode="wait">
                    <Routes>
                        <Route index element={<motion.div key="analytics" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><AdminAnalytics /></motion.div>} />
                        <Route path="users" element={<motion.div key="users" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><UserManagement /></motion.div>} />
                        <Route path="requests" element={<motion.div key="requests" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><AdminRequests /></motion.div>} />
                    </Routes>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminDashboard;
