import React, { useRef } from "react";
import { animate } from "animejs";

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
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = () => {
    if (!disabled && buttonRef.current) {
      animate(buttonRef.current, {
        scale: 1.015,
        duration: 200,
        easing: "easeOutQuad",
      });
    }
  };

  const handleMouseLeave = () => {
    if (buttonRef.current) {
      animate(buttonRef.current, {
        scale: 1.0,
        duration: 200,
        easing: "easeOutQuad",
      });
    }
  };

  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold py-3.5 px-4 text-center text-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none shadow-lg shadow-indigo-500/10"
    >
      {label}
    </button>
  );
};
