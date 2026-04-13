import { Lock, Mail, Store, User } from 'lucide-react';
import InputField from './InputField';

type RegisterFormProps = {
  onSwitch: (mode?: string) => void;
  formData: { email: string; username: string; shopname: string; password: string };
  errors: { email: string; username: string; shopname: string; password: string };
  touched: { email: boolean; username: boolean; shopname: boolean; password: boolean };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (name: string) => void;
  loading: boolean;
};

const RegisterForm = ({ onSwitch, formData, errors, touched, onChange, onBlur, loading }: RegisterFormProps) => (
  <div>
    <h2 className="text-2xl font-bold text-white tracking-tight">Create account</h2>
    <p className="text-sm text-gray-500 mt-1 mb-6">Set up your store in seconds</p>

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
      label="Username"
      name="username"
      type="text"
      placeholder="your name"
      Icon={User}
      value={formData.username}
      error={errors.username}
      touched={touched.username}
      onChange={onChange}
      onBlur={onBlur}
    />
    <InputField
      label="Shop Name"
      name="shopname"
      type="text"
      placeholder="your store name"
      Icon={Store}
      value={formData.shopname}
      error={errors.shopname}
      touched={touched.shopname}
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

    <button
      type="submit"
      disabled={loading}
      className="w-full h-11 mt-2 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 active:scale-[0.98] transition-all duration-150 shadow-lg shadow-emerald-900/50"
    >
      {loading ? 'Creating account...' : 'Create Account'}
    </button>

    <p className="text-center text-xs text-gray-600 mt-5">
      Already have an account?{' '}
      <button
        onClick={() => onSwitch('login')}
        className="text-emerald-500 font-semibold hover:text-emerald-400 transition-colors"
      >
        Sign in
      </button>
    </p>
  </div>
);

export default RegisterForm;
