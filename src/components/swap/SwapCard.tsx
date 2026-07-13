import React, { useState } from "react";
import { ArrowDownUp } from "lucide-react";
import { AmountInput } from "./AmountInput";
import { TokenSelector } from "./TokenSelector";
import { SwapButton } from "./SwapButton";

export const SwapCard: React.FC = () => {
  const [fromToken, setFromToken] = useState<string>("XLM");
  const [toToken, setToToken] = useState<string>("USDC");
  const [fromAmount, setFromAmount] = useState<string>("");

  const handleSwapDirection = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6 shadow-xl">
      {/* Card Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-tight text-neutral-100">Swap</h2>
      </div>

      {/* From Input Section */}
      <div className="rounded-xl bg-neutral-950 p-4 border border-neutral-800/60">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-neutral-500">From</span>
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

      {/* Swap Direction Toggler */}
      <div className="my-2 flex justify-center">
        <button
          type="button"
          onClick={handleSwapDirection}
          className="rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition-colors cursor-pointer"
          aria-label="Swap direction"
        >
          <ArrowDownUp className="h-4 w-4" />
        </button>
      </div>

      {/* To Input Section */}
      <div className="rounded-xl bg-neutral-950 p-4 border border-neutral-800/60 mb-6">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-neutral-500">To (Estimated)</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <span className="text-lg font-medium text-neutral-500 block py-2 px-1">
              --
            </span>
          </div>
          <div className="w-28 shrink-0">
            <TokenSelector value={toToken} onChange={setToToken} />
          </div>
        </div>

        {/* Estimated Output message block */}
        <div className="mt-3 flex items-center justify-between border-t border-neutral-900 pt-3 text-xs text-neutral-500">
          <span>Exchange Rate</span>
          <span>Quote unavailable</span>
        </div>
      </div>

      {/* Action Swap Button */}
      <SwapButton label="Swap" disabled={true} />
    </div>
  );
};
