import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scale, Heart, PenTool, BookOpen, AlertTriangle } from 'lucide-react';

export const TermsConditions: React.FC = () => {
  useEffect(() => {
    document.title = 'Terms & Conditions | GenzVerse';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Understand GenzVerse Terms of Service. Learn about content copyright ownership, creator licensing, community code of conduct, and platform moderation rules.');
    }
  }, []);

  const sections = [
    {
      icon: <PenTool className="h-5 w-5 text-indigo-500" />,
      title: '1. Content Copyright & Ownership',
      desc: 'You retain full copyright and ownership of any blog, code snippets, thumbnails, and comments you publish on GenzVerse. By publishing, you grant GenzVerse a non-exclusive, worldwide, royalty-free license to render and display your content to other users.',
    },
    {
      icon: <Heart className="h-5 w-5 text-pink-500" />,
      title: '2. Community Conduct & Content Moderation',
      desc: 'We are committed to maintaining a constructive, positive environment for developers. Hate speech, targeted harassment, spam, and plagiarized publications are strictly forbidden. Admin accounts reserve full authority to flag and delete violating blogs or comments.',
    },
    {
      icon: <Scale className="h-5 w-5 text-purple-500" />,
      title: '3. Platform Availability & Disclaimers',
      desc: 'GenzVerse services, feeds, and analytics dashboards are provided on an "as-is" basis. We make no guarantees of continuous uptime or data persistence. Creators are recommended to maintain backups of their tutorial drafts elsewhere.',
    },
    {
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      title: '4. Liability Restrictions',
      desc: 'To the maximum extent permitted by law, GenzVerse and its developers will not be liable for any data loss, security breaches, or system errors occurring from using platform tools or cloud databases.',
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
          <BookOpen className="h-3.5 w-3.5" />
          <span>Legal Center</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100">
          Terms &{' '}
          <span className="bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 bg-clip-text text-transparent">
            Conditions
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
        By creating an account, publishing blogs, or commenting on GenzVerse, you agree to comply with our platform terms of service. Please review the policies below carefully.
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
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-455 leading-relaxed pl-1">
              {sec.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Outro */}
      <p className="text-[11px] text-center text-slate-400 py-4 leading-normal max-w-md mx-auto">
        Failure to comply with GenzVerse terms may lead to account suspension or restriction. For general queries regarding copyright issues, see <a href="/contact" className="text-indigo-500 hover:underline">Contact</a>.
      </p>
    </div>
  );
};

export default TermsConditions;
