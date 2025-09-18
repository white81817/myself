# 頁面行銷規劃系統

一個完整的頁面行銷規劃系統，包含三個階段的彈窗和底部條設計，用於提升網站轉換率。

## 🎯 功能特色

### 1. 進站階段（首次到訪 15~30 秒後）
- **觸發條件**：停留超過 15-30 秒 或 瀏覽超過 2 個頁面
- **目標**：蒐集顧客資料、建立第一層關係
- **設計**：輕度誘因（$50 折扣）吸引用戶留下資料

### 2. 停留/互動階段（延遲觸發 + 倒數計時器）
- **觸發條件**：在商品頁停留超過 45 秒 或 已加購物車但未前往結帳
- **目標**：加強緊迫感，推進顧客到結帳
- **設計**：底部條 + 10分鐘倒數計時器（Session-based）

### 3. 離站階段（Exit Intent）
- **觸發條件**：游標快速移至瀏覽器上方（關閉或切換分頁）
- **目標**：最後挽回流失顧客
- **設計**：更大誘因（$100 折扣）作為最後防線

## 📁 檔案結構

```
popup/
├── index.html              # 主要頁面
├── test.html               # 測試頁面
├── style.css               # 樣式檔案
├── welcome-popup.js        # 歡迎彈窗模組
├── urgency-bar.js          # 緊急條模組
├── exit-popup.js           # 退出彈窗模組
├── main.js                 # 主要協調模組
├── script.js               # 原始整合版本（保留）
├── README.md               # 說明文件
└── README-SEPARATED.md     # 分離版本說明文件
```

## 🚀 快速開始

1. **直接使用**：
   - 開啟 `index.html` 在瀏覽器中查看效果
   - 開啟 `test.html` 進行功能測試

2. **整合到現有網站**：
   - 複製 `style.css` 和 JavaScript 檔案到您的專案
   - 在 HTML 中引入這些檔案
   - 根據需要調整樣式和觸發條件

## 🛠️ 自訂設定

### 修改觸發時間
在各個 JavaScript 模組中調整參數：

```javascript
// 歡迎彈窗觸發時間（秒）- welcome-popup.js
const randomDelay = Math.random() * 15 + 15; // 15-30秒

// 緊急條觸發時間（秒）- urgency-bar.js
this.tracking.timeOnPage >= 45

// 倒數計時器時間（秒）- urgency-bar.js
this.countdownTime = 10 * 60; // 10分鐘
```

### 修改彈窗內容
在 `index.html` 中編輯對應的 HTML 結構：

```html
<!-- 歡迎彈窗 -->
<div id="welcome-popup" class="popup-overlay">
    <!-- 修改這裡的內容 -->
</div>
```

### 自訂樣式
在 `style.css` 中調整顏色、字體、間距等：

```css
/* 修改主要顏色 */
.cta-btn.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 修改彈窗樣式 */
.popup-content {
    max-width: 500px; /* 調整彈窗寬度 */
}
```

## 📱 響應式設計

系統已針對各種裝置進行優化：

- **桌面版**：完整功能展示
- **平板版**：適中的彈窗大小
- **手機版**：全螢幕遮罩，避免遮擋主要操作

## 🔧 技術特色

### 模組化架構
- 四個獨立的 JavaScript 模組
- 每個功能都可以單獨使用
- 便於維護和擴展

### 防重複觸發
- 同一訪客一天最多觸發一次 popup
- 使用 `sessionStorage` 記錄狀態

### Session-based 倒數計時器
- 刷新頁面不會重置倒數時間
- 頁面切換時暫停計時
- 重新回到頁面時恢復計時

### Exit Intent 偵測
- 支援桌面版滑鼠離開偵測
- 支援移動裝置觸控偵測
- 智慧判斷用戶意圖

### 事件追蹤
- 完整的用戶行為記錄
- 可整合到 Google Analytics 等分析工具
- 詳細的事件日誌

## 🧪 測試功能

使用 `test.html` 可以測試所有功能：

1. **手動觸發**：使用右上角控制面板
2. **狀態監控**：即時查看系統狀態
3. **資料重置**：清除所有記錄重新測試

### 測試控制面板功能：
- 觸發歡迎彈窗
- 觸發緊急條
- 觸發退出彈窗
- 模擬加入購物車
- 重置倒數計時器
- 清除所有資料
- 顯示即時狀態
- 顯示分析資料
- 匯出資料

## 📊 分析整合

系統會記錄以下事件，可整合到分析工具：

```javascript
// 事件範例
{
    name: 'welcome_popup_shown',
    timestamp: 1640995200000,
    data: {},
    userAgent: 'Mozilla/5.0...',
    url: 'https://example.com'
}
```

### 可追蹤的事件：
- `welcome_popup_shown` - 歡迎彈窗顯示
- `urgency_bar_shown` - 緊急條顯示
- `exit_popup_shown` - 退出彈窗顯示
- `line_bind_attempted` - LINE 綁定嘗試
- `discount_claimed` - 折扣券領取
- `checkout_clicked` - 結帳按鈕點擊

## 🎨 自訂主題

### 顏色主題
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --success-color: #28a745;
    --danger-color: #dc3545;
    --warning-color: #ffc107;
}
```

### 字體設定
```css
body {
    font-family: 'Microsoft JhengHei', 'PingFang TC', 'Helvetica Neue', Arial, sans-serif;
}
```

## 🔒 隱私考量

- 使用 `sessionStorage` 而非 `localStorage`
- 資料僅在當前瀏覽會話中保存
- 關閉瀏覽器後自動清除
- 不收集個人敏感資訊

## 🌐 瀏覽器支援

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- 移動端瀏覽器

## 📝 授權

此專案採用 MIT 授權，可自由使用和修改。

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request 來改善這個專案。

## 📞 支援

如有問題或建議，請聯繫開發團隊。
