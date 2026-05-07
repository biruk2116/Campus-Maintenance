import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wrench } from 'lucide-react';

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
        <footer className="bg-white dark:bg-slate-800 pt-20 pb-10 px-6 border-t border-gray-200 dark:border-slate-700 relative z-10 text-gray-600 dark:text-slate-400">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <Wrench className="text-blue-600 dark:text-blue-500" size={24} />
                        <span className="text-xl font-bold text-gray-900 dark:text-gray-50 tracking-tight">Campus Fix</span>
                    </div>
                    <p className="text-sm leading-relaxed mb-6">
                        A modern, centralized platform for reporting and resolving campus maintenance issues instantly and transparently.
                    </p>
                </div>

                <div>
                    <h4 className="text-gray-900 dark:text-gray-50 font-bold mb-6">Quick Links</h4>
                    <ul className="space-y-3 text-sm">
                        {quickLinks.map((link) => (
                            <li key={link.to}>
                                <Link to={link.to} className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="text-gray-900 dark:text-gray-50 font-bold mb-6">Portal</h4>
                    <ul className="space-y-3 text-sm">
                        <li><button onClick={() => navigate('/login')} className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors">Student Login</button></li>
                        <li><button onClick={() => navigate('/login')} className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors">Staff Login</button></li>
                        <li><button onClick={() => navigate('/login')} className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors">Admin Dashboard</button></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto border-t border-gray-200 dark:border-slate-700 pt-8 flex flex-col md:flex-row items-center justify-between text-xs">
                <p>&copy; {new Date().getFullYear()} Debre Berhan University. All rights reserved.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <a href="#" className="hover:text-gray-900 dark:hover:text-gray-50 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-gray-900 dark:hover:text-gray-50 transition-colors">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default PublicFooter;
