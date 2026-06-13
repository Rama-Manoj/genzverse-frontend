import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/admin.api';
import type { User, BlogResponse, CommentResponse, AdminStatsResponse } from '../types';
import { toast } from 'sonner';

export const useAdmin = () => {
  const queryClient = useQueryClient();

  // Queries
  const useAdminStatsQuery = () =>
    useQuery<AdminStatsResponse, Error>({
      queryKey: ['admin', 'stats'],
      queryFn: () => adminApi.getStats(),
    });

  const useAdminUsersQuery = () =>
    useQuery<User[], Error>({
      queryKey: ['admin', 'users'],
      queryFn: () => adminApi.getAllUsers(),
    });

  const useAdminBlogsQuery = () =>
    useQuery<BlogResponse[], Error>({
      queryKey: ['admin', 'blogs'],
      queryFn: () => adminApi.getAllBlogs(),
    });

  const useAdminCommentsQuery = () =>
    useQuery<CommentResponse[], Error>({
      queryKey: ['admin', 'comments'],
      queryFn: () => adminApi.getAllComments(),
    });

  // Mutations
  const deleteUserMutation = useMutation<void, Error, number>({
    mutationFn: (userId) => adminApi.deleteUser(userId),
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete user');
    },
  });

  const deleteBlogMutation = useMutation<void, Error, number>({
    mutationFn: (blogId) => adminApi.deleteBlog(blogId),
    onSuccess: () => {
      toast.success('Blog deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'blogs'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      // Invalidate public blogs caches to keep main feed consistent
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete blog');
    },
  });

  const deleteCommentMutation = useMutation<void, Error, number>({
    mutationFn: (commentId) => adminApi.deleteComment(commentId),
    onSuccess: () => {
      toast.success('Comment deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'comments'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      // Invalidate general comments cache
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete comment');
    },
  });

  return {
    useAdminStatsQuery,
    useAdminUsersQuery,
    useAdminBlogsQuery,
    useAdminCommentsQuery,

    deleteUser: deleteUserMutation.mutateAsync,
    isDeletingUser: deleteUserMutation.isPending,

    deleteBlog: deleteBlogMutation.mutateAsync,
    isDeletingBlog: deleteBlogMutation.isPending,

    deleteComment: deleteCommentMutation.mutateAsync,
    isDeletingComment: deleteCommentMutation.isPending,
  };
};
