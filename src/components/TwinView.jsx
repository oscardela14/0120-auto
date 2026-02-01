import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Bot, MessageSquare, Zap, Target, Brain, ShieldCheck, Heart, Share2, Plus, Sparkles, UserCheck, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const TwinCard = ({ title, icon: Icon, children, className = "" }) => (
    <div className={`bg-surface/30 border border-white/10 rounded-3xl p-8 ${className}`}>
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
                    <Icon size={24} />
                </div>
                <h3 className="text-2xl font-black text-white">{title}</h3>
            </div>
            <div className="flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#050508] bg-gray-800 overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + i * 20}`} alt="avatar" />
                    </div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-[#050508] bg-indigo-600 flex items-center justify-center text-[10px] text-white font-bold">+12</div>
            </div>
        </div>
        {children}
    </div>
);

export const TwinView = () => {
    const { activeResult, user, addNotification } = useUser();
    const navigate = useNavigate();

    const [replies, setReplies] = React.useState({});
    const [isGeneratingReply, setIsGeneratingReply] = React.useState({});
    const [isAutopilot, setIsAutopilot] = React.useState(false);
    const [neurolog, setNeurolog] = React.useState([
        "System Initialized. Awaiting trend signals...",
        "Neural patterns loaded from local content history.",
        "Anti-Gravity core synchronized with user signature."
    ]);

    const currentTopic = activeResult?.topic || '콘텐츠';
    const currentPersona = activeResult?.persona || 'witty';

    const data = {
        twinStatus: {
            learningProgress: 94,
            personalityTags: [
                currentPersona === 'witty' ? '재치 있는' : '전문적인',
                '초정밀 분석형',
                '실시간 대응 최적화'
            ],
            lastSync: 'Now'
        },
        communities: activeResult?.communities || [
            { id: 1, user: 'SocialExpert', text: `이번 "${currentTopic}" 관련 내용 정말 유익하네요! 제휴 링크 상품도 관심이 가는데 실사용 후기도 궁금해요.`, sentiment: 'positive' },
            { id: 2, user: 'TrendSeeker_KR', text: '비슷한 주제로 숏폼 제작하려고 하는데, 폰트 정보 좀 알 수 있을까요?', sentiment: 'positive' },
            { id: 3, user: 'Creative_User', text: '내용이 조금 길어서 요약된 버전이 있으면 좋겠어요.', sentiment: 'neutral' }
        ]
    };

    React.useEffect(() => {
        if (isAutopilot) {
            const timer = setInterval(() => {
                const logs = [
                    "Analyzing cross-platform trend ripples...",
                    "Optimizing response tonality for @TrendSeeker...",
                    "Auto-adjusting monetization placement...",
                    "Neural weights updated for higher engagement."
                ];
                setNeurolog(prev => [logs[Math.floor(Math.random() * logs.length)], ...prev].slice(0, 5));
            }, 3000);
            return () => clearInterval(timer);
        }
    }, [isAutopilot]);

    const generateAIReply = (id, commentUser, commentText) => {
        setIsGeneratingReply(prev => ({ ...prev, [id]: true }));
        setTimeout(() => {
            let replyText = "";
            if (currentPersona === 'witty') {
                replyText = `안녕하세요 @${commentUser}님! 😉 ${currentTopic}에 관심 가져주셔서 감사해요! 질문하신 내용은 조만간 '레알 꿀팁' 시리즈로 한번 더 다뤄볼게요. 가즈아~! 🔥`;
            } else if (currentPersona === 'professional') {
                replyText = `반갑습니다 @${commentUser}님. 제안해주신 ${currentTopic} 관련 피드백 감사히 검토하겠습니다. 전문적인 분석을 통해 더 심도 있는 정보를 제공해 드릴 수 있도록 노력하겠습니다.`;
            } else {
                replyText = `@${commentUser}님, 따뜻한 관심 감사드려요! ✨ ${currentTopic}에 대해 궁금하신 점은 언제든 편하게 말씀해 주세요. 함께 성장해 나가요!`;
            }
            setReplies(prev => ({ ...prev, [id]: replyText }));
            setIsGeneratingReply(prev => ({ ...prev, [id]: false }));
            addNotification("나의 트윈이 가장 자연스러운 답변을 생성했습니다.", "success");
        }, 800);
    };

    if (!activeResult) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                <Users size={64} className="text-gray-700 mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2">디지털 트윈 데이터가 부족합니다</h2>
                <p className="text-gray-500 mb-8">콘텐츠 스튜디오에서 먼저 콘텐츠를 생성하거나<br />충분한 활동 데이터를 쌓아주세요.</p>
                <button onClick={() => navigate('/studio')} className="px-6 py-3 bg-primary text-white font-bold rounded-xl">스튜디오로 이동</button>
            </div>
        );
    }

    return (
        <div className="max-w-[1440px] mx-auto p-6 md:p-8 space-y-8">
            <header className="mb-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <Users className="text-cyan-400" size={32} />
                        디지털 트윈 & 자율주행 오토파일럿
                    </h1>
                    <p className="text-gray-400 mt-2">나의 페르소나를 학습한 AI가 실시간 트렌드를 모니터링하고 대응합니다.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => {
                            setIsAutopilot(!isAutopilot);
                            addNotification(isAutopilot ? "오토파일럿이 중지되었습니다." : "AI 자율주행 오토파일럿이 가동되었습니다.", isAutopilot ? "info" : "success");
                        }}
                        className={cn(
                            "px-6 py-3 rounded-2xl font-black text-xs transition-all flex items-center gap-2",
                            isAutopilot ? "bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.5)]" : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                        )}
                    >
                        <Zap size={16} className={isAutopilot ? "animate-pulse" : ""} />
                        {isAutopilot ? "AUTOPILOT ON" : "START AUTOPILOT"}
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* 1. Twin Status & Neural Profile */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-gradient-to-br from-cyan-600 to-indigo-700 rounded-3xl p-8 flex flex-col justify-between shadow-2xl shadow-cyan-600/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Brain size={120} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                                    <Brain size={24} className="text-white" />
                                </div>
                                <span className="px-3 py-1 bg-green-400 text-black text-[10px] font-black rounded-full shadow-lg">LIVE Sync</span>
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Autonomous Brain</h3>
                            <p className="text-white/70 text-sm font-medium">실시간 트렌드 및 페르소나 대응 최적화 완료</p>
                        </div>
                        <div className="mt-8 relative z-10">
                            <div className="flex justify-between text-[10px] text-white/60 mb-2 font-black uppercase tracking-[0.2em]">
                                <span>Neurological Load</span>
                                <span>{data.twinStatus.learningProgress}%</span>
                            </div>
                            <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden border border-white/10 p-0.5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${data.twinStatus.learningProgress}%` }}
                                    className="h-full bg-white rounded-full shadow-[0_0_15px_white]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface/30 border border-white/5 rounded-3xl p-8 lg:col-span-2 relative overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2 text-gray-500">
                                <Activity size={18} className="text-cyan-400" />
                                <span className="text-xs font-black uppercase tracking-[0.2em]">Live Autopilot Logs</span>
                            </div>
                            <div className="flex gap-1">
                                {[0, 1, 2].map(i => <div key={i} className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse" />)}
                            </div>
                        </div>

                        <div className="flex-1 space-y-3 font-mono text-[11px]">
                            {neurolog.map((log, i) => (
                                <motion.div
                                    key={log + i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={cn("flex gap-2", i === 0 ? "text-cyan-400 font-bold" : "text-gray-500")}
                                >
                                    <span className="shrink-0 text-cyan-800">[{4 - i}]</span>
                                    <span>{log}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-12 bg-surface/30 border border-white/5 rounded-[32px] p-8 relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-6 text-gray-500">
                        <UserCheck size={18} className="text-cyan-400" />
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Persona Signature Logic</span>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {data.twinStatus.personalityTags.map(tag => (
                            <div key={tag} className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-white font-bold flex items-center gap-3 hover:bg-white/10 hover:border-cyan-500/30 transition-all cursor-default group">
                                <div className="w-2 h-2 rounded-full bg-cyan-500 group-hover:animate-ping" />
                                {tag}
                            </div>
                        ))}
                        <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-cyan-500/60 font-black border-dashed hover:text-cyan-400 hover:bg-cyan-500/5 transition-all">
                            + Add Neural Trait
                        </button>
                    </div>
                    <div className="mt-8 flex flex-col md:flex-row gap-6">
                        <div className="flex-1 p-5 bg-black/40 rounded-[24px] border border-white/5">
                            <span className="text-[10px] text-gray-600 font-bold block mb-2 uppercase tracking-widest">Verbal Pattern</span>
                            <span className="text-sm font-bold text-white italic">"전문적이면서도 {currentPersona === 'witty' ? '위트를 섞은' : '신뢰감을 주는'} 화법"</span>
                        </div>
                        <div className="flex-1 p-5 bg-black/40 rounded-[24px] border border-white/5">
                            <span className="text-[10px] text-gray-600 font-bold block mb-2 uppercase tracking-widest">Action Preference</span>
                            <span className="text-sm font-bold text-white italic">"친절한 리액션 위주의 팬덤 케어"</span>
                        </div>
                    </div>
                </div>

                {/* 2. Smart Community Manager */}
                <div className="lg:col-span-12">
                    <TwinCard title="팬덤 인터랙션 매니저" icon={MessageSquare}>
                        <div className="space-y-4">
                            <div className="p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl mb-8 flex items-center gap-4">
                                <div className="p-2 bg-cyan-500 text-black rounded-lg">
                                    <Zap size={18} />
                                </div>
                                <p className="text-xs text-gray-400 font-medium">
                                    <span className="text-white font-bold">Smart Filter:</span> 현재 3개의 미답변 댓글이 감지되었습니다. 나의 트윈이 당신 대신 답변할 준비가 되었습니다.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {data.communities.map((comment) => (
                                    <motion.div
                                        key={comment.id}
                                        layout
                                        className="p-8 bg-black/40 border border-white/5 rounded-[32px] flex flex-col md:flex-row gap-8 group hover:border-cyan-500/30 transition-all shadow-xl"
                                    >
                                        <div className="w-16 h-16 rounded-[20px] overflow-hidden shrink-0 border border-white/10 shadow-2xl">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user}`} alt="user" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-base font-black text-white">@{comment.user}</span>
                                                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${comment.sentiment === 'positive' ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>
                                                        {comment.sentiment}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">3m ago</span>
                                            </div>
                                            <p className="text-sm text-gray-400 mb-8 leading-relaxed font-medium">"{comment.text}"</p>

                                            <AnimatePresence mode="wait">
                                                {replies[comment.id] ? (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="bg-cyan-500/5 border border-cyan-500/20 p-5 rounded-2xl mt-4 relative group/reply"
                                                    >
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Bot size={14} className="text-cyan-400" />
                                                            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Digital Twin Proxy Reply</span>
                                                        </div>
                                                        <p className="text-sm text-white font-medium leading-relaxed italic">
                                                            {replies[comment.id]}
                                                        </p>
                                                        <div className="mt-4 flex gap-3">
                                                            <button className="px-4 py-2 bg-cyan-600 text-white text-[10px] font-black rounded-lg hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-600/20 uppercase tracking-widest">
                                                                지금 전송하기
                                                            </button>
                                                            <button onClick={() => setReplies(prev => {
                                                                const n = { ...prev };
                                                                delete n[comment.id];
                                                                return n;
                                                            })} className="px-4 py-2 bg-white/5 text-gray-500 text-[10px] font-black rounded-lg hover:text-white transition-all uppercase tracking-widest">
                                                                수정
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                ) : (
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => generateAIReply(comment.id, comment.user, comment.text)}
                                                            disabled={isGeneratingReply[comment.id]}
                                                            className="px-6 py-2.5 bg-cyan-600 text-white text-[11px] font-black rounded-xl flex items-center gap-2 shadow-xl shadow-cyan-600/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                                        >
                                                            {isGeneratingReply[comment.id] ? <RefreshCcw className="animate-spin" size={14} /> : <Bot size={14} />}
                                                            {isGeneratingReply[comment.id] ? '트윈이 생각 중...' : 'AI 트윈 대리 답변'}
                                                        </button>
                                                        <button className="px-6 py-2.5 bg-white/5 text-gray-500 text-[11px] font-black rounded-xl hover:bg-white/10 hover:text-white transition-all">
                                                            직접 답장
                                                        </button>
                                                    </div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                        <button className="w-full mt-10 py-5 bg-white/5 border border-white/10 rounded-3xl text-gray-500 text-xs font-black uppercase tracking-[0.3em] hover:bg-white/10 hover:text-cyan-400 transition-all flex items-center justify-center gap-3">
                            <Users size={18} /> 전체 커뮤니티 정밀 분석 데이터 팩 보기
                        </button>
                    </TwinCard>
                </div>
            </div>
        </div>
    );
};

