import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lock, ArrowRight, Zap } from 'lucide-react';

export const FreeTrialCard = ({ onUpgrade }) => {
    const [isRevealed, setIsRevealed] = useState(false);
    const [hasUsedTrial, setHasUsedTrial] = useState(() => {
        return localStorage.getItem('freeTrialUsed') === 'true';
    });

    const demoContent = {
        title: "🔥 7가지 방법으로 소셜미디어 팔로워를 3배 늘리는 법",
        preview: "1. 시간대별 최적의 포스팅 시각 활용하기\n2. 감정을 자극하는 썸네일 디자인 적용\n3. 해시태그 전략: 트렌딩 vs 니치 해시태그 조합",
        blurred: "4. ███████████████████\n5. ███████████████████\n6. ███████████████████\n7. █████████████"
    };

    const handleReveal = () => {
        if (hasUsedTrial) {
            onUpgrade && onUpgrade();
            return;
        }
        setIsRevealed(true);
        localStorage.setItem('freeTrialUsed', 'true');
        setHasUsedTrial(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-primary/20 via-purple-500/10 to-secondary/20 border border-primary/30 rounded-2xl p-8 mb-8 relative overflow-hidden"
        >
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-primary/20 rounded-lg">
                        <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-white">
                        {hasUsedTrial ? '더 많은 콘텐츠를 만들어보세요' : '🎁 무료 맛보기'}
                    </h3>
                    {!hasUsedTrial && (
                        <span className="ml-auto bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                            1회 한정
                        </span>
                    )}
                </div>

                <p className="text-gray-300 text-sm mb-6">
                    {hasUsedTrial
                        ? 'AI가 생성한 더 많은 프리미엄 콘텐츠를 확인하고 싶으신가요?'
                        : '지금 바로 AI가 생성한 고품질 마케팅 카피를 확인해보세요. 회원가입 없이 체험 가능합니다!'
                    }
                </p>

                {!hasUsedTrial && (
                    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/10">
                        <h4 className="font-bold text-white mb-3 text-lg">{demoContent.title}</h4>
                        <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line mb-4">
                            {demoContent.preview}
                        </div>
                        <AnimatePresence>
                            {!isRevealed ? (
                                <motion.div
                                    initial={{ opacity: 1 }}
                                    exit={{ opacity: 0, filter: 'blur(0px)' }}
                                    className="relative"
                                >
                                    <div className="text-gray-500 text-sm leading-relaxed whitespace-pre-line filter blur-sm select-none">
                                        {demoContent.blurred}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/50 to-surface flex items-center justify-center">
                                        <Lock className="w-8 h-8 text-primary animate-pulse" />
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-green-400 font-medium text-sm bg-green-500/10 border border-green-500/20 rounded-lg p-4"
                                >
                                    4. 스토리텔링으로 브랜드 개성 강조하기<br />
                                    5. 팔로워와의 1:1 DM 소통 루틴화<br />
                                    6. 협업 콘텐츠로 새로운 오디언스 확보<br />
                                    7. 데이터 분석 기반 최적화 전략 수립
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                <button
                    onClick={handleReveal}
                    className="w-full py-4 bg-gradient-to-r from-primary to-purple-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary/50 transition-all hover:scale-105 flex items-center justify-center gap-2 group"
                >
                    {hasUsedTrial ? (
                        <>
                            <Zap size={20} />
                            무료로 시작하기
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </>
                    ) : isRevealed ? (
                        <>
                            <Sparkles size={20} />
                            더 많은 콘텐츠 만들기 (무료 시작)
                        </>
                    ) : (
                        <>
                            <Lock size={20} />
                            나머지 확인하기 (무료)
                        </>
                    )}
                </button>
            </div>

            <style>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </motion.div>
    );
};
