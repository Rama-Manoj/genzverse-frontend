import { apiClient } from './client';
import type { User, BlogResponse } from '../types';

export const socialApi = {
  toggleFollow: async (userId: number): Promise<void> => {
    await apiClient.post(`/api/follows/${userId}`);
  },

  getFollowers: async (userId: number): Promise<User[]> => {
    const response = await apiClient.get<User[]>(`/api/follows/followers/${userId}`);
    return response.data;
  },

  getFollowing: async (userId: number): Promise<User[]> => {
    const response = await apiClient.get<User[]>(`/api/follows/following/${userId}`);
    return response.data;
  },

  toggleLike: async (blogId: number): Promise<void> => {
    await apiClient.post(`/api/likes/${blogId}`);
  },

  toggleSave: async (blogId: number): Promise<void> => {
    await apiClient.post(`/api/saved/${blogId}`);
  },

  getSavedBlogs: async (): Promise<BlogResponse[]> => {
    const response = await apiClient.get<BlogResponse[]>('/api/saved');
    return response.data;
  },
};
