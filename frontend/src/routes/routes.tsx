import { Routes, Route } from "react-router-dom"
import Loginpage from "../pages/LoginPage"
import ForgotPassword from "../pages/EmailVerification"
import OTPVerification from "../pages/OtpVerification"
import ResetPassword from "../pages/ResetPassword"
import Dashboard from "../pages/Dashboard"
import ProtectedRoute from "./ProtectedRoutes"
import PublicRoute from "./PublicRoute"

const UserRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={
                <PublicRoute>
                    <Loginpage />
                </PublicRoute>
            } />
            <Route path="/forgot-password" element={
                <PublicRoute>
                    <ForgotPassword />
                </PublicRoute>
            } />
            <Route path="/otp-verification" element={
                <PublicRoute>
                    <OTPVerification />
                </PublicRoute>
            } />
            <Route path="/reset-password" element={
                <PublicRoute>
                    <ResetPassword />
                </PublicRoute>
            } />

            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            } />
        </Routes>
    )
}
export default UserRoutes;