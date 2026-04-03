import { useState } from "react";
import { LayoutGrid, Mail, Lock, User, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { showErrorToast } from "../utils/errorHandler";
import { useAuth } from "../hooks/useAuth";
import { validationSchema } from "../utils/validationSchema";
import * as Yup from "yup";

const Loginpage = () => {
  const [tab, setTab] = useState("login");
  const navigate = useNavigate();
  const { login, register, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    shopname: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    username: "",
    shopname: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    username: false,
    shopname: false,
    password: false,
  });

  const validateField = async (name: string, value: string) => {
    try {
      // Create a temporary object with just the field we want to validate
      const tempObject = { [name]: value };
      const tempSchema = Yup.object({ [name]: Yup.reach(validationSchema, name) });
      await tempSchema.validate(tempObject);
      return "";
    } catch (error) {
      return (error as Error).message || "Invalid field";
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (touched[name as keyof typeof touched]) {
      const error = await validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = async (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = await validateField(name, formData[name as keyof typeof formData]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate form based on the current tab
      if (tab === "login") {
        // Validate only email and password for login
        const emailSchema = Yup.object({ email: Yup.reach(validationSchema, 'email') });
        const passwordSchema = Yup.object({ password: Yup.reach(validationSchema, 'password') });
        await emailSchema.validate({ email: formData.email });
        await passwordSchema.validate({ password: formData.password });
      } else {
        // Validate all fields for registration
        await validationSchema.validate(formData);
      }

      // Clear errors if validation passes
      setErrors({
        email: "",
        username: "",
        shopname: "",
        password: "",
      });

      // Proceed with login or register
      if (tab === "login") {
        await login(formData.email, formData.password);
        navigate("/dashboard");
      } else {
        await register(formData);
        navigate("/otp-verification", {
          state: { email: formData.email, purpose: "register" }
        });
      }
    } catch (error) {
      // If it's a validation error, update the errors state
      if ((error as { path?: string }).path) {
        const errorPath = (error as { path?: string }).path!;
        const errorMessage = (error as { message?: string }).message || "Invalid field";
        setErrors(prev => ({ ...prev, [errorPath]: errorMessage }));
        setTouched(prev => ({ ...prev, [errorPath]: true }));
      } else {
        // API errors are already handled/toasted in AuthContext
        console.error("Submission error:", error);
      }
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

          {/* Tabs */}
          <div className="flex bg-[#0a0d13] border border-[#1a1f2a] rounded-xl p-1 mb-7 gap-1">
            {[
              { key: "login", label: "Sign In" },
              { key: "register", label: "Register" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex-1 h-9 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  tab === key
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "text-gray-600 hover:text-gray-400"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit}>
            {tab === "login" ? (
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Welcome back
                </h2>
                <p className="text-sm text-gray-500 mt-1 mb-6">
                  Sign in to your inventory dashboard
                </p>

                {/* Email Field */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4 pointer-events-none" />
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={() => handleBlur("email")}
                      type="email"
                      placeholder="you@example.com"
                      className={`w-full h-11 pl-10 pr-4 rounded-xl text-sm bg-[#0b0f17] border transition-all duration-200 ${
                        touched.email && errors.email
                          ? "border-red-500 text-red-400 placeholder-red-400"
                          : "border-[#1f2733] text-gray-200 placeholder-gray-500 focus:border-emerald-500/50"
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500/10`}
                    />
                  </div>
                  {touched.email && errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4 pointer-events-none" />
                    <input
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={() => handleBlur("password")}
                      type="password"
                      placeholder="••••••••"
                      className={`w-full h-11 pl-10 pr-4 rounded-xl text-sm bg-[#0b0f17] border transition-all duration-200 ${
                        touched.password && errors.password
                          ? "border-red-500 text-red-400 placeholder-red-400"
                          : "border-[#1f2733] text-gray-200 placeholder-gray-500 focus:border-emerald-500/50"
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500/10`}
                    />
                  </div>
                  {touched.password && errors.password && (
                    <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                  )}
                </div>

                <div className="flex justify-end mb-5 mt-1">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-xs font-semibold text-emerald-500 hover:text-emerald-400 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>

                <p className="text-center text-xs text-gray-600 mt-4">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setTab("register")}
                    className="text-emerald-500 hover:text-emerald-400 font-semibold"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Create account
                </h2>
                <p className="text-sm text-gray-500 mt-1 mb-6">
                  Join Stockify to manage your inventory
                </p>

                {/* Email Field */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4 pointer-events-none" />
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={() => handleBlur("email")}
                      type="email"
                      placeholder="you@example.com"
                      className={`w-full h-11 pl-10 pr-4 rounded-xl text-sm bg-[#0b0f17] border transition-all duration-200 ${
                        touched.email && errors.email
                          ? "border-red-500 text-red-400 placeholder-red-400"
                          : "border-[#1f2733] text-gray-200 placeholder-gray-500 focus:border-emerald-500/50"
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500/10`}
                    />
                  </div>
                  {touched.email && errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Username Field */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                    Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4 pointer-events-none" />
                    <input
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      onBlur={() => handleBlur("username")}
                      type="text"
                      placeholder="Your full name"
                      className={`w-full h-11 pl-10 pr-4 rounded-xl text-sm bg-[#0b0f17] border transition-all duration-200 ${
                        touched.username && errors.username
                          ? "border-red-500 text-red-400 placeholder-red-400"
                          : "border-[#1f2733] text-gray-200 placeholder-gray-500 focus:border-emerald-500/50"
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500/10`}
                    />
                  </div>
                  {touched.username && errors.username && (
                    <p className="text-xs text-red-500 mt-1">{errors.username}</p>
                  )}
                </div>

                {/* Shop Name Field */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                    Shop Name
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4 pointer-events-none" />
                    <input
                      name="shopname"
                      value={formData.shopname}
                      onChange={handleChange}
                      onBlur={() => handleBlur("shopname")}
                      type="text"
                      placeholder="Your shop name"
                      className={`w-full h-11 pl-10 pr-4 rounded-xl text-sm bg-[#0b0f17] border transition-all duration-200 ${
                        touched.shopname && errors.shopname
                          ? "border-red-500 text-red-400 placeholder-red-400"
                          : "border-[#1f2733] text-gray-200 placeholder-gray-500 focus:border-emerald-500/50"
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500/10`}
                    />
                  </div>
                  {touched.shopname && errors.shopname && (
                    <p className="text-xs text-red-500 mt-1">{errors.shopname}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4 pointer-events-none" />
                    <input
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={() => handleBlur("password")}
                      type="password"
                      placeholder="••••••••"
                      className={`w-full h-11 pl-10 pr-4 rounded-xl text-sm bg-[#0b0f17] border transition-all duration-200 ${
                        touched.password && errors.password
                          ? "border-red-500 text-red-400 placeholder-red-400"
                          : "border-[#1f2733] text-gray-200 placeholder-gray-500 focus:border-emerald-500/50"
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500/10`}
                    />
                  </div>
                  {touched.password && errors.password && (
                    <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating account..." : "Create Account"}
                </button>

                <p className="text-center text-xs text-gray-600 mt-4">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setTab("login")}
                    className="text-emerald-500 hover:text-emerald-400 font-semibold"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            )}
          </form>
        </div>

        <p className="text-center text-[11px] text-gray-700 mt-5">
          Protected by Stockify Security · v2.0
        </p>
      </div>
    </div>
  );
}


export default Loginpage;