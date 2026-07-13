import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Keypair, Horizon, Asset, TransactionBuilder, Operation, TimeoutInfinite } from "@stellar/stellar-sdk";

const HORIZON_URL = "https://horizon-testnet.stellar.org";
const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { address, asset } = req.body;
  if (!address || !asset) {
    return res.status(400).json({ error: "Missing required parameters: address or asset" });
  }

  try {
    const server = new Horizon.Server(HORIZON_URL);
    let distributorSecret = "";
    let issuerAddress = "";

    if (asset === "USDC") {
      distributorSecret = process.env.USDC_DISTRIBUTION_SECRET || "";
      issuerAddress = process.env.VITE_USDC_ISSUER || "";
    } else if (asset === "AQUA") {
      distributorSecret = process.env.AQUA_DISTRIBUTION_SECRET || "";
      issuerAddress = process.env.VITE_AQUA_ISSUER || "";
    } else {
      return res.status(400).json({ error: "Unsupported asset code. Faucet only supports USDC or AQUA." });
    }

    if (!distributorSecret) {
      return res.status(500).json({ error: `Faucet secret for ${asset} is not configured on the backend.` });
    }
    if (!issuerAddress) {
      return res.status(500).json({ error: `Issuer public key for ${asset} is not configured.` });
    }

    const distributorKeypair = Keypair.fromSecret(distributorSecret);
    const token = new Asset(asset, issuerAddress);

    // Load distributor account state
    const distAccount = await server.loadAccount(distributorKeypair.publicKey());
    const tx = new TransactionBuilder(distAccount, {
      fee: "100",
      networkPassphrase: NETWORK_PASSPHRASE,
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
    const result = await server.submitTransaction(tx);

    return res.status(200).json({ hash: result.hash });
  } catch (err: unknown) {
    const errorObj = err as { message?: string };
    console.error("Faucet distribution failed:", err);
    return res.status(500).json({ error: errorObj.message || "Failed to submit faucet transaction." });
  }
}
