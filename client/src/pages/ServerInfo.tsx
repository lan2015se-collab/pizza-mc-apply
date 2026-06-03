import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { toast } from "sonner";

interface ServerInfoProps {
  gamertag: string;
  xboxAccountId: string;
}

export default function ServerInfo({ gamertag, xboxAccountId }: ServerInfoProps) {
  const [, setLocation] = useLocation();
  const [aerternosUsername, setAerternosUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveAndEmail = async () => {
    if (!aerternosUsername.trim()) {
      toast.error("請輸入 Aternos 用戶名稱");
      return;
    }

    setIsLoading(true);
    try {
      // 構建 Gmail 郵件連結
      const recipientEmail = "lan.2015.se@gmail.com";
      const subject = `Pizza MC 伺服器申請 - ${gamertag}`;
      const body = `
申請者：${gamertag}
Aternos 用戶名稱：${aerternosUsername.trim()}

伺服器資訊：
地址：pizza-mc.aternos.me
連接埠：23775

請使用上述 Aternos 用戶名稱註冊 Aternos 帳號並加入伺服器。
      `.trim();

      // 使用 mailto 協議打開 Gmail
      const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipientEmail}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      window.open(mailtoLink, "_blank");
      
      toast.success("已打開 Gmail，請完成郵件發送");
      
      // 延遲後返回首頁
      setTimeout(() => {
        setLocation("/");
      }, 2000);
    } catch (error) {
      toast.error("發生錯誤");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8">
      <style>{`
        body {
          font-family: 'Noto Serif TC', 'Microsoft JhengHei', 'SimSun', serif;
        }
      `}</style>

      <div className="max-w-2xl w-full space-y-8">
        {/* 返回按鈕 */}
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="text-black hover:bg-gray-100"
        >
          ← 返回
        </Button>

        {/* 感謝信息 */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-black">感謝您的申請</h1>
          <p className="text-lg text-gray-600">Thank you for your participation.</p>
        </div>

        {/* 伺服器資訊卡片 */}
        <Card className="border border-gray-200 p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-black">伺服器資訊</h2>
            
            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600 mb-1">伺服器地址</p>
                <p className="text-lg font-mono text-black font-semibold">pizza-mc.aternos.me</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600 mb-1">連接埠</p>
                <p className="text-lg font-mono text-black font-semibold">23775</p>
              </div>
            </div>
          </div>

          {/* Aternos 帳號信息 */}
          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
              <p className="text-sm text-yellow-800 font-semibold mb-2">⚠️ 重要提示</p>
              <p className="text-sm text-yellow-800 leading-relaxed">
                要存取伺服器，您必須先註冊 Aternos 帳號。請在下方輸入您的 Aternos 用戶名稱，我們會將相關資訊發送至您的郵箱。
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-base font-semibold text-black">
                Aternos 用戶名稱
              </label>
              <Input
                type="text"
                value={aerternosUsername}
                onChange={(e) => setAerternosUsername(e.target.value)}
                placeholder="輸入您的 Aternos 用戶名稱"
                className="border border-gray-300 rounded p-3 text-base"
              />
            </div>

            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-600">
                📧 聯絡郵箱：<span className="font-mono font-semibold">lan.2015.se@gmail.com</span>
              </p>
            </div>
          </div>

          {/* 儲存按鈕 */}
          <div className="pt-4">
            <Button
              onClick={handleSaveAndEmail}
              disabled={isLoading || !aerternosUsername.trim()}
              className="w-full bg-black text-white hover:bg-gray-800 py-6 text-lg font-semibold"
            >
              {isLoading ? "處理中..." : "儲存並發送郵件"}
            </Button>
          </div>
        </Card>

        {/* 下一步說明 */}
        <Card className="bg-blue-50 border border-blue-200 p-4">
          <p className="text-sm text-blue-800 leading-relaxed">
            💡 <strong>下一步：</strong>按下「儲存並發送郵件」後，您的 Aternos 用戶名稱將通過郵件發送。請確保您已在 Aternos 上註冊帳號，然後使用上述伺服器地址和連接埠加入遊戲。
          </p>
        </Card>
      </div>
    </div>
  );
}
