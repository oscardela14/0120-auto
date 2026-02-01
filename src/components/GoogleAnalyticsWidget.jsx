import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Activity, Users, MousePointer2, TrendingUp, Globe, Clock, ChevronRight, Zap, Target } from 'lucide-react';
import { fetchGA4RealtimeStats, generateGA4Insights } from '../utils/ga4Engine';
import { useUser } from '../contexts/UserContext';

const GLASS_STYLE = "bg-[#0c0e14]/80 backdrop-blur-2xl border border-white/5 shadow-2xl overflow-hidden relative group";

export const GoogleAnalyticsWidget = () => {
    const [stats, setStats] = useState(null);
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);

    const { isAuthenticated } = useUser();

    useEffect(() => {
        const loadData = async () => {
            if (!isAuthenticated) {
                setStats({
                    activeUsers: 0,
                    sources: [
                        { name: 'Google Search', count: 0, trend: '0%', color: 'text-gray-400' },
                        { name: 'Social (Insta/YT)', count: 0, trend: '0%', color: 'text-gray-400' },
                        { name: 'Direct / Email', count: 0, trend: '0%', color: 'text-gray-400' },
                        { name: 'Referral / Ads', count: 0, trend: '0%', color: 'text-gray-400' }
                    ]
                });
                setInsights([]);
                setLoading(false);
                return;
            }
            const data = await fetchGA4RealtimeStats();
            if (data.success) {
                setStats(data);
                setInsights(generateGA4Insights(data));
            }
            setLoading(false);
        };
        loadData();
    }, [isAuthenticated]);

    if (loading) return (
        <div className={`${GLASS_STYLE} rounded-[32px] p-8 h-full flex flex-col items-center justify-center`}>
            <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <BarChart3 className="absolute inset-0 m-auto text-indigo-400 opacity-50" size={24} />
            </div>
            <p className="text-sm font-black text-gray-500 uppercase tracking-widest animate-pulse">Syncing with GA4 Intelligence...</p>
        </div>
    );

    return (
        <div className={`${GLASS_STYLE} rounded-[32px] p-6 h-full flex flex-col`}>
            {/* Ambient Lighting */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-indigo-500/20 transition-colors duration-1000"></div>

            <div className="relative z-10 flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </div>
                            <h3 className="text-[11px] font-black text-white/50 uppercase tracking-[0.2em]">GA4 Real-time Intelligence</h3>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-white tracking-tighter tabular-nums">
                                {stats.activeUsers}
                            </span>
                            <span className="text-[12px] font-black text-indigo-400 uppercase tracking-widest">Active Users</span>
                        </div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                        <Activity className="text-indigo-400" size={20} />
                    </div>
                </div>

                {/* Main Stats Display */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {stats.sources.map((source, idx) => (
                        <div key={idx} className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl group/source hover:border-white/10 transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest truncate">{source.name}</span>
                                <span className={`text-[10px] font-black ${source.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {source.trend}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-black text-white">{source.count}명</span>
                                <div className="flex-1 h-0.5 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(source.count / stats.activeUsers) * 100}%` }}
                                        className={`h-full bg-indigo-500`}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* AI Insight Carousel (Auto-scroll simulated by clicking/hover) */}
                <div className="mt-auto space-y-3">
                    <div className="flex items-center gap-2 px-1 mb-2">
                        <Zap size={14} className="text-amber-400 fill-amber-400/20" />
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">AI Optimization Report</span>
                    </div>

                    <div className="space-y-2">
                        {insights.slice(0, 2).map((insight, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-[20px] relative overflow-hidden group/insight"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="p-1.5 bg-indigo-500/20 rounded-lg text-indigo-400">
                                        {insight.type === 'growth' ? <TrendingUp size={14} /> :
                                            insight.type === 'optimize' ? <Target size={14} /> : <Zap size={14} />}
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-[12px] font-black text-white">{insight.title}</h4>
                                        <p className="text-[11px] text-gray-500 font-medium leading-relaxed">{insight.desc}</p>
                                        <div className="pt-2 flex items-center gap-1.5 text-[10px] font-black text-indigo-400 group-hover/insight:gap-2 transition-all">
                                            {insight.action} <ChevronRight size={10} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bottom Source Legend */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Search</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.5)]"></div>
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Social</span>
                        </div>
                    </div>
                    <span className="text-[9px] font-black text-indigo-400/50 uppercase tracking-tighter">Powered by GA4-MCP</span>
                </div>
            </div>
        </div>
    );
};
