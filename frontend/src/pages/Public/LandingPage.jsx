import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
    Phone, Mail, CheckCircle, Globe, ChevronRight,
    Zap, Activity, Cpu, Bell, Lock, Smartphone,
    Target, Eye, LogIn, ArrowUpRight,
    Facebook, Twitter, Instagram
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

export const Navbar = () => {
    const { user, isDarkMode, toggleDarkMode } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleNav = (id) => {
        if (location.pathname !== '/') {
            navigate('/' + id);
        } else {
            const el = document.querySelector(id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
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
                                        Explore Mission
                                    </button>
                                </div>
                            </motion.div>
                        </div>
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
                        <div className="col-lg-8">
                            <div className="row g-4">
                                <div className="col-md-6 text-md-end ms-auto">
                                    <h6 className="fw-800 mb-4 smallest text-uppercase tracking-widest text-primary">Strategic Logistics</h6>
                                    <p className="smaller text-muted mb-1">Debre Berhan, Amhara Region</p>
                                    <p className="smaller text-muted mb-1">info@dbu.edu.et</p>
                                    <p className="smaller text-muted">+251 11 681 2040</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 pt-5 border-top border-secondary border-opacity-10 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                        <p className="smallest text-muted mb-0 opacity-50 uppercase tracking-widest fw-bold">© 2026 DEBRE BIRHAN UNIVERSITY. INFRASTRUCTURE COMMAND CENTER.</p>
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
