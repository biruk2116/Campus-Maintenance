import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Zap, Activity } from 'lucide-react';

import PublicLayout from '../../components/public/PublicLayout';
import AboutUs from './AboutUs';
import Services from './Services';
import Features from './Features';
import Contacts from './Contacts';
import HeroImg from '../../assets/images/maint_hero.png';

const NAVBAR_OFFSET = 65;

const routeToSection = {
    '/': 'home',
    '/home': 'home',
    '/Home': 'home',
    '/about-us': 'about-us',
    '/About-us': 'about-us',
    '/services': 'services',
    '/Services': 'services',
    '/features': 'features',
    '/Features': 'features',
    '/contacts': 'contacts',
    '/Contacts': 'contacts',
};

const scrollToSection = (sectionId, behavior = 'smooth') => {
    const element = document.getElementById(sectionId);
    if (!element) return;
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = Math.max(elementPosition - NAVBAR_OFFSET, 0);
    window.scrollTo({ top: offsetPosition, behavior });
};

/* ── animation variants ── */
const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 },
    }),
};

const Home = () => {
    const navigate  = useNavigate();
    const location  = useLocation();

    useEffect(() => {
        const sectionId = routeToSection[location.pathname] || 'home';
        const timer = window.setTimeout(() => scrollToSection(sectionId, 'smooth'), 50);
        return () => window.clearTimeout(timer);
    }, [location.pathname]);

    const stats = [
        { value: '2 min', label: 'Avg. Response' },
        { value: '99.8%', label: 'Uptime' },
        { value: '4,200+', label: 'Issues Resolved' },
    ];

    const badges = [
        { icon: <Zap size={13} />,          label: 'Real-time Tracking'  },
        { icon: <CheckCircle2 size={13} />, label: 'Instant Reports'     },
        { icon: <Activity size={13} />,     label: 'Live Dashboard'      },
    ];

    return (
        <PublicLayout>
            {/* ══════════════════ HERO ══════════════════ */}
            <section
                id="home"
                className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#060c18]"
            >
                {/* ── Background image with parallax-ish scale ── */}
                <motion.div
                    initial={{ scale: 1.08, opacity: 0 }}
                    animate={{ scale: 1,    opacity: 1 }}
                    transition={{ duration: 1.6, ease: 'easeOut' }}
                    className="absolute inset-0"
                    style={{
                        backgroundImage:    `url(${HeroImg})`,
                        backgroundSize:     'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat:   'no-repeat',
                    }}
                />

                {/* ── Multi-layer gradient scrim ── */}
                <div className="absolute inset-0 bg-gradient-to-b  from-[#060c18]/30 via-[#060c18]/55 to-[#060c18]"  />
                <div className="absolute inset-0 bg-gradient-to-r  from-[#060c18]/70 via-transparent       to-[#060c18]/40" />

                {/* ── Animated glow orbs ── */}
                <motion.div
                    animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0.45, 0.25] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full bg-cyan-500/20 blur-[120px] pointer-events-none"
                />
                <motion.div
                    animate={{ scale: [1, 1.18, 1], opacity: [0.2, 0.38, 0.2] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                    className="absolute -bottom-32 right-0 w-[560px] h-[560px] rounded-full bg-blue-600/20 blur-[140px] pointer-events-none"
                />

                {/* ── Subtle grid overlay ── */}
                <div
                    className="absolute inset-0 opacity-[0.05] pointer-events-none"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(99,179,237,1) 1px, transparent 1px), linear-gradient(90deg,rgba(99,179,237,1) 1px,transparent 1px)',
                        backgroundSize: '56px 56px',
                        maskImage:
                            'radial-gradient(ellipse 70% 70% at 50% 40%, black 20%, transparent 75%)',
                        WebkitMaskImage:
                            'radial-gradient(ellipse 70% 70% at 50% 40%, black 20%, transparent 75%)',
                    }}
                />

                {/* ── Floating particles ── */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(14)].map((_, i) => (
                        <motion.span
                            key={i}
                            animate={{ y: [0, -90, 0], opacity: [0, 0.7, 0] }}
                            transition={{
                                duration: 5 + (i % 4),
                                repeat: Infinity,
                                delay: i * 0.55,
                                ease: 'easeInOut',
                            }}
                            className="absolute w-1 h-1 rounded-full bg-cyan-300/70"
                            style={{
                                left:   `${6 + i * 6.8}%`,
                                bottom: `${8 + (i % 5) * 11}%`,
                            }}
                        />
                    ))}
                </div>

                {/* ── Scan line ── */}
                <motion.div
                    animate={{ y: ['-100%', '110vh'] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'linear', delay: 1.5 }}
                    className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent pointer-events-none"
                />

                {/* ══ CONTENT ══ */}
                <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-10 pt-28 pb-24 flex flex-col items-center text-center">

                    {/* Badge row */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        custom={0}
                        className="flex flex-wrap items-center justify-center gap-2 mb-8"
                    >
                        {badges.map((b) => (
                            <span
                                key={b.label}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase border border-cyan-400/20 bg-cyan-400/5 text-cyan-300 backdrop-blur-sm"
                            >
                                {b.icon}
                                {b.label}
                            </span>
                        ))}
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        custom={1}
                        className="text-[clamp(2.4rem,6vw,4.5rem)] font-black leading-[1.08] tracking-tight text-white mb-6"
                    >
                        Smart Campus{' '}
                        <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-400">
                            Maintenance System
                        </span>
                    </motion.h1>

                    {/* Sub-headline */}
                    <motion.p
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        custom={2}
                        className="max-w-xl text-slate-300/80 text-base md:text-lg leading-relaxed mb-10"
                    >
                        Report issues instantly, track technician progress in real-time,
                        and keep campus infrastructure running at its best.
                    </motion.p>

                    {/* CTA buttons */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        custom={3}
                        className="flex flex-col sm:flex-row gap-3 justify-center mb-16"
                    >
                        <button className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-bold tracking-wide shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/40 hover:-translate-y-0.5 transition-all duration-200">
                            Get Started
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                        </button>
                        <button className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-white/15 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/25 text-sm font-semibold backdrop-blur-sm transition-all duration-200">
                            Learn More
                        </button>
                    </motion.div>

                    {/* Stats strip */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        custom={4}
                        className="flex items-center justify-center gap-8 md:gap-14 pt-8 border-t border-white/10 w-full max-w-lg mx-auto"
                    >
                        {stats.map((stat, i) => (
                            <div key={stat.label} className="flex flex-col items-center gap-0.5">
                                <span className="text-xl md:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-cyan-200 to-blue-300 leading-none">
                                    {stat.value}
                                </span>
                                <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400 font-medium">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* ── Bottom fade into page ── */}
                <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#060c18] to-transparent pointer-events-none" />
            </section>

            {/* Other Sections */}
            <AboutUs />
            <Services />
            <Features />
            <Contacts />
        </PublicLayout>
    );
};

export default Home;