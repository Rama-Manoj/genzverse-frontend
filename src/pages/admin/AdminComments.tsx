import React, { useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { 
  MessageSquare, 
  Search, 
  Trash2, 
  X, 
  Calendar,
  User,
  AlertTriangle,
  CornerDownRight,
  ArrowUpDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminComments: React.FC = () => {
  const { useAdminCommentsQuery, deleteComment, isDeletingComment } = useAdmin();
  const { data: comments = [], isLoading, isError, error } = useAdminCommentsQuery();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'TOP' | 'REPLY'>('ALL');
  const [commentToDelete, setCommentToDelete] = useState<{ id: number; content: string; username: string } | null>(null);

  // Sorting
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filter & Search
  const filteredComments = comments.filter((c) => {
    const matchesSearch = 
      c.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const isReply = c.parentCommentId !== null && c.parentCommentId !== undefined;
    const matchesType = 
      typeFilter === 'ALL' || 
      (typeFilter === 'TOP' && !isReply) ||
      (typeFilter === 'REPLY' && isReply);

    return matchesSearch && matchesType;
  });

  // Sort by date (createdAt)
  const sortedComments = [...filteredComments].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const handleDeleteConfirm = async () => {
    if (commentToDelete) {
      try {
        await deleteComment(commentToDelete.id);
      } finally {
        setCommentToDelete(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading comments feed...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="max-w-md p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl text-center">
          <AlertTriangle className="h-10 w-10 text-rose-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Failed to Load Comments</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {error?.message || 'We encountered an error retrieving GenzVerse comments. Please try again.'}
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
            <MessageSquare className="h-4 w-4" />
            <span>Spam & Feedback Control</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight mt-1 text-slate-900 dark:text-slate-100">
            Comments Moderation
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Read, filter, and purge spam comments or toxic interactions across GenzVerse.
          </p>
        </div>

        {/* Count Pill */}
        <div className="self-start md:self-auto px-4 py-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 rounded-2xl text-xs font-black">
          Total Comments: {comments.length}
        </div>
      </div>

      {/* Filters & Search Row */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-4 backdrop-blur-md">
        
        {/* Search */}
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by commenter or comment content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 dark:text-slate-100"
          />
        </div>

        {/* Sorting & Category Toggle */}
        <div className="flex gap-2 shrink-0">
          {(['ALL', 'TOP', 'REPLY'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all ${
                typeFilter === type
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              {type === 'ALL' ? 'All Types' : type === 'TOP' ? 'Top-Level' : 'Replies'}
            </button>
          ))}
          
          <button
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 transition flex items-center gap-1 text-xs font-bold"
            title={`Sort by Date: ${sortDirection === 'desc' ? 'Newest' : 'Oldest'}`}
          >
            <ArrowUpDown className="h-4 w-4" />
            <span className="hidden sm:inline">{sortDirection === 'desc' ? 'Newest' : 'Oldest'}</span>
          </button>
        </div>

      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {sortedComments.length === 0 ? (
          <div className="border border-slate-200/50 dark:border-slate-800/50 rounded-3xl bg-white dark:bg-slate-900/60 p-12 text-center text-slate-400">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-30" />
            No comments found matching the filters.
          </div>
        ) : (
          sortedComments.map((c) => {
            const isReply = c.parentCommentId !== null && c.parentCommentId !== undefined;
            return (
              <motion.div
                key={c.id}
                layout
                className="border border-slate-200/50 dark:border-slate-800/50 rounded-3xl bg-white dark:bg-slate-900/60 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                {/* Visual marker for Reply */}
                {isReply && (
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-indigo-500/50" />
                )}

                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* User Avatar circle */}
                    <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-800/50 flex items-center justify-center shrink-0">
                      <User className="h-4.5 w-4.5 text-slate-500" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-100">@{c.username}</span>
                        {isReply ? (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-black uppercase text-indigo-500 tracking-wider">
                            <CornerDownRight className="h-2.5 w-2.5" />
                            Reply (ID: {c.parentCommentId})
                          </span>
                        ) : (
                          <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                            Top-Level
                          </span>
                        )}
                        <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(c.createdAt).toLocaleString()}
                        </div>
                      </div>
                      
                      {/* Comment body */}
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 bg-slate-50/50 dark:bg-slate-950/40 p-3 rounded-2xl border border-slate-200/20 dark:border-slate-800/20 leading-relaxed break-words">
                        {c.content}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0">
                    <button
                      onClick={() => setCommentToDelete({ id: c.id, content: c.content, username: c.username })}
                      className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Purge Comment"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>

                {/* Footnote showing ID */}
                <div className="mt-3 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Comment ID: <strong className="font-semibold text-slate-500">{c.id}</strong></span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {commentToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCommentToDelete(null)}
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
                Purge Comment?
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Are you sure you want to permanently delete the comment by <strong className="text-slate-800 dark:text-slate-200">@{commentToDelete.username}</strong>?
              </p>
              
              <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl text-xs italic text-slate-500 max-h-24 overflow-y-auto mt-3">
                "{commentToDelete.content}"
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => setCommentToDelete(null)}
                  disabled={isDeletingComment}
                  className="px-4.5 py-2 text-sm font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeletingComment}
                  className="px-4.5 py-2 text-sm font-semibold rounded-xl bg-rose-600 text-white hover:bg-rose-500 transition shadow-md shadow-rose-500/20 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isDeletingComment ? (
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
                onClick={() => setCommentToDelete(null)} 
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

export default AdminComments;
