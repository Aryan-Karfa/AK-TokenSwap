import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-neutral-800 bg-neutral-950 py-6 mt-auto">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:text-left sm:px-6 lg:px-8">
        <span className="text-sm font-semibold text-neutral-400">
          StellarSwap
        </span>
        <span className="text-xs text-neutral-500">
          &copy; {new Date().getFullYear()} StellarSwap. All rights reserved.
        </span>
      </div>
    </footer>
  );
};
