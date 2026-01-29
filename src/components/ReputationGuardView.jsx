import React, { useState } from 'react';
import { Shield, MessageCircle, AlertTriangle, CheckCircle, Copy, Zap } from 'lucide-react';
import { guardReputation } from '../lib/cerebras';

const ReputationGuardView = () => {
    const [comment, setComment] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        if (!comment.trim()) return;
        setLoading(true);
        try {
            const data = await guardReputation(comment);
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
                <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20">
                    <Shield className="text-red-500" size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter">
                        REPUTATION <span className="text-red-500">GUARD</span>
                    </h1>
                    <p className="text-gray-400">실시간 여론 방어 시스템: 악플을 기회로 바꾸는 0.1초의 마법</p>
                </div>
            </div>

            {/* Input Section */}
            <div className="bg-surface border border-white/10 rounded-2xl p-6">
                <label className="block text-sm font-bold text-gray-400 mb-2">위기 댓글/질문 입력</label>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="예: 니네 제품 솔직히 별로인 듯 ㅋㅋ"
                        className="flex-1 bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:border-red-500 focus:outline-none transition-colors"
                        onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                    />
                    <button
                        onClick={handleAnalyze}
                        disabled={loading || !comment.trim()}
                        className="px-8 py-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-white transition-all flex items-center gap-2"
                    >
                        {loading ? <Zap size={20} className="animate-pulse" /> : <Shield size={20} />}
                        방어 실행
                    </button>
                </div>
            </div>

            {/* Result Section */}
            {result && (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 flex items-start gap-3">
                        <AlertTriangle className="text-red-500 shrink-0" size={20} />
                        <div>
                            <span className="text-xs font-bold text-red-500 block mb-1">AI INTENT ANALYSIS</span>
                            <p className="text-gray-300 font-medium">{result.analysis}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {result.responses?.map((res, idx) => (
                            <div key={idx} className="bg-surface/50 border border-white/5 rounded-2xl p-6 hover:border-red-500/30 transition-all group">
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${res.type === 'Wit' ? 'bg-yellow-500/10 text-yellow-500' :
                                            res.type === 'Logic' ? 'bg-blue-500/10 text-blue-500' :
                                                'bg-green-500/10 text-green-500'
                                        }`}>
                                        {res.type} Strategy
                                    </span>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(res.text)}
                                        className="text-gray-500 hover:text-white transition-colors"
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                                <p className="text-white font-medium leading-relaxed mb-4 min-h-[80px]">
                                    "{res.text}"
                                </p>
                                <div className="text-xs text-gray-500 border-t border-white/5 pt-3">
                                    <span className="text-gray-400 font-bold">Effect:</span> {res.effect}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReputationGuardView;
