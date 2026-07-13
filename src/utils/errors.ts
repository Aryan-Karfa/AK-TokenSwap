import { logger } from "./logger";

/**
 * Maps Freighter signature and connection errors into user-friendly Error objects.
 */
export const mapFreighterError = (err: unknown, expectedPassphrase?: string): Error => {
  logger.error("Freighter wallet operation failed:", err);

  if (err instanceof Error) {
    const msg = err.message;
    const lowerMsg = msg.toLowerCase();

    // User rejected signature
    if (
      lowerMsg.includes("reject") ||
      lowerMsg.includes("declined") ||
      lowerMsg.includes("cancel") ||
      lowerMsg.includes("user declined")
    ) {
      return new Error(
        "Transaction signature request declined. You must approve the request in your Freighter wallet to proceed."
      );
    }

    // Network passphrase/mismatch errors
    if (
      lowerMsg.includes("passphrase") ||
      lowerMsg.includes("not possible") ||
      lowerMsg.includes("network mismatch") ||
      lowerMsg.includes("september 2015")
    ) {
      return new Error(
        `Network Mismatch: Freighter is connected to a different network or rejected the passphrase. Expected network passphrase: "${expectedPassphrase || "Test SDF Network ; September 2015"}".`
      );
    }

    // Wallet locked
    if (
      lowerMsg.includes("locked") ||
      lowerMsg.includes("keypair") ||
      lowerMsg.includes("active account")
    ) {
      return new Error(
        "Freighter wallet is locked or no active account is selected. Please unlock Freighter and select an account."
      );
    }

    // Extension not installed
    if (
      lowerMsg.includes("installed") ||
      lowerMsg.includes("not found") ||
      lowerMsg.includes("extension")
    ) {
      return new Error(
        "Freighter wallet extension is not installed or detected. Please install Freighter and reload."
      );
    }

    return new Error(msg);
  }

  // Handle object errors (e.g. { message: '...' })
  const errObj = err as Record<string, unknown>;
  if (errObj && typeof errObj.message === "string") {
    return mapFreighterError(new Error(errObj.message), expectedPassphrase);
  }

  return new Error("An unexpected error occurred while interacting with Freighter Wallet.");
};

/**
 * Maps Horizon API and Stellar ledger submission errors into user-friendly Error objects.
 */
export const mapStellarError = (err: unknown, defaultMessage: string): Error => {
  logger.error(`Stellar operation failed: ${defaultMessage}`, err);

  if (err instanceof Error) {
    const lowerMsg = err.message.toLowerCase();
    if (lowerMsg.includes("timeout")) {
      return new Error(
        "Transaction request timed out. Please check your network connection and try again."
      );
    }
  }

  const errorObj = err as {
    response?: {
      status?: number;
      data?: {
        detail?: string;
        extras?: {
          result_codes?: {
            operations?: string[];
            transaction?: string;
          };
        };
      };
    };
    message?: string;
  };

  const status = errorObj.response?.status;
  const resultCodes = errorObj.response?.data?.extras?.result_codes;

  if (status === 404) {
    return new Error(
      "Stellar Testnet swap path or account was not found. Please ensure your account is funded."
    );
  }

  if (resultCodes) {
    const opCodes = resultCodes.operations || [];

    if (
      opCodes.includes("op_underfunded") ||
      resultCodes.transaction === "tx_insufficient_balance"
    ) {
      return new Error(
        "Insufficient XLM or token balances to cover this swap and transaction fees."
      );
    }

    if (opCodes.includes("op_no_trust")) {
      return new Error(
        "Destination token trustline is missing. Please add the trustline in the onboarding wizard."
      );
    }

    if (opCodes.includes("op_no_destination")) {
      return new Error(
        "Receiver address is not funded on Testnet. Fund it via the onboarding faucet."
      );
    }

    if (opCodes.includes("op_over_source_max")) {
      return new Error(
        "The required source amount exceeds your maximum limit due to price movement. Please try again."
      );
    }

    if (resultCodes.transaction === "tx_bad_seq") {
      return new Error("Transaction sequence number mismatch. Please refresh and try again.");
    }

    if (
      resultCodes.transaction === "tx_bad_auth" ||
      resultCodes.transaction === "tx_bad_auth_extra"
    ) {
      return new Error(
        "Invalid signature or authorization failure. Please check Freighter connection."
      );
    }
  }

  // Fallback to errorObj message if clean, otherwise defaultMessage
  const finalMsg = errorObj.message || defaultMessage;

  // Clean up any internal raw JSON or details if present
  if (finalMsg.startsWith("{") || finalMsg.includes("status: 400")) {
    return new Error(
      "Invalid transaction: The transaction is structurally incorrect or rejected by the ledger."
    );
  }

  return new Error(finalMsg);
};
