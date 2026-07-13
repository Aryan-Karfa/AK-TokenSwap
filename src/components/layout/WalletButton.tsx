import React from "react";
import { HoverBorderGradient } from "../ui/HoverBorderGradient";
import { Wallet } from "lucide-react";
import { useWallet } from "../../hooks/useWallet";

export const WalletButton: React.FC = () => {
  const { address, isConnecting, connect, disconnect, isConnected } = useWallet();

  const handleClick = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  return (
    <HoverBorderGradient onClick={handleClick}>
      <div className="flex items-center gap-2 font-semibold">
        <Wallet className="h-4 w-4 text-indigo-400" />
        <span className="select-none">
          {isConnecting
            ? "Connecting..."
            : isConnected && address
              ? `${address.slice(0, 4)}...${address.slice(-4)}`
              : "Connect Wallet"}
        </span>
      </div>
    </HoverBorderGradient>
  );
};
