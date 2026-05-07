import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Activity,
    AlertCircle,
    ArrowRight,
    BarChart3,
    BellRing,
    Building2,
    CheckCircle2,
    Mail,
    MapPin,
    Phone,
    ShieldCheck,
    Smartphone
} from 'lucide-react';

import PublicLayout from '../../components/public/PublicLayout';
import HeroImg from '../../assets/images/maint_hero.png';
import FeatureImg from '../../assets/images/tech_pc.png';
import FireEmergencyImg from '../../assets/images/fire_emergency.png';
import LockDetailImg from '../../assets/images/lock_detail.png';
import SafetyKitImg from '../../assets/images/safety_kit.png';

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

const services = [
    { img: FireEmergencyImg, title: 'Submit Requests', desc: 'Easily submit maintenance requests from any device.' },
    { img: LockDetailImg, title: 'Monitor Progress', desc: 'Track your request status in real-time.' },
    { img: HeroImg, title: 'Request Repairs', desc: 'Log different types of facility and equipment repairs.' },
    { img: SafetyKitImg, title: 'Assign & Resolve', desc: 'Administrators easily assign tasks to technicians.' },
    { img: FeatureImg, title: 'Generate Reports', desc: 'Comprehensive data reports for administrative oversight.' }
];

const features = [
    { icon: Smartphone, title: 'Report instantly', desc: 'Log a ticket in seconds without paperwork.' },
    { icon: Activity, title: 'Real-time tracking', desc: 'Know exactly when your issue will be fixed.' },
    { icon: ShieldCheck, title: 'Admin efficiency', desc: 'Central dashboard to dispatch personnel.' },
    { icon: AlertCircle, title: 'Priority handling', desc: 'Critical emergencies get immediate attention.' },
    { icon: BellRing, title: 'Live Notifications', desc: 'Get alerted when your ticket status changes.' },
    { icon: BarChart3, title: 'Data insights', desc: 'Analyze trends to prevent future breakdowns.' }
];

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
};

const scrollToSection = (sectionId, behavior = 'smooth') => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = Math.max(elementPosition - NAVBAR_OFFSET, 0);

    window.scrollTo({
        top: offsetPosition,
        behavior
    });
};

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const sectionId = routeToSection[location.pathname] || 'home';
        const timer = window.setTimeout(() => {
            scrollToSection(sectionId, 'smooth');
        }, 80);

        return () => window.clearTimeout(timer);
    }, [location.pathname]);

    return (
        <PublicLayout>
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');`}
            </style>

            <section id="home" className="relative mt-[65px] min-h-[calc(100vh-65px)] flex items-center py-10 px-6 overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url(${HeroImg})`,
                        backgroundPosition: 'center right',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '100% auto',
                        imageRendering: 'auto'
                    }}
                ></div>
                <div className="absolute inset-0 bg-slate-100/10 dark:bg-slate-950/14"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-100/88 via-slate-100/24 to-transparent dark:from-slate-950/82 dark:via-slate-950/22 dark:to-transparent"></div>
                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-slate-100/50 to-transparent dark:from-slate-900/60"></div>

                <div className="w-full max-w-[1400px] mx-auto relative z-10 xl:px-8">
                    <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-xl pl-4 lg:pl-16">
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-bold tracking-wide mb-6">
                            <CheckCircle2 size={14} className="text-blue-600 dark:text-blue-400" />
                            Trusted by DBU Students & Staff
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] mb-5 text-gray-900 dark:text-gray-50" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            Fast, Transparent <br />
                            <span className="text-blue-600 dark:text-blue-500">Maintenance</span>
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="text-base md:text-lg text-gray-600 dark:text-slate-400 leading-relaxed mb-6">
                            Report issues instantly. Track progress in real-time. Keep the university infrastructure running flawlessly.
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-3">
                            <button onClick={() => navigate('/login')} className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-600 text-white font-bold text-base hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md group">
                                Report Issue
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button onClick={() => navigate('/login')} className="w-full sm:w-auto px-8 py-3 rounded-xl bg-slate-100/90 dark:bg-slate-800 border border-slate-300/70 dark:border-slate-700 text-gray-700 dark:text-gray-200 font-bold text-base hover:border-blue-600 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-500 transition-all duration-300 flex items-center justify-center gap-2 group shadow-sm">
                                <Activity size={20} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                                Track Request
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <section id="about-us" className="py-8 px-6 bg-slate-200/45 dark:bg-slate-900/35 border-y border-slate-300/60 dark:border-slate-800 relative overflow-hidden backdrop-blur-sm">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 mb-3 shadow-sm"
                        >
                            <Building2 size={24} className="text-blue-600 dark:text-blue-500" />
                        </motion.div>
                        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-gray-50" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            About Us
                        </h2>
                    </div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                        variants={{
                            hidden: {},
                            visible: { transition: { staggerChildren: 0.2 } }
                        }}
                        className="bg-slate-100/90 dark:bg-slate-900/80 p-8 md:p-12 rounded-2xl shadow-md border border-slate-300/70 dark:border-slate-700 text-center relative overflow-hidden backdrop-blur-sm"
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-blue-600 dark:bg-blue-500 rounded-b-full"></div>

                        <motion.p
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } } }}
                            className="text-base md:text-lg text-gray-700 dark:text-gray-200 leading-loose font-light tracking-wide mb-6"
                            style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                            Campus Maintenance System is built to eliminate delays, miscommunication, and untracked maintenance requests across campus.
                        </motion.p>

                        <motion.p
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } } }}
                            className="text-sm md:text-base text-gray-500 dark:text-slate-400 leading-relaxed font-light"
                            style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                            It provides a centralized platform where students and staff can report issues instantly, while administrators manage, prioritize, and resolve them efficiently. By combining real-time tracking with transparent workflows, the system ensures that every request is visible, accountable, and handled on time.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            <section id="services" className="py-12 px-6 bg-transparent relative">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-gray-50">Services</h2>
                        <p className="text-gray-600 dark:text-slate-400 text-base max-w-2xl mx-auto">Everything you need to manage and resolve campus issues efficiently.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="rounded-2xl bg-slate-100/92 dark:bg-slate-900/82 backdrop-blur-sm border border-slate-300/70 dark:border-slate-700 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group"
                            >
                                <div className="h-56 w-full bg-slate-200/70 dark:bg-slate-950 relative overflow-hidden">
                                    <img src={service.img} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 z-10" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col justify-center">
                                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-50 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">{service.title}</h3>
                                    <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed">{service.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="features" className="py-12 px-6 bg-slate-200/45 dark:bg-slate-900/35 border-y border-slate-300/60 dark:border-slate-800 relative backdrop-blur-sm">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-gray-50">Features</h2>
                        <p className="text-gray-600 dark:text-slate-400 text-base max-w-2xl mx-auto">Designed for speed, transparency, and accountability.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
                                whileHover={{ y: -4 }}
                                className="p-8 rounded-2xl bg-slate-100/90 dark:bg-slate-900/82 backdrop-blur-sm border border-slate-300/70 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-blue-600/30 transition-all duration-300 group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 duration-500"></div>

                                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-5 shadow-sm border border-slate-200 dark:border-slate-700 relative z-10 group-hover:scale-105 transition-transform">
                                    <feature.icon size={24} className="text-blue-600 dark:text-blue-500" />
                                </div>
                                <h4 className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-2 relative z-10 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{feature.title}</h4>
                                <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed relative z-10">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="contacts" className="py-12 px-6 relative bg-transparent">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-gray-50">Contacts</h2>
                        <p className="text-gray-600 dark:text-slate-400 text-base max-w-2xl mx-auto">Get in touch with the Debre Berhan University maintenance office.</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-slate-300/70 dark:border-slate-700 shadow-md">
                            <iframe
                                title="DBU Location"
                                src="https://maps.google.com/maps?q=Debre%20Berhan%20University&t=&z=16&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>

                        <div className="flex flex-col justify-center h-full space-y-8 p-8 lg:p-12 bg-slate-100/92 dark:bg-slate-900/82 backdrop-blur-sm rounded-2xl border border-slate-300/70 dark:border-slate-700 shadow-md">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
                                    <MapPin size={24} className="text-blue-600 dark:text-blue-500" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-2">Location</h4>
                                    <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                                        Debre Berhan University Main Campus<br />
                                        Maintenance Office, Building 4<br />
                                        Debre Berhan, Ethiopia
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
                                    <Phone size={24} className="text-blue-600 dark:text-blue-500" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-2">Phone</h4>
                                    <p className="text-gray-600 dark:text-slate-400">
                                        +251 11 681 5440<br />
                                        +251 91 123 4567 (Emergency)
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
                                    <Mail size={24} className="text-blue-600 dark:text-blue-500" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-2">Email</h4>
                                    <p className="text-gray-600 dark:text-slate-400">
                                        maintenance@dbu.edu.et<br />
                                        support@dbu.edu.et
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
};

export default Home;
