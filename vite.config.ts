import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { Keypair, Horizon, Asset, TransactionBuilder, Operation, TimeoutInfinite } from "@stellar/stellar-sdk";
import type { ViteDevServer, Connect } from "vite";
import type { ServerResponse } from "http";
import fs from "fs";
import path from "path";

// Parse .env file manually inside Vite node context
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
  console.error("Failed to parse local .env file:", err);
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "faucet-api-plugin",
      configureServer(server: ViteDevServer) {
        server.middlewares.use("/api/fund", (req: Connect.IncomingMessage, res: ServerResponse) => {
          if (req.method !== "POST") {
            res.statusCode = 405;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Method Not Allowed" }));
            return;
          }

          let body = "";
          req.on("data", (chunk: Buffer) => {
            body += chunk.toString();
          });

          req.on("end", async () => {
            try {
              const { address, asset } = JSON.parse(body);
              if (!address || !asset) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Missing address or asset" }));
                return;
              }

              const horizonUrl = "https://horizon-testnet.stellar.org";
              const passphrase = "Test SDF Network ; September 2015";
              const horizon = new Horizon.Server(horizonUrl);

              let distributorSecret = "";
              let issuerAddress = "";

              if (asset === "USDC") {
                distributorSecret = env.USDC_DISTRIBUTION_SECRET || "";
                issuerAddress = env.VITE_USDC_ISSUER || "";
              } else if (asset === "AQUA") {
                distributorSecret = env.AQUA_DISTRIBUTION_SECRET || "";
                issuerAddress = env.VITE_AQUA_ISSUER || "";
              } else {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Unsupported asset. Faucet only supports USDC or AQUA." }));
                return;
              }

              if (!distributorSecret) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: `Faucet secret for ${asset} is not configured on the local dev server.` }));
                return;
              }

              const distributorKeypair = Keypair.fromSecret(distributorSecret);
              const token = new Asset(asset, issuerAddress);

              // Load distributor account state
              const distAccount = await horizon.loadAccount(distributorKeypair.publicKey());
              const tx = new TransactionBuilder(distAccount, {
                fee: "100",
                networkPassphrase: passphrase,
              })
                .addOperation(
                  Operation.payment({
                    destination: address,
                    asset: token,
                    amount: "100.0000000",
                  })
                )
                .setTimeout(TimeoutInfinite)
                .build();

              tx.sign(distributorKeypair);
              const result = await horizon.submitTransaction(tx);

              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ hash: result.hash }));
            } catch (err: unknown) {
              const errorObj = err as { message?: string };
              console.error("Local faucet error:", err);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: errorObj.message || "Failed to submit local faucet payment transaction." }));
            }
          });
        });
      },
    },
  ],
});
