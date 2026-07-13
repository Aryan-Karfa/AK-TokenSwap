import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { logger } from "../utils/logger";

describe("Logger Utility", () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should invokeconsole.error during exceptions logging", () => {
    logger.error("Test error logging");
    expect(errorSpy).toHaveBeenCalled();
  });
});
