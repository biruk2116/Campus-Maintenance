import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Award, Zap, ArrowRight, Shield, Users } from 'lucide-react';

// ─── Animation Variants ────────────────────────────────────────────────────
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: 'easeOut' } }
};

const fadeLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

const fadeRight = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } }
};

const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } }
};

// ─── Stat Item ─────────────────────────────────────────────────────────────
const StatItem = ({ value, label, delay }) => (
    <motion.div
        variants={scaleIn}
        custom={delay}
        className="group relative flex flex-col items-center justify-center p-5 rounded-2xl overflow-hidden cursor-default
                   bg-gradient-to-br from-white/5 to-white/0 dark:from-white/4 dark:to-transparent
                   border border-white/10 dark:border-white/8
                   hover:border-cyan-400/40 dark:hover:border-cyan-400/35
                   transition-all duration-500 hover:shadow-[0_8px_32px_rgba(6,182,212,0.2)]"
        whileHover={{ y: -4, scale: 1.04 }}
    >
        {/* Hover glow bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/8 to-blue-600/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

        {/* Pulsing ring on hover */}
        <div className="absolute inset-0 rounded-2xl border border-cyan-400/0 group-hover:border-cyan-400/20 transition-all duration-500 scale-100 group-hover:scale-105" />

        <span
            className="relative z-10 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 leading-none mb-1.5"
            style={{ fontFamily: "'Sora', sans-serif", fontSize: 'clamp(1.9rem, 4vw, 2.6rem)' }}
        >
            {value}
        </span>
        <span
            className="relative z-10 text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center leading-snug"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.62rem', fontWeight: 600 }}
        >
            {label}
        </span>
    </motion.div>
);

// ─── Feature Card ──────────────────────────────────────────────────────────
const FeatureCard = ({ icon: Icon, title, desc, accent }) => (
    <motion.div
        variants={fadeUp}
        whileHover={{ y: -6, scale: 1.02 }}
        className="group relative rounded-2xl p-5 overflow-hidden cursor-default
                   bg-white dark:bg-slate-900/60
                   border border-slate-200/60 dark:border-slate-700/40
                   hover:border-cyan-400/50 dark:hover:border-cyan-500/40
                   shadow-sm hover:shadow-[0_12px_40px_rgba(6,182,212,0.15)]
                   transition-all duration-500"
    >
        {/* Top accent bar */}
        <div className={`absolute top-0 left-6 right-6 h-px bg-gradient-to-r ${accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

        {/* Corner glow */}
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-cyan-400/5 dark:bg-cyan-400/8 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Icon */}
        <div className="relative z-10 w-11 h-11 rounded-xl mb-3.5 flex items-center justify-center
                        bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/40 dark:to-cyan-900/30
                        border border-blue-100 dark:border-blue-800/50
                        group-hover:shadow-[0_4px_16px_rgba(6,182,212,0.3)] group-hover:scale-110
                        transition-all duration-400">
            <Icon size={18} className="text-cyan-500 dark:text-cyan-400" />
        </div>

        <h4
            className="relative z-10 font-bold text-slate-800 dark:text-white mb-1.5 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors duration-300"
            style={{ fontFamily: "'Sora', sans-serif", fontSize: '0.9rem' }}
        >
            {title}
        </h4>
        <p
            className="relative z-10 text-slate-500 dark:text-slate-400 leading-relaxed"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.78rem' }}
        >
            {desc}
        </p>

        {/* Arrow hint */}
        <div className="relative z-10 mt-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1">
            <span className="text-cyan-500 dark:text-cyan-400" style={{ fontSize: '0.7rem', fontFamily: "'Sora', sans-serif", fontWeight: 600 }}>Learn more</span>
            <ArrowRight size={11} className="text-cyan-500 dark:text-cyan-400" />
        </div>
    </motion.div>
);

// ─── AboutUs Component ─────────────────────────────────────────────────────
const AboutUs = () => {
    return (
        <motion.section
            id="about-us"
            className="relative w-full py-20 md:py-28 overflow-hidden bg-slate-50 dark:bg-[#060f22]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
        >
            {/* ── Section background effects ── */}
            {/* Large ambient orbs */}
            <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-blue-500/8 dark:bg-blue-500/12 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-cyan-400/8 dark:bg-cyan-400/10 blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/8 blur-3xl pointer-events-none" />

            {/* Subtle grid */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.025] dark:opacity-[0.04]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(59,130,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,1) 1px, transparent 1px)',
                    backgroundSize: '52px 52px',
                }}
            />

            {/* Top fade */}
            <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-slate-50 dark:from-[#060f22] to-transparent pointer-events-none" />
            {/* Bottom fade */}
            <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-slate-50 dark:from-[#060f22] to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-8">

                {/* ── Section Header ── */}
                <motion.div variants={fadeUp} className="text-center mb-14">

                    {/* Eyebrow pill */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5
                                    bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/20
                                    border border-blue-200/60 dark:border-cyan-700/30
                                    shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                        <span
                            className="text-cyan-600 dark:text-cyan-300 font-semibold uppercase tracking-widest"
                            style={{ fontFamily: "'Sora', sans-serif", fontSize: '0.62rem' }}
                        >
                            Who We Are
                        </span>
                    </div>

                    {/* Headline */}
                    <h2
                        className="font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 leading-tight"
                        style={{ fontFamily: "'Sora', sans-serif", fontSize: 'clamp(1.9rem, 4.5vw, 3rem)' }}
                    >
                        About{' '}
                        <span className="relative inline-block">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-[length:200%_auto]"
                                  style={{ animation: 'aboutShimmer 4s linear infinite' }}>
                                Our Platform
                            </span>
                            {/* Underline decoration */}
                            <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 opacity-60" />
                        </span>
                    </h2>

                    <p
                        className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(0.85rem, 1.5vw, 1rem)', fontWeight: 300 }}
                    >
                        Built to transform how campuses manage, track, and resolve
                        maintenance — faster, smarter, and fully transparent.
                    </p>
                </motion.div>

                {/* ── Main Grid: Mission + Stats ── */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-6">

                    {/* Mission card — spans 3 cols */}
                    <motion.div
                        variants={fadeLeft}
                        className="lg:col-span-3 relative rounded-3xl overflow-hidden
                                   bg-white dark:bg-slate-900/70
                                   border border-slate-200/60 dark:border-slate-700/40
                                   shadow-md hover:shadow-[0_16px_48px_rgba(6,182,212,0.12)]
                                   transition-shadow duration-500 group"
                    >
                        {/* Card top accent gradient bar */}
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 bg-[length:200%_auto]"
                             style={{ animation: 'aboutShimmer 3s linear infinite' }} />

                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none"
                             style={{
                                 backgroundImage: 'radial-gradient(circle, rgba(59,130,246,1) 1px, transparent 1px)',
                                 backgroundSize: '20px 20px',
                             }} />

                        {/* Corner glow */}
                        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-cyan-400/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="relative z-10 p-7 md:p-9">
                            {/* Card header */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                                                bg-gradient-to-br from-blue-500 to-cyan-500
                                                shadow-[0_4px_16px_rgba(6,182,212,0.4)]">
                                    <Building2 size={18} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5"
                                       style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.6rem', fontWeight: 600 }}>
                                        Our Purpose
                                    </p>
                                    <h3
                                        className="font-bold text-slate-800 dark:text-white leading-none"
                                        style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.15rem' }}
                                    >
                                        Our Mission
                                    </h3>
                                </div>
                            </div>

                            {/* Paragraphs with left accent */}
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="w-0.5 rounded-full bg-gradient-to-b from-blue-500 to-cyan-400 shrink-0 self-stretch opacity-70" />
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed"
                                       style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(0.8rem, 1.3vw, 0.92rem)', fontWeight: 300 }}>
                                        The Campus Maintenance System is built to eliminate delays, miscommunication,
                                        and untracked maintenance requests across campus. We believe every facility
                                        issue deserves transparency and accountability.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-0.5 rounded-full bg-gradient-to-b from-cyan-400 to-indigo-500 shrink-0 self-stretch opacity-70" />
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed"
                                       style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(0.8rem, 1.3vw, 0.92rem)', fontWeight: 300 }}>
                                        We provide a centralized platform where students and staff can report issues
                                        instantly, while administrators manage, prioritize, and resolve them
                                        efficiently — keeping every request visible and on time.
                                    </p>
                                </div>
                            </div>

                            {/* DBU badge */}
                            <div className="mt-7 inline-flex items-center gap-2 px-4 py-2 rounded-xl
                                            bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/25 dark:to-cyan-900/15
                                            border border-blue-200/50 dark:border-blue-800/40">
                                <Shield size={13} className="text-blue-500 dark:text-blue-400 shrink-0" />
                                <span className="text-slate-600 dark:text-slate-300"
                                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.72rem', fontWeight: 500 }}>
                                    Official DBU Campus Infrastructure Tool
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats card — spans 2 cols */}
                    <motion.div
                        variants={fadeRight}
                        className="lg:col-span-2 relative rounded-3xl overflow-hidden
                                   border border-slate-200/60 dark:border-slate-700/40"
                        style={{
                            background: 'linear-gradient(135deg, #0f1f3d 0%, #061020 40%, #0a1628 100%)',
                        }}
                    >
                        {/* Stars pattern */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            {[...Array(18)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute rounded-full bg-white"
                                    style={{
                                        width: `${0.5 + (i % 3) * 0.4}px`,
                                        height: `${0.5 + (i % 3) * 0.4}px`,
                                        top: `${5 + (i * 13) % 88}%`,
                                        left: `${8 + (i * 17) % 85}%`,
                                        opacity: 0.15 + (i % 4) * 0.1,
                                        animation: `pulse ${2.5 + (i % 3)}s ease-in-out infinite`,
                                        animationDelay: `${i * 0.3}s`,
                                    }}
                                />
                            ))}
                        </div>

                        {/* Glow orbs inside */}
                        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-36 h-36 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />

                        <div className="relative z-10 p-6 md:p-7 h-full flex flex-col">
                            {/* Card label */}
                            <div className="flex items-center gap-2 mb-6">
                                <Users size={14} className="text-cyan-400 shrink-0" />
                                <span className="text-cyan-400/70 uppercase tracking-widest"
                                      style={{ fontFamily: "'Sora', sans-serif", fontSize: '0.6rem', fontWeight: 600 }}>
                                    Platform Numbers
                                </span>
                            </div>

                            {/* Stats */}
                            <motion.div
                                variants={stagger}
                                className="grid grid-cols-1 gap-3 flex-1"
                            >
                                <StatItem value="2K+" label="Issues Resolved" />
                                <StatItem value="500+" label="Active Users" />
                                <StatItem value="98%" label="Satisfaction Rate" />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* ── Feature Cards Row ── */}
                <motion.div
                    variants={stagger}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                    <FeatureCard
                        icon={Zap}
                        title="Instant Reporting"
                        desc="Submit maintenance requests in seconds from any device, anytime across campus."
                        accent="from-transparent via-cyan-400/60 to-transparent"
                    />
                    <FeatureCard
                        icon={Award}
                        title="Quality Assurance"
                        desc="Every request is tracked, prioritized, and resolved with full accountability."
                        accent="from-transparent via-blue-400/60 to-transparent"
                    />
                    <FeatureCard
                        icon={Building2}
                        title="Campus-Wide"
                        desc="Serves all facilities, departments, and maintenance teams under one roof."
                        accent="from-transparent via-indigo-400/60 to-transparent"
                    />
                </motion.div>
            </div>

            {/* Shimmer keyframe */}
            <style>{`
                @keyframes aboutShimmer {
                    0%   { background-position: -200% center; }
                    100% { background-position:  200% center; }
                }
            `}</style>
        </motion.section>
    );

    
};

export default AboutUs;