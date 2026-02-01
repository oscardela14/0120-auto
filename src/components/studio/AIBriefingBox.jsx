
import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Brain, Sparkles, Loader2 } from 'lucide-react';

export const AIBriefingBox = ({ user, activeResult, history }) => {
    const persona = activeResult?.persona || 'witty';

    const getBriefing = () => {
        if (persona === 'witty') {
            return {
                title: "Yo! 오늘의 긴급 속보예요 마스터! 🔥",
                msg: `방금 데이터 센터에서 날아온 소식인데, 어제 올린 ${activeResult?.topic || '게시물'}이 알고리즘을 제대로 탔다니까요? ㅋㅋ 지금 바로 제휴 수익 훅(Hook)을 한두 군데만 더 찔러넣으면 수익률이 수직 상승할 준비가 되어 있습니다! 가즈아~!`,
                icon: Bot
            };
        } else if (persona === 'professional') {
            return {
                title: "Strategy Intelligence: 오늘의 정밀 브리핑",
                msg: `마스터님, 현재 시장 지표 분석 결과 ${activeResult?.topic || '특정 키워드'} 분야의 경쟁사 진입이 둔화되었습니다. 지금이 상위 노출을 독점할 최적의 타이밍입니다. SEO 마스터 보드를 가동하여 점유율 15% 이상 확대를 권장합니다.`,
                icon: Brain
            };
        }
        return {
            title: "안녕하세요 마스터! 오늘의 수익 가이드입니다.",
            msg: "현재 마스터님의 플랫폼 지수가 매우 안정적입니다. 축적된 성과 데이터를 기반으로 새로운 채널 확장을 시도해볼 때입니다. 오늘의 미션을 확인하고 수익 파이프라인을 다각화해보세요.",
            icon: Sparkles
        };
    };

    const briefing = getBriefing();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-[#0b0e14]/40 backdrop-blur-3xl border border-white/5 p-7 rounded-[40px] overflow-hidden group mb-10"
        >
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all duration-700" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary blur-[20px] opacity-20 animate-pulse" />
                    <div className="relative w-16 h-16 bg-gradient-to-br from-primary to-indigo-600 rounded-[22px] flex items-center justify-center text-white shadow-2xl shadow-primary/30 rotate-3">
                        <briefing.icon size={32} />
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center gap-3 mb-3">
                        <h2 className="text-xl font-black text-white tracking-tight">{briefing.title}</h2>
                        <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black text-primary uppercase tracking-widest italic animate-pulse">
                            AI Personalized
                        </span>
                    </div>
                    <p className="text-gray-400 text-base leading-relaxed font-medium max-w-4xl break-keep">
                        "{briefing.msg}"
                    </p>
                </div>

                <div className="flex flex-col gap-2 min-w-[200px]">
                    <div className="relative group/sync p-4 bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                        {/* Scanning Animation */}
                        <motion.div
                            initial={{ y: "-100%" }}
                            animate={{ y: "100%" }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/30 to-transparent h-1/2 w-full z-0 opacity-40"
                        />

                        <div className="relative z-10">
                            <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1 tracking-wider">NETWORK STATUS</span>
                            <div className="flex items-center gap-2 text-white font-black text-sm">
                                <div className="relative w-2 h-2">
                                    <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75" />
                                    <div className="relative w-2 h-2 bg-primary rounded-full" />
                                </div>
                                실시간 동기화 중
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                >
                                    <Loader2 size={12} className="text-primary/50" />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
