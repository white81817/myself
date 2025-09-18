// 主要協調 JavaScript - 管理所有行銷功能
class MarketingSystem {
    constructor() {
        this.modules = {
            welcome: null,
            urgency: null,
            exit: null
        };
        
        this.globalTracking = {
            totalEvents: 0,
            sessionStart: Date.now(),
            userInteractions: []
        };
        
        this.init();
    }
    
    init() {
        this.setupGlobalEventListeners();
        this.initializeModules();
        this.startGlobalTracking();
    }
    
    setupGlobalEventListeners() {
        // 頁面載入完成後初始化所有模組
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeModules();
        });
        
        // 頁面卸載前保存所有資料
        window.addEventListener('beforeunload', () => {
            this.saveAllData();
        });
        
        // 頁面可見性變化
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
    }
    
    initializeModules() {
        // 等待所有模組載入完成
        setTimeout(() => {
            this.modules.welcome = window.welcomePopup;
            this.modules.urgency = window.urgencyBar;
            this.modules.exit = window.exitPopup;
            
            console.log('所有行銷模組已初始化:', this.modules);
        }, 100);
    }
    
    startGlobalTracking() {
        // 追蹤所有用戶互動
        document.addEventListener('click', (e) => {
            this.trackUserInteraction('click', {
                target: e.target.tagName,
                className: e.target.className,
                id: e.target.id
            });
        });
        
        document.addEventListener('scroll', () => {
            this.trackUserInteraction('scroll', {
                scrollY: window.scrollY,
                scrollX: window.scrollX
            });
        });
        
        // 追蹤表單提交
        document.addEventListener('submit', (e) => {
            this.trackUserInteraction('form_submit', {
                formId: e.target.id,
                formClass: e.target.className
            });
        });
    }
    
    handleVisibilityChange() {
        if (document.hidden) {
            this.pauseAllModules();
        } else {
            this.resumeAllModules();
        }
    }
    
    pauseAllModules() {
        if (this.modules.welcome) {
            this.modules.welcome.pauseTimer();
        }
        if (this.modules.urgency) {
            this.modules.urgency.pauseTimers();
        }
    }
    
    resumeAllModules() {
        if (this.modules.welcome) {
            this.modules.welcome.resumeTimer();
        }
        if (this.modules.urgency) {
            this.modules.urgency.resumeTimers();
        }
    }
    
    trackUserInteraction(type, data) {
        const interaction = {
            type: type,
            data: data,
            timestamp: Date.now(),
            url: window.location.href
        };
        
        this.globalTracking.userInteractions.push(interaction);
        this.globalTracking.totalEvents++;
        
        // 限制互動記錄數量，避免記憶體過度使用
        if (this.globalTracking.userInteractions.length > 100) {
            this.globalTracking.userInteractions = this.globalTracking.userInteractions.slice(-50);
        }
    }
    
    saveAllData() {
        const globalData = {
            globalTracking: this.globalTracking,
            timestamp: Date.now()
        };
        
        sessionStorage.setItem('marketing_system_data', JSON.stringify(globalData));
    }
    
    loadAllData() {
        const stored = sessionStorage.getItem('marketing_system_data');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                this.globalTracking = { ...this.globalTracking, ...data.globalTracking };
            } catch (e) {
                console.warn('無法載入全域資料:', e);
            }
        }
    }
    
    // 全域控制函數
    showAllPopups() {
        if (this.modules.welcome) this.modules.welcome.triggerManually();
        if (this.modules.urgency) this.modules.urgency.triggerManually();
        if (this.modules.exit) this.modules.exit.triggerManually();
    }
    
    hideAllPopups() {
        if (this.modules.welcome) this.modules.welcome.closePopup();
        if (this.modules.urgency) this.modules.urgency.closeBar();
        if (this.modules.exit) this.modules.exit.closePopup();
    }
    
    resetAllModules() {
        if (this.modules.welcome) this.modules.welcome.reset();
        if (this.modules.urgency) this.modules.urgency.reset();
        if (this.modules.exit) this.modules.exit.reset();
    }
    
    getSystemStatus() {
        return {
            modules: {
                welcome: this.modules.welcome ? this.modules.welcome.tracking : null,
                urgency: this.modules.urgency ? this.modules.urgency.tracking : null,
                exit: this.modules.exit ? this.modules.exit.tracking : null
            },
            global: this.globalTracking,
            countdown: this.modules.urgency ? {
                isActive: this.modules.urgency.isCountdownActive,
                timeLeft: this.modules.urgency.countdownTime
            } : null
        };
    }
    
    // 分析功能
    getAnalytics() {
        const status = this.getSystemStatus();
        const sessionDuration = Date.now() - this.globalTracking.sessionStart;
        
        return {
            sessionDuration: Math.round(sessionDuration / 1000),
            totalEvents: this.globalTracking.totalEvents,
            userInteractions: this.globalTracking.userInteractions.length,
            modulesTriggered: {
                welcome: status.modules.welcome?.hasTriggered || false,
                urgency: status.modules.urgency?.hasTriggered || false,
                exit: status.modules.exit?.hasTriggered || false
            },
            cartAdded: status.modules.urgency?.hasAddedToCart || false,
            timeOnPage: status.modules.welcome?.timeOnPage || 0
        };
    }
    
    // 匯出資料
    exportData() {
        const data = {
            analytics: this.getAnalytics(),
            status: this.getSystemStatus(),
            timestamp: Date.now()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `marketing_data_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// 全域函數（供 HTML 調用）
function closePopup(popupId) {
    switch(popupId) {
        case 'welcome-popup':
            if (window.welcomePopup) window.welcomePopup.closePopup();
            break;
        case 'exit-popup':
            if (window.exitPopup) window.exitPopup.closePopup();
            break;
        default:
            console.warn('未知的彈窗 ID:', popupId);
    }
}

function closeUrgencyBar() {
    if (window.urgencyBar) {
        window.urgencyBar.closeBar();
    }
}

function bindLine() {
    if (window.welcomePopup) {
        window.welcomePopup.bindLine();
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

function goToCheckout() {
    if (window.urgencyBar) {
        window.urgencyBar.goToCheckout();
    }
}

// 測試用全域函數
function showSystemStatus() {
    if (window.marketingSystem) {
        const status = window.marketingSystem.getSystemStatus();
        console.log('系統狀態:', status);
        return status;
    }
}

function showAnalytics() {
    if (window.marketingSystem) {
        const analytics = window.marketingSystem.getAnalytics();
        console.log('分析資料:', analytics);
        return analytics;
    }
}

function exportMarketingData() {
    if (window.marketingSystem) {
        window.marketingSystem.exportData();
    }
}

// 初始化主要系統
document.addEventListener('DOMContentLoaded', () => {
    window.marketingSystem = new MarketingSystem();
    console.log('行銷系統已啟動');
});
