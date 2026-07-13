import React from "react";

export const WalletButton: React.FC = () => {
  return (
    <button
      type="button"
      className="px-4 py-2 text-sm font-medium text-neutral-100 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-900 border border-neutral-700 rounded-lg transition-colors cursor-pointer"
    >
      Connect Wallet
    </button>
  );
};
