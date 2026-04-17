import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../../components/Sidebar';
import axios from '../../api/axios';
import { 
    Users, 
    Trash2, 
    Key,
    CheckCircle,
    Clock,
    TrendingUp,
    Plus,
    UserPlus,
    AlertCircle,
    Search,
    Bell,
    Settings,
    Download,
    Filter,
    ArrowUpRight,
    Loader2,
    Activity,
    Shield
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    Filler
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title, 
    Tooltip, 
    Legend, 
    ArcElement,
    PointElement,
    LineElement,
    Filler
);

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

const DashboardHeader = ({ title, subtitle }) => (
    <div className="d-flex justify-content-between align-items-center mb-5 mt-1">
        <div>
            <h2 className="fw-bold tracking-tighter mb-1 text-white">{title}</h2>
            <p className="text-muted small mb-0 fw-medium">{subtitle}</p>
        </div>
        <div className="d-flex gap-2">
            <button className="btn btn-surface border-secondary border-opacity-10 p-2 px-3 rounded-pill text-muted d-flex align-items-center smaller">
                <Download size={14} className="me-2" /> Export Logs
            </button>
            <motion.button whileHover={{ scale: 1.1 }} className="btn btn-surface border-secondary border-opacity-10 p-2 rounded-3 text-muted">
                <Bell size={18} />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} className="btn btn-surface border-secondary border-opacity-10 p-2 rounded-3 text-muted">
                <Settings size={18} />
            </motion.button>
        </div>
    </div>
);

const AdminAnalytics = () => {
    const [stats, setStats] = useState({ users: 0, pending: 0, active: 0, completed: 0 });
    const [loading, setLoading] = useState(true);

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
        labels: ['01 AM', '04 AM', '08 AM', '12 PM', '04 PM', '08 PM', '11 PM'],
        datasets: [{
            label: 'Incident Flow',
            data: [2, 1, 8, 15, 22, 14, 5],
            fill: true,
            backgroundColor: 'rgba(59, 130, 246, 0.05)',
            borderColor: '#3b82f6',
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#3b82f6',
        }]
    };

    if (loading) return <div className="p-5 text-center"><div className="spinner-border text-primary border-0 bg-primary bg-opacity-10"></div></div>;

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="container-fluid py-4 h-100">
            <DashboardHeader title="Operations Intelligence" subtitle="Real-time campus-wide infrastructure health metrics." />
            
            <div className="row g-4 mb-5">
                {[
                    { label: 'Platform Users', count: stats.users, color: 'primary', icon: <Users />, trend: 'Healthy' },
                    { label: 'Unassigned Queue', count: stats.pending, color: 'danger', icon: <Clock />, trend: 'Requires Action' },
                    { label: 'Active Repairs', count: stats.active, color: 'warning', icon: <Activity />, trend: 'Stable' },
                    { label: 'Service Level', count: '94%', color: 'success', icon: <Shield />, trend: '+2% Today' }
                ].map((s, i) => (
                    <motion.div key={i} variants={itemVariants} className="col-md-3">
                        <div className="premium-card p-4 border-secondary border-opacity-10 h-100 shadow-sm">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className={`text-${s.color} opacity-80 bg-background p-2 rounded-2 border border-secondary border-opacity-10`}>{s.icon}</div>
                                <span className={`smaller fw-bold text-${s.color} bg-${s.color} bg-opacity-10 px-2 py-1 rounded-pill`} style={{ fontSize: '0.65rem' }}>{s.trend}</span>
                            </div>
                            <h2 className="fw-bold mb-0 text-white tracking-tighter">{s.count}</h2>
                            <p className="text-muted smaller fw-bold text-uppercase mb-0">{s.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="row g-4">
                <motion.div variants={itemVariants} className="col-lg-8">
                    <div className="premium-card p-4 p-lg-5 h-100 border-secondary border-opacity-10 bg-surface bg-opacity-30">
                        <div className="d-flex justify-content-between align-items-center mb-5">
                            <h6 className="fw-bold m-0 d-flex align-items-center text-white">
                                <TrendingUp className="me-3 text-primary opacity-50" size={18} /> Network Incident Velocity
                            </h6>
                            <div className="d-flex gap-2">
                                <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-20 px-3 py-2 rounded-pill smaller fw-bold">Live Data</span>
                            </div>
                        </div>
                        <div style={{ height: '320px' }}>
                            <Line 
                                data={lineData} 
                                options={{ 
                                    maintainAspectRatio: false,
                                    scales: { 
                                        y: { grid: { color: 'rgba(161, 161, 170, 0.05)', drawBorder: false }, ticks: { color: '#71717a', font: { size: 10 } } },
                                        x: { grid: { display: false }, ticks: { color: '#71717a', font: { size: 10 } } }
                                    },
                                    plugins: { legend: { display: false } }
                                }} 
                            />
                        </div>
                    </div>
                </motion.div>
                <motion.div variants={itemVariants} className="col-lg-4">
                    <div className="premium-card p-4 p-lg-5 h-100 border-secondary border-opacity-10 bg-surface bg-opacity-30">
                        <h6 className="fw-bold mb-4 text-white">Workforce Utilization</h6>
                        <div className="mb-5 d-flex align-items-end gap-2">
                            <h1 className="fw-bold mb-0 text-white tracking-tighter">88.2%</h1>
                            <p className="text-success smaller fw-bold mb-1">+4.2%</p>
                        </div>
                        <div className="d-flex flex-column gap-4">
                            {[
                                { label: 'Tech Availability', val: '76%', color: 'primary' },
                                { label: 'Resolution Accuracy', val: '92%', color: 'success' },
                                { label: 'Stock Levels', val: '45%', color: 'warning' }
                            ].map((p, i) => (
                                <div key={i}>
                                    <div className="d-flex justify-content-between mb-2 smaller fw-bold text-muted">
                                        <span>{p.label}</span>
                                        <span className="text-white">{p.val}</span>
                                    </div>
                                    <div className="progress bg-background border border-secondary border-opacity-10" style={{ height: '4px' }}>
                                        <motion.div initial={{ width: 0 }} whileInView={{ width: p.val }} className={`progress-bar bg-${p.color}`}></motion.div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-5 p-3 rounded-3 bg-background border border-secondary border-opacity-10 text-center">
                            <p className="smaller text-muted mb-0 fw-medium italic">Peak usage detected at 11:45 AM local time.</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

const RequestManagement = () => {
    const [requests, setRequests] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState(false);
    const [selectedReq, setSelectedReq] = useState(null);
    const [selectedTech, setSelectedTech] = useState('');

    const fetchData = async () => {
        try {
            const reqRes = await axios.get('index.php?action=getAllRequests');
            const techRes = await axios.get('index.php?action=getTechnicians');
            if (reqRes.data.success) setRequests(reqRes.data.data);
            if (techRes.data.success) setTechnicians(techRes.data.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleAssign = async () => {
        if (!selectedTech) return;
        setAssigning(true);
        try {
            const data = new URLSearchParams();
            data.append('request_id', selectedReq.id);
            data.append('technician_id', selectedTech);
            const res = await axios.post('index.php?action=assignTechnician', data);
            if (res.data.success) {
                setSelectedReq(null);
                fetchData();
            }
        } catch (err) { console.error(err); }
        finally { setAssigning(false); }
    };

    if (loading) return <div className="p-5 text-center"><div className="spinner-border text-primary border-0 bg-primary bg-opacity-10"></div></div>;

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="container-fluid py-4 h-100">
            <DashboardHeader title="Workforce Logistics" subtitle="Manage assignment flow and field engineering dispatch." />
            
            <motion.div variants={itemVariants} className="premium-card p-4 p-lg-5 border-secondary border-opacity-10 bg-surface bg-opacity-30">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <h6 className="fw-bold m-0 text-white">Maintenance Work Orders</h6>
                    <div className="d-flex gap-2">
                        <div className="input-group bg-background rounded-3 border border-secondary border-opacity-10 overflow-hidden" style={{ width: '220px' }}>
                            <span className="input-group-text bg-transparent border-0 ps-3"><Search size={14} className="text-muted" /></span>
                            <input type="text" className="form-control border-0 bg-transparent shadow-none smaller" placeholder="Filter orders..." />
                        </div>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table align-middle">
                        <thead>
                            <tr className="smaller text-uppercase text-muted fw-bold">
                                <th>Order Ref</th>
                                <th>Subject/Category</th>
                                <th>Dispatched To</th>
                                <th>Status</th>
                                <th className="text-end">Dispatch</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map(r => (
                                <tr key={r.id}>
                                    <td className="py-3 fw-bold text-primary smaller">#{r.id.toString().padStart(4, '0')}</td>
                                    <td className="py-3">
                                        <div className="fw-bold small text-white">{r.title}</div>
                                        <div className="smaller text-muted">{r.category}</div>
                                    </td>
                                    <td className="py-3">
                                        {r.technician_name 
                                            ? <div className="d-flex align-items-center smaller text-primary fw-bold"><Users size={12} className="me-2 text-muted" /> {r.technician_name}</div>
                                            : <span className="smaller text-danger fw-bold opacity-60">Unassigned</span>
                                        }
                                    </td>
                                    <td className="py-3"><span className={`status-badge status-${r.status.toLowerCase().replace(' ', '_')}`}>{r.status}</span></td>
                                    <td className="py-3 text-end">
                                        <motion.button 
                                            whileHover={{ scale: 1.05 }} 
                                            whileTap={{ scale: 0.95 }} 
                                            className="btn btn-surface border-secondary border-opacity-10 btn-sm rounded-3 px-4 py-2 text-primary fw-bold smaller" 
                                            onClick={() => { setSelectedReq(r); setSelectedTech(r.technician_id || ''); }}
                                        >
                                            Delegate
                                        </motion.button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            <AnimatePresence>
                {selectedReq && (
                    <div className="modal-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1100, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="premium-card p-5 w-100 border-secondary border-opacity-10 bg-surface shadow-2xl" style={{ maxWidth: '400px' }}>
                            <div className="text-center mb-5">
                                <div className="bg-primary bg-opacity-10 d-inline-block p-4 rounded-circle mb-3"><Users className="text-primary" size={32} /></div>
                                <h4 className="fw-bold text-white tracking-tighter">Delegate Staff</h4>
                                <p className="text-muted smaller">Redirecting order: <span className="text-white fw-bold">{selectedReq.title}</span></p>
                            </div>
                            
                            <div className="mb-5">
                                <label className="form-label smaller fw-bold text-muted mb-3">SELECT PERSONNEL</label>
                                <select className="form-select" value={selectedTech} onChange={e => setSelectedTech(e.target.value)}>
                                    <option value="">Choose Field Engineer...</option>
                                    {technicians.map(t => <option key={t.id} value={t.id}>{t.name} ({t.category || 'General'})</option>)}
                                </select>
                            </div>

                            <div className="d-flex gap-3 mt-4">
                                <button className="btn btn-secondary w-100 py-3 rounded-3 fw-bold" onClick={() => setSelectedReq(null)}>Abort</button>
                                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="btn btn-primary w-100 py-3 rounded-3 fw-bold shadow-lg d-flex align-items-center justify-content-center" disabled={assigning || !selectedTech} onClick={handleAssign}>
                                    {assigning ? <Loader2 size={18} className="animate-spin" /> : 'Confirm Dispatch'}
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
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

    if (loading) return <div className="p-5 text-center"><div className="spinner-border text-primary border-0 bg-primary bg-opacity-10"></div></div>;

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="container-fluid py-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-5 mt-1">
                <div>
                    <h2 className="fw-bold tracking-tighter mb-1 text-white">Member Directory</h2>
                    <p className="text-muted small mb-0 fw-medium">Provision and manage DBU technicians and student profiles.</p>
                </div>
                <motion.button 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }} 
                    className="btn btn-primary d-flex align-items-center rounded-3 px-4 py-2" 
                    onClick={() => setModal(true)}
                >
                    <UserPlus size={18} className="me-2" /> <span className="smaller fw-bold">Provision Member</span>
                </motion.button>
            </div>

            <motion.div variants={itemVariants} className="premium-card p-4 p-lg-5 border-secondary border-opacity-10 bg-surface bg-opacity-30">
                <div className="table-responsive">
                    <table className="table align-middle">
                        <thead>
                            <tr className="smaller text-uppercase text-muted fw-bold">
                                <th>Account Code</th>
                                <th>Access Tier</th>
                                <th>Member Identity</th>
                                <th>Network Status</th>
                                <th className="text-end">Governance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td className="py-3 fw-bold text-primary smaller">{u.user_code}</td>
                                    <td className="py-3">
                                        <span className="badge bg-background border border-secondary border-opacity-10 text-muted px-3 py-2 rounded-3 text-capitalize smaller fw-bold">{u.role}</span>
                                    </td>
                                    <td className="py-3">
                                        <div className="fw-bold text-white small">{u.name}</div>
                                        <div className="smaller text-muted opacity-50">{u.email}</div>
                                    </td>
                                    <td className="py-3">
                                        <div className="d-flex align-items-center small">
                                            <div className={`p-1 rounded-circle bg-${u.status === 'active' ? 'success' : 'danger'} me-3`} style={{ width: '8px', height: '8px', boxShadow: u.status === 'active' ? '0 0 10px #10b981' : 'none' }}></div>
                                            <span className="smaller fw-bold opacity-80">{u.status}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 text-end">
                                        <button className="btn btn-sm btn-surface border-0 p-2 text-muted"><Key size={18} /></button>
                                        <button className="btn btn-sm btn-surface border-0 p-2 text-danger opacity-50"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            <AnimatePresence>
                {modal && (
                    <div className="modal-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1100, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="premium-card p-4 p-lg-5 w-100 border-secondary border-opacity-10 bg-surface shadow-22xl" style={{ maxWidth: '500px' }}>
                            <h4 className="fw-bold text-center text-white tracking-tighter mb-5">Identify New Personnel</h4>
                            <form onSubmit={handleCreate}>
                                <div className="mb-4">
                                    <label className="form-label smaller fw-bold text-muted mb-2">FULL LEGAL NAME</label>
                                    <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label smaller fw-bold text-muted mb-2">EMAIL IDENTIFIER</label>
                                    <input type="email" className="form-control" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                                </div>
                                <div className="row g-4 mb-5">
                                    <div className="col-md-6">
                                        <label className="form-label smaller fw-bold text-muted mb-2">DBU ACCESS CODE</label>
                                        <input type="text" className="form-control" placeholder="DBU1601069" value={formData.user_code} onChange={e => setFormData({...formData, user_code: e.target.value})} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label smaller fw-bold text-muted mb-2">AUTHORITY TIER</label>
                                        <select className="form-select" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                                            <option value="student">Student</option>
                                            <option value="technician">Staff Member</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="d-flex gap-3">
                                    <button type="button" className="btn btn-secondary w-100 py-3 rounded-3 fw-bold" onClick={() => setModal(false)}>Cancel Action</button>
                                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" className="btn btn-primary w-100 py-3 rounded-3 fw-bold shadow-lg" disabled={creating}>
                                        {creating ? <Loader2 size={24} className="animate-spin" /> : 'Confirm Provisioning'}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const AdminDashboard = () => {
    return (
        <div className="bg-background min-vh-100 text-white">
            <Sidebar />
            <div className="main-content-area" style={{ marginLeft: '280px', minHeight: '100vh', transition: 'all 0.4s' }}>
                <Routes>
                    <Route index element={<AdminAnalytics />} />
                    <Route path="requests" element={<RequestManagement />} />
                    <Route path="users" element={<UserManagement />} />
                </Routes>
            </div>
        </div>
    );
};

export default AdminDashboard;
