import React, { useState, useRef, useMemo } from "react";
import {
  ArrowUpDown,
  HelpCircle,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { AmountInput } from "./AmountInput";
import { TokenSelector } from "./TokenSelector";
import { SwapButton } from "./SwapButton";
import { TransactionModal } from "./TransactionModal";
import { useWallet } from "../../hooks/useWallet";
import { useQuote } from "../../hooks/useQuote";
import { useSwap } from "../../hooks/useSwap";
import { SkeletonText } from "../ui/Skeletons";
import { animate } from "animejs";
import { TOKENS } from "../../constants/tokens";
import { createTrustline } from "../../services/trustline";
import { requestTestTokens } from "../../services/faucet";

export const SwapCard: React.FC = () => {
  const {
    address,
    isConnected,
    isConnecting,
    balances,
    isLoadingBalances,
    networkWarning,
    freighterAvailable,
    connect,
    refreshBalances,
  } = useWallet();

  const [fromTokenCode, setFromTokenCode] = useState<string>("XLM");
  const [toTokenCode, setToTokenCode] = useState<string>("USDC");

  const [isTrustlineCreating, setIsTrustlineCreating] = useState(false);
  const [isFaucetRequesting, setIsFaucetRequesting] = useState(false);
  const [onboardingError, setOnboardingError] = useState<string | null>(null);
  const [onboardingSuccess, setOnboardingSuccess] = useState<string | null>(null);

  const iconRef = useRef<SVGSVGElement>(null);

  // Supported tokens list loaded from constants
  const supportedTokens = TOKENS;

  // Selected token structures
  const fromToken = useMemo(() => {
    return supportedTokens.find((t) => t.code === fromTokenCode) || null;
  }, [fromTokenCode, supportedTokens]);

  const toToken = useMemo(() => {
    return supportedTokens.find((t) => t.code === toTokenCode) || null;
  }, [toTokenCode, supportedTokens]);

  const isFromNative = fromTokenCode === "XLM";
  const isToNative = toTokenCode === "XLM";

  // Balance resolution helpers
  const fromTokenBalance = useMemo(() => {
    const bal = balances.find(
      (b) =>
        (b.asset_type === "native" && fromTokenCode === "XLM") || b.asset_code === fromTokenCode
    );
    return bal ? bal.balance : "0";
  }, [balances, fromTokenCode]);

  const toTokenBalance = useMemo(() => {
    const bal = balances.find(
      (b) => (b.asset_type === "native" && toTokenCode === "XLM") || b.asset_code === toTokenCode
    );
    return bal ? bal.balance : "0";
  }, [balances, toTokenCode]);

  // Trustline existence checks
  const hasToTrustline = useMemo(() => {
    if (toTokenCode === "XLM") return true;
    return balances.some((b) => b.asset_code === toTokenCode);
  }, [balances, toTokenCode]);

  // Quote hook
  const {
    amount,
    setAmount,
    quote,
    isLoading: isQuoteLoading,
    error: quoteError,
  } = useQuote(fromToken, toToken);

  // Swap transaction hook
  const { status, txHash, error: swapError, executeSwap, resetSwap } = useSwap();

  // Create trustline handler
  const handleCreateTrustline = async () => {
    if (!address || !toToken || !toToken.issuer) return;
    setIsTrustlineCreating(true);
    setOnboardingError(null);
    setOnboardingSuccess(null);
    try {
      await createTrustline(address, toToken.code, toToken.issuer);
      setOnboardingSuccess(`Trustline created successfully for ${toToken.code}!`);
      await refreshBalances();
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setOnboardingError(errorObj.message || "Failed to establish trustline.");
    } finally {
      setIsTrustlineCreating(false);
    }
  };

  // Request faucet tokens handler
  const handleFaucetRequest = async () => {
    if (!address) return;
    setIsFaucetRequesting(true);
    setOnboardingError(null);
    setOnboardingSuccess(null);
    try {
      await requestTestTokens(address, fromTokenCode);
      setOnboardingSuccess(`100 test ${fromTokenCode} sent to your wallet address!`);
      await refreshBalances();
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setOnboardingError(errorObj.message || "Faucet distribution request failed.");
    } finally {
      setIsFaucetRequesting(false);
    }
  };

  const handleSwapDirection = () => {
    const temp = fromTokenCode;
    setFromTokenCode(toTokenCode);
    setToTokenCode(temp);
    setAmount("");
    setOnboardingError(null);
    setOnboardingSuccess(null);
  };

  const handleMouseEnter = () => {
    if (iconRef.current) {
      animate(iconRef.current, {
        rotate: "+=180",
        duration: 200,
        easing: "easeOutQuad",
      });
    }
  };

  // Compute label and action for the main button
  const { buttonLabel, isButtonDisabled, clickAction } = useMemo(() => {
    if (!freighterAvailable) {
      return {
        buttonLabel: "Freighter Unavailable",
        isButtonDisabled: true,
        clickAction: undefined,
      };
    }

    if (!isConnected) {
      return {
        buttonLabel: "Connect Wallet",
        isButtonDisabled: isConnecting,
        clickAction: connect,
      };
    }

    if (networkWarning) {
      return {
        buttonLabel: "Wrong Network Connection",
        isButtonDisabled: true,
        clickAction: undefined,
      };
    }

    // Onboarding blocks
    if (!isToNative && !hasToTrustline) {
      return {
        buttonLabel: `Create Trustline for ${toTokenCode}`,
        isButtonDisabled: isTrustlineCreating,
        clickAction: handleCreateTrustline,
      };
    }

    if (!isFromNative && parseFloat(fromTokenBalance) === 0) {
      return {
        buttonLabel: `Claim 100 Test ${fromTokenCode}`,
        isButtonDisabled: isFaucetRequesting,
        clickAction: handleFaucetRequest,
      };
    }

    // Normal swap actions
    if (!amount || parseFloat(amount) <= 0) {
      return {
        buttonLabel: "Enter Amount",
        isButtonDisabled: true,
        clickAction: undefined,
      };
    }

    if (parseFloat(fromTokenBalance) < parseFloat(amount)) {
      return {
        buttonLabel: "Insufficient Balance",
        isButtonDisabled: true,
        clickAction: undefined,
      };
    }

    if (isQuoteLoading) {
      return {
        buttonLabel: "Fetching Quote...",
        isButtonDisabled: true,
        clickAction: undefined,
      };
    }

    if (!quote) {
      return {
        buttonLabel: "Swap Route Unavailable",
        isButtonDisabled: true,
        clickAction: undefined,
      };
    }

    return {
      buttonLabel: "Swap",
      isButtonDisabled: false,
      clickAction: () => {
        if (fromToken && toToken && quote) {
          executeSwap(fromToken, toToken, amount, quote.destinationAmount, quote.path);
        }
      },
    };
  }, [
    freighterAvailable,
    isConnected,
    isConnecting,
    networkWarning,
    fromTokenCode,
    toTokenCode,
    amount,
    fromTokenBalance,
    hasToTrustline,
    isQuoteLoading,
    quote,
    connect,
    executeSwap,
    fromToken,
    toToken,
    isTrustlineCreating,
    isFaucetRequesting,
  ]);

  return (
    <>
      <div className="w-full max-w-[480px] rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md p-6 shadow-2xl z-10 relative">
        {/* Card Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-white select-none">Swap</h2>
          {isConnected && (
            <span className="text-[10px] text-indigo-400 border border-indigo-500/20 bg-indigo-500/5 rounded-md px-2 py-0.5 select-none uppercase tracking-wider font-semibold">
              Testnet Active
            </span>
          )}
        </div>

        {/* Onboarding Wizard Tracker */}
        <div className="mb-6 rounded-xl border border-white/[0.03] bg-neutral-950/20 p-4 select-none">
          <h3 className="text-xs font-semibold text-neutral-300 mb-3 uppercase tracking-wider">
            Setup Onboarding Flow
          </h3>
          <div className="space-y-2.5">
            {/* Step 1: Connect Wallet */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isConnected
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-neutral-800 text-neutral-400 border border-white/[0.03]"
                  }`}
                >
                  {isConnected ? "✓" : "1"}
                </span>
                <span className={isConnected ? "text-neutral-400" : "text-neutral-300 font-medium"}>
                  Connect Freighter Wallet
                </span>
              </div>
              <span
                className={`text-[10px] ${isConnected ? "text-emerald-400 font-semibold" : "text-neutral-500"}`}
              >
                {isConnected ? "Connected" : "Pending"}
              </span>
            </div>

            {/* Step 2: Create Trustline */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    !isConnected
                      ? "bg-neutral-900 text-neutral-600"
                      : isToNative || hasToTrustline
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse font-semibold"
                  }`}
                >
                  {!isConnected ? "2" : isToNative || hasToTrustline ? "✓" : "2"}
                </span>
                <span
                  className={
                    !isConnected
                      ? "text-neutral-600"
                      : isToNative || hasToTrustline
                        ? "text-neutral-400"
                        : "text-neutral-300 font-medium"
                  }
                >
                  Create Trustline {!isToNative && isConnected ? `(${toTokenCode})` : ""}
                </span>
              </div>
              <span
                className={`text-[10px] ${
                  !isConnected
                    ? "text-neutral-600"
                    : isToNative || hasToTrustline
                      ? "text-emerald-400 font-semibold"
                      : "text-amber-400 font-semibold"
                }`}
              >
                {!isConnected
                  ? "Locked"
                  : isToNative || hasToTrustline
                    ? "Trustline Active"
                    : "Trustline Required"}
              </span>
            </div>

            {/* Step 3: Receive Test Tokens */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    !isConnected || (!isToNative && !hasToTrustline)
                      ? "bg-neutral-900 text-neutral-600"
                      : (
                            isFromNative
                              ? parseFloat(fromTokenBalance) > 0.5
                              : parseFloat(fromTokenBalance) > 0
                          )
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse font-semibold"
                  }`}
                >
                  {!isConnected || (!isToNative && !hasToTrustline)
                    ? "3"
                    : (
                          isFromNative
                            ? parseFloat(fromTokenBalance) > 0.5
                            : parseFloat(fromTokenBalance) > 0
                        )
                      ? "✓"
                      : "3"}
                </span>
                <span
                  className={
                    !isConnected || (!isToNative && !hasToTrustline)
                      ? "text-neutral-600"
                      : (
                            isFromNative
                              ? parseFloat(fromTokenBalance) > 0.5
                              : parseFloat(fromTokenBalance) > 0
                          )
                        ? "text-neutral-400"
                        : "text-neutral-300 font-medium"
                  }
                >
                  Receive Test Tokens{" "}
                  {!isFromNative && isConnected && hasToTrustline ? `(${fromTokenCode})` : ""}
                </span>
              </div>
              <span
                className={`text-[10px] ${
                  !isConnected || (!isToNative && !hasToTrustline)
                    ? "text-neutral-600"
                    : (
                          isFromNative
                            ? parseFloat(fromTokenBalance) > 0.5
                            : parseFloat(fromTokenBalance) > 0
                        )
                      ? "text-emerald-400 font-semibold"
                      : "text-amber-400 font-semibold"
                }`}
              >
                {!isConnected || (!isToNative && !hasToTrustline)
                  ? "Locked"
                  : (
                        isFromNative
                          ? parseFloat(fromTokenBalance) > 0.5
                          : parseFloat(fromTokenBalance) > 0
                      )
                    ? "Ready"
                    : "Faucet Claimable"}
              </span>
            </div>

            {/* Step 4: Swap */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isConnected &&
                    (isToNative || hasToTrustline) &&
                    (isFromNative
                      ? parseFloat(fromTokenBalance) > 0.5
                      : parseFloat(fromTokenBalance) > 0)
                      ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-bold"
                      : "bg-neutral-905 text-neutral-650"
                  }`}
                >
                  {isConnected &&
                  (isToNative || hasToTrustline) &&
                  (isFromNative
                    ? parseFloat(fromTokenBalance) > 0.5
                    : parseFloat(fromTokenBalance) > 0)
                    ? "✓"
                    : "4"}
                </span>
                <span
                  className={
                    isConnected &&
                    (isToNative || hasToTrustline) &&
                    (isFromNative
                      ? parseFloat(fromTokenBalance) > 0.5
                      : parseFloat(fromTokenBalance) > 0)
                      ? "text-neutral-300 font-medium"
                      : "text-neutral-650"
                  }
                >
                  Execute Swaps
                </span>
              </div>
              <span
                className={`text-[10px] ${
                  isConnected &&
                  (isToNative || hasToTrustline) &&
                  (isFromNative
                    ? parseFloat(fromTokenBalance) > 0.5
                    : parseFloat(fromTokenBalance) > 0)
                    ? "text-indigo-400 font-semibold"
                    : "text-neutral-650"
                }`}
              >
                {isConnected &&
                (isToNative || hasToTrustline) &&
                (isFromNative
                  ? parseFloat(fromTokenBalance) > 0.5
                  : parseFloat(fromTokenBalance) > 0)
                  ? "Ready"
                  : "Locked"}
              </span>
            </div>
          </div>
        </div>

        {/* Onboarding Operations Status Banner */}
        {(onboardingError || onboardingSuccess || isTrustlineCreating || isFaucetRequesting) && (
          <div className="mb-4 text-xs select-none">
            {isTrustlineCreating && (
              <div className="flex items-center gap-2 text-indigo-400 border border-indigo-500/20 bg-indigo-500/5 rounded-lg p-2.5">
                <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                <span>Creating trustline on Testnet... Confirm in Freighter extension.</span>
              </div>
            )}
            {isFaucetRequesting && (
              <div className="flex items-center gap-2 text-indigo-400 border border-indigo-500/20 bg-indigo-500/5 rounded-lg p-2.5">
                <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                <span>Requesting 100 test ${fromTokenCode} tokens...</span>
              </div>
            )}
            {onboardingError && (
              <div className="flex items-start gap-2 text-rose-400 border border-rose-500/20 bg-rose-500/5 rounded-lg p-2.5 text-left">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{onboardingError}</span>
              </div>
            )}
            {onboardingSuccess && (
              <div className="flex items-center gap-2 text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 rounded-lg p-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                <span>{onboardingSuccess}</span>
              </div>
            )}
          </div>
        )}

        {/* FROM Container */}
        <div className="rounded-xl bg-neutral-900/40 p-4 border border-white/[0.03] mb-2">
          <div className="flex justify-between items-center mb-1.5 select-none text-xs font-semibold text-neutral-400">
            <span>FROM</span>
            {isConnected && (
              <span className="text-[10px] text-neutral-500 font-medium">
                {isLoadingBalances ? (
                  <SkeletonText className="h-3 w-16" />
                ) : (
                  `Balance: ${parseFloat(fromTokenBalance).toFixed(4)}`
                )}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <AmountInput value={amount} onChange={setAmount} placeholder="0.0" />
            </div>
            <div className="w-28 shrink-0">
              <TokenSelector
                value={fromTokenCode}
                onChange={setFromTokenCode}
                options={supportedTokens}
              />
            </div>
          </div>
        </div>

        {/* Switcher Button */}
        <div className="flex justify-center -my-2.5 relative z-10">
          <button
            type="button"
            onClick={handleSwapDirection}
            onMouseEnter={handleMouseEnter}
            className="rounded-full border border-neutral-800 bg-neutral-900 p-2 text-neutral-400 hover:text-indigo-400 hover:border-indigo-500/50 shadow-md transition-colors cursor-pointer focus-ring"
            aria-label="Swap direction"
          >
            <ArrowUpDown ref={iconRef} className="h-4 w-4" />
          </button>
        </div>

        {/* TO Container */}
        <div className="rounded-xl bg-neutral-900/40 p-4 border border-white/[0.03] mt-2 mb-6">
          <div className="flex justify-between items-center mb-1.5 select-none text-xs font-semibold text-neutral-400">
            <span>TO</span>
            {isConnected && (
              <span className="text-[10px] text-neutral-500 font-medium">
                {isLoadingBalances ? (
                  <SkeletonText className="h-3 w-16" />
                ) : (
                  `Balance: ${parseFloat(toTokenBalance).toFixed(4)}`
                )}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              {isQuoteLoading ? (
                <div className="flex items-center h-10 px-3 bg-neutral-950 border border-neutral-800 rounded-lg">
                  <SkeletonText className="h-4 w-12" />
                </div>
              ) : (
                <span
                  className={`text-sm font-medium block py-2.5 px-3 bg-neutral-950 border border-neutral-800 rounded-lg h-10 select-none truncate ${quote ? "text-neutral-100" : "text-neutral-500"}`}
                >
                  {quote ? parseFloat(quote.destinationAmount).toFixed(6) : "No quote available"}
                </span>
              )}
            </div>
            <div className="w-28 shrink-0">
              <TokenSelector
                value={toTokenCode}
                onChange={setToTokenCode}
                options={supportedTokens}
              />
            </div>
          </div>
        </div>

        {/* Info & Warnings Section */}
        <div className="rounded-xl border border-white/[0.03] bg-neutral-950/40 p-4 space-y-3 mb-6">
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-neutral-400 select-none">
                <span>Estimated Output</span>
                <HelpCircle className="h-3 w-3 text-neutral-500" />
              </div>
              <span className="text-neutral-550 font-semibold">
                {isQuoteLoading ? (
                  <SkeletonText className="h-3 w-10" />
                ) : quote ? (
                  parseFloat(quote.destinationAmount).toFixed(6)
                ) : (
                  "--"
                )}
              </span>
            </div>
            <span className="text-neutral-500 text-[10px] select-none text-left font-medium">
              {isQuoteLoading ? (
                <SkeletonText className="h-2.5 w-32 mt-1" />
              ) : quoteError ? (
                <span className="text-rose-450 font-medium">{quoteError}</span>
              ) : quote && amount ? (
                `1 ${fromTokenCode} = ${(parseFloat(quote.destinationAmount) / parseFloat(amount)).toFixed(5)} ${toTokenCode}`
              ) : (
                "Enter an amount to continue."
              )}
            </span>
          </div>

          <div className="h-[1px] bg-white/[0.02]" />

          {/* Network Warning */}
          {networkWarning && (
            <div className="flex items-start gap-2 text-[10px] text-amber-400 border border-amber-500/20 bg-amber-500/5 rounded-lg p-2.5 text-left select-none">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{networkWarning}</span>
            </div>
          )}

          {/* Trustline Warning */}
          {isConnected && !isToNative && !hasToTrustline && (
            <div className="flex items-start gap-2 text-[10px] text-amber-400 border border-amber-500/20 bg-amber-500/5 rounded-lg p-2.5 text-left select-none">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>
                Trustline for {toTokenCode} is missing. Click the action button below to establish a
                trustline via Freighter.
              </span>
            </div>
          )}

          {/* Faucet Claimable Warning */}
          {isConnected && !isFromNative && hasToTrustline && parseFloat(fromTokenBalance) === 0 && (
            <div className="flex items-start gap-2 text-[10px] text-amber-400 border border-amber-500/20 bg-amber-500/5 rounded-lg p-2.5 text-left select-none">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>
                You do not own any test ${fromTokenCode} tokens. Click the button below to request
                100 free tokens from the faucet.
              </span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs select-none">
            <span className="text-neutral-400">Network</span>
            <span className="text-neutral-300 font-semibold flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span>Testnet</span>
            </span>
          </div>
          <div className="flex items-center justify-between text-xs select-none">
            <span className="text-neutral-400">Fee</span>
            <span className="text-neutral-550 font-medium">100 Stroops</span>
          </div>
          <div className="flex items-center justify-between text-xs select-none">
            <span className="text-neutral-400">Estimated Time</span>
            <span className="text-neutral-550 font-medium">~5 seconds</span>
          </div>
        </div>

        {/* Action Button */}
        <SwapButton label={buttonLabel} disabled={isButtonDisabled} onClick={clickAction} />
      </div>

      {/* Transaction Success/Pending Modal */}
      <TransactionModal isOpen={status !== "idle"} title="Swap Operation" onClose={resetSwap}>
        <div className="flex flex-col items-center text-center p-2">
          {status === "pending" && (
            <>
              <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mb-4" />
              <h4 className="text-base font-bold text-white mb-2">Preparing Transaction</h4>
              <p className="text-sm text-neutral-400 leading-relaxed max-w-xs">
                Generating path payment transaction instructions on Testnet...
              </p>
            </>
          )}

          {status === "submitting" && (
            <>
              <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mb-4" />
              <h4 className="text-base font-bold text-white mb-2">Waiting for Signing</h4>
              <p className="text-sm text-neutral-400 leading-relaxed max-w-xs">
                Please approve and sign the transaction XDR within the Freighter popup window.
              </p>
            </>
          )}

          {status === "confirmed" && (
            <>
              <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-4" />
              <h4 className="text-base font-bold text-white mb-2">Transaction Confirmed</h4>
              <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                Your swap has been processed successfully on the Stellar Testnet ledger.
              </p>
              {txHash && (
                <div className="w-full space-y-3">
                  <div className="rounded-lg bg-neutral-900 p-3 border border-white/[0.03] text-xs text-neutral-400 font-mono text-left select-all break-all">
                    {txHash}
                  </div>
                  <a
                    href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium border-b border-indigo-400/20 pb-0.5"
                  >
                    <span>View on Stellar Expert</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </>
          )}

          {status === "failed" && (
            <>
              <AlertTriangle className="h-12 w-12 text-rose-500 mb-4" />
              <h4 className="text-base font-bold text-white mb-2">Transaction Failed</h4>
              <p className="text-sm text-rose-400/90 leading-relaxed mb-4 max-w-xs font-medium">
                {swapError || "An unexpected error occurred during execution."}
              </p>
              <button
                type="button"
                onClick={resetSwap}
                className="mt-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-sm font-semibold px-6 py-2 cursor-pointer transition-all"
              >
                Close
              </button>
            </>
          )}
        </div>
      </TransactionModal>
    </>
  );
};
