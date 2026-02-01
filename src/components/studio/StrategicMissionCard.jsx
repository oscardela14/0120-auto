
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export const StrategicMissionCard = ({ icon: Icon, badge, title, desc, actionLabel, variant = "primary", onClick }) => {
    const isUrgent = variant === "urgent";
    return (
        <div className={cn(
            "relative group p-6 rounded-[28px] border transition-all duration-500 overflow-hidden",
            isUrgent
                ? "bg-red-500/5 border-red-500/20 hover:border-red-500/40 shadow-lg shadow-red-500/5"
                : "bg-surface/30 border-white/5 hover:border-primary/30"
        )}>
            {/* Background Glow */}
            <div className={cn(
                "absolute -right-4 -top-4 w-24 h-24 blur-[40px] opacity-20 transition-opacity",
                isUrgent ? "bg-red-500" : "bg-primary"
            )} />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className={cn(
                        "p-3 rounded-xl",
                        isUrgent ? "bg-red-500/10 text-red-400" : "bg-primary/10 text-primary"
                    )}>
                        <Icon size={20} />
                    </div>
                    {badge && (
                        <span className={cn(
                            "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                            isUrgent ? "bg-red-500/20 text-red-500" : "bg-primary/20 text-primary"
                        )}>
                            {badge}
                        </span>
                    )}
                </div>
                <h4 className="text-white font-black text-lg mb-2 group-hover:text-primary transition-colors">{title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 font-medium">{desc}</p>
                <button
                    onClick={onClick}
                    className={cn(
                        "w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all",
                        isUrgent
                            ? "bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-600/20 active:scale-[0.98]"
                            : "bg-white/5 hover:bg-white/10 text-white border border-white/10 active:scale-[0.98]"
                    )}
                >
                    {actionLabel} <ArrowRight size={14} />
                </button>
            </div>
        </div>
    );
};
