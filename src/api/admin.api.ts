import { apiClient } from './client';
import type { User, BlogResponse, CommentResponse, AdminStatsResponse } from '../types';

export const adminApi = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/api/admin/users');
    return response.data;
  },

  deleteUser: async (userId: number): Promise<void> => {
    await apiClient.delete(`/api/admin/users/${userId}`);
  },

  deleteBlog: async (blogId: number): Promise<void> => {
    await apiClient.delete(`/api/admin/blogs/${blogId}`);
  },

  deleteComment: async (commentId: number): Promise<void> => {
    await apiClient.delete(`/api/admin/comments/${commentId}`);
  },

  getAllBlogs: async (): Promise<BlogResponse[]> => {
    const response = await apiClient.get<BlogResponse[]>('/api/blogs');
    return response.data;
  },

  getAllComments: async (): Promise<CommentResponse[]> => {
    try {
      // 1. Get all blogs
      const blogsResponse = await apiClient.get<BlogResponse[]>('/api/blogs');
      const blogs = blogsResponse.data || [];

      // 2. Fetch comments for each blog in parallel
      const commentsPromises = blogs.map(async (blog) => {
        try {
          const res = await apiClient.get<CommentResponse[]>(`/api/comments/${blog.id}`);
          return res.data || [];
        } catch {
          // If comment fetch fails (e.g. no comments or network), return empty array
          return [];
        }
      });

      const nestedComments = await Promise.all(commentsPromises);
      return nestedComments.flat();
    } catch {
      return [];
    }
  },

  getStats: async (): Promise<AdminStatsResponse> => {
    try {
      const response = await apiClient.get<AdminStatsResponse>('/api/admin/stats');
      return response.data;
    } catch {
      // Return zero stats so the dashboard can derive them from other successful queries
      return {
        totalUsers: 0,
        totalBlogs: 0,
        totalComments: 0,
      };
    }
  },
};

