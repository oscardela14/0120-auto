
/**
 * Self-Evolving Digital Twin Engine
 * Learns from past performance data to optimize future content.
 */

const STORAGE_KEY = 'ANTIGRAVITY_EVOLUTION_DATA';

export const getEvolutionData = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);

    // Default initial state
    return {
        level: 1,
        exp: 0,
        learnedTraits: [
            { trait: "초기 데이터 수집 중", value: 10 },
            { trait: "기본 말투 프로필", value: 40 }
        ],
        successPatterns: [
            { pattern: "호기심 자극형 질문", boost: 1.2 },
            { pattern: "리스트 형식 정보 전달", boost: 1.1 }
        ],
        history: [] // Performance logs
    };
};

export const logPerformance = (contentId, stats) => {
    const data = getEvolutionData();
    data.history.push({ id: contentId, stats, timestamp: Date.now() });

    // Logic to evolve based on stats (simplified)
    if (stats.views > 1000) {
        data.exp += 25;
        if (data.exp >= 100) {
            data.level += 1;
            data.exp = 0;
            // Add a new trait or boost a pattern
            data.learnedTraits.push({ trait: `상위 1% 바이럴 통찰력 (Level ${data.level})`, value: 85 });
        }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
};

export const applyEvolutionToContent = (text, evolutionData) => {
    // Inject learned patterns into the text
    let evolvedText = text;

    // If user has high level, make sentences more 'insightful'
    if (evolutionData.level > 2) {
        evolvedText = evolvedText.replace(/(방법입니다|해요)\./g, "$1. 결국 중요한 것은 단순한 지식이 아닌 내재화된 통찰력이라는 점을 기억하세요. ✨");
    }

    return evolvedText;
};
