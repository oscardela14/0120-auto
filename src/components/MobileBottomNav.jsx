import React from 'react';
import { Home, Lightbulb, Edit3, History, CreditCard, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export const MobileBottomNav = ({ activeTab, setActiveTab }) => {
    const navItems = [
        { id: 'dashboard', icon: Home, label: '홈' },
        { id: 'topics', icon: Lightbulb, label: '트렌드' },
        { id: 'studio', icon: Edit3, label: '제작' },
        { id: 'revenue', icon: BarChart3, label: '수익' },
        { id: 'history', icon: History, label: '보관함' },
        { id: 'pricing', icon: CreditCard, label: '멤버십' }
    ];

    return (
        <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-xl border-t border-white/10 z-50 safe-area-pb"
        >
            <div className="flex items-center justify-around px-2 py-3">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${isActive
                                ? 'text-primary bg-primary/10'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Icon size={20} className={isActive ? 'fill-primary/20' : ''} />
                            <span className="text-xs font-medium">{item.label}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="bottomNavIndicator"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </motion.div>
    );
};
