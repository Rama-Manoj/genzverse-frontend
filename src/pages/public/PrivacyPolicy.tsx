import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Eye, Lock, FileText, Globe } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    document.title = 'Privacy Policy | GenzVerse';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Review the Privacy Policy for GenzVerse. Find out how we gather, manage, and protect your user account data, credentials, and notification settings.');
    }
  }, []);

  const sections = [
    {
      icon: <Eye className="h-5 w-5 text-indigo-500" />,
      title: '1. Information We Collect',
      desc: 'We collect your username, email address, password hashes, and user settings when you register. If you fill out your creator profile, we store your bio, avatar images, and external social media links (LinkedIn, GitHub, Personal Website).',
    },
    {
      icon: <Lock className="h-5 w-5 text-pink-500" />,
      title: '2. Data Security & Storage',
      desc: 'We use secure password hashes (like Bcrypt) to protect your authentication credentials. GenzVerse services utilize secure cloud databases and static storage APIs to ensure your published content and personal info is isolated and secure.',
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-purple-500" />,
      title: '3. Browser Storage & Cookies',
      desc: 'We use standard LocalStorage mocks to store your local theme configurations (Light vs Dark) and active notification toggle states. These settings remain stored in your local browser cache until cleared.',
    },
    {
      icon: <Globe className="h-5 w-5 text-cyan-500" />,
      title: '4. Public Profile Visibility',
      desc: 'By default, your username, registration month, creator stats, and published blogs are visible to all users browsing GenzVerse. You can adjust visibility settings in your Settings Profile tab at any time.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
          <FileText className="h-3.5 w-3.5" />
          <span>Legal Center</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100">
          Privacy{' '}
          <span className="bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 bg-clip-text text-transparent">
            Policy
          </span>
        </h1>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Last Updated: June 11, 2026
        </p>
      </motion.div>

      {/* Intro text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-l-2 border-indigo-500 pl-4 py-1"
      >
        At GenzVerse, we prioritize creator safety and account sovereignty. This privacy charter lists how we securely manage your registration details, cookies cache, notifications triggers, and platform data.
      </motion.div>

      {/* Grid of Sections */}
      <div className="space-y-5">
        {sections.map((sec, i) => (
          <motion.div
            key={sec.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            className="p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md shadow-sm space-y-2.5"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 h-fit shrink-0">
                {sec.icon}
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-150">
                {sec.title}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-450 leading-relaxed pl-1">
              {sec.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Outro */}
      <p className="text-[11px] text-center text-slate-400 py-4 leading-normal max-w-md mx-auto">
        If you have questions about data deletion, active sessions, or privacy rights, please reach out via <a href="/contact" className="text-indigo-500 hover:underline">Contact Support</a>.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
