import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Signal, Youtube, Instagram, CheckCircle2, ChevronRight, AlertCircle, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';

const GLASS_CARD_CLASSES = "bg-[#0f1218]/60 backdrop-blur-2xl border border-white/5 shadow-2xl relative overflow-hidden group transition-all duration-500";

const PlatformStatusWidget = ({ connectedAccounts, onConnect, onDisconnect, activeResult, activePlatform, setActivePlatform }) => {
    const platforms = [
        { id: 'youtube', name: 'YouTube', icon: Youtube, color: '#FF0000' },
        { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E4405F' },
        { id: 'naver', name: 'Naver Blog', icon: 'N', color: '#03C75A' },
        { id: 'threads', name: 'Threads', icon: '@', color: '#FFFFFF' }
    ];

    return (
        <div className={cn(GLASS_CARD_CLASSES, "rounded-[40px] h-full p-8 flex flex-col group/card")}>
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                        <Signal size={24} className="animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white tracking-tight">플랫폼 동기화</h3>
                        <p className="text-xs text-gray-500 font-bold">실시간 API 연결 상태</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 space-y-3">
                {platforms.map((p) => {
                    const isConnected = connectedAccounts.includes(p.id);
                    return (
                        <div
                            key={p.id}
                            className={cn(
                                "p-4 rounded-2xl border flex items-center justify-between transition-all group/item",
                                isConnected ? "bg-emerald-500/5 border-emerald-500/20" : "bg-white/[0.02] border-white/5 hover:border-white/20"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black",
                                    isConnected ? "bg-emerald-500 text-white" : "bg-white/5 text-gray-500"
                                )}>
                                    {typeof p.icon === 'string' ? p.icon : <p.icon size={20} />}
                                </div>
                                <div>
                                    <div className="text-sm font-black text-white">{p.name}</div>
                                    <div className={cn("text-[10px] font-bold uppercase", isConnected ? "text-emerald-400" : "text-gray-600")}>
                                        {isConnected ? 'Sync Active' : 'Disconnected'}
                                    </div>
                                </div>
                            </div>

                            {isConnected ? (
                                <button
                                    onClick={() => onDisconnect(p.id)}
                                    className="p-2 hover:bg-red-500/10 rounded-lg text-gray-700 hover:text-red-500 transition-all"
                                >
                                    <CheckCircle2 size={16} />
                                </button>
                            ) : (
                                <button
                                    onClick={() => onConnect(p.id)}
                                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-all"
                                >
                                    <Plus size={16} />
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PlatformStatusWidget;
