import React from 'react';
import { Activity, AlertCircle, BarChart3, BellRing, ShieldCheck, Smartphone } from 'lucide-react';

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
        <section id="features" className="py-16 px-6 bg-slate-200/45 dark:bg-slate-900/35 border-y border-slate-300/60 dark:border-slate-800">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-gray-50">Features</h2>
                    <p className="text-gray-600 dark:text-slate-400 text-base max-w-2xl mx-auto">Designed for speed, transparency, and accountability.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <div key={feature.title} className="p-8 rounded-2xl bg-slate-100/90 dark:bg-slate-900/82 backdrop-blur-sm border border-slate-300/70 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-5 shadow-sm border border-slate-200 dark:border-slate-700">
                                <feature.icon size={24} className="text-blue-600 dark:text-blue-500" />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-2">{feature.title}</h4>
                            <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
