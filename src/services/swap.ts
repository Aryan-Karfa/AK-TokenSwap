import {
  Asset,
  Horizon,
  TransactionBuilder,
  Operation,
  TimeoutInfinite,
} from "@stellar/stellar-sdk";
import { HORIZON_URL, NETWORK_PASSPHRASE } from "./stellar";
import { logger } from "../utils/logger";

export interface QuoteResult {
  destinationAmount: string;
  path: Asset[];
}

interface PathRecord {
  destination_amount: string;
  path: Array<{
    asset_type: string;
    asset_code?: string;
    asset_issuer?: string;
  }>;
}

// Convert raw Horizon and transaction operation errors to user-friendly messages
const mapStellarError = (err: unknown, defaultMessage: string): Error => {
  logger.error(`Stellar operation failed: ${defaultMessage}`, err);

  if (err instanceof Error && err.message.includes("Timeout")) {
    return new Error("Transaction request timed out. Please check network speed and try again.");
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
      "Stellar Testnet swap path or account was not found. Please ensure account is funded."
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
        "Destination token trustline is missing. Please add it to your Freighter wallet."
      );
    }
    if (opCodes.includes("op_no_destination")) {
      return new Error("Receiver address is not funded on Testnet. Fund it via Friendbot.");
    }
    if (opCodes.includes("op_over_source_max")) {
      return new Error(
        "The required source amount exceeds your maximum limit due to price movement."
      );
    }
  }

  return new Error(errorObj.message || defaultMessage);
};

export const getQuote = async (
  fromToken: { code: string; issuer?: string },
  toToken: { code: string; issuer?: string },
  amount: string
): Promise<QuoteResult> => {
  const server = new Horizon.Server(HORIZON_URL);

  const sourceAsset =
    fromToken.code === "XLM" ? Asset.native() : new Asset(fromToken.code, fromToken.issuer!);

  const destAsset =
    toToken.code === "XLM" ? Asset.native() : new Asset(toToken.code, toToken.issuer!);

  try {
    const response = await server.strictSendPaths(sourceAsset, amount, [destAsset]).call();

    if (response.records.length === 0) {
      throw new Error("No swap path found between these assets on Testnet.");
    }

    const parsedRecords = response.records as unknown as PathRecord[];
    const bestPath = parsedRecords.reduce((prev: PathRecord, current: PathRecord) => {
      return parseFloat(current.destination_amount) > parseFloat(prev.destination_amount)
        ? current
        : prev;
    });

    const pathAssets = bestPath.path.map(
      (p: { asset_type: string; asset_code?: string; asset_issuer?: string }) => {
        return p.asset_type === "native"
          ? Asset.native()
          : new Asset(p.asset_code!, p.asset_issuer!);
      }
    );

    return {
      destinationAmount: bestPath.destination_amount,
      path: pathAssets,
    };
  } catch (err: unknown) {
    throw mapStellarError(err, "Failed to find optimal swap paths on Testnet.");
  }
};

export const buildSwapTransaction = async (
  publicKey: string,
  fromToken: { code: string; issuer?: string },
  toToken: { code: string; issuer?: string },
  amount: string,
  destMin: string,
  path: Asset[]
): Promise<string> => {
  try {
    const server = new Horizon.Server(HORIZON_URL);
    const account = await server.loadAccount(publicKey);

    const sourceAsset =
      fromToken.code === "XLM" ? Asset.native() : new Asset(fromToken.code, fromToken.issuer!);

    const destAsset =
      toToken.code === "XLM" ? Asset.native() : new Asset(toToken.code, toToken.issuer!);

    const transaction = new TransactionBuilder(account, {
      fee: "100", // standard 100 stroops fee
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        Operation.pathPaymentStrictSend({
          sendAsset: sourceAsset,
          sendAmount: amount,
          destination: publicKey,
          destAsset: destAsset,
          destMin: destMin,
          path: path,
        })
      )
      .setTimeout(TimeoutInfinite)
      .build();

    return transaction.toXDR();
  } catch (err: unknown) {
    throw mapStellarError(err, "Failed to build swap transaction details.");
  }
};

export const submitSwapTransaction = async (signedXdr: string): Promise<string> => {
  try {
    const server = new Horizon.Server(HORIZON_URL);
    const tx = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
    const response = await server.submitTransaction(tx);
    return response.hash;
  } catch (err: unknown) {
    throw mapStellarError(err, "Swap transaction submission rejected by the ledger.");
  }
};
