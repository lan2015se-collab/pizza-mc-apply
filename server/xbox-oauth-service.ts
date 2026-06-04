import { authenticate } from "@xboxreplay/xboxlive-auth";

export interface XboxAuthResult {
  xuid: string;
  gamertag: string;
  xstsToken: string;
  userHash: string;
  expiresOn: string;
}

export interface XboxPlayer {
  xuid: string;
  gamertag: string;
  gamerscore?: number;
  accountTier?: string;
  profilePicture?: string;
  realName?: string;
  bio?: string;
  location?: string;
  tenure?: number;
  isVerified?: boolean;
}

/**
 * 使用 Microsoft 帳戶進行 Xbox Live 認證
 * @param email Microsoft 帳戶郵箱
 * @param password Microsoft 帳戶密碼
 * @returns Xbox 認證結果
 */
export async function authenticateWithXboxLive(
  email: `${string}@${string}.${string}`,
  password: string
): Promise<XboxAuthResult> {
  try {
    console.log(`[Xbox OAuth] Authenticating user: ${email}`);

    const result = await authenticate(email, password, {
      XSTSRelyingParty: "http://xboxlive.com",
    });

    console.log(`[Xbox OAuth] Authentication successful for XUID: ${result.xuid}`);

    // Extract gamertag from display_claims
    const displayClaims = result.display_claims as Record<string, unknown>;
    const gamertag = (displayClaims?.gtg as string) || "";

    return {
      xuid: result.xuid || "",
      gamertag,
      xstsToken: result.xsts_token,
      userHash: result.user_hash,
      expiresOn: result.expires_on,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[Xbox OAuth] Authentication failed:", errorMessage);
    
    // 提供更詳細的錯誤信息
    if (errorMessage.includes("401") || errorMessage.includes("Unauthorized")) {
      throw new Error("Microsoft 帳戶或密碼錯誤，請檢查您的憑證");
    } else if (errorMessage.includes("403") || errorMessage.includes("Forbidden")) {
      throw new Error("帳戶沒有 Xbox 配置文件或帳戶被限制");
    } else if (errorMessage.includes("2FA") || errorMessage.includes("two-factor")) {
      throw new Error("帳戶啟用了雙因素認證，請先禁用或使用應用密碼");
    }
    
    throw new Error(`Xbox Live authentication failed: ${errorMessage}`);
  }
}

/**
 * 驗證 XSTS Token 是否有效
 * @param xstsToken XSTS Token
 * @param expiresOn Token 過期時間
 * @returns Token 是否有效
 */
export function isTokenValid(expiresOn: string): boolean {
  try {
    const expirationDate = new Date(expiresOn);
    const now = new Date();
    return now < expirationDate;
  } catch (error) {
    console.error("[Xbox OAuth] Error checking token validity:", error);
    return false;
  }
}

/**
 * 從 XSTS Token 中提取玩家資訊
 * @param authResult Xbox 認證結果
 * @returns 玩家資訊
 */
export function extractPlayerInfo(authResult: XboxAuthResult): XboxPlayer {
  return {
    xuid: authResult.xuid,
    gamertag: authResult.gamertag,
    accountTier: "Unknown",
    isVerified: true,
  };
}
