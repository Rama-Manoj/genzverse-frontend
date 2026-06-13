import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useBlogs } from '../../hooks/useBlogs';
import { useAuth } from '../../store/AuthContext';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/routes';
import { Eye, Heart, MessageSquare, Edit, Trash2, BookOpen, PlusCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const MyBlogs: React.FC = () => {
  const { user } = useAuth();
  const { useBlogsQuery, deleteBlog, isDeleting } = useBlogs();
  const { data: allBlogs = [], isLoading } = useBlogsQuery();

  useEffect(() => {
    document.title = 'My Publications | GenzVerse';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Manage your GenzVerse publications, draft blog posts, review read counts, likes, and delete or edit existing articles.');
    }
  }, []);

  const myBlogs = allBlogs.filter((blog) => blog.author === user?.username);

  const handleDelete = async (id: number, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action is irreversible.`)) {
      try {
        await deleteBlog(id);
        toast.success('Publication deleted successfully.');
      } catch {
        toast.error('Failed to delete article. Try again.');
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4 px-1">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-4 border-b border-slate-100 dark:border-slate-800/80"
      >
        <div>
          <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs uppercase tracking-widest">
            <BookOpen className="h-4 w-4" />
            <span>Workspace</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight mt-1 text-slate-900 dark:text-slate-100">
            My Publications
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Manage your articles, review readers views, likes, and edit metadata.
          </p>
        </div>

        <Link
          to={ROUTES.CREATE_BLOG}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold text-xs shadow-md transition hover:scale-103 self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Create Article</span>
        </Link>
      </motion.div>

      {/* Blogs list or empty state */}
      <div className="min-h-[300px]">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        ) : myBlogs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/20 dark:bg-slate-900/10 backdrop-blur-md max-w-md mx-auto space-y-4"
          >
            <BookOpen className="h-12 w-12 text-slate-350 dark:text-slate-700 mx-auto" />
            <h3 className="text-base font-black text-slate-700 dark:text-slate-300">No publications draft</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              You haven't published any articles yet. Share your development insights with the next generation.
            </p>
            <Link
              to={ROUTES.CREATE_BLOG}
              className="inline-flex items-center gap-1.5 px-4.5 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-505 shadow"
            >
              Write first post
            </Link>
          </motion.div>
        ) : (
          <div className="rounded-3xl border border-slate-200/55 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden shadow-sm">
            {myBlogs.map((blog, index) => {
              const thumbnailUrl = blog.thumbnailUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500&auto=format&fit=crop&q=60';
              return (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 hover:bg-slate-50/45 dark:hover:bg-slate-800/10 transition"
                >
                  {/* Blog Preview Block */}
                  <div className="flex gap-4 min-w-0 flex-grow">
                    <div className="h-14 w-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200/30 dark:border-slate-800/40 shrink-0">
                      <img src={thumbnailUrl} alt={blog.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-black text-slate-800 dark:text-slate-105 hover:text-indigo-500 truncate">
                        <Link to={`/blog/${blog.slug || blog.id}`}>{blog.title}</Link>
                      </h3>
                      <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                        <span className="font-bold text-indigo-500 uppercase">{blog.category ?? 'General'}</span>
                        <span>•</span>
                        <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </p>
                    </div>
                  </div>

                  {/* Analytics Metrics & Actions Row */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/50 pt-3.5 sm:pt-0">
                    <div className="flex items-center gap-4 text-slate-400 text-xs">
                      <span className="flex items-center gap-1" title="Views">
                        <Eye className="h-4 w-4" />
                        {blog.views}
                      </span>
                      <span className="flex items-center gap-1" title="Likes">
                        <Heart className="h-4 w-4" />
                        {blog.likes}
                      </span>
                      <span className="flex items-center gap-1" title="Comments">
                        <MessageSquare className="h-4 w-4" />
                        {blog.comments}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/edit-blog/${blog.id}`}
                        title="Edit Article"
                        className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 hover:text-indigo-500 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(blog.id, blog.title)}
                        disabled={isDeleting}
                        title="Delete Article"
                        className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200/20 dark:border-rose-900/30 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default MyBlogs;
