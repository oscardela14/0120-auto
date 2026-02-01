import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Loader, Shield, Lock, CreditCard, Smartphone, Zap } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { requestPayment } from '../lib/payment';

export const PaymentModal = ({ isOpen, onClose, selectedPlan, billingCycle = 'monthly' }) => {
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isAgreed, setIsAgreed] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const { user, upgradePlan, PLAN_LIMITS, addNotification } = useUser();

    // Reset state on open
    useEffect(() => {
        if (isOpen) {
            setPaymentSuccess(false);
            setIsProcessing(false);
            setIsAgreed(false);
        }
    }, [isOpen]);

    if (!isOpen || !selectedPlan) return null;

    const planDetails = PLAN_LIMITS[selectedPlan];
    const monthlyPrice = planDetails.price;
    const yearlyPricePerMonth = planDetails.yearlyPrice || Math.floor(monthlyPrice * 0.7);
    const finalPrice = billingCycle === 'yearly' ? yearlyPricePerMonth * 12 : monthlyPrice;
    const billingText = billingCycle === 'yearly' ? '연간 구독' : '월간 구독';

    // Helpr for email validation
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handlePayment = async () => {
        setIsProcessing(true);
        try {
            // Validate email or use fallback
            const buyerEmail = isValidEmail(user?.email) ? user.email : 'test@test.com';

            const result = await requestPayment(
                selectedPlan,
                `${planDetails.name} Plan (${billingText})`,
                finalPrice,
                { name: user?.name, email: buyerEmail }
            );

            if (result.success) {
                // 🎉 1. Confetti Effect (Continuous Burst for 2.5s)
                const end = Date.now() + 2500;

                const frame = () => {
                    if (window.confetti) {
                        window.confetti({
                            particleCount: 5,
                            angle: 60,
                            spread: 55,
                            origin: { x: 0 },
                            colors: ['#6366f1', '#a855f7', '#ec4899', '#fbbf24']
                        });
                        window.confetti({
                            particleCount: 5,
                            angle: 120,
                            spread: 55,
                            origin: { x: 1 },
                            colors: ['#6366f1', '#a855f7', '#ec4899', '#fbbf24']
                        });
                    }

                    if (Date.now() < end) {
                        requestAnimationFrame(frame);
                    }
                };

                // Initial Big Burst
                if (window.confetti) {
                    window.confetti({
                        particleCount: 150,
                        spread: 100,
                        origin: { y: 0.6 },
                        ticks: 400
                    });
                }

                // Start Continuous Rain
                frame();

                // 📳 2. Haptic Feedback (Success Pattern)
                if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);

                // ⚡ [IMMEDIATE UPDATE] 결제 성공 즉시 상태 반영 (기다리지 않음)
                console.log(`✅ [Payment Success] Upgrading user ${user?.id} to plan: ${selectedPlan}`);
                upgradePlan(selectedPlan, billingCycle);

                addNotification(`💎 ${planDetails.name} 플랜으로 업그레이드 요청되었습니다!`, 'success');

                setPaymentSuccess(true);

                // ⏱️ 3. Delay ONLY the closing for UX (Show animation)
                setTimeout(() => {
                    onClose();
                }, 2500);
            } else {
                addNotification(`결제 실패: ${result.error}`, 'error');
                setIsProcessing(false);
            }
        } catch (error) {
            console.error("Payment Error:", error);
            addNotification("시스템 오류가 발생했습니다.", "error");
            setIsProcessing(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            >
                {/* Backdrop with Blur */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={onClose} />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                    className="relative w-full max-w-4xl h-[600px] bg-[#0f111a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex z-10"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Background Ambient Effects */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none translate-y-1/3 -translate-x-1/3" />

                    {/* Success Overlay */}
                    <AnimatePresence>
                        {paymentSuccess && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 z-50 bg-[#0f111a]/90 backdrop-blur-md flex flex-col items-center justify-center"
                            >
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", bounce: 0.5 }}
                                    className="w-32 h-32 rounded-full bg-gradient-to-tr from-green-400 to-emerald-600 flex items-center justify-center mb-6 shadow-lg shadow-green-500/30"
                                >
                                    <Check size={64} className="text-white drop-shadow-md" strokeWidth={3} />
                                </motion.div>
                                <motion.h2
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-3xl font-bold text-white mb-2"
                                >
                                    Payment Successful!
                                </motion.h2>
                                <motion.p
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-gray-400"
                                >
                                    잠시 후 플랜이 활성화됩니다...
                                </motion.p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Left Panel: Visual & Summary */}
                    <div className="hidden md:flex w-[40%] bg-white/5 border-r border-white/5 flex-col relative overflow-hidden">
                        <div className="p-8 relative z-10 h-full flex flex-col">
                            <h3 className="text-2xl font-bold text-white mb-1">Premium Access</h3>
                            <p className="text-indigo-300 text-sm mb-8">Upgrade your content creation</p>

                            {/* 3D Holographic Card Visual */}
                            <div className="relative w-full aspect-[1.58] mb-8 group perspective-1000">
                                <motion.div
                                    animate={{
                                        rotateY: [0, 5, 0, -5, 0],
                                        rotateX: [0, 5, 0, -5, 0]
                                    }}
                                    transition={{
                                        duration: 6,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="w-full h-full rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/20 relative shadow-2xl shadow-indigo-500/20 overflow-hidden"
                                >
                                    {/* Card Shine */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50" />
                                    <div className="absolute top-0 right-0 p-6">
                                        <div className="flex gap-1">
                                            {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-6 bg-white/20 rounded-full skew-x-12" />)}
                                        </div>
                                    </div>
                                    <div className="absolute bottom-8 left-8">
                                        <div className="text-xs text-gray-400 mb-1">MEMBER</div>
                                        <div className="text-lg font-mono text-white tracking-widest">{user?.name || 'GUEST USER'}</div>
                                    </div>
                                    <div className="absolute top-8 left-8 w-12 h-8 rounded bg-gradient-to-br from-yellow-200 to-yellow-500 opacity-80" />
                                    <div className="absolute bottom-8 right-8 text-white font-bold italic text-xl opacity-50">PRO</div>
                                </motion.div>
                            </div>

                            <div className="mt-auto space-y-4">
                                <div className="flex justify-between text-gray-400">
                                    <span>Plan</span>
                                    <span className="text-white">{planDetails.name}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Cycle</span>
                                    <span className="text-white">{billingText}</span>
                                </div>
                                <div className="h-px bg-white/10" />
                                <div className="flex justify-between items-end">
                                    <span className="text-gray-400 pb-1">Total verified</span>
                                    <span className="text-3xl font-bold text-white">₩{finalPrice.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Controls */}
                    <div className="flex-1 flex flex-col h-full bg-[#0f111a]">
                        <div className="flex-1 overflow-y-auto p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-bold text-white">결제 수단 선택</h3>
                                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {[
                                    { id: 'card', name: 'Credit Card', icon: CreditCard, color: 'from-indigo-500 to-purple-600' },
                                    { id: 'kakaopay', name: 'Kakao Pay', icon: Zap, color: 'from-yellow-400 to-yellow-600' },
                                    { id: 'tosspay', name: 'Toss Pay', icon: Check, color: 'from-blue-400 to-blue-600' },
                                    { id: 'naverpay', name: 'Naver Pay', icon: Smartphone, color: 'from-green-400 to-green-600' },
                                ].map((method) => (
                                    <button
                                        key={method.id}
                                        onClick={() => {
                                            setPaymentMethod(method.id);
                                            // 📳 Haptic Feedback (Tap)
                                            if (navigator.vibrate) navigator.vibrate(10);
                                        }}
                                        className={`relative group bg-white/5 border rounded-2xl p-4 flex flex-col items-center gap-3 transition-all duration-300 ${paymentMethod === method.id
                                            ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                                            : 'border-white/10 hover:border-white/20 hover:bg-white/10'
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${method.color} flex items-center justify-center text-white shadow-lg`}>
                                            <method.icon size={20} />
                                        </div>
                                        <span className={`text-sm font-medium ${paymentMethod === method.id ? 'text-white' : 'text-gray-400'}`}>
                                            {method.name}
                                        </span>
                                        {paymentMethod === method.id && (
                                            <motion.div
                                                layoutId="selected-ring"
                                                className="absolute inset-0 border-2 border-indigo-500 rounded-2xl"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 mb-6 hover:border-white/10 transition-colors cursor-pointer" onClick={() => setIsAgreed(!isAgreed)}>
                                <div className="flex items-start gap-4">
                                    <div className={`mt-1 min-w-[20px] h-5 rounded-md border flex items-center justify-center transition-all ${isAgreed ? 'bg-indigo-500 border-indigo-500' : 'border-gray-600 bg-black/20'}`}>
                                        {isAgreed && <Check size={14} className="text-white" />}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-300 font-medium">유료 서비스 이용 약관 동의</p>
                                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                            정기 결제는 매월 자동 갱신되며, 언제든지 마이페이지에서 해지할 수 있습니다. 7일 무료 체험 기간 중에는 청구되지 않습니다.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Action */}
                        <div className="p-8 border-t border-white/10 bg-black/20 backdrop-blur-md">
                            <button
                                onClick={handlePayment}
                                disabled={isProcessing || !isAgreed}
                                className="relative w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_100%] animate-gradient text-white font-bold text-lg rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {isProcessing ? (
                                        <>
                                            <Loader size={20} className="animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Lock size={18} />
                                            Confirm Payment
                                        </>
                                    )}
                                </span>
                            </button>
                            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-600 uppercase tracking-widest">
                                <Shield size={10} />
                                256-bit SSL Encrypted Payment
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
