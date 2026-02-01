import React from 'react';
import { Zap, Rocket } from 'lucide-react';
import { cn } from '../../lib/utils';

export const StudioHeader = ({ mode, setMode }) => {
    return (
        <div className="mb-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-[24px] bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-600/30">
                    <Zap size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter mb-1 uppercase">콘텐츠 전략 기획실</h1>
                    <p className="text-gray-500 font-medium tracking-tight">AI 군집 엔진 기반 멀티 플랫폼 콘텐츠 생산 기지</p>
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    className={cn(
                        "px-8 h-14 rounded-2xl font-black text-sm uppercase tracking-widest border transition-all flex items-center gap-3",
                        mode === 'single' ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20" : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    )}
                    onClick={() => setMode('single')}
                >
                    <Zap size={18} /> 단일 생성
                </button>
                <button
                    className={cn(
                        "px-8 h-14 rounded-2xl font-black text-sm uppercase tracking-widest border transition-all flex items-center gap-3",
                        mode === 'batch' ? "bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/20" : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    )}
                    onClick={() => setMode('batch')}
                >
                    <Rocket size={18} /> 주간 배치
                </button>
            </div>
        </div>
    );
};
