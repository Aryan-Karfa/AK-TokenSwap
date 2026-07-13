import { describe, it, expect } from "vitest";
import { validateEnvironment, APP_CONFIG } from "../config/app";

describe("Environment Validations", () => {
  it("should validate default settings without throwing", () => {
    expect(() => validateEnvironment()).not.toThrow();
  });

  it("should fail validation if the network is set to MAINNET", () => {
    const originalValue = APP_CONFIG.STELLAR_NETWORK;
    APP_CONFIG.STELLAR_NETWORK = "MAINNET";
    expect(() => validateEnvironment()).toThrow(/TESTNET/);
    APP_CONFIG.STELLAR_NETWORK = originalValue;
  });

  it("should fail validation if Horizon URL is not a valid URL structure", () => {
    const originalValue = APP_CONFIG.HORIZON_URL;
    APP_CONFIG.HORIZON_URL = "malformed-link";
    expect(() => validateEnvironment()).toThrow(/HORIZON_URL/);
    APP_CONFIG.HORIZON_URL = originalValue;
  });
});
