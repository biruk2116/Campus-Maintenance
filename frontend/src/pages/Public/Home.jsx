import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Activity,
    ArrowRight,
    CheckCircle2,
    Zap,
} from 'lucide-react';

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
    '/Contacts': 'contacts'
};

const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: 'easeOut' } }
};

const fadeLeft = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: 'easeOut' } }
};

const fadeRight = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: 'easeOut' } }
};

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
};

const statVariant = {
    hidden: { opacity: 0, scale: 0.7, y: 20 },
    visible: (i) => ({
        opacity: 1, scale: 1, y: 0,
        transition: { delay: i * 0.12, duration: 0.6, ease: 'easeOut' }
    })
};

const scrollToSection = (sectionId, behavior = 'smooth') => {
    const element = document.getElementById(sectionId);
    if (!element) return;
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = Math.max(elementPosition - NAVBAR_OFFSET, 0);
    window.scrollTo({ top: offsetPosition, behavior });
};

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const sectionId = routeToSection[location.pathname] || 'home';
        const timer = window.setTimeout(() => {
            scrollToSection(sectionId, 'smooth');
        }, 50);
        return () => window.clearTimeout(timer);
    }, [location.pathname]);

    return (
        <PublicLayout>
            {/* HERO SECTION */}
            <motion.section
                id="home"
                className="relative w-full min-h-screen flex items-center justify-center px-4 md:px-8 py-12 md:py-16 overflow-hidden spiral-dot-pattern bg-gradient-to-br from-background via-background to-surface/30 dark:to-surface/20"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={staggerContainer}
            >
                {/* ── Dark overlay ── */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-100 via-slate-200/80 to-slate-300/50 dark:from-black dark:via-black/85 dark:to-black/30" />

                {/* ── Animated mesh blobs ── */}
                <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                    {/* Top-left large blob */}
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
                        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl"
                    />
                    {/* Bottom-right blob */}
                    <motion.div
                        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                        className="absolute -bottom-20 -right-10 w-[28rem] h-[28rem] rounded-full bg-cyan-500/15 blur-3xl"
                    />
                    {/* Center accent blob */}
                    <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.35, 0.15] }}
                        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl"
                    />
                    {/* Top-right small accent */}
                    <motion.div
                        animate={{ y: [-10, 10, -10], opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
                        className="absolute top-10 right-1/4 w-40 h-40 rounded-full bg-sky-400/15 blur-2xl"
                    />
                </div>

                {/* ── Floating particles ── */}
                <div className="absolute inset-0 -z-10 pointer-events-none">
                    {[...Array(12)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                y: [0, -80, 0],
                                opacity: [0, 0.8, 0],
                                scale: [0.8, 1.2, 0.8],
                            }}
                            transition={{
                                duration: 5 + (i % 4),
                                repeat: Infinity,
                                delay: i * 0.6,
                                ease: 'easeInOut',
                            }}
                            className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400/60"
                            style={{
                                left: `${8 + (i * 7.5)}%`,
                                bottom: `${10 + (i % 5) * 12}%`,
                            }}
                        />
                    ))}
                </div>

                {/* ── Horizontal scan line ── */}
                <motion.div
                    animate={{ y: ['-100%', '100vh'] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'linear', delay: 1 }}
                    className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent -z-10 pointer-events-none"
                />

                {/* ── Grid overlay ── */}
                <div
                    className="absolute inset-0 -z-10 opacity-[0.04] pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(99,179,237,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,179,237,1) 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 80%)',
                        WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 80%)',
                    }}
                />

                {/* ── Main content grid ── */}
                <div className="relative z-10 w-full max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

                        {/* ─── Left Content ─── */}
                        <motion.div variants={fadeLeft} className="flex flex-col justify-center py-4 text-slate-900 dark:text-white">

                            {/* Badge */}
                            <motion.div
                                animate={{ y: [0, -4, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/25 text-slate-900 dark:text-white text-xs font-bold tracking-widest mb-5 w-fit backdrop-blur-md shadow-lg shadow-black/20 dark:shadow-black/40"
                            >
                                {/* Animated green dot */}
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                                </span>
                                <CheckCircle2 size={13} className="text-cyan-300" />
                                Trusted by the DBU Community
                            </motion.div>

                            {/* Heading */}
                            <motion.h1
                                variants={fadeUp}
                                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] mb-4 text-slate-900 dark:text-white drop-shadow-lg"
                            >
                                Fast, Transparent
                                <br />
                                <span className="bg-gradient-to-r from-blue-300 via-cyan-200 to-blue-400 bg-clip-text text-transparent animate-[shimmer_3s_ease-in-out_infinite] bg-[length:200%_auto]">
                                    Campus Maintenance
                                </span>
                            </motion.h1>

                            {/* Subtitle */}
                            <motion.p
                                variants={fadeUp}
                                className="text-sm md:text-base text-slate-700 dark:text-white/75 leading-relaxed mb-6 max-w-xl"
                            >
                                Report issues instantly, track progress in real time, and keep
                                university facilities running smoothly from one central place.
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div
                                variants={fadeUp}
                                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8"
                            >
                                <motion.button
                                    whileHover={{ y: -3, scale: 1.03, boxShadow: '0 12px 32px rgba(6,182,212,0.45)' }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => navigate('/login')}
                                    className="relative w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 bg-[length:200%_auto] text-white font-bold text-sm shadow-lg shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group"
                                >
                                    {/* Shimmer layer */}
                                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                    <Zap size={15} className="relative z-10" />
                                    <span className="relative z-10">Report Issue</span>
                                    <ArrowRight size={15} className="relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
                                </motion.button>

                                <motion.button
                                    whileHover={{ y: -3, scale: 1.03, backgroundColor: 'rgba(255,255,255,0.15)' }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => navigate('/login')}
                                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-slate-900 dark:text-white font-bold text-sm hover:border-cyan-400/50 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <Activity size={15} className="text-cyan-300" />
                                    Track Request
                                </motion.button>
                            </motion.div>

                            {/* Stats */}
                            <div className="flex gap-6 md:gap-8 pt-4 border-t border-white/10 dark:border-slate-600/30">
                                {[
                                    { value: '2000+', label: 'Issues Resolved' },
                                    { value: '500+',  label: 'Active Users' },
                                    { value: '24/7',  label: 'Available' },
                                ].map((stat, i) => (
                                    <motion.div
                                        key={stat.label}
                                        custom={i}
                                        variants={statVariant}
                                        whileHover={{ scale: 1.08, y: -2 }}
                                        className="flex flex-col cursor-default"
                                    >
                                        <span className="text-lg md:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 leading-tight">
                                            {stat.value}
                                        </span>
                                        <span className="text-[10px] md:text-xs text-slate-600 dark:text-white/60 mt-0.5 tracking-wide uppercase">
                                            {stat.label}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* ─── Right Visual ─── */}
                        <motion.div
                            variants={fadeRight}
                            className="hidden lg:flex items-center justify-center"
                        >
                            <motion.div
                                whileHover={{ scale: 1.03, rotateY: 3, rotateX: -2 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                                className="relative w-full h-[420px] group"
                                style={{ perspective: '1000px' }}
                            >
                                {/* Outer glow ring */}
                                <motion.div
                                    animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.04, 1] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                    className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-blue-500/20 via-cyan-400/15 to-indigo-500/20 blur-2xl"
                                />

                                {/* Image */}
                                <img
                                    src={HeroImg}
                                    alt="Campus Maintenance"
                                    className="relative z-10 w-full h-full object-cover rounded-2xl shadow-2xl shadow-black/60 border border-white/10 group-hover:border-cyan-400/30 transition-all duration-500"
                                />

                                {/* Top-left floating status card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: [0, -5, 0] }}
                                    transition={{ delay: 0.8, duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                    className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-2 rounded-xl bg-black/60 dark:bg-slate-800/80 backdrop-blur-md border border-white/15 shadow-xl"
                                >
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                                    </span>
                                    <span className="text-white text-xs font-semibold">System Live</span>
                                </motion.div>

                                {/* Bottom-right floating stat card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: [0, -4, 0] }}
                                    transition={{ delay: 1.2, duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                                    className="absolute bottom-4 right-4 z-20 px-4 py-2.5 rounded-xl bg-black/60 dark:bg-slate-800/80 backdrop-blur-md border border-white/15 shadow-xl"
                                >
                                    <div className="text-cyan-300 text-base font-extrabold leading-tight">12 Fixed</div>
                                    <div className="text-white/60 text-[10px] uppercase tracking-wide">Today</div>
                                </motion.div>

                                {/* Bottom-left floating card */}
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: [0, 4, 0] }}
                                    transition={{ delay: 1.6, duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                    className="absolute bottom-4 left-4 z-20 flex items-center gap-2 px-3 py-2 rounded-xl bg-black/60 dark:bg-slate-800/80 backdrop-blur-md border border-white/15 shadow-xl"
                                >
                                    <Activity size={13} className="text-cyan-300" />
                                    <span className="text-white text-xs font-semibold">4 Active Reports</span>
                                </motion.div>

                                {/* Gradient overlay on image */}
                                <div className="absolute inset-0 z-10 rounded-2xl bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                            </motion.div>
                        </motion.div>

                    </div>
                </div>

                {/* ── Scroll hint ── */}
                <motion.div
                    animate={{ y: [0, 8, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 cursor-pointer"
                    onClick={() => scrollToSection('about-us')}
                >
                    <span className="text-slate-600 dark:text-white/40 text-[10px] uppercase tracking-widest">Scroll</span>
                    <div className="w-5 h-8 rounded-full border border-slate-400 dark:border-white/20 flex items-start justify-center pt-1.5">
                        <motion.div
                            animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-1 h-1.5 rounded-full bg-cyan-400"
                        />
                    </div>
                </motion.div>
            </motion.section>

            {/* Other Sections */}
            <AboutUs />
            <Services />
            <Features />
            <Contacts />

            {/* Theme Showcase Section */}
            <motion.section
                id="theme-showcase"
                className="section-container bg-gradient-to-r from-background via-surface/50 to-background"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={staggerContainer}
            >
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h2
                        variants={fadeUp}
                        className="text-2xl md:text-3xl font-extrabold text-textPrimary mb-4"
                    >
                        Experience Light & Dark Modes
                    </motion.h2>
                    <motion.p
                        variants={fadeUp}
                        className="text-textSecondary mb-6"
                    >
                        Toggle between light and dark themes using the switch in the navigation bar above.
                        The entire application adapts seamlessly to your preference.
                    </motion.p>
                    <motion.div
                        variants={fadeUp}
                        className="flex justify-center"
                    >
                        <div className="glass-card p-6 max-w-md">
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
                                    <span className="text-xs">☀️</span>
                                </div>
                                <div className="text-textSecondary">/</div>
                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                                    <span className="text-xs">🌙</span>
                                </div>
                            </div>
                            <p className="text-sm text-textSecondary">
                                Choose your preferred theme for comfortable viewing in any lighting condition.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </motion.section>
        </PublicLayout>
    );
};

export default Home;