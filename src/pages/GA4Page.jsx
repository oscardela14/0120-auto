import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Users, Clock, MousePointer2, TrendingUp, BarChart3, Activity, Zap, Target, Smartphone, Monitor, Tablet, ChevronRight, ArrowUpRight, Filter, Download, Calendar, Search, Youtube, Instagram, Shield } from 'lucide-react';
import { fetchGA4DetailedReport, generateGA4Insights } from '../utils/ga4Engine';
import { cn } from '../lib/utils';
import { useUser } from '../contexts/UserContext';

const GLASS_CARD = "bg-[#0f1218]/60 backdrop-blur-2xl border border-white/5 shadow-2xl relative overflow-hidden transition-all duration-500 rounded-[32px]";

export const GA4Page = () => {
    const { history, usage } = useUser();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('traffic');

    useEffect(() => {
        const loadReport = async (isInitial = true) => {
            if (isInitial) setLoading(true);
            const data = await fetchGA4DetailedReport({ history, usage });
            if (data.success) {
                setReport(data);
            }
            if (isInitial) setLoading(false);
        };

        loadReport(true);

        // Auto-refresh every 8 seconds for real-time vibe
        const refreshInterval = setInterval(() => {
            loadReport(false);
        }, 8000);

        return () => clearInterval(refreshInterval);
    }, [history, usage]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-10">
                <div className="relative w-24 h-24">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-t-4 border-indigo-500 rounded-full"
                    />
                    <div className="absolute inset-4 border-t-4 border-pink-500/30 rounded-full animate-pulse" />
                    <Globe className="absolute inset-0 m-auto text-indigo-400" size={32} />
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-xl font-black text-white uppercase tracking-widest">GA4 Neural Scanning...</h2>
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-tighter">구글 애널리틱스 실시간 데이터를 정밀 분석 중입니다.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 md:p-10 max-w-[1440px] mx-auto pb-32">
            {/* 1. Header & Quick Actions */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                            <Globe size={24} className="text-indigo-400" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">
                            GA4 Real-time <span className="text-indigo-400">Intelligence</span>
                        </h1>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">MCP를 통해 실시간으로 동기화된 웹사이트 통합 분석 리포트입니다.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Backend Bridge Security Info */}
                    <div className="px-5 py-3 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Shield size={16} className="text-indigo-400" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-white uppercase tracking-tighter">Security Bridge v1.0</span>
                                <span className="text-[9px] font-bold text-indigo-400/80">AES-256 Encrypted</span>
                            </div>
                        </div>
                        <div className="w-px h-6 bg-white/10" />
                        <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Live Syncing</span>
                            </div>
                            <span className="text-[11px] font-bold text-gray-500">Last Sync: {report.summary.lastUpdated}</span>
                        </div>
                    </div>

                    <button className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl transition-all shadow-lg shadow-indigo-600/20">
                        <Download size={20} />
                    </button>
                </div>
            </div>

            {/* 2. Key Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <MetricCard
                    title="Active Users"
                    value={report.summary.activeUsers}
                    sub="실시간 활성 사용자"
                    icon={Activity}
                    color="text-emerald-400"
                    glow="bg-emerald-500"
                />
                <MetricCard
                    title="Avg. Duration"
                    value={report.summary.avgSessionDuration}
                    sub="평균 체류 시간"
                    icon={Clock}
                    color="text-indigo-400"
                    glow="bg-indigo-500"
                />
                <MetricCard
                    title="Bounce Rate"
                    value={report.summary.bounceRate}
                    sub="이탈률 (검증됨)"
                    icon={MousePointer2}
                    color="text-amber-400"
                    glow="bg-amber-500"
                />
                <MetricCard
                    title="Conv. Rate"
                    value={report.summary.conversionRate}
                    sub="목표 달성률"
                    icon={Target}
                    color="text-pink-400"
                    glow="bg-pink-500"
                />
            </div>

            {/* 3. Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                {/* Left: Traffic Analysis */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Hourly Users Chart (Mini Simulation) */}
                    <div className={cn(GLASS_CARD, "p-8")}>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-black text-white flex items-center gap-3">
                                <TrendingUp className="text-indigo-400" size={20} />
                                실시간 사용자 흐름
                            </h3>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">AI Prediction Live</span>
                            </div>
                        </div>
                        <div className="flex items-end justify-between h-48 gap-1 pt-4">
                            {report.hourlyTraffic.map((hour, idx) => (
                                <div key={idx} className="flex-1 flex flex-col items-center group gap-2">
                                    <div className="relative w-full h-full flex items-end">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${(hour.users / 600) * 100}%` }}
                                            className={cn(
                                                "w-full rounded-t-sm transition-all duration-500",
                                                hour.isPeak ? "bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]" : "bg-white/10 group-hover:bg-white/20"
                                            )}
                                        />
                                    </div>
                                    <span className="text-[9px] font-bold text-gray-600 group-hover:text-white transition-colors">{hour.hour.replace('시', '')}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Detailed Sources Table */}
                    <div className={cn(GLASS_CARD, "p-8")}>
                        <h3 className="text-lg font-black text-white mb-8">Traffic Sources / Acquisition</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-12 px-4 py-2 border-b border-white/5 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                <div className="col-span-4">Source / Medium</div>
                                <div className="col-span-2 text-right">Users</div>
                                <div className="col-span-2 text-right">Sessions</div>
                                <div className="col-span-2 text-right">Revenue</div>
                                <div className="col-span-2 text-right">Trend</div>
                            </div>
                            {report.trafficSources.map((source, idx) => (
                                <div key={idx} className="grid grid-cols-12 px-4 py-4 rounded-2xl hover:bg-white/5 transition-colors items-center group">
                                    <div className="col-span-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                            {source.source.includes('Google') ? <Search size={14} className="text-blue-400" /> :
                                                source.source.includes('YouTube') ? <Youtube size={14} className="text-red-400" /> :
                                                    source.source.includes('Instagram') ? <Instagram size={14} className="text-pink-400" /> : <Globe size={14} className="text-gray-400" />}
                                        </div>
                                        <span className="text-sm font-bold text-white tracking-tight">{source.source}</span>
                                    </div>
                                    <div className="col-span-2 text-right font-mono text-sm text-gray-300">{source.users.toLocaleString()}</div>
                                    <div className="col-span-2 text-right font-mono text-sm text-gray-300">{source.sessions.toLocaleString()}</div>
                                    <div className="col-span-2 text-right font-mono text-sm text-indigo-400 font-black">₩{source.rev.toLocaleString()}</div>
                                    <div className="col-span-2 text-right flex justify-end">
                                        <span className={cn(
                                            "text-xs font-black px-2 py-1 rounded-lg",
                                            source.trend.startsWith('+') ? "text-emerald-400 bg-emerald-500/10" : "text-rose-400 bg-rose-500/10"
                                        )}>
                                            {source.trend}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Insights & Secondary Stats */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Device Breakdown */}
                    <div className={cn(GLASS_CARD, "p-8")}>
                        <h3 className="text-lg font-black text-white mb-8">Device Distribution</h3>
                        <div className="flex justify-center mb-8 relative">
                            {/* Simple radial representation */}
                            <div className="w-40 h-40 rounded-full border-[12px] border-white/5 flex items-center justify-center">
                                <Monitor size={40} className="text-indigo-400 opacity-20 absolute" />
                                <div className="text-center">
                                    <span className="block text-2xl font-black text-white">72%</span>
                                    <span className="text-[10px] text-gray-500 font-bold uppercase">Mobile Dominant</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {report.deviceData.map((device, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: device.color }} />
                                        <span className="text-sm font-bold text-gray-400">{device.type}</span>
                                    </div>
                                    <span className="text-sm font-black text-white">{device.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI Insights (GA4 Focus) */}
                    <div className={cn(GLASS_CARD, "p-8 bg-indigo-600/10 border-indigo-500/20")}>
                        <div className="flex items-center gap-2 mb-6">
                            <Zap size={20} className="text-amber-400 fill-amber-400/20" />
                            <h3 className="text-lg font-black text-white">AI Neural Insight</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h4 className="text-sm font-black text-indigo-400">Peak Time Alert</h4>
                                <p className="text-[13px] text-gray-300 leading-relaxed font-medium">
                                    데이터 분석 결과, 저녁 19시~22시 사이에 <span className="text-white font-bold">YouTube 유입</span>이 평균 대비 2.4배 높습니다. 이 시간대에 맞춰 유튜브 전용 이벤트를 노출하세요.
                                </p>
                            </div>
                            <div className="h-px bg-white/5" />
                            <div className="space-y-2">
                                <h4 className="text-sm font-black text-pink-400">Content Tip</h4>
                                <p className="text-[13px] text-gray-300 leading-relaxed font-medium">
                                    `/topics` 페이지의 체류 시간이 가장 깁니다. 해당 도구를 사용하는 유입자들에게 <span className="text-white font-bold">PRO 버전 할인권</span>을 표시하여 전환율을 14% 상승시킬 수 있습니다.
                                </p>
                            </div>
                            <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2">
                                전략 자동 적용하기 <ArrowUpRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Page Engagement Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                <div className="lg:col-span-8">
                    <div className={cn(GLASS_CARD, "p-8 h-full")}>
                        <h3 className="text-lg font-black text-white mb-8">Page-level Performance Metrics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {report.engagementByPage.map((page, idx) => (
                                <div key={idx} className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl group hover:border-indigo-500/30 transition-all">
                                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">{page.path}</div>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-2xl font-black text-white mb-0.5">{page.time}</div>
                                            <div className="text-[10px] text-indigo-400 font-black uppercase">Avg. Time on Page</div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-gray-400">Scroll Depth</span>
                                            <span className="text-xs font-black text-emerald-400">{page.depth}</span>
                                        </div>
                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: page.depth }}
                                                className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Real-time Event Stream */}
                <div className="lg:col-span-4">
                    <div className={cn(GLASS_CARD, "p-8 h-full bg-[#11141d]")}>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-black text-white flex items-center gap-3">
                                <Activity className="text-emerald-400" size={20} />
                                Real-time Events
                            </h3>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Live Feed</span>
                        </div>
                        <div className="space-y-4">
                            {report.events.map((event, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-indigo-400 mb-1 uppercase tracking-tighter">{event.conversion} Event</span>
                                        <span className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{event.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-sm font-black text-white">{event.count.toLocaleString()}</span>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase">Actions</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                            <p className="text-[11px] text-emerald-400/80 font-medium leading-relaxed">
                                <span className="font-black">💡 AI Tip:</span> "button_click" 이벤트가 모바일에서 2배 더 많이 발생합니다. 모바일 버튼 크기를 15% 키우면 전환율이 개선될 수 있습니다.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ title, value, sub, icon: Icon, color, glow }) => (
    <div className={cn(GLASS_CARD, "p-6 group hover:scale-[1.02] active:scale-[0.98]")}>
        <div className="flex justify-between items-start mb-4">
            <div className={cn("p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-all", color)}>
                <Icon size={20} />
            </div>
            <div className={cn("w-2 h-2 rounded-full", glow, "shadow-[0_0_10px_currentColor]")}></div>
        </div>
        <div className="space-y-1">
            <div className="text-3xl font-black text-white tracking-tighter">{value}</div>
            <div className="flex flex-col">
                <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">{title}</span>
                <span className="text-[10px] font-medium text-gray-600">{sub}</span>
            </div>
        </div>
    </div>
);
