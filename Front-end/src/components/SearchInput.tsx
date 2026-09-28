import { useEffect, useState } from "react";

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  label?: string;
  delay?: number;
}

export function SearchInput({
  onSearch,
  placeholder = "Search",
  label = "Search",
  delay = 300,
}: SearchInputProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => onSearch(value.trim()), delay);
    return () => window.clearTimeout(timeoutId);
  }, [delay, onSearch, value]);

  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <span className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-400 transition focus-within:border-emerald-700 focus-within:ring-4 focus-within:ring-emerald-700/10">
        <span aria-hidden="true" className="text-lg leading-none">⌕</span>
        <input
          className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          type="search"
          value={value}
        />
      </span>
    </label>
  );
}
