# 財務CSV轉換工具

一個用於轉換財務CSV/Excel檔案格式的React應用程式。

## 功能特色

- 📁 支援CSV和Excel檔案上傳
- 🔄 自動轉換為標準財務格式
- 🎊 轉換完成後的彩帶動畫效果
- 📥 一鍵下載轉換後的檔案
- 🎨 現代化的Tailwind UI設計

## 目標欄位

目前 HTML 版本提供兩種轉換模式：

- **原版本**：僅含本幣欄位（11 欄）
- **包含外幣**：本幣 + 外幣欄位（15 欄）

### 原版本（11 欄）

1. PARTY_NUMBER  
2. PARTY_NAME  
3. PERIOD_NAME  
4. NATURAL_ACCOUNT_SEGMENT  
5. NATURAL_ACCOUNT_DESC  
6. GL_DATE  
7. HEADER_DESCRIPTION  
8. TRANSACTION_NUMBER  
9. LINE_DESCRIPTION  
10. ACCOUNTED_DR  
11. ACCOUNTED_CR  

### 包含外幣（15 欄）

1. PARTY_NUMBER  
2. PARTY_NAME  
3. PERIOD_NAME  
4. NATURAL_ACCOUNT_SEGMENT  
5. NATURAL_ACCOUNT_DESC  
6. GL_DATE  
7. HEADER_DESCRIPTION  
8. TRANSACTION_NUMBER  
9. LINE_DESCRIPTION  
10. ENTERED_CURRENCY  
11. CONVERSION_RATE  
12. ENTERED_DR  
13. ACCOUNTED_DR  
14. ENTERED_CR  
15. ACCOUNTED_CR  

## 安裝與執行

1. 安裝依賴：
```bash
npm install
```

2. 啟動開發伺服器：
```bash
npm run dev
```

3. 在瀏覽器中開啟 http://localhost:3000

## 使用方式

1. 點擊「選擇檔案」按鈕上傳CSV或Excel檔案
2. 點擊「轉換」按鈕開始轉換
3. 轉換完成後會顯示🎊動畫效果
4. 點擊「下載轉換後的檔案」下載結果

## 技術棧

- React 18
- Vite
- Tailwind CSS
- PapaParse (CSV處理)
- XLSX (Excel處理)
- Canvas Confetti (動畫效果)

## 注意事項

- 如果來源檔案缺少某些欄位，轉換時會自動補上空值
- 支援的檔案格式：.csv, .xlsx, .xls
- 轉換後的檔案名稱為 `converted.csv`
