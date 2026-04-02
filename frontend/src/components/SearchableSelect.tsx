import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, Loader2, ChevronDown, Check } from "lucide-react";

interface Option {
  value: string;
  label: string;
  subLabel?: string;
  original?: any;
}

interface SearchableSelectProps {
  onSearch: (query: string) => Promise<Option[]>;
  onSelect: (option: Option | null) => void;
  placeholder?: string;
  label?: string;
  defaultValue?: string;
  error?: string;
  touched?: boolean;
  allowCustom?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  onSearch,
  onSelect,
  placeholder = "Search...",
  label,
  defaultValue = "",
  error,
  touched,
  allowCustom = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(defaultValue);
  const [options, setOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper to trigger search with debounce
  const fetchOptions = useCallback(
    async (query: string) => {
      setIsLoading(true);
      try {
        const results = await onSearch(query);
        setOptions(results);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [onSearch]
  );

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        fetchOptions(searchTerm);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchTerm, isOpen, fetchOptions]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: Option) => {
    setSearchTerm(option.label);
    onSelect(option);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") setIsOpen(true);
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        setSelectedIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        if (selectedIndex >= 0 && options[selectedIndex]) {
          handleSelect(options[selectedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>}
      
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-emerald-400 transition-colors">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </div>
        
        <input
          type="text"
          className={`w-full bg-[#151b23] border ${error && touched ? "border-red-500" : "border-[#1a1f2a]"} pl-10 pr-10 py-2.5 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all font-medium`}
          placeholder={placeholder}
          value={searchTerm}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            const val = e.target.value;
            setSearchTerm(val);
            setIsOpen(true);
            if (allowCustom) {
              onSelect({ value: val, label: val });
            } else if (val === "") {
              onSelect(null);
            }
          }}
          onKeyDown={handleKeyDown}
        />

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </div>

      {error && touched && <div className="text-xs text-red-500 mt-1">{error}</div>}

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[#0d1117] border border-[#1a1f2a] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {options.length > 0 ? (
              options.map((option, index) => (
                <div
                  key={option.value}
                  className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${
                    selectedIndex === index ? "bg-emerald-500/10 text-white" : "text-gray-300 hover:bg-[#1a1f2a] hover:text-white"
                  }`}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{option.label}</span>
                    {option.subLabel && <span className="text-xs text-gray-500">{option.subLabel}</span>}
                  </div>
                  {searchTerm === option.label && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500 text-sm">
                {isLoading ? "Searching inventory..." : "No results found"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
