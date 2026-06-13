import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentApi } from '../api/comment.api';
import type { CommentResponse, CreateCommentRequest, BlogResponse } from '../types';

export const useComments = (blogId: number) => {
  const queryClient = useQueryClient();

  // Query: Get comments for specific blog
  const commentsQuery = useQuery<CommentResponse[], Error>({
    queryKey: ['comments', blogId],
    queryFn: () => commentApi.getByBlogId(blogId),
    enabled: !!blogId,
  });

  // Mutation: Add comment/reply
  const addCommentMutation = useMutation<CommentResponse, Error, CreateCommentRequest & { username: string }, { previousComments: CommentResponse[] | undefined }>({
    mutationFn: ({ content, parentCommentId }) => commentApi.add(blogId, { content, parentCommentId }),
    onMutate: async (newComment) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['comments', blogId] });

      // Snapshot previous comments
      const previousComments = queryClient.getQueryData<CommentResponse[]>(['comments', blogId]);

      // Create optimistic comment object
      const optimisticComment: CommentResponse = {
        id: Date.now(), // temporary ID
        content: newComment.content,
        username: newComment.username,
        createdAt: new Date().toISOString(),
        parentCommentId: newComment.parentCommentId,
        replies: [],
      };

      // Optimistically update comments query cache
      queryClient.setQueryData<CommentResponse[]>(['comments', blogId], (old) => {
        const list = old ? [...old] : [];
        if (newComment.parentCommentId) {
          // If it is a reply, recursively find parent and append to replies list
          const addToReplies = (commentsList: CommentResponse[]): boolean => {
            for (let i = 0; i < commentsList.length; i++) {
              if (commentsList[i].id === newComment.parentCommentId) {
                commentsList[i] = {
                  ...commentsList[i],
                  replies: [...(commentsList[i].replies || []), optimisticComment],
                };
                return true;
              }
              const replies = commentsList[i].replies;
              if (replies && replies.length > 0) {
                const found = addToReplies(replies);
                if (found) return true;
              }
            }
            return false;
          };
          addToReplies(list);
          return list;
        } else {
          // Top-level comment
          return [optimisticComment, ...list];
        }
      });

      // Optimistically increment comment count on blog caches
      queryClient.setQueryData<BlogResponse>(['blogs', 'id', blogId], (old) => {
        if (!old) return old;
        return { ...old, comments: (old.comments || 0) + 1 };
      });

      queryClient.getQueriesData({ queryKey: ['blogs', 'slug'] }).forEach(([key, oldData]) => {
        if (oldData && (oldData as BlogResponse).id === blogId) {
          queryClient.setQueryData(key, {
            ...oldData as BlogResponse,
            comments: ((oldData as BlogResponse).comments || 0) + 1,
          });
        }
      });

      return { previousComments };
    },
    onError: (_err, _newComment, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(['comments', blogId], context.previousComments);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', blogId] });
      queryClient.invalidateQueries({ queryKey: ['blogs', 'id', blogId] });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });

  // Mutation: Delete comment
  const deleteCommentMutation = useMutation<void, Error, number, { previousComments: CommentResponse[] | undefined }>({
    mutationFn: (commentId) => commentApi.delete(commentId),
    onMutate: async (commentId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['comments', blogId] });

      // Snapshot previous comments
      const previousComments = queryClient.getQueryData<CommentResponse[]>(['comments', blogId]);

      // Recursive function to remove comment from cache list
      const removeComment = (commentsList: CommentResponse[]): CommentResponse[] => {
        return commentsList
          .filter((c) => c.id !== commentId)
          .map((c) => ({
            ...c,
            replies: c.replies ? removeComment(c.replies) : [],
          }));
      };

      // Optimistically update comments query cache
      queryClient.setQueryData<CommentResponse[]>(['comments', blogId], (old) => {
        return old ? removeComment(old) : [];
      });

      // Optimistically decrement comment count on blog caches
      queryClient.setQueryData<BlogResponse>(['blogs', 'id', blogId], (old) => {
        if (!old) return old;
        return { ...old, comments: Math.max(0, (old.comments || 0) - 1) };
      });

      queryClient.getQueriesData({ queryKey: ['blogs', 'slug'] }).forEach(([key, oldData]) => {
        if (oldData && (oldData as BlogResponse).id === blogId) {
          queryClient.setQueryData(key, {
            ...oldData as BlogResponse,
            comments: Math.max(0, ((oldData as BlogResponse).comments || 0) - 1),
          });
        }
      });

      return { previousComments };
    },
    onError: (_err, _commentId, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(['comments', blogId], context.previousComments);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', blogId] });
      queryClient.invalidateQueries({ queryKey: ['blogs', 'id', blogId] });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });

  return {
    comments: commentsQuery.data || [],
    isLoading: commentsQuery.isLoading,
    isError: commentsQuery.isError,
    error: commentsQuery.error,

    addComment: addCommentMutation.mutateAsync,
    isAdding: addCommentMutation.isPending,

    deleteComment: deleteCommentMutation.mutateAsync,
    isDeleting: deleteCommentMutation.isPending,
  };
};
