import React from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertCircle, BarChart3, BellRing, ShieldCheck, Smartphone } from 'lucide-react';

import PublicLayout from '../../components/public/PublicLayout';

const features = [
    { icon: Smartphone, title: 'Report instantly', desc: 'Log a ticket in seconds without paperwork.' },
    { icon: Activity, title: 'Real-time tracking', desc: 'Know exactly when your issue will be fixed.' },
    { icon: ShieldCheck, title: 'Admin efficiency', desc: 'Central dashboard to dispatch personnel.' },
    { icon: AlertCircle, title: 'Priority handling', desc: 'Critical emergencies get immediate attention.' },
    { icon: BellRing, title: 'Live Notifications', desc: 'Get alerted when your ticket status changes.' },
    { icon: BarChart3, title: 'Data insights', desc: 'Analyze trends to prevent future breakdowns.' }
];

const Features = () => {
    return (
        <PublicLayout>
            <section className="mt-[65px] py-12 px-6 bg-white dark:bg-slate-800 border-y border-gray-100 dark:border-slate-700 relative min-h-[calc(100vh-65px)]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-gray-50">Features</h2>
                        <p className="text-gray-600 dark:text-slate-400 text-base max-w-2xl mx-auto">
                            Designed for speed, transparency, and accountability.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
                                whileHover={{ y: -4 }}
                                className="p-8 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-blue-600/30 transition-all duration-300 group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 duration-500"></div>

                                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center mb-5 shadow-sm border border-gray-100 dark:border-slate-700 relative z-10 group-hover:scale-105 transition-transform">
                                    <feature.icon size={24} className="text-blue-600 dark:text-blue-500" />
                                </div>
                                <h4 className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-2 relative z-10 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {feature.title}
                                </h4>
                                <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed relative z-10">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
};

export default Features;
