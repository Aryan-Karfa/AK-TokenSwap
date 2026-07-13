import { APP_CONFIG } from "../config/app";
import { getNetwork } from "@stellar/freighter-api";
import { Transaction } from "@stellar/stellar-sdk";
import { logger } from "./logger";

/**
 * Runs developer-only diagnostics for Stellar/Freighter state and transactions.
 * Automatically disabled in production.
 */
export const runDiagnostics = async (
  stage: string,
  txXdr?: string,
  signOptions?: Record<string, unknown>
): Promise<void> => {
  if (!import.meta.env.DEV) {
    return;
  }

  try {
    const freighterNet = await getNetwork();

    // eslint-disable-next-line no-console
    console.group(`[StellarSwap Dev Diagnostics] Stage: ${stage}`);
    // eslint-disable-next-line no-console
    console.log("SDK Version:", "16.0.1");
    // eslint-disable-next-line no-console
    console.log("Freighter API Version:", "6.0.1");
    // eslint-disable-next-line no-console
    console.log("Horizon URL:", APP_CONFIG.HORIZON_URL);
    // eslint-disable-next-line no-console
    console.log("RPC URL:", APP_CONFIG.RPC_URL);
    // eslint-disable-next-line no-console
    console.log("Freighter Network Info:", freighterNet);
    // eslint-disable-next-line no-console
    console.log("App Config Passphrase:", APP_CONFIG.NETWORK_PASSPHRASE);

    if (txXdr) {
      try {
        const tx = new Transaction(txXdr, APP_CONFIG.NETWORK_PASSPHRASE);
        // eslint-disable-next-line no-console
        console.log("Parsed Transaction Details:", {
          sourceAccount: tx.source,
          fee: tx.fee,
          operationsCount: tx.operations.length,
          networkPassphrase: tx.networkPassphrase,
        });
      } catch (xdrErr) {
        logger.error("Failed to parse XDR in diagnostics:", xdrErr);
      }
    }

    if (signOptions) {
      // eslint-disable-next-line no-console
      console.log("Signing Request Options:", signOptions);
    }

    // eslint-disable-next-line no-console
    console.groupEnd();
  } catch (err) {
    logger.error("Error running developer diagnostics:", err);
  }
};
