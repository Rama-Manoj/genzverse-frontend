import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { ROUTES } from '../../routes/routes';
import { 
  Home,
  LayoutDashboard, 
  FileEdit, 
  Bookmark, 
  User as UserIcon, 
  Settings, 
  ShieldAlert, 
  LogOut, 
  X,
  BookOpen,
  Compass,
  Flame,
  Layers,
  Tag,
  FileText,
  Info,
  Phone,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchBar } from './SearchBar';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ isOpen, onClose }) => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  const publicNavItems = [
    { name: 'Home',        path: ROUTES.HOME,        icon: Home },
    { name: 'Explore',     path: ROUTES.EXPLORE,     icon: Compass },
    { name: 'Trending',    path: ROUTES.TRENDING,    icon: Flame },
    { name: 'Categories',  path: ROUTES.CATEGORIES,  icon: Layers },
    { name: 'Tags',        path: ROUTES.TAGS,        icon: Tag },
  ];

  const userNavItems = [
    { name: 'Dashboard',   path: ROUTES.DASHBOARD,   icon: LayoutDashboard },
    { name: 'My Blogs',    path: ROUTES.MY_BLOGS,    icon: FileText },
    { name: 'Create Blog', path: ROUTES.CREATE_BLOG, icon: FileEdit },
    { name: 'Saved Blogs', path: ROUTES.SAVED,       icon: Bookmark },
    { name: 'My Profile',  path: ROUTES.PROFILE,     icon: UserIcon },
    { name: 'Settings',    path: ROUTES.SETTINGS,    icon: Settings },
  ];

  const infoNavItems = [
    { name: 'About Us',    path: ROUTES.ABOUT,       icon: Info },
    { name: 'Contact Us',  path: ROUTES.CONTACT,     icon: Phone },
    { name: 'FAQ Help',    path: ROUTES.FAQ,         icon: HelpCircle },
    { name: 'Privacy',     path: ROUTES.PRIVACY,     icon: FileCheck },
    { name: 'Terms',       path: ROUTES.TERMS,       icon: FileText },
  ];

  const adminNavItems = [
    { name: 'Admin Hub', path: ROUTES.ADMIN, icon: ShieldAlert },
    { name: 'Manage Users', path: ROUTES.ADMIN_USERS, icon: UserIcon },
    { name: 'Manage Blogs', path: ROUTES.ADMIN_BLOGS, icon: BookOpen },
    { name: 'Manage Comments', path: ROUTES.ADMIN_COMMENTS, icon: Settings },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Drawer backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-slate-950/40 backdrop-blur-sm lg:hidden"
          />
          
          {/* Sliding drawer content */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-[70] w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-6 flex flex-col justify-between shadow-2xl lg:hidden border-r border-slate-200/50 dark:border-slate-800/50"
          >
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex items-center justify-between mb-6 shrink-0">
                <Link to={ROUTES.HOME} className="flex items-center gap-2 font-black text-xl" onClick={onClose}>
                  <BookOpen className="h-5.5 w-5.5 text-indigo-500" />
                  <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">GenzVerse</span>
                </Link>
                <button 
                  onClick={onClose}
                  className="rounded-xl p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Search input */}
              <div className="mb-4 shrink-0">
                <SearchBar onSearchComplete={onClose} />
              </div>

              {/* Navigation lists */}
              <div className="flex-1 overflow-y-auto space-y-5 pr-1 scrollbar-none">
                {/* 1. Discover */}
                <div className="space-y-0.5">
                  <p className="px-3 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">
                    Discover
                  </p>
                  {publicNavItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={onClose}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive 
                            ? 'bg-indigo-600 text-white shadow shadow-indigo-500/10' 
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <item.icon className="h-4.5 w-4.5 text-indigo-500" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* 2. User Workspaces */}
                {user && (
                  <div className="space-y-0.5">
                    <p className="px-3 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">
                      Workspace
                    </p>
                    {userNavItems.map((item) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={onClose}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                            isActive 
                              ? 'bg-indigo-600 text-white shadow shadow-indigo-500/10' 
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <item.icon className="h-4.5 w-4.5 text-pink-500" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* 3. Info / Legal Pages */}
                <div className="space-y-0.5">
                  <p className="px-3 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">
                    Information
                  </p>
                  {infoNavItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={onClose}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive 
                            ? 'bg-indigo-600 text-white shadow' 
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <item.icon className="h-4.5 w-4.5 text-purple-500" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* Admin options */}
                {isAdmin && (
                  <div className="space-y-0.5">
                    <p className="px-3 text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1.5">
                      Admin Panel
                    </p>
                    {adminNavItems.map((item) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={onClose}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                            isActive 
                              ? 'bg-amber-600 text-white' 
                              : 'hover:bg-amber-500/10 text-amber-700 dark:text-amber-400'
                          }`}
                        >
                          <item.icon className="h-4.5 w-4.5" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* Guest Account triggers */}
                {!user && (
                  <div className="px-3 pt-2 space-y-2.5 shrink-0">
                    <Link
                      to={ROUTES.LOGIN}
                      onClick={onClose}
                      className="block w-full py-2 text-center text-xs font-bold rounded-xl border border-slate-205 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      Log in
                    </Link>
                    <Link
                      to={ROUTES.REGISTER}
                      onClick={onClose}
                      className="block w-full py-2 text-center text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-505 shadow"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>

              {/* Session logout at bottom */}
              {user && (
                <div className="pt-4 mt-auto border-t border-slate-100 dark:border-slate-800 shrink-0">
                  <button
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-all animate-fade-in"
                  >
                    <LogOut className="h-4.5 w-4.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
export default MobileNavigation;
