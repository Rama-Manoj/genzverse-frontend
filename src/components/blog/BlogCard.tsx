import React from 'react';
import { Link } from 'react-router-dom';
import type { BlogResponse } from '../../types';
import { Eye, Heart, MessageSquare, Share2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBlogs } from '../../hooks/useBlogs';
import { toast } from 'sonner';

interface BlogCardProps {
  blog: BlogResponse;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const { shareBlog } = useBlogs();

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault(); // Stop navigation to details page
    try {
      const shareData = await shareBlog(blog.id);
      navigator.clipboard.writeText(shareData.shareUrl);
      toast.success('Share link copied to clipboard!');
    } catch {
      toast.error('Failed to generate share link.');
    }
  };

  // Helper to format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  // Fallback thumbnail if missing
  const thumbnailUrl = blog.thumbnailUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500&auto=format&fit=crop&q=60';

  return (
    <motion.div
      whileHover={{ 
        y: -10,
        scale: 1.015,
        boxShadow: "0 20px 45px rgba(168, 85, 247, 0.18)"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="glass-card group flex flex-col h-full rounded-3xl overflow-hidden"
    >
      <Link to={`/blog/${blog.slug || blog.id}`} className="flex flex-col h-full">
        {/* Cover Image */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
          <img
            src={thumbnailUrl}
            alt={blog.title}
            loading="lazy"
            className="h-full w-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
          />
          {blog.category && (
            <span className="absolute top-3 left-3 px-3 py-1.5 text-[9px] font-black tracking-wider uppercase rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/20">
              {blog.category}
            </span>
          )}
        </div>

        {/* Contents */}
        <div className="flex flex-col flex-1 p-5">
          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2.5">
              {blog.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors mb-2">
            {blog.title}
          </h3>

          {/* Content Excerpt */}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4 flex-1">
            {blog.content}
          </p>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-white/10 dark:border-slate-800/40 pt-3 mt-auto">
            {/* Author & Date */}
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-[9px] font-black text-white flex items-center justify-center uppercase shadow-sm">
                {blog.author ? blog.author.substring(0, 2) : 'A'}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-700 dark:text-slate-300 truncate max-w-20">
                  {blog.author}
                </span>
                <span className="flex items-center gap-1 text-[9px] opacity-75">
                  <Calendar className="h-2.5 w-2.5 text-pink-500" strokeWidth={2.2} />
                  {formatDate(blog.createdAt)}
                </span>
              </div>
            </div>

            {/* Interaction Metrics */}
            <div className="flex items-center gap-3.5">
              <span className="flex items-center gap-1 hover:text-slate-650 dark:hover:text-slate-200 transition-colors" title="Views">
                <Eye className="h-3.5 w-3.5 text-cyan-400" />
                {blog.views}
              </span>
              <span className="flex items-center gap-1 hover:text-pink-500 transition-colors" title="Likes">
                <Heart className="h-3.5 w-3.5 text-pink-500 fill-pink-500/10" />
                {blog.likes}
              </span>
              <span className="flex items-center gap-1 hover:text-purple-500 transition-colors" title="Comments">
                <MessageSquare className="h-3.5 w-3.5 text-purple-500 fill-purple-500/10" />
                {blog.comments}
              </span>
              <button
                onClick={handleShare}
                className="p-1 rounded-lg hover:bg-purple-500/10 hover:text-pink-500 transition-colors"
                title="Share link"
              >
                <Share2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

        </div>
      </Link>
    </motion.div>
  );
};
export default BlogCard;
