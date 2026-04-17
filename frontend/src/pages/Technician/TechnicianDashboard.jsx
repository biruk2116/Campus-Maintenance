import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../../components/Sidebar';
import axios from '../../api/axios';
import { 
    CheckCircle2, 
    Clock, 
    Edit3, 
    Loader2,
    Calendar,
    MapPin,
    Search,
    Bell,
    Settings,
    Play,
    CheckCircle,
    Activity,
    AlertCircle,
    ChevronRight,
    ArrowRight
} from 'lucide-react';

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
            <button className="btn btn-surface border-secondary border-opacity-10 p-2 rounded-3 text-muted"><Bell size={18} /></button>
            <button className="btn btn-surface border-secondary border-opacity-10 p-2 rounded-3 text-muted"><Settings size={18} /></button>
        </div>
    </div>
);

const TechnicianDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);
    const [updateForm, setUpdateForm] = useState({ status: '', progress_percentage: 0, remarks: '' });
    const [updating, setUpdating] = useState(false);

    const fetchData = async () => {
        try {
            const res = await axios.get('index.php?action=getAssignedRequests');
            if (res.data.success) setTasks(res.data.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const data = new URLSearchParams();
            data.append('request_id', selectedTask.id);
            data.append('status', updateForm.status);
            data.append('progress_percentage', updateForm.progress_percentage);
            data.append('remarks', updateForm.remarks);

            const res = await axios.post('index.php?action=updateProgress', data);
            if (res.data.success) {
                setSelectedTask(null);
                setUpdateForm({ status: '', progress_percentage: 0, remarks: '' });
                fetchData();
            }
        } catch (err) { console.error(err); }
        finally { setUpdating(false); }
    };

    if (loading) return <div className="p-5 text-center"><div className="spinner-border text-primary border-0 bg-primary bg-opacity-10"></div></div>;

    return (
        <div className="bg-background min-vh-100 text-white">
            <Sidebar />
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="main-content-scroll flex-grow-1 p-lg-5 p-4 overflow-auto"
                style={{ marginLeft: '280px', minHeight: '100vh' }}
            >
                <DashboardHeader title="Field Output Board" subtitle="Real-time task synchronization and progress updates." />

                <div className="row g-4 mb-5">
                    {[
                        { label: 'Pending Action', count: tasks.filter(t => t.status !== 'Completed').length, color: 'primary', icon: <Play /> },
                        { label: 'Closed Tickets', count: tasks.filter(t => t.status === 'Completed').length, color: 'success', icon: <CheckCircle /> },
                        { label: 'Work Intensity', count: `${Math.round(tasks.reduce((acc, curr) => acc + curr.progress_percentage, 0) / (tasks.length || 1))}%`, color: 'warning', icon: <Activity /> }
                    ].map((s, i) => (
                        <motion.div key={i} variants={itemVariants} className="col-md-4">
                            <div className="premium-card p-4 border-secondary border-opacity-10 d-flex align-items-center">
                                <div className={`bg-background p-3 rounded-3 text-${s.color} me-4 border border-secondary border-opacity-10`}>{s.icon}</div>
                                <div>
                                    <h3 className="fw-bold mb-0 text-white">{s.count}</h3>
                                    <p className="text-muted smaller fw-bold text-uppercase mb-0">{s.label}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div variants={itemVariants} className="premium-card p-4 p-lg-5 border-secondary border-opacity-10 bg-surface bg-opacity-30">
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <h6 className="fw-bold m-0 d-flex align-items-center text-white">
                            <Calendar className="me-3 text-primary opacity-50" size={18} /> Assigned Maintenance Queue
                        </h6>
                        <div className="input-group d-none d-md-flex bg-background rounded-3 border border-secondary border-opacity-10 overflow-hidden" style={{ width: '220px' }}>
                            <span className="input-group-text bg-transparent border-0 ps-3"><Search size={14} className="text-muted" /></span>
                            <input type="text" className="form-control border-0 bg-transparent shadow-none smaller" placeholder="Filter tasks..." />
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table align-middle">
                            <thead>
                                <tr className="smaller text-uppercase text-muted fw-bold">
                                    <th className="pb-4">Order Ref</th>
                                    <th className="pb-4">Location Desk</th>
                                    <th className="pb-4">Status</th>
                                    <th className="pb-4">Completion</th>
                                    <th className="pb-4 text-end">Governance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((t) => (
                                    <tr key={t.id}>
                                        <td className="py-3">
                                            <div className="fw-bold text-primary smaller">#{t.id.toString().padStart(4, '0')}</div>
                                            <div className="small fw-bold text-white mt-1">{t.title}</div>
                                        </td>
                                        <td className="py-3">
                                            <div className="d-flex align-items-center smaller text-muted fw-medium">
                                                <MapPin size={12} className="me-2" /> {t.location}
                                            </div>
                                        </td>
                                        <td className="py-3"><span className={`status-badge status-${t.status.toLowerCase().replace(' ', '_')}`}>{t.status}</span></td>
                                        <td className="py-3" style={{ width: '160px' }}>
                                            <div className="d-flex align-items-center">
                                                <div className="progress flex-grow-1 bg-background overflow-visible border border-secondary border-opacity-10" style={{ height: '4px' }}>
                                                    <motion.div initial={{ width: 0 }} animate={{ width: `${t.progress_percentage}%` }} className="progress-bar bg-primary shadow-sm" style={{ boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}></motion.div>
                                                </div>
                                                <span className="smaller fw-bold text-muted ms-3">{t.progress_percentage}%</span>
                                            </div>
                                        </td>
                                        <td className="py-3 text-end">
                                            <motion.button 
                                                whileHover={{ scale: 1.05 }} 
                                                whileTap={{ scale: 0.95 }} 
                                                className="btn btn-surface border-secondary border-opacity-10 btn-sm rounded-3 px-3 py-2 text-primary fw-bold smaller" 
                                                disabled={t.status === 'Completed'}
                                                onClick={() => {
                                                    setSelectedTask(t);
                                                    setUpdateForm({ status: t.status, progress_percentage: t.progress_percentage, remarks: '' });
                                                }}
                                            >
                                                Sync Status
                                            </motion.button>
                                        </td>
                                    </tr>
                                ))}
                                {tasks.length === 0 && <tr><td colSpan="5" className="text-center py-5 text-muted smaller opacity-50">No active maintenance orders assigned to your unit.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                <AnimatePresence>
                    {selectedTask && (
                        <div className="modal-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1100, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
                            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="premium-card p-4 p-lg-5 w-100 border-secondary border-opacity-10 bg-surface shadow-2xl" style={{ maxWidth: '550px' }}>
                                <div className="text-center mb-5">
                                    <div className="bg-primary bg-opacity-10 d-inline-block p-3 rounded-circle mb-3"><Activity className="text-primary" size={24} /></div>
                                    <h4 className="fw-bold text-white tracking-tighter">Synchronize Progress</h4>
                                    <p className="text-muted smaller">Order: {selectedTask.title} • {selectedTask.location}</p>
                                </div>
                                
                                <form onSubmit={handleUpdate}>
                                    <div className="row g-4">
                                        <div className="col-md-6">
                                            <label className="form-label smaller fw-bold text-muted mb-2">Technical Status</label>
                                            <select className="form-select" value={updateForm.status} onChange={e => setUpdateForm({...updateForm, status: e.target.value})} required>
                                                <option value="Assigned">Assigned</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Completed">Completed</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label smaller fw-bold text-muted mb-2">Field Completion: {updateForm.progress_percentage}%</label>
                                            <input type="range" className="form-range" min="0" max="100" step="10" value={updateForm.progress_percentage} onChange={e => setUpdateForm({...updateForm, progress_percentage: parseInt(e.target.value)})} />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label smaller fw-bold text-muted mb-2">Technical Remarks</label>
                                            <textarea className="form-control" rows="4" placeholder="Detail any parts replaced or work methodologies used..." value={updateForm.remarks} onChange={e => setUpdateForm({...updateForm, remarks: e.target.value})} required></textarea>
                                        </div>
                                        <div className="col-12 d-flex gap-3 mt-4">
                                            <button type="button" className="btn btn-secondary w-100 py-3 fw-bold rounded-3" onClick={() => setSelectedTask(null)}>Cancel</button>
                                            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" className="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-lg d-flex align-items-center justify-content-center" disabled={updating}>
                                                {updating ? <Loader2 size={18} className="animate-spin me-2" /> : <Edit3 size={18} className="me-2" />}
                                                {updating ? 'Updating Hub...' : 'Save Changes'}
                                            </motion.button>
                                        </div>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default TechnicianDashboard;
