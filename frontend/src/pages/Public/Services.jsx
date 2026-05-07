import React from 'react';
import { Send, ClipboardList, TrendingUp, Users, FileText, Zap } from 'lucide-react';

import HeroImg from '../../assets/images/maint_hero.png';
import FeatureImg from '../../assets/images/tech_pc.png';
import FireEmergencyImg from '../../assets/images/fire_emergency.png';
import LockDetailImg from '../../assets/images/lock_detail.png';
import SafetyKitImg from '../../assets/images/safety_kit.png';

const services = [
    { 
        img: FireEmergencyImg, 
        icon: <Send size={24} />,
        title: 'Submit Requests', 
        desc: 'Easily submit maintenance requests from any device with detailed descriptions and images.' 
    },
    { 
        img: LockDetailImg, 
        icon: <TrendingUp size={24} />,
        title: 'Monitor Progress', 
        desc: 'Track your request status in real-time with live updates and technician assignments.' 
    },
    { 
        img: HeroImg, 
        icon: <ClipboardList size={24} />,
        title: 'Request Repairs', 
        desc: 'Log different types of facility and equipment repairs with prioritization.' 
    },
    { 
        img: SafetyKitImg, 
        icon: <Users size={24} />,
        title: 'Assign & Resolve', 
        desc: 'Administrators easily assign tasks to technicians and manage workflows.' 
    },
    { 
        img: FeatureImg, 
        icon: <FileText size={24} />,
        title: 'Generate Reports', 
        desc: 'Comprehensive data reports for administrative oversight and analytics.' 
    },
    { 
        img: HeroImg, 
        icon: <Zap size={24} />,
        title: '24/7 Support', 
        desc: 'Round-the-clock availability for emergency maintenance requests.' 
    }
];

const Services = () => {
    return (
        <section id="services" className="section-container">
            <div className="section-glow-bg" />
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-textPrimary">
                        Comprehensive Services
                    </h2>
                    <p className="text-lg text-textSecondary max-w-2xl mx-auto">
                        Everything needed to manage and resolve campus issues efficiently and transparently
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, idx) => (
                        <div 
                            key={service.title} 
                            className="premium-card overflow-hidden group hover:translate-y-[-8px] transition-all duration-300"
                        >
                            {/* Image Container */}
                            <div className="h-56 w-full bg-gradient-to-br from-surface to-background overflow-hidden relative">
                                <img 
                                    src={service.img} 
                                    alt={service.title} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-40" />
                                <div className="absolute top-4 right-4 w-12 h-12 rounded-xl bg-primary/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    {service.icon}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold mb-3 text-textPrimary group-hover:text-primary transition-colors">{service.title}</h3>
                                <p className="text-sm text-textSecondary leading-relaxed flex-1">{service.desc}</p>
                                <div className="mt-4 flex items-center gap-2 text-primary font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                    Learn more
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
