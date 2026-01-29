
import React, { createContext, useContext, useState, useEffect } from 'react';
// --- Supabase Hybrid DB Integration ---
import { fetchContentHistory } from '../lib/supabase';

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within UserProvider');
    }
    return context;
};

// Plan limits definition
const PLAN_LIMITS = {
    free: {
        name: 'Free',
        price: 0,
        yearlyPrice: 0,
        monthly_limit: 20,
        features: ['basic_templates', 'unlimited_trends'],
        max_tokens: 1000
    },
    starter: {
        name: 'Starter',
        price: 19000,
        yearlyPrice: 15900,
        monthly_limit: 200,
        features: ['all_templates', 'basic_seo_analysis', 'no_watermark', 'multi_persona'],
        max_tokens: 2000
    },
    pro: {
        name: 'Pro',
        price: 49000,
        yearlyPrice: 39000,
        monthly_limit: 500,
        features: ['all_templates', 'affiliate_marketing', 'golden_keywords', 'auto_posting', 'seo_traffic_light', 'osmu_content', 'advanced_analytics', 'ai_coach', 'multi_persona', 'no_watermark'],
        max_tokens: 4000
    },
    business: {
        name: 'Business',
        price: 99000,
        yearlyPrice: 79000,
        monthly_limit: 2000,
        features: ['all_templates', 'team_collaboration', 'dedicated_api_option', 'approval_workflow', 'dedicated_support', 'custom_branding', 'multi_persona', 'no_watermark', 'seo_traffic_light', 'osmu_content'],
        max_tokens: 8000
    }
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [usage, setUsage] = useState({
        current_month: 0,
        total: 0,
        last_reset: new Date().toISOString()
    });
    const [notifications, setNotifications] = useState([]);
    const [revenueSettings, setRevenueSettings] = useState({
        adMultiplier: 1.0,
        affiliateMultiplier: 1.0,
        savingMultiplier: 1.0
    });

    // Global Data State
    const [history, setHistory] = useState([]);
    const [connectedAccounts, setConnectedAccounts] = useState([]);
    const [activeResult, setActiveResult] = useState(null);
    const [activePlatform, setActivePlatform] = useState('MASTER');
    const [monitoringTargets, setMonitoringTargets] = useState([]); // [1위 탈환 선전포고] 목표 키워드 리스트

    // --- Supabase Hybrid DB Integration ---

    const refreshHistory = async () => {
        try {
            const data = await fetchContentHistory();
            if (Array.isArray(data)) {
                setHistory(data);
            }
        } catch (err) {
            console.warn("Failed to refresh history:", err);
            // 에러가 나도 앱이 죽지 않도록 무시 (기존 로컬 데이터 유지)
        }
    };

    // Initialize Session & Data
    const handleSession = async () => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
                setIsAuthenticated(true);
                setUsage({
                    current_month: parsedUser.usage || 0,
                    total: parsedUser.usage || 0,
                    last_reset: new Date().toISOString()
                });
            } catch (e) {
                console.error("Failed to parse saved user", e);
                localStorage.removeItem('user');
            }
        }

        // Load History from Hybrid DB (Supabase or LocalStorage)
        await refreshHistory();

        try {
            const savedSettings = localStorage.getItem('revenueSettings');
            if (savedSettings) setRevenueSettings(JSON.parse(savedSettings));

            // Fix: Load usage independently
            const savedUsage = localStorage.getItem('usage');
            if (savedUsage) {
                setUsage(JSON.parse(savedUsage));
            }
        } catch (e) {
            console.error("Failed to load local data", e);
        }
    };

    // --- Supabase Auth Integration (DISABLED / MOCK MODE) ---
    useEffect(() => {
        handleSession();
    }, []);

    // --- Helper: Handle Mock Login ---
    const handleMockLogin = (mockUser) => {
        const saved = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {};
        const finalUser = { ...mockUser, theme: saved.theme || 'dark', plan: saved.plan || mockUser.plan };
        setUser(finalUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(finalUser));
        setUsage({ current_month: saved.usage || 0, total: saved.usage || 0, last_reset: new Date().toISOString() });
    };

    // --- Auth Functions (Restored) ---
    const loginWithGoogle = async () => {
        addNotification("로컬 데모 모드: Google 로그인이 시뮬레이션됩니다.", "info");
        const mockUser = {
            id: `google-${Date.now()}`,
            email: "demo@gmail.com",
            name: "Demo User",
            avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
            plan: 'free',
            role: 'user',
            subscription_end: null
        };
        handleMockLogin(mockUser);
    };

    const login = async (email, password) => {
        // Admin Backdoor Check
        const isAdmin = email === 'admin@master.com';

        const mockUser = {
            id: isAdmin ? 'admin-master' : `user-${Date.now()}`,
            email: email,
            name: isAdmin ? 'Master Administrator' : email.split('@')[0],
            plan: isAdmin ? 'business' : 'free',
            role: isAdmin ? 'admin' : 'user',
            subscription_end: null,
            isAdmin: isAdmin // Explicit flag
        };
        handleMockLogin(mockUser);
        if (isAdmin) {
            addNotification("관리자 권한으로 시스템에 접속합니다. (God Mode Active)", "success");
        }
        return mockUser;
    };

    const signup = async (email, password, name) => {
        // Admin Backdoor Check for Signup as well
        const isAdmin = email === 'admin@master.com';

        const mockUser = {
            id: isAdmin ? 'admin-master' : `user-${Date.now()}`,
            email: email,
            name: isAdmin ? 'Master Administrator' : (name || email.split('@')[0]),
            plan: isAdmin ? 'business' : 'free',
            role: isAdmin ? 'admin' : 'user',
            subscription_end: null,
            isAdmin: isAdmin
        };
        handleMockLogin(mockUser);
        if (isAdmin) {
            addNotification("관리자 권한으로 계정이 생성되었습니다. (God Mode Active)", "success");
        } else {
            addNotification("회원가입 성공! (로컬 모드)", "success");
        }
        return mockUser;
    };

    const logout = async () => {
        setUser(null);
        setIsAuthenticated(false);
        setUsage({ current_month: 0, total: 0, last_reset: new Date().toISOString() });
        setHistory([]);
        setConnectedAccounts([]);
        localStorage.removeItem('user');
        localStorage.removeItem('db_history');
        localStorage.removeItem('connectedAccounts');
        localStorage.removeItem('usage');
    };

    // --- Data Management ---
    const addToHistory = async (item) => {
        // Legacy support wrapper
        // The StudioView saves directly strictly, but this helper is good for other parts
        const { saveContentHistory } = await import('../lib/supabase');
        await saveContentHistory(item);
        await refreshHistory();
    };

    const deleteHistory = async (id) => {
        // Simulation only for now (DB delete not implemented in supabase lib yet)
        const newHistory = history.filter(item => item.id !== id);
        setHistory(newHistory);
        localStorage.setItem('db_history', JSON.stringify(newHistory)); // Direct Hack for Mock DB update
    };

    const updateHistoryItem = async (id, updates) => {
        const newHistory = history.map(item =>
            (item.id === id || item.createdAt === id) ? { ...item, ...updates } : item
        );
        setHistory(newHistory);
        localStorage.setItem('db_history', JSON.stringify(newHistory));
    };

    const connectAccount = (platform) => {
        if (!connectedAccounts.includes(platform)) {
            const newAccounts = [...connectedAccounts, platform];
            setConnectedAccounts(newAccounts);
            localStorage.setItem('connectedAccounts', JSON.stringify(newAccounts));
        }
    };

    const disconnectAccount = (platform) => {
        const newAccounts = connectedAccounts.filter(p => p !== platform);
        setConnectedAccounts(newAccounts);
        localStorage.setItem('connectedAccounts', JSON.stringify(newAccounts));
    };

    const updateRevenueSettings = (newSettings) => {
        setRevenueSettings(newSettings);
        localStorage.setItem('revenueSettings', JSON.stringify(newSettings));
        addNotification("수익 산출 기준이 보정되었습니다.", "success");
    };

    // --- User Features ---

    const upgradePlan = async (planId, isTrial = false) => {
        if (!user) return;

        const subscriptionEnd = new Date();
        if (isTrial) {
            subscriptionEnd.setDate(subscriptionEnd.getDate() + 14);
        } else {
            subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);
        }

        const updates = {
            plan: planId,
            subscription_end: subscriptionEnd.toISOString(),
            is_trial: isTrial
        };

        // Local Only Update - 즉시 반영
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));

        // 알림 표시
        addNotification(`🎉 ${PLAN_LIMITS[planId]?.name} 멤버십으로 업그레이드되었습니다!`, "success");

        // 즉시 UI 반영을 위해 강제 리렌더링
        // 0.5초 후 페이지 새로고침 (모든 컴포넌트가 새 plan 인식하도록)
        setTimeout(() => {
            window.location.reload();
        }, 500);
    };

    const updateUser = async (updates) => {
        if (!user) return;
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        addNotification("정보가 업데이트되었습니다. (로컬)", "success");
        return updatedUser;
    };

    // --- [시스템 전술: 전리품 공유] Reward Logic ---
    const claimReward = (rewardType) => {
        if (!user) return;

        let message = "";
        if (rewardType === 'share_report') {
            // Pro 1일 연장 시뮬레이션
            const currentEnd = user.subscription_end ? new Date(user.subscription_end) : new Date();
            currentEnd.setDate(currentEnd.getDate() + 1);

            const updatedUser = {
                ...user,
                subscription_end: currentEnd.toISOString(),
                plan: user.plan === 'free' ? 'starter' : user.plan // 최소 Starter로 승격
            };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            message = "🎁 리포트 공유 보상: Pro 기능 1일 연장권이 적용되었습니다!";
        }

        if (message) addNotification(message, "success");
    };

    // --- [시스템 전술: 선전포고] Monitoring Logic ---
    const addMonitoringTarget = (keyword) => {
        if (!monitoringTargets.includes(keyword)) {
            const newTargets = [...monitoringTargets, keyword];
            setMonitoringTargets(newTargets);
            addNotification(`🎯 [${keyword}] 키워드 1위 추적을 시작합니다. 점령 기회 발생 시 즉시 보고하겠습니다.`, "info");
        }
    };

    const incrementUsage = async () => {
        if (!user) return;

        const newCount = usage.current_month + 1;
        const newUsage = { ...usage, current_month: newCount, total: usage.total + 1 };

        setUsage(newUsage); // Optimistic update
        localStorage.setItem('usage', JSON.stringify(newUsage));

        // Smart Notifications based on remaining usage
        const planLimit = PLAN_LIMITS[user.plan]?.monthly_limit || 10;
        const remaining = planLimit - newCount;

        // 🎉 Success Confetti
        if (typeof window !== 'undefined' && window.confetti) {
            window.confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#6366f1', '#8b5cf6', '#ec4899']
            });
        }

        // Remaining usage warnings
        if (remaining === 2 && user.plan === 'free') {
            setTimeout(() => {
                addNotification(
                    `⚠️ 이번 달 무료 생성이 2회 남았습니다! 무제한으로 업그레이드 하세요 →`,
                    'warning'
                );
            }, 2000);
        } else if (remaining === 0 && user.plan === 'free') {
            setTimeout(() => {
                addNotification(
                    `🚫 이번 달 무료 생성 횟수를 모두 사용했습니다. Pro 플랜으로 업그레이드하여 무제한 생성하세요!`,
                    'error'
                );
            }, 2000);
        } else if (remaining > 0) {
            addNotification(`✅ 콘텐츠 생성 완료! (남은 횟수: ${remaining}회)`, 'success');
        }

        return newUsage;
    };

    const canGenerateContent = () => {
        if (!user) return false;
        const limit = PLAN_LIMITS[user.plan].monthly_limit;
        if (limit === -1) return true;
        return usage.current_month < limit;
    };

    const getRemainingGenerations = () => {
        if (!user) return 0;
        const limit = PLAN_LIMITS[user.plan].monthly_limit;
        if (limit === -1) return -1;
        return Math.max(0, limit - usage.current_month);
    };

    const getCurrentPlanDetails = () => {
        if (!user) return PLAN_LIMITS.free;
        return PLAN_LIMITS[user.plan];
    };

    // --- Notifications ---
    const addNotification = (message, type = 'info', duration = 5000) => {
        const id = Date.now() + Math.random();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, duration);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const value = {
        user,
        isAuthenticated,
        usage,
        notifications,
        history,
        connectedAccounts,
        activeResult,
        setActiveResult,
        activePlatform,
        setActivePlatform,
        monitoringTargets,
        addNotification,
        removeNotification,
        refreshHistory, // Exported to allow manual sync
        login,
        loginWithGoogle,
        signup,
        logout,
        upgradePlan,
        updateUser,
        incrementUsage,
        addToHistory,
        updateHistoryItem,
        deleteHistory,
        connectAccount,
        disconnectAccount,
        canGenerateContent,
        getRemainingGenerations,
        getCurrentPlanDetails,
        PLAN_LIMITS,
        claimReward,
        addMonitoringTarget,
        revenueSettings,
        updateRevenueSettings
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
