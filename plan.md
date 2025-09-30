# 財務 AccountAnalysis 轉換工具 - 專案規劃

## 🎯 專案概述

**專案名稱**: 財務 AccountAnalysis 轉換工具  
**版本**: 1.0.0  
**技術棧**: React 18 + Vite + Tailwind CSS + PapaParse + XLSX + Canvas Confetti  
**開發時間**: 2025年1月  

## 📋 功能需求

### 核心功能
1. **檔案上傳**: 支援 CSV 和 Excel (.xlsx, .xls) 檔案格式
2. **格式轉換**: 將來源檔案轉換為標準的10個欄位格式
3. **格式保護**: 確保所有欄位保持原始格式，不被自動轉換
4. **檔案下載**: 轉換完成後提供下載功能
5. **動畫效果**: 轉換完成後觸發彩帶動畫

### 目標欄位順序
```
1. PARTY_NUMBER
2. PARTY_NAME
3. PERIOD_NAME
4. NATURAL_ACCOUNT_SEGMENT
5. NATURAL_ACCOUNT_DESC
6. GL_DATE
7. TRANSACTION_NUMBER
8. LINE_DESCRIPTION
9. ACCOUNTED_DR
10. ACCOUNTED_CR
```

## 🛠 技術架構

### 前端技術
- **React 18**: 現代化UI框架
- **Vite**: 快速開發環境
- **Tailwind CSS**: 響應式UI設計
- **PapaParse**: CSV檔案處理
- **XLSX**: Excel檔案處理
- **Canvas Confetti**: 彩帶動畫效果

### 專案結構
```
AccountAnalysis/
├── src/
│   ├── App.jsx          # 主要應用組件
│   ├── App.css          # 自定義樣式
│   ├── main.jsx         # 應用入口
│   └── index.css        # 全域樣式
├── public/              # 靜態資源
├── package.json         # 依賴管理
├── vite.config.js       # Vite配置
├── tailwind.config.js   # Tailwind配置
├── postcss.config.js    # PostCSS配置
├── index.html          # HTML模板
└── README.md           # 專案說明
```

## 🔧 核心功能實作

### 1. 檔案處理邏輯
```javascript
// CSV檔案處理
- 多種編碼支援 (UTF-8, Big5, GB2312, GBK, Latin1, Windows-1252)
- BOM檢測與處理
- 亂碼字符清理
- 控制字符移除

// Excel檔案處理
- 原始格式保持
- 日期格式保護
- 數字格式保護
- 特殊字符處理
```

### 2. 格式轉換保護
```javascript
// 雙重保護機制
1. 讀取時保護: 強制轉換為字串格式
2. 輸出時保護: 所有欄位加上雙引號

// 特殊欄位處理
- PERIOD_NAME: 完全保持原始格式
- GL_DATE: 防止日期自動轉換
- ACCOUNTED_DR/CR: 防止數字自動轉換
```

### 3. CSV輸出格式
```csv
"PARTY_NUMBER","PARTY_NAME","PERIOD_NAME","NATURAL_ACCOUNT_SEGMENT","NATURAL_ACCOUNT_DESC","GL_DATE","TRANSACTION_NUMBER","LINE_DESCRIPTION","ACCOUNTED_DR","ACCOUNTED_CR"
"123","公司A","25-Jan","1001","銷貨收入","2025/1/1","TR001","銷售商品","100","0"
```

## 🎨 用戶界面設計

### 主要組件
1. **標題區域**: 財務 AccountAnalysis 轉換工具
2. **檔案選擇**: 選擇檔案按鈕 + 重新選擇功能
3. **轉換按鈕**: 開始轉換處理
4. **下載按鈕**: 轉換完成後顯示
5. **目標欄位說明**: 顯示10個目標欄位順序

### 動畫效果
- **彩帶動畫**: 轉換完成後自動觸發
- **成功反饋**: 視覺化轉換完成狀態
- **載入狀態**: 轉換過程中的載入提示

## 📁 檔案命名規則

### 下載檔案格式
- **格式**: `converted_YYYYMMDD.csv`
- **範例**: `converted_20250115.csv`
- **編碼**: UTF-8 with BOM

## 🔍 問題解決方案

### 1. 編碼問題
- **多層編碼檢測**: 自動嘗試多種編碼格式
- **BOM處理**: 正確處理UTF-8和UTF-16 BOM
- **亂碼清理**: 移除Unicode替換字符和控制字符

### 2. 格式轉換問題
- **雙引號保護**: 所有欄位都被雙引號包住
- **特殊字符處理**: 正確轉義內部引號
- **日期格式保護**: 防止Excel自動轉換日期格式

### 3. 用戶體驗
- **錯誤處理**: 友善的錯誤訊息
- **載入狀態**: 清楚的處理進度
- **成功反饋**: 視覺化的完成提示

## 🚀 部署與使用

### 開發環境
```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 訪問地址
http://localhost:3002
```

### 生產環境
```bash
# 建置專案
npm run build

# 預覽建置結果
npm run preview
```

## 📊 測試案例

### 1. CSV檔案測試
- UTF-8編碼的CSV檔案
- Big5編碼的CSV檔案
- 包含中文的CSV檔案
- 包含特殊字符的CSV檔案

### 2. Excel檔案測試
- .xlsx格式檔案
- .xls格式檔案
- 包含日期格式的Excel檔案
- 包含數字格式的Excel檔案

### 3. 格式保護測試
- PERIOD_NAME欄位格式保護
- GL_DATE欄位格式保護
- 金額欄位格式保護
- 所有欄位雙引號保護

## 🔮 未來擴展

### 可能的功能增強
1. **批次處理**: 支援多個檔案同時轉換
2. **格式驗證**: 轉換前的資料格式檢查
3. **範本下載**: 提供標準範本檔案
4. **歷史記錄**: 轉換歷史記錄功能
5. **自定義欄位**: 支援自定義目標欄位

### 技術優化
1. **效能優化**: 大型檔案處理優化
2. **錯誤恢復**: 更好的錯誤處理機制
3. **用戶設定**: 可自定義的轉換選項
4. **雲端部署**: 支援雲端部署版本

## 📝 開發日誌

### 版本 1.0.0 (2025-01-15)
- ✅ 基本檔案上傳功能
- ✅ CSV/Excel檔案處理
- ✅ 格式轉換邏輯
- ✅ 編碼問題修復
- ✅ 格式保護機制
- ✅ 彩帶動畫效果
- ✅ 響應式UI設計
- ✅ 錯誤處理機制

## 🎯 專案目標達成

### 核心目標 ✅
- [x] 支援CSV和Excel檔案上傳
- [x] 轉換為標準10欄位格式
- [x] 保持原始資料格式
- [x] 防止Excel自動轉換
- [x] 提供下載功能
- [x] 用戶友善的界面

### 技術目標 ✅
- [x] 現代化React架構
- [x] 響應式設計
- [x] 多編碼支援
- [x] 格式保護機制
- [x] 動畫效果
- [x] 錯誤處理

### 用戶體驗目標 ✅
- [x] 直觀的操作流程
- [x] 清楚的視覺反饋
- [x] 快速的處理速度
- [x] 穩定的功能表現

---

**專案狀態**: ✅ 完成  
**最後更新**: 2025-01-15  
**維護者**: 開發團隊
