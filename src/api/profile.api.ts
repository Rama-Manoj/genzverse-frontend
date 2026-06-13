import { apiClient } from './client';
import type { UserProfileResponse, AuthorProfileResponse } from '../types';

export interface UpdateProfileRequest {
  bio: string;
  profileImage: string;
  website: string;
  linkedinUrl: string;
  githubUrl: string;
}

export const profileApi = {
  getMe: async (): Promise<UserProfileResponse> => {
    const response = await apiClient.get<UserProfileResponse>('/api/profile/me');
    return response.data;
  },

  updateMe: async (data: UpdateProfileRequest): Promise<UserProfileResponse> => {
    const response = await apiClient.put<UserProfileResponse>('/api/profile/me', data);
    return response.data;
  },

  getPublicProfile: async (userId: number): Promise<UserProfileResponse> => {
    const response = await apiClient.get<UserProfileResponse>(`/api/profile/${userId}`);
    return response.data;
  },

  getAuthorDetails: async (userId: number): Promise<AuthorProfileResponse> => {
    const response = await apiClient.get<AuthorProfileResponse>(`/api/authors/${userId}`);
    return response.data;
  },

  uploadFile: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<string>('/api/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
