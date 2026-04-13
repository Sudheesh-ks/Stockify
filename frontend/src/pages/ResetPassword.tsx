import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, LayoutGrid } from 'lucide-react';
import toast from 'react-hot-toast';
import { showErrorToast } from '../utils/errorHandler';
import { resetPasswordAPI } from '../services/authServices';
import InputField from '../components/LoginComponents/InputField';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });

  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  });

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const stateEmail = location.state?.email;
    const tempData = JSON.parse(localStorage.getItem('tempUserData') || '{}');

    if (stateEmail) {
      setEmail(stateEmail);
    } else if (tempData.email) {
      setEmail(tempData.email);
    } else {
      toast.error('Email not found. Please try again.');
      navigate('/email-verification');
    }
  }, [location.state, navigate]);

  const validateField = (name: string, value: string) => {
    let error = '';

    switch (name) {
      case 'password':
        if (!value) error = 'Password is required';
        else if (value.length < 6) error = 'Password must be at least 6 characters';
        else if (!/[A-Z]/.test(value)) error = 'At least one uppercase required';
        else if (!/[a-z]/.test(value)) error = 'At least one lowercase required';
        else if (!/[0-9]/.test(value)) error = 'At least one number required';
        else if (!/[@$!%*?&]/.test(value)) error = 'At least one special character required';
        break;
      case 'confirmPassword':
        if (!value) error = 'Please confirm your password';
        else if (value !== formData.password) error = 'Passwords do not match';
        break;
    }

    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name as keyof typeof touched]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name as keyof typeof formData]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {
      password: validateField('password', formData.password),
      confirmPassword: validateField('confirmPassword', formData.confirmPassword),
    };

    setErrors(newErrors);
    setTouched({ password: true, confirmPassword: true });

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== '');

    if (hasErrors) {
      return;
    }

    try {
      setLoading(true);
      console.log('Calling resetPasswordAPI with email:', email, 'and password length:', formData.password.length);
      const response = await resetPasswordAPI(email, formData.password);
      console.log('Reset Password API Response:', response);

      if (response && response.success) {
        toast.success('Password reset successful!');
        localStorage.removeItem('tempUserData');
        navigate('/');
      } else {
        console.error('Response or success property missing:', response);
        toast.error(response?.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password API call failed:', error);
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
        <form onSubmit={handleSubmit}>
          <div className="rounded-2xl border border-[#1a1f2a] bg-[#0d1117] p-7 shadow-2xl shadow-black/60">
            <h2 className="text-2xl font-bold text-white tracking-tight">Reset Password</h2>

            <p className="text-sm text-gray-400 mt-1 mb-6">Enter your new password below</p>

            <InputField
              label="New Password"
              name="password"
              type="password"
              placeholder="Enter new password"
              Icon={Lock}
              value={formData.password}
              error={errors.password}
              touched={touched.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <InputField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              Icon={Lock}
              value={formData.confirmPassword}
              error={errors.confirmPassword}
              touched={touched.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 transition-all shadow-lg shadow-emerald-900/50 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>

        <p className="text-center text-[11px] text-gray-700 mt-5">Protected by Stockify Security · v2.0</p>
      </div>
    </div>
  );
};

export default ResetPassword;
