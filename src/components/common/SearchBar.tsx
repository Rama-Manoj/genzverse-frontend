import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onSearchComplete?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  className = '', 
  placeholder = 'Search blogs, tags, authors...',
  onSearchComplete
}) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      if (onSearchComplete) onSearchComplete();
    }
  };

  return (
    <form onSubmit={handleSearch} className={`relative flex items-center ${className}`}>
      <div className="relative w-full">
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-10 pl-10 pr-4 rounded-full border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900/50 backdrop-blur-md transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400"
        />
        <Search className="absolute left-3.5 top-2.5 h-4.5 w-4.5 text-slate-400" />
      </div>
    </form>
  );
};
export default SearchBar;
