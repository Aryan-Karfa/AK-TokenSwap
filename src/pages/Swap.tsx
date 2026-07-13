import React from "react";
import { SwapCard } from "../components/swap/SwapCard";

export const Swap: React.FC = () => {
  return (
    <div className="flex flex-1 items-center justify-center bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
      <SwapCard />
    </div>
  );
};
