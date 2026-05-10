import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import DBULogo from '../assets/images/dbu-logo.png';
import {
    Menu,
    X,
    Activity,
    LogIn,
    Sparkles,
    Zap
} from 'lucide-react';

const sectionLinks = [
    { to: '/', label: 'Home', icon: '✨' },
    { to: '/about-us', label: 'About Us', icon: '🌟' },
    { to: '/services', label: 'Services', icon: '⚡' },
    { to: '/features', label: 'Features', icon: '💫' },
    { to: '/contacts', label: 'Contacts', icon: '📞' }
];

const Navbar = () => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [hoveredItem, setHoveredItem] = useState(null);

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

        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 w-full h-16 px-4 md:px-6 py-3 transition-all duration-700 overflow-hidden ${
                    isScrolled
                        ? 'bg-gradient-to-r from-indigo-950/95 via-purple-950/90 via-pink-950/80 to-rose-950/95 dark:from-slate-950/95 dark:via-purple-950/90 dark:via-pink-950/80 dark:to-rose-950/95 backdrop-blur-2xl shadow-[0_0_50px_rgba(139,92,246,0.3)] border-b border-purple-500/30'
                        : 'bg-gradient-to-r from-indigo-950/80 via-purple-950/70 via-pink-950/60 to-rose-950/80 dark:from-slate-950/80 dark:via-purple-950/70 dark:via-pink-950/60 dark:to-rose-950/80 backdrop-blur-xl border-b border-purple-500/20'
                }`}
            >
                {/* Animated Aurora Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-rose-600/10 animate-pulse" />
                    <div className="absolute top-0 -left-1/2 w-full h-full bg-gradient-to-r from-transparent via-purple-500/5 to-transparent rotate-12 animate-[slide_8s_linear_infinite]" />
                    <div className="absolute bottom-0 -right-1/2 w-full h-full bg-gradient-to-l from-transparent via-pink-500/5 to-transparent -rotate-12 animate-[slide_10s_linear_infinite_reverse]" />
                    
                    {/* Floating Orbs */}
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-float" />
                    <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl animate-float-delayed" />
                    <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow" />
                    
                    {/* Sparkle Particles */}
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-0.5 h-0.5 bg-purple-400/60 rounded-full animate-twinkle"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${2 + Math.random() * 3}s`
                            }}
                        />
                    ))}
                    
                    {/* Mouse Follow Glow */}
                    <div 
                        className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-rose-500/20 rounded-full blur-3xl pointer-events-none transition-all duration-300"
                        style={{
                            left: mousePosition.x - 192,
                            top: mousePosition.y - 192,
                        }}
                    />
                </div>

                <div className="w-full max-w-7xl mx-auto flex items-center justify-between relative z-10">
                    {/* Logo with Magical Effects */}
                    <Link to="/" className="flex items-center gap-3 group relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative">
                            <img
                                src={DBULogo}
                                alt="DBU Logo"
                                className="w-10 h-10 object-contain group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                        <div>
                            <span className="font-extrabold text-lg tracking-tight block leading-none bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                                DBU
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-purple-300/80 group-hover:text-pink-300 transition-colors duration-300">
                                Maintenance
                            </span>
                        </div>
                        <Sparkles className="absolute -top-2 -right-4 w-4 h-4 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-sparkle" />
                    </Link>
                    
                    <div className="flex items-center gap-6">
                        {/* Desktop Navigation with Magical Effects */}
                        <div className="hidden md:flex items-center gap-1">
                            {sectionLinks.map((link, index) => (
                                <button
                                    key={link.to}
                                    onClick={() => handleNavClick(link)}
                                    onMouseEnter={() => setHoveredItem(link.to)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                    className={`relative px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-500 cursor-pointer border-0 bg-transparent overflow-hidden group ${
                                        activeSection === link.to.substring(1) || (link.to === '/' && activeSection === 'home')
                                            ? 'text-white'
                                            : 'text-purple-200/80 hover:text-white'
                                    }`}
                                >
                                    {/* Animated Gradient Background */}
                                    <div className={`absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 transition-all duration-500 ${
                                        activeSection === link.to.substring(1) || (link.to === '/' && activeSection === 'home')
                                            ? 'opacity-100'
                                            : 'opacity-0 group-hover:opacity-100'
                                    }`} />
                                    
                                    {/* Shimmer Effect */}
                                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                    
                                    {/* Border Glow */}
                                    <div className={`absolute inset-0 rounded-xl transition-opacity duration-500 ${
                                        activeSection === link.to.substring(1) || (link.to === '/' && activeSection === 'home')
                                            ? 'opacity-100'
                                            : 'opacity-0 group-hover:opacity-100'
                                    }`}
                                    style={{
                                        boxShadow: '0 0 20px rgba(139, 92, 246, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.3)'
                                    }} />
                                    
                                    {/* Icon Pop Animation */}
                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-base transition-all duration-300 group-hover:scale-125 group-hover:rotate-12">
                                        {link.icon}
                                    </span>
                                    
                                    <span className="relative z-10 ml-5 transition-all duration-300 group-hover:tracking-wider">
                                        {link.label}
                                    </span>
                                    
                                    {/* Ripple Effect on Hover */}
                                    {hoveredItem === link.to && (
                                        <span className="absolute inset-0 rounded-xl animate-ripple" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <ThemeToggle />
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            
                            {user ? (
                                <Link 
                                    to={`/${user.role.toLowerCase()}`} 
                                    className="hidden md:flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 hover:scale-105 group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                        style={{ boxShadow: '0 0 30px rgba(139, 92, 246, 0.8)' }} />
                                    <Zap size={16} className="group-hover:rotate-12 transition-transform duration-300" />
                                    <span>Dashboard</span>
                                </Link>
                            ) : (
                                location.pathname !== '/login' && (
                                    <Link 
                                        to="/login" 
                                        className="hidden md:flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 hover:scale-105 group relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                            style={{ boxShadow: '0 0 30px rgba(139, 92, 246, 0.8)' }} />
                                        <LogIn size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                                        <span>Login</span>
                                    </Link>
                                )
                            )}

                            <button 
                                className="md:hidden p-2.5 rounded-xl transition-all duration-500 border border-purple-500/30 text-purple-300 hover:text-white hover:border-purple-400 hover:bg-purple-600/20 relative overflow-hidden group"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                {isMobileMenuOpen ? <X size={24} className="relative z-10" /> : <Menu size={24} className="relative z-10" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu with Enhanced Effects */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 animate-slideDown">
                        <div className="bg-gradient-to-b from-indigo-950/95 via-purple-950/90 to-rose-950/95 backdrop-blur-2xl border-t border-purple-500/30 mt-2 mx-4 rounded-2xl shadow-2xl shadow-purple-500/30 overflow-hidden">
                            {/* Animated Background for Mobile Menu */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-rose-600/10" />
                                {[...Array(10)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute w-1 h-1 bg-purple-400/40 rounded-full animate-float"
                                        style={{
                                            left: `${Math.random() * 100}%`,
                                            top: `${Math.random() * 100}%`,
                                            animationDelay: `${Math.random() * 3}s`
                                        }}
                                    />
                                ))}
                            </div>
                            
                            <div className="relative z-10 flex flex-col gap-2 p-4">
                                <div className="flex justify-center mb-2 transform transition-all duration-500 hover:scale-105">
                                    <ThemeToggle />
                                </div>
                                
                                {sectionLinks.map((link) => (
                                    <button
                                        key={link.to}
                                        onClick={() => handleNavClick(link)}
                                        className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-500 relative overflow-hidden cursor-pointer border-0 bg-transparent group ${
                                            activeSection === link.to.substring(1) || (link.to === '/' && activeSection === 'home')
                                                ? 'text-white bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600'
                                                : 'text-purple-200/80 hover:text-white hover:bg-purple-600/20'
                                        }`}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                        <span className="relative z-10 flex items-center gap-3">
                                            <span className="text-lg transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">
                                                {link.icon}
                                            </span>
                                            {link.label}
                                        </span>
                                    </button>
                                ))}
                                {user ? (
                                    <Link 
                                        to={`/${user.role.toLowerCase()}`} 
                                        onClick={() => setIsMobileMenuOpen(false)} 
                                        className="flex items-center gap-2 px-4 py-3 text-sm font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white rounded-xl transition-all duration-500 hover:scale-105 relative overflow-hidden group"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                        <Zap size={16} className="group-hover:rotate-12 transition-transform duration-300" />
                                        <span>Dashboard</span>
                                    </Link>
                                ) : (
                                    location.pathname !== '/login' && (
                                        <Link 
                                            to="/login" 
                                            onClick={() => setIsMobileMenuOpen(false)} 
                                            className="flex items-center gap-2 px-4 py-3 text-sm font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white rounded-xl transition-all duration-500 hover:scale-105 relative overflow-hidden group"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                            <LogIn size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                                            <span>Login</span>
                                        </Link>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Add this to your global CSS or component style tag */}
            <style jsx>{`
                @keyframes slide {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px) translateX(0px); }
                    25% { transform: translateY(-20px) translateX(10px); }
                    75% { transform: translateY(20px) translateX(-10px); }
                }
                
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0px) translateX(0px); }
                    25% { transform: translateY(20px) translateX(-10px); }
                    75% { transform: translateY(-20px) translateX(10px); }
                }
                
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.1; transform: scale(1); }
                    50% { opacity: 0.2; transform: scale(1.1); }
                }
                
                @keyframes twinkle {
                    0%, 100% { opacity: 0; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.5); }
                }
                
                @keyframes sparkle {
                    0%, 100% { opacity: 0; transform: scale(0.5) rotate(0deg); }
                    50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
                }
                
                @keyframes ripple {
                    0% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.7); }
                    100% { box-shadow: 0 0 0 10px rgba(139, 92, 246, 0); }
                }
                
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                
                .animate-float-delayed {
                    animation: float-delayed 8s ease-in-out infinite;
                }
                
                .animate-pulse-slow {
                    animation: pulse-slow 4s ease-in-out infinite;
                }
                
                .animate-twinkle {
                    animation: twinkle 3s ease-in-out infinite;
                }
                
                .animate-sparkle {
                    animation: sparkle 2s ease-in-out infinite;
                }
                
                .animate-ripple {
                    animation: ripple 0.6s ease-out;
                }
                
                .animate-slideDown {
                    animation: slideDown 0.3s ease-out;
                }
            `}</style>
        </>
    );
};

export default Navbar;