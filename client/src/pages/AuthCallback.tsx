import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AuthCallback() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const verifyMutation = trpc.application.verifyXboxAccount.useMutation();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // 從 URL 獲取授權碼
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const error = params.get("error");

        if (error) {
          toast.error(`認證失敗: ${error}`);
          setLocation("/");
          return;
        }

        if (!code) {
          toast.error("未收到授權碼");
          setLocation("/");
          return;
        }

        // 將授權碼發送到後端以交換 access token
        // 注意：實際應用中應該在後端進行此操作以保護 client secret
        // 這裡我們假設後端已經設置了適當的 OAuth 流程

        // 由於我們使用的是 Manus OAuth，我們需要通過後端交換 token
        // 首先獲取 Manus token，然後使用它來獲取 Xbox token

        // 暫時使用 code 作為 access token（實際應用中需要適當的 token 交換）
        const result = await verifyMutation.mutateAsync({
          accessToken: code,
        });

        if (result.success && result.data) {
          const { gamertag, xboxAccountId } = result.data;
          // 導向申請表單
          setLocation(`/application?gamertag=${encodeURIComponent(gamertag)}&xboxAccountId=${encodeURIComponent(xboxAccountId)}`);
        } else {
          toast.error(result.error || "Xbox 驗證失敗");
          setLocation("/");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        toast.error("認證過程中發生錯誤");
        setLocation("/");
      } finally {
        setIsLoading(false);
      }
    };

    handleCallback();
  }, [setLocation, verifyMutation]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <style>{`
        body {
          font-family: 'Noto Serif TC', 'Microsoft JhengHei', 'SimSun', serif;
        }
      `}</style>
      
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
        <p className="text-lg text-gray-600">正在驗證您的 Xbox 帳號...</p>
      </div>
    </div>
  );
}
