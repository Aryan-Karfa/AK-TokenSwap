import React, { useEffect } from "react";
import { SwapCard } from "../components/swap/SwapCard";
import { AnimatedGrid } from "../components/ui/AnimatedGrid";
import { Noise } from "../components/ui/Noise";
import { animate } from "animejs";

export const Swap: React.FC = () => {
  useEffect(() => {
    animate(".animate-swap-card", {
      scale: [0.97, 1],
      opacity: [0, 1],
      duration: 200,
      easing: "easeOutQuad",
    });
  }, []);

  return (
    <div className="flex flex-1 items-center justify-center bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Grid */}
      <AnimatedGrid />

      {/* Grain Noise Overlay */}
      <Noise />

      {/* SwapCard Container */}
      <div className="animate-swap-card opacity-0 scale-95 w-full flex justify-center z-10">
        <SwapCard />
      </div>
    </div>
  );
};
