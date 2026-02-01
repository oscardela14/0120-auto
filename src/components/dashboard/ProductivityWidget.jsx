import React from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, Clock, TrendingUp } from 'lucide-react';
import { cn } from '../../lib/utils';

const GLASS_CARD_CLASSES = "bg-[#0f1218]/60 backdrop-blur-2xl border border-white/5 shadow-2xl relative overflow-hidden group transition-all duration-500";

const ProductivityWidget = ({ user, history, savedHours, potentialViews, config, navigate }) => {
    const { theme } = config;

    return (
        <div className={cn(GLASS_CARD_CLASSES, "rounded-[40px] h-full p-8 flex flex-col justify-between group/card")}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover/card:bg-indigo-500/20 transition-all duration-700" />

            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl", theme.bg, theme.text, theme.border)}>
                        <Target size={28} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={cn("text-[10px] font-black tracking-[0.2em] uppercase px-2 py-0.5 rounded-md border", theme.bg, theme.text, theme.border)}>
                                {config.badge} Phase
                            </span>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 rounded-md border border-emerald-500/20">
                                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[9px] font-black text-emerald-400 uppercase">Live Optimizer</span>
                            </div>
                        </div>
                        <h3 className="text-2xl font-black text-white tracking-tight">생산성 허브</h3>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-5 hover:bg-white/[0.06] transition-all">
                        <div className="flex items-center gap-2 mb-3">
                            <Clock size={14} className="text-gray-500" />
                            <span className="text-[11px] font-black text-gray-500 uppercase tracking-wider">Time Saved</span>
                        </div>
                        <div className="text-3xl font-black text-white tracking-tighter mb-1">
                            {savedHours}<span className="text-sm font-bold text-gray-500 ml-1">h</span>
                        </div>
                        <div className="text-[10px] text-emerald-400 font-bold">Auto-Pilot Active</div>
                    </div>
                    <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-5 hover:bg-white/[0.06] transition-all">
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp size={14} className="text-gray-500" />
                            <span className="text-[11px] font-black text-gray-500 uppercase tracking-wider">Potential Reach</span>
                        </div>
                        <div className="text-3xl font-black text-white tracking-tighter mb-1">
                            {potentialViews}<span className="text-sm font-bold text-gray-500 ml-1">+</span>
                        </div>
                        <div className="text-[10px] text-indigo-400 font-bold">Organic Growth Engaged</div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 flex items-center justify-between gap-4 mt-8 pt-6 border-t border-white/5">
                <div className="flex-1">
                    <p className="text-[13px] text-gray-400 font-bold leading-tight">
                        {config.statsText(savedHours, potentialViews)}
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/studio')}
                    className={cn("px-6 py-3 rounded-2xl font-black text-sm text-white flex items-center gap-2 shadow-lg transition-all", theme.gradient, theme.shadow)}
                >
                    <Zap size={16} className="fill-white" />
                    FAST TRACK
                </motion.button>
            </div>
        </div>
    );
};

export default ProductivityWidget;
