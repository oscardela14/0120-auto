import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Radar, Target, Search, Layout, ArrowUpRight, Sparkles, X, PenTool } from 'lucide-react';
import { NICHES, getSwarmInsights, simulateSwarmAction } from '../../utils/swarmEngine';
import { cn } from '../../lib/utils';

const GLASS_CARD_CLASSES = "bg-[#0f1218]/60 backdrop-blur-2xl border border-white/5 shadow-2xl relative overflow-hidden group transition-all duration-500";

const SwarmTooltip = ({ children }) => (
    <div className="group/swarm relative inline-block">
        {children}
        <div className="absolute top-1/2 left-[calc(100%+24px)] w-72 p-5 bg-[#1a1c26]/98 border border-white/10 rounded-[20px] text-[12px] text-gray-400 leading-normal shadow-3xl opacity-0 invisible group-hover/swarm:opacity-100 group-hover/swarm:visible pointer-events-none transition-all duration-300 z-[500] backdrop-blur-3xl -translate-y-1/2 -translate-x-2 group-hover/swarm:translate-x-0 text-left">
            <div className="absolute top-1/2 -left-2 -translate-y-1/2 border-8 border-transparent border-r-[#1a1c26]" />
            <div className="font-black text-[13px] text-white mb-2 flex items-center gap-1.5 border-b border-white/5 pb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Swarm Intel
            </div>
            <ul className="space-y-2">
                <li className="flex gap-1.5">
                    <span className="text-indigo-400 font-bold">●</span>
                    <span><strong className="text-gray-100">실시간 감시:</strong> 22인의 에이전트 분석</span>
                </li>
                <li className="flex gap-1.5">
                    <span className="text-emerald-400 font-bold">●</span>
                    <span><strong className="text-gray-100">수익 최적화:</strong> 고수익 시장 선별 제안</span>
                </li>
                <li className="flex gap-1.5">
                    <span className="text-purple-400 font-bold">●</span>
                    <span><strong className="text-gray-100">자율 대응:</strong> 리포트 즉시 자동 생성</span>
                </li>
            </ul>
        </div>
    </div>
);

const ReconTooltip = ({ insight, children }) => (
    <div className="group/recon relative">
        {children}
        <div className="absolute bottom-full left-0 mb-6 w-72 p-6 bg-[#0c0e14]/98 border border-white/10 rounded-[28px] opacity-0 invisible group-hover/recon:opacity-100 group-hover/recon:visible transition-all duration-300 z-[100] backdrop-blur-3xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] translate-y-2 group-hover/recon:translate-y-0 text-left">
            <div className="absolute -bottom-1.5 left-8 w-3 h-3 bg-[#0c0e14] border-r border-b border-white/10 rotate-45" />
            <div className="flex items-center gap-2 text-indigo-400 font-black text-[11px] border-b border-white/5 pb-3 mb-4">
                <Radar size={14} className="animate-spin-slow" /> RECON REPORT
            </div>
            <div className="space-y-4">
                <div>
                    <div className="text-[10px] text-gray-500 font-black uppercase mb-1.5 tracking-widest">Market Gap</div>
                    <p className="text-[12px] text-white font-bold leading-relaxed pr-2">{insight?.recon?.gap}</p>
                </div>
                <div>
                    <div className="text-[10px] text-gray-500 font-black uppercase mb-1.5 tracking-widest">SEO Density</div>
                    <p className="text-[12px] text-white font-bold leading-relaxed pr-2">{insight?.recon?.density}</p>
                </div>
                <div className="pt-3 border-t border-white/5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-gray-500 font-black uppercase">Win Probability</span>
                        <span className="text-[13px] text-emerald-400 font-black">{insight?.recon?.winProb}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${insight?.recon?.winProb}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const ShinyCard = ({ children, className = "", spotlightColor = "rgba(99, 102, 241, 0.15)" }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    return (
        <div
            onMouseMove={handleMouseMove}
            className={`relative group/shiny ${className.includes('overflow-') ? className : `overflow-hidden ${className}`}`}
        >
            <div
                className="pointer-events-none absolute inset-0 z-[1] opacity-0 group-hover/shiny:opacity-100 transition-opacity duration-500"
                style={{
                    background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, ${spotlightColor}, transparent 40%)`
                }}
            />
            <div className="relative z-[2] h-full">
                {children}
            </div>
        </div>
    );
};

const StrategicSwarmWidget = ({ setActiveResult, addNotification, navigate }) => {
    const insights = getSwarmInsights();
    const [selectedNiche, setSelectedNiche] = useState(null);
    const [activeLogs, setActiveLogs] = useState([]);
    const [selectionTarget, setSelectionTarget] = useState(null);

    useEffect(() => {
        if (selectedNiche) {
            const interval = setInterval(() => {
                const newLog = simulateSwarmAction(selectedNiche.id);
                setActiveLogs(prev => [newLog, ...prev].slice(0, 5));
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [selectedNiche]);

    return (
        <div className={`${GLASS_CARD_CLASSES.replace('overflow-hidden', 'overflow-visible')} rounded-[40px] p-8 lg:p-10 flex flex-col gap-8 bg-transparent shadow-none border-none`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 relative">
                        <Users size={28} />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-[#0f1218] animate-pulse" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-black text-white tracking-tight whitespace-nowrap">
                                <SwarmTooltip>
                                    <span className="cursor-help hover:text-indigo-400 transition-colors">전략적 에이전트 군집 (Agentic Swarm)</span>
                                </SwarmTooltip>
                            </h3>
                            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest whitespace-nowrap">Global Syncing...</span>
                            </div>
                        </div>
                        <p className="text-base text-gray-500 font-medium tracking-tight">수십 명의 AI 에이전트가 소셜 전선 전역을 실시간으로 감시하고 있습니다.</p>
                    </div>
                </div>

                <div className="flex items-center gap-6 px-6 py-3 bg-white/5 rounded-2xl border border-white/5">
                    <div className="text-center">
                        <div className="text-[10px] text-gray-600 font-black uppercase tracking-tighter">Total Agents</div>
                        <div className="text-lg font-black text-white">22</div>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="text-center">
                        <div className="text-[10px] text-gray-600 font-black uppercase tracking-tighter">Swarm Health</div>
                        <div className="text-lg font-black text-emerald-400">97%</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {NICHES.slice(0, 4).map((niche) => {
                    const insight = insights.find(i => i.niche === niche.id);
                    return (
                        <ShinyCard key={niche.id} spotlightColor="rgba(99, 102, 241, 0.25)" className="rounded-3xl overflow-visible">
                            <motion.div
                                whileHover={{ y: -5 }}
                                onClick={() => setSelectedNiche(niche)}
                                className="bg-black/40 border border-white/5 p-6 hover:border-indigo-500/30 transition-all group/niche relative rounded-3xl cursor-pointer"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-2xl">{niche.icon}</span>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <span className="text-[12px] font-black text-white/40 uppercase tracking-widest">{niche.agents} Agents</span>
                                    </div>
                                </div>

                                <ReconTooltip insight={insight}>
                                    <h4 className="text-xl font-black text-white mb-3 tracking-tighter group-hover/niche:text-indigo-400 transition-colors">{niche.name}</h4>
                                    <div className="space-y-4">
                                        <p className="text-[15px] text-gray-400 leading-relaxed font-medium line-clamp-2 break-keep">
                                            {insight?.trend}
                                        </p>
                                    </div>
                                </ReconTooltip>

                                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                                    <span className="text-[13px] font-black text-indigo-400 uppercase tracking-tight">DETECTION SCORE</span>
                                    <span className="text-[18px] font-black text-white">{insight?.score}%</span>
                                </div>
                                <div className="w-full mt-3 py-3.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-[14px] font-black rounded-2xl transition-all border border-indigo-500/10 flex items-center justify-center gap-3 group-hover/niche:bg-indigo-500 group-hover/niche:text-white">
                                    <Target size={16} /> 실시간 감시망 접속
                                </div>
                            </motion.div>
                        </ShinyCard>
                    );
                })}
            </div >

            <AnimatePresence>
                {selectionTarget && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#0f1218] border border-white/10 rounded-[40px] max-w-lg w-full p-10 shadow-3xl text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full pointer-events-none"></div>

                            <div className="relative z-10 flex flex-col gap-6">
                                <div className="p-4 bg-indigo-500/10 rounded-3xl w-fit mx-auto border border-indigo-500/20">
                                    <Sparkles className="text-indigo-400" size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white mb-2 tracking-tight">전략 루트 선택</h3>
                                    <p className="text-gray-500 text-sm font-medium">포착된 시그널을 어떤 프로세스로 처리할까요?</p>
                                </div>

                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 mb-2">
                                    <p className="text-[11px] text-gray-400 italic">" {selectionTarget.capturedContent} "</p>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <button
                                        onClick={() => {
                                            if (setActiveResult) setActiveResult({ topic: selectionTarget.capturedContent, isFromSwarm: true });
                                            setSelectedNiche(null);
                                            setSelectionTarget(null);
                                            navigate('/topics');
                                            addNotification("주제 발굴 엔진으로 전환합니다. 정밀 분석을 시작하세요.", "info");
                                        }}
                                        className="group relative flex items-center justify-between p-5 bg-white/5 hover:bg-indigo-500 border border-white/5 hover:border-indigo-400 rounded-3xl transition-all duration-300"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20">
                                                <Search size={20} className="text-white" />
                                            </div>
                                            <div className="text-left">
                                                <div className="text-sm font-black text-white">주제 발굴 (Topic Recon)</div>
                                                <div className="text-[10px] text-gray-500 group-hover:text-white/70">키워드 정밀 분석 및 경쟁사 첩보 수집</div>
                                            </div>
                                        </div>
                                        <ArrowUpRight size={18} className="text-gray-600 group-hover:text-white" />
                                    </button>

                                    <button
                                        onClick={() => {
                                            if (setActiveResult) setActiveResult({ topic: selectionTarget.capturedContent, platform: 'YouTube Shorts', isAutoDraft: true });
                                            setSelectedNiche(null);
                                            setSelectionTarget(null);
                                            navigate('/studio');
                                            addNotification("콘텐츠 스튜디오로 즉시 진입합니다.", "success");
                                        }}
                                        className="group relative flex items-center justify-between p-5 bg-white/5 hover:bg-purple-500 border border-white/5 hover:border-purple-400 rounded-3xl transition-all duration-300"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20">
                                                <Layout size={20} className="text-white" />
                                            </div>
                                            <div className="text-left">
                                                <div className="text-sm font-black text-white">콘텐츠 스튜디오 (Studio)</div>
                                                <div className="text-[10px] text-gray-500 group-hover:text-white/70">발견 즉시 멀티 플랫폼 초안 작성</div>
                                            </div>
                                        </div>
                                        <ArrowUpRight size={18} className="text-gray-600 group-hover:text-white" />
                                    </button>
                                </div>

                                <button
                                    onClick={() => setSelectionTarget(null)}
                                    className="mt-2 text-xs font-bold text-gray-600 hover:text-gray-400 transition-colors"
                                >
                                    취소하고 돌아가기
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {selectedNiche && (
                    <div className="fixed inset-0 z-[250] flex items-start justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto no-scrollbar py-12">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#0f1218] border border-white/10 rounded-[40px] max-w-[95%] lg:max-w-6xl w-full h-auto shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                            <div className="relative z-10 p-8 md:p-12 space-y-8">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center gap-4">
                                        <span className="text-4xl">{selectedNiche.icon}</span>
                                        <div>
                                            <h3 className="text-2xl font-black text-white">{selectedNiche.name} 분대 현황</h3>
                                            <p className="text-gray-500 text-xs font-medium">전용 에이전트 {selectedNiche.agents}명이 전투 중입니다.</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelectedNiche(null);
                                            setActiveLogs([]);
                                        }}
                                        className="p-2 hover:bg-white/5 rounded-xl text-gray-400 transition-all"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="text-[10px] text-gray-600 font-black uppercase mb-1">Squad Health</div>
                                        <div className="text-lg font-black text-emerald-400">{selectedNiche.health}%</div>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="text-[10px] text-gray-600 font-black uppercase mb-1">Active Signals</div>
                                        <div className="text-lg font-black text-indigo-400">14 Active</div>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="text-[10px] text-gray-600 font-black uppercase mb-1">Response Latency</div>
                                        <div className="text-lg font-black text-white">45ms</div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Live Operation Logs</h4>
                                    <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 no-scrollbar">
                                        {activeLogs.length > 0 ? activeLogs.map((log, i) => (
                                            <motion.div
                                                key={log.timestamp + i}
                                                initial={{ x: -10, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2 group hover:bg-white/[0.04] transition-all"
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:animate-ping" />
                                                        <span className="text-[11px] font-bold text-gray-300">[{log.agentId}]</span>
                                                        <span className="text-[11px] text-gray-500 font-bold uppercase tracking-tighter">{log.action}</span>
                                                    </div>
                                                    <div className="text-[10px] font-black text-emerald-400">+{log.signalsDetected} Signals</div>
                                                </div>
                                                <div className="pl-4 border-l border-indigo-500/30 flex items-center justify-between gap-4">
                                                    <p className="text-[13px] text-gray-400 font-bold leading-relaxed flex-1">
                                                        <span className="text-indigo-400 mr-2">Captured:</span>
                                                        "{log.capturedContent}"
                                                    </p>
                                                    <button
                                                        onClick={() => {
                                                            setSelectionTarget(log);
                                                        }}
                                                        className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white text-[11px] font-black rounded-lg transition-all flex items-center gap-2 whitespace-nowrap shadow-lg shadow-indigo-500/20"
                                                    >
                                                        <PenTool size={12} /> AI 초안 생성
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )) : (
                                            <div className="py-12 text-center text-gray-600 text-xs font-bold uppercase tracking-widest italic animate-pulse">
                                                Connecting to Encrypted Signal Channel...
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedNiche(null)}
                                    className="w-full mt-8 py-4 bg-white text-black rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
                                >
                                    최고 지휘 사령부로 복귀
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StrategicSwarmWidget;
