import React from 'react';
import Navbar from '../Navbar';
import PublicFooter from './PublicFooter';

const PublicLayout = ({ children, mainClassName = '' }) => {
    return (
        <div className="w-full min-h-screen flex flex-col bg-background text-textPrimary font-sans overflow-x-hidden selection:bg-primary/30 transition-colors duration-500">
            {/* Background gradient layers */}
            <div className="fixed inset-0 -z-20 w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-surface/30 dark:to-surface/20" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-32 left-0 w-[800px] h-[500px] bg-secondary/5 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
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
