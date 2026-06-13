import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, PenLine, Bookmark, Bell, User } from 'lucide-react';
import { ROUTES } from '../../routes/routes';
import { useAuth } from '../../store/AuthContext';
import { useNotifications } from '../../hooks/useNotifications';

export const MobileBottomNav: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { useUnreadCountQuery } = useNotifications();
  const { data: unreadData } = useUnreadCountQuery(isAuthenticated);
  const unreadCount = unreadData?.unreadCount ?? 0;


  const navItems = [
    {
      to: ROUTES.HOME,
      icon: Home,
      label: 'Home',
      authRequired: false,
    },
    {
      to: ROUTES.EXPLORE,
      icon: Compass,
      label: 'Explore',
      authRequired: false,
    },
    ...(isAuthenticated
      ? [
          {
            to: ROUTES.CREATE_BLOG,
            icon: PenLine,
            label: 'Write',
            authRequired: true,
            highlight: true,
          },
          {
            to: ROUTES.SAVED,
            icon: Bookmark,
            label: 'Saved',
            authRequired: true,
          },
          {
            to: ROUTES.NOTIFICATIONS,
            icon: Bell,
            label: 'Alerts',
            authRequired: true,
            badge: unreadCount,
          },
        ]
      : [
          {
            to: ROUTES.PROFILE,
            icon: User,
            label: 'Profile',
            authRequired: false,
          },
        ]),
  ];

  return (
    <nav className="lg:hidden fixed bottom-4 left-4 right-4 z-50 bg-white/45 dark:bg-slate-950/45 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] safe-area-pb">
      <div className="flex items-center justify-around px-2 pt-2 pb-2">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === ROUTES.HOME}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all duration-300 min-w-[56px] ${
                item.highlight
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/25 scale-110'
                  : isActive
                  ? 'text-purple-600 dark:text-pink-400 scale-105 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <item.icon
                    className={`h-5 w-5 transition-transform duration-200 ${
                      isActive && !item.highlight ? 'scale-110' : ''
                    }`}
                    strokeWidth={isActive || item.highlight ? 2.5 : 1.8}
                  />
                  {/* Badge */}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white animate-bounce">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] font-bold leading-none ${
                    item.highlight ? 'text-white' : ''
                  }`}
                >
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
