import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    GraduationCap,
    Menu,
    X,
    Activity,
    LogIn
} from 'lucide-react';

const sectionLinks = [
    { to: '/home', label: 'Home' },
    { to: '/about-us', label: 'About Us' },
    { to: '/services', label: 'Services' },
    { to: '/features', label: 'Features' },
    { to: '/contacts', label: 'Contacts' }
];

const Navbar = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {/* DESKTOP & MOBILE NAVBAR */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 w-full px-4 md:px-6 transition-all duration-300 ${
                    isScrolled || location.pathname === '/'
                        ? 'py-3 bg-blue-800 dark:bg-blue-900 shadow-lg border-b border-blue-700 dark:border-blue-800' 
                        : 'py-5 bg-transparent border-b border-transparent'
                }`}
            >
                <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/home" className={`flex items-center gap-3 group ${(isScrolled || location.pathname === '/') ? 'text-white' : ''}`}>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-xl transition-all">
                            <GraduationCap size={20} className="text-white" />
                        </div>
                        <div>
                            <span className={`font-extrabold text-lg tracking-tight block leading-none ${(isScrolled || location.pathname === '/') ? 'text-white' : 'text-textPrimary'} group-hover:text-primary transition-colors`}>DBU</span>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${(isScrolled || location.pathname === '/') ? 'text-slate-300' : 'text-textSecondary'}`}>Maintenance</span>
                        </div>
                    </Link>
                    
                    <div className="flex items-center gap-6">
                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1">
                            {sectionLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                                        location.pathname === link.to
                                            ? `text-primary bg-primary/10 border border-primary/20 ${(isScrolled || location.pathname === '/') ? 'text-white bg-primary/20' : ''}`
                                            : `${(isScrolled || location.pathname === '/') ? 'text-slate-300 hover:text-white hover:bg-white/10' : 'text-textSecondary hover:text-primary hover:bg-primary/5'} border border-transparent`
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                            {user ? (
                                <Link to={`/${user.role.toLowerCase()}`} className="hidden md:flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all">
                                    <Activity size={16} /> Dashboard
                                </Link>
                            ) : (
                                location.pathname !== '/login' && (
                                    <Link to="/login" className="hidden md:flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all">
                                        <LogIn size={16} /> Login
                                    </Link>
                                )
                            )}

                            <button 
                                className={`md:hidden p-2.5 rounded-lg transition-all border border-transparent hover:border-primary/20 ${(isScrolled || location.pathname === '/') ? 'text-slate-300 hover:text-white hover:bg-white/10' : 'text-textSecondary hover:text-primary hover:bg-primary/10'}`}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-blue-800 dark:bg-blue-900 border-b border-blue-700 dark:border-blue-800 mt-2 mx-4 rounded-xl shadow-xl">
                        <div className="flex flex-col gap-2 p-4">
                            {sectionLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-300 text-slate-300 hover:text-white hover:bg-white/10"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            {user ? (
                                <Link to={`/${user.role.toLowerCase()}`} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm font-bold bg-gradient-to-r from-primary to-secondary text-white rounded-lg">
                                    <Activity size={16} /> Dashboard
                                </Link>
                            ) : (
                                location.pathname !== '/login' && (
                                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm font-bold bg-gradient-to-r from-primary to-secondary text-white rounded-lg">
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
