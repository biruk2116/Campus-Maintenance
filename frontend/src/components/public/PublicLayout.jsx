import React from 'react';
import Navbar from '../Navbar';
import PublicFooter from './PublicFooter';

const PublicLayout = ({ children, mainClassName = '' }) => {
    return (
        <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-textPrimary font-sans overflow-x-hidden selection:bg-primary/30 transition-colors duration-500">
            {/* Background gradient layers */}
            <div className="fixed inset-0 -z-20 w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-slate-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-400/8 dark:bg-blue-500/15 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-32 left-0 w-[800px] h-[500px] bg-cyan-400/6 dark:bg-cyan-500/12 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
            </div>

            <Navbar />

            <main className={`relative z-10 w-full flex-1 ${mainClassName}`}>
                {children}
            </main>

            <PublicFooter />
        </div>
    );
};

export default PublicLayout;
