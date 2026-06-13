import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useBlogs } from '../../hooks/useBlogs';
import { useAuth } from '../../store/AuthContext';
import { SocialBlogCard } from './SocialBlogCard';
import { TrendingSidebar } from './TrendingSidebar';
import { SuggestedAuthors } from './SuggestedAuthors';
import { Loader2, PenLine, Compass, Hash } from 'lucide-react';
import { motion } from 'framer-motion';
import { ROUTES } from '../../routes/routes';

const CATEGORIES = [
  { label: 'All', value: '' },
  { label: '⚡ Technology', value: 'Technology' },
  { label: '🎨 Design', value: 'Design' },
  { label: '💼 Lifestyle', value: 'Lifestyle' },
  { label: '🚀 Career', value: 'Career' },
  { label: '🤖 AI', value: 'AI' },
  { label: '📱 Mobile', value: 'Mobile' },
];

const MotionLink = motion(Link);

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06
    }
  }
};

const PAGE_SIZE = 5;

export const FeedPage: React.FC = () => {
  const { user } = useAuth();
  const { useBlogsQuery, useBlogsByCategoryQuery } = useBlogs();

  const [activeCategory, setActiveCategory] = useState('');
  const [displayLimit, setDisplayLimit] = useState(PAGE_SIZE);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  const allBlogsQuery = useBlogsQuery();
  const categoryQuery = useBlogsByCategoryQuery(activeCategory);

  const { data: allBlogs, isLoading } = activeCategory
    ? { data: categoryQuery.data, isLoading: categoryQuery.isLoading }
    : allBlogsQuery;

  const visibleBlogs = allBlogs ? allBlogs.slice(0, displayLimit) : [];
  const hasMore = allBlogs ? visibleBlogs.length < allBlogs.length : false;

  // Reset display limit when category changes (handled by key prop on feed)
  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    if (!hasMore || isLoading) return;
    const el = observerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loadingRef.current) {
          loadingRef.current = true;
          setTimeout(() => {
            setDisplayLimit(prev => prev + PAGE_SIZE);
            loadingRef.current = false;
          }, 500);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isLoading]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="h-5 w-5 text-purple-500 drop-shadow-[0_0_6px_rgba(168,85,247,0.3)]" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
              Your Feed
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Discover bold ideas from Gen-Z creators
          </p>
        </div>
        <MotionLink
          to={ROUTES.CREATE_BLOG}
          whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(168, 85, 247, 0.35)" }}
          whileTap={{ scale: 0.95 }}
          className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-bold shadow-lg shadow-purple-500/20"
        >
          <PenLine className="h-4 w-4" />
          Write
        </MotionLink>
      </div>

      {/* ── Category Pills ──────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {CATEGORIES.map(cat => (
          <motion.button
            key={cat.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setActiveCategory(cat.value);
              setDisplayLimit(PAGE_SIZE);
            }}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 border ${
              activeCategory === cat.value
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white border-transparent shadow-md shadow-purple-500/20'
                : 'bg-white/40 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-purple-400 hover:text-purple-600'
            }`}
          >
            {activeCategory !== cat.value && cat.value && <Hash className="h-2.5 w-2.5 text-pink-500" />}
            <span>{cat.label}</span>
          </motion.button>
        ))}
      </div>

      {/* ── Main Grid ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* ── Feed Column ─────────────────────────────────────── */}
        <div className="xl:col-span-7 space-y-5">
          {isLoading ? (
            // Skeleton cards
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/30 dark:bg-slate-900/30 backdrop-blur-md rounded-3xl border border-white/20 dark:border-slate-800/40 p-5 space-y-4 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full w-24" />
                    <div className="h-2.5 bg-slate-150 dark:bg-slate-700 rounded-full w-32" />
                  </div>
                  <div className="h-7 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
                </div>
                <div className="aspect-video bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-3/4" />
                  <div className="h-3 bg-slate-150 dark:bg-slate-700 rounded-full w-full" />
                  <div className="h-3 bg-slate-150 dark:bg-slate-700 rounded-full w-2/3" />
                </div>
                <div className="flex gap-6 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="h-5 w-12 bg-slate-200 dark:bg-slate-800 rounded-full" />
                  <div className="h-5 w-12 bg-slate-200 dark:bg-slate-800 rounded-full" />
                  <div className="h-5 w-12 bg-slate-200 dark:bg-slate-800 rounded-full" />
                </div>
              </div>
            ))
          ) : !allBlogs || allBlogs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 space-y-4"
            >
              <div className="text-6xl">📭</div>
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">
                {activeCategory ? `No posts in ${activeCategory}` : 'No posts yet'}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                {activeCategory
                  ? 'Try a different category or check back later.'
                  : 'Be the first to publish something amazing!'}
              </p>
              {user && (
                <MotionLink
                  to={ROUTES.CREATE_BLOG}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-bold shadow-lg"
                >
                  <PenLine className="h-4 w-4" />
                  Write first post
                </MotionLink>
              )}
            </motion.div>
          ) : (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-5 mb-5"
              >
                {visibleBlogs.map((blog, i) => (
                  <SocialBlogCard key={blog.id} blog={blog} index={i} />
                ))}
              </motion.div>

              {/* Infinite scroll sentinel */}
              {hasMore && (
                <div ref={observerRef} className="flex justify-center py-8">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                    <span>Loading more posts...</span>
                  </div>
                </div>
              )}

              {!hasMore && allBlogs.length > 0 && (
                <div className="text-center py-10">
                  <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
                    🎉 You've seen all posts!
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Right Sidebar ────────────────────────────────────── */}
        <div className="hidden xl:block xl:col-span-5">
          <div className="sticky top-6 flex flex-col gap-5 max-h-[calc(100vh-6rem)] overflow-y-auto pb-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 scrollbar-track-transparent pr-1">
            <TrendingSidebar />
            <SuggestedAuthors />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedPage;
