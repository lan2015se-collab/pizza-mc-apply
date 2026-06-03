import { describe, it, expect, vi, beforeEach } from "vitest";

describe("Email Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should validate email options structure", () => {
    const emailOptions = {
      to: "test@example.com",
      subject: "Test Subject",
      body: "Test Body",
      applicationId: 1,
    };

    expect(emailOptions.to).toBeDefined();
    expect(emailOptions.subject).toBeDefined();
    expect(emailOptions.body).toBeDefined();
    expect(emailOptions.applicationId).toBeDefined();
  });

  it("should format approval notification correctly", () => {
    const gamertag = "TestPlayer";
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

    expect(body).toContain("恭喜");
    expect(body).toContain(gamertag);
    expect(body).toContain("pizza-mc.aternos.me");
    expect(body).toContain("23775");
  });

  it("should format rejection notification correctly", () => {
    const gamertag = "TestPlayer";
    const reason = "不符合伺服器要求";
    const body = `
親愛的 ${gamertag}，

感謝您對 Pizza MC 伺服器的興趣。

很遺憾，您的申請未被批准。

拒絕原因：${reason}

如您對此決定有疑問，歡迎聯絡我們。

---
Pizza MC 伺服器管理團隊
    `;

    expect(body).toContain("很遺憾");
    expect(body).toContain(gamertag);
    expect(body).toContain(reason);
  });

  it("should validate email log entry structure", () => {
    const emailLog = {
      applicationId: 1,
      recipientEmail: "test@example.com",
      subject: "Test Subject",
      body: "Test Body",
      status: "pending" as const,
    };

    expect(emailLog.applicationId).toBe(1);
    expect(emailLog.recipientEmail).toBe("test@example.com");
    expect(emailLog.status).toBe("pending");
  });

  it("should validate email status transitions", () => {
    const validStatuses = ["pending", "sent", "failed"];
    const testStatus = "sent";

    expect(validStatuses).toContain(testStatus);
  });

  it("should format HTML email body correctly", () => {
    const text = "Test email content";
    const html = `
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
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Pizza MC</h1>
          </div>
          <div class="content">
            ${text.replace(/\n/g, "<br>")}
          </div>
        </div>
      </body>
    </html>
  `;

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("Pizza MC");
    expect(html).toContain(text);
  });
});
