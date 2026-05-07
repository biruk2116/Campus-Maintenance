import React from 'react';
import { Building2 } from 'lucide-react';

const AboutUs = () => {
    return (
        <section id="about-us" className="py-16 px-6 bg-slate-200/45 dark:bg-slate-900/35 border-y border-slate-300/60 dark:border-slate-800">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 mb-3 shadow-sm">
                        <Building2 size={24} className="text-blue-600 dark:text-blue-500" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-gray-50">
                        About Us
                    </h2>
                </div>

                <div className="bg-slate-100/90 dark:bg-slate-900/80 p-8 md:p-12 rounded-2xl shadow-md border border-slate-300/70 dark:border-slate-700 text-center backdrop-blur-sm">
                    <p className="text-base md:text-lg text-gray-700 dark:text-gray-200 leading-loose mb-6">
                        Campus Maintenance System is built to eliminate delays, miscommunication, and untracked maintenance requests across campus.
                    </p>
                    <p className="text-sm md:text-base text-gray-500 dark:text-slate-400 leading-relaxed">
                        It provides a centralized platform where students and staff can report issues instantly, while administrators manage, prioritize, and resolve them efficiently. Every request stays visible, accountable, and easier to complete on time.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
