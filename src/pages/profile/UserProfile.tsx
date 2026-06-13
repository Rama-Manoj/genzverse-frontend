import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '../../store/AuthContext';
import { profileApi } from '../../api/profile.api';
import { socialApi } from '../../api/social.api';
import { blogApi } from '../../api/blog.api';
import { useSocial } from '../../hooks/useSocial';
import { Avatar, SocialLink, BlogMiniCard } from '../../components/profile/ProfileComponents';
import { FollowButton } from '../../components/feed/FollowButton';
import { ROUTES } from '../../routes/routes';
import { Loader2, Globe, Linkedin, Github, Edit3, Users, BookOpen, FileEdit, UserCheck, UserPlus } from 'lucide-react';

export const UserProfile: React.FC = () => {
  const { user } = useAuth();

  const [tab, setTab] = useState<'blogs' | 'followers' | 'following'>('blogs');

  // Fetch profile data
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', 'me'],
    queryFn: profileApi.getMe,
  });

  // Fetch author details (follower/following counts + blogs)
  const { data: authorDetails, isLoading: authorLoading } = useQuery({
    queryKey: ['author', user?.id],
    queryFn: () => profileApi.getAuthorDetails(user!.id),
    enabled: !!user?.id,
  });

  // Fetch all blogs to filter by current user
  const { data: allBlogs } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogApi.getAll,
  });

  // Fetch followers & following (always fetch both for mutual follow detection)
  const { data: followers = [] } = useQuery({
    queryKey: ['followers', user?.id],
    queryFn: () => socialApi.getFollowers(user!.id),
    enabled: !!user?.id,
  });
  const { data: following = [] } = useQuery({
    queryKey: ['following', user?.id],
    queryFn: () => socialApi.getFollowing(user!.id),
    enabled: !!user?.id,
  });

  // Set of user IDs the current user is following (for quick lookup)
  const followingIds = new Set(following.map(u => u.id));

  // Follow back using the shared useSocial hook for proper cache handling
  const { toggleFollow, isTogglingFollow } = useSocial();

  const myBlogs = allBlogs?.filter((b) => b.author === user?.username) ?? authorDetails?.blogs ?? [];
  const isLoading = profileLoading || authorLoading;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const tabs = [
    { key: 'blogs',     label: 'Blogs',     icon: <BookOpen className="h-4 w-4" />,   count: authorDetails?.totalBlogs ?? myBlogs.length },
    { key: 'followers', label: 'Followers',  icon: <Users className="h-4 w-4" />,      count: authorDetails?.followers ?? 0 },
    { key: 'following', label: 'Following',  icon: <UserCheck className="h-4 w-4" />,  count: authorDetails?.following ?? 0 },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header Card */}
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
                <Avatar src={profile?.profileImage} name={profile?.username ?? 'U'} size="xl" />
              </div>
            </div>

            {/* Right: Info */}
            <div className="flex-1 min-w-0">
              {/* Top row: Name + Edit button */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-2">
                <div>
                  <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">{profile?.username}</h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{profile?.email}</p>
                </div>
                <Link
                  to={ROUTES.PROFILE_EDIT}
                  className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:scale-105 w-fit"
                >
                  <Edit3 className="h-4 w-4" />
                  Profile Settings
                </Link>
              </div>

              {/* Bio */}
              {profile?.bio && (
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4 max-w-xl">{profile.bio}</p>
              )}

              {/* Stats row */}
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-1.5 text-sm">
                  <BookOpen className="h-4 w-4 text-indigo-500" />
                  <span className="font-black text-slate-800 dark:text-slate-100">{authorDetails?.totalBlogs ?? 0}</span>
                  <span className="text-slate-500 dark:text-slate-400">Blogs</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <Users className="h-4 w-4 text-indigo-500" />
                  <span className="font-black text-slate-800 dark:text-slate-100">{authorDetails?.followers ?? 0}</span>
                  <span className="text-slate-500 dark:text-slate-400">Followers</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <UserCheck className="h-4 w-4 text-indigo-500" />
                  <span className="font-black text-slate-800 dark:text-slate-100">{authorDetails?.following ?? 0}</span>
                  <span className="text-slate-500 dark:text-slate-400">Following</span>
                </div>
              </div>

              {/* Social links — colorful */}
              <div className="flex flex-wrap gap-2">
                <SocialLink href={profile?.website} icon={<Globe className="h-3.5 w-3.5" />} label="Website" color="teal" />
                <SocialLink href={profile?.linkedinUrl} icon={<Linkedin className="h-3.5 w-3.5" />} label="LinkedIn" color="blue" />
                <SocialLink href={profile?.githubUrl} icon={<Github className="h-3.5 w-3.5" />} label="GitHub" color="purple" />
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
          <div className="space-y-2">
            {myBlogs.length === 0 ? (
              <div className="text-center py-16 text-slate-400 dark:text-slate-500">
                <FileEdit className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p className="font-semibold">No blogs yet</p>
                <Link to={ROUTES.CREATE_BLOG} className="mt-3 inline-block text-sm text-indigo-500 hover:underline">Create your first blog →</Link>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
                {myBlogs.map((blog) => <BlogMiniCard key={blog.id} blog={blog} />)}
              </div>
            )}
          </div>
        )}

        {tab === 'followers' && (
          <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
            {followers.length === 0 ? (
              <div className="py-16 text-center text-slate-400"><Users className="h-8 w-8 mx-auto mb-2 opacity-40" /><p>No followers yet</p></div>
            ) : (
              followers.map((u) => {
                const isMutual = followingIds.has(u.id);
                return (
                  <div key={u.id} className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <Link to={`/author/${u.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar name={u.username} size="sm" />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{u.username}</p>
                        <p className="text-xs text-slate-400 truncate">{u.email}</p>
                      </div>
                    </Link>
                    <div className="shrink-0">
                      {isMutual ? (
                        <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                          <UserCheck className="h-3 w-3" />
                          Following
                        </span>
                      ) : (
                        <button
                          onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!user) return;
                            try {
                              await toggleFollow({ targetUserId: u.id, currentUserId: user.id });
                              toast.success(`Followed back ${u.username}!`);
                            } catch {
                              toast.error('Failed to follow. Try again.');
                            }
                          }}
                          disabled={isTogglingFollow}
                          className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm shadow-indigo-500/25 transition-all hover:scale-105"
                        >
                          {isTogglingFollow ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <UserPlus className="h-3 w-3" />
                          )}
                          Follow back
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {tab === 'following' && (
          <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
            {following.length === 0 ? (
              <div className="py-16 text-center text-slate-400"><UserCheck className="h-8 w-8 mx-auto mb-2 opacity-40" /><p>Not following anyone yet</p></div>
            ) : (
              following.map((u) => (
                <div key={u.id} className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <Link to={`/author/${u.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar name={u.username} size="sm" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{u.username}</p>
                      <p className="text-xs text-slate-400 truncate">{u.email}</p>
                    </div>
                  </Link>
                  <div className="shrink-0">
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
export default UserProfile;
