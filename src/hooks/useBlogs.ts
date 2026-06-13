import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogApi } from '../api/blog.api';
import type { SearchParams } from '../api/blog.api';
import type { BlogResponse, CreateBlogRequest, ShareResponse } from '../types';

export const useBlogs = () => {
  const queryClient = useQueryClient();

  // Query: Get all blogs
  const useBlogsQuery = () => 
    useQuery<BlogResponse[], Error>({
      queryKey: ['blogs'],
      queryFn: () => blogApi.getAll(),
    });

  // Query: Get blog by ID
  const useBlogQuery = (id: number) => 
    useQuery<BlogResponse, Error>({
      queryKey: ['blogs', 'id', id],
      queryFn: () => blogApi.getById(id),
      enabled: !!id,
    });

  // Query: Get public blog by ID
  const useBlogPublicQuery = (id: number) => 
    useQuery<BlogResponse, Error>({
      queryKey: ['blogs', 'public', id],
      queryFn: () => blogApi.getPublicById(id),
      enabled: !!id,
    });

  // Query: Get blog by slug
  const useBlogSlugQuery = (slug: string) => 
    useQuery<BlogResponse, Error>({
      queryKey: ['blogs', 'slug', slug],
      queryFn: () => blogApi.getBySlug(slug),
      enabled: !!slug,
    });

  // Query: Search blogs by title
  const useBlogSearchTitleQuery = (params: SearchParams) => 
    useQuery<BlogResponse[], Error>({
      queryKey: ['blogs', 'search', 'title', params],
      queryFn: () => blogApi.searchByTitle(params),
      enabled: !!params.keyword,
    });

  // Query: Search blogs by content
  const useBlogSearchContentQuery = (params: SearchParams) => 
    useQuery<BlogResponse[], Error>({
      queryKey: ['blogs', 'search', 'content', params],
      queryFn: () => blogApi.searchByContent(params),
      enabled: !!params.keyword,
    });

  // Query: Get blogs by category
  const useBlogsByCategoryQuery = (categoryName: string) => 
    useQuery<BlogResponse[], Error>({
      queryKey: ['blogs', 'category', categoryName],
      queryFn: () => blogApi.getByCategory(categoryName),
      enabled: !!categoryName,
    });

  // Query: Get blogs by tag
  const useBlogsByTagQuery = (tagName: string) => 
    useQuery<BlogResponse[], Error>({
      queryKey: ['blogs', 'tag', tagName],
      queryFn: () => blogApi.getByTag(tagName),
      enabled: !!tagName,
    });

  // Query: Get trending blogs
  const useTrendingBlogsQuery = (sortBy: 'views' | 'likes' | 'comments') => 
    useQuery<BlogResponse[], Error>({
      queryKey: ['blogs', 'trending', sortBy],
      queryFn: () => {
        if (sortBy === 'likes') return blogApi.getTrendingByLikes();
        if (sortBy === 'comments') return blogApi.getTrendingByComments();
        return blogApi.getTrendingByViews();
      },
    });

  // Mutation: Create blog
  const createBlogMutation = useMutation<BlogResponse, Error, CreateBlogRequest>({
    mutationFn: (data) => blogApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });

  // Mutation: Update blog
  const updateBlogMutation = useMutation<BlogResponse, Error, { id: number; data: CreateBlogRequest }>({
    mutationFn: ({ id, data }) => blogApi.update(id, data),
    onSuccess: (updatedBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blogs', 'id', updatedBlog.id] });
      if (updatedBlog.slug) {
        queryClient.invalidateQueries({ queryKey: ['blogs', 'slug', updatedBlog.slug] });
      }
    },
  });

  // Mutation: Delete blog
  const deleteBlogMutation = useMutation<void, Error, number>({
    mutationFn: (id) => blogApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blogs', 'id', id] });
    },
  });

  // Mutation: Share blog
  const shareBlogMutation = useMutation<ShareResponse, Error, number>({
    mutationFn: (id) => blogApi.share(id),
  });

  return {
    useBlogsQuery,
    useBlogQuery,
    useBlogPublicQuery,
    useBlogSlugQuery,
    useBlogSearchTitleQuery,
    useBlogSearchContentQuery,
    useBlogsByCategoryQuery,
    useBlogsByTagQuery,
    useTrendingBlogsQuery,
    
    createBlog: createBlogMutation.mutateAsync,
    isCreating: createBlogMutation.isPending,
    
    updateBlog: updateBlogMutation.mutateAsync,
    isUpdating: updateBlogMutation.isPending,
    
    deleteBlog: deleteBlogMutation.mutateAsync,
    isDeleting: deleteBlogMutation.isPending,

    shareBlog: shareBlogMutation.mutateAsync,
    isSharing: shareBlogMutation.isPending,
  };
};
