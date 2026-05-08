import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Activity,
    ArrowRight,
    CheckCircle2,
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
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
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
                className="relative w-full min-h-screen flex items-center justify-center px-4 md:px-6 py-12 md:py-16 spiral-dot-pattern"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={staggerContainer}
            >
                {/* Overlay Gradient */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/80 to-transparent" />
                
                {/* Decorative Blobs */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-10 left-8 w-40 h-40 rounded-full bg-primary/10 blur-3xl animate-pulse opacity-80" />
                    <div className="absolute bottom-10 right-8 w-56 h-56 rounded-full bg-secondary/10 blur-3xl animate-pulse opacity-70" />
                </div>

                <div className="relative z-10 w-full max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        {/* Left Content */}
                        <motion.div variants={fadeUp} className="flex flex-col justify-center py-4 text-white">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 border border-white/30 text-white text-xs font-bold tracking-wide mb-3 w-fit backdrop-blur-sm">
                                <CheckCircle2 size={13} className="text-white/80" />
                                Trusted by the DBU Community
                            </div>

                            {/* Main Heading */}
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] mb-3 text-white">
                                Fast, Transparent
                                <br />
                                <span className="bg-gradient-to-r from-blue-300 via-cyan-200 to-blue-300 bg-clip-text text-transparent">Campus Maintenance</span>
                            </h1>

                            {/* Subtitle */}
                            <p className="text-xs sm:text-sm md:text-base text-white/90 leading-relaxed mb-4 max-w-xl">
                                Report issues instantly, track progress in real time, and keep university facilities running smoothly from one central place.
                            </p>

                            {/* CTA Buttons */}
                            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                <motion.button 
                                    whileHover={{ y: -2, scale: 1.01 }}
                                    onClick={() => navigate('/login')} 
                                    className="w-full sm:w-auto px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    Report Issue
                                    <ArrowRight size={16} />
                                </motion.button>
                                <motion.button 
                                    whileHover={{ y: -2, scale: 1.01 }}
                                    onClick={() => navigate('/login')} 
                                    className="w-full sm:w-auto px-5 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-xs sm:text-sm hover:bg-white/20 hover:border-white/40 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                                >
                                    <Activity size={16} />
                                    Track Request
                                </motion.button>
                            </motion.div>

                            {/* Stats */}
                            <div className="flex gap-4 md:gap-6 mt-4 md:mt-6 pt-3 md:pt-4 border-t border-white/10">
                                <div>
                                    <div className="text-base md:text-xl font-bold text-cyan-300 mb-0.5">2000+</div>
                                    <div className="text-xs text-white/80">Issues Resolved</div>
                                </div>
                                <div>
                                    <div className="text-base md:text-xl font-bold text-cyan-300 mb-0.5">500+</div>
                                    <div className="text-xs text-white/80">Active Users</div>
                                </div>
                                <div>
                                    <div className="text-base md:text-xl font-bold text-cyan-300 mb-0.5">24/7</div>
                                    <div className="text-xs text-white/80">Available</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Visual - Hero Image */}
                        <motion.div variants={fadeUp} className="hidden lg:flex items-center justify-center">
                            <div className="relative w-full h-96">
                                <img 
                                    src={HeroImg} 
                                    alt="Campus Maintenance" 
                                    className="w-full h-full object-cover rounded-2xl shadow-2xl"
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent rounded-2xl blur-xl opacity-60" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Other Sections */}
            <AboutUs />
            <Services />
            <Features />
            <Contacts />
        </PublicLayout>
    );
};

export default Home;
