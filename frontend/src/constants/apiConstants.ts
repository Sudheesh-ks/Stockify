export const AUTH_API = {
    REGISTER: '/api/register',
    LOGIN: '/api/login',
    REFRESH_TOKEN: '/api/refresh-token',
    FORGOT_PASSWORD: '/api/forgot-password',
    RESET_PASSWORD: '/api/reset-password',
    LOGOUT: '/api/logout'
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

export const CUSTOMER_API = {
    CREATE: '/api/customers/customer',
    GET_ALL: '/api/customers/customer',
    GET_BY_ID: (id: string) => `/api/customers/customer/${id}`,
    UPDATE: (id: string) => `/api/customers/customer/${id}`,
    DELETE: (id: string) => `/api/customers/customer/${id}`
}

export const SALE_API = {
    CREATE: '/api/sales',
    GET_ALL: '/api/sales',
    GET_BY_CUSTOMER: (name: string) => `/api/sales/customer/${name}`,
    GET_ITEMS_REPORT: '/api/sales/reports/items',
    GET_LEDGER_REPORT: '/api/sales/reports/ledger'
}