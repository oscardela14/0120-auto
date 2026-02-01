
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Rocket, BookOpen } from 'lucide-react';
import { PERSONAS } from '../../utils/contentGenerator';
import { cn } from '../../lib/utils';

export const StudioGenerator = ({
    mode,
    topic,
    setTopic,
    batchTopics,
    setBatchTopics,
    selectedPersona,
    setSelectedPersona,
    recommendedTags,
    handleAddTag,
    setShowTemplateModal
}) => {
    return (
        <div className="mb-12 p-10 bg-[#0f1218]/80 backdrop-blur-3xl border border-white/5 rounded-[40px] relative overflow-hidden group shadow-3xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="flex items-center justify-between mb-10 relative z-10">
                <h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-tighter uppercase">
                    <div className="p-2 bg-indigo-500/20 rounded-xl">
                        <Zap className="text-indigo-400" size={24} />
                    </div>
                    {mode === 'single' ? '단일 콘텐츠 생성' : '주간 배치 전략 수립'}
                </h2>
                <button
                    onClick={() => setShowTemplateModal(true)}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 rounded-2xl text-[18px] font-black uppercase tracking-widest transition-all flex items-center gap-2.5"
                >
                    <BookOpen size={16} /> 템플릿 불러오기
                </button>
            </div>

            {mode === 'single' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-10 relative z-10">
                    <div className="lg:col-span-6 xl:col-span-7">
                        <label className="text-[16px] font-black text-gray-500 uppercase tracking-widest mb-4 block">주제 입력</label>
                        <div className="relative mb-6">
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="생성하고 싶은 키워드나 주제를 입력하세요..."
                                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-lg font-bold text-white placeholder-gray-700 focus:outline-none focus:border-indigo-500/50 transition-all focus:ring-4 focus:ring-indigo-500/5 shadow-inner"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider py-1.5 mr-2">추천 태그:</span>
                            {recommendedTags.map((tag, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleAddTag(tag)}
                                    className="px-3.5 py-1.5 bg-white/5 hover:bg-indigo-500/20 border border-white/5 hover:border-indigo-500/30 rounded-full text-[12px] font-bold text-gray-400 hover:text-indigo-400 transition-all active:scale-95"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-6 xl:col-span-5">
                        <label className="text-[16px] font-black text-gray-500 uppercase tracking-widest mb-4 block">AI 페르소나</label>
                        <div className="grid grid-cols-2 gap-4">
                            {PERSONAS.map(persona => (
                                <button
                                    key={persona.id}
                                    onClick={() => setSelectedPersona(persona.id)}
                                    className={cn(
                                        "relative p-5 rounded-[24px] border transition-all duration-300 text-left group/persona overflow-hidden",
                                        selectedPersona === persona.id
                                            ? "bg-indigo-600/20 border-indigo-500 text-white shadow-xl shadow-indigo-500/10"
                                            : "bg-white/5 border-white/5 text-gray-500 hover:border-white/10"
                                    )}
                                >
                                    <div className="relative z-10 flex items-center gap-3">
                                        <span className="text-2xl">{persona.icon}</span>
                                        <div className="flex flex-col">
                                            <span className={cn(
                                                "text-[13px] font-black whitespace-pre-line leading-tight",
                                                selectedPersona === persona.id ? "text-white" : "text-gray-400 group-hover/persona:text-gray-200"
                                            )}>
                                                {persona.name}
                                            </span>
                                        </div>
                                    </div>
                                    {selectedPersona === persona.id && (
                                        <motion.div
                                            layoutId="persona-glow"
                                            className="absolute inset-0 bg-indigo-500/10 blur-[20px] pointer-events-none"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mb-10 relative z-10">
                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-4 block">주간 배치 기획 (5개 주제)</label>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                        {batchTopics.map((t, idx) => (
                            <input
                                key={idx}
                                type="text"
                                value={t}
                                onChange={(e) => {
                                    const newTopics = [...batchTopics];
                                    newTopics[idx] = e.target.value;
                                    setBatchTopics(newTopics);
                                }}
                                placeholder={`Day ${idx + 1}`}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white placeholder-gray-700 focus:outline-none focus:border-emerald-500/50 transition-all"
                            />
                        ))}
                    </div>
                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-4 block">공통 페르소나 설정</label>
                    <div className="grid grid-cols-4 gap-4">
                        {PERSONAS.map(persona => (
                            <button
                                key={persona.id}
                                onClick={() => setSelectedPersona(persona.id)}
                                className={cn(
                                    "relative p-4 rounded-2xl border transition-all duration-300 text-center group/persona overflow-hidden",
                                    selectedPersona === persona.id
                                        ? "bg-emerald-600/20 border-emerald-500 text-white"
                                        : "bg-white/5 border-white/5 text-gray-500"
                                )}
                            >
                                <span className="text-xl block mb-1">{persona.icon}</span>
                                <span className={cn(
                                    "text-[11px] font-black whitespace-pre-line leading-tight",
                                    selectedPersona === persona.id ? "text-white" : "text-gray-400"
                                )}>
                                    {persona.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
