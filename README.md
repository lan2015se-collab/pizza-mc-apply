# Pizza MC - Minecraft Server Application Website

一個簡潔正式的 Minecraft 伺服器申請網站，整合 Xbox 身份驗證與自動化申請流程。

## 功能特性

### 核心功能
- **Xbox OAuth 認證** - 透過 Microsoft 帳號安全登入
- **玩家驗證** - 自動驗證 Xbox Gamertag 和遊戲所有權
- **申請表單** - 收集玩家申請原因和相關資訊
- **伺服器資訊** - 顯示伺服器地址和連接埠
- **Aternos 整合** - 自動填入 Gmail 郵件並發送申請資訊
- **資料庫儲存** - 完整記錄所有申請

### 設計特色
- 純白背景設計
- 新細明體字體
- 響應式介面
- 簡潔正式風格

## 技術棧

- **前端**: React 19 + Tailwind CSS 4 + TypeScript
- **後端**: Express 4 + tRPC 11 + Node.js
- **資料庫**: MySQL/TiDB
- **認證**: Microsoft OAuth 2.0 + Xbox Live API
- **測試**: Vitest

## 項目結構

```
pizza-mc-apply/
├── client/                 # 前端應用
│   ├── src/
│   │   ├── pages/         # 頁面組件
│   │   │   ├── Home.tsx           # 首頁 - Xbox 登入
│   │   │   ├── AuthCallback.tsx   # OAuth 回調
│   │   │   ├── ApplicationForm.tsx # 申請表單
│   │   │   └── ServerInfo.tsx     # 伺服器資訊
│   │   ├── components/    # UI 組件
│   │   ├── lib/           # 工具函數
│   │   └── index.css      # 全局樣式
│   └── index.html         # HTML 入口
├── server/                 # 後端應用
│   ├── routers.ts         # tRPC 路由定義
│   ├── db.ts              # 資料庫查詢
│   ├── xbox-auth.ts       # Xbox OAuth 流程
│   └── _core/             # 核心基礎設施
├── drizzle/               # 資料庫架構
│   ├── schema.ts          # 表格定義
│   └── migrations/        # 遷移文件
├── shared/                # 共享代碼
└── package.json           # 依賴管理
```

## 使用者流程

1. **首頁** - 使用者點擊「使用 Xbox 帳號登入」
2. **Xbox 認證** - 重導向至 Microsoft OAuth 登入
3. **申請表單** - 填寫申請原因並勾選 Notion 資訊頁面確認
4. **伺服器資訊** - 顯示伺服器詳細資訊
5. **Aternos 註冊** - 輸入 Aternos 用戶名稱並發送郵件

## 資料庫架構

### users 表
- 儲存 Manus OAuth 用戶資訊
- 包含用戶角色和登入時間戳記

### applications 表
- 儲存 Minecraft 伺服器申請記錄
- 欄位：gamertag, xboxAccountId, reason, aerternosUsername, status, createdAt, updatedAt

## API 端點

### tRPC 路由

```typescript
// Xbox 帳號驗證
application.verifyXboxAccount(accessToken)

// 提交申請
application.submit({
  gamertag,
  xboxAccountId,
  reason,
  aerternosUsername
})

// 獲取所有申請
application.list()
```

## 開發指南

### 安裝依賴
```bash
pnpm install
```

### 開發模式
```bash
pnpm dev
```

### 運行測試
```bash
pnpm test
```

### 構建生產版本
```bash
pnpm build
```

### 啟動生產伺服器
```bash
pnpm start
```

## 環境變數

```env
DATABASE_URL=mysql://user:password@host/database
JWT_SECRET=your-secret-key
VITE_APP_ID=your-manus-app-id
OAUTH_SERVER_URL=https://api.manus.im
```

## 伺服器資訊

- **伺服器地址**: pizza-mc.aternos.me
- **連接埠**: 23775
- **聯絡郵箱**: lan.2015.se@gmail.com

## 測試

專案包含完整的單元測試：

```bash
# 運行所有測試
pnpm test

# 監視模式
pnpm test --watch
```

測試涵蓋：
- Xbox 認證流程驗證
- 申請表單驗證
- 資料庫操作

## 部署

網站已部署至 Manus WebDev 平台，支援自動部署和自定義域名。

## 貢獻

歡迎提交 Issue 和 Pull Request！

## 許可證

MIT

## 聯絡方式

如有任何問題，請聯絡 lan.2015.se@gmail.com
