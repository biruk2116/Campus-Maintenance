import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import 'animate.css';

// Pages
import LandingPage from './pages/Public/LandingPage';
import LoginPage from './pages/Public/LoginPage';
import StudentDashboard from './pages/Student/StudentDashboard';
import TechnicianDashboard from './pages/Technician/TechnicianDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';

// Page Transition Wrapper
const PageWrapper = ({ children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
};

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
        <div className="d-flex justify-content-center align-items-center vh-100 bg-background">
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="spinner-border text-primary" 
                role="status"
            >
                <span className="visually-hidden">Loading...</span>
            </motion.div>
        </div>
    );
    
    if (!user) return <Navigate to="/login" replace />;
    
    if (role && user.role !== role) {
        return <Navigate to="/" replace />;
    }

    return children;
};

function AnimatedRoutes() {
    const location = useLocation();
    
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
                <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
                
                <Route path="/student/*" element={
                    <ProtectedRoute role="student">
                        <PageWrapper><StudentDashboard /></PageWrapper>
                    </ProtectedRoute>
                } />
                
                <Route path="/technician/*" element={
                    <ProtectedRoute role="technician">
                        <PageWrapper><TechnicianDashboard /></PageWrapper>
                    </ProtectedRoute>
                } />
                
                <Route path="/admin/*" element={
                    <ProtectedRoute role="admin">
                        <PageWrapper><AdminDashboard /></PageWrapper>
                    </ProtectedRoute>
                } />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AnimatePresence>
    );
}

function App() {
    return (
        <Router>
            <ScrollToTop />
            <AnimatedRoutes />
        </Router>
    );
}

export default App;
