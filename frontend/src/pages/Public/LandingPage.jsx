import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

// Import Assets
import maintHero from '../../assets/images/maint_hero.png';
import techPc from '../../assets/images/tech_pc.png';
import lockDetail from '../../assets/images/lock_detail.png';
import safetyKit from '../../assets/images/safety_kit.png';
import fireEmergency from '../../assets/images/fire_emergency.png';

import { 
    Sun, Moon, Wrench, Shield, User, MapPin, 
    Phone, Mail, Globe, ChevronRight,
    Zap, Activity, Cpu, Smartphone,
    CheckCircle2, Target, Eye, LogIn,
    ArrowUpRight
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

const sectionLinks = [
    { id: '#home', label: 'Home' },
    { id: '#about', label: 'About Us' },
    { id: '#features', label: 'Features' },
    { id: '#services', label: 'Services' },
    { id: '#contact', label: 'Contact' }
];

const heroMetrics = [
    { icon: <Activity size={18} />, value: '24/7', label: 'response monitoring' },
    { icon: <Wrench size={18} />, value: '320+', label: 'maintenance tasks closed' },
    { icon: <Shield size={18} />, value: '98%', label: 'priority repair completion' }
];

export const Navbar = ({ onNavigate }) => {
    const { user, isDarkMode, toggleDarkMode } = useAuth();

    return (
        <nav className={`navbar navbar-expand-lg nav-glass fixed-top py-3 ${isDarkMode ? 'navbar-dark' : 'navbar-light'}`}>
            <div className="container">
                <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
                    <span className="nav-brand-mark me-2 d-inline-flex align-items-center justify-content-center">
                        <Wrench size={18} />
                    </span>
                    <span className="nav-brand-text text-main">Campus<span className="hero-title-accent">Maintain</span></span>
                </Link>
                <button
                    className="navbar-toggler border-0 shadow-none"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
                        {sectionLinks.map((item) => (
                            <li className="nav-item" key={item.id}>
                                <button
                                    type="button"
                                    className="nav-link landing-nav-link px-3 py-2 small fw-bold btn btn-link text-decoration-none"
                                    onClick={() => onNavigate(item.id)}
                                >
                                    {item.label}
                                </button>
                            </li>
                        ))}
                        <li className="nav-item ms-lg-2 me-lg-1">
                            <motion.button 
                                whileTap={{ scale: 0.9 }}
                                type="button"
                                className="btn theme-toggle-btn border-0 p-2 rounded-circle"
                                onClick={toggleDarkMode}
                                aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
                            >
                                {isDarkMode ? <Sun size={20} className="text-warning" /> : <Moon size={20} className="text-primary" />}
                            </motion.button>
                        </li>
                        <li className="nav-item">
                            {user ? (
                                <Link className="btn nav-cta-btn px-4 py-2 small fw-bold rounded-pill shadow-sm" to={`/${user.role}`}>Live Dashboard</Link>
                            ) : (
                                <Link className="btn nav-cta-btn px-4 py-2 small fw-bold rounded-pill shadow-sm d-flex align-items-center" to="/login">
                                    <LogIn size={14} className="me-2" /> Sign In
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
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

    const handleNav = (id) => {
        if (id === '#home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            window.history.replaceState(null, '', '#home');
            return;
        }

        const el = document.querySelector(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            window.history.replaceState(null, '', id);
        }
    };

    useEffect(() => {
        if (location.hash) {
            const el = document.querySelector(location.hash);
            if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
        }
    }, [location]);

    return (
        <div className="landing-page position-relative bg-background">
            <Navbar onNavigate={handleNav} />
            
            {/* 1. Home / Hero Section */}
            <section id="home" className="hero-section d-flex align-items-center pt-5">
                <div className="container hero-stage">
                    <div className="row align-items-center g-5 hero-grid">
                        <div className="col-lg-6">
                            <motion.div
                                initial={{ opacity: 0, x: -40 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.7, ease: 'easeOut' }}
                                className="hero-copy"
                            >
                                <div className="hero-kicker">
                                    <Activity size={15} className="me-2" />
                                    Smart Maintenance Command
                                </div>
                                <h1 className="hero-heading mb-4">
                                    Modern campus maintenance that keeps every repair in motion.
                                </h1>
                                <p className="hero-subtext mb-4">
                                    Coordinate technicians, monitor urgent requests, and manage infrastructure work
                                    through a faster and more reliable maintenance system experience.
                                </p>
                                <div className="hero-actions">
                                    <Link to="/login" className="btn hero-cta-primary btn-lg px-5 py-3 rounded-pill fw-bold shadow-lg d-inline-flex align-items-center justify-content-center">
                                        Deploy Work Order <ArrowUpRight className="ms-2" size={18} />
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => handleNav('#about')}
                                        className="btn hero-cta-secondary btn-lg px-5 py-3 rounded-pill fw-bold shadow-sm"
                                    >
                                        Explore Mission
                                    </button>
                                </div>
                                <div className="row g-3 hero-metrics">
                                    {heroMetrics.map((item) => (
                                        <div className="col-sm-4" key={item.label}>
                                            <motion.div
                                                whileHover={{ y: -6 }}
                                                className="hero-metric-card"
                                            >
                                                <div className="hero-metric-icon">{item.icon}</div>
                                                <div className="hero-metric-value">{item.value}</div>
                                                <div className="hero-metric-label">{item.label}</div>
                                            </motion.div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                        <div className="col-lg-6">
                            <motion.div
                                initial={{ opacity: 0, x: 40, scale: 0.96 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                className="hero-visual"
                            >
                                <div className="hero-visual-orb hero-visual-orb-one"></div>
                                <div className="hero-visual-orb hero-visual-orb-two"></div>
                                <div className="hero-image-shell">
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                                        className="hero-float-card hero-float-card-top"
                                    >
                                        <div className="hero-float-icon"><Zap size={16} /></div>
                                        <div>
                                            <p className="hero-float-label mb-1">Live dispatch</p>
                                            <strong>Technician assigned in seconds</strong>
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        animate={{ y: [0, 12, 0] }}
                                        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                                        className="hero-float-card hero-float-card-bottom"
                                    >
                                        <div className="hero-float-icon"><CheckCircle2 size={16} /></div>
                                        <div>
                                            <p className="hero-float-label mb-1">Verified completion</p>
                                            <strong>Real-time maintenance updates</strong>
                                        </div>
                                    </motion.div>
                                    <div className="hero-image-frame">
                                        <img
                                            src={maintHero}
                                            alt="Maintenance technician handling a campus repair"
                                            className="hero-main-image"
                                        />
                                        <div className="hero-image-tint"></div>
                                    </div>
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
                                className="map-container shadow-2xl h-100 overflow-hidden border-secondary border-opacity-10 position-relative"
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
                                {sectionLinks.map((item) => (
                                    <li key={item.id}><button type="button" className="btn btn-link p-0 smaller text-muted text-decoration-none hover-primary transition-all d-flex align-items-center" onClick={() => handleNav(item.id)}>
                                        <ChevronRight size={14} className="me-1 opacity-50" /> {item.label}
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
                        <p className="smallest text-muted mb-0">Copyright 2026 DEBRE BIRHAN UNIVERSITY. DESIGNED FOR INFRASTRUCTURE STABILITY.</p>
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
