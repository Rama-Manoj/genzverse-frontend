import React, { useState } from 'react';
import { Share2, Link2, X, Check, Twitter, Linkedin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useBlogs } from '../../hooks/useBlogs';

interface ShareDialogProps {
  blogId: number;
  blogTitle: string;
  blogSlug?: string;
  shareCount?: number;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({
  blogId,
  blogTitle,
  blogSlug,
  shareCount = 0,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { shareBlog } = useBlogs();

  const blogUrl = `${window.location.origin}/blog/${blogSlug || blogId}`;

  const handleOpen = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(prev => !prev);
    // Call share API in background to increment counter
    try {
      await shareBlog(blogId);
    } catch {
      // ignore
    }
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(blogUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 1500);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const shareOptions = [
    {
      label: 'Copy Link',
      icon: copied ? Check : Link2,
      color: 'text-slate-700 dark:text-slate-300',
      bg: 'hover:bg-slate-100 dark:hover:bg-slate-800',
      action: handleCopy,
    },
    {
      label: 'Share on X',
      icon: Twitter,
      color: 'text-sky-500',
      bg: 'hover:bg-sky-50 dark:hover:bg-sky-950/20',
      action: (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(blogTitle)}&url=${encodeURIComponent(blogUrl)}`,
          '_blank'
        );
        setIsOpen(false);
      },
    },
    {
      label: 'Share on LinkedIn',
      icon: Linkedin,
      color: 'text-blue-600',
      bg: 'hover:bg-blue-50 dark:hover:bg-blue-950/20',
      action: (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(blogUrl)}`,
          '_blank'
        );
        setIsOpen(false);
      },
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors group"
        title="Share"
      >
        <Share2 className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
        <span className="font-semibold tabular-nums">{shareCount}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 8 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-8 left-0 z-50 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Share post</span>
                <button
                  onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                  className="p-0.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Options */}
              <div className="p-1.5 space-y-0.5">
                {shareOptions.map(option => (
                  <button
                    key={option.label}
                    onClick={option.action}
                    className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${option.color} ${option.bg}`}
                  >
                    <option.icon className="h-3.5 w-3.5 shrink-0" />
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShareDialog;
