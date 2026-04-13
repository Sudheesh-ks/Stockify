import { useState } from 'react';
import { useFormik } from 'formik';
import { LayoutGrid, Mail, Lock, User, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { loginSchema, registerSchema } from '../utils/validationSchema';

const Loginpage = () => {
  const [tab, setTab] = useState('login');
  const navigate = useNavigate();
  const { login, register, loading } = useAuth();

  const loginFormik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      await login(values.email, values.password);
      navigate('/dashboard');
    },
  });

  const registerFormik = useFormik({
    initialValues: { email: '', username: '', shopname: '', password: '' },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      await register(values);
      navigate('/otp-verification', {
        state: { email: values.email, purpose: 'register' },
      });
    },
  });

  const switchTab = (newTab: string) => {
    setTab(newTab);
    loginFormik.resetForm();
    registerFormik.resetForm();
  };

  const inputClass = (touched: boolean | undefined, error: string | undefined) =>
    `w-full h-11 pl-10 pr-4 rounded-xl text-sm bg-[#0b0f17] border transition-all duration-200 ${
      touched && error
        ? 'border-red-500 text-red-400 placeholder-red-400'
        : 'border-[#1f2733] text-gray-200 placeholder-gray-500 focus:border-emerald-500/50'
    } focus:outline-none focus:ring-2 focus:ring-emerald-500/10`;

  return (
    <div className="min-h-screen bg-[#080b12] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
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
              { key: 'login', label: 'Sign In' },
              { key: 'register', label: 'Register' },
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => switchTab(key)}
                className={`flex-1 h-9 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  tab === key
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-gray-600 hover:text-gray-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── LOGIN FORM ── */}
          {tab === 'login' && (
            <form onSubmit={loginFormik.handleSubmit} noValidate>
              <h2 className="text-2xl font-bold text-white tracking-tight">Welcome back</h2>
              <p className="text-sm text-gray-500 mt-1 mb-6">Sign in to your inventory dashboard</p>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4 pointer-events-none" />
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={loginFormik.values.email}
                    onChange={loginFormik.handleChange}
                    onBlur={loginFormik.handleBlur}
                    className={inputClass(loginFormik.touched.email, loginFormik.errors.email)}
                  />
                </div>
                {loginFormik.touched.email && loginFormik.errors.email && (
                  <p className="text-xs text-red-500 mt-1">{loginFormik.errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4 pointer-events-none" />
                  <input
                    id="login-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={loginFormik.values.password}
                    onChange={loginFormik.handleChange}
                    onBlur={loginFormik.handleBlur}
                    className={inputClass(loginFormik.touched.password, loginFormik.errors.password)}
                  />
                </div>
                {loginFormik.touched.password && loginFormik.errors.password && (
                  <p className="text-xs text-red-500 mt-1">{loginFormik.errors.password}</p>
                )}
              </div>

              <div className="flex justify-end mb-5 mt-1">
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-xs font-semibold text-emerald-500 hover:text-emerald-400 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || loginFormik.isSubmitting}
                className="w-full h-11 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading || loginFormik.isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>

              <p className="text-center text-xs text-gray-600 mt-4">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchTab('register')}
                  className="text-emerald-500 hover:text-emerald-400 font-semibold"
                >
                  Sign up
                </button>
              </p>
            </form>
          )}

          {/* ── REGISTER FORM ── */}
          {tab === 'register' && (
            <form onSubmit={registerFormik.handleSubmit} noValidate>
              <h2 className="text-2xl font-bold text-white tracking-tight">Create account</h2>
              <p className="text-sm text-gray-500 mt-1 mb-6">Join Stockify to manage your inventory</p>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4 pointer-events-none" />
                  <input
                    id="register-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={registerFormik.values.email}
                    onChange={registerFormik.handleChange}
                    onBlur={registerFormik.handleBlur}
                    className={inputClass(registerFormik.touched.email, registerFormik.errors.email)}
                  />
                </div>
                {registerFormik.touched.email && registerFormik.errors.email && (
                  <p className="text-xs text-red-500 mt-1">{registerFormik.errors.email}</p>
                )}
              </div>

              {/* Username */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                  Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4 pointer-events-none" />
                  <input
                    id="register-username"
                    name="username"
                    type="text"
                    placeholder="Your full name"
                    value={registerFormik.values.username}
                    onChange={registerFormik.handleChange}
                    onBlur={registerFormik.handleBlur}
                    className={inputClass(registerFormik.touched.username, registerFormik.errors.username)}
                  />
                </div>
                {registerFormik.touched.username && registerFormik.errors.username && (
                  <p className="text-xs text-red-500 mt-1">{registerFormik.errors.username}</p>
                )}
              </div>

              {/* Shop Name */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                  Shop Name
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4 pointer-events-none" />
                  <input
                    id="register-shopname"
                    name="shopname"
                    type="text"
                    placeholder="Your shop name"
                    value={registerFormik.values.shopname}
                    onChange={registerFormik.handleChange}
                    onBlur={registerFormik.handleBlur}
                    className={inputClass(registerFormik.touched.shopname, registerFormik.errors.shopname)}
                  />
                </div>
                {registerFormik.touched.shopname && registerFormik.errors.shopname && (
                  <p className="text-xs text-red-500 mt-1">{registerFormik.errors.shopname}</p>
                )}
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4 pointer-events-none" />
                  <input
                    id="register-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={registerFormik.values.password}
                    onChange={registerFormik.handleChange}
                    onBlur={registerFormik.handleBlur}
                    className={inputClass(registerFormik.touched.password, registerFormik.errors.password)}
                  />
                </div>
                {registerFormik.touched.password && registerFormik.errors.password && (
                  <p className="text-xs text-red-500 mt-1">{registerFormik.errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || registerFormik.isSubmitting}
                className="w-full h-11 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading || registerFormik.isSubmitting ? 'Creating account...' : 'Create Account'}
              </button>

              <p className="text-center text-xs text-gray-600 mt-4">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchTab('login')}
                  className="text-emerald-500 hover:text-emerald-400 font-semibold"
                >
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>

        <p className="text-center text-[11px] text-gray-700 mt-5">Protected by Stockify Security · v2.0</p>
      </div>
    </div>
  );
};

export default Loginpage;
