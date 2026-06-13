import React from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import { ROUTES } from '../../routes/routes';
import { 
  Users as UsersIcon, 
  BookOpen, 
  MessageSquare, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '../../components/profile/ProfileComponents';

export const AdminDashboard: React.FC = () => {
  const { 
    useAdminStatsQuery, 
    useAdminUsersQuery, 
    useAdminBlogsQuery, 
    useAdminCommentsQuery 
  } = useAdmin();

  const { data: stats, isLoading: statsLoading, isError: statsError } = useAdminStatsQuery();
  const { data: users, isLoading: usersLoading } = useAdminUsersQuery();
  const { data: blogs, isLoading: blogsLoading } = useAdminBlogsQuery();
  const { data: comments, isLoading: commentsLoading } = useAdminCommentsQuery();

  // Derive counts in case stats endpoint is loading or fails
  const totalUsersCount = stats?.totalUsers || users?.length || 0;
  const totalBlogsCount = stats?.totalBlogs || blogs?.length || 0;
  const totalCommentsCount = stats?.totalComments || comments?.length || 0;

  // Grab recent items
  const recentUsers = (users || []).slice(-4).reverse();
  const recentBlogs = (blogs || []).slice(-4).reverse();
  const recentComments = (comments || []).slice(-4).reverse();

  // Calculate percentages for SVG chart
  const totalItems = totalUsersCount + totalBlogsCount + totalCommentsCount;
  const userPercent = totalItems > 0 ? (totalUsersCount / totalItems) * 100 : 33.3;
  const blogPercent = totalItems > 0 ? (totalBlogsCount / totalItems) * 100 : 33.3;
  const commentPercent = totalItems > 0 ? (totalCommentsCount / totalItems) * 100 : 33.3;

  // Doughnut Chart coordinates/calculations (simplified for 3 segments)
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const userStroke = circumference * (userPercent / 100);
  const blogStroke = circumference * (blogPercent / 100);
  const commentStroke = circumference * (commentPercent / 100);

  const statsCards = [
    {
      title: 'Total Users',
      value: totalUsersCount,
      isLoading: statsLoading && usersLoading && !stats && !users,
      change: 'Active accounts',
      icon: UsersIcon,
      color: 'from-indigo-500 to-blue-600',
      shadow: 'shadow-indigo-500/10 dark:shadow-indigo-500/5',
      link: ROUTES.ADMIN_USERS,
      linkLabel: 'Manage Users',
    },
    {
      title: 'Total Blogs',
      value: totalBlogsCount,
      isLoading: statsLoading && blogsLoading && !stats && !blogs,
      change: 'Published posts',
      icon: BookOpen,
      color: 'from-amber-500 to-orange-600',
      shadow: 'shadow-amber-500/10 dark:shadow-amber-500/5',
      link: ROUTES.ADMIN_BLOGS,
      linkLabel: 'Manage Blogs',
    },
    {
      title: 'Total Comments',
      value: totalCommentsCount,
      isLoading: statsLoading && commentsLoading && !stats && !comments,
      change: 'Interactions',
      icon: MessageSquare,
      color: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/10 dark:shadow-emerald-500/5',
      link: ROUTES.ADMIN_COMMENTS,
      linkLabel: 'Manage Comments',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-1">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-widest">
            <ShieldCheck className="h-4 w-4" />
            <span>Admin Control Panel</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight mt-1 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">
            Overview of system health, platform metrics, and quick moderation tools.
          </p>
        </div>
      </div>

      {statsError && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3 text-amber-600 dark:text-amber-400 text-sm">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <div>
            <span className="font-bold">Notice:</span> Failed to retrieve live statistics. Derived backup metrics are currently active.
          </div>
        </div>
      )}

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative overflow-hidden rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900/60 p-6 ${card.shadow} transition-shadow hover:shadow-xl group`}
          >
            {/* Background glowing circle */}
            <div className={`absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-gradient-to-br ${card.color} opacity-5 blur-2xl group-hover:opacity-10 transition-opacity`} />
            
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{card.title}</p>
                {card.isLoading ? (
                  <div className="h-9 w-20 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl mt-2" />
                ) : (
                  <h3 className="text-4xl font-black tracking-tight text-slate-800 dark:text-slate-100 mt-2">
                    <AnimatedCounter value={card.value} />
                  </h3>
                )}
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {card.change}
                </p>
              </div>
              <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-md`}>
                <card.icon className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
              <Link 
                to={card.link}
                className="text-xs font-bold text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
              >
                <span>{card.linkLabel}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* SVG Chart & Moderation Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SVG Distribution Chart */}
        <div className="lg:col-span-1 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl bg-white dark:bg-slate-900/60 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">Data Distribution</h4>
            <p className="text-xs text-slate-400 mt-1">Platform entities breakdown</p>
          </div>

          {(statsLoading && commentsLoading && !stats && !comments) ? (
            <div className="h-48 flex flex-col items-center justify-center my-6 gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
              <p className="text-xs text-slate-400">Loading metrics...</p>
            </div>
          ) : totalItems === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
              No content created yet.
            </div>
          ) : (
            <div className="my-6 flex flex-col items-center justify-center">
              {/* Custom SVG Doughnut Chart */}
              <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 160 160">
                {/* Background segment */}
                <circle cx="80" cy="80" r={radius} fill="transparent" stroke="#E2E8F0" strokeWidth="16" className="dark:stroke-slate-800" />
                
                {/* Segment 1: Users (Indigo) */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke="#6366F1"
                  strokeWidth="16"
                  strokeDasharray={`${userStroke} ${circumference}`}
                  strokeDashoffset="0"
                />

                {/* Segment 2: Blogs (Amber) */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke="#F59E0B"
                  strokeWidth="16"
                  strokeDasharray={`${blogStroke} ${circumference}`}
                  strokeDashoffset={-userStroke}
                />

                {/* Segment 3: Comments (Emerald) */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke="#10B981"
                  strokeWidth="16"
                  strokeDasharray={`${commentStroke} ${circumference}`}
                  strokeDashoffset={-(userStroke + blogStroke)}
                />
              </svg>

              <div className="text-center mt-3">
                <span className="text-2xl font-black text-slate-800 dark:text-slate-100">
                  <AnimatedCounter value={totalItems} />
                </span>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Entities</p>
              </div>
            </div>
          )}

          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-indigo-500" />
                <span className="font-semibold text-slate-600 dark:text-slate-300">Users</span>
              </div>
              <span className="font-black text-slate-800 dark:text-slate-100">{userPercent.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-amber-500" />
                <span className="font-semibold text-slate-600 dark:text-slate-300">Blogs</span>
              </div>
              <span className="font-black text-slate-800 dark:text-slate-100">{blogPercent.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="font-semibold text-slate-600 dark:text-slate-300">Comments</span>
              </div>
              <span className="font-black text-slate-800 dark:text-slate-100">{commentPercent.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Quick Moderation Shortcuts */}
        <div className="lg:col-span-2 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl bg-white dark:bg-slate-900/60 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 font-sans">Moderation Center</h4>
            <p className="text-xs text-slate-400 mt-1">Direct operations & quick actions</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-950/40">
                <h5 className="text-xs font-bold text-indigo-500 uppercase tracking-wide">Manage Accounts</h5>
                <p className="text-xs text-slate-400 mt-1">Moderate spam profiles, change role settings, and manage credentials.</p>
                <Link 
                  to={ROUTES.ADMIN_USERS} 
                  className="mt-3.5 inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Go to Users <ExternalLink className="h-3 w-3" />
                </Link>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100/50 dark:border-amber-950/40">
                <h5 className="text-xs font-bold text-amber-500 uppercase tracking-wide">Content Moderation</h5>
                <p className="text-xs text-slate-400 mt-1">Review user blogs, remove copyright infractions, and filter offensive comments.</p>
                <div className="flex gap-4 mt-3.5">
                  <Link 
                    to={ROUTES.ADMIN_BLOGS} 
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    Blogs <ExternalLink className="h-3 w-3" />
                  </Link>
                  <Link 
                    to={ROUTES.ADMIN_COMMENTS} 
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    Comments <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/40 dark:border-slate-800/40 rounded-2xl">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Access policy</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Actions in GenzVerse admin panel are audited. Only verified accounts with the <strong className="text-amber-500">ADMIN</strong> role are permitted.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Users */}
        <div className="border border-slate-200/50 dark:border-slate-800/50 rounded-3xl bg-white dark:bg-slate-900/60 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/60">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Recent Signups</h4>
            <Link to={ROUTES.ADMIN_USERS} className="text-xs text-indigo-500 hover:underline font-semibold">View All</Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/50 mt-2">
            {usersLoading && recentUsers.length === 0 ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="py-3 flex items-center justify-between animate-pulse">
                  <div className="space-y-2">
                    <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded-md" />
                    <div className="h-2 w-32 bg-slate-150 dark:bg-slate-800/60 rounded-md" />
                  </div>
                  <div className="h-4.5 w-12 bg-slate-200 dark:bg-slate-800 rounded-full" />
                </div>
              ))
            ) : recentUsers.length === 0 ? (
              <p className="py-4 text-xs text-slate-400 text-center">No signups found.</p>
            ) : (
              recentUsers.map((u) => (
                <div key={u.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{u.username}</p>
                    <p className="text-[10px] text-slate-400">{u.email}</p>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${u.role === 'ADMIN' ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    {u.role ?? 'USER'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Blogs */}
        <div className="border border-slate-200/50 dark:border-slate-800/50 rounded-3xl bg-white dark:bg-slate-900/60 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/60">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Recent Blogs</h4>
            <Link to={ROUTES.ADMIN_BLOGS} className="text-xs text-indigo-500 hover:underline font-semibold">View All</Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/50 mt-2">
            {blogsLoading && recentBlogs.length === 0 ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="py-3 flex flex-col gap-2 animate-pulse">
                  <div className="flex justify-between items-start gap-2">
                    <div className="h-3 w-32 bg-slate-200 dark:bg-slate-800 rounded-md" />
                    <div className="h-2.5 w-16 bg-slate-150 dark:bg-slate-800/60 rounded-md" />
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <div className="h-2 w-20 bg-slate-150 dark:bg-slate-800/60 rounded-md" />
                    <div className="h-2 w-10 bg-slate-150 dark:bg-slate-800/60 rounded-md" />
                  </div>
                </div>
              ))
            ) : recentBlogs.length === 0 ? (
              <p className="py-4 text-xs text-slate-400 text-center">No blogs found.</p>
            ) : (
              recentBlogs.map((b) => (
                <div key={b.id} className="py-3 flex flex-col gap-0.5">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate flex-1">{b.title}</p>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">{b.category ?? 'Uncategorized'}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>By {b.author}</span>
                    <span>{b.views} views</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Comments */}
        <div className="border border-slate-200/50 dark:border-slate-800/50 rounded-3xl bg-white dark:bg-slate-900/60 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/60">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Recent Comments</h4>
            <Link to={ROUTES.ADMIN_COMMENTS} className="text-xs text-indigo-500 hover:underline font-semibold">View All</Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/50 mt-2">
            {commentsLoading && recentComments.length === 0 ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="py-3 flex flex-col gap-2 animate-pulse">
                  <div className="flex justify-between">
                    <div className="h-2.5 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" />
                    <div className="h-2 w-12 bg-slate-150 dark:bg-slate-800/60 rounded-md" />
                  </div>
                  <div className="h-3 w-full bg-slate-150 dark:bg-slate-800/60 rounded-md" />
                  <div className="h-3 w-2/3 bg-slate-150 dark:bg-slate-800/60 rounded-md" />
                </div>
              ))
            ) : recentComments.length === 0 ? (
              <p className="py-4 text-xs text-slate-400 text-center">No comments found.</p>
            ) : (
              recentComments.map((c) => (
                <div key={c.id} className="py-3">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-bold text-indigo-500">{c.username}</span>
                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 italic">
                    "{c.content}"
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
