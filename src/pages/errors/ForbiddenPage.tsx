import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import { ROUTES } from '../../routes/routes';

export const ForbiddenPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Access Denied (403) | GenzVerse';
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <div className="relative">
        <motion.div
          animate={{
            rotate: [0, -3, 3, -3, 0],
          }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="text-8xl sm:text-9xl font-black text-rose-500 dark:text-rose-400 select-none flex justify-center"
        >
          <ShieldAlert className="h-28 w-28 text-rose-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse" />
        </motion.div>
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide">
          403 Forbidden
        </h1>
        <h2 className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-200">
          Access Restricted
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          You do not have administrative credentials to enter this directory or route. Contact admin hub if you think this is a mistake.
        </p>
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

export default ForbiddenPage;
