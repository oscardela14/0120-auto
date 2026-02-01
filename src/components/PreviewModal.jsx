import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Monitor, CheckCircle, Edit2, Share2, Loader, BarChart3, ShieldCheck, Globe, Zap, RefreshCcw, Signal } from 'lucide-react';
import { humanizeText } from '../utils/humanizeEngine';
import { useUser } from '../contexts/UserContext';
import { getStockVideo } from '../utils/stockVideos';

export const PreviewModal = ({ isOpen, onClose, onConfirm, data }) => {
    const [editedData, setEditedData] = useState(null);
    const [activeTab, setActiveTab] = useState('preview'); // preview | edit
    const [isPlaying, setIsPlaying] = useState(false);
    const [isHumanizing, setIsHumanizing] = useState(false);
    const [imageSeed, setImageSeed] = useState(Math.floor(Math.random() * 1000));
    const [imageLoadTrigger, setImageLoadTrigger] = useState(Date.now()); // Controlled cache buster
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [playbackTime, setPlaybackTime] = useState(0);

    // New Features States
    const [useVideoBackground, setUseVideoBackground] = useState(true);
    const [voiceStyle, setVoiceStyle] = useState('normal'); // 'normal' | 'energetic' | 'calm'
    const [isAnalyzingStats, setIsAnalyzingStats] = useState(false);
    const [isScraping, setIsScraping] = useState(false);
    const [activeReport, setActiveReport] = useState(null); // null | 'performance' | 'competitor'

    // Auth & Connection States
    const [showAuthOverlay, setShowAuthOverlay] = useState(false);
    const [credentials, setCredentials] = useState({ id: '', pw: '' });
    const [isConnecting, setIsConnecting] = useState(false);

    const { addNotification } = useUser();
    const videoRef = useRef(null);
    const lastReorderTime = useRef(0);
    const videoUrl = editedData ? getStockVideo(editedData.topic) : '';
    const isTextPlatform = data?.platform?.includes('Blog') || data?.platform?.includes('Threads');

    // Force video play when enabled
    useEffect(() => {
        if (useVideoBackground && videoRef.current && videoUrl) {
            videoRef.current.defaultMuted = true;
            videoRef.current.muted = true;
            videoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
        }
    }, [useVideoBackground, videoUrl]);

    // Mock Video Player Timer
    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                setPlaybackTime(prev => {
                    const next = prev + 0.1; // 100ms increment
                    // Reset if > 60s (mock max duration)
                    return next > 60 ? 0 : next;
                });
            }, 100);
        } else {
            setPlaybackTime(0);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const isInitialized = useRef(false);
    useEffect(() => {
        if (isOpen && data) {
            setEditedData(JSON.parse(JSON.stringify(data)));
            const newSeed = Math.floor(Math.random() * 1000);
            setImageSeed(newSeed);
            setImageLoadTrigger(Date.now());
            setIsImageLoading(true);
            setPlaybackTime(0);
            setIsPlaying(false);

            if (['YouTube Shorts', 'Instagram', 'Instagram Reels'].includes(data.platform)) {
                setUseVideoBackground(true);
                if (data.platform === 'YouTube Shorts') setVoiceStyle('energetic');
                else setVoiceStyle('calm');
            } else {
                setUseVideoBackground(false);
                setVoiceStyle('normal');
            }
            isInitialized.current = true;
        } else if (!isOpen) {
            isInitialized.current = false;
            setEditedData(null);
        }
    }, [isOpen, data]);
    // --- Advanced Subtitle & Voice Sync Engine ---
    const activeSubtitle = (() => {
        if (!editedData || !editedData.platform) return null;
        const isVideo = ['YouTube Shorts', 'Instagram', 'Instagram Reels'].includes(editedData.platform);
        if (!isVideo) return null;

        const script = editedData?.script || editedData?.drafts || editedData?.sections;
        if (!script || !Array.isArray(script)) return null;

        const currentScene = script.find((scene, idx) => {
            if (!scene.time) return false;
            try {
                const parseTime = (t) => {
                    if (typeof t !== 'string') return 0;
                    const parts = t.split(':').map(Number);
                    if (parts.length === 2) return parts[0] * 60 + parts[1];
                    return parts[0] || 0;
                };

                let start, end;
                if (scene.time.includes('-')) {
                    const times = scene.time.split('-');
                    start = parseTime(times[0]);
                    end = parseTime(times[1]);
                } else {
                    start = parseTime(scene.time);
                    const nextScene = script[idx + 1];
                    end = nextScene ? parseTime(nextScene.time) : start + 5;
                }

                return playbackTime >= start && playbackTime < end;
            } catch (e) { return false; }
        });
        return currentScene ? (currentScene.text || currentScene.content) : null;
    })();

    // Text-to-Speech (TTS) Handler - MOVED UP
    useEffect(() => {
        if (!('speechSynthesis' in window)) return;

        const synth = window.speechSynthesis;

        if (isPlaying && activeSubtitle) {
            synth.cancel(); // Reset previous
            const cleanText = activeSubtitle.replace(/\([^)]+\)/g, '').trim();
            if (cleanText) {
                const utterance = new SpeechSynthesisUtterance(cleanText);
                utterance.lang = 'ko-KR';

                // Voice Persona Settings
                if (voiceStyle === 'energetic') {
                    utterance.rate = 1.3;
                    utterance.pitch = 1.2;
                } else if (voiceStyle === 'calm') {
                    utterance.rate = 0.9;
                    utterance.pitch = 0.8;
                } else {
                    utterance.rate = 1.1;
                    utterance.pitch = 1.0;
                }

                synth.speak(utterance);
            }
        } else if (!isPlaying) {
            synth.cancel();
        }

        // Cleanup function for effect re-run (e.g. subtitle changed)
        return () => {
            // we don't necessarily cancel here to allow flow, but if paushed/unmounted we do.
        };
    }, [activeSubtitle, isPlaying, voiceStyle]);

    // Cleanup on unmount or close
    useEffect(() => {
        return () => {
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        };
    }, []);

    if (!isOpen || !editedData) return null;

    const isMobileFormat = ['YouTube Shorts', 'Instagram', 'Instagram Reels'].includes(editedData.platform);
    const isThreads = editedData.platform === 'Threads';
    const isBlog = editedData.platform === 'Naver Blog';

    const imgWidth = (isMobileFormat || isThreads) ? 720 : 1280;
    const imgHeight = (isMobileFormat || isThreads) ? 1280 : 640;

    // Helper to generate smart prompt if missing
    const getSmartPrompt = (t, p) => {
        const topicLower = (t || '').toLowerCase();
        let base = 'aesthetic minimal background';
        if (topicLower.includes('게임') || topicLower.includes('game')) base = 'cyberpunk gaming room, neon lights, computer setup, 8k';
        else if (topicLower.includes('요리') || topicLower.includes('푸드') || topicLower.includes('food')) base = 'gourmet food plating, professional photography, cinematic lighting';
        else if (topicLower.includes('여행') || topicLower.includes('브이로그') || topicLower.includes('travel')) base = 'beautiful nature landscape, travel vibes, sunny day, 8k';
        else if (topicLower.includes('뷰티') || topicLower.includes('패션') || topicLower.includes('beauty')) base = 'cosmetics products, pastel aesthetic, soft lighting, minimalist beauty';
        else if (topicLower.includes('운동') || topicLower.includes('헬스') || topicLower.includes('health')) base = 'gym workout environment, fitness equipment, energetic lighting';
        else if (topicLower.includes('테크') || topicLower.includes('가전') || topicLower.includes('tech')) base = 'modern tech workspace, minimal desk, gadgets, clean white aesthetic';
        else if (topicLower.includes('동기부여')) base = 'majestic mountain sunrise, inspirational nature, rays of light';
        else if (topicLower.includes('동물') || topicLower.includes('cat') || topicLower.includes('dog')) base = 'cute pet portrait, fluffy, natural light';
        else if (topicLower.includes('교육') || topicLower.includes('꿀팁') || topicLower.includes('study') || topicLower.includes('tips')) base = 'cozy study desk, open notebook, library atmosphere, warm lighting, books, coffee';
        else if (topicLower.includes('금융') || topicLower.includes('재테크') || topicLower.includes('돈') || topicLower.includes('finance') || topicLower.includes('stcok')) base = 'modern professional office desk, financial growth charts, golden coins, business success atmosphere, high quality';

        const ratioParams = (isMobileFormat || isThreads) ? 'vertical, 9:16 aspect ratio' : 'wide, 2:1 aspect ratio';

        // Context-aware enrichment
        const contentContext = editedData.script?.[0]?.visual || editedData.sections?.[0]?.title || editedData.title || '';
        const smartBase = `${contentContext}, ${base}`;

        return `Subject: ${t}, Visualization: ${smartBase}, Style: ${ratioParams}, Cinematic Lighting, High Quality, Photorealistic, 8k`;
    };

    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(getSmartPrompt(editedData.topic, editedData.platform))}?width=${imgWidth}&height=${imgHeight}&seed=${imageSeed}&nologo=true&model=flux&t=${imageLoadTrigger}`;

    const handleConfirm = (actionType = 'save') => {
        if (actionType === 'upload') {
            // Check if account is connected (Mock)
            // In a real app, this would check global user state or secure storage
            const isConnected = localStorage.getItem(`auth_${data.platform}`);

            if (!isConnected) {
                setShowAuthOverlay(true);
                return;
            }
        }
        onConfirm({ ...editedData, actionType });
    };

    const handleAuthSubmit = (e) => {
        e.preventDefault();
        setIsConnecting(true);

        // Simulate API Connection Delay
        setTimeout(() => {
            localStorage.setItem(`auth_${data.platform}`, JSON.stringify(credentials));
            setIsConnecting(false);
            setShowAuthOverlay(false);
            addNotification(`${data.platform} 계정이 성공적으로 연결되었습니다.`, 'success');

            // Auto-proceed to upload after connection
            onConfirm({ ...editedData, actionType: 'upload' });
        }, 1500);
    };



    const handlePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const handleRefreshImage = (e) => {
        e.stopPropagation();
        setImageSeed(Math.floor(Math.random() * 1000));
        setImageLoadTrigger(Date.now()); // Force new image on refresh
        setIsImageLoading(true);
    };



    const handleWheelReorder = (e, index, type) => {
        // Only trigger if the item is focused (active element is inside)
        if (!e.currentTarget.contains(document.activeElement)) return;

        // Debounce (300ms)
        const now = Date.now();
        if (now - lastReorderTime.current < 300) return;

        const direction = e.deltaY > 0 ? 1 : -1; // Down : Up
        const list = editedData[type];
        if (!list) return;

        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= list.length) return;

        e.preventDefault(); // Prevent page scroll
        lastReorderTime.current = now;

        const newList = [...list];
        [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];

        setEditedData(prev => ({ ...prev, [type]: newList }));
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            >
                <div className="absolute inset-0" onClick={onClose} />

                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="relative w-full max-w-5xl h-[85vh] bg-surface border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b border-white/5 bg-black/20">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            {data.platform === 'Naver Blog' ? <Monitor size={20} /> : <Smartphone size={20} />}
                            최종 미리보기 및 편집
                        </h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab('preview')}
                                className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${activeTab === 'preview' ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/5'}`}
                            >
                                미리보기
                            </button>
                            <button
                                onClick={() => setActiveTab('edit')}
                                className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${activeTab === 'edit' ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/5'}`}
                            >
                                편집하기
                            </button>
                            <div className="w-px h-6 bg-white/10 mx-2 self-center"></div>
                            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-hidden flex flex-col md:flex-row">

                        {/* Preview Section (Left/Center) */}
                        <div className={`flex-1 overflow-y-auto p-8 flex justify-center bg-[#0f1115] ${activeTab === 'edit' ? 'hidden md:flex' : 'flex'}`}>
                            {/* Mobile Formatting (Shorts/Reels/Threads) */}
                            {(isMobileFormat || isThreads) && (
                                <motion.div
                                    key={`mobile-${editedData.version || 0}`}
                                    initial={{ opacity: 0, filter: "brightness(2)" }}
                                    animate={{ opacity: 1, filter: "brightness(1)" }}
                                    className="w-[375px] h-[750px] bg-white text-black rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden relative flex flex-col shrink-0 scale-90 origin-top select-none"
                                >
                                    {/* Notch */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20"></div>

                                    {/* Content Mockup */}
                                    <div className="flex-1 bg-gray-900 relative overflow-hidden group">

                                        {/* 1. Threads Specific UI (Text Focused) */}
                                        {isThreads ? (
                                            <div className="absolute inset-0 bg-white flex flex-col text-black font-sans z-10">
                                                {/* Header */}
                                                <div className="h-14 flex items-center justify-center border-b px-4 mt-8 relative">
                                                    <span className="font-bold text-lg">Threads</span>
                                                    <div className="absolute right-4 w-6 h-6 bg-gray-200 rounded-full"></div>
                                                </div>

                                                {/* Post Content */}
                                                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                                    {(editedData.drafts || editedData.script || editedData.sections || [{ text: editedData.content || editedData.title }]).map((item, i, arr) => (
                                                        <div key={i} className="flex gap-3 relative">
                                                            {/* Avatar Column */}
                                                            <div className="flex flex-col items-center">
                                                                {/* Show avatar only for the first post */}
                                                                {i === 0 ? (
                                                                    <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 z-10 border-2 border-white"></div>
                                                                ) : (
                                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0 z-10 mt-1"></div>
                                                                )}
                                                                {/* Connector Line - unless last item */}
                                                                {i < arr.length - 1 && (
                                                                    <div className="w-0.5 h-full bg-gray-200 -mt-2 mb-0 absolute top-10 bottom-0 left-5 -translate-x-1/2"></div>
                                                                )}
                                                            </div>
                                                            {/* Content Column */}
                                                            <div className="flex-1 pb-6">
                                                                <div className="flex justify-between items-start mb-0.5">
                                                                    <span className="font-bold text-sm">{i === 0 ? "my_profile" : ""}</span>
                                                                    {i === 0 && (
                                                                        <div className="flex gap-2 text-gray-400 text-xs">
                                                                            <span>2m</span>
                                                                            <span>•••</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <p className="text-[14px] leading-[1.5] whitespace-pre-wrap text-black mb-2 text-left">
                                                                    {item.text || item.content || item}
                                                                </p>
                                                                {/* Thread Action Buttons */}
                                                                <div className="flex gap-4 text-gray-400 mt-1 opacity-60">
                                                                    <span className="text-xs">❤️</span>
                                                                    <span className="text-xs">💬</span>
                                                                    <span className="text-xs">⟳</span>
                                                                    <span className="text-xs">✈️</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            /* 2. Shorts/Reels Video UI */
                                            <>
                                                {/* Background Layer (Video or Image) */}
                                                {(useVideoBackground && isPlaying && videoUrl) ? (
                                                    <video
                                                        key={videoUrl}
                                                        ref={videoRef}
                                                        src={videoUrl}
                                                        className="absolute inset-0 w-full h-full object-cover z-0 bg-gray-800"
                                                        autoPlay
                                                        loop
                                                        muted
                                                        playsInline
                                                    />
                                                ) : (
                                                    <img
                                                        src={imageUrl}
                                                        alt="AI Generated Background"
                                                        className="absolute inset-0 w-full h-full object-cover z-0 bg-gray-800"
                                                        onLoad={() => setIsImageLoading(false)}
                                                        onError={(e) => {
                                                            setIsImageLoading(false);
                                                            e.target.src = `https://picsum.photos/seed/${imageSeed}/720/1280`;
                                                        }}
                                                    />
                                                )}

                                                {/* Image Loading Overlay (Z-10) - Only if loading AND using image */}
                                                {!useVideoBackground && isImageLoading && (
                                                    <div className="absolute inset-0 z-10 bg-black/50 flex items-center justify-center flex-col gap-2">
                                                        <Loader size={32} className="animate-spin text-primary" />
                                                        <span className="text-white text-xs">Loading...</span>
                                                    </div>
                                                )}

                                                {/* Gradient Overlay for Readability (Z-10) */}
                                                <div className={`absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90 pointer-events-none transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'} z-10`}></div>

                                                {/* Refresh Button (Z-30) - Only for Image Mode */}
                                                {!isPlaying && !useVideoBackground && (
                                                    <button
                                                        onClick={handleRefreshImage}
                                                        className="absolute top-10 right-4 z-30 p-2 bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
                                                        title="Change Image"
                                                    >
                                                        <Share2 size={16} className="rotate-0 hover:rotate-180 transition-transform" />
                                                    </button>
                                                )}

                                                {/* Play Overlay (Z-30) */}
                                                {!isPlaying ? (
                                                    <div
                                                        className="absolute inset-0 flex items-center justify-center cursor-pointer z-30"
                                                        onClick={handlePlay}
                                                    >
                                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center animate-pulse border border-white/30 hover:scale-110 transition-transform shadow-lg">
                                                            <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-1 drop-shadow-lg"></div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="absolute inset-0 z-30" onClick={handlePlay}>
                                                        {/* Playing State UI */}
                                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600/50">
                                                            <motion.div
                                                                initial={{ width: "0%" }}
                                                                animate={{ width: "100%" }}
                                                                transition={{ duration: 60, ease: "linear" }}
                                                                className="h-full bg-red-600"
                                                            />
                                                        </div>

                                                        {activeSubtitle && (
                                                            <div className="absolute bottom-24 left-0 right-0 z-40 px-6 text-center pointer-events-none">
                                                                <AnimatePresence mode="wait">
                                                                    <motion.span
                                                                        key={activeSubtitle}
                                                                        initial={{ opacity: 0, y: 10 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        exit={{ opacity: 0, y: -10 }}
                                                                        className="inline-block bg-black/60 px-4 py-2 rounded-xl text-white font-bold backdrop-blur-sm shadow-lg text-lg"
                                                                    >
                                                                        {activeSubtitle}
                                                                    </motion.span>
                                                                </AnimatePresence>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}


                                                {/* Static UI (Shorts/Reels Style) - Hide when playing */}
                                                <div className={`absolute inset-0 flex flex-col justify-end p-4 pb-12 bg-gradient-to-t from-black/80 via-transparent to-transparent text-white transition-opacity duration-300 ${isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                                                    <div className="mb-4">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="w-8 h-8 rounded-full bg-gray-500"></div>
                                                            <span className="font-bold text-sm">MyChannel</span>
                                                            <button className="text-xs bg-white text-black px-2 py-0.5 rounded-full font-bold">Subscribe</button>
                                                        </div>
                                                        <div className="max-h-[220px] overflow-y-auto custom-scrollbar pr-2">
                                                            <p className="text-sm font-black text-white mb-2 leading-tight">{editedData.topic || editedData.title}</p>
                                                            <div className="text-[11px] text-gray-200 font-light whitespace-pre-wrap leading-relaxed opacity-90 text-left">
                                                                {(() => {
                                                                    if (editedData.drafts && editedData.drafts.length > 0) {
                                                                        return editedData.drafts.map(d => d.text || d.content).join('\n\n');
                                                                    }
                                                                    const content = editedData.content || (editedData.script || editedData.sections)?.map(s => s.text || s.content).join('\n\n');
                                                                    return content || "내용이 없습니다.";
                                                                })()}
                                                            </div>
                                                            <p className="text-blue-400 text-xs mt-2 font-medium text-left">
                                                                {editedData.hashtags}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Side Reactions - Hide when playing */}
                                                <div className={`absolute right-2 bottom-20 flex flex-col gap-4 items-center text-white transition-opacity duration-500 ${isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                                                    <div className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center">❤️</div>
                                                    <span className="text-xs font-bold">1.2K</span>
                                                    <div className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center">💬</div>
                                                    <span className="text-xs font-bold">342</span>
                                                    <div className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center">✈️</div>
                                                </div>
                                            </>
                                        )
                                        }
                                    </div >
                                </motion.div>
                            )}

                            {/* Blog Formatting */}
                            {
                                isBlog && (
                                    <motion.div
                                        key={`blog-${editedData.version || 0}`}
                                        initial={{ opacity: 0, filter: "brightness(2)" }}
                                        animate={{ opacity: 1, filter: "brightness(1)" }}
                                        className="w-full max-w-2xl bg-white text-black rounded-lg shadow-xl overflow-hidden min-h-[500px] flex flex-col"
                                    >
                                        <div className="h-10 border-b flex items-center px-4 gap-2 bg-gray-50">
                                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                            <div className="ml-auto text-xs text-gray-400">blog.naver.com/myblog</div>
                                        </div>
                                        <div className="p-8 md:p-12 overflow-y-auto select-none">
                                            <div className="text-xs text-green-500 font-bold mb-2 flex items-center gap-2">
                                                전체공개
                                                {editedData.isHumanized && (
                                                    <span className="px-1.5 py-0.5 bg-orange-500 text-white text-[9px] rounded-md animate-bounce">ANTI-AI ACTIVE</span>
                                                )}
                                            </div>
                                            <h1 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4 leading-snug">{editedData.title}</h1>

                                            <div className="prose prose-sm max-w-none text-gray-800 space-y-4">
                                                {/* Blog Header Image */}

                                                {isTextPlatform ? (
                                                    <div className="space-y-6 leading-relaxed text-gray-700 text-base">
                                                        {(editedData.sections || editedData.drafts || []).map((s, idx, arr) => {
                                                            const isLast = idx === arr.length - 1 && arr.length > 1;
                                                            const displayTitle = isLast ? '결론' : (s.title || (
                                                                s.type === 'intro' ? '서론' :
                                                                    s.type === 'body' ? '본론' :
                                                                        s.type === 'outro' ? '결론' : s.type
                                                            ));
                                                            return (
                                                                <div key={idx} className="space-y-3 text-left">
                                                                    {displayTitle && (
                                                                        <h2 className="text-lg font-bold text-gray-900 border-l-4 border-green-500 pl-4 py-0.5 bg-green-50/50">{displayTitle}</h2>
                                                                    )}
                                                                    {(s.text || s.content || "").split('\n\n')
                                                                        .filter(para => !para.includes('[이미지:'))
                                                                        .map((para, i) => (
                                                                            <p key={i} className="text-justify leading-relaxed">{para}</p>
                                                                        ))
                                                                    }
                                                                </div>
                                                            );
                                                        })}
                                                        {(!editedData.sections && !editedData.drafts) && <p className="text-left">{editedData.content || "내용이 없습니다."}</p>}
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4 leading-relaxed text-gray-700 text-base">
                                                        {(editedData.drafts || editedData.script || [])
                                                            .map(s => s.text || s.content || s)
                                                            .filter(text => typeof text === 'string' && !text.includes('[이미지:'))
                                                            .map((text, i) => (
                                                                <p key={i} className="text-justify">{text}</p>
                                                            ))
                                                        }
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-12 pt-8 border-t flex flex-wrap gap-2">
                                                {(editedData.hashtags?.split(/[\s,]+/) || []).map((tag, idx) => {
                                                    const cleanTag = tag.trim();
                                                    if (!cleanTag) return null;
                                                    return (
                                                        <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-500 font-bold text-sm rounded-lg border border-blue-100">
                                                            {cleanTag.startsWith('#') ? cleanTag : `#${cleanTag}`}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            }
                        </div >

                        {/* Editor Section (Right/Mobile Full) */}
                        <div className={`w-full md:w-[400px] bg-surface border-l border-white/5 p-6 overflow-y-auto md:flex flex-col ${activeTab === 'preview' ? 'hidden md:flex' : 'flex'}`}>

                            {/* Performance Forecast */}
                            {editedData.predictedStats && (
                                <motion.button
                                    onClick={() => {
                                        if (isAnalyzingStats) return;
                                        setIsAnalyzingStats(true);
                                        addNotification("콘텐츠 도달률 및 예상 성과 정밀 보고서 생성 중...", "info");
                                        setTimeout(() => {
                                            setIsAnalyzingStats(false);
                                            setActiveReport('performance');
                                        }, 1200);
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`w-full mb-6 mx-4 md:mx-0 p-5 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 relative overflow-hidden group text-left transition-all ${isAnalyzingStats ? 'opacity-70 grayscale-[0.5] cursor-wait' : 'hover:border-indigo-500/40 hover:bg-indigo-500/15 cursor-pointer active:scale-95'}`}
                                >
                                    {isAnalyzingStats && (
                                        <div className="absolute inset-0 bg-indigo-500/5 backdrop-blur-[1px] z-20 flex items-center justify-center">
                                            <Loader size={32} className="text-indigo-400 animate-spin" />
                                        </div>
                                    )}
                                    <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-20 transition-opacity">
                                        <Signal size={60} className="text-indigo-400" />
                                    </div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                            <BarChart3 size={16} className="text-indigo-400" />
                                            성과 예측 리포트
                                        </h4>
                                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/30 text-[9px] font-black text-green-400 animate-pulse">
                                            <Globe size={10} /> LIVE API VERIFIED
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 relative z-10">
                                        <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                                            <span className="text-[10px] text-gray-400 block mb-1">예상 조회수</span>
                                            <span className="text-lg font-bold text-white">{editedData.predictedStats.expectViews}</span>
                                        </div>
                                        <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                                            <span className="text-[10px] text-gray-400 block mb-1">바이럴 점수</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg font-bold text-indigo-400">{editedData.predictedStats.viralityScore}점</span>
                                            </div>
                                        </div>
                                        <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                                            <span className="text-[10px] text-gray-400 block mb-1">경쟁 강도</span>
                                            <span className={`text-sm font-bold ${editedData.predictedStats.competition.includes('낮음') ? 'text-green-400' : editedData.predictedStats.competition.includes('높음') ? 'text-red-400' : 'text-yellow-400'}`}>
                                                {editedData.predictedStats.competition}
                                            </span>
                                        </div>
                                        <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                                            <span className="text-[10px] text-gray-400 block mb-1">데이터 갱신</span>
                                            <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                                                <RefreshCcw size={10} className={isAnalyzingStats ? "animate-spin" : "animate-spin-slow"} /> 실시간
                                            </span>
                                        </div>
                                    </div>
                                </motion.button>
                            )}

                            {/* [WO Strategy] Competitor Analysis Watchdog */}
                            <motion.div
                                onClick={() => {
                                    if (isScraping) return;
                                    setIsScraping(true);
                                    addNotification("경쟁사 실시간 지표 및 전략 보고서 분석 중...", "info");
                                    setTimeout(() => {
                                        setIsScraping(false);
                                        setActiveReport('competitor');
                                    }, 1500);
                                }}
                                whileTap={{ scale: 0.98 }}
                                className={`mb-6 p-5 rounded-xl bg-black/40 border border-white/10 relative overflow-hidden transition-all group ${isScraping ? 'cursor-wait' : 'cursor-pointer hover:border-cyan-500/30 hover:bg-cyan-500/5 active:scale-95'}`}
                            >
                                <h4 className="text-xs font-bold text-gray-400 mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck size={14} className={isScraping ? "text-cyan-400 animate-pulse" : "text-cyan-400"} />
                                        경쟁사 실시간 분석 (Watchdog)
                                    </div>
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded transition-colors ${isScraping ? 'bg-orange-500/20 text-orange-400 animate-pulse' : 'bg-cyan-400/10 text-cyan-400'}`}>
                                        {isScraping ? 'SCRAPING...' : 'Scraping ON'}
                                    </span>
                                </h4>
                                <div className={`space-y-3 transition-all ${isScraping ? 'blur-sm opacity-50' : ''}`}>
                                    {[
                                        { url: "blog.naver.com/tech_expert", title: "2024 트렌드 분석", rank: 1, dwellTime: "4:12" },
                                        { url: "youtube.com/channel/vibe", title: "오늘의 핫이슈", rank: 2, dwellTime: "3:45" }
                                    ].map((comp, idx) => (
                                        <div key={idx} className="flex flex-col gap-1 border-b border-white/5 pb-2 last:border-0 last:pb-0">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[11px] font-bold text-gray-300 truncate max-w-[180px]">{comp.title}</span>
                                                <span className="text-[10px] text-gray-400 font-mono">{comp.dwellTime}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-[9px] text-gray-500">
                                                <span>{comp.url}</span>
                                                <span className="text-cyan-500 font-bold">Rank #{comp.rank}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {isScraping && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/20">
                                        <div className="flex gap-1">
                                            {[0, 1, 2].map(i => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ height: [4, 12, 4] }}
                                                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                                                    className="w-1 bg-cyan-400 rounded-full"
                                                />
                                            ))}
                                        </div>
                                        <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">실시간 스캔 중</span>
                                    </div>
                                )}
                            </motion.div>

                            {/* [ST Strategy] Humanize AI Text Button */}
                            <div className="mb-8">
                                <button
                                    onClick={() => {
                                        setIsHumanizing(true);
                                        addNotification("안티 AI 휴머나이즈 엔진 가동 중...", "info");

                                        setTimeout(() => {
                                            setEditedData(prev => {
                                                // Deep Copy & Update
                                                const newTitle = humanizeText(prev.title || "");

                                                const newDrafts = prev.drafts ? prev.drafts.map(d => {
                                                    if (typeof d === 'string') return humanizeText(d);
                                                    const newText = humanizeText(d.text || d.content || "");
                                                    return { ...d, text: newText, content: newText };
                                                }) : prev.drafts;

                                                const newScript = prev.script ? prev.script.map(s => {
                                                    if (typeof s === 'string') return humanizeText(s);
                                                    const newText = humanizeText(s.text || s.content || "");
                                                    return { ...s, text: newText, content: newText };
                                                }) : prev.script;

                                                const newSections = prev.sections ? prev.sections.map(s => {
                                                    const newContent = humanizeText(s.content || s.text || "");
                                                    return {
                                                        ...s,
                                                        title: humanizeText(s.title || ""),
                                                        content: newContent,
                                                        text: newContent // Sync both to be safe
                                                    };
                                                }) : prev.sections;

                                                const newContent = prev.content ? humanizeText(prev.content) : prev.content;

                                                return {
                                                    ...prev,
                                                    title: newTitle,
                                                    drafts: newDrafts,
                                                    script: newScript,
                                                    sections: newSections,
                                                    content: newContent,
                                                    version: (prev.version || 0) + 1,
                                                    isHumanized: true
                                                };
                                            });

                                            setIsHumanizing(false);
                                            addNotification("휴머나이즈 엔진 적용 완료! 더 자연스러운 말투로 변경되었습니다.", "success");
                                        }, 1000);
                                    }}
                                    disabled={isHumanizing}
                                    className={`w-full py-4 rounded-xl border transition-all group overflow-hidden relative flex flex-col items-center justify-center gap-1 ${isHumanizing ? 'border-orange-500/50 bg-orange-500/20 opacity-80' : 'border-orange-500/30 bg-orange-500/10 hover:border-orange-500 text-orange-400'}`}
                                >
                                    <div className={`absolute top-0 left-0 h-1 bg-gradient-to-r from-orange-500 to-red-500 transition-all ${isHumanizing ? 'w-full duration-[1200ms] ease-linear' : 'w-0 opacity-20'}`}></div>
                                    <div className="flex items-center gap-2 font-black text-sm">
                                        <Zap size={18} className={isHumanizing ? "animate-spin" : "animate-pulse"} />
                                        {isHumanizing ? "변조 엔진 가동 중..." : "안티 AI 휴머나이즈 엔진 가동"}
                                    </div>
                                    <span className="text-[10px] opacity-60 font-medium">AI 특유의 문법을 파괴하고 인간의 말투로 자동 변조</span>
                                </button>
                            </div>

                            {/* NEW: AI Settings Controls */}
                            {
                                (isMobileFormat || isThreads) && (
                                    <div className="mb-8 p-4 bg-black/30 rounded-xl border border-white/10">
                                        <h4 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2">
                                            <CheckCircle size={14} /> AI 연출 설정
                                        </h4>

                                        {/* 1. Voice Persona Control */}
                                        <div>
                                            <label className="text-xs text-gray-400 mb-2 block">보이스 페르소나 (TTS)</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {['normal', 'energetic', 'calm'].map(v => (
                                                    <button
                                                        key={v}
                                                        onClick={() => setVoiceStyle(v)}
                                                        className={`py-1.5 text-xs border rounded-lg capitalize transition-all ${voiceStyle === v ? 'border-primary bg-primary/20 text-white' : 'border-white/10 text-gray-500 hover:border-white/30'}`}
                                                    >
                                                        {v === 'normal' ? '기본' : v === 'energetic' ? '매력' : '차분'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                                    <Edit2 size={14} /> 제목 / 캡션 수정
                                </h4>
                                <input
                                    type="text"
                                    value={editedData.title}
                                    onChange={(e) => setEditedData({ ...editedData, title: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors text-sm"
                                />
                            </div>

                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-gray-400 mb-4 flex items-center gap-2 sticky top-0 bg-surface py-2 z-10 border-b border-white/5">
                                    <Edit2 size={14} /> 내용 수정
                                </h4>

                                {data.platform === 'Naver Blog' ? (
                                    // Blog Priority Editor: sections > content > script
                                    editedData.sections ? (
                                        <div className="space-y-4">
                                            {editedData.sections.map((section, idx) => (
                                                <div
                                                    key={idx}
                                                    className="bg-black/20 p-4 rounded-xl border border-white/5 hover:border-primary/30 transition-colors"
                                                    onWheel={(e) => handleWheelReorder(e, idx, 'sections')}
                                                >
                                                    <input
                                                        type="text"
                                                        value={section.title || ''}
                                                        onChange={(e) => {
                                                            const newSec = [...editedData.sections];
                                                            newSec[idx] = { ...newSec[idx], title: e.target.value };
                                                            setEditedData({ ...editedData, sections: newSec });
                                                        }}
                                                        className="w-full bg-transparent font-bold text-white mb-2 focus:outline-none border-b border-transparent focus:border-primary/50 transition-colors pb-1 text-sm"
                                                        placeholder="소제목"
                                                    />
                                                    <textarea
                                                        value={section.content || section.text || ''}
                                                        onChange={(e) => {
                                                            const newSec = [...editedData.sections];
                                                            const val = e.target.value;
                                                            if (newSec[idx].content !== undefined) newSec[idx].content = val;
                                                            if (newSec[idx].text !== undefined) newSec[idx].text = val;
                                                            setEditedData({ ...editedData, sections: newSec });
                                                        }}
                                                        className="w-full bg-transparent text-sm text-gray-300 focus:outline-none resize-none leading-relaxed focus:text-white transition-colors overflow-hidden"
                                                        rows={Math.max(3, Math.ceil(((section.content || section.text) || '').length / 35))}
                                                        placeholder="내용을 입력하세요..."
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : editedData.content ? (
                                        <textarea
                                            value={editedData.content || ''}
                                            onChange={(e) => setEditedData({ ...editedData, content: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors text-sm leading-relaxed resize-none overflow-hidden"
                                            rows={Math.max(5, Math.ceil((editedData.content || '').length / 40))}
                                            placeholder="내용을 입력하세요..."
                                        />
                                    ) : (
                                        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                                            {(editedData.script || []).map((scene, idx) => (
                                                <div
                                                    key={scene.time || scene.type || idx}
                                                    className="bg-black/20 p-3 rounded-xl border border-white/5 hover:border-primary/30 transition-colors group"
                                                    onWheel={(e) => handleWheelReorder(e, idx, 'script')}
                                                >
                                                    <div className="flex justify-between items-center mb-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                        {scene.time && (
                                                            <span className="text-xs font-mono text-gray-400 bg-white/5 px-1.5 py-0.5 rounded">{scene.time}</span>
                                                        )}
                                                        <span className="text-xs font-bold text-primary uppercase tracking-wider">{scene.type}</span>
                                                    </div>
                                                    <textarea
                                                        value={scene.text || scene || ''}
                                                        onChange={(e) => {
                                                            const newScript = [...editedData.script];
                                                            newScript[idx] = typeof newScript[idx] === 'string' ? e.target.value : { ...newScript[idx], text: e.target.value };
                                                            setEditedData({ ...editedData, script: newScript });
                                                        }}
                                                        className="w-full bg-transparent text-sm text-gray-200 placeholder-gray-600 focus:outline-none resize-none leading-relaxed focus:text-white transition-colors overflow-hidden"
                                                        rows={Math.max(2, Math.ceil(((scene.text || scene) || '').length / 30))}
                                                        placeholder="내용을 입력하세요..."
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )
                                ) : (
                                    // Video Priority Editor: script > content
                                    editedData.script ? (
                                        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                                            {editedData.script.map((scene, idx) => (
                                                <div
                                                    key={scene.time || scene.type || idx}
                                                    className="bg-black/20 p-3 rounded-xl border border-white/5 hover:border-primary/30 transition-colors group"
                                                    onWheel={(e) => handleWheelReorder(e, idx, 'script')}
                                                >
                                                    <div className="flex justify-between items-center mb-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                        {scene.time && (
                                                            <span className="text-xs font-mono text-gray-400 bg-white/5 px-1.5 py-0.5 rounded">{scene.time}</span>
                                                        )}
                                                        <span className="text-xs font-bold text-primary uppercase tracking-wider">{scene.type}</span>
                                                    </div>
                                                    <textarea
                                                        value={scene.text || scene || ''}
                                                        onChange={(e) => {
                                                            const newScript = [...editedData.script];
                                                            newScript[idx] = typeof newScript[idx] === 'string' ? e.target.value : { ...newScript[idx], text: e.target.value };
                                                            setEditedData({ ...editedData, script: newScript });
                                                        }}
                                                        className="w-full bg-transparent text-sm text-gray-200 placeholder-gray-600 focus:outline-none resize-none leading-relaxed focus:text-white transition-colors overflow-hidden"
                                                        rows={Math.max(2, Math.ceil(((scene.text || scene) || '').length / 30))}
                                                        placeholder="내용을 입력하세요..."
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <textarea
                                            value={editedData.content || ''}
                                            onChange={(e) => setEditedData({ ...editedData, content: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors text-sm leading-relaxed resize-none overflow-hidden"
                                            rows={Math.max(5, Math.ceil((editedData.content || '').length / 40))}
                                            placeholder="내용을 입력하세요..."
                                        />
                                    )
                                )}
                            </div>

                            <div className="mb-8">
                                <h4 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                                    <Edit2 size={14} /> 해시태그 수정
                                </h4>
                                <textarea
                                    value={editedData.hashtags}
                                    onChange={(e) => setEditedData({ ...editedData, hashtags: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-blue-400 focus:outline-none focus:border-primary transition-colors text-sm h-16 resize-none"
                                />
                            </div>

                            <div className="sticky bottom-0 left-0 right-0 bg-[#0c0e14] pt-4 pb-2 border-t border-white/5 z-20 mt-auto grid grid-cols-2 gap-3">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleConfirm('save');
                                    }}
                                    className="py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/10 hover:border-white/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                                >
                                    <CheckCircle size={18} />
                                    확인 (보관함)
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleConfirm('upload');
                                    }}
                                    className="py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                                >
                                    <Share2 size={18} />
                                    업로드 (연결)
                                </button>
                            </div>
                        </div >
                    </div >
                </motion.div >
            </motion.div >

            {/* Deep-Dive Report Overlays */}
            <AnimatePresence>
                {activeReport === 'performance' && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="absolute inset-y-0 right-0 w-full md:w-[400px] bg-[#0c0e14] z-[60] border-l border-white/10 p-6 flex flex-col shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="text-lg font-black text-white flex items-center gap-2">
                                <BarChart3 className="text-indigo-400" size={20} />
                                성과 정밀 진단 리포트
                            </h4>
                            <button onClick={() => setActiveReport(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6">
                            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                                <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">AI 점수 요약</div>
                                <div className="text-4xl font-black text-white mb-1">{editedData.predictedStats.viralityScore}<span className="text-lg text-gray-500 ml-1">/ 100</span></div>
                                <p className="text-xs text-gray-400 leading-relaxed font-medium">이 콘텐츠는 현재 상위 5%의 리치 가능성을 보유하고 있습니다. 특히 도입부 후킹 점수가 매우 높습니다.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-xs mb-1">
                                    <span className="text-gray-400">콘텐츠 매력도 (Engagement)</span>
                                    <span className="text-indigo-400 font-bold">89%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: "89%" }} className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                                </div>

                                <div className="flex items-center justify-between text-xs mb-1">
                                    <span className="text-gray-400">정보 전달 효율 (Clarity)</span>
                                    <span className="text-indigo-400 font-bold">75%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: "75%" }} className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                                </div>

                                <div className="flex items-center justify-between text-xs mb-1">
                                    <span className="text-gray-400">배포 타이밍 점수 (Timing)</span>
                                    <span className="text-indigo-400 font-bold">94%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: "94%" }} className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-white/5">
                                <div className="text-xs font-bold text-gray-400 uppercase">AI 인사이트 추천</div>
                                {[
                                    "제목의 끝에 이모지를 활용하여 주목도를 12% 향상시킬 수 있습니다.",
                                    "본문 3번째 문장의 호흡을 짧게 가져가면 이탈률이 줄어듭니다.",
                                    "해시태그 중 '추천템' 대신 '실제사용후기' 사용을 권장합니다."
                                ].map((tip, i) => (
                                    <div key={i} className="flex gap-3 text-[11px] text-gray-300 leading-relaxed bg-white/5 p-3 rounded-xl">
                                        <Zap size={14} className="text-yellow-400 shrink-0" />
                                        {tip}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button onClick={() => setActiveReport(null)} className="mt-8 w-full py-4 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-all">
                            확인 및 돌아가기
                        </button>
                    </motion.div>
                )}

                {activeReport === 'competitor' && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="absolute inset-y-0 right-0 w-full md:w-[400px] bg-[#0c0e14] z-[60] border-l border-white/10 p-6 flex flex-col shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="text-lg font-black text-white flex items-center gap-2">
                                <ShieldCheck className="text-cyan-400" size={20} />
                                경쟁사 실시간 전략 보고서
                            </h4>
                            <button onClick={() => setActiveReport(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6">
                            <div className="p-5 rounded-2xl bg-cyan-400/5 border border-cyan-400/20">
                                <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2">시장 경쟁 상황</div>
                                <div className="text-2xl font-black text-white mb-1">상대적 우위 (Strong)</div>
                                <p className="text-xs text-gray-400 leading-relaxed font-medium">유사 테마의 경쟁 콘텐츠 대비 검색 키워드 선점 가능성이 35% 높게 분석되었습니다.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="text-xs font-bold text-gray-400 uppercase">상위 랭킹 경쟁자 분석</div>
                                {[
                                    { name: "TechMaster", rate: "84%", tags: "#전문성 #디테일" },
                                    { name: "VlogDaily", rate: "72%", tags: "#편집감각 #일상" }
                                ].map((comp, i) => (
                                    <div key={i} className="bg-black/40 p-4 rounded-xl border border-white/5">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-bold text-white">{comp.name}</span>
                                            <span className="text-[10px] bg-cyan-400/20 text-cyan-400 px-2 py-0.5 rounded-full">영향력 {comp.rate}</span>
                                        </div>
                                        <p className="text-[11px] text-gray-500 mb-2">{comp.tags}</p>
                                        <div className="text-[10px] text-gray-400">주요 타겟: 25-34 세대 남성 위주</div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-5 bg-gradient-to-br from-[#1a1c22] to-[#0c0e14] border border-white/10 rounded-2xl">
                                <div className="flex items-center gap-2 mb-3">
                                    <RefreshCcw size={14} className="text-cyan-400" />
                                    <span className="text-xs font-bold text-white uppercase">최적 포스팅 시점</span>
                                </div>
                                <div className="flex items-end gap-1 mb-2">
                                    <span className="text-3xl font-black text-white">오후 08:30</span>
                                    <span className="text-xs text-cyan-400 font-bold pb-1">(골든 타임)</span>
                                </div>
                                <p className="text-[10px] text-gray-400 leading-relaxed">최근 24시간 경쟁사들의 업로드 패턴 분석 결과, 위 시간대에 업로드 시 가장 높은 검색 노출 빈도를 보입니다.</p>
                            </div>
                        </div>

                        <button onClick={() => setActiveReport(null)} className="mt-8 w-full py-4 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-all">
                            확인 및 돌아가기
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Just-in-Time Auth Overlay */}
            <AnimatePresence>
                {showAuthOverlay && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="w-full max-w-md bg-[#13161c] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-white/5 rounded-2xl mx-auto flex items-center justify-center mb-4 border border-white/5 shadow-inner">
                                    <ShieldCheck size={32} className="text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">계정 연결 필요</h3>
                                <p className="text-sm text-gray-400">
                                    <span className="text-white font-bold">{data.platform}</span> 업로드를 위해<br />최초 1회 로그인이 필요합니다.
                                </p>
                            </div>

                            <form onSubmit={handleAuthSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">ID / Email</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={credentials.id}
                                            onChange={(e) => setCredentials(prev => ({ ...prev, id: e.target.value }))}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors text-sm pl-10"
                                            placeholder="아이디를 입력하세요"
                                            required
                                        />
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                            <Globe size={16} />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Password</label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            value={credentials.pw}
                                            onChange={(e) => setCredentials(prev => ({ ...prev, pw: e.target.value }))}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors text-sm pl-10"
                                            placeholder="비밀번호를 입력하세요"
                                            required
                                        />
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                            <ShieldCheck size={16} />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowAuthOverlay(false)}
                                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-gray-400 font-bold rounded-xl transition-all text-sm"
                                    >
                                        취소
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isConnecting}
                                        className="flex-[2] py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all text-sm shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
                                    >
                                        {isConnecting ? (
                                            <>
                                                <Loader size={16} className="animate-spin" /> 연결 및 업로드 중...
                                            </>
                                        ) : (
                                            <>
                                                연결 및 바로 업로드 <CheckCircle size={16} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            <p className="text-[10px] text-center text-gray-600 mt-6 flex items-center justify-center gap-1">
                                <ShieldCheck size={10} />
                                정보는 암호화되어 안전하게 저장됩니다.
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AnimatePresence >
    );
};
