import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

interface ApplicationStatusInfo {
  gamertag: string;
  status: "pending" | "approved" | "rejected";
  reason?: string;
  appliedAt: string;
  serverAddress?: string;
  serverPort?: number;
}

export default function ApplicationStatus() {
  const [gamertag, setGamertag] = useState("");
  const [statusInfo, setStatusInfo] = useState<ApplicationStatusInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!gamertag.trim()) {
      setError("請輸入 Gamertag");
      return;
    }

    setIsLoading(true);
    setError(null);
    setStatusInfo(null);

    try {
      const response = await fetch(`/api/trpc/application.getStatus?input=${JSON.stringify({ gamertag })}`);
      const data = await response.json();

      if (data.result?.data?.success) {
        setStatusInfo(data.result.data.data);
      } else {
        setError(data.result?.data?.error || "找不到申請記錄");
      }
    } catch (err) {
      setError("查詢失敗，請稍後重試");
      console.error("Status query error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <span style={{ color: "#22c55e", fontWeight: "bold" }}>✓ 已批准</span>;
      case "rejected":
        return <span style={{ color: "#ef4444", fontWeight: "bold" }}>✗ 已拒絕</span>;
      case "pending":
        return <span style={{ color: "#f59e0b", fontWeight: "bold" }}>⏳ 審核中</span>;
      default:
        return <span>未知狀態</span>;
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        fontFamily: "'Microsoft JhengHei', 'SimSun', Arial, sans-serif",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px", fontSize: "32px", fontWeight: "bold" }}>
          申請狀態查詢
        </h1>

        <Card style={{ padding: "30px", marginBottom: "30px" }}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
              請輸入您的 Gamertag：
            </label>
            <Input
              type="text"
              placeholder="例如：TestPlayer"
              value={gamertag}
              onChange={(e) => setGamertag(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "16px",
              }}
            />
          </div>

          <Button
            onClick={handleSearch}
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#000",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? (
              <>
                <Loader2 style={{ marginRight: "8px", display: "inline", animation: "spin 1s linear infinite" }} />
                查詢中...
              </>
            ) : (
              "查詢狀態"
            )}
          </Button>
        </Card>

        {error && (
          <Card
            style={{
              padding: "20px",
              backgroundColor: "#fee2e2",
              border: "1px solid #fca5a5",
              borderRadius: "4px",
              marginBottom: "20px",
            }}
          >
            <p style={{ color: "#991b1b", margin: 0 }}>❌ {error}</p>
          </Card>
        )}

        {statusInfo && (
          <Card style={{ padding: "30px" }}>
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px" }}>申請詳情</h2>

              <div style={{ marginBottom: "15px" }}>
                <p style={{ margin: "0 0 5px 0", color: "#666", fontSize: "14px" }}>玩家名稱</p>
                <p style={{ margin: 0, fontSize: "18px", fontWeight: "bold" }}>{statusInfo.gamertag}</p>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <p style={{ margin: "0 0 5px 0", color: "#666", fontSize: "14px" }}>申請狀態</p>
                <p style={{ margin: 0, fontSize: "18px" }}>{getStatusBadge(statusInfo.status)}</p>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <p style={{ margin: "0 0 5px 0", color: "#666", fontSize: "14px" }}>申請時間</p>
                <p style={{ margin: 0, fontSize: "16px" }}>
                  {new Date(statusInfo.appliedAt).toLocaleString("zh-TW")}
                </p>
              </div>

              {statusInfo.status === "rejected" && statusInfo.reason && (
                <div style={{ marginBottom: "15px", padding: "15px", backgroundColor: "#fef3c7", borderRadius: "4px" }}>
                  <p style={{ margin: "0 0 5px 0", color: "#92400e", fontSize: "14px", fontWeight: "bold" }}>
                    拒絕原因
                  </p>
                  <p style={{ margin: 0, color: "#92400e" }}>{statusInfo.reason}</p>
                </div>
              )}

              {statusInfo.status === "approved" && (
                <div style={{ padding: "15px", backgroundColor: "#dcfce7", borderRadius: "4px" }}>
                  <p style={{ margin: "0 0 10px 0", color: "#166534", fontSize: "14px", fontWeight: "bold" }}>
                    ✓ 恭喜！您的申請已被批准
                  </p>
                  <p style={{ margin: "0 0 5px 0", color: "#166534", fontSize: "14px" }}>
                    <strong>伺服器地址：</strong> {statusInfo.serverAddress || "pizza-mc.aternos.me"}
                  </p>
                  <p style={{ margin: 0, color: "#166534", fontSize: "14px" }}>
                    <strong>連接埠：</strong> {statusInfo.serverPort || 23775}
                  </p>
                  <p style={{ margin: "10px 0 0 0", color: "#166534", fontSize: "12px" }}>
                    詳細資訊已發送至您的郵箱，請檢查收件箱。
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}

        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <a
            href="/"
            style={{
              color: "#000",
              textDecoration: "underline",
              fontSize: "14px",
            }}
          >
            返回首頁
          </a>
        </div>
      </div>
    </div>
  );
}
