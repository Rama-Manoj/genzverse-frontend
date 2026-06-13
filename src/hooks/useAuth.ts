import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { useAuth } from '../store/AuthContext';
import type { LoginRequest, LoginResponse, RegisterRequest } from '../types';

export const useAuthMutations = () => {
  const { login: setAuthSession } = useAuth();

  const registerMutation = useMutation<string, Error, RegisterRequest>({
    mutationFn: (data) => authApi.register(data),
  });

  const loginMutation = useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: (data) => authApi.login(data),
    onSuccess: async (data) => {
      await setAuthSession(data.token, data.username, data.role);
    },
  });

  const forgotPasswordMutation = useMutation<void, Error, string>({
    mutationFn: (email) => authApi.forgotPassword(email),
  });

  const resetPasswordMutation = useMutation<void, Error, { token: string; newPassword: string }>({
    mutationFn: ({ token, newPassword }) => authApi.resetPassword(token, newPassword),
  });

  const verifyEmailMutation = useMutation<void, Error, string>({
    mutationFn: (token) => authApi.verifyEmail(token),
  });

  return {
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,

    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    forgotPassword: forgotPasswordMutation.mutateAsync,
    isForgotPasswordPending: forgotPasswordMutation.isPending,
    forgotPasswordError: forgotPasswordMutation.error,

    resetPassword: resetPasswordMutation.mutateAsync,
    isResetPasswordPending: resetPasswordMutation.isPending,
    resetPasswordError: resetPasswordMutation.error,

    verifyEmail: verifyEmailMutation.mutateAsync,
    isVerifyEmailPending: verifyEmailMutation.isPending,
    verifyEmailError: verifyEmailMutation.error,
  };
};
export default useAuthMutations;
