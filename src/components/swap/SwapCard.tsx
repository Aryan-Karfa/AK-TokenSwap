import React, { useState, useRef } from "react";
import { ArrowUpDown, HelpCircle } from "lucide-react";
import { AmountInput } from "./AmountInput";
import { TokenSelector } from "./TokenSelector";
import { SwapButton } from "./SwapButton";
import { animate } from "animejs";

export const SwapCard: React.FC = () => {
  const [fromToken, setFromToken] = useState<string>("XLM");
  const [toToken, setToToken] = useState<string>("USDC");
  const [fromAmount, setFromAmount] = useState<string>("");
  const iconRef = useRef<SVGSVGElement>(null);

  const handleSwapDirection = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  const handleMouseEnter = () => {
    if (iconRef.current) {
      animate(iconRef.current, {
        rotate: "+=180",
        duration: 350,
        easing: "easeInOutSine",
      });
    }
  };

  return (
    <div className="w-full max-w-[480px] rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md p-6 shadow-2xl z-10 relative">
      {/* Card Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-white">Swap</h2>
      </div>

      {/* FROM Container */}
      <div className="rounded-xl bg-neutral-900/40 p-4 border border-white/[0.03] mb-2">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-semibold text-neutral-400">FROM</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <AmountInput
              value={fromAmount}
              onChange={setFromAmount}
              placeholder="0.0"
            />
          </div>
          <div className="w-28 shrink-0">
            <TokenSelector value={fromToken} onChange={setFromToken} />
          </div>
        </div>
      </div>

      {/* Switcher Button */}
      <div className="flex justify-center -my-2.5 relative z-10">
        <button
          type="button"
          onClick={handleSwapDirection}
          onMouseEnter={handleMouseEnter}
          className="rounded-full border border-neutral-800 bg-neutral-900 p-2 text-neutral-400 hover:text-indigo-400 hover:border-indigo-500/50 shadow-md transition-colors cursor-pointer"
          aria-label="Swap direction"
        >
          <ArrowUpDown ref={iconRef} className="h-4 w-4" />
        </button>
      </div>

      {/* TO Container */}
      <div className="rounded-xl bg-neutral-900/40 p-4 border border-white/[0.03] mt-2 mb-6">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-semibold text-neutral-400">TO</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <span className="text-lg font-medium text-neutral-500 block py-1.5 px-3 bg-neutral-950 border border-neutral-800 rounded-lg h-10 select-none">
              --
            </span>
          </div>
          <div className="w-28 shrink-0">
            <TokenSelector value={toToken} onChange={setToToken} />
          </div>
        </div>
      </div>

      {/* Info Sections */}
      <div className="rounded-xl border border-white/[0.03] bg-neutral-950/40 p-4 space-y-3 mb-6">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-neutral-400">
            <span>Estimated Output</span>
            <HelpCircle className="h-3 w-3 text-neutral-500" />
          </div>
          <span className="text-neutral-500">Quote unavailable</span>
        </div>
        <div className="h-[1px] bg-white/[0.02]" />
        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-400">Network</span>
          <span className="text-neutral-300 font-semibold flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Testnet Ready</span>
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-400">Fee</span>
          <span className="text-neutral-500">--</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-400">Estimated Time</span>
          <span className="text-neutral-500">--</span>
        </div>
      </div>

      {/* Swap Button */}
      <SwapButton label="Swap" disabled={true} />
    </div>
  );
};
