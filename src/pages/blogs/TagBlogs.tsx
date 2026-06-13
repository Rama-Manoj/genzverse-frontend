import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBlogs } from '../../hooks/useBlogs';
import { BlogGrid } from '../../components/blog/BlogGrid';
import { ArrowLeft, Hash } from 'lucide-react';
import { ROUTES } from '../../routes/routes';

export const TagBlogs: React.FC = () => {
  const { tagName } = useParams<{ tagName: string }>();

  const { useBlogsByTagQuery } = useBlogs();
  const { data: blogs, isLoading } = useBlogsByTagQuery(tagName || '');

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-4">
      {/* Back to Home */}
      <Link 
        to={ROUTES.HOME}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-500 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>BACK TO HOME</span>
      </Link>

      {/* Title */}
      <div className="flex items-center gap-3">
        <Hash className="h-6 w-6 text-indigo-500" />
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">
          Tag Feed: #{tagName}
        </h1>
      </div>

      {/* Grid Results */}
      <div className="pt-2">
        <BlogGrid 
          blogs={blogs || []} 
          isLoading={isLoading} 
          emptyMessage={`There are currently no GenzVerse publications tagged with #${tagName}.`}
        />
      </div>
    </div>
  );
};
export default TagBlogs;
