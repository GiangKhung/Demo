import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

// Get the appropriate API URL based on environment
const getApiUrl = () => {
  // Server-side: use internal Docker network
  if (typeof window === "undefined") {
    return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";
  }
  // Client-side: use public URL
  return process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";
};

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: getApiUrl(),
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("docshare_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Added auth token to request:", config.url);
      } else {
        console.log("No auth token found for request:", config.url);
      }
    }
    console.log("API Request:", {
      method: config.method?.toUpperCase(),
      url: config.baseURL + config.url,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("docshare_token");
        localStorage.removeItem("docshare_user");
        // Redirect to login page
        window.location.href = "/auth/login";
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error("Network error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
