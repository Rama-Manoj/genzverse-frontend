import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Globe, Sparkles } from 'lucide-react';
import { ROUTES } from '../../routes/routes';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/80 bg-white/70 py-12 pb-28 lg:pb-12 dark:border-slate-800/80 dark:bg-slate-950/70 backdrop-blur-md transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="flex flex-col gap-3">
            <Link to={ROUTES.HOME} className="flex items-center gap-2 font-bold text-lg text-slate-800 dark:text-white hover:opacity-95 transition-opacity">
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-cyan-400 bg-clip-text text-transparent">GenzVerse</span>
              <Sparkles className="h-4 w-4 text-violet-500" />
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
              A premium blogging and social platform designed for next-gen developers and content creators. Share knowledge, track trends, and connect globally.
            </p>
          </div>

          {/* Discovery Column */}
          <div>
            <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">Discovery</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link to={ROUTES.EXPLORE} className="text-xs text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-cyan-400 transition-colors">Explore</Link>
              </li>
              <li>
                <Link to={ROUTES.TRENDING} className="text-xs text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-cyan-400 transition-colors">Trending</Link>
              </li>
              <li>
                <Link to={ROUTES.CATEGORIES} className="text-xs text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-cyan-400 transition-colors">Categories</Link>
              </li>
              <li>
                <Link to={ROUTES.TAGS} className="text-xs text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-cyan-400 transition-colors">Tags</Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">Support</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link to={ROUTES.ABOUT} className="text-xs text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-cyan-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to={ROUTES.CONTACT} className="text-xs text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-cyan-400 transition-colors">Contact Support</Link>
              </li>
              <li>
                <Link to={ROUTES.FAQ} className="text-xs text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-cyan-400 transition-colors">FAQ</Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">Legal</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link to={ROUTES.PRIVACY} className="text-xs text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-cyan-400 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to={ROUTES.TERMS} className="text-xs text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-cyan-400 transition-colors">Terms &amp; Conditions</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200/50 dark:border-slate-800/50 my-6"></div>

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>&copy; {new Date().getFullYear()} GenzVerse. Designed for next-gen developers and content creators.</p>
          <div className="flex gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 transition-colors"
            >
              <Github className="h-3.5 w-3.5" />
              <span>GitHub</span>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-indigo-500 flex items-center gap-1 transition-colors"
            >
              <Linkedin className="h-3.5 w-3.5" />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://site.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-purple-500 flex items-center gap-1 transition-colors"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>Website</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
