import { userApi } from "../axios/axiosInstance";
import { AUTH_API, OTP_API } from "../constants/apiConstants";

interface RegisterData {
  email: string;
  username: string;
  shopname: string;
  password: string;
}

export const registerAPI = async (data: RegisterData) => {
    const res = await userApi.post(AUTH_API.REGISTER, data);
    return res.data;
};


export const loginAPI = async (email: string, password: string) => {
    const res = await userApi.post(AUTH_API.LOGIN, { email, password });
    return res.data;
};

export const refreshTokenAPI = async () => {
    try {
        const res = await userApi.get(AUTH_API.REFRESH_TOKEN, {
            withCredentials: true,
        });
        const accessToken = res.data.accessToken;
        localStorage.setItem("token", accessToken);
        return accessToken;
    } catch (error) {
        console.error("Refresh token error:", error);
        localStorage.removeItem("token");
        return null;
    }
};

export const verifyOtpAPI = async (email: string, otp: string, purpose: string) => {
    const res = await userApi.post(OTP_API.VERIFY, { email, otp, purpose });
    return res.data;
}

export const resendOtpAPI = async (email: string, purpose: string) => {
    const res = await userApi.post(OTP_API.RESEND, { email, purpose });
    return res.data;
}