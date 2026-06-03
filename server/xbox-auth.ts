/**
 * Xbox Live OAuth 認證流程
 * 參考: https://minecraft.wiki/w/Microsoft_authentication
 */

interface XboxAuthTokenResponse {
  IssueInstant: string;
  NotAfter: string;
  Token: string;
  DisplayClaims: {
    xui: Array<{
      uhs: string;
    }>;
  };
}

interface XstsTokenResponse {
  IssueInstant: string;
  NotAfter: string;
  Token: string;
  DisplayClaims: {
    xui: Array<{
      uhs: string;
    }>;
  };
}

interface MinecraftAuthResponse {
  username: string;
  roles: string[];
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface MinecraftProfileResponse {
  id: string;
  name: string;
  skins: Array<{
    id: string;
    state: string;
    url: string;
    textureKey: string;
  }>;
  capes: Array<unknown>;
}

interface XboxProfileResponse {
  people: Array<{
    xuid: string;
    gamertag: string;
    displayName: string;
    modernGamertag: string;
  }>;
}

/**
 * 第一步：使用 Microsoft access token 向 Xbox Live 認證
 */
export async function authenticateWithXboxLive(
  microsoftAccessToken: string
): Promise<{ xblToken: string; userHash: string }> {
  const response = await fetch("https://user.auth.xboxlive.com/user/authenticate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      Properties: {
        AuthMethod: "RPS",
        SiteName: "user.auth.xboxlive.com",
        RpsTicket: `d=${microsoftAccessToken}`,
      },
      RelyingParty: "http://auth.xboxlive.com",
      TokenType: "JWT",
    }),
  });

  if (!response.ok) {
    throw new Error(`Xbox Live authentication failed: ${response.statusText}`);
  }

  const data = (await response.json()) as XboxAuthTokenResponse;
  return {
    xblToken: data.Token,
    userHash: data.DisplayClaims.xui[0].uhs,
  };
}

/**
 * 第二步：使用 XBL token 獲取 XSTS token
 */
export async function getXstsToken(xblToken: string): Promise<{ xstsToken: string; userHash: string }> {
  const response = await fetch("https://xsts.auth.xboxlive.com/xsts/authorize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      Properties: {
        SandboxId: "RETAIL",
        UserTokens: [xblToken],
      },
      RelyingParty: "rp://api.minecraftservices.com/",
      TokenType: "JWT",
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    if ((errorData as { XErr?: number }).XErr) {
      throw new Error(`XSTS token error: ${(errorData as { XErr?: number }).XErr}`);
    }
    throw new Error(`XSTS token request failed: ${response.statusText}`);
  }

  const data = (await response.json()) as XstsTokenResponse;
  return {
    xstsToken: data.Token,
    userHash: data.DisplayClaims.xui[0].uhs,
  };
}

/**
 * 第三步：使用 XSTS token 向 Minecraft 認證
 */
export async function authenticateWithMinecraft(
  xstsToken: string,
  userHash: string
): Promise<string> {
  const response = await fetch("https://api.minecraftservices.com/authentication/login_with_xbox", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      identityToken: `XBL3.0 x=${userHash};${xstsToken}`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Minecraft authentication failed: ${response.statusText}`);
  }

  const data = (await response.json()) as MinecraftAuthResponse;
  return data.access_token;
}

/**
 * 第四步：檢查遊戲所有權
 */
export async function checkGameOwnership(minecraftAccessToken: string): Promise<boolean> {
  const response = await fetch("https://api.minecraftservices.com/entitlements/mcstore", {
    headers: {
      Authorization: `Bearer ${minecraftAccessToken}`,
    },
  });

  if (!response.ok) {
    return false;
  }

  const data = (await response.json()) as { items: Array<{ name: string }> };
  return data.items.length > 0;
}

/**
 * 第五步：獲取 Minecraft 玩家資訊
 */
export async function getMinecraftProfile(minecraftAccessToken: string): Promise<MinecraftProfileResponse> {
  const response = await fetch("https://api.minecraftservices.com/minecraft/profile", {
    headers: {
      Authorization: `Bearer ${minecraftAccessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get Minecraft profile: ${response.statusText}`);
  }

  return (await response.json()) as MinecraftProfileResponse;
}

/**
 * 獲取 Xbox Gamertag（使用 XSTS token）
 */
export async function getXboxGamertag(xstsToken: string): Promise<string> {
  const response = await fetch(
    "https://peoplehub.xboxlive.com/users/me/people/search/decoration/detail,preferredColor?maxItems=1",
    {
      headers: {
        Authorization: `XBL3.0 x=;${xstsToken}`,
        "x-xbl-contract-version": "5",
        "Accept-Language": "en-US",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get Xbox gamertag: ${response.statusText}`);
  }

  const data = (await response.json()) as XboxProfileResponse;
  if (data.people && data.people.length > 0) {
    return data.people[0].gamertag;
  }

  throw new Error("No Xbox profile found");
}

/**
 * 完整的 Xbox 認證流程
 * 輸入: Microsoft access token
 * 輸出: { gamertag, minecraftUsername, xboxAccountId }
 */
export async function completeXboxAuthFlow(microsoftAccessToken: string) {
  try {
    // 步驟 1: Xbox Live 認證
    const { xblToken, userHash } = await authenticateWithXboxLive(microsoftAccessToken);

    // 步驟 2: 獲取 XSTS token
    const { xstsToken } = await getXstsToken(xblToken);

    // 步驟 3: Minecraft 認證
    const minecraftAccessToken = await authenticateWithMinecraft(xstsToken, userHash);

    // 步驟 4: 檢查遊戲所有權
    const ownsGame = await checkGameOwnership(minecraftAccessToken);
    if (!ownsGame) {
      throw new Error("User does not own Minecraft");
    }

    // 步驟 5: 獲取 Minecraft 玩家資訊
    const profile = await getMinecraftProfile(minecraftAccessToken);

    // 獲取 Xbox Gamertag
    const gamertag = await getXboxGamertag(xstsToken);

    return {
      gamertag,
      minecraftUsername: profile.name,
      xboxAccountId: userHash,
    };
  } catch (error) {
    console.error("Xbox auth flow error:", error);
    throw error;
  }
}
