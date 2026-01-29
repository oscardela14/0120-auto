
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bell, HelpCircle, Mail, User, ChevronRight, CheckCircle2, RefreshCw } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

export const SupportBot = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'inquiry' | 'notifications'
    const { user, notifications, addNotification, isAuthenticated } = useUser();

    // Chat State
    const [messages, setMessages] = useState([
        { id: 1, type: 'bot', text: '안녕하세요! ContentStudio AI 서포트 봇입니다. 무엇을 도와드릴까요? 😊' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const chatEndRef = useRef(null);

    // Inquiry State
    const [inquiryText, setInquiryText] = useState('');
    const [inquirySent, setInquirySent] = useState(false);

    // Notification History (Mocking persistent history + current toast notifications)
    const [historyNotifications, setHistoryNotifications] = useState([
        { id: 'h1', message: '회원가입을 환영합니다! Creator 무료 체험을 시작해보세요.', type: 'info', time: '2일 전' },
        { id: 'h2', message: 'YouTube Shorts 트렌드 분석이 완료되었습니다.', type: 'success', time: '어제' }
    ]);

    useEffect(() => {
        if (isOpen && activeTab === 'chat') {
            // Scroll to bottom of chat
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isOpen, messages, activeTab]);

    // Reset on Login/Logout
    useEffect(() => {
        setMessages([{ id: Date.now(), type: 'bot', text: '안녕하세요! ContentStudio AI 서포트 봇입니다. 무엇을 도와드릴까요? 😊' }]);
        setInquiryText('');
        setInquirySent(false);
        setActiveTab('chat');
    }, [isAuthenticated]);

    const handleResetChat = () => {
        setMessages([{ id: Date.now(), type: 'bot', text: '안녕하세요! ContentStudio AI 서포트 봇입니다. 무엇을 도와드릴까요? 😊' }]);
    };

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const userMsg = { id: Date.now(), type: 'user', text: inputValue };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');

        // Simple Auto-Reply Logic
        setTimeout(() => {
            let botReply = '';
            if (inputValue.includes('사용법') || inputValue.includes('가이드')) {
                botReply = "'이용 가이드' 메뉴에서 상세한 플랫폼별 사용법을 확인하실 수 있습니다. 특히 '트렌드 찾기' 기능을 추천드려요!";
            } else if (inputValue.includes('가격') || inputValue.includes('요금')) {
                botReply = "멤버십 메뉴에서 다양한 플랜을 확인해보세요. 현재 연간 결제 시 30% 할인 혜택을 제공하고 있습니다.";
            } else if (inputValue.includes('오류') || inputValue.includes('에러')) {
                botReply = "이용에 불편을 드려 죄송합니다. '문의하기' 탭에서 상세 내용을 남겨주시면 빠르게 확인해 드리겠습니다.";
            } else {
                botReply = "제가 이해하기 어려운 질문이네요 😅 '문의하기' 탭을 이용해 주시거나, 다른 질문을 해주세요.";
            }
            setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: botReply }]);
        }, 1000);
    };

    const handleSendInquiry = () => {
        if (!inquiryText.trim()) return;
        setInquirySent(true);
        // Simulate API
        setTimeout(() => {
            setInquirySent(false);
            setInquiryText('');
            // Add Notification
            addNotification('문의가 정상적으로 접수되었습니다. (Ticket #4023)', 'success');

            // Switch to chat and confirm
            setActiveTab('chat');
            setMessages(prev => [...prev, { id: Date.now(), type: 'bot', text: '✅ 문의가 접수되었습니다. 이메일로 답변 드리겠습니다.' }]);
        }, 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.9 }}
                    className="fixed bottom-6 right-6 w-[380px] h-[600px] bg-[#1a1b26] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[9999]"
                >
                    {/* Header */}
                    <div className="bg-surface border-b border-white/5 p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
                                <MessageCircle size={20} className="text-white fill-white/20" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm">AI 서포트 센터</h3>
                                <p className="text-xs text-green-400 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                    상담 가능
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-white/5 bg-black/20">
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={`flex-1 py-3 text-xs font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'chat' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-400 hover:text-white'}`}
                        >
                            <HelpCircle size={14} /> AI 가이드
                        </button>
                        <button
                            onClick={() => setActiveTab('inquiry')}
                            className={`flex-1 py-3 text-xs font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'inquiry' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Mail size={14} /> 문의하기
                        </button>
                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={`flex-1 py-3 text-xs font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'notifications' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Bell size={14} /> 알림 센터
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/40 relative">
                        {activeTab === 'chat' && (
                            <div className="p-4 space-y-4">
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleResetChat}
                                        className="text-[10px] text-gray-500 flex items-center gap-1 hover:text-primary transition-colors bg-white/5 px-2 py-1 rounded-full border border-white/5"
                                    >
                                        <RefreshCw size={10} /> 대화 초기화
                                    </button>
                                </div>
                                {messages.map(msg => (
                                    <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.type === 'user'
                                            ? 'bg-primary text-white rounded-tr-none'
                                            : 'bg-white/10 text-gray-200 rounded-tl-none'
                                            }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                {/* Recommendation Chips (Initial State or after Reset) */}
                                {messages.length === 1 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {['이용 가이드 알려줘', '요금제 가격은?', '오류 신고'].map(chip => (
                                            <button
                                                key={chip}
                                                onClick={() => {
                                                    setInputValue(chip);
                                                    // Trigger send effect manually for UX
                                                    // Due to closure, we just set input for now, user presses enter. 
                                                    // Or separate send function call logic.
                                                    setInputValue(chip);
                                                }}
                                                className="px-3 py-1.5 bg-surface border border-white/10 rounded-full text-xs text-gray-400 hover:border-primary hover:text-primary transition-colors"
                                            >
                                                {chip}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <div ref={chatEndRef}></div>
                            </div>
                        )}

                        {activeTab === 'inquiry' && (
                            <div className="p-6 h-full flex flex-col">
                                {inquirySent ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in">
                                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                                            <CheckCircle2 size={32} className="text-green-500" />
                                        </div>
                                        <h4 className="text-white font-bold mb-2">접수 완료!</h4>
                                        <p className="text-gray-400 text-sm">빠른 시일 내에 답변 드리겠습니다.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-4">
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">문의 내용</label>
                                            <textarea
                                                className="w-full h-40 bg-black/20 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-primary transition-colors resize-none mb-2"
                                                placeholder="무엇이 궁금하신가요? 상세히 적어주시면 더 정확한 답변이 가능합니다."
                                                value={inquiryText}
                                                onChange={(e) => setInquiryText(e.target.value)}
                                            ></textarea>
                                        </div>
                                        <div className="text-xs text-gray-500 mb-auto">
                                            * 평일 10:00 - 18:00 순차 답변 드립니다.
                                        </div>
                                        <button
                                            onClick={handleSendInquiry}
                                            disabled={!inquiryText.trim()}
                                            className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${inquiryText.trim() ? 'bg-primary text-white hover:bg-primary/90' : 'bg-white/5 text-gray-500 cursor-not-allowed'
                                                }`}
                                        >
                                            <Send size={16} /> 문의 보내기
                                        </button>
                                    </>
                                )}
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="p-4 space-y-2">
                                {/* Real Notifications from UserContext */}
                                {notifications.map(n => (
                                    <div key={n.id} className="p-4 bg-surface/40 border border-white/10 rounded-xl flex gap-3 animate-fade-in">
                                        <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                                        <div>
                                            <p className="text-sm text-gray-200 leading-snug">{n.message}</p>
                                            <span className="text-[10px] text-gray-500 mt-1 block">방금 전 (New)</span>
                                        </div>
                                    </div>
                                ))}

                                {/* Mock History */}
                                {historyNotifications.map(n => (
                                    <div key={n.id} className="p-4 bg-black/20 border border-white/5 rounded-xl flex gap-3 opacity-70 hover:opacity-100 transition-opacity">
                                        <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.type === 'success' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                                        <div>
                                            <p className="text-sm text-gray-300 leading-snug">{n.message}</p>
                                            <span className="text-[10px] text-gray-500 mt-1 block">{n.time}</span>
                                        </div>
                                    </div>
                                ))}
                                <div className="text-center pt-4 pb-2 text-xs text-gray-600">
                                    최근 30일 내역만 표시됩니다.
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Input (Only for Chat) */}
                    {activeTab === 'chat' && (
                        <div className="p-3 bg-surface border-t border-white/5">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="메시지를 입력하세요..."
                                    className="w-full bg-black/30 border border-white/10 rounded-full pl-5 pr-12 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary/90 transition-colors"
                                >
                                    <Send size={14} />
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};
