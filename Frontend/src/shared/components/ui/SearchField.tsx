import { Search, X } from "lucide-react";

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  ariaLabel: string;
  className?: string;
}

const SearchField = ({
  value,
  onChange,
  onClear,
  placeholder = "Search...",
  ariaLabel,
  className = "",
}: SearchFieldProps) => {
  const clear = () => {
    if (onClear) {
      onClear();
      return;
    }

    onChange("");
  };

  return (
    <div
      role="search"
      className={`relative w-full ${className}`}
    >
      <Search
        size={16}
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
      />

      <input
        type="text"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        spellCheck={false}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        onKeyDown={(event) => {
          if (event.key === "Escape" && value) {
            event.preventDefault();
            clear();
          }
        }}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="h-10 w-full rounded-full border border-border bg-surface py-2 pl-10 pr-10 text-sm text-charcoal shadow-[0_2px_8px_rgba(43,36,32,0.06)] outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-muted/70 hover:border-amber/60 focus:border-clay focus:shadow-[0_4px_14px_rgba(139,90,43,0.12)] focus:ring-2 focus:ring-clay/15"
      />

      {value && (
        <button
          type="button"
          onClick={clear}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors hover:bg-panel hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/40"
        >
          <X
            size={14}
            aria-hidden="true"
          />
        </button>
      )}
    </div>
  );
};

export default SearchField;
