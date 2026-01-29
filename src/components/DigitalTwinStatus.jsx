
import React from 'react';
import { motion } from 'framer-motion';
import { Microchip, Cpu, BarChart3, Zap, BrainCircuit, Sparkles, TrendingUp } from 'lucide-react';

export const DigitalTwinStatus = ({ evolutionData }) => {
    if (!evolutionData) return null;

    return (
        <div className="bg-[#0f1218] border border-white/5 rounded-[32px] overflow-hidden group relative">
            {/* Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-emerald-500/5 opacity-50"></div>

            <div className="relative px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-2">
                    <BrainCircuit size={20} className="text-emerald-400" />
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Digital Twin Status</h3>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                        LEVEL {evolutionData.level}
                    </span>
                    <span className="text-[10px] text-gray-500">Self-Evolving AI</span>
                </div>
            </div>

            <div className="relative p-6">
                {/* XP Bar */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Synapse Evolution</span>
                        <span className="text-[10px] font-mono text-emerald-400">{evolutionData.exp}%</span>
                    </div>
                    <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${evolutionData.exp}%` }}
                            className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500"
                        />
                    </div>
                </div>

                {/* Learned Traits */}
                <div className="space-y-4 mb-8">
                    <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-4">Learned Neural Traits</h4>
                    {evolutionData.learnedTraits.map((trait, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                <span className="text-xs text-gray-300 font-medium">{trait.trait}</span>
                            </div>
                            <span className="text-[10px] font-mono text-gray-500">{trait.value}% Sync</span>
                        </div>
                    ))}
                </div>

                {/* Success Patterns */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp size={14} className="text-emerald-400" />
                        <span className="text-[11px] font-black text-white uppercase tracking-widest">Success Pattern Analysis</span>
                    </div>
                    {evolutionData.successPatterns.map((p, i) => (
                        <div key={i} className="flex items-center gap-3 text-xs text-gray-400 bg-black/40 p-3 rounded-xl border border-white/5">
                            <Sparkles size={12} className="text-amber-500 shrink-0" />
                            <div>
                                <span className="text-white font-bold mr-2">{p.pattern}</span>
                                <span className="text-[10px] text-emerald-400">Viral Boost x{p.boost}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <p className="text-[10px] text-gray-500 italic">
                        AI가 사용자의 지난 성공 공식을 학습하여<br />
                        현재 콘텐츠에 자동으로 반영했습니다.
                    </p>
                </div>
            </div>
        </div>
    );
};
