import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Youtube, Instagram, BookOpen, MessageCircle, ChevronDown, ChevronRight,
    Sparkles, CheckCircle2, Home, Lightbulb, Edit3, History, CreditCard,
    Zap, MousePointerClick, ShieldCheck, Crown, Signal, Trophy, Target,
    Film, Rocket, BarChart3, TrendingUp, Globe, Coins, Split, Heart,
    Bot, Brain, ArrowRight, AlertCircle, Clock, Activity, Loader2, Settings, ShieldAlert
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { cn } from '../lib/utils';
// import { calculateRevenueData } from '../utils/revenueEngine';

const GuideSection = ({ icon: Icon, title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="mb-4 bg-surface/30 border border-white/5 rounded-xl overflow-hidden transition-all hover:border-white/10">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                        <Icon size={20} />
                    </div>
                    <h3 className="text-base font-bold text-white">{title}</h3>
                </div>
                {isOpen ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5 pt-2 border-t border-white/5">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Step = ({ number, title, description }) => (
    <div className="flex gap-4 mb-6 last:mb-0 relative group">
        <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-white/5 group-last:hidden"></div>
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-lg shadow-primary/30 z-10">
            {number}
        </div>
        <div>
            <h4 className="text-white font-bold mb-1 text-base group-hover:text-primary transition-colors">{title}</h4>
            <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        </div>
    </div>
);

const MenuCard = ({ icon: Icon, title, desc, onClick }) => (
    <button
        onClick={onClick}
        className="bg-surface/30 border border-white/5 p-4 rounded-xl flex items-center gap-4 hover:bg-white/5 hover:border-white/10 transition-all text-left w-full group"
    >
        <div className="p-3 bg-white/5 rounded-lg text-gray-300 group-hover:text-primary group-hover:bg-primary/5 transition-colors">
            <Icon size={20} />
        </div>
        <div>
            <h4 className="text-white font-bold text-sm mb-0.5">{title}</h4>
            <div className="text-xs text-gray-500">{desc}</div>
        </div>
    </button>
);

const StrategicMissionCard = ({ icon: Icon, badge, title, desc, actionLabel, variant = "primary", onClick }) => {
    const isUrgent = variant === "urgent";
    return (
        <div className={cn(
            "relative group p-6 rounded-[28px] border transition-all duration-500 overflow-hidden",
            isUrgent
                ? "bg-red-500/5 border-red-500/20 hover:border-red-500/40 shadow-lg shadow-red-500/5"
                : "bg-surface/30 border-white/5 hover:border-primary/30"
        )}>
            {/* Background Glow */}
            <div className={cn(
                "absolute -right-4 -top-4 w-24 h-24 blur-[40px] opacity-20 transition-opacity",
                isUrgent ? "bg-red-500" : "bg-primary"
            )} />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className={cn(
                        "p-3 rounded-xl",
                        isUrgent ? "bg-red-500/10 text-red-400" : "bg-primary/10 text-primary"
                    )}>
                        <Icon size={20} />
                    </div>
                    {badge && (
                        <span className={cn(
                            "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                            isUrgent ? "bg-red-500/20 text-red-500" : "bg-primary/20 text-primary"
                        )}>
                            {badge}
                        </span>
                    )}
                </div>
                <h4 className="text-white font-black text-lg mb-2 group-hover:text-primary transition-colors">{title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 font-medium">{desc}</p>
                <button
                    onClick={onClick}
                    className={cn(
                        "w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all",
                        isUrgent
                            ? "bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-600/20 active:scale-[0.98]"
                            : "bg-white/5 hover:bg-white/10 text-white border border-white/10 active:scale-[0.98]"
                    )}
                >
                    {actionLabel} <ArrowRight size={14} />
                </button>
            </div>
        </div>
    );
};

const AIBriefingBox = ({ user, activeResult, history }) => {
    const persona = activeResult?.persona || 'witty';

    const getBriefing = () => {
        if (persona === 'witty') {
            return {
                title: "Yo! 오늘의 긴급 속보예요 마스터! 🔥",
                msg: `방금 데이터 센터에서 날아온 소식인데, 어제 올린 ${activeResult?.topic || '게시물'}이 알고리즘을 제대로 탔다니까요? ㅋㅋ 지금 바로 제휴 수익 훅(Hook)을 한두 군데만 더 찔러넣으면 수익률이 수직 상승할 준비가 되어 있습니다! 가즈아~!`,
                icon: Bot
            };
        } else if (persona === 'professional') {
            return {
                title: "Strategy Intelligence: 오늘의 정밀 브리핑",
                msg: `마스터님, 현재 시장 지표 분석 결과 ${activeResult?.topic || '특정 키워드'} 분야의 경쟁사 진입이 둔화되었습니다. 지금이 상위 노출을 독점할 최적의 타이밍입니다. SEO 마스터 보드를 가동하여 점유율 15% 이상 확대를 권장합니다.`,
                icon: Brain
            };
        }
        return {
            title: "안녕하세요 마스터! 오늘의 수익 가이드입니다.",
            msg: "현재 마스터님의 플랫폼 지수가 매우 안정적입니다. 축적된 성과 데이터를 기반으로 새로운 채널 확장을 시도해볼 때입니다. 오늘의 미션을 확인하고 수익 파이프라인을 다각화해보세요.",
            icon: Sparkles
        };
    };

    const briefing = getBriefing();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-[#0b0e14]/40 backdrop-blur-3xl border border-white/5 p-7 rounded-[40px] overflow-hidden group mb-10"
        >
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all duration-700" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary blur-[20px] opacity-20 animate-pulse" />
                    <div className="relative w-16 h-16 bg-gradient-to-br from-primary to-indigo-600 rounded-[22px] flex items-center justify-center text-white shadow-2xl shadow-primary/30 rotate-3">
                        <briefing.icon size={32} />
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center gap-3 mb-3">
                        <h2 className="text-xl font-black text-white tracking-tight">{briefing.title}</h2>
                        <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black text-primary uppercase tracking-widest italic animate-pulse">
                            AI Personalized
                        </span>
                    </div>
                    <p className="text-gray-400 text-base leading-relaxed font-medium max-w-4xl break-keep">
                        "{briefing.msg}"
                    </p>
                </div>

                <div className="flex flex-col gap-2 min-w-[200px]">
                    <div className="relative group/sync p-4 bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                        {/* Scanning Animation */}
                        <motion.div
                            initial={{ y: "-100%" }}
                            animate={{ y: "100%" }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/30 to-transparent h-1/2 w-full z-0 opacity-40"
                        />

                        <div className="relative z-10">
                            <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1 tracking-wider">NETWORK STATUS</span>
                            <div className="flex items-center gap-2 text-white font-black text-sm">
                                <div className="relative w-2 h-2">
                                    <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75" />
                                    <div className="relative w-2 h-2 bg-primary rounded-full" />
                                </div>
                                실시간 동기화 중
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                >
                                    <Loader2 size={12} className="text-primary/50" />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// import { calculateRevenueData } from '../utils/revenueEngine';

export const GuideView = () => {
    const navigate = useNavigate();
    const { user, activeResult, history = [], revenueSettings } = useUser();

    // Calculate real revenue data for the summary with safety fallback
    // TEMPORARY FIX: Use static data to prevent crash
    const stats = useMemo(() => {
        return { totalPotential: 0, adRevenue: 0, affiliateRevenue: 0, operationalSavings: 0, growth: "0.0" };
        /* 
        try {
            return calculateRevenueData(history || [], revenueSettings || {});
        } catch (e) {
            console.error("Revenue calculation failed:", e);
            return { totalPotential: 0 };
        }
        */
    }, [history, revenueSettings]);

    // Format total assets: e.g. 37.2M or 3.2억 depending on scale
    const formatAssets = (val) => {
        if (!val || isNaN(val)) return '0';
        if (val >= 100000000) return `${(val / 100000000).toFixed(1)} 억`;
        if (val >= 10000) return `${(val / 10000).toFixed(1)} 만`;
        return Math.floor(val).toLocaleString();
    };

    return (
        <div className="max-w-[1440px] mx-auto p-6 md:p-8 space-y-12 relative">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-white mb-4 tracking-tighter">
                    USER <span className="text-primary">GUIDE</span>
                </h1>
                <p className="text-gray-400 text-sm md:text-base max-w-2xl leading-relaxed mb-4">
                    플랫폼의 모든 기능을 100% 활용하기 위한 상세 가이드입니다.<br />
                    각 기능을 단계별로 확인하고 수익화를 가속화하세요.
                </p>
            </div>

            {/* Menu Overview */}
            <div className="pt-2">
                <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                    <MousePointerClick size={24} className="text-primary" />
                    플랫폼 주요 메뉴 (Menu Overview)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <MenuCard
                        icon={Home}
                        title="마스터 대시보드 (Home)"
                        desc="종합 현황 및 핵심 메트릭 요약"
                        onClick={() => navigate('/dashboard')}
                    />
                    <MenuCard
                        icon={Lightbulb}
                        title="트렌드 익스플로러"
                        desc="실시간 소셜 알고리즘 데이터 분석"
                        onClick={() => navigate('/topics')}
                    />
                    <MenuCard
                        icon={Edit3}
                        title="콘텐츠 스튜디오"
                        desc="AI 기반 멀티 플랫폼 콘텐츠 제작"
                        onClick={() => navigate('/studio')}
                    />
                    <MenuCard
                        icon={BarChart3}
                        title="수익 인텔리전스 (Revenue)"
                        desc="광고 및 제휴 수익 상세 리포트"
                        onClick={() => navigate('/revenue')}
                    />
                    <MenuCard
                        icon={History}
                        title="디지털 보관함 (History)"
                        desc="작업 내역 관리 및 성과 추적"
                        onClick={() => navigate('/history')}
                    />
                    <MenuCard
                        icon={CreditCard}
                        title="멤버십 설정 (Pricing)"
                        desc="플랜 업그레이드 및 구독 관리"
                        onClick={() => navigate('/pricing')}
                    />
                    <MenuCard
                        icon={Settings}
                        title="시스템 설정 (Settings)"
                        desc="계정 보안 및 플랫폼 최적화 설정"
                        onClick={() => navigate('/settings')}
                    />
                </div>
            </div>

            {/* Main Guides */}
            <div className="space-y-6 pt-10">
                <h3 className="text-lg font-black text-white mb-8 flex items-center gap-3">
                    <Zap size={20} className="text-yellow-400" />
                    비즈니스 가속화 가이드 (Implementation Roadmap)
                </h3>

                <GuideSection icon={BarChart3} title="수익 통찰 & ROI 분석" defaultOpen={false}>
                    <div className="py-2">
                        <Step
                            number="1"
                            title="AI ROI 예측 시뮬레이터"
                            description="키워드와 예상 노출량을 기반으로 예상 광고 수익(CPM), 제휴 수익, 운영 가치를 산출합니다. 마켓 데이터를 분석하여 성공 확률이 높은 전략을 선제적으로 제안합니다."
                        />
                        <Step
                            number="2"
                            title="실시간 환율 및 마켓 싱크"
                            description="구글 파이낸셜 API를 통해 실시간 USD/KRW 환율과 플랫폼별 평균 CPM 단가를 동기화합니다. 시장 상황에 따른 실제 순수익 변화를 즉각적으로 파악할 수 있습니다."
                        />
                        <Step
                            number="3"
                            title="2x2 프리미엄 채널 매트릭스"
                            description="인스타그램, 유튜브, 네이버 블로그, 스레드 등 주요 플랫폼을 72px 프리미엄 스쿼클 매트릭스로 집적화했습니다. 한눈에 들어오는 2x2 레이아웃을 통해 현재 어떤 채널에 화력을 집중해야 할지 즉각적인 판단을 돕습니다."
                        />
                        <Step
                            number="4"
                            title="Expert Intelligence 툴팁"
                            description="각 수익 카드에 마우스를 올리면 AI가 분석한 세부 정산 로직과 수익 극대화 전략을 확인할 수 있습니다. 단순 합계를 넘어 CPM 가스비 산출, 제휴 전환 가치 등 전문적인 재무 지표를 실시간으로 제공합니다."
                        />
                        <Step
                            number="5"
                            title="즉시 정산 및 투명한 명세"
                            description="정산 기준금액(3만원) 달성 시 원클릭으로 '즉시 정산'을 신청할 수 있습니다. AdSense 공제액, 사업소득세 등을 반영한 최종 입금 예정액을 투명하게 공개하며, 신청 즉시 프로세스가 가동됩니다."
                        />
                        <Step
                            number="6"
                            title="정밀 재무 리포트 추출 (5-Page High-End)"
                            description="총 자산 가치, 수익 공식, 성장 로드맵, 자산 원장, 그리고 '데이터 무결성 인증서'가 포함된 5페이지 분량의 전문가용 리포트를 PDF로 제공합니다. 금융권 제출이 가능한 수준의 완결성을 보장합니다."
                        />
                    </div>
                </GuideSection>

                <GuideSection icon={Edit3} title="통합 라이브 에디터 & 검색 최적화(SEO)">
                    <div className="py-2">
                        <Step
                            number="1"
                            title="Real-time AI Coach (실시간 피드백)"
                            description="사용자가 글을 작성하는 즉시 AI 코치가 문맥을 분석하여 '도파민 점수'를 평가합니다. 입력하는 단어 하나하나에 반응하여 더 자극적이고 효과적인 표현을 실시간으로 가이드합니다."
                        />
                        <Step
                            number="2"
                            title="Viral Score 예측 & 네이티브 SEO"
                            description="콘텐츠 발행 전, 예측 바이럴 점수(Viral Score)와 등급(S~C Grade)을 산출합니다. 플랫폼별 알고리즘에 맞춘 고유 SEO 점수와 키워드 밀도를 자동 계산하여 상단 노출 확률을 극대화합니다."
                        />
                        <Step
                            number="3"
                            title="AI 콘텐츠 자동 생성 (Zap)"
                            description="작성이 막막할 땐 'AI로 본문 완성' 버튼을 누르세요. 트렌드 데이터를 기반으로 서론-본론-결론이 완벽하게 구조화된 초안을 1초 만에 생성합니다."
                        />
                    </div>
                </GuideSection>

                <GuideSection icon={Split} title="AI A/B 전략 & Optimization (초격차 전략)">
                    <div className="py-2">
                        <Step
                            number="1"
                            title="Dual Strategy A/B Testing"
                            description="동일 주제에 대해 '안정형(A)'과 '도파민 자극형(B)' 두 가지 전략을 동시에 제안합니다. AI가 두 가지 버전의 클릭률(CTR)과 도달 범위를 비교 분석하여 우승 전략(Winner)을 선정해줍니다."
                        />
                        <Step
                            number="2"
                            title="Master Optimization (점수 고도화)"
                            description="기존 전략이 마음에 들지 않는다면 'AI 고도화' 버튼을 사용하세요. 현재 점수에서 약 10~15% 상승된 성능을 목표로 문구를 재설계하며, 최대 96점(S등급)까지 성능을 극한으로 끌어올립니다."
                        />
                        <Step
                            number="3"
                            title="Targeted Refinement (개별 튜닝)"
                            description="전체 내용을 바꿀 필요 없이, 원하는 변수(제목, 훅, 태그)만 선택하여 정밀 타격하듯 수정할 수 있습니다. 마음에 드는 부분은 유지하고 약점만 보완하는 스마트한 튜닝이 가능합니다."
                        />
                    </div>
                </GuideSection>

                <GuideSection icon={ShieldCheck} title="System Architecture & Resilience (v3.2 Update)">
                    <div className="py-2 bg-indigo-900/10 rounded-lg p-4 border border-indigo-500/20">
                        <Step
                            number="1"
                            title="Triple-Layer AI Defense System"
                            description="어떤 상황에서도 서비스가 멈추지 않도록 [Cerebras(LPU) → Gemini 2.0 → Logic Simulation]으로 이어지는 3중 방어막을 구축했습니다. 메인 AI 서버가 과부하되어도 즉시 백업 엔진이 가동됩니다."
                        />
                        <Step
                            number="2"
                            title="Stat-Sync Technology (자산 동기화)"
                            description="대시보드의 'Time Saved' 및 'Views Gained' 수치는 단순 클릭 수가 아닌, 실제 '보관함(History)'에 자산화된 콘텐츠를 기준으로 집계됩니다. 귀하의 노력이 축적될수록 시스템의 가치 평가도 함께 상승합니다."
                        />
                    </div>
                </GuideSection>

                <GuideSection icon={History} title="데이터 자산화 및 다각도 비즈니스 운용">
                    <div className="space-y-4 text-gray-300">
                        <p className="text-sm leading-relaxed">
                            보관함의 모든 콘텐츠는 단순 이력이 아닌, <span className="text-white font-semibold">언제든 재최적화 및 확장 발행이 가능한 소중한 데이터 자산</span>입니다.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col items-center text-center">
                                <Edit3 size={20} className="text-indigo-400 mb-2" />
                                <h5 className="text-sm font-bold text-white mb-1">Studio Re-Entry</h5>
                                <p className="text-[10px] text-gray-500">과거 결과물을 스튜디오 작업대로 즉시 불러와 최신 트렌드에 맞춰 수정</p>
                            </div>
                            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col items-center text-center">
                                <Film size={20} className="text-purple-400 mb-2" />
                                <h5 className="text-sm font-bold text-white mb-1">Resource Center</h5>
                                <p className="text-[10px] text-gray-500">스크립트 기반의 이미지, 오디오, 영상 리소스를 제작하여 멀티미디어 채널 공략</p>
                            </div>
                            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col items-center text-center">
                                <TrendingUp size={20} className="text-orange-400 mb-2" />
                                <h5 className="text-sm font-bold text-white mb-1">Growth Strategy</h5>
                                <p className="text-[10px] text-gray-500">축적된 성과 데이터를 기반으로 7일간의 추가 캠페인 로드맵 수립</p>
                            </div>
                        </div>
                    </div>
                </GuideSection>

                <GuideSection icon={MessageCircle} title="Smart Community Manager (팬덤 자동화)">
                    <div className="space-y-4 text-gray-300">
                        <p className="text-sm leading-relaxed mb-4">
                            콘텐츠 발행 후 쏟아지는 반응을 <span className="text-white font-bold">AI가 실시간으로 분석하고 대응</span>합니다. 단순한 응대를 넘어, 팬덤을 결집시키고 재방문을 유도하는 심리적 훅(Hook)을 포함한 답글을 자동으로 생성합니다.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                                <h5 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                    <Sparkles size={14} className="text-indigo-400" />
                                    AI 답글 자동 생성
                                </h5>
                                <p className="text-[11px] text-gray-400 leading-relaxed">
                                    사용자의 댓글 톤앤매너를 분석하여 페르소나에 완벽하게 일치하는 맞춤형 답글을 1초 만에 작성합니다. "전체 답글 자동 생성" 버튼 하나로 수십 개의 댓글 관리를 한 번에 끝낼 수 있습니다.
                                </p>
                            </div>
                            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                                <h5 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                    <Heart size={14} className="text-pink-400" />
                                    충성도 강화 엔진
                                </h5>
                                <p className="text-[11px] text-gray-400 leading-relaxed">
                                    단순 감사가 아닌, 다음 콘텐츠 예고나 질문을 유도하는 '대화형 답글'을 통해 대댓글(Thread) 깊이를 늘리고 알고리즘 점수를 극대화합니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </GuideSection>

                <GuideSection icon={Crown} title="Membership Plan Guide (Tier Benefits)">
                    <div className="py-2">
                        <Step
                            number="1"
                            title="Starter (크리에이터 입문)"
                            description="월 200개 콘텐츠 생성 및 워터마크 제거 기능이 해제됩니다. 개인 채널을 운영하며 수익화를 시작하는 단계에 최적화된 필수 기능을 제공합니다."
                        />
                        <Step
                            number="2"
                            title="Pro (수익화 가속 - Best Choice)"
                            description="쿠팡/브랜드 제휴 마케팅 자동 매칭 및 네이버 '황금 키워드' 실데이터 접근 권한이 부여됩니다. AI 카피라이팅 엔진이 적용되어 클릭율(CTR)을 비약적으로 높여줍니다."
                        />
                        <Step
                            number="3"
                            title="Business (팀 & 에이전시)"
                            description="월 2,000개 대량 생성 및 전용 API 연동을 지원합니다. 팀 협업 워크스페이스와 승인 대시보드를 통해 기업형 SNS 운영 시스템을 구축할 수 있습니다."
                        />
                    </div>
                </GuideSection>

                {/* Admin Only Guide */}
                {user?.role === 'admin' && (
                    <GuideSection icon={ShieldAlert} title="Administrator Controls (God Mode)">
                        <div className="py-2 bg-red-900/10 rounded-lg p-4 border border-red-500/20">
                            <Step
                                number="1"
                                title="User Database & Control"
                                description="전체 사용자 현황을 실시간으로 모니터링합니다. 악성 사용자에 대한 즉각적인 Ban 처리 및 VIP 사용자에 대한 Plan 강제 승격 권한을 포함합니다."
                            />
                            <Step
                                number="2"
                                title="Emergency Protocols (비상 제어)"
                                description="시스템 위기 상황 시 DNS Flush, Lockdown Mode, Server Reboot 등 긴급 명령을 실행할 수 있는 비상 제어 패널이 헤더 상단에 배치되었습니다."
                            />
                            <Step
                                number="3"
                                title="System Terminal Intelligence"
                                description="서버 로그, 보안 위협, 결제 내역 등 모든 시스템 이벤트를 실시간 텍스트로 조회할 수 있는 전용 터미널을 제공합니다."
                            />
                        </div>
                    </GuideSection>
                )}
            </div>

            {/* Footer Tip */}
            <div className="mt-8 p-6 bg-gradient-to-br from-indigo-900/40 via-black to-black border border-white/10 rounded-2xl flex flex-col md:flex-row items-center gap-5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="p-4 bg-yellow-500/10 rounded-xl text-yellow-500 shrink-0 shadow-lg shadow-yellow-500/10 border border-yellow-500/20">
                    <Lightbulb size={24} className="animate-pulse" />
                </div>
                <div className="relative z-10 text-center md:text-left">
                    <h3 className="text-lg font-black text-white mb-2 italic tracking-tight">성공적인 자동화를 위한 마스터의 통찰</h3>
                    <p className="text-gray-400 text-sm leading-relaxed font-medium">
                        "진정한 소셜 성장은 단순한 발행이 아닌, <span className="text-white font-bold underline decoration-primary decoration-2 underline-offset-4">정확한 데이터 기반의 의사결정</span>에서 시작됩니다.
                        단순히 콘텐츠를 찍어내는 것을 넘어, <span className="text-primary font-black uppercase italic tracking-widest">Intelligence 마스터 보드</span>가 제시하는 수익 잠재력을 따라가십시오.
                        데이터가 가리키는 곳에 리소스를 집중할 때, 당신의 소셜 채널은 비로소 자동 성장의 궤도에 진입하게 됩니다."
                    </p>
                </div>
            </div>
        </div>
    );
};
