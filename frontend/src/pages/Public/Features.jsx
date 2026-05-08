import React from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertCircle, BarChart3, BellRing, ShieldCheck, Smartphone } from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 35 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

const features = [
    { icon: Smartphone, title: 'Report Instantly', desc: 'Log a ticket in seconds without paperwork.' },
    { icon: Activity, title: 'Real-Time Tracking', desc: 'Know exactly when your issue will be fixed.' },
    { icon: ShieldCheck, title: 'Admin Efficiency', desc: 'Central dashboard to dispatch personnel.' },
    { icon: AlertCircle, title: 'Priority Handling', desc: 'Critical emergencies get immediate attention.' },
    { icon: BellRing, title: 'Live Notifications', desc: 'Get alerted when your ticket status changes.' },
    { icon: BarChart3, title: 'Data Insights', desc: 'Analyze trends to prevent future breakdowns.' }
];

const Features = () => {
    return (
        <motion.section
            id="features"
            className="section-container border-y border-overlay/10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
        >
            <div className="section-glow-bg" />
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div variants={fadeUp} className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight mb-2 text-textPrimary">
                        Powerful Features
                    </h2>
                    <p className="text-sm md:text-base text-textSecondary max-w-2xl mx-auto leading-relaxed">
                        Designed for speed, transparency, and accountability
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div 
                                key={feature.title} 
                                variants={fadeUp}
                                className="glass-card p-3 md:p-4 hover:scale-105 hover:shadow-2xl transition-all duration-300 group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/10 border border-primary/30 flex items-center justify-center mb-2 group-hover:scale-110 shadow-lg shadow-primary/10 transition-transform">
                                    <Icon size={18} className="text-primary" />
                                </div>
                                <h4 className="text-sm md:text-base font-bold text-textPrimary mb-1 group-hover:text-primary transition-colors">{feature.title}</h4>
                                <p className="text-textSecondary text-xs leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </motion.section>
    );
};

export default Features;
