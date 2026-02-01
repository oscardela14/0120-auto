import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Sparkles, Zap, Loader, TrendingUp, ShieldAlert, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const ContentCard = ({ children, className = "" }) => (
    <div className={`bg-surface/30 border border-white/10 rounded-2xl p-6 ${className}`}>
        {children}
    </div>
);



export const AnalyzerView = () => {
    const { activeResult, user, addNotification } = useUser();
    const navigate = useNavigate();

    // Mock or extract data from activeResult
    const data = activeResult ? {
        ...activeResult,
        seoScore: activeResult.seoScore || { score: 78, status: 'yellow', details: { ai: 35, structure: 25, trend: 18 }, feedback: ["제목에 핵심 키워드를 전진 배치하세요."] },
        abVariants: activeResult.abVariants || [
            { id: 'A', strategy: 'Emotional Hook', viralScore: 92, ctr: '12.4%', title: activeResult.title || '제목 없음', scoreDetails: { ai: 45, structure: 28, trend: 19 } },
            { id: 'B', strategy: 'Direct Value', viralScore: 84, ctr: '8.2%', title: activeResult.titleB || 'B안 제목 없음', scoreDetails: { ai: 38, structure: 26, trend: 20 } }
        ],
        safetyData: activeResult.safetyData || { score: 98, status: 'safe' },
        suitabilityData: activeResult.suitabilityData || { score: 92, status: 'high' }
    } : {
        seoScore: { score: 78, status: 'yellow', details: { ai: 35, structure: 25, trend: 18 }, feedback: ["제목에 핵심 키워드를 전진 배치하세요."] },
        abVariants: [
            { id: 'A', strategy: 'Emotional Hook', viralScore: 92, ctr: '12.4%', title: '충격! 지금까지 몰랐던 다이어트의 진실', scoreDetails: { ai: 45, structure: 28, trend: 19 } },
            { id: 'B', strategy: 'Direct Value', viralScore: 84, ctr: '8.2%', title: '일주일에 3kg 감량하는 현실적인 루틴', scoreDetails: { ai: 38, structure: 26, trend: 20 } }
        ],
        safetyData: { score: 98, status: 'safe' },
        suitabilityData: { score: 92, status: 'high' }
    };

    const [selectedVariant, setSelectedVariant] = useState('A');
    const [isOptimizingSEO, setIsOptimizingSEO] = useState(false);
    const [reengineeredData, setReengineeredData] = useState(null);

    const handleReengineering = () => {
        setIsOptimizingSEO(true);
        addNotification("알고리즘 뉴럴 패턴 분석 가동 중... 잠재적 바이럴 경로를 추적합니다.", "info");
        setTimeout(() => {
            setIsOptimizingSEO(false);
            // Simulate visual changes in metrics
            setReengineeredData({
                hookPower: Math.min(100, 90 + Math.floor(Math.random() * 10)),
                retention: Math.min(100, 80 + Math.floor(Math.random() * 15)),
                viralPotential: Math.min(100, 75 + Math.floor(Math.random() * 20)),
                keywordSaturation: Math.min(100, 85 + Math.floor(Math.random() * 10)),
                semanticDensity: Math.min(100, 70 + Math.floor(Math.random() * 20))
            });
            addNotification("로직 재설계(Re-Engineering) 완료! 바이럴 임계점 돌파 확률이 96%로 재산정되었습니다.", "success");
        }, 2500);
    };

    const handleExportRaw = () => {
        if (!activeResult) return;

        const rawData = {
            metadata: {
                target_platform: activeResult.platform,
                analysis_version: "v4.0.2 (Antigravity Edition)",
                timestamp: new Date().toISOString()
            },
            analysis_metrics: {
                keywords: data.seoScore,
                ab_test_variants: data.abVariants,
                neural_patterns: reengineeredData || {
                    hookPower: 98,
                    retention: 84,
                    viralPotential: 72
                }
            },
            reconstruction_logic: [
                "초반 3초 공유 유도 가중치 상향",
                "LSI 키워드 클러스터링 기반 문장 재배열",
                "감정적 트리거 단어 빈도 최적화"
            ]
        };

        const jsonString = JSON.stringify(rawData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `SEO_ANALYTICS_RAW_${activeResult.id || Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        addNotification("RAW 서버 데이터 파일(JSON)이 다운로드 폴더로 추출되었습니다.", "success");
    };

    if (!activeResult) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                <BarChart3 size={64} className="text-gray-700 mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2">분석할 데이터가 없습니다</h2>
                <p className="text-gray-500 mb-8">콘텐츠 스튜디오에서 먼저 콘텐츠를 생성하거나<br />보관함에서 항목을 선택해주세요.</p>
                <button onClick={() => navigate('/studio')} className="px-6 py-3 bg-primary text-white font-bold rounded-xl">스튜디오로 이동</button>
            </div>
        );
    }

    return (
        <div className="max-w-[1440px] mx-auto p-6 md:p-8 space-y-8">
            <header className="mb-8">
                <h1 className="text-3xl font-black text-white flex items-center gap-3">
                    <BarChart3 className="text-indigo-400" size={32} />
                    AI 정밀 분석 센터
                </h1>
                <p className="text-gray-400 mt-2">알고리즘 적합성과 SEO 데이터를 실시간으로 시뮬레이션합니다.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* [LEFT] Social SEO High-Resolution Scouter */}
                <div className="lg:col-span-4 space-y-8">
                    <ContentCard className="relative overflow-hidden group border-cyan-500/20 bg-cyan-500/5">
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full" />
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Search size={20} className="text-cyan-400" />
                                SEO Scouter
                            </h3>
                            <div className="px-2 py-0.5 bg-cyan-500 text-black text-[10px] font-black rounded uppercase">Ultra Res</div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                <span className="text-[10px] text-gray-500 font-bold uppercase block mb-3">Keyword Saturation</span>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-cyan-500 transition-all duration-1000" style={{ width: `${reengineeredData?.keywordSaturation || 82.4}%` }} />
                                    </div>
                                    <span className="text-xs font-black text-cyan-400">{reengineeredData?.keywordSaturation || 82.4}%</span>
                                </div>
                            </div>
                            <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                <span className="text-[10px] text-gray-500 font-bold uppercase block mb-3">Semantic Density</span>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500 transition-all duration-1000" style={{ width: `${reengineeredData?.semanticDensity || 65.1}%` }} />
                                    </div>
                                    <span className="text-xs font-black text-purple-400">{reengineeredData?.semanticDensity || 65.1}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-cyan-400/5 border border-cyan-400/10 rounded-xl">
                            <p className="text-[11px] text-gray-400 leading-relaxed italic">
                                "현재 검색 트렌드 대비 <span className="text-cyan-400 font-bold">LSI(잠재적 의미 분석)</span> 키워드가 12개 추가로 감지되었습니다. 본문에 자연스럽게 녹일 경우 도달 범위가 34% 증가할 것으로 예측됩니다."
                            </p>
                        </div>
                    </ContentCard>

                    <ContentCard className="bg-red-500/5 border-red-500/20 relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-4">
                            <ShieldAlert size={20} className="text-red-500" />
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">Algorithm Guardrail</h3>
                        </div>
                        <div className="space-y-3">
                            {['유해성 검사', '저작권 필터', '선정성/광고성'].map((item) => (
                                <div key={item} className="p-3 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-gray-400">{item}</span>
                                    <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[9px] font-black rounded uppercase">Clear</span>
                                </div>
                            ))}
                        </div>
                    </ContentCard>
                </div>

                {/* [RIGHT] Algorithm Reverse-Engineering Center */}
                <div className="lg:col-span-8">
                    <div className="h-full bg-[#050510] border border-white/10 rounded-[32px] overflow-hidden flex flex-col relative group">
                        {/* Static Grid Lines Overlay */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                        <div className="p-8 border-b border-white/5 flex items-center justify-between relative z-10">
                            <div>
                                <h3 className="text-2xl font-black text-white flex items-center gap-3">
                                    <Zap size={24} className="text-yellow-400 animate-pulse" />
                                    ALGORITHM <span className="text-yellow-400">REVERSE-ENGINEERING</span>
                                </h3>
                                <p className="text-[11px] text-gray-500 font-bold mt-1 uppercase tracking-widest">Neural Pattern Mapping v4.0</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <span className="text-[10px] text-gray-600 block font-black uppercase">Sync Speed</span>
                                    <span className="text-xs font-mono text-yellow-500">0.12ms</span>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center">
                                    <TrendingUp size={24} className="text-yellow-400" />
                                </div>
                            </div>
                        </div>

                        <div className="p-8 flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[11px] font-black uppercase text-gray-400 px-1">
                                        <span>Initial Hook Power</span>
                                        <span className="text-yellow-400">{reengineeredData?.hookPower || 98}/100</span>
                                    </div>
                                    <div className="h-4 bg-white/5 rounded-lg border border-white/5 overflow-hidden flex p-1">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${reengineeredData?.hookPower || 98}%` }} className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-sm shadow-[0_0_15px_rgba(250,204,21,0.3)] transition-all duration-1000" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[11px] font-black uppercase text-gray-400 px-1">
                                        <span>Retention Continuity</span>
                                        <span className="text-blue-400">{reengineeredData?.retention || 84}/100</span>
                                    </div>
                                    <div className="h-4 bg-white/5 rounded-lg border border-white/5 overflow-hidden flex p-1">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${reengineeredData?.retention || 84}%` }} className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-sm shadow-[0_0_15px_rgba(96,165,250,0.3)] transition-all duration-1000" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[11px] font-black uppercase text-gray-400 px-1">
                                        <span>Viral Potential Gate</span>
                                        <span className="text-purple-400">{reengineeredData ? `${reengineeredData.viralPotential}% Unlocked` : 'Locked (Target Found)'}</span>
                                    </div>
                                    <div className="h-4 bg-white/5 rounded-lg border border-white/5 overflow-hidden flex p-1">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${reengineeredData?.viralPotential || 72}%` }} className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-sm shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all duration-1000" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-black/60 rounded-3xl border border-white/10 p-6 flex flex-col">
                                <div className="flex items-center gap-2 text-yellow-400 mb-4">
                                    <Sparkles size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Logic Reconstruction</span>
                                </div>
                                <p className="text-xs text-gray-400 leading-relaxed font-medium mb-6">
                                    "현재 알고리즘은 <span className="text-white">시청 지속 시간</span>보다 <span className="text-yellow-400">초반 3초의 공유 유도액션</span>에 더 높은 가중치를 부여합니다. 제목의 두 번째 어절을 더 강렬한 단어로 교체할 것을 추천합니다."
                                </p>
                                <div className="mt-auto space-y-3">
                                    <button
                                        onClick={handleReengineering}
                                        disabled={isOptimizingSEO}
                                        className="w-full py-4 bg-yellow-400 text-black text-[13px] font-black rounded-2xl hover:bg-yellow-300 transition-all flex items-center justify-center gap-2 uppercase tracking-tighter disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isOptimizingSEO ? <Loader className="animate-spin" size={16} /> : <Zap size={16} />}
                                        {isOptimizingSEO ? "재설계 패턴 생성 중..." : "AI Logic Re-Engineering 실행"}
                                    </button>
                                    <button
                                        onClick={handleExportRaw}
                                        className="w-full py-4 bg-white/5 text-gray-500 text-[11px] font-black rounded-2xl hover:bg-white/10 transition-all uppercase tracking-widest"
                                    >
                                        Export Raw Pattern Data
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Ticking Ticker */}
                        <div className="bg-yellow-400/5 py-3 px-8 border-t border-yellow-400/10 flex overflow-hidden">
                            <div className="flex items-center gap-8 animate-marquee whitespace-nowrap text-[9px] font-mono text-yellow-500/60 uppercase font-black">
                                <span>[PATTERN_DETECTED] 2030_MALE_HIGH_RETENTION</span>
                                <span>[SIGNAL] 0.435_AB_VARIANT_MATCH</span>
                                <span>[RECONSTRUCTION] PENDING_FINAL_APPROVAL</span>
                                <span>[LOGIC] REVERSE_SEO_BOOT_COMPLETE</span>
                                <span>[TARGET] VIRAL_THRESHOLD_CROSSED</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

