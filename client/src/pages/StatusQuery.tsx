import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Clock, XCircle, Copy, Check } from "lucide-react";

export default function StatusQuery() {
  const [gamertag, setGamertag] = useState("");
  const [copied, setCopied] = useState(false);
  const statusQuery = trpc.status.getByGamertag.useQuery(
    { gamertag },
    { enabled: false }
  );

  const handleSearch = () => {
    if (gamertag.trim()) {
      statusQuery.refetch();
    }
  };

  const handleCopyAddress = () => {
    if (statusQuery.data?.data?.serverAddress) {
      navigator.clipboard.writeText(statusQuery.data.data.serverAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="w-4 h-4 mr-1" />
            已批准
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500 text-white">
            <Clock className="w-4 h-4 mr-1" />
            待審核
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500 text-white">
            <XCircle className="w-4 h-4 mr-1" />
            已拒絕
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">查詢申請狀態</h1>
          <p className="text-slate-600">輸入您的 Minecraft 玩家名稱查詢申請進度</p>
        </div>

        {/* 搜尋表單 */}
        <Card className="p-6 mb-6 shadow-lg">
          <div className="flex gap-2">
            <Input
              placeholder="輸入您的 Minecraft 玩家名稱"
              value={gamertag}
              onChange={(e) => setGamertag(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button
              onClick={handleSearch}
              disabled={statusQuery.isLoading}
              className="px-6"
            >
              {statusQuery.isLoading ? "搜尋中..." : "搜尋"}
            </Button>
          </div>
        </Card>

        {/* 結果顯示 */}
        {statusQuery.isError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {statusQuery.error?.message || "搜尋失敗，請重試"}
            </AlertDescription>
          </Alert>
        )}

        {statusQuery.data?.success && statusQuery.data?.data && (
          <Card className="p-6 shadow-lg">
            <div className="space-y-6">
              {/* 基本信息 */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  {statusQuery.data.data.gamertag}
                </h2>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-slate-600">申請狀態：</span>
                  {getStatusBadge(statusQuery.data.data.status)}
                </div>
              </div>

              {/* 申請詳情 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-t border-b border-slate-200">
                <div>
                  <p className="text-sm text-slate-600 mb-1">申請時間</p>
                  <p className="font-semibold text-slate-900">
                    {new Date(statusQuery.data.data.appliedAt).toLocaleDateString("zh-TW", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">申請理由</p>
                  <p className="font-semibold text-slate-900">
                    {statusQuery.data.data.reason || "未提供"}
                  </p>
                </div>
              </div>

              {/* 批准後顯示伺服器信息 */}
              {statusQuery.data.data.status === "approved" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-bold text-green-900 mb-3">🎮 伺服器連接信息</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-green-700 mb-1">伺服器地址</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 bg-white px-3 py-2 rounded border border-green-200 font-mono text-sm">
                          {statusQuery.data.data.serverAddress}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCopyAddress}
                          className="text-green-700 border-green-300 hover:bg-green-50"
                        >
                          {copied ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-green-700 mb-1">伺服器端口</p>
                      <code className="bg-white px-3 py-2 rounded border border-green-200 font-mono text-sm block">
                        {statusQuery.data.data.serverPort}
                      </code>
                    </div>
                    <p className="text-sm text-green-700 mt-3">
                      📝 在 Minecraft 客戶端中，進入「多人遊戲」→「添加伺服器」，輸入上述地址和端口即可加入！
                    </p>
                  </div>
                </div>
              )}

              {/* 拒絕提示 */}
              {statusQuery.data.data.status === "rejected" && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    您的申請已被拒絕。如有疑問，請聯繫管理員。
                  </AlertDescription>
                </Alert>
              )}

              {/* 待審核提示 */}
              {statusQuery.data.data.status === "pending" && (
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    您的申請正在審核中，請耐心等待。我們會在審核完成後通過郵件通知您。
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </Card>
        )}

        {statusQuery.data?.success === false && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{statusQuery.data.error}</AlertDescription>
          </Alert>
        )}

        {/* 提示信息 */}
        {!statusQuery.data && (
          <Card className="p-6 bg-blue-50 border-blue-200">
            <p className="text-slate-700 text-center">
              輸入您的 Xbox Gamertag 查詢申請狀態。如果找不到記錄，請檢查 Gamertag 是否正確。
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
