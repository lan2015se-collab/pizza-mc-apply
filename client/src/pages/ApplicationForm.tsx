import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function ApplicationForm() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [reason, setReason] = useState("");
  const [notionChecked, setNotionChecked] = useState(false);
  const [applicantEmail, setApplicantEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const submitMutation = trpc.application.submit.useMutation();

  useEffect(() => {
    // 從 sessionStorage 讀取用戶名稱
    const storedUsername = sessionStorage.getItem("minecraftUsername");
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      toast.error("未找到用戶名稱，請重新登入");
      setLocation("/");
    }
    setIsInitializing(false);
  }, [setLocation]);

  const handleSubmit = async () => {
    if (!username) {
      toast.error("用戶名稱丟失，請重新登入");
      return;
    }

    // 驗證
    if (!reason.trim()) {
      toast.error("請填寫申請原因");
      return;
    }

    if (!applicantEmail.trim()) {
      toast.error("請填寫郵箱地址");
      return;
    }

    // 簡單的郵箱驗證
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(applicantEmail.trim())) {
      toast.error("請輸入有效的郵箱地址");
      return;
    }

    if (!notionChecked) {
      toast.error("請勾選已閱讀 Notion 資訊頁面");
      return;
    }

    setIsLoading(true);
    try {
      const result = await submitMutation.mutateAsync({
        gamertag: username,
        xboxAccountId: "", // 不需要 Xbox 帳號
        reason: reason.trim(),
        applicantEmail: applicantEmail.trim(),
      });

      if (result.success) {
        toast.success("申請已提交，請等待審核結果");
        // 清除 sessionStorage 並導向首頁
        sessionStorage.removeItem("minecraftUsername");
        setLocation("/");
      } else {
        toast.error(result.error || "申請提交失敗");
      }
    } catch (error) {
      toast.error("發生錯誤，請重試");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">載入中...</p>
      </div>
    );
  }

  if (!username) {
    return null;
  }

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
          onClick={() => {
            sessionStorage.removeItem("minecraftUsername");
            setLocation("/");
          }}
          className="text-black hover:bg-gray-100"
        >
          ← 返回
        </Button>

        {/* 標題 */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-black">申請加入 Pizza MC</h1>
          <p className="text-gray-600">玩家：<span className="font-mono font-semibold text-black">{username}</span></p>
        </div>

        {/* 表單卡片 */}
        <Card className="border border-gray-200 p-8 space-y-6">
          {/* 申請原因 */}
          <div className="space-y-3">
            <label className="block text-lg font-semibold text-black">
              Why do you want to join?
            </label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="請說明您想加入 Pizza MC 伺服器的原因..."
              className="min-h-32 border border-gray-300 rounded p-3 text-base font-serif"
            />
          </div>

          {/* 郵箱地址 */}
          <div className="space-y-3">
            <label className="block text-lg font-semibold text-black">
              郵箱地址 <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              value={applicantEmail}
              onChange={(e) => setApplicantEmail(e.target.value)}
              placeholder="您的郵箱地址"
              className="w-full border border-gray-300 rounded p-3 text-base"
            />
            <p className="text-sm text-gray-600">
              💡 審核結果將通過郵件發送至此地址
            </p>
          </div>

          {/* Notion 勾選框 */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="notion-check"
              checked={notionChecked}
              onCheckedChange={(checked) => setNotionChecked(checked as boolean)}
              className="mt-1"
            />
            <div className="flex-1">
              <label
                htmlFor="notion-check"
                className="text-base text-gray-700 cursor-pointer leading-relaxed"
              >
                我已閱讀 Notion 資訊頁面並同意伺服器規則
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open("https://pizza-mc.notion.site/PIZZA-MINECRAFT-Server-372316fe42868087b102dd4fc0186834?source", "_blank")}
                className="mt-2"
              >
                檢視 Notion 資訊
              </Button>
            </div>
          </div>

          {/* 提交按鈕 */}
          <div className="pt-4">
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !reason.trim() || !applicantEmail.trim() || !notionChecked}
              className="w-full bg-black text-white hover:bg-gray-800 py-6 text-lg font-semibold"
            >
              {isLoading ? "提交中..." : "提交申請"}
            </Button>
          </div>
        </Card>

        {/* 提示信息 */}
        <Card className="bg-blue-50 border border-blue-200 p-4">
          <p className="text-sm text-blue-800">
            💡 提示：請確保您已詳細閱讀伺服器規則和相關資訊，這將幫助您更好地融入社群。
          </p>
        </Card>
      </div>
    </div>
  );
}
