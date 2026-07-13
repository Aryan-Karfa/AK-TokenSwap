import {
  Horizon,
  TransactionBuilder,
  Operation,
  Asset,
  TimeoutInfinite,
} from "@stellar/stellar-sdk";
import { signTransaction } from "@stellar/freighter-api";
import { HORIZON_URL, NETWORK_PASSPHRASE } from "./stellar";
import { logger } from "../utils/logger";
import { mapFreighterError, mapStellarError } from "../utils/errors";
import { runDiagnostics } from "../utils/diagnostics";

export const createTrustline = async (
  userAddress: string,
  assetCode: string,
  assetIssuer: string
): Promise<string> => {
  logger.info(`Building changeTrust transaction for user ${userAddress} and asset ${assetCode}...`);

  try {
    const server = new Horizon.Server(HORIZON_URL);
    const account = await server.loadAccount(userAddress);
    const asset = new Asset(assetCode, assetIssuer);

    const transaction = new TransactionBuilder(account, {
      fee: "100", // Standard base fee in stroops
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        Operation.changeTrust({
          asset: asset,
        })
      )
      .setTimeout(TimeoutInfinite)
      .build();

    const xdr = transaction.toXDR();

    // Request signature from Freighter Wallet
    await runDiagnostics("Before Trustline signing", xdr, {
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    const signResult = await signTransaction(xdr, {
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    if (signResult.error) {
      throw mapFreighterError(signResult.error, NETWORK_PASSPHRASE);
    }

    if (!signResult.signedTxXdr) {
      throw new Error("No signed transaction XDR returned from Freighter.");
    }

    const tx = TransactionBuilder.fromXDR(signResult.signedTxXdr, NETWORK_PASSPHRASE);
    const response = await server.submitTransaction(tx);

    logger.info(`Trustline change transaction successful. Hash: ${response.hash}`);
    return response.hash;
  } catch (err: unknown) {
    logger.error(`Failed to create trustline for ${assetCode}:`, err);

    if (
      err instanceof Error &&
      (err.message.includes("declined") ||
        err.message.includes("Mismatch") ||
        err.message.includes("locked"))
    ) {
      throw err;
    }

    throw mapStellarError(err, `Trustline establishment failed for ${assetCode}.`);
  }
};
