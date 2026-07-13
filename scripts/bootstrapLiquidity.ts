import { Keypair, Horizon, Asset } from "@stellar/stellar-sdk";
import fs from "fs";
import path from "path";
import { createLiquidity } from "./createLiquidity.js";

const HORIZON_URL = "https://horizon-testnet.stellar.org";
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

const bootstrapLiquidity = async () => {
  console.log("=== Bootstrapping Stellar DEX Liquidity & Orderbook ===");

  const usdcSecret = env.USDC_DISTRIBUTION_SECRET;
  const aquaSecret = env.AQUA_DISTRIBUTION_SECRET;
  const usdcIssuer = env.VITE_USDC_ISSUER;
  const aquaIssuer = env.VITE_AQUA_ISSUER;

  if (!usdcSecret || !aquaSecret || !usdcIssuer || !aquaIssuer) {
    console.error("Missing required variables in .env file. Run setup first.");
    process.exit(1);
  }

  const usdcDistKeypair = Keypair.fromSecret(usdcSecret);
  const aquaDistKeypair = Keypair.fromSecret(aquaSecret);

  const nativeAsset = Asset.native();
  const usdcAsset = new Asset("USDC", usdcIssuer);
  const aquaAsset = new Asset("AQUA", aquaIssuer);

  try {
    // 1. Verify Issuer Accounts
    console.log("Verifying USDC Issuer account...");
    await server.loadAccount(usdcIssuer);
    console.log("Verifying AQUA Issuer account...");
    await server.loadAccount(aquaIssuer);

    // 2. Verify Distributor Accounts & Balances
    console.log("Verifying USDC Distributor account...");
    const usdcDistAccount = await server.loadAccount(usdcDistKeypair.publicKey());
    const usdcBal = usdcDistAccount.balances.find(
      (b: any) => b.asset_code === "USDC" && b.asset_issuer === usdcIssuer
    );
    console.log(`USDC Distributor Asset Balance: ${usdcBal ? usdcBal.balance : "None"}`);

    console.log("Verifying AQUA Distributor account...");
    const aquaDistAccount = await server.loadAccount(aquaDistKeypair.publicKey());
    const aquaBal = aquaDistAccount.balances.find(
      (b: any) => b.asset_code === "AQUA" && b.asset_issuer === aquaIssuer
    );
    console.log(`AQUA Distributor Asset Balance: ${aquaBal ? aquaBal.balance : "None"}`);

    // 3. Create Market Offers
    console.log("Establishing liquidity offers on the DEX...");
    await createLiquidity();

    // Wait a couple seconds for ledger synchronization
    console.log("Waiting for offer ingestion...");
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // 4. Verify Active Offers
    console.log("Fetching active offers for USDC distributor...");
    const usdcOffers = await server.offers().forAccount(usdcDistKeypair.publicKey()).call();
    console.log(`USDC Distributor Active Offers (${usdcOffers.records.length}):`);
    usdcOffers.records.forEach((o) => {
      console.log(
        ` - Offer ID: ${o.id}, Selling: ${o.selling.asset_code || "XLM"}, Buying: ${o.buying.asset_code || "XLM"}, Amount: ${o.amount}, Price: ${o.price}`
      );
    });

    console.log("Fetching active offers for AQUA distributor...");
    const aquaOffers = await server.offers().forAccount(aquaDistKeypair.publicKey()).call();
    console.log(`AQUA Distributor Active Offers (${aquaOffers.records.length}):`);
    aquaOffers.records.forEach((o) => {
      console.log(
        ` - Offer ID: ${o.id}, Selling: ${o.selling.asset_code || "XLM"}, Buying: ${o.buying.asset_code || "XLM"}, Amount: ${o.amount}, Price: ${o.price}`
      );
    });

    // 5. Verify Orderbook is not empty
    console.log("Verifying USDC/XLM orderbook...");
    const usdcBook = await server.orderbook(nativeAsset, usdcAsset).call();
    if (usdcBook.bids.length === 0 || usdcBook.asks.length === 0) {
      throw new Error("Orderbook is empty! Buy or sell offers are missing for USDC.");
    }
    console.log(
      `Orderbook verified. Best Bid: ${usdcBook.bids[0].price}, Best Ask: ${usdcBook.asks[0].price}`
    );

    // 6. Verify Quote Path Finding
    console.log("Verifying strictSendPaths routing from XLM to USDC...");
    const pathResponse = await server
      .strictSendPaths(nativeAsset, "10.0000000", [usdcAsset])
      .call();
    if (pathResponse.records.length === 0) {
      throw new Error("Path payments discovery failed! strictSendPaths returned 0 records.");
    }
    console.log(
      `Swap path found. Best route yields: ${pathResponse.records[0].destination_amount} USDC`
    );

    console.log("=== Liquidity Bootstrapping Successful ===");
  } catch (err: unknown) {
    const errorObj = err as { message?: string };
    console.error("Bootstrapping validation failed:", errorObj.message || err);
    process.exit(1);
  }
};

bootstrapLiquidity();
