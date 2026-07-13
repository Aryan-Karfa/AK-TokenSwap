import {
  Keypair,
  Horizon,
  Asset,
  TransactionBuilder,
  Operation,
  TimeoutInfinite,
} from "@stellar/stellar-sdk";
import fs from "fs";
import path from "path";
import { MARKET_CONFIG } from "../config/market.js";

const HORIZON_URL = "https://horizon-testnet.stellar.org";
const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";
const server = new Horizon.Server(HORIZON_URL);

// Parse .env file manually
const getEnv = () => {
  const env: Record<string, string> = {};
  try {
    const envPath = path.join(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, "utf8").split("\n");
      for (const line of lines) {
        const parts = line.split("=");
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const value = parts.slice(1).join("=").trim();
          env[key] = value;
        }
      }
    }
  } catch (err) {
    console.error("Failed to parse .env file:", err);
  }
  return env;
};

const env = getEnv();

export const createLiquidity = async () => {
  const usdcSecret = env.USDC_DISTRIBUTION_SECRET;
  const aquaSecret = env.AQUA_DISTRIBUTION_SECRET;
  const usdcIssuer = env.VITE_USDC_ISSUER;
  const aquaIssuer = env.VITE_AQUA_ISSUER;

  if (!usdcSecret || !aquaSecret || !usdcIssuer || !aquaIssuer) {
    console.error("Missing required variables in .env file.");
    process.exit(1);
  }

  const usdcDistKeypair = Keypair.fromSecret(usdcSecret);
  const aquaDistKeypair = Keypair.fromSecret(aquaSecret);

  const nativeAsset = Asset.native();
  const usdcAsset = new Asset("USDC", usdcIssuer);
  const aquaAsset = new Asset("AQUA", aquaIssuer);

  console.log("Loading existing active offers for USDC distributor...");
  const usdcOffers = await server.offers().forAccount(usdcDistKeypair.publicKey()).call();

  console.log("Loading existing active offers for AQUA distributor...");
  const aquaOffers = await server.offers().forAccount(aquaDistKeypair.publicKey()).call();

  const getExistingOfferId = (offers: any[], selling: Asset, buying: Asset): string | undefined => {
    const matched = offers.find((o) => {
      const isSellingMatch = selling.isNative()
        ? o.selling.asset_type === "native"
        : o.selling.asset_code === selling.code && o.selling.asset_issuer === selling.issuer;

      const isBuyingMatch = buying.isNative()
        ? o.buying.asset_type === "native"
        : o.buying.asset_code === buying.code && o.buying.asset_issuer === buying.issuer;

      return isSellingMatch && isBuyingMatch;
    });
    return matched ? matched.id : undefined;
  };

  // Helper to manage offer transactions
  const manageOffer = async (
    distKeypair: Keypair,
    selling: Asset,
    buying: Asset,
    amount: string,
    price: string,
    existingOfferId?: string
  ) => {
    const distAccount = await server.loadAccount(distKeypair.publicKey());
    const tx = new TransactionBuilder(distAccount, {
      fee: "100",
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        Operation.manageSellOffer({
          selling,
          buying,
          amount,
          price,
          offerId: existingOfferId ? parseInt(existingOfferId) : 0,
        })
      )
      .setTimeout(TimeoutInfinite)
      .build();

    tx.sign(distKeypair);
    const result = await server.submitTransaction(tx);
    return result.hash;
  };

  try {
    const spread = MARKET_CONFIG.DEFAULT_SPREAD;

    // --- USDC PAIR ---
    // 1. Sell USDC for XLM
    // Selling: USDC, Buying: XLM. Price represents amount of XLM received per USDC.
    // Ask Price: (1 / 5) * (1 + spread / 2) = 0.2 * 1.01 = 0.202
    const usdcSellPrice = ((1 / MARKET_CONFIG.USDC_PER_XLM) * (1 + spread / 2)).toFixed(7);
    const usdcSellOfferId = getExistingOfferId(usdcOffers.records, usdcAsset, nativeAsset);
    console.log(`Setting offer: Sell 10,000 USDC for XLM at price ${usdcSellPrice}...`);
    const tx1 = await manageOffer(
      usdcDistKeypair,
      usdcAsset,
      nativeAsset,
      "10000.0000000",
      usdcSellPrice,
      usdcSellOfferId
    );
    console.log(`Sell USDC Offer Transaction Hash: ${tx1}`);

    // 2. Sell XLM for USDC (Buy USDC)
    // Selling: XLM, Buying: USDC. Price represents amount of USDC received per XLM.
    // Bid Price: 5 * (1 + spread / 2) = 5 * 1.01 = 5.05
    const usdcBuyPrice = (MARKET_CONFIG.USDC_PER_XLM * (1 + spread / 2)).toFixed(7);
    const usdcBuyOfferId = getExistingOfferId(usdcOffers.records, nativeAsset, usdcAsset);
    console.log(`Setting offer: Sell 2,000 XLM for USDC at price ${usdcBuyPrice}...`);
    const tx2 = await manageOffer(
      usdcDistKeypair,
      nativeAsset,
      usdcAsset,
      "2000.0000000",
      usdcBuyPrice,
      usdcBuyOfferId
    );
    console.log(`Buy USDC Offer Transaction Hash: ${tx2}`);

    // --- AQUA PAIR ---
    // 1. Sell AQUA for XLM
    // Selling: AQUA, Buying: XLM. Price represents amount of XLM received per AQUA.
    // Ask Price: (1 / 100) * (1 + spread / 2) = 0.01 * 1.01 = 0.0101
    const aquaSellPrice = ((1 / MARKET_CONFIG.AQUA_PER_XLM) * (1 + spread / 2)).toFixed(7);
    const aquaSellOfferId = getExistingOfferId(aquaOffers.records, aquaAsset, nativeAsset);
    console.log(`Setting offer: Sell 10,000 AQUA for XLM at price ${aquaSellPrice}...`);
    const tx3 = await manageOffer(
      aquaDistKeypair,
      aquaAsset,
      nativeAsset,
      "10000.0000000",
      aquaSellPrice,
      aquaSellOfferId
    );
    console.log(`Sell AQUA Offer Transaction Hash: ${tx3}`);

    // 2. Sell XLM for AQUA
    // Selling: XLM, Buying: AQUA. Price represents amount of AQUA received per XLM.
    // Bid Price: 100 * (1 + spread / 2) = 100 * 1.01 = 101
    const aquaBuyPrice = (MARKET_CONFIG.AQUA_PER_XLM * (1 + spread / 2)).toFixed(7);
    const aquaBuyOfferId = getExistingOfferId(aquaOffers.records, nativeAsset, aquaAsset);
    console.log(`Setting offer: Sell 100 XLM for AQUA at price ${aquaBuyPrice}...`);
    const tx4 = await manageOffer(
      aquaDistKeypair,
      nativeAsset,
      aquaAsset,
      "100.0000000",
      aquaBuyPrice,
      aquaBuyOfferId
    );
    console.log(`Buy AQUA Offer Transaction Hash: ${tx4}`);

    console.log(
      "Liquidity offers created/updated successfully on the native Stellar DEX orderbook."
    );
  } catch (err) {
    console.error("Failed to manage liquidity offers:", err);
    if (err.response?.data?.extras) {
      console.error("Transaction Extras:", JSON.stringify(err.response.data.extras, null, 2));
    }
  }
};

// If run directly
const [, , command] = process.argv;
if (command === "run" || import.meta.url === `file://${process.argv[1]}`) {
  createLiquidity();
}
