import { useState, useEffect } from "react";
import { Plus, Users } from "lucide-react";
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
import type { CustomerTypes } from "../types/customer";
import { createCustomerAPI, deleteCustomerAPI, getAllCustomersAPI, updateCustomerAPI } from "../services/customerServices";
import { showErrorToast } from "../utils/errorHandler";
import { CustomerSchema } from "../utils/validationSchema";

const ITEMS_PER_PAGE = 6;

const CustomersPage = () => {
  const [customers, setCustomers] = useState<CustomerTypes[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerTypes | null>(null);

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

  const fetchCustomers = async () => {
    try {
      const data = await getAllCustomersAPI(searchQuery, currentPage, ITEMS_PER_PAGE);
      setCustomers(data.customers || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      showErrorToast(error);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchCustomers();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, currentPage]);

  const executeSave = async (values: CustomerTypes, isUpdate: boolean) => {
    try {
      if (isUpdate && editingCustomer?._id) {
        await updateCustomerAPI(editingCustomer._id, values);
        toast.success("Customer updated successfully");
      } else {
        await createCustomerAPI(values);
        toast.success("Customer added successfully");
      }
      fetchCustomers();
      setIsModalOpen(false);
    } catch (error) {
      showErrorToast(error);
    }
  };

  const handleSave = (values: CustomerTypes) => {
    if (editingCustomer) {
      setConfirmConfig({
        isOpen: true,
        title: "Confirm Update",
        message: `Are you sure you want to update "${editingCustomer.name}"?`,
        type: "warning",
        action: () => executeSave(values, true),
      });
    } else {
      executeSave(values, false);
    }
  };

  const handleDelete = (id: string) => {
    const customerToDelete = customers.find((c) => c._id === id);
    setConfirmConfig({
      isOpen: true,
      title: "Delete Customer",
      message: `Are you sure you want to delete "${customerToDelete?.name}"?`,
      type: "danger",
      action: async () => {
        try {
          await deleteCustomerAPI(id);
          toast.success("Customer deleted successfully");
          fetchCustomers();
        } catch (error) {
          showErrorToast(error);
        }
      },
    });
  };

  const columns: Column<CustomerTypes>[] = [
    { header: "Name", accessor: "name", className: "font-bold text-white" },
    { header: "Address", accessor: "address", className: "max-w-xs truncate text-gray-400" },
    { header: "Mobile", accessor: "mobile", className: "text-white font-medium" },
  ];

  return (
    <DashboardLayout>      
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-emerald-400" />
              Customers
            </h1>
            <p className="text-gray-400 text-sm">Manage your customer database and contact info.</p>
          </div>
          <button
            onClick={() => { setEditingCustomer(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-[#05070d] font-bold rounded-lg transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            Add Customer
          </button>
        </div>

        {/* Toolbar & Data Table */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center bg-[#0d1117] p-4 rounded-xl border border-[#1a1f2a]">
            <SearchBar value={searchQuery} onChange={(v) => { setSearchQuery(v); setCurrentPage(1); }} placeholder="Search customers..." />
          </div>

          <DataTable
            data={customers}
            columns={columns}
            onEdit={(c) => { setEditingCustomer(c); setIsModalOpen(true); }}
            onDelete={handleDelete}
            emptyMessage="No customers found."
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
        title={editingCustomer ? "Edit Customer" : "Add New Customer"}
      >
        <Formik
          initialValues={{
            name: editingCustomer?.name || "",
            address: editingCustomer?.address || "",
            mobile: editingCustomer?.mobile || "",
          }}
          validationSchema={CustomerSchema}
          onSubmit={handleSave}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Customer Name</label>
                <Field
                  name="name"
                  className={`w-full bg-[#151b23] border ${errors.name && touched.name ? "border-red-500" : "border-[#1a1f2a]"} p-2.5 rounded-lg text-white focus:outline-none focus:border-emerald-500/50 transition-all`}
                />
                <ErrorMessage name="name" component="div" className="text-xs text-red-500 mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Address</label>
                <Field
                  name="address"
                  as="textarea"
                  rows={3}
                  className={`w-full bg-[#151b23] border ${errors.address && touched.address ? "border-red-500" : "border-[#1a1f2a]"} p-2.5 rounded-lg text-white focus:outline-none focus:border-emerald-500/50 transition-all`}
                />
                <ErrorMessage name="address" component="div" className="text-xs text-red-500 mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Mobile Number</label>
                <Field
                  name="mobile"
                  className={`w-full bg-[#151b23] border ${errors.mobile && touched.mobile ? "border-red-500" : "border-[#1a1f2a]"} p-2.5 rounded-lg text-white focus:outline-none focus:border-emerald-500/50 transition-all`}
                />
                <ErrorMessage name="mobile" component="div" className="text-xs text-red-500 mt-1" />
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
                  {editingCustomer ? "Update Customer" : "Save Customer"}
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

export default CustomersPage;
