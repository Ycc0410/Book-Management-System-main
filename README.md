# BookTracker - 個人書籍管理系統

## 專案簡介
BookTracker 是一個現代化的個人書籍管理系統，提供直覺的使用者介面來管理個人書籍收藏。系統採用前後端分離架構，實現了完整的 CRUD 功能，包含使用者認證和權限管理，並具有響應式設計，能夠適應不同的螢幕尺寸。

## 功能特色
### 基礎功能
- 書籍資訊管理（新增、編輯、刪除）
- 閱讀狀態追蹤（未讀、閱讀中、已讀完）
- 即時搜尋和過濾
- 響應式設計，支援多種裝置
- 簡潔現代的使用者介面

### 使用者系統
- 帳號註冊與登入功能
- JWT Token 認證機制
- 角色權限管理（管理員/一般使用者）
- 個人書籍資料隱私保護

## 系統架構
### 系統架構圖 (非AI生成)![架構圖](https://github.com/user-attachments/assets/d2801f6c-6a3e-41dd-bd19-1bf5538a6b91)
### 系統流程圖 (非AI生成)![流程圖](https://github.com/user-attachments/assets/cfcc8488-c470-4661-88d9-85052732eb6e)
### 前端 (Frontend)
- **框架**: React 18 + Vite
- **UI 框架**: Tailwind CSS
- **狀態管理**: React Hooks
- **圖標**: Lucide React
- **HTTP 客戶端**: Fetch API
- **認證管理**: JWT Token

### 後端 (Backend)
- **執行環境**: Node.js
- **框架**: Express.js
- **資料庫**: MongoDB
- **ODM**: Mongoose
- **認證**: JWT (JSON Web Tokens)
- **密碼加密**: bcrypt


## 系統需求
- Node.js >= 14.0.0
- MongoDB >= 4.0
- npm >= 6.0.0
- 現代瀏覽器（Chrome, Firefox, Safari, Edge）

## API 文件
### 認證相關
- POST /api/auth/register - 註冊新用戶
- POST /api/auth/login - 用戶登入

### 書籍管理
- GET /api/books - 獲取書籍列表 
- POST /api/books - 新增書籍
- PUT /api/books/:id - 更新書籍
- DELETE /api/books/:id - 刪除書籍

## 權限說明
### 管理員權限
- 可以查看所有用戶的書籍
- 可以管理所有書籍（新增、編輯、刪除）
- 擁有完整的系統管理權限

### 一般用戶權限
- 只能查看自己的書籍
- 只能管理自己的書籍
- 不能查看或修改其他用戶的資料

## 技術特點
- 使用 JWT 進行身份驗證
- bcrypt 密碼加密
- RESTful API 設計
- 非同步操作使用 async/await
- 使用 ESLint 進行程式碼品質控制

## 執行指引
**安裝後端依賴**

cd backend
npm install

**設定後端環境變數**
建立 .env 文件：

env MONGODB_URI=mongodb://localhost:27017/bookmanagement
PORT=5001

**啟動後端服務**

npm start

**安裝前端依賴**

cd frontend
npm install

**啟動前端開發服務器**

npm run dev
