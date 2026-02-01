
import React from 'react';
import { motion } from 'framer-motion';
import { Youtube, Instagram, CheckCircle2, Activity } from 'lucide-react';
import { cn } from '../../../lib/utils';

export const TrendGrid = ({ trends, filter, setFilter, trendInfo, handleGenerate }) => {
    return (
        <div className="lg:col-span-9">
            <header className="flex flex-col md:flex-row items-end justify-between mb-8 gap-6">
                <div>
                    <h2 className="text-3xl font-black text-white">실시간 <span className="text-red-500">바이럴 트렌드</span></h2>
                    <p className="text-gray-500 text-xs mt-1">{trendInfo.time} 기준 | {trendInfo.cycle}</p>
                </div>
                <div className="flex bg-[#16181d] p-1.5 rounded-2xl border border-white/5 backdrop-blur-md gap-1">
                    {[
                        { id: 'ALL', label: 'ALL' },
                        { id: '유튜브', icon: Youtube, color: 'text-red-500' },
                        { id: '인스타', icon: Instagram, color: 'text-pink-500' },
                        { id: '네이버 블로그', label: 'N', color: 'text-green-500' },
                        { id: '스레드', label: '@', color: 'text-white' }
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setFilter(item.id)}
                            className={cn(
                                "w-12 h-10 rounded-xl transition-all flex items-center justify-center",
                                filter === item.id
                                    ? "bg-[#2a2d35] text-white"
                                    : "text-gray-500 hover:text-gray-300"
                            )}
                        >
                            {item.id === 'ALL' ? (
                                <span className="text-[11px] font-black uppercase tracking-tighter">ALL</span>
                            ) : item.icon ? (
                                <item.icon size={18} className={filter === item.id ? "text-white" : item.color} />
                            ) : (
                                <span className={cn(
                                    "text-[16px] font-black",
                                    filter === item.id ? "text-white" : item.color
                                )}>{item.label}</span>
                            )}
                        </button>
                    ))}
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {trends.filter(t => filter === 'ALL' || t.platform === filter).map((trend, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={cn(
                            "group bg-[#1a1c22] border-[1.5px] rounded-[24px] p-5 transition-all relative flex flex-col h-full hover:scale-[1.02]",
                            idx === 0 ? "border-yellow-500/40 shadow-[0_0_20px_rgba(234,179,8,0.1)]" :
                                idx === 1 ? "border-blue-500/40" :
                                    idx === 2 ? "border-orange-500/40" :
                                        "border-white/5"
                        )}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-1">
                                <span className="text-[10px] font-bold text-gray-500">{trend.platform} / {trend.volume}</span>
                            </div>
                            {idx < 3 && (
                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                                    <CheckCircle2 size={10} className="text-emerald-500" />
                                    <span className="text-[9px] font-bold text-emerald-500">최종 승인</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-black shrink-0",
                                idx === 0 ? "bg-yellow-500 text-black" :
                                    idx === 1 ? "bg-gray-400 text-black" :
                                        idx === 2 ? "bg-orange-500 text-white" :
                                            "bg-[#2a2d35] text-white"
                            )}>
                                {idx + 1}
                            </div>
                            <h4
                                onClick={() => handleGenerate(trend.topic)}
                                className="text-[15px] font-black text-white line-clamp-1 group-hover:text-white transition-all cursor-pointer"
                            >
                                {trend.topic}
                            </h4>
                        </div>

                        <div className="space-y-2 mt-auto">
                            <div className="flex items-center justify-between text-[11px] font-bold">
                                <span className="text-gray-600">GOLDEN TIME 수익</span>
                                <span className="text-emerald-500">$ {(5800 - idx * 450).toLocaleString()} +</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] font-bold">
                                <span className="text-gray-600">예상 도달율</span>
                                <span className="text-gray-400">{(1160000 - idx * 80000).toLocaleString()} view</span>
                            </div>

                            <div className="pt-3">
                                <button
                                    onClick={() => handleGenerate(trend.topic)}
                                    className="w-fit px-4 py-2 border border-emerald-500/30 text-emerald-500 text-[10px] font-bold rounded-lg hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-2"
                                >
                                    <Activity size={12} />
                                    실시간 급상승
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
