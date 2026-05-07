import React from 'react';
import { motion } from 'framer-motion';

import PublicLayout from '../../components/public/PublicLayout';
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
        <PublicLayout>
            <section className="mt-[65px] py-12 px-6 bg-gray-50 dark:bg-slate-900 relative min-h-[calc(100vh-65px)]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-gray-50">Services</h2>
                        <p className="text-gray-600 dark:text-slate-400 text-base max-w-2xl mx-auto">
                            Everything you need to manage and resolve campus issues efficiently.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group"
                            >
                                <div className="h-56 w-full bg-gray-100 dark:bg-slate-900 relative overflow-hidden">
                                    <img src={service.img} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 z-10" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col justify-center">
                                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-50 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed">{service.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
};

export default Services;
