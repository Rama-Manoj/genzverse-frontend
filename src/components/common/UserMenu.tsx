import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { ROUTES } from '../../routes/routes';
import { getImageUrl } from '../../utils/image';
import { 
  User as UserIcon, 
  Settings, 
  ShieldAlert, 
  LogOut, 
  ChevronDown 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const UserMenu: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const { useProfileMeQuery } = useProfile();
  const { data: profile } = useProfileMeQuery();
  const [isOpen, setIsOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [prevProfileImage, setPrevProfileImage] = useState(profile?.profileImage);

  if (profile?.profileImage !== prevProfileImage) {
    setPrevProfileImage(profile?.profileImage);
    setImgError(false);
  }

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  if (!user) return null;

  const avatarSrc = getImageUrl(profile?.profileImage);
  const showAvatar = avatarSrc && !imgError;

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 sm:gap-2 p-0.5 sm:px-3 sm:py-1.5 rounded-full sm:bg-white/40 sm:dark:bg-slate-900/40 sm:border sm:border-slate-200/50 sm:dark:border-slate-800/50 backdrop-blur-md shadow-none sm:shadow-sm text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-900/80 transition-colors"
      >
        {/* Avatar — profile image or gradient initials */}
        <div className="h-7 w-7 rounded-full overflow-hidden shrink-0 ring-2 ring-indigo-500/30">
          {showAvatar ? (
            <img
              src={avatarSrc}
              alt={user.username}
              onError={() => setImgError(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-tr from-indigo-500 to-purple-500 text-[11px] font-bold text-white uppercase">
              {user.username.substring(0, 2)}
            </div>
          )}
        </div>
        <span className="hidden sm:inline text-slate-700 dark:text-slate-200 max-w-24 truncate">
          {user.username}
        </span>
        <ChevronDown className={`hidden sm:inline h-4 w-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 pt-2.5 z-45 w-56 origin-top-right"
          >
            <div className="rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-xl ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-900/95 backdrop-blur-md">
              {/* Profile preview */}
              <div className="flex items-center gap-3 px-3 py-2.5">
                <div className="h-10 w-10 rounded-full overflow-hidden shrink-0 ring-2 ring-indigo-500/20">
                  {showAvatar ? (
                    <img 
                      src={avatarSrc} 
                      alt={user.username} 
                      onError={() => setImgError(true)}
                      className="h-full w-full object-cover" 
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-tr from-indigo-500 to-purple-500 text-sm font-bold text-white uppercase">
                      {user.username.substring(0, 2)}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{user.username}</p>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </div>
              </div>
              
              <hr className="my-1.5 border-slate-100 dark:border-slate-800" />
              
              <Link
                to={ROUTES.PROFILE}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <UserIcon className="h-4 w-4" />
                <span>My Profile</span>
              </Link>
              <Link
                to={ROUTES.PROFILE_EDIT}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <Settings className="h-4 w-4" />
                <span>Profile Settings</span>
              </Link>
              
              {isAdmin && (
                <Link
                  to={ROUTES.ADMIN}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-amber-600 dark:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition"
                >
                  <ShieldAlert className="h-4 w-4" />
                  <span>Admin Panel</span>
                </Link>
              )}
              
              <hr className="my-1.5 border-slate-100 dark:border-slate-800" />
              
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;

