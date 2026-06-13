import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard.api';
import type { DashboardResponse } from '../types';

export const useDashboard = () => {
  const dashboardQuery = useQuery<DashboardResponse, Error>({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardApi.getStats(),
  });

  return {
    stats: dashboardQuery.data,
    isLoading: dashboardQuery.isLoading,
    isError: dashboardQuery.isError,
    error: dashboardQuery.error,
  };
};
