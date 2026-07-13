import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface TokenSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: { code: string; issuer?: string }[];
  disabled?: boolean;
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  value,
  onChange,
  options = [],
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full" onKeyDown={handleKeyDown}>
      <button
        type="button"
        disabled={disabled || options.length === 0}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 hover:border-neutral-700 focus-ring disabled:opacity-50 cursor-pointer h-10 select-none transition-colors"
      >
        <span className="font-semibold">{value || "Select"}</span>
        <ChevronDown
          className={`h-4 w-4 text-neutral-500 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && !disabled && options.length > 0 && (
        <ul
          role="listbox"
          aria-label="Tokens selection"
          className="absolute right-0 z-50 mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-900/95 backdrop-blur-md p-1 shadow-xl outline-none"
        >
          {options.map((token) => (
            <li
              key={`${token.code}-${token.issuer || "native"}`}
              role="option"
              aria-selected={value === token.code}
            >
              <button
                type="button"
                onClick={() => {
                  onChange(token.code);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center px-3 py-2 text-sm rounded-md transition-colors cursor-pointer text-left focus-ring ${
                  value === token.code
                    ? "bg-neutral-855 text-indigo-400 font-semibold"
                    : "text-neutral-350 hover:bg-neutral-800 hover:text-white"
                }`}
              >
                {token.code}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
