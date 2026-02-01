import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Check, X, Zap, Users, Crown, Sparkles,
    TrendingUp, Calendar, BarChart2, MessageSquare,
    Shield, Headphones, Award
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { PaymentModal } from './PaymentModal';
import { AuthModal } from './AuthModal';

const plans = [
    {
        id: 'free',
        name: 'Free',
        price: 0,
        yearlyPrice: 0,
        period: '무료',
        description: 'AI 콘텐츠 제작의 기초를 경험해보세요',
        badge: null,
        color: 'from-gray-500 to-gray-600',
        features: [
            { name: '월 20개 콘텐츠 생성', included: true },
            { name: '실시간 트렌드 분석 무제한', included: true },
            { name: '기본 템플릿 이용', included: true },
            { name: '워터마크 포함', included: true },
            { name: '커뮤니티 지원', included: true },
            { name: '수익화 도구 미포함', included: false },
        ],
        cta: '무료 시작하기',
        popular: false
    },
    {
        id: 'starter',
        name: 'Starter',
        price: 19000,
        yearlyPrice: 15900,
        period: '월',
        description: '개인 크리에이터를 위한 최적의 시작',
        badge: null,
        color: 'from-blue-500 to-cyan-500',
        features: [
            { name: '월 200개 콘텐츠 생성', included: true },
            { name: '기본 SEO 트래픽 분석', included: true },
            { name: '전체 템플릿 이용', included: true },
            { name: '워터마크 제거', included: true },
            { name: '멀티 페르소나 적용', included: true },
            { name: '제휴 마케팅 자동화 미포함', included: false },
        ],
        cta: '업그레이드',
        popular: false
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 49000,
        yearlyPrice: 39000,
        period: '월',
        description: '본격적인 수익화를 꿈꾸는 분들을 위해',
        badge: '가장 인기',
        color: 'from-primary to-purple-500',
        features: [
            { name: '월 500개 콘텐츠 생성', included: true },
            { name: '쿠팡 제휴 마케팅 자동 매칭', included: true },
            { name: '네이버 황금 키워드 실데이터', included: true },
            { name: '숏폼/블로그 자동 게시 전용', included: true },
            { name: 'OSMU 원소스 멀티유즈 변환', included: true },
            { name: '전문가용 AI 카피라이팅', included: true },
            { name: '프리미엄 우선 지원', included: true },
        ],
        cta: '지금 시작하기',
        popular: true
    },
    {
        id: 'business',
        name: 'Business',
        price: 99000,
        yearlyPrice: 79000,
        period: '월',
        description: '기업 및 팀을 위한 고성능 솔루션',
        badge: '성장형 전용',
        color: 'from-orange-500 to-red-500',
        features: [
            { name: '월 2,000개 콘텐츠 생성', included: true },
            { name: '팀 협업 워크스페이스', included: true },
            { name: '전용 API 키 연동 옵션', included: true },
            { name: '승인 워크플로우 대시보드', included: true },
            { name: '커스텀 브랜딩 적용', included: true },
            { name: '24/7 전담 기술 지원', included: true },
            { name: '데이터 보안 보안 강화', included: true },
        ],
        cta: '비즈니스 시작',
        popular: false
    }
];

const PlanCard = ({ plan, user, usage, onUpgrade, index, billingCycle }) => {
    // 요금제 등급(id)과 결제 주기(billing_cycle)가 모두 맞아야 '이용 중'으로 표시함
    const userBillingCycle = usage?.billing_cycle || 'monthly';
    const isCurrentPlan = user?.plan === plan.id && (plan.id === 'free' || userBillingCycle === billingCycle);
    const isPro = plan.id === 'pro';

    // KRW Display Logic
    const monthlyPrice = plan.price;
    const yearlyPricePerMonth = plan.yearlyPrice;
    const yearlyTotal = yearlyPricePerMonth * 12;
    const yearlySaving = (monthlyPrice * 12) - yearlyTotal;

    // Determine displayed price based on cycle
    // 연간 결제 선택 시: 연간 총액(일시불)을 메인 가격으로 표시
    // 월간 결제 선택 시: 월 금액을 메인 가격으로 표시
    const displayPrice = billingCycle === 'yearly' && monthlyPrice > 0
        ? yearlyTotal
        : monthlyPrice;

    const formattedPrice = displayPrice.toLocaleString();

    // 버튼 텍스트 로직: Creator 플랜은 '14일 무료로 시작하기' 강조
    const getButtonText = () => {
        if (isCurrentPlan) return '현재 이용 중';
        if (plan.id === 'starter') return '14일 무료로 시작하기';
        return plan.cta;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative rounded-3xl border transition-all duration-300 flex flex-col h-full text-left backdrop-blur-xl ${isPro
                ? 'border-primary/50 shadow-[0_0_50px_-12px_rgba(99,102,241,0.5)] bg-gradient-to-b from-[#1e1b4b] via-[#0f172a] to-black scale-[1.02] z-10 ring-1 ring-primary/50'
                : 'border-slate-700/50 bg-slate-900/60 hover:bg-slate-800/60 hover:border-slate-600/50'
                }`}
        >
            {/* Badge for Pro/Team */}
            {plan.badge && (
                <div className={`absolute top-0 right-0 bg-gradient-to-r ${plan.color} text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl shadow-lg tracking-wider uppercase`}>
                    {plan.badge}
                </div>
            )}

            {isCurrentPlan && (
                <div className="absolute top-4 left-4 bg-green-500/20 border border-green-500/50 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-md z-20">
                    <Check size={10} strokeWidth={3} />
                    <span>이용 중</span>
                </div>
            )}

            <div className="p-5 flex-1 flex flex-col items-start">
                {/* Icon & Name */}
                <div className="flex items-center gap-3 mb-5 w-full">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} p-[1px] shadow-lg shrink-0`}>
                        <div className="w-full h-full rounded-[11px] bg-[#0b0f19] flex items-center justify-center overflow-hidden">
                            <img
                                src={`/images/pricing/${plan.id}.png`}
                                alt={`${plan.name} Icon`}
                                className="w-full h-full object-cover opacity-90 hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">{plan.name}</h3>
                        <div className={`h-1 w-8 rounded-full bg-gradient-to-r ${plan.color} mt-1 opacity-50`}></div>
                    </div>
                </div>

                {/* Description - Fixed Height with word-break keep-all */}
                <p className="text-slate-300 text-xs mb-6 leading-relaxed min-h-[32px] break-keep text-left w-full font-medium">
                    {plan.description}
                </p>

                {/* Price Section */}
                <div className="mb-6 min-h-[80px] w-full text-left">
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-white tracking-tight">₩{formattedPrice}</span>
                        {plan.price > 0 && (
                            <span className="text-slate-400 text-xs font-semibold">
                                {billingCycle === 'yearly' ? '/년' : '/월'}
                            </span>
                        )}
                    </div>

                    {plan.price > 0 ? (
                        <div className="mt-2 text-xs">
                            {billingCycle === 'yearly' ? (
                                <div className="space-y-1">
                                    <p className="text-green-400 font-medium text-[10px] flex items-center gap-1 bg-green-500/10 w-fit px-1.5 py-0.5 rounded-md">
                                        <Sparkles size={8} />
                                        <span>연 ₩{yearlySaving.toLocaleString()} 절약</span>
                                    </p>
                                    <p className="text-gray-400 text-[10px]">
                                        월 ₩{yearlyPricePerMonth.toLocaleString()} 환산
                                    </p>
                                </div>
                            ) : (
                                <p className="text-gray-500 text-[10px]">매월 자동 결제</p>
                            )}
                        </div>
                    ) : (
                        <p className="text-gray-500 mt-2 text-xs font-medium">기간 제한 평생 무료</p>
                    )}
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-6 flex-1 w-full text-left">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">주요 기능</div>
                    {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 group">
                            {feature.included ? (
                                <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm`}>
                                    <Check size={8} className="text-white font-bold" strokeWidth={3} />
                                </div>
                            ) : (
                                <div className="w-4 h-4 rounded-full bg-white/5 border border-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <X size={8} className="text-gray-600" />
                                </div>
                            )}
                            <span className={`text-[13px] leading-snug transition-colors break-keep text-left ${feature.included ? 'text-gray-300 group-hover:text-white' : 'text-gray-600'}`}>
                                {feature.name}
                            </span>
                        </div>
                    ))}
                </div>

                {/* CTA Buttons */}
                <div className="w-full mt-auto pt-4 space-y-3">
                    {/* Starter Plan: Two Buttons */}
                    {plan.id === 'starter' && !isCurrentPlan ? (
                        <div className="flex flex-col gap-2.5 w-full">
                            {/* Primary: 14-Day Free Trial */}
                            <button
                                onClick={() => onUpgrade(plan.id, true)}
                                className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all relative overflow-hidden group/btn"
                            >
                                <span className="relative z-10">14일 무료로 시작하기</span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                            </button>

                            {/* Secondary: Immediate Subscription */}
                            <button
                                onClick={() => onUpgrade(plan.id, false)}
                                className="w-full py-3 rounded-xl font-bold text-sm bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                            >
                                즉시 구독 시작 (₩{formattedPrice})
                            </button>
                        </div>
                    ) : (
                        // Other Plans (Free, Pro, Business): Single Button
                        <button
                            onClick={() => onUpgrade(plan.id, false)}
                            disabled={isCurrentPlan}
                            className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all relative overflow-hidden group/btn ${isCurrentPlan
                                ? 'bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed'
                                : isPro
                                    ? `bg-gradient-to-r ${plan.color} text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02]`
                                    : 'bg-white text-black hover:bg-gray-100 hover:scale-[1.02]'
                                }`}
                        >
                            <span className="relative z-10">{isCurrentPlan ? '이용 중' : plan.cta}</span>
                            {isPro && !isCurrentPlan && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>}
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export const PricingView = ({ onOpenLegal }) => {
    const { user, usage, isAuthenticated, upgradePlan, addNotification } = useUser();
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    const currentPlan = user?.plan || 'free';

    const handleUpgrade = (planId, isTrialMode = false) => {
        const userBillingCycle = usage?.billing_cycle || 'monthly';
        if (planId === currentPlan && userBillingCycle === billingCycle) return;

        if (!isAuthenticated) {
            setShowAuthModal(true);
            return;
        }

        // 14일 무료 체험 모드일 경우: 결제 없이 바로 체험 시작
        if (isTrialMode) {
            upgradePlan(planId, billingCycle); // isTrial = true
            addNotification(`🎉 ${planId.toUpperCase()} 플랜 14일 무료 체험이 시작되었습니다!`, "success");
            return;
        }

        // 일반 업그레이드 (Creator 포함 모든 유료 플랜): 결제창 표시
        if (planId !== 'free') {
            setSelectedPlan(planId);
            setShowPaymentModal(true);
        }
    };

    return (
        <div className="w-full max-w-[1440px] mx-auto p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="text-center mb-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block mb-4"
                >
                    <div className="bg-primary/20 border border-primary text-primary px-4 py-2 rounded-full text-sm font-semibold">
                        💎 프리미엄 플랜
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl md:text-4xl font-bold text-white mb-4"
                >
                    당신에게 딱 맞는 플랜을 선택하세요
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 text-base max-w-2xl mx-auto"
                >
                    콘텐츠 제작을 자동화하고 수익을 극대화하세요. 언제든지 플랜 변경 가능합니다.
                </motion.p>
            </div>

            {/* Billing Toggle */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center mb-12"
            >
                <div className="bg-surface/40 border border-white/10 rounded-full p-1 inline-flex">
                    <button
                        onClick={() => setBillingCycle('monthly')}
                        className={`px-6 py-2 rounded-full font-semibold transition-all ${billingCycle === 'monthly'
                            ? 'bg-white text-black'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        월간 결제
                    </button>
                    <button
                        onClick={() => setBillingCycle('yearly')}
                        className={`px-6 py-2 rounded-full font-semibold transition-all relative ${billingCycle === 'yearly'
                            ? 'bg-white text-black'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        연간 결제
                        <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                            30% 할인
                        </span>
                    </button>
                </div>
            </motion.div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
                {plans.map((plan, index) => (
                    <PlanCard
                        key={plan.id}
                        plan={plan}
                        user={user}
                        usage={usage}
                        billingCycle={billingCycle}
                        onUpgrade={handleUpgrade}
                        index={index}
                    />
                ))}
            </div>

            {/* Features Comparison - Compact */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-surface/20 border border-white/5 rounded-2xl p-6 mb-8 max-w-5xl mx-auto"
            >
                <h2 className="text-lg md:text-xl font-black text-white mb-6 text-center tracking-tight">
                    모든 플랜에 포함된 기능
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                        { icon: TrendingUp, text: '트렌드 분석' },
                        { icon: Calendar, text: '콘텐츠 캘린더' },
                        { icon: BarChart2, text: '성과 추적' },
                        { icon: MessageSquare, text: '멀티 플랫폼' },
                        { icon: Shield, text: '보안 암호화' },
                        { icon: Headphones, text: '커뮤니티 지원' },
                    ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center gap-2 group">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300">
                                <item.icon size={18} className="text-primary group-hover:scale-110 transition-transform" />
                            </div>
                            <span className="text-gray-300 text-[11px] font-bold uppercase tracking-tight group-hover:text-white transition-colors">{item.text}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* FAQ Section - Enhanced Readability */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="max-w-3xl mx-auto mb-10"
            >
                <h2 className="text-xl md:text-2xl font-black text-white mb-8 text-center tracking-tight">
                    자주 묻는 질문
                </h2>
                <div className="space-y-3">
                    {[
                        {
                            q: '플랜을 언제든지 변경할 수 있나요?',
                            a: '네, 언제든지 업그레이드하거나 다운그레이드할 수 있습니다. 차액은 자동으로 계산됩니다.'
                        },
                        {
                            q: '무료 체험 기간이 있나요?',
                            a: 'Starter 플랜은 14일 무료 체험을 제공합니다. 신용카드 등록 없이 시작 가능합니다.'
                        },
                        {
                            q: '환불 정책은 어떻게 되나요?',
                            a: '모든 플랜은 7일 환불 보장을 제공합니다. 만족하지 못하시면 전액 환불해드립니다.'
                        },
                        {
                            q: 'Business 플랜 팀원 추가가 가능한가요?',
                            a: '기본 5명 포함이며, 추가 인원은 월 ₩15,000에 무제한 추가 가능합니다.'
                        }
                    ].map((faq, idx) => (
                        <details
                            key={idx}
                            className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 group overflow-hidden"
                        >
                            <summary className="font-bold text-gray-300 text-base cursor-pointer flex items-center justify-between list-none">
                                <span className="group-open:text-white transition-colors">{faq.q}</span>
                                <span className="text-gray-600 group-open:rotate-180 transition-transform text-xs">▼</span>
                            </summary>
                            <div className="text-gray-400 text-sm mt-4 leading-relaxed border-t border-white/5 pt-4 break-keep">
                                {faq.a}
                            </div>
                        </details>
                    ))}
                </div>
            </motion.div>

            {/* CTA Section - Refined & Compact */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8 mx-auto max-w-2xl text-center bg-gradient-to-br from-primary/10 to-purple-500/10 border border-white/10 rounded-2xl p-6 relative overflow-hidden group"
            >
                {/* Ambient glow in background */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-primary/20 blur-[60px] rounded-full pointer-events-none"></div>

                <Award size={24} className="text-primary/80 mx-auto mb-3 group-hover:scale-110 transition-transform duration-500" />
                <h2 className="text-lg md:text-xl font-black text-white mb-2 tracking-tight">
                    아직 고민 중이신가요?
                </h2>
                <p className="text-gray-400 text-xs mb-4 max-w-md mx-auto leading-relaxed">
                    무료 플랜으로 시작해서 ContentStudio AI의 강력한 기능을 직접 체험해보세요.<br className="hidden md:block" />
                    신용카드 등록 없이 <span className="text-white font-bold">1분 만에 바로 시작</span>할 수 있습니다.
                </p>
                <button
                    onClick={() => isAuthenticated ? handleUpgrade('starter') : setShowAuthModal(true)}
                    className="bg-white text-black px-6 py-2.5 rounded-lg font-black text-xs hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all hover:scale-105 active:scale-95"
                >
                    14일 무료 체험 시작하기 →
                </button>
            </motion.div>

            {/* Modals */}
            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                selectedPlan={selectedPlan}
                billingCycle={billingCycle}
            />

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                initialMode="signup"
            />

            {/* Legal Footer */}
            <div className="mt-8 text-center border-t border-white/5 pt-8">
                <p className="text-sm text-gray-500">
                    구독 시
                    <button onClick={() => onOpenLegal && onOpenLegal('terms')} className="text-gray-400 hover:text-white underline mx-1">이용약관</button>
                    및
                    <button onClick={() => onOpenLegal && onOpenLegal('privacy')} className="text-gray-400 hover:text-white underline mx-1">개인정보처리방침</button>
                    에 동의하게 됩니다.
                </p>
                <p className="text-xs text-gray-600 mt-2">
                    환불/취소 관련 문의는 <button onClick={() => onOpenLegal && onOpenLegal('refund')} className="text-gray-500 hover:text-white underline">환불 규정</button>을 참고하세요.
                </p>
            </div>
        </div>
    );
};
