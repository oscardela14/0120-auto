
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
    // CORS 처리
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // 서비스 롤로 사용량 수정 권한 확보
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        // 1. 사용자 인증 확인
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
        if (authError || !user) throw new Error("UNAUTHORIZED")

        const { provider, action, payload } = await req.json()

        // 2. 사용량 검증 (Server-side Check)
        const { data: usage, error: usageError } = await supabaseClient
            .from('user_usage')
            .select('current_month, plan')
            .eq('user_id', user.id)
            .single()

        // Plan별 리밋 (Edge Function에 하드코딩하거나 DB에서 관리)
        const LIMITS: Record<string, number> = { free: 20, starter: 200, pro: 500, business: 2000 }
        const userLimit = LIMITS[usage?.plan || 'free']

        if (usage && usage.current_month >= userLimit) {
            return new Response(JSON.stringify({ success: false, error: "USAGE_LIMIT_EXCEEDED" }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 403,
            })
        }

        // 3. AI 호출 (서버의 API KEY 사용)
        let aiResult;
        if (provider === 'gemini') {
            const apiKey = Deno.env.get('GEMINI_API_KEY')
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                body: JSON.stringify({ contents: [{ parts: [{ text: payload.prompt }] }] })
            })
            aiResult = await response.json()
        } else if (provider === 'cerebras') {
            const apiKey = Deno.env.get('CEREBRAS_API_KEY')
            // Cerebras API 호출 로직...
        }

        // 4. 사용량 차감 (Server-side Enforcement)
        await supabaseClient
            .from('user_usage')
            .update({ current_month: (usage?.current_month || 0) + 1 })
            .eq('user_id', user.id)

        // 5. 히스토리 자동 서버 저장
        await supabaseClient.from('history').insert({
            user_id: user.id,
            topic: payload.topic,
            platform: payload.platform,
            content_json: aiResult
        })

        return new Response(JSON.stringify({ success: true, data: aiResult }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
        })
    }
})
