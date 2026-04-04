import { useState, useEffect } from "react";
import {
  Plus,
  ShoppingCart,
  Trash2,
  Package,
  Eye,
  FileText,
  Calendar,
  User,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Formik, Form, Field, FieldArray } from "formik";

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
import type { SaleFormValues, SaleTypes } from "../types/sale";
import type { ProductTypes } from "../types/product";
import { getAllProductsAPI } from "../services/productServices";
import {
  createSaleAPI,
  deleteSaleAPI,
  getAllSalesAPI,
} from "../services/saleServices";
import { showErrorToast } from "../utils/errorHandler";
import { SaleSchema } from "../utils/validationSchema";

const ITEMS_PER_PAGE = 6;

const SalesPage = () => {
  const [sales, setSales] = useState<SaleTypes[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<SaleTypes | null>(null);

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
    action: () => {},
    type: "warning",
  });

  const handleProductSearch = async (query: string) => {
    try {
      const data = await getAllProductsAPI(query, 1, 10);
      return data.products.map((p: ProductTypes) => ({
        value: p._id,
        label: p.name,
        subLabel: `Stock: ${p.quantity} | Price: ₹${p.price}`,
        original: p,
      }));
    } catch (error) {
      console.error("Product search failed:", error);
      return [];
    }
  };

  const handleCustomerSearch = async (query: string) => {
    try {
      const { getAllCustomersAPI } =
        await import("../services/customerServices");
      const data = await getAllCustomersAPI(query, 1, 10);
      return data.customers.map((c: any) => ({
        value: c.name,
        label: c.name,
        subLabel: c.email,
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
        limit: ITEMS_PER_PAGE,
      });
      setSales(data.sales || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      showErrorToast(error);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchSales();
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, currentPage]);

  const handleSave = async (values: any) => {
    try {
      await createSaleAPI(values);
      toast.success("Sale recorded successfully!");
      fetchSales();
      setIsModalOpen(false);
    } catch (error) {
      showErrorToast(error);
    }
  };

  const handleDelete = (id: string) => {
    const saleToDelete = sales.find((s) => s._id === id);
    const productNames = saleToDelete?.items
      .map((i) => i.productName)
      .join(", ");

    setConfirmConfig({
      isOpen: true,
      title: "Delete Sale Record",
      message: `Are you sure you want to delete the sale containing: ${productNames}? This will restore stock for all included items.`,
      type: "danger",
      action: async () => {
        try {
          await deleteSaleAPI(id);
          toast.success("Sale deleted and stock restored!");
          fetchSales();
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
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
      className: "text-gray-400 text-sm",
    },
    {
      header: "Products",
      accessor: (s: SaleTypes) => {
        const names = s.items.map((i) => i.productName);
        if (names.length <= 1) return names[0] || "Unknown";
        return `${names[0]} (+${names.length - 1} more)`;
      },
      className: "font-bold text-white",
    },
    {
      header: "Total Qty",
      accessor: (s: SaleTypes) => (
        <span className="text-emerald-400 font-medium">
          {s.items.reduce((sum, i) => sum + i.quantity, 0)} items
        </span>
      ),
    },
    {
      header: "Overall Total",
      accessor: (s: SaleTypes) => `₹${s.totalAmount.toFixed(2)}`,
      className: "text-white font-bold",
    },
    {
      header: "Buyer",
      accessor: "customerName",
      className: "text-gray-400 italic",
    },
    {
      header: "Actions",
      accessor: (s: SaleTypes) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setSelectedSale(s);
              setIsViewModalOpen(true);
            }}
            className="p-1.5 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"
            title="View Invoice"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(s._id!)}
            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            title="Delete Record"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
      className: "text-right",
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-emerald-400" />
              Sales History
            </h1>
            <p className="text-gray-400 text-sm">
              Professional multi-product invoicing system.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-[#05070d] font-bold rounded-lg transition-all shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            Record New Sale
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center bg-[#0d1117] p-4 rounded-xl border border-[#1a1f2a]">
            <SearchBar
              value={searchQuery}
              onChange={(v) => {
                setSearchQuery(v);
                setCurrentPage(1);
              }}
              placeholder="Search by customer name..."
            />
          </div>

          <DataTable
            data={sales}
            columns={columns}
            emptyMessage="No sales recorded yet."
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <AddEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Invoice"
      >
        <Formik<SaleFormValues>
          initialValues={{
            items: [{ productId: "", quantity: 1, price: 0, _tempName: "" }],
            customerName: "",
            date: new Date().toISOString().split("T")[0],
          }}
          validationSchema={SaleSchema}
          onSubmit={handleSave}
        >
          {({ errors, touched, isSubmitting, values, setFieldValue }) => (
            <Form className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-emerald-400 flex items-center gap-2 uppercase tracking-wider">
                    <Package className="w-4 h-4" />
                    Cart Items
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setFieldValue("items", [
                        ...values.items,
                        { productId: "", quantity: 1, price: 0, _tempName: "" },
                      ])
                    }
                    className="text-xs font-bold text-gray-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Add Item
                  </button>
                </div>

                <FieldArray name="items">
                  {({ remove }) => (
                    <div className="space-y-3">
                      {values.items.map((_,index) => (
                        <div
                          key={index}
                          className="group relative flex flex-col gap-3 p-4 bg-[#0d1117]/50 rounded-xl border border-[#1a1f2a] hover:border-emerald-500/30 transition-all"
                        >
                          {values.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="absolute top-2 right-2 text-gray-600 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SearchableSelect
                              label={`Product ${index + 1}`}
                              placeholder="Search item..."
                              onSearch={handleProductSearch}
                              onSelect={(opt) => {
                                setFieldValue(
                                  `items.${index}.productId`,
                                  opt?.value || "",
                                );
                                setFieldValue(
                                  `items.${index}.price`,
                                  opt?.original?.price || 0,
                                );
                                setFieldValue(
                                  `items.${index}._tempName`,
                                  opt?.label || "",
                                );
                              }}
                              error={
                                typeof errors.items?.[index] === "object"
                                  ? errors.items[index]?.productId
                                  : undefined
                              }
                              touched={
                                typeof touched.items?.[index] === "object"
                                  ? touched.items[index]?.productId
                                  : undefined
                              }
                            />

                            <div className="flex gap-4">
                              <div className="flex-1">
                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                  Quantity
                                </label>
                                <Field
                                  name={`items.${index}.quantity`}
                                  type="number"
                                  className="w-full bg-[#151b23] border border-[#1a1f2a] p-2 rounded-lg text-white text-sm focus:border-emerald-500/50 outline-none"
                                />
                              </div>
                              <div className="flex-1">
                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                  Subtotal
                                </label>
                                <div className="text-sm font-bold text-emerald-400 pt-2">
                                  ₹
                                  {(
                                    values.items[index].price *
                                    (values.items[index].quantity || 0)
                                  ).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </FieldArray>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#1a1f2a]">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Sale Date
                  </label>
                  <Field
                    name="date"
                    type="date"
                    className="w-full bg-[#151b23] border border-[#1a1f2a] p-2.5 rounded-lg text-white outline-none focus:border-emerald-500/50"
                  />
                </div>
                <SearchableSelect
                  label="Customer Name"
                  placeholder="Search or type (Cash)"
                  allowCustom={true}
                  onSearch={handleCustomerSearch}
                  onSelect={(opt) =>
                    setFieldValue("customerName", opt?.value || "")
                  }
                />
              </div>

              <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10 flex justify-between items-center">
                <span className="text-gray-400 font-medium">Grand Total</span>
                <span className="text-2xl font-black text-emerald-400">
                  ₹
                  {values.items
                    .reduce(
                      (total, item) =>
                        total + item.price * (item.quantity || 0),
                      0,
                    )
                    .toFixed(2)}
                </span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-[#1a1f2a] text-gray-400 hover:text-white rounded-lg transition-all font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-[#05070d] font-black rounded-lg shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
                >
                  Record Sale
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </AddEditModal>

      {/* View Sale Details Modal */}
      <AddEditModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Invoice Details"
      >
        {selectedSale && (
          <div className="space-y-6">
            {/* Invoice Header Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-[#0d1117] rounded-xl border border-[#1a1f2a]">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  <Calendar className="w-3 h-3" /> Date
                </div>
                <div className="text-sm font-medium text-white">
                  {new Date(selectedSale.date).toLocaleDateString(undefined, {
                    dateStyle: "long",
                  })}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  <User className="w-3 h-3" /> Customer
                </div>
                <div className="text-sm font-medium text-emerald-400">
                  {selectedSale.customerName || "Cash Sale"}
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-3 h-3" /> Line Items
              </h4>
              <div className="overflow-hidden border border-[#1a1f2a] rounded-xl">
                <table className="w-full text-sm text-left">
                  <thead className="bg-[#151b23] text-gray-500 border-b border-[#1a1f2a]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Product</th>
                      <th className="px-4 py-3 font-semibold text-center">
                        Qty
                      </th>
                      <th className="px-4 py-3 font-semibold text-right">
                        Price
                      </th>
                      <th className="px-4 py-3 font-semibold text-right">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a1f2a]">
                    {selectedSale.items.map((item, idx) => (
                      <tr key={idx} className="bg-[#0d1117]/50">
                        <td className="px-4 py-3 text-white font-medium">
                          {item.productName}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-400">
                          x{item.quantity}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-400">
                          ₹{item.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right text-emerald-400 font-bold">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-[#151b23]/50">
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-4 text-right text-gray-400 font-bold uppercase tracking-wider text-xs"
                      >
                        Grand Total
                      </td>
                      <td className="px-4 py-4 text-right text-xl font-black text-emerald-400">
                        ₹{selectedSale.totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <button
              onClick={() => setIsViewModalOpen(false)}
              className="w-full py-3 bg-[#151b23] border border-[#1a1f2a] text-white font-bold rounded-xl hover:bg-[#1a1f2a] transition-all"
            >
              Close Details
            </button>
          </div>
        )}
      </AddEditModal>

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
