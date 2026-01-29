
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, Calendar, Youtube, Instagram, BookOpen, MessageCircle,
    ChevronLeft, ChevronRight, Eye, Clock, Rocket, Edit2, Plus,
    BarChart3, TrendingUp, Zap, Save, Trash2, BarChart, PieChart,
    Target, CheckCircle2, X, ShieldCheck, Bot, Brain, ArrowRight, AlertCircle, Loader2
} from 'lucide-react';
import { generateContent, PERSONAS } from '../utils/contentGenerator';
import { getPlatformStats } from '../utils/swarmEngine'; // Import updated
import { PreviewModal } from './PreviewModal';
import { useUser } from '../contexts/UserContext';
import { cn } from '../lib/utils';

const PlatformCard = ({ platform, data, onEdit, onSchedule, icon: Icon, color, scheduled }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        className={`bg-surface/40 border rounded-xl p-5 relative overflow-hidden group flex flex-col h-full ${scheduled ? 'border-green-500/30' : 'border-white/5'
            }`}
    >
        <div className={`absolute top-0 left-0 w-1 h-full ${color}`}></div>

        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-white/5`}>
                    <Icon size={20} className="text-white" />
                </div>
                <div>
                    <h4 className="text-white font-semibold">{platform}</h4>
                    {data && (
                        <span className="text-xs text-gray-500">
                            {data.persona ? PERSONAS.find(p => p.id === data.persona)?.name : '기본'}
                        </span>
                    )}
                </div>
            </div>
            {scheduled && (
                <span className="text-xs text-green-400 font-semibold flex items-center gap-1">
                    <Clock size={12} /> 예약됨
                </span>
            )}
        </div>

        {data ? (
            <>
                <div className="mb-4">
                    <p className="text-sm text-gray-300 line-clamp-2 mb-2">{data.title}</p>
                    {data.predictedStats && (
                        <div className="flex items-center gap-4 text-xs">
                            <span className="text-primary flex items-center gap-1">
                                <TrendingUp size={12} />
                                {data.predictedStats.expectViews}
                            </span>
                            <span className="text-indigo-400 flex items-center gap-1">
                                <Zap size={12} />
                                {data.predictedStats.viralityScore}점
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex gap-2 mt-auto">
                    <button
                        onClick={() => onEdit(data)}
                        className="flex-1 py-2 text-xs bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                        <Eye size={14} /> 미리보기
                    </button>
                    <button
                        onClick={() => onSchedule(platform, data)}
                        className="flex-1 py-2 text-xs bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                        <Calendar size={14} /> 예약
                    </button>
                </div>
            </>
        ) : (
            <div className="text-center py-8 text-gray-500 mt-auto">
                <p className="text-sm">생성 대기 중</p>
            </div>
        )}
    </motion.div>
);

const CalendarDay = ({ day, events, isCurrentMonth, onDrop, onEventClick }) => {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        onDrop(day, data);
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`min-h-24 p-2 border-r border-b border-white/5 transition-all ${!isCurrentMonth ? 'bg-white/5 text-gray-600' : 'bg-surface/20'
                } ${isDragOver ? 'bg-primary/20 border-primary' : ''}`}
        >
            <div className={`text-sm font-semibold mb-1 ${!isCurrentMonth ? 'text-gray-600' : 'text-white'}`}>
                {day.getDate()}
            </div>
            <div className="space-y-1">
                {events.map((event, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={() => onEventClick(event)}
                        className={`text-xs px-2 py-1 rounded cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1 ${event.type === 'completed' ? 'opacity-60 grayscale-[0.2]' : 'ring-1 ring-white/20'
                            } ${event.platform === 'YouTube Shorts' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                event.platform === 'Instagram Reels' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' :
                                    event.platform === 'Naver Blog' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                        'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                            }`}
                    >
                        {event.type === 'completed' && <CheckCircle2 size={10} />}
                        {event.platform === 'YouTube Shorts' && '📺'}
                        {event.platform === 'Instagram Reels' && '📸'}
                        {event.platform === 'Naver Blog' && '📝'}
                        {event.platform === 'Threads' && '💬'}
                        <span className="truncate">{event.data.topic}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const StrategicMissionCard = ({ icon: Icon, badge, title, desc, actionLabel, variant = "primary", onClick }) => {
    const isUrgent = variant === "urgent";
    return (
        <div className={cn(
            "relative group p-6 rounded-[28px] border transition-all duration-500 overflow-hidden",
            isUrgent
                ? "bg-red-500/5 border-red-500/20 hover:border-red-500/40 shadow-lg shadow-red-500/5"
                : "bg-surface/30 border-white/5 hover:border-primary/30"
        )}>
            {/* Background Glow */}
            <div className={cn(
                "absolute -right-4 -top-4 w-24 h-24 blur-[40px] opacity-20 transition-opacity",
                isUrgent ? "bg-red-500" : "bg-primary"
            )} />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className={cn(
                        "p-3 rounded-xl",
                        isUrgent ? "bg-red-500/10 text-red-400" : "bg-primary/10 text-primary"
                    )}>
                        <Icon size={20} />
                    </div>
                    {badge && (
                        <span className={cn(
                            "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                            isUrgent ? "bg-red-500/20 text-red-500" : "bg-primary/20 text-primary"
                        )}>
                            {badge}
                        </span>
                    )}
                </div>
                <h4 className="text-white font-black text-lg mb-2 group-hover:text-primary transition-colors">{title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 font-medium">{desc}</p>
                <button
                    onClick={onClick}
                    className={cn(
                        "w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all",
                        isUrgent
                            ? "bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-600/20 active:scale-[0.98]"
                            : "bg-white/5 hover:bg-white/10 text-white border border-white/10 active:scale-[0.98]"
                    )}
                >
                    {actionLabel} <ArrowRight size={14} />
                </button>
            </div>
        </div>
    );
};

const AIBriefingBox = ({ user, activeResult, history }) => {
    const persona = activeResult?.persona || 'witty';

    const getBriefing = () => {
        if (persona === 'witty') {
            return {
                title: "Yo! 오늘의 긴급 속보예요 마스터! 🔥",
                msg: `방금 데이터 센터에서 날아온 소식인데, 어제 올린 ${activeResult?.topic || '게시물'}이 알고리즘을 제대로 탔다니까요? ㅋㅋ 지금 바로 제휴 수익 훅(Hook)을 한두 군데만 더 찔러넣으면 수익률이 수직 상승할 준비가 되어 있습니다! 가즈아~!`,
                icon: Bot
            };
        } else if (persona === 'professional') {
            return {
                title: "Strategy Intelligence: 오늘의 정밀 브리핑",
                msg: `마스터님, 현재 시장 지표 분석 결과 ${activeResult?.topic || '특정 키워드'} 분야의 경쟁사 진입이 둔화되었습니다. 지금이 상위 노출을 독점할 최적의 타이밍입니다. SEO 마스터 보드를 가동하여 점유율 15% 이상 확대를 권장합니다.`,
                icon: Brain
            };
        }
        return {
            title: "안녕하세요 마스터! 오늘의 수익 가이드입니다.",
            msg: "현재 마스터님의 플랫폼 지수가 매우 안정적입니다. 축적된 성과 데이터를 기반으로 새로운 채널 확장을 시도해볼 때입니다. 오늘의 미션을 확인하고 수익 파이프라인을 다각화해보세요.",
            icon: Sparkles
        };
    };

    const briefing = getBriefing();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-[#0b0e14]/40 backdrop-blur-3xl border border-white/5 p-7 rounded-[40px] overflow-hidden group mb-10"
        >
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all duration-700" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary blur-[20px] opacity-20 animate-pulse" />
                    <div className="relative w-16 h-16 bg-gradient-to-br from-primary to-indigo-600 rounded-[22px] flex items-center justify-center text-white shadow-2xl shadow-primary/30 rotate-3">
                        <briefing.icon size={32} />
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center gap-3 mb-3">
                        <h2 className="text-xl font-black text-white tracking-tight">{briefing.title}</h2>
                        <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black text-primary uppercase tracking-widest italic animate-pulse">
                            AI Personalized
                        </span>
                    </div>
                    <p className="text-gray-400 text-base leading-relaxed font-medium max-w-4xl break-keep">
                        "{briefing.msg}"
                    </p>
                </div>

                <div className="flex flex-col gap-2 min-w-[200px]">
                    <div className="relative group/sync p-4 bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                        {/* Scanning Animation */}
                        <motion.div
                            initial={{ y: "-100%" }}
                            animate={{ y: "100%" }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/30 to-transparent h-1/2 w-full z-0 opacity-40"
                        />

                        <div className="relative z-10">
                            <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1 tracking-wider">NETWORK STATUS</span>
                            <div className="flex items-center gap-2 text-white font-black text-sm">
                                <div className="relative w-2 h-2">
                                    <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75" />
                                    <div className="relative w-2 h-2 bg-primary rounded-full" />
                                </div>
                                실시간 동기화 중
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                >
                                    <Loader2 size={12} className="text-primary/50" />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export const StudioView = ({ history = [], isAuthenticated, onRequireAuth }) => {
    const { activeResult, setActiveResult, addToHistory, addNotification, user, revenueSettings } = useUser();

    // Calculate real revenue data for the summary with safety fallback (Moved from GuideView)
    const stats = useMemo(() => {
        return { totalPotential: 0, adRevenue: 0, affiliateRevenue: 0, operationalSavings: 0, growth: "0.0" };
    }, [history, revenueSettings]);

    // Format total assets: e.g. 37.2M or 3.2억 depending on scale
    const formatAssets = (val) => {
        if (!val || isNaN(val)) return '0';
        if (val >= 100000000) return `${(val / 100000000).toFixed(1)} 억`;
        if (val >= 10000) return `${(val / 10000).toFixed(1)} 만`;
        return Math.floor(val).toLocaleString();
    };

    const navigate = (path) => { console.log("Navigate to", path); }; // Dummy navigate for cards or use useNavigate if needed. 
    // Wait, StrategicMissionCard uses onClick={() => navigate(...)}. I need useNavigate.
    // I should import useNavigate from react-router-dom.
    // Let's add useNavigate to imports in a subsequent step or just use window.location for now if easier, but useNavigate is standard.
    // StudioView doesn't seem to use useNavigate currently.

    const [mode, setMode] = useState('single'); // 'single' or 'batch'
    const [topic, setTopic] = useState('');
    const [batchTopics, setBatchTopics] = useState(['', '', '', '', '']);
    const [selectedPersona, setSelectedPersona] = useState('witty');
    const [isGenerating, setIsGenerating] = useState(false);
    const [platformContents, setPlatformContents] = useState({
        'YouTube Shorts': null,
        'Instagram Reels': null,
        'Naver Blog': null,
        'Threads': null
    });

    // Auto-load data from global activeResult (Navigation from History/Topics)
    useEffect(() => {
        if (activeResult) {
            console.log("[StudioView] Loading active result:", activeResult.topic);
            setTopic(activeResult.topic);

            // If it's a single result, populate the corresponding platform slot
            if (activeResult.platform) {
                setPlatformContents(prev => ({
                    ...prev,
                    [activeResult.platform]: activeResult
                }));
            }

            // Option: Clear activeResult after loading so it doesn't persist on next mount
            // setActiveResult(null);
        }
    }, [activeResult]);
    const [batchContents, setBatchContents] = useState([]);
    const [previewData, setPreviewData] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [scheduledEvents, setScheduledEvents] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [templates, setTemplates] = useState([
        { id: 1, name: '바이럴 포맷', persona: 'witty', platforms: 4, usage: 12 },
        { id: 2, name: '전문가 분석', persona: 'analytical', platforms: 4, usage: 8 }
    ]);
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const platforms = [
        { name: 'YouTube Shorts', icon: Youtube, color: 'bg-red-500' },
        { name: 'Instagram Reels', icon: Instagram, color: 'bg-pink-500' },
        { name: 'Naver Blog', icon: BookOpen, color: 'bg-green-500' },
        { name: 'Threads', icon: MessageCircle, color: 'bg-gray-500' }
    ];

    const recommendedTags = useMemo(() => {
        // Default 10 tags when no topic is entered
        const defaults = ['#급상승', '#꿀팁', '#트렌드', '#정보', '#이슈', '#추천', '#필독', '#인사이트', '#공유', '#소통'];

        if (!topic) return defaults;

        // Dynamic 10 tags based on topic
        const keyword = topic.split(' ')[0] || '정보';
        return [
            `#${keyword}`,
            `#${keyword}팁`,
            `#${keyword}추천`,
            `#${keyword}정보`,
            '#필수',
            '#트렌드',
            '#꿀팁',
            '#정보공유',
            '#인사이트',
            '#공감'
        ];
    }, [topic]);

    const handleAddTag = (tag) => {
        if (!topic.includes(tag)) {
            setTopic(prev => prev ? `${prev} ${tag}` : tag);
        }
    };

    const handleGenerateAll = async () => {
        if (!isAuthenticated) {
            onRequireAuth();
            return;
        }
        if (!topic.trim()) {
            addNotification("생성할 주제를 먼저 입력해주세요.", "warning");
            return;
        }

        setIsGenerating(true);

        try {
            const contents = {};
            await Promise.all(platforms.map(async ({ name }) => {
                contents[name] = await generateContent(name, topic, selectedPersona);
            }));
            setPlatformContents(contents);

            // Save to History (보관함 저장)
            const resultRecord = {
                id: Date.now(),
                topic: topic,
                platform: 'Multi-OSMU', // 단일 플랫폼이 아닌 OSMU 세트임을 명시
                contents: contents,
                createdAt: new Date().toISOString(),
                persona: selectedPersona
            };
            addToHistory(resultRecord);
            setActiveResult(resultRecord);
            addNotification("콘텐츠가 생성되어 보관함에 저장되었습니다.", "success");
        } catch (error) {
            console.error("Batch generation failed:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleBatchGenerate = async () => {
        if (!isAuthenticated) {
            onRequireAuth();
            return;
        }
        const validTopics = batchTopics.filter(t => t.trim());
        if (validTopics.length === 0) {
            addNotification("최소 1개 이상의 주제를 입력해주세요.", "warning");
            return;
        }

        setIsGenerating(true);

        try {
            const allContents = [];
            await Promise.all(validTopics.map(async (topicText) => {
                const topicContents = {};
                await Promise.all(platforms.map(async ({ name }) => {
                    topicContents[name] = await generateContent(name, topicText, selectedPersona);
                }));
                allContents.push({
                    topic: topicText,
                    contents: topicContents,
                    id: Date.now() + Math.random()
                });
            }));
            setBatchContents(allContents);

            // Save Batch Results to History
            allContents.forEach(item => {
                addToHistory({
                    id: Date.now() + Math.random(),
                    topic: item.topic,
                    platform: 'Multi-OSMU (Batch)',
                    contents: item.contents,
                    createdAt: new Date().toISOString(),
                    persona: selectedPersona
                });
            });
            addNotification(`${allContents.length}개의 주제에 대한 콘텐츠가 보관함에 저장되었습니다.`, "success");
        } catch (error) {
            console.error("Batch generation failed:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleEditContent = (data) => {
        setPreviewData(data);
        setShowPreview(true);
    };

    const handleSchedule = (platform, data) => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(14, 0, 0, 0);

        setScheduledEvents([...scheduledEvents, {
            id: Date.now(),
            date: tomorrow,
            platform,
            data
        }]);
    };

    const handleCalendarDrop = (date, eventData) => {
        const newEvent = {
            ...eventData,
            date: date,
            id: Date.now()
        };
        setScheduledEvents([...scheduledEvents, newEvent]);
    };

    const handleEventClick = (event) => {
        setPreviewData(event.data);
        setShowPreview(true);
    };

    const handleSaveTemplate = () => {
        const newTemplate = {
            id: Date.now(),
            name: `${topic || '새 템플릿'} - ${PERSONAS.find(p => p.id === selectedPersona).name}`,
            persona: selectedPersona,
            platforms: 4,
            usage: 0
        };
        setTemplates([...templates, newTemplate]);
    };

    const handleLoadTemplate = (template) => {
        setSelectedPersona(template.persona);
        setSelectedTemplate(template);
        setShowTemplateModal(false);
    };

    // Calendar logic
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay();

        const days = [];

        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startDayOfWeek - 1; i >= 0; i--) {
            days.push({
                date: new Date(year, month - 1, prevMonthLastDay - i),
                isCurrentMonth: false
            });
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                date: new Date(year, month, i),
                isCurrentMonth: true
            });
        }

        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                date: new Date(year, month + 1, i),
                isCurrentMonth: false
            });
        }

        return days;
    };

    const getEventsForDay = (day) => {
        // 1. Scheduled Events (Future)
        const schedules = scheduledEvents.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getDate() === day.getDate() &&
                eventDate.getMonth() === day.getMonth() &&
                eventDate.getFullYear() === day.getFullYear();
        });

        // 2. History Entries (Past/Completed)
        const historyEvents = history.filter(item => {
            const historyDate = new Date(item.createdAt || item.date); // Fallback to item.date
            return historyDate.getDate() === day.getDate() &&
                historyDate.getMonth() === day.getMonth() &&
                historyDate.getFullYear() === day.getFullYear();
        }).map(item => ({
            id: item.id,
            date: item.createdAt,
            platform: item.platform,
            type: 'completed', // 구분값
            data: item
        }));

        return [...schedules, ...historyEvents];
    };

    const calendarDays = getDaysInMonth(currentDate);

    // Dynamic statistics from Swarm Engine (Stable per session)
    const [platformStats] = useState(() => getPlatformStats());

    return (
        <div className="max-w-[1440px] mx-auto p-6 md:p-8">
            {/* Header */}
            {/* Header with Image Mode Selectors */}
            <div className="mb-8 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Target className="text-primary" size={32} />
                        콘텐츠 전략 기획실
                    </h1>
                    <p className="text-gray-400">주간/월간 콘텐츠를 효율적으로 기획하고 관리하세요</p>
                </div>

                {/* Right: Image Button Mode Switcher */}
                <div className="flex gap-4 w-full xl:w-auto">
                    {/* Single Mode Button */}
                    <button
                        className={`group relative flex-1 xl:w-56 h-24 rounded-2xl overflow-hidden border transition-all shadow-xl text-left ${mode === 'single' ? 'border-primary ring-2 ring-primary/50' : 'border-white/10 hover:border-primary/50'}`}
                        onClick={() => setMode('single')}
                    >
                        <div className="absolute inset-0">
                            <img
                                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
                                className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700"
                                alt="Single"
                            />
                            <div className={`absolute inset-0 bg-gradient-to-r ${mode === 'single' ? 'from-indigo-900/90' : 'from-gray-900/90'} to-transparent transition-colors duration-500`} />
                        </div>
                        <div className="absolute inset-0 p-4 flex flex-col justify-center">
                            <div className="inline-flex items-center gap-2 mb-1">
                                <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${mode === 'single' ? 'bg-indigo-500/30 text-indigo-300' : 'bg-white/10 text-gray-400'}`}>
                                    Fast Track
                                </span>
                            </div>
                            <h3 className="text-base font-black text-white group-hover:text-indigo-200 transition-colors">단일 생성</h3>
                            <p className="text-[10px] text-gray-400">4개 플랫폼 동시 최적화</p>
                        </div>
                    </button>

                    {/* Batch Mode Button */}
                    <button
                        className={`group relative flex-1 xl:w-56 h-24 rounded-2xl overflow-hidden border transition-all shadow-xl text-left ${mode === 'batch' ? 'border-emerald-500 ring-2 ring-emerald-500/50' : 'border-white/10 hover:border-emerald-500/50'}`}
                        onClick={() => setMode('batch')}
                    >
                        <div className="absolute inset-0">
                            <img
                                src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2832&auto=format&fit=crop"
                                className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700"
                                alt="Batch"
                            />
                            <div className={`absolute inset-0 bg-gradient-to-r ${mode === 'batch' ? 'from-emerald-900/90' : 'from-gray-900/90'} to-transparent transition-colors duration-500`} />
                        </div>
                        <div className="absolute inset-0 p-4 flex flex-col justify-center">
                            <div className="inline-flex items-center gap-2 mb-1">
                                <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${mode === 'batch' ? 'bg-emerald-500/30 text-emerald-300' : 'bg-white/10 text-gray-400'}`}>
                                    Bulk Auto
                                </span>
                            </div>
                            <h3 className="text-base font-black text-white group-hover:text-emerald-200 transition-colors">주간 배치</h3>
                            <p className="text-[10px] text-gray-400">20개 콘텐츠 일괄 생산</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Statistics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {platformStats.map((stat, idx) => {
                    const isSelected = activeResult?.platform?.includes(stat.name);
                    return (
                        <motion.div
                            key={stat.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={cn(
                                "bg-surface/30 border rounded-[24px] p-6 transition-all relative overflow-hidden group",
                                isSelected ? "border-indigo-500 bg-indigo-500/5 shadow-2xl" : "border-white/5"
                            )}
                        >
                            {isSelected && (
                                <div className="absolute top-0 right-0 p-3 opacity-20">
                                    <Target size={40} className="text-indigo-500" />
                                </div>
                            )}
                            <div className="flex items-center justify-between mb-4">
                                <h4 className={cn("text-sm font-black uppercase tracking-widest", isSelected ? "text-indigo-400" : "text-gray-500")}>
                                    {stat.name}
                                </h4>
                                <span className="text-green-400 text-xs font-black">{stat.growth}</span>
                            </div>
                            <div className="mb-4">
                                <div className="text-3xl font-black text-white mb-1 tracking-tight">{stat.expected}</div>
                                <div className="text-xs text-gray-500 font-bold uppercase tracking-tighter">예상 조회수</div>
                                {stat.trend && (
                                    <div className="mt-2 text-xs text-primary/80 font-medium flex items-center gap-1">
                                        <Zap size={12} />
                                        {stat.trend}
                                    </div>
                                )}
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stat.value}%` }}
                                    transition={{ duration: 1, delay: idx * 0.1 }}
                                    className={cn("h-full transition-all duration-1000", isSelected ? "bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" : stat.color)}
                                />
                            </div>
                            {isSelected && (
                                <div className="mt-4 pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                        <span className="text-[9px] font-black text-indigo-400 uppercase">Selected Strategy Target</span>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Mode Selector */}
            {/* Mode Selector Removed (Replaced by Header Buttons) */}

            {/* Generator Section */}
            <div className="mb-12 p-8 bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Zap className="text-primary" />
                        {mode === 'single' ? '단일 콘텐츠 생성' : '주간 배치 생성'}
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowTemplateModal(true)}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-sm transition-colors flex items-center gap-2"
                        >
                            <BookOpen size={16} />
                            템플릿 불러오기
                        </button>
                        {(platformContents['YouTube Shorts'] || batchContents.length > 0) && (
                            <button
                                onClick={handleSaveTemplate}
                                className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm transition-colors flex items-center gap-2"
                            >
                                <Save size={16} />
                                템플릿 저장
                            </button>
                        )}
                    </div>
                </div>

                {mode === 'single' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="text-sm text-gray-400 mb-2 block">주제 입력</label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="예: 다이어트, 재테크, 게임 공략..."
                                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                            />
                            {/* Restored Hashtag Suggestions */}
                            <div className="mt-3 flex flex-wrap gap-2">
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider py-1">추천 태그:</div>
                                {recommendedTags.map((tag, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleAddTag(tag)}
                                        className="px-2.5 py-1 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/30 rounded-full text-[11px] text-gray-400 hover:text-primary transition-all active:scale-95"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 mb-2 block">AI 페르소나</label>
                            <div className="flex gap-2">
                                {PERSONAS.map(persona => (
                                    <button
                                        key={persona.id}
                                        onClick={() => setSelectedPersona(persona.id)}
                                        className={`flex-1 py-2 px-3 rounded-lg border text-sm transition-all ${selectedPersona === persona.id
                                            ? 'border-primary bg-primary/20 text-white'
                                            : 'border-white/10 text-gray-400 hover:border-white/30'
                                            }`}
                                    >
                                        <span className="mr-1">{persona.icon}</span>
                                        <span className="hidden lg:inline">{persona.name.split(' ')[0]}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mb-6">
                        <label className="text-sm text-gray-400 mb-3 block">5개 주제 입력 (주간 계획)</label>
                        <div className="grid grid-cols-1 gap-3 mb-4">
                            {batchTopics.map((t, idx) => (
                                <input
                                    key={idx}
                                    type="text"
                                    value={t}
                                    onChange={(e) => {
                                        const newTopics = [...batchTopics];
                                        newTopics[idx] = e.target.value;
                                        setBatchTopics(newTopics);
                                    }}
                                    placeholder={`주제 ${idx + 1} (예: ${['다이어트', '재테크', '운동', '요리', '게임'][idx]})`}
                                    className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                                />
                            ))}
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 mb-2 block">공통 페르소나</label>
                            <div className="flex gap-2">
                                {PERSONAS.map(persona => (
                                    <button
                                        key={persona.id}
                                        onClick={() => setSelectedPersona(persona.id)}
                                        className={`flex-1 py-2 px-3 rounded-lg border text-sm transition-all ${selectedPersona === persona.id
                                            ? 'border-primary bg-primary/20 text-white'
                                            : 'border-white/10 text-gray-400 hover:border-white/30'
                                            }`}
                                    >
                                        <span className="mr-1">{persona.icon}</span>
                                        <span className="hidden lg:inline">{persona.name.split(' ')[0]}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <button
                    onClick={mode === 'single' ? handleGenerateAll : handleBatchGenerate}
                    disabled={isGenerating}
                    className="w-full py-4 bg-primary hover:bg-primary/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                    {isGenerating ? (
                        <>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            >
                                <Sparkles size={20} />
                            </motion.div>
                            {mode === 'single' ? 'AI 생성 중...' : '배치 생성 중 (약 3초)...'}
                        </>
                    ) : (
                        <>
                            <Rocket size={20} />
                            {mode === 'single' ? '4개 플랫폼 동시 생성' : '20개 콘텐츠 배치 생성'}
                        </>
                    )}
                </button>
            </div>

            {/* Results */}
            {mode === 'single' && platformContents['YouTube Shorts'] && (
                <div className="mb-12">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <CheckCircle2 className="text-green-400" />
                        생성된 콘텐츠
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {platforms.map(({ name, icon, color }) => (
                            <PlatformCard
                                key={name}
                                platform={name}
                                data={platformContents[name]}
                                onEdit={handleEditContent}
                                onSchedule={handleSchedule}
                                icon={icon}
                                color={color}
                                scheduled={scheduledEvents.some(e => e.platform === name)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {mode === 'batch' && batchContents.length > 0 && (
                <div className="mb-12">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <CheckCircle2 className="text-green-400" />
                        배치 생성 결과 ({batchContents.length}개 주제 × 4개 플랫폼 = {batchContents.length * 4}개 콘텐츠)
                    </h3>
                    <div className="space-y-6">
                        {batchContents.map((batch, bIdx) => (
                            <div key={batch.id} className="bg-surface/20 border border-white/5 rounded-xl p-6">
                                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center">{bIdx + 1}</span>
                                    {batch.topic}
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {platforms.map(({ name, icon, color }) => (
                                        <PlatformCard
                                            key={name}
                                            platform={name}
                                            data={batch.contents[name]}
                                            onEdit={handleEditContent}
                                            onSchedule={handleSchedule}
                                            icon={icon}
                                            color={color}
                                            scheduled={scheduledEvents.some(e => e.platform === name && e.data.topic === batch.topic)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Content Calendar */}
            <div className="bg-surface/30 border border-white/5 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Calendar className="text-primary" />
                        발행 캘린더
                    </h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <ChevronLeft className="text-gray-400" />
                        </button>
                        <span className="text-white font-semibold min-w-32 text-center">
                            {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
                        </span>
                        <button
                            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <ChevronRight className="text-gray-400" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7">
                    {['일', '월', '화', '수', '목', '금', '토'].map(day => (
                        <div key={day} className="p-3 text-center font-semibold text-gray-400 text-sm border-r border-b border-white/5">
                            {day}
                        </div>
                    ))}
                    {calendarDays.map((day, idx) => (
                        <CalendarDay
                            key={idx}
                            day={day.date}
                            events={getEventsForDay(day.date)}
                            isCurrentMonth={day.isCurrentMonth}
                            onDrop={handleCalendarDrop}
                            onEventClick={handleEventClick}
                        />
                    ))}
                </div>
            </div>



            {/* Template Modal */}
            <AnimatePresence>
                {showTemplateModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                        onClick={() => setShowTemplateModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-surface border border-white/10 rounded-xl p-6 max-w-2xl w-full"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">저장된 템플릿</h3>
                                <button
                                    onClick={() => setShowTemplateModal(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {templates.map(template => (
                                    <div
                                        key={template.id}
                                        className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/5 hover:border-primary/50 transition-colors cursor-pointer"
                                        onClick={() => handleLoadTemplate(template)}
                                    >
                                        <div>
                                            <h4 className="text-white font-semibold">{template.name}</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-xs text-gray-500">{template.platforms}개 플랫폼</span>
                                                <span className="text-xs text-gray-500">•</span>
                                                <span className="text-xs text-gray-500">사용 {template.usage}회</span>
                                            </div>
                                        </div>
                                        <button className="px-4 py-2 bg-primary/20 text-primary rounded-lg text-sm hover:bg-primary/30 transition-colors">
                                            불러오기
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Preview Modal */}
            <PreviewModal
                isOpen={showPreview}
                onClose={() => setShowPreview(false)}
                onConfirm={async (data) => {
                    console.log("🚀 onConfirm 실행됨:", data.platform);

                    try {
                        // 1. Save to global history (Updates Revenue Graph immediately)
                        await addToHistory(data);

                        // Platform-specific actions
                        if (data.platform === 'Naver Blog') {
                            // 1. Copy to Clipboard
                            const blogContent = `${data.title}\n\n${data.content || (data.sections ? data.sections.map(s => `${s.title}\n${s.content}`).join('\n\n') : '')}\n\n${data.hashtags}`;

                            try {
                                await navigator.clipboard.writeText(blogContent);
                                alert(`📋 콘텐츠가 복사되었습니다!\n\n자동으로 열리는 네이버 블로그 에디터에 [Ctrl+V]로 붙여넣으세요.`);
                            } catch (err) {
                                console.error('Clipboard copy failed:', err);
                                alert(`⚠️ 클립보드 복사에 실패했습니다. 직접 내용을 복사해주세요.`);
                            }

                            // 2. Open Naver Blog Editor
                            // 순서 변경: window.open을 먼저 실행하여 브라우저 차단 방지 + Referrer 제거
                            const newWindow = window.open('https://blog.editor.naver.com/editor', '_blank', 'noopener,noreferrer');

                            // 3. User Guidance (After window opens)
                            setTimeout(() => {
                                if (newWindow) {
                                    alert(`📋 클립보드 복사 완료!\n\n네이버 에디터가 열리면 [Ctrl+V]로 붙여넣으세요.\n\n(로그인이 필요한 경우, 로그인 후 창을 닫고 다시 시도하거나 에디터 URL로 이동해주세요)`);
                                } else {
                                    alert(`⚠️ 팝업이 차단되었습니다. 주소창 우측에서 팝업을 허용해주세요.`);
                                }
                            }, 500);
                        } else {
                            // Other Platforms
                            alert(`🚀 ${data.platform} 업로드 요청이 전송되었습니다.\n잠시 후 모바일 앱 알림을 확인해주세요.`);
                        }

                        // 4. Visual Feedback in Calendar & Close Modal
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        setScheduledEvents(prev => [...prev, {
                            id: Date.now(),
                            date: tomorrow,
                            platform: data.platform,
                            data: data,
                            type: 'completed'
                        }]);

                        // Close Modal strictly AFTER actions
                        setShowPreview(false);

                    } catch (error) {
                        console.error("onConfirm Error:", error);
                        alert("처리 중 오류가 발생했습니다. 다시 시도해주세요.");
                    }
                }}
                data={previewData}
            />
        </div>
    );
};
