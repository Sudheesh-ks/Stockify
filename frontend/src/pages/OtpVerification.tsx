import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutGrid } from 'lucide-react';
import toast from 'react-hot-toast';
import { resendOtpAPI } from '../services/authServices';
import { showErrorToast } from '../utils/errorHandler';
import { useAuth } from '../hooks/useAuth';

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { email, purpose } = location.state || {};

  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const { verifyOtp, loading } = useAuth();

  // Timer
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // OTP input
  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  // Verify OTP
  const handleVerify = async () => {
    const enteredOtp = otp.join('');

    if (enteredOtp.length !== 4) {
      toast.error('Enter complete OTP');
      return;
    }

    if (!email || !purpose) {
      toast.error('Missing required data. Please retry from login/register.');
      return;
    }

    try {
      const res = await verifyOtp(email, enteredOtp, purpose);
      console.log('OTP verify response:', res);

      if (res.success) {
        toast.success('OTP verified successfully!');

        const purposeValue = res.data?.purpose || purpose;

        if (purposeValue === 'register') {
          navigate('/dashboard');
          return;
        }

        if (purposeValue === 'reset-password') {
          navigate('/reset-password', { state: { email } });
          return;
        }

        console.warn('Unknown OTP purpose:', purposeValue);
        return;
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    try {
      const res = await resendOtpAPI(email, purpose);

      if (res.success) {
        setTimer(60);
        toast.success('OTP resent');
      } else {
        toast.error('Failed to resend OTP');
      }
    } catch (err) {
      showErrorToast(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#080b12] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="relative z-10 w-full max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
            <LayoutGrid className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-white">
            Stock<span className="text-emerald-500">ify</span>
          </span>
        </div>

        <div className="rounded-2xl border bg-[#0d1117] p-7">
          <h2 className="text-2xl font-bold text-white">Verify OTP</h2>

          <p className="text-sm text-gray-400 mt-1 mb-6">Enter the 4-digit code sent to your email</p>

          {/* OTP inputs */}
          <div className="flex justify-between gap-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                maxLength={1}
                className="w-12 h-12 text-center rounded-xl bg-[#0b0f17] border text-white"
              />
            ))}
          </div>

          {/* Verify button */}
          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full h-11 rounded-xl text-white bg-emerald-600"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>

          {/* Timer */}
          <p className="text-center text-xs text-gray-500 mt-4">
            {timer > 0 ? (
              <>Resend in {timer}s</>
            ) : (
              <button onClick={handleResend} className="text-emerald-400">
                Resend OTP
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
