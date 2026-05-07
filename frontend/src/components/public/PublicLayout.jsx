import React from 'react';
import Navbar from '../Navbar';
import PublicFooter from './PublicFooter';

const PublicLayout = ({ children, mainClassName = '' }) => {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans overflow-x-hidden selection:bg-blue-600/30 dark:bg-slate-900 dark:text-gray-50">
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/5 blur-[120px] dark:bg-blue-500/10"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/5 blur-[120px] dark:bg-blue-500/10"></div>
            </div>

            <Navbar />

            <main className={`relative z-10 ${mainClassName}`}>
                {children}
            </main>

            <PublicFooter />
        </div>
    );
};

export default PublicLayout;
