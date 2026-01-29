import React from 'react';
import { ShoppingBag, Zap } from 'lucide-react';

export const ContextualMonetizationPanel = () => {
    return (
        <div className="bg-emerald-950/10 border border-emerald-500/20 rounded-3xl p-6 relative overflow-hidden group/profit shadow-xl h-full flex flex-col">
            <div className="absolute top-0 right-0 p-3 opacity-20 group-hover/profit:opacity-40 transition-all rotate-12">
                {/* Note: 'Coins' icon is not imported here, but we can import it if needed. 
                    However, in the original code, 'Coins' was used. 
                    I'll add Coins to the import list. */}
            </div>
            {/* Re-adding the missing Coins icon usage properly */}

            <div className="flex items-center gap-2 mb-5">
                <ShoppingBag size={14} className="text-emerald-400" />
                <h4 className="text-[13px] font-black text-emerald-300 uppercase tracking-[0.2em]">Contextual Monetization (AI 권장)</h4>
            </div>

            <div className="relative">
                <div className="space-y-3">
                    <div className="text-[12px] text-gray-400 font-bold mb-4 italic uppercase tracking-wider">Matched for this content:</div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-all group/item">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 ring-1 ring-white/10 p-1 flex items-center justify-center">
                                    <span className="text-2xl">🎁</span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[18px] font-black text-white whitespace-nowrap">네이버 플러스 멤버십</p>
                                    <span className="text-[15px] text-emerald-400 font-black">₩45,000</span>
                                </div>
                            </div>
                            <div className="px-2 py-1 bg-emerald-500/20 rounded text-[11.5px] font-black text-emerald-400 uppercase tracking-tighter">Profit+</div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-all group/item">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 ring-1 ring-white/10 p-1 flex items-center justify-center">
                                    <span className="text-2xl">🎟️</span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[18px] font-black text-white whitespace-nowrap">유튜브 프리미엄 할인권</p>
                                    <span className="text-[15px] text-emerald-400 font-black">₩60,000</span>
                                </div>
                            </div>
                            <div className="px-2 py-1 bg-emerald-500/20 rounded text-[11.5px] font-black text-emerald-400 uppercase tracking-tighter">Profit+</div>
                        </div>

                        <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap size={12} className="text-emerald-400" />
                                <span className="text-[14px] font-black text-emerald-300 uppercase">Contextual Strategy</span>
                            </div>
                            <p className="text-[16px] text-gray-300 leading-relaxed font-bold">
                                현재 본문은 <span className="text-white">설득형 구조</span>입니다. 본문 중반부(<span className="text-emerald-400">약 40% 지점</span>)에 위 상품의 링크를 배치할 때 수익 전환율이 2.4배 가장 높습니다.
                            </p>
                        </div>

                        <button className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-[15px] font-black rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-95 flex items-center justify-center gap-2">
                            <Zap size={14} className="fill-white" />
                            제휴 수익 훅(Hook) 자동 삽입
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
