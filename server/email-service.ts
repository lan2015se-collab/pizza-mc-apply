/**
 * 郵件通知服務
 * 使用 Manus 內建郵件 API 發送通知
 */

import { getDb } from "./db";
import { emailLogs, InsertEmailLog } from "../drizzle/schema";

interface EmailOptions {
  to: string;
  subject: string;
  body: string;
  applicationId: number;
}

/**
 * 發送郵件通知
 */
export async function sendEmailNotification(options: EmailOptions): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Email] Database not available");
    return false;
  }

  try {
    // 記錄郵件發送日誌
    const emailLog: InsertEmailLog = {
      applicationId: options.applicationId,
      recipientEmail: options.to,
      subject: options.subject,
      body: options.body,
      status: "pending",
    };

    await db.insert(emailLogs).values(emailLog);

    // 使用 Manus 內建郵件 API 發送
    // 注意：實際應用中需要配置 SMTP 或使用第三方郵件服務
    // 這裡使用 Manus 提供的郵件服務
    const response = await sendViaForgeAPI(options);

    if (response.success) {
      // 更新郵件日誌狀態為已發送
      const { eq } = await import("drizzle-orm");
      await db
        .update(emailLogs)
        .set({
          status: "sent",
          sentAt: new Date(),
        })
        .where(eq(emailLogs.recipientEmail, options.to));

      console.log(`[Email] Successfully sent to ${options.to}`);
      return true;
    } else {
      // 更新郵件日誌狀態為失敗
      const { eq } = await import("drizzle-orm");
      await db
        .update(emailLogs)
        .set({
          status: "failed",
          errorMessage: response.error,
        })
        .where(eq(emailLogs.recipientEmail, options.to));

      console.error(`[Email] Failed to send to ${options.to}:`, response.error);
      return false;
    }
  } catch (error) {
    console.error("[Email] Error sending notification:", error);
    return false;
  }
}

/**
 * 通過 Manus Forge API 發送郵件
 */
async function sendViaForgeAPI(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  try {
    const forgeApiUrl = process.env.BUILT_IN_FORGE_API_URL;
    const forgeApiKey = process.env.BUILT_IN_FORGE_API_KEY;

    if (!forgeApiUrl || !forgeApiKey) {
      throw new Error("Forge API credentials not configured");
    }

    const response = await fetch(`${forgeApiUrl}/email/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${forgeApiKey}`,
      },
      body: JSON.stringify({
        to: options.to,
        subject: options.subject,
        html: formatEmailBody(options.body),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return {
        success: false,
        error: `HTTP ${response.status}: ${error}`,
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * 格式化郵件內容為 HTML
 */
function formatEmailBody(text: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: 'Microsoft JhengHei', 'SimSun', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 5px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            color: #000;
          }
          .content {
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
          }
          .button {
            display: inline-block;
            background-color: #000;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Pizza MC</h1>
            <p>Minecraft Server Application</p>
          </div>
          <div class="content">
            ${text.replace(/\n/g, "<br>")}
          </div>
          <div class="footer">
            <p>此為自動發送的郵件，請勿直接回覆。</p>
            <p>如有任何問題，請聯絡 lan.2015.se@gmail.com</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * 發送申請批准通知
 */
export async function sendApprovalNotification(
  gamertag: string,
  email: string,
  applicationId: number
): Promise<boolean> {
  const body = `
親愛的 ${gamertag}，

恭喜！您的 Pizza MC 伺服器申請已被批准。

伺服器資訊：
- 伺服器地址：pizza-mc.aternos.me
- 連接埠：23775

您現在可以使用您的 Minecraft 帳號加入伺服器。請確保您已在 Aternos 上註冊帳號。

祝您遊戲愉快！

---
Pizza MC 伺服器管理團隊
  `;

  return sendEmailNotification({
    to: email,
    subject: "Pizza MC 伺服器申請 - 批准通知",
    body,
    applicationId,
  });
}

/**
 * 發送申請拒絕通知
 */
export async function sendRejectionNotification(
  gamertag: string,
  email: string,
  reason: string,
  applicationId: number
): Promise<boolean> {
  const body = `
親愛的 ${gamertag}，

感謝您對 Pizza MC 伺服器的興趣。

很遺憾，您的申請未被批准。

拒絕原因：${reason || "不符合伺服器要求"}

如您對此決定有疑問，歡迎聯絡我們。

---
Pizza MC 伺服器管理團隊
  `;

  return sendEmailNotification({
    to: email,
    subject: "Pizza MC 伺服器申請 - 未批准通知",
    body,
    applicationId,
  });
}
