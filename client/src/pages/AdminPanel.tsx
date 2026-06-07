import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AdminPanel() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [notificationEmail, setNotificationEmail] = useState("");

  // 獲取所有申請
  const { data: applicationsData, isLoading, refetch } = trpc.application.list.useQuery(
    { password },
    {
      enabled: isAuthenticated,
    }
  );
  const approveMutation = trpc.application.approve.useMutation();
  const rejectMutation = trpc.application.reject.useMutation();

  const handleLogin = () => {
    if (password === "pizzahut") {
      setIsAuthenticated(true);
      toast.success("登入成功");
      setPassword("");
    } else {
      toast.error("密碼錯誤");
      setPassword("");
    }
  };

  const applications = applicationsData?.data || [];
  const pendingApps = applications.filter((app: any) => app.status === "pending");
  const approvedApps = applications.filter((app: any) => app.status === "approved");
  const rejectedApps = applications.filter((app: any) => app.status === "rejected");

  const handleApprove = async () => {
    if (!selectedApp) {
      toast.error("請選擇申請");
      return;
    }

    try {
      const result = await approveMutation.mutateAsync({
        password,
        applicationId: selectedApp.id,
      });

      if (result.success) {
        toast.success("申請已批准，通知郵件已發送");
        setSelectedApp(null);
        refetch();
      } else {
        toast.error(result.error || "批准失敗");
      }
    } catch (error) {
      toast.error("發生錯誤");
      console.error(error);
    }
  };

  const handleReject = async () => {
    if (!selectedApp || !rejectionReason) {
      toast.error("請填寫所有必填欄位");
      return;
    }

    try {
      const result = await rejectMutation.mutateAsync({
        password,
        applicationId: selectedApp.id,
        reason: rejectionReason,
      });

      if (result.success) {
        toast.success("申請已拒絕，通知郵件已發送");
        setSelectedApp(null);
        setRejectionReason("");
        refetch();
      } else {
        toast.error(result.error || "拒絕失敗");
      }
    } catch (error) {
      toast.error("發生錯誤");
      console.error(error);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString("zh-TW");
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "待審核" },
      approved: { bg: "bg-green-100", text: "text-green-800", label: "已批准" },
      rejected: { bg: "bg-red-100", text: "text-red-800", label: "已拒絕" },
    };
    const s = statusMap[status] || statusMap.pending;
    return (
      <span className={`${s.bg} ${s.text} px-3 py-1 rounded-full text-sm font-semibold`}>
        {s.label}
      </span>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <style>{`
          body {
            font-family: 'Noto Serif TC', 'Microsoft JhengHei', 'SimSun', serif;
          }
        `}</style>

        <div className="max-w-md w-full space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-black">管理員登入</h1>
            <p className="text-gray-600">請輸入密碼以存取管理員面板</p>
          </div>

          <Card className="border border-gray-200 p-8 space-y-6">
            <div className="space-y-3">
              <label className="block text-base font-semibold text-black">
                密碼
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                placeholder="輸入管理員密碼"
                className="w-full border border-gray-300 rounded p-3 text-base"
                autoFocus
              />
            </div>

            <Button
              onClick={handleLogin}
              className="w-full bg-black text-white hover:bg-gray-800 py-3 text-base font-semibold"
            >
              登入
            </Button>
          </Card>

          <Button
            onClick={() => setLocation("/")}
            variant="outline"
            className="w-full border border-gray-300 text-black hover:bg-gray-100"
          >
            返回首頁
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col px-4 py-8">
      <style>{`
        body {
          font-family: 'Noto Serif TC', 'Microsoft JhengHei', 'SimSun', serif;
        }
      `}</style>

      <div className="max-w-6xl w-full mx-auto space-y-8">
        {/* 返回按鈕 */}
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="text-black hover:bg-gray-100"
        >
          ← 返回首頁
        </Button>

        {/* 標題 */}
        <div>
          <h1 className="text-4xl font-bold text-black">管理員審核面板</h1>
          <p className="text-lg text-gray-600 mt-2">審核和管理伺服器申請</p>
        </div>

        {/* 統計卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-yellow-50 border border-yellow-200 p-6">
            <p className="text-sm text-yellow-600 mb-2">待審核申請</p>
            <p className="text-3xl font-bold text-yellow-800">{pendingApps.length}</p>
          </Card>
          <Card className="bg-green-50 border border-green-200 p-6">
            <p className="text-sm text-green-600 mb-2">已批准申請</p>
            <p className="text-3xl font-bold text-green-800">{approvedApps.length}</p>
          </Card>
          <Card className="bg-red-50 border border-red-200 p-6">
            <p className="text-sm text-red-600 mb-2">已拒絕申請</p>
            <p className="text-3xl font-bold text-red-800">{rejectedApps.length}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 申請列表 */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold text-black">申請列表</h2>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
                <p className="text-gray-600 mt-4">載入中...</p>
              </div>
            ) : applications.length > 0 ? (
              <div className="space-y-3">
                {applications.map((app: any) => (
                  <Card
                    key={app.id}
                    className={`border p-4 cursor-pointer transition-all ${
                      selectedApp?.id === app.id
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                    onClick={() => setSelectedApp(app)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="text-lg font-semibold text-black">
                            {app.gamertag}
                          </p>
                          {getStatusBadge(app.status)}
                        </div>
                        <p className="text-sm text-gray-600">
                          申請時間：{formatDate(app.createdAt)}
                        </p>
                        <p className="text-sm text-gray-700 mt-2">
                          <span className="font-semibold">原因：</span> {app.reason}
                        </p>
                        {app.applicantEmail && (
                          <p className="text-sm text-gray-600 mt-2">
                            <span className="font-semibold">郵箱：</span> {app.applicantEmail}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-50 border border-gray-200 p-8 text-center">
                <p className="text-gray-600">暫無申請</p>
              </Card>
            )}
          </div>

          {/* 審核面板 */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-black">審核操作</h2>

            {selectedApp ? (
              <Card className="border border-gray-200 p-6 space-y-4">
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600 mb-1">選中申請</p>
                  <p className="text-lg font-bold text-black">{selectedApp.gamertag}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    狀態：{selectedApp.status}
                  </p>
                  {selectedApp.applicantEmail && (
                    <p className="text-xs text-gray-500 mt-1">
                      郵箱：{selectedApp.applicantEmail}
                    </p>
                  )}
                </div>

                {selectedApp.status === "pending" && (
                  <>
                    <div className="space-y-2">
                      <Button
                        onClick={handleApprove}
                        disabled={approveMutation.isPending}
                        className="w-full bg-green-600 text-white hover:bg-green-700 py-2"
                      >
                        {approveMutation.isPending ? "處理中..." : "批准申請"}
                      </Button>
                    </div>

                    <div className="border-t border-gray-200 pt-4 space-y-2">
                      <label className="block text-sm font-semibold text-black">
                        拒絕原因
                      </label>
                      <Textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="填寫拒絕原因..."
                        className="border border-gray-300 rounded p-2 text-sm min-h-24"
                      />
                      <Button
                        onClick={handleReject}
                        disabled={rejectMutation.isPending || !rejectionReason}
                        className="w-full bg-red-600 text-white hover:bg-red-700 py-2"
                      >
                        {rejectMutation.isPending ? "處理中..." : "拒絕申請"}
                      </Button>
                    </div>
                  </>
                )}

                {selectedApp.status !== "pending" && (
                  <Card className="bg-gray-50 border border-gray-200 p-4 text-center">
                    <p className="text-sm text-gray-600">
                      此申請已{selectedApp.status === "approved" ? "批准" : "拒絕"}，無法修改。
                    </p>
                  </Card>
                )}
              </Card>
            ) : (
              <Card className="bg-gray-50 border border-gray-200 p-6 text-center">
                <p className="text-gray-600">選擇一個申請以進行審核</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
