import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthMutations } from '../../hooks/useAuth';
import { ROUTES } from '../../routes/routes';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Lock, Loader2, ArrowRight } from 'lucide-react';

const resetPasswordSchema = z.object({
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordPage: React.FC = () => {
  const { resetPassword, isResetPasswordPending } = useAuthMutations();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      toast.error('Invalid password reset token.');
      setError('root', { message: 'Missing token in URL query parameter (?token=...)' });
      return;
    }

    try {
      await resetPassword({ token, newPassword: data.password });
      toast.success('Password updated successfully! Please sign in with your new password.');
      navigate(ROUTES.LOGIN);
    } catch (err: unknown) {
      const errorMessage = (err as Error)?.message || 'Failed to reset password. The link may have expired.';
      setError('root', { message: errorMessage });
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-slate-950/20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 p-8 rounded-3xl border border-slate-200/50 bg-white/80 dark:border-slate-800/50 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl"
      >
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-black tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Choose New Password
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Secure your GenzVerse account
          </p>
        </div>

        {!token && (
          <div className="rounded-xl bg-amber-50 p-4 text-xs font-semibold text-amber-700 dark:bg-amber-950/25 dark:text-amber-400 border border-amber-200/30 text-center">
            Warning: Reset token is missing from the link. Make sure you opened the link exactly as sent in the email.
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {errors.root && (
            <div className="rounded-xl bg-red-50 p-4 text-xs font-semibold text-red-600 dark:bg-red-950/20 dark:text-red-400 border border-red-200/30">
              {errors.root.message}
            </div>
          )}

          <div className="space-y-4 rounded-md">
            
            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type="password"
                  disabled={isResetPasswordPending || !token}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-[11px] font-semibold text-rose-500">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  {...register('confirmPassword')}
                  type="password"
                  disabled={isResetPasswordPending || !token}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-[11px] font-semibold text-rose-500">{errors.confirmPassword.message}</p>
              )}
            </div>

          </div>

          <div>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isResetPasswordPending || !token}
              className="flex w-full h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 hover:shadow-indigo-500/35 transition-all disabled:opacity-50"
            >
              {isResetPasswordPending ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  <span>Updating password...</span>
                </>
              ) : (
                <>
                  <span>Save Password</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </>
              )}
            </motion.button>
          </div>
        </form>

        <div className="text-center text-xs">
          <Link to={ROUTES.LOGIN} className="font-bold text-indigo-500 hover:underline">
            Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
export default ResetPasswordPage;
