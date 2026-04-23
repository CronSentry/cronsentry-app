import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
    (config) => {
        const stored = localStorage.getItem("cronsentry_auth");
        if (stored) {
            const auth = JSON.parse(stored);
            if (auth?.authToken) {
                config.headers.Authorization = `Bearer ${auth.authToken}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — handle 401 globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAuthEndpoint =
            error.config?.url?.includes("/login") ||
            error.config?.url?.includes("/user");

        // Only redirect to login if 401 comes from a protected endpoint
        // NOT from login/register themselves
        if (error.response?.status === 401 && !isAuthEndpoint) {
            localStorage.removeItem("cronsentry_auth");
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default api;