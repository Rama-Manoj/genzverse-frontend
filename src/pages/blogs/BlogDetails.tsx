import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBlogs } from '../../hooks/useBlogs';
import { useSocial } from '../../hooks/useSocial';
import { useSavedBlogs } from '../../hooks/useSavedBlogs';
import { useComments } from '../../hooks/useComments';
import { useAuth } from '../../store/AuthContext';
import { 
  Eye, 
  Heart, 
  Bookmark, 
  Share2, 
  Calendar, 
  ArrowLeft,
  Loader2,
  Trash2,
  Edit,
  MessageSquare,
  CornerDownRight,
  Send,
  LogIn,
  BookOpen
} from 'lucide-react';
import { toast } from 'sonner';
import { ROUTES } from '../../routes/routes';
import type { CommentResponse } from '../../types';

export const BlogDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { useBlogSlugQuery, useBlogQuery, deleteBlog, shareBlog } = useBlogs();

  // Determine if the URL parameter is a numeric ID or a text slug
  const isNumericParam = slug ? /^\d+$/.test(slug) : false;
  const numericId = isNumericParam ? Number(slug) : 0;

  // Fetch by ID if the param is numeric, otherwise fetch by slug
  const { data: blogById, isLoading: loadingById, isError: errorById, error: errById } = useBlogQuery(numericId);
  const { data: blogBySlug, isLoading: loadingBySlug, isError: errorBySlug, error: errBySlug } = useBlogSlugQuery(!isNumericParam ? (slug || '') : '');

  // Use whichever one returned data
  const blog = isNumericParam ? blogById : blogBySlug;
  const isLoading = isNumericParam ? loadingById : loadingBySlug;
  const isError = isNumericParam ? errorById : errorBySlug;
  const error = isNumericParam ? errById : errBySlug;

  const { toggleLike, isTogglingLike, isBlogLiked, toggleFollow, isTogglingFollow, useFollowingQuery } = useSocial();
  const { savedBlogs, toggleSave, isTogglingSave } = useSavedBlogs();
  const { comments, addComment, deleteComment, isAdding } = useComments(blog?.id || 0);

  // States for comment inputs
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState<Record<number, string>>({});
  const [replyingToId, setReplyingToId] = useState<number | null>(null);

  // Resolve author ID from userMap to support follow features for any logged in user
  const { useUserMapQuery } = useSocial();
  const { data: userMap } = useUserMapQuery(!!user);
  const authorId = (blog && userMap) ? (userMap[blog.author.toLowerCase()] || 1) : 1;

  const { data: followingList } = useFollowingQuery(user?.id || 0);
  const isFollowing = followingList?.some(u => u.id === authorId) ?? false;

  const liked = (blog && user) ? isBlogLiked(blog.id, user.id) : false;
  const isSaved = blog ? savedBlogs.some(b => b.id === blog.id) : false;

  const handleLike = async () => {
    if (!user) {
      toast.error('Please log in to like posts.');
      return;
    }
    if (!blog) return;
    try {
      await toggleLike({ blogId: blog.id, userId: user.id });
      toast.success(liked ? 'Post unliked' : 'Post liked!');
    } catch {
      toast.error('Failed to update like status.');
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error('Please log in to save posts.');
      return;
    }
    if (!blog) return;
    try {
      await toggleSave(blog.id);
      toast.success(isSaved ? 'Bookmark removed' : 'Post bookmarked!');
    } catch {
      toast.error('Failed to update saved status.');
    }
  };

  const handleFollow = async () => {
    if (!user) {
      toast.error('Please log in to follow creators.');
      return;
    }
    try {
      await toggleFollow({ targetUserId: authorId, currentUserId: user.id });
      toast.success(isFollowing ? `Unfollowed ${blog?.author}` : `Following ${blog?.author}`);
    } catch {
      toast.error('Failed to update follow status.');
    }
  };

  const handleShare = async () => {
    if (!blog) return;
    try {
      const shareData = await shareBlog(blog.id);
      navigator.clipboard.writeText(shareData.shareUrl);
      toast.success('Share link copied to clipboard!');
    } catch {
      toast.error('Failed to copy share link.');
    }
  };

  const handleDelete = async () => {
    if (!blog) return;
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteBlog(blog.id);
        toast.success('Blog deleted successfully.');
        navigate(ROUTES.HOME);
      } catch {
        toast.error('Failed to delete blog.');
      }
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to post comments.');
      return;
    }
    if (!commentText.trim()) return;
    try {
      await addComment({
        content: commentText.trim(),
        parentCommentId: null,
        username: user.username,
      });
      setCommentText('');
      toast.success('Comment posted!');
    } catch {
      toast.error('Failed to post comment.');
    }
  };

  const handleAddReply = async (parentCommentId: number) => {
    if (!user) {
      toast.error('Please log in to post replies.');
      return;
    }
    const text = replyText[parentCommentId]?.trim();
    if (!text) return;
    try {
      await addComment({
        content: text,
        parentCommentId,
        username: user.username,
      });
      setReplyText(prev => ({ ...prev, [parentCommentId]: '' }));
      setReplyingToId(null);
      toast.success('Reply posted!');
    } catch {
      toast.error('Failed to post reply.');
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment(commentId);
        toast.success('Comment deleted.');
      } catch {
        toast.error('Failed to delete comment.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
          <p className="text-sm text-slate-500 animate-pulse">Reading blog contents...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative group max-w-md mx-auto mt-12">
        {/* Ambient background glow */}
        <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-xl group-hover:opacity-35 group-hover:scale-105 transition-all duration-700" />
        
        {/* Main Card */}
        <div className="relative flex flex-col items-center justify-center p-6 rounded-3xl border border-indigo-100/80 dark:border-slate-800/80 bg-gradient-to-br from-indigo-50/95 via-purple-50/90 to-pink-50/95 dark:from-slate-950/95 dark:via-purple-950/25 dark:to-indigo-950/95 backdrop-blur-xl text-center space-y-6 shadow-xl shadow-indigo-100/40 dark:shadow-none transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-purple-500/5">
          {/* Icon with beautiful gradient backdrop */}
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/25 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
            <BookOpen className="h-6 w-6" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-pink-300 font-sans">
              Unlock Article Content
            </h3>
            <div className="h-0.5 w-10 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full opacity-60 group-hover:w-16 transition-all duration-500" />
          </div>
          
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs leading-relaxed font-semibold">
            This publication is exclusive to GenzVerse members. Please sign in to read the complete article and join the developer discussion.
          </p>
          
          <Link
            to={ROUTES.LOGIN}
            className="group/btn relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full overflow-hidden text-white text-xs font-black shadow-md hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 uppercase tracking-wider"
          >
            {/* Button Gradient Backdrop */}
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 transition-all duration-500 group-hover/btn:bg-gradient-to-r group-hover/btn:from-pink-500 group-hover/btn:via-purple-600 group-hover/btn:to-indigo-600" />
            <span className="relative flex items-center gap-2">
              <LogIn className="h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform duration-300" />
              <span>Login to see the content</span>
            </span>
          </Link>
        </div>
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto space-y-4">
        <p className="text-base font-bold text-rose-500">Error reading article</p>
        <p className="text-xs text-slate-500 leading-relaxed">
          {error?.message || 'The blog post you requested could not be loaded.'}
        </p>
        <Link to={ROUTES.HOME} className="inline-flex items-center gap-2 text-sm text-indigo-500 font-semibold hover:underline">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Feed</span>
        </Link>
      </div>
    );
  }

  const isAuthor = user && user.username === blog.author;
  const thumbnailUrl = blog.thumbnailUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=60';

  // Recursive component to render comments and their nested replies
  const CommentNode: React.FC<{ comment: CommentResponse; isReply?: boolean }> = ({ comment, isReply = false }) => {
    const canDelete = user && (user.username === comment.username || user.role === 'ADMIN');
    
    return (
      <div className={`space-y-3 ${isReply ? 'ml-6 sm:ml-10 border-l border-slate-200/50 dark:border-slate-800/50 pl-4 sm:pl-6 pt-2' : 'border-b border-slate-150/45 dark:border-slate-800/45 py-4'}`}>
        <div className="flex items-start justify-between gap-4">
          {/* Avatar and Metadata */}
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 text-[10px] font-bold text-slate-600 dark:text-slate-350 flex items-center justify-center uppercase shadow-sm">
              {comment.username.substring(0, 2)}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{comment.username}</span>
              <span className="text-[9px] text-slate-400">
                {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Delete Button */}
          {canDelete && (
            <button 
              onClick={() => handleDeleteComment(comment.id)}
              className="p-1 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-500/10 transition-colors"
              title="Delete comment"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Content */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium pl-9 whitespace-pre-line">
          {comment.content}
        </p>

        {/* Action Bar (Reply button) */}
        {!isReply && user && (
          <div className="pl-9 flex items-center gap-4">
            <button
              onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
              className="flex items-center gap-1 text-[10px] font-bold text-indigo-500 hover:text-indigo-600 hover:underline"
            >
              <CornerDownRight className="h-3.5 w-3.5" />
              <span>Reply</span>
            </button>
          </div>
        )}

        {/* Reply Form */}
        {replyingToId === comment.id && (
          <div className="pl-9 pt-2 flex items-center gap-2 max-w-lg">
            <input
              type="text"
              value={replyText[comment.id] || ''}
              onChange={(e) => setReplyText(prev => ({ ...prev, [comment.id]: e.target.value }))}
              placeholder={`Reply to ${comment.username}...`}
              className="flex-1 h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs sm:text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddReply(comment.id);
              }}
            />
            <button
              onClick={() => handleAddReply(comment.id)}
              className="flex items-center justify-center h-9 w-9 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Render Nested Replies */}
        {comment.replies && comment.replies.map((reply) => (
          <CommentNode key={reply.id} comment={reply} isReply={true} />
        ))}
      </div>
    );
  };

  return (
    <article className="max-w-3xl mx-auto py-6 space-y-8">
      {/* Back Button */}
      <Link 
        to={ROUTES.HOME}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-500 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>BACK TO HOME</span>
      </Link>

      {/* Header Info */}
      <div className="space-y-4">
        {blog.category && (
          <span className="inline-block px-3 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
            {blog.category}
          </span>
        )}

        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100 leading-tight">
          {blog.title}
        </h1>

        {/* Meta Grid */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-150/45 dark:border-slate-800/45 pb-6">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-xs font-bold text-white flex items-center justify-center uppercase">
              {blog.author.substring(0, 2)}
            </div>
            <div className="flex flex-col text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-200">{blog.author}</span>
              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            
            {/* Follow Creator Toggle */}
            {user && user.username !== blog.author && (
              <button
                onClick={handleFollow}
                disabled={isTogglingFollow}
                className={`ml-3 px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold border transition-all ${
                  isFollowing
                    ? 'border-slate-350 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-900/50'
                    : 'bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-500 shadow-sm shadow-indigo-500/20'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>

          {/* Social Icons Bar */}
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5" title="Views">
              <Eye className="h-4 w-4" />
              {blog.views}
            </span>
            <button 
              onClick={handleLike}
              disabled={isTogglingLike}
              className={`flex items-center gap-1.5 transition-colors ${liked ? 'text-rose-500 font-semibold' : 'hover:text-rose-500'}`}
              title="Like post"
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
              {blog.likes}
            </button>
            <button 
              onClick={handleSave}
              disabled={isTogglingSave}
              className={`flex items-center gap-1.5 transition-colors ${isSaved ? 'text-amber-500 font-semibold' : 'hover:text-amber-500'}`}
              title="Save post"
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span className="hidden sm:inline">{isSaved ? 'Bookmarked' : 'Bookmark'}</span>
            </button>
            <button 
              onClick={handleShare}
              className="flex items-center gap-1.5 hover:text-indigo-500 transition-colors"
              title="Share"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Cover */}
      <div className="aspect-video w-full rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 shadow-md">
        <img
          src={thumbnailUrl}
          alt={blog.title}
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Admin / Author Options */}
      {isAuthor && (
        <div className="flex items-center gap-2 py-4 border-b border-slate-100 dark:border-slate-900">
          <Link
            to={`/edit-blog/${blog.id}`}
            className="inline-flex h-9 items-center gap-1.5 px-4 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 transition"
          >
            <Edit className="h-3.5 w-3.5" />
            <span>Edit Article</span>
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex h-9 items-center gap-1.5 px-4 rounded-xl text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400 transition"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete Article</span>
          </button>
        </div>
      )}

      {/* Styled Article Content */}
      <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-350 leading-relaxed text-sm sm:text-base whitespace-pre-line">
        {blog.content}
      </div>

      {/* Tags Panel */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-150/40 dark:border-slate-800/40">
          {blog.tags.map((tag) => (
            <Link
              key={tag}
              to={`/tag/${tag}`}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100/50 hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-900 border border-slate-200/10 transition"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* Glassmorphic Comments Section */}
      <div className="pt-8 border-t border-slate-150/45 dark:border-slate-800/45 space-y-6">
        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-indigo-500" />
          <span>Comments ({comments.length})</span>
        </h3>

        {/* Comment Box */}
        {user ? (
          <form onSubmit={handleAddComment} className="space-y-3">
            <textarea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Join the discussion... share your insights!"
              className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs sm:text-sm resize-none shadow-inner"
              maxLength={1000}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isAdding || !commentText.trim()}
                className="flex items-center gap-1.5 px-4 h-9 rounded-xl bg-indigo-600 text-white font-semibold text-xs sm:text-sm hover:bg-indigo-500 shadow-md hover:shadow-lg hover:shadow-indigo-500/20 transition-all disabled:opacity-50"
              >
                {isAdding ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                <span>Send Comment</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="rounded-2xl p-4 bg-slate-55/40 dark:bg-slate-900/40 border border-slate-200/30 text-center py-6">
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Please <Link to={ROUTES.LOGIN} className="font-bold text-indigo-500 hover:underline">sign in</Link> to join the discussion.
            </p>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-1">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <CommentNode key={comment.id} comment={comment} />
            ))
          ) : (
            <p className="text-xs sm:text-sm text-slate-400 italic py-4">No comments posted yet. Be the first to start the thread!</p>
          )}
        </div>
      </div>

    </article>
  );
};
export default BlogDetails;
