import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import DBULogo from '../assets/images/dbu-logo.png';
import { Menu, X, Activity, LogIn } from 'lucide-react';

const sectionLinks = [
    { to: '/',          label: 'Home'     },
    { to: '/about-us',  label: 'About Us' },
    { to: '/services',  label: 'Services' },
    { to: '/features',  label: 'Features' },
    { to: '/contacts',  label: 'Contacts' },
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
            window.scrollTo({ top: elementPosition - navbarHeight, behavior: 'smooth' });
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
            setIsScrolled(window.scrollY > 20);
            const sections = ['home', 'about-us', 'services', 'features', 'contacts'];
            let currentSection = 'home';
            const navbarHeight = 65;
            sections.forEach(section => {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= navbarHeight + 100) currentSection = section;
                }
            });
            setActiveSection(currentSection);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ${
                isScrolled
                    ? 'h-14 bg-white/90 dark:bg-slate-950/92 backdrop-blur-2xl border-b border-slate-200/70 dark:border-slate-800/70 shadow-[0_1px_20px_0_rgba(14,165,233,0.06)] dark:shadow-[0_1px_20px_0_rgba(0,0,0,0.35)]'
                    : 'h-16 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-100/60 dark:border-slate-800/40'
            }`}>

                {/* Top accent line — matches hero top line */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-400/40 dark:via-cyan-500/35 to-transparent pointer-events-none" />

                <div className="w-full max-w-7xl mx-auto h-full flex items-center justify-between px-5 md:px-8">

                    {/* ── Logo ── */}
                    <Link to="/" className="flex items-center gap-3 group shrink-0">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-xl blur-md scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-sky-400/25 dark:bg-cyan-400/20" />
                            <img
                                src={DBULogo}
                                alt="DBU Logo"
                                className="relative w-9 h-9 object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <div className="leading-none">
                            <span className="font-black text-[15px] tracking-tight block leading-none text-slate-900 dark:text-slate-50">
                                DBU
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-sky-500 dark:text-cyan-500 leading-none mt-0.5 block">
                                Maintenance
                            </span>
                        </div>
                    </Link>

                    {/* ── Desktop nav pills ── */}
                    <div className="hidden md:flex items-center">
                        <div className="flex items-center gap-0.5 bg-slate-100/90 dark:bg-slate-800/70 rounded-full px-1.5 py-1 border border-slate-200/60 dark:border-slate-700/60">
                            {sectionLinks.map((link) => {
                                const isActive =
                                    activeSection === link.to.substring(1) ||
                                    (link.to === '/' && activeSection === 'home');
                                return (
                                    <button
                                        key={link.to}
                                        onClick={() => handleNavClick(link)}
                                        className={`relative px-4 py-1.5 text-[13px] font-semibold rounded-full transition-all duration-200 cursor-pointer tracking-wide ${
                                            isActive
                                                ? 'text-sky-600 dark:text-cyan-300 bg-white dark:bg-slate-700 shadow-sm shadow-sky-200/80 dark:shadow-black/30'
                                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                                        }`}
                                    >
                                        {link.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Right actions ── */}
                    <div className="flex items-center gap-2.5 shrink-0">
                        <ThemeToggle />

                        {user ? (
                            <Link
                                to={`/${user.role.toLowerCase()}`}
                                className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-white rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-md shadow-sky-500/30 hover:shadow-lg hover:shadow-sky-500/40 hover:-translate-y-px transition-all duration-200"
                            >
                                <Activity size={14} strokeWidth={2.5} />
                                <span>Dashboard</span>
                            </Link>
                        ) : (
                            location.pathname !== '/login' && (
                                <Link
                                    to="/login"
                                    className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-white rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-md shadow-sky-500/30 hover:shadow-lg hover:shadow-sky-500/40 hover:-translate-y-px transition-all duration-200"
                                >
                                    <LogIn size={14} strokeWidth={2.5} />
                                    <span>Login</span>
                                </Link>
                            )
                        )}

                        {/* Hamburger */}
                        <button
                            className="md:hidden relative w-9 h-9 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200"
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

                {/* ── Mobile menu ── */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-4 right-4 mt-2 bg-white/98 dark:bg-slate-900/98 backdrop-blur-2xl rounded-2xl border border-slate-200/70 dark:border-slate-700/60 shadow-xl shadow-sky-100/40 dark:shadow-black/50 overflow-hidden animate-slideDown">
                        <div className="p-3">
                            {/* Header row */}
                            <div className="flex items-center justify-between px-2 pb-3 mb-1 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-500 dark:text-cyan-500">Navigation</span>
                                <ThemeToggle />
                            </div>

                            <div className="flex flex-col gap-0.5">
                                {sectionLinks.map((link) => {
                                    const isActive =
                                        activeSection === link.to.substring(1) ||
                                        (link.to === '/' && activeSection === 'home');
                                    return (
                                        <button
                                            key={link.to}
                                            onClick={() => handleNavClick(link)}
                                            className={`w-full text-left px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-150 ${
                                                isActive
                                                    ? 'text-sky-600 dark:text-cyan-300 bg-sky-50 dark:bg-slate-800'
                                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                                            }`}
                                        >
                                            <span className="flex items-center gap-2">
                                                {isActive && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-cyan-400 shrink-0" />
                                                )}
                                                {link.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* CTA */}
                            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                {user ? (
                                    <Link
                                        to={`/${user.role.toLowerCase()}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-md shadow-sky-500/25 transition-all duration-200"
                                    >
                                        <Activity size={15} strokeWidth={2.5} />
                                        <span>Go to Dashboard</span>
                                    </Link>
                                ) : (
                                    location.pathname !== '/login' && (
                                        <Link
                                            to="/login"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-md shadow-sky-500/25 transition-all duration-200"
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

            <style jsx>{`
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-8px) scale(0.98); }
                    to   { opacity: 1; transform: translateY(0)   scale(1);    }
                }
                .animate-slideDown {
                    animation: slideDown 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </>
    );
};

export default Navbar;