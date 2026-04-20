import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
    Wrench,
    Sun,
    Moon,
    LogIn,
    ChevronDown,
    Activity,
    Shield,
    Target
} from 'lucide-react';

export const sectionLinks = [
    { id: '#home', label: 'Home' },
    { id: '#about', label: 'About Us' },
    { id: '#features', label: 'Features' },
    { id: '#services', label: 'Services' },
    { id: '#contact', label: 'Contact' }
];

const Navbar = () => {
    const { user, isDarkMode, toggleDarkMode } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleNavigate = (id) => {
        if (location.pathname === '/') {
            if (id === '#home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                window.history.replaceState(null, '', '#home');
                return;
            }

            const el = document.querySelector(id);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                window.history.replaceState(null, '', id);
            }
        } else {
            // Navigate to landing page with hash
            navigate(`/${id}`);
        }
    };

    return (
        <nav className={`navbar navbar-expand-lg nav-glass fixed-top py-3 ${isDarkMode ? 'navbar-dark' : 'navbar-light'}`} style={{ transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div className="container">
                <Link className="navbar-brand fw-bold d-flex align-items-center" to="/" style={{ letterSpacing: '-0.05em' }}>
                    <motion.span 
                        whileHover={{ rotate: 15 }}
                        className="nav-brand-mark me-2 d-inline-flex align-items-center justify-content-center shadow-lg"
                    >
                        <Wrench size={20} />
                    </motion.span>
                    <span className="nav-brand-text text-main">Campus<span className="hero-title-accent" style={{ color: '#f7b718' }}>Maintain</span></span>
                </Link>
                <button
                    className="navbar-toggler border-0 shadow-none p-2 rounded-3 bg-surface bg-opacity-10"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
                        {sectionLinks.map((item) => (
                            <li className="nav-item" key={item.id}>
                                <motion.button
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                    className="nav-link landing-nav-link px-3 py-2 small fw-800 text-uppercase tracking-widest btn btn-link text-decoration-none"
                                    onClick={() => handleNavigate(item.id)}
                                >
                                    {item.label}
                                </motion.button>
                            </li>
                        ))}
                        
                        <div className="vr d-none d-lg-block mx-3 text-muted opacity-20" style={{ height: '24px' }}></div>
                        
                        <li className="nav-item ms-lg-2 me-lg-1 d-flex align-items-center">
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                type="button"
                                className="btn theme-toggle-btn border-0 p-2 rounded-circle shadow-sm"
                                onClick={toggleDarkMode}
                                aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
                            >
                                {isDarkMode ? <Sun size={20} className="text-warning" /> : <Moon size={20} className="text-primary" />}
                            </motion.button>
                        </li>
                        
                        <li className="nav-item ms-lg-2">
                            {user ? (
                                <Link 
                                    className="btn nav-cta-btn px-4 py-2 small fw-800 text-uppercase tracking-widest rounded-pill shadow-lg d-flex align-items-center bg-primary text-white border-0" 
                                    to={`/${user.role}`}
                                >
                                    <Activity size={14} className="me-2" /> Hub
                                </Link>
                            ) : (
                                <Link 
                                    className="btn nav-cta-btn px-4 py-2 small fw-800 text-uppercase tracking-widest rounded-pill shadow-lg d-flex align-items-center bg-primary text-white border-0" 
                                    to="/login"
                                >
                                    <LogIn size={14} className="me-2" /> Sign In
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
