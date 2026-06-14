import React from 'react';
import { BlogCard } from './BlogCard';
import { BlogCardSkeleton } from './BlogCardSkeleton';
import type { BlogResponse } from '../../types';
import { BookOpen, LogIn } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/routes';

interface BlogGridProps {
  blogs: BlogResponse[];
  isLoading: boolean;
  emptyMessage?: string;
  skeletonCount?: number;
}

export const BlogGrid: React.FC<BlogGridProps> = ({
  blogs,
  isLoading,
  emptyMessage = 'No blogs found matching this query.',
  skeletonCount = 6,
}) => {
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <BlogCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!user) {
    return (
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
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/20 dark:bg-slate-900/10 backdrop-blur-md text-center max-w-lg mx-auto mt-6">
        <BookOpen className="h-10 w-10 text-slate-400 mb-3" />
        <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">Nothing here yet</h3>
        <p className="text-xs text-slate-500 mt-1">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogGrid;
