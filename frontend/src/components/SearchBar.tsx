import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar = ({ value, onChange, placeholder = 'Search...' }: SearchBarProps) => {
  return (
    <div className="relative w-full max-w-md group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 bg-[#0d1117] border border-[#1a1f2a] rounded-lg leading-5 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 sm:text-sm transition-all"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
