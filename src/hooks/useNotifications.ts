import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '../api/notification.api';
import type { NotificationResponse, NotificationCountResponse } from '../types';

export const useNotifications = () => {
  const queryClient = useQueryClient();

  // Query: Get notification list
  const useNotificationsQuery = () => 
    useQuery<NotificationResponse[], Error>({
      queryKey: ['notifications'],
      queryFn: () => notificationApi.getNotifications(),
    });

  // Query: Get unread notification count
  const useUnreadCountQuery = (enabled = true) => 
    useQuery<NotificationCountResponse, Error>({
      queryKey: ['notifications', 'unread-count'],
      queryFn: () => notificationApi.getUnreadCount(),
      refetchInterval: enabled ? 30000 : false, // Poll every 30 seconds for real-time notifications if enabled
      enabled,
    });

  // Mutation: Mark single notification as read
  const markAsReadMutation = useMutation<void, Error, number>({
    mutationFn: (notificationId) => notificationApi.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });

  return {
    useNotificationsQuery,
    useUnreadCountQuery,
    
    markAsRead: markAsReadMutation.mutateAsync,
    isMarkingRead: markAsReadMutation.isPending,
  };
};
