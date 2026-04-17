import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { 
    Sun, Moon, LogIn, Wrench, Shield, User, MapPin, 
    Phone, Mail, CheckCircle, Globe, ChevronRight,
    Search, Zap, Activity
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
    transition: { staggerChildren: 0.15 },
    viewport: { once: true }
};

export const Navbar = () => {
    const { user } = useAuth();

    return (
        <nav className="navbar navbar-expand-lg nav-glass fixed-top py-3">
            <div className="container">
                <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
                    <Wrench className="me-2 text-primary" size={24} />
                    <span className="fs-4 text-white">Campus<span className="text-primary text-opacity-75">Maintain</span></span>
                </Link>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center">
                        <li className="nav-item"><a className="nav-link mx-2 small text-secondary hover-white" href="#home">Home</a></li>
                        <li className="nav-item"><a className="nav-link mx-2 small text-secondary hover-white" href="#about">Mission</a></li>
                        <li className="nav-item"><a className="nav-link mx-2 small text-secondary hover-white" href="#services">Services</a></li>
                        <li className="nav-item ms-lg-3">
                            {user ? (
                                <Link className="btn btn-primary px-4 py-2 small fw-bold" to={`/${user.role}`}>Open Dashboard</Link>
                            ) : (
                                <Link className="btn btn-primary px-4 py-2 small fw-bold" to="/login">Sign In</Link>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

const LandingPage = () => {
    return (
        <div className="landing-page bg-background text-white">
            <Navbar />
            
            {/* SaaS Hero Section */}
            <section id="home" className="hero-gradient pt-5 min-vh-100 d-flex align-items-center position-relative">
                <div className="position-absolute top-0 start-50 translate-middle-x w-100 h-100 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #3b82f633 0%, transparent 70%)' }}></div>
                
                <div className="container py-5 position-relative">
                    <div className="row justify-content-center text-center">
                        <div className="col-lg-10">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-20 px-3 py-2 rounded-pill mb-4 uppercase tracking-widest fw-800 small"
                            >
                                Optimized for Debre Birhan University
                            </motion.div>
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="display-2 fw-bold mb-4 tracking-tighter"
                            >
                                Seamless Campus Maintenance <br /> 
                                <span className="text-secondary text-opacity-50">Simplified for the Modern Era.</span>
                            </motion.h1>
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="lead mb-5 px-lg-5 text-secondary mx-auto"
                                style={{ maxWidth: '800px' }}
                            >
                                Centralize repair requests, automate dispatch, and track facilities in real-time with our unified maintenance dashboard. Built for students, engineers, and administrators.
                            </motion.p>
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="d-flex justify-content-center gap-3"
                            >
                                <Link to="/login" className="btn btn-primary px-5 py-3 fw-bold rounded-pill h5">Launch Portal <ChevronRight size={18} className="ms-2" /></Link>
                                <a href="#about" className="btn btn-secondary px-5 py-3 fw-bold rounded-pill h5">Learn More</a>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="py-5 border-top border-bottom border-secondary border-opacity-10">
                <div className="container py-5">
                    <motion.div {...staggerContainer} className="row g-4">
                        {[
                            { icon: <Zap className="text-primary" />, title: "Instant Dispatch", desc: "Requests are routed to technicians within seconds of submission." },
                            { icon: <Activity className="text-success" />, title: "Live Tracking", desc: "Real-time progress bars and status updates for every single work order." },
                            { icon: <Shield className="text-indigo text-primary" />, title: "Secure Access", desc: "Military-grade protection for institution data and personell files." }
                        ].map((f, i) => (
                            <motion.div key={i} variants={fadeInUp} className="col-md-4">
                                <div className="premium-card p-5 h-100 border-0 bg-surface bg-opacity-40">
                                    <div className="bg-primary bg-opacity-10 d-inline-block p-3 rounded-3 mb-4">{f.icon}</div>
                                    <h4 className="fw-bold mb-3">{f.title}</h4>
                                    <p className="text-muted mb-0">{f.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-5 bg-background">
                <div className="container py-5">
                    <div className="text-center mb-5">
                        <h2 className="display-4 fw-bold mb-3">Service Capabilities</h2>
                        <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>Our system supports all infrastructure departments across the DBU campus.</p>
                    </div>
                    <div className="row g-3">
                        {["Electrical Support", "Water & Plumbing", "Furniture Repair", "IT & Network", "Civil Works", "HVAC Cooling"].map((s, i) => (
                            <div key={i} className="col-md-4 col-lg-2">
                                <motion.div 
                                    whileHover={{ y: -5, borderColor: '#3b82f6' }}
                                    className="p-4 text-center rounded-3 bg-surface border border-secondary border-opacity-10 transition-all cursor-default"
                                >
                                    <span className="fw-bold small">{s}</span>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact & Map Strip */}
            <section id="contact" className="py-5 position-relative overflow-hidden bg-black bg-opacity-20 border-top border-secondary border-opacity-10">
                <div className="container py-5">
                    <div className="row g-5 align-items-center">
                        <div className="col-lg-5">
                            <h2 className="fw-bold mb-4">Operations Center</h2>
                            <p className="text-muted mb-5">Our maintenance hub at DBU is active 24/7 to resolve critical infrastructure failures.</p>
                            <div className="d-flex flex-column gap-4">
                                <div className="d-flex align-items-center">
                                    <MapPin className="text-primary me-4" size={20} />
                                    <div><p className="mb-0 small fw-bold">Debre Birhan University</p><p className="mb-0 smaller text-muted">Main Campus, Ethiopia</p></div>
                                </div>
                                <div className="d-flex align-items-center">
                                    <Mail className="text-primary me-4" size={20} />
                                    <div><p className="mb-0 small fw-bold">maintenance@dbu.edu.et</p><p className="mb-0 smaller text-muted">Technical Support</p></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <div className="premium-card p-1 border-0 shadow-lg" style={{ height: '350px' }}>
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15745.2862803875!2d39.5255462!3d9.6961148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x16460395642d64f3%3A0xc62b47e85295c2!2sDebre%20Birhan%20University!5e0!3m2!1sen!2set!4v1713350000000!5m2!1sen!2set" 
                                    className="w-100 h-100 rounded-2 grayscale-filter"
                                    style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(80%)' }} 
                                    allowFullScreen="" 
                                    loading="lazy">
                                </iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dark Footer */}
            <footer className="py-5 text-center bg-background border-top border-secondary border-opacity-10">
                <div className="container">
                    <div className="mb-4">
                        <Wrench size={32} className="text-primary mb-2 opacity-50" />
                        <h4 className="fw-bold opacity-80 letter-tighter">DBU Maintain</h4>
                    </div>
                    <p className="text-muted smaller mb-0">© 2026 Debre Birhan University Maintenance Division. Built for Efficiency.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
