import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Activity,
    ArrowRight,
    CheckCircle2,
    Zap,
    Sparkles,
    Shield,
    Clock,
    ChevronDown,
    Heart,
    Star,
    TrendingUp,
    Award,
    Users,
    Moon,
    Sun
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
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const fadeLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const fadeRight = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } }
};

const statVariant = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: (i) => ({
        opacity: 1, scale: 1, y: 0,
        transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' }
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
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });
    
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    // Apply theme to document
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    useEffect(() => {
        const sectionId = routeToSection[location.pathname] || 'home';
        const timer = window.setTimeout(() => {
            scrollToSection(sectionId, 'smooth');
        }, 50);
        return () => window.clearTimeout(timer);
    }, [location.pathname]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <PublicLayout>
            {/* Theme Toggle Button */}
            <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                onClick={toggleTheme}
                className="fixed top-24 right-4 z-50 p-3 rounded-full bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg border border-gray-200/20 dark:border-gray-700/30 shadow-lg hover:scale-110 transition-all duration-300 group"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
            >
                {isDarkMode ? (
                    <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                    <Moon className="w-5 h-5 text-gray-700" />
                )}
            </motion.button>

            {/* HERO SECTION */}
            <motion.section
                id="home"
                className="relative w-full min-h-screen flex items-center justify-center px-4 md:px-8 py-12 md:py-16 overflow-hidden transition-colors duration-500"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={staggerContainer}
                style={{ opacity }}
            >
                {/* Dynamic Background based on theme */}
                <div className={`absolute inset-0 -z-10 transition-all duration-700 ${
                    isDarkMode 
                        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
                        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
                }`} />
                
                <div className={`absolute inset-0 -z-10 transition-all duration-700 ${
                    isDarkMode 
                        ? 'bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90' 
                        : 'bg-gradient-to-r from-blue-50/90 via-indigo-50/80 to-purple-50/90'
                }`} />
                
                {/* Animated gradient orbs - theme aware */}
                <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{ 
                            scale: [1, 1.2, 1], 
                            opacity: isDarkMode ? [0.2, 0.4, 0.2] : [0.1, 0.2, 0.1],
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                        className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl ${
                            isDarkMode ? 'bg-blue-600/30' : 'bg-blue-400/20'
                        }`}
                    />
                    
                    <motion.div
                        animate={{ 
                            scale: [1, 1.3, 1], 
                            opacity: isDarkMode ? [0.15, 0.35, 0.15] : [0.08, 0.18, 0.08],
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                        className={`absolute -bottom-40 -right-40 w-[30rem] h-[30rem] rounded-full blur-3xl ${
                            isDarkMode ? 'bg-cyan-500/20' : 'bg-cyan-400/15'
                        }`}
                    />
                    
                    <motion.div
                        animate={{ 
                            scale: [1, 1.15, 1], 
                            opacity: isDarkMode ? [0.12, 0.3, 0.12] : [0.06, 0.15, 0.06],
                        }}
                        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl ${
                            isDarkMode ? 'bg-indigo-500/25' : 'bg-indigo-400/15'
                        }`}
                    />
                </div>

                {/* Simplified floating particles - fewer for better performance */}
                <div className="absolute inset-0 -z-10 pointer-events-none">
                    {[...Array(12)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                y: [0, -80, 0],
                                opacity: [0, isDarkMode ? 0.4 : 0.2, 0],
                            }}
                            transition={{
                                duration: 5 + (i % 3),
                                repeat: Infinity,
                                delay: i * 0.3,
                                ease: 'easeInOut',
                            }}
                            className="absolute w-1 h-1 rounded-full"
                            style={{
                                background: `radial-gradient(circle, ${isDarkMode ? '#3b82f6' : '#60a5fa'}, transparent)`,
                                left: `${5 + (i * 8)}%`,
                                bottom: `${10 + (i % 8) * 12}%`,
                            }}
                        />
                    ))}
                </div>

                {/* Simplified grid overlay */}
                <div
                    className={`absolute inset-0 -z-10 pointer-events-none transition-opacity duration-500 ${
                        isDarkMode ? 'opacity-[0.02]' : 'opacity-[0.01]'
                    }`}
                    style={{
                        backgroundImage: `
                            linear-gradient(${isDarkMode ? 'rgba(59,130,246,0.3)' : 'rgba(37,99,235,0.2)'} 1px, transparent 1px),
                            linear-gradient(90deg, ${isDarkMode ? 'rgba(59,130,246,0.3)' : 'rgba(37,99,235,0.2)'} 1px, transparent 1px)
                        `,
                        backgroundSize: '60px 60px',
                    }}
                />

                {/* Main content */}
                <div className="relative z-10 w-full max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

                        {/* Left Content */}
                        <motion.div variants={fadeLeft} className="flex flex-col justify-center py-4">
                            {/* Badge with theme */}
                            <motion.div
                                animate={{ y: [0, -3, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                className={`relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-md border text-xs font-bold tracking-wider mb-6 w-fit shadow-xl group transition-all duration-300 ${
                                    isDarkMode 
                                        ? 'bg-white/10 border-white/20 text-white hover:bg-white/15' 
                                        : 'bg-black/5 border-gray-300/30 text-gray-800 hover:bg-black/10'
                                }`}
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                                </span>
                                <CheckCircle2 size={13} className={`relative ${isDarkMode ? 'text-cyan-300' : 'text-blue-600'}`} />
                                <span className="relative">Trusted by the DBU Community</span>
                                <Sparkles size={12} className={`relative ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                            </motion.div>

                            {/* Heading with theme */}
                            <motion.h1
                                variants={fadeUp}
                                className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-5 drop-shadow-2xl transition-colors duration-500 ${
                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}
                            >
                                Fast, Transparent
                                <br />
                                <span className="relative inline-block">
                                    <span className={`absolute inset-0 blur-2xl opacity-50 ${
                                        isDarkMode 
                                            ? 'bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400' 
                                            : 'bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500'
                                    }`} />
                                    <span className={`relative bg-gradient-to-r ${
                                        isDarkMode 
                                            ? 'from-blue-300 via-cyan-200 to-blue-400' 
                                            : 'from-blue-600 via-cyan-600 to-blue-600'
                                    } bg-clip-text text-transparent animate-[gradient-x_3s_ease_infinite] bg-[length:200%_auto]`}>
                                        Campus Maintenance
                                    </span>
                                </span>
                            </motion.h1>

                            {/* Subtitle with theme */}
                            <motion.p
                                variants={fadeUp}
                                className={`text-base md:text-lg leading-relaxed mb-8 max-w-xl transition-colors duration-500 ${
                                    isDarkMode ? 'text-white/70' : 'text-gray-600'
                                }`}
                            >
                                Report issues instantly, track progress in real time, and keep
                                university facilities running smoothly from one central place.
                            </motion.p>

                            {/* CTA Buttons with theme */}
                            <motion.div
                                variants={fadeUp}
                                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10"
                            >
                                <motion.button
                                    whileHover={{ y: -3, scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate('/login')}
                                    className={`relative w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r text-white font-bold text-sm shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group animate-[gradient-x_3s_ease_infinite] bg-[length:200%_auto] ${
                                        isDarkMode 
                                            ? 'from-blue-600 via-cyan-500 to-blue-600 shadow-blue-500/40' 
                                            : 'from-blue-500 via-cyan-400 to-blue-500 shadow-blue-400/30'
                                    }`}
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                    <Zap size="18" className="relative z-10" />
                                    <span className="relative z-10">Report Issue</span>
                                    <ArrowRight size="16" className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                                </motion.button>

                                <motion.button
                                    whileHover={{ y: -3, scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate('/login')}
                                    className={`w-full sm:w-auto px-8 py-3.5 rounded-xl backdrop-blur-lg border font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg group ${
                                        isDarkMode 
                                            ? 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-cyan-400/50' 
                                            : 'bg-black/5 border-gray-300/30 text-gray-800 hover:bg-black/10 hover:border-blue-400/50'
                                    }`}
                                >
                                    <Activity size="18" className={`${isDarkMode ? 'text-cyan-300' : 'text-blue-600'}`} />
                                    Track Request
                                </motion.button>
                            </motion.div>

                            {/* Stats with theme */}
                            <div className={`flex gap-8 md:gap-12 pt-6 border-t transition-colors duration-500 ${
                                isDarkMode ? 'border-white/10' : 'border-gray-200'
                            }`}>
                                {[
                                    { value: '2000+', label: 'Issues Resolved', icon: Award, color: isDarkMode ? 'from-blue-400 to-cyan-300' : 'from-blue-600 to-cyan-500' },
                                    { value: '500+', label: 'Active Users', icon: Users, color: isDarkMode ? 'from-cyan-400 to-blue-300' : 'from-cyan-600 to-blue-500' },
                                    { value: '24/7', label: 'Available', icon: Clock, color: isDarkMode ? 'from-indigo-400 to-purple-300' : 'from-indigo-600 to-purple-500' },
                                ].map((stat, i) => (
                                    <motion.div
                                        key={stat.label}
                                        custom={i}
                                        variants={statVariant}
                                        whileHover={{ scale: 1.08, y: -2 }}
                                        className="flex flex-col cursor-default group relative"
                                    >
                                        <stat.icon size="20" className={`text-transparent bg-gradient-to-r ${stat.color} bg-clip-text mb-1`} />
                                        <span className={`text-xl md:text-2xl font-extrabold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent leading-tight`}>
                                            {stat.value}
                                        </span>
                                        <span className={`text-[10px] md:text-xs mt-0.5 tracking-wide uppercase transition-colors duration-300 ${
                                            isDarkMode 
                                                ? 'text-white/50 group-hover:text-white/70' 
                                                : 'text-gray-500 group-hover:text-gray-700'
                                        }`}>
                                            {stat.label}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right Visual with theme */}
                        <motion.div
                            variants={fadeRight}
                            className="hidden lg:flex items-center justify-center"
                        >
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                className="relative w-full h-[480px] group"
                                style={{ perspective: '1000px' }}
                            >
                                {/* Outer glow ring with theme */}
                                <motion.div
                                    animate={{ 
                                        opacity: [0.3, 0.6, 0.3], 
                                        scale: [1, 1.03, 1],
                                    }}
                                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                                    className={`absolute -inset-4 rounded-3xl blur-2xl ${
                                        isDarkMode 
                                            ? 'bg-gradient-to-br from-blue-500/30 via-cyan-400/20 to-indigo-500/30' 
                                            : 'bg-gradient-to-br from-blue-400/25 via-cyan-400/15 to-indigo-400/25'
                                    }`}
                                />

                                {/* Main image container */}
                                <div className={`relative z-10 w-full h-full rounded-2xl overflow-hidden shadow-2xl border transition-all duration-500 ${
                                    isDarkMode 
                                        ? 'shadow-black/60 border-white/10 group-hover:border-cyan-400/40' 
                                        : 'shadow-gray-400/30 border-gray-200/50 group-hover:border-blue-400/40'
                                }`}>
                                    <img
                                        src={HeroImg}
                                        alt="Campus Maintenance"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    
                                    {/* Image overlay gradient */}
                                    <div className={`absolute inset-0 bg-gradient-to-t ${
                                        isDarkMode 
                                            ? 'from-black/60 via-black/20 to-transparent' 
                                            : 'from-gray-900/30 via-gray-900/10 to-transparent'
                                    }`} />
                                </div>

                                {/* Floating cards with theme */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                    whileHover={{ scale: 1.05 }}
                                    className={`absolute top-5 left-5 z-20 flex items-center gap-3 px-4 py-2.5 rounded-xl backdrop-blur-md border shadow-xl cursor-pointer transition-all duration-300 ${
                                        isDarkMode 
                                            ? 'bg-black/70 border-white/15' 
                                            : 'bg-white/80 border-gray-200/50 shadow-gray-300/30'
                                    }`}
                                >
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
                                    </span>
                                    <span className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>System Live</span>
                                    <div className={`w-px h-4 mx-1 ${isDarkMode ? 'bg-white/20' : 'bg-gray-300'}`} />
                                    <span className={`text-xs font-mono ${isDarkMode ? 'text-cyan-300' : 'text-blue-600'}`}>98.5%</span>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6, duration: 0.5 }}
                                    whileHover={{ scale: 1.05 }}
                                    className={`absolute bottom-5 right-5 z-20 px-5 py-3 rounded-xl backdrop-blur-md border shadow-xl cursor-pointer transition-all duration-300 ${
                                        isDarkMode 
                                            ? 'bg-black/70 border-white/15' 
                                            : 'bg-white/80 border-gray-200/50 shadow-gray-300/30'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <TrendingUp size="14" className="text-green-400" />
                                        <span className={`text-lg font-extrabold leading-tight ${isDarkMode ? 'text-cyan-300' : 'text-blue-600'}`}>12 Fixed</span>
                                    </div>
                                    <div className={`text-[10px] uppercase tracking-wide ${isDarkMode ? 'text-white/50' : 'text-gray-500'}`}>Today</div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8, duration: 0.5 }}
                                    whileHover={{ scale: 1.05 }}
                                    className={`absolute bottom-5 left-5 z-20 flex items-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur-md border shadow-xl cursor-pointer transition-all duration-300 ${
                                        isDarkMode 
                                            ? 'bg-black/70 border-white/15' 
                                            : 'bg-white/80 border-gray-200/50 shadow-gray-300/30'
                                    }`}
                                >
                                    <Activity size="14" className={isDarkMode ? 'text-cyan-300' : 'text-blue-600'} />
                                    <span className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>4 Active Reports</span>
                                    <div className={`w-px h-4 mx-1 ${isDarkMode ? 'bg-white/20' : 'bg-gray-300'}`} />
                                    <span className="text-yellow-400 text-xs">+2</span>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1.0, duration: 0.5 }}
                                    whileHover={{ scale: 1.05 }}
                                    className={`absolute top-5 right-5 z-20 flex items-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur-md border shadow-xl cursor-pointer transition-all duration-300 ${
                                        isDarkMode 
                                            ? 'bg-black/70 border-white/15' 
                                            : 'bg-white/80 border-gray-200/50 shadow-gray-300/30'
                                    }`}
                                >
                                    <Star size="14" className="text-yellow-400 fill-yellow-400" />
                                    <span className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>4.9</span>
                                    <span className={`text-xs ${isDarkMode ? 'text-white/50' : 'text-gray-500'}`}>(248 reviews)</span>
                                </motion.div>
                            </motion.div>
                        </motion.div>

                    </div>
                </div>

                {/* Scroll hint with theme */}
                <motion.div
                    animate={{ y: [0, 8, 0], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 cursor-pointer group"
                    onClick={() => scrollToSection('about-us')}
                >
                    <span className={`text-[10px] uppercase tracking-widest transition-colors duration-300 ${
                        isDarkMode 
                            ? 'text-white/40 group-hover:text-white/60' 
                            : 'text-gray-500 group-hover:text-gray-700'
                    }`}>Scroll to explore</span>
                    <div className={`relative w-6 h-10 rounded-full border flex items-start justify-center pt-2 transition-colors duration-300 ${
                        isDarkMode 
                            ? 'border-white/20 group-hover:border-cyan-400/50' 
                            : 'border-gray-400/30 group-hover:border-blue-400/50'
                    }`}>
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            className={`w-1 h-2 rounded-full bg-gradient-to-r ${
                                isDarkMode ? 'from-cyan-400 to-blue-400' : 'from-blue-500 to-cyan-500'
                            }`}
                        />
                    </div>
                    <ChevronDown size="16" className={`transition-colors duration-300 ${
                        isDarkMode 
                            ? 'text-white/30 group-hover:text-white/50' 
                            : 'text-gray-400 group-hover:text-gray-600'
                    }`} />
                </motion.div>
            </motion.section>

            {/* Other Sections */}
            <div className="transition-colors duration-500">
                <AboutUs />
                <Services />
                <Features />
                <Contacts />
            </div>

            {/* Add custom animations */}
            <style>{`
                @keyframes gradient-x {
                    0%, 100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }
                
                /* Smooth theme transition */
                * {
                    transition-property: background-color, border-color, color, fill, stroke;
                    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                    transition-duration: 300ms;
                }
                
                /* Optimize scrolling performance */
                html {
                    scroll-behavior: smooth;
                }
                
                /* Reduce motion for better performance */
                @media (prefers-reduced-motion: reduce) {
                    * {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                        scroll-behavior: auto !important;
                    }
                }
            `}</style>
        </PublicLayout>
    );
};

export default Home;