import React from 'react';
import { TrendingUp, Target } from 'lucide-react';

export const RoiSimulationPanel = () => {
    return (
        <div className="bg-slate-900 border border-indigo-500/20 rounded-3xl p-6 relative overflow-hidden h-full flex flex-col">
            <div className="flex items-center gap-2 mb-5">
                <TrendingUp size={18} className="text-indigo-400" />
                <h4 className="text-[16px] font-black text-white uppercase tracking-widest">현실적 수익 기대치 (ROI Simulation)</h4>
            </div>

            <div className="flex flex-col flex-1">
                <div className="text-[12px] text-gray-400 font-bold mb-4 italic uppercase tracking-wider">Estimated Performance Metrics:</div>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                            <span className="text-[14.5px] text-gray-400 font-bold block mb-1">예상 광고 수익 (5천뷰 기준)</span>
                            <span className="text-2xl font-black text-white">₩7,500 ~</span>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                            <span className="text-[14.5px] text-gray-400 font-bold block mb-1">예상 제휴 수익 (전환율 1.0%)</span>
                            <span className="text-2xl font-black text-emerald-400">₩2,775,852 ~</span>
                        </div>
                    </div>

                    <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[15px] text-indigo-300 font-black">인건비 절감 가치 (Time-Saving Value)</span>
                            <span className="text-[13.5px] text-indigo-400 font-black uppercase">AI Advantage</span>
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="text-2xl font-black text-white">₩120,500</span>
                            <span className="text-[13px] text-gray-500 font-black mb-1">전문 작가 2시간 작업 비용 환산</span>
                        </div>
                    </div>

                    <div className="flex items-start gap-2 mt-2">
                        <div className="mt-0.5"><Target size={10} className="text-indigo-500" /></div>
                        <p className="text-[11px] text-gray-500 font-bold leading-tight whitespace-nowrap">위 데이터는 알고리즘 평균치를 기반으로 추출된 예측값입니다.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
