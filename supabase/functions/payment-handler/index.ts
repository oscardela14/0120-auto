import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // 1. CORS Preflight 처리
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // 2. 사용자 인증 확인
        const authHeader = req.headers.get('Authorization')
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser(authHeader?.replace('Bearer ', '') ?? '')

        if (authError || !user) {
            return new Response(JSON.stringify({ error: 'Unauthorized', details: authError }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        // 3. 결제 데이터 파싱
        const { paymentId, amount, planId } = await req.json()

        console.log(`Processing payment: User=${user.id}, Plan=${planId}, Amount=${amount}, ID=${paymentId}`)

        /** 
         * [PRODUCTION LOGIC] 
         * 실제 PortOne API를 호출하여 상태가 'PAID'이고 금액이 일치하는지 확인해야 합니다.
         * 여기서는 테스트를 위해 유효한 데이터가 있으면 성공으로 처리합니다.
         */
        const isVerified = paymentId && planId && amount >= 0

        if (!isVerified) {
            return new Response(JSON.stringify({ success: false, error: 'Invalid payment data' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        // 4. 멤버십 등급 업데이트 (user_usage 테이블)
        const PLAN_LIMITS = { starter: 200, pro: 500, business: 2000 }
        const newLimit = PLAN_LIMITS[planId as keyof typeof PLAN_LIMITS] || 20

        // user_usage 테이블이 존재하는지 확인하고 업데이트
        const { error: updateError } = await supabaseClient
            .from('user_usage')
            .upsert({
                user_id: user.id,
                plan: planId,
                monthly_limit: newLimit,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' })

        if (updateError) throw updateError

        return new Response(JSON.stringify({
            success: true,
            message: `${planId} 플랜 활성화 완료!`,
            newPlan: planId
        }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error) {
        console.error('Payment Handler Error:', error)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
