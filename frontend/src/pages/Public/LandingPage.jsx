import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

// Import Assets
import maintHero from '../../assets/images/maint_hero.png';
import techPc from '../../assets/images/tech_pc.png';
import lockDetail from '../../assets/images/lock_detail.png';
import safetyKit from '../../assets/images/safety_kit.png';
import fireEmergency from '../../assets/images/fire_emergency.png';
import Navbar from '../../components/Navbar';


import { 
    Sun, Moon, Wrench, Shield, User, MapPin, 
    Phone, Mail, CheckCircle, Globe, ChevronRight,
    Zap, Activity, Cpu, Bell, Lock, Smartphone,
    CheckCircle2, Target, Eye, LogIn,
    ExternalLink, ArrowUpRight, PlayCircle
} from 'lucide-react';

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
    viewport: { once: true }
};

const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    transition: { staggerChildren: 0.1 },
    viewport: { once: true }
};


const SectionHeading = ({ title, subtitle, centered = true }) => (
    <motion.div 
        {...fadeInUp}
        className={`mb-5 ${centered ? 'text-center' : ''}`}
    >
        <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-3 text-uppercase fw-bold smaller">Maintenance Operations</span>
        <h2 className="display-4 fw-bold mb-3">{title}</h2>
        <div className={`bg-primary rounded-pill mb-3 ${centered ? 'mx-auto' : ''}`} style={{ height: '4px', width: '60px' }}></div>
        {subtitle && <p className="text-muted lead mx-auto" style={{ maxWidth: '750px' }}>{subtitle}</p>}
    </motion.div>
);

const LandingPage = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const el = document.querySelector(location.hash);
            if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
        }
    }, [location]);

    return (
        <div className="landing-page position-relative bg-background">
            <Navbar />
            
            {/* 1. Home / Hero Section */}
            <section id="home" className="hero-gradient min-vh-100 d-flex align-items-center pt-5">
                <div className="container py-5 mt-5">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-7">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="d-flex align-items-center mb-4">
                                    <div className="bg-primary bg-opacity-20 px-3 py-1 rounded-pill text-primary fw-bold smaller d-flex align-items-center">
                                        <Activity size={14} className="me-2" /> Live Logistics Control
                                    </div>
                                </div>
                                <h1 className="display-1 fw-bold mb-4 tracking-tighter">
                                    Engineering <br />
                                    <span className="text-primary">Campus Stability</span>
                                </h1>
                                <p className="lead mb-5 text-muted pe-lg-5">
                                    Revolutionizing infrastructure maintenance at Debre Birhan University. 
                                    Real-time precision engineering for the modern academic environment.
                                </p>
                                <div className="d-flex flex-wrap gap-3">
                                    <Link to="/login" className="btn btn-primary btn-lg px-5 py-3 rounded-pill fw-bold shadow-lg d-flex align-items-center">
                                        Deploy Work Order <ArrowUpRight className="ms-2" size={20} />
                                    </Link>
                                    <button onClick={() => document.getElementById('about').scrollIntoView({behavior:'smooth'})} className="btn btn-surface btn-lg px-5 py-3 rounded-pill fw-bold border-secondary border-opacity-10 shadow-sm">
                                        Explore Mission
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                        <div className="col-lg-5">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="hero-image-container premium-card p-2 border-0 shadow-2xl position-relative overflow-visible"
                            >
                                <div className="position-absolute top-0 start-100 translate-middle-x mt-n4 me-n4 bg-primary p-3 rounded-4 shadow-xl text-white z-2">
                                    <Shield size={32} />
                                </div>
                                <img 
                                    src={maintHero} 
                                    alt="Professional Maintenance" 
                                    className="img-standard rounded-4 position-relative shadow-xl"
                                    style={{ transform: 'rotate(-1deg)' }}
                                />
                                <div className="premium-card position-absolute bottom-0 start-0 translate-middle-y ms-n4 p-4 shadow-2xl border-0 bg-glass" style={{ maxWidth: '240px' }}>
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <CheckCircle size={14} className="text-success" />
                                        <span className="smaller fw-bold text-muted">Field Verified Operations</span>
                                    </div>
                                    <h4 className="fw-bold mb-0">99.2% Efficiency</h4>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. About Us Section */}
            <section id="about" className="py-5 bg-background">
                <div className="container py-5">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-6 order-2 order-lg-1">
                            <SectionHeading 
                                title="Building Infrastructure Excellence" 
                                subtitle="At Debre Birhan University, we ensure that every square inch of our campus is maintained to the highest institutional standards."
                                centered={false}
                            />
                            <div className="row g-4 mb-5">
                                <div className="col-md-6">
                                    <motion.div whileHover={{ x: 5 }} className="d-flex align-items-start p-3 rounded-4 hover-bg-surface-hover transition-all">
                                        <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary me-3"><Target size={24} /></div>
                                        <div>
                                            <h6 className="fw-bold mb-1">Our Mission</h6>
                                            <p className="smaller text-muted">Systematic response protocols for all technical campus units.</p>
                                        </div>
                                    </motion.div>
                                </div>
                                <div className="col-md-6">
                                    <motion.div whileHover={{ x: 5 }} className="d-flex align-items-start p-3 rounded-4 hover-bg-surface-hover transition-all">
                                        <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary me-3"><Eye size={24} /></div>
                                        <div>
                                            <h6 className="fw-bold mb-1">Our Vision</h6>
                                            <p className="smaller text-muted">A predictive maintenance ecosystem powered by live field data.</p>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                            <div className="bg-surface p-4 rounded-4 border border-secondary border-opacity-10 d-flex align-items-center shadow-sm">
                                <div className="p-2 bg-success bg-opacity-10 rounded-circle me-3"><CheckCircle2 className="text-success" /></div>
                                <span className="small fw-bold">Governed by the Debre Birhan University Infrastructure Command</span>
                            </div>
                        </div>
                        <div className="col-lg-6 order-1 order-lg-2">
                            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="service-image-container position-relative">
                                <img src={lockDetail} className="img-standard rounded-5 shadow-2xl border border-secondary border-opacity-10" alt="Lock Maintenance" />
                                <div className="position-absolute -bottom-10 -right-10 w-50 h-50 bg-primary opacity-10 rounded-pill blur-3xl"></div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Features Section */}
            <section id="features" className="py-5 bg-surface-hover">
                <div className="container py-5">
                    <SectionHeading 
                        title="Tactical Software Suite" 
                        subtitle="Optimizing the engineering workflow through intelligent dispatch and live monitoring."
                    />
                    <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" className="row g-4">
                        {[
                            { icon: <Zap />, title: "Precision Dispatch", desc: "AI-driven routing to the exact GPS markers of reported faults." },
                            { icon: <Activity />, title: "Live Pulse", desc: "Granular status updates from field engineers as they work." },
                            { icon: <Smartphone />, title: "Mobile Reporting", desc: "Instantly lodge tickets via mobile with photo evidence." },
                            { icon: <Cpu />, title: "Resource Engine", desc: "Track inventory and parts usage across all repair tickets." }
                        ].map((f, i) => (
                            <motion.div key={i} variants={fadeInUp} className="col-md-3">
                                <motion.div 
                                    whileHover={{ y: -10, scale: 1.02 }}
                                    className="premium-card p-5 h-100 border-secondary border-opacity-10 bg-surface shadow-lg text-center"
                                >
                                    <div className="bg-primary bg-opacity-10 d-inline-block p-4 rounded-4 text-primary mb-4 shadow-sm">{f.icon}</div>
                                    <h4 className="fw-bold mb-3">{f.title}</h4>
                                    <p className="text-muted mb-0 small">{f.desc}</p>
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* 4. Services Section */}
            <section id="services" className="py-5 bg-background">
                <div className="container py-5">
                    <SectionHeading 
                        title="Engineering Departments" 
                        subtitle="Professional support suites for across internal campus logistics."
                    />
                    <div className="row g-4">
                        {[
                            { title: "Network & IT", img: techPc, desc: "Lab diagnostics and institutional grid maintenance." },
                            { title: "Structural Assets", img: lockDetail, desc: "Building integrity, carpentry, and locksmithing." },
                            { title: "Health & Safety", img: safetyKit, desc: "First aid stations and sanitary compliance." },
                            { title: "Emergency Response", img: fireEmergency, desc: "Fire safety systems and crisis management." }
                        ].map((s, i) => (
                            <div key={i} className="col-md-6 col-lg-3">
                                <motion.div 
                                    whileHover={{ y: -10 }}
                                    className="premium-card h-100 overflow-hidden border-secondary border-opacity-10 flex-column d-flex shadow-lg"
                                >
                                    <div className="service-image-container">
                                        <img src={s.img} alt={s.title} className="img-standard" />
                                    </div>
                                    <div className="p-4 text-center">
                                        <h5 className="fw-bold mb-2">{s.title}</h5>
                                        <p className="smaller text-muted mb-0">{s.desc}</p>
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Contact Section Redesign (Side-by-side) */}
            <section id="contact" className="py-5 border-top border-secondary border-opacity-10 bg-surface-hover overflow-hidden">
                <div className="container py-5">
                    <SectionHeading 
                        title="Tactical Command Center" 
                        subtitle="Centralized logistics hub for Debre Birhan University Infrastructure Operations."
                    />
                    <div className="row g-4 align-items-stretch">
                        <div className="col-lg-5">
                            <div className="d-flex flex-column h-100 gap-3">
                                {[
                                    { icon: <MapPin />, title: "Main Campus, Ethiopia", desc: "Debre Birhan University Hub" },
                                    { icon: <Mail />, title: "ops@dbu.edu.et", desc: "Strategic Response Desk" },
                                    { icon: <Phone />, title: "+251 11 681 2040", desc: "24/7 Deployment Line" }
                                ].map((item, i) => (
                                    <motion.div key={i} whileHover={{ x: 10 }} className="premium-card p-4 d-flex align-items-center bg-surface border-secondary border-opacity-10 shadow-sm flex-grow-1">
                                        <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary me-4">{item.icon}</div>
                                        <div><p className="small fw-bold mb-0">{item.title}</p><p className="smallest text-muted mb-0">{item.desc}</p></div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <motion.div 
                                whileHover={{ scale: 1.01 }}
                                className="map-container shadow-22xl h-100 overflow-hidden border-secondary border-opacity-10 position-relative"
                                style={{ minHeight: '350px' }}
                            >
                                <div className="position-absolute top-0 start-0 m-3 z-3">
                                    <span className="badge bg-primary px-3 py-2 rounded-pill shadow-lg d-flex align-items-center fw-bold small">
                                        <Activity size={12} className="me-2" /> LIVE DEPLOYMENT ZONE
                                    </span>
                                </div>
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15745.2862803875!2d39.5255462!3d9.6961148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x16460395642d64f3%3A0xc62b47e85295c2!2sDebre%20Birhan%20University!5e0!3m2!1sen!2set!4v1713350000000!5m2!1sen!2set" 
                                    className="w-100 h-100 map-iframe"
                                    style={{ border: 0, minHeight: '350px' }} 
                                    allowFullScreen="" 
                                    loading="lazy">
                                </iframe>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modern Animated Footer */}
            <footer className="footer-modern py-5 bg-surface border-top border-secondary border-opacity-10 mt-5">
                <div className="container py-5">
                    <div className="row g-5">
                        <div className="col-lg-4">
                            <div className="mb-4 d-flex align-items-center">
                                <Wrench size={32} className="text-primary me-2" />
                                <h4 className="fw-bold tracking-tighter text-main mb-0">Campus Maintain</h4>
                            </div>
                            <p className="text-muted smaller mb-4" style={{ maxWidth: '300px' }}>
                                The primary infrastructure gateway for Debre Birhan University. 
                                Ensuring academic excellence through sustained facility stability.
                            </p>
                            <div className="d-flex gap-3 mt-4">
                                {[Globe, Mail, Shield, User].map((Icon, i) => (
                                    <motion.a key={i} href="#" whileHover={{ y: -5, scale: 1.1 }} className="btn btn-surface p-2 rounded-circle border-secondary border-opacity-10 text-muted">
                                        <Icon size={18} />
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-2">
                            <h6 className="fw-bold mb-4 smaller text-uppercase tracking-widest text-primary">Operations</h6>
                            <ul className="list-unstyled d-flex flex-column gap-3">
                                {['Home', 'About Us', 'Features', 'Services', 'Contact'].map((link, i) => (
                                    <li key={i}><button className="btn btn-link p-0 smaller text-muted text-decoration-none hover-primary transition-all d-flex align-items-center" onClick={() => handleNav(`#${link.toLowerCase().replace(' us', '').replace(' ', '')}`)}>
                                        <ChevronRight size={14} className="me-1 opacity-50" /> {link}
                                    </button></li>
                                ))}
                            </ul>
                        </div>
                        <div className="col-md-4 col-lg-3">
                            <h6 className="fw-bold mb-4 smaller text-uppercase tracking-widest text-primary">Technical Suites</h6>
                            <ul className="list-unstyled d-flex flex-column gap-3">
                                {[
                                    {name: 'Network Infrastructure', anchor: '#services'},
                                    {name: 'Structural Assets', anchor: '#services'},
                                    {name: 'Health & Safety', anchor: '#services'},
                                    {name: 'Emergency Operations', anchor: '#services'}
                                ].map((suite, i) => (
                                    <li key={i}><button className="btn btn-link p-0 smaller text-muted text-decoration-none hover-primary transition-all d-flex align-items-center text-start" onClick={() => handleNav(suite.anchor)}>
                                        <ChevronRight size={14} className="me-1 opacity-50 flex-shrink-0" /> {suite.name}
                                    </button></li>
                                ))}
                            </ul>
                        </div>
                        <div className="col-md-4 col-lg-3">
                            <h6 className="fw-bold mb-4 smaller text-uppercase tracking-widest text-primary">Tactical Contact</h6>
                            <div className="d-flex flex-column gap-4">
                                <div className="d-flex align-items-start">
                                    <Phone size={18} className="text-primary me-3 flex-shrink-0" />
                                    <div><p className="smaller fw-bold mb-0">+251 11 681 2040</p><p className="smallest text-muted mb-0">Mainline Response</p></div>
                                </div>
                                <div className="d-flex align-items-start">
                                    <Mail size={18} className="text-primary me-3 flex-shrink-0" />
                                    <div><p className="smaller fw-bold mb-0">ops@dbu.edu.et</p><p className="smallest text-muted mb-0">Strategic Desk</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 pt-5 border-top border-secondary border-opacity-10 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                        <p className="smallest text-muted mb-0">© 2026 DEBRE BIRHAN UNIVERSITY. DESIGNED FOR INFRASTRUCTURE STABILITY.</p>
                        <div className="d-flex gap-4">
                            <a href="#" className="smallest text-muted text-decoration-none hover-primary">LEGAL</a>
                            <a href="#" className="smallest text-muted text-decoration-none hover-primary">PRIVACY</a>
                            <a href="#" className="smallest text-muted text-decoration-none hover-primary">COOKIES</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
