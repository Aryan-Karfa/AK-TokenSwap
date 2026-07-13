import type { SupportedToken } from "../types/token";

const usdcIssuer = import.meta.env.VITE_USDC_ISSUER;
const aquaIssuer = import.meta.env.VITE_AQUA_ISSUER;

export const TOKENS: SupportedToken[] = [
  {
    code: "XLM",
    name: "Stellar Lumens",
    symbol: "XLM",
    decimals: 7,
    color: "#3b82f6", // Blue/Lumens accent
    isNative: true,
  },
  {
    code: "USDC",
    issuer: usdcIssuer,
    name: "USD Coin",
    symbol: "USDC",
    decimals: 7,
    color: "#2775ca", // USDC Blue
    isNative: false,
  },
  {
    code: "AQUA",
    issuer: aquaIssuer,
    name: "AQUA",
    symbol: "AQUA",
    decimals: 7,
    color: "#00e6c3", // AQUA Teal
    isNative: false,
  },
];
