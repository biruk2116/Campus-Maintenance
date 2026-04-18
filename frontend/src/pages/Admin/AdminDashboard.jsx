import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../../components/Sidebar';
import axios from '../../api/axios';

// Assets
import dbuLogo from '../../assets/images/dbu-logo.png';
import techBg from '../../assets/images/tech-bg.png';

import { 
    Users, Trash2, Key, CheckCircle, Clock, TrendingUp, Plus, UserPlus,
    AlertCircle, Search, Bell, Settings, Download, Activity, Shield, Loader2, LogIn, RefreshCcw,
    Activity as Pulse
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
    return (
        <div className="d-flex justify-content-between align-items-center mb-5 mt-2">
            <div className="d-flex align-items-center">
                <img src={dbuLogo} alt="DBU" className="me-4 d-none d-md-block" style={{ height: '55px' }} />
                <div>
                    <h2 className="fw-800 tracking-tighter mb-1 text-main">{title}</h2>
                    <p className="text-muted smaller mb-0 fw-bold uppercase tracking-widest opacity-75">{subtitle}</p>
                </div>
            </div>
            <div className="d-flex align-items-center gap-4">
                <div className="position-relative">
                    <div className="bg-glass border border-secondary border-opacity-10 p-2 rounded-circle text-muted shadow-sm cursor-pointer d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                        <Bell size={22} className="animate-pulse" />
                    </div>
                    {unreadCount > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger border-2 border-surface shadow-lg" style={{ width: '20px', height: '20px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '800' }}>
                            {unreadCount}
                        </span>
                    )}
                </div>
                <div className="d-flex flex-column text-end d-none d-md-block">
                    <span className="smallest text-primary fw-800 uppercase tracking-widest mb-0">System Status</span>
                    <span className="smaller fw-bold text-main">Grid Secured</span>
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
        } catch (err) { console.error("Operational Fetch failed", err); }
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

    if (loading) return <div className="p-5 text-center"><Loader2 size={40} className="text-primary animate-spin" /></div>;

    return (
        <div className="container-fluid text-main">
            <DashboardHeader title="Strategic Command" subtitle="Institutional Infrastructure Pulse Hub" unreadCount={unreadCount} />
            
            <div className="row g-4 mb-5">
                {[
                    { label: 'Personnel Grid', count: usersCount, color: 'primary', icon: <Users size={24} />, note: 'Verified Assets' },
                    { label: 'Strategic Queue', count: stats.pending, color: 'danger', icon: <Clock size={24} />, note: 'Needs Action' },
                    { label: 'Tactical Pulse', count: Math.round(stats.pulse) + '%', color: 'success', icon: <Pulse size={24} />, note: 'Stability Index' },
                    { label: 'Field Assets', count: stats.active, color: 'warning', icon: <TrendingUp size={24} />, note: 'Engaged Units' }
                ].map((s, i) => (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} key={i} className="col-md-3">
                        <div className="premium-card p-4 border-secondary border-opacity-10 h-100 bg-glass text-center text-md-start">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className={`text-${s.color} bg-${s.color} bg-opacity-10 p-3 rounded-4 shadow-sm`}>{s.icon}</div>
                                <span className="smallest text-muted fw-800 uppercase tracking-widest">{s.note}</span>
                            </div>
                            <h1 className="fw-800 mb-1 text-main tracking-tighter" style={{ fontSize: '2.5rem' }}>{s.count}</h1>
                            <p className="text-muted smallest fw-800 uppercase mb-0 tracking-widest">{s.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="row g-4 mb-5">
                <div className="col-lg-8">
                    <div className="premium-card p-5 bg-glass border-secondary border-opacity-10 shadow-22xl h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-800 mb-0 tracking-tighter">Infrastructure Stability</h4>
                            <div className="bg-surface p-2 rounded-3 border border-secondary border-opacity-10 shadow-sm">
                                <span className="smallest text-muted fw-bold uppercase tracking-widest">Live Metrics</span>
                            </div>
                        </div>
                        <div style={{ height: '350px' }}>
                            <Bar 
                                data={{
                                    labels: ['Structural', 'ICT Grid', 'Plumbing', 'Electrical'],
                                    datasets: [{
                                        label: 'Maintenance Pulse',
                                        data: [65, 85, 45, 92],
                                        backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.6)' : 'rgba(59, 130, 246, 0.8)',
                                        borderRadius: 12,
                                        borderSkipped: false,
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: {
                                        y: { grid: { color: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }, ticks: { color: 'gray' } },
                                        x: { grid: { display: false }, ticks: { color: 'gray' } }
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="premium-card p-5 bg-glass border-secondary border-opacity-10 shadow-22xl h-100 text-center d-flex flex-column justify-content-center">
                        <div className="bg-primary bg-opacity-10 p-4 rounded-circle text-primary mx-auto mb-4" style={{ width: 'fit-content' }}><RefreshCcw size={32} className="animate-spin" /></div>
                        <h4 className="fw-800 mb-3 tracking-tighter">System Synchronized</h4>
                        <p className="smaller text-muted mb-4 fw-medium">All field engineer units are currently reporting at full signal strength.</p>
                        <button className="btn btn-primary w-100 rounded-pill py-3 fw-800 uppercase smallest tracking-widest">Scan Assets</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    return (
        <div className="min-vh-100 position-relative">
            {/* Premium Backdrop Restored */}
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
                        <Route index element={<motion.div key="analytics" initial={{opacity:0, scale:0.98}} animate={{opacity:1, scale:1}} exit={{opacity:0}}><AdminAnalytics /></motion.div>} />
                        <Route path="requests" element={<motion.div key="requests" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><div className="bg-glass p-5 rounded-5 border border-secondary border-opacity-10 shadow-22xl">Strategic Dispatch Registry Hub</div></motion.div>} />
                        <Route path="users" element={<motion.div key="users" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><div className="bg-glass p-5 rounded-5 border border-secondary border-opacity-10 shadow-22xl">Personnel Intelligence Command</div></motion.div>} />
                    </Routes>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminDashboard;
