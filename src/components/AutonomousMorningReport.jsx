import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, TrendingUp, Volume2, Download, ShieldCheck,
    ChevronRight, Radar, Play, Pause, Loader2, CheckCircle2
} from 'lucide-react';
import { generateMorningReport } from '../utils/swarmEngine';
import { generateContent } from '../utils/contentGenerator';
import { useUser } from '../contexts/UserContext';
import { cn } from '../lib/utils';

export const AutonomousMorningReport = ({ isOpen, onClose }) => {
    const [report, setReport] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const { addNotification, addToHistory, canGenerateContent } = useUser();

    useEffect(() => {
        if (isOpen) {
            setReport(generateMorningReport());
        }
    }, [isOpen]);

    const [loadingIndices, setLoadingIndices] = useState(new Set());
    const [approvedIndices, setApprovedIndices] = useState(new Set());

    if (!report) return null;

    const handlePlayVoice = () => {
        setIsPlaying(!isPlaying);
        if (!isPlaying) {
            const utterance = new SpeechSynthesisUtterance(report.voiceScript);
            utterance.lang = 'ko-KR';
            utterance.onend = () => setIsPlaying(false);
            window.speechSynthesis.speak(utterance);
        } else {
            window.speechSynthesis.cancel();
        }
    };

    const handleExportPDF = () => {
        setIsExporting(true);
        setTimeout(() => {
            setIsExporting(false);
            alert("PDF 리포트가 생성되었습니다. (Simulation)");
        }, 1500);
    };

    const handleFinalApproval = async (opt, index) => {
        console.log(`[AutonomousMorningReport] Final Approval clicked for: ${opt.trend} at index ${index}`);

        if (approvedIndices.has(index)) {
            addNotification("이미 승인된 항목입니다. 보관함을 확인해주세요.", "info");
            return;
        }

        if (!canGenerateContent()) {
            addNotification("크레딧이 부족합니다.", "error");
            return;
        }

        // Set Loading
        setLoadingIndices(prev => {
            const next = new Set(prev);
            next.add(index);
            return next;
        });
        addNotification(`👑 '${opt.trend}' 최종 승인 확인! 4대 플랫폼 통합 발행을 시작합니다...`, "info");

        try {
            const platforms = ['YouTube Shorts', 'Instagram Reels', 'Naver Blog', 'Threads'];

            // Generate content for all platforms in parallel
            const promises = platforms.map(p => generateContent(p, opt.trend, 'witty'));
            const results = await Promise.all(promises);

            // Add successful results to history
            const historyPromises = results
                .filter(result => result !== null)
                .map(result => addToHistory({
                    ...result,
                    id: Date.now() + Math.random(),
                    isOneStop: true,
                    originPlatform: result.platform
                }));

            await Promise.all(historyPromises);

            const successCount = results.filter(r => r !== null).length;

            if (successCount > 0) {
                addNotification(`✅ [${opt.trend}] 관련 ${successCount}개 채널 콘텐츠 생성 완료`, "success");
                setApprovedIndices(prev => {
                    const next = new Set(prev);
                    next.add(index);
                    return next;
                });
            } else {
                addNotification("콘텐츠 생성에 실패했습니다. 다시 시도해 주세요.", "error");
            }
        } catch (err) {
            console.error("[AutonomousMorningReport] Approval Error:", err);
            addNotification("발행 중 오류가 발생했습니다.", "error");
        } finally {
            setLoadingIndices(prev => {
                const next = new Set(prev);
                next.delete(index);
                return next;
            });
        }
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
                        className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 10 }}
                        className="relative w-full max-w-7xl bg-[#090b10] border border-white/10 rounded-[40px] overflow-hidden shadow-[0_0_150px_rgba(0,0,0,1)] flex flex-col h-auto max-h-[92vh]"
                    >
                        {/* 1. Header (Balanced) */}
                        <div className="relative h-16 px-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-6">
                                <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                                    <Radar size={22} className="text-indigo-400 animate-pulse" />
                                </div>
                                <div className="flex flex-col">
                                    <h2 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-3">
                                        데일리 수익 전략 사령부
                                        <span className="text-[10px] font-bold text-gray-500 tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                            발행일: {new Date(report.timestamp).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                                        </span>
                                    </h2>
                                    <span className="text-[9px] font-black text-indigo-400/60 uppercase tracking-widest mt-0.5">자율 인공지능 분석 엔진 구동 중</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-10">
                                <div className="hidden lg:flex items-center gap-6 text-[13px] font-bold text-gray-400 uppercase tracking-widest">
                                    <span className="flex items-center gap-2.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 시장 상황: {report.overallAtmosphere.replace('Bullish', '상승세')}</span>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-10 h-10 hover:bg-white/5 text-gray-400 hover:text-white rounded-full transition-all flex items-center justify-center border border-white/5"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* 2. Content Grid (Optimized Verticality) */}
                        <div className="p-4 md:p-6 flex-1 overflow-hidden flex flex-col justify-center">
                            <div className="flex items-center justify-between mb-4 shrink-0">
                                <h3 className="text-[14px] font-black text-gray-500 uppercase tracking-[0.4em] flex items-center gap-3">
                                    <TrendingUp size={20} className="text-indigo-500" />
                                    TOP 3 글로벌 고수익 기회
                                </h3>
                                <div className="flex items-center gap-4 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                                    <span className="text-[13px] font-black text-indigo-400 italic">"추천 전략: {report.suggestedFocus === 'lifestyle' ? '라이프스타일' : report.suggestedFocus === 'finance' ? '금융 & 부업' : report.suggestedFocus === 'tech' ? 'IT & 가전' : '게임 트렌드'} 분야 집중 공략"</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {report.opportunities.map((opt, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.15 }}
                                        className="group relative bg-[#0f1218] border border-white/5 hover:border-indigo-500/40 rounded-[24px] p-5 md:p-6 transition-all flex flex-col shadow-2xl overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-10 h-10 bg-white/5 border-b border-l border-white/10 rounded-bl-[16px] flex items-center justify-center text-xl z-10 transition-transform group-hover:scale-110">
                                            {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                                        </div>

                                        <div className="space-y-3 flex-1">
                                            <div>
                                                <div className="flex items-baseline justify-between mb-1.5 pr-10">
                                                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em]">
                                                        {opt.niche === 'lifestyle' ? '라이프스타일' : opt.niche === 'finance' ? '금융 & 부업' : opt.niche === 'tech' ? 'IT & 가전' : '게임 트렌드'}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-tighter">ROI {opt.estimatedProfit}</span>
                                                </div>
                                                <h4 className="text-lg font-black text-white line-clamp-2 leading-tight group-hover:text-indigo-400 transition-colors">
                                                    {opt.trend}
                                                </h4>
                                            </div>

                                            <div className="p-3.5 bg-white/[0.02] rounded-xl border border-white/[0.03]">
                                                <p className="text-sm text-gray-400 leading-relaxed font-medium line-clamp-3">
                                                    {opt.reasoning}
                                                </p>
                                            </div>

                                            <div className="p-3.5 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
                                                <div className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">전술적 조언 (Tactical Advice)</div>
                                                <div className="text-sm text-gray-200 font-bold leading-relaxed line-clamp-2">{opt.tacticalAdvice}</div>
                                            </div>
                                        </div>

                                        <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between shrink-0">
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">공략 성공률</span>
                                                <span className="text-2xl font-black text-white font-mono tracking-tighter">{opt.recon.winProb}%</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    disabled={loadingIndices.has(i)}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleFinalApproval(opt, i);
                                                    }}
                                                    className={cn(
                                                        "h-9 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-lg transition-all scale-95 hover:scale-100 hover:-translate-y-0.5 group/btn",
                                                        approvedIndices.has(i)
                                                            ? "bg-slate-700 text-slate-300 cursor-default"
                                                            : "bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/30"
                                                    )}
                                                    title="4개 플랫폼 원스톱 최종 승인"
                                                >
                                                    {loadingIndices.has(i) ? (
                                                        <Loader2 size={14} className="animate-spin" />
                                                    ) : approvedIndices.has(i) ? (
                                                        <CheckCircle2 size={14} className="text-emerald-400" />
                                                    ) : (
                                                        <CheckCircle2 size={14} className="text-white fill-white/20" />
                                                    )}
                                                    <span className="text-[10px] font-bold whitespace-nowrap">
                                                        {loadingIndices.has(i) ? "승인 중..." : approvedIndices.has(i) ? "승인 완료" : "최종 승인"}
                                                    </span>
                                                </button>
                                                <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center text-gray-500 group-hover:text-white group-hover:bg-indigo-600 transition-all shadow-xl">
                                                    <ChevronRight size={18} />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>


                        {/* 3. Footer Action Bar (Slimmed) */}
                        <div className="px-10 py-5 border-t border-white/5 bg-white/[0.01] flex flex-col md:flex-row items-center gap-6 shrink-0">
                            <div className="flex-1 flex items-center gap-5 p-3.5 bg-indigo-600/10 border border-indigo-500/20 rounded-3xl w-full md:w-auto">
                                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-600/30">
                                    <Volume2 size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[9px] font-black text-white/50 uppercase tracking-widest leading-none mb-1">AI 음성 전술 브리핑</div>
                                    <p className="text-sm text-white font-bold truncate">"오늘의 핵심 전술 리포트 요약본 (자율 엔진 합성)"</p>
                                </div>
                                <button
                                    onClick={handlePlayVoice}
                                    className="px-6 py-2.5 bg-white text-indigo-600 rounded-xl text-[10px] font-black uppercase flex items-center gap-2.5 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
                                >
                                    {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                                    {isPlaying ? "중지" : "리포트 듣기"}
                                </button>
                            </div>

                            <div className="flex items-center gap-5 w-full md:w-auto">
                                <button
                                    onClick={handleExportPDF}
                                    disabled={isExporting}
                                    className="h-12 px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white text-[10px] font-black uppercase flex items-center gap-2.5 transition-all whitespace-nowrap"
                                >
                                    {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={18} />}
                                    PDF 저장
                                </button>
                                <div className="h-12 px-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center gap-4 shrink-0">
                                    <ShieldCheck size={18} className="text-emerald-500" />
                                    <span className="text-[10px] font-bold text-gray-500 italic">
                                        시스템 정상 작동 중
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 4. Expert Status (Micro Footer) */}
                        <div className="px-10 py-3.5 bg-black/40 border-t border-white/5 flex items-center justify-between text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em] shrink-0">
                            <div className="flex items-center gap-8">
                                <span className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                                    DATA ANALYZED: 1.2M+
                                </span>
                                <span className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" />
                                    ENGINE SYNC: GPT/CLAUDE
                                </span>
                            </div>
                            <div className="text-indigo-500/50 flex items-center gap-2">
                                <ShieldCheck size={12} />
                                VER v1.07
                            </div>
                        </div>

                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
