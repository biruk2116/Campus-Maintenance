import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Award, Zap } from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: 'easeOut' } }
};

const AboutUs = () => {
    return (
        <motion.section
            id="about-us"
            className="section-container"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
        >
            <div className="section-glow-bg" />
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div variants={fadeUp} className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/10 border border-primary/30 mb-6 shadow-lg shadow-primary/10">
                        <Building2 size={30} className="text-primary" />
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-textPrimary">
                        About Our Platform
                    </h2>
                    <p className="text-lg md:text-xl text-textSecondary max-w-3xl mx-auto leading-relaxed">
                        Built to transform how campuses manage maintenance
                    </p>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Main Card */}
                    <motion.div variants={fadeUp} className="lg:col-span-2 premium-card p-8 md:p-10">
                        <h3 className="text-3xl md:text-4xl font-bold text-textPrimary mb-4">Our Mission</h3>
                        <p className="text-textSecondary leading-relaxed mb-6 text-base md:text-lg">
                            Campus Maintenance System is built to eliminate delays, miscommunication, and untracked maintenance requests across campus. We believe every facility issue deserves transparency and accountability.
                        </p>
                        <p className="text-textSecondary leading-relaxed text-base md:text-lg">
                            It provides a centralized platform where students and staff can report issues instantly, while administrators manage, prioritize, and resolve them efficiently. Every request stays visible, accountable, and easier to complete on time.
                        </p>
                    </motion.div>

                    {/* Stats Card */}
                    <motion.div variants={fadeUp} className="glass-card p-8 flex flex-col justify-center">
                        <div className="mb-8">
                            <div className="text-5xl md:text-6xl font-bold text-primary mb-2">2K+</div>
                            <div className="text-sm md:text-base text-textSecondary font-medium">Issues Resolved</div>
                        </div>
                        <div className="mb-8">
                            <div className="text-5xl md:text-6xl font-bold text-primary mb-2">500+</div>
                            <div className="text-sm md:text-base text-textSecondary font-medium">Active Users</div>
                        </div>
                        <div>
                            <div className="text-5xl md:text-6xl font-bold text-primary mb-2">98%</div>
                            <div className="text-sm md:text-base text-textSecondary font-medium">Satisfaction Rate</div>
                        </div>
                    </motion.div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            icon: <Zap size={24} className="text-primary" />,
                            title: 'Instant Reporting',
                            desc: 'Submit maintenance requests in seconds from any device'
                        },
                        {
                            icon: <Award size={24} className="text-primary" />,
                            title: 'Quality Assurance',
                            desc: 'Every request tracked and prioritized for quick resolution'
                        },
                        {
                            icon: <Building2 size={24} className="text-primary" />,
                            title: 'Campus-Wide',
                            desc: 'Serves all facilities, departments, and maintenance teams'
                        }
                    ].map((feature, idx) => (
                        <motion.div key={idx} variants={fadeUp} className="glass-card p-6 hover:scale-105 transition-transform duration-300">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h4 className="text-xl md:text-2xl font-bold text-textPrimary mb-2">{feature.title}</h4>
                            <p className="text-sm md:text-base text-textSecondary">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
};

export default AboutUs;
