import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, Loader2, Heart, MessageSquare, UserPlus, Share2, Info } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { NotifRow } from '../../components/common/NotificationBell';
import type { NotificationResponse } from '../../types';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '../../api/notification.api';

const TYPE_FILTERS: { key: NotificationResponse['type'] | 'ALL'; label: string; icon: React.ReactNode }[] = [
  { key: 'ALL',    label: 'All',      icon: <Bell className="h-3.5 w-3.5" /> },
  { key: 'LIKE',   label: 'Likes',    icon: <Heart className="h-3.5 w-3.5" /> },
  { key: 'COMMENT',label: 'Comments', icon: <MessageSquare className="h-3.5 w-3.5" /> },
  { key: 'FOLLOW', label: 'Follows',  icon: <UserPlus className="h-3.5 w-3.5" /> },
  { key: 'SHARE',  label: 'Shares',   icon: <Share2 className="h-3.5 w-3.5" /> },
  { key: 'SYSTEM', label: 'System',   icon: <Info className="h-3.5 w-3.5" /> },
];

export const Notifications: React.FC = () => {
  const queryClient = useQueryClient();
  const { useNotificationsQuery, useUnreadCountQuery, markAsRead, isMarkingRead } = useNotifications();
  const { data: notifications = [], isLoading } = useNotificationsQuery();
  const { data: countData } = useUnreadCountQuery();

  const [filter, setFilter] = useState<NotificationResponse['type'] | 'ALL'>('ALL');
  const [markingAllRead, setMarkingAllRead] = useState(false);

  const unreadCount = countData?.unreadCount ?? 0;
  const unreadList = notifications.filter((n) => !n.read);

  const filtered = filter === 'ALL'
    ? notifications
    : notifications.filter((n) => n.type === filter);

  const handleMarkAllRead = async () => {
    if (unreadList.length === 0) return;
    try {
      setMarkingAllRead(true);
      await Promise.all(unreadList.map((n) => notificationApi.markAsRead(n.id)));
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
      toast.success(`Marked ${unreadList.length} notification${unreadList.length > 1 ? 's' : ''} as read`);
    } catch {
      toast.error('Failed to mark all as read');
    } finally {
      setMarkingAllRead(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white text-sm font-black">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Activity on your profile and blogs.
          </p>
        </div>

        {unreadList.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={markingAllRead}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-60 transition-all hover:scale-105"
          >
            {markingAllRead
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <CheckCheck className="h-4 w-4 text-indigo-500" />
            }
            Mark all read
          </button>
        )}
      </motion.div>

      {/* Type filter tabs */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex flex-wrap gap-1.5"
      >
        {TYPE_FILTERS.map(({ key, label, icon }) => {
          const count = key === 'ALL'
            ? notifications.length
            : notifications.filter((n) => n.type === key).length;

          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 hover:scale-105 ${
                filter === key
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {icon}
              {label}
              <span className={`ml-0.5 ${filter === key ? 'text-indigo-200' : 'text-slate-400'}`}>
                ({count})
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* Notification list */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md overflow-hidden shadow-sm"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            <p className="text-sm text-slate-400">Loading notifications...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60">
              <Bell className="h-10 w-10 opacity-40" />
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-600 dark:text-slate-300">
                {filter === 'ALL' ? 'No notifications yet' : `No ${filter.toLowerCase()} notifications`}
              </p>
              <p className="text-sm mt-0.5">
                {filter === 'ALL'
                  ? "When someone likes, comments or follows you, it'll show up here."
                  : 'Try a different filter above.'}
              </p>
            </div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            <div className="divide-y divide-slate-100/60 dark:divide-slate-800/60">
              {filtered.map((notif, i) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <NotifRow
                    notif={notif}
                    onMarkRead={markAsRead}
                    isMarking={isMarkingRead}
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </motion.div>

      {/* Stats summary */}
      {!isLoading && notifications.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between text-xs text-slate-400 px-1"
        >
          <span>{notifications.length} total notification{notifications.length !== 1 ? 's' : ''}</span>
          <span>{unreadCount} unread</span>
        </motion.div>
      )}
    </div>
  );
};
export default Notifications;
