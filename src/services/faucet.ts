import { logger } from "../utils/logger";

export const requestTestTokens = async (
  walletAddress: string,
  assetCode: string
): Promise<string> => {
  logger.info(`Requesting 100 ${assetCode} from faucet for address ${walletAddress}...`);

  try {
    const response = await fetch("/api/fund", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address: walletAddress,
        asset: assetCode,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Faucet request failed with status code ${response.status}.`);
    }

    logger.info(`Faucet distribution successful. Transaction Hash: ${data.hash}`);
    return data.hash;
  } catch (err: unknown) {
    logger.error(`Faucet distribution failed for ${assetCode}:`, err);
    if (err instanceof Error) {
      throw err;
    }
    throw new Error(`Failed to claim ${assetCode} faucet tokens.`, { cause: err });
  }
};
