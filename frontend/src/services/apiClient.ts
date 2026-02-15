import axios from "axios";

// Use proxy in dev to avoid CORS; override with VITE_API_BASE_URL for production builds.
// When unset, use "" so paths like "/api/login" resolve correctly (e.g. via proxy).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Backend expects the raw token in Authorization header (not "Bearer <token>")
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers["Authorization"] = token;
  }
  return config;
});
