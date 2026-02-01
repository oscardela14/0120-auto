import { callCerebras } from '../lib/cerebras';
import { generateContentWithGemini } from '../lib/gemini';
import { z } from 'zod';

/**
 * [Schemas] AI 응답 불확실성 제어를 위한 스키마 정의
 */
const DeepAnalysisSchema = z.object({
    keyword: z.string(),
    liveScore: z.string().or(z.number()).transform(v => String(v)),
    strategies: z.array(z.object({
        type: z.string(),
        text: z.string()
    })).min(1),
    sentiment: z.object({
        label: z.string(),
        logical: z.number(),
        emotional: z.number(),
        provocative: z.number()
    }).optional(),
    targetAudience: z.array(z.string()).optional(),
    viralTriggers: z.object({
        curiosity: z.number(),
        value: z.number(),
        urgency: z.number(),
        socialProof: z.number()
    }).optional(),
    blueprint: z.array(z.string()).optional()
});

const ScoutRivalSchema = z.object({
    analysis: z.string(),
    weakness: z.string(),
    counterStrategy: z.string()
});

/**
 * [Transformers] UI 전달 전 데이터 정규화 파이프라인
 */
const transformAnalysisResult = (raw) => {
    // 스키마 검증 시도
    const result = DeepAnalysisSchema.safeParse(raw);

    if (!result.success) {
        console.warn("[TopicService] Data validation failed, using fallback mapper:", result.error);
        // 폴백 데이터 매핑 (Graceful Degradation)
        return {
            keyword: raw.keyword || "Unknown",
            liveScore: String(raw.liveScore || "0"),
            strategies: Array.isArray(raw.strategies) ? raw.strategies : [
                { type: "ERROR", text: "데이터를 불러오는 중 오류가 발생했으나 내용을 복구했습니다." }
            ],
            isHeuristic: true
        };
    }
    return { ...result.data, verified: true };
};

const transformRivalResult = (raw) => {
    const result = ScoutRivalSchema.safeParse(raw);
    if (!result.success) {
        return {
            analysis: raw.analysis || "분석 실패",
            weakness: raw.weakness || "약점 식별 불가",
            counterStrategy: raw.counterStrategy || "전략 수립 불가",
            isFallback: true
        };
    }
    return result.data;
};

/**
 * TopicService
 * Encapsulates business logic for topic discovery, deep analysis, and content generation.
 */
export const TopicService = {
    /**
     * 알조리즘 심층 분석 (Deep Scrape)
     */
    async performDeepAnalysis(keyword) {
        if (!keyword) throw new Error("KEYWORD_REQUIRED");

        const systemPrompt = `
            당신은 소셜 미디어 알고리즘 분석 및 바이럴 마케팅 전문가입니다. 
            입력된 키워드 '${keyword}'에 대해 데이터 기반의 심층 분석 리포트를 다음 JSON 구조로만 반환하십시오.
            {
                "keyword": "${keyword}",
                "liveScore": "85~98 사이의 숫자",
                "sentiment": {
                    "label": "대중의 지배적 감정 (예: 열광, 논란, 정보성 등)",
                    "logical": 0~100 (논리적 설득력 비중),
                    "emotional": 0~100 (감성적 호소력 비중),
                    "provocative": 0~100 (자극성/논란성 비중)
                },
                "targetAudience": ["주요 타겟 페르소나 1", "2", "3"],
                "viralTriggers": {
                    "curiosity": 0~100,
                    "value": 0~100,
                    "urgency": 0~100,
                    "socialProof": 0~100
                },
                "strategies": [
                    { "type": "VISUAL", "text": "시각적 후킹 전략..." },
                    { "type": "STRUCTURE", "text": "스토리텔링 구조..." },
                    { "type": "RETENTION", "text": "시청 지속 시간 전략..." },
                    { "type": "CTA", "text": "전환 유도 전략..." }
                ],
                "blueprint": [
                    "1단계: [도입] 인지적 부조화 유발 로직",
                    "2단계: [전개] 가치 제공 및 신뢰 구축",
                    "3단계: [종결] 전환 박스 및 커뮤니티 유도"
                ]
            }
        `;

        try {
            const result = await callCerebras(systemPrompt, `Analyze the keyword: ${keyword}`);
            const rawData = typeof result === 'string' ? JSON.parse(result) : result;
            return transformAnalysisResult(rawData);
        } catch (error) {
            console.error("[TopicService] Deep analysis failed:", error);
            throw error;
        }
    },

    /**
     * 경쟁사 정찰 (Rival Recon)
     */
    async scoutRival(rivalInput) {
        if (!rivalInput) throw new Error("RIVAL_INPUT_REQUIRED");

        const systemPrompt = `
            당신은 경쟁사 콘텐츠 분석 전문가입니다.
            입력된 내용 '${rivalInput}'의 약점을 파악하고 우위 전략을 제안하십시오.
            JSON 형식으로 반환:
            {
                "analysis": "경쟁사 DNA 해체 결과...",
                "weakness": "식별된 약점...",
                "counterStrategy": "상위 호환 전략 제안..."
            }
        `;

        try {
            const result = await callCerebras(systemPrompt, `Scout rival: ${rivalInput}`);
            const rawData = typeof result === 'string' ? JSON.parse(result) : result;
            return transformRivalResult(rawData);
        } catch (error) {
            console.error("[TopicService] Rival scout failed:", error);
            throw error;
        }
    },

    /**
     * AI 초안 생성 가이드 제안
     */
    async suggestAiDraft(topic, platform, persona = 'witty') {
        try {
            return await generateContentWithGemini(topic, platform, persona);
        } catch (error) {
            console.error("[TopicService] AI suggestion failed:", error);
            throw error;
        }
    },

    /**
     * 특정 플랫폼용 AI 콘텐츠 생성
     */
    async generateContent(platform, topic, persona = 'witty') {
        try {
            return await generateContentWithGemini(topic, platform, persona);
        } catch (error) {
            console.error("[TopicService] generateContent failed:", error);
            throw error;
        }
    },

    /**
     * AI 초안 생성 및 즉시 반영 (History 저장 포함)
     */
    async generateAndSaveDraft(topic, platform, addToHistory) {
        try {
            const draft = await generateContentWithGemini(topic, platform);
            const historyItem = {
                id: Date.now(),
                topic,
                platform,
                title: draft.title || topic,
                content: draft.sections || [],
                createdAt: new Date().toISOString(),
                isAutoDraft: true
            };

            if (addToHistory) {
                await addToHistory(historyItem);
            }

            return historyItem;
        } catch (error) {
            console.error("[TopicService] generateAndSaveDraft failed:", error);
            throw error;
        }
    },

    /**
     * 스마트 병합 로직을 포함한 최종 콘텐츠 확정 및 저장
     */
    async finalizeContent(finalData, addToHistory) {
        if (!finalData || !finalData.topic) throw new Error("INVALID_CONTENT_DATA");

        // [Smart Merge Logic]
        // 사용자가 편집한 내용(drafts)이 있는지 확인
        const hasDraftContent = finalData.drafts?.some(d => (d.text || d.content || '').trim().length > 0);

        let finalResult;

        if (hasDraftContent) {
            const isBlog = finalData.platform.includes('Blog');
            const isShorts = finalData.platform.includes('Shorts') || finalData.platform.includes('Reels');
            const isThreads = finalData.platform.includes('Threads');

            finalResult = {
                id: Date.now(),
                topic: finalData.topic,
                platform: finalData.platform,
                title: finalData.title,
                createdAt: new Date().toISOString(),
                // 플랫폼별 데이터 구조 정규화
                script: isShorts ? finalData.drafts : null,
                sections: isBlog ? finalData.drafts : null,
                content: isBlog
                    ? finalData.drafts.map(s => `<h3>${s.title}</h3><p>${s.content}</p>`).join('\n\n')
                    : (isThreads ? finalData.drafts.map(d => d.content).join('\n\n') : ""),
                threadPosts: isThreads ? finalData.drafts.map(d => ({ text: d.content })) : null,
                type: finalData.type || 'topic_studio'
            };
        } else {
            // 편집 내용이 없으면 AI 기본 생성물 사용
            const draft = await generateContentWithGemini(finalData.topic, finalData.platform);
            finalResult = {
                id: Date.now(),
                topic: finalData.topic,
                platform: finalData.platform,
                title: draft.title || finalData.topic,
                content: draft.sections || [],
                createdAt: new Date().toISOString(),
                type: finalData.type || 'topic_studio'
            };
        }

        if (addToHistory) {
            await addToHistory(finalResult);
        }

        return finalResult;
    }
};
