import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Heart, MessageSquare, UserPlus, Share2, Info, CheckCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../hooks/useNotifications';
import { ROUTES } from '../../routes/routes';
import type { NotificationResponse } from '../../types';

// ─── Icon by type ─────────────────────────────────────────────────────────────
const NotifIcon: React.FC<{ type: NotificationResponse['type'] }> = ({ type }) => {
  const map: Record<NotificationResponse['type'], { icon: React.ReactNode; color: string }> = {
    LIKE:    { icon: <Heart className="h-3.5 w-3.5" />,        color: 'bg-rose-100 dark:bg-rose-950/60 text-rose-500' },
    COMMENT: { icon: <MessageSquare className="h-3.5 w-3.5" />,color: 'bg-blue-100 dark:bg-blue-950/60 text-blue-500' },
    FOLLOW:  { icon: <UserPlus className="h-3.5 w-3.5" />,     color: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-500' },
    SHARE:   { icon: <Share2 className="h-3.5 w-3.5" />,       color: 'bg-amber-100 dark:bg-amber-950/60 text-amber-500' },
    SYSTEM:  { icon: <Info className="h-3.5 w-3.5" />,         color: 'bg-slate-100 dark:bg-slate-800 text-slate-500' },
  };
  const { icon, color } = map[type] ?? map.SYSTEM;
  return (
    <div className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center ${color}`}>
      {icon}
    </div>
  );
};

// ─── Single Row ───────────────────────────────────────────────────────────────
export const NotifRow: React.FC<{
  notif: NotificationResponse;
  onMarkRead: (id: number) => void;
  isMarking: boolean;
  compact?: boolean;
}> = ({ notif, onMarkRead, isMarking, compact = false }) => {
  const timeAgo = (dateStr: string) => {
    // eslint-disable-next-line react-hooks/purity
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1)  return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-start gap-3 px-4 py-3 transition-colors group ${
        !notif.read ? 'bg-indigo-50/60 dark:bg-indigo-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
      } ${compact ? 'py-2.5' : 'py-3.5'}`}
    >
      <NotifIcon type={notif.type} />

      <div className="flex-1 min-w-0">
        <p className={`text-sm leading-snug ${!notif.read ? 'font-semibold text-slate-800 dark:text-slate-100' : 'text-slate-600 dark:text-slate-300'}`}>
          {notif.message}
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">{timeAgo(notif.createdAt)}</p>
      </div>

      {/* Unread dot + mark-read button */}
      <div className="flex items-center gap-2 shrink-0">
        {!notif.read && (
          <span className="h-2 w-2 rounded-full bg-indigo-500" />
        )}
        {!notif.read && (
          <button
            onClick={() => onMarkRead(notif.id)}
            disabled={isMarking}
            title="Mark as read"
            className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-500 transition-all"
          >
            <CheckCheck className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

// ─── Dropdown Bell ────────────────────────────────────────────────────────────
export const NotificationBell: React.FC = () => {
  const { useUnreadCountQuery, useNotificationsQuery, markAsRead, isMarkingRead } = useNotifications();
  const { data: countData } = useUnreadCountQuery();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unreadCount = countData?.unreadCount ?? 0;

  // Fetch notifications only when dropdown opens
  const { data: notifications = [], isLoading } = useNotificationsQuery();

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 250);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const preview = notifications.slice(0, 5);

  return (
    <div
      className="relative"
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Bell button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-full p-2.5 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.25, 1] }}
              exit={{ scale: 0 }}
              transition={{
                scale: {
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut"
                }
              }}
              className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-[9px] font-black text-white flex items-center justify-center ring-2 ring-white dark:ring-slate-950 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Invisible bridge to prevent gap hover loss */}
      {open && (
        <div className="absolute right-0 top-full w-80 h-3" />
      )}

      {/* Dropdown Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-[calc(100%+4px)] w-80 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-2xl shadow-slate-900/10 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-slate-800 dark:text-slate-100">Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-[10px] font-black">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* List */}
            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100/60 dark:divide-slate-800/60">
              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                </div>
              ) : preview.length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-sm">
                  <Bell className="h-7 w-7 mx-auto mb-2 opacity-30" />
                  All caught up!
                </div>
              ) : (
                preview.map((n) => (
                  <NotifRow key={n.id} notif={n} onMarkRead={markAsRead} isMarking={isMarkingRead} compact />
                ))
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-2.5">
              <Link
                to={ROUTES.NOTIFICATIONS}
                onClick={() => setOpen(false)}
                className="block text-center text-xs font-bold text-indigo-500 hover:text-indigo-600 transition-colors py-0.5"
              >
                View all notifications →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
