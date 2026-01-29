
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Globe, Shield, AlertCircle, Loader, Lock, User } from 'lucide-react';
import clsx from 'clsx';

export const ConnectAccountModal = ({ isOpen, onClose, onConnect, platform }) => {
    const [status, setStatus] = useState('idle'); // idle, connecting, success, error
    const [formData, setFormData] = useState({ id: '', password: '' });

    // Reset when opening
    useEffect(() => {
        if (isOpen) {
            setStatus('idle');
            setFormData({ id: '', password: '' });
        }
    }, [isOpen]);

    const handleConnect = (e) => {
        e.preventDefault();

        if (!formData.id || !formData.password) return;

        setStatus('connecting');
        // Simulate OAuth Process
        setTimeout(() => {
            setStatus('success');
            setTimeout(() => {
                onConnect(platform);
                onClose();
            }, 1500);
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            >
                <div
                    className="absolute inset-0"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="relative w-full max-w-sm bg-[#1C1C1E] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-5 border-b border-white/5 bg-white/5">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
                            {platform} 연결
                        </h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                        {status === 'idle' && (
                            <form onSubmit={handleConnect} className="flex flex-col gap-4">
                                <div className="text-center mb-2">
                                    <div className="w-16 h-16 mx-auto rounded-2xl bg-surface border border-white/10 flex items-center justify-center mb-4 shadow-lg">
                                        <img
                                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${platform}&backgroundColor=1a1f2e`}
                                            alt={platform}
                                            className="w-10 h-10 rounded-full"
                                        />
                                    </div>
                                    <p className="text-gray-400 text-sm">
                                        계정 정보를 입력하여 <br />
                                        <span className="text-white font-semibold">{platform}</span>에 로그인하세요.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                            <User size={16} />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="아이디 또는 이메일"
                                            value={formData.id}
                                            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                            className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary transition-colors placeholder:text-gray-600"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                            <Lock size={16} />
                                        </div>
                                        <input
                                            type="password"
                                            placeholder="비밀번호"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary transition-colors placeholder:text-gray-600"
                                        />
                                    </div>
                                </div>

                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex items-start gap-2 mt-2">
                                    <Shield size={14} className="text-blue-400 mt-0.5 shrink-0" />
                                    <p className="text-xs text-blue-300/80 leading-relaxed">
                                        계정 정보는 안전하게 암호화되어 저장되며, 자동 업로드 외의 목적으로 사용되지 않습니다.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!formData.id || !formData.password}
                                    className="w-full py-3.5 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center shadow-lg shadow-primary/25 mt-2"
                                >
                                    연결하기
                                </button>
                            </form>
                        )}

                        {status === 'connecting' && (
                            <div className="py-12 text-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    className="mb-6 mx-auto inline-block"
                                >
                                    <div className="relative">
                                        <div className="w-16 h-16 border-4 border-white/10 border-t-primary rounded-full"></div>
                                    </div>
                                </motion.div>
                                <h4 className="text-lg font-bold text-white mb-2">연결 중...</h4>
                                <p className="text-gray-500 text-sm">계정 정보를 확인하고 있습니다.</p>
                            </div>
                        )}

                        {status === 'success' && (
                            <div className="py-12 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                                >
                                    <Check size={32} strokeWidth={3} />
                                </motion.div>
                                <h4 className="text-xl font-bold text-white mb-2">연결 성공!</h4>
                                <p className="text-gray-400 text-sm">이제 자동 업로드가 가능합니다.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
