
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Radar, Palette, UserCog, Zap, Signal, BookOpen, Search, Gem, Clock, Globe, ArrowRight } from 'lucide-react';
import { cn } from '../../../lib/utils';

export const ScrapingResultModal = ({ result, onClose, onGenerate }) => {
    if (!result) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-10">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-[#0f1115]/80 border border-white/10 rounded-[40px] max-w-6xl w-full p-8 md:p-12 max-h-[90vh] overflow-y-auto relative shadow-[0_0_100px_rgba(79,70,229,0.2)] scrollbar-hide"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-10 right-10 p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all text-gray-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <div className="flex items-center gap-3 text-indigo-400 mb-3">
                                <Radar size={20} className="animate-pulse" />
                                <span className="text-xs font-black uppercase tracking-[0.3em]">Advanced Algorithm Recon</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                                분석 리포트: <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">{result.keyword}</span>
                            </h2>
                        </div>
                        <div className="bg-indigo-500/10 border border-indigo-500/20 px-6 py-3 rounded-2xl flex flex-col items-end">
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Live Viral Potential</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-white">{result.liveScore}</span>
                                <span className="text-lg font-bold text-indigo-400/50">/ 100</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Column 1: Core Metrics */}
                        <div className="space-y-8">
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
                                <div>
                                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Palette size={14} className="text-indigo-400" />
                                        Emotional Sentiment
                                    </h3>
                                    <div className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl inline-block mb-4">
                                        <span className="text-sm font-black text-indigo-300">{result.sentiment?.label || "데이터 분석 중"}</span>
                                    </div>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'Logical', value: result.sentiment?.logical || 70, color: 'bg-cyan-500' },
                                            { label: 'Emotional', value: result.sentiment?.emotional || 50, color: 'bg-pink-500' },
                                            { label: 'Provocative', value: result.sentiment?.provocative || 30, color: 'bg-orange-500' }
                                        ].map(s => (
                                            <div key={s.label} className="space-y-1">
                                                <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase">
                                                    <span>{s.label}</span>
                                                    <span>{s.value}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <div className={cn("h-full rounded-full", s.color)} style={{ width: `${s.value}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/5">
                                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <UserCog size={14} className="text-indigo-400" />
                                        Target Personas
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {(result.targetAudience || ["잠재 고객군"]).map(t => (
                                            <span key={t} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[11px] font-bold text-gray-300">
                                                #{t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-indigo-600/10 to-transparent border border-indigo-500/20 rounded-3xl p-8">
                                <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Zap size={14} />
                                    Viral Trigger Matrix
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'Curiosity', value: result.viralTriggers?.curiosity || 85, icon: Search },
                                        { label: 'Value', value: result.viralTriggers?.value || 90, icon: Gem },
                                        { label: 'Urgency', value: result.viralTriggers?.urgency || 70, icon: Clock },
                                        { label: 'Social Proof', value: result.viralTriggers?.socialProof || 60, icon: Globe }
                                    ].map(v => (
                                        <div key={v.label} className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col items-center text-center">
                                            <v.icon size={18} className="text-gray-500 mb-2" />
                                            <span className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">{v.label}</span>
                                            <span className="text-xl font-black text-white">{v.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Strategies */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2 ml-2">
                                <Signal size={14} className="text-indigo-400" />
                                Algorithm Infiltration Strategies
                            </h3>
                            {result.strategies?.map((s, i) => (
                                <div key={i} className="group p-6 bg-white/5 rounded-3xl border border-white/10 hover:border-indigo-500/30 transition-all hover:bg-white/10">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-black text-xs shrink-0 group-hover:scale-110 transition-transform">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-indigo-400 uppercase mb-1 tracking-widest">{s.type}</div>
                                            <p className="text-sm text-gray-200 leading-relaxed font-medium">{s.text}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Column 3: Blueprint & Action */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2 ml-2">
                                <BookOpen size={14} className="text-indigo-400" />
                                Strategic 3-Step Blueprint
                            </h3>
                            <div className="relative space-y-12 pl-6">
                                <div className="absolute left-[7px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-indigo-500 via-indigo-500/50 to-transparent" />
                                {(result.blueprint || [
                                    "준비 단계: 핵심 데이터 확보",
                                    "실행 단계: 멀티 채널 동시 배포",
                                    "확장 단계: 커뮤니티 바이럴 유도"
                                ]).map((step, idx) => {
                                    const [title, ...desc] = step.split(':');
                                    return (
                                        <div key={idx} className="relative">
                                            <div className="absolute -left-[24px] top-0 w-4 h-4 rounded-full bg-indigo-500 border-4 border-[#0f1115] z-10" />
                                            <div className="text-[11px] font-black text-indigo-400 uppercase tracking-tighter mb-1">{title}</div>
                                            <p className="text-sm font-bold text-white leading-relaxed">{desc.join(':').trim()}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-12 bg-indigo-600 rounded-[30px] p-8 shadow-[0_20px_40px_rgba(79,70,229,0.3)] hover:scale-[1.02] transition-transform cursor-pointer overflow-hidden relative group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                                <div className="relative z-10 flex flex-col gap-4">
                                    <div className="flex items-center gap-2 text-indigo-100 text-[10px] font-black uppercase tracking-widest">
                                        <Zap size={14} />
                                        One-Click Master push
                                    </div>
                                    <h4 className="text-xl font-black text-white leading-tight">이 리포트의 모든 전략을 적용해<br />콘텐츠를 즉시 생성할까요?</h4>
                                    <button
                                        onClick={() => onGenerate(result.keyword)}
                                        className="mt-2 bg-white text-indigo-600 px-6 py-3 rounded-2xl text-xs font-black hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        풀옵션 엔진 가동
                                        <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

