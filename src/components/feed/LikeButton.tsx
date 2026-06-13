import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocial } from '../../hooks/useSocial';
import { useAuth } from '../../store/AuthContext';
import { toast } from 'sonner';

interface LikeButtonProps {
  blogId: number;
  likeCount: number;
  compact?: boolean;
}

export const LikeButton: React.FC<LikeButtonProps> = ({ blogId, likeCount, compact = false }) => {
  const { user } = useAuth();
  const { toggleLike, isTogglingLike, isBlogLiked } = useSocial();
  const [showBurst, setShowBurst] = useState(false);

  const liked = user ? isBlogLiked(blogId, user.id) : false;

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please sign in to like posts');
      return;
    }
    if (isTogglingLike) return;

    if (!liked) {
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 600);
    }

    try {
      await toggleLike({ blogId, userId: user.id });
    } catch {
      toast.error('Failed to update like');
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isTogglingLike}
      className={`relative flex items-center gap-1.5 group transition-all duration-200 ${
        compact ? 'text-xs' : 'text-sm'
      } ${liked ? 'text-rose-500' : 'text-slate-500 dark:text-slate-400 hover:text-rose-500'}`}
      title={liked ? 'Unlike' : 'Like'}
    >
      {/* Burst particles */}
      <AnimatePresence>
        {showBurst && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0],
                  x: Math.cos((i * 60 * Math.PI) / 180) * 20,
                  y: Math.sin((i * 60 * Math.PI) / 180) * 20,
                }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="absolute w-1.5 h-1.5 rounded-full bg-rose-500 pointer-events-none"
              />
            ))}
          </>
        )}
      </AnimatePresence>

      <motion.div
        animate={liked ? { scale: [1, 1.4, 0.9, 1.1, 1] } : { scale: 1 }}
        transition={{ duration: 0.4, type: 'spring' }}
      >
        <Heart
          className={`${compact ? 'h-4 w-4' : 'h-5 w-5'} transition-all duration-200 ${
            liked ? 'fill-rose-500 text-rose-500' : 'group-hover:text-rose-500'
          }`}
        />
      </motion.div>
      <span className="font-semibold tabular-nums">{likeCount}</span>
    </button>
  );
};

export default LikeButton;
