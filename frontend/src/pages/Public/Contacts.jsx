import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

const Contacts = () => {
    return (
        <section id="contacts" className="py-16 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-gray-50">Contacts</h2>
                    <p className="text-gray-600 dark:text-slate-400 text-base max-w-2xl mx-auto">Get in touch with the Debre Berhan University maintenance office.</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-slate-300/70 dark:border-slate-700 shadow-md">
                        <iframe
                            title="DBU Location"
                            src="https://maps.google.com/maps?q=Debre%20Berhan%20University&t=&z=16&ie=UTF8&iwloc=&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>

                    <div className="flex flex-col justify-center h-full space-y-8 p-8 lg:p-12 bg-slate-100/92 dark:bg-slate-900/82 backdrop-blur-sm rounded-2xl border border-slate-300/70 dark:border-slate-700 shadow-md">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
                                <MapPin size={24} className="text-blue-600 dark:text-blue-500" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-2">Location</h4>
                                <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                                    Debre Berhan University Main Campus<br />
                                    Maintenance Office, Building 4<br />
                                    Debre Berhan, Ethiopia
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
                                <Phone size={24} className="text-blue-600 dark:text-blue-500" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-2">Phone</h4>
                                <p className="text-gray-600 dark:text-slate-400">
                                    +251 11 681 5440<br />
                                    +251 91 123 4567 (Emergency)
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
                                <Mail size={24} className="text-blue-600 dark:text-blue-500" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-2">Email</h4>
                                <p className="text-gray-600 dark:text-slate-400">
                                    maintenance@dbu.edu.et<br />
                                    support@dbu.edu.et
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contacts;
