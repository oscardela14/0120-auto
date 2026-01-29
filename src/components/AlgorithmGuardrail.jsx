
import React from 'react';
import { ShieldCheck, ShieldAlert, BadgeInfo, Zap, FileSearch, CheckCircle2 } from 'lucide-react';

export const AlgorithmGuardrail = ({ safetyData, suitabilityData }) => {
    return (
        <div className="bg-[#0f1218] border border-white/5 rounded-[32px] overflow-hidden">
            <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={20} className="text-secondary" />
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Algorithm Guardrail</h3>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${safetyData.isSafe ? 'bg-secondary/10 text-secondary' : 'bg-amber-500/10 text-amber-500'}`}>
                        {safetyData.isSafe ? 'Clean Pass' : 'Review Needed'}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 text-center">Safety Score</div>
                        <div className={`text-2xl font-black text-center ${safetyData.safetyScore > 80 ? 'text-secondary' : 'text-amber-500'}`}>
                            {safetyData.safetyScore}%
                        </div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 text-center">Unique Index</div>
                        <div className="text-2xl font-black text-white text-center">{safetyData.uniquenessScore}%</div>
                    </div>
                </div>

                {/* Suitability Tips */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap size={14} className="text-secondary" />
                        <span className="text-[11px] font-black text-white uppercase tracking-widest">Algorithm Suitability</span>
                    </div>
                    {suitabilityData.tips.map((tip, i) => (
                        <div key={i} className="flex gap-3 text-xs text-gray-400 leading-relaxed bg-black/20 p-3 rounded-xl border border-white/5">
                            <CheckCircle2 size={14} className="text-secondary shrink-0 mt-0.5" />
                            {tip}
                        </div>
                    ))}
                </div>

                {/* Policy Violations */}
                {safetyData.violations.length > 0 && (
                    <div className="mt-8">
                        <div className="flex items-center gap-2 mb-4 text-amber-500">
                            <ShieldAlert size={14} />
                            <span className="text-[11px] font-black uppercase tracking-widest">Policy Risk Detected</span>
                        </div>
                        <div className="space-y-2">
                            {safetyData.violations.map((v, i) => (
                                <div key={i} className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-amber-500 line-through opacity-50">{v.word}</span>
                                        <span className="text-xs font-bold text-white">→ {v.replacement}</span>
                                    </div>
                                    <div className="text-[9px] text-amber-500/60 uppercase font-black">{v.reason}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
