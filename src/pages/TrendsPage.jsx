import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, Activity, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { fetchRealtimeTrends, getTrendUpdateInfo, getRandomTrends } from '../utils/realtimeTrends';
import { generateContent } from '../utils/contentGenerator';
import { ResultView } from '../components/ResultView';
import { cn } from '../lib/utils';

import { TrendService } from '../services/TrendService';
import { fetchGA4RealtimeStats } from '../utils/ga4Engine';

const TrendsPage = () => {
    const navigate = useNavigate();
    const {
        isAuthenticated,
        addToHistory,
        canGenerateContent,
        addNotification,
        activePlatform,
        setActivePlatform
    } = useUser();

    // Mapping for Categories
    const TREND_FILTER_MAP = {
        'MASTER': 'ALL',
        'YOUTUBE': '유튜브',
        'INSTAGRAM': '인스타',
        'NAVER': '네이버 블로그',
        'THREADS': '스레드'
    };

    const filter = TREND_FILTER_MAP[activePlatform] || 'ALL';

    const [trends, setTrends] = useState([]);
    const [isLoadingTrends, setIsLoadingTrends] = useState(true);
    const [trendInfo, setTrendInfo] = useState(TrendService.getUpdateStatus());
    const [generatedResult, setGeneratedResult] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [loadingKeywords, setLoadingKeywords] = useState(new Set());
    const [approvedKeywords, setApprovedKeywords] = useState(new Set());
    const [gaStats, setGaStats] = useState(null);

    // 1. 초기 데이터 로드 (서비스 호출)
    useEffect(() => {
        const loadTrends = async () => {
            setIsLoadingTrends(true);
            const data = await TrendService.getLiveTrends();
            setTrends(data);
            setIsLoadingTrends(false);
        };
        const loadGA4 = async () => {
            const data = await fetchGA4RealtimeStats();
            if (data.success) setGaStats(data);
        };
        loadTrends();
        loadGA4();
    }, []);

    // 2. 실시간 상태 주기적 업데이트
    useEffect(() => {
        const timer = setInterval(() => {
            setTrendInfo(TrendService.getUpdateStatus());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // 3. AI 전략 초안 생성 (비즈니스 로직은 서비스가 처리)
    const handleAutoDraftAndReflect = async (topic, platform) => {
        if (!isAuthenticated) return addNotification("로그인이 필요한 기능입니다.", "info");
        if (!canGenerateContent()) return addNotification("사용량을 모두 소모하셨습니다.", "error");

        setIsGenerating(true);
        try {
            const finalResult = await TrendService.generateAndSaveDraft(topic, platform, addToHistory);
            setGeneratedResult(finalResult);
            addNotification(`[${platform}] 전략 초안이 즉시 반영되었습니다.`, "success");
        } catch (error) {
            addNotification("초안 생성 중 오류가 발생했습니다.", "error");
        } finally {
            setIsGenerating(false);
        }
    };

    // 4. 원스톱 일괄 발행 (비즈니스 로직은 서비스가 처리)
    const handleOneStopPublish = async (topic, e) => {
        if (e) e.stopPropagation();
        if (approvedKeywords.has(topic)) return addNotification("이미 승인된 항목입니다.", "info");
        if (!isAuthenticated) return addNotification("로그인이 필요합니다.", "info");
        if (!canGenerateContent()) return addNotification("크레딧이 부족합니다.", "error");

        setLoadingKeywords(prev => new Set(prev).add(topic));
        addNotification(`👑 '${topic}' 최종 승인... 4대 플랫폼 동시 프로세스 가동!`, "info");

        try {
            const result = await TrendService.processOneStopPublish(topic, addToHistory);

            addNotification(`✅ [${topic}] 관련 ${result.successCount}개 채널 동시 전송 완료.`, "success");
            setApprovedKeywords(prev => new Set(prev).add(topic));
        } catch (error) {
            addNotification("승인 처리 중 오류가 발생했습니다.", "error");
        } finally {
            setLoadingKeywords(prev => {
                const next = new Set(prev);
                next.delete(topic);
                return next;
            });
        }
    };

    const categories = [
        { id: 'MASTER', label: 'ALL' },
        { id: 'YOUTUBE', label: '유튜브' },
        { id: 'INSTAGRAM', label: '인스타' },
        { id: 'NAVER', label: '네이버 블로그' },
        { id: 'THREADS', label: '스레드' }
    ];
    const filteredTrends = filter === 'ALL' ? trends : trends.filter(t => t.category === filter);

    if (generatedResult) {
        return <ResultView data={generatedResult} onBack={() => setGeneratedResult(null)} />;
    }

    if (isGenerating) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] text-center relative overflow-hidden bg-background">
                <div className="relative z-10">
                    <motion.div
                        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                        transition={{ rotate: { duration: 2, repeat: Infinity, ease: "linear" }, scale: { duration: 1.5, repeat: Infinity } }}
                        className="mb-8 relative mx-auto w-20 h-20"
                    >
                        <div className="absolute inset-0 bg-primary blur-xl opacity-50"></div>
                        <div className="w-20 h-20 border-4 border-primary border-t-white rounded-full relative z-10" />
                    </motion.div>
                    <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">바이럴 전략 도출 중...</h3>
                    <p className="text-indigo-300 font-medium">선택하신 트렌드의 성공 패턴을 분석하고 있습니다.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-4">
            <div className="max-w-[1440px] mx-auto">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-[10px] font-black text-red-400 uppercase tracking-widest">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                                Live Trend Radar
                            </div>
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tight mb-2">실시간 <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">바이럴 트렌드</span></h1>
                        <p className="text-gray-400 font-medium">{trendInfo.time} | {trendInfo.cycle}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {/* GA4 Traffic Correlation Badge */}
                        <div className="flex items-center gap-3 px-5 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 mr-4">
                            <Activity size={14} className="text-indigo-400" />
                            <div className="flex flex-col text-left">
                                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter leading-none">Traffic Correlation</span>
                                <span className="text-xs font-black text-white">{gaStats?.activeUsers || '...'} Active</span>
                            </div>
                        </div>

                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActivePlatform(cat.id)}
                                className={cn(
                                    "px-5 py-2 rounded-xl text-xs font-bold transition-all border",
                                    activePlatform === cat.id
                                        ? "bg-white text-black border-white"
                                        : "bg-white/5 text-gray-400 border-white/5 hover:border-white/20 hover:text-white"
                                )}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </header>

                {/* Trends Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                    {isLoadingTrends ? (
                        [...Array(20)].map((_, i) => (
                            <div key={i} className="h-40 bg-white/5 rounded-3xl animate-pulse border border-white/5 shadow-2xl"></div>
                        ))
                    ) : (
                        filteredTrends.map((t, i) => {
                            let cardStyle = "bg-white/5 border-white/5 hover:border-white/20 text-gray-400 h-full min-h-[160px]";
                            let rankStyle = "bg-white/10 text-gray-400";
                            let glow = "";

                            if (i === 0) {
                                cardStyle = "bg-gradient-to-br from-yellow-900/40 to-black border-yellow-500/40 hover:border-yellow-400/60 text-yellow-100 min-h-[160px]";
                                rankStyle = "bg-gradient-to-br from-yellow-300 to-amber-600 text-black shadow-lg shadow-yellow-500/30";
                                glow = "shadow-[0_0_50px_rgba(234,179,8,0.15)]";
                            } else if (i === 1) {
                                cardStyle = "bg-gradient-to-br from-slate-800/60 to-black border-slate-400/40 hover:border-slate-300/60 text-slate-100 min-h-[160px]";
                                rankStyle = "bg-gradient-to-br from-slate-200 to-slate-500 text-black shadow-slate-500/30";
                            } else if (i === 2) {
                                cardStyle = "bg-gradient-to-br from-orange-900/40 to-black border-orange-500/40 hover:border-orange-400/60 text-orange-100 min-h-[160px]";
                                rankStyle = "bg-gradient-to-br from-orange-300 to-red-600 text-black shadow-orange-500/30";
                            }

                            return (
                                <motion.div
                                    key={t.keyword}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                    className={cn(
                                        "relative p-6 rounded-[32px] border flex flex-col justify-between transition-all duration-500 group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden",
                                        cardStyle, glow
                                    )}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                    <div className="flex justify-between items-start relative z-10 mb-4">
                                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black", rankStyle)}>
                                            {t.rank}
                                        </div>
                                        <div className="flex gap-2">
                                            {i < 3 && (
                                                <button
                                                    disabled={loadingKeywords.has(t.keyword)}
                                                    onClick={(e) => handleOneStopPublish(t.keyword, e)}
                                                    className={cn(
                                                        "h-10 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-lg transition-all scale-95 hover:scale-100 hover:-translate-y-1",
                                                        approvedKeywords.has(t.keyword)
                                                            ? "bg-slate-700 text-slate-300 cursor-default"
                                                            : "bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/30"
                                                    )}
                                                    title="4개 플랫폼 원스톱 최종 승인"
                                                >
                                                    {loadingKeywords.has(t.keyword) ? (
                                                        <Activity size={16} className="text-white animate-pulse" />
                                                    ) : approvedKeywords.has(t.keyword) ? (
                                                        <CheckCircle2 size={16} className="text-emerald-400" />
                                                    ) : (
                                                        <CheckCircle2 size={16} className="text-white" />
                                                    )}
                                                    <span className="text-[11px] font-bold hidden xl:block whitespace-nowrap">
                                                        {loadingKeywords.has(t.keyword) ? "승인 중..." : approvedKeywords.has(t.keyword) ? "승인 완료" : "최종 승인"}
                                                    </span>
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleAutoDraftAndReflect(t.keyword, t.category)}
                                                className="w-10 h-10 rounded-xl bg-primary hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-primary/30 transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 hover:rotate-12"
                                                title="AI 전략 대본 생성"
                                            >
                                                <Zap size={18} className="fill-white" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t.category} / {t.volume}</span>
                                            <h3 className="text-xl font-black text-white leading-tight break-keep group-hover:text-primary transition-colors cursor-pointer" onClick={() => navigate(`/topics?q=${encodeURIComponent(t.keyword)}`)}>
                                                {t.keyword}
                                            </h3>
                                        </div>
                                        {i < 3 && (
                                            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-green-400 bg-green-500/10 px-3 py-1 rounded-full w-fit">
                                                <Activity size={12} />
                                                최근 1시간 내 450% 급상승
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrendsPage;
