import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dna, Zap, TrendingUp, AlertTriangle, Target, Crown, RefreshCw, X, Sparkles, Sword } from 'lucide-react';
import { cn } from '../lib/utils';

export const EvolutionaryLoop = ({ isOpen, onClose, initialTopic = "미래의 AI 수익화", onApply }) => {
    const [stage, setStage] = useState('idle'); // idle, mutating, competing, evolving, complete
    const [topic, setTopic] = useState(initialTopic);
    const [variants, setVariants] = useState([]);
    const [winner, setWinner] = useState(null);
    const [simulationProgress, setSimulationProgress] = useState(0);
    const [logs, setLogs] = useState([]);
    const logContainerRef = useRef(null);

    // Auto-reset and sync when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setTopic(initialTopic);
        } else {
            // Delay reset slightly for exit animation to play smoothly
            const timer = setTimeout(() => {
                reset();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen, initialTopic]);

    // Mock Mutation Engine
    const mutateVariants = () => {
        setStage('mutating');
        addLog("🧬 진화 알고리즘 초기화... (Evolutionary Algorithm Init)");

        setTimeout(() => {
            const newVariants = Array.from({ length: 5 }).map((_, i) => ({
                id: i,
                title: [
                    `${topic} : 진짜 수익화의 비밀`,
                    `아직도 ${topic} 모르시나요? (충격)`,
                    `당장 따라해야 할 ${topic} BEST 3`,
                    `${topic} 하나로 월 300버는 법`,
                    `초보자도 가능한 ${topic} 가이드`
                ][i],
                style: ["Aggressive", "Clickbait", "Professional", "Emotional", "Data-Driven"][i],
                thumbnailColor: ["from-red-500", "from-blue-500", "from-purple-500", "from-yellow-500", "from-emerald-500"][i],
                vitality: 100, // Health point for survival
                score: 0,
                status: 'alive'
            }));
            setVariants(newVariants);
            addLog("🦠 5개의 변종 콘텐츠 생성 완료 (5 Variants Spwaned)");
            setStage('competing');
        }, 1500);
    };

    // Simulation Loop
    useEffect(() => {
        if (stage === 'competing') {
            addLog("⚔️ 생존 경쟁 시뮬레이션 시작 (Survival Simulation Start)");
            let interval = setInterval(() => {
                setSimulationProgress(prev => {
                    const next = prev + 2;
                    if (next >= 100) {
                        clearInterval(interval);
                        setStage('evolving');
                        return 100;
                    }
                    return next;
                });

                setVariants(prev => {
                    return prev.map(v => {
                        if (v.status === 'dead') return v;

                        // Random vitality flux
                        const damage = Math.random() > 0.7 ? 15 : 0;
                        const boost = Math.random() > 0.6 ? 10 : 0;
                        const newVitality = Math.max(0, v.vitality - damage + boost);

                        // Update score based on vitality
                        const newScore = v.score + (newVitality > 50 ? 50 : 10) + Math.floor(Math.random() * 20);

                        return {
                            ...v,
                            vitality: newVitality,
                            score: newScore,
                            status: newVitality <= 0 ? 'dead' : 'alive'
                        };
                    });
                });

            }, 100);

            return () => clearInterval(interval);
        }
    }, [stage]);

    // Determining Winner
    useEffect(() => {
        if (stage === 'evolving') {
            const alive = variants.filter(v => v.status !== 'dead');
            // If all dead, pick highest score
            const potentialWinners = alive.length > 0 ? alive : variants;
            const finalWinner = potentialWinners.reduce((prev, current) => (prev.score > current.score) ? prev : current);

            setWinner(finalWinner);
            addLog(`👑 최적 진화체 선정 완료: Variant #${finalWinner.id + 1}`);
            addLog("🧬 DNA 고정 및 ROI 예측 모듈 전송...");
            setStage('complete');
        }
    }, [stage, variants]);

    const addLog = (msg) => {
        setLogs(prev => [...prev, msg]);
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        if (logContainerRef.current) logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }, [logs]);

    const reset = () => {
        setStage('idle');
        setVariants([]);
        setWinner(null);
        setSimulationProgress(0);
        setLogs([]);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    width: stage === 'idle' ? '600px' : '100%',
                    maxWidth: stage === 'idle' ? '600px' : '1024px' // 5xl is 1024px usually? Tailwind max-w-5xl is 64rem=1024px.
                }}
                className={cn(
                    "bg-[#0f1218] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh] transition-all duration-700 ease-in-out",
                    stage === 'idle' ? "max-w-xl" : "max-w-6xl"
                )}
            >
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-pink-500/10 rounded-xl border border-pink-500/20">
                            <Dna size={20} className="text-pink-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white flex items-center gap-2">
                                진화형 A/B 테스트 루프 <span className="px-2 py-0.5 rounded text-[10px] bg-pink-500 text-white uppercase tracking-wider">Evolution Mode</span>
                            </h2>
                            <p className="text-xs text-gray-500 font-bold">Natural Selection Content Engine</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                    {/* Left Panel: Simulation View */}
                    <div className="flex-1 p-8 md:pl-10 overflow-y-auto relative min-h-[400px]">
                        {stage === 'idle' ? (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-8 py-12">
                                <div className="w-32 h-32 rounded-full bg-pink-500/10 flex items-center justify-center relative">
                                    <div className="absolute inset-0 border-2 border-pink-500/30 rounded-full animate-ping"></div>
                                    <Sword size={48} className="text-pink-500" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white mb-2">무한 경쟁 시뮬레이션</h3>
                                    <p className="text-gray-400 max-w-md mx-auto leading-relaxed text-sm">
                                        주제를 입력하면 AI가 5가지 변종 콘텐츠를 생성하고,<br />가상 시공간(Virtual 24h)에서 경쟁시켜<br />살아남은 <strong className="text-pink-500">단 하나의 최강 콘텐츠</strong>만 남깁니다.
                                    </p>
                                </div>
                                {/* Input Removed as requested */}
                                <div className="w-full max-w-[280px]">
                                    <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-center group focus-within:border-pink-500/50 transition-colors">
                                        <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Target Topic</div>
                                        <input
                                            type="text"
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                            placeholder="예시) AI 자동화 수익 모델"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && topic.trim()) {
                                                    mutateVariants();
                                                }
                                            }}
                                            autoFocus
                                            className="w-full bg-transparent text-center text-white font-bold placeholder-white/20 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={mutateVariants}
                                    className="px-10 py-5 bg-pink-600 hover:bg-pink-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-pink-900/30 flex items-center gap-3 transition-all hover:scale-105 active:scale-95"
                                >
                                    <Sparkles size={20} /> 진화 시작 (Start Evolution)
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                <AnimatePresence>
                                    {variants.map((v) => (
                                        <motion.div
                                            key={v.id}
                                            layout
                                            initial={{ opacity: 0, x: -50 }}
                                            animate={{
                                                opacity: v.status === 'dead' ? 0.3 : 1,
                                                scale: v.status === 'dead' ? 0.95 : 1,
                                                filter: v.status === 'dead' ? 'grayscale(100%)' : 'none'
                                            }}
                                            className={cn(
                                                "relative p-4 rounded-2xl border flex items-center gap-4 overflow-hidden transition-all",
                                                v.status === 'dead' ? "bg-black/20 border-white/5" : "bg-white/5 border-white/10"
                                            )}
                                        >
                                            {/* Health Bar Background */}
                                            {v.status !== 'dead' && (
                                                <div
                                                    className="absolute bottom-0 left-0 h-1 bg-pink-500 transition-all duration-300"
                                                    style={{ width: `${v.vitality}%`, opacity: 0.5 }}
                                                />
                                            )}

                                            <div className={cn("w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0", v.thumbnailColor, v.status === 'dead' ? 'to-gray-800 from-gray-700' : 'to-gray-900')}>
                                                <span className="font-black text-white text-lg">#{v.id + 1}</span>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-xs font-bold text-gray-500 uppercase">{v.style} Style</span>
                                                    <span className={cn("text-xs font-black uppercase", v.status === 'dead' ? "text-red-500" : "text-green-500")}>
                                                        {v.status === 'dead' ? 'ELIMINATED' : `VITALITY: ${Math.floor(v.vitality)}%`}
                                                    </span>
                                                </div>
                                                <div className="font-bold text-white truncate">{v.title}</div>
                                            </div>

                                            <div className="text-right shrink-0 min-w-[60px]">
                                                <div className="text-[10px] text-gray-500 font-bold uppercase">Score</div>
                                                <div className="text-xl font-black text-white">{Math.floor(v.score)}</div>
                                            </div>

                                            {stage === 'complete' && winner?.id === v.id && (
                                                <div className="absolute inset-0 border-2 border-pink-500 rounded-2xl bg-pink-500/10 flex items-center justify-center z-10 backdrop-blur-[1px]">
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="bg-pink-600 text-white px-6 py-2 rounded-full font-black text-xl shadow-2xl flex items-center gap-2"
                                                    >
                                                        <Crown size={24} fill="currentColor" /> WINNER
                                                    </motion.div>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Right Panel: Logs & Stats - Hidden in Idle */}
                    {stage !== 'idle' && (
                        <div className="w-full lg:w-80 bg-black/20 border-l border-white/5 flex flex-col">
                            <div className="p-4 border-b border-white/5">
                                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Evolution Progress</div>
                                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-pink-500"
                                        animate={{ width: `${simulationProgress}%` }}
                                    />
                                </div>
                            </div>

                            <div className="flex-1 overflow-hidden flex flex-col p-4">
                                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <ActivityIcon /> System Logs
                                </div>
                                <div
                                    ref={logContainerRef}
                                    className="flex-1 overflow-y-auto space-y-2 font-mono text-[11px] text-gray-400 p-2 custom-scrollbar"
                                >
                                    {logs.map((log, i) => (
                                        <div key={i} className="border-l-2 border-pink-500/30 pl-2 leading-tight py-1">
                                            <span className="text-pink-500/50">[{new Date().toLocaleTimeString().split(' ')[0]}]</span> {log}
                                        </div>
                                    ))}
                                    {logs.length === 0 && <span className="text-gray-700 italic">Ready to start...</span>}
                                </div>
                            </div>

                            {stage === 'complete' && (
                                <div className="p-4 border-t border-white/5 bg-pink-500/5">
                                    <button
                                        onClick={() => {
                                            if (onApply && winner) onApply(winner.title);
                                            reset(); // Reset state for next use
                                            onClose();
                                        }}
                                        className="w-full py-3 bg-white text-black font-black rounded-xl hover:scale-105 transition-transform mb-2"
                                    >
                                        최적화 결과 적용하기
                                    </button>
                                    <button onClick={reset} className="w-full py-3 bg-transparent text-gray-500 font-bold hover:text-white transition-colors text-xs">
                                        다시 시뮬레이션
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

const ActivityIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
);
