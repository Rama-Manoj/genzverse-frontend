import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBlogs } from '../../hooks/useBlogs';
import { BlogEditor } from '../../components/blog/BlogEditor';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';
import { ROUTES } from '../../routes/routes';
import type { CreateBlogRequest } from '../../types';

export const EditBlog: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const blogId = Number(id);

  const { useBlogQuery, updateBlog, isUpdating } = useBlogs();
  const { data: blog, isLoading, isError, error } = useBlogQuery(blogId);

  const handleEditSubmit = async (data: CreateBlogRequest) => {
    try {
      const result = await updateBlog({ id: blogId, data });
      toast.success('Blog post updated successfully!');
      // Redirect back to the blog details page
      navigate(`/blog/${result.slug || result.id}`);
    } catch (err: unknown) {
      const errorMessage = (err as Error)?.message || 'Failed to update blog post. Please try again.';
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
          <p className="text-sm text-slate-500 animate-pulse">Loading publication details...</p>
        </div>
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto space-y-4">
        <p className="text-base font-bold text-rose-500">Error loading article</p>
        <p className="text-xs text-slate-500 leading-relaxed">
          {error?.message || 'The blog post you requested to edit could not be found.'}
        </p>
        <Link to={ROUTES.HOME} className="inline-flex items-center gap-2 text-sm text-indigo-500 font-semibold hover:underline">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Feed</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-6">
      <BlogEditor
        initialData={blog}
        titleText={`Edit "${blog.title}"`}
        onSubmit={handleEditSubmit}
        isSubmitting={isUpdating}
      />
    </div>
  );
};
export default EditBlog;
