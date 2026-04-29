import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
    Wrench,
    Sun,
    Moon,
    LogIn,
    Activity,
    Menu,
    X
} from 'lucide-react';

const sectionLinks = [
    { id: '#home', label: 'Home' },
    { id: '#about', label: 'About Us' },
    { id: '#features', label: 'Features' },
    { id: '#services', label: 'Services' },
    { id: '#contact', label: 'Contact' }
];

const LANDING_PATH = '/landing';
const NAVBAR_OFFSET = 96;

const Navbar = () => {
    const { user, isDarkMode, toggleDarkMode } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const scrollToSection = (id) => {
        setIsMobileMenuOpen(false);
        const el = document.querySelector(id);
        if (!el) return;

        const top = el.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET;
        window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
        window.history.replaceState(null, '', `${LANDING_PATH}${id}`);
    };

    const handleNavigate = (id) => {
        setIsMobileMenuOpen(false);
        if (location.pathname === LANDING_PATH) {
            if (id === '#home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                window.history.replaceState(null, '', `${LANDING_PATH}#home`);
                return;
            }
            scrollToSection(id);
        } else {
            navigate(`${LANDING_PATH}${id}`);
        }
    };

    return (
        <Motion.nav 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300 glass-panel"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex items-center justify-between h-full">
                    {/* Logo */}
                    <Link to={LANDING_PATH} className="flex items-center gap-3 no-underline group">
                        <Motion.div 
                            whileHover={{ rotate: 15, scale: 1.1 }}
                            className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/30"
                        >
                            <Wrench size={20} />
                        </Motion.div>
                        <span className="text-xl font-bold tracking-tight text-textPrimary">
                            Campus<span className="text-accent">Maintain</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1">
                        {sectionLinks.map((item) => (
                            <Motion.button
                                key={item.id}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleNavigate(item.id)}
                                className="px-4 py-2 text-sm font-bold tracking-wider uppercase text-textSecondary hover:text-accent transition-colors"
                            >
                                {item.label}
                            </Motion.button>
                        ))}

                        <div className="w-px h-6 mx-4 bg-overlay/10"></div>

                        <Motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleDarkMode}
                            className="p-2 mr-2 rounded-full bg-surface hover:bg-surface-hover transition-colors"
                        >
                            {isDarkMode ? <Sun size={18} className="text-warning" /> : <Moon size={18} className="text-primary" />}
                        </Motion.button>

                        {user ? (
                            <Link to={`/${user.role.toLowerCase()}`} className="btn-primary flex items-center gap-2 text-sm uppercase tracking-wider font-bold">
                                <Activity size={16} /> Live Dashboard
                            </Link>
                        ) : (
                            <Link to="/login" className="btn-primary flex items-center gap-2 text-sm uppercase tracking-wider font-bold">
                                <LogIn size={16} /> Sign In
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex lg:hidden items-center gap-4">
                        <Motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full bg-surface text-textPrimary"
                        >
                            {isDarkMode ? <Sun size={18} className="text-warning" /> : <Moon size={18} className="text-primary" />}
                        </Motion.button>
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-textPrimary"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <Motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden absolute top-20 left-0 right-0 bg-surface/95 backdrop-blur-xl border-b border-overlay/10 overflow-hidden"
                    >
                        <div className="px-4 py-6 flex flex-col gap-4">
                            {sectionLinks.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavigate(item.id)}
                                    className="text-left px-4 py-3 text-sm font-bold tracking-wider uppercase text-textPrimary hover:bg-overlay/5 rounded-lg transition-colors"
                                >
                                    {item.label}
                                </button>
                            ))}
                            <div className="h-px bg-overlay/10 my-2"></div>
                            {user ? (
                                <Link to={`/${user.role.toLowerCase()}`} className="btn-primary flex items-center justify-center gap-2 text-sm uppercase tracking-wider font-bold mt-2">
                                    <Activity size={16} /> Live Dashboard
                                </Link>
                            ) : (
                                <Link to="/login" className="btn-primary flex items-center justify-center gap-2 text-sm uppercase tracking-wider font-bold mt-2">
                                    <LogIn size={16} /> Sign In
                                </Link>
                            )}
                        </div>
                    </Motion.div>
                )}
            </AnimatePresence>
        </Motion.nav>
    );
};

export default Navbar;

