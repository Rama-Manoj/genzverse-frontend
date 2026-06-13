import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../store/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes/routes';

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface NotificationSettingsRequest {
  emailNotifications: boolean;
  followNotifications: boolean;
  commentNotifications: boolean;
  likeNotifications: boolean;
}

export interface PrivacySettingsRequest {
  profileVisibility: 'PUBLIC' | 'PRIVATE';
  showSocialLinks: boolean;
  showEmail: boolean;
}

export const useSettings = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const navigate = useNavigate();

  // 1. Mutation: Change Password
  // TODO: Integrate with backend endpoint when available (e.g. PUT /api/auth/change-password)
  const useUpdatePasswordMutation = () =>
    useMutation<void, Error, UpdatePasswordRequest>({
      mutationFn: async (data) => {
        console.log('TODO: Implement change password on backend', data);
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Simulating error for verification/validation demo
        if (data.currentPassword === 'error') {
          throw new Error('Incorrect current password.');
        }
      },
      onSuccess: () => {
        toast.success('Password updated successfully!');
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to update password.');
      },
    });

  // 2. Mutation: Save Notification Settings
  // TODO: Integrate with backend endpoint when available (e.g. PUT /api/profile/notifications)
  const useUpdateNotificationSettingsMutation = () =>
    useMutation<void, Error, NotificationSettingsRequest>({
      mutationFn: async (data) => {
        console.log('TODO: Implement update notification settings on backend', data);
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        // Save to localStorage as a fallback local state mock
        localStorage.setItem('genzverse_notif_settings', JSON.stringify(data));
      },
      onSuccess: () => {
        toast.success('Notification preferences saved!');
        queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
      },
      onError: () => {
        toast.error('Failed to save notification preferences.');
      },
    });

  // 3. Mutation: Save Privacy Settings
  // TODO: Integrate with backend endpoint when available (e.g. PUT /api/profile/privacy)
  const useUpdatePrivacySettingsMutation = () =>
    useMutation<void, Error, PrivacySettingsRequest>({
      mutationFn: async (data) => {
        console.log('TODO: Implement update privacy settings on backend', data);
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        // Save to localStorage as a fallback local state mock
        localStorage.setItem('genzverse_privacy_settings', JSON.stringify(data));
      },
      onSuccess: () => {
        toast.success('Privacy settings updated!');
        queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
      },
      onError: () => {
        toast.error('Failed to save privacy settings.');
      },
    });

  // 4. Mutation: Delete Account
  // TODO: Integrate with backend endpoint when available (e.g. DELETE /api/profile/delete)
  const useDeleteAccountMutation = () =>
    useMutation<void, Error, void>({
      mutationFn: async () => {
        console.log('TODO: Implement account self-deletion on backend');
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
      },
      onSuccess: () => {
        toast.success('Your account has been deleted.');
        logout();
        navigate(ROUTES.HOME);
      },
      onError: () => {
        toast.error('Failed to delete account. Please try again.');
      },
    });

  return {
    useUpdatePasswordMutation,
    useUpdateNotificationSettingsMutation,
    useUpdatePrivacySettingsMutation,
    useDeleteAccountMutation,
  };
};
