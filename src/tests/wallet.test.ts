import { describe, it, expect, vi } from "vitest";
import { connectWallet, getConnectedAccount } from "../services/wallet";

vi.mock("@stellar/freighter-api", () => {
  return {
    isConnected: vi.fn().mockResolvedValue({ isConnected: true }),
    requestAccess: vi.fn().mockResolvedValue({ address: "GBBD47..." }),
    getAddress: vi.fn().mockResolvedValue({ address: "GBBD47..." }),
  };
});

describe("Wallet Connections Service Wrapper", () => {
  it("should fetch address during connection flows", async () => {
    const res = await connectWallet();
    expect(res).toBe("GBBD47...");
  });

  it("should fetch active public key silently", async () => {
    const res = await getConnectedAccount();
    expect(res).toBe("GBBD47...");
  });
});
