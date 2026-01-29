import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Image as LucideImage, Music, Mic2, Wand2, Download, Zap, Sparkles, RefreshCcw, Layout, Play, Volume2, Save, FileVideo, Palette, Headphones, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Info } from 'lucide-react';

const MultimediaCard = ({ title, icon: Icon, children, color = "indigo", badges = [] }) => {
    // Map colors to safe Tailwind classes to ensure they are picked up
    const colorClasses = {
        pink: "bg-pink-500/10 text-pink-400",
        orange: "bg-orange-500/10 text-orange-400",
        blue: "bg-blue-500/10 text-blue-400",
        indigo: "bg-indigo-500/10 text-indigo-400",
        purple: "bg-purple-500/10 text-purple-400"
    };
    const activeColorClass = colorClasses[color] || colorClasses.indigo;

    return (
        <div className={`bg-surface/30 border border-white/10 rounded-2xl p-6 relative overflow-hidden group flex flex-col`}>
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${activeColorClass}`}>
                        <Icon size={22} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">{title}</h3>
                        <div className="flex gap-2 mt-1">
                            {badges.map((b, i) => (
                                <span key={i} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-md">{b}</span>
                            ))}
                        </div>
                    </div>
                </div>
                <button className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all">
                    <RefreshCcw size={16} />
                </button>
            </div>
            {children}
        </div>
    );
};

export const ProductionLabView = () => {
    const { activeResult, user, addNotification } = useUser();
    const navigate = useNavigate();

    // Voice Profiles Map (Extreme Variance for Distinctiveness)
    const VOICE_SPECS = {
        alloy: { name: 'Alloy', desc: '표준/아나운서', pitch: 1.0, rate: 1.0 },
        echo: { name: 'Echo', desc: '초저음/영화톤', pitch: 0.1, rate: 0.9 },
        fable: { name: 'Fable', desc: '고음/하이텐션', pitch: 1.9, rate: 1.3 },
        onyx: { name: 'Onyx', desc: '느림/다큐멘터리', pitch: 0.6, rate: 0.7 }
    };

    // Persona-aware voice recommendations
    const VOICE_PRESETS = {
        witty: { name: 'Alloy', desc: 'Versatile & Neutral', vibe: '재치 있는 설명에 최적화' },
        professional: { name: 'Onyx', desc: 'Deep & Authoritative', vibe: '신뢰감 있는 지식 전달' },
        empathetic: { name: 'Fable', desc: 'Soft & Friendly', vibe: '따뜻한 공감과 힐링' },
        cloneme: { name: 'Echo', desc: 'Direct & Clear', vibe: '담백한 나만의 목소리' }
    };

    const currentPersona = activeResult?.persona || 'witty';
    const recommendedVoice = VOICE_PRESETS[currentPersona] || VOICE_PRESETS.witty;

    const data = {
        imagePrompts: activeResult?.imagePrompts || [
            `Cinematic shot of ${activeResult?.topic || 'content'}, highly detailed, 8k, professional lighting`,
            `Stylized 3D render representing ${activeResult?.topic || 'content'}, trending on artstation, vibrant colors`,
            `Hyper-realistic close-up of ${activeResult?.topic || 'content'}, soft bokeh background, macro lens`
        ],
        visuals: (activeResult?.variants?.[activeResult?.activeVariant || 'A']?.sections || activeResult?.sections || []).map(s => ({
            text: s.text || s.content || "장면 설명이 없습니다.",
            visualUrl: s.visualUrl || `https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80`
        })),
        voiceId: recommendedVoice.name.toLowerCase(),
        estimatedDuration: activeResult?.duration || '60s'
    };

    if (data.visuals.length === 0) {
        data.visuals = [
            { text: "인트로: 시선 집중 주제 공개", visualUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80" },
            { text: "본론: 핵심 비법 3가지 소개", visualUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80" },
            { text: "아웃트로: 콜 투 액션 (팔로우)", visualUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80" }
        ];
    }

    const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
    const [isPlayingVoice, setIsPlayingVoice] = useState(false);
    const [selectedVoice, setSelectedVoice] = useState(data.voiceId);

    const handleGenerateVideo = () => {
        setIsGeneratingVideo(true);
        setTimeout(() => {
            setIsGeneratingVideo(false);
            addNotification("숏폼 비디오 생성이 완료되었습니다! 보관함에서 확인하세요.", "success");
        }, 5000);
    };

    if (!activeResult) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                <Film size={64} className="text-gray-700 mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2">프로덕션 리소스가 없습니다</h2>
                <p className="text-gray-500 mb-8">콘텐츠 스튜디오에서 먼저 콘텐츠를 생성하거나<br />보관함에서 항목을 선택해주세요.</p>
                <button onClick={() => navigate('/studio')} className="px-6 py-3 bg-primary text-white font-bold rounded-xl">스튜디오로 이동</button>
            </div>
        );
    }

    return (
        <div className="max-w-[1440px] mx-auto p-6 md:p-8 space-y-8">
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <Film className="text-purple-400" size={32} />
                        멀티미디어 프로덕션 랩
                    </h1>
                    <p className="text-gray-400 mt-2">스크립트를 기반으로 이미지, 음성, 영상을 AI가 자동으로 구성했습니다.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-white/5 border border-white/10 text-gray-300 font-bold rounded-xl flex items-center gap-2 hover:bg-white/10 transition-all">
                        <Save size={18} /> 설정 저장
                    </button>
                    <button
                        onClick={handleGenerateVideo}
                        disabled={isGeneratingVideo}
                        className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black rounded-xl shadow-xl shadow-purple-500/20 flex items-center gap-2 hover:scale-105 transition-all"
                    >
                        {isGeneratingVideo ? <RefreshCcw className="animate-spin" size={18} /> : <FileVideo size={18} />}
                        {isGeneratingVideo ? '비디오 렌더링 중...' : '숏폼 비디오 완성하기'}
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. AI Image Prompts */}
                <MultimediaCard title="AI 이미지 프롬프트" icon={Palette} color="pink" badges={["Midjourney", "Dall-E 3"]}>
                    <div className="space-y-4">
                        <div className="p-4 bg-pink-500/10 border border-pink-500/20 rounded-2xl mb-4">
                            <div className="flex items-center gap-2 text-pink-400 mb-1">
                                <Sparkles size={14} />
                                <span className="text-[11px] font-black uppercase tracking-widest">AI Extraction Complete</span>
                            </div>
                            <p className="text-[10px] text-pink-300/80 leading-relaxed">
                                주제 "{activeResult.topic}"의 분위기를 분석하여 시각적 몰입감을 극대화할 수 있는 프롬프트를 생성했습니다.
                            </p>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                            {data.imagePrompts.map((prompt, idx) => (
                                <div key={idx} className="group relative">
                                    <div className="p-4 bg-black/40 border border-white/5 rounded-2xl group-hover:border-pink-500/30 transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest">Scene #{idx + 1}</span>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(prompt);
                                                    addNotification("프롬프트가 복사되었습니다.", "success");
                                                }}
                                                className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-all"
                                            >
                                                <Save size={14} />
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-300 leading-relaxed font-medium italic">"{prompt}"</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full py-3 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 text-xs font-black rounded-xl border border-pink-500/20 transition-all flex items-center justify-center gap-2">
                            <Wand2 size={14} /> 모든 리소스로 이미지 생성 요청
                        </button>
                    </div>
                </MultimediaCard>

                {/* 2. Neural Voice Factory */}
                <MultimediaCard title="뉴럴 보이스 팩토리" icon={Mic2} color="orange" badges={["OpenAI Voice", "HD Audio"]}>
                    <div className="bg-black/40 rounded-3xl p-6 border border-white/5 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-400 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30 relative">
                                    <Volume2 size={28} className="text-white" />
                                    {isPlayingVoice && (
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ repeat: Infinity, duration: 1 }}
                                            className="absolute inset-0 rounded-2xl border-2 border-orange-400"
                                        />
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-white font-bold uppercase tracking-tight">{VOICE_SPECS[selectedVoice]?.name}</h4>
                                        <span className="px-2 py-0.5 bg-orange-500 text-white text-[8px] font-black rounded-full uppercase">AI Pick</span>
                                    </div>
                                    <p className="text-[11px] text-gray-500 font-medium">{VOICE_SPECS[selectedVoice]?.desc || 'Standard Voice Profile'}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    if (isPlayingVoice) {
                                        window.speechSynthesis.cancel();
                                        setIsPlayingVoice(false);
                                        return;
                                    }

                                    if ('speechSynthesis' in window) {
                                        window.speechSynthesis.cancel(); // Stop any current speech
                                        const text = data.visuals[0]?.text || "이것은 AI 뉴럴 보이스 미리보기 테스트입니다.";
                                        const utterance = new SpeechSynthesisUtterance(text);
                                        const spec = VOICE_SPECS[selectedVoice] || VOICE_SPECS.alloy;
                                        utterance.lang = 'ko-KR';
                                        utterance.rate = spec.rate;
                                        utterance.pitch = spec.pitch;

                                        utterance.onstart = () => setIsPlayingVoice(true);
                                        utterance.onend = () => setIsPlayingVoice(false);
                                        utterance.onerror = (e) => {
                                            console.error("Speech error:", e);
                                            setIsPlayingVoice(false);
                                        };

                                        window.speechSynthesis.speak(utterance);
                                        addNotification(`[Preview] ${selectedVoice} (시스템 음성)로 재생 중입니다.`, "info");
                                    } else {
                                        addNotification("브라우저가 음성 합성을 지원하지 않습니다.", "error");
                                    }
                                }}
                                className="px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 rounded-xl text-[10px] font-black flex items-center gap-2 transition-all"
                            >
                                {isPlayingVoice ? <RefreshCcw className="animate-spin" size={12} /> : <Headphones size={12} />}
                                {isPlayingVoice ? 'Voice On' : '보이스 미리보기'}
                            </button>
                        </div>

                        <div className="bg-black/20 rounded-2xl p-4 mb-6 border border-white/5">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Audio Visualization</span>
                                <span className="text-[10px] font-mono text-orange-400">00:{data.estimatedDuration}</span>
                            </div>
                            <div className="flex items-center gap-1.5 h-12">
                                {[...Array(24)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={isPlayingVoice ? { height: [`${20 + Math.random() * 80}%`, `${20 + Math.random() * 80}%`] } : { height: '20%' }}
                                        transition={isPlayingVoice ? { duration: 0.15, repeat: Infinity } : { duration: 0.5 }}
                                        className={`flex-1 rounded-full transition-colors ${isPlayingVoice ? 'bg-orange-500' : 'bg-gray-800'}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-3 mt-auto">
                            {Object.entries(VOICE_SPECS).map(([key, spec]) => (
                                <button
                                    key={key}
                                    onClick={() => setSelectedVoice(key)}
                                    className={`py-3 rounded-xl border transition-all flex flex-col items-center gap-1 ${selectedVoice === key
                                        ? 'bg-orange-500 border-orange-500 text-white shadow-xl shadow-orange-500/20 scale-105'
                                        : 'bg-white/5 border-white/5 text-gray-500 hover:border-orange-500/30 hover:text-white'}`}
                                >
                                    <span className="text-[11px] font-bold">{spec.name}</span>
                                    <span className={`text-[9px] ${selectedVoice === key ? 'text-white/80' : 'text-gray-600'}`}>{spec.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </MultimediaCard>

                {/* 3. Visual Auto-Pilot (Scene Matching) */}
                <div className="lg:col-span-2">
                    <MultimediaCard title="비주얼 오토파일럿" icon={Layout} color="blue" badges={["Auto Scene Selection", "60fps Render"]}>
                        <div className="flex items-center gap-4 mb-8 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                                <Sparkles size={20} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm">알고리즘 기반 장면 매칭 완료</h4>
                                <p className="text-xs text-gray-500 font-medium">스크립트의 감정 곡선을 분석하여 가장 몰입도 높은 스톡 영상을 추천합니다.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {(data.visuals || []).slice(0, 4).map((scene, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -8 }}
                                    className="bg-black/30 rounded-[28px] overflow-hidden border border-white/5 group/scene shadow-2xl"
                                >
                                    <div className="aspect-[9/16] md:aspect-video lg:aspect-[9/16] relative overflow-hidden">
                                        <img src={scene.visualUrl} alt={`Scene ${idx}`} className="w-full h-full object-cover group-hover/scene:scale-110 transition-transform duration-[2000ms] ease-out" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                                        <div className="absolute top-4 left-4 flex gap-2">
                                            <span className="bg-blue-600/80 backdrop-blur-md text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-lg border border-white/10">0:{idx * 15}s</span>
                                        </div>
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <div className="px-3 py-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/10">
                                                <p className="text-[10px] text-gray-200 font-bold line-clamp-2 leading-relaxed italic">"{scene.text}"</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <div className="mt-8 flex justify-center">
                            <button className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-black rounded-xl border border-white/10 transition-all flex items-center gap-2 group">
                                전체 장면 분석 결과 보기 (12개)
                                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </MultimediaCard>
                </div>
            </div>
        </div>
    );
};

