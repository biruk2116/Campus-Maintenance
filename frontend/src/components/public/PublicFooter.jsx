import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wrench, ArrowRight } from 'lucide-react';

const quickLinks = [
    { to: '/home', label: 'Home' },
    { to: '/about-us', label: 'About Us' },
    { to: '/services', label: 'Services' },
    { to: '/features', label: 'Features' },
    { to: '/contacts', label: 'Contacts' }
];

const PublicFooter = () => {
    const navigate = useNavigate();

    return (
        <footer className="relative w-full z-10 border-t border-overlay/10 backdrop-blur-sm">
            {/* Gradient background */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-surface/30 via-background to-background" />
            
            <div className="w-full px-4 md:px-6 py-16 md:py-24">
                {/* Main Footer Content */}
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16 mb-12">
                        {/* Brand Section */}
                        <div className="col-span-1">
                            <div className="flex items-center gap-3 mb-6 group">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-xl transition-all">
                                    <Wrench className="text-white" size={24} />
                                </div>
                                <div>
                                    <span className="text-lg font-bold text-textPrimary block">Campus Fix</span>
                                    <span className="text-xs text-textSecondary font-semibold">DBU Maintenance</span>
                                </div>
                            </div>
                            <p className="text-sm text-textSecondary leading-relaxed mb-6">
                                A modern platform for reporting and managing campus maintenance instantly and transparently.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="font-bold text-textPrimary mb-6 text-sm uppercase tracking-wider">Navigation</h4>
                            <ul className="space-y-3">
                                {quickLinks.map((link) => (
                                    <li key={link.to}>
                                        <Link 
                                            to={link.to} 
                                            className="text-sm text-textSecondary hover:text-primary transition-colors duration-300 inline-flex items-center gap-2 group"
                                        >
                                            <span className="inline-block w-0 group-hover:w-4 transition-all duration-300 opacity-0 group-hover:opacity-100">
                                                <ArrowRight size={12} />
                                            </span>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Portal Links */}
                        <div>
                            <h4 className="font-bold text-textPrimary mb-6 text-sm uppercase tracking-wider">Portal</h4>
                            <ul className="space-y-3">
                                <li>
                                    <button 
                                        onClick={() => navigate('/login')}
                                        className="text-sm text-textSecondary hover:text-primary transition-colors duration-300 inline-flex items-center gap-2 group"
                                    >
                                        <span className="inline-block w-0 group-hover:w-4 transition-all duration-300 opacity-0 group-hover:opacity-100">
                                            <ArrowRight size={12} />
                                        </span>
                                        Student Login
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        onClick={() => navigate('/login')}
                                        className="text-sm text-textSecondary hover:text-primary transition-colors duration-300 inline-flex items-center gap-2 group"
                                    >
                                        <span className="inline-block w-0 group-hover:w-4 transition-all duration-300 opacity-0 group-hover:opacity-100">
                                            <ArrowRight size={12} />
                                        </span>
                                        Staff Login
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        onClick={() => navigate('/login')}
                                        className="text-sm text-textSecondary hover:text-primary transition-colors duration-300 inline-flex items-center gap-2 group"
                                    >
                                        <span className="inline-block w-0 group-hover:w-4 transition-all duration-300 opacity-0 group-hover:opacity-100">
                                            <ArrowRight size={12} />
                                        </span>
                                        Dashboard
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col">
                            <h4 className="font-bold text-textPrimary mb-6 text-sm uppercase tracking-wider">Get Started</h4>
                            <button 
                                onClick={() => navigate('/login')}
                                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 w-full"
                            >
                                Report Issue
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-overlay/10 pt-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <p className="text-xs text-textSecondary">&copy; {new Date().getFullYear()} Debre Berhan University. All rights reserved.</p>
                            <div className="flex gap-8">
                                <a href="#" className="text-xs text-textSecondary hover:text-primary transition-colors duration-300">Privacy Policy</a>
                                <a href="#" className="text-xs text-textSecondary hover:text-primary transition-colors duration-300">Terms of Service</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default PublicFooter;
