import React from "react";
import { cn } from "../../utils/cn";

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChange,
  placeholder = "0.0",
  disabled = false,
  label,
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <span className="text-xs font-medium text-neutral-400 select-none">{label}</span>}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-150 placeholder-neutral-600 focus-ring disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none h-10 transition-all"
        )}
      />
    </div>
  );
};
