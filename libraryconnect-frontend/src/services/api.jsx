// src/services/api.js
import axios from "axios";
import { QueryClient } from "@tanstack/react-query";

// ✅ Create a reusable Axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api", // assign directly, no 'const'
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // optional if you need cookies
});

// ✅ Request interceptor: attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor: handle session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Session expired. Redirecting to login...");
      // window.location.href = "/login"; // Uncomment when backend ready
    }
    return Promise.reject(error);
  }
);

// ✅ Shared QueryClient (TanStack Query)
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5000,
    },
  },
});
