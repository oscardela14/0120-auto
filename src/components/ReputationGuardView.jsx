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

            {/* Status Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1 bg-black/40 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-4 relative">
                        <Shield className="text-red-500 animate-pulse" size={24} />
                        <div className="absolute inset-0 bg-red-500/10 blur-xl rounded-full" />
                    </div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Shield Status</span>
                    <span className="text-sm font-black text-green-500 uppercase">ACTIVE</span>
                </div>
                <div className="md:col-span-3 bg-black/40 border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Neural Defense Log</span>
                        <div className="flex gap-1">
                            <div className="w-1 h-1 bg-red-500 rounded-full animate-ping" />
                        </div>
                    </div>
                    <div className="space-y-2 font-mono text-[10px] text-red-500/60">
                        <p>[14:22:04] MONITORING_INCOMING_TRAFFIC...</p>
                        <p>[14:22:08] NEGATIVE_SENTIMENT_DETECTED_V3</p>
                        <p>[14:22:08] NEURAL_DEFENSE_PROXIES_READY</p>
                    </div>
                </div>
            </div>

            {/* Input Section */}
            <div className="bg-[#0f1218] border border-red-500/10 rounded-[32px] p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[80px] rounded-full pointer-events-none" />
                <label className="block text-xs font-black text-gray-500 mb-4 uppercase tracking-[0.2em]">Target Crisis Content</label>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="악성 댓글이나 위기 상황의 질문을 입력하세요..."
                        className="flex-1 bg-black/40 border border-white/10 rounded-2xl p-5 text-white font-bold focus:border-red-500 focus:outline-none transition-all"
                        onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                    />
                    <button
                        onClick={handleAnalyze}
                        disabled={loading || !comment.trim()}
                        className="px-10 py-5 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-black text-white transition-all flex items-center gap-3 shadow-2xl shadow-red-900/40 uppercase tracking-widest"
                    >
                        {loading ? <Zap size={20} className="animate-spin" /> : <Shield size={20} />}
                        Execute Defense
                    </button>
                </div>
            </div>

            {/* Result Section */}
            {result && (
                <div className="space-y-8 animate-fade-in relative z-10">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-start gap-4">
                        <AlertTriangle className="text-red-500 shrink-0 mt-1" size={24} />
                        <div>
                            <span className="text-[10px] font-black text-red-500 block mb-2 uppercase tracking-widest">Intent Reconstruction result</span>
                            <p className="text-white text-lg font-bold leading-tight">{result.analysis}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {result.responses?.map((res, idx) => (
                            <div key={idx} className="bg-surface/40 border border-white/5 rounded-3xl p-8 hover:border-red-500/40 transition-all group flex flex-col h-full hover:-translate-y-1">
                                <div className="flex items-center justify-between mb-6">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${res.type === 'Wit' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                                        res.type === 'Logic' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                                            'bg-green-500/10 text-green-400 border border-green-500/20'
                                        }`}>
                                        {res.type}
                                    </span>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(res.text);
                                            addNotification("대응 문구가 복사되었습니다.", "success");
                                        }}
                                        className="p-2 bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all"
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                                <p className="text-white text-[15px] font-bold leading-relaxed mb-8 flex-1 italic">
                                    "{res.text}"
                                </p>
                                <div className="pt-6 border-t border-white/5">
                                    <span className="text-[10px] text-gray-500 font-black uppercase block mb-1">Psychological Effect</span>
                                    <span className="text-xs font-bold text-red-400/80">{res.effect}</span>
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
