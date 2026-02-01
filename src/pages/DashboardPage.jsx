import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, TrendingUp, Youtube, Instagram, Plus, CreditCard, Users, Crown, ArrowRight, Clock, CheckCircle2, AlertCircle, FileText, Layout, ChevronRight, Sparkles, DollarSign, Coins, Globe, Target, ShieldCheck, ArrowUpRight, X, PenTool, Search, Rocket, Activity, Radar, Info } from 'lucide-react';
import { DashboardService } from '../services/DashboardService';
import { useUser } from '../contexts/UserContext';
import { HomePageSEO } from '../components/SEOHead';
import { FreeTrialCard } from '../components/FreeTrialCard';
import { ZeroStateTemplates } from '../components/ZeroStateTemplates';
import { AutonomousMorningReport } from '../components/AutonomousMorningReport';
import { GoogleAnalyticsWidget } from '../components/GoogleAnalyticsWidget';
import { NICHES, getSwarmInsights, simulateSwarmAction } from '../utils/swarmEngine';
import { cn } from '../lib/utils';
import { useQuery } from '@tanstack/react-query';

// Atomic Widgets
import ProductivityWidget from '../components/dashboard/ProductivityWidget';
import RevenueSnapshotWidget from '../components/dashboard/RevenueSnapshotWidget';
import StrategicSwarmWidget from '../components/dashboard/StrategicSwarmWidget';
import RecentProjectsWidget from '../components/dashboard/RecentProjectsWidget';
import PlatformStatusWidget from '../components/dashboard/PlatformStatusWidget';
import ErrorBoundary from '../components/ErrorBoundary';

const GLASS_CARD_CLASSES = "bg-[#0f1218]/60 backdrop-blur-2xl border border-white/5 shadow-2xl relative overflow-hidden group transition-all duration-500";

const PLAN_CONFIG = {
    starter: {
        badge: 'STARTER',
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
        badge: 'PRO',
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
        badge: 'BUSINESS',
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

const ExpertTooltip = ({ title, content, children, side = "bottom" }) => (
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

const DashboardMissionFeed = () => {
    const [log, setLog] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setLog(DashboardService.generateMissionLog());
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-[420px] pointer-events-none hidden lg:block mr-4">
            <AnimatePresence mode="wait">
                {log && (
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
                )}
            </AnimatePresence>
        </div>
    );
};

const DashboardPage = () => {
    const {
        user,
        history = [],
        connectedAccounts = [],
        disconnectAccount,
        connectAccount,
        addNotification,
        isAuthenticated,
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
    const lastNotifiedRef = React.useRef(null);

    // [TanStack Query] 서버 상태 관리
    const { data: dailyDrafts = [] } = useQuery({
        queryKey: ['autonomousBriefing', user?.id],
        queryFn: () => DashboardService.getAutonomousBriefing(),
        enabled: !!isAuthenticated,
        refetchInterval: 10 * 60 * 1000,
        staleTime: 5 * 60 * 1000
    });

    useEffect(() => {
        if (dailyDrafts && dailyDrafts.length > 0) {
            const draftsHash = JSON.stringify(dailyDrafts.map(d => d.topic)); // 간단한 중복 체크용 해시
            if (lastNotifiedRef.current !== draftsHash) {
                setShowBriefing(true);
                addNotification("자율 주행 엔진: 새로운 황금 키워드가 발굴되었습니다.", "info");
                lastNotifiedRef.current = draftsHash;
            }
        }
    }, [dailyDrafts, addNotification]);

    const { savedHours, potentialViews } = DashboardService.calculateProductivity(history.length);
    const revenueData = DashboardService.calculateRevenueSnapshot(history);
    const currentPlanId = user?.plan || 'free';
    const config = PLAN_CONFIG[currentPlanId] || PLAN_CONFIG.starter;

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
                            content="전 세계 소셜 미디어 데이터를 수집하여 매일 아침 제공되는 AI 브리핑입니다."
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowMorningReport(true)}
                                className="bg-gradient-to-br from-indigo-600 to-purple-600 px-6 py-2.5 rounded-2xl flex items-center gap-3 transition-all group min-h-[70px] shadow-lg shadow-indigo-500/20"
                            >
                                <Radar size={20} className="text-white group-hover:rotate-45 transition-transform" />
                                <div className="flex flex-col items-start text-left">
                                    <span className="text-[10px] font-black text-white/70 uppercase">Autonomous SWARM</span>
                                    <span className="text-sm font-black text-white uppercase">모닝 통합 리포트</span>
                                </div>
                                <ChevronRight size={16} className="text-white/50 ml-2" />
                            </motion.button>
                        </ExpertTooltip>
                    </div>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <ZeroStateTemplates onTemplateClick={(template) => navigate(`/topics?q=${encodeURIComponent(template.example)}`)} />
                </motion.div>

                {/* 2. Top Analytics Row */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-8 text-left">
                    <div className="lg:col-span-6 h-[290px]">
                        <ErrorBoundary>
                            <ProductivityWidget
                                user={user}
                                history={history}
                                savedHours={savedHours}
                                potentialViews={potentialViews}
                                config={config}
                                navigate={navigate}
                            />
                        </ErrorBoundary>
                    </div>
                    <div className="lg:col-span-6 h-[290px]">
                        <ErrorBoundary>
                            <RevenueSnapshotWidget
                                totalPotential={revenueData.totalPotential}
                                breakdown={revenueData.breakdown}
                                navigate={navigate}
                            />
                        </ErrorBoundary>
                    </div>
                </div>

                <div className="mb-8 text-left">
                    <ErrorBoundary>
                        <GoogleAnalyticsWidget />
                    </ErrorBoundary>
                </div>

                <div className="mb-8 text-left">
                    <ErrorBoundary>
                        <StrategicSwarmWidget
                            setActiveResult={setActiveResult}
                            addNotification={addNotification}
                            navigate={navigate}
                        />
                    </ErrorBoundary>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 mb-8 text-left">
                    <div className="md:col-span-7 lg:col-span-8 h-[360px]">
                        <ErrorBoundary>
                            <RecentProjectsWidget history={history} onNavigate={navigate} />
                        </ErrorBoundary>
                    </div>
                    <div className="md:col-span-5 lg:col-span-4 h-[360px]">
                        <ErrorBoundary>
                            <PlatformStatusWidget
                                connectedAccounts={connectedAccounts}
                                onConnect={(id) => onConnectRequest(id)}
                                onDisconnect={disconnectAccount}
                                activeResult={activeResult}
                                activePlatform={activePlatform}
                                setActivePlatform={setActivePlatform}
                            />
                        </ErrorBoundary>
                    </div>
                </div>
            </div>

            {/* Daily Intelligence Briefing Modal */}
            <AnimatePresence>
                {showBriefing && dailyDrafts && (
                    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#0f1218] border border-white/10 rounded-[40px] max-w-[95%] lg:max-w-4xl w-full max-h-[95vh] overflow-y-auto p-8 md:p-12 shadow-2xl relative"
                        >
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 w-fit mb-4">
                                        <Sparkles size={14} />
                                        <span className="text-[10px] font-black uppercase">Autonomous Intelligence Briefing</span>
                                    </div>
                                    <h2 className="text-3xl font-black text-white">오늘의 <span className="text-indigo-400">황금 키워드</span></h2>
                                </div>
                                <button onClick={() => setShowBriefing(false)} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-500"><X /></button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {dailyDrafts.map((draft, idx) => (
                                    <div
                                        key={idx}
                                        onClick={async () => {
                                            const goldenItem = {
                                                ...draft,
                                                id: Date.now(),
                                                isGoldenKeyword: true,
                                                createdAt: new Date().toISOString()
                                            };
                                            await addToHistory(goldenItem);
                                            setActiveResult(goldenItem);
                                            navigate('/studio');
                                            addNotification(`✨ '${draft.topic}'이 보관함에 황금 키워드로 저장되었습니다.`, "success");
                                        }}
                                        className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-indigo-500/30 transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <TrendingUp className="text-emerald-400" size={16} />
                                            <span className="text-emerald-400 text-xs font-black">{draft.intelligence?.roi}</span>
                                        </div>
                                        <h4 className="text-white font-black text-lg mb-2 group-hover:text-indigo-400">{draft.topic}</h4>
                                        <p className="text-sm text-gray-500 line-clamp-3">{draft.intelligence?.reason}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showMorningReport && (
                    <AutonomousMorningReport onClose={() => setShowMorningReport(false)} />
                )}
            </AnimatePresence>
        </>
    );
};

export default DashboardPage;
