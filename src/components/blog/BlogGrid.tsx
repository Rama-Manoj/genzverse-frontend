import React from 'react';
import { BlogCard } from './BlogCard';
import { BlogCardSkeleton } from './BlogCardSkeleton';
import type { BlogResponse } from '../../types';
import { BookOpen } from 'lucide-react';

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
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <BlogCardSkeleton key={i} />
        ))}
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
