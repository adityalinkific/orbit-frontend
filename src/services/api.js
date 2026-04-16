import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
const API_BASE = apiUrl.endsWith("/api/v1") ? apiUrl : `${apiUrl}/api/v1`;
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
     'ngrok-skip-browser-warning': 'true'
  },
});

/* ---------------- REQUEST INTERCEPTOR ---------------- */
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  console.log("🔥 TOKEN FROM STORAGE:", token);

  if (token) {
    if (token) {
  config.headers["x-access-token"] = token;
}
    console.log("🚀 FINAL HEADER:", config.headers.Authorization);
  }

  return config;
});



/* ---------------- RESPONSE INTERCEPTOR ---------------- */
api.interceptors.response.use(
  (response) => {
    console.log(`API Response ${response.config.url}:`, response.data);
    return response;
  },
  (error) => {
    console.error(`API Error ${error.config?.url}:`, JSON.stringify(error.response?.data || error.message, null, 2));
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
    throw error;
  }
};

export default api;
