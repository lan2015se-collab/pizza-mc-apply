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

## 新增功能 - 郵件服務整合
- [ ] 整合 SendGrid 或 AWS SES 郵件服務
- [ ] 建立郵件模板（批准/拒絕通知）
- [ ] 實現真實郵件投遞功能
- [ ] 添加郵件發送失敗重試機制

## 新增功能 - 申請統計儀表板
- [ ] 建立統計數據查詢 API
- [ ] 實現圖表展示（申請趨勢、批准率、月度統計）
- [ ] 建立管理員統計頁面
- [ ] 添加日期範圍篩選功能

## 新增功能 - 申請狀態查詢
- [ ] 建立狀態查詢頁面
- [ ] 實現 Gamertag 查詢 API
- [ ] 顯示申請狀態（待審核/已批准/已拒絕）
- [ ] 若已批准，顯示伺服器資訊

## 新增功能完成狀態
- [x] 整合 SendGrid 郵件服務
- [x] 建立郵件模板（批准/拒絕通知）
- [x] 實現真實郵件投遞功能
- [x] 建立統計數據查詢 API
- [x] 實現圖表展示（申請趨勢、批准率、月度統計）
- [x] 建立管理員統計頁面
- [x] 建立狀態查詢頁面
- [x] 實現 Gamertag 查詢 API
- [x] 顯示申請狀態（待審核/已批准/已拒絕）
- [x] 若已批准，顯示伺服器資訊


## OpenXBL Xbox 認證整合
- [x] 整合 OpenXBL API 用於 Xbox Gamertag 驗證
- [x] 建立 verifyGamertag tRPC 端點
- [x] 添加 OPENXBL_API_KEY 環境變數
- [x] 建立 OpenXBL 服務測試（3 個測試通過）
- [x] 更新 routers.ts 支援 OpenXBL 認證

## OpenXBL 登入流程完成
- [x] 更新首頁 - 用戶輸入 Gamertag 驗證
- [x] 更新申請表單 - 從 sessionStorage 讀取玩家資訊
- [x] 更新伺服器資訊頁面 - 移除 props 使用 sessionStorage
- [x] 更新路由 - 使用新的 /apply 路徑
- [x] 所有 35 個測試通過
- [x] 開發伺服器正常運行


## 緊急修複
- [x] 修複 Logo 顯示問題 - 更新存儲路徑
- [x] 配置 OPENXBL_API_KEY 環境變數 - 已成功設定
- [x] 更新 Loading 文字顯示 - 改為英文 "Loading..."
- [x] 所有 35 個測試通過
- [x] 開發伺服務器正常運行


## 緊急修復 - Render 部署問題
- [ ] 修復 OpenXBL API Forbidden 錯誤
- [ ] 修復 Logo 不顯示問題
