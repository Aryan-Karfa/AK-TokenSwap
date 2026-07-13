import { Horizon, Asset } from "@stellar/stellar-sdk";
import fs from "fs";
import path from "path";

const HORIZON_URL = "https://horizon-testnet.stellar.org";
const server = new Horizon.Server(HORIZON_URL);

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

const checkOrderbook = async () => {
  const usdcIssuer = env.VITE_USDC_ISSUER;
  const aquaIssuer = env.VITE_AQUA_ISSUER;

  if (!usdcIssuer || !aquaIssuer) {
    console.error("Issuer variables are missing in .env.");
    process.exit(1);
  }

  const nativeAsset = Asset.native();
  const usdcAsset = new Asset("USDC", usdcIssuer);
  const aquaAsset = new Asset("AQUA", aquaIssuer);

  const printBookSummary = async (base: Asset, counter: Asset, pairName: string) => {
    console.log(`\n=== Orderbook Summary: ${pairName} ===`);
    try {
      const book = await server.orderbook(base, counter).call();
      console.log(`Bids count: ${book.bids.length}, Asks count: ${book.asks.length}`);

      if (book.bids.length > 0) {
        console.log(`Best Bid: ${book.bids[0].price} (Amount: ${book.bids[0].amount})`);
      } else {
        console.log("Best Bid: None");
      }

      if (book.asks.length > 0) {
        console.log(`Best Ask: ${book.asks[0].price} (Amount: ${book.asks[0].amount})`);
      } else {
        console.log("Best Ask: None");
      }

      if (book.bids.length > 0 && book.asks.length > 0) {
        const spread = parseFloat(book.asks[0].price) - parseFloat(book.bids[0].price);
        console.log(`Bid/Ask Spread: ${spread.toFixed(6)}`);
      }
    } catch (err) {
      console.error(`Failed to load orderbook for ${pairName}:`, err);
    }
  };

  await printBookSummary(nativeAsset, usdcAsset, "USDC / XLM");
  await printBookSummary(nativeAsset, aquaAsset, "AQUA / XLM");
};

checkOrderbook();
