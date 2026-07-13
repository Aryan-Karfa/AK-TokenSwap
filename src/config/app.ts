const getEnv = (key: string, defaultValue: string): string => {
  const value = import.meta.env[key];
  return value !== undefined && value !== "" ? value : defaultValue;
};

import { Networks } from "@stellar/stellar-sdk";

const stellarNetwork = getEnv("VITE_STELLAR_NETWORK", "TESTNET");

export const APP_CONFIG = {
  STELLAR_NETWORK: stellarNetwork,
  HORIZON_URL: getEnv("VITE_HORIZON_URL", "https://horizon-testnet.stellar.org"),
  RPC_URL: getEnv("VITE_RPC_URL", "https://soroban-testnet.stellar.org"),
  NETWORK_PASSPHRASE: stellarNetwork === "PUBLIC" ? Networks.PUBLIC : Networks.TESTNET,
  VERSION: "1.0.0",
};

const validatePublicKey = (key: string, name: string): void => {
  if (!key || key.length !== 56 || !key.startsWith("G")) {
    throw new Error(
      `StellarSwap configuration error: ${name} is missing or is not a valid Stellar public key (must be 56 characters starting with 'G').`
    );
  }
};

// Validate required environment settings during startup
export const validateEnvironment = (): void => {
  if (APP_CONFIG.STELLAR_NETWORK !== "TESTNET") {
    throw new Error(
      `StellarSwap configuration error: VITE_STELLAR_NETWORK is set to "${APP_CONFIG.STELLAR_NETWORK}". Only "TESTNET" is supported.`
    );
  }

  try {
    new URL(APP_CONFIG.HORIZON_URL);
  } catch {
    throw new Error(
      `StellarSwap configuration error: VITE_HORIZON_URL ("${APP_CONFIG.HORIZON_URL}") is not a valid URL.`
    );
  }

  try {
    new URL(APP_CONFIG.RPC_URL);
  } catch {
    throw new Error(
      `StellarSwap configuration error: VITE_RPC_URL ("${APP_CONFIG.RPC_URL}") is not a valid URL.`
    );
  }

  // Validate issuer addresses are present
  const usdcIssuer = import.meta.env.VITE_USDC_ISSUER;
  const aquaIssuer = import.meta.env.VITE_AQUA_ISSUER;

  validatePublicKey(usdcIssuer || "", "VITE_USDC_ISSUER");
  validatePublicKey(aquaIssuer || "", "VITE_AQUA_ISSUER");
};
