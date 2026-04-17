import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { 
    Sun, Moon, LogIn, Wrench, Shield, User, MapPin, 
    Phone, Mail, CheckCircle, Globe, ChevronRight,
    Zap, Activity, Cpu, Bell, Lock, Smartphone,
    CheckCircle2, Target, Eye
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

export const Navbar = () => {
    const { user, isDarkMode, toggleDarkMode } = useAuth();

    return (
        <nav className="navbar navbar-expand-lg nav-glass fixed-top py-3">
            <div className="container">
                <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
                    <Wrench className="me-2 text-primary" size={28} />
                    <span className="fs-4">Campus<span className="text-primary text-opacity-75">Maintain</span></span>
                </Link>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center">
                        <li className="nav-item"><a className="nav-link mx-2 small fw-bold" href="#home">Home</a></li>
                        <li className="nav-item"><a className="nav-link mx-2 small fw-bold" href="#about">About Us</a></li>
                        <li className="nav-item"><a className="nav-link mx-2 small fw-bold" href="#features">Features</a></li>
                        <li className="nav-item"><a className="nav-link mx-2 small fw-bold" href="#services">Services</a></li>
                        <li className="nav-item"><a className="nav-link mx-2 small fw-bold" href="#contact">Contact</a></li>
                        <li className="nav-item ms-lg-3 me-3">
                            <motion.button 
                                whileTap={{ scale: 0.9 }}
                                className="btn btn-surface border-0 p-2 rounded-circle" 
                                onClick={toggleDarkMode}
                            >
                                {isDarkMode ? <Sun size={20} className="text-warning" /> : <Moon size={20} className="text-primary" />}
                            </motion.button>
                        </li>
                        <li className="nav-item">
                            {user ? (
                                <Link className="btn btn-primary px-4 py-2 small fw-bold rounded-pill" to={`/${user.role}`}>Dashboard</Link>
                            ) : (
                                <Link className="btn btn-primary px-4 py-2 small fw-bold rounded-pill" to="/login">Sign In</Link>
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
        <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-3 text-uppercase fw-bold smaller">Perspective</span>
        <h2 className="display-5 fw-bold mb-3">{title}</h2>
        <div className={`bg-primary rounded-pill mb-3 ${centered ? 'mx-auto' : ''}`} style={{ height: '4px', width: '60px' }}></div>
        {subtitle && <p className="text-muted lead mx-auto" style={{ maxWidth: '700px' }}>{subtitle}</p>}
    </motion.div>
);

const LandingPage = () => {
    return (
        <div className="landing-page position-relative">
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
                                <h1 className="display-1 fw-bold mb-4 tracking-tighter">
                                    Next-Gen <br />
                                    <span className="text-primary">Campus Logistics</span>
                                </h1>
                                <p className="lead mb-5 text-muted pe-lg-5">
                                    Revolutionizing infrastructure maintenance at Debre Birhan University. 
                                    A seamless bridge between problem detection and resolution.
                                </p>
                                <div className="d-flex gap-3">
                                    <Link to="/login" className="btn btn-primary btn-lg px-5 py-3 rounded-pill fw-bold shadow-lg">Submit Request</Link>
                                    <a href="#about" className="btn btn-surface btn-lg px-5 py-3 rounded-pill fw-bold border-secondary border-opacity-10">Explore Mission</a>
                                </div>
                            </motion.div>
                        </div>
                        <div className="col-lg-5">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="premium-card p-2 border-0 shadow-2xl position-relative"
                            >
                                <div className="position-absolute top-0 start-0 w-100 h-100 bg-primary opacity-5 rounded-4 blur-3xl"></div>
                                <img 
                                    src="https://images.unsplash.com/photo-1541339907198-e08756ebafe1?q=80&w=800&auto=format&fit=crop" 
                                    alt="Campus Excellence" 
                                    className="img-fluid rounded-4 position-relative"
                                />
                                <div className="p-4">
                                    <div className="d-flex align-items-center mb-2">
                                        <div className="bg-success p-1 rounded-circle me-2"></div>
                                        <span className="smaller fw-bold text-muted">Field Units Active: 14</span>
                                    </div>
                                    <div className="d-flex align-items-baseline gap-2">
                                        <h3 className="fw-bold mb-0">98.4%</h3>
                                        <span className="smaller text-success fw-bold">Up-time</span>
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
                                title="Building the Future of DBU" 
                                subtitle="We are dedicated to ensuring that every facility, from dormitories to high-tech labs, remains in peak operating condition."
                                centered={false}
                            />
                            <div className="row g-4 mb-5">
                                <div className="col-md-6">
                                    <div className="d-flex align-items-start">
                                        <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary me-3"><Target size={20} /></div>
                                        <div>
                                            <h6 className="fw-bold mb-1">Our Mission</h6>
                                            <p className="smaller text-muted">Rapid response and precision engineering for all campus units.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="d-flex align-items-start">
                                        <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary me-3"><Eye size={20} /></div>
                                        <div>
                                            <h6 className="fw-bold mb-1">Our Vision</h6>
                                            <p className="smaller text-muted">A fully autonomous, predictive maintenance ecosystem across DBU.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-surface p-4 rounded-4 border border-secondary border-opacity-10 d-flex align-items-center">
                                <CheckCircle2 className="text-success me-3 flex-shrink-0" />
                                <span className="small fw-bold">Official Department for Debre Birhan University Infrastructure</span>
                            </div>
                        </div>
                        <div className="col-lg-6 order-1 order-lg-2">
                            <motion.div {...fadeInUp} className="position-relative">
                                <img src="https://images.unsplash.com/photo-1523050853064-8abfe487cb1a?q=80&w=800&auto=format&fit=crop" className="img-fluid rounded-5 shadow-2xl" alt="DBU Campus" />
                                <div className="position-absolute bottom-0 start-0 m-4 p-4 premium-card border-0 bg-glass" style={{ maxWidth: '200px' }}>
                                    <h2 className="fw-bold mb-0">20+</h2>
                                    <p className="smaller text-muted mb-0">Years of Service</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Features Section */}
            <section id="features" className="py-5 bg-surface-hover">
                <div className="container py-5">
                    <SectionHeading 
                        title="Maintenance 4.0 Ecosystem" 
                        subtitle="Our platform integrates cutting-edge tech to streamline every aspect of facility management."
                    />
                    <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" className="row g-4">
                        {[
                            { icon: <Zap />, title: "Instant Dispatch", desc: "Automated routing to the nearest qualified field engineer." },
                            { icon: <Activity />, title: "Live Pulse", desc: "Track your repair status in real-time with granular progress markers." },
                            { icon: <Bell />, title: "Push Protocol", desc: "Stay informed via instant SMS and Email notifications." },
                            { icon: <Smartphone />, title: "Mobile Optimized", desc: "Log faults directly from your mobile device while on the move." },
                            { icon: <Lock />, title: "Identity Vault", desc: "Advanced role-permission architecture securing your institutional data." },
                            { icon: <Cpu />, title: "Analytics Engine", desc: "Insightful dashboards for management and technician performance." }
                        ].map((f, i) => (
                            <motion.div key={i} variants={fadeInUp} className="col-md-4">
                                <motion.div 
                                    whileHover={{ y: -8 }}
                                    className="premium-card p-5 h-100 border-secondary border-opacity-10 bg-surface"
                                >
                                    <div className="bg-primary bg-opacity-10 d-inline-block p-3 rounded-4 text-primary mb-4">{f.icon}</div>
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
                        title="Specialized Support Suites" 
                        subtitle="Professional solutions across all campus infrastructure departments."
                    />
                    <div className="row g-4">
                        {[
                            { title: "Power & Light", val: "⚡", desc: "Wiring, illumination, and grid stability fixes." },
                            { title: "Aqua Systems", val: "🚰", desc: "Sanitary, leaks, and drainage management." },
                            { title: "Surface & Structure", val: "🏢", desc: "Painting, carpentry, and wall restorations." },
                            { title: "Network & IT", val: "💻", desc: "Labs, Wi-Fi hotspots, and institutional workstations." }
                        ].map((s, i) => (
                            <div key={i} className="col-md-6 col-lg-3">
                                <motion.div 
                                    whileHover={{ scale: 1.02 }}
                                    className="premium-card h-100 text-center border-secondary border-opacity-10 p-5"
                                >
                                    <div className="display-4 mb-3">{s.val}</div>
                                    <h5 className="fw-bold mb-3">{s.title}</h5>
                                    <p className="smaller text-muted mb-0">{s.desc}</p>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Contact Section */}
            <section id="contact" className="py-5 border-top border-secondary border-opacity-10">
                <div className="container py-5">
                    <div className="row g-5 align-items-center">
                        <div className="col-lg-5">
                            <SectionHeading 
                                title="Get in Touch" 
                                subtitle="Need specialized help or have technical inquiries? Reach out to our 24/7 command center."
                                centered={false}
                            />
                            <div className="row g-4 mt-2">
                                <div className="col-12 d-flex align-items-center">
                                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary me-4"><MapPin /></div>
                                    <div><p className="small fw-bold mb-0">Debre Birhan University</p><p className="smaller text-muted mb-0">Main Campus, Ethiopia</p></div>
                                </div>
                                <div className="col-12 d-flex align-items-center">
                                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary me-4"><Mail /></div>
                                    <div><p className="small fw-bold mb-0">maintenance@dbu.edu.et</p><p className="smaller text-muted mb-0">Support Response < 2hrs</p></div>
                                </div>
                                <div className="col-12 d-flex align-items-center">
                                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary me-4"><Phone /></div>
                                    <div><p className="small fw-bold mb-0">+251 11 681 2040</p><p className="smaller text-muted mb-0">Official Mainline</p></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <div className="premium-card p-4 p-lg-5 shadow-2xl border-secondary border-opacity-10 bg-surface">
                                <form>
                                    <div className="row g-4">
                                        <div className="col-md-6">
                                            <label className="form-label smaller fw-bold mb-2">Identify Yourself</label>
                                            <input type="text" className="form-control" placeholder="John Doe" />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label smaller fw-bold mb-2">Contact Email</label>
                                            <input type="email" className="form-control" placeholder="j.doe@dbu.edu.et" />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label smaller fw-bold mb-2">Technical Subject</label>
                                            <input type="text" className="form-control" placeholder="Feedback/Inquiry" />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label smaller fw-bold mb-2">Message Narrative</label>
                                            <textarea className="form-control" rows="4" placeholder="How can we assist you?"></textarea>
                                        </div>
                                        <div className="col-12 mt-4">
                                            <button type="button" className="btn btn-primary w-100 py-3 fw-bold rounded-pill">Transmit Message</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-5 bg-background border-top border-secondary border-opacity-10">
                <div className="container">
                    <div className="map-container shadow-2xl">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15745.2862803875!2d39.5255462!3d9.6961148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x16460395642d64f3%3A0xc62b47e85295c2!2sDebre%20Birhan%20University!5e0!3m2!1sen!2set!4v1713350000000!5m2!1sen!2set" 
                            className="w-100 map-iframe"
                            style={{ border: 0, height: '400px' }} 
                            allowFullScreen="" 
                            loading="lazy">
                        </iframe>
                    </div>
                </div>
            </section>

            {/* Footer with Branding */}
            <footer className="py-5 text-center bg-surface border-top border-secondary border-opacity-10">
                <div className="container">
                    <div className="mb-4 d-flex flex-column align-items-center">
                        <Wrench size={32} className="text-primary mb-3" />
                        <h4 className="fw-bold tracking-tighter text-white opacity-80">DEBRE BIRHAN UNIVERSITY</h4>
                        <span className="smaller fw-bold text-primary tracking-widest text-uppercase">Infrastructure Maintenance Unit</span>
                    </div>
                    <div className="d-flex justify-content-center gap-4 mb-4">
                        <a href="#" className="text-muted small hover-primary text-decoration-none">Home</a>
                        <a href="#about" className="text-muted small hover-primary text-decoration-none">About</a>
                        <a href="#features" className="text-muted small hover-primary text-decoration-none">Features</a>
                        <a href="#services" className="text-muted small hover-primary text-decoration-none">Services</a>
                        <a href="#contact" className="text-muted small hover-primary text-decoration-none">Contact</a>
                    </div>
                    <p className="text-muted smaller mb-0">© 2026 Debre Birhan University. Optimized Infrastructure Management.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
