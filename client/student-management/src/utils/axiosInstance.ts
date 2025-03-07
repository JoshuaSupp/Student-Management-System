import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"; // ✅ Load API URL

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// ✅ Add JWT token to every request if available
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;