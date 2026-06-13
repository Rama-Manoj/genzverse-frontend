import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import type { ErrorResponse } from '../types';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '' : 'https://genzverse-backend.onrender.com/');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for attaching the JWT token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('genzverse_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Standardize error message based on GenzVerse Backend's ErrorResponse schema
    let errorMessage = 'An unexpected error occurred. Please try again.';
    let status = 500;
    
    if (error.response) {
      const data = error.response.data as Partial<ErrorResponse>;
      errorMessage = data.message || error.message || errorMessage;
      status = error.response.status;
    } else if (error.request) {
      errorMessage = 'No response received from server. Please check your internet connection.';
      status = 503;
    }

    const standardizedError = {
      message: errorMessage,
      status,
      timestamp: new Date().toISOString(),
    };

    return Promise.reject(standardizedError);
  }
);
