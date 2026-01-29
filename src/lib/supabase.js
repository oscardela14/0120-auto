
import { createClient } from '@supabase/supabase-js';

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
        client = createClient(supabaseUrl, supabaseAnonKey);
        isMock = false;
        console.log("✅ Supabase Real Client Connected");
    } catch (error) {
        console.error("Supabase Client Init Error:", error);
    }
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
                const mockUser = {
                    user: { id: 'mock-user-123', email: 'demo@example.com', user_metadata: { full_name: 'Demo User' } },
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
            return {
                select: () => ({
                    order: () => Promise.resolve({
                        data: JSON.parse(localStorage.getItem(`db_${table}`) || '[]'),
                        error: null
                    })
                }),
                insert: (rows) => {
                    const current = JSON.parse(localStorage.getItem(`db_${table}`) || '[]');
                    const input = Array.isArray(rows) ? rows : [rows];
                    const newRows = input.map(r => ({ ...r, id: Date.now() + Math.random(), created_at: new Date().toISOString() }));
                    localStorage.setItem(`db_${table}`, JSON.stringify([...newRows, ...current]));
                    return Promise.resolve({ data: newRows, error: null });
                },
                update: () => Promise.resolve({ data: [], error: null }),
                delete: () => Promise.resolve({ data: [], error: null }),
            };
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
 * 콘텐츠 히스토리 저장
 */
export const saveContentHistory = async (contentData) => {
    const table = 'history';
    try {
        const user = await supabase.auth.getUser();
        const userId = user.data.user?.id || 'anon-user';

        const record = {
            user_id: userId,
            platform: contentData.platform || 'General',
            topic: contentData.topic || '',
            title: contentData.title || '',
            content_json: contentData,
            created_at: new Date().toISOString()
        };

        if (!isMock) {
            // Real DB Insert
            const { error } = await supabase.from(table).insert([record]);
            if (error) throw error;
        } else {
            // LocalStorage Fallback
            await client.from(table).insert(record);
        }
        return true;
    } catch (e) {
        console.error("Save failed:", e);
        return false;
    }
};

/**
 * 히스토리 불러오기
 */
export const fetchContentHistory = async () => {
    try {
        const { data, error } = await supabase.from('history').select('*').order('created_at', { ascending: false });
        if (error) throw error;

        // Match DB schema with component expectations (snake_case and camelCase)
        return data.map(item => {
            const baseData = item.content_json || item;
            return {
                ...baseData,
                id: item.id || baseData.id,
                created_at: item.created_at || baseData.created_at,
                createdAt: item.created_at || baseData.createdAt || baseData.created_at, // For camelCase compatibility
                userId: item.user_id || baseData.userId
            };
        });
    } catch (e) {
        console.error("Fetch failed:", e);
        return [];
    }
};
