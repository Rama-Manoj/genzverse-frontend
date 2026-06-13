import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlogs } from '../../hooks/useBlogs';
import { BlogEditor } from '../../components/blog/BlogEditor';
import { toast } from 'sonner';
import type { CreateBlogRequest } from '../../types';

export const CreateBlog: React.FC = () => {
  const navigate = useNavigate();
  const { createBlog, isCreating } = useBlogs();

  const handleCreateSubmit = async (data: CreateBlogRequest) => {
    try {
      const result = await createBlog(data);
      toast.success('Blog post published successfully!');
      // Redirect to the newly created blog post details page
      navigate(`/blog/${result.slug || result.id}`);
    } catch (err: unknown) {
      const errorMessage = (err as Error)?.message || 'Failed to publish blog post. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="py-6">
      <BlogEditor
        titleText="Create New Publication"
        onSubmit={handleCreateSubmit}
        isSubmitting={isCreating}
      />
    </div>
  );
};
export default CreateBlog;
