import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useBlogs } from '../../hooks/useBlogs';
import { BlogGrid } from '../../components/blog/BlogGrid';
import { ArrowLeft, Search } from 'lucide-react';
import { ROUTES } from '../../routes/routes';

export const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { useBlogSearchTitleQuery } = useBlogs();
  const { data: searchResults, isLoading } = useBlogSearchTitleQuery({ keyword: query });

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
        <Search className="h-6 w-6 text-indigo-500" />
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">
          Search Results for "{query}"
        </h1>
      </div>

      {/* Grid Results */}
      <div className="pt-2">
        <BlogGrid 
          blogs={searchResults || []} 
          isLoading={isLoading} 
          emptyMessage={`We couldn't find any GenzVerse blogs matching "${query}". Check spelling or search other keywords.`}
        />
      </div>
    </div>
  );
};
export default SearchResults;
