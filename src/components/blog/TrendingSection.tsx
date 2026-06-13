import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBlogs } from '../../hooks/useBlogs';
import { Eye, Heart, MessageSquare, TrendingUp, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

type SortBy = 'views' | 'likes' | 'comments';

export const TrendingSection: React.FC = () => {
  const [sortBy, setSortBy] = useState<SortBy>('views');
  const { useTrendingBlogsQuery } = useBlogs();
  const { data: trendingBlogs, isLoading } = useTrendingBlogsQuery(sortBy);

  const tabs: { label: string; value: SortBy }[] = [
    { label: 'Popular', value: 'views' },
    { label: 'Liked', value: 'likes' },
    { label: 'Discussed', value: 'comments' },
  ];

  return (
    <div className="bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md rounded-3xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
          <TrendingUp className="h-5 w-5 text-indigo-500" />
          <h2 className="text-lg font-black tracking-tight">Trending Feed</h2>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-100/55 dark:bg-slate-950/45 p-1 rounded-xl w-fit border border-slate-200/20">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSortBy(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                sortBy === tab.value
                  ? 'bg-white dark:bg-slate-850 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative min-h-[200px]">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-indigo-500 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4.5">
            {trendingBlogs && trendingBlogs.length > 0 ? (
              trendingBlogs.slice(0, 5).map((blog, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={blog.id}
                  className="flex items-start gap-4 p-2.5 rounded-2xl hover:bg-white/50 dark:hover:bg-slate-900/40 transition duration-200"
                >
                  {/* Ranking Number */}
                  <span className="text-2xl font-black text-slate-250 dark:text-slate-800 tracking-tight leading-none mt-1 min-w-[28px]">
                    0{index + 1}
                  </span>

                  {/* Title and stats */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/blog/${blog.slug || blog.id}`}
                      className="text-xs font-bold text-slate-800 dark:text-slate-100 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors line-clamp-2 leading-snug"
                    >
                      {blog.title}
                    </Link>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1.5">
                      <span className="font-semibold">{blog.author}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                      <span className="flex items-center gap-1">
                        {sortBy === 'views' && (
                          <>
                            <Eye className="h-3 w-3" />
                            {blog.views}
                          </>
                        )}
                        {sortBy === 'likes' && (
                          <>
                            <Heart className="h-3 w-3" />
                            {blog.likes}
                          </>
                        )}
                        {sortBy === 'comments' && (
                          <>
                            <MessageSquare className="h-3 w-3" />
                            {blog.comments}
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-center py-8 text-xs text-slate-400">No trending blogs reported.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default TrendingSection;
