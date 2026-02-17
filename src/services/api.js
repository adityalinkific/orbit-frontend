import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ---------------- REQUEST INTERCEPTOR ---------------- */
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ---------------- RESPONSE INTERCEPTOR ---------------- */
api.interceptors.response.use(
  (response) => {
    console.log(`API Response ${response.config.url}:`, response.data);
    return response;
  },
  (error) => {
    console.error(`API Error ${error.config?.url}:`, error.response?.data || error.message);
    // Optional global error handling
    if (error.response?.status === 401) {
      console.warn("Unauthorized. Token may be invalid.");
      // You could auto logout here if needed
    }

    return Promise.reject(error);
  }
);

export const request = async (url, options = {}) => {
  try {
    const { method = "GET", body, headers = {} } = options;
    return await api({
      url,
      method,
      data: body,
      headers,
    });
  } catch (error) {
    if (error.response) {
      return error.response;
    }
    throw error;
  }
};

export default api;
