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

const checkPaths = async () => {
  const usdcIssuer = env.VITE_USDC_ISSUER;
  const aquaIssuer = env.VITE_AQUA_ISSUER;

  if (!usdcIssuer || !aquaIssuer) {
    console.error("Issuer public keys are missing in .env.");
    process.exit(1);
  }

  const nativeAsset = Asset.native();
  const usdcAsset = new Asset("USDC", usdcIssuer);
  const aquaAsset = new Asset("AQUA", aquaIssuer);

  const testPathFinding = async (
    source: Asset,
    amount: string,
    destination: Asset,
    pathLabel: string
  ) => {
    console.log(`\n=== Finding Swap Paths: ${pathLabel} (Amount: ${amount}) ===`);
    try {
      const result = await server.strictSendPaths(source, amount, [destination]).call();
      if (result.records.length === 0) {
        console.warn(`No swap path found for ${pathLabel}.`);
        return;
      }
      console.log(`Optimal Path found. Total destination options: ${result.records.length}`);
      result.records.forEach((record, index) => {
        const pathString = record.path.map((p: any) => p.asset_code || "XLM").join(" -> ");
        console.log(
          ` [Route #${index + 1}] Target Amount: ${record.destination_amount}, Path: ${source.code || "XLM"} -> ${pathString ? pathString + " -> " : ""}${destination.code || "XLM"}`
        );
      });
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      console.error(`Failed to find path for ${pathLabel}:`, errorObj.message || err);
    }
  };

  await testPathFinding(nativeAsset, "10.0000000", usdcAsset, "XLM to USDC");
  await testPathFinding(nativeAsset, "100.0000000", aquaAsset, "XLM to AQUA");
  await testPathFinding(usdcAsset, "100.0000000", aquaAsset, "USDC to AQUA");
  await testPathFinding(aquaAsset, "100.0000000", usdcAsset, "AQUA to USDC");
};

checkPaths();
