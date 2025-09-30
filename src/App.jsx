import React, { useState, useRef } from 'react'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import confetti from 'canvas-confetti'
import './App.css'

const REQUIRED_COLUMNS = [
  'PARTY_NUMBER',
  'PARTY_NAME', 
  'PERIOD_NAME',
  'NATURAL_ACCOUNT_SEGMENT',
  'NATURAL_ACCOUNT_DESC',
  'GL_DATE',
  'TRANSACTION_NUMBER',
  'LINE_DESCRIPTION',
  'ACCOUNTED_DR',
  'ACCOUNTED_CR'
]

function App() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [convertedData, setConvertedData] = useState(null)
  const [isConverting, setIsConverting] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
      setConvertedData(null)
    }
  }

  const triggerConfetti = () => {
    // 簡化彩帶效果，只保留彩帶
    confetti({
      particleCount: 150,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3']
    })
  }

  const showSuccessAnimation = () => {
    // 只觸發彩帶效果，不顯示emoji
    triggerConfetti()
  }

  const resetFile = () => {
    setSelectedFile(null)
    setConvertedData(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }


  const processFile = async () => {
    if (!selectedFile) return

    setIsConverting(true)
    
    try {
      let data = []
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase()

      if (fileExtension === 'csv') {
        // 處理CSV檔案 - 修復編碼問題
        const arrayBuffer = await selectedFile.arrayBuffer()
        
        // 檢測BOM並選擇適當的編碼
        let text
        const uint8Array = new Uint8Array(arrayBuffer)
        
        // 檢查BOM標記
        if (uint8Array.length >= 3 && uint8Array[0] === 0xEF && uint8Array[1] === 0xBB && uint8Array[2] === 0xBF) {
          // UTF-8 BOM
          text = new TextDecoder('utf-8').decode(arrayBuffer.slice(3))
        } else if (uint8Array.length >= 2 && uint8Array[0] === 0xFF && uint8Array[1] === 0xFE) {
          // UTF-16 LE BOM
          text = new TextDecoder('utf-16le').decode(arrayBuffer.slice(2))
        } else {
          // 嘗試多種編碼方式，按優先順序
          const encodings = ['utf-8', 'big5', 'gb2312', 'gbk', 'latin1', 'windows-1252']
          let success = false
          
          for (const encoding of encodings) {
            try {
              text = new TextDecoder(encoding).decode(arrayBuffer)
              // 檢查是否包含亂碼字符
              if (!text.includes('') && !text.includes('')) {
                success = true
                break
              }
            } catch (error) {
              continue
            }
          }
          
          if (!success) {
            // 如果所有編碼都失敗，使用UTF-8並嘗試修復
            text = new TextDecoder('utf-8', { fatal: false }).decode(arrayBuffer)
          }
        }
        
        // 清理可能的亂碼字符
        text = text.replace(/\uFFFD/g, '') // 移除Unicode替換字符
        
        const result = Papa.parse(text, { 
          header: true, 
          skipEmptyLines: true,
          delimiter: ',',
          quoteChar: '"',
          escapeChar: '"',
          newline: '\n',
          encoding: 'UTF-8'
        })
        data = result.data
      } else if (['xlsx', 'xls'].includes(fileExtension)) {
        // 處理Excel檔案 - 確保所有欄位保持原始字元內容
        const arrayBuffer = await selectedFile.arrayBuffer()
        const workbook = XLSX.read(arrayBuffer, { 
          type: 'array',
          cellDates: false,  // 不自動解析日期
          cellNF: false,     // 不格式化數字
          cellText: true,    // 保持原始文字格式
          raw: true,         // 保持原始值
          dateNF: false      // 不格式化日期
        })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        
        // 使用更保守的方式讀取，避免任何自動轉換
        data = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: '',
          blankrows: false,
          raw: true,         // 保持原始值，不做格式化
          dateNF: false,     // 不格式化日期
          rawNumbers: false  // 不將數字轉換為數值
        })
        
        // 將陣列格式轉換為物件格式
        if (data.length > 0) {
          const headers = data[0]
          data = data.slice(1).map(row => {
            const obj = {}
            headers.forEach((header, index) => {
              if (header) {
                const value = row[index]
                
                // 所有欄位都強制保持原始字串格式，不做任何轉換
                if (value !== undefined && value !== null) {
                  // 強制轉換為字串，確保不會被轉換為數字或日期
                  let stringValue = String(value)
                  
                  // 清理可能的亂碼字符
                  stringValue = stringValue.replace(/\uFFFD/g, '') // 移除Unicode替換字符
                                          .replace(/\u0000/g, '') // 移除空字符
                                          .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // 移除控制字符
                  
                  // 特別處理日期和金額欄位，確保完全保持原始格式
                  if (header === 'PERIOD_NAME' || header === 'GL_DATE') {
                    // 日期相關欄位，完全保持原始格式
                    obj[header] = stringValue.trim()
                  } else if (header === 'ACCOUNTED_DR' || header === 'ACCOUNTED_CR') {
                    // 金額欄位，保持原始格式
                    obj[header] = stringValue
                  } else {
                    // 其他所有欄位都保持原始字串格式
                    obj[header] = stringValue
                  }
                } else {
                  obj[header] = ''
                }
              }
            })
            return obj
          })
        }
      } else {
        throw new Error('不支援的檔案格式')
      }

      // 轉換資料格式 - 完整保留來源檔案的原始字元內容
      const convertedData = data.map(row => {
        const newRow = {}
        REQUIRED_COLUMNS.forEach(column => {
          const value = row[column]
          
          // 所有欄位都強制保持原始字串格式，不做任何轉換
          if (value !== undefined && value !== null) {
            // 強制轉換為字串，並保持原始格式
            let stringValue = String(value)
            
            // 清理可能的亂碼字符和控制字符
            stringValue = stringValue.replace(/\uFFFD/g, '') // 移除Unicode替換字符
                                    .replace(/\u0000/g, '') // 移除空字符
                                    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // 移除控制字符
                                    .replace(/\s+/g, ' ') // 標準化空白字符
                                    .trim() // 移除前後空白
            
            // 確保不會被轉換為數字或日期格式
            if (column === 'PERIOD_NAME' || column === 'GL_DATE') {
              // 對於日期相關欄位，確保完全保持原始格式
              newRow[column] = stringValue
            } else if (column === 'ACCOUNTED_DR' || column === 'ACCOUNTED_CR') {
              // 對於金額欄位，確保保持原始格式
              newRow[column] = stringValue
            } else {
              // 其他所有欄位都保持原始字串格式
              newRow[column] = stringValue
            }
          } else {
            newRow[column] = ''
          }
        })
        return newRow
      })

      console.log('轉換後的資料範例:', convertedData.slice(0, 2))
      setConvertedData(convertedData)
      showSuccessAnimation()
    } catch (error) {
      alert('檔案處理失敗：' + error.message)
    } finally {
      setIsConverting(false)
    }
  }

  const downloadConvertedFile = () => {
    if (!convertedData) return

    // 手動生成CSV內容，使用更強力的格式保護
    let csv = ''
    
    // 添加標題行 - 確保所有標題都被雙引號包住
    const headers = REQUIRED_COLUMNS.map(col => `"${col}"`).join(',')
    csv += headers + '\n'
    
    // 添加資料行 - 使用更強力的格式保護
    convertedData.forEach(row => {
      const values = REQUIRED_COLUMNS.map(column => {
        const value = row[column] || ''
        // 強制轉換為字串，確保不會被轉換為數字或日期
        let stringValue = String(value)
        
        // 特別處理可能被Excel自動轉換的欄位
        if (column === 'PERIOD_NAME' || column === 'GL_DATE') {
          // 對於日期相關欄位，確保完全保持原始格式
          stringValue = stringValue.trim()
          
          // 如果值看起來像日期，添加前導字符防止轉換
          if (stringValue.match(/^\d{4}\/\d{1,2}\/\d{1,2}$/) || 
              stringValue.match(/^\d{1,2}-[A-Za-z]{3}$/) ||
              stringValue.match(/^[A-Za-z]{3}-\d{2}$/)) {
            // 保持原始格式，不做任何修改
          }
        } else if (column === 'ACCOUNTED_DR' || column === 'ACCOUNTED_CR') {
          // 對於金額欄位，確保保持原始格式
          stringValue = stringValue
        } else if (column === 'PARTY_NUMBER' || column === 'NATURAL_ACCOUNT_SEGMENT') {
          // 對於數字欄位，確保不會被轉換為數字格式
          stringValue = stringValue
        }
        
        // 處理內部引號和特殊字符，確保CSV格式正確
        let escapedValue = stringValue
          .replace(/"/g, '""')  // 轉義雙引號
          .replace(/\n/g, ' ')  // 替換換行符
          .replace(/\r/g, ' ')  // 替換回車符
          .replace(/\t/g, ' ')  // 替換製表符
        
        // 確保所有值都被雙引號包住，防止Excel自動轉換
        return `"${escapedValue}"`
      })
      csv += values.join(',') + '\n'
    })
    
    // 生成時間戳格式的檔案名稱
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const filename = `converted_${year}${month}${day}.csv`
    
    // 添加BOM (Byte Order Mark) 來確保UTF-8編碼正確顯示
    const BOM = '\uFEFF'
    const csvWithBOM = BOM + csv
    
    // 使用更明確的MIME類型，防止Excel自動轉換
    const blob = new Blob([csvWithBOM], { 
      type: 'text/csv;charset=utf-8;' 
    })
    
    // 創建下載連結，使用更強力的格式保護
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    
    // 添加額外的屬性來防止Excel自動轉換
    link.setAttribute('data-format', 'csv')
    link.setAttribute('data-encoding', 'utf-8')
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">財務 AccountAnalysis 轉換工具</h1>
          <p className="text-gray-600">上傳CSV或Excel檔案，轉換為標準格式</p>
        </div>

        {/* 檔案選擇區域 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            選擇檔案
          </label>
          <div className="flex items-center space-x-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {selectedFile ? '重新選擇檔案' : '選擇檔案'}
            </button>
            {selectedFile && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  已選擇：{selectedFile.name}
                </span>
                <button
                  onClick={resetFile}
                  className="px-3 py-1 text-xs bg-gray-200 text-gray-600 rounded hover:bg-gray-300 transition-colors"
                >
                  清除
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 轉換按鈕 */}
        <div className="mb-6">
          <button
            onClick={processFile}
            disabled={!selectedFile || isConverting}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
              !selectedFile || isConverting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isConverting ? '轉換中...' : '轉換'}
          </button>
        </div>


        {/* 下載按鈕 */}
        {convertedData && (
          <div className="text-center">
            <button
              onClick={downloadConvertedFile}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              下載轉換後的檔案
            </button>
            <p className="text-sm text-gray-500 mt-2">
              已轉換 {convertedData.length} 筆資料
            </p>
          </div>
        )}

        {/* 目標欄位說明 */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2">目標欄位順序：</h3>
          <div className="text-sm text-gray-600 grid grid-cols-2 gap-1">
            {REQUIRED_COLUMNS.map((column, index) => (
              <div key={index} className="flex items-center">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-2">
                  {index + 1}
                </span>
                {column}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
