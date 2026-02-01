
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Target } from 'lucide-react';

export const CampaignArchitect = ({ plan, topic }) => {
    if (!plan) return null;

    return (
        <div className="bg-[#0f1218]/80 backdrop-blur-xl border border-white/5 rounded-[32px] overflow-hidden group">
            <div className="px-6 py-5 border-b border-white/5 bg-gradient-to-r from-purple-500/10 to-blue-500/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Calendar size={20} className="text-purple-400" />
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">7-Day Campaign Plan</h3>
                </div>
                <div className="px-3 py-1 bg-purple-500/20 rounded-full border border-purple-500/20 text-[10px] font-bold text-purple-400 animate-pulse">
                    Omni-Channel Auto-Pilot
                </div>
            </div>

            <div className="p-6">
                <p className="text-[11px] text-gray-500 mb-6 leading-relaxed">
                    단일 소스를 활용한 7일간의 옴니채널 마케팅 시나리오입니다. <br />
                    주제: <span className="text-white font-bold">{topic}</span>
                </p>

                <div className="space-y-4">
                    {plan.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="relative pl-6 border-l-2 border-white/5 group/item"
                        >
                            <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-[#0f1218] border-2 border-gray-700 group-hover/item:border-purple-500 transition-colors flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-700 group-hover/item:bg-purple-500 transition-colors"></div>
                            </div>

                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 group-hover/item:border-purple-500/30 transition-all">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">{item.day} • {item.platform}</span>
                                    <div className="flex items-center gap-1.5 text-[9px] text-gray-400 bg-black/40 px-2 py-0.5 rounded-full">
                                        <Target size={10} /> {item.goal}
                                    </div>
                                </div>
                                <h4 className="text-xs font-bold text-gray-200 mb-2">{item.type} Strategy</h4>
                                <p className="text-[11px] text-gray-500 group-hover/item:text-gray-300 transition-colors leading-relaxed">
                                    {item.action}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <button className="w-full mt-8 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-purple-600/20 transition-all hover:scale-[1.02]">
                    모든 채널 콘텐츠 동시 생성하기
                </button>
            </div>
        </div>
    );
};
