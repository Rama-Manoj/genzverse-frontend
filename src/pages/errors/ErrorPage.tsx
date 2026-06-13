import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { ROUTES } from '../../routes/routes';

export const ErrorPage: React.FC = () => {
  useEffect(() => {
    document.title = 'System Error | GenzVerse';
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <div className="relative">
        <motion.div
          animate={{
            y: [0, -4, 0],
          }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="text-8xl sm:text-9xl font-black text-amber-500 select-none flex justify-center"
        >
          <AlertTriangle className="h-24 w-24 text-amber-500 drop-shadow-[0_0_12px_rgba(245,158,11,0.25)] animate-pulse" />
        </motion.div>
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide">
          System Error
        </h1>
        <h2 className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-200">
          Something went wrong
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          The server encountered an unexpected glitch or database network connection timeout. Try refreshing the view.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-semibold text-xs shadow transition hover:scale-102"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh View</span>
        </button>
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-full font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-900 transition hover:scale-102"
        >
          <Home className="h-4 w-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
