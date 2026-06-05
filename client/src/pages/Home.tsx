import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { AdminPasswordDialog } from "@/components/AdminPasswordDialog";

export default function Home() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);

  const handleStartApplication = () => {
    if (!username.trim()) {
      setError("請輸入 Minecraft 用戶名稱");
      return;
    }

    if (username.trim().length < 3) {
      setError("用戶名稱至少需要 3 個字符");
      return;
    }

    if (username.trim().length > 16) {
      setError("用戶名稱最多 16 個字符");
      return;
    }

    setError("");
    // 存儲用戶名稱並進入申請表單
    sessionStorage.setItem("minecraftUsername", username.trim());
    setLocation("/apply");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <style>{`
        body {
          font-family: '新細明體', 'Microsoft JhengHei', 'SimSun', serif;
        }
      `}</style>
      
      <div className="max-w-md w-full space-y-8 text-center">
        {/* 標題 */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-black">Pizza MC</h1>
          <p className="text-lg text-gray-600">Minecraft Server Application</p>
        </div>

        {/* 說明文字 */}
        <Card className="bg-gray-50 border border-gray-200 p-6">
          <p className="text-gray-700 text-base leading-relaxed">
            歡迎申請加入 Pizza MC 伺服器。請輸入您的 Minecraft 用戶名稱以開始申請程序。
          </p>
        </Card>

        {/* 用戶名稱輸入框 */}
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="輸入 Minecraft 用戶名稱"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleStartApplication();
              }
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-md text-black placeholder-gray-400"
            maxLength={16}
          />
          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}
        </div>

        {/* 開始申請按鈕 */}
        <Button
          onClick={handleStartApplication}
          disabled={!username.trim()}
          className="w-full bg-black text-white hover:bg-gray-800 py-6 text-lg font-semibold"
        >
          開始申請
        </Button>

        {/* 查看玩家名單和查詢狀態連結 */}
        <div className="flex gap-3">
          <Button
            onClick={() => setLocation("/players")}
            variant="outline"
            className="flex-1 border border-gray-300 text-black hover:bg-gray-100"
          >
            查看已批准玩家名單
          </Button>
          <Button
            onClick={() => setLocation("/query")}
            variant="outline"
            className="flex-1 border border-gray-300 text-black hover:bg-gray-100"
          >
            查詢申請狀態
          </Button>
        </div>

        {/* 管理員區域按鈕 */}
        <Button
          onClick={() => setAdminDialogOpen(true)}
          variant="outline"
          className="w-full border border-gray-300 text-black hover:bg-gray-100 text-sm"
        >
          管理員區域
        </Button>

        {/* 管理員密碼驗證對話框 */}
        <AdminPasswordDialog
          open={adminDialogOpen}
          onOpenChange={setAdminDialogOpen}
          onSuccess={() => setLocation("/admin/dashboard")}
        />
      </div>
    </div>
  );
}
