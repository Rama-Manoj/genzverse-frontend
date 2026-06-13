export interface User {
  id: number;
  username: string;
  email: string;
  role?: 'USER' | 'ADMIN';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: 'USER' | 'ADMIN';
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface BlogResponse {
  id: number;
  title: string;
  content: string;
  thumbnailUrl: string;
  author: string;
  authorId?: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  slug?: string;
  category?: string;
  tags?: string[];
}

export interface CreateBlogRequest {
  title: string;
  content: string;
  thumbnailUrl: string;
  category: string;
  tags: string[];
}

export interface CommentResponse {
  id: number;
  content: string;
  username: string;
  createdAt: string;
  parentCommentId?: number | null;
  replies?: CommentResponse[];
}

export interface CreateCommentRequest {
  content: string;
  parentCommentId: number | null;
}

export interface UserProfileResponse {
  id: number;
  username: string;
  email: string;
  bio: string;
  profileImage: string;
  website: string;
  linkedinUrl: string;
  githubUrl: string;
}

export interface AuthorProfileResponse {
  id: number;
  username: string;
  bio: string;
  followers: number;
  following: number;
  totalBlogs: number;
  blogs: {
    id: number;
    title: string;
    slug: string;
  }[];
}

export interface DashboardResponse {
  totalBlogs: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  followers: number;
  following: number;
  savedBlogs: number;
}

export interface NotificationResponse {
  id: number;
  message: string;
  type: 'LIKE' | 'COMMENT' | 'FOLLOW' | 'SHARE' | 'SYSTEM';
  read: boolean;
  createdAt: string;
}

export interface NotificationCountResponse {
  unreadCount: number;
}

export interface ShareResponse {
  shareUrl: string;
  totalShares: number;
}

export interface ErrorResponse {
  message: string;
  status: number;
  timestamp: string;
}

export interface AdminStatsResponse {
  totalUsers: number;
  totalBlogs: number;
  totalComments: number;
}

