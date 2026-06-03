# Pizza MC Apply - 開發待辦清單

## 核心功能
- [x] 設定 Xbox/Microsoft OAuth 認證流程
- [x] 實作 Xbox Live API 呼叫以取得 Gamertag
- [x] 建立申請表單頁面（Why do you want to join? + Notion 勾選框）
- [x] 建立伺服器資訊顯示頁面
- [x] 實作 Aternos 用戶名稱輸入與 Gmail 自動填入功能
- [x] 建立申請記錄資料庫表格
- [x] 實作申請資料儲存功能

## 前端介面
- [x] 設定純白背景 + 新細明體字體全局樣式
- [x] 上傳並顯示 Pizza MC Logo
- [x] 建立 Xbox 登入頁面
- [x] 建立申請表單頁面
- [x] 建立伺服器資訊頁面
- [x] 實作頁面導航流程

## 後端 API
- [x] 建立 Xbox OAuth 回調端點
- [x] 建立 Xbox Gamertag 查詢端點
- [x] 建立申請表單提交端點
- [x] 建立申請記錄查詢端點

## 資料庫
- [x] 建立申請記錄表格（applications）
- [x] 設定表格欄位（gamertag, reason, aternos_username, created_at)）

## GitHub 與部署
- [x] 建立 GitHub 儲存庫 pizza-mc-apply
- [x] 推送所有程式碼至 GitHub
- [x] 驗證部署成功

## 已完成
- [x] 初始化 WebDev 專案（web-db-user 架構）


## 新增功能 - 郵件通知系統
- [x] 建立郵件發送服務（使用 Manus 內建 API）
- [x] 實作申請審核狀態更新 API
- [x] 建立申請審核管理员介面
- [x] 實作申請被批准時的郵件通知
- [x] 實作申請被拒絕時的郵件通知

## 新增功能 - 玩家名單管理
- [x] 建立已批准玩家公開名單頁面
- [x] 實作玩家名單篩選與搜尋
- [x] 建立玩家統計資訊（總人數、加入日期等）
- [x] 設計玩家名單的視覺呈現
