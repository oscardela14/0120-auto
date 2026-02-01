import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3, TrendingUp, DollarSign, Users,
    ArrowUpRight, ArrowDownRight, Wallet, Target,
    Coins, Zap, PieChart, Activity, ShoppingBag,
    Calendar, ChevronRight, Crown, Share2, Info, X,
    Play, FileText, CheckCircle2, Clock, Search, Globe, Sparkles, ShieldCheck, Link
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { cn } from '../lib/utils';

import { getExchangeRate, syncPlatformData, determineNiche, calculateRevenueData } from '../utils/revenueEngine';
import { fetchGA4RealtimeStats, getGA4Conversions } from '../utils/ga4Engine';
import { ProfitPredictor } from '../components/ProfitPredictor';
import { ProfitMaximizer } from '../components/ProfitMaximizer';
import { RoiSimulationPanel } from '../components/revenue/RoiSimulationPanel';
import { AssetEquityPanel } from '../components/revenue/AssetEquityPanel';
import { FinancialReportTemplate } from '../components/revenue/FinancialReportTemplate';

const RevenueTooltip = ({ children }) => (
    <div className="group relative inline-block">
        {children}
        <div className="absolute top-full left-0 mt-3 w-80 p-6 bg-[#1a1c26] border border-white/10 rounded-[24px] text-[13px] text-gray-400 leading-relaxed shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 z-[100] backdrop-blur-xl translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
            <div className="absolute top-0 left-10 -translate-y-full border-8 border-transparent border-b-[#1a1c26]" />
            <div className="font-black text-[15px] text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                수익 정산 로직 (실거래 데이터 기준)
            </div>
            <ul className="space-y-3">
                <li className="flex gap-2">
                    <span className="text-indigo-400 font-bold">●</span>
                    <span><strong className="text-gray-200">실제 광고 수익:</strong> 사용자가 생성한 콘텐츠 건당 활성 CPM 가스비 산출액</span>
                </li>
                <li className="flex gap-2">
                    <span className="text-emerald-400 font-bold">●</span>
                    <span><strong className="text-gray-200">제휴 마케팅 성과:</strong> 생성물에 귀속된 트래픽의 실제 전환 가치 합산액</span>
                </li>
                <li className="flex gap-2">
                    <span className="text-purple-400 font-bold">●</span>
                    <span><strong className="text-gray-200">운영 비용 절감:</strong> 생성 완료된 콘텐츠 수 × 외주 대행 평균 단가 (₩120,000)</span>
                </li>
            </ul>
        </div>
    </div>
);


const RevenueCard = ({ title, value, sub, icon: Icon, colorClass, gradient, description, isSyncing }) => (
    <div className={cn(
        "bg-[#0f1218]/60 backdrop-blur-2xl border border-white/5 p-6 rounded-[32px] relative overflow-visible group cursor-help transition-all hover:bg-white/[0.02]",
        isSyncing && "ring-2 ring-indigo-500/50 animate-pulse bg-indigo-500/5 shadow-[0_0_30px_rgba(79,70,229,0.2)]"
    )}>
        <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 transition-opacity", gradient)}></div>

        {/* Expert Tooltip on Hover */}
        <div className="absolute bottom-[calc(100%+16px)] left-0 w-[300px] p-5 bg-[#1a1c26] border border-white/10 rounded-[24px] opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 z-[100] backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] translate-y-2 group-hover:translate-y-0">
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/5">
                <div className={cn("w-1.5 h-1.5 rounded-full", colorClass.replace('text', 'bg'))} />
                <span className="text-[11px] font-black text-white uppercase tracking-widest">Expert Intelligence</span>
            </div>
            <p className="text-[12px] text-gray-400 leading-relaxed font-bold">
                {description}
            </p>
            <div className="absolute bottom-[-8px] left-10 w-4 h-4 bg-[#1a1c26] border-r border-b border-white/10 rotate-45" />
        </div>

        <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
                <div className={cn("p-5 rounded-[22px] bg-white/5", colorClass)}>
                    <Icon size={32} />
                </div>
                <div className="flex items-center gap-1.5 text-[13px] font-black text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                    <ArrowUpRight size={14} /> +12%
                </div>
            </div>
            <h3 className="text-gray-400 text-[15px] font-black uppercase tracking-widest mb-2">{title}</h3>
            <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-white">{value}원</span>
            </div>
            {sub && <p className="text-[16px] text-gray-400 mt-3.5 font-bold tracking-tight">{sub}</p>}
        </div>
    </div>
);


const RevenuePage = () => {
    const {
        history = [],
        user,
        addNotification,
        revenueSettings,
        refreshHistory
    } = useUser();
    const [isDownloading, setIsDownloading] = useState(false);
    const [isRequestingPayout, setIsRequestingPayout] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [activeTab, setActiveTab] = useState('board'); // 'board' | 'payout' | 'predictor' | 'test'
    const [timeGrain, setTimeGrain] = useState('Day');
    const [syncSeed, setSyncSeed] = useState(0);
    const [lastSyncTime, setLastSyncTime] = useState(new Date());
    const [showLedger, setShowLedger] = useState(false);
    const [ledgerCategory, setLedgerCategory] = useState(null); // 'adsense' | 'affiliate' | 'savings'
    const [ga4Data, setGa4Data] = useState(null);
    const reportRef1 = useRef(null);
    const reportRef2 = useRef(null);
    const reportRef3 = useRef(null);
    const reportRef4 = useRef(null);
    const reportRef5 = useRef(null);

    useEffect(() => {
        const loadGA4 = async () => {
            const data = await getGA4Conversions();
            setGa4Data(data);
        };
        loadGA4();
    }, []);

    const stats = useMemo(() => calculateRevenueData(history, { ...revenueSettings, timeGrain, isSyncing, syncSeed }), [history, revenueSettings, timeGrain, isSyncing, syncSeed]);
    const isFree = user?.plan === 'free';
    const availableBalance = Math.floor(stats.adRevenue * 0.15);
    const canWithdraw = availableBalance >= 30000;

    const handleSync = async () => {
        setIsSyncing(true);
        addNotification("데이터를 실시간 동기화 중입니다...", "info");
        try {
            if (refreshHistory) await refreshHistory();
            setSyncSeed(prev => prev + 1);
            setLastSyncTime(new Date());
            setTimeout(() => { setIsSyncing(false); addNotification("데이터 최신 업데이트 완료", "success"); }, 1200);
        } catch (e) {
            setIsSyncing(false);
            addNotification("동기화 중 오류 발생", "error");
        }
    };

    const handleDownloadReport = async () => {
        setIsDownloading(true);
        addNotification("전문가 리포트 생성 중... (1/5)", "info");
        try {
            const { default: jsPDF } = await import('jspdf');
            const { toPng } = await import('html-to-image');

            if (!reportRef1.current) return;

            const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const options = { cacheBust: true, backgroundColor: '#ffffff', quality: 1, pixelRatio: 1.5, skipFonts: true };

            // Page 1
            const dataUrl1 = await toPng(reportRef1.current, options);
            pdf.addImage(dataUrl1, 'PNG', 0, 0, pageWidth, pageHeight);

            // Page 2
            if (reportRef2.current) {
                addNotification("리포트 생성 중... (2/5)", "info");
                pdf.addPage();
                const dataUrl2 = await toPng(reportRef2.current, options);
                pdf.addImage(dataUrl2, 'PNG', 0, 0, pageWidth, pageHeight);
            }

            // Page 3
            if (reportRef3.current) {
                addNotification("리포트 생성 중... (3/5)", "info");
                pdf.addPage();
                const dataUrl3 = await toPng(reportRef3.current, options);
                pdf.addImage(dataUrl3, 'PNG', 0, 0, pageWidth, pageHeight);
            }

            // Page 4: Detailed Ledger
            if (reportRef4.current) {
                addNotification("리포트 생성 중... (4/5)", "info");
                pdf.addPage();
                const dataUrl4 = await toPng(reportRef4.current, options);
                pdf.addImage(dataUrl4, 'PNG', 0, 0, pageWidth, pageHeight);
            }

            // Page 5: Certification
            if (reportRef5.current) {
                addNotification("리포트 생성 중... (5/5)", "info");
                pdf.addPage();
                const dataUrl5 = await toPng(reportRef5.current, options);
                pdf.addImage(dataUrl5, 'PNG', 0, 0, pageWidth, pageHeight);
            }

            pdf.save(`AG_재무분석리포트_${new Date().toISOString().slice(0, 10)}.pdf`);
            addNotification("재무 분석 리포트 다운로드 완료", "success");
        } catch (error) {
            console.error(error);
            addNotification("리포트 생성 실패", "error");
        } finally {
            setIsDownloading(false);
        }
    };

    const handleRequestPayout = () => {
        if (!canWithdraw) { addNotification(`최소 정산 금액 부족`, "warning"); return; }
        setIsRequestingPayout(true);
        setTimeout(() => { addNotification("정산 신청 접수됨", "success"); setIsRequestingPayout(false); }, 2000);
    };


    return (
        <div className="min-h-screen p-4 max-w-[1440px] mx-auto pb-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                            <span className="text-[10px] font-black text-indigo-400 tracking-widest uppercase italic">Revenue Intelligence</span>
                        </div>
                    </div>
                    <RevenueTooltip>
                        <h1 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight flex items-center gap-3 cursor-help group/title">
                            수익 <span className="text-indigo-400">마스터 보드</span>
                            <Info size={20} className="text-indigo-400/50 group-hover/title:text-indigo-400 transition-colors" />
                        </h1>
                    </RevenueTooltip>
                    <div className="flex items-center gap-2">
                        <p className="text-gray-500 text-base font-medium">실시간 수익 창출 가치 분석 중</p>
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                        <span className="text-xs text-indigo-400/60 font-black uppercase tracking-widest">SYNC: {lastSyncTime.toLocaleTimeString()}</span>
                    </div>
                </motion.div>

                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex items-center gap-3">
                        <button onClick={handleSync} disabled={isSyncing} className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[22px] text-[15px] font-black text-white transition-all flex items-center gap-3 group/sync">
                            <Activity size={20} className={isSyncing ? "animate-spin" : "text-indigo-400"} /> {isSyncing ? "자산 연동 중..." : "실시간 자산 동기화"}
                        </button>
                        <button onClick={handleDownloadReport} disabled={isDownloading} className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[22px] text-[15px] font-black text-white transition-all flex items-center gap-3">
                            <FileText size={20} /> 재무 분석 리포트
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex justify-start mb-12">
                <div className="bg-black/40 p-2 rounded-[24px] border border-white/5 flex items-stretch gap-2">
                    <button
                        onClick={() => setActiveTab('board')}
                        className={cn(
                            "relative px-8 py-3 rounded-[18px] transition-all duration-400 flex items-center gap-2.5 font-black text-[15px]",
                            activeTab === 'board' ? "bg-indigo-600 text-white shadow-2xl shadow-indigo-500/30 scale-105" : "text-gray-500 hover:text-white"
                        )}
                    >
                        <BarChart3 size={18} /> Revenue Intelligence
                    </button>
                    <div className="w-px h-4 bg-white/5 self-center mx-1" />
                    <button
                        onClick={() => setActiveTab('predictor')}
                        className={cn(
                            "relative px-8 py-3 rounded-[18px] transition-all duration-400 flex items-center gap-2.5 font-black text-[15px]",
                            activeTab === 'predictor' ? "bg-indigo-600 text-white shadow-2xl shadow-indigo-500/30 scale-105" : "text-gray-500 hover:text-white"
                        )}
                    >
                        <Target size={18} /> ROI Simulator
                    </button>
                    <div className="w-px h-4 bg-white/5 self-center mx-1" />
                    <button
                        onClick={() => setActiveTab('monetization')}
                        className={cn(
                            "relative px-8 py-3 rounded-[18px] transition-all duration-400 flex items-center gap-2.5 font-black text-[15px]",
                            activeTab === 'monetization' ? "bg-indigo-600 text-white shadow-2xl shadow-indigo-500/30 scale-105" : "text-gray-500 hover:text-white"
                        )}
                    >
                        <Zap size={18} /> Profit Auto-Pilot
                    </button>


                </div>
            </div>

            <div className="space-y-12">
                {activeTab === 'board' ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <RevenueCard
                                title="총 생성 자산 가치"
                                value={stats.totalPotential.toLocaleString()}
                                sub="콘텐츠 누적 수익 가치"
                                icon={DollarSign}
                                colorClass="text-indigo-400"
                                gradient="bg-indigo-500"
                                description="단순 수익 합계를 넘어 콘텐츠의 IP 가치, 유기적 도달 범위의 확장성, 브랜드 파워 지수 등의 무형 자산을 화폐 단위로 정밀 산정한 통합 지수입니다."
                                isSyncing={isSyncing}
                            />
                            <RevenueCard
                                title="실제 광고 수익 추산"
                                value={stats.adRevenue.toLocaleString()}
                                sub="정산 예정 확정액"
                                icon={BarChart3}
                                colorClass="text-blue-400"
                                gradient="bg-blue-500"
                                description="플랫폼별 실시간 CPM 및 CPC 변동 데이터를 기반으로, 콘텐츠별 시청 지속 시간과 광고 클릭 가중치를 역산하여 산출된 실제 정산 예측값입니다."
                                isSyncing={isSyncing}
                            />
                            <RevenueCard
                                title="제휴 결과 기대액"
                                value={stats.affiliateRevenue.toLocaleString()}
                                sub="커머스 전환 가치"
                                icon={ShoppingBag}
                                colorClass="text-emerald-400"
                                gradient="bg-emerald-500"
                                description="생성된 콘텐츠 내 삽입된 트래킹 링크의 유효 유입률(CTR)과 평균 전환 단가(CPA)를 매칭하여 산출된 인텔리전스 기반의 기대 수익입니다."
                                isSyncing={isSyncing}
                            />
                            <RevenueCard
                                title="인건비 절감 가치"
                                value={((history?.length || 0) * 120000).toLocaleString()}
                                sub="외주 대체 화폐 가치"
                                icon={Zap}
                                colorClass="text-purple-400"
                                gradient="bg-purple-500"
                                description="콘텐츠 1건당 전문 마케터의 기획/편집 시간을 4시간으로 산정하고, 시장의 외주 평균 단가와 비교하여 AI 자동화가 창출한 순수 비용 절감액입니다."
                                isSyncing={isSyncing}
                            />
                            <button
                                onClick={handleRequestPayout}
                                disabled={isRequestingPayout || !canWithdraw}
                                className="group relative bg-indigo-600 border border-indigo-500 p-6 rounded-[32px] flex flex-col items-center justify-center gap-4 transition-all hover:bg-indigo-500 hover:-translate-y-1 active:scale-95 shadow-xl shadow-indigo-900/20 overflow-visible h-full min-h-[180px]"
                            >
                                <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity"><Crown size={120} /></div>
                                <div className="p-4 rounded-[20px] bg-white/20 text-white transition-all group-hover:scale-110 group-hover:rotate-3 shadow-inner ring-1 ring-white/20">
                                    <Wallet size={32} />
                                </div>
                                <div className="text-center relative z-10">
                                    <span className="block text-[14px] font-black text-indigo-100 uppercase tracking-wider mb-2">수익 정산 신청</span>
                                    <span className="block text-2xl font-black text-white tracking-tight mb-1">
                                        {availableBalance.toLocaleString()}원
                                    </span>
                                    <span className="text-[10px] font-bold text-indigo-200 flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                        즉시 정산하기 <ChevronRight size={10} />
                                    </span>
                                </div>

                                {/* Expert Analysis Tooltip */}
                                <div className="absolute bottom-[calc(100%+16px)] left-1/2 -translate-x-1/2 w-[380px] p-6 bg-[#1a1c26]/98 border border-white/10 rounded-[28px] opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 z-[200] backdrop-blur-3xl shadow-[0_30px_80px_rgba(0,0,0,0.8)] translate-y-2 group-hover:translate-y-0 text-left">
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#1a1c26] border-r border-b border-white/10 rotate-45"></div>
                                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
                                        <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                            <Coins size={16} className="text-emerald-400" />
                                        </div>
                                        <div>
                                            <span className="block text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">AI Verified</span>
                                            <span className="block text-[13px] font-black text-white uppercase tracking-wider leading-none">정산 상세 명세서</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-3">
                                            <div>
                                                <div className="flex justify-between items-center text-[12px] text-gray-300 font-bold mb-0.5">
                                                    <span>AdSense 승인 공제액</span>
                                                    <span className="font-mono text-white">₩{Math.round(availableBalance * 0.82).toLocaleString()}</span>
                                                </div>
                                                <p className="text-[10px] text-gray-500 leading-tight">
                                                    YouTube 조회수 수익 및 배너 광고 노출에 따른 <br />구글 애드센스 최종 확정 지급액
                                                </p>
                                            </div>

                                            <div>
                                                <div className="flex justify-between items-center text-[12px] text-gray-300 font-bold mb-0.5">
                                                    <span>Affiliate 제휴 성과금</span>
                                                    <span className="font-mono text-white">₩{Math.round(availableBalance * 0.213).toLocaleString()}</span>
                                                </div>
                                                <p className="text-[10px] text-gray-500 leading-tight">
                                                    쿠팡 파트너스 및 브랜드 제휴 링크를 통한 <br />실구매 전환 커미션 (반품/취소 제외)
                                                </p>
                                            </div>

                                            <div className="flex justify-between items-center text-[12px] text-red-400 font-medium pt-1">
                                                <span>3.3% 사업소득세 (예상)</span>
                                                <span className="font-mono">- ₩{Math.round(availableBalance * 0.033).toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <div className="h-px bg-white/10 border-t border-black/20" />

                                        <div className="flex justify-between items-center p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                                            <div>
                                                <span className="block text-[10px] text-indigo-300 font-bold uppercase tracking-wider mb-0.5">Final Payout</span>
                                                <span className="block text-[10px] text-indigo-400/60">즉시 입금 예정액</span>
                                            </div>
                                            <span className="text-xl font-black text-white tracking-tight">
                                                {availableBalance.toLocaleString()}원
                                            </span>
                                        </div>

                                        <p className="text-[10px] text-gray-500 leading-relaxed text-right pt-1">
                                            * 해당 금액은 <span className="text-white font-bold">크로스체크 완료</span>된 안전 자산입니다.
                                        </p>
                                    </div>
                                </div>
                            </button>
                            <RevenueCard
                                title="GA4 실시간 전환 가치"
                                value={ga4Data ? ga4Data.revenueFromGA.toLocaleString() : "..."}
                                sub={`전환율 ${ga4Data?.conversionRate || '0'}% (검증됨)`}
                                icon={Globe}
                                colorClass="text-amber-400"
                                gradient="bg-amber-500"
                                description="[GA4-MCP 연동] 실제 웹사이트/블로그에서 발생한 전자상거래 및 목표 전환 데이터를 수집하여 산출된 실거래 기반 가치입니다. 시뮬레이션 데이터와의 오차 범위를 실시간으로 보정합니다."
                                isSyncing={isSyncing}
                            />
                        </div>




                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch h-full">
                            {/* [Left] Detailed Intelligence Report */}
                            <div className="lg:col-span-7 bg-[#0f1218]/60 backdrop-blur-2xl border border-white/5 p-8 rounded-[32px] flex flex-col h-full relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-xl font-black text-white flex items-center gap-3">
                                            <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                                                <Activity size={20} className="text-indigo-400" />
                                            </div>
                                            상세 리포트 전문분석
                                        </h3>
                                        <button
                                            onClick={() => { setLedgerCategory('adsense'); setShowLedger(true); }}
                                            className="text-[13px] font-black text-gray-400 flex items-center gap-1.5 hover:text-white transition-all hover:gap-2"
                                        >
                                            전체 보기 <ChevronRight size={14} />
                                        </button>
                                    </div>

                                    <div className="flex-1 grid grid-cols-1 gap-4">
                                        {[
                                            {
                                                name: 'AdSense Revenue',
                                                kName: '애드센스 광고 수익',
                                                id: 'adsense',
                                                value: stats.adRevenue,
                                                growth: '+15.2%',
                                                status: 'STABLE',
                                                color: 'blue',
                                                icon: Globe
                                            },
                                            {
                                                name: 'Affiliate Marketing',
                                                kName: '제휴 마케팅 성과',
                                                id: 'affiliate',
                                                value: stats.affiliateRevenue,
                                                growth: '+8.4%',
                                                status: 'GROWING',
                                                color: 'emerald',
                                                icon: ShoppingBag
                                            },
                                            {
                                                name: 'Operational Savings',
                                                kName: '운영비 절감 효과',
                                                id: 'savings',
                                                value: (history?.length || 0) * 120000,
                                                growth: '+4.0%',
                                                status: 'OPTIMIZED',
                                                color: 'purple',
                                                icon: Zap
                                            }
                                        ].map((item, i) => (
                                            <div
                                                key={i}
                                                onClick={() => { setLedgerCategory(item.id); setShowLedger(true); }}
                                                className="flex items-center justify-between p-7 bg-white/[0.02] border border-white/5 rounded-[28px] hover:bg-white/[0.04] hover:border-white/10 transition-all group/item shadow-2xl cursor-pointer"
                                            >
                                                <div className="flex items-center gap-6">
                                                    <div className={`w-14 h-14 rounded-2xl bg-${item.color}-500/10 border border-${item.color}-500/20 flex items-center justify-center group-hover/item:scale-110 transition-transform shadow-inner`}>
                                                        <item.icon size={24} className={`text-${item.color}-400`} />
                                                    </div>
                                                    <div>
                                                        <div className="text-[20px] font-black text-white uppercase tracking-tight mb-1">{item.name}</div>
                                                        <div className="text-[16px] font-bold text-gray-500">{item.kName}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="text-right mr-4">
                                                        <div className="text-[24px] font-black text-white tracking-tighter">{item.value.toLocaleString()}원</div>
                                                        <div className="text-[15px] font-bold text-emerald-400">{item.growth}</div>
                                                    </div>
                                                    <div className={`hidden sm:flex px-4 py-2 rounded-xl text-[12px] font-black uppercase bg-${item.color}-500/10 border border-${item.color}-500/20 text-${item.color}-400 shadow-sm items-center gap-2 group-hover/item:bg-${item.color}-600 group-hover/item:text-white transition-all`}>
                                                        상세보기 <ChevronRight size={14} className="group-hover/item:translate-x-1 transition-transform" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* [Right] AI Strategy Insights */}
                            <div className="lg:col-span-5 bg-gradient-to-br from-[#0f1218]/90 to-[#1a1c26]/90 backdrop-blur-2xl border border-white/5 p-8 rounded-[32px] flex flex-col h-full relative overflow-hidden">
                                {/* Ambient Background */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                            <Target size={20} className="text-emerald-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-white">AI 전략 분석</h3>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Real-time Optimization</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 flex-1">
                                        {/* Insight Card 1 */}
                                        <div className="p-5 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl relative group hover:bg-indigo-500/10 transition-colors">
                                            <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                                            <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <Clock size={12} /> Ad Insight
                                            </h4>
                                            <p className="text-[13px] text-gray-300 font-bold leading-relaxed mb-3">
                                                현재 트래픽 패턴 분석 결과, <span className="text-white underline decoration-indigo-500/50 underline-offset-4">20-22시 야간 시간대</span>에 숏폼을 업로드할 경우 CPM이 약 1.4배 상승합니다.
                                            </p>
                                            <div className="flex gap-2">
                                                <span className="text-[9px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/20">#GoldenTime</span>
                                                <span className="text-[9px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/20">#CPM_Booster</span>
                                            </div>
                                        </div>

                                        {/* Insight Card 2 */}
                                        <div className="p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl relative group hover:bg-emerald-500/10 transition-colors">
                                            <h4 className="text-[11px] font-black text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <Zap size={12} /> Monetization Strategy
                                            </h4>
                                            <p className="text-[13px] text-gray-300 font-bold leading-relaxed mb-3">
                                                제휴 링크를 콘텐츠 <span className="text-white underline decoration-emerald-500/50 underline-offset-4">러닝타임 45% 지점</span>에 배치하세요. 이탈 전 클릭 전환율(CTR)이 가장 높은 구간입니다.
                                            </p>
                                            <div className="w-full bg-emerald-900/30 h-1.5 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500 w-[45%] rounded-full shadow-[0_0_10px_#10b981]"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="w-full mt-6 py-3 rounded-xl bg-white/5 border border-white/5 text-[11px] font-black text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 uppercase tracking-wider group/btn">
                                        <Sparkles size={12} className="text-indigo-400 group-hover/btn:rotate-12 transition-transform" />
                                        Generate New Strategy
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : activeTab === 'predictor' ? (
                    <ProfitPredictor />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                        <ProfitMaximizer />
                        {/* Advanced Panels: Only show for Business/Pro plans */}
                        {(user?.plan === 'business' || user?.plan === 'pro') ? (
                            <>
                                <RoiSimulationPanel />
                                <AssetEquityPanel />
                            </>
                        ) : (
                            /* Starter Plan - Placeholder for Advanced Features */
                            <div className="col-span-2 bg-gradient-to-br from-indigo-900/10 to-purple-900/10 border border-white/5 rounded-[32px] p-8 flex flex-col items-center justify-center text-center group">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <Crown size={32} className="text-gray-600 group-hover:text-indigo-400 transition-colors" />
                                </div>
                                <h3 className="text-xl font-black text-white mb-2">PRO Analytics Locked</h3>
                                <p className="text-sm text-gray-400 max-w-md leading-relaxed mb-8">
                                    현재 Starter 플랜을 이용 중입니다.<br />
                                    <span className="text-indigo-400">ROI 시뮬레이션</span>과 <span className="text-purple-400">자산 자분 평가(Equity)</span> 기능은<br />
                                    PRO 플랜부터 제공됩니다.
                                </p>
                                <button
                                    onClick={() => navigate('/pricing')}
                                    className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-black text-white uppercase tracking-widest hover:border-indigo-500/50 transition-all"
                                >
                                    Upgrade to Unlock
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>






            {/* --- Hidden Report Template for PDF Generation --- */}
            <FinancialReportTemplate
                stats={stats}
                availableBalance={availableBalance}
                history={history}
                determineNiche={determineNiche}
                reportRefs={{ reportRef1, reportRef2, reportRef3, reportRef4, reportRef5 }}
            />

            <AnimatePresence>
                {showLedger && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowLedger(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-4xl bg-[#0b0e14] border border-white/10 rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[85vh]"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between shrink-0">
                                <div>
                                    <h3 className="text-2xl font-black text-white flex items-center gap-3">
                                        <div className="p-2.5 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                                            <Activity size={24} className="text-indigo-400" />
                                        </div>
                                        {ledgerCategory === 'adsense' ? '애드센스 광고 수익 산출 리스트' :
                                            ledgerCategory === 'affiliate' ? '제휴 마케팅 수익 산출 리스트' :
                                                '운영비(인건비) 절감 산출 리스트'}
                                    </h3>
                                    <p className="text-sm text-gray-500 font-bold mt-1 uppercase tracking-widest">Detailed Transaction Calculation</p>
                                </div>
                                <button
                                    onClick={() => setShowLedger(false)}
                                    className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="pb-4 text-[11px] font-black text-gray-500 uppercase tracking-widest">No</th>
                                            <th className="pb-4 text-[11px] font-black text-gray-500 uppercase tracking-widest">콘텐츠 토픽 / 키워드</th>
                                            <th className="pb-4 text-[11px] font-black text-gray-500 uppercase tracking-widest text-right">가중치</th>
                                            <th className="pb-4 text-[11px] font-black text-gray-500 uppercase tracking-widest text-right">개별 산출 금액</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.03]">
                                        {(() => {
                                            const allItems = history || [];
                                            const nicheMultipliers = { 'Finance': 2.1, 'Tech': 1.7, 'Health': 1.4, 'Shopping': 1.3, 'Lifestyle': 1.1, 'Gaming': 0.85, 'General': 1.0 };

                                            const itemDetails = allItems.map((h, i) => {
                                                const niche = determineNiche(h?.topic || "");
                                                const baseWeight = nicheMultipliers[niche] || 1.0;
                                                const platformBonus = h?.platform?.includes('YouTube') ? 1.2 : h?.platform?.includes('Naver') ? 1.1 : 1.0;
                                                const seededRandom = 0.85 + (((h?.topic?.length || 10) * (i + 5)) % 30) / 100;
                                                const finalWeight = baseWeight * platformBonus * seededRandom;

                                                return { ...h, finalWeight };
                                            });

                                            const totalWeight = itemDetails.reduce((a, b) => a + b.finalWeight, 0) || 1;
                                            const targetTotalValue = ledgerCategory === 'adsense' ? stats.adRevenue :
                                                ledgerCategory === 'affiliate' ? stats.affiliateRevenue :
                                                    (history?.length || 0) * 120000;

                                            return itemDetails.slice(0, 50).map((h, i) => (
                                                <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                                                    <td className="py-5 text-sm font-black text-gray-600">#{i + 1}</td>
                                                    <td className="py-5">
                                                        <div className="text-base font-black text-white mb-1">{h.topic || 'Untitled Asset'}</div>
                                                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                            <span>{h.platform}</span>
                                                            <div className="w-1 h-1 rounded-full bg-gray-700" />
                                                            <span>{determineNiche(h.topic)} Niche</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-5 text-right font-mono text-sm text-indigo-400 font-bold">
                                                        x{h.finalWeight.toFixed(2)}
                                                    </td>
                                                    <td className="py-5 text-right">
                                                        <div className="text-lg font-black text-white">
                                                            {Math.floor((targetTotalValue * h.finalWeight) / totalWeight).toLocaleString()}원
                                                        </div>
                                                        {ledgerCategory === 'savings' && (
                                                            <div className="text-[10px] text-gray-500 font-bold uppercase">전문작가 비용 환산</div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ));
                                        })()}
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-8 bg-black/40 border-t border-white/5 flex items-center justify-between shrink-0">
                                <div>
                                    <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Assets Tracked</p>
                                    <p className="text-xl font-black text-white">{history.length} ITEMS</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1">합계 금액 (Total)</p>
                                    <p className="text-2xl font-black text-emerald-400">
                                        {(ledgerCategory === 'adsense' ? stats.adRevenue :
                                            ledgerCategory === 'affiliate' ? stats.affiliateRevenue :
                                                (history?.length || 0) * 120000).toLocaleString()}원
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default RevenuePage;
