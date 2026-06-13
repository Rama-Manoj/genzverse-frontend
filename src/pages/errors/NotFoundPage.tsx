import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { SearchBar } from '../../components/common/SearchBar';
import { ROUTES } from '../../routes/routes';

export const NotFoundPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Page Not Found (404) | GenzVerse';
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      {/* Glitchy visual error rank */}
      <div className="relative">
        <motion.h1
          animate={{
            scale: [1, 1.02, 0.98, 1.01, 1],
            textShadow: [
              '0 0 0px rgba(0,0,0,0)',
              '2px -2px 0px #a855f7, -2px 2px 0px #ec4899',
              '-1px 2px 0px #a855f7, 2px -1px 0px #ec4899',
              '0 0 0px rgba(0,0,0,0)',
            ],
          }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
          className="text-8xl sm:text-9xl font-black tracking-widest text-slate-800 dark:text-slate-100 select-none"
        >
          404
        </motion.h1>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-2xl opacity-10 -z-10 rounded-full" />
      </div>

      <div className="space-y-2 max-w-md">
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
          Lost in the GenzVerse?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          The page you are looking for has been moved, renamed, or swallowed by the algorithm.
        </p>
      </div>

      {/* Embed Search Bar */}
      <div className="w-full max-w-sm border border-slate-205/50 dark:border-slate-800/80 rounded-2xl bg-white/40 dark:bg-slate-900/40 p-2 shadow-sm">
        <SearchBar />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-semibold text-xs shadow transition hover:scale-102"
        >
          <Home className="h-4 w-4" />
          <span>Return Home</span>
        </Link>
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-full font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-900 transition hover:scale-102"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Go Back</span>
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
