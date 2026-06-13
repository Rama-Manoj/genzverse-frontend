import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../api/profile.api';
import type { UpdateProfileRequest } from '../api/profile.api';
import type { UserProfileResponse } from '../types';

export const useProfile = () => {
  const queryClient = useQueryClient();

  // Query: Get active user's profile
  const useProfileMeQuery = () => 
    useQuery<UserProfileResponse, Error>({
      queryKey: ['profile', 'me'],
      queryFn: () => profileApi.getMe(),
    });

  // Query: Get public user profile by ID
  const usePublicProfileQuery = (userId: number) => 
    useQuery<UserProfileResponse, Error>({
      queryKey: ['profile', 'public', userId],
      queryFn: () => profileApi.getPublicProfile(userId),
      enabled: !!userId,
    });

  // Mutation: Update active profile
  const updateProfileMutation = useMutation<UserProfileResponse, Error, UpdateProfileRequest>({
    mutationFn: (data) => profileApi.updateMe(data),
    onSuccess: (updatedProfile) => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['profile', 'public', updatedProfile.id] });
    },
  });

  // Mutation: Upload file
  const uploadFileMutation = useMutation<string, Error, File>({
    mutationFn: (file) => profileApi.uploadFile(file),
  });

  return {
    useProfileMeQuery,
    usePublicProfileQuery,

    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,

    uploadFile: uploadFileMutation.mutateAsync,
    isUploading: uploadFileMutation.isPending,
  };
};
