import React from 'react';
import { X } from "lucide-react";

interface AddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

const AddEditModal = ({ isOpen, onClose, title, children }: AddEditModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0d1117] border border-[#1a1f2a] rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1a1f2a] flex justify-between items-center shrink-0">
          <h2 className="text-lg font-bold text-white tracking-tight">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#1a1f2a] text-gray-400 hover:text-white rounded-lg transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 custom-scrollbar text-gray-300">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AddEditModal;
