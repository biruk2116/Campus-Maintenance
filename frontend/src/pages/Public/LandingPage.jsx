import React, { useEffect } from 'react';
<<<<<<< HEAD
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
=======
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
>>>>>>> 32961a270f3a032ab768c319ff2af9f1e092c00a
import { useAuth } from '../../context/AuthContext';

// Import Assets
import dbuLogo from '../../assets/images/dbu-logo.png';
import campusHero from '../../assets/images/campus-hero.png';
import techPc from '../../assets/images/tech_pc.png';
import lockDetail from '../../assets/images/lock_detail.png';
import safetyKit from '../../assets/images/safety_kit.png';
import fireEmergency from '../../assets/images/fire_emergency.png';

import { 
    Sun, Moon, Wrench, Shield, User, MapPin, 
<<<<<<< HEAD
    Phone, Mail, Globe, ChevronRight,
    Zap, Activity, Cpu, Smartphone,
    CheckCircle2, Target, Eye, LogIn,
    ArrowUpRight
=======
    Phone, Mail, CheckCircle, Globe, ChevronRight,
    Zap, Activity, Cpu, Bell, Lock, Smartphone,
    Target, Eye, LogIn, ArrowUpRight,
    Facebook, Twitter, Instagram
>>>>>>> 32961a270f3a032ab768c319ff2af9f1e092c00a
} from 'lucide-react';

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    viewport: { once: true }
};

const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    transition: { staggerChildren: 0.1 },
    viewport: { once: true }
};

<<<<<<< HEAD
const sectionLinks = [
    { id: '#home', label: 'Home' },
    { id: '#about', label: 'About Us' },
    { id: '#features', label: 'Features' },
    { id: '#services', label: 'Services' },
    { id: '#contact', label: 'Contact' }
];
=======
export const Navbar = () => {
    const { user, isDarkMode, toggleDarkMode } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
>>>>>>> 32961a270f3a032ab768c319ff2af9f1e092c00a

const heroMetrics = [
    { icon: <Activity size={18} />, value: '24/7', label: 'response monitoring' },
    { icon: <Wrench size={18} />, value: '320+', label: 'maintenance tasks closed' },
    { icon: <Shield size={18} />, value: '98%', label: 'priority repair completion' }
];

export const Navbar = ({ onNavigate }) => {
    const { user, isDarkMode, toggleDarkMode } = useAuth();

    return (
<<<<<<< HEAD
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
=======
        <nav className="navbar navbar-expand-lg nav-glass fixed-top">
            <div className="container">
                <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
                    <img src={dbuLogo} alt="DBU" className="me-3" style={{ height: '42px' }} />
                    <div className="d-flex flex-column" style={{ lineHeight: '1.1' }}>
                        <span className="fs-5 fw-800">CAMPUS</span>
                        <span className="text-primary smaller fw-bold tracking-widest">MAINTAIN</span>
                    </div>
                </Link>
                <div className="collapse navbar-collapse d-none d-lg-block" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center">
                        {['Home', 'About', 'Features', 'Services', 'Contact'].map((item) => (
                            <li key={item} className="nav-item">
                                <button className="nav-link mx-3 smallest fw-bold btn btn-link text-decoration-none border-0 shadow-none text-muted uppercase tracking-widest" onClick={() => handleNav(`#${item.toLowerCase()}`)}>{item}</button>
                            </li>
                        ))}
>>>>>>> 32961a270f3a032ab768c319ff2af9f1e092c00a
                    </ul>
                </div>
                <div className="ms-auto d-flex align-items-center gap-3">
                    <button className="btn btn-link p-2 text-muted border-0 shadow-none hover-bg-surface-hover rounded-circle" onClick={toggleDarkMode}>
                        {isDarkMode ? <Sun size={20} className="text-warning" /> : <Moon size={20} className="text-primary" />}
                    </button>
                    {user ? (
                        <Link className="btn btn-primary px-4 rounded-pill shadow-lg" to={`/${user.role}`}>Command Centre</Link>
                    ) : (
                        <Link className="btn btn-primary px-4 rounded-pill d-flex align-items-center shadow-lg" to="/login">
                            <LogIn size={16} className="me-2" /> Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

const SectionHeading = ({ title, subtitle, centered = true }) => (
    <motion.div {...fadeInUp} className={`mb-5 ${centered ? 'text-center' : ''}`}>
        <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-3 text-uppercase fw-800 tracking-widest smallest">Strategic Unit</span>
        <h2 className="display-4 fw-800 mb-3 tracking-tighter text-main">{title}</h2>
        <div className={`bg-primary rounded-pill mb-4 ${centered ? 'mx-auto' : ''}`} style={{ height: '4px', width: '60px' }}></div>
        {subtitle && <p className="text-muted lead mx-auto font-medium" style={{ maxWidth: '700px' }}>{subtitle}</p>}
    </motion.div>
);

const LandingPage = () => {
<<<<<<< HEAD
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
=======
    return (
        <div className="landing-page position-relative">
            {/* Premium Backdrop Deployment */}
            <div className="app-backdrop">
                <div 
                    className="fullscreen-bg-fixed" 
                    style={{ backgroundImage: `url(${campusHero})` }}
                ></div>
                <div className="bg-overlay"></div>
            </div>

            <Navbar />
            
            {/* Hero Section */}
            <section id="home" className="min-vh-100 d-flex align-items-center pt-5">
                <div className="container py-5 mt-5">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-7">
                            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} className="p-5 bg-glass-mobile rounded-5 border border-secondary border-opacity-10 shadow-22xl">
                                <div className="d-flex align-items-center mb-4">
                                    <div className="bg-primary bg-opacity-20 px-3 py-1 rounded-pill text-primary fw-800 smallest d-flex align-items-center tracking-widest uppercase">
                                        <Activity size={14} className="me-2" /> Official Infrastructure Command
                                    </div>
                                </div>
                                <h1 className="display-1 fw-800 mb-4 tracking-tighter text-main">
                                    Engineering <br />
                                    <span className="text-primary">DBU Stability</span>
                                </h1>
                                <p className="lead mb-5 text-muted pe-lg-5 fw-medium">
                                    Sustaining academic excellence through professional infrastructure maintenance. 
                                    Real-time facility management for the next generation of DBU legacy.
                                </p>
                                <div className="d-flex flex-wrap gap-3">
                                    <Link to="/login" className="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow-22xl d-flex align-items-center">
                                        Request Service <ArrowUpRight className="ms-2" size={20} />
                                    </Link>
                                    <button onClick={() => document.getElementById('about').scrollIntoView({behavior:'smooth'})} className="btn btn-surface btn-lg px-5 py-3 rounded-pill border-secondary border-opacity-10 shadow-md">
>>>>>>> 32961a270f3a032ab768c319ff2af9f1e092c00a
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
<<<<<<< HEAD
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
=======
>>>>>>> 32961a270f3a032ab768c319ff2af9f1e092c00a
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-5 bg-glass">
                <div className="container py-5">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-6 order-2 order-lg-1">
                            <SectionHeading title="Institutional Quality" subtitle="Ensuring every square inch of the Debre Berhan University campus is maintained to international safety standards." centered={false} />
                            <div className="bg-surface p-4 rounded-4 border border-secondary border-opacity-10 d-flex align-items-center shadow-sm">
                                <Shield className="text-primary me-4" size={32} />
                                <div>
                                    <h6 className="fw-800 mb-1 text-main">Governed Sovereignty</h6>
                                    <p className="smallest text-muted mb-0 uppercase tracking-widest fw-bold">DBU Infrastructure Policy Unit</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 order-1 order-lg-2 text-center">
                            <motion.img {...fadeInUp} src={lockDetail} className="img-fluid rounded-5 shadow-22xl border border-secondary border-opacity-10" alt="Maintenance Detail" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-5">
                <div className="container py-5">
                    <SectionHeading title="Tactical Operations" subtitle="Optimizing the engineering workflow through intelligent dispatch and live monitoring." />
                    <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" className="row g-4">
                        {[
                            { icon: <Zap />, title: "Rapid Response", desc: "Precision routing to the exact site of reported facility faults." },
                            { icon: <Cpu />, title: "Asset Logic", desc: "Granular tracking of internal campus logistics and parts." },
                            { icon: <Activity />, title: "Live Pulse", desc: "Real-time verification of field engineer progress and stability." }
                        ].map((f, i) => (
                            <div key={i} className="col-md-4">
                                <motion.div whileHover={{ y: -10 }} className="premium-card p-5 h-100 text-center border-secondary border-opacity-10 shadow-lg">
                                    <div className="bg-primary bg-opacity-10 d-inline-block p-4 rounded-4 text-primary mb-4 shadow-sm">{f.icon}</div>
                                    <h4 className="fw-800 mb-3 text-main">{f.title}</h4>
                                    <p className="text-muted mb-0 smaller fw-medium">{f.desc}</p>
                                </motion.div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-5 bg-glass">
                <div className="container py-5">
                    <SectionHeading title="Strategic Departments" subtitle="Professional support suites for across internal campus logistics." />
                    <div className="row g-4">
                        {[
                            { title: "ICT Systems", img: techPc, desc: "Network grid maintenance and laboratory diagnostics." },
                            { title: "Structural Assets", img: campusHero, desc: "Building integrity and large-scale structural repairs." },
                            { title: "Plumbing Unit", img: safetyKit, desc: "Sanitary compliance and campus-wide water grid." },
                            { title: "Emergency Division", img: fireEmergency, desc: "Critical infrastructure protection and safety response." }
                        ].map((s, i) => (
                            <div key={i} className="col-md-3">
                                <motion.div whileHover={{ scale: 1.02 }} className="premium-card h-100 overflow-hidden border-secondary border-opacity-10 shadow-lg">
                                    <img src={s.img} alt={s.title} className="w-100" style={{ height: '220px', objectFit: 'cover' }} />
                                    <div className="p-4 text-center">
                                        <h5 className="fw-800 mb-2 text-main">{s.title}</h5>
                                        <p className="smallest text-muted mb-0 uppercase tracking-widest fw-bold">{s.desc}</p>
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-5 bg-surface border-top border-secondary border-opacity-10 mt-5">
                <div className="container py-5 text-main">
                    <div className="row g-5">
                        <div className="col-lg-4">
                            <div className="mb-4 d-flex align-items-center">
                                <img src={dbuLogo} alt="DBU" className="me-3" style={{ height: '50px' }} />
                                <h4 className="fw-800 tracking-tighter mb-0 text-main">Campus Maintain</h4>
                            </div>
                            <p className="text-muted smaller mb-4 fw-medium" style={{ maxWidth: '300px' }}>
                                The official infrastructure gateway for Debre Berhan University. 
                                Sustaining institutional excellence through technical precision.
                            </p>
                            <div className="d-flex gap-3 mt-4">
                                {[Facebook, Twitter, Instagram].map((Icon, i) => (
                                    <motion.a key={i} href="#" whileHover={{ y: -5 }} className="btn btn-surface p-2 rounded-circle border-secondary border-opacity-10 text-muted"><Icon size={20} /></motion.a>
                                ))}
                            </div>
                        </div>
<<<<<<< HEAD
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
=======
                        <div className="col-lg-8">
                            <div className="row g-4">
                                <div className="col-md-6 text-md-end ms-auto">
                                    <h6 className="fw-800 mb-4 smallest text-uppercase tracking-widest text-primary">Strategic Logistics</h6>
                                    <p className="smaller text-muted mb-1">Debre Berhan, Amhara Region</p>
                                    <p className="smaller text-muted mb-1">info@dbu.edu.et</p>
                                    <p className="smaller text-muted">+251 11 681 2040</p>
>>>>>>> 32961a270f3a032ab768c319ff2af9f1e092c00a
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 pt-5 border-top border-secondary border-opacity-10 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
<<<<<<< HEAD
                        <p className="smallest text-muted mb-0">Copyright 2026 DEBRE BIRHAN UNIVERSITY. DESIGNED FOR INFRASTRUCTURE STABILITY.</p>
=======
                        <p className="smallest text-muted mb-0 opacity-50 uppercase tracking-widest fw-bold">© 2026 DEBRE BIRHAN UNIVERSITY. INFRASTRUCTURE COMMAND CENTER.</p>
>>>>>>> 32961a270f3a032ab768c319ff2af9f1e092c00a
                        <div className="d-flex gap-4">
                            {['Legal', 'Security', 'Governance'].map(link => (
                                <a key={link} href="#" className="smallest text-muted text-decoration-none hover-primary uppercase tracking-widest fw-bold">{link}</a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
