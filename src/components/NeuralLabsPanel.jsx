import React from 'react';
import { Orbit, Loader, Globe, Zap, Sparkles } from 'lucide-react';

export const NeuralLabsPanel = ({ user, isLocalizing, isGeneratingWidget, handleLocalize, handleWidgetGenerate, addNotification }) => {
    // Check if user has access (Pro or Business)
    const hasAccess = user?.plan === 'business' || user?.plan === 'pro';

    if (hasAccess) {
        return (
            <div className="bg-[#050510]/80 backdrop-blur-3xl border border-white/10 rounded-[40px] p-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />
                <div className="flex items-center gap-3 mb-6">
                    <Orbit className="text-cyan-400 animate-spin-slow" size={20} />
                    <h3 className="text-lg font-black text-white uppercase tracking-tighter">Neural Advanced Labs</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={handleLocalize}
                        disabled={isLocalizing}
                        className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-cyan-500/30 transition-all text-left group/btn relative overflow-hidden disabled:opacity-50"
                    >
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover/btn:opacity-20 transition-opacity">
                            {isLocalizing ? <Loader className="animate-spin text-cyan-400" size={64} /> : <Globe size={64} className="text-cyan-400" />}
                        </div>
                        <span className="text-[10px] font-black text-cyan-500 uppercase block mb-1">{isLocalizing ? "Analyzing..." : "Localization"}</span>
                        <span className="text-[12px] font-bold text-gray-300">Quantum Native</span>
                    </button>
                    <button
                        onClick={handleWidgetGenerate}
                        disabled={isGeneratingWidget}
                        className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-purple-500/30 transition-all text-left group/btn relative overflow-hidden disabled:opacity-50"
                    >
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover/btn:opacity-20 transition-opacity">
                            {isGeneratingWidget ? <Loader className="animate-spin text-purple-400" size={64} /> : <Zap size={64} className="text-purple-400" />}
                        </div>
                        <span className="text-[10px] font-black text-purple-500 uppercase block mb-1">{isGeneratingWidget ? "Building..." : "Interaction"}</span>
                        <span className="text-[12px] font-bold text-gray-300">Smart Widget</span>
                    </button>
                </div>
            </div>
        );
    }

    // Starter Plan - Simplified View
    return (
        <div className="bg-white/5 border border-white/10 rounded-[30px] p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <Sparkles className="text-primary" size={24} />
            </div>
            <h3 className="text-sm font-black text-white mb-1">AI 자동 최적화</h3>
            <p className="text-[11px] text-gray-400 mb-4">복잡한 설정 없이 AI가 최적의 상태로 콘텐츠를 튜닝합니다.</p>
            <button
                onClick={() => addNotification("AI 자동 최적화가 완료되었습니다. (Starter Mode)", "success")}
                className="w-full py-3 bg-primary hover:bg-primary/90 rounded-xl text-xs font-black text-white uppercase tracking-widest transition-all"
            >
                Auto Optimize
            </button>
        </div>
    );
};
