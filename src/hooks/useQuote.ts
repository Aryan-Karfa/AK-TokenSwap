import { useState, useEffect } from "react";
import { getQuote } from "../services/swap";
import type { QuoteResult } from "../services/swap";

export const useQuote = (
  fromToken: { code: string; issuer?: string } | null,
  toToken: { code: string; issuer?: string } | null
) => {
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState<QuoteResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (
      !amount ||
      parseFloat(amount) <= 0 ||
      !fromToken ||
      !toToken ||
      fromToken.code === toToken.code
    ) {
      setQuote(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const result = await getQuote(fromToken, toToken, amount);
        setQuote(result);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "No swap path found between assets on Testnet."
        );
        setQuote(null);
      } finally {
        setIsLoading(false);
      }
    }, 500); // 500ms input debounce

    return () => clearTimeout(timer);
  }, [amount, fromToken?.code, toToken?.code, fromToken?.issuer, toToken?.issuer]);

  return { amount, setAmount, quote, isLoading, error };
};
