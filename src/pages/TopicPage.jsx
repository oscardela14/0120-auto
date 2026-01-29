import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Youtube, Instagram, ArrowRight, ArrowLeft, Zap, TrendingUp, Lightbulb, Search, Hash, Command, Sparkles, Play, PenTool, MessageSquare, Plus, Trash2, Type, ChevronRight, X, Loader2, Activity, Signal, Palette, Clock, Split, CheckCircle2, MessageCircle, DollarSign, Crown, Globe, Radar, UserCog, Bot, Film, BookOpen } from 'lucide-react';
import { useOutletContext, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { TrendPageSEO } from '../components/SEOHead';
import { fetchRealtimeTrends, getTrendUpdateInfo, getRandomTrends } from '../utils/realtimeTrends';
import { generateContent, PERSONAS } from '../utils/contentGenerator';


import { cn } from '../lib/utils';
import { analyzeAlgorithmIntelligence } from '../lib/gemini';
import { EvolutionaryLoop } from '../components/EvolutionaryLoop';

// --- Topic Discovery & Generation Page ---

const ExpertTooltip = ({ children, content }) => {
    return (
        <div className="relative group/tooltip cursor-help w-full h-full">
            {children}
            <div className="absolute opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-64 p-4 bg-[#0f111a] border border-indigo-500/30 rounded-2xl shadow-2xl pointer-events-none z-[200]">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/30">
                        <Bot size={16} className="text-indigo-400" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-indigo-400 uppercase mb-1 tracking-wider">Expert Insight</div>
                        <p className="text-[11px] text-gray-300 leading-relaxed font-bold text-left word-keep">
                            {content}
                        </p>
                    </div>
                </div>
                {/* Arrow */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#0f111a] border-b border-r border-indigo-500/30 transform rotate-45"></div>
            </div>
        </div>
    );
};

export const TopicPage = () => {
    const navigate = useNavigate();
    const [generatedResult, setGeneratedResult] = useState(null);
    const [isDrafting, setIsDrafting] = useState(false);
    const [composerData, setComposerData] = useState(null);
    const [isEvolutionOpen, setIsEvolutionOpen] = useState(false);

    // Platform State Sync
    const {
        user,
        isAuthenticated,
        addToHistory,
        incrementUsage,
        canGenerateContent,
        addNotification,
        activeResult,
        setActiveResult,
        activePlatform,
        setActivePlatform
    } = useUser();

    const { onRequireAuth } = useOutletContext() || { onRequireAuth: () => console.log("Auth required") };
    const location = useLocation();

    // Helper to generate dynamic stats based on rank and volume
    const getTrendStats = (rank, vol) => {
        const baseVol = parseInt(vol?.replace(/[^0-9]/g, '') || '100');
        const projectedViews = Math.floor(baseVol * (1.5 - (rank * 0.05)) * 1000);
        const estRevenue = Math.floor(projectedViews * 0.005); // 0.5% conversion assumed
        return {
            views: projectedViews.toLocaleString(),
            revenue: estRevenue.toLocaleString()
        };
    };

    const [mode, setMode] = useState('text'); // 'text' or 'categories'
    const [query, setQuery] = useState('');
    const [selectedPlatform, setSelectedPlatform] = useState('YouTube Shorts');
    const [selectedPersona, setSelectedPersona] = useState('witty');
    const [isGenerating, setIsGenerating] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [isAnalysisScraping, setIsAnalysisScraping] = useState(false);
    const [scrapingResult, setScrapingResult] = useState(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [showGenerateTooltip, setShowGenerateTooltip] = useState(false);
    const [filter, setFilter] = useState('ALL');
    const [selectedTab, setSelectedTab] = useState('YouTube Shorts');
    const [loadingKeywords, setLoadingKeywords] = useState(new Set());
    const [approvedKeywords, setApprovedKeywords] = useState(new Set());

    // URL Query Sync
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get('q');
        if (q) setQuery(q);
    }, [location.search]);

    // Swarm Intelligence Sync: Handle incoming signals from Dashboard
    useEffect(() => {
        if (activeResult?.isFromSwarm && activeResult?.topic) {
            setQuery(activeResult.topic);
            addNotification(`전략적 에이전트가 포착한 시그널('${activeResult.topic}')을 로드했습니다.`, "info");
        }
    }, [activeResult]);

    // [UI UX] Handle scroll locking when report is open
    useEffect(() => {
        if (scrapingResult) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [scrapingResult]);

    // (Logic below uses local states 'selectedPlatform' and 'filter' instead of derived global ones)

    const [trends, setTrends] = useState([]);
    const [isLoadingTrends, setIsLoadingTrends] = useState(true);
    const [trendInfo, setTrendInfo] = useState(getTrendUpdateInfo());

    useEffect(() => {
        const timer = setInterval(() => {
            setTrendInfo(getTrendUpdateInfo());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const loadTrends = async () => {
            setIsLoadingTrends(true);
            try {
                const data = await fetchRealtimeTrends();
                setTrends(data);
            } catch (e) {
                console.error("Failed to load trends", e);
                setTrends(getRandomTrends(10));
            } finally {
                setIsLoadingTrends(false);
            }
        };
        loadTrends();
    }, []);



    const handleInputChange = (e) => {
        setQuery(e.target.value);
        if (e.target.value.length > 2) {
            setSuggestions([
                `${e.target.value} 초보자 가이드`,
                `${e.target.value}의 숨겨진 비밀 Top 5`,
                `${e.target.value} vs 경쟁사 비교`,
                `왜 지금 ${e.target.value} 인가 ? `
            ]);
        } else {
            setSuggestions([]);
        }
    };

    const handleGenerate = async (topic) => {
        console.log('[DEBUG] handleGenerate called with topic:', topic);

        if (!isAuthenticated) {
            onRequireAuth();
            return;
        }

        if (!canGenerateContent()) {
            addNotification("이번 달 생성 횟수를 모두 사용하셨습니다. 플랜을 업그레이드 해주세요.", "error");
            return;
        }

        setIsGenerating(true);
        addNotification(`🚀 '${topic}' 전 플랫폼 콘텐츠 동시 생성 중...`, "info");

        try {
            const platforms = ['YouTube Shorts', 'Instagram', 'Naver Blog', 'Threads'];

            console.log('[DEBUG] Generating content for platforms:', platforms);

            // Generate content for all platforms in parallel
            const results = await Promise.all(
                platforms.map(async (platform) => {
                    try {
                        console.log(`[DEBUG] Generating content for ${platform}...`);
                        const content = await generateContent(platform, topic, selectedPersona);
                        console.log(`[DEBUG] Generated content for ${platform}:`, content);
                        return { platform, content };
                    } catch (err) {
                        console.error(`Failed to generate for ${platform}:`, err);
                        return { platform, content: null };
                    }
                })
            );

            console.log('[DEBUG] All generation results:', results);

            // Create a multi-platform result object
            const multiPlatformResult = {
                topic,
                id: Date.now() + Math.random(),
                isMasterBlueprint: true,
                isMultiPlatform: true,
                platforms: {}
            };

            // Organize results by platform
            for (const { platform, content } of results) {
                if (content) {
                    multiPlatformResult.platforms[platform] = content;
                }
            }

            console.log('[DEBUG] Final multiPlatformResult:', multiPlatformResult);
            console.log('[DEBUG] Number of platforms generated:', Object.keys(multiPlatformResult.platforms).length);

            setGeneratedResult(multiPlatformResult);
            addToHistory(multiPlatformResult);
            incrementUsage();
            addNotification(`✅ 모든 플랫폼 콘텐츠가 생성되었습니다. 실험실로 이동합니다.`, "success");

            // Navigate to Test Lab with the results
            navigate('/test', {
                state: {
                    multiPlatformResult: multiPlatformResult,
                    selectedPlatform: 'YouTube Shorts' // Default view
                }
            });
        } catch (error) {
            console.error('[ERROR] handleGenerate failed:', error);
            addNotification("엔진 가동 중 오류가 발생했습니다.", "error");
        } finally {
            setIsGenerating(false);
        }
    };

    // [New Feature] One-Stop Publishing for TopTrends
    const handleOneStopPublish = async (topic, e) => {
        if (e) e.stopPropagation();

        if (approvedKeywords.has(topic)) {
            addNotification("이미 승인된 항목입니다. 보관함을 확인해주세요.", "info");
            return;
        }

        if (!isAuthenticated) return onRequireAuth();
        if (!canGenerateContent()) return addNotification("크레딧이 부족합니다.", "error");

        setLoadingKeywords(prev => {
            const next = new Set(prev);
            next.add(topic);
            return next;
        });

        addNotification(`👑 '${topic}' 최종 승인 확인! 4대 플랫폼 동시 발행 프로세스를 가동합니다...`, "info");

        const platforms = ['YouTube Shorts', 'Instagram Reels', 'Naver Blog', 'Threads'];
        let successCount = 0;

        try {
            // Parallel Processing for Speed
            const promises = platforms.map(platform => generateContent(platform, topic, selectedPersona));
            const results = await Promise.all(promises);

            const historyPromises = results
                .filter(result => result !== null)
                .map(result => addToHistory({
                    ...result,
                    id: Date.now() + Math.random(),
                    isOneStop: true,
                    originPlatform: result.platform
                }));

            await Promise.all(historyPromises);
            successCount = results.filter(r => r !== null).length;

            await incrementUsage();

            if (successCount > 0) {
                addNotification(`✅ [${topic}] 관련 ${successCount}개 채널 콘텐츠가 모두 생성되어 보관함에 전송되었습니다.`, "success");
                setApprovedKeywords(prev => {
                    const next = new Set(prev);
                    next.add(topic);
                    return next;
                });
            } else {
                addNotification("일괄 생성에 실패했습니다.", "error");
            }
        } catch (error) {
            console.error("OneStop Error", error);
            addNotification("승인 처리 중 오류가 발생했습니다.", "error");
        } finally {
            setLoadingKeywords(prev => {
                const next = new Set(prev);
                next.delete(topic);
                return next;
            });
        }
    };

    const handleDeepScrape = async (topic) => {
        if (!topic) return;
        setIsAnalysisScraping(true);
        addNotification(`🎯 '${topic}' 알고리즘 경쟁 환경을 정밀 스캔 중입니다...`, "info");

        try {
            // [NEW] Call Real AI analysis instead of simulation
            const aiRecon = await analyzeAlgorithmIntelligence(topic, selectedPlatform);

            if (aiRecon) {
                const liveResult = {
                    ...aiRecon,
                    keyword: topic,
                    competitors: [
                        { title: "타겟 알고리즘 점유 데이터", score: parseFloat(aiRecon.liveScore) },
                        { title: "평균 알고리즘 밀도", score: (parseFloat(aiRecon.liveScore) - 1.2).toFixed(1) }
                    ]
                };

                const finalResult = {
                    ...liveResult,
                    title: `[ALGO REPORT] ${topic}`,
                    type: 'REPORT',
                    isScoutContent: true,
                    createdAt: new Date().toISOString()
                };

                setScrapingResult(finalResult);
                addToHistory(finalResult);
                // Remove activeResult/generatedResult set to stay on this page
                setQuery(topic);
                addNotification("심층 AI 분석 완료! 아래 리포트를 확인하세요.", "success");
            } else {
                throw new Error("AI Analysis returned null");
            }
        } catch (error) {
            console.error("DeepScrape AI error, falling back to heuristic:", error);

            // Heuristic Fallback
            const hash = topic.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const isLongTopic = topic.length > 5;
            const avgChars = 1400 + (hash % 800) + (isLongTopic ? 300 : 0);
            const avgImages = 6 + (hash % 12);
            const keyFrequency = 4 + (hash % 7);
            const liveScore = (94 + (hash % 5.8)).toFixed(1);

            const liveResult = {
                keyword: topic,
                avgChars: avgChars,
                avgImages: avgImages,
                keyFrequency: keyFrequency,
                strategies: [
                    { type: "SEMANTIC", text: "시맨틱 최적화 프로토콜: 단순 반복을 지양하고 LSI 유의어 배치로 신뢰 지수를 선점하십시오." },
                    { type: "STRUCTURE", text: "가독성 최적화 역습: 경쟁 데이터의 모바일 가시성이 낮습니다. 고밀도 분단 구조로 점유율을 탈환하십시오." },
                    { type: "ENGAGEMENT", text: "상호작용 유도: 본문 하단에 알고리즘 트리거용 CTA(질문/의견 유도)를 정밀 배치하십시오." }
                ],
                liveScore: liveScore,
                competitors: [
                    { title: "타겟 알고리즘 점유 데이터", score: parseFloat(liveScore) + 0.2 },
                    { title: "평균 알고리즘 밀도", score: parseFloat(liveScore) - 1.5 }
                ]
            };
            setScrapingResult(liveResult);
            addNotification("분석 완료 (예측 엔진 가동)", "success");
        } finally {
            setIsAnalysisScraping(false);
        }
    };

    const handleFinalGeneration = async (finalData) => {
        setIsGenerating(true);
        setIsDrafting(false);
        try {
            // Main AI Generation baseline
            const aiResult = await generateContent(finalData.platform, finalData.topic, finalData.persona);

            // Hybrid Smart Merge Logic
            // Check if user has provided content OR used AI Suggest
            const hasDraftContent = finalData.drafts.some(d => (d.text || d.content || '').trim().length > 0);

            let finalMergedResult;

            if (hasDraftContent) {
                // [Scenario 2] User Edited or used AI Suggest -> Prioritize editor content
                console.log("[SmartMerge] Applying user modifications to result baseline");

                const isBlog = finalData.platform.includes('Blog');
                const isShorts = finalData.platform.includes('Shorts') || finalData.platform.includes('Reels');
                const isThreads = finalData.platform.includes('Threads');

                finalMergedResult = {
                    ...aiResult,
                    topic: finalData.topic,
                    platform: finalData.platform,
                    title: finalData.title,
                    // If video, use drafts as script and clear sections
                    script: isShorts ? finalData.drafts : null,
                    // If blog, use drafts as sections and clear script
                    sections: isBlog ? finalData.drafts : null,
                    // Sync 'content' string for blog preview consistency
                    content: isBlog
                        ? finalData.drafts.map(s => `< h3 > ${s.title}</h3 > <p>${s.content}</p>`).join('\n\n')
                        : (isThreads ? finalData.drafts.map(d => d.content).join('\n\n') : aiResult.content),
                    threadPosts: isThreads ? finalData.drafts.map(d => ({ text: d.content })) : null
                };

                addNotification("편집된 내용을 기반으로 콘텐츠가 완성되었습니다.", "success");
            } else {
                // [Scenario 1] User skipped editing -> Full AI generation
                console.log("[SmartMerge] Using full AI generation (no user edits detected)");
                finalMergedResult = {
                    ...aiResult,
                    topic: finalData.topic,
                    platform: finalData.platform
                };
                addNotification("AI가 분석한 최적의 콘텐츠를 생성했습니다.", "success");
            }

            await addToHistory(finalMergedResult);
            await incrementUsage();
            setActiveResult(finalMergedResult);
            setGeneratedResult(finalMergedResult);
        } catch (error) {
            console.error("Generation failed:", error);
            addNotification("콘텐츠 생성 중 오류가 발생했습니다.", "error");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAiSuggest = async () => {
        if (!composerData) return;
        setIsGenerating(true);
        try {
            const aiResult = await generateContent(composerData.platform, composerData.topic, composerData.persona);

            setComposerData(prev => ({
                ...prev,
                title: aiResult.title,
                drafts: aiResult.platform === 'Naver Blog'
                    ? aiResult.sections
                    : aiResult.platform === 'Threads'
                        ? aiResult.script.map(s => ({ content: s.text }))
                        : aiResult.script
            }));
            addNotification("AI가 플랫폼 최적화 초안을 작성했습니다.", "success");
        } catch (error) {
            console.error("AI Suggest failed:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAutoDraftAndReflect = async (topic) => {
        if (!isAuthenticated) {
            onRequireAuth();
            return;
        }
        setIsGenerating(true);
        try {
            // Single-step: Generate + Reflect
            const aiResult = await generateContent(selectedPlatform, topic, selectedPersona);

            // Transform for History/ResultView
            const finalResult = {
                ...aiResult,
                topic: topic,
                platform: selectedPlatform
            };

            await addToHistory(finalResult);
            await incrementUsage();
            setActiveResult(finalResult);
            setGeneratedResult(finalResult);
            addNotification("AI 초안이 즉시 반영되었습니다.", "success");
        } catch (error) {
            console.error("Auto Reflect failed:", error);
            addNotification("초안 생성 중 오류가 발생했습니다.", "error");
        } finally {
            setIsGenerating(false);
        }
    };

    const categories = [
        "테크/가전", "뷰티/패션", "푸드/요리", "여행/브이로그",
        "교육/꿀팁", "금융/재테크", "건강/운동", "게임",
        "동기부여", "반려동물"
    ];

    const platforms = [
        { id: 'Instagram Reels', icon: Instagram, color: 'text-pink-500', activeBg: 'bg-pink-600', glow: 'shadow-pink-500/50', border: 'border-pink-500/50' },
        { id: 'YouTube Shorts', icon: Youtube, color: 'text-red-500', activeBg: 'bg-red-600', glow: 'shadow-red-500/50', border: 'border-red-500/50' },
        { id: 'Naver Blog', icon: 'N', color: 'text-green-500', activeBg: 'bg-green-600', glow: 'shadow-green-500/50', border: 'border-green-500/50' },
        { id: 'Threads', icon: 'T', color: 'text-white', activeBg: 'bg-neutral-800', glow: 'shadow-white/50', border: 'border-white/50' }
    ];

    const resultToShow = generatedResult || activeResult;

    if (isGenerating) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse-slow"></div>
                </div>
                <div className="relative z-10">
                    <motion.div
                        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                        transition={{ rotate: { duration: 2, repeat: Infinity, ease: "linear" }, scale: { duration: 1.5, repeat: Infinity } }}
                        className="mb-8 relative"
                    >
                        <div className="absolute inset-0 bg-primary blur-xl opacity-50"></div>
                        <div className="w-20 h-20 border-4 border-primary border-t-white rounded-full relative z-10" />
                    </motion.div>
                    <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">AI 분석 엔진 가동 중...</h3>
                    <p className="text-indigo-300 font-medium">{selectedPlatform} 트렌드 데이터를 처리하고 있습니다.</p>
                </div>
            </div>
        );
    }

    const handleEvolutionApply = (winningContent) => {
        setQuery(winningContent);
        setIsEvolutionOpen(false);
    };

    return (
        <>
            <TrendPageSEO />
            {/* Immersive Background */}
            <div className="min-h-screen w-full relative overflow-hidden bg-[#050508] p-2 md:p-4">
                {/* Nebula Effects */}
                <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-indigo-900/10 blur-[150px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-screen"></div>
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-900/10 blur-[120px] rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none mix-blend-screen"></div>
                <div className="absolute top-1/2 left-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent -translate-y-1/2 pointer-events-none"></div>

                <div className="max-w-[1440px] mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">

                        {/* LEFT PANEL: Settings (Fixed/Floating) */}
                        <div className="lg:col-span-3 flex flex-col gap-5 h-full overflow-y-auto no-scrollbar pb-10">
                            {/* Main Control Panel */}
                            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 flex flex-col gap-6 shadow-2xl">

                                {/* DEEP DISCOVERY RECON PANEL (The User's Command Center) */}
                                <div className="flex flex-col gap-6">
                                    <div className="mb-2">
                                        <div className="flex items-start justify-between">
                                            <h2 className="text-xl font-black text-white mb-2 tracking-tight">
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Strategic Content<br />Intelligence</span>
                                            </h2>
                                            <button
                                                onClick={() => setIsEvolutionOpen(true)}
                                                className="p-3 -mr-2 text-pink-500 hover:bg-pink-500/10 rounded-full transition-colors relative group/evo"
                                                title="Evolutionary Loop (Secret)"
                                            >
                                                <Sparkles size={24} />
                                                <div className="absolute inset-0 bg-pink-500/20 blur-xl rounded-full opacity-0 group-hover/evo:opacity-100 transition-opacity" />
                                            </button>
                                        </div>
                                        <p className="text-gray-500 text-xs font-medium leading-relaxed">
                                            키워드 입력만으로 알고리즘 구조를 정밀 분석하고,
                                            전 채널 통합 전략을 즉시 도출합니다.
                                        </p>
                                    </div>

                                    {/* Primary Command Input */}
                                    <div className="relative group/input">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-20 group-hover/input:opacity-40 transition duration-500"></div>
                                        <div className="relative bg-[#0a0a0c] border border-white/10 rounded-xl p-1 transition-all group-focus-within/input:border-indigo-500/50">
                                            <div className="flex items-center">
                                                <div className="pl-3 text-gray-500 shrink-0">
                                                    <Command size={18} />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={query}
                                                    onChange={handleInputChange}
                                                    placeholder="주제 키워드 입력..."
                                                    className="w-full h-12 bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none px-3 font-medium"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Command Grid */}
                                    <div className="grid grid-cols-1 gap-2.5">
                                        <div className="relative">
                                            <button
                                                onClick={() => {
                                                    if (!query) {
                                                        addNotification("주제 키워드를 입력해주세요.", "info");
                                                        return;
                                                    }
                                                    handleDeepScrape(query);
                                                }}
                                                disabled={isAnalysisScraping}
                                                className="w-full h-11 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group/recon active:scale-[0.98]"
                                            >
                                                {isAnalysisScraping ? (
                                                    <Loader2 size={16} className="animate-spin" />
                                                ) : (
                                                    <Signal size={16} className="group-hover/recon:animate-pulse" />
                                                )}
                                                <span className="text-sm">심층 분석 스크레이퍼</span>
                                            </button>

                                            <AnimatePresence>
                                                {showTooltip && (
                                                    <motion.div
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: 20 }}
                                                        className="absolute left-full ml-4 top-0 w-[220px] p-4 bg-[#0f111a]/98 backdrop-blur-3xl border border-indigo-500/30 rounded-2xl shadow-2xl z-[100] pointer-events-none"
                                                    >
                                                        <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                                                            실시간 알고리즘 분석을 통해 상위 노출 포스팅의 DNA를 해체합니다.
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => query && handleGenerate(query)}
                                                className="flex-1 h-11 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                                            >
                                                <PenTool size={14} />
                                                편집
                                            </button>
                                            <button
                                                onClick={() => query && handleGenerate(query)}
                                                className="flex-[1.5] h-11 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-black transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 active:scale-[0.98]"
                                            >
                                                즉시 반영
                                                <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* System Status Indicators (Micro) */}
                                    <div className="flex items-center justify-between px-1 py-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">Engine v4.0 Active</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter">Master Synced</span>
                                            <Globe size={10} className="text-indigo-400" />
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Discovery Tags (Moved from Main) */}
                                <div>
                                    <h3 className="text-sm font-black text-indigo-400/80 uppercase tracking-[0.2em] mb-4 stroke-text px-1 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                                        빠른 탐색 태그
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {categories.slice(0, 10).map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => handleGenerate(cat)}
                                                className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-indigo-500/10 border border-white/5 hover:border-indigo-500/30 text-sm font-bold text-gray-400 hover:text-indigo-300 transition-all flex items-center justify-center gap-1 active:scale-95"
                                            >
                                                <span className="opacity-50 text-xs">#</span>{cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Widgets */}
                            <div className="flex flex-col gap-4">


                                {/* Daily Quota */}
                                <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/5 rounded-3xl p-5 relative overflow-hidden group/quota">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/quota:opacity-20 transition-opacity">
                                        <Zap size={48} className="text-indigo-500" />
                                    </div>
                                    <h3 className="text-sm font-black text-indigo-400/80 uppercase tracking-[0.2em] mb-4 stroke-text flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                        SYSTEM QUOTA
                                    </h3>
                                    <div className="flex justify-between items-end mb-3">
                                        <div className="flex flex-col">
                                            <span className="text-2xl font-black text-white tracking-tighter">
                                                75<span className="text-sm text-indigo-400/60 font-medium ml-1">%</span>
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-gray-500 font-bold tracking-wider mb-1">1,500 / 2,000 UNIT</span>
                                    </div>
                                    <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden p-[1px] border border-white/5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: "75%" }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="h-full bg-gradient-to-r from-indigo-600 to-purple-500 rounded-full relative"
                                        >
                                            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-shimmer"></div>
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full blur-md opacity-50"></div>
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Pro Tip */}
                                <div className="bg-gradient-to-br from-amber-500/[0.07] via-transparent to-transparent border border-amber-500/10 rounded-3xl p-5 flex gap-4 items-start relative overflow-hidden group/tip">
                                    <div className="absolute inset-0 bg-amber-500/[0.02] opacity-0 group-hover/tip:opacity-100 transition-opacity"></div>
                                    <div className="p-2 bg-amber-500/20 rounded-xl text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                                        <Lightbulb size={18} className="shrink-0" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-black text-amber-500 uppercase tracking-widest leading-none">Intelligence Signal</span>
                                        <p className="text-xs text-amber-100/70 font-medium leading-relaxed mt-1">
                                            특정 시간대(18:00~22:00) 데이터를 활용하면 조회수 효율이 <span className="text-amber-400 font-bold">30% 증폭</span>됩니다.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT PANEL: Action Area */}
                        <div className="lg:col-span-9 flex flex-col h-full">

                            {/* Real-time Trend Grid (Premium Version) */}
                            <div className="w-full">
                                <header className="flex flex-col md:flex-row items-end justify-between mb-8 gap-6">
                                    <div>
                                        <h2 className="text-xl lg:text-3xl font-black text-white tracking-tight mb-2">
                                            실시간 <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">바이럴 트렌드</span>
                                        </h2>
                                        <p className="text-gray-400 font-medium text-xs flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                            {trendInfo.time} 기준 | {trendInfo.cycle}
                                        </p>
                                    </div>

                                    <div className="flex bg-black/40 p-2 rounded-3xl border border-white/5 backdrop-blur-md">
                                        {[
                                            { id: 'ALL', icon: <span className="text-xl font-black">ALL</span> }, // 所有图标占位符
                                            { id: '유튜브', icon: <Play size={32} className="text-red-500" />, label: '유튜브' },
                                            { id: '인스타', icon: <Instagram size={32} className="text-pink-500" />, label: '인스타' },
                                            { id: '네이버 블로그', icon: <span className="text-2xl font-black text-green-500">N</span>, label: '블로그' },
                                            { id: '스레드', icon: <span className="text-3xl font-black text-white">@</span>, label: '스레드' }
                                        ].map((cat) => (
                                            <button
                                                key={cat.id}
                                                onClick={() => setFilter(cat.id === 'ALL' ? 'ALL' : cat.id)}
                                                className={cn(
                                                    "w-20 h-20 flex items-center justify-center rounded-2xl transition-all relative group",
                                                    filter === (cat.id === 'ALL' ? 'ALL' : cat.id)
                                                        ? "bg-white/10 text-white shadow-inner"
                                                        : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                                                )}
                                                title={cat.label || "전체"}
                                            >
                                                {cat.icon}
                                            </button>
                                        ))}
                                    </div>
                                </header>

                                {/* [Premium Integration] Deep Analysis Results Area (Blinded Modal Style) */}
                                <AnimatePresence>
                                    {scrapingResult && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="fixed inset-0 z-[150] flex items-center justify-center p-4 lg:p-10"
                                        >
                                            {/* Blind/Backdrop Effect */}
                                            <motion.div
                                                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                                                animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
                                                exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                                                onClick={() => setScrapingResult(null)}
                                                className="absolute inset-0 bg-black/60 z-0"
                                            />

                                            <motion.div
                                                initial={{ scale: 0.9, y: 30, opacity: 0 }}
                                                animate={{ scale: 1, y: 0, opacity: 1 }}
                                                exit={{ scale: 0.9, y: 30, opacity: 0 }}
                                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                                className="relative z-10 w-full max-w-5xl max-h-[92vh] overflow-y-auto no-scrollbar bg-[#0b0e14]/98 backdrop-blur-3xl border border-indigo-500/20 rounded-[32px] shadow-[0_0_80px_rgba(99,102,241,0.2)]"
                                            >
                                                <div className="p-6 lg:p-10 relative overflow-hidden">
                                                    {/* Decorative background elements */}
                                                    <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                                                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                                                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                                                        <div className="flex items-center gap-6">
                                                            <div className="p-4 bg-indigo-600/20 rounded-[20px] text-indigo-400 border border-indigo-500/30">
                                                                <Activity size={28} />
                                                            </div>
                                                            <div>
                                                                <h3 className="text-2xl lg:text-4xl font-black text-white tracking-tight">알고리즘 심층 정찰 리포트</h3>
                                                                <div className="flex items-center gap-3 mt-1.5">
                                                                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] bg-indigo-500/10 px-3 py-0.5 rounded-full border border-indigo-500/20">Keyword: {scrapingResult.keyword}</span>
                                                                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] bg-emerald-500/10 px-3 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                                        Active Scanning
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => setScrapingResult(null)}
                                                            className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-gray-400 transition-all hover:text-white"
                                                        >
                                                            <X size={20} />
                                                        </button>
                                                    </div>

                                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 relative z-10">
                                                        {/* Primary Metrics (Score) */}
                                                        <div className="lg:col-span-5">
                                                            <ExpertTooltip content="현재 경쟁 콘텐츠들의 알고리즘 점유율을 분석한 지표입니다. 95점 이상일 경우, 상위 노출 확률이 매우 높습니다.">
                                                                <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-black/40 rounded-[32px] border border-white/5 relative overflow-hidden group">
                                                                    <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-6 relative z-10">Viral Density Score</span>
                                                                    <div className="relative w-40 h-40 flex items-center justify-center z-10">
                                                                        <svg className="w-full h-full transform -rotate-90 scale-110">
                                                                            <circle cx="80" cy="80" r="72" stroke="rgba(255,255,255,0.02)" strokeWidth="10" fill="transparent" />
                                                                            <motion.circle
                                                                                cx="80" cy="80" r="72"
                                                                                stroke="url(#viral_grad_mid)"
                                                                                strokeWidth="10"
                                                                                fill="transparent"
                                                                                strokeDasharray={452.4}
                                                                                initial={{ strokeDashoffset: 452.4 }}
                                                                                animate={{ strokeDashoffset: 452.4 - (452.4 * parseFloat(scrapingResult.liveScore) / 100) }}
                                                                                transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                                                                                strokeLinecap="round"
                                                                                className="drop-shadow-[0_0_20px_rgba(99,102,241,0.6)]"
                                                                            />
                                                                            <defs>
                                                                                <linearGradient id="viral_grad_mid" x1="0%" y1="0%" x2="100%" y2="100%">
                                                                                    <stop offset="0%" stopColor="#818cf8" />
                                                                                    <stop offset="100%" stopColor="#4f46e5" />
                                                                                </linearGradient>
                                                                            </defs>
                                                                        </svg>
                                                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                                            <motion.span
                                                                                initial={{ opacity: 0, scale: 0.5 }}
                                                                                animate={{ opacity: 1, scale: 1 }}
                                                                                transition={{ delay: 0.8 }}
                                                                                className="text-5xl font-black text-white tracking-tighter"
                                                                            >
                                                                                {scrapingResult.liveScore}
                                                                            </motion.span>
                                                                            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mt-1">Optimization level</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </ExpertTooltip>
                                                        </div>
                                                        {/* Expert AI Coaches Insights */}
                                                        <div className="lg:col-span-7">
                                                            <div className="md:col-span-2">
                                                                <ExpertTooltip content="현재 시장단가(RPC)가 가장 높은 키워드와 연계된 수익화 전략을 AI가 제안합니다.">
                                                                    <div className="h-full bg-indigo-500/5 p-6 rounded-[24px] border border-indigo-500/10 relative overflow-hidden group hover:bg-indigo-500/10 transition-all">
                                                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform duration-500 blur-[1px]">
                                                                            <Sparkles size={80} className="text-indigo-400" />
                                                                        </div>
                                                                        <div className="flex items-start gap-4 relative z-10">
                                                                            <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-2xl shrink-0 border-4 border-black/20">
                                                                                <UserCog size={24} />
                                                                            </div>
                                                                            <div>
                                                                                <div className="flex items-center gap-2 mb-2">
                                                                                    <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.2em]">Revenue Strategic Coaching</h4>
                                                                                    <div className="px-2 py-0.5 bg-indigo-500/20 rounded text-[8px] font-black text-indigo-300">EXPERT AI</div>
                                                                                </div>
                                                                                <p className="text-[14px] text-gray-200 font-bold leading-relaxed italic">
                                                                                    "{scrapingResult.strategies?.[0]?.text || '현재 알고리즘 경쟁이 매우 치열합니다. 정면 대결보다는 니치한 틈새 키워드로 우회하여 노출을 선점하는 전략을 추천합니다.'}"
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </ExpertTooltip>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Strategic Action Summary */}
                                                    <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                                                        {scrapingResult.strategies?.map((s, idx) => {
                                                            const expertComment = s.type.includes('VISUAL') ? "초반 3초 이탈률을 0%로 만드는 시각적 후킹 요소입니다." :
                                                                s.type.includes('STRUCTURE') ? "시청 지속 시간을 늘려 알고리즘 추천을 유도하는 스토리텔링 기법입니다." :
                                                                    s.type.includes('RETENTION') ? "시청 지속 시간을 늘려 알고리즘 추천을 유도하는 스토리텔링 기법입니다." :
                                                                        "댓글과 공유를 유도하여 바이럴 지수를 높이는 CTA 설계입니다.";

                                                            return (
                                                                <div key={idx} className="h-full">
                                                                    <ExpertTooltip content={expertComment}>
                                                                        <motion.div
                                                                            initial={{ opacity: 0, y: 20 }}
                                                                            animate={{ opacity: 1, y: 0 }}
                                                                            transition={{ delay: 1 + (idx * 0.1) }}
                                                                            className="bg-black/40 p-4 rounded-2xl border border-white/5 flex flex-col gap-2 relative group overflow-hidden hover:border-indigo-500/40 transition-all h-full"
                                                                        >
                                                                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
                                                                            <div className="flex items-center justify-between mb-1.5">
                                                                                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] px-2 py-0.5 bg-indigo-500/10 rounded-full border border-indigo-500/20">{s.type} PHASE</span>
                                                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                                                                            </div>
                                                                            <p className="text-[12px] text-gray-400 leading-relaxed font-bold tracking-tight line-clamp-3">{s.text}</p>
                                                                        </motion.div>
                                                                    </ExpertTooltip>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    <div className="mt-8 flex flex-col md:flex-row justify-center items-center gap-4 pb-2">
                                                        <motion.button
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: 1.5 }}
                                                            onClick={() => handleGenerate(scrapingResult.keyword)}
                                                            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-[20px] shadow-[0_20px_40px_rgba(79,70,229,0.3)] transition-all flex items-center gap-3 group active:scale-95 hover:-translate-y-1"
                                                        >
                                                            <Zap size={20} className="group-hover:animate-pulse fill-white" />
                                                            <span className="text-base">이 전략으로 원스탑 발행</span>
                                                        </motion.button>
                                                        <motion.button
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: 1.6 }}
                                                            onClick={() => navigate('/test', { state: { topic: scrapingResult.keyword } })}
                                                            className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-black rounded-[20px] transition-all flex items-center gap-3 group active:scale-95 hover:-translate-y-1"
                                                        >
                                                            <Activity size={20} className="text-indigo-400" />
                                                            <span className="text-base">TEST 실험실 정밀 분석</span>
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>


                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {isLoadingTrends ? (
                                        [...Array(20)].map((_, i) => (
                                            <div key={i} className="h-44 bg-white/5 rounded-[32px] animate-pulse border border-white/5"></div>
                                        ))
                                    ) : (
                                        (() => {
                                            let filteredTrends = [];
                                            if (filter === 'ALL') {
                                                const cats = ['유튜브', '인스타', '네이버 블로그', '스레드'];
                                                cats.forEach(c => {
                                                    const topFromCat = trends.filter(t => t.category === c)
                                                        .sort((a, b) => a.rank - b.rank)
                                                        .slice(0, 10);
                                                    filteredTrends.push(...topFromCat);
                                                });
                                                filteredTrends.sort((a, b) => a.rank - b.rank);
                                            } else {
                                                filteredTrends = trends.filter(t => t.category === filter)
                                                    .sort((a, b) => a.rank - b.rank)
                                                    .slice(0, 20);
                                            }

                                            return filteredTrends.map((t, i) => {
                                                let cardStyle = "bg-white/5 border-white/5 hover:border-white/20 text-gray-400 h-full min-h-[180px]";
                                                let rankStyle = "bg-white/10 text-gray-400";
                                                let glow = "";

                                                const stats = getTrendStats(t.rank, t.volume);
                                                const isPro = user?.plan && user.plan !== 'free';

                                                if (i === 0) {
                                                    cardStyle = "bg-gradient-to-br from-yellow-900/40 to-black border-yellow-500/40 hover:border-yellow-400/60 text-yellow-100 min-h-[180px]";
                                                    rankStyle = "bg-gradient-to-br from-yellow-300 to-amber-600 text-black shadow-lg shadow-yellow-500/30";
                                                    glow = "shadow-[0_0_50px_rgba(234,179,8,0.15)]";
                                                } else if (i === 1) {
                                                    cardStyle = "bg-gradient-to-br from-slate-800/60 to-black border-slate-400/40 hover:border-slate-300/60 text-slate-100 min-h-[180px]";
                                                    rankStyle = "bg-gradient-to-br from-slate-200 to-slate-500 text-black shadow-slate-500/30";
                                                } else if (i === 2) {
                                                    cardStyle = "bg-gradient-to-br from-orange-900/40 to-black border-orange-500/40 hover:border-orange-400/60 text-orange-100 min-h-[180px]";
                                                    rankStyle = "bg-gradient-to-br from-orange-300 to-red-600 text-black shadow-orange-500/30";
                                                }

                                                return (
                                                    <motion.div
                                                        key={t.keyword}
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: i * 0.03 }}
                                                        className={cn(
                                                            "relative px-5 py-5 rounded-[20px] border flex flex-col items-start text-left transition-all duration-500 group hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(0,0,0,0.5)] overflow-hidden",
                                                            cardStyle, glow
                                                        )}
                                                    >
                                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                                        {/* Platform Info & Action Area */}
                                                        <div className="flex justify-between items-center w-full relative z-10 mb-4">
                                                            <span className="text-[14px] font-black text-gray-500 uppercase tracking-widest">{t.category} / {t.volume}</span>
                                                            <div className="flex items-center gap-2">
                                                                {i < 3 && (
                                                                    <button
                                                                        disabled={loadingKeywords.has(t.keyword)}
                                                                        onClick={(e) => handleOneStopPublish(t.keyword, e)}
                                                                        className={cn(
                                                                            "h-7 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-lg transition-all active:scale-95 hover:-translate-y-0.5",
                                                                            approvedKeywords.has(t.keyword)
                                                                                ? "bg-slate-700 text-slate-300 cursor-default"
                                                                                : "bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/30"
                                                                        )}
                                                                        title="원스탑 최종 승인 (4개 채널 동시 발행)"
                                                                    >
                                                                        {loadingKeywords.has(t.keyword) ? (
                                                                            <Loader2 size={12} className="text-white animate-spin" />
                                                                        ) : approvedKeywords.has(t.keyword) ? (
                                                                            <CheckCircle2 size={12} className="text-emerald-400" />
                                                                        ) : (
                                                                            <CheckCircle2 size={12} className="text-white" />
                                                                        )}
                                                                        <span className="text-[10px] font-bold whitespace-nowrap">
                                                                            {loadingKeywords.has(t.keyword) ? "승인 중..." : approvedKeywords.has(t.keyword) ? "승인 완료" : "최종 승인"}
                                                                        </span>
                                                                    </button>
                                                                )}
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        navigate('/test', { state: { topic: t.keyword } });
                                                                    }}
                                                                    className={cn("w-7 h-7 rounded-lg flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100", isPro ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/30" : "bg-white/5 text-gray-500")}
                                                                    title="TEST 실험실로 즉시 이동"
                                                                >
                                                                    <Zap size={12} className={isPro ? "fill-white" : ""} />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Rank + Topic Title */}
                                                        <div className="relative z-10 flex items-center gap-3 w-full mb-4">
                                                            <div className={cn("w-8 h-8 rounded-[10px] flex items-center justify-center text-[10px] font-black shrink-0 shadow-inner", rankStyle)}>
                                                                {i + 1}
                                                            </div>
                                                            <h3 className="text-lg font-black text-white leading-tight whitespace-nowrap overflow-hidden text-ellipsis group-hover:text-indigo-400 transition-colors cursor-pointer flex-1" title={t.keyword} onClick={() => handleGenerate(t.keyword)}>
                                                                {t.keyword}
                                                            </h3>
                                                        </div>

                                                        <div className="relative z-10 w-full space-y-2 mb-4">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-[12px] text-gray-500 font-black uppercase">GOLDEN TIME 수익</span>
                                                                <div className={cn("flex items-center gap-1 transition-all", !isPro && "blur-[2px] opacity-40")}>
                                                                    <DollarSign size={12} className="text-emerald-500" />
                                                                    <span className="text-[14px] font-black text-emerald-400">월 {stats.revenue}원+</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-[12px] text-gray-500 font-black uppercase">예상 도달율</span>
                                                                <div className={cn("flex items-center gap-1 transition-all", !isPro && "blur-[2px] opacity-40")}>
                                                                    <TrendingUp size={12} className="text-indigo-400" />
                                                                    <span className="text-[14px] font-black text-indigo-300">{stats.views} view</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="relative z-10 flex items-center gap-2 text-[12px] font-black text-green-400/90 bg-green-500/10 px-3 py-1 rounded-full w-fit border border-green-500/20">
                                                            <Activity size={10} />
                                                            실시간 급상승
                                                        </div>
                                                    </motion.div>
                                                );
                                            });
                                        })()
                                    )}
                                </div>
                            </div >
                        </div >
                    </div >
                </div >
            </div >

            {/* Content Composer / Drafting Overlay */}
            < AnimatePresence >
                {isDrafting && composerData && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 lg:p-10"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-[#0f1115] border border-white/10 w-full max-w-5xl h-[85vh] rounded-[40px] shadow-[0_0_100px_rgba(79,70,229,0.2)] overflow-hidden flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl ${composerData.platform === 'YouTube Shorts' ? 'bg-[#FF0000]' :
                                        composerData.platform === 'Instagram Reels' ? 'bg-gradient-to-tr from-[#FFD600] via-[#FF0169] to-[#D300C5]' :
                                            composerData.platform === 'Naver Blog' ? 'bg-[#03C75A]' : 'bg-white/10'
                                        }`}>
                                        {composerData.platform === 'YouTube Shorts' ? <Play size={28} className="text-white fill-white ml-0.5" /> :
                                            composerData.platform === 'Instagram Reels' ? <Instagram size={28} className="text-white" /> :
                                                <span className="text-white font-black text-2xl">{composerData.platform === 'Naver Blog' ? 'N' : '@'}</span>}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-white flex items-center gap-2">
                                            {composerData.platform} <span className="text-gray-500 font-medium">콘텐츠 작성</span>
                                        </h2>
                                        <p className="text-gray-500 text-sm font-medium">선택 주제: <span className="text-indigo-400">{composerData.topic}</span></p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsDrafting(false)}
                                    className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Editor Area */}
                            <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                    {/* Left: Metadata */}
                                    <div className="lg:col-span-1 space-y-8">
                                        <div className="space-y-4">
                                            <label className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                <Type size={14} /> 콘텐츠 제목 (Topic)
                                            </label>
                                            <input
                                                type="text"
                                                value={composerData.title}
                                                onChange={(e) => setComposerData({ ...composerData, title: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:border-indigo-500 transition-colors"
                                                placeholder="제목을 입력하세요"
                                            />
                                        </div>

                                        <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-5">
                                            <h4 className="text-xs font-bold text-indigo-300 mb-3 flex items-center gap-2">
                                                <Sparkles size={14} /> 작성 가이드
                                            </h4>
                                            <p className="text-[11px] text-gray-400 leading-relaxed mb-4">
                                                {composerData.platform === 'Naver Blog'
                                                    ? '블로그는 본문 중간중간 키워드를 자연스럽게 섞는 것이 중요합니다. 이미지가 들어갈 위치도 고려해보세요.'
                                                    : '릴스와 숏츠는 첫 3초의 훅(Hook)이 가장 중요합니다. 시청자의 관심을 끌 수 있는 대사를 작성하세요.'}
                                            </p>
                                            <button
                                                onClick={handleAiSuggest}
                                                disabled={isGenerating}
                                                className="w-full py-3 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                                            >
                                                {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                                                AI 초안으로 자동 채우기
                                            </button>
                                        </div>
                                    </div>

                                    {/* Right: Draft Editor */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                <PenTool size={14} /> {composerData.platform === 'Naver Blog' ? '본문 섹션 작성' : composerData.platform === 'Threads' ? '포스트 작성' : '대본 작성'}
                                            </label>
                                            <button
                                                onClick={() => {
                                                    const newDraft = composerData.platform === 'Naver Blog' ? { title: '새 섹션', content: '' } : composerData.platform === 'Threads' ? { content: '' } : { time: '0:00', text: '' };
                                                    setComposerData({ ...composerData, drafts: [...composerData.drafts, newDraft] });
                                                }}
                                                className="text-xs text-indigo-400 font-bold flex items-center gap-1 hover:text-indigo-300"
                                            >
                                                <Plus size={14} /> 추가하기
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            {composerData.drafts.map((draft, idx) => (
                                                <div key={idx} className="group relative">
                                                    <div className="bg-white/5 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all flex gap-4">
                                                        <div className="flex flex-col items-center gap-2 text-[10px] font-bold text-gray-600 pt-1">
                                                            {composerData.platform.includes('Blog') ? (
                                                                <input
                                                                    type="text"
                                                                    value={draft.title}
                                                                    onChange={(e) => {
                                                                        const newDrafts = [...composerData.drafts];
                                                                        newDrafts[idx].title = e.target.value;
                                                                        setComposerData({ ...composerData, drafts: newDrafts });
                                                                    }}
                                                                    className="w-14 bg-transparent border-b border-white/10 focus:outline-none focus:border-indigo-500 text-center"
                                                                />
                                                            ) : composerData.platform.includes('Threads') ? (
                                                                <span>post {idx + 1}</span>
                                                            ) : (
                                                                <input
                                                                    type="text"
                                                                    value={draft.time}
                                                                    onChange={(e) => {
                                                                        const newDrafts = [...composerData.drafts];
                                                                        newDrafts[idx].time = e.target.value;
                                                                        setComposerData({ ...composerData, drafts: newDrafts });
                                                                    }}
                                                                    className="w-12 bg-transparent border-b border-white/10 focus:outline-none focus:border-indigo-500 text-center"
                                                                />
                                                            )}
                                                        </div>
                                                        <textarea
                                                            rows={composerData.platform === 'Naver Blog' ? 4 : 2}
                                                            value={draft.text || draft.content}
                                                            onChange={(e) => {
                                                                const newDrafts = [...composerData.drafts];
                                                                if (composerData.platform === 'Naver Blog' || composerData.platform === 'Threads') {
                                                                    newDrafts[idx].content = e.target.value;
                                                                } else {
                                                                    newDrafts[idx].text = e.target.value;
                                                                }
                                                                setComposerData({ ...composerData, drafts: newDrafts });
                                                            }}
                                                            className="flex-1 bg-transparent text-gray-300 text-sm leading-relaxed focus:outline-none resize-none"
                                                            placeholder={composerData.platform === 'Naver Blog' ? "내용을 입력하세요..." : "대사를 입력하세요..."}
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                const newDrafts = composerData.drafts.filter((_, i) => i !== idx);
                                                                setComposerData({ ...composerData, drafts: newDrafts });
                                                            }}
                                                            className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-400 transition-all"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-8 border-t border-white/5 bg-black/40 flex items-center justify-between gap-3">
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleAiSuggest}
                                        disabled={isGenerating}
                                        className="px-4 py-3 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 border border-indigo-500/20"
                                    >
                                        <Zap size={14} /> AI 초안 자동 채우기
                                    </button>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setIsDrafting(false)}
                                        className="px-6 py-3 rounded-2xl text-gray-400 font-bold hover:text-white transition-all text-sm"
                                    >
                                        취소
                                    </button>
                                    <button
                                        onClick={() => handleFinalGeneration(composerData)}
                                        disabled={isGenerating}
                                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white font-black shadow-lg shadow-indigo-600/20 flex items-center gap-2 group/btn"
                                    >
                                        {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                                        최종 콘텐츠 반영하기
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence >

            <EvolutionaryLoop
                isOpen={isEvolutionOpen}
                onClose={() => setIsEvolutionOpen(false)}
                initialTopic={query || ""}
                onApply={handleEvolutionApply}
            />
        </>
    );
};

export default TopicPage;
