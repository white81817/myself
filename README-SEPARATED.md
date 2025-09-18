# 頁面行銷規劃系統 - 分離版本

已將原本的單一 JavaScript 檔案分離成四個獨立的模組，便於管理和維護。

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
├── README.md               # 原始說明文件
└── README-SEPARATED.md     # 分離版本說明文件
```

## 🔧 模組說明

### 1. welcome-popup.js - 歡迎彈窗模組
**功能**：進站階段彈窗（15-30秒後觸發）
**主要類別**：`WelcomePopup`
**全域變數**：`window.welcomePopup`

**主要方法**：
- `showPopup()` - 顯示彈窗
- `closePopup()` - 關閉彈窗
- `bindLine()` - LINE 綁定
- `triggerManually()` - 手動觸發（測試用）
- `reset()` - 重置狀態（測試用）

### 2. urgency-bar.js - 緊急條模組
**功能**：停留/互動階段底部條（45秒後觸發）
**主要類別**：`UrgencyBar`
**全域變數**：`window.urgencyBar`

**主要方法**：
- `showBar()` - 顯示緊急條
- `closeBar()` - 關閉緊急條
- `startCountdown()` - 開始倒數計時
- `goToCheckout()` - 前往結帳
- `triggerManually()` - 手動觸發（測試用）
- `resetCountdown()` - 重置倒數計時器（測試用）

### 3. exit-popup.js - 退出彈窗模組
**功能**：離站階段彈窗（Exit Intent）
**主要類別**：`ExitPopup`
**全域變數**：`window.exitPopup`

**主要方法**：
- `showPopup()` - 顯示彈窗
- `closePopup()` - 關閉彈窗
- `bindLineExit()` - LINE 綁定
- `claimDiscount()` - 領取折扣
- `triggerManually()` - 手動觸發（測試用）
- `reset()` - 重置狀態（測試用）

### 4. main.js - 主要協調模組
**功能**：管理所有模組，提供統一介面
**主要類別**：`MarketingSystem`
**全域變數**：`window.marketingSystem`

**主要方法**：
- `getSystemStatus()` - 取得系統狀態
- `getAnalytics()` - 取得分析資料
- `showAllPopups()` - 顯示所有彈窗
- `hideAllPopups()` - 隱藏所有彈窗
- `resetAllModules()` - 重置所有模組
- `exportData()` - 匯出資料

## 🚀 使用方式

### 基本使用
```html
<!-- 在 HTML 中引入所有模組 -->
<script src="welcome-popup.js"></script>
<script src="urgency-bar.js"></script>
<script src="exit-popup.js"></script>
<script src="main.js"></script>
```

### 個別使用模組
如果您只需要特定功能，可以只引入對應的模組：

```html
<!-- 只需要歡迎彈窗 -->
<script src="welcome-popup.js"></script>

<!-- 只需要緊急條 -->
<script src="urgency-bar.js"></script>

<!-- 只需要退出彈窗 -->
<script src="exit-popup.js"></script>
```

### 程式化控制
```javascript
// 透過主要系統控制
window.marketingSystem.showAllPopups();
window.marketingSystem.hideAllPopups();
window.marketingSystem.getSystemStatus();

// 直接控制個別模組
window.welcomePopup.triggerManually();
window.urgencyBar.triggerManually();
window.exitPopup.triggerManually();
```

## 🧪 測試功能

### 測試頁面功能
開啟 `test.html` 可以使用以下測試功能：

1. **手動觸發**：
   - 觸發歡迎彈窗
   - 觸發緊急條
   - 觸發退出彈窗

2. **模擬行為**：
   - 模擬加入購物車
   - 重置倒數計時器

3. **資料管理**：
   - 顯示系統狀態
   - 顯示分析資料
   - 匯出資料
   - 清除所有資料

### 控制台測試
```javascript
// 在瀏覽器控制台中執行
showSystemStatus();    // 顯示系統狀態
showAnalytics();       // 顯示分析資料
exportMarketingData(); // 匯出資料
```

## ⚙️ 自訂設定

### 修改觸發條件
每個模組都可以獨立調整觸發條件：

```javascript
// 歡迎彈窗：修改觸發時間
// 在 welcome-popup.js 中
const randomDelay = Math.random() * 15 + 15; // 15-30秒

// 緊急條：修改觸發時間
// 在 urgency-bar.js 中
this.tracking.timeOnPage >= 45 // 45秒

// 退出彈窗：修改觸發條件
// 在 exit-popup.js 中
// 可以調整滑鼠離開、觸控、鍵盤等觸發條件
```

### 自訂樣式
所有模組都使用相同的 CSS 類別，可以在 `style.css` 中統一調整：

```css
/* 歡迎彈窗樣式 */
#welcome-popup { /* ... */ }

/* 緊急條樣式 */
#urgency-bar { /* ... */ }

/* 退出彈窗樣式 */
#exit-popup { /* ... */ }
```

## 🔄 模組間通訊

各模組之間透過主要系統進行協調：

```javascript
// 主要系統會監控所有模組的狀態
window.marketingSystem.getSystemStatus();

// 各模組獨立運作，但會回報狀態給主要系統
// 例如：緊急條會監聽購物車按鈕，歡迎彈窗會監聽頁面停留時間
```

## 📊 事件追蹤

每個模組都會記錄自己的事件：

```javascript
// 歡迎彈窗事件
window.welcomePopup.logEvent('welcome_popup_shown');

// 緊急條事件
window.urgencyBar.logEvent('urgency_bar_shown');

// 退出彈窗事件
window.exitPopup.logEvent('exit_popup_shown');

// 主要系統會收集所有事件
window.marketingSystem.getAnalytics();
```

## 🛠️ 開發建議

### 1. 模組化開發
- 每個模組都是獨立的，可以單獨測試和修改
- 新增功能時，建議在對應的模組中實作

### 2. 事件驅動
- 使用事件來進行模組間通訊
- 避免直接調用其他模組的內部方法

### 3. 資料持久化
- 每個模組都有自己的 sessionStorage 鍵值
- 主要系統會協調所有資料的保存和載入

### 4. 錯誤處理
- 每個模組都有獨立的錯誤處理
- 主要系統會監控所有模組的狀態

## 🔧 故障排除

### 常見問題

1. **模組未載入**：
   ```javascript
   // 檢查模組是否正確載入
   console.log(window.welcomePopup);
   console.log(window.urgencyBar);
   console.log(window.exitPopup);
   console.log(window.marketingSystem);
   ```

2. **事件未觸發**：
   ```javascript
   // 檢查觸發條件
   console.log(window.welcomePopup.tracking);
   console.log(window.urgencyBar.tracking);
   console.log(window.exitPopup.tracking);
   ```

3. **樣式問題**：
   - 確認 `style.css` 已正確載入
   - 檢查 CSS 類別名稱是否正確

### 除錯模式
在控制台中啟用詳細日誌：

```javascript
// 啟用所有模組的詳細日誌
localStorage.setItem('debug_mode', 'true');
location.reload();
```

## 📈 效能優化

### 1. 按需載入
只載入需要的模組，減少初始載入時間。

### 2. 事件節流
各模組都實作了事件節流，避免過度觸發。

### 3. 記憶體管理
定期清理不需要的資料，避免記憶體洩漏。

## 🔒 安全性

### 1. 資料隔離
每個模組的資料都獨立儲存，避免相互干擾。

### 2. 輸入驗證
所有用戶輸入都經過驗證，防止 XSS 攻擊。

### 3. 會話管理
使用 sessionStorage 而非 localStorage，關閉瀏覽器後自動清除。

## 📝 更新日誌

### v2.0.0 - 模組化版本
- 將單一 JavaScript 檔案分離成四個獨立模組
- 新增主要協調系統
- 改善錯誤處理和除錯功能
- 新增資料匯出功能
- 優化測試頁面

### v1.0.0 - 原始版本
- 基本的三階段行銷規劃功能
- 響應式設計
- Session-based 倒數計時器
- Exit Intent 偵測
