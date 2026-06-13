import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '../../store/AuthContext';
import { profileApi } from '../../api/profile.api';
import type { UpdateProfileRequest } from '../../api/profile.api';
import { Avatar } from '../../components/profile/ProfileComponents';
import { getImageUrl } from '../../utils/image';
import { useSettings } from '../../hooks/useSettings';
import {
  Camera,
  Loader2,
  Save,
  Globe,
  Linkedin,
  Github,
  FileText,
  User,
  Settings,
  Lock,
  Bell,
  Shield,
  AlertTriangle,
  Mail,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Eye,
  Trash2,
  X,
  Laptop
} from 'lucide-react';

// --- Form Validation Schemas ---
const profileSchema = z.object({
  bio: z.string().max(300, 'Bio must be under 300 characters'),
  profileImage: z.string(),
  website: z.string().url('Enter a valid URL').or(z.literal('')),
  linkedinUrl: z.string().url('Enter a valid LinkedIn URL').or(z.literal('')),
  githubUrl: z.string().url('Enter a valid GitHub URL').or(z.literal('')),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords don't match",
  path: ['confirmPassword'],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;
type TabID = 'profile' | 'account' | 'security' | 'notifications' | 'privacy' | 'danger';

// --- Device/Browser Helpers ---
const getBrowserAndOS = () => {
  const ua = navigator.userAgent;
  let os = 'Device';
  let browser = 'Web Browser';

  if (ua.indexOf('Win') !== -1) os = 'Windows';
  else if (ua.indexOf('Mac') !== -1) os = 'macOS';
  else if (ua.indexOf('Linux') !== -1) os = 'Linux';
  else if (ua.indexOf('Android') !== -1) os = 'Android';
  else if (ua.indexOf('like Mac') !== -1 || ua.indexOf('iPhone') !== -1) os = 'iOS';

  if (ua.indexOf('Chrome') !== -1) browser = 'Chrome';
  else if (ua.indexOf('Safari') !== -1 && ua.indexOf('Chrome') === -1) browser = 'Safari';
  else if (ua.indexOf('Firefox') !== -1) browser = 'Firefox';
  else if (ua.indexOf('Edge') !== -1 || ua.indexOf('Edg') !== -1) browser = 'Edge';

  return `${browser} on ${os}`;
};

const isMobileDevice = () => {
  const ua = navigator.userAgent;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
};


const tabConfig = [
  { id: 'profile' as const, label: 'Profile', icon: User, desc: 'Manage your public details' },
  { id: 'account' as const, label: 'Account', icon: Settings, desc: 'View account status' },
  { id: 'security' as const, label: 'Security', icon: Lock, desc: 'Credentials & sessions' },
  { id: 'notifications' as const, label: 'Notifications', icon: Bell, desc: 'Configure preference alerts' },
  { id: 'privacy' as const, label: 'Privacy', icon: Shield, desc: 'Display & visibility settings' },
  { id: 'danger' as const, label: 'Danger Zone', icon: AlertTriangle, desc: 'Delete account', isDanger: true },
];

const FormField: React.FC<{
  label: string;
  icon: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}> = ({ label, icon, error, children }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-2 text-xs font-bold text-slate-650 dark:text-slate-400 uppercase tracking-wider">
      <span className="text-indigo-500">{icon}</span>
      {label}
    </label>
    {children}
    {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}
  </div>
);

// Toggle Switch Component (mimics Radix UI Switch for high visual appeal)
const Switch: React.FC<{
  checked: boolean;
  onChange: (val: boolean) => void;
}> = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
      checked ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'
    }`}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

export const EditProfile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const queryClient = useQueryClient();
  
  // Tab control
  const [activeTab, setActiveTab] = useState<TabID>('profile');

  // Profile photo state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');

  // Settings mock hooks
  const {
    useUpdatePasswordMutation,
    useUpdateNotificationSettingsMutation,
    useUpdatePrivacySettingsMutation,
    useDeleteAccountMutation,
  } = useSettings();

  const updatePasswordMutation = useUpdatePasswordMutation();
  const updateNotificationsMutation = useUpdateNotificationSettingsMutation();
  const updatePrivacyMutation = useUpdatePrivacySettingsMutation();
  const deleteAccountMutation = useDeleteAccountMutation();

  // Danger zone states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');

  // Toggles local state (hydrated from localStorage mocks)
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [followNotifications, setFollowNotifications] = useState(true);
  const [commentNotifications, setCommentNotifications] = useState(true);
  const [likeNotifications, setLikeNotifications] = useState(true);

  const [profileVisibility, setProfileVisibility] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC');
  const [showSocialLinks, setShowSocialLinks] = useState(true);
  const [showEmail, setShowEmail] = useState(false);

  // Load mocks from localStorage on mount
  useEffect(() => {
    try {
      const storedNotifs = localStorage.getItem('genzverse_notif_settings');
      if (storedNotifs) {
        const parsed = JSON.parse(storedNotifs);
        setEmailNotifications(parsed.emailNotifications ?? true);
        setFollowNotifications(parsed.followNotifications ?? true);
        setCommentNotifications(parsed.commentNotifications ?? true);
        setLikeNotifications(parsed.likeNotifications ?? true);
      }

      const storedPrivacy = localStorage.getItem('genzverse_privacy_settings');
      if (storedPrivacy) {
        const parsed = JSON.parse(storedPrivacy);
        setProfileVisibility(parsed.profileVisibility ?? 'PUBLIC');
        setShowSocialLinks(parsed.showSocialLinks ?? true);
        setShowEmail(parsed.showEmail ?? false);
      }
    } catch (e) {
      console.error('Failed to parse settings cache', e);
    }
  }, []);

  // Fetch profile details
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile', 'me'],
    queryFn: profileApi.getMe,
  });

  // Profile Hook Form (Tab 1)
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    setValue: setValueProfile,
    watch: watchProfile,
    formState: { errors: errorsProfile, isDirty: isDirtyProfile },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: {
      bio: profile?.bio ?? '',
      profileImage: profile?.profileImage ?? '',
      website: profile?.website ?? '',
      linkedinUrl: profile?.linkedinUrl ?? '',
      githubUrl: profile?.githubUrl ?? '',
    },
  });

  // Security Hook Form (Tab 3)
  const {
    register: registerSecurity,
    handleSubmit: handleSubmitSecurity,
    reset: resetSecurity,
    formState: { errors: errorsSecurity, isDirty: isDirtySecurity },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const currentImage = previewImage || watchProfile('profileImage') || profile?.profileImage;

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileRequest) => profileApi.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
      refreshUser();
      toast.success('Profile updated successfully!');
    },
    onError: () => toast.error('Failed to update profile. Please try again.'),
  });

  // Handlers
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result as string);
    reader.readAsDataURL(file);

    try {
      setUploadingImage(true);
      const uploadedUrl = await profileApi.uploadFile(file);
      const filename = uploadedUrl.includes('File uploaded: ')
        ? uploadedUrl.replace('File uploaded: ', '').trim()
        : uploadedUrl;
      setValueProfile('profileImage', filename, { shouldDirty: true });
      setPreviewImage(getImageUrl(filename));
      toast.success('Photo uploaded!');
    } catch {
      toast.error('Upload failed. Try again.');
      setPreviewImage('');
    } finally {
      setUploadingImage(false);
    }
  };

  const onProfileSubmit = handleSubmitProfile((data) => {
    updateProfileMutation.mutate({
      bio: data.bio ?? '',
      profileImage: data.profileImage ?? '',
      website: data.website ?? '',
      linkedinUrl: data.linkedinUrl ?? '',
      githubUrl: data.githubUrl ?? '',
    });
  });

  const onSecuritySubmit = handleSubmitSecurity((data) => {
    updatePasswordMutation.mutate(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      {
        onSuccess: () => resetSecurity(),
      }
    );
  });

  const onNotificationsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateNotificationsMutation.mutate({
      emailNotifications,
      followNotifications,
      commentNotifications,
      likeNotifications,
    });
  };

  const onPrivacySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePrivacyMutation.mutate({
      profileVisibility,
      showSocialLinks,
      showEmail,
    });
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmationInput !== user?.username) return;
    deleteAccountMutation.mutate(undefined, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setDeleteConfirmationInput('');
      },
    });
  };

  if (isProfileLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 px-2 sm:px-4">
      {/* Header Banner */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3">
          Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize GenzVerse preferences, details, and security parameters.
        </p>
      </motion.div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Navigation Sidebar: Horizontal scroll on mobile, Vertical stack on desktop */}
        <div className="md:col-span-1">
          <div className="flex md:flex-col gap-1.5 overflow-x-auto pb-3 md:pb-0 scrollbar-none md:sticky md:top-20">
            {tabConfig.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 shrink-0 select-none ${
                    isActive
                      ? tab.isDanger
                        ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 border border-rose-200/50 dark:border-rose-950/50'
                        : 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : tab.isDanger
                      ? 'text-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-950/10 border border-transparent'
                      : 'text-slate-500 dark:text-slate-450 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 hover:text-slate-800 dark:hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <TabIcon className={`h-4 w-4 ${isActive ? 'scale-110' : ''}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Setting Panel Content Column */}
        <div className="md:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
            >
              
              {/* === PROFILE TAB === */}
              {activeTab === 'profile' && (
                <form onSubmit={onProfileSubmit} className="space-y-6">
                  {/* Photo Section */}
                  <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 shadow-sm">
                    <h2 className="text-sm font-black text-slate-850 dark:text-slate-100 uppercase tracking-wider mb-4">
                      Profile Photo
                    </h2>
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                      <div className="relative group shrink-0">
                        <Avatar src={currentImage} name={user?.username ?? 'U'} size="xl" />
                        <label
                          htmlFor="photo-upload"
                          className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                        >
                          {uploadingImage ? (
                            <Loader2 className="h-6 w-6 text-white animate-spin" />
                          ) : (
                            <Camera className="h-6 w-6 text-white" />
                          )}
                        </label>
                        <input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="sr-only"
                        />
                      </div>
                      <div className="text-center sm:text-left">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                          {user?.username}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
                        <label
                          htmlFor="photo-upload"
                          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full border border-indigo-300 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 cursor-pointer transition-all hover:scale-105"
                        >
                          <Camera className="h-3 w-3" />
                          {uploadingImage ? 'Uploading...' : 'Change Photo'}
                        </label>
                        <p className="text-[10px] text-slate-400 mt-2">
                          JPG, PNG or WebP · Max size 5MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bio Card */}
                  <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 shadow-sm space-y-4">
                    <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                      About You
                    </h2>
                    <FormField
                      label="Bio"
                      icon={<FileText className="h-3.5 w-3.5" />}
                      error={errorsProfile.bio?.message}
                    >
                      <textarea
                        {...registerProfile('bio')}
                        rows={4}
                        placeholder="Tell GenzVerse readers about yourself…"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition resize-none"
                      />
                      <p className="text-[10px] text-slate-400 text-right">
                        {watchProfile('bio')?.length ?? 0}/300
                      </p>
                    </FormField>
                  </div>

                  {/* Social links */}
                  <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 shadow-sm space-y-5">
                    <h2 className="text-sm font-black text-slate-850 dark:text-slate-100 uppercase tracking-wider">
                      Social Profiles
                    </h2>

                    <FormField
                      label="Website"
                      icon={<Globe className="h-3.5 w-3.5" />}
                      error={errorsProfile.website?.message}
                    >
                      <input
                        {...registerProfile('website')}
                        type="url"
                        placeholder="https://yourwebsite.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition"
                      />
                    </FormField>

                    <FormField
                      label="LinkedIn"
                      icon={<Linkedin className="h-3.5 w-3.5" />}
                      error={errorsProfile.linkedinUrl?.message}
                    >
                      <input
                        {...registerProfile('linkedinUrl')}
                        type="url"
                        placeholder="https://linkedin.com/in/yourname"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition"
                      />
                    </FormField>

                    <FormField
                      label="GitHub"
                      icon={<Github className="h-3.5 w-3.5" />}
                      error={errorsProfile.githubUrl?.message}
                    >
                      <input
                        {...registerProfile('githubUrl')}
                        type="url"
                        placeholder="https://github.com/yourname"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition"
                      />
                    </FormField>
                  </div>

                  <button
                    type="submit"
                    disabled={updateProfileMutation.isPending || !isDirtyProfile}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-500/25 hover:scale-[1.005] transition-all"
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" /> Save Changes
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* === ACCOUNT TAB === */}
              {activeTab === 'account' && (
                <div className="space-y-6">
                  {/* Account Overview */}
                  <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 shadow-sm space-y-5">
                    <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-2">
                      Account Specifications
                    </h2>

                    {/* Username */}
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
                      <div>
                        <p className="text-xs font-black text-slate-450 dark:text-slate-400 uppercase tracking-wider">
                          Username
                        </p>
                        <p className="text-sm font-bold text-slate-850 dark:text-slate-150 mt-1">
                          {user?.username}
                        </p>
                      </div>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold px-2 py-1 rounded-full border border-slate-200/55 dark:border-slate-700/60">
                        System ID: #{user?.id}
                      </span>
                    </div>

                    {/* Email and Verification */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3 gap-2">
                      <div>
                        <p className="text-xs font-black text-slate-450 dark:text-slate-400 uppercase tracking-wider">
                          Email Address
                        </p>
                        <p className="text-sm font-bold text-slate-850 dark:text-slate-150 mt-1 flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-slate-400" />
                          {user?.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/40">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Verified
                        </span>
                        {/* Mock verification triggers for future backend integration */}
                        {/* TODO: Add logic to trigger verification resend link */}
                      </div>
                    </div>

                    {/* Metadata Join Date */}
                    <div>
                      <p className="text-xs font-black text-slate-450 dark:text-slate-400 uppercase tracking-wider">
                        Join Date
                      </p>
                      <p className="text-sm font-bold text-slate-850 dark:text-slate-150 mt-1 flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                        June 2026
                        <span className="text-[10px] text-slate-400 font-medium">
                          (Future backend integration TODO: fetch signup timestamp)
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* === SECURITY TAB === */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  {/* Change Password */}
                  <form
                    onSubmit={onSecuritySubmit}
                    className="rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 shadow-sm space-y-5"
                  >
                    <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-2">
                      Update Credentials
                    </h2>

                    <FormField
                      label="Current Password"
                      icon={<Lock className="h-3.5 w-3.5" />}
                      error={errorsSecurity.currentPassword?.message}
                    >
                      <input
                        {...registerSecurity('currentPassword')}
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition"
                      />
                    </FormField>

                    <FormField
                      label="New Password"
                      icon={<Lock className="h-3.5 w-3.5" />}
                      error={errorsSecurity.newPassword?.message}
                    >
                      <input
                        {...registerSecurity('newPassword')}
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition"
                      />
                    </FormField>

                    <FormField
                      label="Confirm New Password"
                      icon={<Lock className="h-3.5 w-3.5" />}
                      error={errorsSecurity.confirmPassword?.message}
                    >
                      <input
                        {...registerSecurity('confirmPassword')}
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition"
                      />
                    </FormField>

                    <button
                      type="submit"
                      disabled={updatePasswordMutation.isPending || !isDirtySecurity}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-500 disabled:opacity-50 transition-all"
                    >
                      {updatePasswordMutation.isPending ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Updating...
                        </>
                      ) : (
                        'Change Password'
                      )}
                    </button>
                  </form>

                  <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 shadow-sm space-y-4">
                    <div>
                      <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                        Active Sessions
                      </h2>
                      <p className="text-[11px] text-slate-450 dark:text-slate-400 mt-0.5">
                        Devices currently logged into your GenzVerse profile.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {/* Current Session */}
                      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50">
                        {isMobileDevice() ? (
                          <Smartphone className="h-5 w-5 text-indigo-500 shrink-0" />
                        ) : (
                          <Laptop className="h-5 w-5 text-indigo-500 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-150">
                              {getBrowserAndOS()}
                            </span>
                            <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-450 px-1.5 py-0.5 rounded-full font-black">
                              ACTIVE NOW
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            IP: 127.0.0.1 (Localhost) · Current Session
                          </p>
                        </div>
                      </div>

                      {/* No other active sessions detected */}
                      <p className="text-[10px] text-slate-400 italic pl-1">
                        No other active sessions detected.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toast.success('Logged out of other sessions successfully!')}
                      className="text-xs font-bold text-indigo-500 hover:text-indigo-600 transition-colors"
                    >
                      Log out of all other sessions
                    </button>
                  </div>
                </div>
              )}

              {/* === NOTIFICATIONS TAB === */}
              {activeTab === 'notifications' && (
                <form
                  onSubmit={onNotificationsSubmit}
                  className="rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 shadow-sm space-y-5"
                >
                  <div>
                    <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                      Notification Preferences
                    </h2>
                    <p className="text-[11px] text-slate-450 dark:text-slate-400 mt-0.5">
                      Configure what notifications you want to receive on the platform.
                    </p>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800/80 space-y-4">
                    {/* Toggle 1: Email */}
                    <div className="flex items-center justify-between pt-4 first:pt-0">
                      <div className="space-y-0.5 max-w-[80%]">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-150">
                          Email Notifications
                        </p>
                        <p className="text-[10px] text-slate-400 leading-normal">
                          Receive weekly GenzVerse highlights and newsletter articles.
                        </p>
                      </div>
                      <Switch checked={emailNotifications} onChange={setEmailNotifications} />
                    </div>

                    {/* Toggle 2: Follows */}
                    <div className="flex items-center justify-between pt-4">
                      <div className="space-y-0.5 max-w-[80%]">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-150">
                          Follow Alerts
                        </p>
                        <p className="text-[10px] text-slate-400 leading-normal">
                          Get notified when a new user follows your author profile page.
                        </p>
                      </div>
                      <Switch checked={followNotifications} onChange={setFollowNotifications} />
                    </div>

                    {/* Toggle 3: Comments */}
                    <div className="flex items-center justify-between pt-4">
                      <div className="space-y-0.5 max-w-[80%]">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-150">
                          Comment Alerts
                        </p>
                        <p className="text-[10px] text-slate-400 leading-normal">
                          Get notified immediately when someone posts a comment on your blog.
                        </p>
                      </div>
                      <Switch checked={commentNotifications} onChange={setCommentNotifications} />
                    </div>

                    {/* Toggle 4: Likes */}
                    <div className="flex items-center justify-between pt-4">
                      <div className="space-y-0.5 max-w-[80%]">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-150">
                          Like Alerts
                        </p>
                        <p className="text-[10px] text-slate-400 leading-normal">
                          Get notified when someone likes your published articles.
                        </p>
                      </div>
                      <Switch checked={likeNotifications} onChange={setLikeNotifications} />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={updateNotificationsMutation.isPending}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-500 disabled:opacity-50 transition-all"
                  >
                    {updateNotificationsMutation.isPending ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
                      </>
                    ) : (
                      'Save Preferences'
                    )}
                  </button>
                </form>
              )}

              {/* === PRIVACY TAB === */}
              {activeTab === 'privacy' && (
                <form
                  onSubmit={onPrivacySubmit}
                  className="rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 shadow-sm space-y-5"
                >
                  <div>
                    <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                      Privacy Configurations
                    </h2>
                    <p className="text-[11px] text-slate-450 dark:text-slate-400 mt-0.5">
                      Adjust your account visibility parameters.
                    </p>
                  </div>

                  <div className="space-y-5">
                    {/* Select Dropdown */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-650 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Eye className="h-3.5 w-3.5 text-indigo-500" />
                        Profile Visibility
                      </label>
                      <select
                        value={profileVisibility}
                        onChange={(e) => setProfileVisibility(e.target.value as 'PUBLIC' | 'PRIVATE')}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                      >
                        <option value="PUBLIC">Public</option>
                        <option value="PRIVATE">Private</option>
                      </select>
                      <p className="text-[10px] text-slate-400 leading-normal mt-1">
                        {profileVisibility === 'PUBLIC'
                          ? 'Anyone on the web can read your blogs and view your author details.'
                          : 'Only authenticated/registered GenzVerse accounts can view your content details.'}
                      </p>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800/80 space-y-4">
                      {/* Toggle: Social links */}
                      <div className="flex items-center justify-between pt-4">
                        <div className="space-y-0.5 max-w-[80%]">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-150">
                            Show Social Links
                          </p>
                          <p className="text-[10px] text-slate-400 leading-normal">
                            Display your LinkedIn, GitHub, and personal site links on your profile card.
                          </p>
                        </div>
                        <Switch checked={showSocialLinks} onChange={setShowSocialLinks} />
                      </div>

                      {/* Toggle: Show Email */}
                      <div className="flex items-center justify-between pt-4">
                        <div className="space-y-0.5 max-w-[80%]">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-150">
                            Display Email Publicly
                          </p>
                          <p className="text-[10px] text-slate-400 leading-normal">
                            Render your email address publicly on your author page.
                          </p>
                        </div>
                        <Switch checked={showEmail} onChange={setShowEmail} />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={updatePrivacyMutation.isPending}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-500 disabled:opacity-50 transition-all"
                  >
                    {updatePrivacyMutation.isPending ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
                      </>
                    ) : (
                      'Save Privacy Settings'
                    )}
                  </button>
                </form>
              )}

              {/* === DANGER ZONE === */}
              {activeTab === 'danger' && (
                <div className="rounded-3xl border border-red-200 dark:border-red-950 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 shadow-sm space-y-5">
                  <div>
                    <h2 className="text-sm font-black text-red-650 dark:text-red-500 uppercase tracking-wider flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Danger Zone
                    </h2>
                    <p className="text-[11px] text-slate-450 dark:text-slate-450 mt-0.5">
                      Irreversible and destructive account operations.
                    </p>
                  </div>

                  {/* Warning banner */}
                  <div className="flex gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/35">
                    <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                    <div className="space-y-1">
                      <p className="text-xs font-black text-red-750 dark:text-red-400">
                        Deactivating or deleting GenzVerse Profile
                      </p>
                      <p className="text-[10px] text-red-600 dark:text-red-400/80 leading-normal">
                        This will permanently delete your account, your published blogs, comments, views, and follows. There is no way to restore your profile metadata.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-2">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-150">
                        Delete Account Permanently
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Confirm validation input to complete deletion request.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-250 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-black text-red-500 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete Account
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* === DELETE CONFIRMATION MODAL === */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsDeleteModalOpen(false);
                setDeleteConfirmationInput('');
              }}
              className="absolute inset-0 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white dark:bg-slate-950 max-w-md w-full rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-850 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  Are you absolutely sure?
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setDeleteConfirmationInput('');
                  }}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Warning Content */}
              <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
                This action is irreversible. All details associated with this account (including articles, comments, profiles) will be wiped out from GenzVerse storage servers.
              </p>

              <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-red-900/30">
                <p className="text-[11px] text-red-700 dark:text-red-400 font-bold leading-relaxed">
                  Please type your username <strong className="underline select-all">{user?.username}</strong> to authorize this delete action.
                </p>
              </div>

              {/* Confirmation Input */}
              <input
                type="text"
                value={deleteConfirmationInput}
                onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                placeholder={user?.username}
                className="w-full px-4 py-3 rounded-xl border border-slate-250 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-150 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition"
              />

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setDeleteConfirmationInput('');
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={
                    deleteConfirmationInput !== user?.username || deleteAccountMutation.isPending
                  }
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-55 disabled:cursor-not-allowed text-xs font-bold text-white transition flex items-center justify-center gap-1 shadow-md shadow-red-500/20"
                >
                  {deleteAccountMutation.isPending ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" /> Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-3.5 w-3.5" /> Delete Account
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EditProfile;
