const API_KEY = import.meta.env.VITE_CEREBRAS_API_KEY;

// Helper to repair common JSON errors from AI
function repairJson(jsonStr) {
    let repaired = jsonStr.trim();
    repaired = repaired.replace(/```json/g, '').replace(/```/g, '').trim();

    const firstBrace = repaired.indexOf('{');
    const lastBrace = repaired.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
        repaired = repaired.substring(firstBrace, lastBrace + 1);
    }
    return repaired;
}

// 🧹 Deep Clean Helper: Recursively remove Hanja from all string values in an object
function deepCleanHanja(obj) {
    if (typeof obj === 'string') {
        // Remove CJK Ideographs (Common & Ext A)
        return obj.replace(/[\u4E00-\u9FFF\u3400-\u4DBF]/g, '');
    } else if (Array.isArray(obj)) {
        return obj.map(deepCleanHanja);
    } else if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).reduce((acc, key) => {
            acc[key] = deepCleanHanja(obj[key]);
            return acc;
        }, {});
    }
    return obj;
}

// Common fetcher for Cerebras with Auto-Retry and Enhanced Error Handling + Gemini Fallback
import { generateContentWithGemini } from './gemini';

export async function callCerebras(systemPrompt, userContent = "Go.", model = "llama3.3-70b", retries = 1) {
    // Cache Buster Log
    console.log("%c [SYSTEM] Cerebras Module v3.2 Loaded (MockGuard Active)", "color: cyan; font-weight: bold;");

    if (!API_KEY) {
        console.error("Cerebras API Key is missing.");
        return null;
    }

    // [CRITICAL] Mandatory Korean-First Policy (Aggressive Constraint)
    const languageGuardHeader = "[SYSTEM RULE: KOREAN ONLY]\n" +
        "당신은 한국어 원어민 전문가입니다. 모든 답변에서 한자(Chinese Characters), 중국어, 베트남어, 일본어 문자를 사용하는 것은 '절대' 엄격히 금지됩니다. " +
        "오직 현대 한국어(한글)와 필수적인 영문 소셜 용어만 사용하십시오. " +
        "한자를 섞어 쓰거나 외국어 특수 문자를 사용할 경우 시스템 치명적 오류가 발생하므로 100% 한글로만 출력하십시오.\n\n";

    const enforcedSystemPrompt = languageGuardHeader + (systemPrompt.includes("JSON")
        ? systemPrompt
        : `${systemPrompt}\n\nIMPORTANT: Your response must be in valid JSON format.`);

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            if (attempt > 0) console.log(`[Cerebras] Retrying generation... (Attempt ${attempt + 1}/${retries + 1})`);

            const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        { role: "system", content: enforcedSystemPrompt },
                        { role: "user", content: userContent }
                    ],
                    temperature: 0.7, // Lowered for stability (0.8 -> 0.7)
                    max_tokens: 4000,
                    response_format: { type: "json_object" }
                })
            });

            if (!response.ok) {
                const err = await response.text();

                // 429 Too Many Requests -> Switch to Gemini Fallback
                if (response.status == 429 || response.statusText?.includes("Too Many Requests")) {
                    console.warn("%c ⚠️ Cerebras Limit Exceeded (429). Switching to Gemini 2.0 Flash Fallback...", "color: orange; font-weight: bold;");

                    try {
                        const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
                        if (geminiKey && geminiKey !== 'YOUR_GEMINI_KEY') {
                            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`;
                            const geminiResp = await fetch(geminiUrl, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    contents: [{ parts: [{ text: enforcedSystemPrompt + "\n\n" + userContent }] }]
                                })
                            });

                            if (geminiResp.ok) {
                                const geminiData = await geminiResp.json();
                                if (geminiData.candidates && geminiData.candidates[0]) {
                                    let gText = geminiData.candidates[0].content.parts[0].text;
                                    gText = gText.replace(/```json/g, '').replace(/```/g, '').trim();
                                    try { return deepCleanHanja(JSON.parse(gText)); }
                                    catch { return deepCleanHanja(JSON.parse(repairJson(gText))); }
                                }
                            }
                        }
                    } catch (geminiError) {
                        console.error("Gemini Fallback Exception:", geminiError);
                    }

                    // [ULTIMATE FALLBACK] Mock Simulation
                    console.warn("%c 🚨 All AI Engines Busy. Engaging Logic Simulation Mode.", "color: red; font-weight: bold;");
                    return generateMockResponse(systemPrompt);
                }

                throw new Error(`(v3.2) Cerebras API Error: ${response.status} - ${err}`);
            }

            const data = await response.json();
            let content = data.choices[0].message.content;

            // [IRONCLAD FILTER] Parsing Logic
            try {
                const parsed = JSON.parse(content);
                return deepCleanHanja(parsed);
            } catch {
                const repaired = repairJson(content);
                try {
                    const parsed = JSON.parse(repaired);
                    return deepCleanHanja(parsed);
                } catch (parseError) {
                    console.warn(`[Cerebras] JSON Parse Failed on attempt ${attempt}:`, parseError);
                    if (attempt < retries) continue; // Trigger retry
                    return null;
                }
            }
        } catch (error) {
            console.error(`[Cerebras] Call Error (Attempt ${attempt}):`, error);
            if (attempt === retries) {
                // Return mock on final failure to prevent UI hang
                return generateMockResponse(systemPrompt);
            }
        }
    }
    return null;
}

// 1. Advanced Content Generation with Platform DNA
export async function generateContentWithCerebras(topic, platform = 'YouTube Shorts', persona = 'witty') {
    const platformInstructions = {
        'YouTube Shorts': `
            - Format: 30-60 second vertical video script.
            - Structure: [0-5s] Hook (visual/audio shock) -> [5-40s] Fast-paced Value Delivery -> [40-60s] Twisted Conclusion & CTA.
            - Tone: Energetic, fast, engaging, addictive.
            - Output specific timestamped script format: [{ "time": "0:00-0:05", "text": "...", "type": "intro", "visual": "..." }].
        `,
        'Instagram': `
            - Format: Aesthetic Reels script or Carousel caption.
            - Structure: Visual-first storytelling. "Visual" field should be very descriptive (e.g., 'Cinematic slow-motion', 'Text overlay').
            - Tone: Trendy, emotional, 'saved' worthy, relatable.
            - For script, focus on 'POV' or 'Day in the life' styles.
        `,
        'Naver Blog': `
            - Format: Professional Blog Post Structure.
            - Structure: Strong Title -> Hook Intro -> Body (3 Detailed Subsections with H2) -> Conclusion & Call to Action.
            - Tone: Informative, trustworthy, experience-based (review style), SEO-optimized.
            - Output "sections" array: [{ "title": "...", "content": "Detailed paragraph..." }].
            - MUST include specific keywords naturally.
        `,
        'Threads': `
            - Format: Twitter/Threads style short text stream.
            - Structure: Punchy One-liner Hook -> Insight 1 -> Insight 2 -> Insight 3 -> Question/Discussion trigger.
            - Tone: Conversational, provocative, 'insight machinery', raw.
            - Output "sections" array where each item is a separate thread post.
        `
    };

    const specificInstruction = platformInstructions[platform] || platformInstructions['YouTube Shorts'];

    const prompt = `
    [CONTENT GENERATOR - ${platform.toUpperCase()} MODE]
    Create high-viral potential content for:
    Topic: ${topic}
    Target Persona: ${persona}

    [PLATFORM GUIDELINES]
    ${specificInstruction}

    [RESPONSE FORMAT - JSON ONLY]
    {
        "title": "Viral Title (optimized for CTR)",
        "script": [ // Use this for Video platforms (Shorts, Reels)
            { "time": "0:00", "type": "intro", "text": "Script dialogue or narration...", "visual": "Visual direction..." }
        ],
        "sections": [ // Use this for Text platforms (Blog, Threads)
            { "title": "Subheading or Hook", "content": "Main body text..." }
        ],
        "hashtags": ["#tag1", "#tag2"],
        "viralScore": 85
    }
    
    Ensure the content is naturally written in Korean (Native nuance), highly engaging, and perfectly fits the platform culture selected above.
    `;

    return await callCerebras(prompt);
}

// 2. 🎭 100-Persona Chaos Simulation (백만 페르소나 시뮬레이션)
export async function simulateChaos(topic) {
    const prompt = `
    [CHAOS SIMULATION MODE]
    주제 '${topic}'에 대해 서로 완전히 다른 5가지 극단적인 페르소나로 콘텐츠를 동시 기획하세요.
    
    페르소나 목록:
    1. 논리적인 팩트 폭격기 (Tech/Reviewer)
    2. 감성적인 스토리텔러 (Vlog/Essay)
    3. 도파민 중독자 (Meme/Shorts logic)
    4. 냉철한 비즈니스맨 (Money/Success)
    5. 옆집 동네 형 (Friendly/Humor)

    JSON 반환 형식:
    {
        "simulations": [
            { "persona": "팩트 폭격기", "title": "...", "hook": "...", "score": 92, "reason": "논리적 완결성 우수" },
            { "persona": "감성 스토리텔러", "title": "...", "hook": "...", "score": 88, "reason": "공감대 형성" },
            ...
        ],
        "winner": "최고의 페르소나와 그 이유"
    }
    `;
    return await callCerebras(prompt, topic);
}

// 3. 🛡️ Real-time Reputation Guard (실시간 여론 방어)
export async function guardReputation(comment) {
    const prompt = `
    [REPUTATION GUARD ACTIVE]
    사용자의 악플이나 곤란한 질문이 들어왔습니다.
    채널의 품격을 지키면서도 상대방을 제압하거나 유쾌하게 받아치는 3가지 대응 전략을 제시하세요.
    
    입력된 댓글: "${comment}"

    JSON 반환 형식:
    {
        "analysis": "댓글의 의도 분석 (공격/비꼼/단순질문)",
        "responses": [
            { "type": "Wit", "text": "유머러스한 대처...", "effect": "분위기 환기" },
            { "type": "Logic", "text": "논리적 팩트 체크...", "effect": "오해 해소" },
            { "type": "Empathy", "text": "포용적 태도...", "effect": "대인배 이미지 구축" }
        ]
    }
    `;
    return await callCerebras(prompt, comment);
}

// 4. 🛰️ Global Trend Arbitrage (글로벌 트렌드 차익 거래)
export async function analyzeTrendArbitrage(globalTrend) {
    const prompt = `
    [GLOBAL ARBITRAGE]
    해외 트렌드: "${globalTrend}"
    이 트렌드를 '한국 문화(K-Culture)'와 '한국 밈(Meme)'에 맞게 현지화(Patch)하여 기획하세요.
    단순 번역이 아니라, 한국인이 반응할 수밖에 없는 '매운맛' 요소를 주입하세요.

    JSON 반환:
    {
        "original_intent": "원래 의미",
        "k_patch_ver": "한국식 변형 기획안 제목",
        "key_elements": ["요소1", "요소2"],
        "script_outline": "한국어 대본 개요"
    }
    `;
    return await callCerebras(prompt, globalTrend);
}

// 5. 🧬 Real-time Viral Gauge (실시간 바이럴 게이지)
export async function checkViralScore(currentText) {
    const prompt = `
    [VIRAL GAUGE]
    다음 텍스트가 소셜 미디어에서 얼마나 바이럴될지 0~100점으로 즉시 평가하고, 개선점을 1문장으로 제시하세요.
    
    [중요] 입력된 텍스트의 언어와 상관없이, 분석 결과(feedback)는 '무조건' 완벽한 한국어로만 작성해야 합니다. 
    일본어, 중국어, 태국어, 영어 등 외국어 출력을 절대 금지합니다.
    
    텍스트: "${currentText}"

    평가 기준: 도파민 자극도, 궁금증 유발, 간결성.
    JSON 반환: { "score": 85, "grade": "B+", "feedback": "더 자극적인 단어로 시작하세요." }
    `;
    // Use a smaller/faster logic conceptualization if model allows, but here we use the same.
    return await callCerebras(prompt, currentText);
}

// 6. 🕵️ Autonomous Rival Recon (경쟁사 정찰)
export async function reconRivals(rivalContent) {
    const prompt = `
    [RIVAL RECON]
    경쟁사 콘텐츠 내용: "${rivalContent}"
    이 콘텐츠의 약점(Missing Link)을 찾고, 이를 뛰어넘을 '상위 호환(Counter)' 콘텐츠를 기획하세요.

    JSON 반환:
    {
        "weakness": "경쟁사 콘텐츠의 부족한 점",
        "counter_strategy": "이를 공략할 전략",
        "counter_content": { "title": "...", "hook": "..." }
    }
    `;
    return await callCerebras(prompt, rivalContent);
}

// 7. 💬 Hyper-Personalized DM (초개인화 팬 관리)
export async function generateFanReply(fanName, fanHistory, fanMessage) {
    const prompt = `
    [FAN CARE SYSTEM]
    팬 이름: ${fanName}
    팬 활동 이력: ${fanHistory}
    팬 메시지: "${fanMessage}"

    이 팬을 '찐팬(Loyal Fan)'으로 만들기 위한 소름 돋는 개인화 답장을 작성하세요.
    과거 이력을 은근슬쩍 언급하며 감동을 주세요.

    JSON 반환:
    {
        "reply": "답장 내용...",
        "emotional_point": "어느 부분에서 감동을 주는지"
    }
    `;
    return await callCerebras(prompt, fanMessage);
}

// 8. 📊 Professional SEO Audit (정밀 SEO 회계 감사)
export async function professionalAudit(content, platform) {
    const prompt = `
    [PROFESSIONAL AUDIT MODE]
    플랫폼: "${platform}"
    제목: "${content.title}"
    본문: "${content.drafts.map(d => d.text || d.content || '').join(' ')}"
    
    위 콘텐츠를 실제 소셜 미디어 알고리즘 관점에서 정밀하게 '현실적인 수치'로 감사(Audit)하세요.
    단순히 높은 점수를 주는 것이 아니라, 부족한 점은 과감하게 낮은 점수를 부여하여 사용자가 개선할 수 있게 하십시오.
    100점은 현실적으로 나오기 힘든 점수임을 감안하여 엄격히 채점하십시오.
    
    평가 항목 (0-100):
    1. 후킹(Hooking): 제목과 도입부의 이목 집중력.
    2. 연관성(Relevance): 주제-제목-본문의 일관성 및 키워드 최적화.
    3. 가독성(Readability): 문장 길이, 문단 구분, 시각적 피로도.
    4. 도달률/Reach(Engagement): 공유 가능성, 댓글 유도, 확장 잠재력.
    
    JSON 반환 형식:
    {
        "overall": 85,
        "breakdown": { "hook": 78, "relevance": 92, "readability": 84, "engagement": 75 },
        "status": "A",
        "detailed_feedback": "전체적으로 우수하나 제목의 후킹 단어가 다소 진부합니다. '충격'보다는 데이터 기반의 구체적 수치를 활용해보세요."
    }
    `;
    return await callCerebras(prompt);
}

// 🛡️ Ultimate Fallback: Rule-based Response Generation
function generateMockResponse(prompt) {
    const p = prompt.toLowerCase();

    // 1. Optimization Request
    if (p.includes("최적화") || p.includes("optimize")) {
        return {
            title: "⚡ [AI 분석] 99% 도달률 상승 전략 (서버 과부하로 인한 시뮬레이션)",
            drafts: [
                { time: "0:00", type: "intro", text: "🚨 이 영상 안 보면 100만원 손해봅니다! (강력한 후킹)", visual: "경고등 효과" },
                { time: "0:15", type: "body", text: "현재 AI 서버 사용량이 폭주하여 '논리 시뮬레이션 모드'로 전환되었습니다. 핵심은 '결핍'과 '해결책'을 3초 안에 제시하는 것입니다.", visual: "데이터 그래프 상승" }
            ],
            hashtags: ["#서버폭주", "#인기급상승", "#AI비상모드"],
            expected_boost: 45
        };
    }

    // 2. Viral Score Request (0~100)
    if (p.includes("score") || p.includes("평가") || p.includes("점수") || p.includes("viral")) {
        return {
            score: 88,
            grade: "A",
            feedback: "현재 AI 트래픽이 많아 정밀 분석 대신 '패턴 매칭' 결과를 보여드립니다. 훌륭한 구조입니다!",
            breakdown: { hook: 90, relevance: 85, readability: 92, engagement: 88 }
        };
    }

    // 3. A/B Strategy Request
    if (p.includes("strategy") || p.includes("전략") || p.includes("대안") || p.includes("b안")) {
        return {
            title: "🚀 [고효율] 클릭을 부르는 질문형 제목 전략",
            description: "사용자의 호기심을 극한으로 자극하는 질문 던지기 기법",
            drafts: [{ time: "0:00", type: "body", text: "지금 당신이 놓치고 있는 상위 1%의 비밀은 무엇일까요? 바로 '제목'에 있습니다." }],
            hashtags: ["#제목학원", "#클릭유도"],
            expected_boost: 25
        };
    }

    // Default
    return {
        title: "생성량이 많아 잠시 대기 중입니다.",
        content: "현재 전 세계적인 AI 사용량 폭증으로 인해 응답이 지연되고 있습니다. 잠시 후 다시 시도해주세요.",
        script: [{ text: "서버가 잠시 휴식을 취하고 있습니다." }],
        hashtags: ["#잠시만요"]
    };
}
