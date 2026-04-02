import express from 'express';
import { authController } from '../dependencyHandlers.ts/user.dependencies';

const authRouter = express.Router();

authRouter.post(
    '/register',
    authController.registerUser.bind(authController)
);

authRouter.post(
    '/verify-otp',
    authController.verifyOTP.bind(authController)
);

authRouter.post(
    '/resend-otp',
    authController.resendOtp.bind(authController)
);

authRouter.post(
    '/login',
    authController.loginUser.bind(authController)
);

authRouter.post(
    '/forgot-password',
    authController.forgotPasswordRequest.bind(authController)
);

authRouter.post(
    '/reset-password',
    authController.resetPassword.bind(authController)
);

authRouter.get(
    '/refresh-token',
    authController.refreshToken.bind(authController)
);

export default authRouter;