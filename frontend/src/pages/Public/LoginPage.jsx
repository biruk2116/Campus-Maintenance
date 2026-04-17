import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from './LandingPage';
import { 
    LogIn, AlertCircle, Loader2, User, 
    ShieldCheck, Key, ArrowRight 
} from 'lucide-react';

const LoginPage = () => {
    const [userCode, setUserCode] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
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
        { role: 'admin', icon: <ShieldCheck />, label: 'Administrator', code: 'ADMIN001', pass: 'admin123', color: 'text-indigo' },
        { role: 'student', icon: <User />, label: 'Student Portal', code: 'DBU1601069', pass: 'student123', color: 'text-primary' },
        { role: 'technician', icon: <Key />, label: 'Field Engineer', code: 'TECH001', pass: 'tech123', color: 'text-success' }
    ];

    return (
        <div className="min-vh-100 d-flex flex-column bg-background text-white overflow-hidden">
            <Navbar />
            <div className="flex-grow-1 d-flex align-items-center justify-content-center py-5 mt-5">
                <div className="container">
                    <div className="row justify-content-center align-items-center g-5">
                        <div className="col-md-5 col-lg-4">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="premium-card p-4 p-lg-5 shadow-2xl border-secondary border-opacity-10 bg-surface"
                            >
                                <div className="text-center mb-5">
                                    <h2 className="fw-bold tracking-tighter mb-1">Welcome Back</h2>
                                    <p className="smaller text-muted">Enter credentials to access maintenance hub</p>
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
                                            <div className="smaller fw-medium">{error}</div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label smaller fw-bold text-muted mb-2">Member Code</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            placeholder="e.g. DBU1601069"
                                            value={userCode}
                                            onChange={(e) => setUserCode(e.target.value)}
                                            required 
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label smaller fw-bold text-muted mb-2">Access Key</label>
                                        <input 
                                            type="password" 
                                            className="form-control" 
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required 
                                        />
                                    </div>
                                    <motion.button 
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        type="submit" 
                                        className="btn btn-primary w-100 py-3 fw-bold shadow-lg d-flex align-items-center justify-content-center mb-0"
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 size={18} className="me-2 animate-spin" /> : <LogIn size={18} className="me-2" />}
                                        {loading ? 'Authenticating...' : 'Sign In'}
                                    </motion.button>
                                </form>
                            </motion.div>
                        </div>

                        <div className="col-md-5 col-lg-4">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="mb-4">
                                    <h5 className="fw-bold text-primary mb-1">Accelerated Demo</h5>
                                    <p className="smaller text-muted">Test-drive the system with specialized roles.</p>
                                </div>

                                <div className="d-flex flex-column gap-3">
                                    {demoAccounts.map((account, i) => (
                                        <motion.button
                                            key={i}
                                            whileHover={{ x: 8, borderColor: '#3b82f6' }}
                                            onClick={() => handleLogin(account.code, account.pass)}
                                            className="premium-card p-3 border-secondary border-opacity-10 bg-surface bg-opacity-50 text-start d-flex align-items-center w-100"
                                            disabled={loading}
                                        >
                                            <div className={`bg-primary bg-opacity-10 p-2 rounded-3 me-3 ${account.color}`}>
                                                {account.icon}
                                            </div>
                                            <div className="flex-grow-1">
                                                <h6 className="fw-bold mb-0 smaller">{account.label}</h6>
                                                <p className="smaller text-muted mb-0 opacity-50">Code: {account.code}</p>
                                            </div>
                                            <ArrowRight size={14} className="text-muted" />
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="py-4 text-center text-muted smaller bg-black bg-opacity-20 border-top border-secondary border-opacity-10">
                © 2026 Debre Birhan University. Optimized Infrastructure Management.
            </footer>
        </div>
    );
};

export default LoginPage;
