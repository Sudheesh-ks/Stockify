import { IndianRupee, Package, Users, Store, UserCircle } from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { getDashboardStatsAPI } from "../services/dashboardServices";
import { showErrorToast } from "../utils/errorHandler";
import Loading from "../components/Loading";
import StatCard from "../components/StatCard";
import DashboardTable from "../components/DashboardTable";



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
      const data = await getDashboardStatsAPI();

      setStats({
        products: data.stats.products,
        customers: data.stats.customers,
        sales: data.stats.sales,
        isLoading: false,
      });

      setRecentProducts(
        data.recent.products.map((p: any) => [p.name, p.quantity, `₹${p.price}`])
      );

      setRecentCustomers(
        data.recent.customers.map((c: any) => [c.name, c.mobile])
      );

      setRecentSales(
        data.recent.sales.map((s: any) => {
          const firstItem = s.items?.[0];
          const productName = firstItem?.productId?.name ?? "—";
          const totalQty = s.items?.reduce((acc: number, i: any) => acc + i.quantity, 0) ?? 0;
          return [productName, s.customerName || "Cash", totalQty, `₹${s.totalAmount}`];
        })
      );

    } catch (error) {
      showErrorToast(error);
    } finally {
      setStats(prev => ({ ...prev, isLoading: false }));
    }
  };

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchStats();
  }, []);

  if (stats.isLoading || !user) {
    return (
      <DashboardLayout>
        <Loading message="Initializing your dashboard..." className="min-h-[60vh]" />
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
            Icon={IndianRupee} 
            link="/sales"
          />
        </div>

        {/* TABLES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DashboardTable
            title="Recent Customers"
            headers={["Name", "Mobile"]}
            data={recentCustomers}
          />

          <DashboardTable
            title="Recent Sales"
            headers={["Item", "Customer", "Qty", "Amount"]}
            data={recentSales}
          />

          <DashboardTable
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