import axios from "axios";
import { refreshTokenAPI } from "../services/authServices";

export const userApi = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
})

userApi.interceptors.response.use(
    (config) => {
        const token = localStorage.getItem("token");
        if(token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    error => Promise.reject(error)
);

userApi.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;
        const isRefreshRequest = originalRequest.url.includes("/refresh-token");

        if(
            error.response.status === 401 &&
            !originalRequest._retry &&
            !isRefreshRequest
        ){
            originalRequest._retry = true;
            try {
                const newAccessToken = await refreshTokenAPI();
                if(newAccessToken) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return userApi(originalRequest);
                }
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
            }

            localStorage.removeItem("token");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
)