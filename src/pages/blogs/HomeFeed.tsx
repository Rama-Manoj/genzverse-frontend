import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { FeedPage } from '../../components/feed/FeedPage';
import { Loader2, Zap, BookOpen, Users, ArrowRight, TrendingUp, Star, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { ROUTES } from '../../routes/routes';

// ─── Guest Landing Page ─────────────────────────────────────────────────────
const GuestLanding: React.FC = () => {
  const features = [
    { icon: <BookOpen className="h-5 w-5" />, title: 'Rich Creator Blogs', desc: 'Read in-depth articles from Gen-Z creators on tech, design, career, and lifestyle.' },
    { icon: <TrendingUp className="h-5 w-5" />, title: 'Trending Content', desc: 'Discover what\'s hot right now — sorted by views, likes, and comments.' },
    { icon: <Users className="h-5 w-5" />, title: 'Follow Creators', desc: 'Build your own feed by following the creators that matter to you.' },
    { icon: <Zap className="h-5 w-5" />, title: 'Instant Notifications', desc: 'Never miss a new post from your favourite creators with real-time alerts.' },
    { icon: <Star className="h-5 w-5" />, title: 'Save & Bookmark', desc: 'Save any post to your personal reading list to revisit whenever you want.' },
    { icon: <Globe className="h-5 w-5" />, title: 'Explore by Topic', desc: 'Browse content by categories and tags to find exactly what you\'re looking for.' },
  ];

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative flex flex-col items-center justify-center text-center py-24 px-4 overflow-hidden"
      >
        {/* Background gradient blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/15 dark:bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/15 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-500/10 dark:bg-pink-500/8 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
        </div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-wide mb-6"
        >
          <Zap className="h-3.5 w-3.5" />
          <span>The next-gen creator platform</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none mb-6"
        >
          <span className="text-slate-800 dark:text-slate-100">Where Gen-Z</span>
          <br />
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Creators Shine
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-xl text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-10"
        >
          GenzVerse is the home for bold ideas, raw creativity, and authentic voices.
          Read, write, follow, and connect with the creators defining tomorrow.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <Link
            to={ROUTES.REGISTER}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-500 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-200"
          >
            <span>Start Writing Free</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to={ROUTES.LOGIN}
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-900 transition-all duration-200"
          >
            <span>Sign In</span>
          </Link>
        </motion.div>

        {/* Social proof */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-xs text-slate-400 dark:text-slate-500"
        >
          Free forever · No credit card required
        </motion.p>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="max-w-5xl mx-auto px-4 pb-20"
      >
        <h2 className="text-center text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 mb-10">
          Everything a creator needs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.07 }}
              className="group p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm hover:border-indigo-300/50 dark:hover:border-indigo-700/50 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-200">
                  {f.icon}
                </div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">{f.title}</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// ─── Authenticated Feed (social media style) ─────────────────────────────────
// Handled by FeedPage component in src/components/feed/FeedPage.tsx

// ─── Main Export ─────────────────────────────────────────────────────────────
export const HomeFeed: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return isAuthenticated ? <FeedPage /> : <GuestLanding />;
};
export default HomeFeed;

