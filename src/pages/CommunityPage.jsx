
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, Share2, Copy, Filter, MessageSquare, Zap, Hash, Video, Type, Sparkles, Loader2, Info, Instagram } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { SEOHead } from '../components/SEOHead';
import { generateCommunityPrompts } from '../lib/gemini';

// Custom simple debounce implementation
const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

const PlatformIcon = ({ type }) => {
    const icons = {
        youtube: { icon: Video, color: "bg-[#FF0000]", text: null },
        instagram: { icon: Instagram, color: "bg-gradient-to-tr from-[#FFD600] via-[#FF0169] to-[#D300C5]", text: null },
        blog: { icon: null, color: "bg-[#03C75A]", text: "N" },
        threads: { icon: null, color: "bg-black border border-white/20", text: "@" }
    };

    const config = icons[type] || icons.blog;
    const Icon = config.icon;

    return (
        <div className={`w-10 h-10 rounded-xl ${config.color} flex items-center justify-center shadow-lg shrink-0`}>
            {Icon ? <Icon size={20} className="text-white fill-white" /> : <span className="text-white font-black text-xl">{config.text}</span>}
        </div>
    );
};

const PromptCard = ({ item, onUse }) => {
    const [liked, setLiked] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative bg-[#0f1218] border border-white/5 rounded-2xl overflow-hidden hover:border-primary/30 transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
        >
            <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                    <PlatformIcon type={item.type} />
                    <div className="min-w-0 flex-1">
                        <h3 className="text-white font-bold text-sm leading-tight group-hover:text-primary transition-colors truncate">{item.title}</h3>
                        <p className="text-[10px] text-gray-500">by {item.author} • {item.date}</p>
                    </div>
                </div>

                <div className="bg-white/5 rounded-xl p-3 mb-4 border border-white/5 group-hover:bg-white/10 transition-colors relative">
                    <p className="text-gray-300 text-[11px] leading-relaxed line-clamp-3 font-mono">
                        "{item.prompt}"
                    </p>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-2 cursor-pointer"
                        onClick={() => {
                            navigator.clipboard.writeText(item.prompt);
                        }}>
                        <span className="text-[10px] bg-primary text-white px-2 py-1 rounded-lg flex items-center gap-1 font-bold">
                            <Copy size={10} /> 복사
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setLiked(!liked)}
                            className={`flex items-center gap-1 text-[10px] transition-colors ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-400'}`}
                        >
                            <Heart size={14} className={liked ? "fill-red-500" : ""} /> {item.likes + (liked ? 1 : 0)}
                        </button>
                        <span className="flex items-center gap-1 text-[10px] text-gray-500">
                            <Share2 size={14} /> {item.shares}
                        </span>
                    </div>
                    <button
                        onClick={() => onUse(item)}
                        className="text-[10px] font-bold text-primary hover:text-indigo-300 flex items-center gap-1 transition-colors"
                    >
                        <Zap size={14} /> 사용하기
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const CommunityPage = () => {
    const { user, addNotification } = useUser();
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [aiPrompts, setAiPrompts] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const MOCK_PROMPTS = [
        // YouTube (9)
        { id: 'yt-1', type: 'youtube', title: '조회수 100만 쇼츠: 반전 드라마', author: 'ViralKing', date: '2시간 전', prompt: '초반 3초에 시청자의 예상을 깨는 질문을 던지고, 15초 구간에서 첫 번째 반전을 주는 구성을 만들어줘. 마지막에는 논란이 될만한 열린 결말로 끝내.', likes: 142, shares: 45 },
        { id: 'yt-2', type: 'youtube', title: '제품 리뷰: 단점 깐깐하게', author: 'Reviewer_Z', date: '1일 전', prompt: '장점만 나열하는 광고성 리뷰 말고, 실제 사용자가 느낄법한 사소한 단점 3가지를 먼저 언급하고, 그럼에도 불구하고 왜 사야 하는지 역설적으로 설득하는 스크립트.', likes: 112, shares: 34 },
        { id: 'yt-3', type: 'youtube', title: '미스테리 스릴러: 미제 사건', author: 'MysteryGuy', date: '3시간전', prompt: '국내외 유명 미제 사건의 핵심 미스테리 3가지를 짧고 강렬하게 소개하고, 시청자의 가설을 댓글로 유도하는 쇼츠 스크립트 작성.', likes: 88, shares: 20 },
        { id: 'yt-4', type: 'youtube', title: '캠핑 브이로그: ASMR 오감', author: 'NatureLover', date: '6시간 전', prompt: '빗소리, 불멍, 고기 굽는 소리를 시각적 묘사와 함께 배치해줘. 대사는 최소화하고 현장감을 극대화하는 구성.', likes: 231, shares: 56 },
        { id: 'yt-5', type: 'youtube', title: '주식 투자: 하락장 생존법', author: 'MoneyMaker', date: '1일 전', prompt: '공포에 질린 투자자들을 다독이는 차분한 어조로 시작해서, 위기 속에 숨겨진 기회 3가지를 지표와 함께 설명하는 60초 대본.', likes: 156, shares: 44 },
        { id: 'yt-6', type: 'youtube', title: '여행 꿀팁: 구글맵 200% 활용', author: 'TravelExpert', date: '2일 전', prompt: '일반인은 모르는 구글맵의 숨겨진 기능(오프라인 저장, 내 장소 공유 등) 3가지를 화면 시연 위주로 설명하는 빠른 템포의 스크립트.', likes: 412, shares: 120 },
        { id: 'yt-7', type: 'youtube', title: '동기부여: 무명 시절의 깨달음', author: 'SuccessMind', date: '3일 전', prompt: '성공한 사람의 과거 실패담을 흑백 톤으로 묘사하다가 현재의 성공으로 대비시키는 감동적인 서사 구조 제작.', likes: 520, shares: 210 },
        { id: 'yt-8', type: 'youtube', title: 'IT 가젯: 써보고 욕한 제품', author: 'TechGeek', date: '4일 전', prompt: '스펙은 좋지만 실제 사용성이 최악인 제품을 정색하며 비판하다가 마지막에 반전 웃음 포인트를 주는 리뷰 구성.', likes: 215, shares: 62 },
        { id: 'yt-9', type: 'youtube', title: '운동 가이드: 스쿼트 정석 자세', author: 'FitMaster', date: '5일 전', prompt: "초보자가 가장 많이 하는 실수 3가지를 보여주고, 올바른 근육 타겟팅을 위한 팁을 '전문가 포스'로 전수하는 짧은 강좌.", likes: 304, shares: 98 },

        // Instagram (9)
        { id: 'ig-1', type: 'instagram', title: '감성 에세이 릴스 스크립트', author: 'DailyMood', date: '5시간 전', prompt: '퇴근길 직장인의 지친 마음을 위로하는 따뜻한 독백 톤으로 작성해줘. 배경음악은 잔잔한 피아노곡이 어울리도록 호흡을 길게 가져가고, 마지막엔 "오늘도 수고했어"라는 멘트로 마무리.', likes: 89, shares: 23 },
        { id: 'ig-2', type: 'instagram', title: '다이어트 동기부여 명언', author: 'FitLife', date: '2일 전', prompt: '강압적인 명령조가 아니라, 내면의 변화를 이끌어내는 부드러운 권유형 문장으로 다이어트 자극 멘트 5가지를 뽑아줘. 이모지는 최소화하고 진정성을 담아.', likes: 340, shares: 156 },
        { id: 'ig-3', type: 'instagram', title: '홈테리어: 조명 하나로 변신', author: 'InteriorPro', date: '4시간 전', prompt: '비포/애프터가 확실하게 나뉘는 조명 인테리어 꿀팁. 저렴한 이케아 조명으로 호텔 분위기를 내는 마법같은 변화 묘사.', likes: 198, shares: 45 },
        { id: 'ig-4', type: 'instagram', title: '오늘 뭐 먹지? 레시피 릴스', author: 'HomeCook', date: '1일 전', prompt: '자취생도 5분 안에 끝낼 수 있는 초간단 레시피. 빠른 커트 편집과 경쾌한 박자감에 맞춘 스크립트.', likes: 276, shares: 89 },
        { id: 'ig-5', type: 'instagram', title: '출근룩: 1분 코디 완성', author: 'FashionVista', date: '2일 전', prompt: '월요일부터 금요일까지 OOTD(오늘의 코디)를 빠르게 보여주며 각 룩의 포인트 한 문장씩 전달.', likes: 145, shares: 32 },
        { id: 'ig-6', type: 'instagram', title: '심층 상담: 번아웃 극복법', author: 'MindCare', date: '3일 전', prompt: '번아웃 체크리스트 5개와 함께, 지금 당장 실천할 수 있는 작은 휴식법 3가지를 조곤조곤한 목소리로 전달.', likes: 450, shares: 180 },
        { id: 'ig-7', type: 'instagram', title: '반려동물: 고양이 마음 읽기', author: 'CatLover', date: '4일 전', prompt: '고양이의 꼬리 모양에 담긴 5가지 심리 상태. 집사들이 공감할 수 있는 상황극을 포함한 릴스 대본.', likes: 389, shares: 110 },
        { id: 'ig-8', type: 'instagram', title: '피부관리: 수분 크림 바르는 결', author: 'BeautyHacks', date: '5일 전', prompt: '피부 전문가가 가르쳐주는 수분 보충 마사지 결. 세안 직후 3분 골든타임을 강조하는 핵심 정보.', likes: 212, shares: 55 },
        { id: 'ig-9', type: 'instagram', title: '여행지 추천: 숨겨진 야경 명소', author: 'VisualTravel', date: '6일 전', prompt: '사람들이 잘 모르는 도심 속 루프탑이나 명당 자리를 화려한 야경 영상과 함께 소개하는 스크립트.', likes: 620, shares: 245 },

        // Blog (9)
        { id: 'bl-1', type: 'blog', title: '체류시간 늘리는 정보성 글쓰기', author: 'InfoMaster', date: '1일 전', prompt: '전문적인 용어보다는 5학년 초등학생도 이해할 수 있는 쉬운 비유를 사용해서 "양자역학"을 설명해줘. 중간중간 퀴즈를 넣어서 독자가 이탈하지 않도록 유도해.', likes: 256, shares: 102 },
        { id: 'bl-2', type: 'blog', title: '맛집 리뷰: 오감 자극 묘사', author: 'TastyRoad', date: '3일 전', prompt: '단순히 "맛있다"가 아니라, 입안에서 느껴지는 식감과 향기를 문학적으로 표현해줘. 요리가 나왔을 때의 시각적 묘사부터 시작해서 후각, 미각 순으로 전개.', likes: 178, shares: 67 },
        { id: 'bl-3', type: 'blog', title: '독서 후기: 삶을 바꾼 한 문장', author: 'BookWorm', date: '4시간 전', prompt: '책 전체 줄거리보다 내 삶에 균열을 냈던 문장 하나를 중심으로 개인적인 에피소드를 담은 서평 작성.', likes: 92, shares: 18 },
        { id: 'bl-4', type: 'blog', title: '경제 용어: 금리 인상의 나공효과', author: 'EconomyEye', date: '1일 전', prompt: '미국 금리 인상이 내 대출 이자와 마트 장바구니 물가에 어떤 영향을 주는지 인과관계 위주로 설명.', likes: 310, shares: 85 },
        { id: 'bl-5', type: 'blog', title: '디지털 노마드: 첫 수익 인증', author: 'SoloBiz', date: '2일 전', prompt: '자랑이 아니라, 0원에서 10만원까지 가는 과정을 시행착오 위주로 서술하여 독자의 도전 욕구 자극.', likes: 580, shares: 290 },
        { id: 'bl-6', type: 'blog', title: '전자기기 비교: 아이폰 vs 갤럭시', author: 'GadgetFan', date: '3일 전', prompt: '스펙 시트 말고, 보정 없이 찍은 사진 10장과 함께 실생활 카메라 성능 차이만 집중적으로 분석.', likes: 245, shares: 77 },
        { id: 'bl-7', type: 'blog', title: '자기계발: 새벽 5시 기상 후기', author: 'EarlyBird', date: '4일 전', prompt: '한 달간의 기상 기록과 함께, 뇌 과학적으로 새벽 시간이 왜 생산적인지 증명하는 논리적인 글.', likes: 399, shares: 120 },
        { id: 'bl-8', type: 'blog', title: '인테리어: 10평 자취방 개조기', author: 'RoomDesign', date: '5일 전', prompt: '가구 배치 평면도부터 예산 내역서까지 포함한 실용적인 자취방 유니버설 디자인 팁.', likes: 412, shares: 156 },
        { id: 'bl-9', type: 'blog', title: '취미 추천: 가성비 좋은 등산로', author: 'MountainGo', date: '6일 전', prompt: '등산 초보자도 1시간 안에 정상에 가고, 인생샷도 건질 수 있는 서울 근교 코스 5곳 추천.', likes: 187, shares: 45 },

        // Threads (9)
        { id: 'th-1', type: 'threads', title: '논쟁 유발 일상 고민', author: 'DebatePro', date: '4시간 전', prompt: '사람들이 댓글로 싸우기 딱 좋은 일상적인 주제(예: 깻잎 논쟁, 더치페이)를 하나 던지고, A/B로 명확하게 갈리는 선택지를 제시해줘. 마지막엔 "너라면 어떻게 해?"로 마무리.', likes: 312, shares: 88 },
        { id: 'th-2', type: 'threads', title: '짧고 강한 뼈때리는 조언', author: 'FactAttack', date: '1일 전', prompt: '노력만 강조하는 뻔한 위로 말고, 현실적인 생존 전략을 3문장 이내로 줄 글로 작성. "불편하지만 꼭 들어야 할 말" 컨셉.', likes: 420, shares: 134 },
        { id: 'th-3', type: 'threads', title: '요즘 유행하는 밈 정리', author: 'TrendHunter', date: '2일 전', prompt: '현재 SNS에서 가장 핫한 신조어나 밈의 유래와 올바른 사용법을 짧은 문체로 설명.', likes: 156, shares: 40 },
        { id: 'th-4', type: 'threads', title: '퇴사 고민: 상사와의 대화법', author: 'JobAdvice', date: '3일 전', prompt: '무례하지 않으면서도 자신의 의사를 확실히 전달하는 퇴사 의사 표현 템플릿 3가지.', likes: 289, shares: 76 },
        { id: 'th-5', type: 'threads', title: '연애 조언: 카톡 답장 속도', author: 'LoveCoach', date: '4일 전', prompt: '상대방의 답장 속도에 일희일비하지 않는 마인드셋과 밀당의 기술 2문장 요약.', likes: 367, shares: 92 },
        { id: 'th-6', type: 'threads', title: '공부 자극: 10시간 집중 루틴', author: 'StudyHard', date: '5일 전', prompt: '의지력이 아닌 환경 설정으로만 이루어지는 뽀모도로 기법 변형 루틴 공유.', likes: 198, shares: 44 },
        { id: 'th-7', type: 'threads', title: '영화 추천: 주말 정주행 작품', author: 'Movielog', date: '1일 전', prompt: '넷플릭스에서 시간 아깝지 않은 웰메이드 스릴러 드라마 3개 짧게 추천.', likes: 145, shares: 28 },
        { id: 'th-8', type: 'threads', title: '맛집 실패담: 여긴 절대 가지마', author: 'HaterFood', date: '2일 전', prompt: '블로그 광고에 속아서 간 뒤통수 친 식당 특징 3가지 공유 (공익 목적 강조).', likes: 612, shares: 231 },
        { id: 'th-9', type: 'threads', title: '재테크 초보: 100만원 투자 시작', author: 'PennyWise', date: '3일 전', prompt: '소액으로 주식이나 가상화폐를 시작할 때 반드시 걸러야 할 유튜버 특징.', likes: 234, shares: 55 }
    ];

    const generateAiPrompts = async (query) => {
        if (!query || query.length < 2) return;
        setIsGenerating(true);
        try {
            const results = await generateCommunityPrompts(query);
            setAiPrompts(results);
            addNotification(`🤖 AI 에이전트가 '${query}' 맞춤 프롬프트 6개를 생성했습니다.`, 'success');
        } catch (e) {
            console.error(e);
            addNotification("AI 프롬프트 생성에 실패했습니다.", "error");
        } finally {
            setIsGenerating(false);
        }
    };

    // Debounced search logic for AI agent
    const debouncedAiGenerate = useCallback(
        debounce((q) => generateAiPrompts(q), 800),
        []
    );

    useEffect(() => {
        if (search.length > 2) {
            debouncedAiGenerate(search);
        } else {
            setAiPrompts([]);
        }
    }, [search]);

    const filteredPrompts = MOCK_PROMPTS.filter(p =>
        (filter === 'all' || p.type === filter) &&
        (p.title.includes(search) || p.prompt.includes(search))
    );

    return (
        <div className="p-4 md:p-8 max-w-[1440px] mx-auto min-h-screen">
            <SEOHead title="프롬프트 광장 | ContentStudio" description="검증된 고성능 프롬프트를 공유하고 사용해보세요." />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3 tracking-tight">
                        <MessageSquare className="text-primary" /> 프롬프트 광장
                    </h1>
                    <p className="text-gray-400 text-sm">
                        상위 1% 크리에이터들이 사용하는 <span className="text-white font-semibold">검증된 프롬프트</span>를 발견하세요.
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-white/5 p-1 rounded-2xl border border-white/5 shadow-xl">
                    {['all', 'youtube', 'instagram', 'blog', 'threads'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-xs font-black capitalize transition-all duration-300 ${filter === f
                                ? 'bg-primary text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                                : 'text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {f === 'all' ? 'All' : f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-10 group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-purple-500/50 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition-all duration-500"></div>
                <div className="relative flex items-center bg-[#0b0f19] border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all group-focus-within:border-primary/50">
                    <Search className="absolute left-6 text-gray-500" size={20} />
                    <input
                        type="text"
                        placeholder="찾고 싶은 프롬프트 주제를 입력하세요 (예: 심리학, 재테크, 일상...)"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-transparent py-6 pl-16 pr-6 text-white text-lg placeholder-gray-600 focus:outline-none font-medium"
                    />
                    {isGenerating && (
                        <div className="absolute right-6 flex items-center gap-2 text-primary">
                            <Loader2 size={24} className="animate-spin" />
                        </div>
                    )}
                </div>
            </div>

            {/* AI Agent Section */}
            <AnimatePresence>
                {aiPrompts.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="mb-12"
                    >
                        <div className="flex items-center gap-3 mb-6 px-1">
                            <div className="bg-primary/20 p-2 rounded-lg">
                                <Sparkles size={20} className="text-primary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white">AI 에이전트 분석 결과</h2>
                                <p className="text-xs text-gray-400">알고리즘을 파악하여 생성된 최신 맞춤 프롬프트 6선</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {aiPrompts.map(item => (
                                <PromptCard
                                    key={item.id}
                                    item={item}
                                    onUse={(item) => alert(`'${item.title}' 프롬프트가 복사되었습니다.`)}
                                />
                            ))}
                        </div>
                        <div className="mt-6 flex justify-center">
                            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent w-full"></div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Grid */}
            <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4 px-1">
                    <Info size={16} className="text-gray-500" />
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                        {search ? `'${search}' 검색 결과` : '인기 프롬프트'}
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPrompts.length > 0 ? (
                        filteredPrompts.map(item => (
                            <PromptCard key={item.id} item={item} onUse={(item) => alert(`'${item.title}' 프롬프트가 복사되었습니다.`)} />
                        ))
                    ) : (
                        !isGenerating && aiPrompts.length === 0 && (
                            <div className="col-span-full py-20 text-center">
                                <p className="text-gray-500 text-lg">검색 결과가 없습니다. AI 에이전트가 생성 중일 수 있습니다.</p>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* CTA */}
            <div className="mt-20 p-10 rounded-[40px] bg-gradient-to-br from-[#1a1c25] to-black border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all duration-500"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h3 className="text-2xl font-black text-white mb-3">나만의 고효율 프롬프트가 있나요?</h3>
                        <p className="text-gray-400 leading-relaxed max-w-xl">
                            커뮤니티에 공유하고 <span className="text-primary font-bold">프롬프트 마스터</span> 뱃지를 획득하세요.
                            매월 우수 공유자에게는 Pro 멤버십 1개월권을 선물로 드립니다.
                        </p>
                    </div>
                    <button className="px-8 py-4 bg-white text-black font-black rounded-2xl hover:scale-105 transition-all shadow-xl shadow-white/10 flex items-center gap-2 whitespace-nowrap">
                        <Share2 size={20} /> 프롬프트 레시피 공유
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommunityPage;
