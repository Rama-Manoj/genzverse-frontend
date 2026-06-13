import { apiClient } from './client';
import type { DashboardResponse } from '../types';

export const dashboardApi = {
  getStats: async (): Promise<DashboardResponse> => {
    const response = await apiClient.get<DashboardResponse>('/api/dashboard');
    return response.data;
  },
};
