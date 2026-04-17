import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../../components/Sidebar';
import axios from '../../api/axios';
import { 
    Plus, 
    Clock, 
    CheckCircle2, 
    FileText, 
    ChevronRight,
    Search,
    Bell,
    Settings,
    Filter,
    ArrowUpRight,
    Zap,
    MapPin,
    AlertCircle
} from 'lucide-react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

const DashboardHeader = ({ title, subtitle }) => (
    <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
            <h2 className="fw-bold tracking-tighter mb-1 text-white">{title}</h2>
            <p className="text-muted small mb-0 fw-medium">{subtitle}</p>
        </div>
        <div className="d-flex gap-2">
            <div className="input-group d-none d-md-flex bg-surface rounded-3 border border-secondary border-opacity-10 overflow-hidden" style={{ width: '240px' }}>
                <span className="input-group-text bg-transparent border-0 ps-3"><Search size={16} className="text-muted" /></span>
                <input type="text" className="form-control border-0 bg-transparent shadow-none smaller" placeholder="Search orders..." />
            </div>
            <button className="btn btn-surface border-secondary border-opacity-10 p-2 rounded-3 text-muted"><Bell size={18} /></button>
            <button className="btn btn-surface border-secondary border-opacity-10 p-2 rounded-3 text-muted"><Settings size={18} /></button>
        </div>
    </div>
);

const StudentOverview = () => {
    const [stats, setStats] = useState({ Pending: 0, Assigned: 0, "In Progress": 0, Completed: 0 });
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div className="p-5 text-center"><div className="spinner-border text-primary border-0 bg-primary bg-opacity-10"></div></div>;

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="container-fluid py-4 h-100">
            <DashboardHeader title="Student Workspace" subtitle="Lodge and track facility maintenance work orders." />

            <div className="row g-4 mb-5">
                {[
                    { label: 'Pending Dispatch', count: stats.Pending, color: 'danger', icon: <Clock /> },
                    { label: 'Active Repairs', count: stats["In Progress"], color: 'warning', icon: <Zap /> },
                    { label: 'Total Tickets', count: requests.length, color: 'primary', icon: <FileText /> },
                    { label: 'Completed', count: stats.Completed, color: 'success', icon: <CheckCircle2 /> }
                ].map((s, i) => (
                    <motion.div key={i} variants={itemVariants} className="col-md-3">
                        <div className="premium-card p-4 h-100 border-secondary border-opacity-10">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className={`text-${s.color} opacity-80`}>{s.icon}</div>
                                <span className="smaller text-muted fw-bold">Real-time</span>
                            </div>
                            <h2 className="fw-bold mb-0 text-white">{s.count}</h2>
                            <p className="text-muted smaller fw-bold text-uppercase mb-0">{s.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="row g-4">
                <motion.div variants={itemVariants} className="col-lg-4">
                    <div className="premium-card p-4 h-100 border-secondary border-opacity-10 bg-surface bg-opacity-30">
                        <h6 className="fw-bold mb-4 text-white">Request Distribution</h6>
                        <div style={{ height: '250px' }}>
                            <Pie 
                                data={chartData} 
                                options={{ 
                                    maintainAspectRatio: false, 
                                    plugins: { legend: { position: 'bottom', labels: { color: '#a1a1aa', usePointStyle: true, font: { size: 10 } } } } 
                                }} 
                            />
                        </div>
                    </div>
                </motion.div>
                <motion.div variants={itemVariants} className="col-lg-8">
                    <div className="premium-card p-4 h-100 border-secondary border-opacity-10">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h6 className="fw-bold m-0 text-white">Recent Activities</h6>
                            <Link to="/student/new-request" className="btn btn-primary btn-sm rounded-3 py-2 px-3 fw-bold smaller">New Request</Link>
                        </div>
                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead>
                                    <tr>
                                        <th>Ticket ID</th>
                                        <th>Subject</th>
                                        <th>Status</th>
                                        <th>Dispatched</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.slice(0, 4).map((r, i) => (
                                        <tr key={i}>
                                            <td className="smaller text-muted fw-bold">#{r.id.toString().padStart(4, '0')}</td>
                                            <td className="small fw-bold text-white">{r.title}</td>
                                            <td><span className={`status-badge status-${r.status.toLowerCase().replace(' ', '_')}`}>{r.status}</span></td>
                                            <td className="smaller text-muted">{r.technician_name || 'In Queue'}</td>
                                        </tr>
                                    ))}
                                    {requests.length === 0 && <tr><td colSpan="4" className="text-center py-5 text-muted smaller">No active tickets found.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
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
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="container-fluid py-4 h-100">
            <DashboardHeader title="Log Maintenance Fault" subtitle="Report campus infrastructure issues to the technical unit." />
            
            <motion.div variants={itemVariants} className="premium-card p-4 p-lg-5 border-secondary border-opacity-10 bg-surface bg-opacity-30 mx-auto" style={{ maxWidth: '900px' }}>
                <AnimatePresence>
                    {success && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="alert alert-success bg-success bg-opacity-10 border-success border-opacity-20 d-flex align-items-center mb-5 p-3 rounded-3" >
                            <CheckCircle2 size={18} className="me-3" />
                            <div className="smaller fw-bold">Work order dispatched successfully. Track progress in "My Tickets".</div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                        <div className="col-md-7">
                            <label className="form-label smaller fw-bold text-muted mb-2">Issue Title</label>
                            <input type="text" className="form-control" placeholder="e.g. Fluorescent tube failure" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                        </div>
                        <div className="col-md-5">
                            <label className="form-label smaller fw-bold text-muted mb-2">Tech Category</label>
                            <select className="form-select" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required>
                                <option value="">Select Category</option>
                                <option value="Electrical">Electrical</option>
                                <option value="Plumbing">Plumbing</option>
                                <option value="Carpentry">Carpentry</option>
                                <option value="Network">Network</option>
                            </select>
                        </div>
                        <div className="col-md-7">
                            <label className="form-label smaller fw-bold text-muted mb-2">Specific Location</label>
                            <div className="input-group bg-background rounded-3">
                                <span className="input-group-text bg-transparent border-0 pe-0"><MapPin size={16} className="text-muted" /></span>
                                <input type="text" className="form-control border-0" placeholder="e.g. Block 12, Level 2, Rm 204" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
                            </div>
                        </div>
                        <div className="col-md-5">
                            <label className="form-label smaller fw-bold text-muted mb-2">Urgency Level</label>
                            <div className="d-flex gap-2">
                                {['Medium', 'High', 'Critical'].map(p => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setFormData({...formData, priority: p})}
                                        className={`btn btn-sm flex-grow-1 py-3 rounded-3 border-0 transition-all ${formData.priority === p ? 'btn-primary' : 'bg-background text-muted'}`}
                                    >
                                        <span className="smaller fw-bold">{p}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="col-12">
                            <label className="form-label smaller fw-bold text-muted mb-2">Detailed Description</label>
                            <textarea className="form-control" rows="5" placeholder="Please describe the malfunction..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                        </div>
                        <div className="col-12 mt-5">
                            <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} type="submit" className="btn btn-primary w-100 py-3 fw-bold shadow-lg" disabled={loading} >
                                {loading ? 'Transmitting Data...' : 'Dispatch Work Order'}
                            </motion.button>
                        </div>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

const MyRequests = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="container-fluid py-4 h-100">
        <DashboardHeader title="Ticket History" subtitle="View all your previously logged maintenance logs." />
        <div className="premium-card p-4 border-secondary border-opacity-10 bg-surface bg-opacity-30">
            <div className="text-center py-5">
                <AlertCircle size={40} className="text-muted mb-3 opacity-20" />
                <h6 className="text-muted smaller fw-bold">History Archive Loading...</h6>
            </div>
        </div>
    </motion.div>
);

const StudentDashboard = () => {
    return (
        <div className="bg-background min-vh-100 text-white">
            <Sidebar />
            <div className="main-content-area" style={{ marginLeft: '280px', minHeight: '100vh', transition: 'all 0.4s' }}>
                <Routes>
                    <Route index element={<StudentOverview />} />
                    <Route path="new-request" element={<NewRequest />} />
                    <Route path="my-requests" element={<MyRequests />} />
                </Routes>
            </div>
        </div>
    );
};

export default StudentDashboard;
