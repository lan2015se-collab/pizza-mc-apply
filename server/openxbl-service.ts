import { ENV } from "./_core/env";

export interface XboxPlayer {
  xuid: string;
  gamertag: string;
  gamerscore: number;
  accountTier: string;
  profilePicture: string;
  realName?: string;
  bio?: string;
  location?: string;
  tenure: number;
  isVerified: boolean;
}

/**
 * 驗證 Xbox Gamertag 並獲取玩家資訊
 */
export async function verifyXboxGamertag(
  gamertag: string
): Promise<XboxPlayer | null> {
  if (!ENV.openxblApiKey) {
    throw new Error("OPENXBL_API_KEY is not configured");
  }

  try {
    const encodedGamertag = encodeURIComponent(gamertag);
    const response = await fetch(
      `https://xbl.io/api/v2/search/${encodedGamertag}`,
      {
        headers: {
          "X-Authorization": ENV.openxblApiKey,
          "Accept": "application/json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Gamertag not found
      }
      throw new Error(`OpenXBL API error: ${response.statusText}`);
    }

    const data = await response.json();

    // OpenXBL 搜尋端點返回玩家陣列，取第一個結果
    if (Array.isArray(data) && data.length > 0) {
      return data[0] as XboxPlayer;
    }

    return null;
  } catch (error) {
    console.error("[OpenXBL] Error verifying gamertag:", error);
    throw error;
  }
}

/**
 * 通過 XUID 獲取玩家詳細資訊
 */
export async function getXboxPlayerByXuid(xuid: string): Promise<XboxPlayer | null> {
  if (!ENV.openxblApiKey) {
    throw new Error("OPENXBL_API_KEY is not configured");
  }

  try {
    const response = await fetch(`https://xbl.io/api/v2/account/${xuid}`, {
      headers: {
        "X-Authorization": ENV.openxblApiKey,
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`OpenXBL API error: ${response.statusText}`);
    }

    return (await response.json()) as XboxPlayer;
  } catch (error) {
    console.error("[OpenXBL] Error fetching player by XUID:", error);
    throw error;
  }
}
