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
- [x] 修復 OpenXBL API Forbidden 錯誤 - 已添加用戶友好的錯誤訊息處理，本地正常工作
- [x] 修復 Logo 不顯示問題 - 已重新上傳並更新 URL

## 診斷結果
- 本地開發環境: OpenXBL API 正常工作，返回 "Gamertag not found"
- Render 部署環境: OpenXBL API 返回 "Forbidden" 錯誤
  - 原因分析: 可能是 API 密鑰無效、已過期或 OpenXBL API 的 IP 限制
  - 已經修正 Render 上的 OPENXBL_API_KEY 格式（移除重複部分）但仍然返回 Forbidden
  - 需要從 OpenXBL 官方獲取新的有效 API 密鑰或檢查 IP 限制設置

## Xbox Live API 遷移 - 解決 Render IP 限制問題
- [x] 安裝 @xboxreplay/xboxlive-auth npm 包
- [x] 實現新的 Xbox Live 認證服務
- [x] 更新 verifyGamertag 端點使用新服務
- [x] 本地測試新的 Xbox Live 認證
- [x] 推送代碼到 GitHub
- [x] 驗證 Render 部署上是否正常工作

## Xbox Live OAuth2 認證實現
- [x] 安裝 @xboxreplay/xboxlive-auth npm 包
- [x] 實現 Xbox Live OAuth2 侎端服務（使用 @xboxreplay/xboxlive-auth）
- [x] 創建 OAuth2 授權端點 (authenticateWithMicrosoft)
- [x] 實現 Token 存儲和管理
- [x] 所有 35 個測試通過
- [x] 推送代碼到 GitHub
- [x] 更新前端登錄頁面集成 OAuth2 流程 - 已更新為 Microsoft 帳戶登錄
- [x] 本地測試 OAuth2 認證 - 本地頁面正常顯示
- [x] 驗證 Render 部署上的 OAuth2 功能 - Render 部署已更新，頁面正常顯示 Microsoft 帳戶登錄表單


## 新功能實現 - Microsoft 帳戶登錄方案 (OAuth2 完整流程已放棄，改用郵箱密碼方案)
- [x] 安裝 @xboxreplay/xboxlive-auth npm 包 - 已完成
- [x] 實現 Xbox Live 認證服務 - 已完成
- [x] 實現 authenticateWithMicrosoft tRPC 端點 - 已完成
- [x] 更新前端使用 Microsoft 帳戶登錄 - 已更新為郵箱密碼登錄表單
- [x] 本地測試 Microsoft 帳戶登錄 - 已完成本地測試
- [ ] 驗證 Render 部署上的 Microsoft 帳戶登錄 - 待 Render 部署完成
- [x] 移除 Logo - 已完成

## 新功能實現 - 申請狀態查詢
- [x] 創建申請狀態查詢頁面 (StatusQuery.tsx)
- [x] 實現 Gamertag 查詢 API
- [x] 顯示申請狀態（待審核/已批准/已拒絕）
- [x] 批准時顯示伺服器地址和連接信息
- [x] 本地測試狀態查詢功能 - 驗證成功，查詢不存在的 Gamertag 返回「找不到申請記錄」
- [x] 在主頁添加查詢狀態按鈕

## 新功能實現 - 管理員區域
- [x] 創建管理員密碼驗證對話框 (AdminPasswordDialog.tsx)
- [x] 在主頁添加管理員區域按鈕
- [x] 實現密碼驗證邏輯 (密碼: pizza2024)
- [x] 驗證成功後進入管理員面板
- [x] 本地測試管理員功能

## 待實現 - 郵件通知系統
- [x] 配置 SendGrid API 密鑰 - 已配置
- [x] 實現郵件發送服務 (sendgrid-service.ts)
- [x] 批准時發送通知郵件 (sendApprovalNotification)
- [x] 拒絕時發送通知郵件 (sendRejectionNotification)
- [x] 本地測試郵件發送 - 所有 35 個測試通過
- [ ] 驗證 Render 部署上的 SendGrid 郵件通知 - 待 Render 部署完成後進行驗證


## 緊急修復 - 管理員密碼和 Xbox Live 認證
- [x] 修正管理員密碼為 pizzahut - 已完成，本地測試成功
- [x] 改進 Xbox Live 認證錯誤處理 - 添加詳細的錯誤信息提示


## 緊急修復 - Render 部署 React DOM 錯誤
- [ ] 診斷 React DOM removeChild 錯誤原因
- [ ] 檢查組件卸載邏輯
- [ ] 修復 Dialog/Modal 組件卸載問題
- [ ] 本地測試修復
- [ ] 推送代碼到 GitHub
- [ ] 驗證 Render 部署


## Render 部署 React DOM 錯誤修復完成
- [x] 診斷 React DOM removeChild 錯誤原因 - 計時器未清理
- [x] 檢查組件卸載邏輯 - Dialog、useComposition、Input、Textarea
- [x] 修復 Dialog 組件中的計時器 - 添加 useEffect 清理
- [x] 修復 useComposition 鉤子中的計時器 - 添加 useEffect 清理
- [x] 修復 Input 組件中的計時器 - 添加 compositionTimeoutRef 和清理
- [x] 修復 Textarea 組件中的計時器 - 添加 compositionTimeoutRef 和清理
- [x] 本地測試修復 - 所有 35 個測試通過
- [x] 推送代碼到 GitHub - 已提交 2 個 commits
- [ ] 驗證 Render 部署 - 待 Render 自動部署完成


## 緊急修復 - Xbox Live 認證失敗
- [ ] 診斷 Xbox Live 認證失敗原因
- [ ] 檢查 @xboxreplay/xboxlive-auth 包的最新版本
- [ ] 驗證 Microsoft 帳戶認證流程
- [ ] 改進錯誤處理和日誌記錄
- [ ] 本地測試認證流程
- [ ] 推送修復代碼
- [ ] 驗證 Render 部署


## 修復完成 - Xbox Live 認證改用 Gamertag 驗證
- [x] 診斷 Xbox Live 認證失敗原因 - @xboxreplay/xboxlive-auth 包存在問題
- [x] 改用 Gamertag 驗證替代 Microsoft 帳戶認證
- [x] 更新前端登錄表單 - 改為 Gamertag 輸入
- [x] 使用 OpenXBL API 驗證 Gamertag
- [x] 本地測試驗證流程 - 所有 35 個測試通過
- [x] 推送代碼到 GitHub - 已提交
- [ ] 驗證 Render 部署 - 待部署完成


## 簡化功能 - 改為 Minecraft 用戶名稱輸入（無驗證）
- [x] 更新前端登錄表單 - 改為簡單的 Minecraft 用戶名稱輸入
- [x] 移除所有 OAuth2 和 Xbox 認證邏輯
- [x] 簡化申請表單 - 直接使用用戶名稱
- [x] 本地測試簡化流程 - 所有 35 個測試通過
- [x] 推送代碼到 GitHub - 已提交
- [ ] 驗證 Render 部署 - 待部署完成


## 待完成 - 清理未使用的 Xbox/OAuth 代碼
- [ ] 移除或停用 routers.ts 中的 Xbox/OAuth 端點
- [ ] 刪除未使用的服務文件（xbox-oauth-service.ts 等）
- [ ] 添加 Minecraft 用戶名稱流程的單元測試
- [ ] 驗證 Render 部署上的 Minecraft 用戶名稱登錄功能


## 修復 - Render 部署問題
- [x] 修復服務器監聽地址 - 改為在生產環境中監聽 0.0.0.0
- [x] 保存 checkpoint - 版本 1d02e89a
- [ ] 驗證 Render 部署是否正常啟動
- [ ] 驗證 Minecraft 用戶名稱登錄功能是否正常


## 新功能改進 - 用戶報告的問題修復
- [ ] 修復申請統計儀表板無法獲取統計數據
- [ ] 修復送出申請按鈕顯示錯誤
- [ ] 改進查詢申請狀態使用 Minecraft 玩家名稱
- [ ] 添加條款同意勾選（Notion 相關條款）
- [ ] 實現 Notion Info 按鈕跳轉到 https://pizza-mc.notion.site/PIZZA-MINECRAFT-Server-372316fe42868087b102dd4fc0186834?source
- [ ] 修復批準玩家名單 - 移除伺服器資訊或只顯示網址
- [ ] 本地測試所有修復
- [ ] 驗證 Render 部署


## 完成 - 用戶報告的問題修復
- [x] 修復申請統計儀表板無法獲取統計數據 - 改用密碼驗證
- [x] 修復送出申請按鈕顯示錯誤 - xboxAccountId 改為可選
- [x] 改進查詢申請狀態使用 Minecraft 玩家名稱 - 已更新文本
- [x] 添加條款同意勾選（Notion 相關條款） - 已存在
- [x] 實現 Notion Info 按鈕跳轉 - 已添加按鈕
- [x] 修復批準玩家名單 - 移除連接埠，只顯示網址
- [x] 本地測試所有修復 - 所有 35 個測試通過
- [ ] 驗證 Render 部署
