import { motion } from 'framer-motion';
import { Clock, Layout, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

const GLASS_CARD_CLASSES = "bg-[#0f1218]/60 backdrop-blur-2xl border border-white/5 shadow-2xl relative overflow-hidden group transition-all duration-500";

const RecentProjectsWidget = ({ history, onNavigate }) => {
    return (
        <div className={cn(GLASS_CARD_CLASSES, "rounded-[40px] h-full p-8 flex flex-col group/card")}>
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 border border-white/10 group-hover/card:border-indigo-500/30 transition-all">
                        <Clock size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white tracking-tight">최근 프로젝트</h3>
                        <p className="text-xs text-gray-500 font-bold">생성된 콘텐츠 히스토리</p>
                    </div>
                </div>
                <button
                    onClick={() => onNavigate('/history')}
                    className="text-[11px] font-black text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 uppercase tracking-widest"
                >
                    View All <ArrowRight size={14} />
                </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                {history?.length > 0 ? (
                    history.slice(0, 4).map((item) => (
                        <motion.div
                            key={item.id}
                            whileHover={{ x: 5 }}
                            className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group/item hover:bg-white/[0.05] transition-all cursor-pointer"
                            onClick={() => onNavigate('/history')}
                        >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover/item:bg-indigo-500 group-hover/item:text-white transition-all">
                                    <Layout size={18} />
                                </div>
                                <div className="truncate">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <div className="text-sm font-black text-white truncate">{item.topic || item.title}</div>
                                        {(item.isAutoDraft || item.isGoldenKeyword) && (
                                            <div className="px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-md flex items-center gap-1 shrink-0">
                                                <Sparkles size={8} className="text-amber-400" />
                                                <span className="text-[8px] font-black text-amber-400 uppercase tracking-tighter">GOLDEN</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-[10px] text-gray-500 font-bold">{item.platform} • {new Date(item.createdAt).toLocaleDateString()}</div>
                                </div>
                            </div>
                            <ArrowRight size={14} className="text-gray-700 group-hover/item:text-indigo-400 transition-colors" />
                        </motion.div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                        <Layout size={32} className="text-gray-600 mb-3" />
                        <p className="text-sm font-bold text-gray-500">생성된 프로젝트가 없습니다.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentProjectsWidget;
