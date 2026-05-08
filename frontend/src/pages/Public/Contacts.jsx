import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: 'easeOut' } }
};

const Contacts = () => {
    return (
        <motion.section
            id="contacts"
            className="section-container"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
        >
            <div className="section-glow-bg" />
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div variants={fadeUp} className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-textPrimary">
                        Get In Touch
                    </h2>
                    <p className="text-lg md:text-xl text-textSecondary max-w-2xl mx-auto leading-relaxed">
                        Have questions? Contact the DBU maintenance office or submit your inquiry below.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-8 items-stretch">
                    {/* Map */}
                    <motion.div variants={fadeUp} className="premium-card overflow-hidden min-h-[450px] lg:min-h-auto transition-transform duration-500 hover:-translate-y-1">
                        <iframe
                            title="DBU Location"
                            src="https://maps.google.com/maps?q=Debre%20Berhan%20University&t=&z=16&ie=UTF8&iwloc=&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0, minHeight: '450px' }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </motion.div>

                    {/* Contact Info */}
                    <div className="flex flex-col space-y-6">
                        {/* Location Card */}
                        <motion.div variants={fadeUp} className="glass-card p-8 hover:shadow-2xl transition-all duration-300 group">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/10 border border-primary/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-primary/10">
                                    <MapPin size={24} className="text-primary" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xl md:text-2xl font-bold text-textPrimary mb-2 group-hover:text-primary transition-colors">Location</h4>
                                    <p className="text-textSecondary text-base leading-relaxed">
                                        Debre Berhan University<br />
                                        Main Campus, Building 4<br />
                                        Debre Berhan, Ethiopia
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Phone Card */}
                        <motion.div variants={fadeUp} className="glass-card p-8 hover:shadow-2xl transition-all duration-300 group">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/10 border border-primary/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-primary/10">
                                    <Phone size={24} className="text-primary" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xl md:text-2xl font-bold text-textPrimary mb-2 group-hover:text-primary transition-colors">Phone</h4>
                                    <p className="text-textSecondary text-base leading-relaxed">
                                        <a href="tel:+251116815440" className="hover:text-primary transition-colors">+251 11 681 5440</a><br />
                                        <a href="tel:+251911234567" className="hover:text-primary transition-colors">+251 91 123 4567</a><br />
                                        <span className="text-sm text-textSecondary/70">(Emergency)</span>
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Email Card */}
                        <motion.div variants={fadeUp} className="glass-card p-8 hover:shadow-2xl transition-all duration-300 group">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/10 border border-primary/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-primary/10">
                                    <Mail size={24} className="text-primary" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xl md:text-2xl font-bold text-textPrimary mb-2 group-hover:text-primary transition-colors">Email</h4>
                                    <p className="text-textSecondary text-base leading-relaxed">
                                        <a href="mailto:maintenance@dbu.edu.et" className="hover:text-primary transition-colors">maintenance@dbu.edu.et</a><br />
                                        <a href="mailto:support@dbu.edu.et" className="hover:text-primary transition-colors">support@dbu.edu.et</a>
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* CTA Button */}
                        <motion.button
                            variants={fadeUp}
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 text-base"
                        >
                            <Send size={18} />
                            Send a Message
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default Contacts;
