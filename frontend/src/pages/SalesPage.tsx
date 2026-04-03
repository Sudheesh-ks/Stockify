import { useState, useEffect } from "react";
import { Plus, ShoppingCart } from "lucide-react";
import { toast } from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Layout
import DashboardLayout from "../layout/DashboardLayout";

// Components
import SearchBar from "../components/SearchBar";
import DataTable from "../components/DataTable";
import type { Column } from "../components/DataTable";
import Pagination from "../components/Pagination";
import AddEditModal from "../components/AddEditModal";
import ConfirmationModal from "../components/ConfirmationModal";
import SearchableSelect from "../components/SearchableSelect";
import type { SaleTypes } from "../types/sale";
import type { ProductTypes } from "../types/product";
import { getAllProductsAPI } from "../services/productServices";
import { createSaleAPI, deleteSaleAPI, getAllSalesAPI } from "../services/saleServices";
import { showErrorToast } from "../utils/errorHandler";

const ITEMS_PER_PAGE = 1;

const SaleSchema = Yup.object().shape({
    productId: Yup.string().required("Product is required"),
    quantity: Yup.number().min(1, "Quantity must be at least 1").required("Required"),
    customerName: Yup.string().optional(),
    date: Yup.date().required("Date is required"),
});

const SalesPage = () => {
    const [sales, setSales] = useState<SaleTypes[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<ProductTypes | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Confirmation State
    const [confirmConfig, setConfirmConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        action: () => void;
        type: "danger" | "warning";
    }>({
        isOpen: false,
        title: "",
        message: "",
        action: () => { },
        type: "warning",
    });

    const handleProductSearch = async (query: string) => {
        try {
            const data = await getAllProductsAPI(query, 1, 10);
            return data.products.map((p: ProductTypes) => ({
                value: p._id,
                label: p.name,
                subLabel: `Stock: ${p.quantity} | Price: ₹${p.price}`,
                original: p
            }));
        } catch (error) {
            console.error("Product search failed:", error);
            return [];
        }
    };

    const handleCustomerSearch = async (query: string) => {
        try {
            const { getAllCustomersAPI } = await import("../services/customerServices");
            const data = await getAllCustomersAPI(query, 1, 10);
            return data.customers.map((c: any) => ({
                value: c.name, // We use name as value as backend expects customerName
                label: c.name,
                subLabel: c.email
            }));
        } catch (error) {
            console.error("Customer search failed:", error);
            return [];
        }
    };

    const fetchSales = async () => {
        try {
            const data = await getAllSalesAPI({
                customerName: searchQuery,
                page: currentPage,
                limit: ITEMS_PER_PAGE
            });
            setSales(data.sales || []);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            showErrorToast(error);
        }
    };

    useEffect(() => {
        // fetchInitialData removed - moved to backend search
    }, []);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchSales();
        }, 500);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery, currentPage]);

    const handleSave = async (values: { productId: string, quantity: number, customerName?: string }) => {
        try {
            await createSaleAPI(values);
            toast.success("Sale recorded successfully!");
            fetchSales();
            setIsModalOpen(false);
            setSelectedProduct(null);
        } catch (error) {
            showErrorToast(error);
        }
    };

    const handleDelete = (id: string) => {
        const saleToDelete = sales.find((s) => s._id === id);
        setConfirmConfig({
            isOpen: true,
            title: "Delete Sale Record",
            message: `Are you sure you want to delete the sale of "${saleToDelete?.productName}"? This will restore ${saleToDelete?.quantity} units back to stock.`,
            type: "danger",
            action: async () => {
                try {
                    await deleteSaleAPI(id);
                    toast.success("Sale deleted and stock restored!");
                    fetchSales();
                    setConfirmConfig(prev => ({ ...prev, isOpen: false }));
                } catch (error) {
                    showErrorToast(error);
                }
            },
        });
    };

    const columns: Column<SaleTypes>[] = [
        { 
            header: "Date", 
            accessor: (s: SaleTypes) => new Date(s.date).toLocaleDateString(),
            className: "text-gray-400 text-sm"
        },
        { 
            header: "Product", 
            accessor: "productName", 
            className: "font-bold text-white flex items-center gap-2" 
        },
        { 
            header: "Quantity", 
            accessor: (s: SaleTypes) => (
                <span className="text-emerald-400 font-medium">x{s.quantity}</span>
            )
        },
        { 
            header: "Unit Price", 
            accessor: (s: SaleTypes) => `₹${s.price.toFixed(2)}`,
            className: "text-gray-300"
        },
        { 
            header: "Total", 
            accessor: (s: SaleTypes) => `₹${s.totalAmount.toFixed(2)}`,
            className: "text-white font-bold"
        },
        { 
            header: "Buyer", 
            accessor: "customerName",
            className: "text-gray-400 italic"
        },
    ];

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <ShoppingCart className="w-6 h-6 text-emerald-400" />
                            Sales History
                        </h1>
                        <p className="text-gray-400 text-sm">Track all your sales and manage customer transactions.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-[#05070d] font-bold rounded-lg transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                    >
                        <Plus className="w-4 h-4" />
                        Record New Sale
                    </button>
                </div>

                {/* Toolbar & Data Table */}
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center bg-[#0d1117] p-4 rounded-xl border border-[#1a1f2a]">
                        <SearchBar 
                            value={searchQuery} 
                            onChange={(v) => { setSearchQuery(v); setCurrentPage(1); }} 
                            placeholder="Search by customer name..." 
                        />
                    </div>

                    <DataTable
                        data={sales}
                        columns={columns}
                        onDelete={handleDelete}
                        emptyMessage="No sales recorded yet."
                    />

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>

            {/* Add Sale Modal */}
            <AddEditModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Record New Sale"
            >
                <Formik
                    initialValues={{
                        productId: "",
                        quantity: 1,
                        customerName: "",
                        date: new Date().toISOString().split('T')[0],
                    }}
                    validationSchema={SaleSchema}
                    onSubmit={handleSave}
                >
                    {({ errors, touched, isSubmitting, values, setFieldValue }) => (
                        <Form className="space-y-4">
                                <SearchableSelect
                                    label="Select Product"
                                    placeholder="Search by product name..."
                                    onSearch={handleProductSearch}
                                    onSelect={(opt) => {
                                        setFieldValue("productId", opt?.value || "");
                                        setSelectedProduct(opt?.original || null);
                                    }}
                                    error={errors.productId}
                                    touched={touched.productId}
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Sale Date</label>
                                    <Field
                                        name="date"
                                        type="date"
                                        className={`w-full bg-[#151b23] border ${errors.date && touched.date ? "border-red-500" : "border-[#1a1f2a]"} p-2.5 rounded-lg text-white focus:outline-none focus:border-emerald-500/50 transition-all`}
                                    />
                                    <ErrorMessage name="date" component="div" className="text-xs text-red-500 mt-1" />
                                </div>
<<<<<<< HEAD
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Total Amount (₹)</label>
                                    <div className="w-full bg-[#0d1117] border border-[#1a1f2a] p-2.5 rounded-lg text-emerald-400 font-bold">
                                        {selectedProduct ? (selectedProduct.price * (values.quantity || 0)).toFixed(2) : "0.00"}
=======

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Quantity</label>
                                        <Field
                                            name="quantity"
                                            type="number"
                                            className={`w-full bg-[#151b23] border ${errors.quantity && touched.quantity ? "border-red-500" : "border-[#1a1f2a]"} p-2.5 rounded-lg text-white focus:outline-none focus:border-emerald-500/50 transition-all`}
                                        />
                                        <ErrorMessage name="quantity" component="div" className="text-xs text-red-500 mt-1" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Total Amount (₹)</label>
                                        <div className="w-full bg-[#0d1117] border border-[#1a1f2a] p-2.5 rounded-lg text-emerald-400 font-bold">
                                            {selectedProduct ? (selectedProduct.price * (values.quantity || 0)).toFixed(2) : "0.00"}
                                        </div>
>>>>>>> dev
                                    </div>
                                </div>

                                <SearchableSelect
                                    label="Customer Name"
                                    placeholder="Select existing or type name (Leave blank for 'Cash')"
                                    allowCustom={true}
                                    onSearch={handleCustomerSearch}
                                    onSelect={(opt) => {
                                        setFieldValue("customerName", opt?.value || "");
                                    }}
                                    error={errors.customerName}
                                    touched={touched.customerName}
                                />

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 border border-[#1a1f2a] text-gray-400 hover:text-white hover:bg-[#151b23] rounded-lg transition-all font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-[#05070d] font-bold rounded-lg transition-all disabled:opacity-50 active:scale-95"
                                >
                                    Record Sale
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </AddEditModal>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmConfig.isOpen}
                title={confirmConfig.title}
                message={confirmConfig.message}
                type={confirmConfig.type}
                onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
                onConfirm={confirmConfig.action}
            />
        </DashboardLayout>
    );
};

export default SalesPage;
