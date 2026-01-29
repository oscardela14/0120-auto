
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, Zap, ArrowRight, X, Sparkles, TrendingUp, Activity } from 'lucide-react';
import { startAutonomousHunt } from '../utils/autonomousHunter';

export const AutonomousHunter = ({ onGenerate, collapsed }) => {
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        const cleanupFn = startAutonomousHunt((newAlert) => {
            setAlert(newAlert);
        });
        return () => {
            if (typeof cleanupFn === 'function') cleanupFn();
        };
    }, []);

    const handleCloseAlert = (e) => {
        if (e) e.stopPropagation();
        setAlert(null);
    };

    // If sidebar is collapsed, show only a simplified indicator
    if (collapsed) {
        return (
            <div className="flex flex-col items-center py-4 border-t border-white/5 mt-2">
                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <span className="text-xl">{alert ? '🐦‍🔥' : '🧐'}</span>
                    </div>
                    <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${alert ? 'bg-red-400' : 'bg-emerald-400'} opacity-75`}></span>
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${alert ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="px-3 py-1 mt-0">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#13161c] border border-emerald-500/20 rounded-2xl overflow-hidden shadow-2xl"
            >
                {/* Header Section */}
                <div className="flex items-start gap-3 p-4 bg-emerald-500/5 border-b border-white/5">
                    <div className="relative shrink-0 mt-0.5">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shadow-inner">
                            <span className="text-2xl">{alert ? '🐦‍🔥' : '🧐'}</span>
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${alert ? 'bg-red-400' : 'bg-emerald-400'} opacity-75`}></span>
                            <span className={`relative inline-flex rounded-full h-3 w-3 ${alert ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                        </span>
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                        <div className="text-[13px] font-black text-emerald-400 uppercase tracking-wider leading-tight mb-1 whitespace-nowrap">
                            AI 전략분석<br />스카우트
                        </div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight whitespace-nowrap">
                            {alert ? <>{'바이럴 급상승'}<br />{'기회포착'}</> : <>{'실시간 트렌드'}<br />{'추적 중...'}</>}
                        </div>
                    </div>
                    {alert && (
                        <button onClick={handleCloseAlert} className="p-1 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-all">
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Body Content - Strategic AI Typography */}
                <div className="p-5 min-h-[130px] flex flex-col justify-center bg-gradient-to-b from-transparent to-black/20">
                    <AnimatePresence mode="wait">
                        {alert ? (
                            <motion.div
                                key="alert"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-4"
                            >
                                <div>
                                    <h4 className="text-[14px] font-bold text-white mb-2 leading-snug">
                                        <span className="text-emerald-500 mr-1.5">"</span>
                                        {alert.topic}
                                        <span className="text-emerald-500 ml-1.5">"</span>
                                    </h4>
                                    <p className="text-[11px] text-emerald-400/90 font-medium leading-relaxed">
                                        AI 엔진이 최적의 바이럴 진입 시점과<br />분석 전략(연환계)을 도출했습니다.
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        onGenerate(alert);
                                        handleCloseAlert();
                                    }}
                                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl font-black text-[12px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
                                >
                                    <Zap size={14} className="fill-black" />
                                    AI 전략 콘텐츠 즉시 생성
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="scanning"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                                        <Activity size={14} className="text-emerald-500 animate-pulse" />
                                    </div>
                                    <h4 className="text-[13px] font-bold text-gray-200 leading-tight">
                                        시장 데이터<br />
                                        정밀 분석 중
                                    </h4>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                        <motion.div
                                            animate={{ x: [-150, 250] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                            className="w-24 h-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                                        글로벌 소셜 데이터를 24시간 분석하여<br />
                                        귀하를 위한 <span className="text-emerald-500/70">고수익 Viral Topic</span>을 발굴 중입니다.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};
