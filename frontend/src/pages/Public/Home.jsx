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
    Users
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
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [hoveredCard, setHoveredCard] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    useEffect(() => {
        const sectionId = routeToSection[location.pathname] || 'home';
        const timer = window.setTimeout(() => {
            scrollToSection(sectionId, 'smooth');
        }, 50);
        return () => window.clearTimeout(timer);
    }, [location.pathname]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <PublicLayout>
            {/* Custom cursor effect */}
            <motion.div
                className="fixed w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 mix-blend-screen pointer-events-none z-50 hidden lg:block"
                animate={{
                    x: mousePosition.x - 16,
                    y: mousePosition.y - 16,
                    scale: hoveredCard !== null ? 1.5 : 1,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
                style={{ opacity: 0.3 }}
            />

            {/* HERO SECTION */}
            <motion.section
                id="home"
                className="relative w-full min-h-screen flex items-center justify-center px-4 md:px-8 py-12 md:py-16 overflow-hidden"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={staggerContainer}
                style={{ opacity }}
            >
                {/* Enhanced Dark overlay with gradient */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90" />
                
                {/* Animated gradient orbs */}
                <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                    {/* Primary orb - top left */}
                    <motion.div
                        animate={{ 
                            scale: [1, 1.3, 1], 
                            opacity: [0.3, 0.6, 0.3],
                            x: [0, 50, 0],
                            y: [0, 30, 0]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-600/30 blur-3xl"
                    />
                    
                    {/* Secondary orb - bottom right */}
                    <motion.div
                        animate={{ 
                            scale: [1, 1.4, 1], 
                            opacity: [0.2, 0.5, 0.2],
                            x: [0, -40, 0],
                            y: [0, -40, 0]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                        className="absolute -bottom-40 -right-40 w-[30rem] h-[30rem] rounded-full bg-cyan-500/20 blur-3xl"
                    />
                    
                    {/* Tertiary orb - center */}
                    <motion.div
                        animate={{ 
                            scale: [1, 1.2, 1], 
                            opacity: [0.15, 0.4, 0.15],
                            rotate: [0, 180, 360]
                        }}
                        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/25 blur-3xl"
                    />
                    
                    {/* Additional accent orbs */}
                    <motion.div
                        animate={{ y: [-20, 20, -20], opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
                        className="absolute top-20 right-20 w-60 h-60 rounded-full bg-purple-500/20 blur-3xl"
                    />
                    
                    <motion.div
                        animate={{ y: [20, -20, 20], opacity: [0.15, 0.4, 0.15] }}
                        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
                        className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-pink-500/15 blur-3xl"
                    />
                </div>

                {/* Floating particles with enhanced animation */}
                <div className="absolute inset-0 -z-10 pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                y: [0, -100, 0],
                                x: [0, (i % 2 === 0 ? 50 : -50), 0],
                                opacity: [0, 0.8, 0],
                                scale: [0.5, 1.5, 0.5],
                            }}
                            transition={{
                                duration: 6 + (i % 5),
                                repeat: Infinity,
                                delay: i * 0.5,
                                ease: 'easeInOut',
                            }}
                            className="absolute w-1.5 h-1.5 rounded-full"
                            style={{
                                background: `radial-gradient(circle, ${i % 2 === 0 ? '#3b82f6' : '#06b6d4'}, transparent)`,
                                left: `${5 + (i * 4.5)}%`,
                                bottom: `${10 + (i % 8) * 12}%`,
                            }}
                        />
                    ))}
                </div>

                {/* Rotating ring effect */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full border border-blue-500/10 -z-10 pointer-events-none"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                    className="absolute bottom-1/4 left-1/4 w-[30rem] h-[30rem] rounded-full border border-cyan-500/10 -z-10 pointer-events-none"
                />

                {/* Scan line effect */}
                <motion.div
                    animate={{ y: ['-100%', '100vh'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear', delay: 2 }}
                    className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent -z-10 pointer-events-none"
                />

                {/* Enhanced grid overlay */}
                <div
                    className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)
                        `,
                        backgroundSize: '60px 60px',
                        maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 85%)',
                        WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 85%)',
                    }}
                />

                {/* Main content */}
                <div className="relative z-10 w-full max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

                        {/* Left Content */}
                        <motion.div variants={fadeLeft} className="flex flex-col justify-center py-4">
                            {/* Enhanced Badge with glow */}
                            <motion.div
                                animate={{ y: [0, -4, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-wider mb-6 w-fit shadow-xl group hover:bg-white/15 transition-all duration-300"
                            >
                                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-400/20 blur-md group-hover:blur-xl transition-all duration-300" />
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                                </span>
                                <CheckCircle2 size={13} className="text-cyan-300 relative" />
                                <span className="relative">Trusted by the DBU Community</span>
                                <Sparkles size={12} className="text-yellow-400 relative animate-pulse" />
                            </motion.div>

                            {/* Enhanced Heading with gradient animation */}
                            <motion.h1
                                variants={fadeUp}
                                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-5 text-white drop-shadow-2xl"
                            >
                                Fast, Transparent
                                <br />
                                <span className="relative inline-block">
                                    <span className="absolute inset-0 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 blur-2xl opacity-50" />
                                    <span className="relative bg-gradient-to-r from-blue-300 via-cyan-200 to-blue-400 bg-clip-text text-transparent animate-[gradient-x_3s_ease_infinite] bg-[length:200%_auto]">
                                        Campus Maintenance
                                    </span>
                                </span>
                            </motion.h1>

                            {/* Enhanced Subtitle */}
                            <motion.p
                                variants={fadeUp}
                                className="text-base md:text-lg text-white/70 leading-relaxed mb-8 max-w-xl backdrop-blur-sm"
                            >
                                Report issues instantly, track progress in real time, and keep
                                university facilities running smoothly from one central place.
                            </motion.p>

                            {/* Enhanced CTA Buttons */}
                            <motion.div
                                variants={fadeUp}
                                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10"
                            >
                                <motion.button
                                    whileHover={{ y: -4, scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    onHoverStart={() => setHoveredCard('report')}
                                    onHoverEnd={() => setHoveredCard(null)}
                                    onClick={() => navigate('/login')}
                                    className="relative w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-[length:200%_auto] text-white font-bold text-sm shadow-2xl shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group animate-[gradient-x_3s_ease_infinite]"
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                    <Zap size="18" className="relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                                    <span className="relative z-10">Report Issue</span>
                                    <ArrowRight size="16" className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                                </motion.button>

                                <motion.button
                                    whileHover={{ y: -4, scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    onHoverStart={() => setHoveredCard('track')}
                                    onHoverEnd={() => setHoveredCard(null)}
                                    onClick={() => navigate('/login')}
                                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white font-bold text-sm hover:bg-white/20 hover:border-cyan-400/50 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg group"
                                >
                                    <Activity size="18" className="text-cyan-300 group-hover:rotate-12 transition-transform duration-300" />
                                    Track Request
                                </motion.button>
                            </motion.div>

                            {/* Enhanced Stats with 3D effect */}
                            <div className="flex gap-8 md:gap-12 pt-6 border-t border-white/10">
                                {[
                                    { value: '2000+', label: 'Issues Resolved', icon: Award, color: 'from-blue-400 to-cyan-300' },
                                    { value: '500+', label: 'Active Users', icon: Users, color: 'from-cyan-400 to-blue-300' },
                                    { value: '24/7', label: 'Available', icon: Clock, color: 'from-indigo-400 to-purple-300' },
                                ].map((stat, i) => (
                                    <motion.div
                                        key={stat.label}
                                        custom={i}
                                        variants={statVariant}
                                        whileHover={{ scale: 1.1, y: -4 }}
                                        className="flex flex-col cursor-default group relative"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <stat.icon size="20" className={`text-transparent bg-gradient-to-r ${stat.color} bg-clip-text mb-1 opacity-70 group-hover:opacity-100 transition-opacity duration-300`} />
                                        <span className={`text-xl md:text-2xl font-extrabold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent leading-tight`}>
                                            {stat.value}
                                        </span>
                                        <span className="text-[10px] md:text-xs text-white/50 mt-0.5 tracking-wide uppercase group-hover:text-white/70 transition-colors duration-300">
                                            {stat.label}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right Visual with enhanced 3D effect */}
                        <motion.div
                            variants={fadeRight}
                            className="hidden lg:flex items-center justify-center"
                        >
                            <motion.div
                                whileHover={{ scale: 1.02, rotateY: 5, rotateX: -3 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                className="relative w-full h-[480px] group"
                                style={{ perspective: '1200px' }}
                                onHoverStart={() => setHoveredCard('image')}
                                onHoverEnd={() => setHoveredCard(null)}
                            >
                                {/* Outer glow ring with animation */}
                                <motion.div
                                    animate={{ 
                                        opacity: [0.3, 0.8, 0.3], 
                                        scale: [1, 1.05, 1],
                                        rotate: [0, 360]
                                    }}
                                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                                    className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-500/30 via-cyan-400/20 to-indigo-500/30 blur-2xl"
                                />
                                
                                {/* Rotating border ring */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                                    className="absolute -inset-3 rounded-3xl border-2 border-dashed border-blue-500/30"
                                />

                                {/* Main image container */}
                                <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden shadow-2xl shadow-black/60 border border-white/10 group-hover:border-cyan-400/40 transition-all duration-500">
                                    <img
                                        src={HeroImg}
                                        alt="Campus Maintenance"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    
                                    {/* Image overlay gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                </div>

                                {/* Top-left floating card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: [0, -8, 0] }}
                                    transition={{ delay: 0.8, duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                    whileHover={{ scale: 1.05 }}
                                    className="absolute top-5 left-5 z-20 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 shadow-xl cursor-pointer group/card"
                                >
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
                                    </span>
                                    <span className="text-white text-xs font-semibold">System Live</span>
                                    <div className="w-px h-4 bg-white/20 mx-1" />
                                    <span className="text-cyan-300 text-xs font-mono">98.5%</span>
                                </motion.div>

                                {/* Bottom-right floating stat card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: [0, -6, 0] }}
                                    transition={{ delay: 1.2, duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                                    whileHover={{ scale: 1.05 }}
                                    className="absolute bottom-5 right-5 z-20 px-5 py-3 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 shadow-xl cursor-pointer group/card"
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <TrendingUp size="14" className="text-green-400" />
                                        <span className="text-cyan-300 text-lg font-extrabold leading-tight">12 Fixed</span>
                                    </div>
                                    <div className="text-white/50 text-[10px] uppercase tracking-wide">Today</div>
                                </motion.div>

                                {/* Bottom-left floating card */}
                                <motion.div
                                    initial={{ opacity: 0, x: -15 }}
                                    animate={{ opacity: 1, x: [0, 6, 0] }}
                                    transition={{ delay: 1.6, duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                                    whileHover={{ scale: 1.05 }}
                                    className="absolute bottom-5 left-5 z-20 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 shadow-xl cursor-pointer group/card"
                                >
                                    <Activity size="14" className="text-cyan-300" />
                                    <span className="text-white text-xs font-semibold">4 Active Reports</span>
                                    <div className="w-px h-4 bg-white/20 mx-1" />
                                    <span className="text-yellow-400 text-xs">+2</span>
                                </motion.div>

                                {/* Top-right rating card */}
                                <motion.div
                                    initial={{ opacity: 0, x: 15 }}
                                    animate={{ opacity: 1, x: [0, -6, 0] }}
                                    transition={{ delay: 2, duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                                    whileHover={{ scale: 1.05 }}
                                    className="absolute top-5 right-5 z-20 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 shadow-xl cursor-pointer group/card"
                                >
                                    <Star size="14" className="text-yellow-400 fill-yellow-400" />
                                    <span className="text-white text-xs font-semibold">4.9</span>
                                    <span className="text-white/50 text-xs">(248 reviews)</span>
                                </motion.div>
                            </motion.div>
                        </motion.div>

                    </div>
                </div>

                {/* Enhanced Scroll hint */}
                <motion.div
                    animate={{ y: [0, 10, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 cursor-pointer group"
                    onClick={() => scrollToSection('about-us')}
                >
                    <span className="text-white/40 text-[10px] uppercase tracking-widest group-hover:text-white/60 transition-colors duration-300">Scroll to explore</span>
                    <div className="relative w-6 h-10 rounded-full border border-white/20 flex items-start justify-center pt-2 group-hover:border-cyan-400/50 transition-colors duration-300">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-1 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400"
                        />
                        <div className="absolute inset-0 rounded-full bg-cyan-400/10 blur-lg group-hover:bg-cyan-400/20 transition-all duration-300" />
                    </div>
                    <ChevronDown size="16" className="text-white/30 group-hover:text-white/50 transition-colors duration-300" />
                </motion.div>
            </motion.section>

            {/* Other Sections */}
            <AboutUs />
            <Services />
            <Features />
            <Contacts />

            {/* Add custom Tailwind animations */}
            <style>{`
                @keyframes gradient-x {
                    0%, 100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }
            `}</style>
        </PublicLayout>
    );
};

export default Home;