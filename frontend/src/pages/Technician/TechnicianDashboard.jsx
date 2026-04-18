import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../../components/Sidebar';
import axios from '../../api/axios';
import { 
    CheckCircle2, Clock, Edit3, Loader2, Calendar, MapPin, 
    Search, Bell, Settings, Play, CheckCircle, Activity, LogIn
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DashboardHeader = ({ title, subtitle, unreadCount }) => {
    const { logout } = useAuth();
    
    return (
        <div className="d-flex justify-content-between align-items-center mb-5">
            <div>
                <h2 className="fw-bold tracking-tighter mb-1 text-main">{title}</h2>
                <p className="text-muted small mb-0 fw-medium">{subtitle}</p>
            </div>
            <div className="d-flex align-items-center gap-3">
                <div className="position-relative">
                    <button className="btn btn-surface border-secondary border-opacity-10 p-2 rounded-3 text-muted shadow-sm">
                        <Bell size={18} />
                    </button>
                    {unreadCount > 0 && (
                        <span 
                            className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger border border-white" 
                            style={{ width: '18px', height: '18px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', marginTop: '4px', marginLeft: '-4px' }}
                        >
                            {unreadCount}
                        </span>
                    )}
                </div>
                <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                    onClick={logout}
                    className="btn btn-danger btn-sm px-4 rounded-pill fw-bold smaller shadow-sm border-0 d-flex align-items-center bg-danger bg-opacity-75"
                >
                    <LogIn size={14} className="me-2" style={{ transform: 'rotate(180deg)' }} /> EXIT TERMINAL
                </motion.button>
            </div>
        </div>
    );
};

const TechnicianDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);
    const [updateForm, setUpdateForm] = useState({ request_id: '', status: '', progress_percentage: 0, remarks: '' });
    const [updating, setUpdating] = useState(false);
    const [activeTab, setActiveTab] = useState('active');

    const fetchData = async () => {
        try {
            const [tasksRes, unreadRes] = await Promise.all([
                axios.get('index.php?action=getAssignedRequests'),
                axios.get('index.php?action=getNotificationCounts')
            ]);
            
            if (tasksRes.data.success) setTasks(tasksRes.data.data);
            if (unreadRes.data.success) setUnreadCount(unreadRes.data.data.unread);
            
            // Mark as read if there are unread notifications
            if (unreadRes.data.data.unread > 0) {
                await axios.post('index.php?action=markNotificationsRead');
                // The badge will remain until refresh or we could setUnreadCount(0) here
                // User wants "decrease when he received new notifications" - usually unread resets when viewed.
            }
        } catch (err) { 
            console.error("Engineering Queue Fetch Failed:", err);
        }
        finally { setLoading(false); }
    };

    const clearBadge = () => setUnreadCount(0);

    useEffect(() => { 
        fetchData(); 
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const res = await axios.post('index.php?action=updateProgress', updateForm);
            if (res.data.success) {
                setSelectedTask(null);
                fetchData();
            }
        } catch (err) { 
            console.error("Transmission Error:", err);
        }
        finally { setUpdating(false); }
    };

    const activeTasks = tasks.filter(t => t.status !== 'Completed');
    const historyTasks = tasks.filter(t => t.status === 'Completed');

    if (loading) return <div className="p-5 text-center"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="bg-background min-vh-100">
            <Sidebar />
            <div className="main-content-area text-main">
                <DashboardHeader title="Engineering Queue" subtitle="Manage assigned facility maintenance orders and synchronization." unreadCount={unreadCount} />

                <div className="row g-4 mb-5">
                    {[
                        { label: 'Active Tasks', count: activeTasks.length, color: 'primary', icon: <Play /> },
                        { label: 'Units Delivered', count: historyTasks.length, color: 'success', icon: <CheckCircle /> },
                        { label: 'Avg Efficiency', count: `${Math.round(tasks.reduce((acc, curr) => acc + curr.progress_percentage, 0) / (tasks.length || 1))}%`, color: 'warning', icon: <Activity /> }
                    ].map((s, i) => (
                        <div key={i} className="col-md-4">
                            <div className="premium-card p-4 shadow-sm border-secondary border-opacity-10 d-flex align-items-center">
                                <div className={`bg-primary bg-opacity-10 p-3 rounded-3 text-${s.color} me-4`}>{s.icon}</div>
                                <div>
                                    <h3 className="fw-bold mb-0 text-main">{s.count}</h3>
                                    <p className="text-muted smaller fw-bold text-uppercase mb-0">{s.label}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="premium-card p-4 p-lg-5 shadow-sm border-secondary border-opacity-10 mb-5">
                    <div className="d-flex justify-content-between align-items-center mb-5 border-bottom border-secondary border-opacity-10 pb-3">
                        <div className="d-flex gap-4">
                            <button 
                                className={`btn btn-link p-0 text-decoration-none fw-bold smaller transition-all ${activeTab === 'active' ? 'text-primary' : 'text-muted'}`}
                                onClick={() => setActiveTab('active')}
                            >
                                <Calendar className="me-2" size={14} /> ACTIVE DISPATCH LOG
                            </button>
                            <button 
                                className={`btn btn-link p-0 text-decoration-none fw-bold smaller transition-all ${activeTab === 'history' ? 'text-primary' : 'text-muted'}`}
                                onClick={() => setActiveTab('history')}
                            >
                                <Clock className="me-2" size={14} /> FIELD REPAIR HISTORY
                            </button>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table align-middle">
                            <thead>
                                <tr className="smaller text-uppercase text-muted fw-bold">
                                    <th className="pb-4">Order ID</th>
                                    <th className="pb-4">Location</th>
                                    <th className="pb-4">Status</th>
                                    <th className="pb-4">Completion</th>
                                    <th className="pb-4 text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(activeTab === 'active' ? activeTasks : historyTasks).map((t) => (
                                    <tr key={t.id}>
                                        <td className="py-3">
                                            <div className="fw-bold text-primary smaller">#{t.id.toString().padStart(4, '0')}</div>
                                            <div className="small fw-bold text-main mt-1">{t.title}</div>
                                        </td>
                                        <td className="py-3">
                                            <div className="d-flex align-items-center small text-muted">
                                                <MapPin size={12} className="me-2" /> {t.location}
                                            </div>
                                        </td>
                                        <td className="py-3"><span className={`status-badge status-${t.status.toLowerCase().replace(' ', '_')}`}>{t.status}</span></td>
                                        <td className="py-3" style={{ width: '160px' }}>
                                            <div className="d-flex align-items-center">
                                                <div className="progress flex-grow-1 bg-surface-hover" style={{ height: '4px' }}>
                                                    <div className="progress-bar bg-primary" style={{ width: `${t.progress_percentage}%` }}></div>
                                                </div>
                                                <span className="smaller fw-bold text-muted ms-3">{t.progress_percentage}%</span>
                                            </div>
                                        </td>
                                        <td className="py-3 text-end">
                                            <button 
                                                className="btn btn-surface border-secondary border-opacity-10 btn-sm rounded-3 px-3 py-2 text-primary fw-bold transition-all shadow-sm" 
                                                disabled={t.status === 'Completed'}
                                                onClick={() => {
                                                    setSelectedTask(t);
                                                    setUpdateForm({ request_id: t.id, status: t.status, progress_percentage: t.progress_percentage, remarks: '' });
                                                }}
                                            >
                                                Sync Status
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {(activeTab === 'active' ? activeTasks : historyTasks).length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted small">
                                            No {activeTab} tasks found in the engineering registry.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <AnimatePresence>
                    {selectedTask && (
                        <div className="modal-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3" style={{ zIndex: 1200, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
                            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="premium-card p-4 p-lg-5 w-100 shadow-22xl bg-surface" style={{ maxWidth: '550px' }}>
                                <div className="text-center mb-5">
                                    <h4 className="fw-bold text-main tracking-tighter">Synchronize Progress</h4>
                                    <p className="text-muted smaller">Order: {selectedTask.title} • {selectedTask.location}</p>
                                </div>
                                
                                <form onSubmit={handleUpdate}>
                                    <div className="row g-4">
                                        <div className="col-md-6">
                                            <label className="form-label smaller fw-bold text-muted mb-2">Technical Status</label>
                                            <select className="form-select border-secondary border-opacity-10 bg-surface text-main" value={updateForm.status} onChange={e => setUpdateForm({...updateForm, status: e.target.value})} required>
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
                                            <label className="form-label smaller fw-bold text-muted mb-2">Engineering Remarks</label>
                                            <textarea className="form-control border-secondary border-opacity-10 bg-surface text-main" rows="4" placeholder="Detail the measures taken or parts replaced..." value={updateForm.remarks} onChange={e => setUpdateForm({...updateForm, remarks: e.target.value})} required></textarea>
                                        </div>
                                        <div className="col-12 d-flex gap-3 mt-4">
                                            <button type="button" className="btn btn-surface w-100 py-3 fw-bold rounded-3 shadow-sm border-secondary border-opacity-10" onClick={() => setSelectedTask(null)}>Cancel</button>
                                            <button type="submit" className="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-lg" disabled={updating}>
                                                {updating ? <Loader2 size={18} className="animate-spin me-2" /> : <Edit3 size={18} className="me-2" />}
                                                {updating ? 'Updating...' : 'Save Synchronization'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default TechnicianDashboard;
