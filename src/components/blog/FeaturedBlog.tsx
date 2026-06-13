import React from 'react';
import { Link } from 'react-router-dom';
import type { BlogResponse } from '../../types';
import { Eye, Heart, MessageSquare, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeaturedBlogProps {
  blog: BlogResponse;
}

export const FeaturedBlog: React.FC<FeaturedBlogProps> = ({ blog }) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const thumbnailUrl = blog.thumbnailUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=60';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative rounded-3xl overflow-hidden glass-card glass-card-hover shadow-sm"
    >
      <Link to={`/blog/${blog.slug || blog.id}`} className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* Cover Image container */}
        <div className="lg:col-span-7 aspect-video lg:aspect-auto overflow-hidden bg-slate-100 dark:bg-slate-950 min-h-[300px]">
          <img
            src={thumbnailUrl}
            alt={blog.title}
            className="h-full w-full object-cover object-center group-hover:scale-103 transition-transform duration-750 ease-out"
          />
        </div>

        {/* Text Description container */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between h-full space-y-4">
          <div className="space-y-3">
            {blog.category && (
              <span className="inline-block px-3.5 py-1.5 text-[9px] font-black tracking-wider uppercase rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/25">
                Featured • {blog.category}
              </span>
            )}
            
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-pink-400 transition-colors leading-tight">
              {blog.title}
            </h2>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
              {blog.content}
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10 dark:border-slate-800/40">
            {/* Author */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-xs font-black text-white flex items-center justify-center uppercase shadow-sm">
                {blog.author ? blog.author.substring(0, 2) : 'A'}
              </div>
              <div className="flex flex-col text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">{blog.author}</span>
                <span className="flex items-center gap-1 text-[10px] text-slate-400">
                  <Calendar className="h-3 w-3 text-pink-500" />
                  {formatDate(blog.createdAt)}
                </span>
              </div>
            </div>

            {/* Interaction Metrics */}
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1.5 hover:text-slate-650 dark:hover:text-slate-200 transition-colors" title="Views">
                <Eye className="h-4 w-4 text-cyan-400" />
                {blog.views} Views
              </span>
              <span className="flex items-center gap-1.5 hover:text-pink-500 transition-colors" title="Likes">
                <Heart className="h-4 w-4 text-pink-500 fill-pink-500/10" />
                {blog.likes} Likes
              </span>
              <span className="flex items-center gap-1.5 hover:text-purple-500 transition-colors" title="Comments">
                <MessageSquare className="h-4 w-4 text-purple-500 fill-purple-500/10" />
                {blog.comments} Comments
              </span>
            </div>
          </div>

        </div>

      </Link>
    </motion.div>
  );
};
export default FeaturedBlog;
