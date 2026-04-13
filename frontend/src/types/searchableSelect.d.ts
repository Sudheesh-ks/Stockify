export interface Option {
  value: string;
  label: string;
  subLabel?: string;
  original?: any;
}

export interface SearchableSelectProps {
  onSearch: (query: string) => Promise<Option[]>;
  onSelect: (option: Option | null) => void;
  placeholder?: string;
  label?: string;
  defaultValue?: string;
  error?: string;
  touched?: boolean;
  allowCustom?: boolean;
}
