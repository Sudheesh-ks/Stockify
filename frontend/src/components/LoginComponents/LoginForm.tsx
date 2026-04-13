import { Mail, Lock } from 'lucide-react';
import InputField from './InputField';

type LoginFormProps = {
  onSwitch: (mode?: string) => void;
  formData: { email: string; password: string };
  errors: { email: string; password: string };
  touched: { email: boolean; password: boolean };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (name: string) => void;
  loading?: boolean;
};

const LoginForm = ({ onSwitch, formData, errors, touched, onChange, onBlur, loading }: LoginFormProps) => (
  <div>
    <h2 className="text-2xl font-bold text-white tracking-tight">Welcome back</h2>
    <p className="text-sm text-gray-500 mt-1 mb-6">Sign in to your inventory dashboard</p>

    <InputField
      label="Email"
      name="email"
      type="email"
      placeholder="you@example.com"
      Icon={Mail}
      value={formData.email}
      error={errors.email}
      touched={touched.email}
      onChange={onChange}
      onBlur={onBlur}
    />
    <InputField
      label="Password"
      name="password"
      type="password"
      placeholder="••••••••"
      Icon={Lock}
      value={formData.password}
      error={errors.password}
      touched={touched.password}
      onChange={onChange}
      onBlur={onBlur}
    />

    <div className="flex justify-end mb-5 mt-1">
      <button
        onClick={() => onSwitch('forgot')}
        className="text-xs font-semibold text-emerald-500 hover:text-emerald-400 transition-colors"
      >
        Forgot password?
      </button>
    </div>

    <button
      type="submit"
      disabled={loading}
      className="w-full h-11 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 active:scale-[0.98] transition-all duration-150 shadow-lg shadow-emerald-900/50"
    >
      {loading ? 'Signing in...' : 'Sign In'}
    </button>

    <p className="text-center text-xs text-gray-600 mt-5">
      Don't have an account?{' '}
      <button
        onClick={() => onSwitch('register')}
        className="text-emerald-500 font-semibold hover:text-emerald-400 transition-colors"
      >
        Create one
      </button>
    </p>
  </div>
);

export default LoginForm;
