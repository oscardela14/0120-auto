import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, BarChart3, ArrowUpRight, ShieldAlert, Zap, Search, PieChart, Coins, Info, Youtube, Instagram, Play } from 'lucide-react';
import { predictROI, getExchangeRate } from '../utils/revenueEngine';
import { fetchRealtimeTrends } from '../utils/realtimeTrends';
import { cn } from '../lib/utils';
import { useUser } from '../contexts/UserContext';

export const ProfitPredictor = () => {
    const { addNotification } = useUser();
    const [keyword, setKeyword] = useState('');
    const [volume, setVolume] = useState(0);
    const [prediction, setPrediction] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isIssuing, setIsIssuing] = useState(false);
    const [isIssued, setIsIssued] = useState(false);
    const [dynamicTrends, setDynamicTrends] = useState([]);
    const [selectedChannel, setSelectedChannel] = useState(null);

    useEffect(() => {
        const loadTrends = async () => {
            try {
                const trends = await fetchRealtimeTrends();
                // Map trends to satisfy { k: keyword, v: volume, p: platform } structure
                const formatted = trends.map(t => ({
                    k: t.keyword,
                    v: parseInt(t.volume?.replace(/[^0-9]/g, '') || '50') * 1000,
                    p: t.category // Current categories: '유튜브', '인스타', '네이버 블로그', '스레드'
                }));
                setDynamicTrends(formatted);
            } catch (error) {
                console.error("Failed to load trends for predictor", error);
            }
        };
        loadTrends();
    }, []);

    const handlePredict = () => {
        if (!keyword.trim()) {
            addNotification("분석할 키워드를 입력해주세요.", "warning");
            return;
        }
        if (!volume || volume <= 0) {
            addNotification("예상 검색량(VOL)을 숫자로 입력해주세요 (예: 50,000).", "info");
            return;
        }
        setIsLoading(true);
        setIsIssued(false); // Reset issued state on new prediction
        setTimeout(() => {
            const result = predictROI(keyword, volume);
            setPrediction(result);
            setIsLoading(false);
        }, 800);
    };

    const handleIssueCertificate = () => {
        if (isIssued) return;
        setIsIssuing(true);
        addNotification("알고리즘 기반 자산 권리 관계 확인 중...", "info");

        setTimeout(() => {
            setIsIssuing(false);
            setIsIssued(true);
            addNotification("자산 평가 보증서 발행 완료! 보관함에서 인증 마크를 확인할 수 있습니다.", "success");
        }, 2000);
    };

    const formatNumber = (num) => {
        if (!num) return '';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const handleVolumeChange = (e) => {
        const value = e.target.value.replace(/,/g, '');
        if (value === '' || /^\d+$/.test(value)) {
            setVolume(value === '' ? 0 : parseInt(value));
        }
    };

    const quickTags = [
        { k: '무자본 자동화', v: 45000 }, { k: '배드민턴 하이라이트', v: 120000 },
        { k: 'AI 업무 효율화', v: 28000 }, { k: '재테크 숏폼', v: 85000 },
        { k: '디지털 노마드', v: 35000 }, { k: '챗GPT 활용법', v: 62000 },
        { k: '자취 요리 레시피', v: 150000 }, { k: '부동산 경매 기초', v: 22000 },
        { k: '앱테크 추천', v: 98000 }, { k: '가성비 성지', v: 74000 },
        { k: '자기계발 루틴', v: 41000 }, { k: '명품 하울', v: 55000 },
        { k: '국내 여행 코스', v: 130000 }, { k: '심리학 사회공학', v: 18000 },
        { k: '코딩 독학 가이드', v: 33000 }, { k: '주식 차트 분석', v: 89000 },
        { k: '건강 정보 팩트체크', v: 67000 }, { k: '원룸 인테리어', v: 110000 },
        { k: '마인드셋 동기부여', v: 52000 }, { k: '부업 수익 인증', v: 48000 }
    ];

    // No auto-predict on mount with empty values

    return (
        <div className="space-y-8">
            {/* Input Section */}
            <div className="bg-[#0f1218]/60 backdrop-blur-2xl border border-white/5 p-8 rounded-[32px]">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="분석할 키워드 (예: 무자본 자동화, 배드민턴 레슨)..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans"
                        />
                    </div>
                    <div className="w-full md:w-56 relative">
                        <input
                            type="text"
                            value={formatNumber(volume)}
                            onChange={handleVolumeChange}
                            placeholder="예: 50,000"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-indigo-400 font-black focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-right pr-12"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 font-black uppercase">Vol</span>
                    </div>
                    <div className="relative group/btn">
                        <button
                            onClick={handlePredict}
                            disabled={isLoading}
                            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 w-full md:w-auto"
                        >
                            {isLoading ? <Zap className="animate-spin" size={18} /> : <Target size={18} />}
                            수익 시뮬레이션
                        </button>

                        {/* Expert Tooltip on Hover */}
                        <div className="absolute bottom-full right-0 mb-4 w-80 p-6 bg-[#1a1c26] border border-white/10 rounded-[24px] opacity-0 group-hover/btn:opacity-100 pointer-events-none transition-all duration-300 z-[200] backdrop-blur-3xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] translate-y-2 group-hover/btn:translate-y-0 text-left">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
                                <TrendingUp size={16} className="text-indigo-400" />
                                <span className="text-[13px] font-black text-white uppercase tracking-widest">Expert ROI Engine v2.4</span>
                            </div>
                            <div className="space-y-3">
                                <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                                    본 엔진은 입력된 키워드의 <span className="text-white font-black">LSI(잠재적 의미 분석)</span>와 검색량 대비 <span className="text-white font-black">콘텐츠 생산 밀도(Density)</span>를 교차 검증합니다.
                                </p>
                                <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
                                    <p className="text-[10px] text-indigo-300 leading-relaxed italic">
                                        "단순 조회수뿐만 아니라 카테고리별 평균 CPC, 클릭 전환율(CTR), 그리고 브랜드 협업 단가 지수를 결합하여 **실제 통장에 찍히는 연동 수익**을 예측합니다."
                                    </p>
                                </div>
                            </div>
                            <div className="absolute bottom-0 right-10 translate-y-full border-[10px] border-transparent border-t-[#1a1c26]" />
                        </div>
                    </div>
                </div>

                <div className="flex gap-10 px-2 mt-4 pt-6 border-t border-white/5">
                    <div className="flex flex-col gap-6 shrink-0 pt-0">
                        <div className="relative group/header mt-1">
                            <motion.span
                                animate={{ opacity: [0.9, 1, 0.9], textShadow: ["0 0 0px rgba(255,255,255,0)", "0 0 20px rgba(99,102,241,0.2)", "0 0 0px rgba(255,255,255,0)"] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="text-[15px] font-black uppercase whitespace-nowrap tracking-[-0.05em] mb-3 border-b border-white/5 pb-2 flex items-center gap-2 bg-gradient-to-r from-gray-100 via-white to-gray-400 bg-clip-text text-transparent"
                            >
                                Live Viral Trends
                                <span className="ml-1 px-1.5 py-0.5 rounded-[3px] bg-indigo-500/10 border border-indigo-500/20 text-[7px] text-indigo-400 tracking-widest font-black animate-pulse">LIVE</span>
                            </motion.span>
                        </div>

                        {/* 1x4 Platform Legend - Premium Card Look */}
                        <div className="flex flex-col gap-2">
                            {[
                                { n: 'YouTube', i: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FF0000"%3E%3Cpath d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/%3E%3C/svg%3E', c: 'text-red-500', bc: 'border-red-500/10' },
                                { n: 'Instagram', i: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23E4405F"%3E%3Cpath d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/%3E%3C/svg%3E', c: 'text-pink-500', bc: 'border-pink-500/10' },
                                { n: 'Naver Blog', i: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2303C75A"%3E%3Cpath d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z"/%3E%3C/svg%3E', c: 'text-green-500', bc: 'border-emerald-500/10' },
                                { n: 'Threads', i: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"%3E%3Cpath d="M14.886 12.269c0-.51-.036-.933-.108-1.27s-.183-.591-.334-.761c-.151-.17-.35-.255-.596-.255s-.454.085-.624.255s-.302.421-.397.755c-.095.334-.142.758-.142 1.272s.047.939.142 1.273.227.585.397.755.378.255.624.255.444-.085.596-.255.262-.421.334-.755.108-.763.108-1.274zm1.902 0c0 .762-.075 1.439-.226 2.031s-.383 1.077-.695 1.455-.716.666-1.21.865-1.079.298-1.755.298c-.689 0-1.286-.099-1.791-.298s-.911-.486-1.218-.865-.526-.862-.656-1.455c-.131-.592-.196-1.269-.196-2.031s.065-1.444.196-2.043.349-1.085.656-1.455.713-.662 1.218-.876.1.066 1.791-.298c.676 0 1.261.099 1.755.298s.898.506 1.21.876.544.856.695 1.455c.151.599.226 1.281.226 2.043zm.255-7.771c.217.151.411.335.582.553.17.217.317.468.439.75.123.283.213.59.27.919s.085.676.085 1.042c0 .482-.043.911-.128 1.289s-.213.704-.383.978c-.17.274-.383.5-0.638.681s-.553.317-.893.411c-.34.094-.723.142-1.148.142-.434 0-.817-.047-1.148-.142s-.61-.231-.836-.411-.421-.407-.582-.681c-.16-.274-.298-.5-.411-.978s-.17-.807-.17-1.289c0-.366.028-.713.085-1.042s.147-.636.27-.919.269-.533.439-.75.365-.402.582-.553.454-.269.709-.354c.255-.085.524-.128.808-.128s.553.043.808.128c.255.085.491.203.709.354zM12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z"/%3E%3C/svg%3E', c: 'text-white', bc: 'border-white/10' }
                            ].map((p, i) => (
                                <div key={i} className={cn(
                                    "flex items-center gap-2.5 px-2 py-1.5 rounded-lg border transition-all duration-500 group/label cursor-default",
                                    "bg-white/[0.02] hover:bg-white/[0.06]",
                                    p.bc || "border-white/5"
                                )}>
                                    <div className="w-[24px] h-[24px] rounded-md overflow-hidden flex items-center justify-center bg-white/5 border border-white/10 group-hover/label:scale-110 group-hover/label:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all duration-500 shadow-2xl">
                                        <img
                                            src={p.i}
                                            alt={p.n}
                                            className="w-full h-full object-contain p-1.5"
                                        />
                                    </div>
                                    <span className={cn("text-[13px] font-black uppercase tracking-tighter opacity-40 group-hover/label:opacity-100 transition-all duration-500", p.c)}>
                                        {p.n}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 max-h-[320px] overflow-y-auto no-scrollbar py-1">
                        {dynamicTrends.slice(0, 40).map((tag, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setKeyword(tag.k);
                                    setVolume(tag.v);
                                }}
                                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-[14px] font-bold text-gray-300 hover:text-indigo-400 transition-all whitespace-nowrap shadow-lg hover:shadow-indigo-500/10 flex items-center gap-2.5"
                            >
                                <div className="flex items-center justify-center shrink-0 w-4 h-4 overflow-hidden rounded-sm relative">
                                    <img
                                        src={
                                            tag.p === '유튜브' ? 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FF0000"%3E%3Cpath d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/%3E%3C/svg%3E' :
                                                tag.p === '인스타' ? 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23E4405F"%3E%3Cpath d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/%3E%3C/svg%3E' :
                                                    tag.p === '네이버 블로그' ? 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2303C75A"%3E%3Cpath d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z"/%3E%3C/svg%3E' :
                                                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"%3E%3Cpath d="M14.886 12.269c0-.51-.036-.933-.108-1.27s-.183-.591-.334-.761c-.151-.17-.35-.255-.596-.255s-.454.085-.624.255s-.302.421-.397.755c-.095.334-.142.758-.142 1.272s.047.939.142 1.273.227.585.397.755.378.255.624.255.444-.085.596-.255.262-.421.334-.755.108-.763.108-1.274zm1.902 0c0 .762-.075 1.439-.226 2.031s-.383 1.077-.695 1.455-.716.666-1.21.865-1.079.298-1.755.298c-.689 0-1.286-.099-1.791-.298s-.911-.486-1.218-.865-.526-.862-.656-1.455c-.131-.592-.196-1.269-.196-2.031s.065-1.444.196-2.043.349-1.085.656-1.455.713-.662 1.218-.876.1.066 1.791-.298c.676 0 1.261.099 1.755.298s.898.506 1.21.876.544.856.695 1.455c.151.599.226 1.281.226 2.043zm.255-7.771c.217.151.411.335.582.553.17.217.317.468.439.75.123.283.213.59.27.919s.085.676.085 1.042c0 .482-.043.911-.128 1.289s-.213.704-.383.978c-.17.274-.383.5-0.638.681s-.553.317-.893.411c-.34.094-.723.142-1.148.142-.434 0-.817-.047-1.148-.142s-.61-.231-.836-.411-.421-.407-.582-.681c-.16-.274-.298-.5-.411-.978s-.17-.807-.17-1.289c0-.366.028-.713.085-1.042s.147-.636.27-.919.269-.533.439-.75.365-.402.582-.553.454-.269.709-.354c.255-.085.524-.128.808-.128s.553.043.808.128c.255.085.491.203.709.354zM12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z"/%3E%3C/svg%3E'
                                        }
                                        alt={tag.p}
                                        className="w-full h-full object-contain"
                                    />
                                    <div className={cn(
                                        "w-1.5 h-1.5 rounded-full hidden",
                                        tag.p === '유튜브' ? 'bg-red-500' :
                                            tag.p === '인스타' ? 'bg-pink-500' :
                                                tag.p === '네이버 블로그' ? 'bg-emerald-500' : 'bg-white/40'
                                    )} />
                                </div>
                                {tag.k.replace(/^#+/, '')}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {prediction && (
                <div className="space-y-4">
                    {/* ROW 1: Metric Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
                    >
                        {/* 1. Stacked Column: Score & Revenue */}
                        <div className="lg:col-span-1 flex flex-col gap-4">
                            {/* Top: Profitability Score */}
                            <div className="bg-indigo-600 p-5 text-white rounded-[24px] relative flex flex-col justify-between shadow-2xl h-full min-h-[160px]">
                                <div className="absolute top-0 right-0 p-3 opacity-20"><TrendingUp size={48} /></div>

                                <div>
                                    <h3 className="text-[14px] font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                                        Profitability Score
                                        <div className="group relative">
                                            <Info size={10} className="opacity-60 cursor-help" />
                                            <div className="absolute top-full left-0 mt-2 w-48 p-2 bg-black/80 backdrop-blur-md rounded-lg text-[10px] leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                                                광고 단가(CPC)와 경쟁 강도를 종합 분석한 수익 잠재력 지수입니다.
                                            </div>
                                        </div>
                                    </h3>
                                    <div className="flex items-baseline gap-1 mb-1">
                                        <span className="text-4xl font-black tracking-tighter">{prediction.score}</span>
                                        <span className="text-sm font-bold opacity-60">/100</span>
                                    </div>
                                    <p className="text-indigo-100 text-[12px] font-medium leading-relaxed tracking-tight line-clamp-2">
                                        {prediction.score === 0 ? "수익성 분석 필요" : (
                                            <>"{keyword}" 키워드는 <span className="font-black underline decoration-white/30 underline-offset-4">{prediction.score > 70 ? '황금 키워드' : prediction.score > 40 ? '수익 창출 가능' : '수익성 낮음'}</span> 단계입니다.</>
                                        )}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 px-2 py-1.5 bg-white/10 rounded-lg w-fit backdrop-blur-sm border border-white/10 mt-auto">
                                    <Zap size={10} className="text-indigo-200" />
                                    <span className="text-[12px] font-black uppercase tracking-widest truncate max-w-[120px]">{prediction.bestPlatform}</span>
                                </div>
                            </div>

                            {/* Bottom: Expected Revenue */}
                            <div className="bg-[#0f1218]/60 backdrop-blur-2xl border border-white/5 p-5 rounded-[24px] flex flex-col justify-between shadow-2xl h-full min-h-[160px] relative overflow-hidden">
                                <div className="relative z-10 flex flex-col h-full justify-between">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-[14px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                            Expected Revenue
                                            <div className="group relative">
                                                <Info size={10} className="opacity-60 cursor-help" />
                                                <div className="absolute top-full left-0 mt-2 w-48 p-2 bg-black/80 backdrop-blur-md rounded-lg text-[10px] leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                                                    CPM(1,000회 노출당 수익) ₩2,500 및 제휴 전환율 1.5%를 가정하여 산출된 예상치입니다.
                                                </div>
                                            </div>
                                        </h3>
                                        <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20"><Coins size={14} /></div>
                                    </div>
                                    <div className="mb-2">
                                        <div className="flex items-baseline gap-1 mb-1">
                                            <span className="text-2xl font-black text-white tracking-tight">₩{prediction.projectedRevenue.toLocaleString()}</span>
                                        </div>
                                        <p className="text-[12px] text-gray-400 font-medium leading-relaxed tracking-tight">
                                            광고 수익 + 제휴 전환 기댓값 합산.
                                        </p>
                                    </div>
                                    <div className="pt-2 border-t border-white/5 mt-auto">
                                        <div className="flex justify-between items-center text-[9px] font-black uppercase text-gray-500 mb-1">
                                            <span className="flex items-center gap-1">Difficulty</span>
                                            <span className={cn(
                                                prediction.difficulty === 'EASY' ? 'text-emerald-400' :
                                                    prediction.difficulty === 'MEDIUM' ? 'text-amber-400' : 'text-red-400'
                                            )}>{prediction.difficulty}</span>
                                        </div>
                                        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                                            <div style={{ width: prediction.difficulty === 'EASY' ? '30%' : prediction.difficulty === 'MEDIUM' ? '60%' : '90%' }} className={cn("h-full",
                                                prediction.difficulty === 'EASY' ? 'bg-emerald-500' :
                                                    prediction.difficulty === 'MEDIUM' ? 'bg-amber-500' : 'bg-red-500'
                                            )} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Asset Valuation Card (Full Height) */}
                        <div className="lg:col-span-1 bg-[#0f1218]/60 backdrop-blur-2xl border border-white/5 p-6 rounded-[24px] flex flex-col group/card relative overflow-hidden min-h-[340px]">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-2xl rounded-full" />
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-[14px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    Asset Valuation
                                    <div className="group relative">
                                        <Info size={10} className="opacity-60 cursor-help" />
                                        <div className="absolute top-full right-0 mt-2 w-48 p-2 bg-black/80 backdrop-blur-md rounded-lg text-[10px] leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none text-right">
                                            사용자 검색량 대비 현재 발행되어 있는 콘텐츠의 밀도(Density)입니다.
                                        </div>
                                    </div>
                                </h3>
                                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><PieChart size={18} /></div>
                            </div>

                            <div className="flex-1 flex flex-col justify-center space-y-5">
                                <div className="p-3 bg-white/5 rounded-xl border border-white/10 relative">
                                    <span className="text-[12px] text-gray-500 font-bold uppercase block mb-1">Guaranteed Equity</span>
                                    <div className="text-2xl font-black text-white">₩{(prediction.projectedRevenue * 12).toLocaleString()}</div>
                                    <p className="text-[12px] text-gray-400 mt-0.5">1년 누적 예상 자산 가치</p>
                                </div>

                                <div className="p-3 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-xl border border-blue-500/30 relative overflow-hidden group/cert">
                                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/cert:opacity-100 transition-opacity" />
                                    <div className="flex items-center gap-2 mb-2">
                                        <ShieldAlert size={12} className="text-blue-400" />
                                        <span className="text-[9px] font-black text-white uppercase tracking-widest">Certificate</span>
                                    </div>
                                    <p className="text-[9px] text-blue-100/60 leading-tight font-medium mb-3">
                                        "평균 <span className="text-white">CPC ₩1,850</span> 보장 구간"
                                    </p>
                                    <button
                                        onClick={handleIssueCertificate}
                                        disabled={isIssuing || isIssued}
                                        className={cn(
                                            "w-full py-2 text-[9px] font-black rounded-lg transition-all uppercase tracking-widest flex items-center justify-center gap-2",
                                            isIssued
                                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default"
                                                : "bg-blue-600 text-white hover:bg-blue-500 active:scale-95 shadow-lg shadow-blue-900/40"
                                        )}
                                    >
                                        {isIssuing ? <Zap className="animate-spin" size={10} /> : isIssued ? <ShieldAlert size={10} /> : "발행하기"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 4. Detailed Breakdown Card */}
                        <div className="lg:col-span-1 bg-[#1a1c26] backdrop-blur-2xl border border-white/5 p-6 rounded-[24px] flex flex-col shadow-2xl min-h-[340px] relative overflow-hidden">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-[14px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    Detail Metrics
                                </h3>
                                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><BarChart3 size={18} /></div>
                            </div>

                            <div className="space-y-3 flex-1">
                                <div className="flex justify-between items-center p-2.5 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                                    <span className="text-[15px] text-gray-400 font-medium">Est. CPC</span>
                                    <span className="text-[15px] font-black text-white">
                                        ₩{(1250 + prediction.score * 12).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-2.5 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                                    <span className="text-[15px] text-gray-400 font-medium">CTR</span>
                                    <span className="text-[15px] font-black text-emerald-400">
                                        {(2.8 + prediction.score * 0.03).toFixed(1)}%
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-2.5 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                                    <span className="text-[15px] text-gray-400 font-medium">Conversion</span>
                                    <span className="text-[15px] font-black text-indigo-400">
                                        {(1.2 + prediction.score * 0.015).toFixed(1)}%
                                    </span>
                                </div>

                                <div className="mt-auto pt-3 border-t border-white/5">
                                    <div className="text-[14px] text-gray-500 uppercase tracking-widest mb-2 font-bold">Trend Analysis</div>
                                    <div className={cn(
                                        "flex items-center gap-2 text-[15px] font-bold p-2 rounded-lg",
                                        prediction.score >= 50 ? "bg-emerald-500/5 text-emerald-400" : "bg-amber-500/5 text-amber-400"
                                    )}>
                                        <TrendingUp size={18} className={prediction.score < 50 ? "rotate-180" : ""} />
                                        <span>
                                            {prediction.score >= 50 ? "Rising Trend" : "Stable Trend"}
                                            ({prediction.score >= 50 ? "+" : ""}{Math.floor((prediction.score - 40) / 2)}%)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* ROW 2: Command Center Extensions */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                    >
                        {/* 5. Competitor Intelligence (Span 1) */}
                        <div className="lg:col-span-1 bg-[#0f1218]/60 backdrop-blur-2xl border border-white/5 p-6 rounded-[24px] min-h-[300px]">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-[14px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    Competitor Intelligence
                                </h3>
                                <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400"><Target size={18} /></div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map((i) => {
                                    const isSelected = selectedChannel === i;
                                    return (
                                        <div
                                            key={i}
                                            onClick={() => setSelectedChannel(isSelected ? null : i)}
                                            className={cn(
                                                "flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 group cursor-pointer",
                                                isSelected
                                                    ? "bg-indigo-600/20 border-indigo-500/50 hover:bg-indigo-600/30 shadow-[0_0_15px_-3px_rgba(79,70,229,0.2)]"
                                                    : "bg-white/5 border-white/5 hover:bg-white/10"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-colors shrink-0",
                                                isSelected
                                                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/40 scale-105"
                                                    : "bg-gray-700 text-gray-400 group-hover:bg-indigo-600 group-hover:text-white"
                                            )}>
                                                CH{i}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={cn(
                                                    "text-[13px] font-bold truncate transition-colors",
                                                    isSelected ? "text-indigo-200" : "text-white group-hover:text-indigo-300"
                                                )}>Top Ranker Channel {i}</p>
                                                <p className="text-[13px] text-gray-500 truncate">Views: {(150000 - i * 12000).toLocaleString()} • Subs: {(5000 - i * 300).toLocaleString()}</p>
                                            </div>
                                            <div className={cn(
                                                "transition-colors",
                                                isSelected ? "text-indigo-400" : "text-gray-600 group-hover:text-white"
                                            )}>
                                                <ArrowUpRight size={12} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/5 flex gap-2 overflow-x-auto no-scrollbar">
                                <span className="px-3 py-1 bg-white/5 rounded-lg text-[13px] text-gray-400 whitespace-nowrap">🔥 High Saturation</span>
                                <span className="px-3 py-1 bg-white/5 rounded-lg text-[13px] text-gray-400 whitespace-nowrap">⚡ Fast Growth</span>
                                <span className="px-3 py-1 bg-white/5 rounded-lg text-[13px] text-gray-400 whitespace-nowrap">💎 Premium Ad Value</span>
                            </div>
                        </div>

                        {/* 6. AI Action Plan (Span 1) */}
                        <div className="lg:col-span-1 bg-gradient-to-br from-[#1a1c26] to-[#0f1218] backdrop-blur-2xl border border-white/5 p-6 rounded-[24px] min-h-[300px] relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5"><Zap size={100} /></div>
                            <div className="flex items-center justify-between mb-6 relative z-10">
                                <h3 className="text-[14px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    AI Action Plan
                                </h3>
                                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400"><Zap size={18} /></div>
                            </div>

                            <ul className="space-y-3 relative z-10">
                                <li className="flex gap-3">
                                    <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[13px] font-bold shrink-0 mt-0.5">1</div>
                                    <p className="text-[13px] text-gray-300 leading-relaxed"><span className="text-white font-bold">썸네일 최적화:</span> "충격", "논란" 등의 키워드보다 "실제 후기", "숫자" 중심의 카피라이팅 권장</p>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[13px] font-bold shrink-0 mt-0.5">2</div>
                                    <p className="text-[13px] text-gray-300 leading-relaxed"><span className="text-white font-bold">도입부 후킹:</span> 3초 내에 결론부터 제시하여 이탈률 방어 필요</p>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[13px] font-bold shrink-0 mt-0.5">3</div>
                                    <p className="text-[13px] text-gray-300 leading-relaxed"><span className="text-white font-bold">업로드 골든타임:</span> 평일 오후 6시~8시 사이 트래픽 급증 예상</p>
                                </li>
                            </ul>

                            <button className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[13px] font-bold text-gray-300 transition-all flex items-center justify-center gap-2">
                                Full Action Plan 보기 <ArrowUpRight size={12} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};


export default ProfitPredictor;
