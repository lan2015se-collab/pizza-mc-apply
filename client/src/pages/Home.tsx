import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function Home() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleXboxLogin = () => {
    setIsLoading(true);
    // 構建 Microsoft OAuth 授權 URL
    const clientId = import.meta.env.VITE_APP_ID;
    const redirectUri = `${window.location.origin}/auth/callback`;
    const scopes = ["XboxLive.signin"];
    
    const authUrl = new URL("https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize");
    authUrl.searchParams.append("client_id", clientId);
    authUrl.searchParams.append("redirect_uri", redirectUri);
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("scope", scopes.join(" "));
    authUrl.searchParams.append("response_mode", "query");
    
    window.location.href = authUrl.toString();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <style>{`
        body {
          font-family: 'Noto Serif TC', 'Microsoft JhengHei', 'SimSun', serif;
        }
      `}</style>
      
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src="/manus-storage/1000018851_f9a3f613.png"
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
            歡迎申請加入 Pizza MC 伺服器。請使用您的 Xbox 帳號登入以開始申請程序。
          </p>
        </Card>

        {/* 登入按鈕 */}
        <Button
          onClick={handleXboxLogin}
          disabled={isLoading}
          className="w-full bg-black text-white hover:bg-gray-800 py-6 text-lg font-semibold"
        >
          {isLoading ? "正在重導向..." : "使用 Xbox 帳號登入"}
        </Button>

        {/* 伺服器資訊 */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-black mb-4">伺服器資訊</h2>
          <div className="space-y-3 text-left">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-600">伺服器地址</p>
              <p className="text-base font-mono text-black">pizza-mc.aternos.me</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-600">連接埠</p>
              <p className="text-base font-mono text-black">23775</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
