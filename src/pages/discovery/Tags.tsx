import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Tag, Search, Hash, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBlogs } from '../../hooks/useBlogs';

export const Tags: React.FC = () => {
  const { useBlogsQuery } = useBlogs();
  const { data: blogs = [], isLoading } = useBlogsQuery();

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = 'Browse Tags | GenzVerse';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Find GenzVerse articles by looking through keywords, developer hashes, and content tags created by writers.');
    }
  }, []);

  // Compute tag counts and frequencies
  const tagsList = useMemo(() => {
    const counts: Record<string, number> = {};
    blogs.forEach((blog) => {
      if (blog.tags && Array.isArray(blog.tags)) {
        blog.tags.forEach((tag) => {
          if (tag) {
            const cleaned = tag.trim();
            counts[cleaned] = (counts[cleaned] || 0) + 1;
          }
        });
      }
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count); // sort by popular tags
  }, [blogs]);

  // Client side search filtering on tags list
  const filteredTags = tagsList.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 px-1">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-4 border-b border-slate-100 dark:border-slate-800/80"
      >
        <div>
          <div className="flex items-center gap-2 text-purple-500 font-bold text-xs uppercase tracking-widest">
            <Tag className="h-4 w-4" />
            <span>Keywords</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight mt-1 text-slate-900 dark:text-slate-100">
            Browse Tags
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Discover popular publication themes by looking through developer tags.
          </p>
        </div>

        {/* Filter input */}
        <div className="relative w-full sm:max-w-xs shrink-0">
          <input
            type="text"
            placeholder="Filter tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-white/60 dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs font-semibold placeholder-slate-450 shadow-sm"
          />
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-450 dark:text-slate-650" />
        </div>
      </motion.div>

      {/* Popular Tags List */}
      <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="text-xs font-black text-slate-450 uppercase tracking-widest pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-purple-500" />
          <span>Active Tag Index</span>
        </h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          </div>
        ) : filteredTags.length === 0 ? (
          <p className="text-xs text-slate-400 italic text-center py-6">No tags match your search filter.</p>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {filteredTags.map((tag, index) => {
              // Calculate a visual weighting class based on frequency
              const isPopular = tag.count >= 3;
              const weightClass = isPopular
                ? 'bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200/30'
                : 'bg-slate-100/60 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 border-slate-200/50 dark:border-slate-800/60';

              return (
                <motion.div
                  key={tag.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(index * 0.015, 0.3) }}
                  whileHover={{ scale: 1.05 }}
                  className="w-fit h-fit"
                >
                  <Link
                    to={`/tag/${tag.name.toLowerCase()}`}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition shadow-sm ${weightClass}`}
                  >
                    <Hash className="h-3 w-3 text-pink-500" />
                    <span>{tag.name}</span>
                    <span className="text-[9px] opacity-60 bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded-md font-bold">
                      {tag.count}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default Tags;
