import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import 'animate.css';

// Pages
import Home from './pages/Public/Home';
import LoginPage from './pages/Public/LoginPage';
import StudentDashboard from './pages/Student/StudentDashboard';
import TechnicianDashboard from './pages/Technician/TechnicianDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';

// Page Transition Wrapper
const PageWrapper = ({ children }) => {
    return <div>{children}</div>;
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
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" role="status">
                <span className="sr-only">Loading...</span>
            </div>
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
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/Home" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<PageWrapper><Home /></PageWrapper>} />
                <Route path="/About-us" element={<Navigate to="/about-us" replace />} />
                <Route path="/about-us" element={<PageWrapper><Home /></PageWrapper>} />
                <Route path="/Services" element={<Navigate to="/services" replace />} />
                <Route path="/services" element={<PageWrapper><Home /></PageWrapper>} />
                <Route path="/Features" element={<Navigate to="/features" replace />} />
                <Route path="/features" element={<PageWrapper><Home /></PageWrapper>} />
                <Route path="/Contacts" element={<Navigate to="/contacts" replace />} />
                <Route path="/contacts" element={<PageWrapper><Home /></PageWrapper>} />
                <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
                <Route path="/landing" element={<Navigate to="/home" replace />} />
                
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

                <Route path="*" element={<Navigate to="/home" replace />} />
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
