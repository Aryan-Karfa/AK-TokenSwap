import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { TOKENS } from "../../constants/tokens";

interface TokenSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 hover:border-neutral-700 focus:border-indigo-500 focus:outline-none disabled:opacity-50 cursor-pointer h-10 select-none transition-colors"
      >
        <span className="font-semibold">{value}</span>
        <ChevronDown className={`h-4 w-4 text-neutral-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && !disabled && (
        <ul className="absolute right-0 z-50 mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-900/90 backdrop-blur-md p-1 shadow-xl">
          {TOKENS.map((token) => (
            <li key={token}>
              <button
                type="button"
                onClick={() => {
                  onChange(token);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center px-3 py-2 text-sm rounded-md transition-colors cursor-pointer text-left ${
                  value === token
                    ? "bg-neutral-850 text-indigo-400 font-semibold"
                    : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                }`}
              >
                {token}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
