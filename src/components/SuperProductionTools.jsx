
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Video, Globe, Zap, Radio, Check, Loader2, Sparkles, Map, Gift } from 'lucide-react';

export const SuperProductionTools = ({ content, script, topic }) => {
    const [voiceStatus, setVoiceStatus] = useState('idle'); // idle, loading, done
    const [videoStatus, setVideoStatus] = useState('idle');
    const [bridgeStatus, setBridgeStatus] = useState('idle');

    const handleVoiceClone = () => {
        setVoiceStatus('loading');
        setTimeout(() => setVoiceStatus('done'), 2000);
    };

    const handleVideoRender = () => {
        setVideoStatus('loading');
        setTimeout(() => setVideoStatus('done'), 3000);
    };

    const handleGlobalBridge = () => {
        setBridgeStatus('loading');
        setTimeout(() => setBridgeStatus('done'), 2000);
    };

    return (
        <div className="space-y-4">
            {/* 1. Neural Voice Factory */}
            <div className="bg-[#0f1218] border border-white/5 rounded-[32px] p-6 group hover:border-indigo-500/30 transition-all">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Mic size={18} className="text-indigo-400" />
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Neural Voice Factory</h3>
                    </div>
                    {voiceStatus === 'done' && <Check size={16} className="text-emerald-400" />}
                </div>
                <p className="text-[10px] text-gray-500 mb-6 leading-relaxed">내 목소리를 10초 만에 복제하여 대본 나레이션을 생성합니다.</p>
                <button
                    onClick={handleVoiceClone}
                    disabled={voiceStatus !== 'idle'}
                    className={`w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${voiceStatus === 'done' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                        }`}
                >
                    {voiceStatus === 'loading' ? <Loader2 size={14} className="animate-spin" /> : <Radio size={14} />}
                    {voiceStatus === 'idle' ? '나의 AI 목소리 입히기' : voiceStatus === 'loading' ? '목소리 클로닝 중...' : '클로닝 완료 (MP3 패키징)'}
                </button>
            </div>

            {/* 2. Auto-Video Generator */}
            <div className="bg-[#0f1218] border border-white/5 rounded-[32px] p-6 group hover:border-purple-500/30 transition-all">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Video size={18} className="text-purple-400" />
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Auto-Video Generator</h3>
                    </div>
                </div>
                <p className="text-[10px] text-gray-500 mb-6 leading-relaxed">히트맵 피크 지점에 고화질 스톡 영상을 자동 매칭하고 자막을 렌더링합니다.</p>
                <button
                    onClick={handleVideoRender}
                    disabled={videoStatus !== 'idle'}
                    className={`w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${videoStatus === 'done' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                        }`}
                >
                    {videoStatus === 'loading' ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                    {videoStatus === 'idle' ? 'AI 최종 영상 렌더링' : videoStatus === 'loading' ? '영상 합성 및 자막 생성 중...' : '영상 렌더링 완료 (.MP4)'}
                </button>
            </div>

            {/* 3. Global Profit-Bridge */}
            <div className="bg-gradient-to-br from-indigo-900/20 to-black border border-white/10 rounded-[32px] p-6 group">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Globe size={18} className="text-blue-400" />
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Global Profit-Bridge</h3>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-6">
                    {['USA', 'JPN', 'VNM'].map(lang => (
                        <div key={lang} className="bg-white/5 border border-white/10 rounded-xl p-2 text-center">
                            <span className="text-[9px] font-bold text-gray-400">{lang}</span>
                        </div>
                    ))}
                </div>
                <button
                    onClick={handleGlobalBridge}
                    disabled={bridgeStatus !== 'idle'}
                    className={`w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${bridgeStatus === 'done' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                        }`}
                >
                    {bridgeStatus === 'loading' ? <Loader2 size={14} className="animate-spin" /> : <Map size={14} />}
                    {bridgeStatus === 'idle' ? '글로벌 진출 시뮬레이션' : 'Global Localization 완료'}
                </button>
                {bridgeStatus === 'done' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                        <div className="flex items-center gap-2 text-[9px] text-blue-400 font-bold mb-1">
                            <Gift size={10} /> 고단가 제휴 상품 매칭 완료
                        </div>
                        <p className="text-[9px] text-gray-400 leading-tight">해당 국가의 Amazon 및 Rakuten 제휴 링크가 본문에 자동 삽입되었습니다.</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
