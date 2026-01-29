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
    const [dynamicTrends, setDynamicTrends] = useState([]);

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
        setTimeout(() => {
            const result = predictROI(keyword, volume);
            setPrediction(result);
            setIsLoading(false);
        }, 800);
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
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                >
                    {/* Score Card */}
                    <div className="bg-indigo-600 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl flex flex-col">
                        <div className="absolute top-0 right-0 p-4 opacity-20"><TrendingUp size={80} /></div>
                        <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                            Profitability Score
                            <div className="group relative">
                                <Info size={12} className="opacity-60 cursor-help" />
                                <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-black/80 backdrop-blur-md rounded-lg text-[10px] leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                                    광고 단가(CPC)와 경쟁 강도를 종합 분석한 수익 잠재력 지수입니다.
                                </div>
                            </div>
                        </h3>
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-6xl font-black">{prediction.score}</span>
                            <span className="text-xl font-bold opacity-60">/100</span>
                        </div>
                        <p className="text-indigo-100 text-[11px] font-medium leading-relaxed mb-6">
                            {prediction.score === 0 ? "키워드와 검색량을 입력하여 수익성을 분석하세요." : (
                                <>"{keyword}" 키워드는 <span className="font-black underline">{prediction.score > 70 ? '황금 키워드' : prediction.score > 40 ? '수익 창출 가능' : '수익성 낮음'}</span> 단계입니다. 효율적인 리소스로 고수익을 노릴 수 있는 구간입니다.</>
                            )}
                        </p>
                        <div className="mt-auto">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl w-fit">
                                <Zap size={14} />
                                <span className="text-xs font-black uppercase tracking-widest">Best Platform: {prediction.bestPlatform}</span>
                            </div>
                        </div>
                    </div>

                    {/* Revenue Projection */}
                    <div className="bg-[#0f1218]/60 backdrop-blur-2xl border border-white/5 p-8 rounded-[32px] flex flex-col justify-between group/card relative">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    Expected Revenue
                                    <div className="group relative">
                                        <Info size={12} className="opacity-60 cursor-help" />
                                        <div className="absolute bottom-full left-0 mb-2 w-56 p-2 bg-black/80 backdrop-blur-md rounded-lg text-[10px] leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                                            CPM(1,000회 노출당 수익) ₩2,500 및 제휴 전환율 1.5%를 가정하여 산출된 예상치입니다.
                                        </div>
                                    </div>
                                </h3>
                                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><Coins size={20} /></div>
                            </div>
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-4xl font-black text-white">₩{prediction.projectedRevenue.toLocaleString()}</span>
                            </div>
                            <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                                광고 수익(AdSense)과 제휴 마케팅 전환 기댓값을 합산한 수치입니다. <span className="text-emerald-500/80 font-bold">콘텐츠 1건당</span> 기대할 수 있는 잠재 가치입니다.
                            </p>
                        </div>
                        <div className="pt-6 border-t border-white/5 mt-8">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-500 mb-2">
                                <span className="flex items-center gap-1">Difficulty Level <ShieldAlert size={10} /></span>
                                <span className={cn(
                                    prediction.difficulty === 'EASY' ? 'text-emerald-400' :
                                        prediction.difficulty === 'MEDIUM' ? 'text-amber-400' : 'text-red-400'
                                )}>{prediction.difficulty}</span>
                            </div>
                            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                <div style={{ width: prediction.difficulty === 'EASY' ? '30%' : prediction.difficulty === 'MEDIUM' ? '60%' : '90%' }} className={cn("h-full",
                                    prediction.difficulty === 'EASY' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' :
                                        prediction.difficulty === 'MEDIUM' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                                )} />
                            </div>
                            <p className="text-[9px] text-gray-600 mt-2 font-medium">대형 채널들의 도메인 파워 및 키워드 점유율 기반 분석</p>
                        </div>
                    </div>

                    {/* Market Saturation */}
                    <div className="bg-[#0f1218]/60 backdrop-blur-2xl border border-white/5 p-8 rounded-[32px] flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                Market Saturation
                                <div className="group relative">
                                    <Info size={12} className="opacity-60 cursor-help" />
                                    <div className="absolute bottom-full right-0 mb-2 w-56 p-2 bg-black/80 backdrop-blur-md rounded-lg text-[10px] leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none text-right">
                                        사용자 검색량 대비 현재 발행되어 있는 콘텐츠의 밀도(Density)입니다.
                                    </div>
                                </div>
                            </h3>
                            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><PieChart size={20} /></div>
                        </div>
                        <div className="relative w-32 h-32 mx-auto mb-6 flex-shrink-0">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="64" cy="64" r="54" stroke="rgba(255,255,255,0.05)" strokeWidth="10" fill="transparent" />
                                <motion.circle
                                    cx="64" cy="64" r="54"
                                    stroke={prediction.saturationIndex > 70 ? '#f87171' : prediction.saturationIndex > 40 ? '#fbbf24' : '#60a5fa'}
                                    strokeWidth="10"
                                    fill="transparent"
                                    strokeDasharray={339.3}
                                    initial={{ strokeDashoffset: 339.3 }}
                                    animate={{ strokeDashoffset: 339.3 - (339.3 * prediction.saturationIndex / 100) }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-black text-white">{prediction.saturationIndex}%</span>
                                <span className="text-[8px] text-gray-500 font-black uppercase">Density</span>
                            </div>
                        </div>
                        <div className="text-center mb-6">
                            <span className={cn(
                                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter",
                                prediction.saturationStatus === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                    prediction.saturationStatus === 'HIGH' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                        'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            )}>
                                {prediction.saturationStatus === 'CRITICAL' ? '레드오션 (피해 가세요)' :
                                    prediction.saturationStatus === 'HIGH' ? '경쟁 치열' : '블루오션 (진입 추천)'}
                            </span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-medium leading-relaxed text-center mt-auto">
                            현재 시판 중인 콘텐츠 대비 공급 부족 상태입니다. 지금 발행 시 상위 노출 확률이 매우 높습니다.
                        </p>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default ProfitPredictor;
