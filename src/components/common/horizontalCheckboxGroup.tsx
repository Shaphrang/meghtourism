// HorizontalCheckboxGroup.tsx
import React from 'react';

interface HorizontalCheckboxGroupProps {
  label: string;
  value: string[];
  options: readonly string[];
  onChange: (selected: string[]) => void;
  disabled?: boolean;
}

const HorizontalCheckboxGroup: React.FC<HorizontalCheckboxGroupProps> = ({
  label,
  value,
  options,
  onChange,
  disabled = false,
}) => {
  const handleToggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else {
      onChange([...value, option]);
    }
  };

  return (
    <div className="mb-1">
      <label className="block font-semibold text-xs mb-0.5 text-left">{label}</label>
      <div className="flex flex-wrap gap-x-2 gap-y-1">
        {options.map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-1 cursor-pointer px-1 py-0.5 rounded hover:bg-gray-100 text-[11px] text-left"
            style={{ minWidth: "fit-content" }}
          >
            <input
              type="checkbox"
              checked={value.includes(opt)}
              onChange={() => handleToggle(opt)}
              className="accent-emerald-600"
              disabled={disabled}
              style={{ width: 14, height: 14 }}
            />
            <span className="leading-tight">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default HorizontalCheckboxGroup;
