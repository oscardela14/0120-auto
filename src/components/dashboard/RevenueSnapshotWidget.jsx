import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Globe, Coins, Sparkles, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const GLASS_CARD_CLASSES = "bg-[#0f1218]/60 backdrop-blur-2xl border border-white/5 shadow-2xl relative overflow-hidden group transition-all duration-500";

const RevenueSnapshotWidget = ({ totalPotential, breakdown, navigate }) => {
    const channels = [
        { id: 'adsense', name: '글로벌 네트워크', value: breakdown.adsense, icon: Globe, color: 'text-blue-400', bg: 'bg-blue-500/5', border: 'border-blue-500/10' },
        { id: 'affiliate', name: '제휴 커머스 마켓', value: breakdown.affiliate, icon: Coins, color: 'text-orange-400', bg: 'bg-orange-500/5', border: 'border-orange-500/10' },
        { id: 'sponsorship', name: '전략적 브랜드 협업', value: breakdown.sponsorship, icon: Sparkles, color: 'text-purple-400', bg: 'bg-purple-500/5', border: 'border-purple-500/10' }
    ];

    return (
        <div className={cn(GLASS_CARD_CLASSES, "rounded-[40px] h-full p-8 flex flex-col justify-between group/card")}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover/card:bg-emerald-500/20 transition-all duration-700" />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-2xl">
                            <DollarSign size={28} />
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Asset Valuation</div>
                            <h3 className="text-2xl font-black text-white tracking-tight">수익 스냅샷</h3>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-black text-white tracking-tighter">
                            <span className="text-emerald-400 mr-1">₩</span>{totalPotential}
                        </div>
                        <div className="text-[10px] text-gray-500 font-bold uppercase">Estimated Annual LTV</div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {channels.map((channel) => (
                        <div key={channel.id} className={cn("rounded-2xl p-4 border transition-all hover:scale-105", channel.bg, channel.border)}>
                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-3", channel.color, "bg-white/5")}>
                                <channel.icon size={16} />
                            </div>
                            <div className="text-[9px] text-gray-500 font-black uppercase mb-1">{channel.name}</div>
                            <div className="text-sm font-black text-white">₩{channel.value}</div>
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={() => navigate('/revenue')}
                className="relative z-10 w-full mt-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 flex items-center justify-center gap-2 text-white text-[13px] font-black tracking-tight transition-all group/btn"
            >
                전체 수익 분석 센터 이동
                <ChevronRight size={16} className="text-gray-600 group-hover/btn:translate-x-1 transition-transform" />
            </button>
        </div>
    );
};

export default RevenueSnapshotWidget;
