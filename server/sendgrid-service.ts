import { ENV } from "./_core/env";

/**
 * SendGrid 郵件服務
 * 用於發送真實郵件通知
 */

interface EmailOptions {
  to: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
}

/**
 * 發送郵件
 */
export async function sendEmail(options: EmailOptions): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  try {
    if (!ENV.sendgridApiKey) {
      console.warn("[SendGrid] API key not configured, using mock mode");
      return {
        success: true,
        messageId: `mock-${Date.now()}`,
      };
    }

    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ENV.sendgridApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: options.to }],
          },
        ],
        from: {
          email: "noreply@pizza-mc.com",
          name: "Pizza MC Server",
        },
        subject: options.subject,
        content: [
          {
            type: "text/html",
            value: options.htmlContent,
          },
          ...(options.textContent
            ? [
                {
                  type: "text/plain",
                  value: options.textContent,
                },
              ]
            : []),
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[SendGrid] Error:", error);
      return {
        success: false,
        error: `SendGrid API error: ${response.status}`,
      };
    }

    // SendGrid 返回 202 Accepted
    const messageId = response.headers.get("X-Message-Id") || `msg-${Date.now()}`;

    return {
      success: true,
      messageId,
    };
  } catch (error) {
    console.error("[SendGrid] Exception:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * 發送批准通知郵件
 */
export async function sendApprovalEmail(
  gamertag: string,
  email: string,
  serverAddress: string = "pizza-mc.aternos.me",
  serverPort: number = 23775
): Promise<{ success: boolean; error?: string }> {
  const htmlContent = `
    <html>
      <body style="font-family: 'Microsoft JhengHei', sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #000;">✓ 您的 Pizza MC 申請已被批准</h2>
          
          <p>親愛的 <strong>${gamertag}</strong>，</p>
          
          <p>恭喜！您的 Pizza MC 伺服器申請已被我們的管理員批准。</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">伺服器資訊</h3>
            <p><strong>伺服器地址：</strong> <code>${serverAddress}</code></p>
            <p><strong>連接埠：</strong> <code>${serverPort}</code></p>
          </div>
          
          <h3>如何加入伺服器：</h3>
          <ol>
            <li>確保您已在 Aternos 上註冊帳號（https://aternos.org）</li>
            <li>在 Minecraft 中，點擊「新增伺服器」</li>
            <li>輸入伺服器地址：<code>${serverAddress}</code></li>
            <li>輸入連接埠：<code>${serverPort}</code></li>
            <li>點擊「完成」並加入遊戲</li>
          </ol>
          
          <p>如有任何問題，請聯絡我們的管理員。</p>
          
          <p style="color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
            此郵件由 Pizza MC 伺服器自動發送，請勿直接回覆。
          </p>
        </div>
      </body>
    </html>
  `;

  const textContent = `
Pizza MC 伺服器申請批准通知

親愛的 ${gamertag}，

恭喜！您的 Pizza MC 伺服器申請已被批准。

伺服器資訊：
地址：${serverAddress}
連接埠：${serverPort}

如何加入伺服器：
1. 確保您已在 Aternos 上註冊帳號（https://aternos.org）
2. 在 Minecraft 中，點擊「新增伺服器」
3. 輸入伺服器地址：${serverAddress}
4. 輸入連接埠：${serverPort}
5. 點擊「完成」並加入遊戲

如有任何問題，請聯絡我們的管理員。
  `.trim();

  const result = await sendEmail({
    to: email,
    subject: `✓ Pizza MC 伺服器申請已批准 - ${gamertag}`,
    htmlContent,
    textContent,
  });

  return {
    success: result.success,
    error: result.error,
  };
}

/**
 * 發送拒絕通知郵件
 */
export async function sendRejectionEmail(
  gamertag: string,
  email: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  const htmlContent = `
    <html>
      <body style="font-family: 'Microsoft JhengHei', sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #d32f2f;">✗ 您的 Pizza MC 申請已被拒絕</h2>
          
          <p>親愛的 <strong>${gamertag}</strong>，</p>
          
          <p>感謝您對 Pizza MC 伺服器的興趣。遺憾的是，您的申請未被批准。</p>
          
          <div style="background-color: #fff3cd; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h3 style="margin-top: 0;">拒絕原因</h3>
            <p>${reason}</p>
          </div>
          
          <p>如果您對此決定有任何疑問，或想瞭解更多資訊，歡迎聯絡我們的管理員。</p>
          
          <p style="color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
            此郵件由 Pizza MC 伺服器自動發送，請勿直接回覆。
          </p>
        </div>
      </body>
    </html>
  `;

  const textContent = `
Pizza MC 伺服器申請拒絕通知

親愛的 ${gamertag}，

感謝您對 Pizza MC 伺服器的興趣。遺憾的是，您的申請未被批准。

拒絕原因：
${reason}

如果您對此決定有任何疑問，或想瞭解更多資訊，歡迎聯絡我們的管理員。
  `.trim();

  const result = await sendEmail({
    to: email,
    subject: `✗ Pizza MC 伺服器申請已拒絕 - ${gamertag}`,
    htmlContent,
    textContent,
  });

  return {
    success: result.success,
    error: result.error,
  };
}
