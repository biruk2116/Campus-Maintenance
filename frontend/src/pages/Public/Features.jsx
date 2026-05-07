import React from 'react';
import { Activity, AlertCircle, BarChart3, BellRing, ShieldCheck, Smartphone } from 'lucide-react';

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
        <section id="features" className="section-container border-y border-overlay/10">
            <div className="section-glow-bg" />
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-textPrimary">
                        Powerful Features
                    </h2>
                    <p className="text-lg text-textSecondary max-w-2xl mx-auto">
                        Designed for speed, transparency, and accountability
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <div 
                                key={feature.title} 
                                className="glass-card p-8 hover:scale-105 hover:shadow-2xl transition-all duration-300 group"
                                style={{
                                    animation: `slideUp 0.5s ease-out forwards`,
                                    animationDelay: `${idx * 0.05}s`,
                                    opacity: 0
                                }}
                            >
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/10 border border-primary/30 flex items-center justify-center mb-6 group-hover:scale-110 shadow-lg shadow-primary/10 transition-transform">
                                    <Icon size={28} className="text-primary" />
                                </div>
                                <h4 className="text-lg font-bold text-textPrimary mb-3 group-hover:text-primary transition-colors">{feature.title}</h4>
                                <p className="text-textSecondary text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Features;
