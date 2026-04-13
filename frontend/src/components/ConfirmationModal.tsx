import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'success';
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  const typeConfig = {
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    warning: 'bg-emerald-500 hover:bg-emerald-600 text-[#05070d]',
    success: 'bg-emerald-500 hover:bg-emerald-600 text-[#05070d]',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0d1117] border border-[#1a1f2a] rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div
              className={`p-3 rounded-full ${type === 'danger' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}
            >
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">{message}</p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-[#1a1f2a] text-gray-400 hover:text-white hover:bg-[#151b23] rounded-lg transition-all font-semibold"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 px-4 py-2.5 rounded-lg transition-all font-bold active:scale-95 ${typeConfig[type]}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
