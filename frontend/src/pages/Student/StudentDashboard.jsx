import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../../components/Sidebar';
import axios from '../../api/axios';
import PremiumModal from '../../components/PremiumModal';

// Assets
import dbuLogo from '../../assets/images/dbu-logo.png';
import techBg from '../../assets/images/tech-bg.png';

import { 
    Plus, ClipboardList, Clock, CheckCircle, AlertTriangle,
    AlertCircle, Search, Bell, Settings, Activity, Shield, Loader2, LogIn, ArrowUpRight,
    MapPin, FileText, ChevronRight, X, Radio, Layers, Info, Wrench, BarChart2, Send
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DashboardHeader = ({ title, subtitle }) => {
    return (
        <div className="d-flex justify-content-between align-items-center mb-5 mt-2">
            <div className="d-flex align-items-center">
                <img src={dbuLogo} alt="DBU" className="me-4 d-none d-md-block" style={{ height: '45px' }} />
                <div>
                    <h2 className="fw-800 tracking-tighter mb-1 text-main">{title}</h2>
                    <p className="text-muted smallest fw-800 uppercase tracking-widest opacity-75">{subtitle}</p>
                </div>
            </div>
            <div className="d-flex align-items-center gap-3">
                <div className="bg-glass border border-secondary border-opacity-10 p-2 rounded-circle text-primary shadow-sm d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                    <Activity size={18} className="animate-pulse" />
                </div>
            </div>
        </div>
    );
};

const NewRequestForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Structural',
        location: '',
        priority: 'Medium'
    });
    const [submitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            Object.entries(formData).forEach(([key, value]) => params.append(key, value));

            const res = await axios.post('index.php?action=createRequest', params);
            if (res.data.success) {
                setShowSuccess(true);
            } else {
                setError(res.data.message || 'Deployment protocol failed.');
            }
        } catch (err) {
            setError('Critical link failure: Backend unreachable.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container-fluid">
            <DashboardHeader title="Log Discovery" subtitle="Strategic Fault Identification Module" />
            
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="premium-card p-5 bg-glass border-secondary border-opacity-10 shadow-22xl">
                        <div className="d-flex align-items-center mb-5">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-4 text-primary me-3 shadow-sm"><Radio size={28} /></div>
                            <div>
                                <h4 className="fw-800 mb-0 tracking-tighter text-main">Initialize Field Report</h4>
                                <p className="smallest text-muted fw-800 uppercase tracking-widest mb-0">Direct Uplink to Strategic Command</p>
                            </div>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }} 
                                    animate={{ opacity: 1, height: 'auto' }} 
                                    exit={{ opacity: 0, height: 0 }}
                                    className="alert alert-danger border-0 rounded-4 p-3 mb-5 smallest fw-800 uppercase tracking-widest d-flex align-items-center bg-danger bg-opacity-10 text-danger shadow-sm"
                                >
                                    <AlertTriangle size={18} className="me-2" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit}>
                            <div className="row g-4">
                                <div className="col-md-12">
                                    <label className="form-label smallest fw-800 uppercase tracking-widest text-muted mb-2">Operation Summary</label>
                                    <input 
                                        type="text" 
                                        className="form-control py-3 px-4 bg-surface border-secondary border-opacity-10 rounded-4 fw-bold text-main shadow-sm"
                                        placeholder="e.g., Grid Failure - Block 5 Laboratory"
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label smallest fw-800 uppercase tracking-widest text-muted mb-2">Tactical Category</label>
                                    <select 
                                        className="form-select py-3 px-4 bg-surface border-secondary border-opacity-10 rounded-4 fw-bold text-main shadow-sm"
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    >
                                        <option value="Structural">Structural Assets</option>
                                        <option value="Electricity">ICT & Power Grid</option>
                                        <option value="Plumbing">Hydraulic Systems</option>
                                        <option value="Network">Data Infrastructure</option>
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label smallest fw-800 uppercase tracking-widest text-muted mb-2">Priority Level</label>
                                    <select 
                                        className="form-select py-3 px-4 bg-surface border-secondary border-opacity-10 rounded-4 fw-bold text-main shadow-sm"
                                        value={formData.priority}
                                        onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                    >
                                        <option value="Low">Low - Static Task</option>
                                        <option value="Medium">Medium - Operational Need</option>
                                        <option value="High">High - Critical Fault</option>
                                        <option value="Emergency">Emergency - Instant Deployment</option>
                                    </select>
                                </div>
                                <div className="col-md-12">
                                    <label className="form-label smallest fw-800 uppercase tracking-widest text-muted mb-2">Site Coordinates / ID</label>
                                    <div className="position-relative">
                                        <input 
                                            type="text" 
                                            className="form-control py-3 px-4 bg-surface border-secondary border-opacity-10 rounded-4 fw-bold text-main ps-5 shadow-sm"
                                            placeholder="Room 204, Library Wing"
                                            value={formData.location}
                                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                                            required
                                        />
                                        <MapPin size={18} className="position-absolute top-5 transition-middle-y start-0 ms-3 mt-3 text-primary opacity-50" />
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <label className="form-label smallest fw-800 uppercase tracking-widest text-muted mb-2">Engineering Details</label>
                                    <textarea 
                                        className="form-control py-3 px-4 bg-surface border-secondary border-opacity-10 rounded-4 fw-bold text-main shadow-sm"
                                        rows="4"
                                        placeholder="Detail the technical anomaly observed..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        required
                                    ></textarea>
                                </div>
                                <div className="col-md-12 mt-5">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary w-100 py-3 rounded-pill fw-800 uppercase smallest tracking-widest shadow-22xl d-flex align-items-center justify-content-center"
                                        disabled={submitting}
                                    >
                                        {submitting ? <Loader2 size={18} className="me-2 animate-spin" /> : <Send size={18} className="me-2" />}
                                        {submitting ? 'Transmitting...' : 'Submit Strategic Dispatch'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <PremiumModal
                isOpen={showSuccess}
                onClose={() => navigate('/student')}
                title="Transmission Successful"
                type="success"
                confirmText="Acknowledged"
                onConfirm={() => navigate('/student')}
            >
                <div className="text-center py-4">
                    <div className="bg-success bg-opacity-10 p-4 rounded-circle d-inline-block mb-4 shadow-sm">
                        <CheckCircle size={48} className="text-success animate-bounce" />
                    </div>
                    <h5 className="fw-800 mb-3 text-main">Log Committed to Grid</h5>
                    <p className="smallest text-muted fw-bold uppercase tracking-widest">Technician dispatch sequence initiated.</p>
                </div>
            </PremiumModal>
        </motion.div>
    );
};

const StudentOverview = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = useCallback(async () => {
        try {
            const res = await axios.get('index.php?action=getStudentRequests');
            if (res.data.success) setRequests(res.data.data);
        } catch (err) {
            console.error("Ops Sync Failed");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    return (
        <div className="container-fluid text-main">
            <DashboardHeader title="Command Hub" subtitle="Student Infrastructure Gateway" />
            
            <div className="row g-4 mb-5">
                <div className="col-lg-4">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="premium-card p-5 h-100 bg-glass shadow-22xl border-secondary border-opacity-10">
                        <div className="d-flex justify-content-between align-items-center mb-5">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-4 text-primary shadow-sm"><Activity size={28} /></div>
                            <span className="smallest text-primary fw-800 uppercase tracking-widest bg-primary bg-opacity-10 px-2 py-1 rounded-pill shadow-sm">Active Link</span>
                        </div>
                        <h3 className="fw-800 mb-4 tracking-tighter text-main">Institutional Pulse</h3>
                        <p className="text-muted smallest fw-800 uppercase tracking-widest mb-5 opacity-75">Your reports directly impact the DBU stability grid. Monitor tactical repairs below.</p>
                        <hr className="border-secondary border-opacity-10 mb-5" />
                        <div className="d-flex flex-column gap-4">
                            <div className="d-flex align-items-center justify-content-between">
                                <span className="smallest fw-800 text-muted uppercase tracking-widest">Restoration Success Ratio</span>
                                <span className="fw-800 text-primary">98.4%</span>
                            </div>
                            <div className="progress rounded-pill bg-surface shadow-inner" style={{ height: '8px' }}>
                                <div className="progress-bar bg-primary shadow-22xl" style={{ width: '98%' }}></div>
                            </div>
                        </div>
                    </motion.div>
                </div>
                <div className="col-lg-8">
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="premium-card p-5 h-100 bg-primary bg-opacity-5 border-primary border-opacity-10 shadow-22xl d-flex flex-column align-items-center justify-content-center text-center">
                        <div className="bg-primary p-4 rounded-circle text-white mb-5 shadow-22xl animate-pulse cursor-pointer border-4 border-white border-opacity-10">
                            <Plus size={48} />
                        </div>
                        <h2 className="display-6 fw-800 mb-3 tracking-tighter text-main">Log New Discovery</h2>
                        <p className="text-muted smallest fw-800 uppercase tracking-widest mb-5 mx-auto opacity-75" style={{ maxWidth: '450px' }}>Identify facility operational faults and notify strategic command for tactical restoration.</p>
                        <Link to="new-request" className="btn btn-primary btn-lg px-5 py-3 rounded-pill fw-800 shadow-22xl d-flex align-items-center smallest tracking-widest uppercase">
                            Initialize Dispatch <ArrowUpRight size={18} className="ms-3" />
                        </Link>
                    </motion.div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="premium-card p-5 bg-glass border-secondary border-opacity-10 shadow-22xl">
                        <div className="d-flex justify-content-between align-items-center mb-5">
                            <div className="d-flex align-items-center">
                                <div className="bg-warning bg-opacity-10 p-3 rounded-4 text-warning me-3 shadow-sm"><Clock size={28} /></div>
                                <div>
                                    <h4 className="fw-800 mb-0 tracking-tighter text-main">Strategic Queue History</h4>
                                    <p className="smallest text-muted fw-800 uppercase tracking-widest mb-0">{requests.length} Dispatched Logs</p>
                                </div>
                            </div>
                            <button onClick={fetchRequests} className={`btn btn-surface btn-sm p-3 rounded-circle border-secondary border-opacity-10 ${loading ? 'animate-spin' : ''}`}><Activity size={18} /></button>
                        </div>

                        <div className="table-responsive">
                            <table className="table align-middle table-borderless">
                                <thead>
                                    <tr className="smallest text-uppercase text-muted fw-800 tracking-widest border-bottom border-secondary border-opacity-10">
                                        <th className="pb-3 text-main">Protocol ID / Discovery</th>
                                        <th className="pb-3 text-main">Site Coordinates</th>
                                        <th className="pb-3 text-center text-main">Deployment Status</th>
                                        <th className="pb-3 text-end text-main">Pulse</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!loading && requests.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center py-5">
                                                <div className="text-muted smallest fw-800 uppercase tracking-widest py-4 opacity-50">No strategic dispatches found in local grid.</div>
                                            </td>
                                        </tr>
                                    )}
                                    {requests.map((r, i) => (
                                        <tr key={i} className="border-bottom border-secondary border-opacity-5 hover-bg-surface-hover transition-all">
                                            <td className="py-4">
                                                <div className="fw-800 text-main mb-1">{r.title}</div>
                                                <div className="smallest text-primary text-uppercase fw-800 tracking-widest bg-primary bg-opacity-10 d-inline-block px-2 py-1 rounded-pill border border-primary border-opacity-10 shadow-sm">{r.category}</div>
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
                                            <td className="py-4 text-end">
                                                <div className="d-flex flex-column align-items-end">
                                                    <div className="smallest fw-800 text-main uppercase tracking-widest mb-1">{r.progress_percentage}% Pulse</div>
                                                    <div className="progress rounded-pill bg-surface shadow-inner" style={{ height: '5px', width: '90px' }}>
                                                        <div className={`progress-bar bg-${r.status === 'Completed' ? 'success' : 'primary'} shadow-sm`} style={{ width: `${r.progress_percentage}%` }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

const StudentDashboard = () => {
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
                        <Route index element={<motion.div key="overview" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><StudentOverview /></motion.div>} />
                        <Route path="new-request" element={<NewRequestForm />} />
                    </Routes>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default StudentDashboard;

