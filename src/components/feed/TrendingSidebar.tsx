import React from 'react';
import { Link } from 'react-router-dom';
import { useBlogs } from '../../hooks/useBlogs';
import { TrendingUp, Eye, Heart, MessageSquare, Flame } from 'lucide-react';

type TabType = 'views' | 'likes' | 'comments';

const tabConfig: { key: TabType; label: string; icon: React.ReactNode }[] = [
  { key: 'views', label: 'Popular', icon: <Eye className="h-3 w-3" /> },
  { key: 'likes', label: 'Liked', icon: <Heart className="h-3 w-3" /> },
  { key: 'comments', label: 'Discussed', icon: <MessageSquare className="h-3 w-3" /> },
];

export const TrendingSidebar: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<TabType>('views');
  const { useTrendingBlogsQuery } = useBlogs();
  const { data: trending, isLoading } = useTrendingBlogsQuery(activeTab);

  const displayBlogs = trending || [];

  return (
    <div className="no-hover bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
        <div className="p-1.5 rounded-xl bg-orange-100 dark:bg-orange-950/40">
          <Flame className="h-4 w-4 text-orange-500" />
        </div>
        <h3 className="font-black text-sm text-slate-800 dark:text-slate-100">Trending Feed</h3>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 dark:border-slate-800">
        {tabConfig.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-[11px] font-bold transition-colors no-hover ${
              activeTab === tab.key
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* List */}
      <div className="p-3 pb-2 space-y-1 max-h-[260px] overflow-y-auto scrollbar-none">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2 animate-pulse">
                <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full w-full" />
                  <div className="h-2 bg-slate-150 dark:bg-slate-800/60 rounded-full w-2/3" />
                </div>
              </div>
            ))
          : (
              <>
                {displayBlogs.map((blog, i) => (
                  <Link
                    key={blog.id}
                    to={`/blog/${blog.slug || blog.id}`}
                    className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
                  >
                    {/* Rank */}
                    <div
                      className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${
                        i === 0
                          ? 'bg-orange-100 dark:bg-orange-950/50 text-orange-600'
                          : i === 1
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          : i === 2
                          ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-700'
                          : 'text-slate-400 dark:text-slate-500 text-[10px]'
                      }`}
                    >
                      {i + 1}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                        {blog.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                        <span className="font-medium">{blog.author}</span>
                        <span>·</span>
                        <span className="flex items-center gap-0.5">
                          {activeTab === 'views' ? (
                            <><Eye className="h-2.5 w-2.5" /> {blog.views}</>
                          ) : activeTab === 'likes' ? (
                            <><Heart className="h-2.5 w-2.5" /> {blog.likes}</>
                          ) : (
                            <><MessageSquare className="h-2.5 w-2.5" /> {blog.comments}</>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Thumbnail */}
                    {blog.thumbnailUrl && (
                      <div className="h-10 w-10 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
                        <img
                          src={blog.thumbnailUrl}
                          alt={blog.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  </Link>
                ))}
                <div className="h-12 w-full block shrink-0" aria-hidden="true" />
              </>
            )}
      </div>

      {/* View all */}
      <div className="px-5 pb-4">
        <Link
          to="/category/trending"
          className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-500 hover:text-indigo-600 transition-colors"
        >
          <TrendingUp className="h-3 w-3" />
          See more trending
        </Link>
      </div>
    </div>
  );
};

export default TrendingSidebar;
