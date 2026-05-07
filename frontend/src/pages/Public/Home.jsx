import React, { useEffect } from 'react';
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

            <section id="about-us" className="py-16 px-6 bg-slate-200/45 dark:bg-slate-900/35 border-y border-slate-300/60 dark:border-slate-800">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 mb-3 shadow-sm">
                            <Building2 size={24} className="text-blue-600 dark:text-blue-500" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-gray-50">
                            About Us
                        </h2>
                    </div>

                    <div className="bg-slate-100/90 dark:bg-slate-900/80 p-8 md:p-12 rounded-2xl shadow-md border border-slate-300/70 dark:border-slate-700 text-center backdrop-blur-sm">
                        <p className="text-base md:text-lg text-gray-700 dark:text-gray-200 leading-loose mb-6">
                            Campus Maintenance System is built to eliminate delays, miscommunication, and untracked maintenance requests across campus.
                        </p>
                        <p className="text-sm md:text-base text-gray-500 dark:text-slate-400 leading-relaxed">
                            It provides a centralized platform where students and staff can report issues instantly, while administrators manage, prioritize, and resolve them efficiently. Every request stays visible, accountable, and easier to complete on time.
                        </p>
                    </div>
                </div>
            </section>

            <section id="services" className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-gray-50">Services</h2>
                        <p className="text-gray-600 dark:text-slate-400 text-base max-w-2xl mx-auto">Everything needed to manage and resolve campus issues efficiently.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service) => (
                            <div key={service.title} className="rounded-2xl bg-slate-100/92 dark:bg-slate-900/82 backdrop-blur-sm border border-slate-300/70 dark:border-slate-700 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
                                <div className="h-56 w-full bg-slate-200/70 dark:bg-slate-950 overflow-hidden">
                                    <img src={service.img} alt={service.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-6 flex-1">
                                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-50">{service.title}</h3>
                                    <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed">{service.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="features" className="py-16 px-6 bg-slate-200/45 dark:bg-slate-900/35 border-y border-slate-300/60 dark:border-slate-800">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-gray-50">Features</h2>
                        <p className="text-gray-600 dark:text-slate-400 text-base max-w-2xl mx-auto">Designed for speed, transparency, and accountability.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature) => (
                            <div key={feature.title} className="p-8 rounded-2xl bg-slate-100/90 dark:bg-slate-900/82 backdrop-blur-sm border border-slate-300/70 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-5 shadow-sm border border-slate-200 dark:border-slate-700">
                                    <feature.icon size={24} className="text-blue-600 dark:text-blue-500" />
                                </div>
                                <h4 className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-2">{feature.title}</h4>
                                <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="contacts" className="py-16 px-6">
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
