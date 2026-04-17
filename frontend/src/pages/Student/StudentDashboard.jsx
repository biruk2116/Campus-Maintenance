import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../../components/Sidebar';
import axios from '../../api/axios';
import { 
    Plus, Clock, CheckCircle2, FileText, ChevronRight,
    Search, Bell, Settings, ArrowUpRight, Zap, MapPin
} from 'lucide-react';
import {
    Chart as ChartJS, ArcElement, Tooltip, Legend,
    CategoryScale, LinearScale, BarElement, PointElement, LineElement,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useAuth } from '../../context/AuthContext';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const DashboardHeader = ({ title, subtitle }) => (
    <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
            <h2 className="fw-bold tracking-tighter mb-1 text-main">{title}</h2>
            <p className="text-muted small mb-0 fw-medium">{subtitle}</p>
        </div>
        <div className="d-flex gap-2">
            <div className="input-group d-none d-md-flex bg-surface rounded-3 border border-secondary border-opacity-10 overflow-hidden" style={{ width: '240px' }}>
                <span className="input-group-text bg-transparent border-0 ps-3"><Search size={16} className="text-muted" /></span>
                <input type="text" className="form-control border-0 bg-transparent shadow-none smaller" placeholder="Search orders..." />
            </div>
            <button className="btn btn-surface border-secondary border-opacity-10 p-2 rounded-3 text-muted shadow-sm"><Bell size={18} /></button>
        </div>
    </div>
);

const StudentOverview = () => {
    const [stats, setStats] = useState({ Pending: 0, Assigned: 0, "In Progress": 0, Completed: 0 });
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isDarkMode } = useAuth();

    const fetchData = async () => {
        try {
            const res = await axios.get('index.php?action=getStudentRequests');
            if (res.data.success) {
                const data = res.data.data;
                setRequests(data);
                const counts = { Pending: 0, Assigned: 0, "In Progress": 0, Completed: 0 };
                data.forEach(r => { if (counts[r.status] !== undefined) counts[r.status]++; });
                setStats(counts);
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const chartData = {
        labels: ['Queue', 'Assigned', 'Active', 'Done'],
        datasets: [{
            data: [stats.Pending, stats.Assigned, stats["In Progress"], stats.Completed],
            backgroundColor: ['#ef444433', '#3b82f633', '#f59e0b33', '#10b98133'],
            borderColor: ['#ef4444', '#3b82f6', '#f59e0b', '#10b981'],
            borderWidth: 2,
        }],
    };

    if (loading) return <div className="p-5 text-center"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="container-fluid">
            <DashboardHeader title="Student Workspace" subtitle="Lodge and track facility maintenance work orders." />

            <div className="row g-4 mb-5">
                {[
                    { label: 'Pending Dispatch', count: stats.Pending, color: 'danger', icon: <Clock /> },
                    { label: 'Active Repairs', count: stats["In Progress"], color: 'warning', icon: <Zap /> },
                    { label: 'Total Tickets', count: requests.length, color: 'primary', icon: <FileText /> },
                    { label: 'Completed', count: stats.Completed, color: 'success', icon: <CheckCircle2 /> }
                ].map((s, i) => (
                    <div key={i} className="col-md-3">
                        <div className="premium-card p-4 h-100 shadow-sm">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className={`text-${s.color} opacity-80`}>{s.icon}</div>
                                <span className="smaller text-muted fw-bold">Live Status</span>
                            </div>
                            <h2 className="fw-bold mb-0 text-main">{s.count}</h2>
                            <p className="text-muted smaller fw-bold text-uppercase mb-0">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4">
                <div className="col-lg-4">
                    <div className="premium-card p-4 h-100 bg-surface shadow-sm">
                        <h6 className="fw-bold mb-4 text-main">Request Distribution</h6>
                        <div style={{ height: '240px' }}>
                            <Pie 
                                data={chartData} 
                                options={{ 
                                    maintainAspectRatio: false, 
                                    plugins: { legend: { position: 'bottom', labels: { color: isDarkMode ? '#a1a1aa' : '#71717a', usePointStyle: true, font: { size: 10 } } } } 
                                }} 
                            />
                        </div>
                    </div>
                </div>
                <div className="col-lg-8">
                    <div className="premium-card p-4 h-100 shadow-sm">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h6 className="fw-bold m-0 text-main">Recent Activity Ledger</h6>
                            <Link to="/student/new-request" className="btn btn-primary btn-sm rounded-3 py-2 px-3 fw-bold smaller shadow-sm">New Request</Link>
                        </div>
                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead>
                                    <tr className="smaller text-muted fw-bold text-uppercase">
                                        <th>Ticket ID</th>
                                        <th>Subject</th>
                                        <th>Status</th>
                                        <th>Engineering Unit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.slice(0, 5).map((r, i) => (
                                        <tr key={i}>
                                            <td className="smaller text-muted fw-bold">#{r.id.toString().padStart(4, '0')}</td>
                                            <td className="small fw-bold text-main">{r.title}</td>
                                            <td><span className={`status-badge status-${r.status.toLowerCase().replace(' ', '_')}`}>{r.status}</span></td>
                                            <td className="smaller text-muted fw-medium">{r.technician_name || 'Dispatching...'}</td>
                                        </tr>
                                    ))}
                                    {requests.length === 0 && <tr><td colSpan="4" className="text-center py-5 text-muted smaller">No active tickets found.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const NewRequest = () => {
    const [formData, setFormData] = useState({ title: '', description: '', category: '', location: '', priority: 'Medium' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new URLSearchParams();
            Object.keys(formData).forEach(k => data.append(k, formData[k]));
            const res = await axios.post('index.php?action=createRequest', data);
            if (res.data.success) {
                setSuccess(true);
                setFormData({ title: '', description: '', category: '', location: '', priority: 'Medium' });
                setTimeout(() => setSuccess(false), 4000);
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    return (
        <div className="container-fluid">
            <DashboardHeader title="Field Report" subtitle="Log a facility malfunction for immediate engineering review." />
            
            <div className="premium-card p-4 p-lg-5 shadow-sm mx-auto" style={{ maxWidth: '900px' }}>
                <AnimatePresence>
                    {success && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="alert alert-success bg-success bg-opacity-10 border-success border-opacity-20 d-flex align-items-center mb-5 p-3 rounded-3" >
                            <CheckCircle2 size={18} className="me-3" />
                            <div className="smaller fw-bold">Work order dispatched successfully. Track in "My Tickets".</div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                        <div className="col-md-7">
                            <label className="form-label smaller fw-bold text-muted mb-2">Service Subject</label>
                            <input type="text" className="form-control" placeholder="e.g. Broken laboratory faucet" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                        </div>
                        <div className="col-md-5">
                            <label className="form-label smaller fw-bold text-muted mb-2">Engineering Dept</label>
                            <select className="form-select" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required>
                                <option value="">Select Department</option>
                                <option value="Electrical">Electrical</option>
                                <option value="Plumbing">Plumbing</option>
                                <option value="Carpentry">Carpentry</option>
                                <option value="Network">Network</option>
                            </select>
                        </div>
                        <div className="col-md-7">
                            <label className="form-label smaller fw-bold text-muted mb-2">Deployment Location</label>
                            <div className="input-group bg-surface rounded-3 border">
                                <span className="input-group-text bg-transparent border-0 pe-0"><MapPin size={16} className="text-muted" /></span>
                                <input type="text" className="form-control border-0" placeholder="e.g. Block 04, Rm 201" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
                            </div>
                        </div>
                        <div className="col-md-5">
                            <label className="form-label smaller fw-bold text-muted mb-2">Priority Matrix</label>
                            <div className="d-flex gap-2">
                                {['Medium', 'High', 'Critical'].map(p => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setFormData({...formData, priority: p})}
                                        className={`btn btn-sm flex-grow-1 py-3 rounded-3 border transition-all ${formData.priority === p ? 'btn-primary border-0' : 'btn-surface'}`}
                                    >
                                        <span className="smaller fw-bold">{p}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="col-12">
                            <label className="form-label smaller fw-bold text-muted mb-2">Fault Narrrative</label>
                            <textarea className="form-control" rows="5" placeholder="Please provide clear details for the technician..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                        </div>
                        <div className="col-12 mt-5">
                            <button type="submit" className="btn btn-primary w-100 py-3 fw-bold shadow-lg" disabled={loading} >
                                {loading ? 'Transmitting...' : 'Dispatch Work Order'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

const StudentDashboard = () => {
    return (
        <div className="bg-background min-vh-100">
            <Sidebar />
            <div className="main-content-area">
                <AnimatePresence mode="wait">
                    <Routes>
                        <Route index element={<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><StudentOverview /></motion.div>} />
                        <Route path="new-request" element={<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><NewRequest /></motion.div>} />
                    </Routes>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default StudentDashboard;
