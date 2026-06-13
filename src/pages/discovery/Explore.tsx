import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Compass, Hash, ListFilter } from 'lucide-react';
import { useBlogs } from '../../hooks/useBlogs';
import { BlogGrid } from '../../components/blog/BlogGrid';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { label: 'All Articles', value: '' },
  { label: 'Technology', value: 'Technology' },
  { label: 'Design', value: 'Design' },
  { label: 'Lifestyle', value: 'Lifestyle' },
  { label: 'Programming', value: 'Programming' },
  { label: 'Career', value: 'Career' },
];

export const Explore: React.FC = () => {
  const navigate = useNavigate();
  const { useBlogsQuery, useBlogsByCategoryQuery } = useBlogs();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    document.title = 'Explore Publications | GenzVerse';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Explore, search, and filter premium technical content, lifestyle tips, and designer insights from Gen-Z creators.');
    }
  }, []);

  // Fetch blogs based on active category
  const allBlogsQuery = useBlogsQuery();
  const categoryBlogsQuery = useBlogsByCategoryQuery(selectedCategory);

  const { data: blogs = [], isLoading } = selectedCategory
    ? categoryBlogsQuery
    : allBlogsQuery;

  // Client-side search filtering if query is entered
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = searchQuery.trim() === '' || 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-4 px-1">
      {/* Header section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-4 border-b border-slate-100 dark:border-slate-800/80"
      >
        <div>
          <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs uppercase tracking-widest">
            <Compass className="h-4 w-4" />
            <span>Discovery</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight mt-1 text-slate-900 dark:text-slate-100">
            Explore Publications
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Search developer logs, tutorials, and lifestyle thoughts across categories and tags.
          </p>
        </div>

        {/* Search Bar Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-xs shrink-0">
          <input
            type="text"
            placeholder="Search keywords, creators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-white/60 dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs font-semibold placeholder-slate-450 dark:placeholder-slate-500 shadow-sm"
          />
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-450 dark:text-slate-600" />
        </form>
      </motion.div>

      {/* Grid: Categories & Main Feed */}
      <div className="space-y-6">
        
        {/* Category Pills Header */}
        <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-900">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`shrink-0 flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold border transition ${
                  selectedCategory === cat.value
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white border-transparent shadow-md shadow-purple-500/10'
                    : 'bg-white/40 dark:bg-slate-900/40 text-slate-650 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-purple-400'
                }`}
              >
                {selectedCategory !== cat.value && cat.value && <Hash className="h-2.5 w-2.5 text-pink-500" />}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
          
          <div className="hidden sm:flex items-center gap-1 text-slate-400 text-xs shrink-0 select-none">
            <ListFilter className="h-3.5 w-3.5" />
            <span>Filter</span>
          </div>
        </div>

        {/* Blogs Grid */}
        <div className="min-h-[300px]">
          <BlogGrid
            blogs={filteredBlogs}
            isLoading={isLoading}
            emptyMessage={
              searchQuery
                ? `No results match "${searchQuery}". Try a different keyword.`
                : selectedCategory
                ? `No posts available in the ${selectedCategory} category yet.`
                : 'No GenzVerse publications found.'
            }
          />
        </div>

      </div>
      
    </div>
  );
};

export default Explore;
