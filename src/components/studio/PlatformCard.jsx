
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, Eye, Calendar, CheckCircle2, Loader2 } from 'lucide-react';
import { PERSONAS } from '../../utils/contentGenerator';
import { cn } from '../../lib/utils';

export const PlatformCard = ({ platform, data, onEdit, onSchedule, icon: Icon, color, scheduled }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -8, transition: { duration: 0.3 } }}
        className={cn(
            "relative bg-[#151921]/60 backdrop-blur-xl border rounded-[32px] p-6 overflow-hidden group flex flex-col h-full transition-all duration-500",
            scheduled
                ? "border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.05)]"
                : "border-white/5 hover:border-indigo-500/30 hover:shadow-[0_0_40px_rgba(99,102,241,0.1)]"
        )}
    >
        {/* Animated Background Gradient */}
        <div className={cn(
            "absolute -right-10 -top-10 w-32 h-32 blur-[60px] opacity-10 group-hover:opacity-30 transition-opacity",
            color.replace('bg-', 'bg-')
        )} />

        <div className="flex items-start justify-between mb-6 relative z-10">
            <div className="flex items-center gap-4">
                <div className={cn("p-3 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors shadow-inner")}>
                    <Icon size={24} className="text-white" />
                </div>
                <div>
                    <h4 className="text-white font-black text-sm tracking-tight">{platform}</h4>
                    {data && (
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                {data.persona ? PERSONAS.find(p => p.id === data.persona)?.name.replace('\n', ' ') : 'CORE'}
                            </span>
                        </div>
                    )}
                </div>
            </div>
            {scheduled && (
                <div className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-1.5">
                    <CheckCircle2 size={10} className="text-emerald-400" />
                    <span className="text-[9px] text-emerald-400 font-black uppercase tracking-tighter">SUCCESS</span>
                </div>
            )}
        </div>

        {data ? (
            <>
                <div className="mb-6 relative z-10">
                    <h5 className="text-white font-black text-base line-clamp-2 mb-3 leading-tight group-hover:text-indigo-400 transition-colors">
                        {data.title}
                    </h5>
                    {data.predictedStats && (
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg border border-white/5">
                                <TrendingUp size={12} className="text-emerald-400" />
                                <span className="text-[11px] font-black text-white">{data.predictedStats.expectViews}</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg border border-white/5">
                                <Zap size={12} className="text-indigo-400" />
                                <span className="text-[11px] font-black text-white">{data.predictedStats.viralityScore}점</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex gap-2.5 mt-auto relative z-10">
                    <button
                        onClick={() => onEdit(data)}
                        className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                        <Eye size={14} /> 미리보기
                    </button>
                    <button
                        onClick={() => onSchedule(platform, data)}
                        className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-600/20 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                        <Calendar size={14} /> 예약
                    </button>
                </div>
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-10 relative z-10">
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center mb-4">
                    <Loader2 size={20} className="text-gray-700 animate-spin" />
                </div>
                <p className="text-[11px] font-bold text-gray-600 uppercase tracking-widest">분석 대기 중</p>
            </div>
        )}
    </motion.div>
);
