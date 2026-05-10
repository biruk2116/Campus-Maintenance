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
className="
relative
w-full
h-screen
pt-20
flex
items-center
justify-center
overflow-hidden
"
    style={{
        backgroundImage: `url(${HeroImg})`,
        backgroundSize: "110% auto",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
    }}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.1 }}
    variants={staggerContainer}
>

    {/* Dark Overlay */}
    <div className="absolute inset-0 bg-black/60"></div>

    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-black/30 to-cyan-800/30"></div>

    {/* Animated Blur Circles */}
    <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>

    <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>

    {/* Content */}
    <div className="relative z-10 text-center px-6 max-w-4xl">

        <motion.h1
            className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            Smart Campus <br />
            <span className="text-cyan-400">
                Maintenance System
            </span>
        </motion.h1>

        <motion.p
            className="text-gray-200 text-lg md:text-xl mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
        >
            Report maintenance issues instantly, track technician progress,
            and improve campus infrastructure efficiently.
        </motion.p>

        {/* Buttons */}
        <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
        >

            <button className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition duration-300">
                Get Started
            </button>

            <button className="px-8 py-4 border border-white/30 backdrop-blur-md bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition duration-300">
                Learn More
            </button>

        </motion.div>

    </div>

                {/* ── Dark overlay ── */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600/10 via-blue-500/5 to-cyan-400/10 dark:from-slate-900 dark:via-black/85 dark:to-slate-800" />

                {/* ── Animated mesh blobs ── */}
                <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                    {/* Top-left large blob */}
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
                        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-blue-600/20 dark:bg-blue-500/30 blur-3xl"
                    />
                    {/* Bottom-right blob */}
                    <motion.div
                        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                        className="absolute -bottom-20 -right-10 w-[28rem] h-[28rem] rounded-full bg-cyan-500/15 dark:bg-cyan-400/25 blur-3xl"
                    />
                    {/* Center accent blob */}
                    <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.35, 0.15] }}
                        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-500/20 dark:bg-indigo-400/30 blur-3xl"
                    />
                    {/* Top-right small accent */}
                    <motion.div
                        animate={{ y: [-10, 10, -10], opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
                        className="absolute top-10 right-1/4 w-40 h-40 rounded-full bg-sky-400/15 dark:bg-sky-300/25 blur-2xl"
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
                            className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400/60 dark:bg-cyan-300/80"
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
                    className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 dark:via-cyan-300/60 to-transparent -z-10 pointer-events-none"
                />

                {/* ── Grid overlay ── */}
                <div
                    className="absolute inset-0 -z-10 opacity-[0.08] dark:opacity-[0.04] pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(59,130,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,1) 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 80%)',
                        WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 80%)',
                    }}
                />

                ── Main content grid ──
                <div className="relative z-10 w-full max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

                       
                        <motion.div variants={fadeLeft} className="flex flex-col justify-center py-4 text-white">

                         
                            <motion.div >
                                
            
                               
                            </motion.div>

                            
                            <motion.div
                                variants={fadeUp}
                                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8"
                            >
                                
                            </motion.div>

                            {/* Stats */}
                            <div className="flex gap-6 md:gap-8 pt-4 border-t border-white/20">
                                {[
                                ].map((stat, i) => (
                                    <motion.div
                                        key={stat.label}
                                        custom={i}
                                        variants={statVariant}
                                        whileHover={{ scale: 1.08, y: -2 }}
                                        className="flex flex-col cursor-default"
                                    >
                                        <span className="text-lg md:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-blue-200 leading-tight drop-shadow-lg">
                                            {stat.value}
                                        </span>
                                        <span className="text-[10px] md:text-xs text-gray-200 mt-0.5 tracking-wide uppercase drop-shadow-md">
                                            {stat.label}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                    </div>
                </div>

                {/* ── Scroll hint ── */}
               
            </motion.section>

            {/* Other Sections */}
            <AboutUs />
            <Services />
            <Features />
            <Contacts />
        </PublicLayout>
    );
};

export default Home