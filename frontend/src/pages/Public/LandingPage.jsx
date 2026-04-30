import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowRight, Wrench, ShieldCheck, Activity, Smartphone, 
  BarChart3, Building2, BellRing, AlertCircle, MapPin, Phone, Mail, CheckCircle2, ChevronRight
} from 'lucide-react';
import Navbar from '../../components/Navbar';

// Images
import HeroImg from '../../assets/images/maint_hero.png';
import FeatureImg from '../../assets/images/tech_pc.png';
import FireEmergencyImg from '../../assets/images/fire_emergency.png';
import LockDetailImg from '../../assets/images/lock_detail.png';
import SafetyKitImg from '../../assets/images/safety_kit.png';

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const el = document.querySelector(location.hash);
        if (el) {
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - 65;
          window.scrollTo({ top: Math.max(offsetPosition, 0), behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.hash]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden selection:bg-sky-400/30 dark:bg-slate-900 dark:text-slate-50">
      
      {/* BACKGROUND BLOBS */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] dark:bg-sky-500/20"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px] dark:bg-blue-600/20"></div>
      </div>

      <Navbar />

      <main className="relative z-10">
        
        {/* 1. HERO SECTION (#home) */}
        <section id="home" className="relative min-h-[80vh] flex items-center pt-16 pb-8 px-6 overflow-hidden">
          {/* Subtle animated background shapes */}
          <div className="absolute top-20 right-10 w-[400px] h-[400px] bg-gradient-to-br from-emerald-400/10 to-sky-400/10 rounded-full blur-[80px] -z-10 animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-gradient-to-tr from-blue-500/10 to-cyan-300/10 rounded-full blur-[100px] -z-10"></div>

          <div className="max-w-5xl mx-auto w-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
            <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-xl">
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold tracking-wide mb-6 shadow-sm">
                <CheckCircle2 size={14} className="text-emerald-500" />
                Trusted by DBU Students & Staff
              </motion.div>
              
              <motion.h1 variants={fadeInUp} className="text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] mb-4 text-slate-900 dark:text-white">
                Fast, Transparent <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-500">
                  Maintenance.
                </span>
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8 font-medium">
                Report issues instantly. Track progress in real-time. Keep the university infrastructure running flawlessly.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-3">
                <button onClick={() => navigate('/login')} className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(14,165,233,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group">
                  Report Issue 
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={() => navigate('/login')} className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-lg hover:border-sky-500 dark:hover:border-sky-400 hover:text-sky-600 dark:hover:text-sky-400 transition-all duration-300 shadow-sm flex items-center justify-center gap-2 group">
                  <Activity size={20} className="text-slate-400 group-hover:text-sky-500 transition-colors" />
                  Track Request
                </button>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 50 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full rounded-[2.5rem] bg-white dark:bg-slate-800/50 p-4 border border-slate-200/50 dark:border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl">
                <div className="rounded-[2rem] overflow-hidden relative">
                  <img src={HeroImg} alt="Maintenance Dashboard UI" className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/10 to-emerald-500/10 pointer-events-none mix-blend-overlay"></div>
                </div>
                
                {/* Floating UI Elements for depth */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="absolute -bottom-6 -left-8 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 size={24} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Issue Resolved</p>
                    <p className="text-xs text-slate-500">Just now</p>
                  </div>
                </motion.div>
                
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2. ABOUT US SECTION (#impact) */}
        <section id="impact" className="py-8 px-6 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-white/5 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center mb-8">
              <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }} 
                 whileInView={{ opacity: 1, scale: 1 }} 
                 viewport={{ once: true }} 
                 className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-sky-100 dark:bg-sky-500/20 mb-3 shadow-md shadow-sky-500/10"
              >
                 <Building2 size={24} className="text-sky-500" />
              </motion.div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">About Us</h2>
            </div>
            
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={stagger}
              className="bg-slate-50 dark:bg-slate-800/80 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] shadow-xl border border-slate-200 dark:border-white/10 text-center relative overflow-hidden"
            >
               {/* Accent line */}
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-2 bg-gradient-to-r from-sky-400 to-blue-600 rounded-b-full"></div>
               
               <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-slate-800 dark:text-white leading-relaxed font-bold mb-8">
                  Campus Maintenance System is built to eliminate delays, miscommunication, and untracked maintenance requests across campus.
               </motion.p>
               
               <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                  It provides a centralized platform where students and staff can report issues instantly, while administrators manage, prioritize, and resolve them efficiently. By combining real-time tracking with transparent workflows, the system ensures that every request is visible, accountable, and handled on time.
               </motion.p>
            </motion.div>
          </div>
        </section>

        {/* 3. SERVICES SECTION (#services) */}
        <section id="services" className="py-8 px-6 bg-slate-50 dark:bg-slate-800/50 relative">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-white">Services</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl mx-auto">Everything you need to manage and resolve campus issues efficiently.</p>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { img: FireEmergencyImg, title: 'Submit Requests', desc: 'Easily submit maintenance requests from any device.' },
                { img: LockDetailImg, title: 'Monitor Progress', desc: 'Track your request status in real-time.' },
                { img: HeroImg, title: 'Request Repairs', desc: 'Log different types of facility and equipment repairs.' },
                { img: SafetyKitImg, title: 'Assign & Resolve', desc: 'Administrators easily assign tasks to technicians.' },
                { img: FeatureImg, title: 'Generate Reports', desc: 'Comprehensive data reports for administrative oversight.' },
              ].map((service, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group"
                >
                  <div className="h-28 w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                     <img src={service.img} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 z-10" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>
                  </div>
                  <div className="p-4 flex-1">
                    <h3 className="text-sm font-bold mb-1 text-slate-900 dark:text-white group-hover:text-sky-500 transition-colors">{service.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{service.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. FEATURES SECTION (#roles) */}
        <section id="roles" className="py-8 px-6 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-white/5 relative">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-white">Features</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl mx-auto">Designed for speed, transparency, and accountability.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Smartphone, title: 'Report instantly', desc: 'Log a ticket in seconds without paperwork.' },
                { icon: Activity, title: 'Real-time tracking', desc: 'Know exactly when your issue will be fixed.' },
                { icon: ShieldCheck, title: 'Admin efficiency', desc: 'Central dashboard to dispatch personnel.' },
                { icon: AlertCircle, title: 'Priority handling', desc: 'Critical emergencies get immediate attention.' },
                { icon: BellRing, title: 'Live Notifications', desc: 'Get alerted when your ticket status changes.' },
                { icon: BarChart3, title: 'Data insights', desc: 'Analyze trends to prevent future breakdowns.' },
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
                  whileHover={{ y: -4 }}
                  className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 shadow-md hover:shadow-lg hover:shadow-sky-500/10 hover:border-sky-500/30 transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-125 duration-500"></div>
                  
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center mb-4 shadow-sm border border-slate-100 dark:border-white/10 relative z-10 group-hover:scale-110 transition-transform">
                    <feature.icon size={20} className="text-sky-500 dark:text-sky-400" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 relative z-10 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">{feature.title}</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed relative z-10">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. CONTACTS & MAP SECTION (#footer) */}
        <section id="footer" className="py-8 px-6 relative bg-slate-50 dark:bg-slate-800/50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-white">Contacts</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl mx-auto">Get in touch with the Debre Berhan University maintenance office.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 items-start">
              {/* Google Map */}
              <div className="w-full h-[250px] rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-md">
                 <iframe 
                    title="DBU Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3923.630560831613!2d39.52735741065798!3d10.450797365074213!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1646ffb28e51b147%3A0xc6c7b0d771bc7339!2sDebre%20Berhan%20University!5e0!3m2!1sen!2set!4v1700000000000!5m2!1sen!2set" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                 ></iframe>
              </div>

              {/* Contact Information */}
              <div className="flex flex-col justify-center h-full space-y-8 p-8 lg:p-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 shadow-lg">
                <div className="flex items-start gap-4">
                   <div className="w-12 h-12 rounded-full bg-sky-100 dark:bg-sky-500/20 flex items-center justify-center shrink-0">
                      <MapPin size={24} className="text-sky-600 dark:text-sky-400" />
                   </div>
                   <div>
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Location</h4>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                         Debre Berhan University Main Campus<br/>
                         Maintenance Office, Building 4<br/>
                         Debre Berhan, Ethiopia
                      </p>
                   </div>
                </div>

                <div className="flex items-start gap-4">
                   <div className="w-12 h-12 rounded-full bg-sky-100 dark:bg-sky-500/20 flex items-center justify-center shrink-0">
                      <Phone size={24} className="text-sky-600 dark:text-sky-400" />
                   </div>
                   <div>
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Phone</h4>
                      <p className="text-slate-600 dark:text-slate-400">
                         +251 11 681 5440<br/>
                         +251 91 123 4567 (Emergency)
                      </p>
                   </div>
                </div>

                <div className="flex items-start gap-4">
                   <div className="w-12 h-12 rounded-full bg-sky-100 dark:bg-sky-500/20 flex items-center justify-center shrink-0">
                      <Mail size={24} className="text-sky-600 dark:text-sky-400" />
                   </div>
                   <div>
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Email</h4>
                      <p className="text-slate-600 dark:text-slate-400">
                         maintenance@dbu.edu.et<br/>
                         support@dbu.edu.et
                      </p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER BAR */}
      <footer className="py-8 px-6 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950 relative z-10 text-center">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} Debre Berhan University Campus Maintenance System. All rights reserved.
        </p>
      </footer>

    </div>
  );
};

export default LandingPage;
