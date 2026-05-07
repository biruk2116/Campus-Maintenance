import React from 'react';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';

import PublicLayout from '../../components/public/PublicLayout';

const AboutUs = () => {
    return (
        <PublicLayout>
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap');`}
            </style>

            <section className="mt-[65px] py-16 px-6 bg-white dark:bg-slate-800 border-y border-gray-100 dark:border-slate-700 relative overflow-hidden min-h-[calc(100vh-65px)] flex items-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="max-w-4xl mx-auto relative z-10 w-full">
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 mb-3 shadow-sm"
                        >
                            <Building2 size={24} className="text-blue-600 dark:text-blue-500" />
                        </motion.div>
                        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-gray-50" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            About Us
                        </h2>
                    </div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                        variants={{
                            hidden: {},
                            visible: { transition: { staggerChildren: 0.2 } }
                        }}
                        className="bg-gray-50 dark:bg-slate-900 p-8 md:p-12 rounded-2xl shadow-md border border-gray-200 dark:border-slate-700 text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-blue-600 dark:bg-blue-500 rounded-b-full"></div>

                        <motion.p
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } } }}
                            className="text-base md:text-lg text-gray-700 dark:text-gray-200 leading-loose font-light tracking-wide mb-6"
                            style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                            Campus Maintenance System is built to eliminate delays, miscommunication, and untracked maintenance requests across campus.
                        </motion.p>

                        <motion.p
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } } }}
                            className="text-sm md:text-base text-gray-500 dark:text-slate-400 leading-relaxed font-light"
                            style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                            It provides a centralized platform where students and staff can report issues instantly, while administrators manage, prioritize, and resolve them efficiently. By combining real-time tracking with transparent workflows, the system ensures that every request is visible, accountable, and handled on time.
                        </motion.p>
                    </motion.div>
                </div>
            </section>
        </PublicLayout>
    );
};

export default AboutUs;
