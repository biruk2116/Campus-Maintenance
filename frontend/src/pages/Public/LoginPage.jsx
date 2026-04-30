import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertCircle,
    KeyRound,
    Loader2,
    Lock,
    LogIn,
    Save,
    Shield,
    User
} from 'lucide-react';

import Navbar from '../../components/Navbar';
import PremiumModal from '../../components/PremiumModal';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const { user, login, updatePassword } = useAuth();

    const [credentials, setCredentials] = useState({ user_code: '', password: '' });
    const [passwordForm, setPasswordForm] = useState({
        user_code: '',
        old_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [mode, setMode] = useState('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        if (user?.role) {
            navigate(`/${user.role}`);
        }
    }, [navigate, user]);

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await login(credentials.user_code, credentials.password);
            const payload = res.data || {};

            if (payload.must_change_password === 1 || payload.action === 'change_password') {
                setPasswordForm({
                    user_code: payload.user_code || credentials.user_code.toUpperCase(),
                    old_password: credentials.password,
                    new_password: '',
                    confirm_password: ''
                });
                setMode('change-password');
                return;
            }

            if (payload.role) {
                navigate(`/${payload.role}`);
            }
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (event) => {
        event.preventDefault();

        if (passwordForm.new_password !== passwordForm.confirm_password) {
            setError('New password and confirmation do not match');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await updatePassword({
                user_code: passwordForm.user_code,
                old_password: passwordForm.old_password,
                new_password: passwordForm.new_password
            });

            setMode('login');
            setCredentials({ user_code: passwordForm.user_code, password: '' });
            setPasswordForm({
                user_code: '',
                old_password: '',
                new_password: '',
                confirm_password: ''
            });
            setShowSuccessModal(true);
        } catch (err) {
            setError(err.message || 'Password change failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            {/* BACKGROUND BLOBS */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] dark:bg-indigo-600/20"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px] dark:bg-blue-600/20"></div>
                
                {/* Subtle grid pattern overlay */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-5 mix-blend-overlay"></div>
            </div>

            <Navbar />

            <div className="flex-1 flex items-center justify-center py-20 px-4 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                    className="w-full max-w-md"
                >
                    <div className="glass-card p-8 md:p-10 shadow-2xl">
                        <div className="text-center mb-8">
                            <motion.div 
                                initial={{ rotate: -180, scale: 0 }}
                                animate={{ rotate: 0, scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                                className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 text-primary mb-6 shadow-inner border border-primary/20"
                            >
                                {mode === 'change-password' ? <Shield size={36} /> : <KeyRound size={36} />}
                            </motion.div>
                            <h2 className="text-3xl font-extrabold text-textPrimary tracking-tight mb-3">
                                {mode === 'change-password' ? 'Change Password' : 'Welcome Back'}
                            </h2>
                            <p className="text-xs font-bold text-textSecondary uppercase tracking-widest">
                                {mode === 'change-password'
                                    ? 'Set your own secure password'
                                    : 'Sign in to access your dashboard'}
                            </p>
                        </div>

                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0, y: -10 }}
                                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                                    exit={{ opacity: 0, height: 0, y: -10 }}
                                    className="mb-6 p-4 rounded-xl flex items-center bg-danger/10 text-danger text-sm font-bold border border-danger/20"
                                >
                                    <AlertCircle size={20} className="mr-3 shrink-0" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence mode="wait">
                            {mode === 'login' ? (
                                <motion.form 
                                    key="login"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    onSubmit={handleLogin} 
                                    className="flex flex-col gap-5"
                                >
                                    <div>
                                        <label className="block text-xs font-bold text-textSecondary mb-2 uppercase tracking-widest">User ID</label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                className="w-full py-3 px-4 pl-12 bg-surface/50 border border-overlay/10 text-textPrimary rounded-xl font-bold placeholder-textSecondary/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
                                                value={credentials.user_code}
                                                onChange={(e) =>
                                                    setCredentials((prev) => ({
                                                        ...prev,
                                                        user_code: e.target.value.toUpperCase()
                                                    }))
                                                }
                                                placeholder="Enter your ID"
                                                required
                                            />
                                            <User size={20} className="absolute top-1/2 -translate-y-1/2 left-4 text-textSecondary group-focus-within:text-primary transition-colors" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-textSecondary mb-2 uppercase tracking-widest">Password</label>
                                        <div className="relative group">
                                            <input
                                                type="password"
                                                className="w-full py-3 px-4 pl-12 bg-surface/50 border border-overlay/10 text-textPrimary rounded-xl font-bold placeholder-textSecondary/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
                                                value={credentials.password}
                                                onChange={(e) =>
                                                    setCredentials((prev) => ({
                                                        ...prev,
                                                        password: e.target.value
                                                    }))
                                                }
                                                placeholder="••••••••"
                                                required
                                            />
                                            <Lock size={20} className="absolute top-1/2 -translate-y-1/2 left-4 text-textSecondary group-focus-within:text-primary transition-colors" />
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="btn-primary w-full py-4 mt-2 flex items-center justify-center text-sm font-extrabold tracking-widest uppercase rounded-xl"
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 size={20} className="mr-3 animate-spin" /> : <LogIn size={20} className="mr-3" />}
                                        {loading ? 'Signing in...' : 'Sign In'}
                                    </motion.button>
                                </motion.form>
                            ) : (
                                <motion.form 
                                    key="password"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    onSubmit={handlePasswordChange} 
                                    className="flex flex-col gap-5"
                                >
                                    <div>
                                        <label className="block text-xs font-bold text-textSecondary mb-2 uppercase tracking-widest">User ID</label>
                                        <input
                                            type="text"
                                            className="w-full py-3 px-4 bg-surface/30 border border-overlay/5 text-textSecondary rounded-xl font-bold cursor-not-allowed"
                                            value={passwordForm.user_code}
                                            disabled
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-textSecondary mb-2 uppercase tracking-widest">New Password</label>
                                        <input
                                            type="password"
                                            className="w-full py-3 px-4 bg-surface/50 border border-overlay/10 text-textPrimary rounded-xl font-bold focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
                                            value={passwordForm.new_password}
                                            onChange={(e) =>
                                                setPasswordForm((prev) => ({
                                                    ...prev,
                                                    new_password: e.target.value
                                                }))
                                            }
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-textSecondary mb-2 uppercase tracking-widest">Confirm New Password</label>
                                        <input
                                            type="password"
                                            className="w-full py-3 px-4 bg-surface/50 border border-overlay/10 text-textPrimary rounded-xl font-bold focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
                                            value={passwordForm.confirm_password}
                                            onChange={(e) =>
                                                setPasswordForm((prev) => ({
                                                    ...prev,
                                                    confirm_password: e.target.value
                                                }))
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="flex gap-4 mt-2">
                                        <button
                                            type="button"
                                            onClick={() => setMode('login')}
                                            className="btn-secondary flex-1 py-4 text-xs font-extrabold tracking-widest uppercase rounded-xl"
                                        >
                                            Back
                                        </button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            className="btn-primary flex-1 py-4 flex items-center justify-center text-xs font-extrabold tracking-widest uppercase rounded-xl"
                                            disabled={loading}
                                        >
                                            {loading ? <Loader2 size={18} className="mr-2 animate-spin" /> : <Save size={18} className="mr-2" />}
                                            {loading ? 'Saving...' : 'Update'}
                                        </motion.button>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>

            <PremiumModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="Password Updated"
                type="success"
                confirmText="Back to Login"
                onConfirm={() => setShowSuccessModal(false)}
            >
                <div className="text-center py-4">
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="inline-flex p-5 rounded-full bg-success/20 text-success mb-6 shadow-inner border border-success/20"
                    >
                        <Shield size={48} />
                    </motion.div>
                    <h4 className="text-2xl font-extrabold tracking-tight mb-3 text-textPrimary">Password Changed</h4>
                    <p className="text-sm text-textSecondary font-medium leading-relaxed max-w-xs mx-auto">
                        Your password has been successfully updated. You can now sign in with your new credentials.
                    </p>
                </div>
            </PremiumModal>
        </div>
    );
};

export default LoginPage;

