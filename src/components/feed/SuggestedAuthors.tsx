import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useBlogs } from '../../hooks/useBlogs';
import { FollowButton } from './FollowButton';
import { Users2, Sparkles } from 'lucide-react';
import type { BlogResponse } from '../../types';
import { useSocial } from '../../hooks/useSocial';
import { useAuth } from '../../store/AuthContext';

interface AuthorStats {
  username: string;
  postCount: number;
  totalLikes: number;
  totalViews: number;
  authorId?: number;
}

const deriveAuthors = (blogs: BlogResponse[], userMap: Record<string, number> | undefined): AuthorStats[] => {
  const map = new Map<string, AuthorStats>();

  // Initialize map with all known users from userMap
  if (userMap) {
    Object.entries(userMap).forEach(([username, id]) => {
      const caseUsername = blogs.find(b => b.author.toLowerCase() === username)?.author || username;
      map.set(username, {
        username: caseUsername,
        postCount: 0,
        totalLikes: 0,
        totalViews: 0,
        authorId: id,
      });
    });
  }

  // Aggregate stats from blogs
  blogs.forEach(blog => {
    const key = blog.author.toLowerCase();
    const existing = map.get(key);
    if (existing) {
      existing.postCount += 1;
      existing.totalLikes += blog.likes;
      existing.totalViews += blog.views;
      existing.username = blog.author;
      if (blog.authorId) {
        existing.authorId = blog.authorId;
      }
    } else {
      map.set(key, {
        username: blog.author,
        postCount: 1,
        totalLikes: blog.likes,
        totalViews: blog.views,
        authorId: blog.authorId,
      });
    }
  });

  return Array.from(map.values())
    .sort((a, b) => b.totalLikes + b.totalViews - (a.totalLikes + a.totalViews));
};

const avatarColors = [
  'from-indigo-500 to-purple-500',
  'from-pink-500 to-rose-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-blue-500 to-cyan-500',
];

export const SuggestedAuthors: React.FC = () => {
  const { user } = useAuth();
  const { useUserMapQuery } = useSocial();
  const { data: userMap } = useUserMapQuery(!!user);
  const { useBlogsQuery } = useBlogs();
  const { data: blogs, isLoading } = useBlogsQuery();

  const authors = useMemo(() => {
    let derived = blogs ? deriveAuthors(blogs, userMap) : [];
    if (user) {
      derived = derived.filter(author => author.username.toLowerCase() !== user.username.toLowerCase());
    }
    return derived;
  }, [blogs, userMap, user]);

  return (
    <div className="no-hover bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
        <div className="p-1.5 rounded-xl bg-purple-100 dark:bg-purple-950/40">
          <Sparkles className="h-4 w-4 text-purple-500" />
        </div>
        <h3 className="font-black text-sm text-slate-800 dark:text-slate-100">Suggested Authors</h3>
      </div>

      {/* Author list */}
      <div className="p-3 pb-2 space-y-1 max-h-[260px] overflow-y-auto scrollbar-none">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 animate-pulse">
                <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full w-24" />
                  <div className="h-2 bg-slate-150 dark:bg-slate-700/60 rounded-full w-16" />
                </div>
                <div className="h-7 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
              </div>
            ))
          : (
              <>
                {authors.map((author, i) => {
                  const resolvedAuthorId = userMap?.[author.username.toLowerCase()] || author.authorId;
                  return (
                    <div
                      key={author.username}
                      className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      {/* Avatar */}
                      <Link to={resolvedAuthorId ? `/author/${resolvedAuthorId}` : `/search?q=${author.username}`} className="shrink-0">
                        <div
                          className={`h-9 w-9 rounded-full bg-gradient-to-tr ${avatarColors[i % avatarColors.length]} text-xs font-black text-white flex items-center justify-center uppercase shadow-md`}
                        >
                          {author.username.substring(0, 2)}
                        </div>
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={resolvedAuthorId ? `/author/${resolvedAuthorId}` : `/search?q=${author.username}`}
                          className="text-xs font-bold text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate block"
                        >
                          {author.username}
                        </Link>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Users2 className="h-2.5 w-2.5" />
                          {author.postCount} post{author.postCount !== 1 ? 's' : ''} · {author.totalLikes} likes
                        </p>
                      </div>

                      {/* Follow button */}
                      {resolvedAuthorId ? (
                        <FollowButton
                          targetUserId={resolvedAuthorId}
                          targetUsername={author.username}
                          compact
                        />
                      ) : (
                        <span className="text-[10px] font-bold text-pink-500 px-2.5 py-0.5 rounded-full border border-pink-200/50 dark:border-pink-850/40">
                          Guest
                        </span>
                      )}
                    </div>
                  );
                })}
                <div className="h-12 w-full block shrink-0" aria-hidden="true" />
              </>
            )}
      </div>

      {authors.length === 0 && !isLoading && (
        <p className="text-xs text-slate-400 text-center py-6">No authors found</p>
      )}
    </div>
  );
};

export default SuggestedAuthors;
