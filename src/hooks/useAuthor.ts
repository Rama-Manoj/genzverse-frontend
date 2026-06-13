import { useQuery } from '@tanstack/react-query';
import { profileApi } from '../api/profile.api';
import type { AuthorProfileResponse } from '../types';

export const useAuthor = (userId: number) => {
  const authorQuery = useQuery<AuthorProfileResponse, Error>({
    queryKey: ['author', userId],
    queryFn: () => profileApi.getAuthorDetails(userId),
    enabled: !!userId,
  });

  return {
    author: authorQuery.data,
    isLoading: authorQuery.isLoading,
    isError: authorQuery.isError,
    error: authorQuery.error,
  };
};
