import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  BookOpen,
  Compass,
  Flame,
  Layers,
  Tag,
  FileText,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Home',        path: ROUTES.HOME,        icon: Home },
    { name: 'Explore',     path: ROUTES.EXPLORE,     icon: Compass },
    { name: 'Trending',    path: ROUTES.TRENDING,    icon: Flame },
    { name: 'Categories',  path: ROUTES.CATEGORIES,  icon: Layers },
    { name: 'Tags',        path: ROUTES.TAGS,        icon: Tag },
    ...(user ? [
      { name: 'Dashboard',   path: ROUTES.DASHBOARD,   icon: LayoutDashboard },
      { name: 'My Blogs',    path: ROUTES.MY_BLOGS,    icon: FileText },
      { name: 'Create Blog', path: ROUTES.CREATE_BLOG, icon: FileEdit },
      { name: 'Saved Blogs', path: ROUTES.SAVED,       icon: Bookmark },
    ] : [])
  ];

  const adminNavItems = [
    { name: 'Admin Hub',       path: ROUTES.ADMIN,         icon: ShieldAlert },
    { name: 'Manage Users',    path: ROUTES.ADMIN_USERS,   icon: UserIcon },
    { name: 'Manage Blogs',    path: ROUTES.ADMIN_BLOGS,   icon: BookOpen },
    { name: 'Manage Comments', path: ROUTES.ADMIN_COMMENTS,icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-14 shrink-0 border-r border-white/20 dark:border-white/5 bg-white/30 dark:bg-slate-950/30 backdrop-blur-xl h-[calc(100vh-4rem)] sticky top-0 items-center py-3 gap-0.5 z-40 group/sidebar hover:w-48 transition-all duration-300 overflow-hidden shadow-[4px_0_30px_rgba(0,0,0,0.02)]">

      {/* Nav items */}
      <div className="flex flex-col w-full gap-0.5 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              title={item.name}
              className={`relative flex items-center gap-3 px-2.5 py-2 rounded-xl text-[13px] font-bold transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? 'text-white'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-white/25 dark:hover:bg-slate-900/40 hover:text-slate-800 dark:hover:text-slate-100'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebarActiveBackground"
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl shadow-lg shadow-purple-500/20 -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150 overflow-hidden">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Admin section */}
      {isAdmin && (
        <>
          <div className="w-full px-2 mt-3">
            <div className="h-px bg-amber-500/20 w-full" />
            <p className="mt-2 px-2.5 text-[9px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1 overflow-hidden whitespace-nowrap">
              <ShieldAlert className="h-3 w-3 shrink-0" />
              <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150">Admin</span>
            </p>
          </div>
          <div className="flex flex-col w-full gap-0.5 px-2">
            {adminNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  title={item.name}
                  className={`relative flex items-center gap-3 px-2.5 py-2 rounded-xl text-[13px] font-bold transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'text-white'
                      : 'text-orange-600 dark:text-orange-400 hover:bg-white/20 dark:hover:bg-orange-950/20'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebarAdminActiveBackground"
                      className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl shadow-lg shadow-orange-500/20 -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <item.icon className="h-[18px] w-[18px] shrink-0" />
                  <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150 overflow-hidden">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </aside>
  );
};
export default Sidebar;
