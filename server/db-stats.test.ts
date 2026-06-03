import { describe, it, expect } from "vitest";

describe("Database Statistics", () => {
  it("should have getApplicationStats function available", async () => {
    const { getApplicationStats } = await import("./db-stats");
    expect(typeof getApplicationStats).toBe("function");
  });

  it("should have getApplicationsByStatus function available", async () => {
    const { getApplicationsByStatus } = await import("./db-stats");
    expect(typeof getApplicationsByStatus).toBe("function");
  });

  it("should have getRecentApplicationStats function available", async () => {
    const { getRecentApplicationStats } = await import("./db-stats");
    expect(typeof getRecentApplicationStats).toBe("function");
  });

  it("should export all required functions", async () => {
    const module = await import("./db-stats");
    expect(module.getApplicationStats).toBeDefined();
    expect(module.getApplicationsByStatus).toBeDefined();
    expect(module.getRecentApplicationStats).toBeDefined();
  });

  it("should have ApplicationStats interface", async () => {
    // 檢查模組是否可以正確導入
    const module = await import("./db-stats");
    expect(module).toBeDefined();
  });
});
