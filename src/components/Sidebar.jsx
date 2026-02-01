import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Home, Lightbulb, History, Settings, Zap, Menu, X, CreditCard, BookOpen, HelpCircle, MessageSquare, BarChart3, Film, Rocket, Users, FileText, Target, Heart, Sparkles, Activity, Globe } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { cn } from '../lib/utils';
import { AutonomousHunter } from './AutonomousHunter';
import { generateContent } from '../utils/contentGenerator';

// Fallback cn if not in utils
function classNames(...inputs) {
    return inputs.filter(Boolean).join(' ');
}




// SidebarItem Component
const SidebarItem = ({ icon: Icon, label, path, onClick, collapsed, className }) => {
    const location = useLocation();
    // Check if current path starts with the item label path (simple matching)
    // Main paths: /dashboard, /topics, /studio, /history, /pricing, /guide, /settings
    const isActive = location.pathname === path || (path === '/' && location.pathname === '/dashboard');

    return (
        <button
            onClick={() => onClick(path)}
            className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group",
                isActive
                    ? "bg-primary/20 text-primary shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5",
                className
            )}
        >
            <Icon size={22} className={cn("transition-transform group-hover:scale-110", isActive && "scale-110")} />
            {!collapsed && (
                <span className="font-medium whitespace-nowrap overflow-hidden transition-opacity">
                    {label}
                </span>
            )}
            {isActive && !collapsed && (
                <motion.div
                    layoutId="active-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_currentColor]"
                />
            )}
        </button>
    );
};

export const Sidebar = ({ onOpenLegal, collapsed, setCollapsed }) => {
    const { user, usage, getCurrentPlanDetails, addNotification, addToHistory } = useUser();
    const navigate = useNavigate();

    const planDetails = getCurrentPlanDetails();
    const limit = planDetails.monthly_limit;
    const usagePercentage = limit === -1 ? 100 : Math.min(100, (usage.current_month / limit) * 100);

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleHunterGenerate = async (alert) => {
        const { topic } = alert;
        const platforms = ['YouTube Shorts', 'Instagram', 'Blog', 'TikTok'];

        addNotification(`🎯 바이럴 헌터: [${topic}] 전 플랫폼 콘텐츠 생성 시작...`, 'info');

        try {
            // Generate content for all platforms in parallel
            const results = await Promise.all(
                platforms.map(async (platform) => {
                    try {
                        return await generateContent(platform, topic, 'witty');
                    } catch (err) {
                        console.error(`Failed to generate for ${platform}:`, err);
                        return null;
                    }
                })
            );

            // Save all successfully generated content to history
            let successCount = 0;
            for (let i = 0; i < results.length; i++) {
                if (results[i]) {
                    await addToHistory({
                        ...results[i],
                        id: `hunter-${platforms[i].replace(/\s+/g, '-')}-${Date.now()}-${i}`,
                        isScoutContent: true,
                        status: 'draft',
                        platform: platforms[i]
                    });
                    successCount++;
                }
            }

            if (successCount > 0) {
                addNotification(`✅ 생성 완료! [${topic}] ${successCount}개 플랫폼 콘텐츠가 보관함에 저장되었습니다.`, 'success');
            } else {
                addNotification("콘텐츠 생성에 실패했습니다. 다시 시도해주세요.", "error");
            }
        } catch (e) {
            console.error("Hunter generation failed", e);
            addNotification("초안 생성 중 오류가 발생했습니다.", "error");
        }
    };

    return (
        <motion.aside
            animate={{ width: collapsed ? 80 : 300 }}
            className="hidden md:flex h-screen bg-surface/50 backdrop-blur-xl border-r border-white/5 flex-col p-4 fixed left-0 top-0 z-50 transition-all duration-500"
        >
            <div className="flex items-center justify-between mb-10 pl-2">
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent flex items-center gap-2"
                    >
                        <Zap className="text-primary fill-primary/20" />
                        <span>Content<span className="text-primary">Studio</span> AI</span>
                    </motion.div>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors ml-auto"
                >
                    {collapsed ? <Menu size={20} /> : <X size={20} />}
                </button>
            </div>

            <nav className="flex flex-col flex-1 overflow-y-auto scrollbar-hide pr-1 py-4 space-y-4">
                {/* 1. Main Section Panel */}
                <div className={cn("transition-all duration-300", !collapsed && "bg-white/5 rounded-2xl p-3 border border-white/5")}>
                    {!collapsed && (
                        <div className="flex items-center gap-2 px-2 mb-3">
                            <div className="w-1 h-3 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                            <span className="text-[18px] font-black text-gray-400 uppercase tracking-widest">대시보드</span>
                        </div>
                    )}
                    <div className="space-y-1">
                        <SidebarItem icon={Home} label="홈" path="/" onClick={handleNavigation} collapsed={collapsed} />
                        <SidebarItem icon={Globe} label="GA4 Intelligence" path="/ga4" onClick={handleNavigation} collapsed={collapsed} />
                    </div>
                </div>

                {/* 2. Creative Section Panel */}
                <div className={cn("transition-all duration-300", !collapsed && "bg-white/5 rounded-2xl p-3 border border-white/5")}>
                    {!collapsed && (
                        <div className="flex items-center gap-2 px-2 mb-3">
                            <div className="w-1 h-3 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.5)]" />
                            <span className="text-[18px] font-black text-gray-400 uppercase tracking-widest">크리에이티브 랩</span>
                        </div>
                    )}
                    <div className="space-y-1">
                        <SidebarItem icon={Lightbulb} label="주제 발굴" path="/topics" onClick={handleNavigation} collapsed={collapsed} />
                        <SidebarItem icon={FileText} label="콘텐츠 스튜디오" path="/studio" onClick={handleNavigation} collapsed={collapsed} />
                    </div>
                </div>

                {/* 3. Analysis & Performance Section Panel */}
                <div className={cn("transition-all duration-300", !collapsed && "bg-white/5 rounded-2xl p-3 border border-white/5")}>
                    {!collapsed && (
                        <div className="flex items-center gap-2 px-2 mb-3">
                            <div className="w-1 h-3 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                            <span className="text-[18px] font-black text-gray-400 uppercase tracking-widest">데이터 인텔리전스</span>
                        </div>
                    )}
                    <div className="space-y-1">
                        <SidebarItem icon={Activity} label="AI 분석 엔진" path="/analysis" onClick={handleNavigation} collapsed={collapsed} />
                        <SidebarItem icon={BarChart3} label="수익 (Revenue)" path="/revenue" onClick={handleNavigation} collapsed={collapsed} />
                        <SidebarItem icon={Sparkles} label="TEST 실험실" path="/test" onClick={handleNavigation} collapsed={collapsed} />
                        <SidebarItem icon={Film} label="프로덕션 랩" path="/production" onClick={handleNavigation} collapsed={collapsed} />
                        <SidebarItem icon={Rocket} label="그로스 전략" path="/growth" onClick={handleNavigation} collapsed={collapsed} />

                    </div>
                </div>



                {/* 4. Management Section Panel */}
                <div className={cn("transition-all duration-300", !collapsed && "bg-white/5 rounded-2xl p-3 border border-white/5")}>
                    {!collapsed && (
                        <div className="flex items-center gap-2 px-2 mb-3">
                            <div className="w-1 h-3 rounded-full bg-gray-500" />
                            <span className="text-[18px] font-black text-gray-400 uppercase tracking-widest">시스템 관리</span>
                        </div>
                    )}
                    <div className="space-y-1">
                        <SidebarItem icon={History} label="보관함" path="/history" onClick={handleNavigation} collapsed={collapsed} />
                        <SidebarItem icon={CreditCard} label="멤버십" path="/pricing" onClick={handleNavigation} collapsed={collapsed} />
                        <SidebarItem icon={BookOpen} label="이용 가이드" path="/guide" onClick={handleNavigation} collapsed={collapsed} />
                        <SidebarItem icon={Settings} label="설정" path="/settings" onClick={handleNavigation} collapsed={collapsed} />
                    </div>
                </div>

                {/* Admin Mode */}
                {user?.role === 'admin' && (
                    <div className="mt-2 pt-2 px-1">
                        <SidebarItem
                            icon={ShieldAlert}
                            label="GOD MODE"
                            path="/admin"
                            onClick={handleNavigation}
                            collapsed={collapsed}
                            className="bg-red-900/10 text-red-500 hover:bg-red-900/30 hover:text-red-400 border border-red-900/30 font-black tracking-widest justify-center"
                        />
                    </div>
                )}

                {/* AI Strategic Scout */}
                <div className="mt-2">
                    <AutonomousHunter onGenerate={handleHunterGenerate} collapsed={collapsed} />
                </div>
            </nav>

            <div className="mt-auto px-2 pb-4">
                {/* Strategic widgets moved to Dashboard for better visibility */}
            </div>
        </motion.aside>
    );
};
