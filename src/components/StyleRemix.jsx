
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Zap, Ghost, Briefcase, Sparkles, Wand2, ArrowRight } from 'lucide-react';

export const StyleRemix = ({ content, onRemix }) => {
    const [selectedStyle, setSelectedStyle] = useState('default');

    const STYLES = [
        { id: 'default', name: 'Original', icon: Zap, color: 'primary' },
        { id: 'minimal', name: 'Minimal', icon: Layers, color: 'gray' },
        { id: 'mz_trend', name: 'MZ Trend', icon: Sparkles, color: 'pink' },
        { id: 'horror', name: 'Horror', icon: Ghost, color: 'red' },
        { id: 'professional', name: 'Pro-Biz', icon: Briefcase, color: 'blue' }
    ];

    return (
        <div className="bg-[#0f1218] border border-white/5 rounded-[32px] p-6 group">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Wand2 size={18} className="text-secondary" />
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Multi-Engine Remix</h3>
                </div>
                <div className="flex gap-2">
                    <span className="text-[10px] text-gray-500 font-bold bg-white/5 px-2 py-1 rounded-lg border border-white/10">Gemini</span>
                    <span className="text-[10px] text-gray-500 font-bold bg-white/5 px-2 py-1 rounded-lg border border-white/10">GPT-4</span>
                    <span className="text-[10px] text-gray-500 font-bold bg-white/5 px-2 py-1 rounded-lg border border-white/10">Claude 3</span>
                </div>
            </div>

            <p className="text-[11px] text-gray-500 mb-6 leading-relaxed">
                현재 대본의 스타일이 마음에 들지 않나요? <br />
                여러 AI 모델의 문체 특성을 결합한 **하이브리드 리믹스**를 적용해보세요.
            </p>

            <div className="grid grid-cols-5 gap-3">
                {STYLES.map((style) => (
                    <button
                        key={style.id}
                        onClick={() => {
                            setSelectedStyle(style.id);
                            onRemix(style.id);
                        }}
                        className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${selectedStyle === style.id
                            ? 'bg-secondary/10 border-secondary shadow-[0_0_20px_rgba(34,197,94,0.2)]'
                            : 'bg-white/5 border-white/5 hover:border-white/10'
                            }`}
                    >
                        <div className={`p-2 rounded-xl ${selectedStyle === style.id ? 'bg-secondary text-black' : 'bg-white/5 text-gray-400'}`}>
                            <style.icon size={16} />
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-tighter ${selectedStyle === style.id ? 'text-secondary' : 'text-gray-500'}`}>
                            {style.name}
                        </span>
                    </button>
                ))}
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Mode: {selectedStyle} Remixing...</span>
                </div>
                <button className="flex items-center gap-2 text-[10px] font-black text-secondary hover:underline">
                    View Model Comparison <ArrowRight size={12} />
                </button>
            </div>
        </div>
    );
};
