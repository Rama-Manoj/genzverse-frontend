import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../store/AuthContext';
import { ROUTES } from '../../routes/routes';
import { BookOpen, Menu, PenLine } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { NotificationBell } from './NotificationBell';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';

interface NavbarProps {
  onToggleMobileMenu: () => void;
}

const MotionLink = motion(Link);

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-white/20 dark:border-white/5 bg-white/45 dark:bg-slate-950/45 backdrop-blur-xl transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo & Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onToggleMobileMenu}
            className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-900 lg:hidden text-slate-500 dark:text-slate-400 transition"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <MotionLink 
            to={ROUTES.HOME} 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 font-black text-2xl tracking-tight bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent"
          >
            <BookOpen className="h-6 w-6 text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
            <span>GenzVerse</span>
          </MotionLink>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 ml-6">
          <Link to={ROUTES.EXPLORE} className="text-xs font-black uppercase tracking-wider text-slate-550 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-pink-450 transition-colors">
            Explore
          </Link>
          <Link to={ROUTES.TRENDING} className="text-xs font-black uppercase tracking-wider text-slate-550 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-pink-450 transition-colors">
            Trending
          </Link>
          <span className="w-px h-4 bg-slate-200 dark:bg-slate-800" />
          <Link to={ROUTES.ABOUT} className="text-xs font-bold uppercase tracking-wider text-slate-450 hover:text-indigo-500 dark:text-slate-500 dark:hover:text-pink-450 transition-colors">
            About
          </Link>
          <Link to={ROUTES.CONTACT} className="text-xs font-bold uppercase tracking-wider text-slate-450 hover:text-indigo-500 dark:text-slate-500 dark:hover:text-pink-450 transition-colors">
            Contact
          </Link>
          <Link to={ROUTES.FAQ} className="text-xs font-bold uppercase tracking-wider text-slate-450 hover:text-indigo-500 dark:text-slate-500 dark:hover:text-pink-450 transition-colors">
            FAQ
          </Link>
        </nav>

        {/* Desktop Search Bar */}
        <div className="hidden md:block flex-1 max-w-md mx-8">
          <SearchBar />
        </div>

        {/* Action icons & user menus */}
        <div className="flex items-center gap-3">
          
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* Write button */}
              <MotionLink
                to={ROUTES.CREATE_BLOG}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(168, 85, 247, 0.35)" }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:flex items-center gap-1.5 px-4.5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-black shadow-lg shadow-purple-500/20"
              >
                <PenLine className="h-3.5 w-3.5" />
                Write
              </MotionLink>
              <NotificationBell />
              <UserMenu />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to={ROUTES.LOGIN}
                className="hidden sm:inline-block px-4 py-2 text-sm font-semibold rounded-full hover:bg-white/20 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-355 transition-colors"
              >
                Log in
              </Link>
              <MotionLink
                to={ROUTES.REGISTER}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(168, 85, 247, 0.35)" }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2 text-sm font-bold rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/20"
              >
                Sign up
              </MotionLink>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
export default Navbar;

