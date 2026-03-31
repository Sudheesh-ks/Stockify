import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, LayoutGrid } from "lucide-react";
import toast from "react-hot-toast";
import { showErrorToast } from "../utils/errorHandler";
import { forgotPasswordAPI } from "../services/authServices";
import InputField from "../components/LoginComponents/InputField";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (value: string) => {
    if (!value) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email format";
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (touched) {
      setError(validateEmail(value));
    }
  };

  const handleBlur = () => {
    setTouched(true);
    setError(validateEmail(email));
  };

  const handleNext = async () => {
    const emailError = validateEmail(email);
    setError(emailError);
    setTouched(true);

    if (emailError) return;

    try {
      setLoading(true);
      console.log('Calling forgotPasswordAPI with email:', email);
      const response = await forgotPasswordAPI(email);
      console.log('API Response:', response);

      if (response && response.success) {
        toast.success("OTP sent to your email");
        localStorage.setItem("tempUserData", JSON.stringify({ email, purpose: "reset-password" }));
        navigate("/otp-verification", { state: { email, purpose: "reset-password" } });
      } else {
        console.error('Response or success property missing:', response);
        toast.error(response?.message || "Failed to send OTP");
      }
    } catch (error: unknown) {
      console.error('API call failed:', error);
      showErrorToast(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080b12] flex items-center justify-center p-4 relative overflow-hidden">

      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-[-10rem] left-[-8rem] w-[30rem] h-[30rem] rounded-full bg-emerald-600 opacity-[0.08] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-8rem] right-[-6rem] w-[24rem] h-[24rem] rounded-full bg-green-700 opacity-[0.08] blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm">

        {/* Brand */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-900/60">
            <LayoutGrid className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Stock<span className="text-emerald-500">ify</span>
          </span>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#1a1f2a] bg-[#0d1117] p-7 shadow-2xl shadow-black/60">

          <h2 className="text-2xl font-bold text-white tracking-tight">
            Forgot Password
          </h2>

          <p className="text-sm text-gray-400 mt-1 mb-6">
            Enter your email to receive a verification code
          </p>

          <InputField
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            Icon={Mail}
            value={email}
            error={error}
            touched={touched}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <button
            onClick={handleNext}
            disabled={loading}
            className="w-full h-11 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 transition-all shadow-lg shadow-emerald-900/50 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </div>

        <p className="text-center text-[11px] text-gray-700 mt-5">
          Protected by Stockify Security · v2.0
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;