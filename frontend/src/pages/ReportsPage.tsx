import { FileText, Download, PieChart, Users, Package, ShoppingCart } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Layout
import DashboardLayout from "../layout/DashboardLayout";

// Components
import DataTable from "../components/DataTable";
import type { Column } from "../components/DataTable";
import { getAllSalesAPI, getItemsReportAPI, getCustomerLedgerAPI } from "../services/saleServices";
import type { SaleTypes } from "../types/sale";
import { showErrorToast } from "../utils/errorHandler";
import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import type { ItemReport, LedgerReport } from "../types/report";

const ReportsPage = () => {
    const [sales, setSales] = useState<SaleTypes[]>([]);
    const [itemsReport, setItemsReport] = useState<ItemReport[]>([]);
    const [ledgerReport, setLedgerReport] = useState<LedgerReport[]>([]);
    const [activeTab, setActiveTab] = useState<"sales" | "items" | "ledger">("sales");
    const [isLoading, setIsLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const fetchData = async () => {
        try {
            setIsLoading(true);
            if (activeTab === "sales") {
                const data = await getAllSalesAPI({ page: currentPage, limit: ITEMS_PER_PAGE });
                setSales(data.sales || []);
                setTotalPages(data.totalPages || 1);
            } else if (activeTab === "items") {
                const data = await getItemsReportAPI(currentPage, ITEMS_PER_PAGE);
                setItemsReport(data.data || []);
                setTotalPages(data.totalPages || 1);
            } else {
                const data = await getCustomerLedgerAPI(currentPage, ITEMS_PER_PAGE);
                setLedgerReport(data.data || []);
                setTotalPages(data.totalPages || 1);
            }
        } catch (error) {
            showErrorToast(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab, currentPage]);

    const handleTabChange = (tab: "sales" | "items" | "ledger") => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    // Export Functions
    const exportToExcel = async () => {
        try {
            let fullData: any[] = [];
            let excelData: any[] = [];

            if (activeTab === "sales") {
                const res = await getAllSalesAPI({ limit: 5000 });
                fullData = res.sales;
                excelData = fullData.map(s => ({
                    "Date": new Date(s.date).toLocaleDateString(),
                    "Products": s.items.map((i: any) => i.productName).join(", "),
                    "Total Quantity": s.items.reduce((sum: number, i: any) => sum + i.quantity, 0),
                    "Total Amount": `₹${s.totalAmount.toFixed(2)}`,
                    "Customer": s.customerName
                }));
            } else if (activeTab === "items") {
                const res = await getItemsReportAPI(1, 5000);
                fullData = res.data;
                excelData = fullData.map(i => ({
                    "Product Name": i.name,
                    "Current Stock": i.stock,
                    "Total Sold": i.sold
                }));
            } else {
                const res = await getCustomerLedgerAPI(1, 5000);
                fullData = res.data;
                excelData = fullData.map(l => ({
                    "Customer Name": l.name,
                    "Transactions": l.transactions,
                    "Total Spent": `₹${l.totalSpent.toFixed(2)}`
                }));
            }

            const ws = XLSX.utils.json_to_sheet(excelData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, activeTab.toUpperCase());
            XLSX.writeFile(wb, `Stockify_${activeTab}_report.xlsx`);
        } catch (error) {
            showErrorToast(error);
        }
    };

    const exportToPDF = async () => {
        try {
            const doc = new jsPDF();
            doc.text(`Stockify - ${activeTab.toUpperCase()} REPORT`, 14, 15);
            
            let headers: string[] = [];
            let body: any[] = [];
            let fullData: any[] = [];

            if (activeTab === "sales") {
                const res = await getAllSalesAPI({ limit: 5000 });
                fullData = res.sales;
                headers = ["Date", "Products", "Total Qty", "Total", "Customer"];
                body = fullData.map(s => [
                    new Date(s.date).toLocaleDateString(), 
                    s.items.map((i: any) => i.productName).join(", "), 
                    s.items.reduce((sum: number, i: any) => sum + i.quantity, 0), 
                    `Rs.${s.totalAmount.toFixed(2)}`, 
                    s.customerName
                ]);
            } else if (activeTab === "items") {
                const res = await getItemsReportAPI(1, 5000);
                fullData = res.data;
                headers = ["Product Name", "Current Stock", "Total Sold"];
                body = fullData.map(i => [i.name, i.stock, i.sold]);
            } else {
                const res = await getCustomerLedgerAPI(1, 5000);
                fullData = res.data;
                headers = ["Customer Name", "Transactions", "Total Spent"];
                body = fullData.map(l => [l.name, l.transactions, `Rs.${l.totalSpent.toFixed(2)}`]);
            }

            autoTable(doc, {
                head: [headers],
                body: body,
                startY: 25,
            });
            doc.save(`Stockify_${activeTab}_report.pdf`);
        } catch (error) {
            showErrorToast(error);
        }
    };

    // Columns
    const salesColumns: Column<any>[] = [
        { header: "Date", accessor: (s: SaleTypes) => new Date(s.date).toLocaleDateString() },
        { 
            header: "Products", 
            accessor: (s: SaleTypes) => {
                const names = s.items.map(i => i.productName);
                if (names.length <= 1) return names[0] || "Unknown";
                return `${names[0]} (+${names.length - 1} more)`;
            },
            className: "font-bold text-white" 
        },
        { 
            header: "Total Qty", 
            accessor: (s: SaleTypes) => s.items.reduce((sum, i) => sum + i.quantity, 0), 
            className: "text-emerald-400" 
        },
        { header: "Total", accessor: (s: SaleTypes) => `₹${s.totalAmount.toFixed(2)}`, className: "font-bold" },
        { header: "Customer", accessor: "customerName" },
    ];

    const itemColumns: Column<ItemReport>[] = [
        { header: "Product Name", accessor: "name", className: "font-bold text-white" },
        { header: "Current Stock", accessor: "stock", className: "text-amber-400" },
        { header: "Total Sold", accessor: "sold", className: "text-emerald-400" },
    ];

    const ledgerColumns: Column<LedgerReport>[] = [
        { header: "Customer Name", accessor: "name", className: "font-bold text-white" },
        { header: "Transactions", accessor: "transactions" },
        { header: "Total Spent", accessor: (l) => `₹${l.totalSpent.toFixed(2)}`, className: "text-emerald-400 font-bold" },
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
                        onClick={() => handleTabChange("sales")}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "sales" ? "bg-emerald-500 text-[#05070d]" : "text-gray-400 hover:text-white"}`}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Sales Report
                    </button>
                    <button 
                        onClick={() => handleTabChange("items")}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "items" ? "bg-emerald-500 text-[#05070d]" : "text-gray-400 hover:text-white"}`}
                    >
                        <Package className="w-4 h-4" />
                        Items Report
                    </button>
                    <button 
                        onClick={() => handleTabChange("ledger")}
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
                        data={(activeTab === "sales" ? sales : activeTab === "items" ? itemsReport : ledgerReport) as any[]}
                        columns={(activeTab === "sales" ? salesColumns : activeTab === "items" ? itemColumns : ledgerColumns) as any[]}
                        isLoading={isLoading}
                        emptyMessage="No data available for this report."
                    />

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ReportsPage;
