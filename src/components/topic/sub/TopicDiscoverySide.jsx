
import React from 'react';
import { Search, Signal, PenTool, Gem, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';

export const TopicDiscoverySide = ({
    query,
    setQuery,
    handleDeepScrape,
    isDeepAnalysisPending,
    setIsDrafting,
    handleGenerate,
    setIsMasterMode,
    categories
}) => {
    return (
        <div className="lg:col-span-3 flex flex-col gap-5 h-full overflow-y-auto no-scrollbar pb-10">
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 flex flex-col gap-6 shadow-2xl">
                <div>
                    <div className="flex items-start justify-between">
                        <h2 className="text-xl font-black text-white mb-2 leading-tight">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Strategic Intelligent Content</span>
                        </h2>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => setIsMasterMode(true)}
                            className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/30 text-indigo-400"
                        >
                            <Gem size={24} />
                        </motion.button>
                    </div>
                    <p className="text-gray-500 text-xs font-medium mt-1">알고리즘 정찰 및 채널 통합 전략 도출</p>
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleDeepScrape(query)}
                            placeholder="주제 키워드로 정찰..."
                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:border-indigo-500 transition-all font-medium"
                        />
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => handleDeepScrape(query)}
                            disabled={isDeepAnalysisPending}
                            className="w-full h-12 bg-[#1a1a2e] border border-indigo-500/30 rounded-2xl flex items-center justify-center gap-2 text-indigo-300 font-bold"
                        >
                            {isDeepAnalysisPending ? <Loader2 size={16} className="animate-spin" /> : <Signal size={16} />}
                            {isDeepAnalysisPending ? '분석 엔진 가동 중...' : '심층 분석 개시'}
                        </button>
                        <div className="flex gap-2">
                            <button onClick={() => setIsDrafting(true)} className="flex-1 h-12 bg-white/5 border border-white/10 rounded-2xl text-gray-400 font-bold flex items-center justify-center gap-2"><PenTool size={16} />편집</button>
                            <button onClick={() => handleGenerate(query)} className="flex-[2] h-12 bg-indigo-600 rounded-2xl text-white font-bold">즉시 반영</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
                <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-4">Discovery Tags</h3>
                <div className="grid grid-cols-2 gap-2">
                    {categories.map(cat => (
                        <button key={cat} onClick={() => setQuery(cat)} className="px-3 py-2 bg-white/5 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-all text-left">#{cat}</button>
                    ))}
                </div>
            </div>
        </div>
    );
};
