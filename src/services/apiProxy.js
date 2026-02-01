/**
 * ANTI-GRAVITY SECURE API PROXY v2.0
 * 
 * [SECURITY UPGRADE] 
 * 1. API Keys are hidden in Supabase Secrets (Server-side).
 * 2. Usage is validated and decremented on the SERVER.
 * 3. Authentication is strictly enforced via JWT.
 */

import { supabase } from '../lib/supabase';

/**
 * 전역 프록시 호출 함수 (Supabase Edge Functions 연동)
 */
export const secureProxyCall = async (provider, action, payload) => {
    try {
        const { data: { session } } = await supabase.auth.getSession();

        // Edge Function Endpoint (Supabase Dashboard에서 생성한 함수명: ai-commander)
        const { data, error } = await Promise.race([
            supabase.functions.invoke('ai-commander', {
                body: {
                    provider,
                    action,
                    payload
                }
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error("EDGE_FUNCTION_TIMEOUT")), 10000))
        ]);

        if (error) {
            console.error("[SecureProxy] Function Error:", error);
            throw new Error(error.message || "AI_SERVER_UNAVAILABLE");
        }

        if (!data.success) {
            // 서버 측에서 사용량 초과 등을 리턴했을 때
            throw new Error(data.error || "AI_EXECUTION_FAILED");
        }

        return data;
    } catch (error) {
        console.error(`[SecureProxy] CRITICAL FAILURE:`, error);
        throw error;
    }
};
