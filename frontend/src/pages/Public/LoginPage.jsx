import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import axios from '../../api/axios';

// Assets
import campusHero from '../../assets/images/campus-hero.png';

import { 
    LogIn, AlertCircle, Loader2, User, 
    Shield, Lock, Sun, Moon,
    Activity, ChevronRight, Save, X
} from 'lucide-react';

const LoginPage = () => {
    const [userCode, setUserCode] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
    
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    
    const { login, isDarkMode } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await login(userCode, password);
            if (res.data && res.data.action === 'change_password') {
                setPasswords({ ...passwords, old: password });
                setShowChangePassword(true);
            } else if (res.data && res.data.role) {
                navigate(`/${res.data.role.toLowerCase()}`);
            } else if (res.success && res.data) {
                navigate(`/${res.data.role.toLowerCase()}`);
            }
        } catch (err) {
            setError(err.message || 'Authentication Protocol Failed. Access Denied.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            setError("Security mismatch: Strategic keys do not match.");
            return;
        }
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('old_password', passwords.old);
            params.append('new_password', passwords.new);
            const res = await axios.post('index.php?action=changePassword', params);
            if (res.data.success) {
                setShowSuccessModal(true);
                setShowChangePassword(false);
                setError('');
            } else {
                setError(res.data.message || "Key update failed.");
            }
        } catch (err) {
            setError("Critical link failure during key update.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex flex-column text-main position-relative overflow-hidden bg-background">
            <div className="app-backdrop">
                <div 
                    className="fullscreen-bg-fixed" 
                    style={{ backgroundImage: `url(${campusHero})` }}
                ></div>
                <div className="bg-overlay"></div>
            </div>

            <Navbar />
            
            <div className="flex-grow-1 d-flex align-items-center justify-content-center py-5 mt-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-5 col-md-8">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="premium-card p-5 shadow-22xl bg-glass border-secondary border-opacity-10"
                            >
                                <div className="text-center mb-5">
                                    <div className="bg-primary bg-opacity-10 d-inline-block p-4 rounded-circle text-primary mb-4 shadow-sm">
                                        {showChangePassword ? <Shield size={36} className="animate-pulse" /> : <Lock size={36} />}
                                    </div>
                                    <h2 className="fw-800 tracking-tighter mb-2 display-6">
                                        {showChangePassword ? 'Security Protocol Update' : 'Operational Access'}
                                    </h2>
                                    <p className="smallest text-muted fw-800 tracking-widest uppercase opacity-75">
                                        {showChangePassword ? 'Mandatory Key Rotation Required' : 'Institutional Gateway Protocol 2.5'}
                                    </p>
                                </div>

                                <AnimatePresence mode="wait">
                                    {error && (
                                        <motion.div 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="alert alert-danger mb-4 p-3 rounded-4 d-flex align-items-center smallest fw-800 border-0 bg-danger bg-opacity-10 text-danger shadow-sm"
                                        >
                                            <AlertCircle size={18} className="me-3" /> {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {!showChangePassword ? (
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-4">
                                            <label className="form-label smallest fw-800 text-muted mb-2 uppercase tracking-widest">User Identification</label>
                                            <input 
                                                type="text" 
                                                className="form-control py-3 px-4 bg-surface bg-opacity-50 border-secondary border-opacity-10 text-main rounded-4 fw-bold shadow-sm" 
                                                placeholder="DBU-XXXX-XXXX"
                                                value={userCode}
                                                onChange={(e) => setUserCode(e.target.value)}
                                                required 
                                            />
                                        </div>
                                        <div className="mb-5">
                                            <label className="form-label smallest fw-800 text-muted mb-2 uppercase tracking-widest">Strategic Key</label>
                                            <input 
                                                type="password" 
                                                className="form-control py-3 px-4 bg-surface bg-opacity-50 border-secondary border-opacity-10 text-main rounded-4 fw-bold shadow-sm" 
                                                placeholder="••••••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required 
                                            />
                                        </div>
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary w-100 py-3 fw-800 shadow-22xl d-flex align-items-center justify-content-center rounded-pill smallest tracking-widest uppercase"
                                            disabled={loading}
                                        >
                                            {loading ? <Loader2 size={18} className="me-2 animate-spin" /> : <LogIn size={18} className="me-2" />}
                                            {loading ? 'Securing Link...' : 'Authorize Entry'}
                                        </button>
                                    </form>
                                ) : (
                                    <form onSubmit={handlePasswordChange}>
                                        <div className="mb-4">
                                            <label className="form-label smallest fw-800 text-muted mb-2 uppercase tracking-widest">New Strategic Key</label>
                                            <input 
                                                type="password" 
                                                className="form-control py-3 px-4 bg-surface bg-opacity-50 border-secondary border-opacity-10 text-main rounded-4 fw-bold shadow-sm" 
                                                placeholder="••••••••••••"
                                                value={passwords.new}
                                                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                                required 
                                            />
                                        </div>
                                        <div className="mb-5">
                                            <label className="form-label smallest fw-800 text-muted mb-2 uppercase tracking-widest">Confirm New Key</label>
                                            <input 
                                                type="password" 
                                                className="form-control py-3 px-4 bg-surface bg-opacity-50 border-secondary border-opacity-10 text-main rounded-4 fw-bold shadow-sm" 
                                                placeholder="••••••••••••"
                                                value={passwords.confirm}
                                                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                                                required 
                                            />
                                        </div>
                                        <div className="d-flex gap-3">
                                            <button 
                                                type="button" 
                                                onClick={() => setShowChangePassword(false)}
                                                className="btn btn-surface px-4 py-3 rounded-pill fw-800 uppercase smallest tracking-widest flex-grow-1 border-secondary border-opacity-10"
                                            >
                                                Back
                                            </button>
                                            <button 
                                                type="submit" 
                                                className="btn btn-primary px-4 py-3 rounded-pill fw-800 uppercase smallest tracking-widest flex-grow-1 shadow-22xl d-flex align-items-center justify-content-center"
                                                disabled={loading}
                                            >
                                                {loading ? <Loader2 size={18} className="me-2 animate-spin" /> : <Save size={18} className="me-2" />}
                                                {loading ? 'Updating...' : 'Set New Key'}
                                            </button>
                                        </div>
                                    </form>
                                )}
                                
                                <div className="mt-5 pt-5 border-top border-secondary border-opacity-10 text-center">
                                    <p className="smallest text-muted fw-800 mb-2 tracking-widest opacity-50 uppercase">Infrastructure Strategic Command</p>
                                    <div className="d-flex justify-content-center gap-4">
                                        <span className="smallest text-muted opacity-30">SECURE: AES-256</span>
                                        <span className="smallest text-muted opacity-30">GRID: 08-ALPHA</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            <PremiumModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="Security Protocol verified"
                type="success"
                confirmText="Return to Login"
                onConfirm={() => setShowSuccessModal(false)}
            >
                <div className="text-center">
                    <div className="bg-success bg-opacity-10 p-4 rounded-circle text-success d-inline-block mb-4 shadow-sm">
                        <Shield size={48} />
                    </div>
                    <h4 className="fw-800 tracking-tighter mb-2 text-main">Strategic Key Rotated</h4>
                    <p className="smallest text-muted fw-bold uppercase tracking-widest leading-relaxed">Security credentials have been successfully updated in the institutional grid. Please re-enter your new credentials to gain operational access.</p>
                </div>
            </PremiumModal>
        </div>
    );
};

export default LoginPage;
