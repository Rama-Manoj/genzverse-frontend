import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { profileApi } from '../../api/profile.api';
import { socialApi } from '../../api/social.api';
import { useAuth } from '../../store/AuthContext';
import { Avatar, SocialLink, BlogMiniCard } from '../../components/profile/ProfileComponents';
import { FollowButton } from '../../components/feed/FollowButton';
import { Loader2, UserPlus, UserCheck, Users, BookOpen, Globe, Linkedin, Github, UserX } from 'lucide-react';

export const AuthorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const authorId = Number(id);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<'blogs' | 'followers' | 'following'>('blogs');

  // Fetch author details (blogs, followers, following count)
  const { data: authorDetails, isLoading: authorLoading } = useQuery({
    queryKey: ['author', authorId],
    queryFn: () => profileApi.getAuthorDetails(authorId),
    enabled: !!authorId,
  });

  // Fetch public profile (bio, social links, image)
  const { data: publicProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['publicProfile', authorId],
    queryFn: () => profileApi.getPublicProfile(authorId),
    enabled: !!authorId,
  });

  // Fetch followers list (for tab + to check if current user follows)
  const { data: followers = [] } = useQuery({
    queryKey: ['followers', authorId],
    queryFn: () => socialApi.getFollowers(authorId),
    enabled: !!authorId,
  });

  const isFollowing = user ? (followers as { id: number }[]).some((f) => f.id === user.id) : false;

  // Always fetch following when on any tab (needed for FollowButton checks)
  const { data: following = [] } = useQuery({
    queryKey: ['following', authorId],
    queryFn: () => socialApi.getFollowing(authorId),
    enabled: !!authorId,
  });

  // Toggle Follow mutation
  const followMutation = useMutation({
    mutationFn: () => socialApi.toggleFollow(authorId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['followers', authorId] });
      const previousFollowers = queryClient.getQueryData<{ id: number; username: string; email: string }[]>(['followers', authorId]);
      
      queryClient.setQueryData<{ id: number; username: string; email: string }[]>(['followers', authorId], (old = []) => {
        const alreadyFollowing = old.some(f => f.id === user?.id);
        if (alreadyFollowing) {
          return old.filter(f => f.id !== user?.id);
        } else if (user) {
          return [...old, { id: user.id, username: user.username, email: user.email }];
        }
        return old;
      });

      return { previousFollowers };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['author', authorId] });
      queryClient.invalidateQueries({ queryKey: ['followers', authorId] });
      queryClient.invalidateQueries({ queryKey: ['following', authorId] });
      toast.success(isFollowing ? 'Unfollowed' : 'Following!');
    },
    onError: (_err, _variables, context) => {
      if (context?.previousFollowers) {
        queryClient.setQueryData(['followers', authorId], context.previousFollowers);
      }
      toast.error('Failed. Try again.');
    },
  });

  const isOwnProfile = user?.id === authorId;
  const isLoading = authorLoading || profileLoading;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!authorDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
        <UserX className="h-10 w-10" />
        <p className="font-semibold">Author not found</p>
      </div>
    );
  }

  const tabs = [
    { key: 'blogs',     label: 'Blogs',     icon: <BookOpen className="h-4 w-4" />,  count: authorDetails.totalBlogs },
    { key: 'followers', label: 'Followers',  icon: <Users className="h-4 w-4" />,     count: authorDetails.followers },
    { key: 'following', label: 'Following',  icon: <UserCheck className="h-4 w-4" />, count: authorDetails.following },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header — Clean, no cover image */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md overflow-hidden shadow-sm"
      >
        <div className="p-6 sm:p-8">
          {/* Main layout: Avatar left, Info right */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
            {/* Left: Avatar */}
            <div className="shrink-0 flex flex-col items-center sm:items-start">
              <div className="ring-4 ring-indigo-100 dark:ring-indigo-950/40 rounded-2xl shadow-lg shadow-indigo-500/10">
                <Avatar src={publicProfile?.profileImage} name={authorDetails.username} size="xl" />
              </div>
            </div>

            {/* Right: Info */}
            <div className="flex-1 min-w-0">
              {/* Top row: Name + Follow button */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-2">
                <div>
                  <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">{authorDetails.username}</h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{publicProfile?.email}</p>
                </div>
                {!isOwnProfile && user && (
                  <button
                    onClick={() => followMutation.mutate()}
                    disabled={followMutation.isPending}
                    className={`shrink-0 flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 hover:scale-105 shadow-sm w-fit ${
                      isFollowing
                        ? 'border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-300 hover:text-red-500'
                        : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/25'
                    }`}
                  >
                    {followMutation.isPending
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : isFollowing
                        ? <><UserCheck className="h-4 w-4" /> Following</>
                        : <><UserPlus className="h-4 w-4" /> Follow</>
                    }
                  </button>
                )}
              </div>

              {/* Bio */}
              {publicProfile?.bio && (
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4 max-w-xl">{publicProfile.bio}</p>
              )}

              {/* Stats row */}
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-1.5 text-sm">
                  <BookOpen className="h-4 w-4 text-indigo-500" />
                  <span className="font-black text-slate-800 dark:text-slate-100">{authorDetails.totalBlogs}</span>
                  <span className="text-slate-500 dark:text-slate-400">Blogs</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <Users className="h-4 w-4 text-indigo-500" />
                  <span className="font-black text-slate-800 dark:text-slate-100">{authorDetails.followers}</span>
                  <span className="text-slate-500 dark:text-slate-400">Followers</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <UserCheck className="h-4 w-4 text-indigo-500" />
                  <span className="font-black text-slate-800 dark:text-slate-100">{authorDetails.following}</span>
                  <span className="text-slate-500 dark:text-slate-400">Following</span>
                </div>
              </div>

              {/* Social links — colorful */}
              <div className="flex flex-wrap gap-2">
                <SocialLink href={publicProfile?.website} icon={<Globe className="h-3.5 w-3.5" />} label="Website" color="teal" />
                <SocialLink href={publicProfile?.linkedinUrl} icon={<Linkedin className="h-3.5 w-3.5" />} label="LinkedIn" color="blue" />
                <SocialLink href={publicProfile?.githubUrl} icon={<Github className="h-3.5 w-3.5" />} label="GitHub" color="purple" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/60 w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              tab === t.key
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {t.icon}
            {t.label}
            <span className="ml-0.5 text-xs text-slate-400">({t.count})</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        {tab === 'blogs' && (
          <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
            {authorDetails.blogs.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p>No blogs published yet</p>
              </div>
            ) : (
              authorDetails.blogs.map((blog) => <BlogMiniCard key={blog.id} blog={blog} />)
            )}
          </div>
        )}

        {tab === 'followers' && (
          <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
            {followers.length === 0 ? (
              <div className="py-16 text-center text-slate-400"><Users className="h-8 w-8 mx-auto mb-2 opacity-40" /><p>No followers yet</p></div>
            ) : (
              (followers as { id: number; username: string; email: string }[]).map((u) => (
                <div key={u.id} className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <Link to={`/author/${u.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar name={u.username} size="sm" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{u.username}</p>
                      <p className="text-xs text-slate-400 truncate">{u.email}</p>
                    </div>
                  </Link>
                  <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                    <FollowButton targetUserId={u.id} targetUsername={u.username} compact />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'following' && (
          <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
            {following.length === 0 ? (
              <div className="py-16 text-center text-slate-400"><UserCheck className="h-8 w-8 mx-auto mb-2 opacity-40" /><p>Not following anyone</p></div>
            ) : (
              (following as { id: number; username: string; email: string }[]).map((u) => (
                <div key={u.id} className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <Link to={`/author/${u.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar name={u.username} size="sm" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{u.username}</p>
                      <p className="text-xs text-slate-400 truncate">{u.email}</p>
                    </div>
                  </Link>
                  <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                    <FollowButton targetUserId={u.id} targetUsername={u.username} compact />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
export default AuthorProfile;
