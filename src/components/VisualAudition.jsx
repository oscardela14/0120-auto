import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Sparkles, TrendingUp, Zap, Crown,
    CheckCircle2, AlertCircle, Loader2,
    Eye, BarChart3, Users, MessageSquareText
} from 'lucide-react';
import { cn } from '../lib/utils';

const AGENTS = [
    { id: 'baek', name: '백종원', avatar: '👨‍🍳', focus: '대중성 & 본능', weight: 0.35, feedback: "아유, 이거 썸네일 색감이 좀 더 확 살아야 손님들이 확 들어오지 않겠슈? 좀 더 직관적으로 갑시다!" },
    { id: 'jobs', name: '스티브 잡스', avatar: '👓', focus: '본질 & 디자인', weight: 0.3, feedback: "Simplicity is the ultimate sophistication. Eliminate the clutter. Focus on the core message." },
    { id: 'kim', name: '김태호PD', avatar: '🎬', focus: '트렌드 & 반전', weight: 0.35, feedback: "아니 이건 진짜 무구절절 설명 안 해도 아는 그런 거거든요? 자막 폰트를 확 키워서 시청자들 눈을 사로잡읍시다!" }
];

export const VisualAudition = ({ isOpen, onClose, topic, currentImage }) => {
    const [variants, setVariants] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [winnerId, setWinnerId] = useState(null);
    const [scores, setScores] = useState({});

    // Mock initial variants
    useEffect(() => {
        if (isOpen && variants.length === 0) {
            setVariants([
                { id: 1, url: currentImage || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=400&q=80", title: "Original v1", ctr: 3.2 },
                { id: 2, url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80", title: "Bold & High Contrast", ctr: 4.8 },
                { id: 3, url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80", title: "Minimal Strategy", ctr: 3.9 },
            ]);
        }
    }, [isOpen]);

    const runAnalysis = async () => {
        setIsAnalyzing(true);
        setWinnerId(null);

        // Simulating Agent Council Voting
        await new Promise(r => setTimeout(r, 2000));

        const newScores = {};
        variants.forEach(v => {
            newScores[v.id] = AGENTS.map(agent => ({
                agentId: agent.id,
                score: Math.floor(Math.random() * 30) + 65 + (v.id === 2 ? 10 : 0), // Favor ID 2 for demo
                reasoning: agent.feedback
            }));
        });

        setScores(newScores);
        setWinnerId(2); // Mocking ID 2 as winner
        setIsAnalyzing(false);
    };

    const handleGenerateMore = () => {
        setIsGenerating(true);
        setTimeout(() => {
            const newId = variants.length + 1;
            setVariants([...variants, {
                id: newId,
                url: `https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=400&q=80`,
                title: `AI Variant ${newId}`,
                ctr: 4.2
            }]);
            setIsGenerating(false);
        }, 1500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-6xl max-h-[95vh] overflow-y-auto scrollbar-none bg-[#0b0e14] border border-white/10 rounded-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.8)] pb-24"
                    >
                        {/* Header Area */}
                        <div className="px-10 py-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500">
                                    <Eye size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white tracking-tight">멀티모달 오디션 (Visual Audition)</h2>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">AI Agent Council: Thumbnail CTR Optimization</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <X size={24} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
                            {/* Left: Variant Grid */}
                            <div className="lg:col-span-8 space-y-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] flex items-center gap-2">
                                        Thumbnail Variations
                                        <span className="text-indigo-400">[{variants.length}]</span>
                                    </h3>
                                    <button
                                        onClick={handleGenerateMore}
                                        disabled={isGenerating}
                                        className="text-xs font-black text-indigo-400 hover:text-white transition-colors flex items-center gap-2"
                                    >
                                        {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                                        AI 기반 자동 생성
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-6">
                                    {variants.map((v) => (
                                        <motion.div
                                            key={v.id}
                                            className={cn(
                                                "relative group cursor-pointer transition-all duration-500",
                                                winnerId === v.id ? "ring-2 ring-emerald-500 rounded-[24px] scale-105" : "hover:scale-102"
                                            )}
                                        >
                                            <div className="aspect-[16/9] rounded-[24px] overflow-hidden border border-white/5 bg-gray-900 shadow-xl">
                                                <img src={v.url} alt={v.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                                {winnerId === v.id && (
                                                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-emerald-500 text-black text-[10px] font-black uppercase rounded-full shadow-lg flex items-center gap-1">
                                                        <Crown size={12} />
                                                        Winner (CTR Max)
                                                    </div>
                                                )}

                                                <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                                    <span className="text-[10px] font-black text-white/50 uppercase">{v.title}</span>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-xl font-black text-white">{v.ctr}%</span>
                                                        <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Est. CTR</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="pt-10">
                                    <button
                                        onClick={runAnalysis}
                                        disabled={isAnalyzing || variants.length === 0}
                                        className="w-full h-16 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-sm uppercase tracking-[0.3em] rounded-[24px] shadow-[0_15px_40px_rgba(79,70,229,0.3)] flex items-center justify-center gap-4 active:scale-98 transition-all disabled:opacity-50"
                                    >
                                        {isAnalyzing ? (
                                            <>
                                                <Loader2 size={24} className="animate-spin" />
                                                에이전트 군집 분석 중...
                                            </>
                                        ) : (
                                            <>
                                                <Users size={24} />
                                                에이전트 3인 오디션 시작
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Right: Agent Panel */}
                            <div className="lg:col-span-4 space-y-6">
                                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
                                    <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <Users size={18} />
                                        Agent Opinions
                                    </h3>

                                    <div className="space-y-6">
                                        {AGENTS.map((agent) => (
                                            <div key={agent.id} className="relative">
                                                <div className="flex items-center gap-4 mb-3">
                                                    <div className="w-12 h-12 bg-[#13161c] border border-white/10 rounded-2xl flex items-center justify-center text-2xl shadow-xl">
                                                        {agent.avatar}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black text-white">{agent.name}</h4>
                                                        <span className="text-[10px] font-bold text-indigo-400/80 uppercase tracking-widest leading-none shrink-0">{agent.focus}</span>
                                                    </div>
                                                </div>

                                                <AnimatePresence>
                                                    {winnerId && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="bg-black/40 border border-white/5 p-4 rounded-2xl relative"
                                                        >
                                                            <div className="absolute -top-1.5 left-5 w-3 h-3 bg-black/40 border-t border-l border-white/5 rotate-45" />
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Variant Evaluation</span>
                                                                <span className="text-xs font-black text-emerald-400">{scores[winnerId]?.find(s => s.agentId === agent.id)?.score} pts</span>
                                                            </div>
                                                            <p className="text-[11px] text-gray-300 font-medium leading-relaxed italic">
                                                                "{agent.feedback}"
                                                            </p>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-[32px] p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <BarChart3 size={16} className="text-indigo-400" />
                                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Strategic Insight</span>
                                    </div>
                                    <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                                        현재 트렌드 스캔 결과, 대조적인 색상을 사용한 2번 변형이 노출 알고리즘에서 <span className="text-white font-bold">+18.5% 높은 편중도</span>를 보이고 있습니다.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
