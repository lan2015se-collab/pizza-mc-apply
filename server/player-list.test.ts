import { describe, it, expect } from "vitest";
import { z } from "zod";

// 測試玩家名單查詢 schema
const playerListSchema = z.object({
  totalPlayers: z.number().min(0),
  players: z.array(
    z.object({
      id: z.number(),
      gamertag: z.string(),
      joinedAt: z.date().or(z.string()),
      reason: z.string(),
    })
  ),
});

// 測試玩家搜尋 schema
const playerSearchSchema = z.object({
  success: z.boolean(),
  data: z.array(
    z.object({
      id: z.number(),
      gamertag: z.string(),
      joinedAt: z.date().or(z.string()),
      reason: z.string(),
    })
  ),
});

describe("Player List Features", () => {
  it("should validate player list response structure", () => {
    const playerList = {
      totalPlayers: 5,
      players: [
        {
          id: 1,
          gamertag: "Player1",
          joinedAt: new Date(),
          reason: "Love the community",
        },
        {
          id: 2,
          gamertag: "Player2",
          joinedAt: new Date(),
          reason: "Want to build together",
        },
      ],
    };

    const result = playerListSchema.safeParse(playerList);
    expect(result.success).toBe(true);
  });

  it("should validate empty player list", () => {
    const emptyList = {
      totalPlayers: 0,
      players: [],
    };

    const result = playerListSchema.safeParse(emptyList);
    expect(result.success).toBe(true);
  });

  it("should validate player search response", () => {
    const searchResult = {
      success: true,
      data: [
        {
          id: 1,
          gamertag: "TestPlayer",
          joinedAt: new Date(),
          reason: "Test reason",
        },
      ],
    };

    const result = playerSearchSchema.safeParse(searchResult);
    expect(result.success).toBe(true);
  });

  it("should filter players by gamertag correctly", () => {
    const players = [
      { id: 1, gamertag: "Player1", joinedAt: new Date(), reason: "Reason 1" },
      { id: 2, gamertag: "Player2", joinedAt: new Date(), reason: "Reason 2" },
      { id: 3, gamertag: "TestPlayer", joinedAt: new Date(), reason: "Reason 3" },
    ];

    const query = "test";
    const filtered = players.filter((p) =>
      p.gamertag.toLowerCase().includes(query.toLowerCase())
    );

    expect(filtered).toHaveLength(1);
    expect(filtered[0].gamertag).toBe("TestPlayer");
  });

  it("should sort players by join date (newest first)", () => {
    const date1 = new Date("2026-06-01");
    const date2 = new Date("2026-06-02");
    const date3 = new Date("2026-06-03");

    const players = [
      { id: 1, gamertag: "Player1", joinedAt: date1, reason: "Reason 1" },
      { id: 2, gamertag: "Player2", joinedAt: date3, reason: "Reason 2" },
      { id: 3, gamertag: "Player3", joinedAt: date2, reason: "Reason 3" },
    ];

    const sorted = [...players].sort((a, b) =>
      new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
    );

    expect(sorted[0].gamertag).toBe("Player2");
    expect(sorted[1].gamertag).toBe("Player3");
    expect(sorted[2].gamertag).toBe("Player1");
  });

  it("should handle special characters in gamertag search", () => {
    const players = [
      { id: 1, gamertag: "Player_123", joinedAt: new Date(), reason: "Reason 1" },
      { id: 2, gamertag: "Player-456", joinedAt: new Date(), reason: "Reason 2" },
      { id: 3, gamertag: "Player.789", joinedAt: new Date(), reason: "Reason 3" },
    ];

    const query = "_";
    const filtered = players.filter((p) =>
      p.gamertag.toLowerCase().includes(query.toLowerCase())
    );

    expect(filtered).toHaveLength(1);
    expect(filtered[0].gamertag).toBe("Player_123");
  });

  it("should calculate total players correctly", () => {
    const players = [
      { id: 1, gamertag: "Player1", joinedAt: new Date(), reason: "Reason 1" },
      { id: 2, gamertag: "Player2", joinedAt: new Date(), reason: "Reason 2" },
      { id: 3, gamertag: "Player3", joinedAt: new Date(), reason: "Reason 3" },
    ];

    const totalPlayers = players.length;
    expect(totalPlayers).toBe(3);
  });
});
