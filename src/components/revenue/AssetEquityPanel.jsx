import React from 'react';
import { Crown, ArrowUpRight } from 'lucide-react';

export const AssetEquityPanel = () => {
    return (
        <div className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/30 rounded-[32px] p-6 relative overflow-hidden group/ltv shadow-2xl h-full flex flex-col">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover/ltv:bg-indigo-500/20 transition-all" />

            <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-2">
                    <Crown size={20} className="text-amber-400" />
                    <h4 className="text-[16px] font-black text-white uppercase tracking-widest">Asset Equity Evaluation</h4>
                </div>
                <div className="px-2 py-0.5 bg-black/40 border border-white/10 rounded text-[9px] font-black text-indigo-400">PRO ONLY</div>
            </div>

            <div className="flex flex-col flex-1">
                <div className="text-[12px] text-gray-400 font-bold mb-4 italic uppercase tracking-wider">Valuation & Security Audit:</div>
                <div className="space-y-4">
                    <div className="text-center py-4 bg-black/20 rounded-[24px] border border-white/5 relative">
                        <div className="text-[13px] text-gray-400 font-black uppercase mb-1 tracking-tighter">12-Month Projected Equity</div>
                        <div className="text-3xl font-black text-white">₩67,228</div>
                        <div className="absolute top-2 right-4 flex items-center gap-1 text-[9px] font-black text-emerald-400">
                            <ArrowUpRight size={10} /> 130.29x ROI
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                            <div className="text-[13px] text-gray-500 font-black mb-1 uppercase tracking-tighter">Asset Security</div>
                            <div className="text-base font-black text-white uppercase">88% (Stable)</div>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                            <div className="text-[13px] text-gray-400 font-black mb-1 uppercase tracking-tighter">Growth Potential</div>
                            <div className="text-base font-black text-emerald-400 uppercase">HIGH_REACH</div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-[13px] font-black text-gray-400 px-1">
                            <span>Earnings Projection</span>
                            <span className="text-gray-500">6 Months Horizon</span>
                        </div>
                        <div className="flex items-end h-8 gap-1 px-1">
                            {[100, 80, 60, 40, 25, 15].map((v, i) => (
                                <div
                                    key={i}
                                    className="flex-1 bg-indigo-500/30 rounded-t-[2px] hover:bg-indigo-500/60 transition-colors"
                                    style={{ height: `${v}%` }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
