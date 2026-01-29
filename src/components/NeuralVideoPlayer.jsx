import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Download, Video, Loader2, XCircle, CheckCircle2 } from 'lucide-react';

export const NeuralVideoPlayer = ({ isOpen, onClose, data }) => {
    const canvasRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [renderProgress, setRenderProgress] = useState(0);
    const [isRendering, setIsRendering] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const reqRef = useRef(null);

    // Prepare content
    const script = data.variants?.A?.sections || data.variants?.A?.script || [];

    // Convert to segments
    const segments = script.length > 0 ? script.map((s, i) => ({
        id: i,
        text: s.content || s.text || "",
        duration: Math.max(2000, (s.content || s.text || "").length * 100), // Min 2s or based on length
        image: s.visualUrl || `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80`
    })) : [{ id: 0, text: "No content available", duration: 3000 }];

    const totalDuration = segments.reduce((acc, s) => acc + s.duration, 0);

    useEffect(() => {
        if (isOpen) {
            setIsReady(false);
            setProgress(0);
            setCurrentTime(0);
            setIsPlaying(false);

            // Preload images for smooth rendering
            const loadImages = segments.map(s => new Promise((resolve) => {
                const img = new Image();
                img.src = s.image;
                img.onload = resolve;
                // resolve anyway on error to prevent blocking
                img.onerror = resolve;
            }));

            Promise.all(loadImages).then(() => {
                setIsReady(true);
            });
        }
    }, [isOpen]);

    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Find current segment
        let accumulatedTime = 0;
        let currentSegment = segments[0];

        for (let s of segments) {
            if (currentTime >= accumulatedTime && currentTime < accumulatedTime + s.duration) {
                currentSegment = s;
                break;
            }
            accumulatedTime += s.duration;
        }

        // Draw Background (Simulate Neural Generation)
        const time = Date.now() * 0.001;
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#4f46e5');
        gradient.addColorStop(0.5, '#9333ea');
        gradient.addColorStop(1, '#ec4899');

        ctx.fillStyle = '#0f1116';
        ctx.fillRect(0, 0, width, height);

        ctx.globalAlpha = 0.3;
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        ctx.globalAlpha = 1.0;

        // Draw Image Overlay if exists (mocking visual content)
        // In a real app we'd draw currentSegment.image object here

        // Text
        ctx.fillStyle = 'white';
        const fontSize = 48; // Increased for HD
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Word Wrap
        const words = currentSegment.text.split(' ');
        let line = '';
        let y = height / 2;
        const lineHeight = fontSize * 1.4;
        const maxWidth = width * 0.8;

        const lines = [];
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                lines.push(line);
                line = words[n] + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line);

        y -= (lines.length * lineHeight) / 2;

        lines.forEach((l, i) => {
            // Shadow for readability
            ctx.shadowColor = "rgba(0,0,0,0.8)";
            ctx.shadowBlur = 20;
            ctx.shadowOffsetX = 4;
            ctx.shadowOffsetY = 4;
            ctx.fillText(l, width / 2, y + (i * lineHeight));
        });

        // Reset shadow
        ctx.shadowColor = "transparent";

        // Progress Bar on Canvas (Visual Indicator)
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(0, height - 10, (currentTime / totalDuration) * width, 10);
    };

    const animate = () => {
        if (!isPlaying) return;

        setCurrentTime(prev => {
            const newTime = prev + 16.6; // ~60fps
            if (newTime >= totalDuration) {
                if (isRendering) {
                    // If rendering, we stop manually to ensure last frame is captured
                    stopRendering();
                }
                setIsPlaying(false);
                return totalDuration;
            }
            return newTime;
        });

        draw();

        // Update render progress UI if rendering
        if (isRendering) {
            setRenderProgress(Math.min(100, (currentTime / totalDuration) * 100));
        }

        reqRef.current = requestAnimationFrame(animate);
    };

    const startRendering = () => {
        setIsRendering(true);
        setRenderProgress(0);
        setCurrentTime(0);
        setIsPlaying(true);
        chunksRef.current = [];

        const stream = canvasRef.current.captureStream(60); // 60 FPS

        // Try to include audio if we had an audio element, but for now just video
        // const audioTrack = audioRef.current?.captureStream().getAudioTracks()[0];
        // if(audioTrack) stream.addTrack(audioTrack);

        const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
            ? 'video/webm;codecs=vp9'
            : 'video/webm';

        const recorder = new MediaRecorder(stream, {
            mimeType,
            videoBitsPerSecond: 5000000 // 5Mbps High Quality
        });

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunksRef.current.push(e.data);
            }
        };

        recorder.onstop = exportVideo;
        mediaRecorderRef.current = recorder;
        recorder.start();
    };

    const stopRendering = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
        setIsPlaying(false);
        cancelAnimationFrame(reqRef.current);
    };

    const exportVideo = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `neural_shorts_${data.topic || 'export'}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        setIsRendering(false);
        setRenderProgress(100);
    };

    useEffect(() => {
        if (isPlaying) {
            reqRef.current = requestAnimationFrame(animate);
        } else {
            cancelAnimationFrame(reqRef.current);
        }
        return () => cancelAnimationFrame(reqRef.current);
    }, [isPlaying]);

    // Initial Draw when ready
    useEffect(() => {
        if (isReady && canvasRef.current) {
            draw();
        }
    }, [isReady, currentTime]);


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-5xl bg-[#0f1116] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
                {/* Left: Player Canvas */}
                <div className="flex-1 bg-black relative aspect-[9/16] md:aspect-video flex items-center justify-center group overflow-hidden">
                    {!isReady ? (
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="animate-spin text-indigo-500" size={48} />
                            <p className="text-sm font-bold text-gray-400">Loading Neural Assets...</p>
                        </div>
                    ) : (
                        <canvas
                            ref={canvasRef}
                            width={1080}
                            height={1920}
                            className="h-full w-auto object-contain shadow-2xl"
                        />
                    )}

                    {/* Overlay Controls */}
                    {isReady && !isRendering && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-8">
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 transition-transform"
                            >
                                {isPlaying ? <Pause fill="currentColor" size={32} /> : <Play fill="currentColor pl-1" size={32} />}
                            </button>
                        </div>
                    )}
                </div>

                {/* Right: Controls & Export */}
                <div className="w-full md:w-96 bg-[#13161c] border-l border-white/10 p-8 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-black text-white flex items-center gap-2">
                                <Video className="text-indigo-400" size={24} />
                                Neural Renderer
                            </h2>
                            <p className="text-xs text-gray-500 font-medium mt-1">Real-time Canvas Encoder</p>
                        </div>
                        <button onClick={onClose} disabled={isRendering} className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white disabled:opacity-50">
                            <XCircle size={24} />
                        </button>
                    </div>

                    {/* Timeline Info */}
                    <div className="space-y-6 mb-8">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-gray-400">DURATION</span>
                                <span className="text-xs font-mono text-indigo-400">00:{(totalDuration / 1000).toFixed(0)}</span>
                            </div>
                            <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-indigo-500"
                                    style={{ width: `${totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action */}
                    <div className="mt-auto space-y-4">
                        {isRendering ? (
                            <div className="w-full py-6 bg-white/5 border border-indigo-500/30 rounded-xl flex flex-col items-center justify-center gap-3 relative overflow-hidden">
                                <div className="absolute inset-0 bg-indigo-500/5 animate-pulse" />
                                <Loader2 className="animate-spin text-indigo-500" size={24} />
                                <div className="flex flex-col items-center z-10">
                                    <span className="text-sm font-black text-white">Rendering Video...</span>
                                    <span className="text-xs font-bold text-indigo-400">{renderProgress.toFixed(0)}% Complete</span>
                                </div>
                                <div className="w-3/4 h-1 bg-gray-800 rounded-full mt-2 overflow-hidden z-10">
                                    <motion.div
                                        className="h-full bg-indigo-500"
                                        animate={{ width: `${renderProgress}%` }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={startRendering}
                                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl font-black text-white shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all group"
                            >
                                <Download size={18} className="group-hover:animate-bounce" />
                                Export Real Video (WebM)
                            </button>
                        )}
                        <p className="text-[10px] text-center text-gray-600 leading-relaxed">
                            * MediaRecorder API를 사용하여<br />
                            실시간 캔버스 렌더링을 캡처하고 저장합니다.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
