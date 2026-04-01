export const AUTH_API = {
    REGISTER: '/api/register',
    LOGIN: '/api/login',
    REFRESH_TOKEN: '/api/refresh-token',
    FORGOT_PASSWORD: '/api/forgot-password',
    RESET_PASSWORD: '/api/reset-password'
}

export const OTP_API = {
    VERIFY: '/api/verify-otp',
    RESEND: '/api/resend-otp'
}

export const PRODUCT_API = {
    CREATE: '/api/products/product',
    GET_ALL: '/api/products/product',
    GET_BY_ID: (id: string) => `/api/products/product/${id}`,
    UPDATE: (id: string) => `/api/products/product/${id}`,
    DELETE: (id: string) => `/api/products/product/${id}`
}