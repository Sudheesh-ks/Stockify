import { AuthPurpose } from '../../constants/authPurpose.constants';
import { UserDTO } from '../../dtos/user.dto';

export interface IAuthService {
  registerUser(data: { email: string; username: string; shopname: string; password: string }): Promise<void>;

  verifyOtp(email: string, otp: string, purpose: AuthPurpose): Promise<{ purpose: string; user?: UserDTO }>;

  resendOtp(email: string): Promise<void>;

  forgotPasswordRequest(email: string): Promise<void>;

  resetPassword(email: string, newPassword: string): Promise<void>;

  finalizeRegister(userData: { email: string; username: string; shopname: string; password: string }): Promise<UserDTO>;
  getUserById(id: string): Promise<UserDTO | null>;

  loginUser(email: string, password: string): Promise<{ user: UserDTO }>;
}
