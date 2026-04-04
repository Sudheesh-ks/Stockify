import { createContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { loginAPI, registerAPI, verifyOtpAPI, refreshTokenAPI, logoutAPI } from '../services/authServices';
import toast from 'react-hot-toast';
import { showErrorToast } from '../utils/errorHandler';

export interface User {
  id: string;
  email: string;
  username: string;
  shopname: string;
}

export interface RegisterData {
  email: string;
  username: string;
  shopname: string;
  password: string;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuthState: () => void;
  verifyOtp: (email: string, otp: string, purpose: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export { AuthContext, type AuthContextData };

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initAuth = async () => {
      try {
        const result = await refreshTokenAPI();
        if (result && result.accessToken) {
          setToken(result.accessToken);
          setUser(result.user);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.log("Initial session refresh failed:", err);
        // If we were expecting to be logged in but refresh failed, clear state
        if (localStorage.getItem('token')) {
          setToken(null);
          setIsAuthenticated(false);
          localStorage.removeItem('token');
        }
      }
    };
    initAuth();
  }, []);

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
      return;
    }

    setIsAuthenticated(false);
  }, [token]);

  const checkAuthState = () => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    setIsAuthenticated(!!storedToken);
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await loginAPI(email, password);

      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }

      const { accessToken, user: userData } = response.data;
      localStorage.setItem('token', accessToken);
      setToken(accessToken);
      setUser(userData);
      setIsAuthenticated(true);
      toast.success('Login successful!');
    } catch (err) {
      showErrorToast(err);
      setError('Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await registerAPI(data);

      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }

      toast.success(response.message || 'Registration successful!');
    } catch (err) {
      showErrorToast(err);
      setError('Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (email: string, otp: string, purpose: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await verifyOtpAPI(email, otp, purpose);

      if (!response.success) {
        throw new Error(response.message || 'OTP verification failed');
      }

      // If purpose is register, the backend returns token and user
      if (purpose === 'register' && response.data) {
        const { accessToken, user: userData } = response.data;
        if (accessToken) {
          localStorage.setItem('token', accessToken);
          setToken(accessToken);
          setUser(userData);
          setIsAuthenticated(true);
        }
      }

      return response;
    } catch (err) {
      showErrorToast(err);
      setError('OTP verification failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await logoutAPI();
      if (!res.success) {
        throw new Error(res.message || 'Logout failed');
      }
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      toast.success('Logged out successfully');
    } catch (error) {
      showErrorToast(error);
      setError('Logout failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        checkAuthState,
        verifyOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
