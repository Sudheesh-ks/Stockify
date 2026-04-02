import axios from "axios";
import { refreshTokenAPI } from "../services/authServices";

export const userApi = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Dedicated instance for refresh to avoid interceptor interference
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
        console.log("Response Interceptor:", { status: error.response?.status, url: originalRequest.url, isRefreshRequest, retry: originalRequest._retry });

        if(
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry &&
            !isRefreshRequest
        ){
            console.log("Attempting refresh token regeneration...");
            originalRequest._retry = true;
            try {
                const newAccessToken = await refreshTokenAPI();
                console.log("New Access Token acquired:", !!newAccessToken);
                if(newAccessToken) {
                    console.log("Applying new access token to retry headers");
                    // Use more reliable way to set headers in axios 1.x
                    if (originalRequest.headers && typeof originalRequest.headers.set === 'function') {
                        originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`);
                    } else {
                        if (!originalRequest.headers) originalRequest.headers = {};
                        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    }
                    
                    // Also update the global instance for future requests
                    userApi.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                    
                    return userApi(originalRequest);
                }
            } catch (refreshError) {
                console.error("Token refresh failed during interceptor:", refreshError);
            }

            console.warn("Refresh failed or no session, logging out.");
            localStorage.removeItem("token");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);