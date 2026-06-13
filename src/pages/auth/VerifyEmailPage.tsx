import React, { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuthMutations } from '../../hooks/useAuth';
import { ROUTES } from '../../routes/routes';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

export const VerifyEmailPage: React.FC = () => {
  const { verifyEmail } = useAuthMutations();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Guard to run verification only once on mount in StrictMode
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    const triggerVerification = async () => {
      if (!token) {
        setStatus('error');
        setErrorMsg('Verification token is missing. Please click the exact link sent to your email.');
        return;
      }

      setStatus('loading');
      try {
        await verifyEmail(token);
        setStatus('success');
        toast.success('Email verified successfully! You may now sign in.');
      } catch (err: unknown) {
        setStatus('error');
        const message = (err as Error)?.message || 'Verification failed. The token may have expired.';
        setErrorMsg(message);
        toast.error(message);
      }
    };

    if (!hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      triggerVerification();
    }
  }, [token, verifyEmail]);

  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-slate-950/20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 p-8 rounded-3xl border border-slate-200/50 bg-white/80 dark:border-slate-800/50 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl text-center"
      >
        <div>
          <h2 className="mt-2 text-3xl font-black tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Email Verification
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Confirming GenzVerse registration
          </p>
        </div>

        <div className="py-6 flex flex-col items-center justify-center">
          {status === 'loading' && (
            <div className="space-y-4">
              <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                Verifying your email token...
              </p>
            </div>
          )}

          {status === 'success' && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-4"
            >
              <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto animate-bounce" />
              <h3 className="text-lg font-bold text-slate-850">Verification Complete</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Thank you! Your email is verified. You can now access your dashboard and write blogs.
              </p>
              <div className="pt-4">
                <Link
                  to={ROUTES.LOGIN}
                  className="inline-flex h-11 items-center justify-center px-6 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 transition-all"
                >
                  Proceed to Sign In
                </Link>
              </div>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-4"
            >
              <XCircle className="h-16 w-16 text-rose-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-850">Verification Failed</h3>
              <p className="text-xs text-rose-500 dark:text-rose-400 leading-relaxed border border-rose-200/20 bg-rose-50/50 dark:bg-rose-950/20 p-4 rounded-2xl">
                {errorMsg}
              </p>
              <div className="pt-4">
                <Link
                  to={ROUTES.LOGIN}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-500 hover:underline"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Login</span>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
export default VerifyEmailPage;
