import { DollarSign, Package, Users } from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";

const StatCard = ({ title, value, Icon }: any) => (
  <div className="flex items-center justify-between p-5 rounded-2xl bg-[#0d1117]/90 border border-[#1a1f2a] shadow-xl">
    <div>
      <p className="text-sm text-gray-400">{title}</p>
      <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
    </div>
    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-500/10">
      <Icon className="text-emerald-400 w-5 h-5" />
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
  // 🔥 dummy data (replace with API later)
  const stats = {
    sales: 25000,
    items: 120,
    customers: 45,
  };

  const customers = [
    ["John", "9876543210"],
    ["Alice", "9123456780"],
    ["Bob", "9988776655"],
    ["Rahul", "9001122334"],
    ["Anu", "9554433221"],
  ];

  const sales = [
    ["Pen", "John", "2", "₹40"],
    ["Book", "Alice", "1", "₹120"],
    ["Bag", "Bob", "1", "₹800"],
    ["Mouse", "Rahul", "1", "₹500"],
    ["Keyboard", "Anu", "1", "₹700"],
  ];

  const items = [
    ["Pen", "50", "₹20"],
    ["Book", "30", "₹120"],
    ["Bag", "10", "₹800"],
    ["Mouse", "15", "₹500"],
    ["Keyboard", "12", "₹700"],
  ];

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gradient-to-br from-[#05070d] via-[#0b0f17] to-[#0a0e14] text-white p-6">

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <StatCard title="Total Sales" value={`₹${stats.sales}`} Icon={DollarSign} />
        <StatCard title="Total Items" value={stats.items} Icon={Package} />
        <StatCard title="Total Customers" value={stats.customers} Icon={Users} />
      </div>

      {/* TABLES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Table
          title="Latest Customers"
          headers={["Name", "Mobile"]}
          data={customers}
        />

        <Table
          title="Latest Sales"
          headers={["Item", "Customer", "Qty", "Amount"]}
          data={sales}
        />

        <Table
          title="Latest Items"
          headers={["Item", "Stock", "Price"]}
          data={items}
        />
      </div>
    </div>
    </DashboardLayout>
  );
};

export default Dashboard;