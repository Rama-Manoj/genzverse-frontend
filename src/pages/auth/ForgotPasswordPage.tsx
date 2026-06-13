import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useAuthMutations } from '../../hooks/useAuth';
import { ROUTES } from '../../routes/routes';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage: React.FC = () => {
  const { forgotPassword, isForgotPasswordPending } = useAuthMutations();
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      await forgotPassword(data.email);
      toast.success('Password reset link sent to your email.');
      setIsSent(true);
    } catch (err: unknown) {
      const errorMessage = (err as Error)?.message || 'Failed to request password reset. Please try again.';
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
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            We'll send you instructions to reset your password
          </p>
        </div>

        {isSent ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 space-y-4"
          >
            <div className="flex justify-center">
              <CheckCircle className="h-12 w-12 text-emerald-500 animate-bounce" />
            </div>
            <h3 className="text-lg font-bold">Check Your Email</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              We've dispatched a password reset link to your email. Click the link inside the email to choose a new password.
            </p>
            <div className="pt-4">
              <Link 
                to={ROUTES.LOGIN} 
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-500 hover:text-indigo-400 hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Return to Login</span>
              </Link>
            </div>
          </motion.div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {errors.root && (
              <div className="rounded-xl bg-red-50 p-4 text-xs font-semibold text-red-600 dark:bg-red-950/20 dark:text-red-400 border border-red-200/30">
                {errors.root.message}
              </div>
            )}

            <div className="space-y-4 rounded-md">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    {...register('email')}
                    type="email"
                    disabled={isForgotPasswordPending}
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                    placeholder="name@example.com"
                  />
                  <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-[11px] font-semibold text-rose-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isForgotPasswordPending}
                className="flex w-full h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 hover:shadow-indigo-500/35 transition-all disabled:opacity-50"
              >
                {isForgotPasswordPending ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    <span>Sending email...</span>
                  </>
                ) : (
                  <span>Send Reset Link</span>
                )}
              </motion.button>
            </div>

            <div className="text-center pt-2">
              <Link 
                to={ROUTES.LOGIN} 
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Login</span>
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
export default ForgotPasswordPage;
