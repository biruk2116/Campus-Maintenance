import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Activity,
    ArrowRight,
    ChevronRight,
    Globe,
    Mail,
    MapPin,
    Phone,
    Shield,
    Wrench,
    Zap
} from 'lucide-react';




import dbuLogo from '../../assets/images/dbu-logo.png';
import Navbar from '../../components/Navbar';

const revealUp = {
    hidden: { opacity: 0, y: 28 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1]
        }
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.05
        }
    }
};

const viewportOnce = { once: true, margin: '-80px' };
const NAVBAR_OFFSET = 96;

const sectionLinks = [
    { label: 'Home', anchor: '#home' },
    { label: 'About', anchor: '#about' },
    { label: 'Features', anchor: '#features' },
    { label: 'Services', anchor: '#services' },
    { label: 'Contact', anchor: '#contact' }
];

const aboutHighlights = [
    'Fast reporting for classrooms and hostels',
    'Clear admin assignment flow',
    'Live technician progress visibility'
];

const featureCards = [
    {
        icon: Activity,
        color: 'from-primary/20 to-primary/5',
        textColor: 'text-primary',
        title: 'ICT and power',
        description: 'Labs and offices'
    },
    {
        icon: Shield,
        color: 'from-success/20 to-success/5',
        textColor: 'text-success',
        title: 'Safety care',
        description: 'Clean shared spaces'
    },
    {
        icon: Zap,
        color: 'from-warning/20 to-warning/5',
        textColor: 'text-warning',
        title: 'Emergency support',
        description: 'Critical response'
    }
];

const serviceCards = [
    {
        icon: Zap,
        title: 'Electrical',
        description: 'Lighting and power lines'
    },
    {
        icon: Wrench,
        title: 'Facilities',
        description: 'Rooms, blocks, common areas'
    },
    {
        icon: Shield,
        title: 'Access',
        description: 'Locks, doors, secure points'
    },
    {
        icon: Activity,
        title: 'Operations',
        description: 'Status, queues, completion'
    }
];

const contactCards = [
    {
        icon: MapPin,
        title: 'DBU Main Campus',
        description: 'Maintenance service zone'
    },
    {
        icon: Mail,
        title: 'ops@dbu.edu.et',
        description: 'Support desk'
    },
    {
        icon: Phone,
        title: '+251 11 681 2040',
        description: 'Response line'
    }
];

const heroSlides = [
    {
        eyebrow: 'Fast reporting',
        title: 'Track campus maintenance from report to resolution.',
        text: 'Students report issues clearly, admins assign faster, and technicians update progress without losing the thread.',
        metric: 'Live request flow'
    },
    {
        eyebrow: 'Cleaner coordination',
        title: 'Give every classroom, dorm, and office a visible support pipeline.',
        text: 'The platform keeps request details, ownership, and updates in one operational view that teams can trust.',
        metric: 'Dorm and block ready'
    },
    {
        eyebrow: 'Better follow-through',
        title: 'See what is assigned, in progress, on hold, and completed in one rhythm.',
        text: 'Campus teams can move from scattered follow-up to a more deliberate, accountable maintenance cycle.',
        metric: 'Student to technician clarity'
    }
];

const SectionHeading = ({ title, kicker }) => (
    <motion.div
        variants={revealUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="text-center mb-12"
    >
        <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full mb-4 text-xs uppercase font-bold tracking-wider">
            {kicker}
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-textPrimary tracking-tight">{title}</h2>
    </motion.div>
);

const LandingPage = () => {
    const location = useLocation();
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        if (location.hash) {
            const element = document.querySelector(location.hash);
            if (element) {
                setTimeout(() => {
                    const top = element.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET;
                    window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
                }, 100);
            }
        }
    }, [location]);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleNav = (id) => {
        const element = document.querySelector(id);
        if (element) {
            const top = element.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET;
            window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
        }
    };

    const currentSlide = heroSlides[activeSlide];

    return (
        <div className="relative min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section id="home" className="relative min-h-screen pt-24 pb-16 flex items-center overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
                    <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] animate-pulse-slow"></div>
                    <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-accent/20 blur-[150px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="max-w-2xl"
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeSlide}
                                    initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                    className="min-h-[280px]"
                                >
                                    <span className="inline-flex items-center text-primary font-extrabold text-sm tracking-widest uppercase mb-4">
                                        {currentSlide.eyebrow}
                                    </span>
                                    <h1 className="text-5xl md:text-6xl font-extrabold text-textPrimary leading-[1.1] tracking-tight mb-6 text-balance">
                                        {currentSlide.title}
                                    </h1>
                                    <p className="text-lg text-textSecondary leading-relaxed mb-8 max-w-xl">
                                        {currentSlide.text}
                                    </p>
                                    <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl glass-panel text-sm font-bold shadow-lg">
                                        <Activity size={18} className="text-primary" />
                                        <span className="text-textPrimary">{currentSlide.metric}</span>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            <div className="flex flex-wrap gap-4 mt-10">
                                <button onClick={() => handleNav('#about')} className="btn-primary px-8 py-4 text-base flex items-center gap-2">
                                    Explore System
                                    <ArrowRight size={18} />
                                </button>
                                <button onClick={() => handleNav('#contact')} className="btn-secondary px-8 py-4 text-base">
                                    Contact Team
                                </button>
                            </div>

                            <div className="flex gap-3 mt-12">
                                {heroSlides.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveSlide(index)}
                                        className={`h-2 rounded-full transition-all duration-500 ${
                                            index === activeSlide ? 'w-10 bg-primary' : 'w-2 bg-overlay/20 hover:bg-overlay/40'
                                        }`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                            className="relative perspective-1000"
                        >
                            <div className="relative w-full aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden glass-panel p-6 lg:p-8 shadow-2xl shadow-primary/20 transform-gpu hover:scale-[1.02] transition-transform duration-500 flex flex-col gap-5">
                                {/* Browser/Window Header */}
                                <div className="flex justify-between items-center pb-4 border-b border-overlay/10">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-danger/80"></div>
                                        <div className="w-3 h-3 rounded-full bg-warning/80"></div>
                                        <div className="w-3 h-3 rounded-full bg-success/80"></div>
                                    </div>
                                    <div className="h-6 w-1/3 bg-overlay/5 rounded-full flex items-center px-3">
                                        <div className="h-1.5 w-1/2 bg-overlay/10 rounded-full"></div>
                                    </div>
                                </div>
                                
                                {/* Abstract Dashboard Content */}
                                <div className="flex-1 grid grid-cols-2 gap-4">
                                    {/* Main active request */}
                                    <motion.div 
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.6 }}
                                        className="col-span-2 flex items-center gap-4 p-4 rounded-2xl bg-overlay/5 border border-overlay/5 hover:bg-overlay/10 transition-colors"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                            <Activity size={20} />
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <div className="h-3 w-1/2 bg-textPrimary/80 rounded-full"></div>
                                                <div className="h-4 w-12 bg-success/20 rounded-md"></div>
                                            </div>
                                            <div className="h-2 w-3/4 bg-overlay/10 rounded-full"></div>
                                        </div>
                                    </motion.div>

                                    {/* Stat Card 1 */}
                                    <motion.div 
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.7, duration: 0.6 }}
                                        className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 flex flex-col justify-between"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
                                            <Wrench size={18} />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-3xl font-extrabold text-textPrimary">24</div>
                                            <div className="text-xs font-bold uppercase tracking-wider text-primary">Active</div>
                                        </div>
                                    </motion.div>

                                    {/* Stat Card 2 */}
                                    <motion.div 
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.8, duration: 0.6 }}
                                        className="p-5 rounded-2xl bg-overlay/5 border border-overlay/5 flex flex-col justify-between"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center text-success mb-4">
                                            <Shield size={18} />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-3xl font-extrabold text-textPrimary">18</div>
                                            <div className="text-xs font-bold uppercase tracking-wider text-success">Resolved</div>
                                        </div>
                                    </motion.div>
                                </div>
                                
                                <div className="absolute inset-0 bg-gradient-to-tr from-background/80 via-transparent to-primary/5 rounded-3xl pointer-events-none"></div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-24 bg-surface relative">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={viewportOnce}
                            className="max-w-xl"
                        >
                            <motion.div variants={revealUp}>
                                <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 text-xs uppercase font-bold tracking-wider">
                                    About Us
                                </span>
                            </motion.div>
                            <motion.h2 variants={revealUp} className="text-4xl md:text-5xl font-extrabold text-textPrimary leading-tight mb-6">
                                Real campus maintenance flow with a cleaner visual experience.
                            </motion.h2>
                            <motion.p variants={revealUp} className="text-lg text-textSecondary mb-8">
                                The system connects reporting, assignment, and technician updates in one smooth maintenance experience for the whole campus.
                            </motion.p>
                            <motion.ul variants={revealUp} className="space-y-4 mb-10">
                                {aboutHighlights.map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-textPrimary font-medium">
                                        <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
                                        {item}
                                    </li>
                                ))}
                            </motion.ul>
                            <motion.div variants={revealUp}>
                                <button onClick={() => handleNav('#features')} className="text-primary font-bold inline-flex items-center gap-2 hover:text-primary-light transition-colors">
                                    See Visual Flow <ArrowRight size={16} />
                                </button>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            viewport={viewportOnce}
                            className="relative"
                        >
                            <div className="glass-card overflow-hidden p-6 relative min-h-[300px] flex flex-col justify-center gap-6">
                                {/* Flow line connecting the nodes */}
                                <div className="absolute left-1/2 top-10 bottom-10 w-0.5 bg-gradient-to-b from-primary/50 via-success/50 to-warning/50 -translate-x-1/2 z-0"></div>
                                
                                {/* Node 1: Report */}
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="relative z-10 w-3/4 self-start glass-panel p-4 rounded-2xl border-l-4 border-l-primary flex items-center gap-4"
                                >
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                        <Activity size={16} />
                                    </div>
                                    <div>
                                        <div className="h-3 w-24 bg-textPrimary/80 rounded-full mb-2"></div>
                                        <div className="h-2 w-32 bg-overlay/20 rounded-full"></div>
                                    </div>
                                </motion.div>

                                {/* Node 2: Assign */}
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    className="relative z-10 w-3/4 self-end glass-panel p-4 rounded-2xl border-r-4 border-r-success flex items-center gap-4 justify-end text-right"
                                >
                                    <div>
                                        <div className="h-3 w-24 bg-textPrimary/80 rounded-full ml-auto mb-2"></div>
                                        <div className="h-2 w-32 bg-overlay/20 rounded-full ml-auto"></div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center text-success shrink-0">
                                        <Shield size={16} />
                                    </div>
                                </motion.div>

                                {/* Node 3: Resolve */}
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.6 }}
                                    className="relative z-10 w-3/4 self-start glass-panel p-4 rounded-2xl border-l-4 border-l-warning flex items-center gap-4"
                                >
                                    <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center text-warning shrink-0">
                                        <Wrench size={16} />
                                    </div>
                                    <div>
                                        <div className="h-3 w-24 bg-textPrimary/80 rounded-full mb-2"></div>
                                        <div className="h-2 w-32 bg-overlay/20 rounded-full"></div>
                                    </div>
                                </motion.div>
                            </div>
                            
                            {/* Floating Badges */}
                            <motion.div 
                                animate={{ y: [0, -10, 0] }} 
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-4 -left-4 glass-panel px-4 py-2 rounded-xl flex items-center gap-2 shadow-xl z-20 border border-primary/20"
                            >
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                <span className="font-bold text-xs uppercase tracking-wider text-textPrimary">Syncing</span>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-background relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <SectionHeading title="System Views" kicker="Gallery" />
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportOnce}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {featureCards.map((card, idx) => {
                            const Icon = card.icon;
                            return (
                            <motion.div 
                                key={idx} 
                                variants={revealUp}
                                whileHover={{ y: -10 }}
                                className={`glass-card group relative min-h-[280px] p-8 flex flex-col justify-end overflow-hidden bg-gradient-to-t ${card.color}`}
                            >
                                {/* Abstract large background icon */}
                                <Icon size={180} strokeWidth={1} className={`absolute -top-10 -right-10 opacity-10 ${card.textColor} transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700`} />
                                
                                <div className="relative z-10">
                                    <div className={`w-12 h-12 rounded-xl bg-surface shadow-md flex items-center justify-center ${card.textColor} mb-6 border border-overlay/5`}>
                                        <Icon size={24} />
                                    </div>
                                    <span className={`font-bold text-xs uppercase tracking-widest mb-2 block ${card.textColor}`}>{card.description}</span>
                                    <h4 className="text-2xl font-extrabold text-textPrimary">{card.title}</h4>
                                </div>
                            </motion.div>
                        )})}
                    </motion.div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-24 bg-surface relative">
                <div className="container mx-auto px-6">
                    <SectionHeading title="Maintenance Areas" kicker="Coverage" />
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportOnce}
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {serviceCards.map((card, idx) => {
                            const Icon = card.icon;
                            return (
                                <motion.div 
                                    key={idx} 
                                    variants={revealUp}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className="glass-card p-8 h-full flex flex-col items-start"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary mb-6 shadow-inner border border-primary/20">
                                        <Icon size={28} />
                                    </div>
                                    <h5 className="text-xl font-bold text-textPrimary mb-3">{card.title}</h5>
                                    <p className="text-textSecondary text-sm leading-relaxed">{card.description}</p>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-24 bg-background border-t border-overlay/5 relative">
                <div className="container mx-auto px-6">
                    <SectionHeading title="Command Center" kicker="Support" />
                    <div className="grid lg:grid-cols-12 gap-8 items-stretch">
                        <div className="lg:col-span-5 flex flex-col gap-4">
                            {contactCards.map((item, idx) => {
                                const Icon = item.icon;
                                return (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ x: 8 }}
                                        className="glass-panel p-6 rounded-2xl flex items-center gap-5 transition-transform"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-overlay/5 flex items-center justify-center text-primary shrink-0 border border-overlay/10">
                                            <Icon size={20} />
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-textPrimary mb-1 text-lg">{item.title}</h5>
                                            <p className="text-sm text-textSecondary m-0">{item.description}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                            
                            <div className="mt-4 p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 flex items-start gap-4">
                                <Shield size={24} className="text-primary mt-1" />
                                <div>
                                    <strong className="block text-textPrimary text-lg mb-1">System is Ready</strong>
                                    <span className="text-textSecondary text-sm">Log in to the command dashboard to begin managing requests.</span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-7">
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                className="glass-card h-full min-h-[400px] overflow-hidden relative"
                            >
                                <div className="absolute top-4 left-4 z-20 bg-background/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border border-overlay/10">
                                    <Activity size={14} className="text-primary animate-pulse" />
                                    <span className="text-xs font-bold tracking-wider uppercase text-textPrimary">DBU Service Zone</span>
                                </div>
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15745.2862803875!2d39.5255462!3d9.6961148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x16460395642d64f3%3A0xc62b47e85295c2!2sDebre%20Birhan%20University!5e0!3m2!1sen!2set!4v1713350000000!5m2!1sen!2set"
                                    className="w-full h-full absolute inset-0 mix-blend-luminosity opacity-80"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    title="Debre Birhan University map"
                                ></iframe>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-surface border-t border-overlay/5">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-4">
                            <img src={dbuLogo} alt="DBU" className="h-10" />
                            <h4 className="text-xl font-extrabold tracking-tight m-0 text-textPrimary">Campus Maintain</h4>
                        </div>
                        
                        <div className="flex flex-wrap justify-center gap-6">
                            {sectionLinks.map((link) => (
                                <button
                                    key={link.anchor}
                                    onClick={() => handleNav(link.anchor)}
                                    className="flex items-center gap-1 text-sm font-medium text-textSecondary hover:text-primary transition-colors"
                                >
                                    <ChevronRight size={14} />
                                    {link.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            {[Globe, Mail, Shield].map((Icon, idx) => (
                                <motion.a
                                    key={idx}
                                    href="#"
                                    whileHover={{ y: -4, scale: 1.1, backgroundColor: '#6366f1', color: 'white' }}
                                    className="w-10 h-10 rounded-full bg-overlay/5 flex items-center justify-center text-textSecondary transition-colors"
                                >
                                    <Icon size={18} />
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

