export const HttpResponse = {
  // General
  OK: 'OK',
  SERVER_ERROR: 'Internal server error',
  CREATED: 'Created successfully',
  BAD_REQUEST: 'Invalid request',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden access',
  NOT_FOUND: 'Resource not found',

  // Auth related
  FIELDS_REQUIRED: 'All fields are required',
  INVALID_EMAIL: 'Invalid email format',
  INVALID_PASSWORD: 'Password must be at least 6 characters long and contain at least one letter and one number',
  INVALID_USERNAME: 'Username must be between 4 and 30 characters long and can only contain letters and spaces',
  INVALID_SHOPNAME:
    'Shopname must be between 4 and 50 characters long and can only contain letters, numbers, and spaces',
  INVALID_CREDENTIALS: 'Invalid credentials',
  INCORRECT_PASSWORD: 'Incorrect Password',
  PASSWORD_UPDATED: 'Password updated successfully',
  EMAIL_ALREADY_EXISTS: 'This email already exists',
  REGISTER_SUCCESS: 'Registered successfully',
  LOGIN_SUCCESS: 'Logged in successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',

  // Refresh token related
  REFRESH_TOKEN_MISSING: 'No refresh token provided',
  REFRESH_TOKEN_INVALID: 'Invalid refresh token',
  REFRESH_TOKEN_FAILED: 'Token verification failed',

  // User related
  USER_NOT_FOUND: 'User not found',

  // OTP
  OTP_SENT: 'OTP sent to email',
  OTP_SEND_FAILED: 'OTP sending failed',
  OTP_INVALID: 'Invalid OTP',
  OTP_VERIFIED: 'OTP verified successfully',
  OTP_RESENT: 'OTP resent successfully',
  OTP_NOT_FOUND: 'No pending OTP found',
  OTP_EXPIRED_OR_INVALID: 'OTP not verified or expired',

  // Product related
  PRODUCT_CREATED: 'Product created successfully',
  PRODUCT_NOT_FOUND: 'Product not found',
  PRODUCT_UPDATED: 'Product updated successfully',
  PRODUCT_DELETED: 'Product deleted successfully',
  PRODUCT_FOUND: 'Product found successfully',
  PRODUCTS_FOUND: 'Products found successfully',

  // Customer related
  CUSTOMER_CREATED: 'Customer created successfully',
  CUSTOMER_NOT_FOUND: 'Customer not found',
  CUSTOMER_UPDATED: 'Customer updated successfully',
  CUSTOMER_DELETED: 'Customer deleted successfully',
  CUSTOMER_FOUND: 'Customer found successfully',
  CUSTOMERS_FOUND: 'Customers found successfully',
};
