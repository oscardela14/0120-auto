import React, { useState } from 'react';
import { Target, Search, Sword, ArrowRight, Zap } from 'lucide-react';
import { reconRivals } from '../lib/cerebras';

const CompetitorReconView = () => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleRecon = async () => {
        if (!input.trim()) return;
        setLoading(true);
        try {
            const data = await reconRivals(input);
            setResult(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 space-y-8">
            <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20">
                    <Target className="text-orange-500" size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter">
                        RIVAL <span className="text-orange-500">RECON</span>
                    </h1>
                    <p className="text-gray-400">자율 경쟁사 정찰: 적의 약점을 찾아 5분 만에 상위 호환 콘텐츠로 제압합니다.</p>
                </div>
            </div>

            <div className="bg-surface border border-white/10 rounded-2xl p-6">
                <label className="block text-sm font-bold text-gray-400 mb-2">경쟁사 콘텐츠(텍스트/URL) 입력</label>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="경쟁사의 유튜브 대본이나 블로그 글을 복사해 넣으세요."
                        className="flex-1 bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:border-orange-500 focus:outline-none transition-colors"
                        onKeyDown={(e) => e.key === 'Enter' && handleRecon()}
                    />
                    <button
                        onClick={handleRecon}
                        disabled={loading || !input.trim()}
                        className="px-8 py-4 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-white transition-all flex items-center gap-2"
                    >
                        {loading ? <Zap size={20} className="animate-pulse" /> : <Search size={20} />}
                        정찰 시작
                    </button>
                </div>
            </div>

            {result && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                    {/* Weakness Analysis */}
                    <div className="bg-surface border border-white/5 rounded-2xl p-6">
                        <h3 className="text-gray-400 font-bold mb-4 flex items-center gap-2">
                            <Search size={18} /> DETECTED WEAKNESS
                        </h3>
                        <div className="p-4 bg-black/40 rounded-xl border border-white/5 text-gray-300 leading-relaxed">
                            {result.weakness}
                        </div>
                    </div>

                    {/* Counter Strategy */}
                    <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <Sword size={100} />
                        </div>
                        <h3 className="text-orange-500 font-black mb-4 flex items-center gap-2 relative z-10">
                            <Sword size={18} /> COUNTER STRATEGY
                        </h3>
                        <p className="text-white font-medium mb-6 relative z-10">
                            {result.counter_strategy}
                        </p>

                        <div className="bg-black/40 rounded-xl p-4 border border-orange-500/20 relative z-10">
                            <div className="text-xs text-orange-500 font-bold mb-2">GENERATED TITLE</div>
                            <div className="text-lg font-bold text-white mb-2">{result.counter_content?.title}</div>
                            <div className="text-sm text-gray-400">"{result.counter_content?.hook}"</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompetitorReconView;
