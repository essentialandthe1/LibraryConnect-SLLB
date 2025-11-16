// src/services/axios.ts
import axios from "axios";

// ✅ Base instance for API requests
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // Allow cookies if backend uses them
});

// ✅ Automatically attach auth token to every request
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

// ✅ Global error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
