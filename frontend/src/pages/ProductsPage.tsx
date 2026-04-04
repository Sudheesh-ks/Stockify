import { useState, useEffect } from "react";
import { Plus, Package } from "lucide-react";
import { toast } from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from "formik";

// Layout
import DashboardLayout from "../layout/DashboardLayout";

// Components
import SearchBar from "../components/SearchBar";
import DataTable from "../components/DataTable";
import type { Column } from "../components/DataTable";
import Pagination from "../components/Pagination";
import AddEditModal from "../components/AddEditModal";
import ConfirmationModal from "../components/ConfirmationModal";
import type { ProductTypes } from "../types/product";
import { createProductAPI, deleteProductAPI, getAllProductsAPI, updateProductAPI } from "../services/productServices";
import { showErrorToast } from "../utils/errorHandler";
import { ProductSchema } from "../utils/validationSchema";

const ITEMS_PER_PAGE = 6;

const ProductsPage = () => {
  const [products, setProducts] = useState<ProductTypes[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductTypes | null>(null);

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

  const fetchProducts = async () => {
    try {
      const data = await getAllProductsAPI(searchQuery, currentPage, ITEMS_PER_PAGE);
      console.log("Fetch Products Result:", data);
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      showErrorToast(error);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, currentPage]);

  const executeSave = async (values: ProductTypes, isUpdate: boolean) => {
    try {
      if (isUpdate && editingProduct?._id) {
        await updateProductAPI(editingProduct._id, values);
        toast.success("Product updated successfully");
      } else {
        await createProductAPI(values);
        toast.success("Product added successfully");
      }
      fetchProducts();
      setIsModalOpen(false);
    } catch (error) {
      showErrorToast(error);
    }
  };

  const handleSave = (values: ProductTypes) => {
    if (editingProduct) {
      setConfirmConfig({
        isOpen: true,
        title: "Confirm Update",
        message: `Are you sure you want to update "${editingProduct.name}"?`,
        type: "warning",
        action: () => executeSave(values, true),
      });
    } else {
      executeSave(values, false);
    }
  };

  const handleDelete = (id: string) => {
    const productToDelete = products.find((p) => p._id === id);
    setConfirmConfig({
      isOpen: true,
      title: "Delete Product",
      message: `Are you sure you want to delete "${productToDelete?.name}"?`,
      type: "danger",
      action: async () => {
        try {
          await deleteProductAPI(id);
          toast.success("Product deleted successfully");
          fetchProducts();
        } catch (error) {
          showErrorToast(error);
        }
      },
    });
  };

  const columns: Column<ProductTypes>[] = [
    { header: "Name", accessor: "name", className: "font-bold text-white" },
    { header: "Description", accessor: "description", className: "max-w-xs truncate text-gray-400" },
    {
      header: "Quantity",
      accessor: (p: ProductTypes) => (
        <span className={p.quantity > 0 ? "text-emerald-400" : "text-red-400"}>
          {p.quantity} Units
        </span>
      )
    },
    {
      header: "Price",
      accessor: (p: ProductTypes) => `₹${p.price.toFixed(2)}`,
      className: "text-white font-medium"
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Package className="w-6 h-6 text-emerald-400" />
              Products
            </h1>
            <p className="text-gray-400 text-sm">Manage your inventory items and stock levels.</p>
          </div>
          <button
            onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-[#05070d] font-bold rounded-lg transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>

        {/* Toolbar & Data Table */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center bg-[#0d1117] p-4 rounded-xl border border-[#1a1f2a]">
            <SearchBar value={searchQuery} onChange={(v) => { setSearchQuery(v); setCurrentPage(1); }} placeholder="Search products..." />
          </div>

          <DataTable
            data={products}
            columns={columns}
            onEdit={(p) => { setEditingProduct(p); setIsModalOpen(true); }}
            onDelete={handleDelete}
            emptyMessage="No products found in your inventory."
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AddEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Edit Product" : "Add New Product"}
      >
        <Formik
          initialValues={{
            name: editingProduct?.name || "",
            description: editingProduct?.description || "",
            quantity: editingProduct?.quantity || 0,
            price: editingProduct?.price || 0,
          }}
          validationSchema={ProductSchema}
          onSubmit={handleSave}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Product Name</label>
                <Field
                  name="name"
                  className={`w-full bg-[#151b23] border ${errors.name && touched.name ? "border-red-500" : "border-[#1a1f2a]"} p-2.5 rounded-lg text-white focus:outline-none focus:border-emerald-500/50 transition-all`}
                />
                <ErrorMessage name="name" component="div" className="text-xs text-red-500 mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <Field
                  name="description"
                  as="textarea"
                  rows={3}
                  className={`w-full bg-[#151b23] border ${errors.description && touched.description ? "border-red-500" : "border-[#1a1f2a]"} p-2.5 rounded-lg text-white focus:outline-none focus:border-emerald-500/50 transition-all`}
                />
                <ErrorMessage name="description" component="div" className="text-xs text-red-500 mt-1" />
              </div>

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
                  <label className="block text-sm font-medium text-gray-400 mb-1">Price (₹)</label>
                  <Field
                    name="price"
                    type="number"
                    step="0.01"
                    className={`w-full bg-[#151b23] border ${errors.price && touched.price ? "border-red-500" : "border-[#1a1f2a]"} p-2.5 rounded-lg text-white focus:outline-none focus:border-emerald-500/50 transition-all`}
                  />
                  <ErrorMessage name="price" component="div" className="text-xs text-red-500 mt-1" />
                </div>
              </div>

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
                  {editingProduct ? "Update Product" : "Save Product"}
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

export default ProductsPage;
