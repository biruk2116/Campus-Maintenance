import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { getDashboardPathForRole, normalizeRole } from './utils/authRoutes';
import 'animate.css';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Public/Home';
import LoginPage from './pages/Public/LoginPage';
import StudentDashboard from './pages/Student/StudentDashboard';
import TechnicianDashboard from './pages/Technician/TechnicianDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';

// Scroll to Top on Route Change
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useAuth();

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
    
    if (!user) return <Navigate to="/login" replace />;
    
    const allowedRoles = Array.isArray(role) ? role.map(normalizeRole) : [normalizeRole(role)];
    if (role && !allowedRoles.includes(normalizeRole(user.role))) {
        return <Navigate to={getDashboardPathForRole(user.role) || '/'} replace />;
    }

    return children;
};

function AnimatedRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/Home" element={<Navigate to="/" replace />} />
            <Route path="/about-us" element={<Home />} />
            <Route path="/About-us" element={<Navigate to="/about-us" replace />} />
            <Route path="/services" element={<Home />} />
            <Route path="/Services" element={<Navigate to="/services" replace />} />
            <Route path="/features" element={<Home />} />
            <Route path="/Features" element={<Navigate to="/features" replace />} />
            <Route path="/contacts" element={<Home />} />
            <Route path="/Contacts" element={<Navigate to="/contacts" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/landing" element={<Home />} />

            <Route path="/student/*" element={
                <ProtectedRoute role={['student', 'staff']}>
                    <StudentDashboard />
                </ProtectedRoute>
            } />

            <Route path="/technician/*" element={
                <ProtectedRoute role="technician">
                    <TechnicianDashboard />
                </ProtectedRoute>
            } />

            <Route path="/admin/*" element={
                <ProtectedRoute role="admin">
                    <AdminDashboard />
                </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <ThemeProvider>
            <Router>
                <Navbar />
                <div className="pt-16">
                    <ScrollToTop />
                    <AnimatedRoutes />
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;
