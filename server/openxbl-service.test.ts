import { describe, it, expect, vi } from "vitest";
import { verifyXboxGamertag, getXboxPlayerByXuid } from "./openxbl-service";

global.fetch = vi.fn();

describe("OpenXBL Service", () => {
  it("should verify Xbox gamertag successfully", async () => {
    const mockPlayer = {
      xuid: "2533274843156789",
      gamertag: "TestPlayer",
      gamerscore: 5000,
      accountTier: "Gold",
      profilePicture: "https://example.com/pic.jpg",
      tenure: 10,
      isVerified: true,
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Map(),
      json: async () => [mockPlayer],
      text: async () => JSON.stringify([mockPlayer]),
    });

    const result = await verifyXboxGamertag("TestPlayer");
    expect(result).toEqual(mockPlayer);
  });

  it("should return null for non-existent gamertag", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
      headers: new Map(),
      text: async () => "Not Found",
    });

    const result = await verifyXboxGamertag("NonExistent");
    expect(result).toBeNull();
  });

  it("should get player by XUID successfully", async () => {
    const mockPlayer = {
      xuid: "2533274843156789",
      gamertag: "TestPlayer",
      gamerscore: 5000,
      accountTier: "Gold",
      profilePicture: "https://example.com/pic.jpg",
      tenure: 10,
      isVerified: true,
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Map(),
      json: async () => mockPlayer,
      text: async () => JSON.stringify(mockPlayer),
    });

    const result = await getXboxPlayerByXuid("2533274843156789");
    expect(result).toEqual(mockPlayer);
  });
});
