import React from 'react';
import Navbar from '../Navbar';
import PublicFooter from './PublicFooter';

const PublicLayout = ({ children, mainClassName = '' }) => {
    return (
        <div className="min-h-screen bg-slate-100 text-gray-900 font-sans overflow-x-hidden selection:bg-blue-600/30 dark:bg-slate-950 dark:text-gray-50">
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.10),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.08),_transparent_30%),linear-gradient(180deg,_rgba(241,245,249,0.98),_rgba(226,232,240,0.95))] dark:bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.10),_transparent_28%),linear-gradient(180deg,_rgba(2,6,23,0.98),_rgba(15,23,42,0.98))]"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] dark:bg-blue-500/10"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px] dark:bg-cyan-400/10"></div>
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
