import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Bot, User, Menu, X, Crown, LogOut, Activity, Info, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useUser } from '../contexts/UserContext';
import { Sidebar } from '../components/Sidebar';
import { ConnectAccountModal } from '../components/ConnectAccountModal';
import { AuthModal } from '../components/AuthModal';
import LegalModal from '../components/LegalModal';
import { SupportBot } from '../components/SupportBot';
import { MobileBottomNav } from '../components/MobileBottomNav';

import { cn } from '../lib/utils';

// Toast Container Component (Internal or Separate)
// Internal Util: Simple CountUp Animation
const CountUp = ({ end, duration = 2000, decimals = 0, suffix = '', separator = '' }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime;
        let animationFrame;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);

            // EaseOutExpo effect
            const ease = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);

            setCount(ease * end);

            if (progress < duration) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    const formatted = count.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return <span>{formatted}{suffix}</span>;
};

const StatItem = ({ label, children, title, desc }) => (
    <div className="relative group cursor-help text-right">
        <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-0.5 group-hover:text-indigo-400 transition-colors flex items-center justify-end gap-1">
            {label}
            <Info size={10} className="text-gray-600 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all transform scale-0 group-hover:scale-100" />
        </div>
        {children}

        {/* Tooltip */}
        <div className="absolute top-full right-0 mt-4 w-72 p-4 bg-[#111114]/95 border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 translate-y-2 group-hover:translate-y-0 backdrop-blur-xl pointer-events-none text-left">
            <div className="absolute -top-1.5 right-6 w-3 h-3 bg-[#111114] border-t border-l border-white/10 transform rotate-45"></div>
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
                <Sparkles size={12} className="text-indigo-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">{title}</h4>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed break-keep font-medium">
                {desc}
            </p>
        </div>
    </div>
);



const ToastContainer = () => {
    const { notifications } = useUser();
    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
            <AnimatePresence>
                {notifications.map((notification) => (
                    <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        className={cn(
                            "px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-md flex items-center gap-4 min-w-[340px] pointer-events-auto",
                            notification.type === 'error' ? "bg-red-500/20 border-red-500/30 text-red-100" :
                                notification.type === 'success' ? "bg-green-500/20 border-green-500/30 text-green-100" :
                                    notification.type === 'warning' ? "bg-yellow-500/20 border-yellow-500/30 text-yellow-100" :
                                        "bg-surface/90 border-white/20 text-white"
                        )}
                    >
                        <span className="text-base font-black tracking-tight">{notification.message}</span>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

const DashboardLayout = () => {
    const {
        user,
        isAuthenticated,
        logout,
        connectAccount,
        disconnectAccount,
        connectedAccounts,
        planDetails,
        usage,
        history // Destructure history
    } = useUser();
    const location = useLocation();
    const navigate = useNavigate();

    // State for Sidebar
    const [collapsed, setCollapsed] = useState(false);
    const limit = planDetails.monthly_limit || 20;
    const usagePercentage = limit === -1 ? 100 : Math.min(100, (usage?.current_month / limit) * 100);

    // Use History Length for Stats
    const totalGenerated = history?.length || 0;

    // UI States
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
    const [targetPlatformToConnect, setTargetPlatformToConnect] = useState(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isSupportOpen, setIsSupportOpen] = useState(false);
    const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);


    const [legalInitialTab, setLegalInitialTab] = useState('support');

    const handleOpenLegal = (tab = 'support') => {
        setLegalInitialTab(tab);
        setIsLegalModalOpen(true);
    };

    const handleConnectRequest = (platform) => {
        setTargetPlatformToConnect(platform);
        setIsConnectModalOpen(true);
    };

    const handleAccountConnected = (platform) => {
        connectAccount(platform);
        setIsConnectModalOpen(false);
    };

    // Determine Title based on Path
    const getPageTitle = (pathname) => {
        const map = {
            '/': '홈',
            '/dashboard': '홈',
            '/topics': '주제 발굴',
            '/trends': '추천 프롬프트',
            '/studio': '콘텐츠 스튜디오',
            '/production': '프로덕션 랩',
            '/growth': '그로스 전략',

            '/revenue': '수익 마스터 보드',
            '/history': '보관함',
            '/pricing': '멤버십',
            '/guide': '이용 가이드',
            '/settings': '설정'
        };
        return map[pathname] || '홈';
    };

    const getActiveTab = (pathname) => {
        const map = {
            '/': 'dashboard',
            '/dashboard': 'dashboard',
            '/topics': 'topics',
            '/studio': 'studio',
            '/history': 'history',
            '/pricing': 'pricing',
            '/guide': 'guide',
            '/settings': 'settings',
            '/revenue': 'revenue'
        };
        return map[pathname] || 'dashboard';
    };

    const handleMobileNav = (tab) => {
        const pathMap = {
            'dashboard': '/dashboard',
            'topics': '/topics',
            'studio': '/studio',
            'history': '/history',
            'pricing': '/pricing',
            'guide': '/guide',
            'settings': '/settings',
            'revenue': '/revenue'
        };
        navigate(pathMap[tab] || '/dashboard');
    }

    return (
        <div className={`flex min-h-screen font-sans selection:bg-primary/30 transition-colors duration-300 ${user?.theme === 'light' ? 'light-mode' : 'bg-background text-white'}`}>
            <Sidebar onOpenLegal={handleOpenLegal} collapsed={collapsed} setCollapsed={setCollapsed} />

            <main className={cn(
                "flex-1 transition-all duration-500 pb-24 md:pb-8 overflow-y-auto h-screen",
                collapsed ? "ml-0 md:ml-20" : "ml-0 md:ml-20 lg:ml-[300px]"
            )}>
                <div className="max-w-[1440px] mx-auto p-4 md:p-6 lg:p-8">
                    <header className="hidden md:flex justify-between items-center mb-10">
                        <h2 className="text-2xl font-black text-white/40 tracking-tight">
                            {getPageTitle(location.pathname)}
                        </h2>

                        <div className="flex gap-6 items-center">


                            {/* [Dynamic Stats] Real-time Impact Counter */}
                            {isAuthenticated && usage && (
                                <div className="hidden xl:flex items-center gap-6 mr-6">
                                    <StatItem
                                        label="Total Generated"
                                        title="Intelligence Archive"
                                        desc="AI 엔진이 귀하의 페르소나를 완벽히 학습하여 생성한 총 콘텐츠 자산입니다. 단순한 생성이 아닌, 브랜드 가치를 축적하는 디지털 자산의 총량을 의미합니다."
                                    >
                                        <div className="text-xl font-black text-white leading-none">
                                            {totalGenerated} <span className="text-xs text-gray-500">contents</span>
                                        </div>
                                    </StatItem>

                                    <div className="w-px h-8 bg-white/10" />

                                    <StatItem
                                        label="Time Saved"
                                        title="Efficiency Calculus"
                                        desc="전문가가 콘텐츠 1개를 기획, 집필, 편집하는 데 소요되는 평균 시간(90분)을 기준으로 산출된 총 절약 시간입니다. 확보된 시간을 전략적 의사결정에 투자하세요."
                                    >
                                        <div className="text-xl font-black text-white leading-none">
                                            <CountUp end={totalGenerated * 1.5} decimals={1} suffix="h" />
                                        </div>
                                    </StatItem>

                                    <div className="w-px h-8 bg-white/10" />

                                    <StatItem
                                        label="Views Gained"
                                        title="Viral Impact Projection"
                                        desc="빅데이터 기반 알고리즘 최적화를 통해 확보된 잠재적 트래픽 총량입니다. 현재 트렌드와 플랫폼 로직을 반영한 예상 도달률 시뮬레이션 결과입니다."
                                    >
                                        <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 leading-none">
                                            <CountUp end={totalGenerated * 2500} separator="," suffix="+" />
                                        </div>
                                    </StatItem>
                                </div>
                            )}



                            {/* AI Support - Up-scaled */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsSupportOpen(true)}
                                className="group flex items-center gap-3 pr-7 pl-2 py-2.5 rounded-full bg-[#111114]/90 backdrop-blur-xl border border-white/10 hover:border-indigo-500/40 transition-all shadow-2xl hover:shadow-indigo-500/20"
                            >
                                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all relative">
                                    <Bot size={20} className="text-white" />
                                    <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#111114] rounded-full"></span>
                                </div>
                                <span className="text-[14px] font-black text-gray-200 group-hover:text-white transition-colors tracking-tight">AI 서포트</span>
                            </motion.button>

                            {isAuthenticated ? (
                                <div className="flex items-center gap-6">
                                    {/* Membership Tag - Bold Scale */}
                                    {user?.plan === 'free' && (
                                        <motion.button
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => navigate('/pricing')}
                                            className="hidden lg:flex px-7 py-3.5 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-black font-black text-[13px] rounded-full shadow-[0_15px_30px_rgba(249,115,22,0.3)] hover:shadow-[0_20px_40px_rgba(249,115,22,0.5)] transition-all items-center gap-2.5 border border-white/30 relative overflow-hidden group"
                                        >
                                            <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                                            <Crown size={18} fill="currentColor" />
                                            <span>멤버십 가입</span>
                                        </motion.button>
                                    )}

                                    {/* Profile Section with Vertical Greeting - Scaled */}
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <span className="text-[13px] font-black text-white/40 uppercase tracking-[0.1em]">HELLO,</span>
                                            <span className="text-[16px] font-black text-indigo-400 uppercase tracking-tight">{user?.name || '사용자'}</span>
                                        </div>

                                        <div
                                            onClick={() => navigate('/settings')}
                                            className="flex flex-col items-center gap-2 group cursor-pointer"
                                        >
                                            <div
                                                className={cn(
                                                    "relative w-14 h-14 rounded-full p-[3px] transition-all group-hover:scale-105 shadow-xl",
                                                    user?.plan === 'business' ? "bg-gradient-to-tr from-orange-400 via-red-500 to-rose-600 shadow-orange-500/40" :
                                                        user?.plan === 'pro' ? "bg-gradient-to-tr from-yellow-300 via-yellow-500 to-yellow-600 shadow-yellow-500/40" :
                                                            user?.plan === 'starter' ? "bg-gradient-to-tr from-blue-400 to-cyan-500 shadow-blue-500/40" :
                                                                "bg-gradient-to-tr from-indigo-500 to-purple-600"
                                                )}
                                            >
                                                <div className="w-full h-full rounded-full bg-[#0F0F12] overflow-hidden relative border border-white/10 group-hover:border-white/20 transition-colors shadow-inner">
                                                    <img
                                                        src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.avatarSeed || user?.email || 'user'}`}
                                                        alt="User"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                {user?.plan !== 'free' && (
                                                    <div className={cn(
                                                        "absolute -top-1 -right-1 p-1 rounded-full border-2 border-[#0f111a] shadow-lg transform rotate-12",
                                                        user?.plan === 'business' ? "bg-orange-500 text-white" :
                                                            user?.plan === 'pro' ? "bg-yellow-400 text-black" :
                                                                "bg-blue-500 text-white"
                                                    )}>
                                                        <Crown size={12} fill="currentColor" strokeWidth={3} />
                                                    </div>
                                                )}
                                            </div>
                                            <span className={cn(
                                                "px-4 py-2 rounded-[8px] text-[12px] font-black uppercase tracking-[0.15em] leading-none shadow-md border animate-in fade-in zoom-in duration-500",
                                                (user?.plan === 'business' || planDetails?.name === 'Business') ? "bg-orange-500 text-white border-orange-400 shadow-orange-500/30" :
                                                    (user?.plan === 'pro' || planDetails?.name === 'Pro') ? "bg-yellow-400 text-black border-yellow-300 shadow-yellow-500/30" :
                                                        (user?.plan === 'starter' || planDetails?.name === 'Starter') ? "bg-blue-500 text-white border-blue-400 shadow-blue-500/30" :
                                                            "bg-white/15 text-gray-300 border-white/10 shadow-black/50"
                                            )}>
                                                {user?.plan === 'business' ? 'Business' : user?.plan === 'pro' ? 'Pro' : user?.plan === 'starter' ? 'Starter' : 'Free'} Grade
                                            </span>
                                        </div>
                                    </div>

                                    {/* Logout Button - Scaled */}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            console.log("👆 Logout button clicked");
                                            e.preventDefault();
                                            e.stopPropagation();
                                            logout();
                                        }}
                                        className="hidden md:flex items-center justify-center w-14 h-14 rounded-full bg-red-500/[0.08] border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl active:scale-95 group relative z-[100] pointer-events-auto"
                                        title="Logout"
                                    >
                                        <LogOut size={22} className="group-hover:rotate-12 transition-transform" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-5">
                                    <div className="flex flex-col items-center opacity-70">
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <span className="text-[12px] font-black text-white/40 uppercase tracking-[0.2em]">GUEST</span>
                                        </div>
                                        <div className="w-14 h-14 rounded-full bg-white/10 border-2 border-dashed border-white/20 flex items-center justify-center">
                                            <User size={24} className="text-gray-400" />
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsAuthModalOpen(true)}
                                        className="flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-primary to-purple-600 text-sm font-black text-white hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all border border-white/20"
                                    >
                                        <User size={18} />
                                        <span>로그인</span>
                                    </motion.button>
                                </div>
                            )}
                        </div>
                    </header>

                    <Outlet context={{
                        onConnectRequest: handleConnectRequest,
                        onDisconnect: disconnectAccount,
                        onRequireAuth: () => setIsAuthModalOpen(true),
                        onOpenPricing: () => navigate('/pricing'),
                        onOpenLegal: handleOpenLegal
                    }} />
                </div>
            </main>

            <ConnectAccountModal
                isOpen={isConnectModalOpen}
                onClose={() => setIsConnectModalOpen(false)}
                platform={targetPlatformToConnect}
                onConnect={handleAccountConnected}
            />

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialMode="signup"
            />
            <LegalModal
                isOpen={isLegalModalOpen}
                onClose={() => setIsLegalModalOpen(false)}
                initialTab={legalInitialTab}
            />
            <SupportBot isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />

            <MobileBottomNav activeTab={getActiveTab(location.pathname)} setActiveTab={handleMobileNav} />
            <ToastContainer />
        </div>
    );
};

export default DashboardLayout;
