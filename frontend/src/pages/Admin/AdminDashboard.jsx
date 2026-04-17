import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../../components/Sidebar';
import axios from '../../api/axios';
import { 
    Users, Trash2, Key, CheckCircle, Clock, TrendingUp, Plus, UserPlus,
    AlertCircle, Search, Bell, Settings, Download, Activity, Shield, Loader2
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

const DashboardHeader = ({ title, subtitle }) => (
    <div className="d-flex justify-content-between align-items-center mb-5 mt-1">
        <div>
            <h2 className="fw-bold tracking-tighter mb-1 text-main">{title}</h2>
            <p className="text-muted small mb-0 fw-medium">{subtitle}</p>
        </div>
        <div className="d-flex gap-2">
            <button className="btn btn-surface border-secondary border-opacity-10 p-2 px-3 rounded-pill text-muted d-flex align-items-center smaller shadow-sm">
                <Download size={14} className="me-2" /> Export Protocol
            </button>
            <motion.button whileHover={{ scale: 1.1 }} className="btn btn-surface border-secondary border-opacity-10 p-2 rounded-3 text-muted shadow-sm">
                <Bell size={18} />
            </motion.button>
        </div>
    </div>
);

const AdminAnalytics = () => {
    const [stats, setStats] = useState({ users: 0, pending: 0, active: 0, completed: 0 });
    const [loading, setLoading] = useState(true);
    const { isDarkMode } = useAuth();

    const fetchData = async () => {
        try {
            const usersRes = await axios.get('index.php?action=getAllUsers');
            const reqRes = await axios.get('index.php?action=getAllRequests');
            if (usersRes.data.success && reqRes.data.success) {
                const reqs = reqRes.data.data;
                setStats({
                    users: usersRes.data.data.length,
                    pending: reqs.filter(r => r.status === 'Pending').length,
                    active: reqs.filter(r => r.status === 'Assigned' || r.status === 'In Progress').length,
                    completed: reqs.filter(r => r.status === 'Completed').length
                });
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const lineData = {
        labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
        datasets: [{
            label: 'Incident Flow',
            data: [12, 19, 15, 25, 22, 10, 8],
            fill: true,
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderColor: '#3b82f6',
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#3b82f6',
        }]
    };

    if (loading) return <div className="p-5 text-center"><div className="spinner-border text-primary"></div></div>;

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false }, ticks: { color: isDarkMode ? '#a1a1aa' : '#71717a' } },
            y: { grid: { color: isDarkMode ? 'rgba(161, 161, 170, 0.1)' : 'rgba(113, 113, 122, 0.1)' }, ticks: { color: isDarkMode ? '#a1a1aa' : '#71717a' } }
        }
    };

    return (
        <div className="container-fluid">
            <DashboardHeader title="Operational Awareness" subtitle="System-wide infrastructure pulse and member logistics." />
            
            <div className="row g-4 mb-5">
                {[
                    { label: 'Authorized Personell', count: stats.users, color: 'primary', icon: <Users />, note: 'All Roles' },
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
                            <TrendingUp className="me-3 text-primary opacity-50" size={18} /> Infrastructure Stress Velocity
                        </h6>
                        <div style={{ height: '320px' }}>
                            <Line data={lineData} options={barOptions} />
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="premium-card p-4 p-lg-5 h-100 shadow-sm border-secondary border-opacity-10 bg-surface-hover bg-opacity-30">
                        <h6 className="fw-bold mb-4 text-main">Engineering Pulse</h6>
                        <div className="mb-5">
                            <h1 className="fw-bold mb-0 text-main tracking-tighter">89.4%</h1>
                            <p className="text-success smaller fw-bold mb-0">+2.1% Higher than average</p>
                        </div>
                        <div className="d-flex flex-column gap-4">
                            {[
                                { label: 'Tech Deployment', val: '72%', color: 'primary' },
                                { label: 'Precision Accuracy', val: '94%', color: 'success' },
                                { label: 'Stock Integrity', val: '58%', color: 'warning' }
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
    const [formData, setFormData] = useState({ name: '', email: '', role: 'student', user_code: '' });
    const [creating, setCreating] = useState(false);

    const fetchData = async () => {
        try {
            const res = await axios.get('index.php?action=getAllUsers');
            if (res.data.success) setUsers(res.data.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            const data = new URLSearchParams();
            Object.keys(formData).forEach(k => data.append(k, formData[k]));
            const res = await axios.post('index.php?action=createUser', data);
            if (res.data.success) {
                setModal(false);
                setFormData({ name: '', email: '', role: 'student', user_code: '' });
                fetchData();
            }
        } catch (err) { console.error(err); }
        finally { setCreating(false); }
    };

    if (loading) return <div className="p-5 text-center"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-5 mt-1">
                <div>
                    <h2 className="fw-bold tracking-tighter mb-1 text-main">Member Intelligence</h2>
                    <p className="text-muted small mb-0 fw-medium">Administer and provision authority across the maintenance unit.</p>
                </div>
                <button 
                    className="btn btn-primary d-flex align-items-center rounded-3 px-4 py-2 shadow-sm fw-bold smaller" 
                    onClick={() => setModal(true)}
                >
                    <UserPlus size={18} className="me-2" /> Provision Member
                </button>
            </div>

            <div className="premium-card p-4 p-lg-5 shadow-sm border-secondary border-opacity-10">
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
                                    <td className="py-3"><span className="smaller fw-bold text-success">Verified Active</span></td>
                                    <td className="py-3 text-end">
                                        <button className="btn btn-sm btn-surface border-0 p-2 text-muted shadow-none"><Key size={18} /></button>
                                        <button className="btn btn-sm btn-surface border-0 p-2 text-danger opacity-50 shadow-none"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {modal && (
                    <div className="modal-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3" style={{ zIndex: 1200, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="premium-card p-4 p-lg-5 w-100 bg-surface shadow-22xl" style={{ maxWidth: '500px' }}>
                            <h4 className="fw-bold text-center text-main tracking-tighter mb-5">Provision New Identity</h4>
                            <form onSubmit={handleCreate}>
                                <div className="mb-4">
                                    <label className="form-label smaller fw-bold text-muted mb-2">FULL LEGAL NAME</label>
                                    <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label smaller fw-bold text-muted mb-2">AUTH CODE (STUDENT ID/TECH ID)</label>
                                    <input type="text" className="form-control" placeholder="DBU1601069" value={formData.user_code} onChange={e => setFormData({...formData, user_code: e.target.value})} required />
                                </div>
                                <div className="row g-4 mb-5">
                                    <div className="col-md-6">
                                        <label className="form-label smaller fw-bold text-muted mb-2">IDENTIFICATION EMAIL</label>
                                        <input type="email" className="form-control" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label smaller fw-bold text-muted mb-2">AUTHORITY LEVEL</label>
                                        <select className="form-select" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                                            <option value="student">Student</option>
                                            <option value="technician">Field Technician</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="d-flex gap-3">
                                    <button type="button" className="btn btn-surface border-secondary border-opacity-10 w-100 py-3 rounded-3 fw-bold" onClick={() => setModal(false)}>Cancel Action</button>
                                    <button type="submit" className="btn btn-primary w-100 py-3 rounded-3 fw-bold shadow-lg" disabled={creating}>
                                        {creating ? <Loader2 size={24} className="animate-spin" /> : 'Confirm Provisioning'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const AdminDashboard = () => {
    return (
        <div className="bg-background min-vh-100">
            <Sidebar />
            <div className="main-content-area">
                <AnimatePresence mode="wait">
                    <Routes>
                        <Route index element={<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><AdminAnalytics /></motion.div>} />
                        <Route path="users" element={<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><UserManagement /></motion.div>} />
                    </Routes>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminDashboard;
