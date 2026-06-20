import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthMutations } from '../../hooks/useAuth';
import { ROUTES } from '../../routes/routes';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { login, isLoggingIn } = useAuthMutations();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || ROUTES.HOME;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data);
      toast.success('Welcome back to GenzVerse!');
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const errorMessage = (err as Error)?.message || 'Login failed. Please check your credentials.';
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
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Sign in to discover next-gen creator blogs
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {errors.root && (
            <div className="rounded-xl bg-red-50 p-4 text-xs font-semibold text-red-600 dark:bg-red-950/20 dark:text-red-400 border border-red-200/30">
              {errors.root.message}
            </div>
          )}

          <div className="space-y-4 rounded-md">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  {...register('email')}
                  type="email"
                  disabled={isLoggingIn}
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
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <Link 
                  to={ROUTES.FORGOT_PASSWORD} 
                  className="text-xs font-bold text-indigo-500 hover:underline hover:text-indigo-400 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  disabled={isLoggingIn}
                  className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 h-6 w-6 bg-transparent border-0 text-slate-400 hover:text-indigo-500 dark:text-slate-500 dark:hover:text-indigo-400 transition-colors focus:outline-none flex items-center justify-center rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/80"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
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
              disabled={isLoggingIn}
              className="flex w-full h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 hover:shadow-indigo-500/35 transition-all disabled:opacity-50"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </>
              )}
            </motion.button>
          </div>
        </form>

        <div className="text-center text-xs">
          <span className="text-slate-500 dark:text-slate-400">Don't have an account? </span>
          <Link to={ROUTES.REGISTER} className="font-bold text-indigo-500 hover:underline">
            Sign up
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
export default LoginPage;
