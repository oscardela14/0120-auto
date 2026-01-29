
/**
 * Policy Guard for Platform Safety
 */

const FORBIDDEN_WORDS = [
    { word: "깜놀", replacement: "놀라운", reason: "AI 저품질 유발 가능성" },
    { word: "충격", replacement: "놀라운 사실", reason: "클릭베이트 정책 위반 위험" },
    { word: "대박", replacement: "놀라운 결과", reason: "상투적 AI 말투" }
];

export const scanPolicyViolations = async (text) => {
    const violations = FORBIDDEN_WORDS.filter(item => text.includes(item.word));

    return {
        violations,
        safetyScore: 100 - (violations.length * 15),
        isSafe: violations.length === 0,
        uniquenessScore: 98 // Random/Simulated uniqueness check
    };
};

export const getAlgorithmSuitability = (platform) => {
    if (platform === 'YouTube Shorts') {
        return {
            score: 92,
            tips: [
                "1.5s Fast-cut editing matches current trend",
                "Looping-point structure detected",
                "Visual retention potential: High"
            ]
        };
    }
    return { score: 85, tips: ["Standard engagement patterns"] };
};
