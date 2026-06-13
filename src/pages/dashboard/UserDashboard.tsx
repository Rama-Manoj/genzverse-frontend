import React from 'react';
import { Link } from 'react-router-dom';
import { useDashboard } from '../../hooks/useDashboard';
import { useBlogs } from '../../hooks/useBlogs';
import { useAuth } from '../../store/AuthContext';
import { ROUTES } from '../../routes/routes';
import { 
  Eye, 
  Heart, 
  MessageSquare, 
  Bookmark, 
  FileText, 
  PlusCircle, 
  LayoutDashboard,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '../../components/profile/ProfileComponents';

export const UserDashboard: React.FC = () => {
  const { stats, isLoading: statsLoading } = useDashboard();
  const { useBlogsQuery } = useBlogs();
  const { data: allBlogs = [], isLoading: blogsLoading } = useBlogsQuery();
  const { user } = useAuth();

  const isLoading = statsLoading || blogsLoading;

  // Filter blogs created by the current user
  const myBlogs = allBlogs.filter((b) => b.author === user?.username);

  // Fallback metric card list
  const metrics = [
    {
      title: 'Total Views',
      value: stats?.totalViews ?? 0,
      icon: Eye,
      color: 'from-blue-500 to-indigo-600',
      shadow: 'shadow-blue-500/10',
    },
    {
      title: 'Likes Received',
      value: stats?.totalLikes ?? 0,
      icon: Heart,
      color: 'from-rose-500 to-pink-600',
      shadow: 'shadow-rose-500/10',
    },
    {
      title: 'Total Comments',
      value: stats?.totalComments ?? 0,
      icon: MessageSquare,
      color: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/10',
    },
    {
      title: 'Saved Blogs',
      value: stats?.savedBlogs ?? 0,
      icon: Bookmark,
      color: 'from-amber-500 to-orange-600',
      shadow: 'shadow-amber-500/10',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs uppercase tracking-widest">
            <LayoutDashboard className="h-4 w-4" />
            <span>Overview</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight mt-1 text-slate-900 dark:text-slate-100">
            Welcome back, {user?.username || 'Writer'}!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Here is a snapshot of your publications, readers metrics, and bookmark activity.
          </p>
        </div>

        <Link
          to={ROUTES.CREATE_BLOG}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-semibold text-sm shadow-md hover:shadow-lg hover:shadow-indigo-500/10 transition-all self-start sm:self-auto hover:scale-102"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Write a Post</span>
        </Link>
      </div>

      {/* Metrics Cards Grid */}
      <div className="metrics-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`relative overflow-hidden rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900/60 p-6 shadow-sm transition-shadow hover:shadow-lg group`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">{card.title}</p>
                <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 mt-2">
                  <AnimatedCounter value={card.value} />
                </h3>
              </div>
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-md`}>
                <card.icon className="h-5 w-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User's Blogs List */}
        <div className="lg:col-span-2 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl bg-white dark:bg-slate-900/60 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/60">
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-500" />
                <span>My Publications</span>
              </h4>
              <span className="text-xs text-slate-400 font-semibold">{myBlogs.length} articles</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/50 mt-2">
              {myBlogs.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <p className="text-sm">You haven't written any posts yet.</p>
                  <Link to={ROUTES.CREATE_BLOG} className="text-xs text-indigo-500 hover:underline font-bold mt-2 inline-block">
                    Start draft →
                  </Link>
                </div>
              ) : (
                myBlogs.map((b) => (
                  <div key={b.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-grow">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate hover:text-indigo-500">
                        <Link to={ROUTES.BLOG_DETAILS.replace(':slug', b.slug || String(b.id))}>
                          {b.title}
                        </Link>
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                        <span>{b.category ?? 'Uncategorized'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <Eye className="h-3 w-3" />
                          {b.views}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <Heart className="h-3 w-3" />
                          {b.likes}
                        </span>
                      </p>
                    </div>
                    <Link
                      to={`/edit-blog/${b.id}`}
                      className="px-3.5 py-1.5 text-xs font-bold border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                    >
                      Edit
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Side Info Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Info Box */}
          <div className="border border-slate-200/50 dark:border-slate-800/50 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-md flex flex-col justify-between h-48 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 transform translate-x-4 translate-y-4 opacity-10">
              <LayoutDashboard className="h-36 w-36" />
            </div>
            <div>
              <h4 className="text-lg font-black leading-snug">Become a GenzVerse Influencer</h4>
              <p className="text-xs text-indigo-100 mt-2 leading-relaxed">
                Publish high-quality tech or design content, share your insights, and build a dedicated follower community.
              </p>
            </div>
            <Link
              to={ROUTES.PROFILE}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold bg-white text-indigo-600 px-4 py-2 rounded-xl hover:bg-indigo-50 transition self-start"
            >
              <span>View Creator Profile</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Social Stats Preview */}
          <div className="border border-slate-200/50 dark:border-slate-800/50 rounded-3xl bg-white dark:bg-slate-900/60 p-6 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 pb-3 border-b border-slate-100 dark:border-slate-800/60">
              Followers Analytics
            </h4>
            <div className="grid grid-cols-2 gap-4 mt-4 text-center">
              <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/60 rounded-2xl">
                <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                  <AnimatedCounter value={stats?.followers ?? 0} />
                </span>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mt-0.5">Followers</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/60 rounded-2xl">
                <span className="text-xl font-black text-slate-600 dark:text-slate-400">
                  <AnimatedCounter value={stats?.following ?? 0} />
                </span>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mt-0.5">Following</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
