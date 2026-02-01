import { generateContentWithGemini } from '../lib/gemini';
import { generateContentWithCerebras } from '../lib/cerebras';

// Mock AI Generation Logic for each platform
const HAS_CEREBRAS = !!import.meta.env.VITE_CEREBRAS_API_KEY;

export const PERSONAS = [
    { id: 'witty', name: '위트있는\n크리에이터', icon: '😎', desc: '유머러스하고 트렌디한 톤' },
    { id: 'analytical', name: '냉철한 분석가', icon: '🧐', desc: '데이터와 논리 중심' },
    { id: 'emotional', name: '감성적인\n에세이스트', icon: '🥺', desc: '따뜻하고 인간적인 톤' },
    { id: 'ensemble', name: '멀티 드림팀\n(Ensemble)', icon: '🎭', desc: '백종원+잡스+김태호 앙상블' }
];

const getSmartImagePrompt = (platform, topic = "", personaId = 'witty') => {
    const isVertical = platform !== 'Naver Blog';
    const ratioKeyword = isVertical ? 'vertical format, tall image, 9:16 aspect ratio' : 'wide format, horizontal image, 16:9 aspect ratio';
    const safeTopic = topic || "General content";

    let basePrompt = '';
    if (safeTopic.includes('게임')) basePrompt = 'futuristic gaming room setup, rgb lights, cyberpunk style, computer desk, esports atmosphere';
    else if (safeTopic.includes('요리') || safeTopic.includes('푸드')) basePrompt = 'delicious gourmet food plating on table, cinematic lighting, food photography, restaurant vibe';
    else if (safeTopic.includes('여행') || safeTopic.includes('브이로그')) basePrompt = 'beautiful travel destination landscape, sunny beach or mountain, vacation vibe, travel photography';
    else if (safeTopic.includes('뷰티') || safeTopic.includes('패션')) basePrompt = 'aesthetic beauty product layout, fashion model style, soft pastel lighting, elegant atmosphere';
    else if (safeTopic.includes('테크') || safeTopic.includes('가전')) basePrompt = 'modern minimalist tech gadget workspace, apple style, clean desk setup, high tech devices';
    else if (safeTopic.includes('반려동물')) basePrompt = 'cute fluffy golden retriever dog playing in park, sunny day, happy pet photography';
    else basePrompt = 'aesthetic minimal background, abstract modern art, high quality texture, pleasing colors';

    return `${basePrompt}, ${ratioKeyword}, 4k resolution, highly detailed, photorealistic, cinematic lighting`;
};

const getPersonaStyle = (persona, topic) => {
    switch (persona) {
        case 'analytical':
            return {
                titlePrefix: "📊 [심층분석]",
                intro: `팩트부터 체크해보겠습니다. ${topic}, 데이터로 보면 어떨까요?`,
                body: `통계적으로 접근해보면 핵심 변수는 이렇습니다. 논리적인 접근이 필요합니다.`,
                climax: `결과값이 모든 것을 증명합니다.`,
                cta: `더 깊은 인사이트가 필요하다면 팔로우.`,
                blogTitle: `[데이터 분석] ${topic}의 성공 원리, 숫자로 증명된 3가지 법칙`,
                blogIntro: `${topic} 시장의 이면을 꿰뚫어보는 데이터 분석 리포트입니다. 감정이 아닌, 철저한 논리로 접근했습니다.`,
                threadStart: `뇌피셜 말고, 오직 팩트로만 ${topic} 분석해봄. 🧵`
            };
        case 'emotional':
            return {
                titlePrefix: "☁️",
                intro: `오늘 하루, ${topic} 때문에 마음이 쓰이셨나요?`,
                body: `괜찮아요. 누구나 서툰 순간은 있으니까요. 당신의 속도대로 해도 충분해요.`,
                climax: `결국 중요한 건 당신의 진심이 닿는 것.`,
                cta: `당신의 이야기를 들려주세요.`,
                blogTitle: `오늘 밤, ${topic}로 지친 당신에게 전하는 위로`,
                blogIntro: `${topic} 하나로도 벅찼던 오늘. 따뜻한 차 한 잔과 함께 읽어주세요.`,
                threadStart: `${topic} 생각하다가 문득 든 생각. 끄적끄적... 💭`
            };
        case 'ensemble':
            return {
                titlePrefix: "💎 [Ensemble]",
                intro: `[백종원] "어유, ${topic} 이거 어렵게 생각하지 마세유. 제가 아주 쉽게, 바로 써먹을 수 있게 알려드릴게!"`,
                body: `[스티브 잡스] "우리는 본질에 집중해야 합니다. ${topic}은 단순한 정보가 아닙니다. 그것은 세상을 바라오는 새로운 렌즈입니다."`,
                climax: `[김태호PD] "(해골 자막 팍!) 아니 근데 여기서 이런 반전이? 시청자들 소름 돋는 포인트 나갑니다."`,
                cta: `[드림팀] 이 전설적인 조합의 통찰이 더 궁금하다면 알림 설정.`,
                blogTitle: `[역대급] 백종원x잡스x김태호가 분석한 ${topic}의 정석`,
                blogIntro: `상상도 못한 조합이 뭉쳤습니다. ${topic}를 바라보는 세 가지 시선, 지금 공개합니다.`,
                threadStart: `${topic} 분석하려고 업계 거물들 다 모셔옴. 짧고 굵게 요약해드림. 🔥`
            };
        case 'witty':
        default:
            return {
                titlePrefix: "🔥",
                intro: `솔직히 ${topic} 이거 아직도 모르면 손해 아님? ㅋㅋ`,
                body: `아니 진짜 별거 아닌데 다들 어렵게 생각하더라고. 그냥 이거 하나면 끝!`,
                climax: `봤지? 완전 쉽잖아. 안 하면 바보임.`,
                cta: `꿀팁 더 원하면 구독 누르고 튀셈!`,
                blogTitle: `솔까말 ${topic} 종결자 등판(이거면 끝)`,
                blogIntro: `맨날 ${topic} 검색만 하다가 시간 다 보내는 사람들 주목. 오늘부로 이거 보고 졸업시키려고 씀.`,
                threadStart: `솔직히 ${topic} 이거 나만 알고 있기 아까워서 푼다. 👇`
            };
    }
}

export const generateContent = async (platform, topic, persona = 'witty') => {
    try {
        let aiData = null;

        if (HAS_CEREBRAS) {
            console.log("🚀 Using Cerebras Llama 3.1-70b for fast inference...");
            aiData = await generateContentWithCerebras(topic, platform, persona);
        }

        if (!aiData) {
            console.log("✨ Using Gemini 2.0 Flash as fallback...");
            aiData = await generateContentWithGemini(topic, platform, persona);
        }

        if (aiData) {
            return {
                topic: topic,
                platform: platform,
                createdAt: new Date().toISOString(),
                bgImagePrompt: getSmartImagePrompt(platform, topic, persona),
                persona: persona,
                predictedStats: {
                    expectViews: (Math.floor(Math.random() * 50) + 10) + "K",
                    competition: ['낮음 (블루오션)', '보통'][Math.floor(Math.random() * 2)],
                    viralScore: Math.floor(Math.random() * 30) + 70
                },
                variants: aiData.variants
            };
        }
    } catch (error) {
        console.warn("⚠️ AI generation failed, falling back to mock engine:", error);
    }

    // Mock Fallback Logic
    const style = getPersonaStyle(persona, topic);
    const variants = [];

    if (platform === 'YouTube Shorts' || platform === 'TikTok') {
        variants.push({
            type: 'Hook',
            content: `${style.titlePrefix} ${style.intro}`,
            tip: "첫 3초가 가장 중요합니다."
        }, {
            type: 'Main Content',
            content: style.body,
            tip: "빠른 컷 편집을 추천합니다."
        }, {
            type: 'Conclusion',
            content: `${style.climax} ${style.cta}`,
            tip: "구독 유도 멘트를 잊지 마세요."
        });
    } else if (platform === 'Instagram Reels') {
        variants.push({
            type: 'Visual Hook',
            content: `${style.titlePrefix} ${topic} 레전드 요약`,
            tip: "임팩트 있는 배경 음악을 사용하세요."
        }, {
            type: 'Caption',
            content: `${style.intro}\n\n${style.body}\n\n${style.climax}\n\n#${topic.replace(/\s/g, '')} #꿀팁 #정보`,
            tip: "해시태그는 3~5개가 적당합니다."
        });
    } else if (platform === 'Naver Blog') {
        variants.push({
            type: 'Blog Title',
            content: style.blogTitle,
            tip: "검색 키워드를 제목 앞에 배치하세요."
        }, {
            type: 'Intro',
            content: style.blogIntro,
            tip: "독자의 공감을 얻는 질문으로 시작하세요."
        }, {
            type: 'Main Content',
            content: style.body,
            tip: "중간중간 이미지와 소제목을 활용하세요."
        }, {
            type: 'Conclusion',
            content: style.climax,
            tip: "자신의 의견을 덧붙여 마무리하세요."
        });
    } else if (platform === 'Threads') {
        variants.push({
            type: 'Threads Content',
            content: `${style.threadStart}\n\n1. ${style.body}\n\n2. ${style.climax}\n\n${style.cta}`,
            tip: "줄바꿈을 활용하여 가독성을 높이세요."
        });
    }

    return {
        topic: topic,
        platform: platform,
        createdAt: new Date().toISOString(),
        bgImagePrompt: getSmartImagePrompt(platform, topic, persona),
        persona: persona,
        predictedStats: {
            expectViews: "5.2K",
            competition: "보통",
            viralScore: 82
        },
        variants: variants
    };
};
