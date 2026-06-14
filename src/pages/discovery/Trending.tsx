import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Eye, Heart, MessageSquare, Award, ArrowUpRight, LogIn, BookOpen } from 'lucide-react';
import { useBlogs } from '../../hooks/useBlogs';
import { Link } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { ROUTES } from '../../routes/routes';

type SortOption = 'views' | 'likes' | 'comments';

export const Trending: React.FC = () => {
  const { user } = useAuth();
  const { useTrendingBlogsQuery } = useBlogs();
  const [sortBy, setSortBy] = useState<SortOption>('views');

  useEffect(() => {
    document.title = 'Trending Blogs | GenzVerse';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Discover the most popular GenzVerse publications ranked by views, likes, and community discussions.');
    }
  }, []);

  const { data: trendingBlogs = [], isLoading } = useTrendingBlogsQuery(sortBy);

  const sortTabs = [
    { value: 'views' as const, label: 'Most Viewed', icon: <Eye className="h-3.5 w-3.5" /> },
    { value: 'likes' as const, label: 'Highest Liked', icon: <Heart className="h-3.5 w-3.5" /> },
    { value: 'comments' as const, label: 'Most Discussed', icon: <MessageSquare className="h-3.5 w-3.5" /> },
  ];

  const getRankBadgeClass = (index: number) => {
    if (index === 0) return 'bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-900 shadow-yellow-500/20';
    if (index === 1) return 'bg-gradient-to-tr from-slate-300 to-slate-400 text-slate-900 shadow-slate-400/20';
    if (index === 2) return 'bg-gradient-to-tr from-amber-600 to-orange-700 text-white shadow-orange-700/20';
    return 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/60';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 px-1">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-4 border-b border-slate-100 dark:border-slate-800/80"
      >
        <div>
          <div className="flex items-center gap-2 text-pink-500 font-bold text-xs uppercase tracking-widest">
            <Flame className="h-4 w-4" />
            <span>Popular Content</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight mt-1 text-slate-900 dark:text-slate-100">
            Trending Today
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Top GenzVerse publications driving views, likes, and active replies.
          </p>
        </div>

        {/* Sort Filter Tabs */}
        <div className="flex bg-slate-100/55 dark:bg-slate-950/45 p-1 rounded-xl w-fit border border-slate-200/20">
          {sortTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSortBy(tab.value)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                sortBy === tab.value
                  ? 'bg-white dark:bg-slate-850 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Main Ranking Grid */}
      <div className="space-y-4">
        {!user ? (
          <div className="relative group max-w-md mx-auto mt-6">
            {/* Ambient background glow */}
            <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-xl group-hover:opacity-35 group-hover:scale-105 transition-all duration-700" />
            
            {/* Main Card */}
            <div className="relative flex flex-col items-center justify-center p-6 rounded-3xl border border-indigo-100/80 dark:border-slate-800/80 bg-gradient-to-br from-indigo-50/95 via-purple-50/90 to-pink-50/95 dark:from-slate-950/95 dark:via-purple-950/25 dark:to-indigo-950/95 backdrop-blur-xl text-center space-y-6 shadow-xl shadow-indigo-100/40 dark:shadow-none transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-purple-500/5">
              {/* Icon with beautiful gradient backdrop */}
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/25 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                <BookOpen className="h-6 w-6" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-pink-300 font-sans">
                  Unlock GenzVerse Insights
                </h3>
                <div className="h-0.5 w-10 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full opacity-60 group-hover:w-16 transition-all duration-500" />
              </div>
              
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs leading-relaxed font-semibold">
                Sign in to your GenzVerse account to read premium developer publications, tutorials, and lifestyle thoughts from creators.
              </p>
              
              <Link
                to={ROUTES.LOGIN}
                className="group/btn relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full overflow-hidden text-white text-xs font-black shadow-md hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 uppercase tracking-wider"
              >
                {/* Button Gradient Backdrop */}
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 transition-all duration-500 group-hover/btn:bg-gradient-to-r group-hover/btn:from-pink-500 group-hover/btn:via-purple-600 group-hover/btn:to-indigo-600" />
                <span className="relative flex items-center gap-2">
                  <LogIn className="h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform duration-300" />
                  <span>Login to see the content</span>
                </span>
              </Link>
            </div>
          </div>
        ) : isLoading ? (
          // Skeletons
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-5 rounded-2xl bg-white/30 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/50 animate-pulse">
              <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full w-2/3" />
                <div className="h-2.5 bg-slate-150 dark:bg-slate-700/60 rounded-full w-1/2" />
              </div>
            </div>
          ))
        ) : trendingBlogs.length === 0 ? (
          <p className="text-sm text-slate-450 italic py-10 text-center">No trending articles found. Start publishing to rank!</p>
        ) : (
          trendingBlogs.map((blog, index) => {
            const rankingNumber = index + 1;
            const thumbnailUrl = blog.thumbnailUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500&auto=format&fit=crop&q=60';
            return (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative flex flex-col sm:flex-row gap-5 p-5 rounded-3xl border border-slate-200/55 dark:border-slate-800/55 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md hover:border-purple-300 dark:hover:border-purple-900 hover:shadow-lg transition duration-300 items-start sm:items-center"
              >
                {/* Ranking Badge */}
                <div className={`h-10 w-10 shrink-0 rounded-2xl flex items-center justify-center font-black text-sm shadow-md ${getRankBadgeClass(index)}`}>
                  {rankingNumber <= 3 ? (
                    <Award className="h-5 w-5" />
                  ) : (
                    <span>{rankingNumber}</span>
                  )}
                </div>

                {/* Thumbnail Cover image */}
                <div className="h-16 w-28 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200/30 dark:border-slate-800/50">
                  <img
                    src={thumbnailUrl}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Info block */}
                <div className="flex-grow min-w-0">
                  <h3 className="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100 truncate hover:text-indigo-500">
                    <Link to={`/blog/${blog.slug || blog.id}`}>
                      {blog.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                    <span>By <strong>@{blog.author}</strong></span>
                    <span>•</span>
                    <span className="text-[10px] tracking-wider uppercase bg-indigo-50 dark:bg-indigo-950/20 px-2 py-0.5 rounded-md font-semibold text-indigo-500">
                      {blog.category ?? 'General'}
                    </span>
                  </p>
                </div>

                {/* Metric count display */}
                <div className="flex items-center gap-5 text-slate-400 text-xs shrink-0 self-end sm:self-center">
                  <span className={`flex items-center gap-1 ${sortBy === 'views' ? 'font-black text-cyan-500' : ''}`} title="Views">
                    <Eye className="h-4 w-4" />
                    {blog.views}
                  </span>
                  <span className={`flex items-center gap-1 ${sortBy === 'likes' ? 'font-black text-rose-500' : ''}`} title="Likes">
                    <Heart className="h-4 w-4" />
                    {blog.likes}
                  </span>
                  <span className={`flex items-center gap-1 ${sortBy === 'comments' ? 'font-black text-purple-500' : ''}`} title="Comments">
                    <MessageSquare className="h-4 w-4" />
                    {blog.comments}
                  </span>
                  
                  <Link
                    to={`/blog/${blog.slug || blog.id}`}
                    className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 hover:bg-indigo-600 hover:text-white transition group/btn"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5 group-hover/btn:rotate-45 transition-transform" />
                  </Link>
                </div>

              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Trending;
