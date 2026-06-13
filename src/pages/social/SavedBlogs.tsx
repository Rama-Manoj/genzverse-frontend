import React from 'react';
import { useSavedBlogs } from '../../hooks/useSavedBlogs';
import { BlogGrid } from '../../components/blog/BlogGrid';
import { Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';

export const SavedBlogs: React.FC = () => {
  const { savedBlogs, isLoading } = useSavedBlogs();

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-1">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs uppercase tracking-widest">
            <Bookmark className="h-4 w-4" />
            <span>Reading List</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight mt-1 text-slate-900 dark:text-slate-100">
            Saved Blogs
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Keep track of articles you've bookmarked to read or reference later.
          </p>
        </div>

        {/* Count Pill */}
        <div className="self-start md:self-auto px-4 py-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 rounded-2xl text-xs font-black">
          Bookmarks: {savedBlogs.length}
        </div>
      </div>

      {/* Grid of Saved Blogs */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="pt-2"
      >
        <BlogGrid 
          blogs={savedBlogs} 
          isLoading={isLoading} 
          emptyMessage="You haven't bookmarked any blogs yet. Tap the bookmark icon on any blog to save it here!"
        />
      </motion.div>
    </div>
  );
};

export default SavedBlogs;
