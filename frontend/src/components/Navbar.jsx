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
            scrollToSection(sectionId);
        } else {
            navigate(link.to);
            setTimeout(() => scrollToSection(sectionId), 100);
        }
        
        setIsMobileMenuOpen(false);
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setIsScrolled(scrollY > 20);

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
            <nav
                className={`fixed top-0 left-0 right-0 z-50 w-full h-16 px-4 md:px-6 py-3 transition-all duration-500 overflow-hidden ${
                    isScrolled
                        ? 'bg-gradient-to-r from-white/95 via-indigo-50/90 via-purple-50/80 to-white/95 dark:from-slate-900/95 dark:via-indigo-950/90 dark:via-purple-950/80 dark:to-slate-900/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(99,102,241,0.15)] dark:shadow-[0_8px_32px_rgba(139,92,246,0.15)] border-b border-indigo-200/30 dark:border-indigo-800/30'
                        : 'bg-gradient-to-r from-white/90 via-indigo-50/60 via-purple-50/50 to-white/90 dark:from-slate-900/90 dark:via-indigo-950/60 dark:via-purple-950/50 dark:to-slate-900/90 backdrop-blur-md border-b border-transparent'
                }`}
            >
                {/* Animated gradient orb background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-indigo-400/20 via-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
                    
                    {/* Floating particles */}
                    <div className="absolute top-1/4 left-1/5 w-1.5 h-1.5 bg-indigo-400/60 rounded-full animate-float" style={{ animationDuration: '6s' }} />
                    <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-purple-400/50 rounded-full animate-float" style={{ animationDuration: '7s', animationDelay: '1s' }} />
                    <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-pink-400/40 rounded-full animate-float" style={{ animationDuration: '5s', animationDelay: '2s' }} />
                    <div className="absolute top-2/3 right-1/5 w-1.5 h-1.5 bg-indigo-300/40 rounded-full animate-float" style={{ animationDuration: '8s', animationDelay: '0.5s' }} />
                    <div className="absolute bottom-1/3 left-2/3 w-1 h-1 bg-purple-300/50 rounded-full animate-float" style={{ animationDuration: '6.5s', animationDelay: '1.5s' }} />
                    
                    {/* Twinkling stars */}
                    <div className="absolute top-1/5 right-1/6 w-0.5 h-0.5 bg-white/60 rounded-full animate-twinkle" style={{ animationDuration: '3s' }} />
                    <div className="absolute bottom-1/4 right-1/3 w-0.5 h-0.5 bg-white/50 rounded-full animate-twinkle" style={{ animationDuration: '4s', animationDelay: '1s' }} />
                    <div className="absolute top-2/3 left-1/4 w-0.5 h-0.5 bg-white/40 rounded-full animate-twinkle" style={{ animationDuration: '3.5s', animationDelay: '0.7s' }} />
                </div>

                <div className="w-full max-w-7xl mx-auto flex items-center justify-between relative z-10">
                    {/* Logo with magical glow */}
                    <Link to="/" className="flex items-center gap-3 group relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -inset-2" />
                        <img
                            src={DBULogo}
                            alt="DBU Logo"
                            className="w-10 h-10 object-contain group-hover:scale-105 transition-all duration-300 filter drop-shadow-[0_2px_8px_rgba(99,102,241,0.3)] group-hover:drop-shadow-[0_4px_12px_rgba(139,92,246,0.5)]"
                        />
                        <div className="relative">
                            <span className="font-extrabold text-lg tracking-tight block leading-none bg-gradient-to-r from-slate-700 via-indigo-600 to-slate-700 dark:from-slate-200 dark:via-indigo-400 dark:to-slate-200 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:via-purple-600 group-hover:to-pink-600 dark:group-hover:from-indigo-400 dark:group-hover:via-purple-400 dark:group-hover:to-pink-400 transition-all duration-500 animate-gradient-x bg-[length:200%_auto]">DBU</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">Maintenance</span>
                        </div>
                    </Link>
                    
                    <div className="flex items-center gap-6">
                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1">
                            {sectionLinks.map((link) => {
                                const isActive = activeSection === link.to.substring(1) || (link.to === '/' && activeSection === 'home');
                                return (
                                    <button
                                        key={link.to}
                                        onClick={() => handleNavClick(link)}
                                        className={`relative px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 cursor-pointer border-0 bg-transparent overflow-hidden group ${
                                            isActive
                                                ? 'text-indigo-600 dark:text-indigo-300'
                                                : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                                        }`}
                                    >
                                        {/* Animated gradient background */}
                                        <div className={`absolute inset-0 rounded-xl transition-all duration-500 ${
                                            isActive
                                                ? 'bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/60 dark:via-purple-950/60 dark:to-pink-950/60 opacity-100'
                                                : 'bg-gradient-to-r from-indigo-50/0 via-purple-50/0 to-pink-50/0 opacity-0 group-hover:opacity-100 group-hover:from-indigo-50/30 group-hover:via-purple-50/30 group-hover:to-pink-50/30 dark:group-hover:from-indigo-950/40 dark:group-hover:via-purple-950/40 dark:group-hover:to-pink-950/40'
                                        }`} />
                                        
                                        {/* Glowing border on active */}
                                        {isActive && (
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-60 blur-sm -z-10 animate-pulse" style={{ animationDuration: '3s' }} />
                                        )}
                                        
                                        {/* Hover shine effect */}
                                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                        
                                        <span className="relative z-10">{link.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex items-center gap-3">
                            <ThemeToggle />
                            
                            {user ? (
                                <Link to={`/${user.role.toLowerCase()}`} className="hidden md:flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl relative overflow-hidden group shadow-[0_4px_14px_rgba(99,102,241,0.4)] hover:shadow-[0_8px_20px_rgba(139,92,246,0.6)] transition-all duration-300 hover:scale-105">
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                                    <Activity size={16} className="relative z-10" /> 
                                    <span className="relative z-10">Dashboard</span>
                                </Link>
                            ) : (
                                location.pathname !== '/login' && (
                                    <Link to="/login" className="hidden md:flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl relative overflow-hidden group shadow-[0_4px_14px_rgba(99,102,241,0.4)] hover:shadow-[0_8px_20px_rgba(139,92,246,0.6)] transition-all duration-300 hover:scale-105">
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                                        <LogIn size={16} className="relative z-10" /> 
                                        <span className="relative z-10">Login</span>
                                    </Link>
                                )
                            )}

                            <button 
                                className="md:hidden p-2.5 rounded-xl transition-all border border-indigo-300/50 dark:border-indigo-600/50 text-slate-700 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 dark:hover:from-indigo-950/30 dark:hover:to-purple-950/30 relative overflow-hidden group"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/0 via-purple-400/0 to-pink-400/0 group-hover:from-indigo-400/10 group-hover:via-purple-400/10 group-hover:to-pink-400/10 transition-all duration-500" />
                                {isMobileMenuOpen ? <X size={24} className="relative z-10" /> : <Menu size={24} className="relative z-10" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu - Magical Glass Morphism */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-white/95 via-indigo-50/90 via-purple-50/80 to-white/95 dark:from-slate-900/95 dark:via-indigo-950/90 dark:via-purple-950/80 dark:to-slate-900/95 backdrop-blur-xl border-b border-indigo-200/30 dark:border-indigo-800/30 mt-2 mx-4 rounded-2xl shadow-[0_20px_40px_-15px_rgba(99,102,241,0.3)] dark:shadow-[0_20px_40px_-15px_rgba(139,92,246,0.3)] overflow-hidden animate-slideDown">
                        {/* Decorative gradient orbs in mobile menu */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-indigo-400/20 via-purple-400/20 to-pink-400/20 rounded-full blur-2xl animate-pulse" />
                        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-indigo-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
                        
                        <div className="flex flex-col gap-2 p-4 relative z-10">
                            <div className="flex justify-center mb-2 pb-2 border-b border-indigo-200/30 dark:border-indigo-700/30">
                                <ThemeToggle />
                            </div>
                            
                            {sectionLinks.map((link) => {
                                const isActive = activeSection === link.to.substring(1) || (link.to === '/' && activeSection === 'home');
                                return (
                                    <button
                                        key={link.to}
                                        onClick={() => handleNavClick(link)}
                                        className={`relative w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 cursor-pointer overflow-hidden group ${
                                            isActive
                                                ? 'text-indigo-600 dark:text-indigo-300'
                                                : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                                        }`}
                                    >
                                        <div className={`absolute inset-0 rounded-xl transition-all duration-500 ${
                                            isActive
                                                ? 'bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/60 dark:via-purple-950/60 dark:to-pink-950/60'
                                                : 'bg-gradient-to-r from-indigo-50/0 via-purple-50/0 to-pink-50/0 group-hover:from-indigo-50/30 group-hover:via-purple-50/30 group-hover:to-pink-50/30 dark:group-hover:from-indigo-950/40 dark:group-hover:via-purple-950/40 dark:group-hover:to-pink-950/40'
                                        }`} />
                                        
                                        {isActive && (
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-60 blur-sm -z-10 animate-pulse" style={{ animationDuration: '3s' }} />
                                        )}
                                        
                                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                        
                                        <span className="relative z-10">{link.label}</span>
                                    </button>
                                );
                            })}
                            {user ? (
                                <Link to={`/${user.role.toLowerCase()}`} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl relative overflow-hidden group shadow-[0_4px_14px_rgba(99,102,241,0.4)]">
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                                    <Activity size={16} className="relative z-10" /> 
                                    <span className="relative z-10">Dashboard</span>
                                </Link>
                            ) : (
                                location.pathname !== '/login' && (
                                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl relative overflow-hidden group shadow-[0_4px_14px_rgba(99,102,241,0.4)]">
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                                        <LogIn size={16} className="relative z-10" /> 
                                        <span className="relative z-10">Login</span>
                                    </Link>
                                )
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Custom keyframes for animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
                    50% { transform: translateY(-15px) translateX(5px); opacity: 0.8; }
                }
                @keyframes twinkle {
                    0%, 100% { opacity: 0.2; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.5); }
                }
                @keyframes gradient-x {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px) scale(0.98);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                .animate-float {
                    animation: float infinite ease-in-out;
                }
                .animate-twinkle {
                    animation: twinkle infinite ease-in-out;
                }
                .animate-gradient-x {
                    animation: gradient-x 3s ease infinite;
                }
                .animate-slideDown {
                    animation: slideDown 0.3s ease-out forwards;
                }
            `}</style>
        </>
    );
};

export default Navbar;