import type { LucideIcon } from 'lucide-react';

type InputFieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  Icon: LucideIcon;
  value: string;
  error: string;
  touched: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (name: string) => void;
};

const InputField = ({
  label,
  name,
  type = 'text',
  placeholder,
  Icon,
  value,
  error,
  touched,
  onChange,
  onBlur,
}: InputFieldProps) => (
  <div className="mb-4">
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4 pointer-events-none" />
      <input
        name={name}
        value={value}
        onChange={onChange}
        onBlur={() => onBlur(name)}
        type={type}
        placeholder={placeholder}
        className={`w-full h-11 pl-10 pr-4 rounded-xl text-sm bg-[#0b0f17] border transition-all duration-200
        ${
          touched && error
            ? 'border-red-500 text-red-400 placeholder-red-400'
            : 'border-[#1f2733] text-gray-200 placeholder-gray-500 focus:border-emerald-500/50'
        } focus:outline-none focus:ring-2 focus:ring-emerald-500/10`}
      />
    </div>

    {/* Error message */}
    {touched && error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

export default InputField;
