// 頁面行銷規劃系統 JavaScript
class MarketingPopupSystem {
    constructor() {
        this.timers = {
            welcome: null,
            urgency: null,
            exit: null
        };
        
        this.countdownTimer = null;
        this.countdownTime = 10 * 60; // 10分鐘倒數
        this.isCountdownActive = false;
        
        this.tracking = {
            pageViews: 0,
            timeOnPage: 0,
            hasAddedToCart: false,
            hasTriggeredWelcome: false,
            hasTriggeredUrgency: false,
            hasTriggeredExit: false
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.startPageTracking();
        this.loadSessionData();
        this.checkExistingCountdown();
    }
    
    setupEventListeners() {
        // 頁面載入完成後開始計時
        document.addEventListener('DOMContentLoaded', () => {
            this.startWelcomeTimer();
        });
        
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
                this.checkUrgencyTrigger();
            });
        });
        
        // Exit Intent 偵測
        this.setupExitIntent();
        
        // 倒數計時器相關事件
        this.setupCountdownEvents();
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
            
            // 檢查是否達到觸發條件
            this.checkWelcomeTrigger();
            this.checkUrgencyTrigger();
        }, 1000);
    }
    
    // 進站階段觸發邏輯
    checkWelcomeTrigger() {
        if (this.tracking.hasTriggeredWelcome) return;
        
        const shouldTrigger = (
            this.tracking.timeOnPage >= 15 && this.tracking.timeOnPage <= 30
        ) || this.tracking.pageViews >= 2;
        
        if (shouldTrigger) {
            this.showWelcomePopup();
        }
    }
    
    startWelcomeTimer() {
        // 15-30秒隨機觸發
        const randomDelay = Math.random() * 15 + 15; // 15-30秒
        
        this.timers.welcome = setTimeout(() => {
            this.checkWelcomeTrigger();
        }, randomDelay * 1000);
    }
    
    showWelcomePopup() {
        if (this.tracking.hasTriggeredWelcome) return;
        
        this.tracking.hasTriggeredWelcome = true;
        const popup = document.getElementById('welcome-popup');
        popup.classList.add('show');
        document.body.classList.add('popup-open');
        
        // 記錄觸發事件
        this.logEvent('welcome_popup_shown');
    }
    
    // 停留/互動階段觸發邏輯
    checkUrgencyTrigger() {
        if (this.tracking.hasTriggeredUrgency) return;
        
        const shouldTrigger = (
            this.tracking.timeOnPage >= 45
        ) || this.tracking.hasAddedToCart;
        
        if (shouldTrigger) {
            this.showUrgencyBar();
        }
    }
    
    showUrgencyBar() {
        if (this.tracking.hasTriggeredUrgency) return;
        
        this.tracking.hasTriggeredUrgency = true;
        const urgencyBar = document.getElementById('urgency-bar');
        urgencyBar.classList.add('show');
        
        // 開始倒數計時
        this.startCountdown();
        
        // 記錄觸發事件
        this.logEvent('urgency_bar_shown');
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
        this.hideUrgencyBar();
        
        // 記錄倒數結束事件
        this.logEvent('countdown_ended');
    }
    
    // Exit Intent 偵測
    setupExitIntent() {
        let exitIntentTriggered = false;
        
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0 && !exitIntentTriggered) {
                exitIntentTriggered = true;
                this.showExitPopup();
            }
        });
        
        // 移動裝置的退出意圖偵測
        document.addEventListener('touchstart', () => {
            if (window.scrollY === 0 && !exitIntentTriggered) {
                exitIntentTriggered = true;
                setTimeout(() => {
                    this.showExitPopup();
                }, 100);
            }
        });
    }
    
    showExitPopup() {
        if (this.tracking.hasTriggeredExit) return;
        
        this.tracking.hasTriggeredExit = true;
        const popup = document.getElementById('exit-popup');
        popup.classList.add('show');
        document.body.classList.add('popup-open');
        
        // 記錄觸發事件
        this.logEvent('exit_popup_shown');
    }
    
    // 彈出視窗控制
    closePopup(popupId) {
        const popup = document.getElementById(popupId);
        popup.classList.remove('show');
        document.body.classList.remove('popup-open');
        
        // 記錄關閉事件
        this.logEvent(`${popupId}_closed`);
    }
    
    closeUrgencyBar() {
        const urgencyBar = document.getElementById('urgency-bar');
        urgencyBar.classList.remove('show');
        
        if (this.countdownTimer) {
            clearInterval(this.countdownTimer);
            this.countdownTimer = null;
        }
        
        this.isCountdownActive = false;
        
        // 記錄關閉事件
        this.logEvent('urgency_bar_closed');
    }
    
    hideUrgencyBar() {
        const urgencyBar = document.getElementById('urgency-bar');
        urgencyBar.classList.remove('show');
    }
    
    // 按鈕動作處理
    bindLine() {
        // 模擬 LINE 綁定
        this.logEvent('line_bind_attempted');
        alert('正在跳轉到 LINE 綁定頁面...');
        this.closePopup('welcome-popup');
    }
    
    bindLineExit() {
        // 模擬 LINE 綁定
        this.logEvent('line_bind_exit_attempted');
        alert('正在跳轉到 LINE 綁定頁面...');
        this.closePopup('exit-popup');
    }
    
    claimDiscount() {
        const email = document.getElementById('exit-email').value;
        if (email && this.isValidEmail(email)) {
            this.logEvent('discount_claimed', { email });
            alert(`折扣券已發送到 ${email}，請查收！`);
            this.closePopup('exit-popup');
        } else {
            alert('請輸入有效的 email 地址');
        }
    }
    
    goToCheckout() {
        this.logEvent('checkout_clicked');
        alert('正在跳轉到結帳頁面...');
        this.closeUrgencyBar();
    }
    
    // 工具函數
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Session 資料管理
    saveSessionData() {
        const sessionData = {
            tracking: this.tracking,
            countdownTime: this.countdownTime,
            isCountdownActive: this.isCountdownActive,
            timestamp: Date.now()
        };
        
        sessionStorage.setItem('marketing_popup_data', JSON.stringify(sessionData));
    }
    
    loadSessionData() {
        const stored = sessionStorage.getItem('marketing_popup_data');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                
                // 檢查是否為同一天
                const today = new Date().toDateString();
                const storedDate = new Date(data.timestamp).toDateString();
                
                if (today === storedDate) {
                    this.tracking = { ...this.tracking, ...data.tracking };
                    this.countdownTime = data.countdownTime || 10 * 60;
                    this.isCountdownActive = data.isCountdownActive || false;
                } else {
                    // 新的一天，重置資料
                    this.resetDailyData();
                }
            } catch (e) {
                console.warn('無法載入 session 資料:', e);
            }
        }
    }
    
    resetDailyData() {
        this.tracking = {
            pageViews: 0,
            timeOnPage: 0,
            hasAddedToCart: false,
            hasTriggeredWelcome: false,
            hasTriggeredUrgency: false,
            hasTriggeredExit: false
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
    
    // 計時器控制
    pauseTimers() {
        if (this.timers.welcome) {
            clearTimeout(this.timers.welcome);
        }
        if (this.countdownTimer) {
            clearInterval(this.countdownTimer);
        }
    }
    
    resumeTimers() {
        // 重新開始歡迎彈窗計時器
        if (!this.tracking.hasTriggeredWelcome) {
            this.startWelcomeTimer();
        }
        
        // 重新開始倒數計時器
        if (this.isCountdownActive && this.countdownTime > 0) {
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
        
        console.log('Marketing Event:', event);
        
        // 這裡可以發送到分析服務
        // this.sendToAnalytics(event);
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
}

// 全域函數（供 HTML 調用）
function closePopup(popupId) {
    if (window.marketingSystem) {
        window.marketingSystem.closePopup(popupId);
    }
}

function closeUrgencyBar() {
    if (window.marketingSystem) {
        window.marketingSystem.closeUrgencyBar();
    }
}

function bindLine() {
    if (window.marketingSystem) {
        window.marketingSystem.bindLine();
    }
}

function bindLineExit() {
    if (window.marketingSystem) {
        window.marketingSystem.bindLineExit();
    }
}

function claimDiscount() {
    if (window.marketingSystem) {
        window.marketingSystem.claimDiscount();
    }
}

function goToCheckout() {
    if (window.marketingSystem) {
        window.marketingSystem.goToCheckout();
    }
}

// 初始化系統
document.addEventListener('DOMContentLoaded', () => {
    window.marketingSystem = new MarketingPopupSystem();
});

// 頁面卸載前保存資料
window.addEventListener('beforeunload', () => {
    if (window.marketingSystem) {
        window.marketingSystem.saveSessionData();
    }
});
