import axios from "axios";
import { refreshTokenAPI } from "../services/authServices";

export const userApi = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export const refreshApi = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    withCredentials: true,
});

userApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

userApi.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;
        const isRefreshRequest = originalRequest.url.includes("/refresh-token");

        if(
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry &&
            !isRefreshRequest
        ){
            originalRequest._retry = true;
            try {
                const newAccessToken = await refreshTokenAPI();
                if(newAccessToken) {
                    if (originalRequest.headers && typeof originalRequest.headers.set === 'function') {
                        originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`);
                    } else {
                        if (!originalRequest.headers) originalRequest.headers = {};
                        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    }
                    
                    userApi.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                    
                    return userApi(originalRequest);
                }
            } catch (refreshError) {
                console.error("Token refresh failed during interceptor:", refreshError);
            }

            localStorage.removeItem("token");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);