import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function PlayerList() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  // 獲取已批准玩家名單
  const { data: playerListData, isLoading: isLoadingList } = trpc.playerList.getApproved.useQuery();

  // 搜尋玩家
  const { data: searchData, isLoading: isSearching } = trpc.playerList.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 0 }
  );

  const players = searchQuery ? searchData?.data : playerListData?.data?.players || [];
  const totalPlayers = playerListData?.data?.totalPlayers || 0;

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-4 py-8">
      <style>{`
        body {
          font-family: 'Noto Serif TC', 'Microsoft JhengHei', 'SimSun', serif;
        }
      `}</style>

      <div className="max-w-4xl w-full mx-auto space-y-8">
        {/* 返回按鈕 */}
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="text-black hover:bg-gray-100"
        >
          ← 返回首頁
        </Button>

        {/* 標題和統計 */}
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold text-black mb-2">Pizza MC 玩家社群</h1>
            <p className="text-lg text-gray-600">已批准加入伺服器的玩家名單</p>
          </div>

          {/* 統計卡片 */}
          <Card className="bg-black text-white p-6 text-center">
            <p className="text-sm text-gray-300 mb-2">伺服器玩家總數</p>
            <p className="text-5xl font-bold">{totalPlayers}</p>
            <p className="text-sm text-gray-300 mt-2">位玩家已加入 Pizza MC</p>
          </Card>
        </div>

        {/* 搜尋欄 */}
        <div className="space-y-3">
          <label className="block text-lg font-semibold text-black">
            搜尋玩家
          </label>
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="輸入玩家名稱搜尋..."
            className="border border-gray-300 rounded p-3 text-base w-full"
          />
        </div>

        {/* 玩家列表 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">
            {searchQuery ? `搜尋結果 (${players?.length || 0})` : "玩家名單"}
          </h2>

          {isLoadingList || isSearching ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
              <p className="text-gray-600 mt-4">載入中...</p>
            </div>
          ) : players && players.length > 0 ? (
            <div className="space-y-3">
              {players.map((player: any, index: number) => (
                <Card
                  key={player.id}
                  className="border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold text-gray-500 w-8">
                          #{index + 1}
                        </span>
                        <div>
                          <p className="text-lg font-semibold text-black">
                            {player.gamertag}
                          </p>
                          <p className="text-sm text-gray-600">
                            加入於 {formatDate(player.joinedAt)}
                          </p>
                          {player.reason && (
                            <p className="text-sm text-gray-700 mt-1 italic">
                              "{player.reason}"
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-50 border border-gray-200 p-8 text-center">
              <p className="text-gray-600 text-lg">
                {searchQuery ? "未找到符合的玩家" : "暫無已批准的玩家"}
              </p>
            </Card>
          )}
        </div>

        {/* 伺服器資訊 */}
        <Card className="bg-gray-50 border border-gray-200 p-6 space-y-4">
          <h3 className="text-xl font-bold text-black">伺服器資訊</h3>
          <div>
            <p className="text-sm text-gray-600 mb-1">伺服器網址</p>
            <p className="text-base font-mono text-black font-semibold">
              pizza-mc.aternos.me
            </p>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-700">
              💡 想加入我們的社群？點擊下方按鈕提交申請。
            </p>
            <Button
              onClick={() => setLocation("/")}
              className="mt-4 bg-black text-white hover:bg-gray-800 w-full py-3"
            >
              提交申請
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
