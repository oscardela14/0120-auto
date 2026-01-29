import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, Video, FileText, ArrowRight } from 'lucide-react';

export const ZeroStateTemplates = ({ onTemplateClick }) => {
    const templates = [
        {
            icon: Video,
            title: "바이럴 숏폼 아이디어",
            description: "15초 안에 시선을 사로잡는 숏폼 콘텐츠 스크립트",
            category: "YouTube Shorts",
            color: "bg-[#FF0000]",
            glow: "from-red-500 to-transparent",
            example: '"3초 안에 집중력을 끌어올리는 첫 문장 + 반전 구조"'
        },
        {
            icon: TrendingUp,
            title: "인스타 릴스 후킹 멘트",
            description: "스크롤을 멈추게 하는 강력한 오프닝 멘트 10가지",
            category: "Instagram Reels",
            color: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]",
            glow: "from-pink-500 to-purple-500",
            example: '"이것만 알면 팔로워 3배... 그런데 아무도 안 알려줌"'
        },
        {
            icon: FileText,
            title: "네이버 블로그 SEO 템플릿",
            description: "검색 상위 노출을 위한 블로그 글 구조",
            category: "Naver Blog",
            color: "bg-[#03C75A]",
            glow: "from-green-500 to-emerald-500",
            example: '"제목/서론/본론/결론 + 자연스러운 키워드 배치"'
        },
        {
            icon: Lightbulb,
            title: "스레드 바이럴 글감",
            description: "공감과 리트윗을 부르는 스레드형 콘텐츠",
            category: "Threads",
            color: "bg-black border border-white/20",
            glow: "from-gray-500 to-black",
            example: '"감정 자극 → 공감대 형성 → 행동 유도 3단 구조"'
        }
    ];

    return (
        <div className="mb-12">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-indigo-500/20 rounded-2xl">
                    <Lightbulb className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-white tracking-tight">
                        다른 사람들은 이런 콘텐츠를 만들고 있어요
                    </h3>
                    <p className="text-sm font-medium text-gray-500">
                        인기 템플릿을 선택하고 바로 시작하세요
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {templates.map((template, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => onTemplateClick && onTemplateClick(template)}
                        className="group relative bg-[#13151c]/50 border border-white/5 rounded-[28px] p-8 hover:border-white/10 hover:bg-[#1a1c26]/80 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col h-full shadow-xl"
                    >
                        {/* Gradient Background Glow */}
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${template.glow} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-700`}></div>

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex flex-col items-start gap-4 mb-5">
                                <div className={`${template.color} w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shrink-0`}>
                                    <template.icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                                </div>
                                <div className="flex-1 w-full">
                                    <h4 className="font-black text-white text-xl leading-snug mb-2 group-hover:text-indigo-400 transition-colors break-keep">
                                        {template.title}
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-black text-gray-400 bg-white/5 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                                            {template.category}
                                        </span>
                                        <div className="w-1 h-1 rounded-full bg-gray-700"></div>
                                        <span className="text-xs font-bold text-gray-600">
                                            {Math.floor(Math.random() * 500 + 100)}명 활성
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-gray-500 text-sm font-medium mb-6 leading-relaxed break-keep">
                                {template.description}
                            </p>

                            <div className="mt-auto">
                                <div className="bg-black/40 border border-white/5 rounded-2xl p-4 group-hover:bg-black/60 transition-colors">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
                                        <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">PRO 예시</p>
                                    </div>
                                    <p className="text-sm text-gray-300 font-medium italic break-keep leading-snug">
                                        {template.example}
                                    </p>
                                </div>

                                <div className="mt-5 flex items-center justify-end">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-xs font-black text-white group-hover:bg-indigo-500 transition-all duration-300">
                                        템플릿 적용 <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
