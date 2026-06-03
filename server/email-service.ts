/**
 * 郵件通知服務
 * 使用 SendGrid 發送真實郵件通知
 */

import { getDb } from "./db";
import { emailLogs, InsertEmailLog } from "../drizzle/schema";
import { sendEmail, sendApprovalEmail, sendRejectionEmail } from "./sendgrid-service";

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

    // 使用 SendGrid 發送郵件
    const response = await sendEmail({
      to: options.to,
      subject: options.subject,
      htmlContent: formatEmailBody(options.body),
      textContent: options.body,
    });

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
  const db = await getDb();
  if (!db) {
    console.warn("[Email] Database not available");
    return false;
  }

  try {
    // 記錄郵件發送日誌
    const emailLog: InsertEmailLog = {
      applicationId,
      recipientEmail: email,
      subject: "✓ Pizza MC 伺服器申請已批准",
      body: `恭喜 ${gamertag}！您的申請已被批准。`,
      status: "pending",
    };

    await db.insert(emailLogs).values(emailLog);

    // 使用 SendGrid 發送批准郵件
    const response = await sendApprovalEmail(gamertag, email);

    if (response.success) {
      // 更新郵件日誌狀態為已發送
      const { eq } = await import("drizzle-orm");
      await db
        .update(emailLogs)
        .set({
          status: "sent",
          sentAt: new Date(),
        })
        .where(eq(emailLogs.recipientEmail, email));

      console.log(`[Email] Approval notification sent to ${email}`);
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
        .where(eq(emailLogs.recipientEmail, email));

      console.error(`[Email] Failed to send approval notification:`, response.error);
      return false;
    }
  } catch (error) {
    console.error("[Email] Error sending approval notification:", error);
    return false;
  }
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
  const db = await getDb();
  if (!db) {
    console.warn("[Email] Database not available");
    return false;
  }

  try {
    // 記錄郵件發送日誌
    const emailLog: InsertEmailLog = {
      applicationId,
      recipientEmail: email,
      subject: "✗ Pizza MC 伺服器申請已拒絕",
      body: `${gamertag}，您的申請未被批准。原因：${reason}`,
      status: "pending",
    };

    await db.insert(emailLogs).values(emailLog);

    // 使用 SendGrid 發送拒絕郵件
    const response = await sendRejectionEmail(gamertag, email, reason);

    if (response.success) {
      // 更新郵件日誌狀態為已發送
      const { eq } = await import("drizzle-orm");
      await db
        .update(emailLogs)
        .set({
          status: "sent",
          sentAt: new Date(),
        })
        .where(eq(emailLogs.recipientEmail, email));

      console.log(`[Email] Rejection notification sent to ${email}`);
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
        .where(eq(emailLogs.recipientEmail, email));

      console.error(`[Email] Failed to send rejection notification:`, response.error);
      return false;
    }
  } catch (error) {
    console.error("[Email] Error sending rejection notification:", error);
    return false;
  }
}
