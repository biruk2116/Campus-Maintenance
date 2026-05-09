import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import DBULogo from '../assets/images/dbu-logo.png';
import {
    Menu,
    X,
    Activity,
    LogIn
} from 'lucide-react';

const sectionLinks = [
    { to: '/', label: 'Home' },
    { to: '/about-us', label: 'About Us' },
    { to: '/services', label: 'Services' },
    { to: '/features', label: 'Features' },
    { to: '/contacts', label: 'Contacts' }
];

const Navbar = () => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const navbarHeight = 65;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: elementPosition - navbarHeight,
                behavior: 'smooth'
            });
        }
    };

    const handleNavClick = (link) => {
        const sectionId = link.to === '/' ? 'home' : link.to.substring(1);
        
        if (location.pathname === link.to) {
            // Already on the same route, just scroll to section
            scrollToSection(sectionId);
        } else {
            // Navigate to the route first
            navigate(link.to);
            // Scroll after navigation
            setTimeout(() => scrollToSection(sectionId), 100);
        }
        
        setIsMobileMenuOpen(false);
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setIsScrolled(scrollY > 20);

            // Update active section based on scroll position
            const sections = ['home', 'about-us', 'services', 'features', 'contacts'];
            let currentSection = 'home';
            const navbarHeight = 65;

            sections.forEach(section => {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const elementTop = rect.top;
                    
                    if (elementTop <= navbarHeight + 100) {
                        currentSection = section;
                    }
                }
            });

            setActiveSection(currentSection);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {/* DESKTOP & MOBILE NAVBAR */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 w-full h-16 px-4 md:px-6 py-3 transition-all duration-500 overflow-hidden ${
                    isScrolled
                        ? 'bg-gradient-to-r from-white/95 via-blue-50/80 via-cyan-50/60 to-white/95 dark:from-slate-900/95 dark:via-blue-900/80 dark:via-cyan-900/60 dark:to-slate-900/95 backdrop-blur-xl shadow-2xl shadow-blue-500/10 dark:shadow-cyan-500/10 border-b border-blue-200/30 dark:border-cyan-700/30'
                        : 'bg-gradient-to-r from-white/90 via-blue-50/40 via-cyan-50/30 to-white/90 dark:from-slate-900/90 dark:via-blue-900/40 dark:via-cyan-900/30 dark:to-slate-900/90 backdrop-blur-md border-b border-transparent'
                }`}
            >
                {/* Animated background particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-blue-400/30 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                    <div className="absolute top-1/3 right-1/3 w-0.5 h-0.5 bg-cyan-400/40 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
                    <div className="absolute bottom-1/4 left-1/2 w-0.5 h-0.5 bg-blue-300/50 rounded-full animate-ping" style={{ animationDuration: '5s', animationDelay: '2s' }} />
                </div>
                <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <img
                            src={DBULogo}
                            alt="DBU Logo"
                            className="w-10 h-10 object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                        <div>
                            <span className="font-extrabold text-lg tracking-tight block leading-none text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">DBU</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">Maintenance</span>
                        </div>
                    </Link>
                    
                    <div className="flex items-center gap-6">
                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1">
                            {sectionLinks.map((link) => (
                                <button
                                    key={link.to}
                                    onClick={() => handleNavClick(link)}
                                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 relative overflow-hidden cursor-pointer border-0 bg-transparent ${
                                        activeSection === link.to.substring(1) || (link.to === '/' && activeSection === 'home')
                                            ? 'text-blue-600 dark:text-blue-400 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/40 dark:to-cyan-900/40 border border-blue-200 dark:border-blue-800 shadow-md'
                                            : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-slate-800/60 dark:hover:to-slate-700/60 hover:shadow-lg hover:scale-105'
                                    }`}
                                >
                                    <span className="relative z-10">{link.label}</span>
                                    {/* Dynamic hover glow effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-cyan-400/30 to-blue-400/20 opacity-0 hover:opacity-100 transition-all duration-500 rounded-lg animate-pulse" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 rounded-lg" />
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                            <ThemeToggle />
                            
                            {user ? (
                                <Link to={`/${user.role.toLowerCase()}`} className="hidden md:flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                                    <Activity size={16} /> Dashboard
                                </Link>
                            ) : (
                                location.pathname !== '/login' && (
                                    <Link to="/login" className="hidden md:flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                                        <LogIn size={16} /> Login
                                    </Link>
                                )
                            )}

                            <button 
                                className="md:hidden p-2.5 rounded-lg transition-all border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-white/95 via-blue-50/80 via-cyan-50/60 to-white/95 dark:from-slate-900/95 dark:via-blue-900/80 dark:via-cyan-900/60 dark:to-slate-900/95 backdrop-blur-xl border-b border-blue-200/30 dark:border-cyan-700/30 mt-2 mx-4 rounded-xl shadow-2xl shadow-blue-500/10 dark:shadow-cyan-500/10">
                        <div className="flex flex-col gap-2 p-4">
                            <div className="flex justify-center mb-2">
                                <ThemeToggle />
                            </div>
                            
                            {sectionLinks.map((link) => (
                                <button
                                    key={link.to}
                                    onClick={() => handleNavClick(link)}
                                    className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-300 relative overflow-hidden cursor-pointer border-0 bg-transparent ${
                                        activeSection === link.to.substring(1) || (link.to === '/' && activeSection === 'home')
                                            ? 'text-blue-600 dark:text-blue-400 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/40 dark:to-cyan-900/40 border border-blue-200 dark:border-blue-800 shadow-md'
                                            : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-slate-800/60 dark:hover:to-slate-700/60 hover:shadow-lg hover:scale-105'
                                    }`}
                                >
                                    <span className="relative z-10">{link.label}</span>
                                    {/* Dynamic hover glow effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-cyan-400/30 to-blue-400/20 opacity-0 hover:opacity-100 transition-all duration-500 rounded-lg animate-pulse" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 rounded-lg" />
                                </button>
                            ))}
                            {user ? (
                                <Link to={`/${user.role.toLowerCase()}`} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg">
                                    <Activity size={16} /> Dashboard
                                </Link>
                            ) : (
                                location.pathname !== '/login' && (
                                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg">
                                        <LogIn size={16} /> Login
                                    </Link>
                                )
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
};

export default Navbar;
