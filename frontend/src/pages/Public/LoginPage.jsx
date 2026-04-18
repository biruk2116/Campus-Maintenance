import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from './LandingPage';
import { 
    LogIn, AlertCircle, Loader2, User, 
    ShieldCheck, Key, ArrowRight, Sun, Moon,
    Zap, Terminal, Disc, Activity
} from 'lucide-react';

const LoginPage = () => {
    const [userCode, setUserCode] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showReset, setShowReset] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const { login, updatePassword, isDarkMode, toggleDarkMode } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (code, pass) => {
        setError('');
        setLoading(true);
        try {
            const res = await login(code, pass);
            if (res.data && res.data.action === 'change_password') {
                setShowReset(true);
            } else if (res.data && res.data.role) {
                navigate(`/${res.data.role.toLowerCase()}`);
            }
        } catch (err) {
            setError(err.message || 'Authentication failed. Access denied.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Account keys do not match.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            await updatePassword(password, newPassword);
            const res = await login(userCode, newPassword);
            if (res.data && res.data.role) {
                navigate(`/${res.data.role.toLowerCase()}`);
            }
        } catch (err) {
            setError(err.message || 'Security update failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin(userCode, password);
    };

    return (
        <div className="min-vh-100 d-flex flex-column bg-background transition-all text-main">
            <Navbar />
            <div className="flex-grow-1 d-flex align-items-center justify-content-center py-5 mt-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-5">
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="premium-card p-5 shadow-22xl bg-surface border-secondary border-opacity-10"
                            >
                                <AnimatePresence mode="wait">
                                    {!showReset ? (
                                        <motion.div 
                                            key="login-form"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                        >
                                            <div className="text-center mb-5">
                                                <div className="bg-primary bg-opacity-10 d-inline-block p-3 rounded-4 text-primary mb-3">
                                                    <Terminal size={32} />
                                                </div>
                                                <h2 className="fw-bold tracking-tighter mb-1">Central Identification</h2>
                                                <p className="smaller text-muted fw-medium">Manual Institutional Protocol</p>
                                            </div>

                                            {error && (
                                                <motion.div 
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="alert alert-danger mb-4 p-3 rounded-4 d-flex align-items-center smaller fw-bold" 
                                                >
                                                    <AlertCircle size={16} className="me-2" /> {error}
                                                </motion.div>
                                            )}

                                            <form onSubmit={handleSubmit}>
                                                <div className="mb-4">
                                                    <label className="form-label smaller fw-bold text-muted mb-2 uppercase tracking-widest">Member Identification</label>
                                                    <input 
                                                        type="text" 
                                                        className="form-control py-3" 
                                                        placeholder="DBU-XXXXXXX"
                                                        value={userCode}
                                                        onChange={(e) => setUserCode(e.target.value)}
                                                        required 
                                                    />
                                                </div>
                                                <div className="mb-5">
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <label className="form-label smaller fw-bold text-muted uppercase tracking-widest">Access Key</label>
                                                        <a href="#" className="smallest text-primary fw-bold text-decoration-none">FORGOT?</a>
                                                    </div>
                                                    <input 
                                                        type="password" 
                                                        className="form-control py-3" 
                                                        placeholder="••••••••"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        required 
                                                    />
                                                </div>
                                                <button 
                                                    type="submit" 
                                                    className="btn btn-primary w-100 py-3 fw-bold shadow-lg d-flex align-items-center justify-content-center rounded-pill"
                                                    disabled={loading}
                                                >
                                                    {loading ? <Loader2 size={18} className="me-2 animate-spin" /> : <LogIn size={18} className="me-2" />}
                                                    {loading ? 'SYNCHRONIZING...' : 'AUTHORIZE ENTRY'}
                                                </button>
                                            </form>
                                        </motion.div>
                                    ) : (
                                        <motion.div 
                                            key="reset-form"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                        >
                                            <div className="text-center mb-5">
                                                <div className="bg-warning bg-opacity-10 d-inline-block p-3 rounded-4 text-warning mb-3">
                                                    <ShieldCheck size={32} />
                                                </div>
                                                <h2 className="fw-bold tracking-tighter mb-1">Security Upgrade</h2>
                                                <p className="smaller text-muted fw-medium">Initial access detected. Personalize your key.</p>
                                            </div>

                                            {error && (
                                                <div className="alert alert-danger mb-4 p-3 rounded-4 smaller fw-bold">
                                                    <AlertCircle size={16} className="me-2" /> {error}
                                                </div>
                                            )}

                                            <form onSubmit={handleReset}>
                                                <div className="mb-4">
                                                    <label className="form-label smaller fw-bold text-muted mb-2 uppercase tracking-widest">New Private Key</label>
                                                    <input 
                                                        type="password" 
                                                        className="form-control py-3" 
                                                        placeholder="••••••••"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        required 
                                                    />
                                                </div>
                                                <div className="mb-5">
                                                    <label className="form-label smaller fw-bold text-muted mb-2 uppercase tracking-widest">Confirm Security Pattern</label>
                                                    <input 
                                                        type="password" 
                                                        className="form-control py-3" 
                                                        placeholder="••••••••"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        required 
                                                    />
                                                </div>
                                                <button 
                                                    type="submit" 
                                                    className="btn btn-warning w-100 py-3 fw-bold shadow-lg d-flex align-items-center justify-content-center rounded-pill text-white"
                                                    disabled={loading}
                                                >
                                                    {loading ? <Loader2 size={18} className="me-2 animate-spin" /> : <ShieldCheck size={18} className="me-2" />}
                                                    {loading ? 'UPGRADING...' : 'COMMIT SECURITY PATTERN'}
                                                </button>
                                            </form>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                
                                <div className="mt-5 pt-4 border-top border-secondary border-opacity-10 text-center">
                                    <p className="smallest text-muted fw-bold mb-0 tracking-widest opacity-50">GOVERNED BY DEBRE BIRHAN UNIVERSITY INFRASTRUCTURE COMMAND</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
            
            <footer className="py-4 text-center text-muted smallest bg-surface border-top border-secondary border-opacity-10">
                <div className="container d-flex justify-content-between align-items-center">
                    <p className="mb-0 fw-bold opacity-40 uppercase tracking-widest">Protocol Active • Debre Birhan University</p>
                    <div className="d-flex gap-4 opacity-40">
                        <span className="fw-bold">v3.1.2-LOGISTICS</span>
                        <Disc size={14} className="animate-spin" />
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LoginPage;
