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
            <section id="home" className="relative mt-[65px] min-h-[calc(100vh-65px)] flex items-center py-12 px-6 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-25"
                    style={{
                        backgroundImage: `url(${HeroImg})`,
                        backgroundPosition: 'center right',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover'
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-100/95 via-slate-100/80 to-slate-100/35 dark:from-slate-950/95 dark:via-slate-950/75 dark:to-slate-950/30" />

                <div className="relative z-10 w-full max-w-7xl mx-auto">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-bold tracking-wide mb-6">
                            <CheckCircle2 size={14} className="text-blue-600 dark:text-blue-400" />
                            Trusted by DBU Students & Staff
                        </div>

                        <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-5 text-gray-900 dark:text-gray-50">
                            Fast, Transparent
                            <br />
                            <span className="text-blue-600 dark:text-blue-500">Campus Maintenance</span>
                        </h1>

                        <p className="text-base md:text-lg text-gray-600 dark:text-slate-300 leading-relaxed mb-8 max-w-xl">
                            Report issues instantly, track progress in real time, and keep university facilities running smoothly from one central place.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <button onClick={() => navigate('/login')} className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-600 text-white font-bold text-base hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
                                Report Issue
                                <ArrowRight size={20} />
                            </button>
                            <button onClick={() => navigate('/login')} className="w-full sm:w-auto px-8 py-3 rounded-xl bg-slate-100/90 dark:bg-slate-800 border border-slate-300/70 dark:border-slate-700 text-gray-700 dark:text-gray-200 font-bold text-base hover:border-blue-600 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-500 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm">
                                <Activity size={20} className="text-gray-400" />
                                Track Request
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <AboutUs />
            <Services />
            <Features />
            <Contacts />
        </PublicLayout>
    );
};

export default Home;
