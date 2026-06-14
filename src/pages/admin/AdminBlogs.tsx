import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import { ROUTES } from '../../routes/routes';
import { 
  BookOpen, 
  Search, 
  Trash2, 
  X, 
  ExternalLink,
  Eye,
  Heart,
  MessageSquare,
  AlertTriangle,
  Calendar,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminBlogs: React.FC = () => {
  const { useAdminBlogsQuery, deleteBlog, isDeletingBlog } = useAdmin();
  const { data: blogs = [], isLoading, isError, error } = useAdminBlogsQuery();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [blogToDelete, setBlogToDelete] = useState<{ id: number; title: string } | null>(null);

  // Sorting
  const [sortField, setSortField] = useState<'id' | 'title' | 'author' | 'views'>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: 'id' | 'title' | 'author' | 'views') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Extract unique categories from blogs
  const categories = ['ALL', ...Array.from(new Set(blogs.map(b => b.category || 'Uncategorized')))];

  // Filter & Search
  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch = 
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      categoryFilter === 'ALL' || 
      (b.category || 'Uncategorized') === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Sort
  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];

    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortDirection === 'asc' 
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    // Numbers (id, views)
    return sortDirection === 'asc' 
      ? (valA as number) - (valB as number)
      : (valB as number) - (valA as number);
  });

  const handleDeleteConfirm = async () => {
    if (blogToDelete) {
      try {
        await deleteBlog(blogToDelete.id);
      } finally {
        setBlogToDelete(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading blogs database...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="max-w-md p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl text-center">
          <AlertTriangle className="h-10 w-10 text-rose-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Failed to Load Blogs</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {error?.message || 'We encountered an error retrieving GenzVerse blogs. Please try again.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-1">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs uppercase tracking-widest">
            <BookOpen className="h-4 w-4" />
            <span>Content Moderation</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight mt-1 text-slate-900 dark:text-slate-100">
            Blogs Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Review articles, verify categories, and manage post visibility or deletion.
          </p>
        </div>

        {/* Count Pill */}
        <div className="self-start md:self-auto px-4 py-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 rounded-2xl text-xs font-black">
          Total Blogs: {blogs.length}
        </div>
      </div>

      {/* Search & Category Filter Row */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-4 backdrop-blur-md">
        
        {/* Search */}
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title or author name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 dark:text-slate-100"
          />
        </div>

        {/* Category Dropdown Filter */}
        <div className="flex items-center gap-2 shrink-0">
          <Layers className="h-4 w-4 text-slate-400 hidden sm:block" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'ALL' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Blogs Table/Card representation */}
      <div className="border border-slate-200/50 dark:border-slate-800/50 rounded-3xl bg-white dark:bg-slate-900/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition" onClick={() => handleSort('id')}>
                  <div className="flex items-center gap-1.5">
                    <span>ID</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition" onClick={() => handleSort('title')}>
                  <div className="flex items-center gap-1.5">
                    <span>Title</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition" onClick={() => handleSort('author')}>
                  <div className="flex items-center gap-1.5">
                    <span>Author</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition" onClick={() => handleSort('views')}>
                  <div className="flex items-center gap-1.5">
                    <span>Stats</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {sortedBlogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    No blogs found matching the filters.
                  </td>
                </tr>
              ) : (
                sortedBlogs.map((b) => {
                  const blogPath = ROUTES.BLOG_DETAILS.replace(':slug', b.slug || String(b.id));
                  return (
                    <tr 
                      key={b.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-slate-500">{b.id}</td>
                      <td className="px-6 py-4 max-w-sm">
                        <div className="flex items-center gap-3">
                          {b.thumbnailUrl && (
                            <img 
                              src={b.thumbnailUrl} 
                              alt="" 
                              className="h-10 w-14 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200/40 dark:border-slate-800/40"
                              onError={(e) => {
                                // fallback if image fails to load
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=120&q=80';
                              }}
                            />
                          )}
                          <div className="min-w-0">
                            <p className="font-bold text-slate-800 dark:text-slate-100 truncate">{b.title}</p>
                            <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Calendar className="h-3 w-3" />
                              {new Date(b.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">{b.author}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full font-bold text-slate-600 dark:text-slate-400">
                          {b.category ?? 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1" title="Views">
                            <Eye className="h-3.5 w-3.5" />
                            {b.views}
                          </span>
                          <span className="flex items-center gap-1" title="Likes">
                            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500/20" />
                            {b.likes}
                          </span>
                          <span className="flex items-center gap-1" title="Comments">
                            <MessageSquare className="h-3.5 w-3.5 text-indigo-500 fill-indigo-500/20" />
                            {b.comments}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={blogPath}
                            className="p-2 rounded-xl text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Read Blog"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4.5 w-4.5" />
                          </Link>
                          <button
                            onClick={() => setBlogToDelete({ id: b.id, title: b.title })}
                            className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                            title="Delete Blog"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {blogToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBlogToDelete(null)}
              className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            />
            
            {/* Modal Dialog */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 shadow-2xl overflow-hidden z-10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 mb-4">
                <AlertTriangle className="h-6 w-6" />
              </div>

              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                Delete Article?
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Are you sure you want to permanently delete the blog post <strong className="text-slate-800 dark:text-slate-200">"{blogToDelete.title}"</strong>? This will remove the article, its visual cover, comments, shares, and all related metrics globally.
              </p>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => setBlogToDelete(null)}
                  disabled={isDeletingBlog}
                  className="px-4.5 py-2 text-sm font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeletingBlog}
                  className="px-4.5 py-2 text-sm font-semibold rounded-xl bg-rose-600 text-white hover:bg-rose-500 transition shadow-md shadow-rose-500/20 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isDeletingBlog ? (
                    <>
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Confirm Delete</span>
                  )}
                </button>
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setBlogToDelete(null)} 
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminBlogs;
