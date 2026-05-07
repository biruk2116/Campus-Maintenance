import React from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

const Contacts = () => {
    return (
        <section id="contacts" className="section-container">
            <div className="section-glow-bg" />
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-textPrimary">
                        Get In Touch
                    </h2>
                    <p className="text-lg text-textSecondary max-w-2xl mx-auto">
                        Have questions? Contact the DBU maintenance office or submit your inquiry below.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 items-stretch">
                    {/* Map */}
                    <div className="premium-card overflow-hidden min-h-[450px] lg:min-h-auto">
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
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col space-y-6">
                        {/* Location Card */}
                        <div className="glass-card p-8 hover:shadow-2xl transition-all duration-300 group">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/10 border border-primary/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-primary/10">
                                    <MapPin size={24} className="text-primary" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold text-textPrimary mb-2 group-hover:text-primary transition-colors">Location</h4>
                                    <p className="text-textSecondary text-sm leading-relaxed">
                                        Debre Berhan University<br />
                                        Main Campus, Building 4<br />
                                        Debre Berhan, Ethiopia
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Phone Card */}
                        <div className="glass-card p-8 hover:shadow-2xl transition-all duration-300 group">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/10 border border-primary/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-primary/10">
                                    <Phone size={24} className="text-primary" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold text-textPrimary mb-2 group-hover:text-primary transition-colors">Phone</h4>
                                    <p className="text-textSecondary text-sm leading-relaxed">
                                        <a href="tel:+251116815440" className="hover:text-primary transition-colors">+251 11 681 5440</a><br />
                                        <a href="tel:+251911234567" className="hover:text-primary transition-colors">+251 91 123 4567</a><br />
                                        <span className="text-xs text-textSecondary/70">(Emergency)</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Email Card */}
                        <div className="glass-card p-8 hover:shadow-2xl transition-all duration-300 group">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/10 border border-primary/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-primary/10">
                                    <Mail size={24} className="text-primary" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold text-textPrimary mb-2 group-hover:text-primary transition-colors">Email</h4>
                                    <p className="text-textSecondary text-sm leading-relaxed">
                                        <a href="mailto:maintenance@dbu.edu.et" className="hover:text-primary transition-colors">maintenance@dbu.edu.et</a><br />
                                        <a href="mailto:support@dbu.edu.et" className="hover:text-primary transition-colors">support@dbu.edu.et</a>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <button className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2">
                            <Send size={18} />
                            Send a Message
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contacts;
