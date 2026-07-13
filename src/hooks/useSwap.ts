import { useState, useCallback } from "react";
import { useWallet } from "./useWallet";
import { buildSwapTransaction, submitSwapTransaction } from "../services/swap";
import { signTransaction } from "@stellar/freighter-api";
import { Asset } from "@stellar/stellar-sdk";
import { logger } from "../utils/logger";
import { NETWORK_PASSPHRASE } from "../services/stellar";
import { mapFreighterError } from "../utils/errors";
import { runDiagnostics } from "../utils/diagnostics";

export type SwapStatus = "idle" | "pending" | "submitting" | "confirmed" | "failed";

export const useSwap = () => {
  const { address, isConnected, refreshBalances, networkWarning } = useWallet();
  const [status, setStatus] = useState<SwapStatus>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const executeSwap = useCallback(
    async (
      fromToken: { code: string; issuer?: string },
      toToken: { code: string; issuer?: string },
      amount: string,
      expectedOutput: string,
      path: Asset[]
    ) => {
      if (!address || !isConnected) {
        setError("Wallet not connected");
        setStatus("failed");
        return;
      }
      if (networkWarning) {
        setError("Network mismatch. Switch Freighter to Testnet.");
        setStatus("failed");
        return;
      }

      setError(null);
      setTxHash(null);
      setStatus("pending");

      try {
        // Apply a safe 1% slippage for Testnet payments
        const destMin = (parseFloat(expectedOutput) * 0.99).toFixed(7);

        const xdr = await buildSwapTransaction(address, fromToken, toToken, amount, destMin, path);

        setStatus("submitting");

        // Run developer diagnostics before signing
        await runDiagnostics("Before Swap signing", xdr, { networkPassphrase: NETWORK_PASSPHRASE });

        const signResult = await signTransaction(xdr, {
          networkPassphrase: NETWORK_PASSPHRASE,
        });

        if (signResult.error) {
          throw mapFreighterError(signResult.error, NETWORK_PASSPHRASE);
        }

        if (!signResult.signedTxXdr) {
          throw new Error("No signed transaction XDR returned from Freighter.");
        }

        const hash = await submitSwapTransaction(signResult.signedTxXdr);
        setTxHash(hash);
        setStatus("confirmed");

        // Reload account balances
        await refreshBalances();
      } catch (err: unknown) {
        logger.error("Swap tx execution error:", err);

        let userMessage = "Transaction execution failed.";
        if (err instanceof Error) {
          userMessage = err.message;
        } else if (typeof err === "object" && err !== null && "message" in err) {
          const mapped = mapFreighterError(err, NETWORK_PASSPHRASE);
          userMessage = mapped.message;
        }

        setError(userMessage);
        setStatus("failed");
      }
    },
    [address, isConnected, networkWarning, refreshBalances]
  );

  const resetSwap = useCallback(() => {
    setStatus("idle");
    setError(null);
    setTxHash(null);
  }, []);

  return { status, txHash, error, executeSwap, resetSwap };
};
