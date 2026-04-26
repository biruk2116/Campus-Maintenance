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

import heroOne from '../../assets/images/hero1.webp';
import maintIllustration from '../../assets/images/maint_illustration.png';
import techPc from '../../assets/images/tech_pc.png';
import safetyKit from '../../assets/images/safety_kit.png';
import fireEmergency from '../../assets/images/fire_emergency.png';
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
        image: techPc,
        title: 'ICT and power',
        description: 'Labs and offices'
    },
    {
        image: safetyKit,
        title: 'Safety care',
        description: 'Clean shared spaces'
    },
    {
        image: fireEmergency,
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
        className="text-center mb-5"
    >
        <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-3 text-uppercase fw-bold smaller">
            {kicker}
        </span>
        <h2 className="display-5 fw-800 text-main mb-0">{title}</h2>
    </motion.div>
);

const LandingPage = () => {
    const location = useLocation();
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        if (location.hash) {
            const element = document.querySelector(location.hash);
            if (element) {
                setTimeout(() => element.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
            }
        }
    }, [location]);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % heroSlides.length);
        }, 4200);

        return () => clearInterval(interval);
    }, []);

    const handleNav = (id) => {
        const element = document.querySelector(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const currentSlide = heroSlides[activeSlide];

    return (
        <div className="landing-page position-relative">
            <Navbar />

            <section id="home" className="landing-poster-hero">
                <div className="landing-poster-hero__veil"></div>
                <div className="container landing-hero-shell">
                    <div className="row align-items-center g-5 landing-hero-grid">
                        <div className="col-lg-6">
                            <motion.div
                                initial={{ opacity: 0, y: 22 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="landing-hero-copy"
                            >
                                <div className="landing-hero-copy__label">Campus Maintenance System</div>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeSlide}
                                        initial={{ opacity: 0, x: -28, filter: 'blur(6px)' }}
                                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                        exit={{ opacity: 0, x: 26, filter: 'blur(6px)' }}
                                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                        className="landing-hero-copy__stage"
                                    >
                                        <span className="landing-hero-copy__eyebrow">{currentSlide.eyebrow}</span>
                                        <h1 className="landing-hero-copy__title text-main">{currentSlide.title}</h1>
                                        <p className="landing-hero-copy__text mb-0">{currentSlide.text}</p>
                                        <div className="landing-hero-copy__metric">
                                            <Activity size={16} className="text-primary" />
                                            <span>{currentSlide.metric}</span>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>

                                <div className="landing-hero-copy__actions">
                                    <button type="button" className="btn btn-primary rounded-pill px-4 py-3 fw-800 d-inline-flex align-items-center" onClick={() => handleNav('#about')}>
                                        Explore System
                                        <ArrowRight size={16} className="ms-2" />
                                    </button>
                                    <button type="button" className="btn btn-surface rounded-pill px-4 py-3 fw-800 border-secondary border-opacity-10" onClick={() => handleNav('#contact')}>
                                        Contact Team
                                    </button>
                                </div>

                                <div className="landing-hero-copy__dots" aria-label="Hero slideshow navigation">
                                    {heroSlides.map((slide, index) => (
                                        <button
                                            key={slide.eyebrow}
                                            type="button"
                                            className={`landing-hero-copy__dot ${index === activeSlide ? 'is-active' : ''}`}
                                            onClick={() => setActiveSlide(index)}
                                            aria-label={`Show slide ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        <div className="col-lg-6">
                            <motion.div
                                initial={{ opacity: 0, x: 36, scale: 0.96 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                                className="landing-hero-visual premium-card border-secondary border-opacity-10 shadow-22xl"
                            >
                                <img src={heroOne} alt="Campus maintenance team coordination" className="landing-hero-visual__image" />
                                <div className="landing-hero-visual__overlay"></div>
                                <div className="landing-hero-visual__card landing-hero-visual__card--top">
                                    <span className="landing-hero-visual__card-label">Response</span>
                                    <strong>Report issues with clearer location detail</strong>
                                </div>
                                <div className="landing-hero-visual__card landing-hero-visual__card--bottom">
                                    <span className="landing-hero-visual__card-label">Workflow</span>
                                    <strong>Assignment and updates stay visible across the whole cycle</strong>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="about" className="py-5 bg-background">
                <div className="container py-5">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-5">
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={viewportOnce}
                                variants={staggerContainer}
                                className="landing-about-copy"
                            >
                                <motion.div variants={revealUp}>
                                    <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-3 text-uppercase fw-bold smaller">
                                        About Us
                                    </span>
                                </motion.div>
                                <motion.h2 variants={revealUp} className="landing-about-title text-main">
                                    Real campus maintenance flow with a cleaner visual experience.
                                </motion.h2>
                                <motion.p variants={revealUp} className="landing-about-text">
                                    The system connects reporting, assignment, and technician updates in one smooth maintenance experience for the whole campus.
                                </motion.p>
                                <motion.div variants={revealUp} className="d-flex flex-column gap-3 mt-4">
                                    {aboutHighlights.map((item) => (
                                        <div key={item} className="landing-about-highlight">
                                            <span className="landing-about-highlight__dot"></span>
                                            <span className="text-main">{item}</span>
                                        </div>
                                    ))}
                                </motion.div>
                                <motion.div variants={revealUp} className="landing-about-links mt-4">
                                    <button
                                        type="button"
                                        className="btn btn-link p-0 text-decoration-none landing-about-link"
                                        onClick={() => handleNav('#features')}
                                    >
                                        See Visual Flow
                                    </button>
                                </motion.div>
                            </motion.div>
                        </div>

                        <div className="col-lg-7">
                            <motion.div
                                initial={{ opacity: 0, x: 30, scale: 0.97 }}
                                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                                viewport={viewportOnce}
                                className="landing-about-visual premium-card border-secondary border-opacity-10 shadow-22xl"
                            >
                                <img src={maintIllustration} alt="Campus maintenance coordination" className="img-standard" />
                                <div className="landing-about-visual__tint"></div>
                                <div className="landing-about-visual__badge landing-about-visual__badge--top">
                                    <Activity size={15} className="me-2" />
                                    Live workflow
                                </div>
                                <div className="landing-about-visual__badge landing-about-visual__badge--bottom">
                                    <Shield size={15} className="me-2" />
                                    Better campus care
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" className="py-5 bg-surface-hover">
                <div className="container py-5">
                    <SectionHeading title="System Views" kicker="Gallery" />
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportOnce}
                        className="row g-4"
                    >
                        {featureCards.map((card) => (
                            <motion.div key={card.title} variants={revealUp} className="col-md-4">
                                <div className="landing-gallery-card premium-card border-secondary border-opacity-10 shadow-lg landing-gallery-card--compact">
                                    <div className="landing-gallery-card__media">
                                        <img src={card.image} alt={card.title} className="img-standard" />
                                    </div>
                                    <div className="landing-gallery-card__overlay"></div>
                                    <div className="landing-gallery-card__content">
                                        <span className="landing-gallery-card__eyebrow">{card.description}</span>
                                        <h4 className="fw-800 text-white mb-0">{card.title}</h4>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section id="services" className="py-5 bg-background">
                <div className="container py-5">
                    <SectionHeading title="Maintenance Areas" kicker="Coverage" />
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportOnce}
                        className="row g-4"
                    >
                        {serviceCards.map((card) => {
                            const Icon = card.icon;
                            return (
                                <motion.div key={card.title} variants={revealUp} className="col-md-6 col-xl-3">
                                    <div className="landing-mini-card premium-card p-4 h-100 bg-glass border-secondary border-opacity-10 shadow-lg">
                                        <div className="landing-mini-card__icon">
                                            <Icon size={20} />
                                        </div>
                                        <h5 className="fw-800 text-main mb-2">{card.title}</h5>
                                        <p className="small text-muted mb-0">{card.description}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            <section id="contact" className="py-5 border-top border-secondary border-opacity-10 bg-surface-hover overflow-hidden">
                <div className="container py-5">
                    <SectionHeading title="Command Center" kicker="Support" />
                    <div className="row g-4 align-items-stretch">
                        <div className="col-lg-5">
                            <div className="d-flex flex-column gap-3 h-100">
                                {contactCards.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <motion.div
                                            key={item.title}
                                            whileHover={{ x: 8 }}
                                            className="landing-command-card premium-card p-4 bg-glass border-secondary border-opacity-10 shadow-sm"
                                        >
                                            <div className="landing-command-card__icon">
                                                <Icon size={20} />
                                            </div>
                                            <div>
                                                <h5 className="fw-800 text-main mb-1">{item.title}</h5>
                                                <p className="small text-muted mb-0">{item.description}</p>
                                            </div>
                                        </motion.div>
                                    );
                                })}

                                <div className="landing-command-banner mt-2">
                                    <Shield size={18} className="text-primary flex-shrink-0" />
                                    <div>
                                        <strong className="text-main d-block mb-1">Ready</strong>
                                        <span className="small text-muted">Open the system and start.</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-7">
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                className="landing-command-map-card premium-card bg-glass border-secondary border-opacity-10 shadow-22xl h-100 overflow-hidden position-relative"
                            >
                                <div className="position-absolute top-0 start-0 m-3 z-3">
                                    <span className="badge bg-primary px-3 py-2 rounded-pill shadow-lg d-flex align-items-center fw-bold small">
                                        <Activity size={12} className="me-2" />
                                        DBU SERVICE ZONE
                                    </span>
                                </div>

                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15745.2862803875!2d39.5255462!3d9.6961148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x16460395642d64f3%3A0xc62b47e85295c2!2sDebre%20Birhan%20University!5e0!3m2!1sen!2set!4v1713350000000!5m2!1sen!2set"
                                    className="w-100 h-100 map-iframe"
                                    style={{ border: 0, minHeight: '390px' }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    title="Debre Birhan University map"
                                ></iframe>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="footer-modern py-5 bg-surface border-top border-secondary border-opacity-10">
                <div className="container py-4">
                    <div className="row g-4 align-items-center">
                        <div className="col-lg-4">
                            <div className="d-flex align-items-center">
                                <img src={dbuLogo} alt="DBU" className="me-3" style={{ height: '40px' }} />
                                <h4 className="fw-800 tracking-tighter text-main mb-0">Campus Maintain</h4>
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <div className="d-flex flex-wrap gap-3 justify-content-lg-center">
                                {sectionLinks.map((link) => (
                                    <button
                                        key={link.anchor}
                                        type="button"
                                        className="btn btn-link p-0 smaller text-muted text-decoration-none hover-primary d-inline-flex align-items-center"
                                        onClick={() => handleNav(link.anchor)}
                                    >
                                        <ChevronRight size={14} className="me-1 opacity-50" />
                                        {link.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="d-flex gap-3 justify-content-lg-end">
                                {[Globe, Mail, Shield].map((Icon, index) => (
                                    <motion.a
                                        key={index}
                                        href="#"
                                        whileHover={{ y: -4, scale: 1.06, backgroundColor: 'var(--primary)', color: 'white' }}
                                        className="btn btn-surface p-2 rounded-circle border-secondary border-opacity-10 text-muted"
                                    >
                                        <Icon size={18} />
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
