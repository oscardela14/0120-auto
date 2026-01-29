import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Target, Calendar, TrendingUp, DollarSign, Globe, CheckCircle2, ChevronRight, Zap, Search, ArrowUpRight, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { cn } from '../lib/utils';

const StrategyCard = ({ title, icon: Icon, children, className = "" }) => (
    <div className={`bg-surface/40 border border-white/5 rounded-3xl p-8 ${className}`}>
        <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
                <Icon size={24} />
            </div>
            <h3 className="text-2xl font-black text-white">{title}</h3>
        </div>
        {children}
    </div>
);

export const GrowthStrategyView = () => {
    const { activeResult, user } = useUser();
    const navigate = useNavigate();

    const currentTopic = activeResult?.topic || '콘텐츠';
    const currentPlatform = activeResult?.platform || '전체';

    const data = {
        campaign: activeResult?.campaign || [
            { day: 1, platform: currentPlatform, strategy: 'Initial Viral Launch', detail: `"${currentTopic}" 주제의 핵심 훅을 활용해 초기 조기 도달을 유도합니다.` },
            { day: 3, platform: 'Multi-Channel', strategy: 'Cross-Promotion', detail: `OSMU 변환된 버전으로 다른 플랫폼의 잠재 고객을 본문으로 끌어옵니다.` },
            { day: 7, platform: 'Community', strategy: 'Engagement Boost', detail: `댓글과 피드백을 분석하여 후속 "${currentTopic}" 콘텐츠의 방향성을 결정합니다.` }
        ],
        profitData: {
            total: activeResult?.platform?.includes('Blog') ? '약 1,200,000원' : '약 3,500,000원',
            roas: '720%',
            channels: ['AdSense', 'Affiliate', 'Premium Brand Connect']
        },
        goldenKeywords: activeResult?.goldenKeywords || [
            { keyword: `${currentTopic} 추천`, volume: '15,200', competition: 'Low', difficulty: 12 },
            { keyword: `${currentTopic} 방법`, volume: '8,900', competition: 'Medium', difficulty: 38 },
            { keyword: `초보 ${currentTopic}`, volume: '4,500', competition: 'Low', difficulty: 25 }
        ]
    };

    if (!activeResult) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                <Rocket size={64} className="text-gray-700 mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2">현재 수립된 전략이 없습니다</h2>
                <p className="text-gray-500 mb-8">콘텐츠 스튜디오에서 먼저 콘텐츠를 생성하거나<br />보관함에서 항목을 선택해주세요.</p>
                <button onClick={() => navigate('/studio')} className="px-6 py-3 bg-primary text-white font-bold rounded-xl">스튜디오로 이동</button>
            </div>
        );
    }

    return (
        <div className="max-w-[1440px] mx-auto p-6 md:p-8 space-y-8">
            <header className="mb-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <Rocket className="text-orange-400" size={32} />
                        콘텐츠 그로스 전략 리포트
                    </h1>
                    <p className="text-gray-400 mt-2">주제 <span className="text-white font-bold">"{currentTopic}"</span>에 최적화된 마케팅 로드맵입니다.</p>
                </div>
                <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
                    <div className="text-right">
                        <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Strategist AI</span>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-green-500" />
                            <span className="text-xs text-white font-bold">분석 완료</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* 1. 7-Day Campaign Plan */}
                <StrategyCard title="7-Day 가속화 캠페인" icon={Calendar} className="lg:col-span-8 bg-indigo-500/5">
                    <div className="relative">
                        <div className="absolute left-[27px] top-4 bottom-4 w-px bg-gradient-to-b from-indigo-500 via-purple-500 to-transparent opacity-20" />
                        <div className="space-y-8">
                            {data.campaign.map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="relative flex gap-8 group"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-[#0a0a0c] border border-white/10 flex items-center justify-center shrink-0 z-10 group-hover:border-indigo-500 transition-all shadow-xl shadow-black/40">
                                        <span className="text-indigo-400 font-black">D-{step.day}</span>
                                    </div>
                                    <div className={cn(
                                        "flex-1 bg-white/5 rounded-3xl p-6 border transition-all",
                                        step.platform.includes(currentPlatform)
                                            ? "border-indigo-500 bg-indigo-500/5 shadow-2xl"
                                            : "border-white/5 hover:border-indigo-500/30"
                                    )}>
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3">
                                                <span className={cn(
                                                    "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded",
                                                    step.platform.includes(currentPlatform) ? "bg-indigo-500 text-white" : "text-indigo-400 bg-indigo-500/10"
                                                )}>{step.platform}</span>
                                                <span className="text-[10px] font-black text-gray-600">|</span>
                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">TACTIC #{idx + 1}</span>
                                            </div>
                                            {step.platform.includes(currentPlatform) && (
                                                <div className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-black animate-pulse">CURRENT FOCUS</div>
                                            )}
                                            {!step.platform.includes(currentPlatform) && (
                                                <div className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[10px] font-bold">High Priority</div>
                                            )}
                                        </div>
                                        <h4 className="text-lg font-bold text-white mb-2">{step.strategy}</h4>
                                        <p className="text-sm text-gray-400 leading-relaxed font-medium">{step.detail}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </StrategyCard>

                {/* 2. Profit Maximizer */}
                <div className="lg:col-span-4 space-y-8">
                    <StrategyCard title="수익화 시뮬레이션" icon={DollarSign} className="bg-gradient-to-br from-green-900/10 to-transparent border-green-500/10">
                        <div className="space-y-8">
                            <div className="text-center p-6 bg-black/40 rounded-[32px] border border-white/5">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">예상 도달시 기대 수익</span>
                                <span className="text-4xl font-black text-white">{data.profitData.total}</span>
                                <div className="mt-4 flex items-center justify-center gap-2 text-green-400">
                                    <TrendingUp size={16} />
                                    <span className="text-xs font-bold">지난 달 대비 15% 상승 예측</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-green-500/30 transition-all cursor-help relative group/roas">
                                    <span className="text-[10px] text-gray-500 font-bold block mb-1">ROI / ROAS</span>
                                    <span className="text-lg font-black text-white">{data.profitData.roas}</span>
                                    <div className="absolute bottom-full left-0 mb-2 p-2 bg-black text-[8px] text-gray-400 rounded-lg hidden group-hover/roas:block">투자 대비 수익률 분석</div>
                                </div>
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <span className="text-[10px] text-gray-500 font-bold block mb-1">Viral Power</span>
                                    <span className="text-lg font-black text-indigo-400">Ultra</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">추천 수익 파이프라인</h4>
                                {data.profitData.channels.map(channel => (
                                    <div key={channel} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group/ch">
                                        <span className="text-xs text-gray-300 font-bold">{channel}</span>
                                        <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center group-hover/ch:bg-green-500 transition-colors">
                                            <ArrowUpRight size={14} className="text-green-500 group-hover:text-black transition-colors" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </StrategyCard>

                    <StrategyCard title="황금 키워드 전략" icon={Search} className="bg-indigo-900/10 border-indigo-500/20">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4 p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                                <Zap size={14} className="text-indigo-400" />
                                <span className="text-[10px] text-indigo-300 font-bold uppercase">Algorithm Recommended Picks</span>
                            </div>
                            {data.goldenKeywords.map((kw, idx) => (
                                <div key={idx} className="p-5 bg-black/40 rounded-3xl border border-white/5 group/kw hover:border-indigo-500/30 transition-all">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-sm font-black text-white group-hover/kw:text-indigo-400 transition-colors">{kw.keyword}</h4>
                                        <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${kw.difficulty < 30 ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                                            {kw.difficulty < 30 ? 'Low Comp' : 'Med Comp'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="flex-1">
                                            <div className="flex justify-between text-[8px] text-gray-600 mb-2 font-bold uppercase tracking-widest">
                                                <span>노출 경쟁력</span>
                                                <span>{100 - kw.difficulty}%</span>
                                            </div>
                                            <div className="h-2 bg-gray-900 rounded-full overflow-hidden border border-white/5">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${100 - kw.difficulty}%` }}
                                                    transition={{ duration: 1, delay: 0.5 + (idx * 0.2) }}
                                                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
                                                />
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className="text-[10px] text-gray-500 font-bold block mb-1">Monthly</span>
                                            <span className="text-sm font-black text-white">{kw.volume}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </StrategyCard>
                </div>
            </div>
        </div>
    );
};

