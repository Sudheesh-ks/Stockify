export interface OtpTypes {
  _id: Types.ObjectId;
  email: string;
  otp: string;
  purpose: 'register' | 'reset-password';
  userData?: {
    email?: string;
    username?: string;
    shopname?: string;
    password?: string;
  };
  createdAt: Date;
}
