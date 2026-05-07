import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
            <section id="home" className="relative w-full min-h-[calc(100vh-65px)] flex items-center justify-center pt-20 pb-16 px-4 md:px-6">
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
                </div>

                <div className="relative z-10 w-full max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="flex flex-col justify-center">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold tracking-wide mb-8 w-fit backdrop-blur-sm">
                                <CheckCircle2 size={14} className="text-primary/80" />
                                Trusted by DBU Community
                            </div>

                            {/* Main Heading */}
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-textPrimary">
                                Fast, Transparent
                                <br />
                                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">Campus Maintenance</span>
                            </h1>

                            {/* Subtitle */}
                            <p className="text-base md:text-lg text-textSecondary leading-relaxed mb-10 max-w-xl">
                                Report issues instantly, track progress in real time, and keep university facilities running smoothly from one central place.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <button 
                                    onClick={() => navigate('/login')} 
                                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-base shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    Report Issue
                                    <ArrowRight size={20} />
                                </button>
                                <button 
                                    onClick={() => navigate('/login')} 
                                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-surface/60 backdrop-blur-sm border border-overlay/20 text-textPrimary font-bold text-base hover:bg-surface hover:border-primary/40 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                                >
                                    <Activity size={20} />
                                    Track Request
                                </button>
                            </div>

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
                        </div>

                        {/* Right Visual */}
                        <div className="hidden lg:flex items-center justify-center">
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
                        </div>
                    </div>
                </div>
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
