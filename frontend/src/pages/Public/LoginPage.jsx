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
    User,
    Sparkles
} from 'lucide-react';

import Navbar from '../../components/Navbar';
import PremiumModal from '../../components/PremiumModal';
import { useAuth } from '../../context/AuthContext';
import { getDashboardPathForRole } from '../../utils/authRoutes';

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
            const dashboardPath = getDashboardPathForRole(user.role);

            if (dashboardPath) {
                navigate(dashboardPath, { replace: true });
            }
        }
    }, [user, navigate]);

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

            const dashboardPath = getDashboardPathForRole(payload.role);
            if (!dashboardPath) {
                throw new Error('Your account role is not allowed to access a dashboard');
            }

            navigate(dashboardPath, { replace: true });
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
        <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/40 transition-colors duration-300">
            
            {/* Subtle Background Elements - Light Mode */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Soft gradient orbs - Light Mode */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-200/40 dark:bg-indigo-600/10 blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] rounded-full bg-purple-200/40 dark:bg-purple-600/10 blur-[100px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-cyan-200/20 dark:bg-cyan-600/5 blur-[120px]" />
                
                {/* Subtle grid pattern */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='none' stroke='%236366f1' stroke-width='0.5' stroke-opacity='0.05' d='M10 0 L10 100 M20 0 L20 100 M30 0 L30 100 M40 0 L40 100 M50 0 L50 100 M60 0 L60 100 M70 0 L70 100 M80 0 L80 100 M90 0 L90 100 M0 10 L100 10 M0 20 L100 20 M0 30 L100 30 M0 40 L100 40 M0 50 L100 50 M0 60 L100 60 M0 70 L100 70 M0 80 L100 80 M0 90 L100 90'/%3E%3C/svg%3E')] opacity-30 dark:opacity-10" />
                
                {/* Subtle floating particles - Light/Dark aware */}
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-indigo-400/30 dark:bg-indigo-400/20"
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0, 0.5, 0],
                        }}
                        transition={{
                            duration: 4 + (i % 3),
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeInOut"
                        }}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </div>

            <Navbar />

            <div className="flex-1 flex items-center justify-center py-20 px-4 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-indigo-100/50 dark:border-indigo-800/50 p-8 md:p-10 transition-all duration-300 hover:shadow-2xl">
                        
                        <div className="text-center mb-8">
                            <motion.div 
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
                                className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-600 dark:text-indigo-400 mb-6"
                            >
                                {mode === 'change-password' ? <Shield size={32} /> : <KeyRound size={32} />}
                            </motion.div>
                            
                            <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight mb-2">
                                {mode === 'change-password' ? 'Change Password' : 'Welcome Back'}
                            </h2>
                            
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {mode === 'change-password'
                                    ? 'Set your own secure password'
                                    : 'Sign in to access your dashboard'}
                            </p>
                        </div>

                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mb-6 p-3 rounded-lg flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm border border-red-200 dark:border-red-800"
                                >
                                    <AlertCircle size={16} />
                                    <span>{error}</span>
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
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">User ID</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="w-full py-3 px-4 pl-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
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
                                            <User size={18} className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400 dark:text-slate-500" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                className="w-full py-3 px-4 pl-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
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
                                            <Lock size={18} className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400 dark:text-slate-500" />
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-indigo-500/25"
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
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
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">User ID</label>
                                        <input
                                            type="text"
                                            className="w-full py-3 px-4 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-xl cursor-not-allowed"
                                            value={passwordForm.user_code}
                                            disabled
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                                        <input
                                            type="password"
                                            className="w-full py-3 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
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
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Confirm New Password</label>
                                        <input
                                            type="password"
                                            className="w-full py-3 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
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

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setMode('login')}
                                            className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                                        >
                                            Back
                                        </button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                                            disabled={loading}
                                        >
                                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
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
                        className="inline-flex p-4 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-4"
                    >
                        <Shield size={40} />
                    </motion.div>
                    <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Password Changed Successfully</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Your password has been updated. You can now sign in with your new credentials.
                    </p>
                </div>
            </PremiumModal>
        </div>
    );
};

export default LoginPage;
