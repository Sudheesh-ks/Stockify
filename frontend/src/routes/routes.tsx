import { Routes, Route } from "react-router-dom"
import Loginpage from "../pages/LoginPage"
import ForgotPassword from "../pages/EmailVerification"
import OTPVerification from "../pages/OtpVerification"
import ResetPassword from "../pages/ResetPassword"
import Dashboard from "../pages/Dashboard"

const UserRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Loginpage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/otp-verification" element={<OTPVerification />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    )
}
export default UserRoutes;