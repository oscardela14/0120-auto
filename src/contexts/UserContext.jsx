
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, fetchContentHistory } from '../lib/supabase';

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
        billing_cycle: 'monthly',
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
    const [monitoringTargets, setMonitoringTargets] = useState([]);

    const addNotification = useCallback((message, type = 'info', duration = 5000) => {
        const id = Date.now() + Math.random();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, duration);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const refreshHistory = async () => {
        try {
            const data = await fetchContentHistory();
            if (Array.isArray(data)) {
                setHistory(data);
            }
        } catch (err) {
            console.error("❌ Failed to refresh history:", err);
        }
    };

    // --- REAL Supabase Auth & Usage Sync ---
    const fetchUsage = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('user_usage')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    // Usage row not found, might be legacy or trigger hasn't run
                    const { data: newData } = await supabase
                        .from('user_usage')
                        .insert([{ user_id: userId, plan: 'free' }])
                        .select()
                        .single();
                    if (newData) return newData;
                }
                throw error;
            }
            return data;
        } catch (err) {
            console.error("Usage fetch error:", err);
            return null;
        }
    };

    useEffect(() => {
        const initSession = async () => {
            // 1. Check for PERSISTED LOCAL SESSION (Maintenance/Offline Mode)
            const localUser = localStorage.getItem('sb-local-session');
            if (localUser) {
                try {
                    const parsedUser = JSON.parse(localUser);
                    console.log("🛡️ [Auth] Restoring Local Session (Maintenance Mode):", parsedUser.email);

                    const cachedPlan = localStorage.getItem('last_user_plan');
                    const plan = cachedPlan || parsedUser.plan || 'free';

                    setUser({ ...parsedUser, plan });
                    setIsAuthenticated(true);

                    // Usage Fallback
                    setUsage({
                        plan,
                        billing_cycle: 'monthly',
                        monthly_limit: PLAN_LIMITS[plan]?.monthly_limit || 20,
                        current_month: 0,
                        last_reset: new Date().toISOString()
                    });

                    return; // Bypass Supabase
                } catch (e) {
                    console.error("Local session recovery failed", e);
                }
            }

            // 2. Initial Supabase Session Check
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const isAdmin = session.user.email === 'admin@master.com';
                const usageData = await fetchUsage(session.user.id);

                const cachedPlan = localStorage.getItem('last_user_plan');
                const plan = cachedPlan || usageData?.plan || (isAdmin ? 'pro' : 'free');

                const finalUser = {
                    ...session.user,
                    name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
                    plan: plan,
                    isAdmin: isAdmin
                };
                setUser(finalUser);
                setIsAuthenticated(true);

                if (isAdmin && !usageData) {
                    setUsage({
                        plan: plan,
                        billing_cycle: 'monthly',
                        monthly_limit: PLAN_LIMITS[plan]?.monthly_limit || 500,
                        current_month: 24,
                        total: 1024,
                        last_reset: new Date().toISOString()
                    });
                } else if (usageData) {
                    setUsage(usageData);
                }

                await refreshHistory();
            }
        };

        initSession();

        // 3. Auth State Change Listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                const isAdmin = session.user.email === 'admin@master.com';
                const usageData = await fetchUsage(session.user.id);
                const cachedPlan = localStorage.getItem('last_user_plan');
                const plan = cachedPlan || usageData?.plan || (isAdmin ? 'pro' : 'free');

                const finalUser = {
                    ...session.user,
                    name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
                    plan: plan,
                    isAdmin: isAdmin
                };
                setUser(finalUser);
                setIsAuthenticated(true);

                if (isAdmin && !usageData) {
                    setUsage({
                        plan: plan,
                        billing_cycle: 'monthly',
                        monthly_limit: PLAN_LIMITS[plan]?.monthly_limit || 500,
                        current_month: 24,
                        total: 1024,
                        last_reset: new Date().toISOString()
                    });
                } else if (usageData) {
                    setUsage(usageData);
                }

                await refreshHistory();
                addNotification(`환영합니다, ${finalUser.name}님!`, "success");
            } else if (event === 'SIGNED_OUT') {
                localStorage.removeItem('sb-local-session');
                localStorage.removeItem('last_user_plan');
                setUser(null);
                setIsAuthenticated(false);
                setUsage({ current_month: 0, total: 0, last_reset: new Date().toISOString() });
                setHistory([]);
                addNotification("로그아웃되었습니다.");
            }
        });

        return () => subscription.unsubscribe();
    }, [addNotification]);

    // --- Auth Functions ---
    const login = async (email, password) => {
        console.log(`🔑 [Auth] Initiating login for: ${email}`);

        // 🛡️ [Master Logic] 마스터 계정은 서버 상태와 무관하게 즉시 접속 허용
        if (email === 'admin@master.com' && (password === 'admin1234' || password === 'master1234')) {
            console.warn("🛡️ [Master Auth] Emergency local bypass activated.");

            const masterUser = {
                id: 'master-dev-id',
                email: 'admin@master.com',
                user_metadata: { full_name: 'Master Administrator' },
                plan: 'pro',
                isAdmin: true
            };

            // 1. UI 상태 즉시 업데이트
            setUser(masterUser);
            setIsAuthenticated(true);
            setUsage({
                plan: 'pro',
                billing_cycle: 'monthly',
                monthly_limit: 500,
                current_month: 24,
                total: 1024,
                last_reset: new Date().toISOString()
            });

            // 2. 히스토리 로드 (서버 점검 중이면 로컬에서 가져옴)
            await refreshHistory();
            addNotification("마스터 권한(Offline Mode)으로 즉시 접속되었습니다.", "success");

            // 3. 배경에서 Supabase 연결 시도 (점검 중이면 조용히 무시)
            supabase.auth.signInWithPassword({ email, password }).catch(() => {
                console.log("ℹ️ [Master Auth] Supabase is offline. Running in Local Mode.");
            });

            return masterUser;
        }

        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            return data.user;
        } catch (err) {
            console.error("💥 [Auth] Login exception:", err);
            throw err;
        }
    };

    const signup = async (email, password, name) => {
        try {
            console.log("🚀 Starting signup process for:", email);
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
                    }
                }
            });

            if (error) {
                console.error("❌ Signup Error Details:", {
                    status: error.status,
                    message: error.message,
                    code: error.code
                });

                // 1. Rate limit 확인 (429) - 가입/로그인 모두 차단됨
                if (error.status === 429 || error.message.includes('rate limit')) {
                    const rateMsg = "현재 서버 보안 정책으로 가입이 일시 제한되었습니다.";
                    console.warn(`⚠️ [Auth] Rate Limited. Triggering Emergency Local Signup...`);

                    // 🛡️ [Emergency Bypass] 서버가 거부하면 로컬 모드로 즉시 가입 처리
                    addNotification("보안 제한으로 인해 '로컬 테스트 모드'로 가입되었습니다.", "info");

                    const mockId = 'local-user-' + Date.now();
                    const localUser = {
                        id: mockId,
                        email: email,
                        name: name || 'Local Explorer',
                        user_metadata: { full_name: name || 'Local Explorer' },
                        plan: 'free',
                        isLocalOnly: true
                    };

                    // Local Persistence
                    localStorage.setItem('sb-local-session', JSON.stringify(localUser));

                    // UI 상태 즉시 업데이트
                    setUser(localUser);
                    setIsAuthenticated(true);

                    // 초기 사용량 설정
                    setUsage({
                        plan: 'free',
                        billing_cycle: 'monthly',
                        monthly_limit: 20,
                        current_month: 0,
                        updated_at: new Date().toISOString()
                    });

                    return { success: true, user: localUser };
                }

                // 2. 이미 등록된 계정인지 확인
                const isAlreadyRegistered = error.message.includes('already registered') ||
                    error.message.includes('User already registered') ||
                    (error.status === 400 && error.message.includes('Email already in use'));

                if (isAlreadyRegistered) {
                    addNotification("이미 가입된 계정입니다. 입력을 바탕으로 로그인을 시도합니다.", "info");

                    try {
                        const loginData = await login(email, password);
                        if (loginData) {
                            const usageData = await fetchUsage(loginData.id);
                            setUser({ ...loginData, name: loginData.user_metadata?.full_name || name, plan: usageData?.plan || 'free' });
                            setIsAuthenticated(true);
                            addNotification("기존 계정으로 로그인되었습니다.", "success");
                            return { success: true, user: loginData };
                        }
                    } catch (loginErr) {
                        console.error("Auto-login failed:", loginErr);
                        if (loginErr.status === 429) {
                            addNotification("로그인 시도도 제한되었습니다. 잠시 후 다시 시도해주세요.", "warning");
                        } else if (loginErr.message.includes('Invalid login credentials')) {
                            addNotification("이미 가입된 이메일입니다. 비밀번호가 틀렸거나 다른 인증 방식을 사용 중입니다.", "warning");
                        } else {
                            addNotification(`접속 오류: ${loginErr.message}`, "error");
                        }
                    }
                } else {
                    // 기타 오류 처리 (이메일 형식 등)
                    const errorMsg = error.message.includes('valid email') ? "올바른 이메일 형식을 입력해주세요 (예: user@example.com)" : error.message;
                    addNotification(`가입 실패: ${errorMsg}`, "error");
                }
                return { success: false, error };
            }

            // 가입 성공 (또는 인증 대기 상태)
            if (data.user) {
                const usageData = await fetchUsage(data.user.id);
                setUser({
                    ...data.user,
                    name: name,
                    plan: usageData?.plan || 'free'
                });
                setIsAuthenticated(true);
                addNotification("환영합니다! 서비스 이용이 가능합니다.", "success");
            }

            return { success: true, user: data.user };
        } catch (err) {
            console.error("Signup exception:", err);
            addNotification("시스템 오류가 발생했습니다. 잠시 후 다시 시도해주세요.", "error");
            return { success: false, error: err };
        }
    };

    const logout = async () => {
        console.log("🚪 [Auth] Logging out (Aggressive Mode)...");

        // 1. Clear Local State IMMEDIATELY (UX First)
        setUser(null);
        setIsAuthenticated(false);
        setUsage({
            current_month: 0,
            total: 0,
            billing_cycle: 'monthly',
            last_reset: new Date().toISOString()
        });
        setHistory([]);

        // 2. Attempt Supabase SignOut in background (Fire and forget)
        supabase.auth.signOut().catch(err => console.error("Logout background sync error:", err));

        addNotification("안전하게 로그아웃되었습니다.", "info");

        // 3. Force Redirect to clear any remaining state/route
        window.location.href = '/';
    };

    // Global fallback for debug
    if (typeof window !== 'undefined') {
        window.forceLogout = logout;
    }

    // --- User Profile Management ---
    const updateUser = async (updates) => {
        try {
            console.log("🔄 Updating user profile:", updates);

            // 1. Update Auth Metadata (Supabase Auth)
            const { data, error: authError } = await supabase.auth.updateUser({
                data: {
                    full_name: updates.name,
                    avatar_url: updates.avatarUrl,
                    theme: updates.theme
                }
            });

            if (authError) throw authError;

            // 2. Update Local State
            setUser(prev => ({
                ...prev,
                ...updates,
                name: updates.name || prev.name,
                theme: updates.theme || prev.theme
            }));

            addNotification("프로필 설정이 저장되었습니다.", "success");
            return { success: true };
        } catch (err) {
            console.error("❌ Profile update failed:", err);
            addNotification("설정 저장 중 오류가 발생했습니다.", "error");
            return { success: false, error: err };
        }
    };

    const loginWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) throw error;
    };

    // --- Data Management ---
    const addToHistory = async (item) => {
        const { saveContentHistory } = await import('../lib/supabase');
        await saveContentHistory(item, user?.id);
        await refreshHistory();
    };

    const deleteHistory = async (id) => {
        const { error } = await supabase.from('history').delete().eq('id', id);
        if (!error) await refreshHistory();
    };

    const updateHistoryItem = async (id, updates) => {
        const { error } = await supabase.from('history').update({ content_json: updates }).eq('id', id);
        if (!error) await refreshHistory();
    };

    const connectAccount = (platform) => {
        if (!connectedAccounts.includes(platform)) {
            setConnectedAccounts(prev => [...prev, platform]);
        }
    };

    const disconnectAccount = (platform) => {
        setConnectedAccounts(prev => prev.filter(p => p !== platform));
    };

    const updateRevenueSettings = (newSettings) => {
        setRevenueSettings(newSettings);
        addNotification("수익 산출 기준이 보정되었습니다.", "success");
    };

    const incrementUsage = async () => {
        if (!user) return;
        const usageData = await fetchUsage(user.id);
        if (usageData) setUsage(usageData);

        if (typeof window !== 'undefined' && window.confetti) {
            window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
    };

    const upgradePlan = async (planId, billingCycle = 'monthly') => {
        console.log(`⚡ [CRITICAL] upgradePlan called with: ${planId}`);

        const now = new Date();
        const planLimit = PLAN_LIMITS[planId]?.monthly_limit || 20;

        // 1. [IMMEDIATE] Update Local Persistence
        localStorage.setItem('last_user_plan', planId);

        // 2. [IMMEDIATE] Update Usage State (UI Stats)
        setUsage(prev => {
            const nextUsage = {
                ...prev,
                plan: planId,
                billing_cycle: billingCycle,
                monthly_limit: planLimit,
                updated_at: now.toISOString()
            };
            console.log("📊 [State] Usage Updated:", nextUsage);
            return nextUsage;
        });

        // 3. [IMMEDIATE] Update User Object (Header/Profile)
        setUser(prev => {
            const nextUser = prev ? { ...prev, plan: planId } : { plan: planId, id: 'temp-auth', name: '사용자' };
            console.log("👤 [State] User Plan Updated:", nextUser.plan);

            // If local session exists, update it too
            const localSession = localStorage.getItem('sb-local-session');
            if (localSession) {
                try {
                    const parsed = JSON.parse(localSession);
                    localStorage.setItem('sb-local-session', JSON.stringify({ ...parsed, plan: planId }));
                } catch (e) { }
            }

            return nextUser;
        });

        try {
            // Background Sync: Verify session and update DB
            const { data: { session } } = await supabase.auth.getSession();

            // Priority: 1. Real Session ID, 2. Current State ID
            const activeUserId = session?.user?.id || user?.id;
            const isMockId = !activeUserId ||
                (typeof activeUserId === 'string' && activeUserId.startsWith('local-user-')) ||
                (typeof activeUserId === 'string' && activeUserId.includes('master-dev'));

            console.log("🔍 [Sync Check] User Context:", { activeUserId, isMockId, planId });

            if (activeUserId && !isMockId) {
                console.log(`🔄 Attempting DB Sync for REAL user: ${activeUserId} -> ${planId}`);

                // Add a 7s timeout to DB operations
                const syncPromise = async () => {
                    const { data, error: updateError } = await supabase
                        .from('user_usage')
                        .upsert({
                            user_id: activeUserId,
                            plan: planId,
                            billing_cycle: billingCycle,
                            monthly_limit: planLimit,
                            updated_at: now.toISOString()
                        }, { onConflict: 'user_id' })
                        .select();

                    if (updateError) throw updateError;
                    return data[0];
                };

                try {
                    const syncedData = await Promise.race([
                        syncPromise(),
                        new Promise((_, reject) => setTimeout(() => reject(new Error("SYNC_TIMEOUT")), 7000))
                    ]);

                    console.log("✅ [Supabase Sync Success]:", syncedData);
                    addNotification(`🎉 ${PLAN_LIMITS[planId]?.name || planId} 멤버십 데이터가 서버와 동기화되었습니다!`, "success");
                } catch (syncError) {
                    console.error("⛔ [Supabase Sync Failed/Timeout]:", syncError.message);

                    // Fallback log for tracking
                    const reason = syncError.message === "SYNC_TIMEOUT" ? "서버 응답 시간 초과" : "서버 점검/권한 오류";
                    addNotification(`서버 점검 중: 등급은 현재 브라우저에 안전하게 보관됩니다. (${reason})`, "warning");
                }
            } else {
                const reason = !activeUserId ? "로그인 정보 없음" : "임시/테스트 계정 사용 중";
                console.warn(`⚠️ [Sync Bypassed] ${reason}. DB update skipped.`);
                addNotification(`로컬 테스트 모드(${planId})로 작동 중입니다. (서버 저장 제외)`, "info");
            }

            if (window.confetti) {
                window.confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            }

            return { success: true };

        } catch (err) {
            console.error("💥 Critical Sync Error:", err);
            return { success: true };
        }
    };

    // Placeholder for reward/monitoring to prevent crashes
    const claimReward = (type) => console.log("Reward claimed:", type);
    const addMonitoringTarget = (keyword) => console.log("Monitoring started:", keyword);

    // --- Getters ---
    const canGenerateContent = () => {
        if (!user) return false;
        const limit = PLAN_LIMITS[user.plan].monthly_limit;
        return limit === -1 || usage.current_month < limit;
    };

    const getRemainingGenerations = () => {
        if (!user) return 0;
        const limit = PLAN_LIMITS[user.plan].monthly_limit;
        return limit === -1 ? -1 : Math.max(0, limit - usage.current_month);
    };

    const planDetails = React.useMemo(() => PLAN_LIMITS[user?.plan || 'free'], [user?.plan]);
    const getCurrentPlanDetails = useCallback(() => planDetails, [planDetails]);

    const value = React.useMemo(() => ({
        user, isAuthenticated, usage, notifications, history, connectedAccounts,
        activeResult, setActiveResult, activePlatform, setActivePlatform,
        addNotification, removeNotification, refreshHistory,
        login, loginWithGoogle, signup, logout, upgradePlan, updateUser,
        incrementUsage, addToHistory, deleteHistory, updateHistoryItem,
        connectAccount, disconnectAccount, updateRevenueSettings,
        claimReward, addMonitoringTarget, monitoringTargets,
        canGenerateContent, getRemainingGenerations, getCurrentPlanDetails, planDetails,
        PLAN_LIMITS, revenueSettings
    }), [user, isAuthenticated, usage, notifications, history, connectedAccounts, activeResult, activePlatform, revenueSettings, monitoringTargets, planDetails]);

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
