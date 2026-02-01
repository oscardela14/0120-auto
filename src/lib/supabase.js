
import { createClient } from '@supabase/supabase-js';

// Helper to generate valid UUIDs for mock data
export const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client;
let isMock = true;

// 1. URL/Key가 유효한지 1차 검증
const isValidUrl = (url) => {
    try {
        return url && url.startsWith('http') && !url.includes('YOUR_SUPABASE') && !url.includes('dashboard/project');
    } catch {
        return false;
    }
};

if (isValidUrl(supabaseUrl) && supabaseAnonKey && !supabaseAnonKey.includes('YOUR_SUPABASE')) {
    try {
        console.log("🔗 Initializing Supabase with:", supabaseUrl);
        client = createClient(supabaseUrl, supabaseAnonKey);
        isMock = false;
        console.log("✅ Supabase Real Client Connected");
    } catch (error) {
        console.error("Supabase Client Init Error:", error);
    }
} else {
    console.warn("⚠️ Supabase Credentials missing or invalid. Mode: Mock/LocalStorage.");
    console.log("DEBUG: supabaseUrl =", supabaseUrl);
}

// 2. 초기화 실패 시 Mock Client (LocalStorage 기반) 제공
if (!client) {
    console.warn("⚠️ Supabase 설정이 올바르지 않습니다. LocalStorage를 대체 DB로 사용합니다.");

    const MOCK_DELAY = 300; // 네트워크 지연 시뮬레이션

    client = {
        auth: {
            getSession: async () => {
                const session = localStorage.getItem('sb-mock-session');
                return { data: { session: session ? JSON.parse(session) : null } };
            },
            onAuthStateChange: (callback) => {
                window.addEventListener('storage', (e) => {
                    if (e.key === 'sb-mock-session') {
                        const session = e.newValue ? JSON.parse(e.newValue) : null;
                        callback('SIGNED_IN', session);
                    }
                });
                return { data: { subscription: { unsubscribe: () => { } } } };
            },
            signInWithOAuth: async () => {
                alert("현재 '데모 모드'입니다.\n실제 소셜 로그인은 Supabase 연동이 필요합니다.\n자동으로 가상 로그인 처리됩니다.");
                const mockId = generateUUID();
                const mockUser = {
                    user: { id: mockId, email: 'demo@example.com', user_metadata: { full_name: 'Demo User' } },
                    access_token: 'mock-token'
                };
                localStorage.setItem('sb-mock-session', JSON.stringify(mockUser));
                window.location.reload(); // 리프레시하여 상태 반영
                return { data: mockUser, error: null };
            },
            signOut: async () => {
                localStorage.removeItem('sb-mock-session');
                window.location.reload();
            },
            getUser: async () => {
                const session = localStorage.getItem('sb-mock-session');
                return { data: { user: session ? JSON.parse(session).user : null } };
            },
        },
        // Mock DB Operations (LocalStorage 'db_tables' key)
        from: (table) => {
            const getTableData = () => JSON.parse(localStorage.getItem(`db_${table}`) || '[]');
            const setTableData = (data) => localStorage.setItem(`db_${table}`, JSON.stringify(data));

            const queryChain = {
                data: getTableData(),
                error: null,
                select: function () { return this; },
                eq: function (col, val) {
                    this.data = this.data.filter(r => r[col] === val);
                    return this;
                },
                single: function () {
                    return Promise.resolve({ data: this.data[0] || null, error: this.data[0] ? null : { code: 'PGRST116' } });
                },
                order: function () { return Promise.resolve({ data: this.data, error: null }); },
                insert: function (rows) {
                    const current = getTableData();
                    const input = Array.isArray(rows) ? rows : [rows];
                    const newRows = input.map(r => ({ ...r, id: r.id || Date.now() + Math.random(), created_at: new Date().toISOString() }));
                    setTableData([...newRows, ...current]);
                    return Promise.resolve({ data: newRows, error: null });
                },
                upsert: function (row, options = {}) {
                    const current = getTableData();
                    const onConflict = options.onConflict || 'id';
                    const index = current.findIndex(r => r[onConflict] === row[onConflict]);

                    let updatedData;
                    if (index > -1) {
                        current[index] = { ...current[index], ...row, updated_at: new Date().toISOString() };
                        updatedData = [current[index]];
                        setTableData(current);
                    } else {
                        const newRow = { ...row, id: row.id || Date.now() + Math.random(), created_at: new Date().toISOString() };
                        updatedData = [newRow];
                        setTableData([newRow, ...current]);
                    }
                    return { select: () => Promise.resolve({ data: updatedData, error: null }) };
                },
                update: function (updates) { return Promise.resolve({ data: [], error: null }); },
                delete: function () { return Promise.resolve({ data: [], error: null }); },
            };
            return queryChain;
        }
    };
}

export const supabase = client;

// -----------------------------------------------------------
// 🚀 Hybrid Repository: 서비스 로직에서 직접 호출하는 함수들
// Supabase가 있으면 거길 쓰고, 없으면 LocalStorage를 씀
// -----------------------------------------------------------

// -----------------------------------------------------------
// 🚀 Hybrid Repository: 서비스 로직에서 직접 호출하는 함수들
// Supabase가 있으면 거길 쓰고, 없으면 LocalStorage를 씀
// -----------------------------------------------------------

/**
 * 콘텐츠 히스토리 저장 (Real Supabase Sync)
 */
export const saveContentHistory = async (contentData, explicitUserId = null) => {
    const table = 'history';
    try {
        let userId = explicitUserId;

        // If no explicit ID, try to get from Supabase Auth session
        if (!userId) {
            const { data: { user } } = await supabase.auth.getUser();
            userId = user?.id || null;
        }

        const record = {
            user_id: userId,
            platform: contentData.platform || 'General',
            topic: contentData.topic || '',
            title: contentData.title || contentData.topic || 'Untitled Content',
            content_json: contentData,
            created_at: contentData.createdAt || contentData.created_at || new Date().toISOString()
        };

        if (!isMock) {
            console.log("🚀 Attempting Supabase Save...", record);

            try {
                // Add a 5s timeout to DB insert
                const { data, error } = await Promise.race([
                    supabase.from(table).insert([record]).select(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error("DB_TIMEOUT")), 5000))
                ]);

                if (error) {
                    console.error("Supabase Save Error:", error);
                    if (error.code === '42P01' || error.message?.includes('401') || error.message?.includes('JWT')) {
                        console.warn("⚠️ Auth Failure. Switching to LocalStorage.");
                        isMock = true;
                        throw new Error("AUTH_FAILURE_FALLBACK");
                    }
                    throw error;
                }
                console.log("✅ Data synced to Supabase:", data);
            } catch (dbError) {
                console.warn("⚠️ DB Save failed/timeout. Falling back to local.", dbError.message);
                throw dbError; // Trigger catch block for backup save
            }
        } else {
            console.log("💾 Mock Mode: Saving to LocalStorage...");
            const current = JSON.parse(localStorage.getItem(`db_${table}`) || '[]');
            localStorage.setItem(`db_${table}`, JSON.stringify([{ ...record, id: Date.now() }, ...current]));
        }
        return true;
    } catch (e) {
        console.error("❌ Save failed, triggering backup save:", e);

        // Ensure backup record matches schema
        const current = JSON.parse(localStorage.getItem(`db_history`) || '[]');
        const backupRecord = {
            user_id: null,
            platform: contentData.platform || 'General',
            topic: contentData.topic || '',
            title: contentData.title || contentData.topic || 'Untitled Content',
            content_json: contentData,
            id: Date.now(),
            created_at: new Date().toISOString(),
            isBackup: true
        };
        localStorage.setItem(`db_history`, JSON.stringify([backupRecord, ...current]));
        isMock = true;
        return true;
    }
};

/**
 * 히스토리 불러오기 (Real Supabase Fetch)
 */
export const fetchContentHistory = async () => {
    console.log(`🔍 fetchContentHistory called (isMock: ${isMock})`);
    try {
        if (isMock) {
            const mockData = JSON.parse(localStorage.getItem('db_history') || '[]');
            console.log(`📦 Mock DB: Found ${mockData.length} items.`);
            return mockData.map(item => ({
                ...(item.content_json || {}),
                id: item.id,
                user_id: item.user_id,
                platform: item.platform,
                topic: item.topic,
                title: item.title,
                created_at: item.created_at,
                createdAt: item.created_at,
                isMockData: true
            }));
        }

        console.log("🚀 Fetching from REAL Supabase...");

        // Add a 5s timeout to DB select
        const { data, error } = await Promise.race([
            supabase.from('history').select('*').order('created_at', { ascending: false }),
            new Promise((_, reject) => setTimeout(() => reject(new Error("FETCH_TIMEOUT")), 5000))
        ]);

        if (error) {
            console.error("Supabase Select Error:", error);
            // If it's a column missing error, try without ordering
            if (error.message?.includes('column "created_at" does not exist')) {
                console.warn("⚠️ Column 'created_at' missing. Fetching without sort.");
                const retry = await supabase.from('history').select('*');
                if (retry.error) throw retry.error;
                return (retry.data || []).map(item => ({
                    ...(item.content_json || {}),
                    ...item,
                    createdAt: item.created_at || new Date().toISOString(),
                    isRealDB: true
                }));
            }
            throw error;
        }

        console.log(`✅ Supabase: Fetched ${data?.length || 0} items.`);

        return data.map(item => ({
            ...(item.content_json || {}),
            id: item.id,
            user_id: item.user_id,
            platform: item.platform,
            topic: item.topic,
            title: item.title,
            created_at: item.created_at,
            createdAt: item.created_at,
            isRealDB: true
        }));
    } catch (e) {
        console.error("❌ Fetch from Supabase failed:", e);
        return [];
    }
};

/**
 * 실시간 사용량 동기화 (usage 테이블 대응)
 */
export const syncUserUsage = async (userId, countUpdates) => {
    if (isMock || !userId) return null;
    try {
        const { data, error } = await supabase
            .from('user_usage')
            .upsert({
                user_id: userId,
                ...countUpdates,
                last_reset: new Date().toISOString()
            })
            .select();

        if (error) throw error;
        return data[0];
    } catch (e) {
        console.error("❌ Usage sync failed:", e);
        return null;
    }
};
