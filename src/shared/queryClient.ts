import { QueryClient, QueryCache } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";

export interface ApiError {
  status: number;
  message: string;
  data: unknown;
}

export interface QueryOptions {
  showToastOnError?: boolean;
  showToastOnSuccess?: boolean;
}

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor to format errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const apiError: ApiError = {
        status: axiosError.response?.status || 500,
        message:
          (axiosError.response?.data as { message?: string })?.message ||
          axiosError.message,
        data: axiosError.response?.data,
      };
      throw apiError;
    }
    const apiError: ApiError = {
      status: 500,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
      data: null,
    };
    throw apiError;
  }
);

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: unknown, query) => {
      const apiError = error as ApiError;
      const options = query.options.meta as QueryOptions | undefined;

      if (options?.showToastOnError) {
        toast.error(apiError.message || "An error occurred");
      }
    },
    onSuccess: (data: unknown, query) => {
      const options = query.options.meta as QueryOptions | undefined;

      if (options?.showToastOnSuccess) {
        toast.success("Data loaded successfully");
      }
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

export default queryClient;
