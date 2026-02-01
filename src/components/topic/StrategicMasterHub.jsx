import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Radar, Sparkles, X, LayoutGrid, Signal, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export const StrategicMasterHub = ({
    isOpen,
    onClose,
    query,
    setQuery,
    rivalInput,
    setRivalInput,
    onDeepScrape,
    onRivalScout,
    isAnalysisScraping,
    isGenerating,
    onOpenEvolution
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-4 lg:p-10"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 30 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 30 }}
                        className="bg-[#0a0b10] border border-white/10 w-full max-w-7xl h-full lg:h-[85vh] rounded-[48px] shadow-[0_0_150px_rgba(34,211,238,0.15)] overflow-hidden flex flex-col relative"
                    >
                        {/* Futuristic Background Accents */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                        {/* Header Area */}
                        <div className="p-8 lg:p-12 pb-6 flex justify-between items-start relative z-10">
                            <div>
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="p-3 bg-cyan-500/20 rounded-2xl border border-cyan-500/30 text-cyan-400">
                                        <LayoutGrid size={32} />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tighter">STRATEGIC MASTER HUB</h2>
                                        <p className="text-cyan-400 font-bold tracking-widest uppercase mt-1">Central Intelligence Command</p>
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm lg:text-base font-medium max-w-xl leading-relaxed">
                                    모든 소셜 미디어 전략을 통제하는 마스터 커맨드 센터입니다.<br />
                                    알고리즘 분석부터 경쟁사 정찰, 진화형 설계까지 한번에 실행하십시오.
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-4 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Main Content Grid */}
                        <div className="flex-1 overflow-y-auto p-8 lg:p-12 pt-0 grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">

                            {/* Slot 1: Deep Discovery */}
                            <div className="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-indigo-500/30 rounded-[32px] p-8 flex flex-col gap-6 transition-all relative overflow-hidden text-left">
                                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div>
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4 text-indigo-400 group-hover:scale-110 transition-transform">
                                        <Search size={24} />
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-2">Deep Discovery</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed font-medium">
                                        키워드를 관통하는 알고리즘 최적화 전략을 심층 분석합니다.
                                    </p>
                                </div>
                                <div className="mt-auto">
                                    <div className="relative mb-3">
                                        <input
                                            type="text"
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && onDeepScrape(query)}
                                            placeholder="주제 키워드 입력"
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
                                        />
                                        <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                    </div>
                                    <button
                                        onClick={() => onDeepScrape(query)}
                                        disabled={isAnalysisScraping}
                                        className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white rounded-xl text-sm font-black transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        {isAnalysisScraping ? <Loader2 size={18} className="animate-spin" /> : <Signal size={18} />}
                                        {isAnalysisScraping ? '알고리즘 분석 중...' : '심층 분석 개시'}
                                    </button>
                                </div>
                            </div>

                            {/* Slot 2: Rival Recon */}
                            <div className="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-orange-500/30 rounded-[32px] p-8 flex flex-col gap-6 transition-all relative overflow-hidden text-left">
                                <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div>
                                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-4 text-orange-400 group-hover:scale-110 transition-transform">
                                        <Radar size={24} />
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-2">Rival Recon</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed font-medium">
                                        경쟁사의 약점을 파악하고 상위 호환 전략을 수립합니다.
                                    </p>
                                </div>
                                <div className="mt-auto">
                                    <div className="relative mb-3">
                                        <input
                                            type="text"
                                            value={rivalInput}
                                            onChange={(e) => setRivalInput(e.target.value)}
                                            placeholder="경쟁사 콘텐츠/URL"
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
                                        />
                                        <AlertTriangle size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                    </div>
                                    <button
                                        onClick={onRivalScout}
                                        disabled={isGenerating}
                                        className="w-full h-12 bg-orange-600 hover:bg-orange-500 disabled:bg-orange-600/50 text-white rounded-xl text-sm font-black transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Radar size={18} />}
                                        {isGenerating ? 'DNA 해체 중...' : '정찰 프로세스 기동'}
                                    </button>
                                </div>
                            </div>

                            {/* Slot 3: Evolutionary Loop */}
                            <div className="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-pink-500/30 rounded-[32px] p-8 flex flex-col gap-6 transition-all relative overflow-hidden text-left">
                                <div className="absolute inset-0 bg-gradient-to-b from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div>
                                    <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-4 text-pink-400 group-hover:scale-110 transition-transform">
                                        <Sparkles size={24} />
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-2">Evolutionary Loop</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed font-medium">
                                        스스로 진화하는 콘텐츠 엔진을 통해 무한 확장합니다.
                                    </p>
                                </div>
                                <div className="mt-auto">
                                    <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-xl p-4 border border-pink-500/10 mb-3">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                                            <span className="text-xs font-bold text-pink-300">ENGINE STATUS: IDLE</span>
                                        </div>
                                        <div className="w-full h-1 bg-black/20 rounded-full overflow-hidden">
                                            <div className="w-1/3 h-full bg-pink-500/50" />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            onClose();
                                            setTimeout(onOpenEvolution, 50);
                                        }}
                                        className="w-full h-12 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-sm font-black transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 relative z-50 text-left"
                                    >
                                        <Sparkles size={18} />
                                        Evolution Engine 가동
                                    </button>
                                </div>
                            </div>

                        </div>

                        {/* Footer Message */}
                        <div className="p-6 text-center border-t border-white/5 bg-black/20">
                            <p className="text-[10px] text-gray-500 font-medium tracking-widest uppercase text-center w-full">
                                Secure Connection Established • Neural Network Active
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
