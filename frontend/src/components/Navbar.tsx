import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="h-14 flex items-center justify-end px-6 border-b border-[#1a1f2a] bg-[#0d1117]">
      <button
        onClick={handleLogout}
        className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-emerald-500 text-white hover:bg-emerald-400 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
