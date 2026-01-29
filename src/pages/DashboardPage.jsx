import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, TrendingUp, BarChart3, Youtube, Instagram, Plus, CreditCard, Users, Crown, ArrowRight, Clock, CheckCircle2, AlertCircle, FileText, Layout, ChevronRight, Sparkles, DollarSign, Coins, Globe, Target, ShieldCheck, ArrowUpRight, X, PenTool, Search, Rocket, Activity, Radar, Info } from 'lucide-react';
import { generateDailyAutoDrafts } from '../utils/autonomousHunter';
import { fetchLiveStats, calculateLTV } from '../utils/revenueEngine';
import { NICHES, getSwarmInsights, simulateSwarmAction } from '../utils/swarmEngine';
import { useUser } from '../contexts/UserContext';
import { HomePageSEO } from '../components/SEOHead';
import { FreeTrialCard } from '../components/FreeTrialCard';
import { ZeroStateTemplates } from '../components/ZeroStateTemplates';
import { AutonomousMorningReport } from '../components/AutonomousMorningReport';
import { cn } from '../lib/utils';

// --- Premium Design Tokens ---
// --- Premium Design Tokens ---
const GLASS_CARD_CLASSES = "bg-[#0f1218]/60 backdrop-blur-2xl border border-white/5 shadow-2xl relative overflow-hidden group transition-all duration-500";
const NOISE_BG = "opacity-[0.03] pointer-events-none absolute inset-0 z-0 mix-blend-overlay"; // Assuming a noise image or CSS pattern could be here, using refined opacity for now.

const ShinyCard = ({ children, className = "", spotlightColor = "rgba(99, 102, 241, 0.15)" }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    return (
        <div
            onMouseMove={handleMouseMove}
            className={`relative group/shiny ${className.includes('overflow-') ? className : `overflow-hidden ${className}`}`}
        >
            <div
                className="pointer-events-none absolute inset-0 z-[1] opacity-0 group-hover/shiny:opacity-100 transition-opacity duration-500"
                style={{
                    background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, ${spotlightColor}, transparent 40%)`
                }}
            />
            <div className="relative z-[2] h-full">
                {children}
            </div>
        </div>
    );
};

// Plan Configuration
const PLAN_CONFIG = {
    starter: {
        name: 'Starter',
        badge: 'STARTER',
        color: 'cyan',
        theme: {
            text: 'text-cyan-400',
            bg: 'bg-cyan-500/10',
            border: 'border-cyan-500/20',
            gradient: 'from-cyan-500 to-blue-600',
            shadow: 'shadow-cyan-500/20'
        },
        statsText: (hours, views) => (
            <>
                <span className="text-white font-bold">{hours}시간</span> 절약, <span className="text-white font-bold">{views}+</span> 조회수
            </>
        )
    },
    pro: {
        name: 'Pro',
        badge: 'PRO',
        color: 'amber',
        theme: {
            text: 'text-amber-400',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20',
            gradient: 'from-amber-400 to-orange-500',
            shadow: 'shadow-amber-500/20'
        },
        statsText: (hours, views) => (
            <>
                <span className="text-white font-bold">{hours}시간</span> 절약, <span className="text-white font-bold">{views}+</span> 조회수
            </>
        )
    },
    business: {
        name: 'Business',
        badge: 'BUSINESS',
        color: 'rose',
        theme: {
            text: 'text-rose-400',
            bg: 'bg-rose-500/10',
            border: 'border-rose-500/20',
            gradient: 'from-rose-500 to-pink-600',
            shadow: 'shadow-rose-500/20'
        },
        statsText: (hours, views) => (
            <>
                효율 <span className="text-white font-bold">30%</span> 증가, Total <span className="text-white font-bold">{views}+</span> Views
            </>
        )
    }
};

// 1. [Main Hero] Productivity Hub
const ProductivityWidget = ({ user, history }) => {
    const navigate = useNavigate();

    // Determine plan status
    const currentPlanId = user?.plan || 'free';
    const isFreeUser = currentPlanId === 'free';

    // If user is Free plan, show Free Trial Promo (Hero Style)
    if (isFreeUser) {
        return (
            <ShinyCard spotlightColor="rgba(99, 102, 241, 0.2)" className="rounded-[32px] h-full">
                <div className={`p-1 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 h-full relative group shadow-2xl`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-1000 rounded-[32px]"></div>
                    <div className="relative bg-[#0c0e14] h-full rounded-[28px] p-8 md:p-10 overflow-hidden flex flex-col justify-center z-10 text-center items-center">
                        <h2 className="text-lg md:text-2xl font-black text-white mb-4 tracking-tight leading-tight">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">14일 무료 체험</span>으로<br />
                            AI의 힘을 경험하세요
                        </h2>

                        <p className="text-gray-400 text-[13px] md:text-base font-medium leading-relaxed max-w-2xl mb-8">
                            트렌드 분석부터 콘텐츠 생성까지.<br />
                            모든 PRO 기능을 지금 바로 시작할 수 있습니다.
                        </p>

                        <button
                            onClick={() => navigate('/pricing')}
                            className="px-8 py-4 bg-white text-black rounded-2xl font-bold text-base hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                        >
                            무료로 시작하기 <ArrowRight size={20} />
                        </button>

                        <div className="absolute bottom-2 left-0 right-0 px-10 grid grid-cols-3 items-center opacity-40">
                            <div className="flex items-center justify-start gap-2 text-[13px] md:text-sm font-bold text-gray-400 uppercase tracking-widest">
                                <TrendingUp size={16} /> Trend Hunter
                            </div>
                            <div className="flex items-center justify-center gap-2 text-[13px] md:text-sm font-bold text-gray-400 uppercase tracking-widest">
                                <Zap size={16} /> Instant Creation
                            </div>
                            <div className="flex items-center justify-end gap-2 text-[13px] md:text-sm font-bold text-gray-400 uppercase tracking-widest">
                                <CreditCard size={16} /> Pro Features
                            </div>
                        </div>
                    </div>
                </div>
            </ShinyCard>
        );
    }

    // Existing Logic for Paid Users
    const savedMinutes = Math.max(450, history.length * 45);
    const savedHours = (savedMinutes / 60).toFixed(1);
    const potentialViews = (history.length * 1500 + 5000).toLocaleString();
    const config = PLAN_CONFIG[currentPlanId] || PLAN_CONFIG.starter;
    const { theme } = config;

    return (
        <ShinyCard spotlightColor={theme.bg.replace('bg-', 'rgba(').replace('/10', ', 0.15)')} className="rounded-[32px] h-full overflow-visible">
            <div className="p-1 bg-gradient-to-br from-white/5 to-white/0 h-full relative group/prod shadow-2xl transition-all duration-700">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] rounded-[32px]"></div>
                <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} opacity-10 blur-xl group-hover/prod:opacity-30 transition-opacity duration-1000 rounded-[32px]`}></div>
                <div className="relative bg-[#0c0e14] h-full rounded-[28px] pt-6 md:pt-8 px-8 md:px-10 pb-8 overflow-visible flex flex-col justify-between z-10 border border-white/5">
                    <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b ${theme.gradient} opacity-[0.05] blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2`}></div>
                    <motion.div
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                        className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent skew-x-12 pointer-events-none"
                    />
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center gap-8 mb-auto">
                            <div className="space-y-3 shrink-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg shadow-black/20`}
                                    >
                                        <Crown size={14} className={theme.text} fill="currentColor" fillOpacity={0.2} />
                                        <span className={`text-xs font-black tracking-[0.2em] uppercase ${theme.text}`}>
                                            {config.badge} Tier
                                        </span>
                                    </motion.div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-base md:text-lg font-black text-white tracking-tight leading-tight">
                                        이번 달, AI 자동화를 통해
                                    </p>
                                    <p className="text-base md:text-lg font-black text-white tracking-tight leading-tight">
                                        <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.gradient}`}>
                                            {config.statsText(savedHours, potentialViews)}
                                        </span> 확보 했습니다
                                    </p>
                                </div>
                            </div>
                            <div className="flex-1"></div>
                            <div className="relative group/intel shrink-0 h-full flex items-start pt-2">
                                <div className="flex flex-col gap-3 relative max-w-[120px] w-full items-end">
                                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg cursor-help transition-all hover:bg-emerald-500/20">
                                        <div className="relative flex h-1.5 w-1.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                        </div>
                                        <span className="text-base font-black text-emerald-400 uppercase tracking-widest leading-none">분석 완료</span>
                                    </div>
                                    <div className="h-10 w-full flex items-end justify-end">
                                        <TrendingUp size={32} className="text-indigo-400/20" strokeWidth={1.5} />
                                    </div>
                                </div>
                                <div className="absolute top-full mt-4 left-0 w-72 p-6 bg-[#0c0e14]/98 backdrop-blur-3xl border border-white/10 rounded-[24px] opacity-0 scale-95 group-hover/intel:opacity-100 group-hover/intel:scale-100 transition-all duration-300 pointer-events-none z-[9999] shadow-[0_25px_60px_rgba(0,0,0,0.6)] text-left">
                                    <div className="absolute -top-1.5 left-8 w-3 h-3 bg-[#0c0e14] border-t border-l border-white/10 rotate-45"></div>
                                    <div className="flex items-center justify-start gap-2 text-[13px] font-bold text-indigo-400 mb-3 pb-3 border-b border-white/5 uppercase tracking-wider">
                                        <Zap size={10} className="fill-indigo-400/20" />
                                        <span>AI 운용 실시간 리포트</span>
                                    </div>
                                    <div className="space-y-3 mb-4 text-left">
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">자동화 가동률</span>
                                            <span className="text-[13px] font-black text-indigo-400">98.4%</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">품질 지수</span>
                                            <span className="text-[13px] font-black text-emerald-400">최상(S)</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">유입 가속도</span>
                                            <span className="text-[13px] font-black text-purple-400">+15.4%</span>
                                        </div>
                                    </div>
                                    <p className="text-[12px] text-gray-400 font-medium leading-relaxed pr-1 border-t border-white/5 pt-3 text-left">
                                        생산 효율 <span className="text-white font-bold">14.8% 향상</span> 감지<br />
                                        분석 주기 <span className="text-indigo-400 font-black">2.4배 단축</span> 최적화 완료
                                    </p>
                                    <div className="absolute top-6 -right-1 w-2 h-2 bg-[#0c0e14] border-r border-b border-white/10 rotate-45"></div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-auto pt-4 pb-10">
                            <div className="grid grid-cols-3 gap-5">
                                {[
                                    { label: '트렌드 헌터', sub: '실시간 분석', desc: '현재 가장 핫한 키워드와 트렌드 데이터를 실시간으로 수집하고 분석합니다.', icon: TrendingUp, path: '/topics', color: 'indigo' },
                                    { label: '1초 생성', sub: '즉시 제작', desc: 'AI 엔진을 통해 단 1초 만에 고품질 소셜 콘텐츠 초안을 생성합니다.', icon: Zap, path: '/studio', color: 'purple' },
                                    { label: '멤버십 관리', sub: '플랜 관리', desc: '현재 구독 중인 멤버십 플랜 정보와 결제 내역을 안전하게 관리합니다.', icon: CreditCard, path: '/pricing', color: 'blue' },
                                ].map((btn, idx) => (
                                    <div key={idx} className="flex flex-col items-center gap-4 relative group/tooltip">
                                        <motion.div
                                            whileHover={{ y: -5 }}
                                            onClick={() => navigate(btn.path)}
                                            className={`group/btn relative w-20 h-20 flex items-center justify-center rounded-[24px] bg-white/[0.03] border border-white/5 transition-all duration-500 shadow-xl cursor-pointer`}
                                        >
                                            <div className={`absolute inset-0 bg-gradient-to-br from-${btn.color}-500/0 to-${btn.color}-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[24px]`}></div>
                                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent flex items-center justify-center border border-white/10 shadow-lg relative overflow-hidden`}>
                                                <btn.icon size={32} className={`text-${btn.color}-400 group-hover/btn:scale-110 transition-transform duration-500`} />
                                                <div className={`absolute inset-0 bg-${btn.color}-500 opacity-0 blur-xl group-hover/btn:opacity-20 transition-opacity`}></div>
                                            </div>
                                        </motion.div>
                                        <div className="text-center">
                                            <div className="text-sm font-black text-white/40 mb-1 uppercase tracking-[0.2em]">{btn.label}</div>
                                            <div className="text-base font-black text-white tracking-tight">{btn.sub}</div>
                                        </div>
                                        <div className={`absolute bottom-full mb-4 w-52 p-4 bg-[#0c0e14]/95 backdrop-blur-3xl border border-white/10 rounded-[20px] opacity-0 scale-95 group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 transition-all duration-500 pointer-events-none z-[100] shadow-[0_20px_40px_rgba(0,0,0,0.4)]
                                        ${idx === 0 ? 'left-0' : idx === 2 ? 'right-0' : 'left-1/2 -translate-x-1/2'}`}>
                                            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
                                                <div className={`w-1.5 h-1.5 rounded-full bg-${btn.color}-500 shadow-[0_0_8px_currentColor]`}></div>
                                                <span className="text-[13px] font-black text-white uppercase tracking-[0.2em]">운용 리포트</span>
                                            </div>
                                            <p className="text-[11px] text-gray-500 font-bold leading-relaxed pr-1 text-left">{btn.desc}</p>
                                            <div className={`absolute -bottom-1 w-2 h-2 bg-[#0c0e14] border-r border-b border-white/10 rotate-45
                                            ${idx === 0 ? 'left-8' : idx === 2 ? 'right-8' : 'left-1/2 -translate-x-1/2'}`}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ShinyCard>
    );
};

// 1.5 [Side Widget] 14-Day Free Trial (Relocated to Right)
const FreeTrialWidget = () => {
    const navigate = useNavigate();
    return (
        <ShinyCard spotlightColor="rgba(99, 102, 241, 0.2)" className="rounded-[32px] h-full">
            <div className={`rounded-[32px] p-1 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 h-full relative group shadow-2xl overflow-hidden min-h-[160px]`}>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-10 blur-xl group-hover:opacity-30 transition-opacity duration-1000"></div>
                <div className="relative bg-[#0c0e14]/40 h-full rounded-[28px] p-5 overflow-hidden flex flex-col justify-center z-10 text-center items-center">
                    <div className="mb-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Sparkles size={16} className="text-white" />
                        </div>
                    </div>
                    <h2 className="text-base font-black text-white mb-1 tracking-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">14일 무료 체험</span>
                    </h2>
                    <p className="text-gray-500 text-[11px] font-medium leading-relaxed mb-3">
                        모든 PRO 기능을 지금 바로<br />시작할 수 있습니다.
                    </p>
                    <button
                        onClick={() => navigate('/pricing')}
                        className="w-full py-2 bg-white text-black rounded-xl font-bold text-[10px] hover:scale-105 transition-transform flex items-center justify-center gap-2"
                    >
                        무료로 시작하기 <ArrowRight size={12} />
                    </button>
                </div>
            </div>
        </ShinyCard>
    );
};

const RevenueSnapshotWidget = ({ history }) => {
    const navigate = useNavigate();

    // Calculate Total Asset Value using LTV Engine
    const totalPotentialValue = history.reduce((acc, item) => {
        const niche = item.topic ? (item.topic.includes('돈') ? 'Finance' : 'General') : 'General';
        const ltv = calculateLTV({ views: 5000, engagementRate: 5 }, niche);
        return acc + ltv.valuation;
    }, 0);

    const totalPotential = totalPotentialValue.toLocaleString();

    // Detailed data for display
    const channels = [
        { id: 'adsense', name: '글로벌 네트워크', value: (totalPotentialValue * 0.45).toLocaleString(), icon: Globe, color: 'text-blue-400', bg: 'bg-blue-500/5', border: 'border-blue-500/10' },
        { id: 'affiliate', name: '제휴 커머스 마켓', value: (totalPotentialValue * 0.35).toLocaleString(), icon: Coins, color: 'text-orange-400', bg: 'bg-orange-500/5', border: 'border-orange-500/10' },
        { id: 'sponsorship', name: '전략적 브랜드 협업', value: (totalPotentialValue * 0.20).toLocaleString(), icon: Sparkles, color: 'text-purple-400', bg: 'bg-purple-500/5', border: 'border-purple-500/10' }
    ];

    return (
        <ShinyCard spotlightColor="rgba(99, 102, 241, 0.15)" className="rounded-[32px] h-full overflow-visible">
            <div
                className={`bg-[#0f1218]/60 backdrop-blur-2xl border border-white/5 shadow-2xl relative overflow-visible group/rev transition-all duration-500 rounded-[32px] pt-6 md:pt-8 px-8 md:px-10 pb-8 h-full flex flex-col justify-between`}
            >
                {/* [Premium] Noise & Grain Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

                {/* Enhanced Ambient Background & Mesh */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/15 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2 group-hover/rev:bg-indigo-500/25 transition-colors duration-1000"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

                {/* Subtle Scanning Light Effect */}
                <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"
                />

                <div className="relative z-10">
                    <div className="flex items-center gap-8">
                        {/* Left: Value Display */}
                        <div className="space-y-1 shrink-0 relative group/potential">
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-sm font-black text-white/50 tracking-widest uppercase flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                                    현재 잠재 가치
                                </h2>
                            </div>
                            <div className="flex items-baseline gap-2 pt-1 group/value">
                                <span className="text-xl md:text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-200 to-indigo-400 group-hover/value:from-white group-hover/value:via-white group-hover/value:to-indigo-300 transition-all duration-500">
                                    {totalPotential}원
                                </span>
                                <span className="text-xs font-black text-indigo-500/60 uppercase tracking-tighter">골드 등급</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md flex items-center gap-2">
                                    <TrendingUp size={14} className="text-emerald-400" />
                                    <span className="text-[13px] font-black text-emerald-400">+12.5%</span>
                                </div>
                                <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">성장 지표</span>
                            </div>

                            {/* [Expert] Potential Value Calculation Tooltip (Repositioned to Top) */}
                            <div className="absolute bottom-full mb-6 left-0 w-80 p-6 bg-[#0c0e14]/98 backdrop-blur-3xl border border-white/10 rounded-[24px] opacity-0 scale-95 group-hover/potential:opacity-100 group-hover/potential:scale-100 transition-all duration-300 pointer-events-none z-[130] shadow-[0_-25px_60px_rgba(0,0,0,0.6)]">
                                <div className="absolute -bottom-1.5 left-8 w-3 h-3 bg-[#0c0e14] border-r border-b border-white/10 rotate-45"></div>
                                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
                                    <div className="p-1.5 bg-amber-500/20 rounded-lg">
                                        <Coins size={14} className="text-amber-400" />
                                    </div>
                                    <span className="text-[13px] font-black text-white uppercase tracking-widest">LTV 기반 가치 산출 엔진</span>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-[12px] text-gray-400 font-medium leading-relaxed">
                                        현재까지 생성된 모든 콘텐츠의 <span className="text-white font-bold">누적 조회수, 평균 체류 시간, 타겟 키워드의 상업적 가치(CPC)</span>를 실시간 추적하여 산출된 자산 가치입니다.
                                    </p>
                                    <p className="text-[11px] text-indigo-400/80 font-bold leading-relaxed bg-indigo-500/5 p-3 rounded-xl border border-indigo-500/10">
                                        가시적인 일시적 수익을 넘어, 해당 콘텐츠가 <span className="text-white">향후 12개월간</span> 발생시킬 수 있는 누적 잠재 이익의 <span className="text-white">현재 가치(NPV)</span>를 시뮬레이션한 결과입니다.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Middle: Glassy Action Button */}
                        <div className="flex flex-col items-center justify-center flex-1">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate('/revenue');
                                }}
                                className="group/btn relative px-5 py-3 rounded-2xl overflow-hidden transition-all duration-500"
                            >
                                {/* Button Background Layers */}
                                <div className="absolute inset-0 bg-indigo-600 group-hover/btn:bg-indigo-500 transition-colors duration-500"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                <div className="absolute inset-0 border border-white/20 rounded-2xl"></div>

                                {/* Glass Shine */}
                                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>

                                <div className="relative flex items-center gap-3">
                                    <div className="flex flex-col items-start leading-tight">
                                        <span className="text-sm font-black text-white uppercase tracking-tight">라이브 분석</span>
                                        <span className="text-[9px] font-bold text-white/50 uppercase mt-0.5 tracking-wider">수익 인텔리전스</span>
                                    </div>
                                    <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center group-hover/btn:bg-white/20 transition-colors">
                                        <ChevronRight size={18} className="text-white group-hover/btn:translate-x-0.5 transition-transform" />
                                    </div>
                                </div>
                            </motion.button>
                        </div>

                        {/* Right: Premium Visualization */}
                        <div className="flex flex-col gap-3 relative group/chart max-w-[120px] w-full">
                            <div className="flex items-center">
                                <span className="text-sm font-black text-white/50 uppercase tracking-[0.05em] leading-none">수익 최적화</span>
                            </div>
                            <div className="flex items-end justify-between gap-1 h-14 pt-2">
                                {(() => {
                                    const hasData = history && history.length > 0;
                                    const baseBars = hasData
                                        ? [30, 60, 45, 80, 55, 75, 100] // Shows activity when there is history
                                        : [5, 5, 5, 5, 5, 5, 5]; // Flat when empty

                                    return baseBars.map((h, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${h}%` }}
                                            transition={{ delay: i * 0.05, duration: 1.5, ease: "circOut" }}
                                            className={`relative flex-1 rounded-t-[2px] overflow-hidden group/bar transition-all duration-500 ${hasData && i === 6 ? 'bg-indigo-500' : 'bg-indigo-500/20'}`}
                                        >
                                            {/* Bar Glow */}
                                            {hasData && i === 6 && (
                                                <div className="absolute inset-0 bg-white/40 blur-[2px] animate-pulse"></div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent opacity-0 group-hover/rev:opacity-100 transition-opacity"></div>
                                        </motion.div>
                                    ));
                                })()}
                            </div>
                            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                            {/* Chart Intelligence Tooltip - Expert Analysis (Repositioned to Left to avoid clipping) */}
                            <div className="absolute top-full mt-4 left-0 w-80 p-6 bg-[#0c0e14]/98 backdrop-blur-3xl border border-white/10 rounded-[24px] opacity-0 scale-95 group-hover/chart:opacity-100 group-hover/chart:scale-100 transition-all duration-500 pointer-events-none z-[130] shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
                                <div className="absolute -top-1.5 left-8 w-3 h-3 bg-[#0c0e14] border-t border-l border-white/10 rotate-45"></div>
                                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
                                    <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                                        <ShieldCheck size={14} className="text-indigo-400" />
                                    </div>
                                    <span className="text-[13px] font-black text-white uppercase tracking-widest">전략적 분석 리포트</span>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-[13px] text-gray-400 font-medium leading-relaxed">
                                        현 시점의 콘텐츠 노출 패턴과 사용자 체류 시간을 정밀 분석한 결과, <span className="text-white font-bold">수익 임계점(ROI Break-even)</span> 도달 가능성이 매우 높게 관측됩니다.
                                    </p>
                                    <p className="text-[12px] text-indigo-400/80 font-bold leading-relaxed bg-indigo-500/5 p-3 rounded-xl border border-indigo-500/10">
                                        💡 <span className="text-indigo-300">Expert Note:</span> 고단가 CPC 키워드 믹스와 광고 노출 타이밍 최적화를 통해 예상 수익률을 <span className="text-white">최대 24.5%</span> 추가 확보할 수 있는 전략적 구간입니다.
                                    </p>
                                </div>
                                <div className="absolute top-8 -right-1 w-2 h-2 bg-[#0c0e14] border-r border-t border-white/10 rotate-45"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Premium Channel Breakdown */}
                <div className="mt-auto pt-4 pb-10">
                    <div className="grid grid-cols-3 gap-5">
                        {channels.map((ch, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-4 relative group/tooltip">
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className={`group/btn relative w-20 h-20 flex items-center justify-center rounded-[24px] bg-white/[0.03] border border-white/5 transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.2)]`}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[24px]`}></div>
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent flex items-center justify-center border border-white/10 shadow-lg relative overflow-hidden`}>
                                        <ch.icon size={32} className={`${ch.color} relative z-10 group-hover/btn:scale-110 transition-transform duration-500`} />
                                        {/* Micro glow */}
                                        <div className={`absolute inset-0 ${ch.bg} opacity-20 blur-xl`}></div>
                                    </div>
                                </motion.div>
                                <div className="text-center">
                                    <div className="text-sm font-black text-white/40 mb-1 uppercase tracking-[0.2em]">{ch.name}</div>
                                    <div className="text-base font-black text-white tracking-tight">{ch.value}원</div>
                                </div>

                                {/* Revenue Intelligent Edge-Aware Tooltip */}
                                <div className={`absolute bottom-[110%] w-60 p-5 bg-[#0c0e14]/98 backdrop-blur-3xl border border-white/10 rounded-[24px] opacity-0 scale-95 group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 transition-all duration-500 pointer-events-none z-[120] shadow-[0_20px_50px_rgba(0,0,0,0.5)]
                                ${idx === 0 ? 'left-0' : idx === 2 ? 'right-0' : 'left-1/2 -translate-x-1/2'}`}>
                                    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${ch.color.replace('text', 'bg')} shadow-[0_0_8px_currentColor]`}></div>
                                        <span className="text-[13px] font-black text-white uppercase tracking-[0.2em]">금액 산출법</span>
                                    </div>
                                    <p className="text-[12px] text-gray-400 font-medium leading-relaxed">
                                        {ch.id === 'adsense' ? '글로벌 애드 네트워크 데이터와 연동하여 키워드별 상업적 밀도 및 CPM 단가를 정밀 대조합니다. 콘텐츠 가독성 지표와 광고 배치 최적화 알고리즘이 반영된 실효 수익 시뮬레이션입니다.' :
                                            ch.id === 'affiliate' ? '이커머스 맥락 분석 엔진이 콘텐츠 내 상품 매칭 가능성을 자동 평가합니다. 카테고리별 전환율(CR) 및 객단가 데이터를 기반으로 한 고신뢰도 수익 바운더리 예측치입니다.' :
                                                '콘텐츠 전문성 점수와 독자 페르소나 구매력을 분석하여 협업 가치를 산정합니다. 유사 규모 채널의 브랜드 캠페인 집행 단가를 벤치마킹한 전문가 수준의 비즈니스 제안 가이드 금액입니다.'}
                                    </p>
                                    <div className={`absolute -bottom-1 w-2 h-2 bg-[#0c0e14] border-r border-b border-white/10 rotate-45
                                ${idx === 0 ? 'left-8' : idx === 2 ? 'right-8' : 'left-1/2 -translate-x-1/2'}`}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ShinyCard>
    );
};

const WeeklyGoalWidget = ({ current, target, usage, planDetails, usagePercentage, compact = false }) => {
    const percent = Math.min(100, Math.round((current / target) * 100));
    const circumferenceHorizontal = 2 * Math.PI * 24;
    const circumferenceVertical = 2 * Math.PI * 52;
    const navigate = useNavigate();

    if (compact) {
        return (
            <div onClick={() => navigate('/pricing')} className="flex items-center gap-4 bg-white/5 border border-white/5 hover:border-white/10 px-5 py-2.5 rounded-2xl cursor-pointer transition-all group/goal">
                <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg className="w-full h-full rotate-[-90deg]">
                        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" className="text-white/5" fill="transparent" />
                        <motion.circle
                            initial={{ strokeDashoffset: circumferenceHorizontal }}
                            animate={{ strokeDashoffset: circumferenceHorizontal - (percent / 100) * circumferenceHorizontal }}
                            cx="24" cy="24" r="20"
                            stroke="#22c55e"
                            strokeWidth="4"
                            fill="transparent"
                            strokeDasharray={circumferenceHorizontal}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                        />
                    </svg>
                    <span className="absolute text-[10px] font-black text-white">{percent}%</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-0.5 group-hover/goal:text-green-500 transition-colors">주간 성과</span>
                    <div className="flex items-center gap-1.5">
                        <span className="text-sm font-black text-white">{current}/{target}</span>
                        <span className="text-[10px] text-gray-600 font-bold uppercase">Posts</span>
                        <div className="ml-3 px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-md flex items-center gap-1">
                            <div className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse"></div>
                            <span className="text-[8px] font-black text-indigo-400 uppercase">System Intel: Optimal</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`${GLASS_CARD_CLASSES} rounded-[32px] p-6 flex flex-col h-full relative`}>
            {/* Ambient Light */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-green-500/10 blur-[80px] rounded-full pointer-events-none"></div>

            <div className="flex-1 flex flex-col items-center justify-center py-2">
                <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                    <svg className="w-full h-full rotate-[-90deg]">
                        <circle cx="64" cy="64" r="52" stroke="currentColor" strokeWidth="8" className="text-white/5" fill="transparent" />
                        <circle
                            cx="64" cy="64" r="52"
                            stroke="url(#gradient-goal)"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={circumferenceVertical}
                            strokeDashoffset={circumferenceVertical - (percent / 100) * circumferenceVertical}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                        />
                        <defs>
                            <linearGradient id="gradient-goal" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#22c55e" />
                                <stop offset="100%" stopColor="#4ade80" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className="text-2xl font-black text-white tracking-tighter">{percent}%</span>
                        <span className="text-[8px] uppercase font-bold text-green-500 tracking-widest mt-0.5">Achieved</span>
                    </div>
                </div>

                <div className="text-center mb-4">
                    <h3 className="text-sm font-bold text-white mb-0.5">주간 목표 달성</h3>
                    <p className="text-[10px] text-gray-500 font-medium">{current} / {target} 포스트 완료</p>
                </div>
            </div>

            {/* Plan Usage Section at Bottom */}
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    navigate('/pricing');
                }}
                className="mt-auto pt-5 border-t border-white/5 group/usage cursor-pointer"
            >
                <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 group-hover/usage:text-primary transition-colors">Plan Usage</span>
                        <span className="text-[11px] font-black text-white italic">
                            {planDetails.monthly_limit === -1 ? '∞' : `${usage?.current_month || 0}/${planDetails.monthly_limit}`}
                        </span>
                    </div>
                    {user?.plan !== 'pro' && (
                        <button className="px-3 py-1.5 bg-primary text-black text-[9px] font-black rounded-lg shadow-lg shadow-primary/20 group-hover/usage:scale-110 transition-transform uppercase tracking-tighter">
                            Upgrade
                        </button>
                    )}
                </div>
                <div className="w-full bg-black/40 h-1 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${usagePercentage}%` }}
                        className="h-full bg-gradient-to-r from-primary to-purple-500"
                    />
                </div>
            </div>
        </div>
    );
};

// 3. [Bottom Widget] Recent Projects with Modern List
const RecentProjectsWidget = ({ history, onNavigate }) => {
    const { updateHistoryItem, addNotification } = useUser();
    const [trackingId, setTrackingId] = useState(null);
    const [inputUrl, setInputUrl] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);

    const handleStartTracking = async (id) => {
        if (!inputUrl) return;
        setIsSyncing(true);
        try {
            const liveData = await fetchLiveStats(inputUrl);
            if (liveData.success) {
                await updateHistoryItem(id, {
                    liveUrl: inputUrl,
                    liveStats: liveData.metrics,
                    lastTracked: liveData.lastUpdated
                });
                addNotification("라이브 트래커 연결 성공! 실시간 성과를 추적합니다.", "success");
                setTrackingId(null);
                setInputUrl('');
            }
        } catch (e) {
            addNotification("트래킹 연결에 실패했습니다. URL을 확인해주세요.", "error");
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div className={`${GLASS_CARD_CLASSES} rounded-[32px] p-8 h-full flex flex-col`}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
                        <Clock size={16} className="text-gray-400" />
                    </div>
                    최근 프로젝트
                </h3>
                <button
                    onClick={() => onNavigate('/history')}
                    className="group flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-white/5"
                >
                    전체보기 <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
            </div>

            {history.length === 0 ? (
                <div className="flex-1 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center p-8 group/empty hover:border-white/10 transition-colors cursor-pointer" onClick={() => onNavigate('/topics')}>
                    <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4 text-gray-600 group-hover/empty:scale-110 transition-transform group-hover/empty:bg-indigo-500/20 group-hover/empty:text-indigo-400">
                        <Plus size={24} />
                    </div>
                    <p className="text-sm font-bold text-gray-400">새로운 콘텐츠를 만들어보세요</p>
                    <p className="text-xs text-gray-600 mt-1">트렌드 분석부터 생성까지 1분이면 충분합니다.</p>
                </div>
            ) : (
                <div className="flex-1 overflow-hidden relative">
                    {/* Custom Scroll Container */}
                    <div className="space-y-3 h-[240px] overflow-y-auto pr-2 pb-2 scrollbar-none hover:scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {history.slice(0, 10).map((item, idx) => {
                            const itemId = item.id || item.createdAt;
                            const isBeingTracked = trackingId === itemId;

                            return (
                                <div
                                    key={itemId}
                                    className="group relative bg-[#13161c] hover:bg-[#1a1d24] border border-white/5 hover:border-indigo-500/30 rounded-2xl p-4 transition-all flex flex-col gap-3"
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-4 min-w-0" onClick={() => onNavigate('/history')}>
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-white/5 ${item.platform?.includes('YouTube') ? 'bg-red-500/5 text-red-500' :
                                                item.platform?.includes('Instagram') ? 'bg-pink-500/5 text-pink-500' :
                                                    'bg-green-500/5 text-green-500'
                                                }`}>
                                                {item.platform?.includes('YouTube') && <Youtube size={20} className="drop-shadow-lg" />}
                                                {item.platform?.includes('Instagram') && <Instagram size={20} className="drop-shadow-lg" />}
                                                {item.platform?.includes('Blog') && <span className="font-bold text-lg">N</span>}
                                                {item.platform?.includes('Threads') && <span className="font-bold text-lg">@</span>}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-bold text-gray-200 truncate group-hover:text-indigo-400 transition-colors">
                                                    {item.title || item.topic}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-white/5 text-gray-500 border border-white/5">
                                                        {new Date(item.createdAt || Date.now()).toLocaleDateString()}
                                                    </span>
                                                    {item.liveUrl ? (
                                                        <div className="flex items-center gap-2 px-1.5 py-0.5 rounded-[4px] bg-emerald-500/10 border border-emerald-500/20">
                                                            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                                            <span className="text-[9px] font-black text-emerald-400 tracking-tighter uppercase">Live Tracking</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[10px] text-gray-600">Untracked Project</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {item.liveUrl ? (
                                                <div className="flex items-center gap-4 pr-2">
                                                    <div className="text-right">
                                                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">Views</div>
                                                        <div className="text-xs font-black text-white">{(item.liveStats?.views || 0).toLocaleString()}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">Likes</div>
                                                        <div className="text-xs font-black text-white">{(item.liveStats?.likes || 0).toLocaleString()}</div>
                                                    </div>
                                                </div>
                                            ) : !isBeingTracked ? (
                                                <button
                                                    onClick={() => setTrackingId(itemId)}
                                                    className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase hover:bg-indigo-500 hover:text-white transition-all"
                                                >
                                                    Track Live
                                                </button>
                                            ) : null}
                                            <div onClick={() => onNavigate('/history')} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                                                <ArrowRight size={14} className="text-gray-400" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* URL Registration Input */}
                                    <AnimatePresence>
                                        {isBeingTracked && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pt-2 flex gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="발행된 링크(URL)를 입력하세요"
                                                        value={inputUrl}
                                                        onChange={(e) => setInputUrl(e.target.value)}
                                                        className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                                                    />
                                                    <button
                                                        disabled={isSyncing}
                                                        onClick={() => handleStartTracking(itemId)}
                                                        className="px-4 py-2 bg-indigo-500 rounded-lg text-white text-[11px] font-black uppercase disabled:opacity-50 flex items-center gap-2"
                                                    >
                                                        {isSyncing ? <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : "Sync"}
                                                    </button>
                                                    <button
                                                        onClick={() => { setTrackingId(null); setInputUrl(''); }}
                                                        className="px-2 py-2 bg-white/5 rounded-lg text-gray-400 text-[11px] font-black uppercase"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

// 4. [Widgets] Connection Status
const PlatformStatusWidget = ({ connectedAccounts, onConnect, onDisconnect, activeResult, activePlatform, setActivePlatform }) => {
    const platforms = [
        { id: 'Instagram Reels', name: 'Instagram', tabId: 'INSTAGRAM', icon: Instagram, color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/20', activeBg: 'bg-gradient-to-br from-purple-600 to-pink-500' },
        { id: 'YouTube Shorts', name: 'YouTube', tabId: 'YOUTUBE', icon: Youtube, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', activeBg: 'bg-red-600' },
        { id: 'Naver Blog', name: 'Naver', tabId: 'NAVER', icon: 'N', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', activeBg: 'bg-emerald-500' },
        { id: 'Threads', name: 'Threads', tabId: 'THREADS', icon: '@', color: 'text-white', bg: 'bg-white/10', border: 'border-white/20', activeBg: 'bg-black border border-white/20' }
    ];

    return (
        <div className={`${GLASS_CARD_CLASSES} rounded-[40px] p-8 h-full flex flex-col`}>
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <Globe size={20} />
                </div>
                <h3 className="text-sm font-black text-indigo-300 uppercase tracking-[0.3em]">Channel Matrix</h3>
            </div>

            <div className="grid grid-cols-2 gap-5 flex-1">
                {platforms.map(p => {
                    const isConnected = connectedAccounts.includes(p.id);
                    // Match by global activePlatform tab ID or activeResult platform name
                    const isSelected = activePlatform === p.tabId ||
                        activeResult?.platform?.toLowerCase().includes(p.name.toLowerCase());

                    return (<button
                        key={p.id}
                        onClick={() => {
                            // 1. Toggle connection
                            if (isConnected) onDisconnect(p.id);
                            else onConnect(p.id);

                            // 2. Set as active global focus
                            setActivePlatform(p.tabId);
                        }}
                        className={cn(
                            "rounded-[32px] border transition-all duration-500 relative overflow-hidden group flex flex-col items-center justify-center gap-4",
                            isSelected
                                ? `scale-[1.02] ${p.border} ${p.bg} ring-4 ring-indigo-500/30 shadow-[0_0_50px_rgba(99,102,241,0.4)]`
                                : isConnected ? `${p.bg} ${p.border}` : "bg-black/40 border-white/5 hover:border-white/10"
                        )}
                    >
                        {/* Selected Indicator - Large Checkmark */}
                        <AnimatePresence>
                            {isSelected && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute inset-0 bg-indigo-600/10 backdrop-blur-[2px] z-20 flex items-center justify-center"
                                >
                                    <motion.div
                                        initial={{ y: 10 }}
                                        animate={{ y: 0 }}
                                        className="bg-indigo-500 text-white rounded-full p-2 shadow-2xl"
                                    >
                                        <CheckCircle2 size={24} className="fill-white/20" />
                                    </motion.div>
                                    <div className="absolute top-0 left-0 right-0 py-1 bg-indigo-500 text-[9px] font-black text-white uppercase tracking-widest text-center">
                                        Selected Target
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Connected Glow */}
                        {isConnected && !isSelected && (
                            <div className={`absolute inset-0 ${p.bg} animate-pulse opacity-30`} />
                        )}

                        <div className={cn(
                            "relative z-10 transition-all duration-500 group-hover:scale-110",
                            isSelected ? "opacity-40 blur-[1px]" : ""
                        )}>
                            {typeof p.icon === 'string' ? (
                                <span className={cn("text-5xl font-black", p.color)}>{p.icon}</span>
                            ) : (
                                <p.icon size={56} className={p.color} />
                            )}
                        </div>

                        <div className="relative z-10 flex items-center gap-2">
                            <span className={cn(
                                "w-2 h-2 rounded-full",
                                isConnected ? "bg-green-500 shadow-[0_0_10px_#22c55e]" : "bg-gray-600"
                            )} />
                            <span className={cn(
                                "text-[10px] font-black tracking-widest uppercase",
                                isConnected ? "text-green-500" : "text-gray-500"
                            )}>
                                {isConnected ? 'Live' : 'Off'}
                            </span>
                        </div>
                    </button>
                    );
                })}
            </div>
        </div>
    );
};



const SwarmTooltip = ({ children }) => (
    <div className="group/swarm relative inline-block">
        {children}
        <div className="absolute top-1/2 left-[calc(100%+24px)] w-72 p-5 bg-[#1a1c26]/98 border border-white/10 rounded-[20px] text-[12px] text-gray-400 leading-normal shadow-3xl opacity-0 invisible group-hover/swarm:opacity-100 group-hover/swarm:visible pointer-events-none transition-all duration-300 z-[500] backdrop-blur-3xl -translate-y-1/2 -translate-x-2 group-hover/swarm:translate-x-0 text-left">
            <div className="absolute top-1/2 -left-2 -translate-y-1/2 border-8 border-transparent border-r-[#1a1c26]" />
            <div className="font-black text-[13px] text-white mb-2 flex items-center gap-1.5 border-b border-white/5 pb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Swarm Intel
            </div>
            <ul className="space-y-2">
                <li className="flex gap-1.5">
                    <span className="text-indigo-400 font-bold">●</span>
                    <span><strong className="text-gray-100">실시간 감시:</strong> 22인의 에이전트 분석</span>
                </li>
                <li className="flex gap-1.5">
                    <span className="text-emerald-400 font-bold">●</span>
                    <span><strong className="text-gray-100">수익 최적화:</strong> 고수익 시장 선별 제안</span>
                </li>
                <li className="flex gap-1.5">
                    <span className="text-purple-400 font-bold">●</span>
                    <span><strong className="text-gray-100">자율 대응:</strong> 리포트 즉시 자동 생성</span>
                </li>
            </ul>
        </div>
    </div>
);

const ReconTooltip = ({ insight, children }) => (
    <div className="group/recon relative">
        {children}
        <div className="absolute bottom-full left-0 mb-6 w-72 p-6 bg-[#0c0e14]/98 border border-white/10 rounded-[28px] opacity-0 invisible group-hover/recon:opacity-100 group-hover/recon:visible transition-all duration-300 z-[100] backdrop-blur-3xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] translate-y-2 group-hover/recon:translate-y-0 text-left">
            <div className="absolute -bottom-1.5 left-8 w-3 h-3 bg-[#0c0e14] border-r border-b border-white/10 rotate-45" />
            <div className="flex items-center gap-2 text-indigo-400 font-black text-[11px] border-b border-white/5 pb-3 mb-4">
                <Radar size={14} className="animate-spin-slow" /> RECON REPORT
            </div>
            <div className="space-y-4">
                <div>
                    <div className="text-[10px] text-gray-500 font-black uppercase mb-1.5 tracking-widest">Market Gap</div>
                    <p className="text-[12px] text-white font-bold leading-relaxed pr-2">{insight?.recon?.gap}</p>
                </div>
                <div>
                    <div className="text-[10px] text-gray-500 font-black uppercase mb-1.5 tracking-widest">SEO Density</div>
                    <p className="text-[12px] text-white font-bold leading-relaxed pr-2">{insight?.recon?.density}</p>
                </div>
                <div className="pt-3 border-t border-white/5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-gray-500 font-black uppercase">Win Probability</span>
                        <span className="text-[13px] text-emerald-400 font-black">{insight?.recon?.winProb}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${insight?.recon?.winProb}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const ExpertTooltip = ({ title, children, content, side = "bottom" }) => (
    <div className="group/expert relative">
        {children}
        <div className={`absolute ${side === 'bottom' ? 'top-[calc(100%+16px)]' : 'bottom-[calc(100%+16px)]'} left-0 w-80 p-5 bg-[#1a1c26]/95 border border-white/10 rounded-[20px] text-[12px] text-gray-400 leading-normal shadow-[0_10px_40px_rgba(0,0,0,0.5)] opacity-0 invisible group-hover/expert:opacity-100 group-hover/expert:visible pointer-events-none transition-all duration-300 z-[9999] backdrop-blur-xl text-left`}>
            <div className={`absolute ${side === 'bottom' ? '-top-1.5' : '-bottom-1.5'} left-8 w-3 h-3 bg-[#1a1c26] border-l border-t border-white/10 rotate-45 transform ${side === 'bottom' ? '' : 'rotate-180 border-r border-b border-l-0 border-t-0'}`} />
            <div className="font-black text-[13px] text-white mb-2 flex items-center gap-2 border-b border-white/5 pb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                {title}
            </div>
            <p className="text-gray-300 font-medium leading-relaxed break-keep">
                {content}
            </p>
        </div>
    </div>
);

const StrategicSwarmWidget = ({ setActiveResult, addNotification }) => {
    const navigate = useNavigate();
    const insights = getSwarmInsights();
    const [selectedNiche, setSelectedNiche] = useState(null);
    const [activeLogs, setActiveLogs] = useState([]);
    const [selectionTarget, setSelectionTarget] = useState(null);

    useEffect(() => {
        if (selectedNiche) {
            // Simulate live log updates
            const interval = setInterval(() => {
                const newLog = simulateSwarmAction(selectedNiche.id);
                setActiveLogs(prev => [newLog, ...prev].slice(0, 5));
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [selectedNiche]);

    return (
        <div className={`${GLASS_CARD_CLASSES.replace('overflow-hidden', 'overflow-visible')} rounded-[40px] p-8 lg:p-10 flex flex-col gap-8 bg-transparent shadow-none border-none`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 relative">
                        <Users size={28} />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-[#0f1218] animate-pulse" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-black text-white tracking-tight whitespace-nowrap">
                                <SwarmTooltip>
                                    <span className="cursor-help hover:text-indigo-400 transition-colors">전략적 에이전트 군집 (Agentic Swarm)</span>
                                </SwarmTooltip>
                            </h3>
                            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest whitespace-nowrap">Global Syncing...</span>
                            </div>
                        </div>
                        <p className="text-base text-gray-500 font-medium tracking-tight">수십 명의 AI 에이전트가 소셜 전선 전역을 실시간으로 감시하고 있습니다.</p>
                    </div>
                </div>

                <div className="flex items-center gap-6 px-6 py-3 bg-white/5 rounded-2xl border border-white/5">
                    <div className="text-center">
                        <div className="text-[10px] text-gray-600 font-black uppercase tracking-tighter">Total Agents</div>
                        <div className="text-lg font-black text-white">22</div>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="text-center">
                        <div className="text-[10px] text-gray-600 font-black uppercase tracking-tighter">Swarm Health</div>
                        <div className="text-lg font-black text-emerald-400">97%</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {NICHES.slice(0, 4).map((niche) => {
                    const insight = insights.find(i => i.niche === niche.id);
                    return (
                        <ShinyCard key={niche.id} spotlightColor="rgba(99, 102, 241, 0.25)" className="rounded-3xl overflow-visible">
                            <motion.div
                                whileHover={{ y: -5 }}
                                onClick={() => setSelectedNiche(niche)}
                                className="bg-black/40 border border-white/5 p-6 hover:border-indigo-500/30 transition-all group/niche relative rounded-3xl cursor-pointer"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-2xl">{niche.icon}</span>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <span className="text-[12px] font-black text-white/40 uppercase tracking-widest">{niche.agents} Agents</span>
                                    </div>
                                </div>

                                <ReconTooltip insight={insight}>
                                    <h4 className="text-xl font-black text-white mb-3 tracking-tighter group-hover/niche:text-indigo-400 transition-colors">{niche.name}</h4>
                                    <div className="space-y-4">
                                        <p className="text-[15px] text-gray-400 leading-relaxed font-medium line-clamp-2 break-keep">
                                            {insight?.trend}
                                        </p>
                                    </div>
                                </ReconTooltip>

                                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                                    <span className="text-[13px] font-black text-indigo-400 uppercase tracking-tight">DETECTION SCORE</span>
                                    <span className="text-[18px] font-black text-white">{insight?.score}%</span>
                                </div>
                                <div className="w-full mt-3 py-3.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-[14px] font-black rounded-2xl transition-all border border-indigo-500/10 flex items-center justify-center gap-3 group-hover/niche:bg-indigo-500 group-hover/niche:text-white">
                                    <Target size={16} /> 실시간 감시망 접속
                                </div>
                            </motion.div>
                        </ShinyCard>
                    );
                })}
            </div >



            <AnimatePresence>
                {selectionTarget && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#0f1218] border border-white/10 rounded-[40px] max-w-lg w-full p-10 shadow-3xl text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full pointer-events-none"></div>

                            <div className="relative z-10 flex flex-col gap-6">
                                <div className="p-4 bg-indigo-500/10 rounded-3xl w-fit mx-auto border border-indigo-500/20">
                                    <Sparkles className="text-indigo-400" size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white mb-2 tracking-tight">전략 루트 선택</h3>
                                    <p className="text-gray-500 text-sm font-medium">포착된 시그널을 어떤 프로세스로 처리할까요?</p>
                                </div>

                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 mb-2">
                                    <p className="text-[11px] text-gray-400 italic">" {selectionTarget.capturedContent} "</p>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <button
                                        onClick={() => {
                                            if (setActiveResult) setActiveResult({ topic: selectionTarget.capturedContent, isFromSwarm: true });
                                            setSelectedNiche(null);
                                            setSelectionTarget(null);
                                            navigate('/topics');
                                            addNotification("주제 발굴 엔진으로 전환합니다. 정밀 분석을 시작하세요.", "info");
                                        }}
                                        className="group relative flex items-center justify-between p-5 bg-white/5 hover:bg-indigo-500 border border-white/5 hover:border-indigo-400 rounded-3xl transition-all duration-300"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20">
                                                <Search size={20} className="text-white" />
                                            </div>
                                            <div className="text-left">
                                                <div className="text-sm font-black text-white">주제 발굴 (Topic Recon)</div>
                                                <div className="text-[10px] text-gray-500 group-hover:text-white/70">키워드 정밀 분석 및 경쟁사 첩보 수집</div>
                                            </div>
                                        </div>
                                        <ArrowUpRight size={18} className="text-gray-600 group-hover:text-white" />
                                    </button>

                                    <button
                                        onClick={() => {
                                            if (setActiveResult) setActiveResult({ topic: selectionTarget.capturedContent, platform: 'YouTube Shorts', isAutoDraft: true });
                                            setSelectedNiche(null);
                                            setSelectionTarget(null);
                                            navigate('/studio');
                                            addNotification("콘텐츠 스튜디오로 즉시 진입합니다.", "success");
                                        }}
                                        className="group relative flex items-center justify-between p-5 bg-white/5 hover:bg-purple-500 border border-white/5 hover:border-purple-400 rounded-3xl transition-all duration-300"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20">
                                                <Layout size={20} className="text-white" />
                                            </div>
                                            <div className="text-left">
                                                <div className="text-sm font-black text-white">콘텐츠 스튜디오 (Studio)</div>
                                                <div className="text-[10px] text-gray-500 group-hover:text-white/70">발견 즉시 멀티 플랫폼 초안 작성</div>
                                            </div>
                                        </div>
                                        <ArrowUpRight size={18} className="text-gray-600 group-hover:text-white" />
                                    </button>
                                </div>

                                <button
                                    onClick={() => setSelectionTarget(null)}
                                    className="mt-2 text-xs font-bold text-gray-600 hover:text-gray-400 transition-colors"
                                >
                                    취소하고 돌아가기
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {selectedNiche && (
                    <div className="fixed inset-0 z-[250] flex items-start justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto no-scrollbar py-12">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#0f1218] border border-white/10 rounded-[40px] max-w-[95%] lg:max-w-6xl w-full h-auto shadow-2xl relative overflow-hidden"
                        >
                            {/* Pro Tier Background Decorations */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                            <div className="relative z-10 p-8 md:p-12 space-y-8">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center gap-4">
                                        <span className="text-4xl">{selectedNiche.icon}</span>
                                        <div>
                                            <h3 className="text-2xl font-black text-white">{selectedNiche.name} 분대 현황</h3>
                                            <p className="text-gray-500 text-xs font-medium">전용 에이전트 {selectedNiche.agents}명이 전투 중입니다.</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelectedNiche(null);
                                            setActiveLogs([]);
                                        }}
                                        className="p-2 hover:bg-white/5 rounded-xl text-gray-400 transition-all"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="text-[10px] text-gray-600 font-black uppercase mb-1">Squad Health</div>
                                        <div className="text-lg font-black text-emerald-400">{selectedNiche.health}%</div>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="text-[10px] text-gray-600 font-black uppercase mb-1">Active Signals</div>
                                        <div className="text-lg font-black text-indigo-400">14 Active</div>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="text-[10px] text-gray-600 font-black uppercase mb-1">Response Latency</div>
                                        <div className="text-lg font-black text-white">45ms</div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Live Operation Logs</h4>
                                    <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 no-scrollbar">
                                        {activeLogs.length > 0 ? activeLogs.map((log, i) => (
                                            <motion.div
                                                key={log.timestamp + i}
                                                initial={{ x: -10, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2 group hover:bg-white/[0.04] transition-all"
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:animate-ping" />
                                                        <span className="text-[11px] font-bold text-gray-300">[{log.agentId}]</span>
                                                        <span className="text-[11px] text-gray-500 font-bold uppercase tracking-tighter">{log.action}</span>
                                                    </div>
                                                    <div className="text-[10px] font-black text-emerald-400">+{log.signalsDetected} Signals</div>
                                                </div>
                                                <div className="pl-4 border-l border-indigo-500/30 flex items-center justify-between gap-4">
                                                    <p className="text-[13px] text-gray-400 font-bold leading-relaxed flex-1">
                                                        <span className="text-indigo-400 mr-2">Captured:</span>
                                                        "{log.capturedContent}"
                                                    </p>
                                                    <button
                                                        onClick={() => {
                                                            setSelectionTarget(log);
                                                        }}
                                                        className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white text-[11px] font-black rounded-lg transition-all flex items-center gap-2 whitespace-nowrap shadow-lg shadow-indigo-500/20"
                                                    >
                                                        <PenTool size={12} /> AI 초안 생성
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )) : (
                                            <div className="py-12 text-center text-gray-600 text-xs font-bold uppercase tracking-widest italic animate-pulse">
                                                Connecting to Encrypted Signal Channel...
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedNiche(null)}
                                    className="w-full mt-8 py-4 bg-white text-black rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
                                >
                                    최고 지휘 사령부로 복귀
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
};


const DashboardMissionFeed = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const missionTypes = [
                { type: 'SCAN', msg: "에이전트 Alpha가 수익 사각지대 발견", color: 'from-indigo-500 to-purple-500', iconColor: 'text-indigo-400' },
                { type: 'RECON', msg: "경쟁 채널 'X' 고수익 패턴 역설계", color: 'from-emerald-500 to-teal-500', iconColor: 'text-emerald-400' },
                { type: 'SYNC', msg: "글로벌 트렌드 데이터 동기화 (30m)", color: 'from-amber-500 to-orange-500', iconColor: 'text-amber-400' },
                { type: 'SEO', msg: "상위 랭커 로직 분석 기반 SEO 추출", color: 'from-pink-500 to-rose-500', iconColor: 'text-pink-400' }
            ];
            const randomMission = missionTypes[Math.floor(Math.random() * missionTypes.length)];
            setLogs(prev => [{ ...randomMission, id: Date.now() + Math.random() }, ...prev].slice(0, 1));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-[420px] pointer-events-none hidden lg:block mr-4">
            <AnimatePresence mode="wait">
                {logs.map(log => (
                    <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-[#13161c] border border-white/10 px-5 py-3.5 rounded-2xl flex items-center gap-4 shadow-xl select-none min-h-[80px]"
                    >
                        <div className={cn("w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-inner", log.iconColor)}>
                            <Activity size={18} className="animate-pulse" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={cn("text-[12px] font-black uppercase tracking-wider", log.iconColor)}>{log.type}</span>
                                <span className="text-[12px] text-gray-500 font-bold uppercase">• INTEL UNIT</span>
                            </div>
                            <p className="text-[15px] text-gray-100 font-black tracking-tight leading-snug line-clamp-2">
                                {log.msg}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

// Main Page
const DashboardPage = () => {
    const {
        user,
        history = [],
        connectedAccounts = [],
        disconnectAccount,
        connectAccount,
        addToHistory,
        addNotification,
        isAuthenticated,
        usage,
        getCurrentPlanDetails,
        monitoringTargets,
        setActiveResult,
        activeResult,
        activePlatform,
        setActivePlatform
    } = useUser();
    const navigate = useNavigate();
    const { onConnectRequest } = useOutletContext() || { onConnectRequest: () => { } };
    const [connectingPlatform, setConnectingPlatform] = useState(null);
    const [showBriefing, setShowBriefing] = useState(false);
    const [showMorningReport, setShowMorningReport] = useState(false);
    const [dailyDrafts, setDailyDrafts] = useState([]);

    // Load existing drafts from history for the Briefing modal fallback
    useEffect(() => {
        if (history && history.length > 0) {
            const drafts = history.filter(item => item.isAutoDraft).slice(0, 3);
            if (drafts.length > 0) setDailyDrafts(drafts);
        }
    }, [history]);

    const planDetails = getCurrentPlanDetails ? getCurrentPlanDetails() : { name: user?.plan === 'pro' ? 'PRO' : 'FREE', monthly_limit: 20 };
    const limit = planDetails.monthly_limit || 20;
    const usagePercentage = limit === -1 ? 100 : Math.min(100, ((usage?.current_month || 0) / limit) * 100);

    const totalGenerated = history.length;

    // 30-Minute Intelligence Refresh Logic
    useEffect(() => {
        const runAutoDraft = async () => {
            const lastDraftTime = localStorage.getItem('last_auto_draft_time');
            const now = Date.now();
            const THIRTY_MINUTES = 30 * 60 * 1000;

            if (!lastDraftTime || (now - parseInt(lastDraftTime)) > THIRTY_MINUTES) {
                console.log("[AutonomousIntel] Triggering Intelligence Refresh (30m cycle)...");
                try {
                    const drafts = await generateDailyAutoDrafts();
                    if (drafts && drafts.length > 0) {
                        // Save to history one by one - DISABLED: Drafts should not clutter history until approved
                        // for (const draft of drafts) {
                        //     await addToHistory(draft);
                        // }
                        localStorage.setItem('last_auto_draft_time', now.toString());
                        setDailyDrafts(drafts);
                        setShowBriefing(true);
                        addNotification("자율 주행 엔진: 새로운 황금 키워드 3건이 발굴되었습니다. (30분 주기 갱신)", "info");
                        console.log("[AutonomousIntel] Briefing modal triggered with", drafts.length, "drafts.");
                    } else {
                        console.log("[AutonomousIntel] No drafts generated, skipping briefing.");
                    }
                } catch (e) {
                    console.error("Auto-Draft failed", e);
                }
            }
        };

        if (isAuthenticated) {
            runAutoDraft();
        }
    }, [isAuthenticated]);

    // --- [시스템 전술: 선전포고] Real-time Alert System (Simulation) ---
    useEffect(() => {
        if (!isAuthenticated || monitoringTargets.length === 0) return;

        const checkRankings = () => {
            const chance = Math.random();
            if (chance > 0.85) { // 15% probability of a shift detection
                const target = monitoringTargets[Math.floor(Math.random() * monitoringTargets.length)];
                addNotification(
                    `🚨 [선전포고] "${target}" 키워드 1위 변동 감지! 지금이 탈환할 골든타임입니다. (Battlefield Recon 기반 저격 가능)`,
                    'warning',
                    8000
                );
            }
        };

        const interval = setInterval(checkRankings, 15000); // Check every 15s for demo
        return () => clearInterval(interval);
    }, [isAuthenticated, monitoringTargets]);

    const handleConnectConfirm = () => {
        if (!connectingPlatform) return;
        if (connectAccount) connectAccount(connectingPlatform);
        else onConnectRequest(connectingPlatform);
        setConnectingPlatform(null);
    };

    return (
        <>
            <HomePageSEO />
            <div className="min-h-screen p-6 md:p-10 max-w-[1440px] mx-auto pb-32">
                {/* 1. Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col md:flex-row md:items-center gap-8"
                    >
                        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                            반갑습니다, <span className="text-indigo-400">{user?.name || 'Creator'}</span>님
                        </h1>


                    </motion.div>

                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <DashboardMissionFeed />




                        <ExpertTooltip
                            title="INTELLIGENCE BRIEF"
                            content="전 세계 소셜 미디어 데이터를 수집하여 매일 아침 제공되는 AI 브리핑입니다. 급상승 트렌드, 경쟁사 동향, 수익화 기회를 한눈에 파악할 수 있는 전략 보고서입니다."
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowMorningReport(true)}
                                className="bg-gradient-to-br from-indigo-600 to-purple-600 px-6 py-2.5 rounded-2xl flex items-center gap-3 transition-all group min-h-[70px] shadow-lg shadow-indigo-500/20"
                            >
                                <div className="relative">
                                    <Radar size={20} className="text-white group-hover:rotate-45 transition-transform" />
                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping" />
                                </div>
                                <div className="flex flex-col items-start leading-tight gap-0.5 text-left">
                                    <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">Autonomous SWARM</span>
                                    <span className="text-sm font-black text-white uppercase tracking-tighter">모닝 통합 리포트</span>
                                </div>
                                <ChevronRight size={16} className="text-white/50 group-hover:translate-x-0.5 transition-transform ml-2" />
                            </motion.button>
                        </ExpertTooltip>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <ZeroStateTemplates onTemplateClick={(template) => navigate(`/topics?q=${encodeURIComponent(template.example)}`)} />
                </motion.div>

                {/* 2. Top Analytics Row */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-8">
                    {/* Left Side: Productivity Hub */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-6 h-[290px] relative z-20"
                    >
                        <ProductivityWidget user={user} history={isAuthenticated ? history : []} />
                    </motion.div>

                    {/* Right Side: Revenue Tracker Widget */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="lg:col-span-6 h-[290px]"
                    >
                        <RevenueSnapshotWidget history={isAuthenticated ? history : []} />
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <ShinyCard spotlightColor="rgba(16, 185, 129, 0.1)" className="overflow-visible">
                        <StrategicSwarmWidget
                            setActiveResult={setActiveResult}
                            addNotification={addNotification}
                        />
                    </ShinyCard>
                </motion.div>



                {/* 4. Bottom Management Row */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="md:col-span-7 lg:col-span-8 h-[360px]"
                    >
                        <RecentProjectsWidget history={history} onNavigate={navigate} />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="md:col-span-5 lg:col-span-4 h-[360px]"
                    >
                        <PlatformStatusWidget
                            connectedAccounts={connectedAccounts}
                            onConnect={(id) => setConnectingPlatform(id)}
                            onDisconnect={disconnectAccount}
                            activeResult={activeResult}
                            activePlatform={activePlatform}
                            setActivePlatform={setActivePlatform}
                        />
                    </motion.div>
                </div>
            </div>

            {/* Daily Intelligence Briefing Modal */}
            <AnimatePresence>
                {showBriefing && (
                    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#0f1218] border border-white/10 rounded-[40px] max-w-[95%] lg:max-w-4xl w-full max-h-[95vh] overflow-y-auto overflow-x-hidden scrollbar-hide shadow-2xl relative"
                        >
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

                            <div className="relative z-10 p-8 md:p-12">
                                <div className="flex justify-between items-start mb-10">
                                    <div>
                                        <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 w-fit mb-4">
                                            <Sparkles size={14} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Autonomous Intelligence Briefing</span>
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                                            오늘의 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">황금 키워드</span> 브리핑
                                        </h2>
                                        <p className="text-gray-400 mt-2 font-medium">자율 주행 엔진이 분석한 오늘 가장 수익성이 높은 주제들입니다.</p>
                                    </div>
                                    <button
                                        onClick={() => setShowBriefing(false)}
                                        className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-500 hover:text-white transition-all"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                    {dailyDrafts.map((draft, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 + (idx * 0.1) }}
                                            className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-indigo-500/30 transition-all group/card cursor-pointer"
                                            onClick={() => {
                                                if (setActiveResult) setActiveResult(draft);
                                                navigate('/studio');
                                            }}
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${draft.platform.includes('YouTube') ? 'bg-red-500/10 text-red-500' : draft.platform.includes('Instagram') ? 'bg-pink-500/10 text-pink-500' : 'bg-green-500/10 text-green-500'}`}>
                                                    {draft.platform.includes('YouTube') && <Youtube size={20} />}
                                                    {draft.platform.includes('Instagram') && <Instagram size={20} />}
                                                    {draft.platform.includes('Blog') && <span className="font-bold">N</span>}
                                                </div>
                                                <div className="flex items-center gap-1 text-emerald-400 text-xs font-black">
                                                    <TrendingUp size={12} /> {draft.intelligence?.roi}
                                                </div>
                                            </div>
                                            <h4 className="text-white font-black text-lg mb-2 leading-tight group-hover/card:text-indigo-400 transition-colors break-keep">
                                                {draft.topic}
                                            </h4>
                                            <p className="text-[13px] text-gray-400 font-bold leading-relaxed mb-6 line-clamp-2 break-keep">
                                                "{draft.intelligence?.reason}"
                                            </p>
                                            <div className="flex items-center justify-between pt-4 border-t border-white/5 gap-2">
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Difficulty</span>
                                                    <span className={`text-[10px] font-black ${draft.intelligence?.difficulty === 'EASY' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                                        {draft.intelligence?.difficulty}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (setActiveResult) setActiveResult({ ...draft, persona: 'ensemble' });
                                                        navigate('/studio');
                                                        addNotification("오토파일럿 시퀀스 가동: 멀티 페르소나 앙상블 모드로 즉시 전환합니다.", "success");
                                                    }}
                                                    className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white text-[9px] font-black rounded-lg transition-all flex items-center gap-1.5 border border-indigo-500/20"
                                                >
                                                    <Rocket size={10} /> Fast Track
                                                </button>
                                            </div>
                                            <button className="p-2 bg-indigo-500 text-white rounded-lg opacity-0 group-hover/card:opacity-100 transition-all translate-x-2 group-hover/card:translate-x-0">
                                                <ArrowUpRight size={14} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-indigo-600/10 border border-indigo-500/20 rounded-[32px]">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                                            <ShieldCheck size={28} />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold">자율 전략 수립 완료</h4>
                                            <p className="text-xs text-indigo-400/80 font-medium">위 3가지 키워드는 현재 경쟁 수준 대비 수익성이 가장 높은 구간입니다.</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowBriefing(false)}
                                        className="px-8 py-4 bg-white text-black rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10"
                                    >
                                        작전 지침 확인 완료
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AutonomousMorningReport isOpen={showMorningReport} onClose={() => setShowMorningReport(false)} />
        </>
    );
};

export default DashboardPage;
