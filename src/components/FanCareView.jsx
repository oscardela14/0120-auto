import React, { useState } from 'react';
import { Heart, MessageSquare, Sparkles, User, Send } from 'lucide-react';
import { generateFanReply } from '../lib/cerebras';

const FanCareView = () => {
    const [fanName, setFanName] = useState('');
    const [history, setHistory] = useState('');
    const [message, setMessage] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!message.trim()) return;
        setLoading(true);
        try {
            const data = await generateFanReply(fanName || '익명 팬', history || '없음', message);
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
                <div className="p-3 bg-pink-500/10 rounded-2xl border border-pink-500/20">
                    <Heart className="text-pink-500" size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter">
                        FAN <span className="text-pink-500">CARE</span>
                    </h1>
                    <p className="text-gray-400">초개인화 팬 관리: 단순한 팔로워를 열광적인 찐팬으로 만드는 디테일.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Input Panel */}
                <div className="md:col-span-1 space-y-4">
                    <div className="bg-surface border border-white/10 rounded-2xl p-6 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">FAN NAME</label>
                            <input
                                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white text-sm"
                                placeholder="예: 김철수"
                                value={fanName}
                                onChange={e => setFanName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">HISTORY (Optional)</label>
                            <textarea
                                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white text-sm h-24 resize-none"
                                placeholder="예: 지난번 라이브 때 1만원 후원, 시험 준비 중이라고 했음."
                                value={history}
                                onChange={e => setHistory(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Message & Result */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-surface border border-white/10 rounded-2xl p-6">
                        <label className="block text-sm font-bold text-gray-400 mb-2">팬이 보낸 메시지</label>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="팬의 댓글이나 DM 내용 입력"
                                className="flex-1 bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:border-pink-500 focus:outline-none"
                                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                            />
                            <button
                                onClick={handleGenerate}
                                disabled={loading || !message.trim()}
                                className="px-6 py-4 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 rounded-xl font-bold text-white transition-all"
                            >
                                {loading ? <Sparkles size={20} className="animate-spin" /> : <Send size={20} />}
                            </button>
                        </div>
                    </div>

                    {result && (
                        <div className="bg-gradient-to-br from-pink-500/10 to-purple-600/10 border border-pink-500/20 rounded-2xl p-8 relative animate-fade-in">
                            <div className="absolute top-4 left-4">
                                <MessageSquare className="text-pink-500 opacity-50" size={24} />
                            </div>
                            <div className="text-center mb-6">
                                <div className="inline-block px-3 py-1 bg-pink-500/20 rounded-full text-pink-400 text-xs font-bold mb-2">
                                    HYPER-PERSONALIZED REPLY
                                </div>
                                <h3 className="text-white text-xl font-medium leading-relaxed">
                                    "{result.reply}"
                                </h3>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                                <Sparkles size={14} className="text-yellow-400" />
                                <span>Emotional Touchpoint: <span className="text-white">{result.emotional_point}</span></span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FanCareView;
