import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Trash2, ExternalLink, Sparkles, Zap } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { PreviewModal } from './PreviewModal';

export const HistoryView = ({ history, onDelete }) => {
    const { setActiveResult } = useUser();
    const navigate = useNavigate();
    const [selectedItem, setSelectedItem] = useState(null);

    if (!history || history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                <div className="w-20 h-20 bg-surface border border-white/5 rounded-full flex items-center justify-center mb-6">
                    <Calendar size={32} className="text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">아직 기록이 없습니다</h3>
                <p className="text-gray-500 max-w-sm">
                    생성된 콘텐츠가 여기에 표시됩니다. "주제 탐색" 탭에서 첫 번째 콘텐츠를 만들어보세요!
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-[1440px] mx-auto p-4 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-8">생성 기록</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {history.map((item, index) => (
                    <motion.div
                        key={item.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-surface/30 border border-white/5 rounded-2xl p-6 hover:border-primary/30 hover:bg-surface/50 transition-all group relative overflow-hidden flex flex-col h-full"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                                className="p-2 bg-black/50 hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded-lg transition-colors border border-white/10"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded bg-white/5 border border-white/5 ${item.platform?.includes('YouTube') ? 'text-red-400' :
                                item.platform?.includes('Instagram') ? 'text-pink-400' :
                                    item.platform?.includes('Naver') ? 'text-green-400' : 'text-gray-200'
                                }`}>
                                {item.platform}
                            </span>
                            {item.isScoutContent && (
                                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                                    <Sparkles size={10} /> AI 발견
                                </span>
                            )}
                            <span className="text-[10px] text-gray-500 font-bold ml-auto uppercase tracking-tighter">
                                {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>

                        <div
                            className="cursor-pointer"
                            onClick={() => setSelectedItem(item)}
                        >
                            <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors hover:underline underline-offset-4">
                                {item.title}
                            </h3>
                            <p className="text-sm text-gray-400 mb-6 line-clamp-2 leading-relaxed">
                                주제: {item.topic}
                            </p>
                        </div>

                        <div className="mt-auto grid grid-cols-3 gap-2 pt-5 border-t border-white/5">
                            <button
                                onClick={(e) => { e.stopPropagation(); setActiveResult(item); navigate('/studio'); }}
                                className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-white/5 hover:bg-primary/20 hover:text-primary transition-all group/btn"
                            >
                                <Zap size={16} className="group-hover/btn:scale-110 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-tighter">Studio</span>
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setActiveResult(item); navigate('/production'); }}
                                className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-white/5 hover:bg-purple-500/20 hover:text-purple-400 transition-all group/btn"
                            >
                                <Sparkles size={16} className="group-hover/btn:scale-110 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-tighter">Lab</span>
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setActiveResult(item); navigate('/growth'); }}
                                className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-white/5 hover:bg-orange-500/20 hover:text-orange-400 transition-all group/btn"
                            >
                                <ExternalLink size={16} className="group-hover/btn:scale-110 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-tighter">Growth</span>
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Detailed View Modal */}
            <PreviewModal
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                data={selectedItem}
                onConfirm={() => setSelectedItem(null)} // Read-only mode for now
            />
        </div>
    );
};
