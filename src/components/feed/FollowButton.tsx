import React, { useState } from 'react';
import { UserPlus, UserCheck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSocial } from '../../hooks/useSocial';
import { useAuth } from '../../store/AuthContext';
import { toast } from 'sonner';

interface FollowButtonProps {
  targetUserId: number;
  targetUsername?: string;
  compact?: boolean;
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  targetUserId,
  targetUsername = 'this author',
  compact = false,
}) => {
  const { user } = useAuth();
  const { useFollowingQuery, toggleFollow, isTogglingFollow } = useSocial();
  const { data: followingList } = useFollowingQuery(user?.id || 0);
  const [optimisticState, setOptimisticState] = useState<boolean | null>(null);

  // Don't show if not logged in or it's own profile
  if (!user || user.id === targetUserId) return null;

  const isFollowingFromCache = followingList?.some(u => u.id === targetUserId) ?? false;
  const isFollowing = optimisticState !== null ? optimisticState : isFollowingFromCache;

  const handleFollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isTogglingFollow) return;

    const newState = !isFollowing;
    setOptimisticState(newState);

    try {
      await toggleFollow({ targetUserId, currentUserId: user.id });
      toast.success(newState ? `Following ${targetUsername}` : `Unfollowed ${targetUsername}`);
    } catch {
      setOptimisticState(!newState); // rollback
      toast.error('Failed to update follow status');
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleFollow}
      disabled={isTogglingFollow}
      className={`flex items-center gap-1 font-semibold rounded-full border transition-all duration-200 ${
        compact ? 'text-xs px-2.5 py-1' : 'text-xs px-3.5 py-1.5'
      } ${
        isFollowing
          ? 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-rose-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20'
          : 'bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-500 shadow-sm shadow-indigo-500/25'
      }`}
    >
      {isTogglingFollow ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : isFollowing ? (
        <>
          <UserCheck className="h-3 w-3" />
          <span>Following</span>
        </>
      ) : (
        <>
          <UserPlus className="h-3 w-3" />
          <span>Follow</span>
        </>
      )}
    </motion.button>
  );
};

export default FollowButton;
