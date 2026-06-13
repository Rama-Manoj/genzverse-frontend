export const ROUTES = {
  // Public
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  BLOG_DETAILS: '/blog/:slug',
  AUTHOR_PROFILE: '/author/:id',

  // Public Info Pages
  ABOUT: '/about',
  CONTACT: '/contact',
  FAQ: '/faq',
  PRIVACY: '/privacy-policy',
  TERMS: '/terms-conditions',

  // Discovery Pages
  EXPLORE: '/explore',
  TRENDING: '/trending',
  CATEGORIES: '/categories',
  TAGS: '/tags',

  // Protected
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  PROFILE_EDIT: '/profile/edit',
  CREATE_BLOG: '/create-blog',
  EDIT_BLOG: '/edit-blog/:id',
  SAVED: '/saved',
  NOTIFICATIONS: '/notifications',

  // User Pages
  SETTINGS: '/settings',
  MY_BLOGS: '/my-blogs',

  // Admin
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_BLOGS: '/admin/blogs',
  ADMIN_COMMENTS: '/admin/comments',

  // Errors
  FORBIDDEN: '/403',
  ERROR: '/error',
};
