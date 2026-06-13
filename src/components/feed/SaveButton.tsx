import React from 'react';
import { Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSavedBlogs } from '../../hooks/useSavedBlogs';
import { useAuth } from '../../store/AuthContext';
import { toast } from 'sonner';

interface SaveButtonProps {
  blogId: number;
  compact?: boolean;
}

export const SaveButton: React.FC<SaveButtonProps> = ({ blogId, compact = false }) => {
  const { user } = useAuth();
  const { savedBlogs, toggleSave, isTogglingSave } = useSavedBlogs();

  const isSaved = savedBlogs.some(b => b.id === blogId);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please sign in to save posts');
      return;
    }
    if (isTogglingSave) return;
    try {
      await toggleSave(blogId);
      toast.success(isSaved ? 'Removed from saved' : 'Saved to your collection!');
    } catch {
      toast.error('Failed to update save');
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={isTogglingSave}
      title={isSaved ? 'Remove from saved' : 'Save post'}
      className={`flex items-center justify-center rounded-full transition-all duration-200 group ${
        compact ? 'p-1.5' : 'p-2'
      } ${
        isSaved
          ? 'text-amber-500'
          : 'text-slate-400 dark:text-slate-500 hover:text-amber-500 hover:bg-amber-500/10'
      }`}
    >
      <motion.div
        animate={isSaved ? { scale: [1, 1.3, 0.95, 1.05, 1] } : { scale: 1 }}
        transition={{ duration: 0.35, type: 'spring', stiffness: 400 }}
      >
        <Bookmark
          className={`${compact ? 'h-4 w-4' : 'h-5 w-5'} transition-all duration-200 ${
            isSaved ? 'fill-amber-500 text-amber-500' : ''
          }`}
        />
      </motion.div>
    </button>
  );
};

export default SaveButton;
