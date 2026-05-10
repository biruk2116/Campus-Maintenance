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
    const [hoveredLink, setHoveredLink] = useState(null);

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

    const isLinkActive = (link) =>
        activeSection === link.to.substring(1) || (link.to === '/' && activeSection === 'home');

    return (
        <>
            {/* ── Keyframes injected once ── */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');

                @keyframes navScanLine {
                    0%   { transform: translateX(-100%); }
                    100% { transform: translateX(400%);  }
                }
                @keyframes navOrb1 {
                    0%,100% { transform: translate(0,0)   scale(1);    opacity: 0.35; }
                    33%     { transform: translate(12px,-8px) scale(1.15); opacity: 0.55; }
                    66%     { transform: translate(-8px,6px)  scale(0.9);  opacity: 0.4;  }
                }
                @keyframes navOrb2 {
                    0%,100% { transform: translate(0,0)    scale(1);    opacity: 0.3;  }
                    40%     { transform: translate(-14px,8px) scale(1.2);  opacity: 0.5;  }
                    70%     { transform: translate(10px,-6px) scale(0.85); opacity: 0.35; }
                }
                @keyframes navOrb3 {
                    0%,100% { transform: translate(0,0)   scale(1);    opacity: 0.25; }
                    50%     { transform: translate(8px,10px) scale(1.3);  opacity: 0.5;  }
                }
                @keyframes navShimmer {
                    0%   { background-position: -200% center; }
                    100% { background-position:  200% center; }
                }
                @keyframes navPulseRing {
                    0%   { transform: scale(1);   opacity: 0.7; }
                    100% { transform: scale(2.2); opacity: 0;   }
                }
                @keyframes navActiveDot {
                    0%,100% { opacity: 1; transform: scaleX(1); }
                    50%     { opacity: 0.6; transform: scaleX(0.6); }
                }
                @keyframes mobileSlideIn {
                    from { opacity: 0; transform: translateY(-12px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0)      scale(1);    }
                }
                @keyframes navBorderFlow {
                    0%   { background-position: 0% 50%;   }
                    50%  { background-position: 100% 50%; }
                    100% { background-position: 0% 50%;   }
                }

                .nav-link-btn {
                    font-family: 'Sora', sans-serif;
                    position: relative;
                    overflow: hidden;
                    cursor: pointer;
                    border: none;
                    background: transparent;
                    padding: 0.45rem 1rem;
                    border-radius: 0.6rem;
                    font-size: 0.82rem;
                    font-weight: 600;
                    letter-spacing: 0.03em;
                    transition: color 0.25s, transform 0.2s;
                }
                .nav-link-btn:hover { transform: translateY(-1px); }
                .nav-link-btn:active { transform: translateY(0) scale(0.97); }

                /* Shimmer sweep on hover */
                .nav-link-btn .sweep {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.22) 50%, transparent 70%);
                    transform: translateX(-100%);
                    transition: none;
                    pointer-events: none;
                }
                .nav-link-btn:hover .sweep {
                    animation: navScanLine 0.55s ease forwards;
                }

                /* Glow ring on active */
                .nav-link-btn .glow-ring {
                    position: absolute;
                    inset: -1px;
                    border-radius: 0.65rem;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.3s;
                    background: linear-gradient(135deg, #3B82F6, #06B6D4, #3B82F6);
                    background-size: 200% 200%;
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    padding: 1.5px;
                }
                .nav-link-btn.is-active .glow-ring,
                .nav-link-btn:hover .glow-ring {
                    opacity: 1;
                    animation: navBorderFlow 2.5s linear infinite;
                }

                /* Active indicator dot */
                .nav-link-btn .active-dot {
                    position: absolute;
                    bottom: 3px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 14px;
                    height: 2.5px;
                    border-radius: 2px;
                    background: linear-gradient(90deg, #38BDF8, #6366F1);
                    opacity: 0;
                    transition: opacity 0.3s, width 0.3s;
                }
                .nav-link-btn.is-active .active-dot {
                    opacity: 1;
                    animation: navActiveDot 2s ease-in-out infinite;
                }

                /* CTA button */
                .nav-cta-btn {
                    font-family: 'Sora', sans-serif;
                    position: relative;
                    overflow: hidden;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    padding: 0.55rem 1.25rem;
                    font-size: 0.82rem;
                    font-weight: 700;
                    letter-spacing: 0.04em;
                    border-radius: 0.6rem;
                    color: #fff;
                    background: linear-gradient(135deg, #2563EB 0%, #0891B2 50%, #6366F1 100%);
                    background-size: 200% 200%;
                    border: none;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.3s;
                    animation: navBorderFlow 4s ease infinite;
                    box-shadow: 0 4px 18px rgba(6,182,212,0.3), 0 0 0 0 rgba(6,182,212,0);
                }
                .nav-cta-btn:hover {
                    transform: translateY(-2px) scale(1.04);
                    box-shadow: 0 8px 28px rgba(6,182,212,0.5), 0 0 20px rgba(99,102,241,0.3);
                }
                .nav-cta-btn:active { transform: scale(0.97); }
                .nav-cta-btn .cta-sweep {
                    position: absolute; inset: 0;
                    background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%);
                    transform: translateX(-100%);
                    pointer-events: none;
                }
                .nav-cta-btn:hover .cta-sweep {
                    animation: navScanLine 0.6s ease forwards;
                }

                /* Logo */
                .nav-logo-text {
                    font-family: 'Sora', sans-serif;
                    font-weight: 800;
                    font-size: 1.1rem;
                    letter-spacing: -0.01em;
                    background: linear-gradient(135deg, #1E40AF, #0891B2, #6366F1);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: navShimmer 4s linear infinite;
                }
                .dark .nav-logo-text {
                    background-image: linear-gradient(135deg, #60A5FA, #22D3EE, #A5B4FC);
                }
                .nav-logo-sub {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 0.58rem;
                    font-weight: 600;
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                }

                /* Mobile menu */
                .mobile-menu {
                    animation: mobileSlideIn 0.28s cubic-bezier(0.34,1.56,0.64,1) forwards;
                }
                .mobile-nav-btn {
                    font-family: 'Sora', sans-serif;
                    font-size: 0.88rem;
                    font-weight: 600;
                    letter-spacing: 0.03em;
                }
            `}</style>

            <nav
                className={`fixed top-0 left-0 right-0 z-50 w-full h-16 px-4 md:px-6 py-3 transition-all duration-500 overflow-visible ${
                    isScrolled
                        ? 'dark:bg-[#050e1f]/95 bg-white/95 backdrop-blur-2xl shadow-[0_4px_40px_rgba(6,182,212,0.12),0_1px_0_rgba(59,130,246,0.15)] border-b border-cyan-500/10 dark:border-cyan-500/15'
                        : 'dark:bg-[#050e1f]/80 bg-white/85 backdrop-blur-lg border-b border-transparent'
                }`}
            >
                {/* ── Ambient orbs ── */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Left orb */}
                    <div
                        className="absolute top-1/2 -translate-y-1/2 left-[15%] w-32 h-8 rounded-full bg-blue-500/20 dark:bg-blue-400/25 blur-2xl"
                        style={{ animation: 'navOrb1 7s ease-in-out infinite' }}
                    />
                    {/* Center orb */}
                    <div
                        className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-48 h-6 rounded-full bg-cyan-400/15 dark:bg-cyan-400/20 blur-2xl"
                        style={{ animation: 'navOrb2 9s ease-in-out infinite' }}
                    />
                    {/* Right orb */}
                    <div
                        className="absolute top-1/2 -translate-y-1/2 right-[15%] w-28 h-8 rounded-full bg-indigo-500/15 dark:bg-indigo-400/20 blur-2xl"
                        style={{ animation: 'navOrb3 11s ease-in-out infinite' }}
                    />

                    {/* Scan line across full width */}
                    <div
                        className="absolute top-0 left-0 h-full w-[120px] bg-gradient-to-r from-transparent via-cyan-400/8 to-transparent"
                        style={{ animation: 'navScanLine 8s linear infinite' }}
                    />

                    {/* Bottom edge glow line */}
                    <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent transition-opacity duration-500 ${isScrolled ? 'opacity-100' : 'opacity-0'}`} />
                </div>

                <div className="w-full max-w-7xl mx-auto flex items-center justify-between relative z-10">

                    {/* ── Logo ── */}
                    <Link to="/" className="flex items-center gap-3 group">
                        {/* Logo glow ring */}
                        <div className="relative">
                            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-blue-500/30 to-cyan-500/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                            <div className="absolute -inset-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="w-full h-full rounded-full"
                                     style={{
                                         background: 'conic-gradient(from 0deg, #3B82F6, #06B6D4, #6366F1, #3B82F6)',
                                         animation: 'navBorderFlow 2s linear infinite',
                                         padding: '1.5px',
                                         borderRadius: '50%',
                                     }}
                                />
                            </div>
                            <img
                                src={DBULogo}
                                alt="DBU Logo"
                                className="relative w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="nav-logo-text group-hover:brightness-110 transition-all">DBU</span>
                            <span className="nav-logo-sub text-slate-500 dark:text-slate-400 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors duration-300">
                                Maintenance
                            </span>
                        </div>
                    </Link>

                    <div className="flex items-center gap-5">

                        {/* ── Desktop Nav Links ── */}
                        <div className="hidden md:flex items-center gap-0.5">
                            {sectionLinks.map((link) => {
                                const active = isLinkActive(link);
                                return (
                                    <button
                                        key={link.to}
                                        onClick={() => handleNavClick(link)}
                                        onMouseEnter={() => setHoveredLink(link.to)}
                                        onMouseLeave={() => setHoveredLink(null)}
                                        className={`nav-link-btn ${active ? 'is-active' : ''} ${
                                            active
                                                ? 'text-blue-600 dark:text-cyan-300 bg-gradient-to-r from-blue-50/80 to-cyan-50/60 dark:from-blue-900/35 dark:to-cyan-900/25'
                                                : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-300'
                                        }`}
                                        style={{
                                            boxShadow: active
                                                ? '0 2px 16px rgba(6,182,212,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
                                                : hoveredLink === link.to
                                                    ? '0 4px 20px rgba(6,182,212,0.15)'
                                                    : 'none',
                                            background: active
                                                ? undefined
                                                : hoveredLink === link.to
                                                    ? 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(6,182,212,0.06))'
                                                    : undefined,
                                        }}
                                    >
                                        {/* Animated border ring */}
                                        <span className="glow-ring" />
                                        {/* Hover sweep */}
                                        <span className="sweep" />
                                        {/* Label */}
                                        <span className="relative z-10">{link.label}</span>
                                        {/* Active underline dot */}
                                        <span className="active-dot" />
                                    </button>
                                );
                            })}
                        </div>

                        {/* ── Right actions ── */}
                        <div className="flex items-center gap-2.5">
                            <ThemeToggle />

                            {user ? (
                                <Link
                                    to={`/${user.role.toLowerCase()}`}
                                    className="nav-cta-btn hidden md:inline-flex"
                                >
                                    <span className="cta-sweep" />
                                    <Activity size={15} className="relative z-10 shrink-0" />
                                    <span className="relative z-10">Dashboard</span>
                                </Link>
                            ) : (
                                location.pathname !== '/login' && (
                                    <Link
                                        to="/login"
                                        className="nav-cta-btn hidden md:inline-flex"
                                    >
                                        <span className="cta-sweep" />
                                        <LogIn size={15} className="relative z-10 shrink-0" />
                                        <span className="relative z-10">Login</span>
                                    </Link>
                                )
                            )}

                            {/* Hamburger */}
                            <button
                                className={`md:hidden relative p-2.5 rounded-lg transition-all duration-300 border overflow-hidden group
                                    ${isMobileMenuOpen
                                        ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.3)]'
                                        : 'border-slate-300/60 dark:border-slate-600/60 text-slate-600 dark:text-slate-300 hover:border-cyan-400/60 hover:text-cyan-500 hover:bg-cyan-50/50 dark:hover:bg-cyan-900/20 hover:shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                                    }`}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                                {isMobileMenuOpen ? <X size={22} className="relative z-10" /> : <Menu size={22} className="relative z-10" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Mobile Menu ── */}
                {isMobileMenuOpen && (
                    <div className="mobile-menu md:hidden absolute top-full left-3 right-3 mt-2 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(6,182,212,0.18),0_4px_20px_rgba(0,0,0,0.2)] border border-cyan-500/15 dark:border-cyan-500/20 z-50">
                        {/* Glass background */}
                        <div className="absolute inset-0 bg-white/95 dark:bg-[#060f22]/97 backdrop-blur-2xl" />

                        {/* Top glow edge */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
                        {/* Bottom glow edge */}
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

                        {/* Ambient blobs inside mobile menu */}
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-cyan-400/8 dark:bg-cyan-400/12 blur-2xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full bg-blue-500/8 dark:bg-blue-500/12 blur-2xl pointer-events-none" />

                        <div className="relative z-10 flex flex-col gap-1.5 p-4">
                            <div className="flex justify-center mb-1 pb-3 border-b border-slate-200/60 dark:border-slate-700/40">
                                <ThemeToggle />
                            </div>

                            {sectionLinks.map((link, i) => {
                                const active = isLinkActive(link);
                                return (
                                    <button
                                        key={link.to}
                                        onClick={() => handleNavClick(link)}
                                        className={`mobile-nav-btn relative w-full text-left px-4 py-3 rounded-xl overflow-hidden transition-all duration-300 group/mob
                                            ${active
                                                ? 'text-blue-600 dark:text-cyan-300 shadow-[0_2px_20px_rgba(6,182,212,0.18)]'
                                                : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-300'
                                            }`}
                                        style={{
                                            background: active
                                                ? 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(6,182,212,0.08))'
                                                : undefined,
                                            animationDelay: `${i * 0.06}s`,
                                        }}
                                    >
                                        {/* Hover bg */}
                                        <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-50/80 to-cyan-50/60 dark:from-blue-900/30 dark:to-cyan-900/20 opacity-0 group-hover/mob:opacity-100 transition-opacity duration-300" />
                                        {/* Sweep */}
                                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/mob:translate-x-full transition-transform duration-600" />
                                        {/* Left accent bar */}
                                        {active && (
                                            <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-gradient-to-b from-blue-500 to-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                                        )}
                                        <span className="relative z-10 flex items-center gap-2">
                                            {active && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.7)] shrink-0" />
                                            )}
                                            {link.label}
                                        </span>
                                    </button>
                                );
                            })}

                            <div className="pt-2 mt-1 border-t border-slate-200/60 dark:border-slate-700/40">
                                {user ? (
                                    <Link
                                        to={`/${user.role.toLowerCase()}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="nav-cta-btn w-full justify-center"
                                    >
                                        <span className="cta-sweep" />
                                        <Activity size={15} className="relative z-10 shrink-0" />
                                        <span className="relative z-10">Dashboard</span>
                                    </Link>
                                ) : (
                                    location.pathname !== '/login' && (
                                        <Link
                                            to="/login"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="nav-cta-btn w-full justify-center"
                                        >
                                            <span className="cta-sweep" />
                                            <LogIn size={15} className="relative z-10 shrink-0" />
                                            <span className="relative z-10">Login</span>
                                        </Link>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
};

export default Navbar;