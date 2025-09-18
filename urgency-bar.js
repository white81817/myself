// 緊急條功能 - 停留/互動階段
class UrgencyBar {
    constructor() {
        this.tracking = {
            hasTriggered: false,
            timeOnPage: 0,
            hasAddedToCart: false
        };
        
        this.countdownTimer = null;
        this.countdownTime = 10 * 60; // 10分鐘倒數
        this.isCountdownActive = false;
        
        this.init();
    }
    
    init() {
        this.loadSessionData();
        this.setupEventListeners();
        this.startPageTracking();
        this.checkExistingCountdown();
    }
    
    setupEventListeners() {
        // 頁面可見性變化
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseTimers();
            } else {
                this.resumeTimers();
            }
        });
        
        // 頁面卸載前保存資料
        window.addEventListener('beforeunload', () => {
            this.saveSessionData();
        });
        
        // 加入購物車按鈕事件
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', () => {
                this.tracking.hasAddedToCart = true;
                this.checkTrigger();
            });
        });
        
        // 倒數計時器相關事件
        this.setupCountdownEvents();
    }
    
    startPageTracking() {
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
            this.tracking.timeOnPage >= 45
        ) || this.tracking.hasAddedToCart;
        
        if (shouldTrigger) {
            this.showBar();
        }
    }
    
    showBar() {
        if (this.tracking.hasTriggered) return;
        
        this.tracking.hasTriggered = true;
        const urgencyBar = document.getElementById('urgency-bar');
        
        if (urgencyBar) {
            urgencyBar.classList.add('show');
            
            // 開始倒數計時
            this.startCountdown();
            
            // 記錄觸發事件
            this.logEvent('urgency_bar_shown');
        }
    }
    
    closeBar() {
        const urgencyBar = document.getElementById('urgency-bar');
        if (urgencyBar) {
            urgencyBar.classList.remove('show');
            
            if (this.countdownTimer) {
                clearInterval(this.countdownTimer);
                this.countdownTimer = null;
            }
            
            this.isCountdownActive = false;
            
            // 記錄關閉事件
            this.logEvent('urgency_bar_closed');
        }
    }
    
    // 倒數計時器功能
    startCountdown() {
        if (this.isCountdownActive) return;
        
        this.isCountdownActive = true;
        this.countdownTime = this.getStoredCountdownTime() || 10 * 60; // 10分鐘
        
        this.countdownTimer = setInterval(() => {
            this.updateCountdownDisplay();
            this.countdownTime--;
            
            if (this.countdownTime <= 0) {
                this.endCountdown();
            }
        }, 1000);
        
        this.updateCountdownDisplay();
    }
    
    updateCountdownDisplay() {
        const minutes = Math.floor(this.countdownTime / 60);
        const seconds = this.countdownTime % 60;
        
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (minutesEl && secondsEl) {
            minutesEl.textContent = minutes.toString().padStart(2, '0');
            secondsEl.textContent = seconds.toString().padStart(2, '0');
        }
        
        // 保存到 sessionStorage
        this.saveCountdownTime();
    }
    
    endCountdown() {
        if (this.countdownTimer) {
            clearInterval(this.countdownTimer);
            this.countdownTimer = null;
        }
        
        this.isCountdownActive = false;
        this.closeBar();
        
        // 記錄倒數結束事件
        this.logEvent('countdown_ended');
    }
    
    goToCheckout() {
        this.logEvent('checkout_clicked');
        alert('正在跳轉到結帳頁面...');
        this.closeBar();
    }
    
    // 設定倒數計時器事件
    setupCountdownEvents() {
        // 頁面可見性變化時暫停/恢復倒數
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseTimers();
            } else {
                this.resumeTimers();
            }
        });
    }
    
    // 計時器控制
    pauseTimers() {
        if (this.countdownTimer) {
            clearInterval(this.countdownTimer);
        }
    }
    
    resumeTimers() {
        // 重新開始倒數計時器
        if (this.isCountdownActive && this.countdownTime > 0) {
            this.startCountdown();
        }
    }
    
    // Session 資料管理
    saveSessionData() {
        const sessionData = {
            urgencyTracking: this.tracking,
            countdownTime: this.countdownTime,
            isCountdownActive: this.isCountdownActive,
            timestamp: Date.now()
        };
        
        sessionStorage.setItem('urgency_bar_data', JSON.stringify(sessionData));
    }
    
    loadSessionData() {
        const stored = sessionStorage.getItem('urgency_bar_data');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                
                // 檢查是否為同一天
                const today = new Date().toDateString();
                const storedDate = new Date(data.timestamp).toDateString();
                
                if (today === storedDate) {
                    this.tracking = { ...this.tracking, ...data.urgencyTracking };
                    this.countdownTime = data.countdownTime || 10 * 60;
                    this.isCountdownActive = data.isCountdownActive || false;
                } else {
                    // 新的一天，重置資料
                    this.resetDailyData();
                }
            } catch (e) {
                console.warn('無法載入緊急條 session 資料:', e);
            }
        }
    }
    
    resetDailyData() {
        this.tracking = {
            hasTriggered: false,
            timeOnPage: 0,
            hasAddedToCart: false
        };
        this.countdownTime = 10 * 60;
        this.isCountdownActive = false;
    }
    
    saveCountdownTime() {
        sessionStorage.setItem('countdown_time', this.countdownTime.toString());
    }
    
    getStoredCountdownTime() {
        const stored = sessionStorage.getItem('countdown_time');
        return stored ? parseInt(stored, 10) : null;
    }
    
    checkExistingCountdown() {
        const storedTime = this.getStoredCountdownTime();
        if (storedTime && storedTime > 0) {
            this.countdownTime = storedTime;
            this.startCountdown();
        }
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
        
        console.log('Urgency Bar Event:', event);
    }
    
    // 手動觸發（供測試用）
    triggerManually() {
        this.showBar();
    }
    
    // 重置倒數計時器（供測試用）
    resetCountdown() {
        this.countdownTime = 10 * 60;
        this.startCountdown();
    }
    
    // 重置狀態（供測試用）
    reset() {
        this.tracking.hasTriggered = false;
        this.closeBar();
    }
}

// 全域函數（供 HTML 調用）
function closeUrgencyBar() {
    if (window.urgencyBar) {
        window.urgencyBar.closeBar();
    }
}

function goToCheckout() {
    if (window.urgencyBar) {
        window.urgencyBar.goToCheckout();
    }
}

// 初始化緊急條
document.addEventListener('DOMContentLoaded', () => {
    window.urgencyBar = new UrgencyBar();
});
