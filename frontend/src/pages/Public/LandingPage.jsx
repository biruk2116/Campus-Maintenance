import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Wrench, 
  Shield, 
  Zap, 
  Activity, 
  CheckCircle2, 
  Users, 
  Settings, 
  Smartphone, 
  Clock, 
  BarChart3,
  Star,
  Quote
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('admin');

  const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* BACKGROUND BLOBS */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]"></div>
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-slate-900/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Wrench size={16} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Campus<span className="text-blue-400">Maintain</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <a href="#preview" className="hover:text-white transition-colors">Preview</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Log in</Link>
            <Link to="/login" className="px-4 py-2 text-sm font-medium bg-white text-slate-900 rounded-full hover:bg-slate-200 transition-colors shadow-lg shadow-white/10">Get Started</Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* 1. HERO SECTION */}
        <section className="relative min-h-screen flex items-center pt-20 px-6">
          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial="hidden" 
              animate="visible" 
              variants={stagger}
              className="max-w-2xl"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Version 2.0 is Live
              </motion.div>
              
              <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
                Modernizing Campus <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">
                  Infrastructure
                </span>
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="text-lg text-slate-400 leading-relaxed mb-8 max-w-xl">
                The complete operating system for campus maintenance. Streamline issue reporting, automate technician dispatch, and maintain absolute visibility across all facilities.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4">
                <button onClick={() => navigate('/login')} className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:scale-105 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all duration-300 flex items-center gap-2 group">
                  Start Managing 
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all duration-300">
                  Book Demo
                </button>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative hidden lg:block perspective-1000"
            >
              <div className="relative w-full aspect-square md:aspect-[4/3] rounded-2xl bg-slate-800/50 backdrop-blur-xl border border-white/10 p-6 shadow-2xl flex flex-col gap-4 transform-gpu hover:scale-[1.02] transition-transform duration-500">
                {/* Mock UI Header */}
                <div className="flex items-center gap-2 pb-4 border-b border-white/5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <div className="ml-4 h-6 w-32 bg-white/5 rounded-md"></div>
                </div>
                {/* Mock UI Body */}
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div className="col-span-2 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center"><Activity size={18} className="text-indigo-400" /></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-2.5 w-1/3 bg-slate-300 rounded-full"></div>
                      <div className="h-2 w-1/2 bg-slate-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center"><Shield size={14} className="text-emerald-400" /></div>
                    <div className="h-6 w-12 bg-white rounded-md"></div>
                    <div className="h-2 w-full bg-white/10 rounded-full"></div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center"><Zap size={14} className="text-amber-400" /></div>
                    <div className="h-6 w-12 bg-white rounded-md"></div>
                    <div className="h-2 w-full bg-white/10 rounded-full"></div>
                  </div>
                </div>
                {/* Gradient overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-slate-900/80 via-transparent to-indigo-500/10 pointer-events-none"></div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2. FEATURES SECTION */}
        <section id="features" className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Everything you need to run facilities</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">Powerful primitives that help campus teams resolve issues faster and maintain complete operational awareness.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Smartphone, title: 'Instant Reporting', desc: 'Students log issues in seconds from any device. No apps required.' },
                { icon: Zap, title: 'Smart Dispatch', desc: 'Automatically route requests to the right technical teams based on location and type.' },
                { icon: BarChart3, title: 'Live Analytics', desc: 'Track resolution times, queue health, and staff performance in real-time.' },
                { icon: Shield, title: 'Secure Access', desc: 'Role-based control ensures students, technicians, and admins only see what matters.' },
                { icon: Clock, title: 'Timeline Tracking', desc: 'Every status change and comment is logged for absolute accountability.' },
                { icon: Settings, title: 'Custom Workflows', desc: 'Adapt the system to fit your specific campus buildings and maintenance zones.' },
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                    <feature.icon size={24} className="text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. HOW IT WORKS */}
        <section id="how-it-works" className="py-24 px-6 bg-slate-900/50 border-y border-white/5 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Seamless workflow</h2>
              <p className="text-slate-400 text-lg">From a broken pipe to a resolved ticket in three simple steps.</p>
            </div>

            <div className="relative grid md:grid-cols-3 gap-12">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-500/50 via-indigo-500/50 to-emerald-500/50"></div>

              {[
                { step: '01', title: 'Report', desc: 'Student scans QR code or visits portal to log an issue instantly.', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
                { step: '02', title: 'Assign', desc: 'System alerts the relevant admin who dispatches the nearest technician.', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
                { step: '03', title: 'Resolve', desc: 'Technician updates status live. Student gets notified upon completion.', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' }
              ].map((item, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center text-center">
                  <div className={`w-24 h-24 rounded-full ${item.bg} border backdrop-blur-sm flex items-center justify-center mb-6 shadow-xl`}>
                    <span className={`text-2xl font-black ${item.color}`}>{item.step}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-slate-400 text-sm max-w-[250px]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. ROLE-BASED PREVIEW */}
        <section id="preview" className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Built for every user</h2>
              <p className="text-slate-400 text-lg">Tailored experiences depending on your role in the campus ecosystem.</p>
            </div>

            <div className="flex justify-center gap-4 mb-8">
              {['admin', 'technician', 'student'].map((role) => (
                <button
                  key={role}
                  onClick={() => setActiveTab(role)}
                  className={`px-6 py-2 rounded-full text-sm font-bold capitalize transition-all duration-300 ${
                    activeTab === role 
                      ? 'bg-white text-slate-900 shadow-lg shadow-white/20' 
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {role} View
                </button>
              ))}
            </div>

            <div className="w-full max-w-4xl mx-auto aspect-[16/9] rounded-2xl bg-slate-800/80 border border-white/10 p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
              {/* Fake Browser Chrome */}
              <div className="flex gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                <div className="w-3 h-3 rounded-full bg-slate-600"></div>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full flex flex-col"
                >
                  {activeTab === 'admin' && (
                    <div className="flex-1 grid grid-cols-3 gap-4">
                      <div className="col-span-1 border-r border-white/5 pr-4 space-y-2">
                        <div className="h-4 w-1/2 bg-slate-700 rounded mb-4"></div>
                        <div className="h-8 w-full bg-indigo-500/20 rounded"></div>
                        <div className="h-8 w-full bg-white/5 rounded"></div>
                        <div className="h-8 w-full bg-white/5 rounded"></div>
                      </div>
                      <div className="col-span-2 space-y-4">
                        <div className="flex gap-4">
                          <div className="h-20 flex-1 bg-white/5 rounded-lg border border-white/5"></div>
                          <div className="h-20 flex-1 bg-white/5 rounded-lg border border-white/5"></div>
                        </div>
                        <div className="h-32 w-full bg-white/5 rounded-lg border border-white/5"></div>
                      </div>
                    </div>
                  )}
                  {activeTab === 'technician' && (
                    <div className="flex-1 flex flex-col gap-4">
                       <div className="h-8 w-48 bg-slate-700 rounded mb-2"></div>
                       <div className="h-24 w-full bg-amber-500/10 border border-amber-500/20 rounded-xl"></div>
                       <div className="h-24 w-full bg-white/5 border border-white/5 rounded-xl"></div>
                       <div className="h-24 w-full bg-white/5 border border-white/5 rounded-xl"></div>
                    </div>
                  )}
                  {activeTab === 'student' && (
                    <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full gap-4">
                       <div className="h-10 w-full bg-blue-500/20 rounded-lg"></div>
                       <div className="h-32 w-full bg-white/5 border border-white/5 rounded-lg"></div>
                       <div className="h-10 w-full bg-white/10 rounded-full mt-4"></div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* 5. TESTIMONIAL / TRUST SECTION */}
        <section className="py-24 px-6 relative">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            {[
              { quote: "It completely changed how we handle maintenance. Tickets that used to get lost in paperwork are now resolved in hours.", name: "Dr. Sarah Jenkins", role: "Facility Director" },
              { quote: "The interface is so clean. I can see exactly what my team is working on without having to call anyone.", name: "Michael Chang", role: "Head Technician" }
            ].map((test, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 rounded-2xl bg-white/5 border border-white/10 relative"
              >
                <Quote className="absolute top-6 right-6 text-white/10" size={48} />
                <div className="flex gap-1 mb-6">
                  {[1,2,3,4,5].map(s => <Star key={s} size={16} className="text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-lg text-slate-300 leading-relaxed mb-6 font-medium">"{test.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400"></div>
                  <div>
                    <div className="font-bold">{test.name}</div>
                    <div className="text-sm text-slate-500">{test.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 6. CALL-TO-ACTION SECTION */}
        <section className="py-24 px-6 relative">
          <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-12 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Ready to upgrade your campus?</h2>
              <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">Join modern universities using our platform to maintain excellence across all facilities.</p>
              <button onClick={() => navigate('/login')} className="px-8 py-4 rounded-full bg-white text-indigo-900 font-bold text-lg hover:scale-105 hover:shadow-xl transition-all duration-300">
                Get Started Now
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* 7. FOOTER */}
      <footer className="py-8 px-6 border-t border-white/5 bg-slate-950 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Wrench size={14} className="text-slate-400" />
            <span className="font-semibold text-slate-400">CampusMaintain</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
