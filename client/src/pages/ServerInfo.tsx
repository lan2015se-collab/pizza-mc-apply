import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ServerInfo() {
  const [, setLocation] = useLocation();

  const handleReturnHome = () => {
    sessionStorage.removeItem("xboxPlayer");
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8">
      <style>{`
        body {
          font-family: '新細明體', 'Microsoft JhengHei', 'SimSun', serif;
        }
      `}</style>

      <div className="max-w-2xl w-full space-y-8">
        {/* 返回按鈕 */}
        <Button
          variant="ghost"
          onClick={handleReturnHome}
          className="text-black hover:bg-gray-100"
        >
          ← 返回
        </Button>

        {/* 感謝信息 */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-black">感謝您的申請</h1>
          <p className="text-lg text-gray-600">Thank you for your participation.</p>
        </div>

        {/* 成功卡片 */}
        <Card className="bg-green-50 border border-green-200 p-8 space-y-4">
          <h2 className="text-2xl font-bold text-green-800">✓ 申請已成功提交</h2>
          <p className="text-green-700 leading-relaxed">
            我們已收到您的申請。管理員將在 24-48 小時內審核您的申請。
          </p>
          <p className="text-green-700 leading-relaxed">
            <strong>審核結果和伺服器資訊將通過郵件發送至您提供的郵箱地址。</strong>
          </p>
        </Card>

        {/* 準備說明卡片 */}
        <Card className="border border-gray-200 p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-black">準備加入伺服器</h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm font-semibold text-gray-700 mb-2">1️⃣ 註冊 Aternos 帳號</p>
                <p className="text-sm text-gray-600">
                  訪問 <a href="https://aternos.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">aternos.org</a> 並使用您想要的用戶名稱註冊帳號。
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm font-semibold text-gray-700 mb-2">2️⃣ 等待審核結果</p>
                <p className="text-sm text-gray-600">
                  我們的管理員將審核您的申請，並通過郵件發送伺服器地址、連接埠和進一步的說明。
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm font-semibold text-gray-700 mb-2">3️⃣ 加入遊戲</p>
                <p className="text-sm text-gray-600">
                  使用郵件中提供的伺服器地址和連接埠在 Minecraft 中加入伺服器。
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* 提示信息 */}
        <Card className="bg-blue-50 border border-blue-200 p-4">
          <p className="text-sm text-blue-800 leading-relaxed">
            💡 <strong>重要提示：</strong>伺服器資訊不會在此頁面顯示。請檢查您的郵箱（包括垃圾郵件資料夾）以獲取審核結果和伺服器詳細資訊。
          </p>
        </Card>

        {/* 返回首頁按鈕 */}
        <Button
          onClick={handleReturnHome}
          className="w-full bg-black text-white hover:bg-gray-800 py-3 text-base font-semibold"
        >
          返回首頁
        </Button>
      </div>
    </div>
  );
}
