import React from "react";

interface SwapButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export const SwapButton: React.FC<SwapButtonProps> = ({
  label,
  onClick,
  disabled = false,
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-lg bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 text-neutral-900 font-semibold py-3 px-4 text-center text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {label}
    </button>
  );
};
