import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import type { BlogResponse } from '../../types';
import { getImageUrl } from '../../utils/image';

// ─── Animated Counter ─────────────────────────────────────────────────────────
export const AnimatedCounter: React.FC<{ value: number }> = ({ value }) => {
  const [count, setCount] = React.useState(0);
  const [prevValue, setPrevValue] = React.useState(value);

  if (value !== prevValue) {
    setPrevValue(value);
    setCount(0);
  }

  React.useEffect(() => {
    const end = value;
    if (end === 0) {
      return;
    }

    const duration = 1.0; // seconds
    const totalFrames = Math.min(end, 50);
    const frameDuration = (duration * 1000) / totalFrames;
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Ease out quad
      const currentCount = Math.round(end * (progress * (2 - progress)));
      setCount(currentCount);

      if (frame === totalFrames) {
        clearInterval(counter);
        setCount(end);
      }
    }, frameDuration);

    return () => clearInterval(counter);
  }, [value]);

  return <span>{count.toLocaleString()}</span>;
};

// ─── Avatar ──────────────────────────────────────────────────────────────────
export const Avatar: React.FC<{ src?: string; name: string; size?: 'sm' | 'md' | 'lg' | 'xl' }> = ({
  src, name, size = 'md'
}) => {
  const sizeMap = { sm: 'h-9 w-9 text-sm', md: 'h-14 w-14 text-lg', lg: 'h-20 w-20 text-2xl', xl: 'h-32 w-32 sm:h-64 sm:w-64 text-3xl sm:text-6xl' };
  const initials = name.slice(0, 2).toUpperCase();
  const resolvedSrc = getImageUrl(src);
  const [imgError, setImgError] = React.useState(false);
  const [prevSrc, setPrevSrc] = React.useState(src);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setImgError(false);
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 1 }}
      whileTap={{ scale: 0.98 }}
      className="w-fit h-fit shrink-0 cursor-pointer"
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      {resolvedSrc && !imgError ? (
        <img 
          src={resolvedSrc} 
          alt={name} 
          onError={() => setImgError(true)}
          className={`${sizeMap[size]} rounded-2xl object-cover ring-2 ring-white dark:ring-slate-800 shadow-md`} 
        />
      ) : (
        <div className={`${sizeMap[size]} rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-bold text-white ring-2 ring-white dark:ring-slate-800 shadow-md`}>
          {initials}
        </div>
      )}
    </motion.div>
  );
};

// ─── Social Link ─────────────────────────────────────────────────────────────
const colorMap: Record<string, string> = {
  teal:   'bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-950/50 hover:border-teal-400',
  blue:   'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/50 hover:border-blue-400',
  purple: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-950/50 hover:border-purple-400',
  rose:   'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/50 hover:border-rose-400',
  amber:  'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/50 hover:border-amber-400',
  default:'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-500',
};

export const SocialLink: React.FC<{ href?: string; icon: React.ReactNode; label: string; color?: string }> = ({ href, icon, label, color }) => {
  if (!href) return null;
  const colorClasses = colorMap[color || 'default'] || colorMap.default;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" title={label}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-200 hover:scale-105 ${colorClasses}`}>
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
};

// ─── Stat Chip ───────────────────────────────────────────────────────────────
export const StatChip: React.FC<{ value: number | string; label: string; icon?: React.ReactNode }> = ({ value, label, icon }) => (
  <div className="flex flex-col items-center gap-0.5 px-5 py-3 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60">
    {icon && <div className="text-indigo-500 mb-0.5">{icon}</div>}
    <span className="text-xl font-black text-slate-800 dark:text-slate-100">
      {typeof value === 'number' ? <AnimatedCounter value={value} /> : value}
    </span>
    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{label}</span>
  </div>
);

// ─── Blog Mini Card ───────────────────────────────────────────────────────────
export const BlogMiniCard: React.FC<{ blog: BlogResponse | { id: number; title: string; slug: string | null } }> = ({ blog }) => {
  const b = blog as BlogResponse;
  return (
    <Link to={`/blog/${b.slug || b.id}`}
      className="group flex gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all duration-200 border border-transparent hover:border-slate-200/60 dark:hover:border-slate-700/60">
      <div className="h-14 w-14 shrink-0 rounded-lg bg-slate-200 dark:bg-slate-800 overflow-hidden">
        {b.thumbnailUrl && <img src={b.thumbnailUrl} alt={b.title} className="h-full w-full object-cover" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-500 transition-colors line-clamp-2 leading-snug">
          {b.title}
        </p>
        <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
          {b.views !== undefined && <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{b.views}</span>}
          {b.likes !== undefined && <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{b.likes}</span>}
        </div>
      </div>
    </Link>
  );
};
