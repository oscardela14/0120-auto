
import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { PlatformCard } from './PlatformCard';

export const StudioResults = ({
    mode,
    platformContents,
    batchContents,
    platforms,
    handleEditContent,
    handleSchedule,
    scheduledEvents
}) => {
    if (mode === 'single' && platformContents['YouTube Shorts']) {
        return (
            <div className="mb-16">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-black text-white mb-1 flex items-center gap-3 uppercase tracking-tighter">
                            <CheckCircle2 className="text-emerald-400" size={24} />
                            생성된 전략 콘텐츠
                        </h3>
                        <p className="text-xs text-gray-500 font-medium lowercase">Optimized across 4 platforms using swarm intelligence</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Total Impact Score</div>
                            <div className="text-xl font-black text-indigo-400 leading-none">94.8%</div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {platforms.map(({ name, icon, color }) => (
                        <PlatformCard
                            key={name}
                            platform={name}
                            data={platformContents[name]}
                            onEdit={handleEditContent}
                            onSchedule={handleSchedule}
                            icon={icon}
                            color={color}
                            scheduled={scheduledEvents.some(e => e.platform === name)}
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (mode === 'batch' && batchContents.length > 0) {
        return (
            <div className="mb-12">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <CheckCircle2 className="text-green-400" />
                    배치 생성 결과 ({batchContents.length}개 주제 × 4개 플랫폼 = {batchContents.length * 4}개 콘텐츠)
                </h3>
                <div className="space-y-6">
                    {batchContents.map((batch, bIdx) => (
                        <div key={batch.id} className="bg-surface/20 border border-white/5 rounded-xl p-6">
                            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center">{bIdx + 1}</span>
                                {batch.topic}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {platforms.map(({ name, icon, color }) => (
                                    <PlatformCard
                                        key={name}
                                        platform={name}
                                        data={batch.contents[name]}
                                        onEdit={handleEditContent}
                                        onSchedule={handleSchedule}
                                        icon={icon}
                                        color={color}
                                        scheduled={scheduledEvents.some(e => e.platform === name && e.data.topic === batch.topic)}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return null;
};
