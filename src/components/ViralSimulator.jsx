import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Play, AlertCircle, CheckCircle2, XCircle, BarChart3, Fingerprint, Eye, ThumbsUp, MousePointer2, RefreshCcw } from 'lucide-react';

export const ViralSimulator = ({ isOpen, onClose, dataA, dataB }) => {
    const [simulationState, setSimulationState] = useState('idle'); // idle, running, complete
    const [progress, setProgress] = useState(0);
    const [agents, setAgents] = useState([]);
    const [stats, setStats] = useState({
        a: { clicks: 0, views: 0, retention: 0 },
        b: { clicks: 0, views: 0, retention: 0 }
    });

    // Generate 100 Agents on mount
    useEffect(() => {
        if (isOpen) {
            const newAgents = Array.from({ length: 100 }, (_, i) => ({
                id: i,
                type: ['GenZ', 'Millennial', 'Boomer', 'Techie', 'Casual'][Math.floor(Math.random() * 5)],
                patience: Math.random(), // 0-1 (Low = Skips fast)
                interest: Math.random(), // 0-1 (High = Clicks)
                status: 'waiting', // waiting, analyzing, clicked_a, clicked_b, skipped
                reactionTime: Math.random() * 2000 + 500
            }));
            setAgents(newAgents);
            setSimulationState('idle');
            setProgress(0);
            setStats({
                a: { clicks: 0, views: 0, retention: 0 },
                b: { clicks: 0, views: 0, retention: 0 }
            });
        }
    }, [isOpen]);

    const runSimulation = () => {
        setSimulationState('running');
        let completedAgents = 0;

        // Simulate each user's reaction
        agents.forEach((agent, index) => {
            setTimeout(() => {
                setAgents(prev => {
                    const next = [...prev];
                    const currentAgent = next[index];
                    currentAgent.status = 'analyzing';

                    // Interaction Logic
                    // Higher virality score in data increases probability
                    // Persona match increases probability

                    const scoreA = (dataA?.predictedStats?.viralityScore || 80) / 100;
                    const scoreB = (dataB?.predictedStats?.viralityScore || 70) / 100;

                    // Random factor + Agent interest + Content Score
                    const decisionA = (currentAgent.interest * 0.3) + (scoreA * 0.7) + (Math.random() * 0.2);
                    const decisionB = (currentAgent.interest * 0.3) + (scoreB * 0.7) + (Math.random() * 0.2);

                    setTimeout(() => {
                        setAgents(innerPrev => {
                            const innerNext = [...innerPrev];
                            const target = innerNext[index];

                            // Decision
                            if (decisionA > 0.8 && decisionA >= decisionB) {
                                target.status = 'clicked_a';
                                setStats(s => ({ ...s, a: { ...s.a, clicks: s.a.clicks + 1 } }));
                            } else if (decisionB > 0.8 && decisionB > decisionA) {
                                target.status = 'clicked_b';
                                setStats(s => ({ ...s, b: { ...s.b, clicks: s.b.clicks + 1 } }));
                            } else {
                                target.status = 'skipped';
                            }
                            return innerNext;
                        });

                        completedAgents++;
                        setProgress((completedAgents / 100) * 100);

                        if (completedAgents === 100) {
                            setSimulationState('complete');
                        }
                    }, 800); // Analysis time

                    return next;
                });
            }, agent.reactionTime);
        });
    };

    if (!isOpen) return null;

    const winner = stats.a.clicks >= stats.b.clicks ? 'A' : 'B';
    const totalClicks = stats.a.clicks + stats.b.clicks;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-6xl bg-[#0f1116] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                            <Users className="text-indigo-400" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                                Viral Swarm Simulator
                                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] border border-indigo-500/20">BETA</span>
                            </h2>
                            <p className="text-xs text-gray-500 font-medium">100명의 AI 페르소나 에이전트 반응 테스트</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors">
                        <XCircle size={24} />
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                    {/* Left: Swarm Grid */}
                    <div className="flex-1 p-8 border-r border-white/5 overflow-y-auto no-scrollbar relative">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Live Audience Reaction</h3>
                            <div className="flex items-center gap-4 text-[10px] font-bold text-gray-500">
                                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>Click (A)</span>
                                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div>Click (B)</span>
                                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div>Skip</span>
                                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-gray-600"></div>Idle</span>
                            </div>
                        </div>

                        {/* Agent Grid */}
                        <div className="grid grid-cols-10 gap-3">
                            {agents.map((agent) => (
                                <motion.div
                                    key={agent.id}
                                    layout
                                    className={`relative aspect-square rounded-lg flex items-center justify-center border transition-all duration-300 ${agent.status === 'clicked_a' ? 'bg-emerald-500/20 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]' :
                                            agent.status === 'clicked_b' ? 'bg-blue-500/20 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]' :
                                                agent.status === 'skipped' ? 'bg-red-500/10 border-red-500/20 opacity-40' :
                                                    agent.status === 'analyzing' ? 'bg-indigo-500/20 border-indigo-500/40 animate-pulse' :
                                                        'bg-white/5 border-white/5'
                                        }`}
                                >
                                    {agent.status === 'clicked_a' ? <ThumbsUp size={12} className="text-emerald-400" /> :
                                        agent.status === 'clicked_b' ? <div className="text-[10px] font-black text-blue-400">B</div> :
                                            agent.status === 'skipped' ? <XCircle size={12} className="text-red-400" /> :
                                                agent.status === 'analyzing' ? <Eye size={12} className="text-indigo-400" /> :
                                                    <Fingerprint size={12} className="text-gray-700" />}
                                </motion.div>
                            ))}
                        </div>

                        {/* Result Overlay */}
                        <AnimatePresence>
                            {simulationState === 'complete' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute inset-x-8 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center shadow-2xl z-10"
                                >
                                    <h3 className="text-2xl font-black text-white mb-2">Simulation Complete</h3>
                                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400 mb-4">
                                        Winner: Option {winner}
                                    </div>
                                    <p className="text-gray-400 text-sm max-w-md mx-auto">
                                        기반 데이터 분석 결과, {winner}안이 타겟 페르소나에게 <span className="text-white font-bold">{(stats[winner.toLowerCase()].clicks / totalClicks * 100).toFixed(0)}%</span> 더 높은 반응을 이끌어냈습니다.
                                    </p>
                                    <button
                                        onClick={onClose}
                                        className="mt-6 px-8 py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform"
                                    >
                                        결과 적용하기
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right: Controls & Stats */}
                    <div className="w-full lg:w-96 p-8 bg-[#0a0c10] flex flex-col gap-6">

                        {/* Interactive Start Button */}
                        {simulationState === 'idle' ? (
                            <button
                                onClick={runSimulation}
                                className="w-full h-16 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl font-black text-lg text-white shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                <Play size={20} fill="currentColor" />
                                Start Simulation
                            </button>
                        ) : (
                            <div className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center px-6 gap-4">
                                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                <div className="flex-1">
                                    <div className="flex justify-between text-xs font-bold text-gray-400 mb-1">
                                        <span>Processing...</span>
                                        <span>{progress.toFixed(0)}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-indigo-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Real-time Stats Board */}
                        <div className="flex flex-col gap-4">
                            {/* A Option Stat */}
                            <div className={`p-5 rounded-2xl border transition-all ${stats.a.clicks > stats.b.clicks ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-white/5 border-white/5'}`}>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Option A</span>
                                    <div className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-bold text-gray-300">VIRAL SCORE: {dataA?.predictedStats?.viralityScore || 80}</div>
                                </div>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <div className="text-3xl font-black text-white tracking-tighter">
                                            {stats.a.clicks}
                                            <span className="text-sm text-gray-500 ml-1 font-bold">CTR</span>
                                        </div>
                                    </div>
                                    <div className="h-10 w-24 flex items-end gap-1">
                                        {Array.from({ length: 8 }).map((_, i) => (
                                            <div key={i} className="flex-1 bg-emerald-500/30 rounded-t-sm" style={{ height: `${Math.random() * 100}%` }} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* B Option Stat (Only if B exists) */}
                            {dataB && (
                                <div className={`p-5 rounded-2xl border transition-all ${stats.b.clicks > stats.a.clicks ? 'bg-blue-500/10 border-blue-500/50' : 'bg-white/5 border-white/5'}`}>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Option B</span>
                                        <div className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-bold text-gray-300">VIRAL SCORE: {dataB?.predictedStats?.viralityScore || 70}</div>
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <div className="text-3xl font-black text-white tracking-tighter">
                                                {stats.b.clicks}
                                                <span className="text-sm text-gray-500 ml-1 font-bold">CTR</span>
                                            </div>
                                        </div>
                                        <div className="h-10 w-24 flex items-end gap-1">
                                            {Array.from({ length: 8 }).map((_, i) => (
                                                <div key={i} className="flex-1 bg-blue-500/30 rounded-t-sm" style={{ height: `${Math.random() * 100}%` }} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Insights */}
                        <div className="mt-auto bg-white/5 rounded-2xl p-5 border border-white/5">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <BarChart3 size={14} /> Live Analysis
                            </h4>
                            <div className="space-y-3">
                                {simulationState === 'idle' ? (
                                    <p className="text-sm text-gray-600 text-center py-4">Waiting for simulation trigger...</p>
                                ) : (
                                    <>
                                        <div className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5" />
                                            <p className="text-xs text-gray-300 leading-relaxed">
                                                <span className="text-white font-bold">Gen-Z (20대)</span> 그룹에서 A안의 후킹 메시지에
                                                빠르게 반응하고 있습니다.
                                            </p>
                                        </div>
                                        {simulationState === 'complete' && (
                                            <div className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5" />
                                                <p className="text-xs text-gray-300 leading-relaxed">
                                                    최종 도달율 예측: <span className="text-indigo-400 font-bold">{(Math.max(stats.a.clicks, stats.b.clicks) * 1540).toLocaleString()} Views</span>
                                                </p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
