import { apiClient } from './client';
import type { CommentResponse, CreateCommentRequest } from '../types';

export const commentApi = {
  add: async (blogId: number, data: CreateCommentRequest): Promise<CommentResponse> => {
    const response = await apiClient.post<CommentResponse>(`/api/comments/${blogId}`, data);
    return response.data;
  },

  getByBlogId: async (blogId: number): Promise<CommentResponse[]> => {
    const response = await apiClient.get<CommentResponse[]>(`/api/comments/${blogId}`);
    return response.data;
  },

  delete: async (commentId: number): Promise<void> => {
    await apiClient.delete(`/api/comments/${commentId}`);
  },
};
