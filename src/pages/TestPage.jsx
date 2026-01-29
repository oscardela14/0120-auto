import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, Split, TrendingUp, Hash, Target, Sparkles, BarChart3, CheckCircle2, AlertCircle, Youtube, Instagram, ArrowRight, MessageCircle, FileText, ChevronRight, Orbit, Loader } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { cn } from '../lib/utils';
import { useLocation } from 'react-router-dom';
import { PreviewModal } from '../components/PreviewModal';
import { generateContentWithCerebras, checkViralScore, callCerebras, professionalAudit } from '../lib/cerebras';
import { useDebounce } from '../hooks/useDebounce';
import { calculateRealSEOScore, getSmartSuggestions } from '../utils/seoAnalyzer';

const TestPage = () => {
    const { user, incrementUsage, addToHistory } = useUser();
    const location = useLocation();
    const [selectedPlatform, setSelectedPlatform] = useState('YouTube Shorts');
    const [multiResult, setMultiResult] = useState(null);
    const [testContent, setTestContent] = useState({
        title: '',
        drafts: [
            { time: '0:00', type: 'intro', text: '', visual: '' }
        ],
        hashtags: []
    });
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [aiFeedback, setAiFeedback] = useState(null);
    const [isCoachAnalyzing, setIsCoachAnalyzing] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [isRefining, setIsRefining] = useState(null); // variantId being refined

    // Debounce content changes for AI Coach
    const debouncedContent = useDebounce(
        testContent.title + " " + testContent.drafts.map(d => d.text).join(" "),
        1500
    );

    const [hasAutoStarted, setHasAutoStarted] = React.useState(false);

    React.useEffect(() => {
        if (location.state?.multiPlatformResult) {
            const { multiPlatformResult, selectedPlatform: targetPlatform } = location.state;
            console.log("[DEBUG] Received multiPlatformResult:", multiPlatformResult);
            setMultiResult(multiPlatformResult);
            const platformKey = targetPlatform || 'YouTube Shorts';
            setSelectedPlatform(platformKey);
            setHasAutoStarted(true);

            // Wait a tiny bit to ensure multiResult is set (though we pass result directly anyway)
            updateContentFromMulti(multiPlatformResult, platformKey);
        } else if (location.state?.topic) {
            console.log("[DEBUG] Received direct topic navigation:", location.state.topic);
            setTestContent(prev => ({
                ...prev,
                title: location.state.topic,
                drafts: [{ time: '0:00', type: 'intro', text: '', visual: '' }] // Clear previous content
            }));
        }
    }, [location.state]);

    // Auto-trigger AI generation if we arrive with ONLY a title (not multi-platform result)
    React.useEffect(() => {
        const autoTrigger = async () => {
            // Only trigger if we have a title, haven't started yet, and NOT coming with full results
            if (testContent.title && !hasAutoStarted && !location.state?.multiPlatformResult) {
                const isDraftEmpty = testContent.drafts.length <= 1 && !testContent.drafts[0]?.text;
                if (isDraftEmpty) {
                    console.log("[DEBUG] Auto-triggering AI generation for topic:", testContent.title);
                    setHasAutoStarted(true);
                    handleAIGenerate();
                }
            } else if (location.state?.multiPlatformResult && !hasAutoStarted) {
                // If we have results, mark as started so we don't accidentally trigger later
                setHasAutoStarted(true);
            }
        };
        autoTrigger();
    }, [testContent.title, hasAutoStarted, location.state]);

    React.useEffect(() => {
        const analyzeRealtime = async () => {
            if (!debouncedContent.trim() || debouncedContent.length < 10) {
                setAiFeedback(null);
                return;
            }

            setIsCoachAnalyzing(true);
            try {
                const result = await checkViralScore(debouncedContent);
                if (result) setAiFeedback(result);
            } catch (e) {
                console.error("Coach Analysis Failed", e);
            } finally {
                setIsCoachAnalyzing(false);
            }
        };
        analyzeRealtime();
    }, [debouncedContent]);

    const updateContentFromMulti = (result, platform) => {
        if (!result || !result.platforms) {
            console.error("[DEBUG] Invalid multiResult or missing platforms:", result);
            return;
        }

        const rawData = result.platforms[platform] || result.platforms[platform.replace(' Reels', '')] || result.platforms['Instagram'];
        console.log(`[DEBUG] Final matched rawData for ${platform}:`, rawData);

        if (rawData) {
            const getValidData = (top, nested) => (Array.isArray(top) && top.length > 0) ? top : ((Array.isArray(nested) && nested.length > 0) ? nested : []);

            const currentData = {
                title: rawData?.title || rawData?.variants?.A?.title || result.topic || '제목 없음',
                script: getValidData(rawData?.script, rawData?.variants?.A?.script),
                sections: getValidData(rawData?.sections, rawData?.variants?.A?.sections),
                hashtags: rawData?.hashtags || rawData?.variants?.A?.hashtags || [],
                content: rawData?.content || rawData?.variants?.A?.content || ''
            };

            const extractText = (s) => {
                if (typeof s === 'string') return s;
                if (s && typeof s === 'object') return s.text || s.content || s.value || '';
                return '';
            };

            const isVideo = platform.includes('Shorts') || platform.includes('Instagram');
            let finalDrafts = [];

            if (isVideo) {
                if (currentData.script.length > 0) {
                    finalDrafts = currentData.script.map(s => ({
                        time: s.time || '0:00',
                        type: s.type || 'body',
                        text: extractText(s),
                        visual: s.visual || ''
                    }));
                } else if (currentData.sections.length > 0) {
                    finalDrafts = currentData.sections.map(s => ({
                        time: '0:00',
                        type: 'body',
                        text: extractText(s),
                        visual: ''
                    }));
                }
            } else {
                if (currentData.sections.length > 0) {
                    finalDrafts = currentData.sections.map(s => ({
                        time: '',
                        type: 'body',
                        text: extractText(s),
                        visual: ''
                    }));
                } else if (currentData.script.length > 0) {
                    finalDrafts = currentData.script.map(s => ({
                        time: '',
                        type: 'body',
                        text: extractText(s),
                        visual: ''
                    }));
                }
            }

            if (finalDrafts.length === 0) {
                console.log("[DEBUG] No script or sections, using content fallback");
                const fallbackText = currentData.content || (typeof rawData.content === 'string' ? rawData.content : '');
                finalDrafts = [{
                    time: isVideo ? '0:00' : '',
                    type: 'intro',
                    text: fallbackText || "표시할 본문 데이터가 없습니다.",
                    visual: ''
                }];
            }

            console.log("[DEBUG] Setting testContent with:", finalDrafts);
            setTestContent({
                title: currentData.title,
                drafts: finalDrafts,
                hashtags: Array.isArray(currentData.hashtags)
                    ? currentData.hashtags.map(t => t.trim()).filter(Boolean)
                    : (typeof currentData.hashtags === 'string' ? currentData.hashtags.split(/\s+/).filter(t => t.trim().startsWith('#')) : [])
            });
        } else {
            console.warn(`[DEBUG] Platform ${platform} not found in results`);
        }
    };

    const handlePlatformChange = (platformId) => {
        setSelectedPlatform(platformId);
        if (multiResult) {
            updateContentFromMulti(multiResult, platformId);
        }
    };

    const addSection = () => {
        setTestContent(prev => ({
            ...prev,
            drafts: [...prev.drafts, { time: '0:07', type: 'body', text: '', visual: '' }]
        }));
    };

    const removeSection = (idx) => {
        setTestContent(prev => ({
            ...prev,
            drafts: prev.drafts.filter((_, i) => i !== idx)
        }));
    };

    const updateSection = (idx, field, value) => {
        setTestContent(prev => {
            const newDrafts = [...prev.drafts];
            newDrafts[idx] = { ...newDrafts[idx], [field]: value };
            return { ...prev, drafts: newDrafts };
        });
    };

    const handleAIGenerate = async () => {
        if (!testContent.title.trim()) {
            alert("주제(제목)를 먼저 입력해주세요.");
            return;
        }

        setIsGenerating(true);
        try {
            const result = await generateContentWithCerebras(testContent.title, selectedPlatform);
            if (result) {
                const isVideo = selectedPlatform.includes('Shorts') || selectedPlatform.includes('Instagram');
                const isTextOnly = selectedPlatform.includes('Blog') || selectedPlatform.includes('Threads');

                const extractText = (s) => {
                    if (typeof s === 'string') return s;
                    if (s && typeof s === 'object') return s.text || s.content || s.value || '';
                    return '';
                };

                setTestContent({
                    title: result.title || testContent.title,
                    drafts: isVideo
                        ? (Array.isArray(result.script) && result.script.length > 0 ? result.script.map(s => ({
                            time: s.time || '0:00',
                            type: s.type || 'body',
                            text: extractText(s),
                            visual: s.visual || ''
                        })) : [{ time: '0:00', type: 'intro', text: extractText(result.content || result.script), visual: '' }])
                        : (isTextOnly
                            ? (Array.isArray(result.sections) && result.sections.length > 0 ? result.sections.map(s => ({
                                time: '',
                                type: 'body',
                                text: extractText(s),
                                visual: ''
                            })) : [{ time: '', type: 'body', text: extractText(result.content || result.sections), visual: '' }])
                            : [{ time: '0:00', type: 'intro', text: '', visual: '' }]),
                    hashtags: Array.isArray(result.hashtags) ? result.hashtags : (typeof result.hashtags === 'string' ? result.hashtags.split(/\s+/).filter(t => t.startsWith('#')) : [])
                });

                // Trigger analysis automatically after generation
                setTimeout(() => analyzeSEO(), 500);

                // Track Usage (Real-time Dashboard Update)
                if (incrementUsage) incrementUsage();
            }
        } catch (e) {
            console.error("AI Generation failed", e);
        } finally {
            setIsGenerating(false);
        }
    };

    const isInputValid = () => {
        return (testContent.title.trim() || testContent.drafts.some(d => d.text.trim())) && !isGenerating;
    };

    const [selectedVariantId, setSelectedVariantId] = useState('A');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [seoScore, setSeoScore] = useState(null);
    const [activeTab, setActiveTab] = useState('seo');

    const platforms = [
        { id: 'YouTube Shorts', label: 'YouTube Shorts', icon: Youtube, brandColor: 'text-red-500', gradient: 'from-[#FF0000] to-[#CC0000]', border: 'border-red-500/50' },
        { id: 'Instagram', label: 'Instagram', icon: Instagram, brandColor: 'text-pink-500', gradient: 'from-[#833AB4] via-[#FD1D1D] to-[#FCB045]', border: 'border-pink-500/50' },
        { id: 'Naver Blog', label: 'Naver Blog', customLogo: 'N', brandColor: 'text-green-500', gradient: 'from-[#03C75A] to-[#02b351]', border: 'border-green-500/50' },
        { id: 'Threads', label: 'Threads', customLogo: '@', brandColor: 'text-white', gradient: 'from-[#000000] to-[#333333]', border: 'border-white/20' }
    ];

    const tabs = [
        {
            id: 'seo',
            label: 'SEO 분석',
            icon: Activity,
            bg: '/seo_tab_bg.png',
            desc: '플랫폼 알고리즘에 최적화된 키워드 밀도와 문장 구조를 정밀 분석하여 상단 노출 확률을 극대화합니다.'
        },
        {
            id: 'ab',
            label: 'A/B 전략',
            icon: Split,
            bg: '/ab_tab_bg.png',
            desc: '동일 주제에 최적화된 두 가지 변수(제목, 후킹)를 생성하여 클릭률(CTR)이 가장 높은 조합을 예측 제안합니다.'
        },
        {
            id: 'viral',
            label: '바이럴 예측',
            icon: TrendingUp,
            bg: '/viral_tab_bg.png',
            desc: '현 도달률 및 시청 지속 시간 시뮬레이션을 통해 콘텐츠의 바이럴 확산 가능성을 등급으로 환산합니다.'
        },
        {
            id: 'keywords',
            label: '키워드 전략',
            icon: Hash,
            bg: '/keyword_tab_bg.png',
            desc: '실시간 검색 트렌드와 경쟁 정도를 결합하여 현재 가장 수익성이 높은 태그 및 키워드 조합을 도출합니다.'
        }
    ];

    const analyzeSEO = async (targetTab = 'seo') => {
        // [Cerebras Turbo Mode] : UI Non-blocking Progressive Rendering
        setIsAnalyzing(true);
        setActiveTab(targetTab);
        setSelectedVariantId('A');

        try {
            // 1. [Instant Phase] Calculate Local SEO Score for A immediately (Rule-based Fallback)
            const resultLocalA = calculateRealSEOScore(testContent, selectedPlatform);
            const suggestions = getSmartSuggestions(resultLocalA, testContent, selectedPlatform);

            // 2. [Deep Audit Phase] Call AI for REALISTIC verification of A-Variant
            const aiAuditA = await professionalAudit(testContent, selectedPlatform);
            const resultA = aiAuditA ? {
                overall: aiAuditA.overall || resultLocalA.overall,
                breakdown: aiAuditA.breakdown || resultLocalA.breakdown
            } : resultLocalA;

            const finalSuggestions = aiAuditA?.detailed_feedback
                ? [{ type: 'info', text: aiAuditA.detailed_feedback }, ...suggestions]
                : suggestions;

            // 3. [Optimistic UI] Render A-Variant FIRST with Real results
            setSeoScore({
                platform: selectedPlatform,
                suggestions: finalSuggestions.length > 0 ? finalSuggestions : [{ type: 'info', text: '데이터 분석 중...' }],
                abVariants: {
                    A: {
                        title: testContent.title || '전략 A (원본)',
                        score: resultA.overall,
                        breakdown: resultA.breakdown,
                        stats: Math.floor(resultA.overall * 1.1) + '% 예상 CTR',
                        description: '현재 입력된 오리지널 전략',
                        fullData: { ...testContent }
                    },
                    B: {
                        title: '⚡ AI 고도화 전략 생성 중...',
                        score: 0,
                        breakdown: { hook: 0, relevance: 0, readability: 0, engagement: 0 },
                        stats: 'Cerebras LPU 연산 중...',
                        description: '잠시만 기다려주세요. 초고속으로 전략을 도출하고 있습니다.',
                        isLoading: true,
                        fullData: {
                            title: '생성 중...',
                            drafts: [{ time: '', type: 'body', text: 'AI가 최적의 전략을 계산하고 있습니다...', visual: '' }],
                            hashtags: []
                        }
                    }
                },
                viralPrediction: {
                    score: resultA.overall,
                    grade: resultA.overall > 80 ? 'S' : resultA.overall > 60 ? 'A' : 'B',
                    potential: aiAuditA?.status === 'S' ? '폭발적 바이럴형' : '균형잡힌 안정형',
                    tags: ['AI AI Audit']
                }
            });

            // 4. [Unlock UI] Remove primary loading screen
            setIsAnalyzing(false);

            // 5. [Background Phase] Call Cerebras for B-Variant strategy (Continuing concurrently)
            const abPrompt = `
                주제: "${testContent.title}"
                본문내용: "${testContent.drafts.map(d => d.text || d.content || '').join(' ')}"
                플랫폼: "${selectedPlatform}"
                
                위 내용을 바탕으로 '바이럴 CTR'이 가장 높을 것으로 예상되는 B안 전략을 도출하세요.
                B안은 단순히 제목만 바꾸는게 아니라 이목을 끄는 '후킹 제목'과 그에 맞는 완전히 새로운 본문(Script/Sections)을 작성해야 합니다.
                
                반환 형식 (JSON): { 
                    "title": "B안 제목", 
                    "description": "전략 핵심 소구점 설명", 
                    "expected_boost": 25,
                    "drafts": [
                        { "time": "0:00", "type": "intro", "text": "후킹 멘트...", "visual": "연출..." }
                    ],
                    "hashtags": ["#태그1", "#태그2"]
                }
                * 영상 플랫폼이면 drafts에 time/visual을 채우고, 텍스트 플랫폼이면 time/visual은 빈문자열로 두세요.
                * 본문이 너무 짧으면 생성 실패로 간주되니, 충분한 분량으로 작성하세요.
            `;

            // Non-blocking await (UI is already interactive)
            const abStrategy = await callCerebras(abPrompt);

            // 5. [Final Update] Hot-swap B-Variant with real data
            const bVariantTitle = abStrategy?.title || `🔥 [B-Strategy] ${testContent.title}`;

            const bDrafts = (abStrategy?.drafts || []).map(d => ({
                time: d.time || (selectedPlatform.includes('Blog') || selectedPlatform.includes('Threads') ? '' : '0:00'),
                type: d.type || 'body',
                text: d.text || '',
                visual: d.visual || ''
            }));

            // Handle generation failure
            const isBFail = !abStrategy || bDrafts.length === 0 || (bDrafts[0].text && bDrafts[0].text.includes("실패"));

            const resultB = calculateRealSEOScore({
                title: bVariantTitle,
                drafts: bDrafts.length > 0 ? bDrafts : [{ text: 'B안 본문이 생성되지 않았습니다.' }], // Fallback for scorer
                hashtags: abStrategy?.hashtags || testContent.hashtags
            }, selectedPlatform);

            setSeoScore(prev => ({
                ...prev,
                abVariants: {
                    ...prev.abVariants,
                    B: {
                        title: bVariantTitle,
                        score: Math.min(100, Math.floor(resultB.overall * 1.05)),
                        breakdown: resultB.breakdown,
                        stats: (abStrategy?.expected_boost || 15) + '% CTR 상승 예측',
                        description: abStrategy?.description || 'AI가 제안하는 고효율 하이퍼 후킹 전략',
                        isLoading: false,
                        fullData: {
                            title: bVariantTitle,
                            drafts: isBFail ? [{ time: '', type: 'body', text: 'B안 생성을 다시 시도해주세요.', visual: '' }] : bDrafts,
                            hashtags: abStrategy?.hashtags || testContent.hashtags
                        }
                    }
                },
                viralPrediction: {
                    score: Math.max(resultA.overall, resultB.overall),
                    grade: resultB.overall > 80 ? 'S' : resultB.overall > 60 ? 'A' : 'B',
                    potential: resultB.overall > 70 ? '폭발 가능성 높음' : '안정적 확산',
                    tags: Array.isArray(testContent.hashtags) ? (testContent.hashtags.length > 0 ? testContent.hashtags : ['알고리즘 최적화']) : ['알고리즘 최적화']
                }
            }));

            // Track Usage for Analysis
            if (incrementUsage) incrementUsage();

        } catch (e) {
            console.error("Deep Analysis Failed", e);
            setIsAnalyzing(false); // Valid failsafe
        }
    };

    const handleVariantSelect = (version) => {
        setSelectedVariantId(version);
        if (seoScore?.abVariants[version]?.fullData) {
            console.log(`[DEBUG] Switching to Variant ${version}:`, seoScore.abVariants[version].fullData);
            setTestContent(seoScore.abVariants[version].fullData);
        }
    };

    const handleMasterOptimize = async () => {
        if (!testContent.title.trim() && testContent.drafts.length === 0) {
            alert("최적화할 내용이 없습니다.");
            return;
        }

        setIsOptimizing(true);
        try {
            const optimizePrompt = `
                당신은 소셜 미디어 바이럴 마스터입니다. 
                현재 ${selectedVariantId}안의 전략을 분석하여, 종합 최적화 지수 95점 이상(S등급)을 달성할 수 있도록 '초고농축 바이럴 버전'으로 재작성하세요.
                
                입력 데이터:
                - 제목: "${testContent.title}"
                - 본문: "${testContent.drafts.map(d => d.text).join(' ')}"
                - 플랫폼: "${selectedPlatform}"

                최적화 요구사항:
                1. 숫자 후킹(예: 3초, 1억, 99%)을 반드시 포함하세요.
                2. 강력한 '파워 워드'를 사용하여 감각을 자극하세요.
                3. 가성비 좋은 고효율 해시태그를 5개 이상 추천하세요.
                4. 본문 분량을 충분히 확보하여 정보성을 높이세요 (최소 500자 이상 권장).

                반환 형식 (JSON):
                {
                    "title": "95점짜리 후킹 제목",
                    "drafts": [
                        { "time": "0:00", "type": "intro", "text": "강력한 도입부...", "visual": "화려한 비주얼 연출..." },
                        ...
                    ],
                    "hashtags": ["#태그1", "#태그2", ...]
                }
            `;

            const result = await callCerebras(optimizePrompt);
            if (result) {
                const optimizedData = {
                    title: result.title || testContent.title,
                    drafts: (result.drafts || []).map(d => ({
                        time: d.time || '',
                        type: d.type || 'body',
                        text: d.text || d.content || '',
                        visual: d.visual || ''
                    })),
                    hashtags: Array.isArray(result.hashtags) ? result.hashtags : []
                };

                // 1. Update active editor
                setTestContent(optimizedData);

                // 2. Update ONLY the selected variant in seoScore
                setSeoScore(prev => {
                    if (!prev) return prev;

                    const newScore = { ...prev };
                    const currentVariantData = optimizedData;

                    // Recalculate score for only this optimized content
                    const newResult = calculateRealSEOScore(currentVariantData, selectedPlatform);

                    // User Request: Increase score by 10% ~ 14%, capped at 96
                    const currentScore = prev.abVariants[selectedVariantId].score || newResult.overall;
                    const boostMultiplier = 1.10 + (Math.random() * 0.04); // 1.10 to 1.14
                    const boostedScore = Math.floor(currentScore * boostMultiplier);
                    const finalScore = Math.min(96, Math.max(boostedScore, newResult.overall));

                    newScore.abVariants[selectedVariantId] = {
                        ...newScore.abVariants[selectedVariantId],
                        title: currentVariantData.title,
                        score: finalScore,
                        breakdown: newResult.breakdown, // Keep real breakdown or boost it slightly if needed
                        stats: `최적화 완료 (+${Math.floor((boostMultiplier - 1) * 100)}% 성능 향상)`,
                        fullData: currentVariantData
                    };

                    return newScore;
                });

                // Track Usage for Optimization
                if (incrementUsage) incrementUsage();
            }
        } catch (e) {
            console.error("Master Optimization Failed", e);
        } finally {
            setIsOptimizing(false);
        }
    };

    const handleRefineVariant = async (version) => {
        if (!seoScore?.abVariants[version]) return;

        setIsRefining(version);
        const currentVariant = seoScore.abVariants[version];

        try {
            const refinePrompt = `
                전략 ${version}을 '고도화' 기획하세요.
                현재 전략: ${currentVariant.title} (${currentVariant.description})
                플랫폼: ${selectedPlatform}

                더 날카로운 후킹과 설득력 있는 논리 구조로 이 전략을 업그레이드하세요.
                JSON 반환: { "title": "...", "drafts": [...], "hashtags": [...], "description": "고도화된 전략 설명", "expected_boost": 35 }
            `;

            const result = await callCerebras(refinePrompt);
            if (result) {
                const refinedFullData = {
                    title: result.title || currentVariant.fullData.title,
                    drafts: (result.drafts || []).map(d => ({
                        time: d.time || '',
                        type: d.type || 'body',
                        text: d.text || d.content || '',
                        visual: d.visual || ''
                    })),
                    hashtags: result.hashtags || currentVariant.fullData.hashtags
                };

                setSeoScore(prev => {
                    const newScore = { ...prev };
                    newScore.abVariants[version] = {
                        ...newScore.abVariants[version],
                        title: result.title,
                        description: result.description,
                        stats: `${result.expected_boost}% CTR 상승 예측 (고도화됨)`,
                        fullData: refinedFullData
                    };
                    return newScore;
                });

                // If currently active, switch to refined data
                if (selectedVariantId === version) {
                    setTestContent(refinedFullData);
                }

                // Track Usage for Refinement
                if (incrementUsage) incrementUsage();
            }
        } catch (e) {
            console.error("Variant Refinement Failed", e);
        } finally {
            setIsRefining(null);
        }
    };

    const isTextPlatform = selectedPlatform.includes('Blog') || selectedPlatform.includes('Threads');

    return (
        <div className="min-h-screen bg-[#050508] p-4 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* 1. Header & Controls Section (Above the grid) */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                    <div className="space-y-10 flex-1">
                        <div className="w-fit space-y-10">
                            <header className="flex flex-col md:flex-row md:items-center justify-start gap-12">
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0">
                                        <Sparkles className="text-white" size={24} />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight leading-none mb-2 whitespace-nowrap">
                                            콘텐츠 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">TEST 실험실</span>
                                        </h1>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-[10px] font-bold rounded-md border border-purple-500/30">PREMIUM AI</span>
                                            <p className="text-gray-500 text-xs font-medium italic">SEO 엔진 & 바이럴 모델 가동 중</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </header>

                            <div className="flex items-center gap-3">
                                {platforms.map((platform) => {
                                    const Icon = platform.icon;
                                    const isActive = selectedPlatform === platform.id;
                                    return (
                                        <button key={platform.id} onClick={() => handlePlatformChange(platform.id)} className={cn("relative group flex items-center justify-center transition-all duration-500 overflow-hidden", isActive ? "w-28 h-16 rounded-2xl shadow-2xl border border-white/20 scale-105" : "w-28 h-16 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5")}>
                                            {isActive && <motion.div layoutId="headerPlatformBg" className={cn("absolute inset-0 bg-gradient-to-br", platform.gradient)} />}
                                            <div className={cn("absolute inset-0 flex items-center justify-center transition-all duration-500 z-1 pointer-events-none", isActive ? "opacity-90 scale-100" : "opacity-30 scale-90")}>
                                                {Icon ? <Icon size={48} className={isActive ? "text-white" : platform.brandColor} /> : <span className={cn("text-4xl font-black shrink-0 leading-none", isActive ? "text-white" : platform.brandColor)}>{platform.customLogo}</span>}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* 1x4 Grid - 4 buttons in a single row with Tooltips and Image BGs */}
                    <div className="w-full lg:w-[calc(33.333%-1rem)]">
                        <div className="flex justify-end mb-4">
                            <button onClick={() => setIsPreviewOpen(true)} className={cn("relative w-28 h-14 flex items-center justify-center transition-all duration-500 overflow-hidden bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10", "hover:border-indigo-500/30 shadow-xl")}>
                                <div className="absolute inset-0 flex items-center justify-center transition-all duration-500 opacity-20 group-hover:opacity-60 scale-100 group-hover:scale-125"><Sparkles size={48} className="text-indigo-400" /></div>
                                <span className="relative z-10 text-xs font-black text-gray-400 group-hover:text-white uppercase tracking-tight">미리보기</span>
                            </button>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                const hasResults = !!seoScore;
                                return (
                                    <div key={tab.id} className="relative group/tab">
                                        <button
                                            onClick={() => hasResults ? setActiveTab(tab.id) : analyzeSEO(tab.id)}
                                            className={cn(
                                                "relative w-full aspect-square rounded-[20px] border transition-all duration-500 overflow-hidden flex items-center justify-center",
                                                isActive && hasResults
                                                    ? "bg-purple-600/30 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.3)] scale-[1.05]"
                                                    : isActive
                                                        ? "bg-white/15 border-purple-500/40 ring-1 ring-purple-500/30"
                                                        : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                                            )}
                                        >
                                            {/* Full Background Image - Always in Color */}
                                            <div className="absolute inset-0 z-0">
                                                <img
                                                    src={tab.bg}
                                                    alt={tab.label}
                                                    className={cn(
                                                        "w-full h-full object-cover transition-transform duration-700 group-hover/tab:scale-110",
                                                        isActive ? "opacity-100" : "opacity-70"
                                                    )}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                            </div>

                                            {/* Ghost Background Icon - Like Preview */}
                                            <div className={cn(
                                                "absolute inset-0 flex items-center justify-center transition-all duration-500 opacity-20",
                                                isActive ? "scale-110 opacity-30" : "scale-90 opacity-10"
                                            )}>
                                                <Icon size={48} className={isActive ? "text-purple-400" : "text-gray-500"} />
                                            </div>

                                            {/* Foreground Text Label */}
                                            <span className={cn(
                                                "relative z-10 text-[11px] font-black uppercase tracking-tight transition-all duration-300",
                                                isActive ? "text-white scale-105" : "text-gray-400 group-hover/tab:text-white"
                                            )}>
                                                {tab.label}
                                            </span>

                                            {/* Active Indicator Glow */}
                                            {isActive && <motion.div layoutId="tabGlow" className="absolute inset-0 bg-purple-500/10 blur-xl" />}
                                        </button>

                                        {/* Speech Bubble Tooltip (Expert Description) */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 opacity-0 translate-y-2 pointer-events-none group-hover/tab:opacity-100 group-hover/tab:translate-y-0 transition-all duration-300 z-[100]">
                                            <div className="relative bg-[#0a0a0f]/95 backdrop-blur-2xl border border-white/10 p-4 rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                                                    <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">{tab.label} Insight</span>
                                                </div>
                                                <p className="text-[11px] text-gray-300 leading-relaxed font-medium">
                                                    {tab.desc}
                                                </p>
                                                {/* Tooltip Tail */}
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-4 h-4 bg-[#0a0a0f] border-b border-r border-white/10 rotate-45" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* 2. Main Grid - Both cards now start at the same vertical level */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column (8 cols) - Content Input Card */}
                    <div className="lg:col-span-8">
                        <section className="h-full bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 shadow-2xl overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-black text-white flex items-center gap-2"><FileText size={20} className="text-purple-400" />콘텐츠 본문 입력</h2>
                                <div className="flex items-center gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleAIGenerate}
                                        disabled={isGenerating || !testContent.title.trim()}
                                        className={cn(
                                            "px-4 py-2 rounded-xl flex items-center gap-2 transition-all border font-black text-[11px]",
                                            isGenerating
                                                ? "bg-white/5 border-white/10 text-gray-500"
                                                : "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500 hover:text-white shadow-lg shadow-indigo-500/10"
                                        )}
                                    >
                                        <Zap size={14} className={isGenerating ? "animate-spin" : "animate-pulse"} />
                                        {isGenerating ? "AI 초안 작성 중..." : "AI로 본문 완성"}
                                    </motion.button>
                                    <div className="flex gap-2"><span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Analysis Mode</span></div>
                                </div>
                            </div>
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2"><div className="w-1 h-4 bg-purple-500 rounded-full" /><h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">제목 (Title)</h3></div>
                                    <input type="text" value={testContent.title} onChange={(e) => setTestContent({ ...testContent, title: e.target.value })} placeholder="이곳에 제목을 입력하세요..." className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-base placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all font-bold" />
                                </div>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3"><FileText size={18} className="text-purple-400" /><span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{isTextPlatform ? '본문 (Content)' : '대본 (Script)'}</span></div>
                                        <button onClick={addSection} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-gray-400 transition-all flex items-center gap-2"><Split size={14} /> 섹션 추가</button>
                                    </div>
                                    <div className="space-y-4">
                                        {testContent.drafts.map((draft, idx) => (
                                            <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="group relative bg-black/40 border border-white/5 rounded-[24px] p-6 hover:border-purple-500/30 transition-all">
                                                <div className="flex gap-6">
                                                    <div className="flex flex-col gap-2 shrink-0">
                                                        {!isTextPlatform && (
                                                            <input type="text" value={draft.time} onChange={(e) => updateSection(idx, 'time', e.target.value)} className="w-16 bg-white/5 rounded-lg py-1.5 text-center text-[10px] font-black text-purple-400 focus:outline-none border border-white/5" placeholder="0:00" />
                                                        )}
                                                        <select value={draft.type} onChange={(e) => updateSection(idx, 'type', e.target.value)} className="w-16 bg-white/5 rounded-lg py-1.5 text-center text-[8px] font-black text-gray-500 uppercase focus:outline-none border border-white/5 appearance-none cursor-pointer">
                                                            <option value="intro">{isTextPlatform ? '서론' : 'intro'}</option>
                                                            <option value="body">{isTextPlatform ? '본론' : 'body'}</option>
                                                            <option value="outro">{isTextPlatform ? '결론' : 'outro'}</option>
                                                        </select>
                                                    </div>
                                                    <div className="flex-1 space-y-4">
                                                        <textarea value={draft.text} onChange={(e) => updateSection(idx, 'text', e.target.value)} placeholder={isTextPlatform ? "이 섹션의 내용을 입력하세요..." : "이 장면의 대사를 입력하세요..."} className="w-full bg-transparent text-gray-200 text-sm leading-relaxed placeholder-gray-700 focus:outline-none resize-none min-h-[60px]" />
                                                        <div className="flex items-center gap-3 pt-3 border-t border-white/[0.03]"><span className="text-[10px] font-black text-gray-600 uppercase flex items-center gap-1.5"><Activity size={12} /> Visual:</span><input type="text" value={draft.visual} onChange={(e) => updateSection(idx, 'visual', e.target.value)} placeholder="연출 설명을 입력하세요" className="flex-1 bg-transparent text-[10px] font-medium text-gray-500 focus:outline-none" /></div>
                                                    </div>
                                                    {testContent.drafts.length > 1 && (
                                                        <button onClick={() => removeSection(idx)} className="opacity-0 group-hover:opacity-100 p-2 text-gray-600 hover:text-red-400 transition-all self-start"><AlertCircle size={18} /></button>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-blue-400"><Hash size={18} /><span className="text-sm font-bold uppercase tracking-widest">해시태그 (Hashtags)</span></div>
                                    <div className="bg-black/20 border border-white/5 rounded-2xl p-4 min-h-[60px] flex flex-wrap gap-2">
                                        {(testContent.hashtags || []).map((tag, idx) => (
                                            <span key={`${tag}-${idx}`} className="px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl text-xs font-bold">
                                                {tag.startsWith('#') ? tag : `#${tag}`}
                                            </span>
                                        ))}
                                        <input
                                            type="text"
                                            placeholder="태그 입력..."
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && e.target.value.trim()) {
                                                    const newTag = e.target.value.trim();
                                                    if (!newTag) return;
                                                    setTestContent(prev => ({
                                                        ...prev,
                                                        hashtags: [...new Set([...prev.hashtags, newTag.startsWith('#') ? newTag : `#${newTag}`])]
                                                    }));
                                                    e.target.value = '';
                                                }
                                            }}
                                            className="bg-transparent text-xs font-bold border-none focus:outline-none text-gray-500 w-24"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-12 bg-gradient-to-b from-transparent to-[#0f1115]/50 -mx-8 -mb-8 p-8 border-t border-white/5">
                                <button onClick={analyzeSEO} disabled={!isInputValid() || isAnalyzing} className={cn("w-full group relative px-8 py-6 rounded-[24px] font-black text-lg transition-all duration-500 overflow-hidden shadow-2xl", isInputValid() && !isAnalyzing ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:scale-[1.01] active:scale-95 text-white" : "bg-white/5 text-gray-600 cursor-not-allowed border border-white/5")}>
                                    <div className="relative z-10 flex items-center justify-center gap-3">
                                        {isAnalyzing ? (<><div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /><span>지능형 AI 분석 중...</span></>) : (<><Zap size={22} className="group-hover:text-yellow-300 transition-colors" /><span>초정밀 AI 분석 가동</span><ArrowRight size={20} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" /></>)}
                                    </div>
                                </button>
                            </div>
                        </section>
                    </div>

                    {/* Right Column (4 cols) - Sidebar Intelligence Card */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* [New] Real-time AI Coach (Vision #5) */}
                        <AnimatePresence>
                            {aiFeedback && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                                    className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-3xl border border-emerald-500/20 rounded-[32px] p-6 shadow-2xl relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                                        <Zap size={80} className="text-emerald-400" />
                                    </div>

                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                                <Sparkles size={16} className="text-white animate-pulse" />
                                            </div>
                                            <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Real-time Coach</span>
                                        </div>
                                        {isCoachAnalyzing && (
                                            <div className="flex gap-1">
                                                {[0, 1, 2].map(i => (
                                                    <motion.div
                                                        key={i}
                                                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                                                        className="w-1.5 h-1.5 bg-emerald-400 rounded-full"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-end gap-3">
                                            <div className="text-5xl font-black text-white">{aiFeedback.score}</div>
                                            <div className="text-xl font-bold text-emerald-500 pb-1">{aiFeedback.grade}</div>
                                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter pb-1.5 ml-auto">Viral Score</div>
                                        </div>

                                        <div className="p-4 bg-black/40 border border-emerald-500/10 rounded-2xl relative">
                                            <div className="absolute -left-1 top-4 w-2 h-2 bg-emerald-500 rotate-45" />
                                            <p className="text-[12px] text-gray-200 leading-relaxed font-medium">
                                                "{aiFeedback.feedback || aiFeedback.comment}"
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
                                            <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-[9px] font-black text-emerald-400">INSTANT INFERENCE</span>
                                            <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[9px] font-black text-gray-500 uppercase">Cerebras Armed</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Overall Optimization Index Card - Restructured to 1x2 Grid */}
                        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl border border-white/10 rounded-[40px] p-6 shadow-2xl relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 blur-[50px] rounded-full group-hover:scale-150 transition-transform duration-700" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                                {/* Left Column (Red Box in screenshot) */}
                                <div className="space-y-4 flex flex-col items-center md:items-start text-center md:text-left justify-center">
                                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                                        <div className="w-1 h-4 bg-purple-500 rounded-full" />
                                        <span>종합 최적화 지수</span>
                                    </h3>

                                    <div className="relative w-full flex flex-col items-center justify-center">
                                        <div className="relative flex items-center justify-center">
                                            <svg className="w-40 h-40 -rotate-90" viewBox="0 0 192 192">
                                                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                                                <motion.circle
                                                    cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="10" fill="transparent"
                                                    strokeDasharray="552.92"
                                                    initial={{ strokeDashoffset: 552.92 }}
                                                    animate={{ strokeDashoffset: seoScore ? 552.92 * (1 - (seoScore.abVariants[selectedVariantId]?.score || 0) / 100) : 552.92 }}
                                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                                    className="text-purple-500"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center uppercase">
                                                <div className="text-[10px] font-black text-gray-500 tracking-[0.2em] mb-1">SCORE</div>
                                                <div className="text-6xl font-black text-white">{seoScore ? seoScore.abVariants[selectedVariantId]?.score : '--'}</div>
                                                <div className="text-[9px] font-black text-purple-400 mt-1">OPTIMIZED</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column (Blue Box in screenshot) */}
                                <div className="flex flex-col gap-2 pt-2">
                                    <div className="flex justify-end">
                                        {seoScore && (
                                            <span className="text-[10px] bg-purple-500/20 text-purple-400 px-3 py-1.5 rounded-full border border-purple-500/30 font-black shadow-lg shadow-purple-500/10">
                                                STRATEGY {selectedVariantId}
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-5 bg-black/40 border border-white/5 rounded-[24px] hover:border-white/10 transition-all">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm font-bold text-gray-500 uppercase tracking-widest whitespace-pre-line text-left leading-tight">플랫폼{'\n'}적합도</span>
                                                <span className={cn(
                                                    "text-sm font-black text-right whitespace-pre-line leading-tight",
                                                    !seoScore || (seoScore.abVariants[selectedVariantId]?.score || 0) === 0 ? "text-gray-500" :
                                                        (seoScore.abVariants[selectedVariantId]?.score || 0) > 80 ? "text-green-400" :
                                                            (seoScore.abVariants[selectedVariantId]?.score || 0) > 50 ? "text-yellow-400" : "text-red-400"
                                                )}>
                                                    {!seoScore || (seoScore.abVariants[selectedVariantId]?.score || 0) === 0 ? "데이터\n부족" :
                                                        (seoScore.abVariants[selectedVariantId]?.score || 0) > 80 ? "매우\n높음" :
                                                            (seoScore.abVariants[selectedVariantId]?.score || 0) > 50 ? "보통" : "개선\n필요"}
                                                </span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mt-3">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: seoScore ? `${seoScore.abVariants[selectedVariantId]?.score}%` : '0%' }}
                                                    className={cn("h-full transition-all duration-1000",
                                                        (seoScore?.abVariants[selectedVariantId]?.score || 0) > 80 ? "bg-green-500" :
                                                            (seoScore?.abVariants[selectedVariantId]?.score || 0) > 50 ? "bg-yellow-500" : "bg-red-500"
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleMasterOptimize}
                                            disabled={isOptimizing}
                                            className={cn(
                                                "w-full group relative px-6 py-4 rounded-[20px] font-black text-sm transition-all duration-300 overflow-hidden border",
                                                isOptimizing
                                                    ? "bg-white/5 border-white/10 text-gray-500 cursor-not-allowed"
                                                    : "bg-gradient-to-r from-indigo-600 to-purple-600 border-white/10 text-white hover:scale-[1.02] active:scale-95 shadow-xl shadow-indigo-500/20"
                                            )}
                                        >
                                            <div className="relative z-10 flex items-center justify-center gap-2 text-center">
                                                {isOptimizing ? (
                                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <Zap size={14} className="animate-pulse text-yellow-300 shrink-0" />
                                                )}
                                                <span className="whitespace-pre-line leading-tight">{isOptimizing ? "S등급 최적화\n엔진 가동 중..." : "AI SEO\n전략 고도화"}</span>
                                            </div>
                                            {!isOptimizing && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                            )}
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Analysis Detailed Info Sidebar Item */}
                        <AnimatePresence mode="wait">
                            {seoScore && (
                                <motion.div key={activeTab} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[30px] p-6 shadow-xl">
                                    {activeTab === 'seo' && (
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between"><span className="text-xs font-black text-purple-400 uppercase tracking-widest">SEO Detail ({selectedVariantId})</span><span className="text-[10px] px-2 py-0.5 bg-green-500/20 text-green-400 rounded-md border border-green-500/20">LIVE</span></div>
                                            <div className="grid grid-cols-2 gap-3">
                                                {Object.entries({
                                                    "후킹": seoScore.abVariants[selectedVariantId].breakdown.hook,
                                                    "연관성": seoScore.abVariants[selectedVariantId].breakdown.relevance,
                                                    "가독성": seoScore.abVariants[selectedVariantId].breakdown.readability,
                                                    "도달률": seoScore.abVariants[selectedVariantId].breakdown.engagement
                                                }).map(([label, val]) => (
                                                    <div key={label} className="bg-black/20 border border-white/5 p-4 rounded-2xl text-center">
                                                        <div className="text-sm font-bold text-gray-500 uppercase mb-2">{label}</div>
                                                        <div className="text-3xl font-black text-white">{val}</div>
                                                        <div className="mt-3 h-1.5 w-full bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${val}%` }} className="h-full bg-purple-500" /></div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1.5"><Sparkles size={12} className="text-yellow-400" /> AI 개선 제안</h4>
                                                {seoScore.suggestions.slice(0, 2).map((s, i) => (<div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-gray-300 leading-tight">{s.text}</div>))}
                                            </div>
                                        </div>
                                    )}
                                    {activeTab === 'ab' && (
                                        <div className="space-y-6">
                                            <span className="text-xs font-black text-primary uppercase tracking-widest block mb-4">A/B Strategy Analyzer</span>
                                            <div className="space-y-4">
                                                {Object.entries(seoScore.abVariants).map(([version, data]) => {
                                                    const isWinner = version === (seoScore.abVariants.A.score >= seoScore.abVariants.B.score ? 'A' : 'B');
                                                    const isSelected = selectedVariantId === version;

                                                    return (
                                                        <motion.div
                                                            key={version}
                                                            onClick={() => handleVariantSelect(version)}
                                                            className={cn(
                                                                "p-5 rounded-3xl border transition-all relative overflow-hidden cursor-pointer",
                                                                isSelected ? "bg-purple-500/10 border-purple-500/40 shadow-xl scale-[1.02]" : "bg-black/20 border-white/5 opacity-60 hover:opacity-100 hover:border-white/20"
                                                            )}
                                                        >
                                                            {isWinner && (
                                                                <div className="absolute -right-8 -top-8 w-20 h-20 bg-yellow-500/20 blur-2xl rounded-full" />
                                                            )}
                                                            <div className="flex justify-between items-start mb-3">
                                                                <div className="flex items-center gap-3">
                                                                    <span className={cn(
                                                                        "w-6 h-6 flex items-center justify-center rounded-full text-[10px] text-white font-black",
                                                                        version === 'A' ? "bg-indigo-600 shadow-md" : "bg-purple-600 shadow-md"
                                                                    )}>{version}</span>
                                                                    {isWinner && (
                                                                        <span className="px-2 py-0.5 bg-yellow-400 text-black text-[9px] font-black rounded-md animate-bounce">WINNER</span>
                                                                    )}
                                                                </div>
                                                                <div className="text-2xl font-black text-white leading-none">{data.score}</div>
                                                            </div>

                                                            {/* Loading State Overlay */}
                                                            {data.isLoading ? (
                                                                <div className="space-y-3 animate-pulse">
                                                                    <div className="h-4 bg-white/10 rounded w-3/4"></div>
                                                                    <div className="h-3 bg-white/5 rounded w-1/2"></div>
                                                                    <div className="flex items-center gap-2 mt-2">
                                                                        <Loader size={12} className="text-purple-400 animate-spin" />
                                                                        <span className="text-[10px] text-purple-400 font-bold">AI 연산 중...</span>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <p className="text-sm font-bold text-white mb-2 leading-snug line-clamp-2">{data.title}</p>
                                                            )}

                                                            <div className="flex items-center justify-between mt-4">
                                                                <span className="text-[10px] text-emerald-400 font-black tracking-widest">{data.stats}</span>
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleRefineVariant(version);
                                                                        }}
                                                                        disabled={isRefining === version || data.isLoading}
                                                                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors group/btn"
                                                                        title="전략 고도화"
                                                                    >
                                                                        <Orbit size={12} className={cn("text-purple-400", isRefining === version && "animate-spin")} />
                                                                    </button>
                                                                    <span className={cn(
                                                                        "text-[10px] font-black px-2 py-1 rounded-md",
                                                                        isSelected ? "bg-purple-500 text-white" : "bg-white/5 text-gray-500"
                                                                    )}>
                                                                        {isSelected ? 'ACTIVE' : 'SELECT'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                    {activeTab === 'viral' && (
                                        <div className="flex flex-col items-center py-4">
                                            <div className="relative w-32 h-32 mb-6"><div className="absolute inset-0 bg-pink-500 blur-[40px] opacity-20" /><div className="relative w-full h-full rounded-full border-4 border-white/5 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xl"><div className="text-[8px] font-bold text-gray-500 uppercase mb-0.5">Viral</div><div className="text-3xl font-black text-white">{seoScore.viralPrediction.score}</div><div className="text-sm font-black text-pink-500">{seoScore.viralPrediction.grade}</div></div></div>
                                            <div className="w-full space-y-2">{seoScore.viralPrediction.tags.map(tag => (<div key={tag} className="px-3 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold text-gray-400 text-center">#{tag}</div>))}</div>
                                        </div>
                                    )}
                                    {activeTab === 'keywords' && (
                                        <div className="space-y-6">
                                            <span className="text-xs font-black text-blue-400 uppercase tracking-widest block mb-4">Keywords Hub</span>
                                            <div className="flex flex-wrap gap-2">{['#필수영상', '#트렌드픽', '#인생꿀팁', '#화제작'].map(tag => (<span key={tag} className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-[10px] font-bold text-blue-300">{tag}</span>))}</div>
                                            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-4 rounded-2xl border border-white/10"><p className="text-[11px] text-gray-400 leading-relaxed">제목에 <strong className="text-white">'비법'</strong> 키워드를 배치하여 도달률을 15% 이상 높일 수 있습니다.</p></div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Expert Guide Section at bottom */}
                        <div className="bg-white/5 border border-white/10 rounded-[40px] p-8">
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2"><ChevronRight size={16} className="text-primary" />전문가 가이드</h3>
                            <div className="space-y-6">
                                <div className="flex gap-4 group">
                                    <div className="w-10 h-10 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center shrink-0 border border-red-500/20"><Youtube size={18} /></div>
                                    <p className="text-[11px] text-gray-400 leading-relaxed"><span className="text-white font-bold block mb-1">YouTube Shorts Tip</span> 초반 3초의 시각적 후킹이 시청 지속 시간을 결정합니다.</p>
                                </div>
                                <div className="flex gap-4 group">
                                    <div className="w-10 h-10 bg-pink-500/10 text-pink-500 rounded-xl flex items-center justify-center shrink-0 border border-pink-500/20"><Instagram size={18} /></div>
                                    <p className="text-[11px] text-gray-400 leading-relaxed"><span className="text-white font-bold block mb-1">Instagram Tip</span> 감성적인 톤앤매너와 해시태그의 적절한 조합이 필수입니다.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                onConfirm={async (data) => {
                    console.log("Confirmed and Saving:", data);
                    if (data.action === 'upload' && !data.isHumanized) {
                        // Prevent upload if needed, or just warn
                    }

                    // Save to Archive (UserContext)
                    if (addToHistory) {
                        await addToHistory({
                            ...data,
                            id: Date.now(), // Ensure ID
                            createdAt: new Date().toISOString(),
                            type: data.platform === 'YouTube Shorts' ? 'video' : 'text',
                            thumbnail: data.platform === 'YouTube Shorts' ? 'https://cdn.dribbble.com/users/122051/screenshots/15694767/media/5858564a934444585f67a6e1330df32d.jpg?resize=400x300&vertical=center' : null
                        });
                        // alert("보관함에 저장되었습니다."); // Optional explicit feedback
                    }

                    setIsPreviewOpen(false);
                }}
                data={{
                    platform: selectedPlatform,
                    topic: multiResult?.topic || testContent.title,
                    title: testContent.title,
                    drafts: testContent.drafts,
                    script: testContent.drafts.map(d => ({ time: d.time, text: d.text, visual: d.visual, type: d.type })),
                    sections: testContent.drafts.map((d, i, arr) => ({
                        title: d.type === 'intro' ? '서론' : (i === arr.length - 1 && i > 0) ? '결론' : d.type === 'body' ? '본론' : '결론',
                        text: d.text,
                        content: d.text
                    })),
                    hashtags: (testContent.hashtags || []).join(' '),
                    predictedStats: seoScore?.predictedStats || { expectViews: '실시간 분석 대기', viralityScore: 0, competition: '분석 중...' }
                }}
            />
        </div >
    );
};

export default TestPage;
