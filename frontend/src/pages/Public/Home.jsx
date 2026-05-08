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
                className="relative w-full min-h-[calc(100vh-65px)] flex items-center justify-center pt-20 pb-16 px-4 md:px-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={staggerContainer}
            >
                {/* Background decorative elements */}
                <div className="absolute inset-0 -z-10">
                    <div 
                        className="absolute inset-0 opacity-20 transition-opacity duration-300"
                        style={{
                            backgroundImage: `url(${HeroImg})`,
                            backgroundPosition: 'center right',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover'
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent dark:to-background/40" />
                    <div className="absolute top-10 left-8 w-40 h-40 rounded-full bg-primary/10 blur-3xl animate-pulse opacity-80" />
                    <div className="absolute bottom-10 right-8 w-56 h-56 rounded-full bg-secondary/10 blur-3xl animate-pulse opacity-70" />
                </div>

                <div className="relative z-10 w-full max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <motion.div variants={fadeUp} className="flex flex-col justify-center">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-bold tracking-wide mb-8 w-fit backdrop-blur-sm">
                                <CheckCircle2 size={16} className="text-primary/80" />
                                Trusted by the DBU Community
                            </div>

                            {/* Main Heading */}
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.02] mb-6 text-textPrimary">
                                Fast, Transparent
                                <br />
                                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">Campus Maintenance</span>
                            </h1>

                            {/* Subtitle */}
                            <p className="text-lg md:text-xl text-textSecondary leading-relaxed mb-10 max-w-2xl">
                                Report issues instantly, track progress in real time, and keep university facilities running smoothly from one central place.
                            </p>

                            {/* CTA Buttons */}
                            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <motion.button 
                                    whileHover={{ y: -2, scale: 1.01 }}
                                    onClick={() => navigate('/login')} 
                                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-base shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    Report Issue
                                    <ArrowRight size={20} />
                                </motion.button>
                                <motion.button 
                                    whileHover={{ y: -2, scale: 1.01 }}
                                    onClick={() => navigate('/login')} 
                                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-surface/60 backdrop-blur-sm border border-overlay/20 text-textPrimary font-bold text-base hover:bg-surface hover:border-primary/40 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                                >
                                    <Activity size={20} />
                                    Track Request
                                </motion.button>
                            </motion.div>

                            {/* Stats */}
                            <div className="flex gap-8 mt-12 pt-8 border-t border-overlay/10">
                                <div>
                                    <div className="text-2xl font-bold text-primary mb-1">2000+</div>
                                    <div className="text-sm text-textSecondary">Issues Resolved</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-primary mb-1">500+</div>
                                    <div className="text-sm text-textSecondary">Active Users</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-primary mb-1">24/7</div>
                                    <div className="text-sm text-textSecondary">Available</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Visual */}
                        <motion.div variants={fadeUp} whileHover={{ scale: 1.02 }} className="hidden lg:flex items-center justify-center">
                            <div className="relative w-full aspect-square">
                                {/* Gradient blob background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent rounded-3xl blur-3xl" />
                                
                                {/* Hero Image */}
                                <img 
                                    src={HeroImg} 
                                    alt="Campus Maintenance" 
                                    className="relative z-10 w-full h-full object-cover rounded-3xl shadow-2xl"
                                />
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
