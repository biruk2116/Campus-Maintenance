import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
    GraduationCap,
    Sun,
    Moon,
    Menu,
    X,
    Activity,
    LogIn
} from 'lucide-react';

const sectionLinks = [
    { id: '#home', label: 'Home' },
    { id: '#services', label: 'Services' },
    { id: '#roles', label: 'Features' },
    { id: '#impact', label: 'About Us' },
    { id: '#footer', label: 'Contacts' }
];

const LANDING_PATH = '/';
const NAVBAR_OFFSET = 80;

const Navbar = () => {
    const { user, isDarkMode, toggleDarkMode } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        setIsMobileMenuOpen(false);
        const el = document.querySelector(id);
        if (!el) return;

        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - NAVBAR_OFFSET;
        window.scrollTo({ top: Math.max(offsetPosition, 0), behavior: 'smooth' });
    };

    const handleNavigate = (e, id) => {
        e.preventDefault();
        setIsMobileMenuOpen(false);
        if (location.pathname === LANDING_PATH || location.pathname === '/') {
            scrollToSection(id);
        } else {
            navigate(`${LANDING_PATH}${id}`);
        }
    };

    return (
        <>
            {/* DESKTOP NAVBAR */}
            <motion.nav 
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`fixed top-0 left-0 right-0 z-50 px-6 transition-all duration-300 ${
                    isScrolled || location.pathname !== LANDING_PATH
                        ? 'py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-200 dark:border-white/10 shadow-sm' 
                        : 'py-5 bg-transparent border-transparent'
                }`}
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <motion.div 
                            whileHover={{ rotate: 5, scale: 1.05 }}
                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-sky-600 flex items-center justify-center shadow-lg shadow-blue-500/20"
                        >
                            <GraduationCap size={20} className="text-white" />
                        </motion.div>
                        <div>
                            <span className="font-extrabold text-xl tracking-tight block leading-none text-slate-900 dark:text-white group-hover:text-sky-500 transition-colors">DBU</span>
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Maintenance</span>
                        </div>
                    </Link>
                    
                    <div className="flex items-center gap-6">
                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-2">
                            {sectionLinks.map((link) => (
                                <a 
                                    key={link.id}
                                    href={link.id} 
                                    onClick={(e) => handleNavigate(e, link.id)}
                                    className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 hover:bg-sky-500/10 hover:shadow-[0_0_15px_rgba(14,165,233,0.5)] rounded-full transition-all duration-300"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>

                    <div className="flex items-center gap-3">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full text-slate-500 hover:text-sky-500 dark:text-slate-400 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </motion.button>
                        
                        {user ? (
                            <Link to={`/${user.role.toLowerCase()}`} className="hidden md:flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 hover:-translate-y-0.5 hover:shadow-sky-500/30">
                                <Activity size={16} /> Dashboard
                            </Link>
                        ) : (
                            location.pathname !== '/login' && (
                                <Link to="/login" className="hidden md:flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 hover:-translate-y-0.5 hover:shadow-sky-500/30">
                                    <LogIn size={16} /> Login
                                </Link>
                            )
                        )}

                        <button 
                            className="md:hidden p-2 text-slate-600 dark:text-slate-300"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                    </div>
                </div>
            </motion.nav>

            {/* MOBILE MENU */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="fixed top-[72px] left-0 right-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 md:hidden overflow-hidden"
                    >
                        <div className="px-6 py-4 flex flex-col gap-2">
                            {sectionLinks.map((link) => (
                                <a 
                                    key={link.id}
                                    href={link.id}
                                    onClick={(e) => handleNavigate(e, link.id)}
                                    className="px-4 py-3 text-base font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                >
                                    {link.label}
                                </a>
                            ))}
                            <div className="h-px bg-slate-200 dark:bg-white/10 my-2"></div>
                            {user ? (
                                <Link to={`/${user.role.toLowerCase()}`} className="flex items-center justify-center gap-2 px-4 py-3 text-base font-bold bg-sky-500 text-white rounded-xl shadow-md">
                                    <Activity size={18} /> Live Dashboard
                                </Link>
                            ) : (
                                location.pathname !== '/login' && (
                                    <Link to="/login" className="flex items-center justify-center gap-2 px-4 py-3 text-base font-bold bg-sky-500 text-white rounded-xl shadow-md">
                                        <LogIn size={18} /> Portal Login
                                    </Link>
                                )
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
