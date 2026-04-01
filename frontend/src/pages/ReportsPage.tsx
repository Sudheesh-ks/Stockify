import { FileText, Download, PieChart, Users, Package, ShoppingCart } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Layout
import DashboardLayout from "../layout/DashboardLayout";

// Components
import DataTable from "../components/DataTable";
import type { Column } from "../components/DataTable";
import { getAllSalesAPI } from "../services/saleServices";
import { getAllProductsAPI } from "../services/productServices";
import type { SaleTypes } from "../types/sale";
import type { ProductTypes } from "../types/product";
import { showErrorToast } from "../utils/errorHandler";
import { useEffect, useMemo, useState } from "react";

const ReportsPage = () => {
    const [sales, setSales] = useState<SaleTypes[]>([]);
    const [products, setProducts] = useState<ProductTypes[]>([]);
    const [activeTab, setActiveTab] = useState<"sales" | "items" | "ledger">("sales");
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [salesData, prodData] = await Promise.all([
                getAllSalesAPI({ limit: 1000 }), // Get many for reports
                getAllProductsAPI("", 1, 100)
            ]);
            setSales(salesData.sales || []);
            setProducts(prodData.products || []);
        } catch (error) {
            showErrorToast(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 📊 Aggregations
    const itemsReport = useMemo(() => {
        return products.map(p => {
            const sold = sales
                .filter(s => s.productId === p._id)
                .reduce((sum, s) => sum + s.quantity, 0);
            return {
                name: p.name,
                stock: p.quantity,
                sold: sold
            };
        });
    }, [products, sales]);

    const ledgerReport = useMemo(() => {
        const groups: Record<string, { name: string, transactions: number, totalSpent: number }> = {};
        sales.forEach(s => {
            const name = s.customerName || "Cash";
            if (!groups[name]) groups[name] = { name, transactions: 0, totalSpent: 0 };
            groups[name].transactions += 1;
            groups[name].totalSpent += s.totalAmount;
        });
        return Object.values(groups).sort((a, b) => b.totalSpent - a.totalSpent);
    }, [sales]);

    // 📤 Export Functions
    const exportToExcel = () => {
        const data = activeTab === "sales" ? sales : activeTab === "items" ? itemsReport : ledgerReport;
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, activeTab.toUpperCase());
        XLSX.writeFile(wb, `Stockify_${activeTab}_report.xlsx`);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text(`Stockify - ${activeTab.toUpperCase()} REPORT`, 14, 15);
        
        let headers: string[] = [];
        let body: any[] = [];

        if (activeTab === "sales") {
            headers = ["Date", "Product", "Qty", "Total", "Customer"];
            body = sales.map(s => [new Date(s.date).toLocaleDateString(), s.productName, s.quantity, `$${s.totalAmount}`, s.customerName]);
        } else if (activeTab === "items") {
            headers = ["Product Name", "Current Stock", "Total Sold"];
            body = itemsReport.map(i => [i.name, i.stock, i.sold]);
        } else {
            headers = ["Customer Name", "Transactions", "Total Spent"];
            body = ledgerReport.map(l => [l.name, l.transactions, `$${l.totalSpent.toFixed(2)}`]);
        }

        autoTable(doc, {
            head: [headers],
            body: body,
            startY: 25,
        });
        doc.save(`Stockify_${activeTab}_report.pdf`);
    };

    // 📑 Columns
    const salesColumns: Column<SaleTypes>[] = [
        { header: "Date", accessor: (s) => new Date(s.date).toLocaleDateString() },
        { header: "Product", accessor: "productName", className: "font-bold text-white" },
        { header: "Qty", accessor: "quantity", className: "text-emerald-400" },
        { header: "Total", accessor: (s) => `$${s.totalAmount.toFixed(2)}`, className: "font-bold" },
        { header: "Customer", accessor: "customerName" },
    ];

    const itemColumns: Column<any>[] = [
        { header: "Product Name", accessor: "name", className: "font-bold text-white" },
        { header: "Current Stock", accessor: "stock", className: "text-amber-400" },
        { header: "Total Sold", accessor: "sold", className: "text-emerald-400" },
    ];

    const ledgerColumns: Column<any>[] = [
        { header: "Customer Name", accessor: "name", className: "font-bold text-white" },
        { header: "Transactions", accessor: "transactions" },
        { header: "Total Spent", accessor: (l) => `$${l.totalSpent.toFixed(2)}`, className: "text-emerald-400 font-bold" },
    ];

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <PieChart className="w-6 h-6 text-emerald-400" />
                            Business Reports
                        </h1>
                        <p className="text-gray-400 text-sm">Analyze sales performance and customer trends.</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={exportToExcel} className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 rounded-lg transition-all">
                            <Download className="w-4 h-4" />
                            Excel
                        </button>
                        <button onClick={exportToPDF} className="flex items-center gap-2 px-3 py-2 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 rounded-lg transition-all">
                            <FileText className="w-4 h-4" />
                            PDF
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-[#0d1117] p-1 rounded-xl border border-[#1a1f2a] w-fit non-printable">
                    <button 
                        onClick={() => setActiveTab("sales")}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "sales" ? "bg-emerald-500 text-[#05070d]" : "text-gray-400 hover:text-white"}`}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Sales Report
                    </button>
                    <button 
                        onClick={() => setActiveTab("items")}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "items" ? "bg-emerald-500 text-[#05070d]" : "text-gray-400 hover:text-white"}`}
                    >
                        <Package className="w-4 h-4" />
                        Items Report
                    </button>
                    <button 
                        onClick={() => setActiveTab("ledger")}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "ledger" ? "bg-emerald-500 text-[#05070d]" : "text-gray-400 hover:text-white"}`}
                    >
                        <Users className="w-4 h-4" />
                        Customer Ledger
                    </button>
                </div>

                {/* Report Content */}
                <div className="bg-[#0d1117] rounded-2xl border border-[#1a1f2a] overflow-hidden">
                    <div className="p-6 border-b border-[#1a1f2a]">
                        <h2 className="text-lg font-bold text-white capitalize">
                            {activeTab} Summary
                        </h2>
                    </div>
                    
                    <DataTable
                        data={activeTab === "sales" ? sales : activeTab === "items" ? itemsReport : ledgerReport}
                        columns={activeTab === "sales" ? salesColumns : activeTab === "items" ? itemColumns : ledgerColumns}
                        isLoading={isLoading}
                        emptyMessage="No data available for this report."
                    />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ReportsPage;
