import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Spinner } from "@/components/ui/spinner";

export default function Home() {
  const [, setLocation] = useLocation();
  const [gamertag, setGamertag] = useState("");
  const [error, setError] = useState("");
  const verifyGamertag = trpc.application.verifyGamertag.useMutation();

  const handleVerifyGamertag = async () => {
    if (!gamertag.trim()) {
      setError("請輸入 Xbox Gamertag");
      return;
    }

    setError("");
    try {
      const result = await verifyGamertag.mutateAsync({ gamertag: gamertag.trim() });
      
      if (result.success && result.data) {
        // 驗證成功，存儲玩家資訊並進入申請表單
        sessionStorage.setItem("xboxPlayer", JSON.stringify(result.data));
        setLocation("/apply");
      } else {
        setError(result.error || "Gamertag 驗證失敗，請檢查輸入");
      }
    } catch (err) {
      setError("驗證過程中發生錯誤，請稍後重試");
      console.error("Verification error:", err);
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
            src="https://manus-storage.s3.amazonaws.com/1000018851_702f8b22.png"
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
            歡迎申請加入 Pizza MC 伺服器。請輸入您的 Xbox Gamertag 以開始申請程序。
          </p>
        </Card>

        {/* Gamertag 輸入框 */}
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="輸入您的 Xbox Gamertag"
            value={gamertag}
            onChange={(e) => {
              setGamertag(e.target.value);
              setError("");
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleVerifyGamertag();
              }
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-md text-black placeholder-gray-400"
            disabled={verifyGamertag.isPending}
          />
          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}
        </div>

        {/* 驗證按鈕 */}
        <Button
          onClick={handleVerifyGamertag}
          disabled={verifyGamertag.isPending || !gamertag.trim()}
          className="w-full bg-black text-white hover:bg-gray-800 py-6 text-lg font-semibold flex items-center justify-center gap-2"
        >
          {verifyGamertag.isPending ? (
            <>
              <Spinner className="h-5 w-5" />
              Loading...
            </>
          ) : (
            "使用 Xbox 帳號登入"
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
