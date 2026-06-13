import React from 'react';

export const BlogCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md rounded-2xl p-0 overflow-hidden shadow-sm animate-pulse">
      {/* Thumbnail Aspect */}
      <div className="aspect-video w-full bg-slate-200 dark:bg-slate-800" />
      
      {/* Content Area */}
      <div className="flex flex-col flex-1 p-5 space-y-3">
        {/* Category / tags pulse */}
        <div className="flex gap-1.5">
          <div className="h-4.5 w-12 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="h-4.5 w-10 rounded-full bg-slate-200 dark:bg-slate-800" />
        </div>
        
        {/* Title pulse */}
        <div className="space-y-1.5 pt-1.5">
          <div className="h-5 w-full rounded-md bg-slate-200 dark:bg-slate-800" />
          <div className="h-5 w-4/5 rounded-md bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Content text pulse */}
        <div className="space-y-1.5 flex-1 pt-1">
          <div className="h-3.5 w-full rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3.5 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Footer meta pulse */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="h-6.5 w-6.5 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="space-y-1">
              <div className="h-3.5 w-14 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-2.5 w-10 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-7 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-7 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default BlogCardSkeleton;
