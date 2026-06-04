import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Spinner } from "@/components/ui/spinner";

export default function Home() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const authenticateWithMicrosoft = trpc.application.authenticateWithMicrosoft.useMutation();

  const handleMicrosoftLogin = async () => {
    if (!email.trim()) {
      setError("請輸入 Microsoft 帳戶郵箱");
      return;
    }
    if (!password.trim()) {
      setError("請輸入密碼");
      return;
    }

    setError("");
    try {
      const result = await authenticateWithMicrosoft.mutateAsync({ 
        email: email.trim(),
        password: password.trim()
      });
      
      if (result.success && result.data) {
        // 認證成功，存儲玩家資訊並進入申請表單
        sessionStorage.setItem("xboxPlayer", JSON.stringify(result.data));
        setLocation("/apply");
      } else {
        setError(result.error || "Microsoft 帳戶登錄失敗，請檢查郵箱和密碼");
      }
    } catch (err) {
      setError("登錄過程中發生錯誤，請稍後重試");
      console.error("Authentication error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <style>{`
        body {
          font-family: '新細明體', 'Microsoft JhengHei', 'SimSun', serif;
        }
      `}</style>
      
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src="/manus-storage/1000018851_e79ae118.png"
            alt="Pizza MC Logo"
            className="h-32 w-32 object-contain"
          />
        </div>

        {/* 標題 */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-black">Pizza MC</h1>
          <p className="text-lg text-gray-600">Minecraft Server Application</p>
        </div>

        {/* 說明文字 */}
        <Card className="bg-gray-50 border border-gray-200 p-6">
          <p className="text-gray-700 text-base leading-relaxed">
            歡迎申請加入 Pizza MC 伺服器。請使用您的 Microsoft 帳戶登錄以開始申請程序。
          </p>
        </Card>

        {/* 郵箱輸入框 */}
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Microsoft 帳戶郵箱"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-md text-black placeholder-gray-400"
            disabled={authenticateWithMicrosoft.isPending}
          />
        </div>

        {/* 密碼輸入框 */}
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Microsoft 帳戶密碼"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleMicrosoftLogin();
              }
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-md text-black placeholder-gray-400"
            disabled={authenticateWithMicrosoft.isPending}
          />
          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}
        </div>

        {/* 登錄按鈕 */}
        <Button
          onClick={handleMicrosoftLogin}
          disabled={authenticateWithMicrosoft.isPending || !email.trim() || !password.trim()}
          className="w-full bg-black text-white hover:bg-gray-800 py-6 text-lg font-semibold flex items-center justify-center gap-2"
        >
          {authenticateWithMicrosoft.isPending ? (
            <>
              <Spinner className="h-5 w-5" />
              登錄中...
            </>
          ) : (
            "使用 Microsoft 帳號登入"
          )}
        </Button>

        {/* 查看玩家名單連結 */}
        <Button
          onClick={() => setLocation("/players")}
          variant="outline"
          className="w-full border border-gray-300 text-black hover:bg-gray-100"
        >
          查看已批准玩家名單
        </Button>
      </div>
    </div>
  );
}
