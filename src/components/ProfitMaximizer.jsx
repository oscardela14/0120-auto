import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Zap, RefreshCw, MessageSquareQuote, FileSignature, TrendingUp, Handshake, ChevronRight, Sparkles, Scan, Search, Mail, CheckCircle2, Link, ArrowRight, Loader2 } from 'lucide-react';

export const ProfitMaximizer = ({ content, insights, onUpdate }) => {
    const [activeTab, setActiveTab] = useState('affiliate'); // affiliate, sponsor

    // Affiliate States
    const [scanStatus, setScanStatus] = useState('idle'); // idle, scanning, complete
    const [injectedLinks, setInjectedLinks] = useState([]);

    // Sponsor States
    const [sponsorStatus, setSponsorStatus] = useState('idle'); // idle, searching, complete
    const [matchedSponsors, setMatchedSponsors] = useState([]);
    const [draftingEmail, setDraftingEmail] = useState(null);

    // Mock scanning for Affiliate Links
    const handleScanContent = () => {
        setScanStatus('scanning');
        setTimeout(() => {
            setInjectedLinks([
                { id: 1, keyword: "게이밍 마우스", product: "Logitech G Pro X", price: "169,000", commission: "3%" },
                { id: 2, keyword: "노이즈 캔슬링", product: "Sony WH-1000XM5", price: "459,000", commission: "4%" },
                { id: 3, keyword: "데스크테리어", product: "Philips Hue Play", price: "79,000", commission: "5%" }
            ]);
            setScanStatus('complete');
        }, 2000);
    };

    // Mock searching for Sponsors
    const handleFindSponsors = () => {
        setSponsorStatus('searching');
        setTimeout(() => {
            setMatchedSponsors([
                { id: 1, name: "Logitech Korea", matchScore: 98, role: "Gaming Gear", budget: "₩3M+" },
                { id: 2, name: "Desker", matchScore: 85, role: "Furniture", budget: "₩2M+" },
                { id: 3, name: "Elgato", matchScore: 92, role: "Streaming", budget: "Product" }
            ]);
            setSponsorStatus('complete');
        }, 2500);
    };

    return (
        <div className="bg-[#0f1218] border border-white/5 rounded-[32px] overflow-visible group h-full flex flex-col shadow-xl">
            {/* Header */}
            <div className="px-6 py-5 bg-white/[0.02] border-b border-white/5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-indigo-500/20 rounded-xl border border-white/5">
                        <DollarSign size={18} className="text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-wider">자동 수익화 엔진 (Auto-Pilot)</h3>
                        <p className="text-[10px] text-gray-500 font-bold">Zero Gravity Revenue Engine</p>
                    </div>
                </div>
                <div className="flex gap-1 bg-black/40 p-1 rounded-full border border-white/5">
                    {[
                        { id: 'affiliate', icon: Link, label: '스마트 링크' },
                        { id: 'sponsor', icon: Handshake, label: '스폰서 매칭' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-500 hover:text-white'} `}
                        >
                            <tab.icon size={12} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-6 flex-1 bg-gradient-to-b from-[#0f1218] to-black/40 flex flex-col">
                <AnimatePresence mode="wait">
                    {/* --- TAB 1: SMART AFFILIATE LINKS --- */}
                    {activeTab === 'affiliate' && (
                        <motion.div
                            key="tab-affiliate"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="flex-1 flex flex-col h-full"
                        >
                            <div className="flex-1 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6 relative overflow-hidden flex flex-col">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[40px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

                                {/* Top Section: Info (Left) + Action Button (Right) */}
                                <div className="flex items-start justify-between gap-4 mb-6 relative z-10">
                                    <div className="flex-1">
                                        <h4 className="text-sm font-black text-white mb-2">스마트 링크 인젝션 (Smart Link Injection)</h4>
                                        <p className="text-xs text-gray-400 leading-relaxed pr-2">
                                            AI가 본문의 문맥을 분석하여, 클릭 전환율(CTR)이 가장 높은 키워드에 <span className="text-emerald-400 font-bold">고수익 제휴 링크</span>를 자동으로 매핑합니다.
                                        </p>
                                    </div>

                                    {/* Image Button Smart Link */}
                                    {scanStatus === 'idle' && (
                                        <button
                                            onClick={handleScanContent}
                                            className="w-24 h-24 shrink-0 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 shadow-xl shadow-emerald-900/40 flex flex-col items-center justify-center gap-2 group/btn hover:scale-105 hover:shadow-emerald-600/50 transition-all border border-white/10 relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                            <div className="p-2 bg-white/20 rounded-full">
                                                <Scan size={20} className="text-white group-hover/btn:rotate-180 transition-transform duration-500" />
                                            </div>
                                            <span className="text-[10px] font-black text-white leading-tight text-center px-1">스마트<br />스캔</span>
                                        </button>
                                    )}
                                </div>

                                {/* Bottom Section: Content Area */}
                                <div className="flex-1 flex flex-col justify-center relative z-10 bg-black/20 rounded-xl border border-white/5 p-4 min-h-[140px]">
                                    {scanStatus === 'idle' ? (
                                        <div className="flex flex-col items-center justify-center text-center h-full text-gray-500 gap-2">
                                            <Link size={24} className="opacity-20" />
                                            <p className="text-[11px] font-bold">우측 버튼을 눌러 링크 매핑을 시작하세요.</p>
                                        </div>
                                    ) : scanStatus === 'scanning' ? (
                                        <div className="flex flex-col items-center justify-center gap-4 h-full">
                                            <Loader2 size={32} className="text-emerald-500 animate-spin" />
                                            <span className="text-sm font-bold text-gray-400 animate-pulse">고수익 키워드 분석 중...</span>
                                        </div>
                                    ) : (
                                        <div className="space-y-3 w-full h-full overflow-y-auto pr-1 custom-scrollbar">
                                            <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 sticky top-0 bg-[#0f1218] py-1 z-10">
                                                <span>발견된 수익 기회</span>
                                                <span className="text-emerald-400">3건 매칭됨</span>
                                            </div>
                                            {injectedLinks.map((link, i) => (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    key={link.id}
                                                    className="bg-black/40 border border-white/5 p-3 rounded-xl flex items-center justify-between group/link hover:border-emerald-500/30 transition-all"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-black text-xs">
                                                            {i + 1}
                                                        </div>
                                                        <div>
                                                            <div className="text-[13px] font-bold text-white group-hover/link:text-emerald-400 transition-colors">
                                                                {link.keyword}
                                                            </div>
                                                            <div className="text-[10px] text-gray-500 flex items-center gap-1">
                                                                <ArrowRight size={8} /> {link.product}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-[13px] font-black text-white">{link.commission}</div>
                                                        <div className="text-[9px] text-gray-500 font-bold">수수료</div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                            <button className="w-full mt-4 py-3 bg-white text-black text-xs font-black rounded-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/10">
                                                <CheckCircle2 size={14} />
                                                모든 링크 한 번에 적용하기
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* --- TAB 2: SPONSOR SCOUT --- */}
                    {activeTab === 'sponsor' && (
                        <motion.div
                            key="tab-sponsor"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="flex-1 flex flex-col h-full"
                        >
                            <div className="flex-1 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-6 relative overflow-hidden flex flex-col">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[40px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

                                {/* Top Section: Info (Left) + Action Button (Right) */}
                                <div className="flex items-start justify-between gap-4 mb-6 relative z-10">
                                    <div className="flex-1">
                                        <h4 className="text-sm font-black text-white mb-2">AI 스폰서 스카우트</h4>
                                        <p className="text-xs text-gray-400 leading-relaxed pr-2">
                                            콘텐츠의 주제와 트래픽 퀄리티를 분석하여, 가장 적합한 브랜드 스폰서(광고주)를 매칭하고 <span className="text-indigo-400 font-bold">제안서 이메일</span>까지 자동 작성합니다.
                                        </p>
                                    </div>

                                    {/* Image Button Style for Idle State */}
                                    {sponsorStatus === 'idle' && (
                                        <button
                                            onClick={handleFindSponsors}
                                            className="w-24 h-24 shrink-0 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 shadow-xl shadow-indigo-900/40 flex flex-col items-center justify-center gap-2 group/btn hover:scale-105 hover:shadow-indigo-600/50 transition-all border border-white/10 relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                            <div className="p-2 bg-white/20 rounded-full">
                                                <Search size={20} className="text-white" />
                                            </div>
                                            <span className="text-[10px] font-black text-white leading-tight text-center px-1">스폰서<br />찾기</span>
                                        </button>
                                    )}
                                </div>

                                {/* Bottom Section: Content Area (Loader or Results) */}
                                <div className="flex-1 flex flex-col justify-center relative z-10 bg-black/20 rounded-xl border border-white/5 p-4 min-h-[140px]">
                                    {sponsorStatus === 'idle' ? (
                                        <div className="flex flex-col items-center justify-center text-center h-full text-gray-500 gap-2">
                                            <Handshake size={24} className="opacity-20" />
                                            <p className="text-[11px] font-bold">우측 버튼을 눌러 스폰서 매칭을 시작하세요.</p>
                                        </div>
                                    ) : sponsorStatus === 'searching' ? (
                                        <div className="flex flex-col items-center justify-center gap-4 h-full">
                                            <Loader2 size={32} className="text-indigo-500 animate-spin" />
                                            <span className="text-sm font-bold text-gray-400 animate-pulse">최적 브랜드 매칭 분석 중...</span>
                                        </div>
                                    ) : (
                                        <div className="space-y-3 w-full h-full overflow-y-auto pr-1 custom-scrollbar">
                                            <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 sticky top-0 bg-[#0f1218] py-1 z-10">
                                                <span>상위 3개 추천 브랜드</span>
                                                <span className="text-indigo-400">매칭 정확도 높음</span>
                                            </div>
                                            {matchedSponsors.map((brand, i) => (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    key={brand.id}
                                                    className="bg-black/40 border border-white/5 p-3 rounded-xl hover:border-indigo-500/30 transition-all group/item"
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div>
                                                            <div className="text-[13px] font-black text-white">{brand.name}</div>
                                                            <div className="text-[10px] text-gray-500">{brand.role}</div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-[13px] font-black text-indigo-400">{brand.matchScore}%</div>
                                                            <div className="text-[9px] text-gray-500 font-bold">일치</div>
                                                        </div>
                                                    </div>

                                                    {draftingEmail === brand.id ? (
                                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-white/5 rounded-lg p-3 text-[10px] text-gray-300 font-mono leading-relaxed border border-white/10">
                                                            To: partnerships@{brand.name.toLowerCase().replace(" ", "")}.com<br />
                                                            Subject: Partnership Proposal w/ Anti-Gravity<br /><br />
                                                            Dear {brand.name} Team,<br />
                                                            귀사의 브랜드와 98.4% 일치하는 트래픽을 보유...<br />
                                                            <button className="mt-2 w-full py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-500">지금 전송하기</button>
                                                        </motion.div>
                                                    ) : (
                                                        <button
                                                            onClick={() => setDraftingEmail(brand.id)}
                                                            className="w-full py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-[10px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 border border-indigo-500/20"
                                                        >
                                                            <Mail size={12} /> 제안서 자동 작성
                                                        </button>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
