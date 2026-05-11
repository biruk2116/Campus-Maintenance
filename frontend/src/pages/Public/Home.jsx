import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Zap, Activity } from 'lucide-react';

import PublicLayout from '../../components/public/PublicLayout';
import AboutUs from './AboutUs';
import Services from './Services';
import Features from './Features';
import Contacts from './Contacts';

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

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: i * 0.11 },
    }),
};

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const sectionId = routeToSection[location.pathname] || 'home';
        const timer = window.setTimeout(() => scrollToSection(sectionId, 'smooth'), 50);
        return () => window.clearTimeout(timer);
    }, [location.pathname]);

    const stats = [
        { value: '2 min',  label: 'Avg. Response'  },
        { value: '99.8%',  label: 'Uptime'          },
        { value: '4,200+', label: 'Issues Resolved' },
    ];

    const badges = [
        { icon: <Zap size={12} />,          label: 'Real-time Tracking' },
        { icon: <CheckCircle2 size={12} />, label: 'Instant Reports'    },
        { icon: <Activity size={12} />,     label: 'Live Dashboard'     },
    ];

    return (
        <PublicLayout>

            {/* ═══════════ HERO ═══════════ */}
            <section
                id="home"
                className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300"
            >
                {/* ── Top radial glow — adapts per theme ── */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_55%_at_50%_-5%,theme(colors.sky.100),transparent)] dark:bg-[radial-gradient(ellipse_80%_55%_at_50%_-5%,rgba(14,165,233,0.11),transparent)]" />

                {/* ── Ambient orbs ── */}
                <motion.div
                    animate={{ scale: [1, 1.22, 1], opacity: [0.55, 0.9, 0.55] }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none bg-sky-200/50 blur-[110px] dark:bg-cyan-500/10 dark:blur-[130px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.16, 1], opacity: [0.45, 0.75, 0.45] }}
                    transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
                    className="absolute -bottom-40 -right-20 w-[560px] h-[560px] rounded-full pointer-events-none bg-blue-200/40 blur-[120px] dark:bg-blue-600/10 dark:blur-[150px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.28, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full pointer-events-none bg-cyan-100/30 blur-[90px] dark:bg-indigo-500/8 dark:blur-[110px]"
                />

                {/* ── Dot grid ── */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(circle, rgb(14 165 233 / 0.18) 1px, transparent 1px)',
                        backgroundSize: '28px 28px',
                        maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 20%, transparent 75%)',
                        WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 20%, transparent 75%)',
                    }}
                />

                {/* ── Dark-only floating particles ── */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none hidden dark:block">
                    {[...Array(13)].map((_, i) => (
                        <motion.span
                            key={i}
                            animate={{ y: [0, -80, 0], opacity: [0, 0.6, 0] }}
                            transition={{ duration: 5 + (i % 4), repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
                            className="absolute w-[3px] h-[3px] rounded-full bg-cyan-400/60"
                            style={{ left: `${7 + i * 7}%`, bottom: `${8 + (i % 5) * 12}%` }}
                        />
                    ))}
                </div>

                {/* ── Dark-only scan line ── */}
                <motion.div
                    animate={{ y: ['-100%', '110vh'] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear', delay: 2 }}
                    className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent pointer-events-none hidden dark:block"
                />

                {/* ── Top decorative line ── */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 dark:via-cyan-500/40 to-transparent pointer-events-none" />

                {/* ══ CONTENT ══ */}
                <div className="relative z-10 w-full max-w-4xl mx-auto px-6 md:px-10 pt-32 pb-28 flex flex-col items-center text-center">

                    {/* Badge pills */}
                    <motion.div
                        initial="hidden" animate="visible" variants={fadeUp} custom={0}
                        className="flex flex-wrap items-center justify-center gap-2 mb-9"
                    >
                        {badges.map((b) => (
                            <span
                                key={b.label}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-bold tracking-widest uppercase border border-sky-200 bg-sky-50 text-sky-600 dark:border-cyan-500/20 dark:bg-cyan-500/8 dark:text-cyan-300 transition-colors duration-300"
                            >
                                {b.icon}
                                {b.label}
                            </span>
                        ))}
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial="hidden" animate="visible" variants={fadeUp} custom={1}
                        className="text-[clamp(2.5rem,6.5vw,4.75rem)] font-black leading-[1.06] tracking-tight mb-5 text-slate-900 dark:text-slate-50"
                    >
                        Smart Campus
                        <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 dark:from-cyan-300 dark:via-sky-300 dark:to-blue-400">
                            Maintenance System
                        </span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial="hidden" animate="visible" variants={fadeUp} custom={2}
                        className="max-w-[530px] text-base md:text-[1.07rem] leading-relaxed mb-10 text-slate-500 dark:text-slate-400"
                    >
                        Report issues instantly, track technician progress in real-time,
                        and keep campus infrastructure running at its best.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial="hidden" animate="visible" variants={fadeUp} custom={3}
                        className="flex flex-col sm:flex-row gap-3 justify-center mb-16"
                    >
                        {/* Primary */}
                        <button className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-bold tracking-wide text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-lg shadow-sky-500/30 dark:shadow-sky-500/20 hover:shadow-xl hover:shadow-sky-500/35 hover:-translate-y-0.5 transition-all duration-200">
                            Get Started
                            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
                        </button>

                        {/* Ghost */}
                        <button className="inline-flex items-center justify-center px-7 py-3.5 rounded-full text-sm font-semibold border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-100 shadow-sm hover:shadow-md transition-all duration-200">
                            Learn More
                        </button>
                    </motion.div>

                    {/* Stats strip */}
                    <motion.div
                        initial="hidden" animate="visible" variants={fadeUp} custom={4}
                        className="flex items-center justify-center gap-10 md:gap-16 pt-8 border-t border-slate-100 dark:border-slate-800/80 w-full max-w-md mx-auto"
                    >
                        {stats.map((stat) => (
                            <div key={stat.label} className="flex flex-col items-center gap-1">
                                <span className="text-xl md:text-2xl font-extrabold leading-none text-transparent bg-clip-text bg-gradient-to-br from-sky-500 to-blue-600 dark:from-cyan-200 dark:to-blue-300">
                                    {stat.value}
                                </span>
                                <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-slate-400 dark:text-slate-500">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Bottom section bleed */}
                <div className="absolute bottom-0 inset-x-0 h-28 pointer-events-none bg-gradient-to-t from-white dark:from-slate-950 to-transparent" />

            </section>

            <AboutUs />
            <Services />
            <Features />
            <Contacts />

        </PublicLayout>
    );
};

export default Home;