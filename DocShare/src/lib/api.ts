import axios, { AxiosResponse, AxiosError } from "axios";

const getApiUrl = () => {
  // Thử các URL khác nhau
  const urls = [
    process.env.NEXT_PUBLIC_API_URL,
    process.env.NEXT_PUBLIC_BACKEND_URL + "/api",
    "https://docshare-backend-production.up.railway.app/api",
    "http://localhost:5000/api",
  ].filter(Boolean);

  const apiUrl = urls[0];
  console.log("🌐 Using API URL:", apiUrl);
  console.log("🔍 Available URLs:", urls);

  return apiUrl || "http://localhost:5000/api";
};

// Create axios instance
const api = axios.create({
  baseURL: getApiUrl(),
  timeout: 30000, // Tăng timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("docshare_token")
        : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("📤 API Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("📤 Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("📥 API Response:", response.status, response.config.url);
    return response;
  },
  (error: AxiosError) => {
    console.error("📥 API Error:", {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
    });

    // Handle 401 errors
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("docshare_token");
        localStorage.removeItem("docshare_user");
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
