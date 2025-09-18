// 退出彈窗功能 - 離站階段
class ExitPopup {
    constructor() {
        this.tracking = {
            hasTriggered: false
        };
        
        this.exitIntentTriggered = false;
        this.init();
    }
    
    init() {
        this.loadSessionData();
        this.setupEventListeners();
        this.setupExitIntent();
    }
    
    setupEventListeners() {
        // 頁面卸載前保存資料
        window.addEventListener('beforeunload', () => {
            this.saveSessionData();
        });
    }
    
    // Exit Intent 偵測
    setupExitIntent() {
        // 桌面版滑鼠離開偵測
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0 && !this.exitIntentTriggered && !this.tracking.hasTriggered) {
                this.exitIntentTriggered = true;
                this.showPopup();
            }
        });
        
        // 移動裝置的退出意圖偵測
        document.addEventListener('touchstart', () => {
            if (window.scrollY === 0 && !this.exitIntentTriggered && !this.tracking.hasTriggered) {
                this.exitIntentTriggered = true;
                setTimeout(() => {
                    this.showPopup();
                }, 100);
            }
        });
        
        // 鍵盤退出偵測（ESC 鍵）
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.exitIntentTriggered && !this.tracking.hasTriggered) {
                this.exitIntentTriggered = true;
                this.showPopup();
            }
        });
        
        // 頁面滾動到頂部時的退出意圖
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (window.scrollY === 0 && !this.exitIntentTriggered && !this.tracking.hasTriggered) {
                    this.exitIntentTriggered = true;
                    this.showPopup();
                }
            }, 500);
        });
    }
    
    showPopup() {
        if (this.tracking.hasTriggered) return;
        
        this.tracking.hasTriggered = true;
        const popup = document.getElementById('exit-popup');
        
        if (popup) {
            popup.classList.add('show');
            document.body.classList.add('popup-open');
            
            // 記錄觸發事件
            this.logEvent('exit_popup_shown');
        }
    }
    
    closePopup() {
        const popup = document.getElementById('exit-popup');
        if (popup) {
            popup.classList.remove('show');
            document.body.classList.remove('popup-open');
            
            // 記錄關閉事件
            this.logEvent('exit_popup_closed');
        }
    }
    
    bindLineExit() {
        // 模擬 LINE 綁定
        this.logEvent('line_bind_exit_attempted');
        alert('正在跳轉到 LINE 綁定頁面...');
        this.closePopup();
    }
    
    claimDiscount() {
        const email = document.getElementById('exit-email');
        if (email && this.isValidEmail(email.value)) {
            this.logEvent('discount_claimed', { email: email.value });
            alert(`折扣券已發送到 ${email.value}，請查收！`);
            this.closePopup();
        } else {
            alert('請輸入有效的 email 地址');
        }
    }
    
    // 工具函數
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Session 資料管理
    saveSessionData() {
        const sessionData = {
            exitTracking: this.tracking,
            timestamp: Date.now()
        };
        
        sessionStorage.setItem('exit_popup_data', JSON.stringify(sessionData));
    }
    
    loadSessionData() {
        const stored = sessionStorage.getItem('exit_popup_data');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                
                // 檢查是否為同一天
                const today = new Date().toDateString();
                const storedDate = new Date(data.timestamp).toDateString();
                
                if (today === storedDate) {
                    this.tracking = { ...this.tracking, ...data.exitTracking };
                } else {
                    // 新的一天，重置資料
                    this.resetDailyData();
                }
            } catch (e) {
                console.warn('無法載入退出彈窗 session 資料:', e);
            }
        }
    }
    
    resetDailyData() {
        this.tracking = {
            hasTriggered: false
        };
        this.exitIntentTriggered = false;
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
        
        console.log('Exit Popup Event:', event);
    }
    
    // 手動觸發（供測試用）
    triggerManually() {
        this.showPopup();
    }
    
    // 重置狀態（供測試用）
    reset() {
        this.tracking.hasTriggered = false;
        this.exitIntentTriggered = false;
        this.closePopup();
    }
    
    // 重新啟用退出意圖偵測（供測試用）
    enableExitIntent() {
        this.exitIntentTriggered = false;
        this.tracking.hasTriggered = false;
    }
}

// 全域函數（供 HTML 調用）
function closeExitPopup() {
    if (window.exitPopup) {
        window.exitPopup.closePopup();
    }
}

function bindLineExit() {
    if (window.exitPopup) {
        window.exitPopup.bindLineExit();
    }
}

function claimDiscount() {
    if (window.exitPopup) {
        window.exitPopup.claimDiscount();
    }
}

// 初始化退出彈窗
document.addEventListener('DOMContentLoaded', () => {
    window.exitPopup = new ExitPopup();
});
