// 歡迎彈窗功能 - 進站階段
class WelcomePopup {
    constructor() {
        this.tracking = {
            hasTriggered: false,
            timeOnPage: 0,
            pageViews: 0
        };
        
        this.timer = null;
        this.init();
    }
    
    init() {
        this.loadSessionData();
        this.setupEventListeners();
        this.startPageTracking();
        this.startWelcomeTimer();
    }
    
    setupEventListeners() {
        // 頁面載入完成後開始計時
        document.addEventListener('DOMContentLoaded', () => {
            this.startWelcomeTimer();
        });
        
        // 頁面可見性變化
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseTimer();
            } else {
                this.resumeTimer();
            }
        });
        
        // 頁面卸載前保存資料
        window.addEventListener('beforeunload', () => {
            this.saveSessionData();
        });
    }
    
    startPageTracking() {
        // 追蹤頁面瀏覽次數
        this.tracking.pageViews++;
        
        // 開始計時頁面停留時間
        this.startTimeTracking();
    }
    
    startTimeTracking() {
        setInterval(() => {
            this.tracking.timeOnPage++;
            this.checkTrigger();
        }, 1000);
    }
    
    // 檢查觸發條件
    checkTrigger() {
        if (this.tracking.hasTriggered) return;
        
        const shouldTrigger = (
            this.tracking.timeOnPage >= 15 && this.tracking.timeOnPage <= 30
        ) || this.tracking.pageViews >= 2;
        
        if (shouldTrigger) {
            this.showPopup();
        }
    }
    
    startWelcomeTimer() {
        if (this.tracking.hasTriggered) return;
        
        // 15-30秒隨機觸發
        const randomDelay = Math.random() * 15 + 15; // 15-30秒
        
        this.timer = setTimeout(() => {
            this.checkTrigger();
        }, randomDelay * 1000);
    }
    
    showPopup() {
        if (this.tracking.hasTriggered) return;
        
        this.tracking.hasTriggered = true;
        const popup = document.getElementById('welcome-popup');
        
        if (popup) {
            popup.classList.add('show');
            document.body.classList.add('popup-open');
            
            // 記錄觸發事件
            this.logEvent('welcome_popup_shown');
        }
    }
    
    closePopup() {
        const popup = document.getElementById('welcome-popup');
        if (popup) {
            popup.classList.remove('show');
            document.body.classList.remove('popup-open');
            
            // 記錄關閉事件
            this.logEvent('welcome_popup_closed');
        }
    }
    
    bindLine() {
        // 模擬 LINE 綁定
        this.logEvent('line_bind_attempted');
        alert('正在跳轉到 LINE 綁定頁面...');
        this.closePopup();
    }
    
    // 計時器控制
    pauseTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }
    
    resumeTimer() {
        if (!this.tracking.hasTriggered) {
            this.startWelcomeTimer();
        }
    }
    
    // Session 資料管理
    saveSessionData() {
        const sessionData = {
            welcomeTracking: this.tracking,
            timestamp: Date.now()
        };
        
        sessionStorage.setItem('welcome_popup_data', JSON.stringify(sessionData));
    }
    
    loadSessionData() {
        const stored = sessionStorage.getItem('welcome_popup_data');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                
                // 檢查是否為同一天
                const today = new Date().toDateString();
                const storedDate = new Date(data.timestamp).toDateString();
                
                if (today === storedDate) {
                    this.tracking = { ...this.tracking, ...data.welcomeTracking };
                } else {
                    // 新的一天，重置資料
                    this.resetDailyData();
                }
            } catch (e) {
                console.warn('無法載入歡迎彈窗 session 資料:', e);
            }
        }
    }
    
    resetDailyData() {
        this.tracking = {
            hasTriggered: false,
            timeOnPage: 0,
            pageViews: 0
        };
    }
    
    // 事件記錄
    logEvent(eventName, data = {}) {
        const event = {
            name: eventName,
            timestamp: Date.now(),
            data: data,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        console.log('Welcome Popup Event:', event);
    }
    
    // 手動觸發（供測試用）
    triggerManually() {
        this.showPopup();
    }
    
    // 重置狀態（供測試用）
    reset() {
        this.tracking.hasTriggered = false;
        this.closePopup();
        this.startWelcomeTimer();
    }
}

// 全域函數（供 HTML 調用）
function closeWelcomePopup() {
    if (window.welcomePopup) {
        window.welcomePopup.closePopup();
    }
}

function bindLineWelcome() {
    if (window.welcomePopup) {
        window.welcomePopup.bindLine();
    }
}

// 初始化歡迎彈窗
document.addEventListener('DOMContentLoaded', () => {
    window.welcomePopup = new WelcomePopup();
});
