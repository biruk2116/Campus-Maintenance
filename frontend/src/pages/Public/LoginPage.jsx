import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
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

import maintHero from '../../assets/images/maint_hero.png';

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
        <div className="min-vh-100 d-flex flex-column text-main position-relative overflow-hidden bg-transparent">
            <div className="app-backdrop">
                <div className="fullscreen-bg-fixed" style={{ backgroundImage: `url(${maintHero})` }}></div>
                <div className="bg-overlay"></div>
            </div>

            <Navbar />

            <div className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
                <div className="container mt-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-5 col-md-8">
                            <div className="premium-card p-5 shadow-22xl bg-glass border-secondary border-opacity-10">
                                <div className="text-center mb-5">
                                    <div className="bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center p-4 rounded-circle text-primary mb-4 shadow-sm">
                                        {mode === 'change-password' ? <Shield size={34} /> : <KeyRound size={34} />}
                                    </div>
                                    <h2 className="fw-800 tracking-tighter mb-2 display-6">
                                        {mode === 'change-password' ? 'Change Temporary Password' : 'Sign In'}
                                    </h2>
                                    <p className="smallest text-muted fw-800 tracking-widest uppercase opacity-75">
                                        {mode === 'change-password'
                                            ? 'Use the temporary password once, then set your own'
                                            : 'Campus maintenance dashboard access'}
                                    </p>
                                </div>

                                <AnimatePresence mode="wait">
                                    {error && (
                                        <div className="alert alert-danger mb-4 p-3 rounded-4 d-flex align-items-center smallest fw-800 border-0 bg-danger bg-opacity-10 text-danger shadow-sm">
                                            <AlertCircle size={18} className="me-3" />
                                            {error}
                                        </div>
                                    )}
                                </AnimatePresence>

                                {mode === 'login' ? (
                                    <form onSubmit={handleLogin}>
                                        <div className="d-flex flex-column gap-4">
                                            <div>
                                                <label className="form-label smallest fw-800 text-muted mb-2 uppercase tracking-widest">User ID</label>
                                                <div className="position-relative">
                                                    <input
                                                        type="text"
                                                        className="form-control py-3 px-4 bg-surface border-secondary border-opacity-10 text-main rounded-4 fw-bold shadow-sm ps-5"
                                                        value={credentials.user_code}
                                                        onChange={(e) =>
                                                            setCredentials((prev) => ({
                                                                ...prev,
                                                                user_code: e.target.value.toUpperCase()
                                                            }))
                                                        }
                                                        required
                                                    />
                                                    <User size={18} className="position-absolute top-50 translate-middle-y start-0 ms-3 text-primary opacity-50" />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="form-label smallest fw-800 text-muted mb-2 uppercase tracking-widest">Password</label>
                                                <div className="position-relative">
                                                    <input
                                                        type="password"
                                                        className="form-control py-3 px-4 bg-surface border-secondary border-opacity-10 text-main rounded-4 fw-bold shadow-sm ps-5"
                                                        value={credentials.password}
                                                        onChange={(e) =>
                                                            setCredentials((prev) => ({
                                                                ...prev,
                                                                password: e.target.value
                                                            }))
                                                        }
                                                        required
                                                    />
                                                    <Lock size={18} className="position-absolute top-50 translate-middle-y start-0 ms-3 text-primary opacity-50" />
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                className="btn btn-primary w-100 py-3 fw-800 shadow-22xl d-flex align-items-center justify-content-center rounded-pill smallest tracking-widest uppercase mt-3"
                                                disabled={loading}
                                            >
                                                {loading ? <Loader2 size={18} className="me-2 animate-spin" /> : <LogIn size={18} className="me-2" />}
                                                {loading ? 'Signing in...' : 'Login'}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <form onSubmit={handlePasswordChange}>
                                        <div className="d-flex flex-column gap-4">
                                            <div>
                                                <label className="form-label smallest fw-800 text-muted mb-2 uppercase tracking-widest">User ID</label>
                                                <input
                                                    type="text"
                                                    className="form-control py-3 px-4 bg-surface border-secondary border-opacity-10 text-main rounded-4 fw-bold shadow-sm"
                                                    value={passwordForm.user_code}
                                                    disabled
                                                />
                                            </div>

                                            <div>
                                                <label className="form-label smallest fw-800 text-muted mb-2 uppercase tracking-widest">New Password</label>
                                                <input
                                                    type="password"
                                                    className="form-control py-3 px-4 bg-surface border-secondary border-opacity-10 text-main rounded-4 fw-bold shadow-sm"
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
                                                <label className="form-label smallest fw-800 text-muted mb-2 uppercase tracking-widest">Confirm New Password</label>
                                                <input
                                                    type="password"
                                                    className="form-control py-3 px-4 bg-surface border-secondary border-opacity-10 text-main rounded-4 fw-bold shadow-sm"
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

                                            <div className="d-flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setMode('login')}
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
                                                    {loading ? 'Saving...' : 'Change Password'}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PremiumModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="Password Updated"
                type="success"
                confirmText="Back to Login"
                onConfirm={() => setShowSuccessModal(false)}
            >
                <div className="text-center">
                    <div className="bg-success bg-opacity-10 p-4 rounded-circle text-success d-inline-block mb-4 shadow-sm">
                        <Shield size={48} />
                    </div>
                    <h4 className="fw-800 tracking-tighter mb-2 text-main">Password changed successfully</h4>
                    <p className="smallest text-muted fw-bold uppercase tracking-widest leading-relaxed">
                        Sign in again with the new password to open your dashboard.
                    </p>
                </div>
            </PremiumModal>
        </div>
    );
};

export default LoginPage;
