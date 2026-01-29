
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Lock, CreditCard, HelpCircle, ChevronRight, MessageSquare, Mail, Check, Loader } from 'lucide-react';
import { TERMS_AND_CONDITIONS, PRIVACY_POLICY, REFUND_POLICY, FAQ_DATA } from '../lib/legal_data';

const LegalModal = ({ isOpen, onClose, initialTab = 'terms' }) => {
    const [activeTab, setActiveTab] = useState(initialTab); // terms, privacy, refund, support

    if (!isOpen) return null;

    const renderContent = () => {
        switch (activeTab) {
            case 'terms':
                return <LegalText title="이용약관" content={TERMS_AND_CONDITIONS} icon={<Shield className="w-5 h-5 text-blue-400" />} />;
            case 'privacy':
                return <LegalText title="개인정보처리방침" content={PRIVACY_POLICY} icon={<Lock className="w-5 h-5 text-green-400" />} />;
            case 'refund':
                return <LegalText title="환불 규정" content={REFUND_POLICY} icon={<CreditCard className="w-5 h-5 text-purple-400" />} />;
            case 'support':
                return <SupportCenter />;
            default:
                return null;
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-[#1A1F2C] border border-white/10 w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl overflow-hidden flex"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Sidebar Navigation */}
                    <div className="w-64 bg-[#141822] border-r border-white/5 flex flex-col">
                        <div className="p-6 border-b border-white/5">
                            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                                고객센터
                            </h2>
                            <p className="text-xs text-gray-500 mt-1">정책 및 지원</p>
                        </div>
                        <nav className="flex-1 p-4 space-y-2">
                            <SidebarItem
                                id="terms"
                                label="이용약관"
                                icon={<Shield size={18} />}
                                active={activeTab === 'terms'}
                                onClick={() => setActiveTab('terms')}
                            />
                            <SidebarItem
                                id="privacy"
                                label="개인정보처리방침"
                                icon={<Lock size={18} />}
                                active={activeTab === 'privacy'}
                                onClick={() => setActiveTab('privacy')}
                            />
                            <SidebarItem
                                id="refund"
                                label="환불 규정"
                                icon={<CreditCard size={18} />}
                                active={activeTab === 'refund'}
                                onClick={() => setActiveTab('refund')}
                            />
                            <div className="my-4 border-t border-white/5 mx-2"></div>
                            <SidebarItem
                                id="support"
                                label="1:1 문의 / FAQ"
                                icon={<HelpCircle size={18} />}
                                active={activeTab === 'support'}
                                onClick={() => setActiveTab('support')}
                            />
                        </nav>
                        <div className="p-4 bg-white/5 m-4 rounded-xl">
                            <p className="text-xs text-gray-400 mb-2">문의사항이 있으신가요?</p>
                            <a href="mailto:support@antigravity.com" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                <Mail size={12} /> support@antigravity.com
                            </a>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col relative w-full overflow-hidden">

                        {/* Header for Mobile/Tablet context mainly, but good for aesthetics */}
                        <div className="absolute top-0 right-0 p-4 z-10">
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                            {renderContent()}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const SidebarItem = ({ id, label, icon, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${active
            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-inner'
            : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
    >
        {icon}
        {label}
        {active && <ChevronRight className="ml-auto w-4 h-4 opacity-50" />}
    </button>
);

const LegalText = ({ title, content, icon }) => (
    <div className="animate-in fade-in duration-300">
        <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                {icon}
            </div>
            <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-line leading-relaxed p-6 bg-[#13161c] rounded-2xl border border-white/5">
            {content}
        </div>
    </div>
);

const SupportCenter = () => {
    const [inquiryType, setInquiryType] = useState('payment'); // payment, bug, partnership, etc
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSending(true);
        setError('');

        // EmailJS Integration
        // 사용 방법:
        // 1. https://www.emailjs.com/ 가입
        // 2. Email Service 연결 (Gmail 등)
        // 3. Email Template 생성
        // 4. 아래 값들을 본인 계정 정보로 교체

        const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // EmailJS Service ID
        const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // EmailJS Template ID
        const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // EmailJS Public Key

        const templateParams = {
            from_email: email,
            inquiry_type: inquiryType,
            message: message,
            to_email: 'your-email@gmail.com' // 받을 이메일 주소
        };

        try {
            // EmailJS가 설정되지 않은 경우 시뮬레이션
            if (EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID') {
                console.log('📧 EmailJS 설정 대기 중. 시뮬레이션 모드로 실행합니다.');
                console.log('문의 내용:', templateParams);
                await new Promise(resolve => setTimeout(resolve, 1500));
                setIsSent(true);
            } else {
                // 실제 EmailJS 전송
                const emailjs = window.emailjs;
                await emailjs.send(
                    EMAILJS_SERVICE_ID,
                    EMAILJS_TEMPLATE_ID,
                    templateParams,
                    EMAILJS_PUBLIC_KEY
                );
                setIsSent(true);
            }

            // Reset form after success
            setTimeout(() => {
                setIsSent(false);
                setMessage('');
                setEmail('');
                setInquiryType('payment');
            }, 3000);
        } catch (err) {
            console.error('EmailJS Error:', err);
            setError('문의 전송에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="animate-in fade-in duration-300 space-y-8 pb-8">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/20">
                    <HelpCircle className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold">무엇을 도와드릴까요?</h2>
                    <p className="text-gray-400 text-sm">자주 묻는 질문을 확인하거나 직접 문의해주세요.</p>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white/90 px-1">자주 묻는 질문 (FAQ)</h3>
                <div className="grid gap-3">
                    {FAQ_DATA.map((item, index) => (
                        <div key={index} className="bg-[#13161c] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors">
                            <h4 className="font-medium text-blue-300 mb-2 flex items-start gap-2">
                                <span className="text-blue-500/50">Q.</span> {item.question}
                            </h4>
                            <p className="text-gray-400 text-sm pl-6 leading-relaxed">
                                {item.answer}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact Form Section */}
            <div className="pt-8 border-t border-white/5">
                <h3 className="text-lg font-semibold text-white/90 px-1 mb-4">1:1 문의접수</h3>

                {isSent ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 text-center"
                    >
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check size={32} className="text-green-500" />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">문의가 접수되었습니다!</h4>
                        <p className="text-gray-300">
                            빠른 시일 내에 기재하신 이메일로 답변 드리겠습니다.<br />
                            (평균 응답시간: 24시간 이내)
                        </p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-[#13161c] border border-white/5 rounded-2xl p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5 ml-1">문의 유형</label>
                                <select
                                    value={inquiryType}
                                    onChange={(e) => setInquiryType(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:border-blue-500 outline-none transition-colors"
                                >
                                    <option value="payment">결제 및 환불 문의</option>
                                    <option value="bug">버그 신고 및 장애</option>
                                    <option value="partnership">제휴 및 기업 문의</option>
                                    <option value="etc">기타 문의</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5 ml-1">답변받을 이메일</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="example@email.com"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1.5 ml-1">문의 내용</label>
                            <textarea
                                required
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="자세한 내용을 적어주시면 더 빠른 해결이 가능합니다."
                                rows={5}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors resize-none"
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm flex items-center gap-2"
                            >
                                <X size={16} />
                                {error}
                            </motion.div>
                        )}

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={isSending || !message || !email}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSending ? (
                                    <>
                                        <Loader className="animate-spin" size={18} />
                                        전송 중...
                                    </>
                                ) : (
                                    <>
                                        <MessageSquare size={18} />
                                        문의하기
                                    </>
                                )}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 text-center mt-4">
                            운영 시간: 평일 10:00 ~ 18:00 (주말/공휴일 휴무)
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LegalModal;
