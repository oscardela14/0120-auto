import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Youtube, Instagram, ArrowRight, ArrowLeft, Zap, TrendingUp, Lightbulb, Search, Hash, Command, Sparkles, Play, PenTool, MessageSquare, Plus, Trash2, Type, ChevronRight, X, Loader2, Activity, Signal, Palette, Clock, Split, CheckCircle2, MessageCircle, DollarSign, Crown, Globe, Radar, UserCog, Bot, Film, BookOpen, LayoutGrid } from 'lucide-react';
import { useOutletContext, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { TrendPageSEO } from '../components/SEOHead';
import { fetchRealtimeTrends, getTrendUpdateInfo, getRandomTrends } from '../utils/realtimeTrends';
import { generateContent, PERSONAS } from '../utils/contentGenerator';


import { cn } from '../lib/utils';
import { analyzeAlgorithmIntelligence } from '../lib/gemini';
import { EvolutionaryLoop } from '../components/EvolutionaryLoop';
import { reconRivals } from '../lib/cerebras';

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
    const [isRivalMode, setIsRivalMode] = useState(false);
    const [isMasterMode, setIsMasterMode] = useState(false);
    const [rivalInput, setRivalInput] = useState('');

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
            addNotification(`?�략???�이?�트가 ?�착???�그??'${activeResult.topic}')??로드?�습?�다.`, "info");
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
                `${e.target.value} 초보??가?�드`,
                `${e.target.value}???�겨�?비�? Top 5`,
                `${e.target.value} vs 경쟁??비교`,
                `??지�?${e.target.value} ?��? ? `
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
            addNotification("?�번 ???�성 ?�수�?모두 ?�용?�셨?�니?? ?�랜???�그?�이???�주?�요.", "error");
            return;
        }

        setIsGenerating(true);
        addNotification(`?? '${topic}' ???�랫??콘텐�??�시 ?�성 �?..`, "info");

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
            addNotification(`??모든 ?�랫??콘텐츠�? ?�성?�었?�니?? ?�험?�로 ?�동?�니??`, "success");

            // Navigate to Test Lab with the results
            navigate('/test', {
                state: {
                    multiPlatformResult: multiPlatformResult,
                    selectedPlatform: 'YouTube Shorts' // Default view
                }
            });
        } catch (error) {
            console.error('[ERROR] handleGenerate failed:', error);
            addNotification("?�진 가??�??�류가 발생?�습?�다.", "error");
        } finally {
            setIsGenerating(false);
        }
    };

    // [New Feature] One-Stop Publishing for TopTrends
    const handleOneStopPublish = async (topic, e) => {
        if (e) e.stopPropagation();

        if (approvedKeywords.has(topic)) {
            addNotification("?��? ?�인????��?�니?? 보�??�을 ?�인?�주?�요.", "info");
            return;
        }

        if (!isAuthenticated) return onRequireAuth();
        if (!canGenerateContent()) return addNotification("?�레?�이 부족합?�다.", "error");

        setLoadingKeywords(prev => {
            const next = new Set(prev);
            next.add(topic);
            return next;
        });

        addNotification(`?�� '${topic}' 최종 ?�인 ?�인! 4?� ?�랫???�시 발행 ?�로?�스�?가?�합?�다...`, "info");

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
                addNotification(`??[${topic}] 관??${successCount}�?채널 콘텐츠�? 모두 ?�성?�어 보�??�에 ?�송?�었?�니??`, "success");
                setApprovedKeywords(prev => {
                    const next = new Set(prev);
                    next.add(topic);
                    return next;
                });
            } else {
                addNotification("?�괄 ?�성???�패?�습?�다.", "error");
            }
        } catch (error) {
            console.error("OneStop Error", error);
            addNotification("?�인 처리 �??�류가 발생?�습?�다.", "error");
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
        addNotification(`?�� '${topic}' ?�고리즘 경쟁 ?�경???��? ?�캔 중입?�다...`, "info");

        try {
            // [NEW] Call Real AI analysis instead of simulation
            const aiRecon = await analyzeAlgorithmIntelligence(topic, selectedPlatform);

            if (aiRecon) {
                const liveResult = {
                    ...aiRecon,
                    keyword: topic,
                    competitors: [
                        { title: "?��??�고리즘 ?�유 ?�이??, score: parseFloat(aiRecon.liveScore) },
                        { title: "?�균 ?�고리즘 밀??, score: (parseFloat(aiRecon.liveScore) - 1.2).toFixed(1) }
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
                setIsMasterMode(false);
                addToHistory(finalResult);
                // Remove activeResult/generatedResult set to stay on this page
                setQuery(topic);
                addNotification("?�층 AI 분석 ?�료! ?�래 리포?��? ?�인?�세??", "success");
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
                    { type: "SEMANTIC", text: "?�맨??최적???�로?�콜: ?�순 반복??지?�하�?LSI ?�의??배치�??�뢰 지?��? ?�점?�십?�오." },
                    { type: "STRUCTURE", text: "가?�성 최적????��: 경쟁 ?�이?�의 모바??가?�성????��?�다. 고�???분단 구조�??�유?�을 ?�환?�십?�오." },
                    { type: "ENGAGEMENT", text: "?�호?�용 ?�도: 본문 ?�단???�고리즘 ?�리거용 CTA(질문/?�견 ?�도)�??��? 배치?�십?�오." }
                ],
                liveScore: liveScore,
                competitors: [
                    { title: "?��??�고리즘 ?�유 ?�이??, score: parseFloat(liveScore) + 0.2 },
                    { title: "?�균 ?�고리즘 밀??, score: parseFloat(liveScore) - 1.5 }
                ]
            };
            setScrapingResult(liveResult);
            setIsMasterMode(false);
            addNotification("분석 ?�료 (?�측 ?�진 가??", "success");
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

                addNotification("?�집???�용??기반?�로 콘텐츠�? ?�성?�었?�니??", "success");
            } else {
                // [Scenario 1] User skipped editing -> Full AI generation
                console.log("[SmartMerge] Using full AI generation (no user edits detected)");
                finalMergedResult = {
                    ...aiResult,
                    topic: finalData.topic,
                    platform: finalData.platform
                };
                addNotification("AI가 분석??최적??콘텐츠�? ?�성?�습?�다.", "success");
            }

            await addToHistory(finalMergedResult);
            await incrementUsage();
            setActiveResult(finalMergedResult);
            setGeneratedResult(finalMergedResult);
        } catch (error) {
            console.error("Generation failed:", error);
            addNotification("콘텐�??�성 �??�류가 발생?�습?�다.", "error");
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
            addNotification("AI가 ?�랫??최적??초안???�성?�습?�다.", "success");
        } catch (error) {
            console.error("AI Suggest failed:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleRivalScout = async () => {
        if (!rivalInput) {
            addNotification("분석??경쟁??콘텐츠�? ?�력?�주?�요.", "info");
            return;
        }

        setIsGenerating(true);
        addNotification("?�� 경쟁???�이??DNA ?�체 �??�위 ?�환 ?�략 ?�립 �?..", "info");

        try {
            const result = await reconRivals(rivalInput);

            if (result) {
                // Ensure we have some content even if AI/Mock is sparse
                const finalResult = {
                    keyword: result.counter_content?.title || result.keyword || "경쟁???�점 분석",
                    originalContent: rivalInput.substring(0, 100) + "...",
                    weakness: result.weakness || "분석???�점??모호?�니?? 콘텐츠의 차별???�인?��? 부족한 것이 가?????�점?�니??",
                    counter_strategy: result.counter_strategy || "기존 콘텐츠보??고해?�도 ?�보?� 강력???�킹??결합???�위 ?�환 버전?�로 ?�작?�십?�오.",
                    counter_content: result.counter_content || { title: "?�위 ?�환 콘텐�?, hook: "경쟁?��? ?�상?��? 못한 ?�도??반전?�로 ?�작?�세??" },
                    liveScore: (result.liveScore || (88 + Math.random() * 8)).toFixed(1),
                    strategies: [
                        { type: "WEAKNESS_SCAN", text: result.weakness || "콘텐�?밀?��? ??�� ?�심 ?�구?�이 ?�릿?�여 경쟁?�이 부족합?�다." },
                        { type: "COUNTER_ATTACK", text: result.counter_strategy || "경쟁?�의 ?�점??'?�보???�음'??공략?�여 ?�층 ?�이?��? 가공한 콘텐츠로 ?��??�십?�오." },
                        { type: "KILLER_HOOK", text: result.counter_content?.hook || "3�??�에 경쟁?��? 말하지 ?��? '진짜 진실'????��?�며 ?�선???�도?�십?�오." }
                    ],
                    isRivalRecon: true,
                    type: 'REPORT'
                };

                setScrapingResult(finalResult);
                setIsMasterMode(false);
                setIsRivalMode(false);
                addNotification("???�찰 ?�료! ?��????�점??공략???�위 ?�환 ?�략???�립?�었?�니??", "success");
            } else {
                throw new Error("Rival Recon result is null");
            }
        } catch (error) {
            console.error("Rival Recon error:", error);
            addNotification("?�찰 ?�진 가??�??�류가 발생?�습?�다.", "error");
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
            addNotification("AI 초안??즉시 반영?�었?�니??", "success");
        } catch (error) {
            console.error("Auto Reflect failed:", error);
            addNotification("초안 ?�성 �??�류가 발생?�습?�다.", "error");
        } finally {
            setIsGenerating(false);
        }
    };

    const categories = [
        "?�크/가??, "뷰티/?�션", "?�드/?�리", "?�행/브이로그",
        "교육/꿀??, "금융/?�테??, "건강/?�동", "게임",
        "?�기부??, "반려?�물"
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
                    <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">AI 분석 ?�진 가??�?..</h3>
                    <p className="text-indigo-300 font-medium">{selectedPlatform} ?�렌???�이?��? 처리?�고 ?�습?�다.</p>
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
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">?�략 · 지?�형<br />콘텐�?/span>
                                            </h2>
                                            <div className="flex items-center gap-1 -mr-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => {
                                                        setIsMasterMode(!isMasterMode);
                                                        setIsRivalMode(false);
                                                    }}
                                                    className={cn(
                                                        "p-3 rounded-full transition-all relative group/master",
                                                        isMasterMode ? "bg-cyan-500/20 text-cyan-500" : "text-cyan-400 hover:bg-cyan-500/10"
                                                    )}
                                                    title="Strategic Master Hub (?��)"
                                                >
                                                    <span className="text-[22px] relative z-10">?��</span>
                                                    <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full opacity-0 group-hover/master:opacity-100 transition-opacity" />
                                                </motion.button>
                                            </div>
                                        </div>
                                        <p className="text-gray-500 text-xs font-medium leading-relaxed">
                                            ?�워???�력만으�??�고리즘 구조�??��? 분석?�고,
                                            ??채널 ?�합 ?�략??즉시 ?�출?�니??
                                        </p>
                                    </div>

                                    {/* Quick Search */}
                                    <div className="relative group/search">
                                        <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-2xl opacity-0 group-focus-within/search:opacity-100 transition-opacity pointer-events-none"></div>
                                        <input
                                            type="text"
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleDeepScrape(query)}
                                            placeholder="주제 ?�워?�로 ?�찰..."
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-gray-600 font-medium"
                                        />
                                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/search:text-indigo-400 transition-colors" />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-0 group-focus-within/search:opacity-100 transition-all translate-x-2 group-focus-within/search:translate-x-0">
                                            <span className="text-[10px] font-black text-indigo-500/50">ENTER</span>
                                        </div>
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
                                            ?�정 ?�간?�(18:00~22:00) ?�이?��? ?�용?�면 조회???�율??<span className="text-amber-400 font-bold">30% 증폭</span>?�니??
                                        </p>
                                    </div>
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
                                            ?�시�?<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">바이???�렌??/span>
                                        </h2>
                                        <p className="text-gray-400 font-medium text-xs flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                            {trendInfo.time} 기�? | {trendInfo.cycle}
                                        </p>
                                    </div>

                                    <div className="flex bg-black/40 p-2 rounded-3xl border border-white/5 backdrop-blur-md">
                                        {[
                                            { id: 'ALL', icon: <span className="text-xl font-black">ALL</span> }, // ?�?�图?�占位符
                                            { id: '?�튜�?, icon: <Play size={32} className="text-red-500" />, label: '?�튜�? },
                                            { id: '?�스?�', icon: <Instagram size={32} className="text-pink-500" />, label: '?�스?�' },
                                            { id: '?�이�?블로�?, icon: <span className="text-2xl font-black text-green-500">N</span>, label: '블로�? },
                                            { id: '?�레??, icon: <span className="text-3xl font-black text-white">@</span>, label: '?�레?? }
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
                                                title={cat.label || "?�체"}
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
                                            className="fixed inset-0 z-[180] flex items-center justify-center p-4 lg:p-10"
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
                                                            <div className={cn(
                                                                "p-4 rounded-[20px] border",
                                                                scrapingResult.isRivalRecon
                                                                    ? "bg-orange-600/20 text-orange-400 border-orange-500/30"
                                                                    : "bg-indigo-600/20 text-indigo-400 border-indigo-500/30"
                                                            )}>
                                                                {scrapingResult.isRivalRecon ? <Radar size={28} /> : <Activity size={28} />}
                                                            </div>
                                                            <div>
                                                                <h3 className="text-2xl lg:text-4xl font-black text-white tracking-tight">
                                                                    {scrapingResult.isRivalRecon ? "경쟁???�점 침투 리포?? : "?�고리즘 ?�층 ?�찰 리포??}
                                                                </h3>
                                                                <div className="flex items-center gap-3 mt-1.5">
                                                                    <span className={cn(
                                                                        "text-[10px] font-black uppercase tracking-[0.2em] px-3 py-0.5 rounded-full border",
                                                                        scrapingResult.isRivalRecon
                                                                            ? "text-orange-400 bg-orange-500/10 border-orange-500/20"
                                                                            : "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
                                                                    )}>Target: {scrapingResult.keyword}</span>
                                                                    <span className={cn(
                                                                        "text-[10px] font-black uppercase tracking-[0.2em] px-3 py-0.5 rounded-full border flex items-center gap-1.5",
                                                                        scrapingResult.isRivalRecon
                                                                            ? "text-red-400 bg-red-500/10 border-red-500/20"
                                                                            : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                                                                    )}>
                                                                        <div className={cn(
                                                                            "w-1.5 h-1.5 rounded-full animate-pulse",
                                                                            scrapingResult.isRivalRecon ? "bg-red-500" : "bg-emerald-500"
                                                                        )} />
                                                                        {scrapingResult.isRivalRecon ? "Infiltration Active" : "Active Scanning"}
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
                                                            <ExpertTooltip content="?�재 경쟁 콘텐츠들???�고리즘 ?�유?�을 분석??지?�입?�다. 95???�상??경우, ?�위 ?�출 ?�률??매우 ?�습?�다.">
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
                                                                <ExpertTooltip content="?�재 ?�장?��?(RPC)가 가???��? ?�워?��? ?�계???�익???�략??AI가 ?�안?�니??">
                                                                    <div className="h-full bg-indigo-500/5 p-6 rounded-[24px] border border-indigo-500/10 relative overflow-hidden group hover:bg-indigo-500/10 transition-all">
                                                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform duration-500 blur-[1px]">
                                                                            <Sparkles size={80} className="text-indigo-400" />
                                                                        </div>
                                                                        <div className="flex items-start gap-4 relative z-10">
                                                                             <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white shadow-2xl shrink-0 border-4 border-black/20", scrapingResult.isRivalRecon ? "bg-orange-600" : "bg-indigo-600")}>
                                                                                 {scrapingResult.isRivalRecon ? <Radar size={24} /> : <UserCog size={24} />}
                                                                             </div>
                                                                             <div>
                                                                                 <div className="flex items-center gap-2 mb-2">
                                                                                     <h4 className={cn("text-[11px] font-black uppercase tracking-[0.2em]", scrapingResult.isRivalRecon ? "text-orange-400" : "text-indigo-400")}>
                                                                                         {scrapingResult.isRivalRecon ? "Rival Vulnerability Analysis" : "Revenue Strategic Coaching"}
                                                                                     </h4>
                                                                                     <div className={cn("px-2 py-0.5 rounded text-[8px] font-black", scrapingResult.isRivalRecon ? "bg-orange-500/20 text-orange-300" : "bg-indigo-500/20 text-indigo-300")}>
                                                                                         {scrapingResult.isRivalRecon ? "SPY AI" : "EXPERT AI"}
                                                                                     </div>
                                                                                 </div>
                                                                                 <p className="text-[14px] text-gray-200 font-bold leading-relaxed italic">
                                                                                     "{scrapingResult.strategies?.[0]?.text || (scrapingResult.isRivalRecon ? '경쟁??콘텐츠의 ?�점??찾�? 못했?�니?? ?��?�??�위 ?�환 ?�략?� 준비되?�습?�다.' : '?�재 ?�고리즘 경쟁??매우 치열?�니?? ?�치???�워?�로 ?�회?�십?�오.')}"
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
                                                            const expertComment = s.type.includes('VISUAL') ? "초반 3�??�탈률을 0%�?만드???�각???�킹 ?�소?�니??" :
                                                                s.type.includes('STRUCTURE') ? "?�청 지???�간???�려 ?�고리즘 추천???�도?�는 ?�토리텔�?기법?�니??" :
                                                                    s.type.includes('RETENTION') ? "?�청 지???�간???�려 ?�고리즘 추천???�도?�는 ?�토리텔�?기법?�니??" :
                                                                        s.type.includes('WEAKNESS') ? "경쟁?��? ?�치�??�는 ?�심 결핍 지?�을 ?�이?�로 ?�출??결과?�니??" :
                                                                            s.type.includes('COUNTER') ? "?��???강점??무력?�하�??�리 콘텐츠로 ?�청?��? ?�입?�키????�� ?�략?�니??" :
                                                                                s.type.includes('HOOK') ? "경쟁?�보??2�???강력???�극?�로 ?�릭???�도?�는 고효???�킹?�니??" :
                                                                                    "?��?�?공유�??�도?�여 바이??지?��? ?�이???�계?�니??";

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
                                                            <span className="text-base">???�략?�로 ?�스??발행</span>
                                                        </motion.button>
                                                        <motion.button
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: 1.6 }}
                                                            onClick={() => navigate('/test', { state: { topic: scrapingResult.keyword } })}
                                                            className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-black rounded-[20px] transition-all flex items-center gap-3 group active:scale-95 hover:-translate-y-1"
                                                        >
                                                            <Activity size={20} className="text-indigo-400" />
                                                            <span className="text-base">TEST ?�험???��? 분석</span>
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
                                                const cats = ['?�튜�?, '?�스?�', '?�이�?블로�?, '?�레??];
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
                                                                        title="?�스??최종 ?�인 (4�?채널 ?�시 발행)"
                                                                    >
                                                                        {loadingKeywords.has(t.keyword) ? (
                                                                            <Loader2 size={12} className="text-white animate-spin" />
                                                                        ) : approvedKeywords.has(t.keyword) ? (
                                                                            <CheckCircle2 size={12} className="text-emerald-400" />
                                                                        ) : (
                                                                            <CheckCircle2 size={12} className="text-white" />
                                                                        )}
                                                                        <span className="text-[10px] font-bold whitespace-nowrap">
                                                                            {loadingKeywords.has(t.keyword) ? "?�인 �?.." : approvedKeywords.has(t.keyword) ? "?�인 ?�료" : "최종 ?�인"}
                                                                        </span>
                                                                    </button>
                                                                )}
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        navigate('/test', { state: { topic: t.keyword } });
                                                                    }}
                                                                    className={cn("w-7 h-7 rounded-lg flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100", isPro ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/30" : "bg-white/5 text-gray-500")}
                                                                    title="TEST ?�험?�로 즉시 ?�동"
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
                                                                <span className="text-[12px] text-gray-500 font-black uppercase">GOLDEN TIME ?�익</span>
                                                                <div className={cn("flex items-center gap-1 transition-all", !isPro && "blur-[2px] opacity-40")}>
                                                                    <DollarSign size={12} className="text-emerald-500" />
                                                                    <span className="text-[14px] font-black text-emerald-400">??{stats.revenue}??</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-[12px] text-gray-500 font-black uppercase">?�상 ?�달??/span>
                                                                <div className={cn("flex items-center gap-1 transition-all", !isPro && "blur-[2px] opacity-40")}>
                                                                    <TrendingUp size={12} className="text-indigo-400" />
                                                                    <span className="text-[14px] font-black text-indigo-300">{stats.views} view</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="relative z-10 flex items-center gap-2 text-[12px] font-black text-green-400/90 bg-green-500/10 px-3 py-1 rounded-full w-fit border border-green-500/20">
                                                            <Activity size={10} />
                                                            ?�시�?급상??
                                                        </div>
                                                    </motion.div>
                                                );
                                            });
                                        })()
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Strategic Master Hub Modal */}
            <AnimatePresence>
                {isMasterMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[160] bg-[#050508]/95 backdrop-blur-3xl flex items-center justify-center p-4 lg:p-10"
                        onKeyDown={(e) => e.key === 'Escape' && setIsMasterMode(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 30, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 30, opacity: 0 }}
                            className="relative w-full max-w-6xl h-fit max-h-[90vh] overflow-hidden bg-[#0a0a0f] border border-cyan-500/20 rounded-[48px] shadow-[0_0_120px_rgba(6,182,212,0.15)] flex flex-col"
                        >
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                            {/* Modal Header */}
                            <div className="p-8 lg:p-12 pb-6 flex justify-between items-start relative z-10">
                                <div>
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="p-3 bg-cyan-500/20 rounded-2xl border border-cyan-500/30 text-cyan-400">
                                            <LayoutGrid size={32} />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tighter">STRATEGIC MASTER HUB</h2>
                                            <p className="text-cyan-400 font-bold text-sm mt-1 uppercase tracking-[0.3em]">Advanced Multi-Input Intelligence System</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-500 font-medium max-w-xl">??가지 ?�심 분석 ?�구�??�시??가?�하???�도?�인 콘텐�??�략???�립?�십?�오.</p>
                                </div>
                                <button
                                    onClick={() => setIsMasterMode(false)}
                                    className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-gray-400 transition-all hover:text-white"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Modal Content: 3-Column Strategy Slots */}
                            <div className="px-8 lg:px-12 pb-12 overflow-y-auto no-scrollbar relative z-10">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-4">
                                    {/* SLOT 01: Deep Discovery */}
                                    <div className="flex flex-col gap-4 bg-white/5 p-8 rounded-[32px] border border-white/5 hover:border-indigo-500/30 transition-all group">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">Slot 01. Discovery</span>
                                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_#6366f1]" />
                                        </div>
                                        <h3 className="text-xl font-black text-white">?�고리즘 ?�층 ?�색</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed min-h-[40px]">?�하???�워?�의 ?�고리즘 ?�유?�과 ?�출 ?�심 공식???�캔?�니??</p>
                                        <div className="relative mt-2">
                                            <input
                                                type="text"
                                                value={query}
                                                onChange={(e) => setQuery(e.target.value)}
                                                placeholder="주제 ?�워???�력..."
                                                className="w-full h-14 bg-black/60 border border-white/10 rounded-2xl px-6 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-medium pr-14"
                                            />
                                            <button
                                                onClick={() => {
                                                    if (!query) return addNotification("?�워?��? ?�력?�주?�요.", "warning");
                                                    handleDeepScrape(query);
                                                }}
                                                className="absolute right-2 top-2 w-10 h-10 bg-indigo-600 hover:bg-indigo-500 rounded-xl flex items-center justify-center text-white transition-all shadow-lg active:scale-90"
                                            >
                                                <Search size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* SLOT 02: Rival Recon */}
                                    <div className="flex flex-col gap-4 bg-white/5 p-8 rounded-[32px] border border-white/5 hover:border-orange-500/30 transition-all group">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">Slot 02. Infiltration</span>
                                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_#f97316]" />
                                        </div>
                                        <h3 className="text-xl font-black text-white">경쟁???�이??DNA ?�체</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed min-h-[40px]">경쟁 ?�위 ?�점???�해 ?��????�점�??�위 ?�환 ?�략??분석?�니??</p>
                                        <div className="relative mt-2">
                                            <textarea
                                                value={rivalInput}
                                                onChange={(e) => setRivalInput(e.target.value)}
                                                placeholder="경쟁?�의 ?�튜�??�본이??블로�?글??복사???�으?�요."
                                                className="w-full h-32 bg-black/60 border border-white/10 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-orange-500 transition-all resize-none font-medium"
                                            />
                                            <button
                                                onClick={handleRivalScout}
                                                disabled={isGenerating}
                                                className="w-full h-12 mt-3 bg-orange-600 hover:bg-orange-500 disabled:bg-orange-600/50 text-white rounded-xl text-sm font-black transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Radar size={18} />}
                                                {isGenerating ? 'DNA ?�체 �?..' : '?�찰 ?�로?�스 기동'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* SLOT 03: Evolutionary Loop */}
                                    <div className="flex flex-col gap-4 bg-white/5 p-8 rounded-[32px] border border-white/5 hover:border-pink-500/30 transition-all group">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">Slot 03. Evolution</span>
                                            <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse shadow-[0_0_10px_#ec4899]" />
                                        </div>
                                        <h3 className="text-xl font-black text-white">?��? 진화 루프 가??/h3>
                                        <p className="text-sm text-gray-500 leading-relaxed min-h-[40px]">초�???AI 10?�가 ?�시 ?�력?�여 콘텐츠�? 극한?�로 진화?�킵?�다.</p>
                                        <div className="flex flex-col gap-3 mt-auto pt-4">
                                            <div className="p-4 bg-pink-500/5 border border-pink-500/10 rounded-2xl">
                                                <div className="flex items-center justify-between text-[10px] font-black text-pink-400 mb-2">
                                                    <span>ENGINE STATUS</span>
                                                    <span className="animate-pulse">ONLINE</span>
                                                </div>
                                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        animate={{ x: [-80, 80] }}
                                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                        className="w-20 h-full bg-pink-500 blur-[2px]"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setIsMasterMode(false);
                                                    setIsEvolutionOpen(true);
                                                }}
                                                className="w-full h-14 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-2xl text-sm font-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                                            >
                                                <Sparkles size={20} />
                                                ?�볼루션 ?�진 진입
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer Message */}
                            <div className="mx-8 lg:mx-12 mb-10 p-5 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                                    <Activity size={20} />
                                </div>
                                <p className="text-xs text-gray-400 font-bold leading-relaxed">
                                    마스???�브???�합 분석 기능???�용?�면 개별 채널???�어??<span className="text-cyan-400">??채널 ?�합 지�??�략</span>???�립?????�습?�다.
                                    ?�력???�료?�면 결과 리포?��? ?�해 최적??침투 경로�??�안받으??��??
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

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
                                            {composerData.platform} <span className="text-gray-500 font-medium">콘텐�??�성</span>
                                        </h2>
                                        <p className="text-gray-500 text-sm font-medium">?�택 주제: <span className="text-indigo-400">{composerData.topic}</span></p>
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
                                                <Type size={14} /> 콘텐�??�목 (Topic)
                                            </label>
                                            <input
                                                type="text"
                                                value={composerData.title}
                                                onChange={(e) => setComposerData({ ...composerData, title: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:border-indigo-500 transition-colors"
                                                placeholder="?�목???�력?�세??
                                            />
                                        </div>

                                        <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-5">
                                            <h4 className="text-xs font-bold text-indigo-300 mb-3 flex items-center gap-2">
                                                <Sparkles size={14} /> ?�성 가?�드
                                            </h4>
                                            <p className="text-[11px] text-gray-400 leading-relaxed mb-4">
                                                {composerData.platform === 'Naver Blog'
                                                    ? '블로그는 본문 중간중간 ?�워?��? ?�연?�럽�??�는 것이 중요?�니?? ?��?지가 ?�어�??�치??고려?�보?�요.'
                                                    : '릴스?� ?�츠??�?3초의 ??Hook)??가??중요?�니?? ?�청?�의 관?�을 ?????�는 ?�?��? ?�성?�세??'}
                                            </p>
                                            <button
                                                onClick={handleAiSuggest}
                                                disabled={isGenerating}
                                                className="w-full py-3 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                                            >
                                                {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                                                AI 초안?�로 ?�동 채우�?
                                            </button>
                                        </div>
                                    </div>

                                    {/* Right: Draft Editor */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                                                <PenTool size={14} /> ?�시�??�집 ?�역
                                            </h4>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] text-gray-500 font-bold uppercase">Auto-Save Active</span>
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {composerData.drafts.map((draft, idx) => (
                                                <div key={idx} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-indigo-500/30 transition-all group/editor">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-xs border border-indigo-500/20">
                                                                {idx + 1}
                                                            </div>
                                                            <input
                                                                type="text"
                                                                value={draft.title || draft.label || ''}
                                                                onChange={(e) => {
                                                                    const newDrafts = [...composerData.drafts];
                                                                    newDrafts[idx] = { ...newDrafts[idx], title: e.target.value, label: e.target.value };
                                                                    setComposerData({ ...composerData, drafts: newDrafts });
                                                                }}
                                                                placeholder="?�션 ?�목/?�벨"
                                                                className="bg-transparent text-sm font-black text-white focus:outline-none w-48"
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                const newDrafts = composerData.drafts.filter((_, i) => i !== idx);
                                                                setComposerData({ ...composerData, drafts: newDrafts });
                                                            }}
                                                            className="text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover/editor:opacity-100"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                    <textarea
                                                        value={draft.content || draft.text || ''}
                                                        onChange={(e) => {
                                                            const newDrafts = [...composerData.drafts];
                                                            if (composerData.platform === 'Naver Blog') {
                                                                newDrafts[idx] = { ...newDrafts[idx], content: e.target.value };
                                                            } else {
                                                                newDrafts[idx] = { ...newDrafts[idx], text: e.target.value };
                                                            }
                                                            setComposerData({ ...composerData, drafts: newDrafts });
                                                        }}
                                                        className="w-full h-32 bg-black/40 border border-white/5 rounded-xl p-4 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-all resize-none leading-relaxed font-medium"
                                                        placeholder="?�용???�력?�세??.."
                                                    />
                                                </div>
                                            ))}

                                            <button
                                                onClick={() => {
                                                    setComposerData({
                                                        ...composerData,
                                                        drafts: [...composerData.drafts, { title: '???�션', content: '', text: '' }]
                                                    });
                                                }}
                                                className="w-full py-4 border-2 border-dashed border-white/5 hover:border-indigo-500/30 rounded-2xl text-gray-500 hover:text-indigo-400 transition-all flex items-center justify-center gap-2 font-bold text-sm"
                                            >
                                                <Plus size={16} />
                                                ?�션 추�??�기
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-8 border-t border-white/5 bg-black/40 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Master Blueprint Synchronized</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setIsDrafting(false)}
                                        className="px-6 py-3 text-gray-500 hover:text-white font-bold transition-colors"
                                    >
                                        취소
                                    </button>
                                    <button
                                        onClick={() => handleFinalGeneration(composerData)}
                                        disabled={isGenerating}
                                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white font-black shadow-lg shadow-indigo-600/20 flex items-center gap-2 group/btn"
                                    >
                                        {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                                        최종 콘텐�?반영?�기
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            
                        </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
</AnimatePresence>

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
