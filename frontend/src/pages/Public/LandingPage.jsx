import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Wrench, 
  ShieldCheck, 
  Activity, 
  Users, 
  Smartphone, 
  Clock, 
  BarChart3,
  Building2,
  GraduationCap,
  ClipboardList,
  CheckCircle2,
  ChevronRight,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useAuth();
  const [activeTab, setActiveTab] = useState('student');
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Features', href: '#roles' },
    { name: 'About Us', href: '#impact' },
    { name: 'Contacts', href: '#footer' }
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden selection:bg-indigo-500/30 dark:bg-slate-900 dark:text-slate-50">
      
      {/* BACKGROUND BLOBS */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] dark:bg-indigo-600/20"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px] dark:bg-blue-600/20"></div>
      </div>

      {/* NAVBAR */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 px-6 transition-all duration-300 ${
          isScrolled 
            ? 'py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-200 dark:border-white/10 shadow-sm' 
            : 'py-5 bg-transparent border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/20"
            >
              <GraduationCap size={20} className="text-white" />
            </motion.div>
            <div>
              <span className="font-extrabold text-xl tracking-tight block leading-none">DBU</span>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Maintenance</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-1 bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-full border border-slate-200/50 dark:border-white/5">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href} 
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white rounded-full hover:bg-white dark:hover:bg-slate-700 transition-all duration-300"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
            
            <Link to="/login" className="hidden md:block px-5 py-2.5 text-sm font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 hover:-translate-y-0.5 hover:shadow-indigo-600/30">
              Portal Login
            </Link>

            <button 
              className="md:hidden p-2 text-slate-600 dark:text-slate-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-[72px] left-0 right-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 md:hidden overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-4 py-3 text-base font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="h-px bg-slate-200 dark:bg-white/10 my-2"></div>
              <Link to="/login" className="px-4 py-3 text-base font-bold text-center bg-indigo-600 text-white rounded-xl shadow-md">
                Portal Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10">
        {/* 1. HERO SECTION */}
        <section className="relative min-h-screen flex items-center pt-24 pb-12 px-6">
          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="hidden" 
              animate="visible" 
              variants={stagger}
              className="max-w-2xl"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
                <Building2 size={14} />
                Debre Berhan University
              </motion.div>
              
              <motion.h1 variants={fadeInUp} className="text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-slate-900 dark:text-white">
                Smart Campus <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-purple-500">
                  Maintenance
                </span>
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-10 max-w-xl">
                Report issues, track progress, and keep the campus running smoothly. A unified system designed specifically for the DBU community to ensure a safe and fully functional academic environment.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4">
                <button onClick={() => navigate('/login')} className="px-8 py-4 rounded-xl bg-indigo-600 text-white font-bold hover:scale-105 hover:shadow-xl hover:shadow-indigo-600/30 transition-all duration-300 flex items-center gap-2 group">
                  Report an Issue 
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={() => navigate('/login')} className="px-8 py-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 shadow-sm">
                  Login to Portal
                </button>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative hidden lg:block"
            >
              {/* Academic/Campus Illustration Placeholder */}
              <div className="relative w-full aspect-square rounded-[2rem] bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-800 dark:to-slate-800/50 border border-slate-200 dark:border-white/10 p-8 shadow-2xl flex items-center justify-center">
                
                {/* Abstract DBU Campus Graphic */}
                <div className="relative w-full h-full flex items-center justify-center">
                   {/* Main Building Abstract */}
                   <div className="absolute w-48 h-64 bg-white dark:bg-slate-700 rounded-t-3xl border border-slate-200 dark:border-white/10 shadow-lg flex flex-col justify-end p-4 z-10 bottom-10">
                      <div className="grid grid-cols-3 gap-2 mb-4">
                         {[...Array(12)].map((_, i) => (
                           <div key={i} className={`h-8 rounded-md ${i % 3 === 0 ? 'bg-indigo-500/20 animate-pulse' : 'bg-slate-100 dark:bg-slate-600'}`}></div>
                         ))}
                      </div>
                      <div className="h-12 w-16 mx-auto bg-slate-200 dark:bg-slate-800 rounded-t-lg"></div>
                   </div>
                   
                   {/* Tech/Maintenance Abstract Floating Element */}
                   <motion.div 
                     animate={{ y: [0, -15, 0] }}
                     transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                     className="absolute -right-8 top-16 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 z-20 flex items-center gap-3"
                   >
                     <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                       <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400" />
                     </div>
                     <div>
                       <div className="h-2 w-16 bg-slate-200 dark:bg-slate-600 rounded-full mb-2"></div>
                       <div className="h-2 w-24 bg-slate-100 dark:bg-slate-700 rounded-full"></div>
                     </div>
                   </motion.div>

                   {/* Student Request Floating Element */}
                   <motion.div 
                     animate={{ y: [0, 15, 0] }}
                     transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                     className="absolute -left-8 bottom-32 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 z-20 flex items-center gap-3"
                   >
                     <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center">
                       <Wrench size={20} className="text-amber-600 dark:text-amber-400" />
                     </div>
                     <div>
                       <div className="h-2 w-20 bg-slate-200 dark:bg-slate-600 rounded-full mb-2"></div>
                       <div className="h-2 w-12 bg-slate-100 dark:bg-slate-700 rounded-full"></div>
                     </div>
                   </motion.div>

                   {/* Background Elements */}
                   <div className="absolute w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2. SERVICES / FEATURES SECTION */}
        <section id="services" className="py-24 px-6 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-white/5 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">Core Campus Services</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">Practical tools designed to solve real operational challenges within the university infrastructure.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Smartphone, title: 'Report Maintenance', desc: 'Submit dorm or facility issues quickly from your phone.', color: 'blue' },
                { icon: Activity, title: 'Track Status', desc: 'Real-time updates from "Pending" to "Resolved".', color: 'indigo' },
                { icon: ClipboardList, title: 'Task Management', desc: 'Technicians receive clear, prioritized digital work orders.', color: 'emerald' },
                { icon: BarChart3, title: 'Admin Dashboard', desc: 'Monitor campus-wide issues and dispatch staff efficiently.', color: 'purple' },
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200 dark:hover:shadow-indigo-500/10 transition-all duration-300"
                >
                  <div className={`w-14 h-14 rounded-xl bg-${feature.color}-100 dark:bg-${feature.color}-500/20 flex items-center justify-center mb-6`}>
                    <feature.icon size={28} className={`text-${feature.color}-600 dark:text-${feature.color}-400`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. HOW IT WORKS */}
        <section id="how-it-works" className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">How the System Works</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">A clear, accountable workflow for every maintenance request.</p>
            </div>

            <div className="relative grid md:grid-cols-4 gap-8 md:gap-4">
              {/* Desktop Connecting Line */}
              <div className="hidden md:block absolute top-10 left-[12%] right-[12%] h-1 bg-slate-200 dark:bg-white/10 z-0 rounded-full"></div>

              {[
                { step: '1', title: 'Submit', desc: 'Student reports an issue', icon: Smartphone },
                { step: '2', title: 'Review', desc: 'Admin assigns task', icon: Users },
                { step: '3', title: 'Resolve', desc: 'Technician fixes issue', icon: Wrench },
                { step: '4', title: 'Update', desc: 'Status marked complete', icon: CheckCircle2 }
              ].map((item, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-800 border-4 border-slate-50 dark:border-slate-900 shadow-xl flex items-center justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-500/20 flex items-center justify-center">
                      <item.icon size={24} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm mb-4 border-2 border-white dark:border-slate-900 -mt-10 z-20">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm px-4">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. ROLE-BASED ACCESS SECTION */}
        <section id="roles" className="py-24 px-6 bg-slate-50 dark:bg-slate-800/50 border-y border-slate-200 dark:border-white/5 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">Role-Based Portals</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">Secure, focused interfaces for every member of the DBU community.</p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {[
                { id: 'student', label: 'Students', icon: GraduationCap },
                { id: 'technician', label: 'Technicians', icon: Wrench },
                { id: 'admin', label: 'Administrators', icon: ShieldCheck }
              ].map((role) => (
                <button
                  key={role.id}
                  onClick={() => setActiveTab(role.id)}
                  className={`px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all duration-300 ${
                    activeTab === role.id 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <role.icon size={18} />
                  {role.label}
                </button>
              ))}
            </div>

            <div className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 p-8 shadow-xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === 'student' && (
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div>
                        <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Student Portal</h3>
                        <ul className="space-y-4">
                          {['Submit maintenance requests instantly', 'Attach photos of the issue', 'Track resolution status live', 'View history of reported issues'].map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                              <span className="text-slate-600 dark:text-slate-300">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-white/5">
                        {/* Mock Student Form */}
                        <div className="space-y-4">
                          <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-700 rounded"></div>
                          <div className="h-10 w-full bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-white/5"></div>
                          <div className="h-24 w-full bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-white/5"></div>
                          <div className="h-10 w-1/2 bg-indigo-500/20 rounded-lg"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'technician' && (
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div>
                        <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Technician Portal</h3>
                        <ul className="space-y-4">
                          {['Receive assigned work orders', 'Filter tasks by building and urgency', 'Update status (In Progress, Resolved)', 'Add completion notes'].map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                              <span className="text-slate-600 dark:text-slate-300">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-white/5">
                        {/* Mock Technician List */}
                        <div className="space-y-3">
                          {[1,2,3].map(i => (
                            <div key={i} className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-white/5 flex justify-between items-center">
                              <div className="space-y-2">
                                <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                <div className="h-2 w-20 bg-slate-100 dark:bg-slate-800 rounded"></div>
                              </div>
                              <div className="h-6 w-16 bg-amber-100 dark:bg-amber-500/20 rounded-full"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'admin' && (
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div>
                        <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Admin Dashboard</h3>
                        <ul className="space-y-4">
                          {['Monitor all campus requests', 'Assign tasks to specific technicians', 'Manage user accounts and roles', 'Generate facility reports'].map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                              <span className="text-slate-600 dark:text-slate-300">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-white/5">
                        {/* Mock Admin Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                           <div className="h-20 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-white/5"></div>
                           <div className="h-20 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-white/5"></div>
                        </div>
                        <div className="h-32 w-full bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-white/5"></div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* 5. CAMPUS IMPACT SECTION */}
        <section id="impact" className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6 text-slate-900 dark:text-white">Improving Campus Life</h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed">
                  By digitizing maintenance operations, DBU ensures a safer, cleaner, and more functional environment for all students and staff.
                </p>
                <div className="space-y-6">
                  {[
                    { title: "Faster Resolution", desc: "Automated routing cuts response times significantly." },
                    { title: "Better Communication", desc: "No more guessing. Status updates are visible to everyone." },
                    { title: "Operational Insight", desc: "Data helps administration allocate resources effectively." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center shrink-0">
                        <Activity size={20} className="text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{item.title}</h4>
                        <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                   <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-white/5 text-center">
                      <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400 mb-2">24h</div>
                      <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Avg Response</div>
                   </div>
                   <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-3xl shadow-xl text-center text-white">
                      <div className="text-4xl font-black mb-2">100%</div>
                      <div className="text-sm font-bold text-indigo-200 uppercase tracking-wider">Digital Flow</div>
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="bg-slate-900 dark:bg-slate-950 p-8 rounded-3xl shadow-xl text-center text-white">
                      <div className="text-4xl font-black mb-2">3</div>
                      <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">User Portals</div>
                   </div>
                   <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-white/5 text-center">
                      <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400 mb-2">24/7</div>
                      <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Availability</div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. FINAL CTA */}
        <section className="py-24 px-6 relative">
          <div className="max-w-5xl mx-auto rounded-[3rem] bg-indigo-900 p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-800 to-blue-900"></div>
            {/* Geometric accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-white">Keep DBU running efficiently</h2>
              <p className="text-indigo-200 text-xl mb-10 max-w-2xl mx-auto">Experience the unified system for campus maintenance.</p>
              <button onClick={() => navigate('/login')} className="px-10 py-5 rounded-2xl bg-white text-indigo-900 font-extrabold text-lg hover:scale-105 hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto group">
                Get Started Now
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* 7. FOOTER */}
      <footer id="footer" className="py-12 px-6 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Building2 size={16} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white block leading-none">Debre Berhan University</span>
              <span className="text-xs text-slate-500">Campus Maintenance System</span>
            </div>
          </div>
          
          <div className="flex gap-8 text-sm font-semibold text-slate-600 dark:text-slate-400">
            <Link to="/login" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Login</Link>
            <a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Help</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
