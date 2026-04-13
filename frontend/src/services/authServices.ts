import { userApi, refreshApi } from '../axios/axiosInstance';
import { AUTH_API, OTP_API } from '../constants/apiConstants';

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
    const res = await refreshApi.get(AUTH_API.REFRESH_TOKEN);

    const { accessToken, user } = res.data.data;
    localStorage.setItem('token', accessToken);
    return { accessToken, user };
  } catch (error) {
    console.error('Refresh token error:', {
      message: (error as Error).message,
      status: (error as { response?: { status?: number } }).response?.status,
      data: (error as { response?: { data?: unknown } }).response?.data,
    });
    localStorage.removeItem('token');
    return null;
  }
};

export const verifyOtpAPI = async (email: string, otp: string, purpose: string) => {
  const res = await userApi.post(OTP_API.VERIFY, { email, otp, purpose });
  return res.data;
};

export const resendOtpAPI = async (email: string, purpose: string) => {
  const res = await userApi.post(OTP_API.RESEND, { email, purpose });
  return res.data;
};

export const forgotPasswordAPI = async (email: string) => {
  const res = await userApi.post(AUTH_API.FORGOT_PASSWORD, { email });
  return res.data;
};

export const resetPasswordAPI = async (email: string, newPassword: string) => {
  const res = await userApi.post(AUTH_API.RESET_PASSWORD, {
    email,
    newPassword,
  });
  return res.data;
};

export const logoutAPI = async () => {
  const res = await userApi.post(AUTH_API.LOGOUT);
  return res.data;
};
