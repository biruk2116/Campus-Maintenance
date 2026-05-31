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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Fixed: added missing = sign
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const navbarHeight = 70;
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
            const navbarHeight = 70;
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
            <nav className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
                isScrolled
                    ? 'h-16 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-lg'
                    : 'h-16 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800'
            }`}>
                
                {/* Top accent line */}
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-sky-500/50 dark:via-cyan-500/50 to-transparent" />

                <div className="w-full max-w-7xl mx-auto h-full flex items-center justify-between px-5 md:px-8">

                    {/* Logo Section */}
                    <Link to="/" className="flex items-center gap-3 group shrink-0">
                        <img
                            src={DBULogo}
                            alt="DBU Logo"
                            className="w-9 h-9 object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="leading-tight">
                            <span className="font-black text-lg tracking-tight block text-slate-900 dark:text-white">
                                DBU
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 block">
                                Maintenance
                            </span>
                        </div>
                    </Link>

                    {/* Right side - Navigation + Theme toggle + Buttons */}
                    <div className="flex items-center gap-6">
                        {/* Desktop Navigation Links - No border radius, single background */}
                        <div className="hidden md:flex items-center gap-1">
                            {sectionLinks.map((link) => {
                                const isActive =
                                    activeSection === link.to.substring(1) ||
                                    (link.to === '/' && activeSection === 'home');
                                return (
                                    <button
                                        key={link.to}
                                        onClick={() => handleNavClick(link)}
                                        className={`px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer ${
                                            isActive
                                                ? 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50'
                                                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        {link.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Theme Toggle */}
                        <div className="hidden md:block">
                            <ThemeToggle />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            <div className="md:hidden">
                                <ThemeToggle />
                            </div>

                            {user ? (
                                <Link
                                    to={`/${user.role.toLowerCase()}`}
                                    className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 transition-all duration-200"
                                >
                                    <Activity size={16} strokeWidth={2} />
                                    <span>Dashboard</span>
                                </Link>
                            ) : (
                                location.pathname !== '/login' && (
                                    <Link
                                        to="/login"
                                        className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 transition-all duration-200"
                                    >
                                        <LogIn size={16} strokeWidth={2} />
                                        <span>Login</span>
                                    </Link>
                                )
                            )}

                            {/* Hamburger Menu Button */}
                            <button
                                className="md:hidden relative w-9 h-9 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
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
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 mt-0 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-lg animate-slideDown">
                        <div className="p-4 space-y-1">
                            {sectionLinks.map((link) => {
                                const isActive =
                                    activeSection === link.to.substring(1) ||
                                    (link.to === '/' && activeSection === 'home');
                                return (
                                    <button
                                        key={link.to}
                                        onClick={() => handleNavClick(link)}
                                        className={`w-full text-left px-4 py-3 text-base font-medium transition-all duration-200 ${
                                            isActive
                                                ? 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50'
                                                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        {link.label}
                                    </button>
                                );
                            })}
                            
                            {/* Mobile Action Buttons */}
                            <div className="pt-4 mt-2 border-t border-slate-200 dark:border-slate-800">
                                {user ? (
                                    <Link
                                        to={`/${user.role.toLowerCase()}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 transition-all duration-200"
                                    >
                                        <Activity size={18} strokeWidth={2} />
                                        <span>Go to Dashboard</span>
                                    </Link>
                                ) : (
                                    location.pathname !== '/login' && (
                                        <Link
                                            to="/login"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 transition-all duration-200"
                                        >
                                            <LogIn size={18} strokeWidth={2} />
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
                    from { 
                        opacity: 0; 
                        transform: translateY(-10px); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0); 
                    }
                }
                .animate-slideDown {
                    animation: slideDown 0.2s ease-out forwards;
                }
            `}</style>
        </>
    );
};

export default Navbar;
