import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { socialApi } from '../api/social.api';
import type { BlogResponse } from '../types';

export const useSavedBlogs = () => {
  const queryClient = useQueryClient();

  // Query: Get all saved blogs of current user
  const savedBlogsQuery = useQuery<BlogResponse[], Error>({
    queryKey: ['blogs', 'saved'],
    queryFn: () => socialApi.getSavedBlogs(),
  });

  // Mutation: Save / Unsave blog
  const toggleSaveMutation = useMutation<void, Error, number, { previousSaved: BlogResponse[] | undefined }>({
    mutationFn: (blogId) => socialApi.toggleSave(blogId),
    onMutate: async (blogId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['blogs', 'saved'] });
      await queryClient.cancelQueries({ queryKey: ['blogs', 'id', blogId] });

      // Snapshot previous saved blogs list
      const previousSaved = queryClient.getQueryData<BlogResponse[]>(['blogs', 'saved']);
      const isSaved = previousSaved?.some(b => b.id === blogId) ?? false;

      // Optimistically update saved list
      queryClient.setQueryData<BlogResponse[]>(['blogs', 'saved'], (old) => {
        if (!old) return [];
        if (isSaved) {
          return old.filter(b => b.id !== blogId);
        } else {
          // Find blog details in cache to add it to saved list
          let blogDetails = queryClient.getQueryData<BlogResponse>(['blogs', 'id', blogId]);
          if (!blogDetails) {
            const allBlogs = queryClient.getQueryData<BlogResponse[]>(['blogs']);
            blogDetails = allBlogs?.find(b => b.id === blogId);
          }
          if (!blogDetails) {
            queryClient.getQueriesData({ queryKey: ['blogs', 'slug'] }).forEach(([, data]) => {
              if (data && (data as BlogResponse).id === blogId) {
                blogDetails = data as BlogResponse;
              }
            });
          }
          return blogDetails ? [...old, blogDetails] : old;
        }
      });

      return { previousSaved };
    },
    onError: (_err, _blogId, context) => {
      if (context?.previousSaved) {
        queryClient.setQueryData(['blogs', 'saved'], context.previousSaved);
      }
    },
    onSettled: (_data, _error, blogId) => {
      queryClient.invalidateQueries({ queryKey: ['blogs', 'saved'] });
      queryClient.invalidateQueries({ queryKey: ['blogs', 'id', blogId] });
      queryClient.invalidateQueries({ queryKey: ['blogs', 'public', blogId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  return {
    savedBlogs: savedBlogsQuery.data || [],
    isLoading: savedBlogsQuery.isLoading,
    isError: savedBlogsQuery.isError,
    error: savedBlogsQuery.error,

    toggleSave: toggleSaveMutation.mutateAsync,
    isTogglingSave: toggleSaveMutation.isPending,
  };
};
