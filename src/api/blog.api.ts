import { apiClient } from './client';
import type { BlogResponse, CreateBlogRequest, ShareResponse } from '../types';

export interface SearchParams {
  keyword: string;
  page?: number;
  size?: number;
  sort?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const enrichBlog = (blog: any): BlogResponse => {
  if (!blog) return blog;
  
  // If category is missing, assign one based on content keywords or id
  let category = blog.category;
  if (!category) {
    const titleLower = (blog.title || '').toLowerCase();
    const contentLower = (blog.content || '').toLowerCase();

    if (titleLower.includes('spring') || titleLower.includes('boot') || titleLower.includes('backend') || titleLower.includes('api') || contentLower.includes('java') || contentLower.includes('database')) {
      category = 'Programming';
    } else if (titleLower.includes('figma') || titleLower.includes('ux') || titleLower.includes('ui') || titleLower.includes('design') || titleLower.includes('color') || contentLower.includes('layout')) {
      category = 'Design';
    } else if (titleLower.includes('career') || titleLower.includes('interview') || titleLower.includes('resume') || titleLower.includes('job') || contentLower.includes('hiring')) {
      category = 'Career';
    } else if (titleLower.includes('ai') || titleLower.includes('chatgpt') || titleLower.includes('gpt') || titleLower.includes('model') || contentLower.includes('intelligence')) {
      category = 'AI';
    } else if (titleLower.includes('lifestyle') || titleLower.includes('productivity') || titleLower.includes('routine') || contentLower.includes('morning') || contentLower.includes('coffee')) {
      category = 'Lifestyle';
    } else {
      // Deterministic fallback based on ID so it remains consistent and distributed
      const cats = ['Technology', 'Lifestyle', 'Design', 'Programming', 'Career', 'AI'];
      const index = Math.abs(blog.id) % cats.length;
      category = cats[index];
    }
  }

  // If tags is missing or empty, assign tags based on the category
  let tags = blog.tags;
  if (!tags || !Array.isArray(tags) || tags.length === 0) {
    const titleLower = (blog.title || '').toLowerCase();
    
    // Check keywords first
    const keywords: string[] = [];
    if (titleLower.includes('spring')) keywords.push('Spring');
    if (titleLower.includes('boot')) keywords.push('SpringBoot');
    if (titleLower.includes('java')) keywords.push('Java');
    if (titleLower.includes('react')) keywords.push('React');
    if (titleLower.includes('typescript')) keywords.push('TypeScript');
    if (titleLower.includes('figma')) keywords.push('Figma');
    if (titleLower.includes('design')) keywords.push('UIUX');
    if (titleLower.includes('ai')) keywords.push('AI');
    if (titleLower.includes('chatgpt')) keywords.push('ChatGPT');
    if (titleLower.includes('career')) keywords.push('Career');
    if (titleLower.includes('ayyappa')) keywords.push('Ayyappa', 'Devotional');
    
    if (keywords.length > 0) {
      tags = keywords;
    } else {
      // Fallback based on category
      const tagMap: Record<string, string[]> = {
        'Technology': ['Tech', 'Innovation', 'Future'],
        'Design': ['Design', 'UIUX', 'Figma', 'Creative'],
        'Lifestyle': ['Lifestyle', 'Productivity', 'Routine', 'Mindset'],
        'Programming': ['Programming', 'Code', 'WebDev', 'Developer'],
        'Career': ['Career', 'Jobs', 'Interview', 'TechJobs'],
        'AI': ['AI', 'LLM', 'MachineLearning', 'ChatGPT']
      };
      tags = tagMap[category] || ['Tech', 'GenzVerse'];
    }
  }

  return {
    ...blog,
    category,
    tags
  };
};

export const sortBlogsNewestFirst = (blogs: BlogResponse[]): BlogResponse[] => {
  return [...blogs].sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    if (isNaN(timeA) || isNaN(timeB) || timeA === timeB) {
      return b.id - a.id;
    }
    return timeB - timeA;
  });
};

export const blogApi = {
  create: async (data: CreateBlogRequest): Promise<BlogResponse> => {
    const response = await apiClient.post<BlogResponse>('/api/blogs', data);
    return enrichBlog(response.data);
  },

  getAll: async (): Promise<BlogResponse[]> => {
    const response = await apiClient.get<BlogResponse[]>('/api/blogs');
    return sortBlogsNewestFirst(response.data.map(enrichBlog));
  },

  getById: async (id: number): Promise<BlogResponse> => {
    const response = await apiClient.get<BlogResponse>(`/api/blogs/${id}`);
    return enrichBlog(response.data);
  },

  update: async (id: number, data: CreateBlogRequest): Promise<BlogResponse> => {
    const response = await apiClient.put<BlogResponse>(`/api/blogs/${id}`, data);
    return enrichBlog(response.data);
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/blogs/${id}`);
  },

  searchByTitle: async (params: SearchParams): Promise<BlogResponse[]> => {
    const response = await apiClient.get<BlogResponse[]>('/api/blogs/search/title', {
      params: {
        keyword: params.keyword,
        page: params.page ?? 0,
        size: params.size ?? 5,
        sort: params.sort ?? 'desc',
      },
    });
    return sortBlogsNewestFirst(response.data.map(enrichBlog));
  },

  searchByContent: async (params: SearchParams): Promise<BlogResponse[]> => {
    const response = await apiClient.get<BlogResponse[]>('/api/blogs/search/content', {
      params: {
        keyword: params.keyword,
        page: params.page ?? 0,
        size: params.size ?? 5,
        sort: params.sort ?? 'desc',
      },
    });
    return sortBlogsNewestFirst(response.data.map(enrichBlog));
  },

  getTrendingByViews: async (): Promise<BlogResponse[]> => {
    const response = await apiClient.get<BlogResponse[]>('/api/blogs/trending/views');
    return response.data.map(enrichBlog);
  },

  getTrendingByLikes: async (): Promise<BlogResponse[]> => {
    const response = await apiClient.get<BlogResponse[]>('/api/blogs/trending/likes');
    return response.data.map(enrichBlog);
  },

  getTrendingByComments: async (): Promise<BlogResponse[]> => {
    const response = await apiClient.get<BlogResponse[]>('/api/blogs/trending/comments');
    return response.data.map(enrichBlog);
  },

  share: async (blogId: number): Promise<ShareResponse> => {
    const response = await apiClient.post<ShareResponse>(`/api/blogs/${blogId}/share`);
    return response.data;
  },

  getPublicById: async (id: number): Promise<BlogResponse> => {
    const response = await apiClient.get<BlogResponse>(`/api/blogs/public/${id}`);
    return enrichBlog(response.data);
  },

  getByCategory: async (categoryName: string): Promise<BlogResponse[]> => {
    const response = await apiClient.get<BlogResponse[]>(`/api/blogs/category/${categoryName}`);
    return sortBlogsNewestFirst(response.data.map(b => enrichBlog({ ...b, category: categoryName })));
  },

  getByTag: async (tagName: string): Promise<BlogResponse[]> => {
    const response = await apiClient.get<BlogResponse[]>(`/api/blogs/tag/${tagName}`);
    return sortBlogsNewestFirst(response.data.map(b => {
      const enriched = enrichBlog(b);
      const tags = [...(enriched.tags || [])];
      const tagLower = tagName.toLowerCase();
      if (!tags.some(t => t.toLowerCase() === tagLower)) {
        tags.push(tagName);
      }
      return { ...enriched, tags };
    }));
  },

  getBySlug: async (slug: string): Promise<BlogResponse> => {
    const response = await apiClient.get<BlogResponse>(`/api/blogs/slug/${slug}`);
    return enrichBlog(response.data);
  },
};
