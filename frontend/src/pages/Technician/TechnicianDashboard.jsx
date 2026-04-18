import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../../components/Sidebar';
import axios from '../../api/axios';

// Assets
import dbuLogo from '../../assets/images/dbu-logo.png';
import techBg from '../../assets/images/tech-bg.png';

import { 
    CheckCircle, Clock, Activity, Shield, Loader2, LogIn, AlertCircle, Wrench, MapPin, ExternalLink
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
                    <Activity size={18} />
                </div>
            </div>
        </div>
    );
};

const TechnicianDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await axios.get('index.php?action=getTechnicianRequests');
            if (res.data.success) setRequests(res.data.data);
        } catch (err) { console.error("Field Sync failed"); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    if (loading) return <div className="p-5 text-center"><Loader2 size={40} className="text-primary animate-spin" /></div>;

    const activeRequests = requests.filter(r => r.status !== 'Completed');

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
                                        <h4 className="fw-800 mb-0 tracking-tighter">Assigned Operations</h4>
                                        <p className="smallest text-muted fw-800 uppercase tracking-widest mb-0">{activeRequests.length} Active Dispatches</p>
                                    </div>
                                </div>
                                <button onClick={fetchData} className="btn btn-surface btn-sm p-2 rounded-circle border-secondary border-opacity-10"><Activity size={16} /></button>
                            </div>

                            <div className="table-responsive">
                                <table className="table align-middle table-borderless">
                                    <thead>
                                        <tr className="smallest text-uppercase text-muted fw-800 tracking-widest border-bottom border-secondary border-opacity-10">
                                            <th className="pb-3">Operational Area</th>
                                            <th className="pb-3">Site Identification</th>
                                            <th className="pb-3">Status</th>
                                            <th className="pb-3 text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="before-border-0">
                                        {activeRequests.length > 0 ? activeRequests.map((r, i) => (
                                            <tr key={r.id}>
                                                <td className="py-4">
                                                    <div className="fw-800 text-main">{r.title}</div>
                                                    <div className="smallest text-muted text-uppercase tracking-widest fw-bold">{r.category}</div>
                                                </td>
                                                <td className="py-4">
                                                    <div className="d-flex align-items-center text-muted fw-medium smaller">
                                                        <MapPin size={14} className="text-primary me-2" /> {r.location}
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <span className={`status-badge bg-${r.status === 'In Progress' ? 'warning' : 'primary'} bg-opacity-10 text-${r.status === 'In Progress' ? 'warning' : 'primary'}`}>
                                                        {r.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-end">
                                                    <button className="btn btn-primary rounded-pill px-4 shadow-sm smallest fw-800 tracking-widest uppercase">
                                                        Open Comm <ExternalLink size={12} className="ms-2" />
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="text-center py-5">
                                                    <div className="text-muted fw-medium py-4">No active dispatches assigned to your terminal.</div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TechnicianDashboard;
