import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface StatsData {
  totalApplications: number;
  approvedCount: number;
  rejectedCount: number;
  pendingCount: number;
  approvalRate: number;
  monthlyStats: Array<{
    month: string;
    applications: number;
    approved: number;
    rejected: number;
  }>;
}

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "pizzahut") {
      setIsAuthenticated(true);
      setPassword("");
      fetchStats();
    } else {
      setError("密碼錯誤");
      setPassword("");
    }
  };

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/trpc/admin.getStats");
      const data = await response.json();

      if (data.result?.data?.success) {
        setStats(data.result.data.data);
      } else {
        setError("無法獲取統計數據");
      }
    } catch (err) {
      setError("獲取統計數據失敗");
      console.error("Stats fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#ffffff",
          fontFamily: "'Microsoft JhengHei', 'SimSun', Arial, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <Card style={{ padding: "40px", maxWidth: "400px", width: "100%" }}>
          <h1 style={{ textAlign: "center", marginBottom: "30px", fontSize: "24px", fontWeight: "bold" }}>
            管理員登入
          </h1>

          <form onSubmit={handlePasswordSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
                請輸入管理員密碼：
              </label>
              <Input
                type="password"
                placeholder="輸入密碼"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "16px",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {error && (
              <div style={{ color: "#ef4444", marginBottom: "15px", fontSize: "14px" }}>
                ❌ {error}
              </div>
            )}

            <Button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#000",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              登入
            </Button>
          </form>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
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
        </Card>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        fontFamily: "'Microsoft JhengHei', 'SimSun', Arial, sans-serif",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "bold", margin: 0 }}>申請統計儀表板</h1>
          <Button
            onClick={() => setIsAuthenticated(false)}
            style={{
              padding: "8px 16px",
              backgroundColor: "#ef4444",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            登出
          </Button>
        </div>

        {error && (
          <Card style={{ padding: "15px", backgroundColor: "#fee2e2", marginBottom: "20px" }}>
            <p style={{ color: "#991b1b", margin: 0 }}>❌ {error}</p>
          </Card>
        )}

        {isLoading ? (
          <Card style={{ padding: "40px", textAlign: "center" }}>
            <p>載入中...</p>
          </Card>
        ) : stats ? (
          <>
            {/* 統計卡片 */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px",
                marginBottom: "30px",
              }}
            >
              <Card style={{ padding: "20px", textAlign: "center" }}>
                <p style={{ color: "#666", margin: "0 0 10px 0", fontSize: "14px" }}>總申請數</p>
                <p style={{ fontSize: "32px", fontWeight: "bold", margin: 0 }}>{stats.totalApplications}</p>
              </Card>

              <Card style={{ padding: "20px", textAlign: "center" }}>
                <p style={{ color: "#666", margin: "0 0 10px 0", fontSize: "14px" }}>已批准</p>
                <p style={{ fontSize: "32px", fontWeight: "bold", margin: 0, color: "#22c55e" }}>
                  {stats.approvedCount}
                </p>
              </Card>

              <Card style={{ padding: "20px", textAlign: "center" }}>
                <p style={{ color: "#666", margin: "0 0 10px 0", fontSize: "14px" }}>已拒絕</p>
                <p style={{ fontSize: "32px", fontWeight: "bold", margin: 0, color: "#ef4444" }}>
                  {stats.rejectedCount}
                </p>
              </Card>

              <Card style={{ padding: "20px", textAlign: "center" }}>
                <p style={{ color: "#666", margin: "0 0 10px 0", fontSize: "14px" }}>審核中</p>
                <p style={{ fontSize: "32px", fontWeight: "bold", margin: 0, color: "#f59e0b" }}>
                  {stats.pendingCount}
                </p>
              </Card>

              <Card style={{ padding: "20px", textAlign: "center" }}>
                <p style={{ color: "#666", margin: "0 0 10px 0", fontSize: "14px" }}>批准率</p>
                <p style={{ fontSize: "32px", fontWeight: "bold", margin: 0 }}>{stats.approvalRate}%</p>
              </Card>
            </div>

            {/* 圖表 */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
                gap: "20px",
              }}
            >
              {/* 月度申請趨勢 */}
              <Card style={{ padding: "20px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "15px" }}>月度申請趨勢</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="applications" stroke="#000" name="總申請" />
                    <Line type="monotone" dataKey="approved" stroke="#22c55e" name="已批准" />
                    <Line type="monotone" dataKey="rejected" stroke="#ef4444" name="已拒絕" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* 申請狀態分佈 */}
              <Card style={{ padding: "20px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "15px" }}>申請狀態分佈</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "已批准", value: stats.approvedCount },
                        { name: "已拒絕", value: stats.rejectedCount },
                        { name: "審核中", value: stats.pendingCount },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#22c55e" />
                      <Cell fill="#ef4444" />
                      <Cell fill="#f59e0b" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <div style={{ marginTop: "30px", textAlign: "center" }}>
              <a
                href="/admin-panel"
                style={{
                  display: "inline-block",
                  padding: "10px 20px",
                  backgroundColor: "#000",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: "4px",
                  marginRight: "10px",
                }}
              >
                返回審核面板
              </a>
              <a
                href="/"
                style={{
                  display: "inline-block",
                  padding: "10px 20px",
                  backgroundColor: "#666",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: "4px",
                }}
              >
                返回首頁
              </a>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
