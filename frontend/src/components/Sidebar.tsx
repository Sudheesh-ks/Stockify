import { ShoppingCart, LayoutDashboard, Users, Package, PieChart } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menu = [
    { name: 'Home', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Customers', icon: Users, path: '/customers' },
    { name: 'Products', icon: Package, path: '/products' },
    { name: 'Sales', icon: ShoppingCart, path: '/sales' },
    { name: 'Reports', icon: PieChart, path: '/reports' },
  ];

  return (
    <div className="w-64 h-screen bg-[#0d1117] border-r border-[#1a1f2a] p-5 flex flex-col">
      {/* Logo */}
      <h1 className="text-xl font-bold text-white mb-8">
        Stock<span className="text-emerald-400">ify</span>
      </h1>

      {/* Menu */}
      <nav className="flex flex-col gap-2">
        {menu.map((item, i) => (
          <NavLink
            key={i}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                isActive ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-400 hover:bg-[#11161f] hover:text-white'
              }`
            }
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
