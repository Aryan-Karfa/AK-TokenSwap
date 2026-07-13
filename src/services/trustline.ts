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
    const signResult = await signTransaction(xdr, {
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    if (signResult.error) {
      throw new Error(signResult.error.message || "Signing was rejected by the user.");
    }

    const tx = TransactionBuilder.fromXDR(signResult.signedTxXdr, NETWORK_PASSPHRASE);
    const response = await server.submitTransaction(tx);

    logger.info(`Trustline change transaction successful. Hash: ${response.hash}`);
    return response.hash;
  } catch (err: unknown) {
    logger.error(`Failed to create trustline for ${assetCode}:`, err);
    if (err instanceof Error) {
      throw err;
    }
    throw new Error(`Trustline establishment failed for ${assetCode}.`, { cause: err });
  }
};
