import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { ROUTES } from '../../routes/routes';

export const PublicRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    // If we have a state indicating where the user came from, redirect there, otherwise go to dashboard
    const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || ROUTES.HOME;
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
};
