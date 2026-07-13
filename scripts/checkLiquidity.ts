import { Horizon, Keypair } from "@stellar/stellar-sdk";
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

const checkLiquidity = async () => {
  const usdcSecret = env.USDC_DISTRIBUTION_SECRET;
  const aquaSecret = env.AQUA_DISTRIBUTION_SECRET;
  const usdcIssuer = env.VITE_USDC_ISSUER;
  const aquaIssuer = env.VITE_AQUA_ISSUER;

  if (!usdcSecret || !aquaSecret || !usdcIssuer || !aquaIssuer) {
    console.error("Distributor configuration variables are missing in .env.");
    process.exit(1);
  }

  const usdcDist = Keypair.fromSecret(usdcSecret).publicKey();
  const aquaDist = Keypair.fromSecret(aquaSecret).publicKey();

  const printAccountLiquidity = async (publicKey: string, name: string) => {
    console.log(`\n=== Liquidity Status: ${name} (${publicKey}) ===`);
    try {
      const account = await server.loadAccount(publicKey);
      console.log("Balances:");
      account.balances.forEach((b: any) => {
        console.log(` - ${b.asset_code || "XLM"}: ${b.balance} (Type: ${b.asset_type})`);
      });

      console.log("Active Offers:");
      const offers = await server.offers().forAccount(publicKey).call();
      if (offers.records.length === 0) {
        console.log(" - No active offers found.");
      } else {
        offers.records.forEach((o) => {
          console.log(
            ` - Offer ID: ${o.id}, Selling: ${o.selling.asset_code || "XLM"}, Buying: ${o.buying.asset_code || "XLM"}, Amount: ${o.amount}, Price: ${o.price}`
          );
        });
      }
    } catch (err) {
      console.error(`Failed to load account ${name}:`, err);
    }
  };

  await printAccountLiquidity(usdcDist, "USDC Distributor");
  await printAccountLiquidity(aquaDist, "AQUA Distributor");
};

checkLiquidity();
