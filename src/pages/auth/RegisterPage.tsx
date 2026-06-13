import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthMutations } from '../../hooks/useAuth';
import { ROUTES } from '../../routes/routes';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { User as UserIcon, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

const registerSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain alphanumeric characters and underscores'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const { register: registerApi, isRegistering } = useAuthMutations();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerApi(data);
      toast.success('Registration successful! Please sign in.');
      navigate(ROUTES.LOGIN);
    } catch (err: unknown) {
      const errorMessage = (err as Error)?.message || 'Registration failed. Please try again.';
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
            Create Account
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Join the GenzVerse creator community
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {errors.root && (
            <div className="rounded-xl bg-red-50 p-4 text-xs font-semibold text-red-600 dark:bg-red-950/20 dark:text-red-400 border border-red-200/30">
              {errors.root.message}
            </div>
          )}

          <div className="space-y-4 rounded-md">
            
            {/* Username Field */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <input
                  {...register('username')}
                  type="text"
                  disabled={isRegistering}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                  placeholder="rama"
                />
                <UserIcon className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
              </div>
              {errors.username && (
                <p className="mt-1.5 text-[11px] font-semibold text-rose-500">{errors.username.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  {...register('email')}
                  type="email"
                  disabled={isRegistering}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                  placeholder="name@example.com"
                />
                <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-[11px] font-semibold text-rose-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type="password"
                  disabled={isRegistering}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-[11px] font-semibold text-rose-500">{errors.password.message}</p>
              )}
            </div>

          </div>

          <div>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isRegistering}
              className="flex w-full h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 hover:shadow-indigo-500/35 transition-all disabled:opacity-50"
            >
              {isRegistering ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <span>Sign Up</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </>
              )}
            </motion.button>
          </div>
        </form>

        <div className="text-center text-xs">
          <span className="text-slate-500 dark:text-slate-400">Already have an account? </span>
          <Link to={ROUTES.LOGIN} className="font-bold text-indigo-500 hover:underline">
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
export default RegisterPage;
