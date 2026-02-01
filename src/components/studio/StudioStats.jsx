
import React from 'react';
import { motion } from 'framer-motion';
import { Target, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';
import { PERSONAS } from '../../utils/contentGenerator';

export const StudioStats = ({ platformStats, activeResult }) => {
    return (
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
    );
};
