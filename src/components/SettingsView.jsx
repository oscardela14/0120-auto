import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Camera, RefreshCw, Save, LogOut, Upload, Shield, CreditCard, Bell } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

export const SettingsView = ({ onNavigate }) => {
    const { user, usage, updateUser, logout, isAuthenticated, planDetails } = useUser();
    const [name, setName] = useState('');
    const [avatarSeed, setAvatarSeed] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(''); // For uploaded images
    const [theme, setTheme] = useState('dark');
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef(null);

    // Init state from user
    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setAvatarSeed(user.avatarSeed || user.email || 'user');
            setAvatarUrl(user.avatarUrl || '');
            setTheme(user.theme || 'dark');
        }
    }, [user]);

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <User size={40} className="text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">로그인이 필요합니다</h2>
                <p className="text-gray-400 mb-8 max-w-md">
                    설정을 변경하려면 먼저 로그인해주세요.
                    계정이 없다면 무료로 가입하여 다양한 기능을 체험해보세요.
                </p>
            </div>
        );
    }

    const handleRandomizeAvatar = () => {
        setAvatarSeed(Math.random().toString(36).substring(7));
        setAvatarUrl(''); // Clear uploaded image if randomizing
        setIsEditing(true);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarUrl(reader.result);
                setIsEditing(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        updateUser({
            name,
            avatarSeed,
            avatarUrl,
            theme
        });

        setIsSaving(false);
        setIsEditing(false);
    };

    const currentAvatarSrc = avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`;

    return (
        <div className="max-w-[1440px] mx-auto space-y-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">설정</h1>
                <p className="text-gray-400">프로필 및 계정 설정을 관리하세요.</p>
            </header>

            {/* Profile Section */}
            <section className="bg-surface/30 border border-white/5 rounded-2xl p-8 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <User size={20} className="text-primary" />
                    프로필 설정
                </h2>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Avatar Area */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full border-4 border-surface bg-gray-800 overflow-hidden shadow-xl">
                                <img
                                    src={currentAvatarSrc}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors shadow-lg"
                                title="이미지 업로드"
                            >
                                <Camera size={18} />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={handleRandomizeAvatar}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-colors"
                            >
                                <RefreshCw size={14} />
                                랜덤 변경
                            </button>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-colors"
                            >
                                <Upload size={14} />
                                업로드
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => { setTheme('light'); setIsEditing(true); }}
                                className={`w-6 h-6 rounded-full bg-white border-2 transition-all ${theme === 'light' ? 'border-primary ring-2 ring-primary/30 scale-110' : 'border-gray-400 opacity-70 hover:opacity-100'}`}
                                title="Light Theme"
                            />
                            <button
                                onClick={() => { setTheme('dark'); setIsEditing(true); }}
                                className={`w-6 h-6 rounded-full bg-gray-900 border-2 transition-all ${theme === 'dark' ? 'border-primary ring-2 ring-primary/30 scale-110' : 'border-gray-600 opacity-70 hover:opacity-100'}`}
                                title="Dark Theme"
                            />
                        </div>
                    </div>

                    {/* Inputs Area */}
                    <div className="flex-1 w-full space-y-4 pt-2">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">이름</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setIsEditing(true);
                                }}
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="이름을 입력하세요"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">이메일</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="w-full bg-black/30 border border-white/5 rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed"
                                />
                                <LockIcon size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">이메일 변경은 고객센터에 문의해주세요.</p>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                onClick={handleSave}
                                disabled={!isEditing || isSaving}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${isEditing
                                    ? 'bg-gradient-to-r from-primary to-purple-500 text-white hover:shadow-lg hover:shadow-primary/20'
                                    : 'bg-white/5 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                {isSaving ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    >
                                        <RefreshCw size={18} />
                                    </motion.div>
                                ) : (
                                    <Save size={18} />
                                )}
                                {isSaving ? '저장 중...' : '변경사항 저장'}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Account Info Section */}
            <section className="bg-surface/30 border border-white/5 rounded-2xl p-8 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Shield size={20} className="text-primary" />
                    구독 및 결제 관리
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Plan Card */}
                    <div className="col-span-1 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                        <h3 className="text-gray-400 text-sm mb-2">현재 요금제</h3>
                        <div className="flex flex-col items-start gap-1 mb-4">
                            <div className="flex items-center gap-2">
                                <span className="text-3xl font-bold text-white">{planDetails.name}</span>
                                {user?.isTrial && (
                                    <span className="text-xs bg-yellow-400 text-black font-bold px-2 py-0.5 rounded-full animate-pulse">
                                        체험 중
                                    </span>
                                )}
                            </div>
                            <span className="text-sm text-primary font-bold">
                                ${planDetails.price}/월
                            </span>
                        </div>
                        {user?.plan === 'free' ? (
                            <button
                                onClick={() => onNavigate && onNavigate('pricing')}
                                className="w-full py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                멤버십 업그레이드
                            </button>
                        ) : user?.isTrial ? (
                            <div className="flex items-center gap-2 text-yellow-400 text-sm font-medium">
                                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                                무료 체험 14일 (Active)
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                이용 중 (Active)
                            </div>
                        )}
                    </div>

                    {/* Usage Card */}
                    <div className="col-span-1 bg-black/20 rounded-xl p-6 border border-white/5">
                        <h3 className="text-gray-400 text-sm mb-4">이번 달 사용량</h3>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-2xl font-bold text-white">
                                {planDetails.monthly_limit === -1 ? '무제한' : `${usage.current_month} / ${planDetails.monthly_limit}`}
                            </span>
                            <span className="text-xs text-gray-500">건</span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                                style={{
                                    width: planDetails.monthly_limit === -1
                                        ? '100%'
                                        : `${Math.min(100, (usage.current_month / planDetails.monthly_limit) * 100)}%`
                                }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-3">
                            {planDetails.monthly_limit === -1
                                ? '마음껏 생성하세요!'
                                : '다음 초기화: 매월 1일'}
                        </p>
                    </div>

                    {/* Subscription Period */}
                    <div className="col-span-1 md:col-span-3 lg:col-span-1 bg-black/20 rounded-xl p-6 border border-white/5">
                        <h3 className="text-gray-400 text-sm mb-4">구독 기간</h3>
                        <SubscriptionProgress
                            startDate={user?.created_at}
                            endDate={user?.subscription_end}
                            isTrial={user?.isTrial}
                        />
                    </div>
                </div>

                <div className="mt-8 border-t border-white/5 pt-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <CreditCard size={16} />
                            <span>등록된 결제 수단 없음</span>
                        </div>
                        <button className="text-xs text-primary hover:underline">
                            카드 등록하기
                        </button>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm font-medium px-4 py-2 hover:bg-red-400/10 rounded-lg"
                    >
                        <LogOut size={16} />
                        로그아웃
                    </button>
                </div>
            </section>
        </div>
    );
};

// Start, End 날짜를 받아 진행률을 보여주는 컴포넌트
const SubscriptionProgress = ({ startDate, endDate, isTrial }) => {
    // Demo data if undefined
    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date(new Date().setDate(new Date().getDate() + 30));

    // Calculate progress (clamp between 0 and 100)
    const totalDuration = end.getTime() - start.getTime();
    const elapsed = new Date().getTime() - start.getTime();
    const progress = totalDuration > 0
        ? Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))
        : 0;

    // D-Day calculation
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for accurate day calc

    const endDateOnly = new Date(end);
    endDateOnly.setHours(0, 0, 0, 0);

    const diffTime = endDateOnly.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const isUrgent = diffDays <= 3 && diffDays >= 0; // Urgent threshold 3 days for trial
    const isExpired = diffDays < 0;

    return (
        <div className="flex flex-col h-full justify-between">
            <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium flex items-center gap-2">
                    {isExpired
                        ? '기간 만료'
                        : diffDays === 0
                            ? 'D-Day (오늘 종료)'
                            : `D-${diffDays}`
                    }
                    {isTrial && <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-300">체험판</span>}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded ${isUrgent || isExpired ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                    {new Date().toISOString().split('T')[0]}
                </span>
            </div>

            <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between text-xs text-gray-500">
                    <span>{start.toLocaleDateString()}</span>
                    <span>{end.toLocaleDateString()}</span>
                </div>
                <div className="overflow-hidden h-2 mb-2 text-xs flex rounded-full bg-white/5">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${isUrgent || isExpired ? 'bg-gradient-to-r from-orange-500 to-red-500' : isTrial ? 'bg-yellow-500' : 'bg-gradient-to-r from-primary to-purple-500'
                            }`}
                    ></motion.div>
                </div>
            </div>

            <p className="text-xs text-gray-500">
                {isExpired
                    ? isTrial ? '⛔ 체험 기간이 종료되었습니다. 업그레이드해주세요.' : '⛔ 구독이 만료되었습니다. 갱신해주세요.'
                    : isUrgent
                        ? isTrial ? '⚠️ 무료 체험 종료 임박! 계속 이용하려면 구독하세요.' : '⚠️ 만료일이 다가오고 있습니다.'
                        : isTrial ? '✅ 무료 체험 기간 중입니다. 모든 기능을 즐겨보세요!' : '✅ 구독 기간이 여유롭습니다.'}
            </p>
        </div>
    );
};

const LockIcon = ({ size, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);
