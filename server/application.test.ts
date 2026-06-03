import { describe, it, expect } from "vitest";
import { z } from "zod";

// 測試申請表單驗證 schema
const applicationSchema = z.object({
  gamertag: z.string().min(1, "Gamertag is required"),
  xboxAccountId: z.string().min(1, "Xbox Account ID is required"),
  reason: z.string().min(1, "Reason is required"),
  aerternosUsername: z.string().optional(),
});

describe("Application Form Validation", () => {
  it("should validate a complete application", () => {
    const validApp = {
      gamertag: "TestPlayer",
      xboxAccountId: "123456789",
      reason: "I want to join this amazing server",
      aerternosUsername: "testuser",
    };

    const result = applicationSchema.safeParse(validApp);
    expect(result.success).toBe(true);
  });

  it("should validate an application without Aternos username", () => {
    const validApp = {
      gamertag: "TestPlayer",
      xboxAccountId: "123456789",
      reason: "I want to join this amazing server",
    };

    const result = applicationSchema.safeParse(validApp);
    expect(result.success).toBe(true);
  });

  it("should reject application without gamertag", () => {
    const invalidApp = {
      xboxAccountId: "123456789",
      reason: "I want to join",
    };

    const result = applicationSchema.safeParse(invalidApp);
    expect(result.success).toBe(false);
  });

  it("should reject application without reason", () => {
    const invalidApp = {
      gamertag: "TestPlayer",
      xboxAccountId: "123456789",
      reason: "",
    };

    const result = applicationSchema.safeParse(invalidApp);
    expect(result.success).toBe(false);
  });

  it("should reject application with empty gamertag", () => {
    const invalidApp = {
      gamertag: "",
      xboxAccountId: "123456789",
      reason: "I want to join",
    };

    const result = applicationSchema.safeParse(invalidApp);
    expect(result.success).toBe(false);
  });
});
