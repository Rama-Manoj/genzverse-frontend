import React, { useState, useEffect } from 'react';
import { X, Send, Loader2, CornerDownRight, Trash2, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useComments } from '../../hooks/useComments';
import { useAuth } from '../../store/AuthContext';
import { toast } from 'sonner';
import type { CommentResponse } from '../../types';

interface CommentDrawerProps {
  blogId: number;
  blogTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

const CommentItem: React.FC<{
  comment: CommentResponse;
  onDelete: (id: number) => void;
  onReply: (id: number, username: string) => void;
  currentUsername?: string;
  isAdmin?: boolean;
}> = ({ comment, onDelete, onReply, currentUsername, isAdmin }) => {
  const canDelete = currentUsername === comment.username || isAdmin;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -15 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="space-y-2"
    >
      <div className="flex items-start gap-2.5">
        <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-[10px] font-bold text-white flex items-center justify-center uppercase shrink-0">
          {comment.username.substring(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl rounded-tl-sm px-3 py-2">
            <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
              {comment.username}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed break-words">
              {comment.content}
            </p>
          </div>
          <div className="flex items-center gap-3 mt-1 pl-1">
            <span className="text-[10px] text-slate-400">
              {new Date(comment.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <button
              onClick={() => onReply(comment.id, comment.username)}
              className="text-[10px] font-bold text-indigo-500 hover:text-indigo-600 flex items-center gap-0.5"
            >
              <CornerDownRight className="h-2.5 w-2.5" />
              Reply
            </button>
            {canDelete && (
              <button
                onClick={() => onDelete(comment.id)}
                className="text-[10px] font-bold text-rose-400 hover:text-rose-600 flex items-center gap-0.5"
              >
                <Trash2 className="h-2.5 w-2.5" />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-9 space-y-2 border-l-2 border-slate-200 dark:border-slate-700/60 pl-3 overflow-hidden">
          <AnimatePresence initial={false}>
            {comment.replies.map(reply => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onDelete={onDelete}
                onReply={onReply}
                currentUsername={currentUsername}
                isAdmin={isAdmin}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export const CommentDrawer: React.FC<CommentDrawerProps> = ({
  blogId,
  blogTitle,
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const { comments, addComment, deleteComment, isAdding, isLoading } = useComments(blogId);
  const [text, setText] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: number; username: string } | null>(null);

  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Keyboard adjust via visual viewport API
  useEffect(() => {
    if (!window.visualViewport) return;
    const handleResize = () => {
      const vv = window.visualViewport;
      if (vv) {
        setViewportHeight(vv.height);
        const offset = window.innerHeight - vv.height;
        setKeyboardHeight(offset > 50 ? offset : 0);
      }
    };
    window.visualViewport.addEventListener('resize', handleResize);
    window.visualViewport.addEventListener('scroll', handleResize);
    handleResize();
    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('scroll', handleResize);
    };
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to comment');
      return;
    }
    const trimmed = text.trim();
    if (!trimmed) return;

    try {
      await addComment({
        content: trimmed,
        parentCommentId: replyingTo ? replyingTo.id : null,
        username: user.username,
      });
      setText('');
      setReplyingTo(null);
      toast.success('Comment posted!');
    } catch {
      toast.error('Failed to post comment');
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      await deleteComment(commentId);
      toast.success('Comment deleted');
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-slate-950/50 backdrop-blur-sm"
          />

          {/* Drawer — slides up from bottom on mobile, slides from right on desktop */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed left-0 right-0 z-[100] md:hidden bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl flex flex-col"
            style={{ 
              bottom: keyboardHeight,
              maxHeight: `${viewportHeight * 0.85}px`
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
            </div>

            <CommentDrawerContent
              blogTitle={blogTitle}
              comments={comments}
              isLoading={isLoading}
              isAdding={isAdding}
              user={user}
              text={text}
              replyingTo={replyingTo}
              onTextChange={setText}
              onReply={setReplyingTo}
              onCancelReply={() => setReplyingTo(null)}
              onSubmit={handleSubmit}
              onDelete={handleDelete}
              onClose={onClose}
            />
          </motion.div>

          {/* Desktop right panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-[100] hidden md:flex flex-col w-[420px] bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200/60 dark:border-slate-800/60"
          >
            <CommentDrawerContent
              blogTitle={blogTitle}
              comments={comments}
              isLoading={isLoading}
              isAdding={isAdding}
              user={user}
              text={text}
              replyingTo={replyingTo}
              onTextChange={setText}
              onReply={setReplyingTo}
              onCancelReply={() => setReplyingTo(null)}
              onSubmit={handleSubmit}
              onDelete={handleDelete}
              onClose={onClose}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

interface ContentProps {
  blogTitle: string;
  comments: CommentResponse[];
  isLoading: boolean;
  isAdding: boolean;
  user: { username: string; role?: string } | null;
  text: string;
  replyingTo: { id: number; username: string } | null;
  onTextChange: (v: string) => void;
  onReply: (val: { id: number; username: string } | null) => void;
  onCancelReply: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete: (id: number) => void;
  onClose: () => void;
}

const CommentDrawerContent: React.FC<ContentProps> = ({
  blogTitle,
  comments,
  isLoading,
  isAdding,
  user,
  text,
  replyingTo,
  onTextChange,
  onReply,
  onCancelReply,
  onSubmit,
  onDelete,
  onClose,
}) => (
  <>
    {/* Header */}
    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
      <div>
        <h3 className="font-black text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <MessageSquare className="h-4.5 w-4.5 text-indigo-500" />
          Comments ({comments.length})
        </h3>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-60 mt-0.5">
          {blogTitle}
        </p>
      </div>
      <button
        onClick={onClose}
        className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-500"
      >
        <X className="h-4.5 w-4.5" />
      </button>
    </div>

    {/* Comments list */}
    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
        </div>
      ) : comments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <MessageSquare className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-3" />
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            No comments yet
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <AnimatePresence initial={false}>
          {comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onDelete={onDelete}
              onReply={(id, username) => onReply({ id, username })}
              currentUsername={user?.username}
              isAdmin={user?.role === 'ADMIN'}
            />
          ))}
        </AnimatePresence>
      )}
    </div>

    {/* Input area */}
    <div className="shrink-0 px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      {replyingTo && (
        <div className="flex items-center gap-2 mb-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-xs text-indigo-600 dark:text-indigo-400">
          <CornerDownRight className="h-3 w-3" />
          <span>Replying to <strong>@{replyingTo.username}</strong></span>
          <button onClick={onCancelReply} className="ml-auto">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {user ? (
        <form onSubmit={onSubmit} className="flex items-end gap-2">
          <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-[10px] font-bold text-white flex items-center justify-center uppercase shrink-0">
            {user.username.substring(0, 2)}
          </div>
          <div className="flex-1 relative">
            <textarea
              value={text}
              onChange={e => onTextChange(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  // Only submit on Enter for desktop/tablet screens
                  if (window.innerWidth >= 768) {
                    e.preventDefault();
                    onSubmit(e as unknown as React.FormEvent);
                  }
                }
              }}
              rows={1}
              placeholder="Add a comment..."
              className="w-full px-3.5 py-2.5 pr-10 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>
          <button
            type="submit"
            disabled={isAdding || !text.trim()}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 shadow-md transition-all disabled:opacity-50 shrink-0"
          >
            {isAdding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </form>
      ) : (
        <p className="text-xs text-center text-slate-500 dark:text-slate-400 py-2">
          <a href="/login" className="text-indigo-500 font-semibold hover:underline">Sign in</a> to join the discussion
        </p>
      )}
    </div>
  </>
);

export default CommentDrawer;
