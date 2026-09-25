import { useState } from "react";

interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectDropdownProps {
  label: string;
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

const MultiSelectDropdown = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select options",
  disabled = false,
}: MultiSelectDropdownProps) => {
  const [open, setOpen] = useState(false);

  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(
        value.filter((item) => item !== optionValue)
      );
    } else {
      onChange([...value, optionValue]);
    }
  };

  const selectedLabels = options
    .filter((option) => value.includes(option.value))
    .map((option) => option.label);

  return (
    <div className="relative">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white p-3 text-left transition hover:border-gray-400 disabled:cursor-not-allowed disabled:bg-gray-100"
      >
        <span
          className={
            selectedLabels.length > 0
              ? "text-gray-800"
              : "text-gray-400"
          }
        >
          {selectedLabels.length > 0
            ? selectedLabels.join(", ")
            : placeholder}
        </span>

        <span className="ml-3 text-gray-500">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && !disabled && (
        <div className="absolute z-20 mt-2 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {options.length === 0 ? (
            <p className="p-3 text-sm text-gray-500">
              No options available.
            </p>
          ) : (
            options.map((option) => {
              const isSelected = value.includes(
                option.value
              );

              return (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-3 px-4 py-3 transition hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() =>
                      handleToggle(option.value)
                    }
                    className="h-4 w-4 rounded border-gray-300"
                  />

                  <span className="text-sm text-gray-700">
                    {option.label}
                  </span>
                </label>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;