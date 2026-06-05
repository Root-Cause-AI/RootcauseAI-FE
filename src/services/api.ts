import axios from 'axios';
import type { ApiError } from '../types';

/**
 * Centralized Axios instance for all API communication.
 *
 * Configured with the backend base URL and JSON content type.
 * Includes a response interceptor that normalizes error handling
 * so all API calls get consistent error objects.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60s timeout for AI analysis calls
});

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data) {
      const apiError: ApiError = {
        status: error.response.status,
        message: error.response.data.message || 'An unexpected error occurred',
        timestamp: error.response.data.timestamp || new Date().toISOString(),
      };
      return Promise.reject(apiError);
    }

    // Network errors or timeouts
    const networkError: ApiError = {
      status: 0,
      message: error.message || 'Network error. Please check your connection.',
      timestamp: new Date().toISOString(),
    };
    return Promise.reject(networkError);
  }
);

export default api;
