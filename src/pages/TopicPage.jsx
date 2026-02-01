
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { TrendPageSEO } from '../components/SEOHead';
import { fetchRealtimeTrends, getTrendUpdateInfo, getRandomTrends } from '../utils/realtimeTrends';
import { TopicService } from '../services/TopicService';
import { EvolutionaryLoop } from '../components/EvolutionaryLoop';
import { useQuery, useMutation } from '@tanstack/react-query';

// Sub-components
import { StrategicMasterHub } from '../components/topic/StrategicMasterHub';
import { TopicDiscoverySide } from '../components/topic/sub/TopicDiscoverySide';
import { TrendGrid } from '../components/topic/sub/TrendGrid';
import { ScrapingResultModal } from '../components/topic/sub/ScrapingResultModal';

export const TopicPage = () => {
    const navigate = useNavigate();
    const {
        isAuthenticated,
        addToHistory,
        incrementUsage,
        canGenerateContent,
        addNotification,
        activeResult,
        setActiveResult
    } = useUser();

    const { onRequireAuth } = useOutletContext() || { onRequireAuth: () => console.log("Auth required") };

    // --- State ---
    const [query, setQuery] = useState('');
    const [selectedPersona] = useState('witty');
    const [isGenerating, setIsGenerating] = useState(false);
    const [scrapingResult, setScrapingResult] = useState(null);
    const [filter, setFilter] = useState('ALL');
    const [isMasterMode, setIsMasterMode] = useState(false);
    const [rivalInput, setRivalInput] = useState('');
    const [isEvolutionOpen, setIsEvolutionOpen] = useState(false);
    const [isDrafting, setIsDrafting] = useState(false);

    // --- Mutations ---
    const deepAnalysisMutation = useMutation({
        mutationFn: (kw) => TopicService.performDeepAnalysis(kw),
        onSuccess: async (result) => {
            setScrapingResult(result);
            await addToHistory(result);
            setActiveResult(result);
            addNotification("분석 리포트가 생성되었습니다.", "success");
        }
    });

    const rivalScoutMutation = useMutation({
        mutationFn: (input) => TopicService.scoutRival(input),
        onSuccess: (result) => {
            setScrapingResult({
                keyword: `Rival: ${rivalInput}`,
                liveScore: result.liveScore || "92",
                strategies: result.strategies,
                isRivalRecon: true,
                type: 'REPORT'
            });
            setIsMasterMode(false);
            addNotification("경쟁사 해체가 완료되었습니다.", "success");
        }
    });

    // --- Sync & Trends ---
    const { data: trends = [] } = useQuery({
        queryKey: ['realtimeTrends'],
        queryFn: fetchRealtimeTrends,
        initialData: () => getRandomTrends(10),
        refetchInterval: 5 * 60 * 1000
    });

    const [trendInfo, setTrendInfo] = useState(getTrendUpdateInfo());
    useEffect(() => {
        const timer = setInterval(() => setTrendInfo(getTrendUpdateInfo()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (activeResult?.isFromSwarm && activeResult?.topic) {
            setQuery(activeResult.topic);
        }
    }, [activeResult]);

    // --- Handlers ---
    const handleGenerate = async (topic) => {
        if (!isAuthenticated) return onRequireAuth();
        if (!canGenerateContent()) return addNotification("사용량을 모두 소모하셨습니다.", "error");

        setIsGenerating(true);
        try {
            const platforms = ['YouTube Shorts', 'Instagram', 'Naver Blog', 'Threads'];
            const results = await Promise.all(platforms.map(async (p) => {
                const content = await TopicService.generateContent(p, topic, selectedPersona);
                return { platform: p, content };
            }));

            const multiPlatformResult = {
                topic, id: Date.now() + Math.random(), createdAt: new Date().toISOString(),
                isMasterBlueprint: true, isMultiPlatform: true, platforms: {}
            };
            results.forEach(r => { if (r.content) multiPlatformResult.platforms[r.platform] = r.content; });

            await addToHistory(multiPlatformResult);
            incrementUsage();
            navigate('/test', { state: { multiPlatformResult } });
        } catch (error) {
            addNotification("생성 중 오류가 발생했습니다.", "error");
        } finally { setIsGenerating(false); }
    };

    const categories = ["테크/가전", "뷰티/패션", "푸드/요리", "여행/브이로그", "교육/꿀팁", "금융/재테크", "건강/운동", "게임", "동기부여", "반려동물"];

    if (isGenerating) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] text-center bg-black">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="mb-8 w-20 h-20 border-4 border-indigo-500 border-t-white rounded-full mx-auto" />
                <h3 className="text-3xl font-bold text-white mb-2">AI 엔진 가동 중...</h3>
                <p className="text-indigo-300">멀티 플랫폼 콘텐츠를 최적화하고 있습니다.</p>
            </div>
        );
    }

    return (
        <>
            <TrendPageSEO />
            <div className="min-h-screen w-full relative overflow-hidden bg-[#050508] p-2 md:p-4 text-left">
                <div className="max-w-[1440px] mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
                        <TopicDiscoverySide
                            query={query} setQuery={setQuery}
                            handleDeepScrape={(kw) => { if (!isAuthenticated) return onRequireAuth(); deepAnalysisMutation.mutate(kw || query); }}
                            isDeepAnalysisPending={deepAnalysisMutation.isPending}
                            setIsDrafting={setIsDrafting} handleGenerate={handleGenerate}
                            setIsMasterMode={setIsMasterMode} categories={categories}
                        />

                        <TrendGrid
                            trends={trends} filter={filter} setFilter={setFilter}
                            trendInfo={trendInfo} handleGenerate={handleGenerate}
                        />
                    </div>
                </div>
            </div>

            <StrategicMasterHub
                isOpen={isMasterMode} onClose={() => setIsMasterMode(false)}
                query={query} setQuery={setQuery} rivalInput={rivalInput} setRivalInput={setRivalInput}
                onDeepScrape={(kw) => deepAnalysisMutation.mutate(kw)}
                onRivalScout={() => rivalScoutMutation.mutate(rivalInput)}
                isAnalysisScraping={deepAnalysisMutation.isPending}
                isGenerating={rivalScoutMutation.isPending}
                onOpenEvolution={() => setIsEvolutionOpen(true)}
            />

            <ScrapingResultModal
                result={scrapingResult} onClose={() => setScrapingResult(null)}
                onGenerate={(kw) => { setScrapingResult(null); handleGenerate(kw); }}
            />

            <EvolutionaryLoop isOpen={isEvolutionOpen} onClose={() => setIsEvolutionOpen(false)} initialTopic={query} />
        </>
    );
};

export default TopicPage;
