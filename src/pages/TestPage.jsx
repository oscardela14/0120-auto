import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, Split, TrendingUp, Hash, Target, Sparkles, BarChart3, CheckCircle2, AlertCircle, Youtube, Instagram, ArrowRight, MessageCircle, FileText, ChevronRight, Orbit, Loader, Globe } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { cn } from '../lib/utils';
import { useLocation, useNavigate } from 'react-router-dom';
import { PreviewModal } from '../components/PreviewModal';
import { NeuralLabsPanel } from '../components/NeuralLabsPanel';
import { generateContentWithCerebras, checkViralScore, callCerebras, professionalAudit, quantumABNTest, localizeContent, generateInteractiveWidget } from '../lib/cerebras';
import { useDebounce } from '../hooks/useDebounce';
import { calculateRealSEOScore, getSmartSuggestions } from '../utils/seoAnalyzer';

const TestPage = () => {
    const { user, incrementUsage, addToHistory, addNotification } = useUser();
    const location = useLocation();
    const navigate = useNavigate();
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

    const [isLocalizing, setIsLocalizing] = useState(false);
    const [isGeneratingWidget, setIsGeneratingWidget] = useState(false);

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
            label: '지능형 SEO 오딧',
            icon: Activity,
            bg: '/seo_tab_bg.png',
            desc: '플랫폼 알고리즘에 최적화된 시멘틱 밀도와 문장 구조를 정밀 감사(Audit)하여 검색 엔진 상단 점유율을 극대화합니다.'
        },
        {
            id: 'ab',
            label: '퀀텀 A/B 전략',
            icon: Split,
            bg: '/ab_tab_bg.png',
            desc: '알고리즘 변수(Hook, Tone, CTA)를 수백 가지 조합으로 교차 시뮬레이션하여 실시간 클릭률(CTR)이 가장 높은 Winning Logic을 예측합니다.'
        },
        {
            id: 'viral',
            label: '바이럴 궤적 예측',
            icon: TrendingUp,
            bg: '/viral_tab_bg.png',
            desc: '초기 도달률 및 시청 지속 시간 시뮬레이션을 통해 콘텐츠의 유기적 확산 경로와 바이럴 임계점을 정밀 예측합니다.'
        },
        {
            id: 'keywords',
            label: '시멘틱 키워드 맵핑',
            icon: Hash,
            bg: '/keyword_tab_bg.png',
            desc: '실시간 검색 트렌드와 LSI(잠재적 시멘틱 색인) 가치를 결합하여 현재 가장 수익성이 높은 키워드 클러스터를 구축합니다.'
        }
    ];

    const analyzeSEO = async (targetTab = 'seo') => {
        setIsAnalyzing(true);
        setActiveTab(targetTab);
        setSelectedVariantId('V1');

        try {
            // 1. Initial Quick Audit
            const aiAuditA = await professionalAudit(testContent, selectedPlatform);
            const resultLocalA = calculateRealSEOScore(testContent, selectedPlatform);

            // 2. Quantum Hyper-Variant Generation
            const quantumResults = await quantumABNTest(testContent.title, testContent.drafts.map(d => d.text).join(' '), selectedPlatform);

            // Dynamic Metrics Calculation
            const textLength = testContent.drafts.map(d => d.text).join(' ').length;
            const fleshScore = Math.max(0, Math.min(100, 80 - (textLength / 50) + (Math.random() * 10))).toFixed(1);
            const keyDensity = ((testContent.title.split(' ').length / (textLength || 100)) * 100).toFixed(1);
            const audienceMatch = Math.min(99, Math.floor(resultLocalA.overall * 0.9 + Math.random() * 10));

            // Dynamic Keyword Generation
            const baseVol = (Math.random() * 50 + 5).toFixed(1);
            const baseKD = Math.floor(Math.random() * 50 + 20);
            const mainKeyword = testContent.title.split(' ')[0] || '메인 키워드';
            const generatedLSI = testContent.hashtags.length > 0
                ? testContent.hashtags.slice(0, 5)
                : [`#${mainKeyword}`, `#${selectedPlatform.replace(/\s/g, '')}`, '#추천', '#인사이트', '#트렌드'];

            // Dynamic Action Plan
            const actionPlans = [
                `제목에 <strong class="text-white underline decoration-blue-500/50">'${mainKeyword}'</strong> 핵심 키워드를 전진 배치하고, 첫 3초 내에 시각적 후킹 요소를 추가하여 <span class="text-green-400">초반 이탈률을 20% 이상</span> 개선하십시오.`,
                `본문 내 <strong class="text-white underline decoration-blue-500/50">감정적 트리거(Power Words)</strong>를 3회 이상 보강하고, 결론부에 명확한 CTA(행동 유도)를 추가하여 <span class="text-green-400">전환율을 15% 이상</span> 높이십시오.`,
                `현재 <strong class="text-white underline decoration-blue-500/50">키워드 밀도(${keyDensity}%)</strong>가 다소 낮습니다. LSI 태그를 본문 문맥에 자연스럽게 녹여내어 <span class="text-green-400">검색 노출 점수를 극대화</span>하십시오.`
            ];
            const selectedPlan = actionPlans[Math.floor(Math.random() * actionPlans.length)];

            if (quantumResults && quantumResults.variants) {
                const newVariants = {};
                // Original Variant
                newVariants['A'] = {
                    title: testContent.title || 'Original',
                    score: resultLocalA.overall,
                    breakdown: resultLocalA.breakdown,
                    stats: 'Baseline CTR',
                    description: '현재 입력된 오리지널 전략',
                    fullData: { ...testContent }
                };

                // AI Generated Variants
                const isVideo = ['YouTube Shorts', 'Instagram', 'Instagram Reels'].includes(selectedPlatform);

                quantumResults.variants.forEach(v => {
                    const vScore = v.prediction || (70 + Math.random() * 25);

                    let mappedDrafts = [];
                    if (Array.isArray(v.content)) {
                        if (isVideo) {
                            mappedDrafts = v.content.map(item => ({
                                time: item.time || '',
                                text: item.text || '',
                                visual: item.visual || '',
                                type: item.type || 'body'
                            }));
                        } else {
                            mappedDrafts = v.content.map((item, idx) => {
                                const title = item.title || '';
                                let type = 'body';
                                if (title.includes('서론') || title.toLowerCase().includes('intro') || idx === 0) type = 'intro';
                                else if (title.includes('결론') || title.toLowerCase().includes('outro') || title.toLowerCase().includes('conclusion') || idx === v.content.length - 1) type = 'outro';

                                return {
                                    time: '',
                                    text: item.content || item.text || '',
                                    visual: title, // Store section title in visual for display/editing
                                    type: type
                                };
                            });
                        }
                    } else {
                        mappedDrafts = [{ time: '', type: 'body', text: v.content || "", visual: '' }];
                    }

                    newVariants[v.id] = {
                        title: v.title,
                        score: Math.floor(vScore),
                        breakdown: { hook: 85, relevance: 90, readability: 88, engagement: 82 },
                        stats: `${v.prediction || 15}% CTR 상승 예측`,
                        description: v.logic,
                        fullData: {
                            title: v.title,
                            drafts: mappedDrafts,
                            hashtags: testContent.hashtags
                        }
                    };
                });

                // Generate dynamic graph path based on score
                const maxScore = Math.max(...Object.values(newVariants).map(v => v.score));
                const graphY1 = 100 - (maxScore * 0.4);
                const graphY2 = 100 - (maxScore * 1.0); // Higher peak for higher score
                const graphPath = `M0,100 C 50,${graphY1} 100,${graphY2} 200,5`;

                setSeoScore({
                    platform: selectedPlatform,
                    suggestions: [{ type: 'info', text: quantumResults.winning_logic }],
                    abVariants: newVariants,
                    viralPrediction: {
                        score: maxScore,
                        grade: maxScore > 90 ? 'SS' : maxScore > 80 ? 'S' : 'A',
                        potential: maxScore > 90 ? '메가 바이럴 (Mega Viral)' : '바이럴 진입 (Viral Entry)',
                        tags: ['Cerebras Boosted', 'Trend Aligned'],
                        graphPath: graphPath,
                        audienceMatch: audienceMatch
                    },
                    meta: {
                        fleschKincaid: fleshScore,
                        keyDensity: keyDensity
                    },
                    keywords: {
                        vol: baseVol + 'k',
                        kd: baseKD + '%',
                        primary: mainKeyword,
                        lsi: generatedLSI
                    },
                    actionPlan: selectedPlan
                });
            }
            setIsAnalyzing(false);
        } catch (e) {
            console.error("Quantum Analysis Failed", e);
            setIsAnalyzing(false);
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




    const handleLocalize = async () => {
        const fullText = testContent.drafts.map(d => d.text).join('\n');
        if (!fullText.trim()) return addNotification("로컬라이징할 본문 내용이 없습니다.", "warning");

        setIsLocalizing(true);
        addNotification("네이티브 문화 로컬라이제이션(Cultural Patch) 가동 중...", "info");

        try {
            const result = await localizeContent(fullText, "GLOBAL (US/KR Hybrid)");
            if (result) {
                addNotification("로컬라이제이션 완료! 현지 정서에 맞게 본문이 재구성되었습니다.", "success");

                // Update the first draft with some localized flavor or replace common ones
                setTestContent(prev => ({
                    ...prev,
                    drafts: prev.drafts.map((d, i) => i === 0 ? { ...d, text: result.localized_content } : d)
                }));

                // Show cultural notes as notification
                setTimeout(() => {
                    addNotification(`문화적 통찰: ${result.cultural_notes}`, "info");
                }, 1500);
            }
        } catch (e) {
            console.error("Localization failed", e);
        } finally {
            setIsLocalizing(false);
        }
    };

    const handleWidgetGenerate = async () => {
        if (!testContent.title.trim()) return addNotification("위젯을 생성할 주제(제목)를 먼저 입력해주세요.", "warning");

        setIsGeneratingWidget(true);
        addNotification("주제 기반 인터랙티브 위젯 로직 설계 중...", "info");

        try {
            const result = await generateInteractiveWidget(testContent.title);
            if (result) {
                addNotification(`'${result.title}' 위젯 설계 완료!`, "success");
                addNotification(`위젯 타입: ${result.widget_type}. 위젯은 미리보기 모드에서 확인 가능합니다.`, "info");
            }
        } catch (e) {
            console.error("Widget generation failed", e);
        } finally {
            setIsGeneratingWidget(false);
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
                        <div className="flex justify-end mb-4 gap-3">
                            {/* Real-time Coach Tab */}
                            <AnimatePresence>
                                {aiFeedback && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="relative group z-50"
                                    >
                                        <div className={cn(
                                            "w-28 h-14 flex flex-col items-center justify-center transition-all duration-500 overflow-hidden rounded-2xl border shadow-xl cursor-default",
                                            aiFeedback.score >= 80 ? "bg-emerald-500/10 border-emerald-500/30" : "bg-yellow-500/10 border-yellow-500/30"
                                        )}>
                                            <div className="flex items-center gap-1.5 mb-0.5">
                                                <Zap size={16} className={aiFeedback.score >= 80 ? "text-emerald-400 fill-emerald-400" : "text-yellow-400 fill-yellow-400"} />
                                                <span className={cn("text-lg font-black", aiFeedback.score >= 80 ? "text-emerald-400" : "text-yellow-400")}>
                                                    {aiFeedback.score}
                                                </span>
                                            </div>
                                            <span className={cn("text-[10px] font-bold uppercase", aiFeedback.score >= 80 ? "text-emerald-500/70" : "text-yellow-500/70")}>
                                                Dopamine Score
                                            </span>
                                        </div>

                                        {/* Speech Bubble Tooltip - TOP Position */}
                                        <div className="absolute bottom-full right-0 mb-3 w-72 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-[100]">
                                            <div className="relative bg-[#0a0a0f]/95 backdrop-blur-2xl border border-white/10 p-5 rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">

                                                {/* Arrow Pointing Down */}
                                                <div className="absolute top-full right-10 -mt-2 w-4 h-4 bg-[#0a0a0f] border-b border-r border-white/10 rotate-45" />

                                                <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                                                    <span className="text-xs font-black text-white flex items-center gap-2">
                                                        <Sparkles size={12} className={aiFeedback.score >= 80 ? "text-emerald-400" : "text-yellow-400"} />
                                                        Instant Dopamine Level
                                                    </span>
                                                    <span className={cn("text-xs font-black px-2 py-0.5 rounded", aiFeedback.score >= 80 ? "bg-emerald-500/20 text-emerald-400" : "bg-yellow-500/20 text-yellow-400")}>
                                                        Grade {aiFeedback.grade}
                                                    </span>
                                                </div>
                                                <p className="text-[12px] text-gray-300 leading-relaxed font-medium">
                                                    "{aiFeedback.feedback || "행동 경제학 및 바이럴 심리학 기반의 알고리즘이 실시간으로 문맥을 분석하여 최적의 솔루션을 도출하고 있습니다."}"
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

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
                                            "px-4 py-2 rounded-xl flex items-center gap-2 transition-all border font-black text-[14px]",
                                            isGenerating
                                                ? "bg-white/5 border-white/10 text-gray-500"
                                                : "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500 hover:text-white shadow-lg shadow-indigo-500/10"
                                        )}
                                    >
                                        <Zap size={14} className={isGenerating ? "animate-spin" : "animate-pulse"} />
                                        {isGenerating ? "AI 초안 작성 중..." : "AI로 본문 완성"}
                                    </motion.button>
                                    <div className="flex gap-2"><span className="px-3 py-1 bg-white/5 rounded-full text-[14px] font-bold text-gray-500 uppercase tracking-widest">Analysis Mode</span></div>
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
                        {/* Real-time AI Coach moved to header */}

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
                                <motion.div key={activeTab} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[30px] p-6 shadow-2xl overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[50px] rounded-full pointer-events-none" />

                                    {activeTab === 'seo' && (
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between pb-4 border-b border-white/5">
                                                <div className="flex items-center gap-2">
                                                    <Activity size={16} className="text-purple-400" />
                                                    <span className="text-xs font-black text-white uppercase tracking-widest">Deep SEO Audit</span>
                                                </div>
                                                <span className="text-[10px] px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded border border-purple-500/20 font-mono">v.2.4.0 Active</span>
                                            </div>

                                            {/* Radar Chart Simulation & Metrics */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="col-span-2 relative h-40 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden">
                                                    {/* Simulated Radar/Network View */}
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                                                        <div className="w-[120px] h-[120px] border border-green-500/30 rounded-full flex items-center justify-center">
                                                            <div className="w-[80px] h-[80px] border border-blue-500/30 rounded-full flex items-center justify-center">
                                                                <div className="w-[40px] h-[40px] border border-red-500/30 rounded-full animate-pulse" />
                                                            </div>
                                                        </div>
                                                        {/* Radar Lines */}
                                                        <div className="absolute inset-0 rotate-45 border-t border-b border-white/5" />
                                                        <div className="absolute inset-0 -rotate-45 border-t border-b border-white/5" />
                                                    </div>

                                                    {/* Central Score */}
                                                    <div className="z-10 text-center">
                                                        <div className="text-4xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                                                            {seoScore.abVariants[selectedVariantId].score}
                                                        </div>
                                                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Total Score</div>
                                                    </div>

                                                    {/* Floating Nodes */}
                                                    <div className="absolute top-4 left-4 text-[9px] font-mono text-green-400 bg-green-900/20 px-1.5 rounded border border-green-500/30">Keyword: Pass</div>
                                                    <div className="absolute bottom-4 right-4 text-[9px] font-mono text-blue-400 bg-blue-900/20 px-1.5 rounded border border-blue-500/30">Structure: Good</div>
                                                </div>

                                                {Object.entries({
                                                    "Hooking Power": seoScore.abVariants[selectedVariantId].breakdown.hook,
                                                    "Semantic Rel": seoScore.abVariants[selectedVariantId].breakdown.relevance,
                                                    "Readability": seoScore.abVariants[selectedVariantId].breakdown.readability,
                                                    "Viral Index": seoScore.abVariants[selectedVariantId].breakdown.engagement
                                                }).map(([label, val]) => (
                                                    <div key={label} className="bg-white/5 p-3 rounded-xl border border-white/5 group hover:border-purple-500/30 transition-colors">
                                                        <div className="flex justify-between items-end mb-1">
                                                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{label}</div>
                                                            <div className="text-lg font-black text-white leading-none">{val}</div>
                                                        </div>
                                                        <div className="h-1 w-full bg-black/50 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${val}%` }}
                                                                className={cn("h-full", val > 80 ? "bg-gradient-to-r from-green-400 to-emerald-500" : "bg-gradient-to-r from-yellow-400 to-orange-500")}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Advanced Insights */}
                                            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-4">
                                                <h4 className="text-[10px] font-black text-indigo-300 uppercase flex items-center gap-2 mb-3">
                                                    <Sparkles size={12} /> Neural Feedback
                                                </h4>
                                                <div className="space-y-2">
                                                    {seoScore.suggestions.slice(0, 2).map((s, i) => (
                                                        <div key={i} className="flex gap-2 items-start">
                                                            <div className="mt-0.5 w-1 h-1 rounded-full bg-indigo-400 shrink-0" />
                                                            <p className="text-[11px] text-gray-300 leading-relaxed font-medium">{s.text}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-3 pt-3 border-t border-white/5 flex gap-2">
                                                    <span className="text-[9px] px-1.5 py-0.5 bg-black/40 text-gray-500 font-mono rounded">
                                                        Flesch-Kincaid: {seoScore.meta?.fleschKincaid || 'N/A'}
                                                    </span>
                                                    <span className="text-[9px] px-1.5 py-0.5 bg-black/40 text-gray-500 font-mono rounded">
                                                        Key Density: {seoScore.meta?.keyDensity || '0'}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'ab' && (
                                        <div className="space-y-5">
                                            <div className="flex items-center justify-between pb-4 border-b border-white/5">
                                                <div className="flex items-center gap-2">
                                                    <Split size={16} className="text-pink-400" />
                                                    <span className="text-xs font-black text-white uppercase tracking-widest">Quantum A/B/n Matrix</span>
                                                </div>
                                                <div className="flex gap-1">
                                                    {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 bg-pink-500/50 rounded-full animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />)}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-5 gap-1 mb-2 h-24 items-end px-2">
                                                {Object.entries(seoScore.abVariants).map(([version, data], idx) => {
                                                    const height = Math.max(20, data.score);
                                                    const isSelected = selectedVariantId === version;
                                                    return (
                                                        <div key={version} className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => handleVariantSelect(version)}>
                                                            <div className="relative w-full flex justify-center items-end h-full">
                                                                <motion.div
                                                                    initial={{ height: 0 }}
                                                                    animate={{ height: `${height}%` }}
                                                                    className={cn(
                                                                        "w-3 rounded-t-sm transition-all duration-500 relative",
                                                                        isSelected ? "bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.6)] z-10 w-4" : "bg-white/10 group-hover:bg-white/20"
                                                                    )}
                                                                >
                                                                    {isSelected && <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-pink-400">{data.score}</div>}
                                                                </motion.div>
                                                            </div>
                                                            <div className={cn("text-[9px] font-black uppercase", isSelected ? "text-white" : "text-gray-600")}>{version}</div>
                                                        </div>
                                                    )
                                                })}
                                            </div>

                                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                                                {Object.entries(seoScore.abVariants).map(([version, data]) => {
                                                    const isSelected = selectedVariantId === version;
                                                    return (
                                                        <motion.button
                                                            key={version}
                                                            onClick={() => handleVariantSelect(version)}
                                                            className={cn(
                                                                "w-full text-left p-3 rounded-xl border transition-all flex flex-col gap-2 relative overflow-hidden group",
                                                                isSelected ? "bg-pink-500/10 border-pink-500/30" : "bg-white/5 border-white/5 hover:bg-white/10"
                                                            )}
                                                        >
                                                            <div className="flex justify-between items-start w-full z-10">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={cn(
                                                                        "w-4 h-4 flex items-center justify-center rounded text-[9px] font-black",
                                                                        isSelected ? "bg-pink-500 text-white" : "bg-gray-700 text-gray-400"
                                                                    )}>{version}</span>
                                                                    <span className="text-[10px] font-bold text-white truncate max-w-[140px]">{data.title}</span>
                                                                </div>
                                                                <span className={cn("text-[10px] font-black", isSelected ? "text-pink-400" : "text-gray-500")}>{data.score} pts</span>
                                                            </div>
                                                            <p className="text-[10px] text-gray-400 leading-tight z-10 pl-6">{data.description}</p>
                                                            {isSelected && <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-transparent pointer-events-none" />}
                                                        </motion.button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'viral' && (
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between pb-4 border-b border-white/5">
                                                <div className="flex items-center gap-2">
                                                    <TrendingUp size={16} className="text-orange-400" />
                                                    <span className="text-xs font-black text-white uppercase tracking-widest">Viral Velocity</span>
                                                </div>
                                                <span className="text-[10px] px-2 py-0.5 bg-orange-500/10 text-orange-400 rounded border border-orange-500/20 font-bold">PROJECTION</span>
                                            </div>

                                            <div className="relative h-32 w-full bg-gradient-to-t from-orange-500/10 to-transparent rounded-2xl border border-orange-500/10 flex items-end overflow-hidden p-4">
                                                {/* Simulated Graph */}
                                                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                                                    <path d={seoScore.viralPrediction.graphPath || "M0,100 C 50,80 100,20 200,5"} stroke="rgba(249, 115, 22, 0.4)" strokeWidth="3" fill="none" />
                                                    <path d={(seoScore.viralPrediction.graphPath || "M0,100 C 50,80 100,20 200,5") + " V 128 H 0 Z"} fill="url(#orangeGradient)" opacity="0.2" />
                                                    <defs>
                                                        <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="0%" stopColor="#f97316" />
                                                            <stop offset="100%" stopColor="transparent" />
                                                        </linearGradient>
                                                    </defs>
                                                </svg>

                                                <div className="relative z-10 w-full flex justify-between text-[9px] font-bold text-gray-500 uppercase">
                                                    <span>Release</span>
                                                    <span>1h</span>
                                                    <span>6h</span>
                                                    <span>12h</span>
                                                    <span>24h</span>
                                                </div>

                                                <div className="absolute top-4 right-4 text-right">
                                                    <div className="text-2xl font-black text-white">{seoScore.viralPrediction.score}</div>
                                                    <div className="text-[9px] font-bold text-orange-400">VIRAL COEF: {(seoScore.viralPrediction.score / 20).toFixed(1)}x</div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center text-[10px] font-bold text-gray-400">
                                                    <span>Target Audience Match</span>
                                                    <span className="text-white">{seoScore.viralPrediction.audienceMatch || 80}%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-orange-500" style={{ width: `${seoScore.viralPrediction.audienceMatch || 80}%` }} />
                                                </div>

                                                <div className="pt-2 flex flex-wrap gap-2">
                                                    {seoScore.viralPrediction.tags.map(tag => (
                                                        <span key={tag} className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-gray-300 font-medium">#{tag}</span>
                                                    ))}
                                                    <span className="px-2 py-1 bg-orange-500/10 border border-orange-500/20 rounded-lg text-[10px] text-orange-400 font-bold">🔥 {seoScore.viralPrediction.potential}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'keywords' && (
                                        <div className="space-y-5">
                                            <div className="flex items-center justify-between pb-4 border-b border-white/5">
                                                <div className="flex items-center gap-2">
                                                    <Hash size={16} className="text-blue-400" />
                                                    <span className="text-xs font-black text-white uppercase tracking-widest">Semantic Keyword Hub</span>
                                                </div>
                                                <span className="text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20 font-bold">LSI MATRIX</span>
                                            </div>

                                            <div className="bg-black/20 rounded-2xl p-4 border border-white/5 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-2 opacity-20"><Globe size={64} className="text-blue-500" /></div>

                                                <div className="relative z-10 space-y-4">
                                                    <div>
                                                        <div className="text-[9px] font-bold text-gray-500 uppercase mb-1">Primary Keyword</div>
                                                        <div className="text-xl font-black text-white tracking-tight">"{seoScore.keywords?.primary || testContent.title.split(' ')[0]}"</div>
                                                        <div className="flex gap-2 mt-1">
                                                            <span className="text-[9px] text-green-400 font-mono">Vol: {seoScore.keywords?.vol || '12.5k'}</span>
                                                            <span className="text-[9px] text-yellow-400 font-mono">KD: {seoScore.keywords?.kd || '42%'}</span>
                                                        </div>
                                                    </div>

                                                    <div className="pt-2 border-t border-white/5">
                                                        <div className="text-[9px] font-bold text-gray-500 uppercase mb-2">LSI Opportunities</div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {(seoScore.keywords?.lsi || []).map((tag, i) => (
                                                                <span key={tag} className={cn(
                                                                    "px-2 py-1 rounded text-[10px] font-bold border",
                                                                    i === 0 ? "bg-blue-500 text-white border-blue-500 shadow shadow-blue-500/20" : "bg-white/5 text-gray-400 border-white/5"
                                                                )}>
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 p-3 rounded-xl border border-blue-500/20 flex gap-3 items-start">
                                                <div className="mt-0.5 p-1 bg-blue-500 rounded-full text-white"><ArrowRight size={10} /></div>
                                                <div>
                                                    <h5 className="text-[11px] font-bold text-blue-300 mb-1">SEO Action Plan</h5>
                                                    <p className="text-[10px] text-gray-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: seoScore.actionPlan || "분석 결과를 대기 중입니다." }} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>


                        {/* Expert Guide Section at bottom */}
                        {/* Expert Guide Section at bottom */}
                        <div className="bg-white/5 border border-white/10 rounded-[40px] p-8">
                            <h3 className="text-[14px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2"><ChevronRight size={16} className="text-primary" />전문가 가이드 ({selectedPlatform})</h3>
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    {(() => {
                                        const EXPERT_TIPS = {
                                            'YouTube Shorts': [
                                                { icon: Youtube, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', title: 'Retention Strategy', text: '고해상도 시각적 훅(Visual Hook)과 오디오 동기화가 초반 3초 이탈률을 40% 이상 감소시킵니다.' },
                                                { icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', title: 'Algorithm Logic', text: '쇼츠 피드 알고리즘은 "시청 지속 시간(AVD)"을 최우선으로 평가하며, 루프 시청 유도가 핵심입니다.' }
                                            ],
                                            'Instagram': [
                                                { icon: Instagram, color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/20', title: 'Reels Viral Code', text: '10초 미만의 빠른 템포와 인기 오디오 트랙의 빗매칭(Beat-matching)이 탐색 탭 노출 확률을 3배 높입니다.' },
                                                { icon: Zap, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20', title: 'Engagement Context', text: '저장(Save)과 공유(Share)가 좋아요보다 5배 더 높은 가중치를 가집니다. "나중을 위해 저장하세요" 콜투액션이 필수입니다.' }
                                            ],
                                            'Naver Blog': [
                                                { icon: FileText, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', title: 'Smart Block SEO', text: '단순 반복 키워드가 아닌, "사용자 의도(Intent)"를 충족시키는 체류 시간 중심의 문단 구성이 상위 노출의 열쇠입니다.' },
                                                { icon: Hash, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', title: 'Keyword Density', text: '본문 내 핵심 키워드는 0.8% ~ 1.2% 밀도를 유지하며, LSI(연관 검색어)를 자연스럽게 포함해야 합니다.' }
                                            ],
                                            'Threads': [
                                                { icon: MessageCircle, color: 'text-white', bg: 'bg-white/10', border: 'border-white/20', title: 'Thread Velocity', text: '첫 번째 대댓글이 달리는 속도가 도달 범위를 결정합니다. 논쟁적이거나 공감을 유도하는 첫 문장이 중요합니다.' },
                                                { icon: Sparkles, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', title: 'Authentic Tone', text: '완벽하게 정제된 글보다는, 의식의 흐름 기법(Stream of Consciousness)과 인간적인 어조가 250% 더 높은 반응을 이끌어냅니다.' }
                                            ]
                                        };

                                        const currentTips = EXPERT_TIPS[selectedPlatform] || EXPERT_TIPS['YouTube Shorts'];

                                        return currentTips.map((tip, idx) => (
                                            <div key={idx} className="flex gap-4 group">
                                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border", tip.bg, tip.color, tip.border)}>
                                                    <tip.icon size={18} />
                                                </div>
                                                <p className="text-[14px] text-gray-400 leading-relaxed">
                                                    <span className="text-white font-bold block mb-1">{tip.title}</span>
                                                    {tip.text}
                                                </p>
                                            </div>
                                        ));
                                    })()}
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
                    if (addToHistory) {
                        await addToHistory({
                            ...data,
                            id: Date.now(),
                            createdAt: new Date().toISOString(),
                            type: data.platform === 'YouTube Shorts' ? 'video' : 'text',
                            thumbnail: data.platform === 'YouTube Shorts' ? 'https://cdn.dribbble.com/users/122051/screenshots/15694767/media/5858564a934444585f67a6e1330df32d.jpg?resize=400x300&vertical=center' : null
                        });
                    }
                    setIsPreviewOpen(false);

                    // Navigate to History if saved to Archive
                    if (data.actionType === 'save') {
                        addNotification?.("콘텐츠가 보관함에 안전하게 저장되었습니다.", "success");
                        navigate('/history');
                    }
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
