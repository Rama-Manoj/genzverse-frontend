import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { socialApi } from '../api/social.api';
import { profileApi } from '../api/profile.api';
import { adminApi } from '../api/admin.api';
import type { User, BlogResponse, AuthorProfileResponse } from '../types';

// Helper to manage liked blogs in localStorage for session state mapping
const getLikedBlogs = (userId: number): number[] => {
  try {
    const stored = localStorage.getItem(`liked_blogs_${userId}`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const toggleLikedState = (userId: number, blogId: number): boolean => {
  try {
    const liked = getLikedBlogs(userId);
    const index = liked.indexOf(blogId);
    if (index > -1) {
      liked.splice(index, 1);
      localStorage.setItem(`liked_blogs_${userId}`, JSON.stringify(liked));
      return false; // unliked
    } else {
      liked.push(blogId);
      localStorage.setItem(`liked_blogs_${userId}`, JSON.stringify(liked));
      return true; // liked
    }
  } catch {
    return false;
  }
};

export const useSocial = () => {
  const queryClient = useQueryClient();

  // Query: Get user's followers
  const useFollowersQuery = (userId: number) => 
    useQuery<User[], Error>({
      queryKey: ['social', 'followers', userId],
      queryFn: () => socialApi.getFollowers(userId),
      enabled: !!userId,
    });

  // Query: Get user's following list
  const useFollowingQuery = (userId: number) => 
    useQuery<User[], Error>({
      queryKey: ['social', 'following', userId],
      queryFn: () => socialApi.getFollowing(userId),
      enabled: !!userId,
    });

  // Query: Resolve usernames to user IDs on client-side
  const useUserMapQuery = (enabled: boolean = true) =>
    useQuery<Record<string, number>, Error>({
      queryKey: ['social', 'userMap'],
      queryFn: async () => {
        let map: Record<string, number> = {};
        try {
          const cached = localStorage.getItem('genzverse_usermap');
          if (cached) {
            map = JSON.parse(cached);
          }
        } catch {
          // Ignore parse errors
        }

        // Get current user role from localStorage
        const userRole = localStorage.getItem('genzverse_role');

        if (userRole === 'ADMIN') {
          try {
            const users = await adminApi.getAllUsers();
            users.forEach((u) => {
              if (u.username) {
                map[u.username.toLowerCase()] = u.id;
              }
            });
            localStorage.setItem('genzverse_usermap', JSON.stringify(map));
            return map;
          } catch (e) {
            console.error('Failed to fetch admin users mapping, falling back', e);
          }
        }

        // Incremental scan fallback: scan 1 to 50 but skip IDs already resolved or scanned
        let scannedIds: number[] = [];
        try {
          const cachedScanned = localStorage.getItem('genzverse_scanned_ids');
          if (cachedScanned) {
            scannedIds = JSON.parse(cachedScanned);
          }
        } catch {
          // Ignore parse error
        }

        const scannedSet = new Set(scannedIds);
        const existingIds = new Set(Object.values(map));
        const scanIds = Array.from({ length: 50 }, (_, i) => i + 1)
          .filter((id) => !existingIds.has(id) && !scannedSet.has(id));

        if (scanIds.length > 0) {
          // Mark all scanIds as scanned immediately to avoid duplicate scans
          scanIds.forEach((id) => scannedSet.add(id));
          localStorage.setItem('genzverse_scanned_ids', JSON.stringify(Array.from(scannedSet)));

          const promises = scanIds.map(async (id) => {
            try {
              const profile = await profileApi.getPublicProfile(id);
              if (profile && profile.username) {
                map[profile.username.toLowerCase()] = id;
              }
            } catch {
              // Ignore profile missing
            }
          });

          // Run scan asynchronously without blocking the return of the map
          Promise.all(promises).then(() => {
            localStorage.setItem('genzverse_usermap', JSON.stringify(map));
          });
        }

        return map;
      },
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      enabled,
    });

  // Mutation: Toggle follow/unfollow user
  const toggleFollowMutation = useMutation<void, Error, { targetUserId: number; currentUserId: number }, { previousFollowing: User[] | undefined; previousFollowingAlt: User[] | undefined }>({
    mutationFn: ({ targetUserId }) => socialApi.toggleFollow(targetUserId),
    onMutate: async ({ targetUserId, currentUserId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['social', 'following', currentUserId] });
      await queryClient.cancelQueries({ queryKey: ['following', currentUserId] });
      await queryClient.cancelQueries({ queryKey: ['social', 'followers', targetUserId] });
      await queryClient.cancelQueries({ queryKey: ['followers', targetUserId] });
      await queryClient.cancelQueries({ queryKey: ['author'] });

      // Snapshot previous following list
      const previousFollowing = queryClient.getQueryData<User[]>(['social', 'following', currentUserId]);
      const previousFollowingAlt = queryClient.getQueryData<User[]>(['following', currentUserId]);
      
      const isFollowing = (previousFollowing || previousFollowingAlt)?.some(u => u.id === targetUserId) ?? false;

      const updateFollowing = (old: User[] | undefined) => {
        const list = old || [];
        if (isFollowing) {
          return list.filter(u => u.id !== targetUserId);
        } else {
          return [...list, { id: targetUserId, username: 'User', email: '' }];
        }
      };

      // Optimistically update following list
      queryClient.setQueryData<User[]>(['social', 'following', currentUserId], updateFollowing);
      queryClient.setQueryData<User[]>(['following', currentUserId], updateFollowing);

      // Optimistically update author profile statistics followers count
      queryClient.getQueriesData({ queryKey: ['author'] }).forEach(([key, oldData]) => {
        if (oldData && (oldData as AuthorProfileResponse).id === targetUserId) {
          const authData = oldData as AuthorProfileResponse;
          queryClient.setQueryData(key, {
            ...authData,
            followers: isFollowing ? Math.max(0, authData.followers - 1) : authData.followers + 1
          });
        }
      });

      return { previousFollowing, previousFollowingAlt };
    },
    onError: (_err, variables, context) => {
      if (context?.previousFollowing) {
        queryClient.setQueryData(['social', 'following', variables.currentUserId], context.previousFollowing);
      }
      if (context?.previousFollowingAlt) {
        queryClient.setQueryData(['following', variables.currentUserId], context.previousFollowingAlt);
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['social', 'followers', variables.targetUserId] });
      queryClient.invalidateQueries({ queryKey: ['followers', variables.targetUserId] });
      queryClient.invalidateQueries({ queryKey: ['social', 'following', variables.currentUserId] });
      queryClient.invalidateQueries({ queryKey: ['following', variables.currentUserId] });
      queryClient.invalidateQueries({ queryKey: ['author'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  // Mutation: Toggle like on blog post
  const toggleLikeMutation = useMutation<void, Error, { blogId: number; userId: number }, { previousBlogDetails: BlogResponse | undefined }>({
    mutationFn: ({ blogId }) => socialApi.toggleLike(blogId),
    onMutate: async ({ blogId, userId }) => {
      // Determine liked action and toggle state
      const isLiked = toggleLikedState(userId, blogId);

      // Cancel any outgoing refetches for blogs
      await queryClient.cancelQueries({ queryKey: ['blogs'] });
      await queryClient.cancelQueries({ queryKey: ['blogs', 'id', blogId] });

      // Snapshot previous blog detail if cached
      const previousBlogDetails = queryClient.getQueryData<BlogResponse>(['blogs', 'id', blogId]);

      // Optimistically update the detailed blog cache
      queryClient.setQueryData<BlogResponse>(['blogs', 'id', blogId], (old) => {
        if (!old) return old;
        return {
          ...old,
          likes: isLiked ? old.likes + 1 : Math.max(0, old.likes - 1)
        };
      });

      // Optimistically update lists containing the blog
      queryClient.setQueryData<BlogResponse[]>(['blogs'], (old) => {
        if (!old) return old;
        return old.map(b => b.id === blogId ? {
          ...b,
          likes: isLiked ? b.likes + 1 : Math.max(0, b.likes - 1)
        } : b);
      });

      // Update slug cache entries
      queryClient.getQueriesData({ queryKey: ['blogs', 'slug'] }).forEach(([key, oldData]) => {
        if (oldData && (oldData as BlogResponse).id === blogId) {
          queryClient.setQueryData(key, {
            ...oldData as BlogResponse,
            likes: isLiked ? (oldData as BlogResponse).likes + 1 : Math.max(0, (oldData as BlogResponse).likes - 1)
          });
        }
      });

      return { previousBlogDetails };
    },
    onError: (_err, variables, context) => {
      // Rollback liked state in localStorage
      toggleLikedState(variables.userId, variables.blogId);
      if (context?.previousBlogDetails) {
        queryClient.setQueryData(['blogs', 'id', variables.blogId], context.previousBlogDetails);
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blogs', 'id', variables.blogId] });
      queryClient.invalidateQueries({ queryKey: ['blogs', 'public', variables.blogId] });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });

  return {
    useFollowersQuery,
    useFollowingQuery,
    useUserMapQuery,
    isBlogLiked: (blogId: number, userId: number) => getLikedBlogs(userId).includes(blogId),

    toggleFollow: toggleFollowMutation.mutateAsync,
    isTogglingFollow: toggleFollowMutation.isPending,

    toggleLike: toggleLikeMutation.mutateAsync,
    isTogglingLike: toggleLikeMutation.isPending,
  };
};
