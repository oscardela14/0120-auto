
-- 🛡️ [ANTI-GRAVITY] SECURITY & RLS SETUP SCRIPT
-- 이 스크립트를 Supabase SQL Editor에서 실행하십시오.

-- 1. 테이블 생성 및 UUID 제약 조건 강화
CREATE TABLE IF NOT EXISTS public.history (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    platform text,
    topic text,
    title text,
    content_json jsonb,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_usage (
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    current_month integer DEFAULT 0,
    plan text DEFAULT 'free',
    billing_cycle text DEFAULT 'monthly',
    monthly_limit integer DEFAULT 20,
    last_reset timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 2. RLS 활성화 (보안 잠금장치 가동)
ALTER TABLE public.history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;

-- 3. 정책(Policies) 설정: "누구도 남의 데이터를 볼 수 없다"
-- History 정책
CREATE POLICY "Users can only view their own history" 
ON public.history FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own history" 
ON public.history FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own history" 
ON public.history FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can only update their own history" 
ON public.history FOR UPDATE 
USING (auth.uid() = user_id);

-- Usage 정책
CREATE POLICY "Users can view their own usage" 
ON public.user_usage FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage" 
ON public.user_usage FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage" 
ON public.user_usage FOR UPDATE 
USING (auth.uid() = user_id);

-- 4. Edge Function(Service Role)을 위한 특별 권한
-- 서비스 롤만 모든 것에 접근 가능하도록 기본 설정됨 (정책 불필요)

-- 5. 계정 생성 시 기본 Usage 행 자동 생성 트리거 (선택사항)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_usage (user_id, plan)
  VALUES (new.id, 'free');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
