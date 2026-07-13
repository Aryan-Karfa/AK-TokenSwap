import { describe, it, expect, vi } from "vitest";
import { getQuote } from "../services/swap";

vi.mock("@stellar/stellar-sdk", () => {
  class MockAsset {
    code: string;
    issuer?: string;
    constructor(code: string, issuer?: string) {
      this.code = code;
      this.issuer = issuer;
    }
    static native() {
      return { code: "XLM", isNative: true };
    }
  }

  class MockServer {
    strictSendPaths() {
      return {
        call: vi.fn().mockResolvedValue({
          records: [
            {
              destination_amount: "85.1234500",
              path: [{ asset_type: "native" }],
            },
          ],
        }),
      };
    }
  }

  return {
    Asset: MockAsset,
    Horizon: {
      Server: MockServer,
    },
    TransactionBuilder: vi.fn(),
    Operation: vi.fn(),
    TimeoutInfinite: 999999,
  };
});

describe("Swap Ledger Operations Wrapper", () => {
  it("should parse strictSendPaths responses and select the best quote destination amount", async () => {
    const fromToken = { code: "XLM" };
    const toToken = { code: "USDC", issuer: "GBBD47..." };
    const res = await getQuote(fromToken, toToken, "100");

    expect(res.destinationAmount).toBe("85.1234500");
  });
});
