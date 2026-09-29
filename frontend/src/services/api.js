import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const normalizedBaseUrl =
  rawBaseUrl.endsWith("/api") || rawBaseUrl.endsWith("/api/")
    ? rawBaseUrl
    : `${rawBaseUrl.replace(/\/+$/, "")}/api`;

const api = axios.create({
  baseURL: normalizedBaseUrl,
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});

// Intercept requests to add JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ricoz_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercept responses for auth errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect on check-me endpoint to prevent loops
      if (!error.config.url.includes("/auth/me")) {
        localStorage.removeItem("ricoz_token");
        localStorage.removeItem("ricoz_user");
        if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
          window.location.href = "/login";
        }
      }
    }
    const message =
      error.response?.data?.message || error.message || "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

export default api;
