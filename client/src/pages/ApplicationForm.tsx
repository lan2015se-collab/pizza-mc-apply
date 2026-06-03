import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ApplicationFormProps {
  gamertag: string;
  xboxAccountId: string;
}

export default function ApplicationForm({ gamertag, xboxAccountId }: ApplicationFormProps) {
  const [, setLocation] = useLocation();
  const [reason, setReason] = useState("");
  const [notionChecked, setNotionChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const submitMutation = trpc.application.submit.useMutation();

  const handleSubmit = async () => {
    // 驗證
    if (!reason.trim()) {
      toast.error("請填寫申請原因");
      return;
    }

    if (!notionChecked) {
      toast.error("請勾選已閱讀 Notion 資訊頁面");
      return;
    }

    setIsLoading(true);
    try {
      const result = await submitMutation.mutateAsync({
        gamertag,
        xboxAccountId,
        reason: reason.trim(),
      });

      if (result.success) {
        toast.success("申請已提交");
        // 導向伺服器資訊頁面
        setLocation(`/server-info?gamertag=${encodeURIComponent(gamertag)}&xboxAccountId=${encodeURIComponent(xboxAccountId)}`);
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

        {/* 標題 */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-black">申請加入 Pizza MC</h1>
          <p className="text-gray-600">玩家：<span className="font-mono font-semibold">{gamertag}</span></p>
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

          {/* Notion 勾選框 */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="notion-check"
              checked={notionChecked}
              onCheckedChange={(checked) => setNotionChecked(checked as boolean)}
              className="mt-1"
            />
            <label
              htmlFor="notion-check"
              className="text-base text-gray-700 cursor-pointer leading-relaxed"
            >
              我已閱讀 Notion 資訊頁面並同意伺服器規則
            </label>
          </div>

          {/* 提交按鈕 */}
          <div className="pt-4">
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !reason.trim() || !notionChecked}
              className="w-full bg-black text-white hover:bg-gray-800 py-6 text-lg font-semibold"
            >
              {isLoading ? "提交中..." : "繼續"}
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
