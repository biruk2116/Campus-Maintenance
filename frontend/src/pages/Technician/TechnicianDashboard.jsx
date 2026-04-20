import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../../components/Sidebar';
import axios from '../../api/axios';
import PremiumModal from '../../components/PremiumModal';

// Assets
import dbuLogo from '../../assets/images/dbu-logo.png';
import techBg from '../../assets/images/tech-bg.png';

import { 
    CheckCircle, Clock, Activity, Shield, Loader2, LogIn, AlertCircle, Wrench, MapPin, ExternalLink,
    X, Save, MessageSquare, ChevronRight, BarChart3, Layers
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
                <div className="bg-glass border border-secondary border-opacity-10 p-2 rounded-circle text-success shadow-sm d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                    <Activity size={18} className="animate-pulse" />
                </div>
            </div>
        </div>
    );
};

const ProgressModal = ({ request, onClose, onUpdate }) => {
    const [progress, setProgress] = useState(request.progress_percentage || 0);
    const [remarks, setRemarks] = useState('');
    const [status, setStatus] = useState(request.status || 'In Progress');
    const [saving, setSaving] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const params = new URLSearchParams();
            params.append('request_id', request.id);
            params.append('progress_percentage', progress);
            params.append('remarks', remarks);
            params.append('status', status);

            const res = await axios.post('index.php?action=updateProgress', params);
            if (res.data.success) {
                onUpdate();
                onClose();
            }
        } catch (err) {
            console.error("Transmission Error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <PremiumModal
            isOpen={!!request}
            onClose={onClose}
            title="Strategic Restoration Update"
            maxWidth="650px"
            showFooter={false}
        >
            <div className="mb-4 p-4 rounded-4 bg-primary bg-opacity-5 border border-primary border-opacity-10">
                <div className="d-flex align-items-center gap-3 mb-2">
                    <Layers size={20} className="text-primary" />
                    <h5 className="fw-800 mb-0 text-main">{request.title}</h5>
                </div>
                <div className="d-flex align-items-center text-muted smallest fw-bold uppercase tracking-widest">
                    <MapPin size={12} className="me-2" /> {request.location}
                </div>
            </div>

            <form onSubmit={handleSave}>
                <div className="mb-5">
                    <div className="d-flex justify-content-between mb-3">
                        <label className="smallest fw-800 uppercase tracking-widest text-muted">Field Restoration Pulse</label>
                        <span className="badge bg-primary rounded-pill px-3 py-2 fw-800">{progress}%</span>
                    </div>
                    <div className="position-relative py-2">
                        <input 
                            type="range" 
                            className="form-range custom-range-tactical" 
                            min="0" max="100" 
                            value={progress}
                            onChange={(e) => setProgress(e.target.value)}
                        />
                        <div className="d-flex justify-content-between mt-2 smallest text-muted opacity-50 fw-bold uppercase">
                            <span>0%</span>
                            <span>50%</span>
                            <span>100%</span>
                        </div>
                    </div>
                </div>

                <div className="row g-4 mb-5">
                    <div className="col-md-12">
                        <label className="smallest fw-800 uppercase tracking-widest text-muted mb-2">Operational Status</label>
                        <select 
                            className="form-select py-3 px-4 bg-surface border-secondary border-opacity-10 rounded-4 fw-bold text-main"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="In Progress">Active Restoration</option>
                            <option value="On Hold">Tactical Delay</option>
                            <option value="Completed">Verified Normalcy</option>
                        </select>
                    </div>
                    <div className="col-md-12">
                        <label className="smallest fw-800 uppercase tracking-widest text-muted mb-2">Field Remarks & Logs</label>
                        <div className="position-relative">
                            <textarea 
                                className="form-control py-3 px-4 bg-surface border-secondary border-opacity-10 rounded-4 fw-bold text-main ps-5"
                                rows="3"
                                placeholder="Annotate technical actions taken..."
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                required
                            ></textarea>
                            <MessageSquare size={18} className="position-absolute top-0 start-0 m-3 mt-3 text-primary" />
                        </div>
                    </div>
                </div>

                <div className="d-flex gap-3">
                    <button type="button" onClick={onClose} className="btn btn-surface px-4 py-3 rounded-pill fw-800 uppercase smallest tracking-widest flex-grow-1 border-secondary border-opacity-10">Abort</button>
                    <button 
                        type="submit" 
                        className="btn btn-primary px-4 py-3 rounded-pill fw-800 uppercase smallest tracking-widest flex-grow-1 shadow-22xl d-flex align-items-center justify-content-center"
                        disabled={saving}
                    >
                        {saving ? <Loader2 size={18} className="me-2 animate-spin" /> : <Save size={18} className="me-2" />}
                        {saving ? 'Transmitting...' : 'Commit Status'}
                    </button>
                </div>
            </form>
        </PremiumModal>
    );
};

const TechnicianDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // FIX: Correct action name to match backend
            const res = await axios.get('index.php?action=getAssignedRequests');
            if (res.data.success) setRequests(res.data.data);
        } catch (err) { console.error("Field Sync failed"); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const activeRequests = requests.filter(r => r.status !== 'Completed');
    const historyRequests = requests.filter(r => r.status === 'Completed');

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
                <DashboardHeader title="Field Terminal" subtitle="Strategic Deployment Platform" />
                
                <div className="row g-4 mb-5">
                    <div className="col-lg-12">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="premium-card p-5 bg-glass border-secondary border-opacity-10 shadow-22xl">
                            <div className="d-flex justify-content-between align-items-center mb-5">
                                <div className="d-flex align-items-center">
                                    <div className="bg-primary bg-opacity-20 p-3 rounded-4 text-primary me-3 shadow-sm"><Wrench size={28} /></div>
                                    <div>
                                        <h4 className="fw-800 mb-0 tracking-tighter text-main">Assigned Operations</h4>
                                        <p className="smallest text-muted fw-800 uppercase tracking-widest mb-0">{activeRequests.length} Active Dispatches</p>
                                    </div>
                                </div>
                                <button onClick={fetchData} className={`btn btn-surface btn-sm p-3 rounded-circle border-secondary border-opacity-10 ${loading ? 'animate-spin' : ''}`}><Activity size={16} /></button>
                            </div>

                            <div className="table-responsive">
                                <table className="table align-middle table-borderless">
                                    <thead>
                                        <tr className="smallest text-uppercase text-muted fw-800 tracking-widest border-bottom border-secondary border-opacity-10">
                                            <th className="pb-3 text-main">Operational Area</th>
                                            <th className="pb-3 text-main">Site Identification</th>
                                            <th className="pb-3 text-main">Restoration Pulse</th>
                                            <th className="pb-3 text-end text-main">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="before-border-0">
                                        {loading ? (
                                            <tr><td colSpan="4" className="text-center py-5"><Loader2 size={30} className="text-primary animate-spin" /></td></tr>
                                        ) : activeRequests.length > 0 ? activeRequests.map((r, i) => (
                                            <tr key={r.id}>
                                                <td className="py-4">
                                                    <div className="fw-800 text-main mb-1">{r.title}</div>
                                                    <div className="smallest text-primary text-uppercase tracking-widest fw-800 bg-primary bg-opacity-10 d-inline-block px-2 py-1 rounded-pill">{r.category}</div>
                                                </td>
                                                <td className="py-4">
                                                    <div className="d-flex align-items-center text-muted fw-bold smaller uppercase tracking-wider">
                                                        <MapPin size={14} className="text-primary me-2" /> {r.location}
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <div className="d-flex align-items-center">
                                                        <span className={`status-badge bg-${r.status === 'In Progress' ? 'warning' : 'primary'} bg-opacity-10 text-${r.status === 'In Progress' ? 'warning' : 'primary'} me-3 shadow-sm`}>
                                                            {r.status}
                                                        </span>
                                                        <div className="smallest fw-800 text-main">{r.progress_percentage}%</div>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-end">
                                                    <button 
                                                        className="btn btn-primary rounded-pill px-4 py-2 shadow-22xl smallest fw-800 tracking-widest uppercase d-inline-flex align-items-center"
                                                        onClick={() => setSelectedRequest(r)}
                                                    >
                                                        Open Comm <ExternalLink size={14} className="ms-2" />
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="text-center py-5">
                                                    <div className="text-muted fw-bold py-4 opacity-50 uppercase tracking-widest smallest">No active dispatches assigned to your terminal.</div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="row g-4">
                    <div className="col-12">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="premium-card p-5 bg-glass border-secondary border-opacity-10 shadow-22xl">
                             <div className="d-flex align-items-center mb-5">
                                <div className="bg-success bg-opacity-10 p-3 rounded-4 text-success me-3 shadow-sm border border-success border-opacity-20"><CheckCircle size={28} /></div>
                                <div>
                                    <h4 className="fw-800 mb-0 tracking-tighter text-main">Verified Closures</h4>
                                    <p className="smallest text-muted fw-800 uppercase tracking-widest mb-0">{historyRequests.length} Archived Operations</p>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table align-middle table-borderless">
                                    <thead>
                                        <tr className="smallest text-uppercase text-muted fw-800 tracking-widest border-bottom border-secondary border-opacity-10">
                                            <th className="pb-3 text-main">Title</th>
                                            <th className="pb-3 text-main">Location</th>
                                            <th className="pb-3 text-main">Date</th>
                                            <th className="pb-3 text-end text-main">Operational Review</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {historyRequests.map((r, i) => (
                                            <tr key={i} className="border-bottom border-secondary border-opacity-5">
                                                <td className="py-4 fw-800 text-main">{r.title}</td>
                                                <td className="py-4 text-muted fw-bold smaller uppercase tracking-widest"><MapPin size={12} className="me-2 text-primary" />{r.location}</td>
                                                <td className="py-4 smallest text-muted uppercase fw-800 tracking-widest">{new Date(r.created_at).toLocaleDateString()}</td>
                                                <td className="py-4 text-end">
                                                    <span className="status-badge bg-success bg-opacity-10 text-success border border-success border-opacity-20">VERIFIED LOG</span>
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

            <AnimatePresence>
                {selectedRequest && (
                    <ProgressModal 
                        request={selectedRequest} 
                        onClose={() => setSelectedRequest(null)} 
                        onUpdate={fetchData} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default TechnicianDashboard;

