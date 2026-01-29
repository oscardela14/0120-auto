
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Heart, RefreshCcw, Send, Check, User, Sparkles } from 'lucide-react';

export const SmartCommunityManager = ({ persona }) => {
    const [replies, setReplies] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const mockComments = [
        { id: 1, user: "K-TikToker", text: "와 이거 진짜 꿀팁이네요! 다음엔 어떤거 다뤄주실건가요?" },
        { id: 2, user: "CreativeLab", text: "영상 퀄리티 무엇... AI가 만든거 맞나요?" },
        { id: 3, user: "TrendSeeker", text: "혹시 전용 템플릿도 공유 가능하신지 궁금합니다!" }
    ];

    const handleGenerateReplies = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setReplies(mockComments.map(c => ({
                commentId: c.id,
                text: `[AI Reply - ${persona}] 감사해요! ${c.user}님! 다음엔 요청하신 주제로 더 심도 있게 다뤄볼게요. 템플릿도 곧 공개 예정이니 팔로우하고 기다려주세요! ✨`
            })));
            setIsGenerating(false);
        }, 1500);
    };

    return (
        <div className="bg-[#0f1218] border border-white/5 rounded-[40px] p-8 mt-12 group">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400">
                        <MessageSquare size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">Smart Community Manager</h3>
                        <p className="text-gray-500 text-sm">실시간 예상 댓글 분석 및 맞춤형 답글 생성</p>
                    </div>
                </div>
                <button
                    onClick={handleGenerateReplies}
                    disabled={isGenerating}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                    {isGenerating ? <RefreshCcw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                    전체 답글 자동 생성
                </button>
            </div>

            <div className="space-y-6">
                {mockComments.map((c, i) => (
                    <motion.div
                        key={c.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/5 rounded-3xl p-6 border border-white/5 hover:border-white/10 transition-all"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-white/10">
                                <User size={18} className="text-gray-500" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-gray-300">{c.user}</span>
                                    <span className="text-[10px] text-gray-600">3분 전</span>
                                </div>
                                <p className="text-sm text-gray-400 mb-4">{c.text}</p>

                                {replies.find(r => r.commentId === c.id) ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 flex items-center justify-between group/reply"
                                    >
                                        <p className="text-xs text-indigo-300 font-medium italic">
                                            {replies.find(r => r.commentId === c.id).text}
                                        </p>
                                        <div className="flex gap-2 opacity-0 group-hover/reply:opacity-100 transition-opacity">
                                            <button className="p-2 bg-indigo-500 text-white rounded-lg"><Send size={12} /></button>
                                            <button className="p-2 bg-white/10 text-gray-400 rounded-lg"><Check size={12} /></button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="flex gap-3">
                                        <button className="text-[10px] text-gray-500 font-bold flex items-center gap-1 hover:text-indigo-400 transition-colors">
                                            <Heart size={10} /> 좋아요
                                        </button>
                                        <button className="text-[10px] text-gray-500 font-bold flex items-center gap-1 hover:text-indigo-400 transition-colors">
                                            <MessageSquare size={10} /> 답글 달기
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
