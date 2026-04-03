import { DollarSign, Package, Users, ArrowRight, Store, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { getAllProductsAPI } from "../services/productServices";
import { getAllCustomersAPI } from "../services/customerServices";
import { getAllSalesAPI } from "../services/saleServices";
import { showErrorToast } from "../utils/errorHandler";

const StatCard = ({ title, value, Icon, link }: any) => (
  <div className="group flex flex-col p-6 rounded-2xl bg-[#0d1117]/80 border border-[#1a1f2a] hover:border-emerald-500/50 shadow-xl transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/20 shadow-inner transition-colors">
        <Icon className="text-emerald-400 w-6 h-6" />
      </div>
      <Link 
        to={link}
        className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-emerald-400 transition-colors uppercase tracking-wider"
      >
        View More
        <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
    <div>
      <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
    </div>
  </div>
);

const Table = ({ title, headers, data }: any) => (
  <div className="bg-[#0d1117]/90 border border-[#1a1f2a] rounded-2xl p-5 shadow-xl">
    <h3 className="text-white font-semibold mb-4">{title}</h3>

    <table className="w-full text-sm text-left">
      <thead>
        <tr className="text-gray-500 border-b border-[#1f2733]">
          {headers.map((h: string, i: number) => (
            <th key={i} className="pb-2">{h}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row: any, i: number) => (
          <tr key={i} className="border-b border-[#1f2733] last:border-none">
            {row.map((cell: any, j: number) => (
              <td key={j} className="py-2 text-gray-300">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    products: 0,
    customers: 0,
    sales: 0,
    isLoading: true
  });

  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [recentCustomers, setRecentCustomers] = useState<any[]>([]);

  const fetchStats = async () => {
    try {
      const [prodData, custData, saleData] = await Promise.all([
        getAllProductsAPI("", 1, 5),
        getAllCustomersAPI("", 1, 5),
        getAllSalesAPI({ limit: 5 })
      ]);

      setStats({
        products: prodData.totalCount || 0,
        customers: custData.totalCount || 0,
        sales: saleData.totalCount || 0,
        isLoading: false
      });

      setRecentProducts(prodData.products.map((p: any) => [p.name, p.quantity, `$${p.price}`]));
      setRecentCustomers(custData.customers.map((c: any) => [c.name, c.phone]));
      setRecentSales(saleData.sales.map((s: any) => [s.productName, s.customerName || "Cash", s.quantity, `$${s.totalAmount}`]));

    } catch (error) {
      showErrorToast(error);
    } finally {
      setStats(prev => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (stats.isLoading || !user) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium animate-pulse">Initializing your dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 p-6 md:p-8 min-h-screen bg-transparent">
        
        {/* HERO SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-8 rounded-3xl bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 shadow-2xl">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-white flex items-center gap-4 uppercase tracking-tighter">
              <Store className="w-10 h-10 text-emerald-400" />
              {user?.shopname || "Storehouse"}
            </h1>
            <div className="flex items-center gap-2 text-emerald-400 font-bold bg-emerald-500/10 w-fit px-3 py-1 rounded-full text-xs">
              <UserCircle className="w-4 h-4" />
              Welcome back, {user?.username}
            </div>
          </div>
          <div className="flex flex-col items-end text-right">
            <p className="text-gray-400 text-sm italic font-medium">Dashboard Overview</p>
            <p className="text-gray-500 text-xs">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        {/* TOP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total Products" 
            value={stats.products} 
            Icon={Package} 
            link="/products"
          />
          <StatCard 
            title="Total Customers" 
            value={stats.customers} 
            Icon={Users} 
            link="/customers"
          />
          <StatCard 
            title="Total Sales" 
            value={stats.sales} 
            Icon={DollarSign} 
            link="/sales"
          />
        </div>

        {/* TABLES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Table
            title="Recent Customers"
            headers={["Name", "Mobile"]}
            data={recentCustomers}
          />

          <Table
            title="Recent Sales"
            headers={["Item", "Customer", "Qty", "Amount"]}
            data={recentSales}
          />

          <Table
            title="Latest Stock"
            headers={["Item", "Stock", "Price"]}
            data={recentProducts}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;