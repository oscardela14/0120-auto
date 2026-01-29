import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Signal, Sparkles, Zap, Loader, Split, Trophy, MousePointer2, TrendingUp, ShieldAlert, Lock, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const ContentCard = ({ children, className = "" }) => (
    <div className={`bg-surface/30 border border-white/10 rounded-2xl p-6 ${className}`}>
        {children}
    </div>
);

const FeatureLock = ({ message, onUpgrade }) => (
    <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl p-6 text-center">
        <Lock size={32} className="text-amber-500 mb-4" />
        <p className="text-white font-bold mb-4">{message}</p>
        <button
            onClick={onUpgrade}
            className="px-6 py-2 bg-amber-500 text-black font-bold rounded-xl hover:scale-105 transition-transform"
        >
            PRO 플랜 업그레이드
        </button>
    </div>
);

export const AnalyzerView = () => {
    const { activeResult, user, addNotification } = useUser();
    const navigate = useNavigate();

    // Mock or extract data from activeResult
    const data = activeResult ? {
        ...activeResult,
        seoScore: activeResult.seoScore || { score: 78, status: 'yellow', details: { ai: 35, structure: 25, trend: 18 }, feedback: ["제목에 핵심 키워드를 전진 배치하세요."] },
        abVariants: activeResult.abVariants || [
            { id: 'A', strategy: 'Emotional Hook', viralScore: 92, ctr: '12.4%', title: activeResult.title || '제목 없음', scoreDetails: { ai: 45, structure: 28, trend: 19 } },
            { id: 'B', strategy: 'Direct Value', viralScore: 84, ctr: '8.2%', title: activeResult.titleB || 'B안 제목 없음', scoreDetails: { ai: 38, structure: 26, trend: 20 } }
        ],
        safetyData: activeResult.safetyData || { score: 98, status: 'safe' },
        suitabilityData: activeResult.suitabilityData || { score: 92, status: 'high' }
    } : {
        seoScore: { score: 78, status: 'yellow', details: { ai: 35, structure: 25, trend: 18 }, feedback: ["제목에 핵심 키워드를 전진 배치하세요."] },
        abVariants: [
            { id: 'A', strategy: 'Emotional Hook', viralScore: 92, ctr: '12.4%', title: '충격! 지금까지 몰랐던 다이어트의 진실', scoreDetails: { ai: 45, structure: 28, trend: 19 } },
            { id: 'B', strategy: 'Direct Value', viralScore: 84, ctr: '8.2%', title: '일주일에 3kg 감량하는 현실적인 루틴', scoreDetails: { ai: 38, structure: 26, trend: 20 } }
        ],
        safetyData: { score: 98, status: 'safe' },
        suitabilityData: { score: 92, status: 'high' }
    };

    const [selectedVariant, setSelectedVariant] = useState('A');
    const [isOptimizingSEO, setIsOptimizingSEO] = useState(false);

    const hasPro = user?.plan === 'pro' || user?.plan === 'business';

    const handleActiveSEOBoost = () => {
        setIsOptimizingSEO(true);
        setTimeout(() => {
            setIsOptimizingSEO(false);
            addNotification("SEO 최적화 부스트가 완료되었습니다! 점수가 98점으로 상승했습니다.", "success");
        }, 2000);
    };

    if (!activeResult) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                <BarChart3 size={64} className="text-gray-700 mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2">분석할 데이터가 없습니다</h2>
                <p className="text-gray-500 mb-8">콘텐츠 스튜디오에서 먼저 콘텐츠를 생성하거나<br />보관함에서 항목을 선택해주세요.</p>
                <button onClick={() => navigate('/studio')} className="px-6 py-3 bg-primary text-white font-bold rounded-xl">스튜디오로 이동</button>
            </div>
        );
    }

    return (
        <div className="max-w-[1440px] mx-auto p-6 md:p-8 space-y-8">
            <header className="mb-8">
                <h1 className="text-3xl font-black text-white flex items-center gap-3">
                    <BarChart3 className="text-indigo-400" size={32} />
                    AI 정밀 분석 센터
                </h1>
                <p className="text-gray-400 mt-2">알고리즘 적합성과 SEO 데이터를 실시간으로 시뮬레이션합니다.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. SEO Traffic Light */}
                <ContentCard className="relative overflow-hidden group">
                    {!hasPro && <FeatureLock message="SEO 정밀 분석은 Pro 플랜 전용 서비스입니다." onUpgrade={() => navigate('/pricing')} />}

                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Signal size={20} className="text-blue-400" />
                                Smart SEO Score
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">네이버/유튜브 알고리즘 가중치 분석 결과</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-black ${data.seoScore.status === 'green' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                            {data.seoScore.status === 'green' ? '매우 좋음' : '개선 필요'}
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center py-6">
                        <div className="relative w-48 h-48">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="96" cy="96" r="80" stroke="#1f2937" strokeWidth="16" fill="transparent" />
                                <motion.circle
                                    cx="96" cy="96" r="80"
                                    stroke={data.seoScore.status === 'green' ? '#4ade80' : '#facc15'}
                                    strokeWidth="16"
                                    fill="transparent"
                                    strokeDasharray={502.6}
                                    initial={{ strokeDashoffset: 502.6 }}
                                    animate={{ strokeDashoffset: 502.6 - (502.6 * data.seoScore.score / 100) }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-black text-white">{data.seoScore.score}</span>
                                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Score</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 mt-8">
                        <div className="bg-white/5 p-4 rounded-xl">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-gray-400">AI 확산 예측</span>
                                <span className="text-xs text-white">{data.seoScore.details.ai}/50</span>
                            </div>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div style={{ width: `${(data.seoScore.details.ai / 50) * 100}%` }} className="h-full bg-blue-500 rounded-full" />
                            </div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-gray-400">구조적 완성도</span>
                                <span className="text-xs text-white">{data.seoScore.details.structure}/30</span>
                            </div>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div style={{ width: `${(data.seoScore.details.structure / 30) * 100}%` }} className="h-full bg-green-500 rounded-full" />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleActiveSEOBoost}
                        disabled={isOptimizingSEO}
                        className="w-full mt-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                    >
                        {isOptimizingSEO ? <Loader className="animate-spin" size={20} /> : <Zap size={20} />}
                        {isOptimizingSEO ? '알고리즘 재설계 중...' : 'Active SEO 부스트 실행'}
                    </button>
                </ContentCard>

                {/* 2. A/B Test Report */}
                <ContentCard className="border-primary/20 bg-indigo-500/5">
                    <div className="flex items-center gap-2 mb-6">
                        <Split size={20} className="text-primary" />
                        <h3 className="text-xl font-bold text-white">AI A/B 테스트 리포트</h3>
                    </div>

                    <div className="space-y-4">
                        {data.abVariants.map((variant) => (
                            <motion.div
                                key={variant.id}
                                onClick={() => setSelectedVariant(variant.id)}
                                whileHover={{ scale: 1.01 }}
                                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${selectedVariant === variant.id
                                    ? 'bg-primary/10 border-primary shadow-lg'
                                    : 'bg-black/40 border-white/5 hover:border-white/10'
                                    }`}
                            >
                                {variant.id === 'A' && (
                                    <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-bl-xl flex items-center gap-1">
                                        <Trophy size={10} /> WINNER
                                    </div>
                                )}
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-xs font-black text-indigo-400">전략 {variant.id}: {variant.strategy}</span>
                                    <div className="text-right">
                                        <span className="text-[10px] text-gray-500 block">예상 CTR</span>
                                        <span className="text-lg font-black text-white">{variant.ctr}</span>
                                    </div>
                                </div>
                                <h4 className="text-sm font-bold text-gray-200 mb-4 pr-16 leading-relaxed">
                                    {variant.title}
                                </h4>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                                        <div style={{ width: variant.ctr }} className="h-full bg-primary" />
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-500">{variant.viralScore}점</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-8 p-4 bg-primary/5 border border-primary/10 rounded-xl flex items-start gap-3">
                        <Sparkles size={16} className="text-primary shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs text-indigo-200 font-medium leading-relaxed">
                                <span className="font-black text-primary">Insight:</span> 전략 A가 감정적 후킹 요소가 강해 <span className="underline decoration-primary">공유 가능성</span>이 2.4배 더 높습니다.
                            </p>
                        </div>
                    </div>
                </ContentCard>

                {/* 3. Algorithm Guardrail */}
                <ContentCard className="lg:col-span-2 bg-gradient-to-r from-red-900/10 to-transparent border-red-500/20">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <ShieldAlert size={20} className="text-red-400" />
                            알고리즘 가드레일 (Safety)
                        </h3>
                        <div className="flex gap-4">
                            <div className="text-center">
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Safety Score</div>
                                <div className="text-xl font-black text-green-400">{data.safetyData.score}%</div>
                            </div>
                            <div className="text-center">
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Engage Index</div>
                                <div className="text-xl font-black text-indigo-400">{data.suitabilityData.score}%</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-black/30 p-5 rounded-2xl border border-white/5 h-full">
                            <h4 className="text-xs font-bold text-gray-400 mb-4">🚨 유해성 검사</h4>
                            <ul className="space-y-3 text-xs">
                                <li className="flex items-center justify-between text-green-400">
                                    <span>비속어/욕설</span>
                                    <span className="font-bold">검출 안됨</span>
                                </li>
                                <li className="flex items-center justify-between text-green-400">
                                    <span>저작권 위반</span>
                                    <span className="font-bold">안전</span>
                                </li>
                                <li className="flex items-center justify-between text-green-400">
                                    <span>선정성/광고성</span>
                                    <span className="font-bold">허용 범위</span>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-black/30 p-5 rounded-2xl border border-white/5">
                            <h4 className="text-xs font-bold text-gray-400 mb-4">🎯 적합성 분석</h4>
                            <p className="text-[11px] text-gray-500 leading-relaxed">
                                본 콘텐츠의 주제는 현재 <span className="text-white font-bold">2030 여성</span> 그룹에서 가장 높은 반응을 얻고 있습니다. <span className="text-indigo-400 underline">#가성비</span> 키워드의 가중치가 높아 유입 효율이 좋을 전망입니다.
                            </p>
                        </div>
                        <div className="bg-indigo-600/10 p-5 rounded-2xl border border-indigo-500/20 flex flex-col justify-center text-center">
                            <span className="text-3xl mb-2">💎</span>
                            <h4 className="text-sm font-bold text-white mb-1">고가치 콘텐츠 인증</h4>
                            <p className="text-[10px] text-indigo-300">알고리즘이 '전문성' 항목에 높은 점수를 부여했습니다.</p>
                        </div>
                    </div>
                </ContentCard>
            </div>
        </div>
    );
};
