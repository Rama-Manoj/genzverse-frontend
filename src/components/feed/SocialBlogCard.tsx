import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MessageSquare, Eye } from 'lucide-react';
import type { BlogResponse } from '../../types';
import { LikeButton } from './LikeButton';
import { SaveButton } from './SaveButton';
import { FollowButton } from './FollowButton';
import { ShareDialog } from './ShareDialog';
import { CommentDrawer } from './CommentDrawer';
import { useAuth } from '../../store/AuthContext';
import { useSocial } from '../../hooks/useSocial';

interface SocialBlogCardProps {
  blog: BlogResponse;
  index?: number;
}



const formatDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
};

const thumbnailFallback =
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=60';

export const SocialBlogCard: React.FC<SocialBlogCardProps> = ({ blog, index = 0 }) => {
  const { user } = useAuth();
  const { useUserMapQuery } = useSocial();
  const { data: userMap } = useUserMapQuery(!!user);
  const [commentOpen, setCommentOpen] = useState(false);

  // Use authorId from blog data if available or resolve from userMap
  const authorId = blog.authorId || (userMap ? userMap[blog.author.toLowerCase()] : undefined);
  const isOwnPost = user && blog.author === user.username;

  const thumbnailUrl = blog.thumbnailUrl || thumbnailFallback;
  const blogPath = `/blog/${blog.slug || blog.id}`;

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ 
          y: -8,
          scale: 1.012,
          boxShadow: "0 20px 45px rgba(168, 85, 247, 0.15)"
        }}
        transition={{ 
          default: { duration: 0.3, delay: Math.min(index * 0.06, 0.4) },
          y: { type: "spring", stiffness: 300, damping: 20 },
          scale: { type: "spring", stiffness: 300, damping: 20 }
        }}
        className="glass-card rounded-3xl overflow-hidden group shadow-sm"
      >
        {/* ── Card Header ───────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-3">
            {/* Author Avatar */}
            <Link
              to={authorId ? `/author/${authorId}` : `/search?q=${blog.author}`}
              className="shrink-0"
              onClick={e => e.stopPropagation()}
            >
              <div
                className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-sm font-black text-white flex items-center justify-center uppercase shadow-md hover:scale-105 transition-transform"
              >
                {blog.author.substring(0, 2)}
              </div>
            </Link>

            {/* Author info */}
            <div className="flex flex-col">
              <Link
                to={authorId ? `/author/${authorId}` : `/search?q=${blog.author}`}
                className="text-sm font-bold text-slate-800 dark:text-slate-100 hover:text-purple-600 dark:hover:text-pink-400 transition-colors"
                onClick={e => e.stopPropagation()}
              >
                {blog.author}
              </Link>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Calendar className="h-3 w-3 text-pink-500" />
                <span>{formatDate(blog.createdAt)}</span>
                {blog.category && (
                  <>
                    <span>·</span>
                    <Link
                      to={`/category/${blog.category.toLowerCase()}`}
                      className="text-pink-500 font-bold hover:underline"
                      onClick={e => e.stopPropagation()}
                    >
                      {blog.category}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Follow button — show when authorId is known and it's not own post */}
          {authorId && !isOwnPost && (
            <FollowButton
              targetUserId={authorId}
              targetUsername={blog.author}
            />
          )}
          {/* If no authorId (API doesn't return it), show a subtle username-based follow */}
          {!authorId && user && !isOwnPost && (
            <span className="text-[11px] font-bold text-pink-500 px-3 py-1 rounded-full border border-pink-200/50 dark:border-pink-850/40 hover:bg-pink-500/10 cursor-pointer transition-all duration-200 hover:scale-105">
              Follow
            </span>
          )}
        </div>

        {/* ── Content ───────────────────────────────────────────── */}
        <Link to={blogPath} className="block">
          {/* Thumbnail */}
          <div className="relative mx-4 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-video">
            <img
              src={thumbnailUrl}
              alt={blog.title}
              loading="lazy"
              className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
            {blog.tags && blog.tags.length > 0 && (
              <div className="absolute bottom-3 left-3 flex gap-1.5">
                {blog.tags.slice(0, 2).map(tag => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-500/80 to-pink-500/80 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-wider"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Title & Preview */}
          <div className="px-5 pt-4 pb-3">
            <h2 className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-purple-650 dark:group-hover:text-pink-400 transition-colors mb-2">
              {blog.title}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {blog.content}
            </p>
          </div>
        </Link>

        {/* ── Stats Row ─────────────────────────────────────────── */}
        <div className="px-5 pb-1 flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3 text-cyan-400" />
            {blog.views} views
          </span>
        </div>

        {/* ── Actions Row ───────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-white/10 dark:border-slate-800/40 mt-1">
          <div className="flex items-center gap-4">
            {/* Like */}
            <LikeButton blogId={blog.id} likeCount={blog.likes} />

            {/* Comment */}
            <button
              onClick={e => {
                e.preventDefault();
                setCommentOpen(true);
              }}
              className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors group"
            >
              <MessageSquare className="h-5 w-5 group-hover:scale-110 transition-transform duration-200 text-purple-500" />
              <span className="font-semibold tabular-nums">{blog.comments}</span>
            </button>

            {/* Share */}
            <ShareDialog
              blogId={blog.id}
              blogTitle={blog.title}
              blogSlug={blog.slug}
              shareCount={blog.shares}
            />
          </div>

          {/* Save */}
          <SaveButton blogId={blog.id} />
        </div>

        {/* ── Comment Preview ───────────────────────────────────── */}
        <div className="px-5 pb-4">
          <button
            onClick={e => {
              e.preventDefault();
              setCommentOpen(true);
            }}
            className="text-xs text-slate-400 hover:text-purple-500 transition-colors font-semibold"
          >
            {blog.comments > 0
              ? `View all ${blog.comments} comment${blog.comments !== 1 ? 's' : ''} →`
              : user
              ? 'Be the first to comment...'
              : null}
          </button>
        </div>
      </motion.article>

      {/* Comment Drawer */}
      <CommentDrawer
        blogId={blog.id}
        blogTitle={blog.title}
        isOpen={commentOpen}
        onClose={() => setCommentOpen(false)}
      />
    </>
  );
};

export default SocialBlogCard;
