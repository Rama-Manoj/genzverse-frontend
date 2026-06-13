import { apiClient } from './client';
import type { NotificationResponse, NotificationCountResponse } from '../types';

export const notificationApi = {
  getNotifications: async (): Promise<NotificationResponse[]> => {
    const response = await apiClient.get<NotificationResponse[]>('/api/notifications');
    return response.data;
  },

  markAsRead: async (notificationId: number): Promise<void> => {
    await apiClient.put(`/api/notifications/${notificationId}/read`);
  },

  getUnreadCount: async (): Promise<NotificationCountResponse> => {
    const response = await apiClient.get<NotificationCountResponse>('/api/notifications/unread-count');
    return response.data;
  },
};
