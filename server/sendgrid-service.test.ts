import { describe, it, expect } from "vitest";

describe("SendGrid Email Service", () => {
  it("should have sendEmail function available", async () => {
    // 簡單測試確認模組可以載入
    const { sendEmail } = await import("./sendgrid-service");
    expect(typeof sendEmail).toBe("function");
  });

  it("should have sendApprovalEmail function available", async () => {
    const { sendApprovalEmail } = await import("./sendgrid-service");
    expect(typeof sendApprovalEmail).toBe("function");
  });

  it("should have sendRejectionEmail function available", async () => {
    const { sendRejectionEmail } = await import("./sendgrid-service");
    expect(typeof sendRejectionEmail).toBe("function");
  });

  it("should export all required functions", async () => {
    const module = await import("./sendgrid-service");
    expect(module.sendEmail).toBeDefined();
    expect(module.sendApprovalEmail).toBeDefined();
    expect(module.sendRejectionEmail).toBeDefined();
  });
});
