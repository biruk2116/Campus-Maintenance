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
                className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ${
                    isScrolled
                        ? 'h-14 bg-white/85 dark:bg-slate-950/90 backdrop-blur-2xl border-b border-slate-200/60 dark:border-slate-800/60 shadow-[0_1px_24px_0_rgba(0,0,0,0.06)] dark:shadow-[0_1px_24px_0_rgba(0,0,0,0.3)]'
                        : 'h-16 bg-white/60 dark:bg-slate-950/60 backdrop-blur-md border-b border-transparent'
                }`}
            >
                <div className="w-full max-w-7xl mx-auto h-full flex items-center justify-between px-5 md:px-8 relative">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group shrink-0">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-400/20 rounded-xl blur-md scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <img
                                src={DBULogo}
                                alt="DBU Logo"
                                className="relative w-9 h-9 object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <div className="leading-none">
                            <span className="font-black text-base tracking-tight block text-slate-900 dark:text-slate-50 leading-none">
                                DBU
                            </span>
                            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 leading-none mt-0.5 block">
                                Maintenance
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Center Nav */}
                    <div className="hidden md:flex items-center">
                        {/* Pill container */}
                        <div className="flex items-center gap-0.5 bg-slate-100/80 dark:bg-slate-800/60 rounded-full px-1.5 py-1 border border-slate-200/50 dark:border-slate-700/50">
                            {sectionLinks.map((link) => {
                                const isActive = activeSection === link.to.substring(1) || (link.to === '/' && activeSection === 'home');
                                return (
                                    <button
                                        key={link.to}
                                        onClick={() => handleNavClick(link)}
                                        className={`relative px-4 py-1.5 text-[13px] font-semibold rounded-full transition-all duration-200 cursor-pointer tracking-wide ${
                                            isActive
                                                ? 'text-slate-900 dark:text-slate-50 bg-white dark:bg-slate-700 shadow-sm shadow-black/10 dark:shadow-black/30'
                                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                                        }`}
                                    >
                                        {link.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2.5 shrink-0">
                        <ThemeToggle />

                        {user ? (
                            <Link
                                to={`/${user.role.toLowerCase()}`}
                                className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-[13px] font-semibold bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-full transition-all duration-200 shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-px"
                            >
                                <Activity size={14} strokeWidth={2.5} />
                                <span>Dashboard</span>
                            </Link>
                        ) : (
                            location.pathname !== '/login' && (
                                <Link
                                    to="/login"
                                    className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-[13px] font-semibold bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-full transition-all duration-200 shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-px"
                                >
                                    <LogIn size={14} strokeWidth={2.5} />
                                    <span>Login</span>
                                </Link>
                            )
                        )}

                        {/* Mobile hamburger */}
                        <button
                            className="md:hidden relative w-9 h-9 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            <span className={`absolute transition-all duration-200 ${isMobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'}`}>
                                <X size={18} strokeWidth={2.5} />
                            </span>
                            <span className={`absolute transition-all duration-200 ${isMobileMenuOpen ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0'}`}>
                                <Menu size={18} strokeWidth={2.5} />
                            </span>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-4 right-4 mt-2 bg-white/98 dark:bg-slate-900/98 backdrop-blur-2xl rounded-2xl border border-slate-200/70 dark:border-slate-700/60 shadow-xl shadow-black/10 dark:shadow-black/40 overflow-hidden animate-slideDown">
                        <div className="p-3">
                            {/* Top divider with theme toggle */}
                            <div className="flex items-center justify-between px-2 pb-3 mb-1 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Navigation</span>
                                <ThemeToggle />
                            </div>

                            <div className="flex flex-col gap-0.5">
                                {sectionLinks.map((link) => {
                                    const isActive = activeSection === link.to.substring(1) || (link.to === '/' && activeSection === 'home');
                                    return (
                                        <button
                                            key={link.to}
                                            onClick={() => handleNavClick(link)}
                                            className={`w-full text-left px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-150 ${
                                                isActive
                                                    ? 'text-slate-900 dark:text-slate-50 bg-slate-100 dark:bg-slate-800'
                                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                                            }`}
                                        >
                                            <span className="flex items-center gap-2">
                                                {isActive && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                                )}
                                                {link.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* CTA at bottom */}
                            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                {user ? (
                                    <Link
                                        to={`/${user.role.toLowerCase()}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all duration-200 shadow-md shadow-blue-600/20"
                                    >
                                        <Activity size={15} strokeWidth={2.5} />
                                        <span>Go to Dashboard</span>
                                    </Link>
                                ) : (
                                    location.pathname !== '/login' && (
                                        <Link
                                            to="/login"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all duration-200 shadow-md shadow-blue-600/20"
                                        >
                                            <LogIn size={15} strokeWidth={2.5} />
                                            <span>Login to your account</span>
                                        </Link>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Keyframe styles */}
            <style jsx>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-8px) scale(0.98);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                .animate-slideDown {
                    animation: slideDown 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </>
    );
};

export default Navbar;