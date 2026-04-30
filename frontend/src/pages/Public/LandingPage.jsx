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
        <section id="home" className="relative min-h-screen flex items-center pt-24 pb-12 px-6">
          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-2xl">
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
                <Building2 size={14} />
                Debre Berhan University
              </motion.div>
              
              <motion.h1 variants={fadeInUp} className="text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-slate-900 dark:text-white">
                Campus Issue <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 dark:from-blue-400 dark:to-cyan-500">
                  Reporting & Tracking
                </span>
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="text-xl font-medium text-slate-700 dark:text-slate-300 mb-2">
                Faster fixes, no ignored requests.
              </motion.p>
              
              <motion.p variants={fadeInUp} className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-10 max-w-xl">
                A unified system designed specifically for the DBU community to ensure a safe and fully functional academic environment.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4">
                <button onClick={() => navigate('/login')} className="px-8 py-4 rounded-xl bg-sky-500 text-white font-bold hover:scale-105 hover:shadow-xl hover:shadow-sky-500/30 transition-all duration-300 flex items-center gap-2 group">
                  Report / Track 
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
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10">
                <img src={HeroImg} alt="DBU Campus Maintenance" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/10 to-transparent pointer-events-none"></div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2. ABOUT US SECTION (#impact) */}
        <section id="impact" className="py-24 px-6 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-white/5 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sky-500/5 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }} 
                 whileInView={{ opacity: 1, scale: 1 }} 
                 viewport={{ once: true }} 
                 className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-sky-100 dark:bg-sky-500/20 mb-6 shadow-xl shadow-sky-500/10"
              >
                 <Building2 size={36} className="text-sky-500" />
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8 text-slate-900 dark:text-white">About Us</h2>
            </div>
            
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={stagger}
              className="bg-slate-50 dark:bg-slate-800/80 backdrop-blur-xl p-10 md:p-16 rounded-[3rem] shadow-2xl border border-slate-200 dark:border-white/10 text-center relative overflow-hidden"
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
        <section id="services" className="py-24 px-6 bg-slate-50 dark:bg-slate-800/50 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">Services</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">Everything you need to manage and resolve campus issues efficiently.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col group"
                >
                  <div className="h-48 w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                     <img src={service.img} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 z-10" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>
                  </div>
                  <div className="p-8 flex-1">
                    <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-sky-500 transition-colors">{service.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{service.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. FEATURES SECTION (#roles) */}
        <section id="roles" className="py-24 px-6 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-white/5 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">Features</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">Designed for speed, transparency, and accountability.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  whileHover={{ y: -8 }}
                  className="p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 shadow-lg hover:shadow-2xl hover:shadow-sky-500/10 hover:border-sky-500/30 transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-125 duration-500"></div>
                  
                  <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-700 flex items-center justify-center mb-6 shadow-sm border border-slate-100 dark:border-white/10 relative z-10 group-hover:scale-110 transition-transform">
                    <feature.icon size={26} className="text-sky-500 dark:text-sky-400" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3 relative z-10 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">{feature.title}</h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed relative z-10">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. CONTACTS & MAP SECTION (#footer) */}
        <section id="footer" className="py-24 px-6 relative bg-slate-50 dark:bg-slate-800/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">Contacts</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">Get in touch with the Debre Berhan University maintenance office.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Google Map */}
              <div className="w-full h-[400px] rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-xl">
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
