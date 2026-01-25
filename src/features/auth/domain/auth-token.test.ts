import { describe, it, expect } from "vitest";
import { AuthToken } from "./auth-token";

describe("AuthToken", () => {
  it("should create token with valid value", () => {
    const token = new AuthToken("valid-token");
    expect(token.getValue()).toBe("valid-token");
  });

  it("should throw error when value is empty", () => {
    expect(() => new AuthToken("")).toThrow("Token is required");
  });
});
