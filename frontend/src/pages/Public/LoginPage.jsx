import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from './LandingPage';
import { 
    LogIn, AlertCircle, Loader2, User, 
    ShieldCheck, Key, ArrowRight, Sun, Moon
} from 'lucide-react';

const LoginPage = () => {
    const [userCode, setUserCode] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login, isDarkMode, toggleDarkMode } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (code, pass) => {
        setError('');
        setLoading(true);
        try {
            const res = await login(code, pass);
            navigate(`/${res.role}`);
        } catch (err) {
            setError(err.message || 'Authentication failed. Access denied.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin(userCode, password);
    };

    const demoAccounts = [
        { role: 'admin', icon: <ShieldCheck />, label: 'Administrator Unity', code: 'ADMIN001', pass: 'admin123', color: 'primary' },
        { role: 'student', icon: <User />, label: 'Student Portal', code: 'DBU1601069', pass: 'student123', color: 'success' },
        { role: 'technician', icon: <Key />, label: 'Field Engineer Unit', code: 'TECH001', pass: 'tech123', color: 'warning' }
    ];

    return (
        <div className="min-vh-100 d-flex flex-column bg-background transition-all">
            <Navbar />
            <div className="flex-grow-1 d-flex align-items-center justify-content-center py-5 mt-5">
                <div className="container">
                    <div className="row justify-content-center align-items-center g-5">
                        <div className="col-lg-5">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="premium-card p-5 shadow-2xl bg-surface border-secondary border-opacity-10"
                            >
                                <div className="text-center mb-5">
                                    <h2 className="fw-bold tracking-tighter mb-1 text-main">Central Authority</h2>
                                    <p className="smaller text-muted fw-medium">Infrastructure Management & Operations Portal</p>
                                </div>

                                <AnimatePresence mode="wait">
                                    {error && (
                                        <motion.div 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="alert alert-danger bg-danger bg-opacity-10 border-danger border-opacity-20 d-flex align-items-center mb-4" 
                                            role="alert"
                                        >
                                            <AlertCircle size={16} className="me-2 flex-shrink-0" />
                                            <div className="smaller fw-bold">{error}</div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label className="form-label smaller fw-bold text-muted mb-2 uppercase">Official Member Code</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            placeholder="DBU-XXXXXXX"
                                            value={userCode}
                                            onChange={(e) => setUserCode(e.target.value)}
                                            required 
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between mb-2">
                                            <label className="form-label smaller fw-bold text-muted uppercase">Access Key</label>
                                            <a href="#" className="smaller text-primary fw-bold text-decoration-none">Lost Access?</a>
                                        </div>
                                        <input 
                                            type="password" 
                                            className="form-control" 
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required 
                                        />
                                    </div>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary w-100 py-3 fw-bold shadow-lg d-flex align-items-center justify-content-center"
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 size={18} className="me-2 animate-spin" /> : <LogIn size={18} className="me-2" />}
                                        {loading ? 'Verifying Identity...' : 'Confirm Identity'}
                                    </button>
                                </form>
                            </motion.div>
                        </div>

                        <div className="col-lg-5">
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="mb-4 d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="fw-bold text-main mb-1">Accelerated Access</h5>
                                        <p className="smaller text-muted mb-0">Switch between verified demo units.</p>
                                    </div>
                                    <button onClick={toggleDarkMode} className="btn btn-surface p-2 rounded-circle shadow-sm">
                                        {isDarkMode ? <Sun size={18} className="text-warning" /> : <Moon size={18} className="text-primary" />}
                                    </button>
                                </div>

                                <div className="d-flex flex-column gap-3">
                                    {demoAccounts.map((account, i) => (
                                        <motion.button
                                            key={i}
                                            whileHover={{ x: 10 }}
                                            onClick={() => handleLogin(account.code, account.pass)}
                                            className="premium-card p-4 border-secondary border-opacity-10 bg-surface text-start d-flex align-items-center w-100 shadow-sm"
                                            disabled={loading}
                                        >
                                            <div className={`bg-${account.color} bg-opacity-10 p-3 rounded-3 me-3 text-${account.color}`}>
                                                {account.icon}
                                            </div>
                                            <div className="flex-grow-1">
                                                <h6 className="fw-bold mb-1 smaller text-main">{account.label}</h6>
                                                <div className="d-flex align-items-center text-muted smaller fw-medium italic opacity-70">
                                                    <ArrowRight size={12} className="me-1" /> Provisioned Access
                                                </div>
                                            </div>
                                            <div className="smaller fw-bold text-primary opacity-50 px-2">ENTRY</div>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
            
            <footer className="py-4 text-center text-muted smaller bg-surface-hover border-top border-secondary border-opacity-10">
                <p className="mb-0 fw-bold opacity-60">ADMINISTRATIVE PROTOCOL ACTIVE • DEBRE BIRHAN UNIVERSITY</p>
                <div className="mt-2 text-primary opacity-40 italic">Global Environment v3.0.0-Adaptive</div>
            </footer>
        </div>
    );
};

export default LoginPage;
