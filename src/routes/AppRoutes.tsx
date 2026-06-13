import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from './routes';
import { RootLayout } from '../layouts/RootLayout';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { AdminRoute } from '../components/common/AdminRoute';
import { PublicRoute } from '../components/common/PublicRoute';

// Page imports
import { HomeFeed } from '../pages/blogs/HomeFeed';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';
import { VerifyEmailPage } from '../pages/auth/VerifyEmailPage';
import { BlogDetails } from '../pages/blogs/BlogDetails';
import { AuthorProfile } from '../pages/profile/AuthorProfile';
import { SearchResults } from '../pages/blogs/SearchResults';
import { CategoryBlogs } from '../pages/blogs/CategoryBlogs';
import { TagBlogs } from '../pages/blogs/TagBlogs';

// New Public & Discovery Pages
import { About } from '../pages/public/About';
import { Contact } from '../pages/public/Contact';
import { FAQ } from '../pages/public/FAQ';
import { PrivacyPolicy } from '../pages/public/PrivacyPolicy';
import { TermsConditions } from '../pages/public/TermsConditions';
import { Explore } from '../pages/discovery/Explore';
import { Trending } from '../pages/discovery/Trending';
import { Categories } from '../pages/discovery/Categories';
import { Tags } from '../pages/discovery/Tags';

// Protected Pages
import { UserDashboard } from '../pages/dashboard/UserDashboard';
import { UserProfile } from '../pages/profile/UserProfile';
import { EditProfile } from '../pages/profile/EditProfile';
import { CreateBlog } from '../pages/blogs/CreateBlog';
import { EditBlog } from '../pages/blogs/EditBlog';
import { SavedBlogs } from '../pages/social/SavedBlogs';
import { Notifications } from '../pages/social/Notifications';

// New User Pages
import { SettingsPage } from '../pages/user/SettingsPage';
import { MyBlogs } from '../pages/user/MyBlogs';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminUsers } from '../pages/admin/AdminUsers';
import { AdminBlogs } from '../pages/admin/AdminBlogs';
import { AdminComments } from '../pages/admin/AdminComments';

// New Error Pages
import { NotFoundPage } from '../pages/errors/NotFoundPage';
import { ForbiddenPage } from '../pages/errors/ForbiddenPage';
import { ErrorPage } from '../pages/errors/ErrorPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Root Layout wraps all routes (giving navbar/sidebar context) */}
      <Route element={<RootLayout />}>
        
        {/* === ALWAYS PUBLIC BROWSING ROUTES === */}
        <Route path={ROUTES.HOME} element={<HomeFeed />} />
        <Route path={ROUTES.BLOG_DETAILS} element={<BlogDetails />} />
        <Route path={ROUTES.AUTHOR_PROFILE} element={<AuthorProfile />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/category/:categoryName" element={<CategoryBlogs />} />
        <Route path="/tag/:tagName" element={<TagBlogs />} />

        {/* New Public Info Pages */}
        <Route path={ROUTES.ABOUT} element={<About />} />
        <Route path={ROUTES.CONTACT} element={<Contact />} />
        <Route path={ROUTES.FAQ} element={<FAQ />} />
        <Route path={ROUTES.PRIVACY} element={<PrivacyPolicy />} />
        <Route path={ROUTES.TERMS} element={<TermsConditions />} />

        {/* New Discovery Pages */}
        <Route path={ROUTES.EXPLORE} element={<Explore />} />
        <Route path={ROUTES.TRENDING} element={<Trending />} />
        <Route path={ROUTES.CATEGORIES} element={<Categories />} />
        <Route path={ROUTES.TAGS} element={<Tags />} />

        {/* Error pages */}
        <Route path={ROUTES.FORBIDDEN} element={<ForbiddenPage />} />
        <Route path={ROUTES.ERROR} element={<ErrorPage />} />

        {/* === PUBLIC-ONLY AUTH ROUTES (Redirects to home if already logged in) === */}
        <Route element={<PublicRoute />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
          <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmailPage />} />
        </Route>

        {/* === PROTECTED ROUTES (Visible only if logged in) === */}
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.DASHBOARD} element={<UserDashboard />} />
          <Route path={ROUTES.PROFILE} element={<UserProfile />} />
          <Route path={ROUTES.PROFILE_EDIT} element={<EditProfile />} />
          <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
          <Route path={ROUTES.MY_BLOGS} element={<MyBlogs />} />
          <Route path={ROUTES.CREATE_BLOG} element={<CreateBlog />} />
          <Route path={ROUTES.EDIT_BLOG} element={<EditBlog />} />
          <Route path={ROUTES.SAVED} element={<SavedBlogs />} />
          <Route path={ROUTES.NOTIFICATIONS} element={<Notifications />} />
        </Route>

        {/* === ADMIN ROUTES (Visible only if logged in and admin role) === */}
        <Route element={<AdminRoute />}>
          <Route path={ROUTES.ADMIN} element={<AdminDashboard />} />
          <Route path={ROUTES.ADMIN_USERS} element={<AdminUsers />} />
          <Route path={ROUTES.ADMIN_BLOGS} element={<AdminBlogs />} />
          <Route path={ROUTES.ADMIN_COMMENTS} element={<AdminComments />} />
        </Route>

        {/* Fallback route - Render 404 for unmatched paths */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
