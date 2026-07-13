import React from "react";
import { HoverBorderGradient } from "../ui/HoverBorderGradient";
import { Wallet } from "lucide-react";

export const WalletButton: React.FC = () => {
  return (
    <HoverBorderGradient>
      <div className="flex items-center gap-2 font-semibold">
        <Wallet className="h-4 w-4 text-indigo-400" />
        <span>Connect Wallet</span>
      </div>
    </HoverBorderGradient>
  );
};
