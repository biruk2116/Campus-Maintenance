import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../../components/Sidebar';
import axios from '../../api/axios';

// Assets
import dbuLogo from '../../assets/images/dbu-logo.png';
import techBg from '../../assets/images/tech-bg.png';

import { 
    Plus, ClipboardList, Clock, CheckCircle, 
    AlertCircle, Search, Bell, Settings, Activity, Shield, Loader2, LogIn, ArrowUpRight
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
                <div className="bg-glass border border-secondary border-opacity-10 p-2 rounded-circle text-muted shadow-sm cursor-pointer d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                    <Bell size={18} />
                </div>
            </div>
        </div>
    );
};

const StudentOverview = () => {
    return (
        <div className="container-fluid text-main">
            <DashboardHeader title="Command Hub" subtitle="Student Infrastructure Gateway" />
            <div className="row g-4">
                <div className="col-md-5">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="premium-card p-5 h-100 bg-glass shadow-22xl border-secondary border-opacity-10">
                        <div className="d-flex justify-content-between align-items-center mb-5">
                            <div className="bg-primary bg-opacity-20 p-3 rounded-4 text-primary shadow-sm"><Activity size={28} /></div>
                            <span className="smallest text-primary fw-800 uppercase tracking-widest">Active Link</span>
                        </div>
                        <h3 className="fw-800 mb-4 tracking-tighter">Campus Integrity Monitor</h3>
                        <p className="text-muted fw-medium mb-5">Monitor the engineering pulse of the university. Your reports directly impact the DBU stability grid.</p>
                        <hr className="border-secondary border-opacity-10 mb-5" />
                        <div className="d-flex flex-column gap-3">
                            {[
                                { label: 'Assigned Priority', icon: <Shield size={16} /> },
                                { label: 'Strategic Dispatch', icon: <Clock size={16} /> }
                            ].map((item, i) => (
                                <div key={i} className="smallest fw-800 text-muted uppercase tracking-widest d-flex align-items-center">
                                    <span className="text-primary me-2">{item.icon}</span> {item.label}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
                <div className="col-md-7">
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="premium-card p-5 h-100 bg-primary bg-opacity-5 border-primary border-opacity-10 shadow-22xl text-center d-flex flex-column align-items-center justify-content-center">
                        <div className="bg-primary p-4 rounded-circle text-white mb-5 shadow-22xl animate-pulse">
                            <Plus size={40} />
                        </div>
                        <h2 className="display-5 fw-800 mb-4 tracking-tighter">Log New Discovery</h2>
                        <p className="text-muted lead mb-5 mx-auto fw-medium" style={{ maxWidth: '400px' }}>Identify a facility operational fault and notify the DBU infrastructure command for tactical restoration.</p>
                        <Link to="new-request" className="btn btn-primary btn-lg px-5 py-3 rounded-pill fw-800 shadow-22xl d-flex align-items-center smallest tracking-widest uppercase">
                            Initialize Dispatch <ArrowUpRight size={18} className="ms-2" />
                        </Link>
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
                        <Route path="new-request" element={<motion.div key="new" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><div className="bg-glass p-5 rounded-5 border border-secondary border-opacity-10 shadow-22xl text-center"><h3 className="fw-800 tracking-tighter">Strategic Fault Identification Module</h3></div></motion.div>} />
                    </Routes>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default StudentDashboard;
