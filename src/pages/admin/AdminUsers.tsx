import React, { useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { useAuth } from '../../store/AuthContext';
import { 
  Search, 
  Trash2, 
  ShieldAlert, 
  X, 
  UserX,
  AlertTriangle,
  ArrowUpDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminUsers: React.FC = () => {
  const { useAdminUsersQuery, deleteUser, isDeletingUser } = useAdmin();
  const { user: currentUser } = useAuth();
  
  const { data: users = [], isLoading, isError, error } = useAdminUsersQuery();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'USER' | 'ADMIN'>('ALL');
  const [userToDelete, setUserToDelete] = useState<{ id: number; username: string } | null>(null);

  // Sorting
  const [sortField, setSortField] = useState<'id' | 'username' | 'email'>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: 'id' | 'username' | 'email') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter & Search users
  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = 
      roleFilter === 'ALL' || 
      (u.role ?? 'USER') === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];

    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortDirection === 'asc' 
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    // fallback for numbers/ids
    return sortDirection === 'asc' 
      ? (valA as number) - (valB as number)
      : (valB as number) - (valA as number);
  });

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete.id);
      } finally {
        setUserToDelete(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Fetching accounts...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="max-w-md p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl text-center">
          <AlertTriangle className="h-10 w-10 text-rose-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Failed to Load Users</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {error?.message || 'We encountered an error retrieving the user database. Please try again.'}
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
            <ShieldAlert className="h-4 w-4" />
            <span>Administration</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight mt-1 text-slate-900 dark:text-slate-100">
            User Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            View profiles, assign roles, and moderate spam or offending user accounts.
          </p>
        </div>
        
        {/* Count Pill */}
        <div className="self-start md:self-auto px-4 py-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 rounded-2xl text-xs font-black">
          Total Registered: {users.length}
        </div>
      </div>

      {/* Filters & Search Row */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-4 backdrop-blur-md">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 dark:text-slate-100"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {(['ALL', 'USER', 'ADMIN'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                roleFilter === role
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/15'
                  : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              {role === 'ALL' ? 'All Roles' : role}
            </button>
          ))}
        </div>

      </div>

      {/* Users Table Card */}
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
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition" onClick={() => handleSort('username')}>
                  <div className="flex items-center gap-1.5">
                    <span>Username</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition" onClick={() => handleSort('email')}>
                  <div className="flex items-center gap-1.5">
                    <span>Email Address</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {sortedUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <UserX className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    No users matching the filters were found.
                  </td>
                </tr>
              ) : (
                sortedUsers.map((u) => {
                  const isSelf = currentUser?.id === u.id;
                  return (
                    <tr 
                      key={u.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-slate-500">{u.id}</td>
                      <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100">{u.username}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                          (u.role ?? 'USER') === 'ADMIN' 
                            ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}>
                          {u.role ?? 'USER'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isSelf ? (
                          <span className="text-xs text-slate-400 italic">Active Self</span>
                        ) : (
                          <button
                            onClick={() => setUserToDelete({ id: u.id, username: u.username })}
                            className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                            title="Delete user"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        )}
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
        {userToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setUserToDelete(null)}
              className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            />
            
            {/* Modal Dialog */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 shadow-2xl overflow-hidden z-10"
            >
              {/* Top Warning Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 mb-4">
                <AlertTriangle className="h-6 w-6" />
              </div>

              {/* Title & Body */}
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                Delete Account?
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Are you sure you want to permanently delete the user <strong className="text-slate-800 dark:text-slate-200">@{userToDelete.username}</strong>? This action is irreversible, and all posts, comments, and interactions created by this account will be removed.
              </p>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => setUserToDelete(null)}
                  disabled={isDeletingUser}
                  className="px-4.5 py-2 text-sm font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeletingUser}
                  className="px-4.5 py-2 text-sm font-semibold rounded-xl bg-rose-600 text-white hover:bg-rose-500 transition shadow-md shadow-rose-500/20 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isDeletingUser ? (
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
                onClick={() => setUserToDelete(null)} 
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

export default AdminUsers;
