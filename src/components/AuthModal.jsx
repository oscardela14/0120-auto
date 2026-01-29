import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Chrome, Github, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

export const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
    const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, signup, loginWithGoogle } = useUser();

    // Auto-fill admin name
    React.useEffect(() => {
        if (email === 'admin@master.com') {
            setName('Master Administrator');
        }
    }, [email]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Basic validation
        if (!email || !password) {
            setError('이메일과 비밀번호를 입력해주세요.');
            setIsLoading(false);
            return;
        }

        if (mode === 'signup' && !name) {
            setError('이름을 입력해주세요.');
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('비밀번호는 최소 6자 이상이어야 합니다.');
            setIsLoading(false);
            return;
        }

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (mode === 'login') {
                login(email, password);
            } else {
                signup(email, password, name);
            }

            onClose();
        } catch (err) {
            setError('로그인/회원가입에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async (provider) => {
        if (provider === 'google') {
            try {
                await loginWithGoogle();
                // Redirect happens, no need to manually close immediately but prevents flicker
                onClose();
            } catch (error) {
                setError('Google 로그인 연결에 실패했습니다.');
            }
        } else {
            // Simulate other social logins
            const email = `user@${provider}.com`;
            login(email, 'social_login');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-md bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-lg transition-colors z-10"
                    >
                        <X size={20} className="text-gray-400" />
                    </button>

                    {/* Header */}
                    <div className="p-8 pb-4">
                        <h2 className="text-2xl font-bold text-white mb-2">
                            {mode === 'login' ? '로그인' : '회원가입'}
                        </h2>
                        <p className="text-gray-400 text-sm">
                            {mode === 'login'
                                ? 'ContentStudio AI로 돌아오신 것을 환영합니다!'
                                : 'AI로 콘텐츠 제작을 자동화하세요'}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-8 pb-8" autoComplete="off">
                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* Name (Signup only) */}
                        {mode === 'signup' && (
                            <div className="mb-4">
                                <label className="block text-sm text-gray-400 mb-2">이름</label>
                                <div className="relative">
                                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="홍길동"
                                        autoComplete="off"
                                        className="w-full bg-black/30 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <div className="mb-4">
                            <label className="block text-sm text-gray-400 mb-2">이메일</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    autoComplete="off"
                                    className="w-full bg-black/30 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="mb-6">
                            <label className="block text-sm text-gray-400 mb-2">비밀번호</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    className="w-full bg-black/30 border border-white/10 rounded-lg pl-10 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-gradient-to-r from-primary to-purple-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    >
                                        <CheckCircle2 size={20} />
                                    </motion.div>
                                    처리 중...
                                </>
                            ) : (
                                mode === 'login' ? '로그인' : '회원가입'
                            )}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-6">
                            <div className="flex-1 h-px bg-white/10"></div>
                            <span className="text-gray-500 text-sm">또는</span>
                            <div className="flex-1 h-px bg-white/10"></div>
                        </div>

                        {/* Social Login */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => handleSocialLogin('google')}
                                className="py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Chrome size={18} />
                                <span className="text-sm">Google</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSocialLogin('github')}
                                className="py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Github size={18} />
                                <span className="text-sm">GitHub</span>
                            </button>
                        </div>

                        {/* Toggle Mode */}
                        <div className="mt-6 text-center text-sm text-gray-400">
                            {mode === 'login' ? (
                                <>
                                    계정이 없으신가요?{' '}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMode('signup');
                                            setError('');
                                        }}
                                        className="text-primary hover:underline font-semibold"
                                    >
                                        회원가입
                                    </button>
                                </>
                            ) : (
                                <>
                                    이미 계정이 있으신가요?{' '}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMode('login');
                                            setError('');
                                        }}
                                        className="text-primary hover:underline font-semibold"
                                    >
                                        로그인
                                    </button>
                                </>
                            )}
                        </div>
                    </form>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-primary"></div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
