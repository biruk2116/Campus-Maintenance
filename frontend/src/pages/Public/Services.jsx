import React from 'react';

import HeroImg from '../../assets/images/maint_hero.png';
import FeatureImg from '../../assets/images/tech_pc.png';
import FireEmergencyImg from '../../assets/images/fire_emergency.png';
import LockDetailImg from '../../assets/images/lock_detail.png';
import SafetyKitImg from '../../assets/images/safety_kit.png';

const services = [
    { img: FireEmergencyImg, title: 'Submit Requests', desc: 'Easily submit maintenance requests from any device.' },
    { img: LockDetailImg, title: 'Monitor Progress', desc: 'Track your request status in real-time.' },
    { img: HeroImg, title: 'Request Repairs', desc: 'Log different types of facility and equipment repairs.' },
    { img: SafetyKitImg, title: 'Assign & Resolve', desc: 'Administrators easily assign tasks to technicians.' },
    { img: FeatureImg, title: 'Generate Reports', desc: 'Comprehensive data reports for administrative oversight.' }
];

const Services = () => {
    return (
        <section id="services" className="py-16 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-gray-50">Services</h2>
                    <p className="text-gray-600 dark:text-slate-400 text-base max-w-2xl mx-auto">
                        Everything needed to manage and resolve campus issues efficiently.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <div key={service.title} className="rounded-2xl bg-slate-100/92 dark:bg-slate-900/82 backdrop-blur-sm border border-slate-300/70 dark:border-slate-700 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
                            <div className="h-56 w-full bg-slate-200/70 dark:bg-slate-950 overflow-hidden">
                                <img src={service.img} alt={service.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-6 flex-1">
                                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-50">{service.title}</h3>
                                <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed">{service.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
