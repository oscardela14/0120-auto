
/**
 * Monetization Logic for Profit Maximizer
 */

const HIGH_CPC_KEYWORDS = [
    { original: "돈 버는 법", replacement: "자산 포트폴리오 최적화", cpcBoost: "+$4.20" },
    { original: "블로그 수익", replacement: "디지털 애셋 매니지먼트", cpcBoost: "+$3.50" },
    { original: "주식 공부", replacement: "퀀트 트랜딩 알고리즘 입문", cpcBoost: "+$5.80" },
    { original: "창업 아이템", replacement: "D2C 비즈니스 스케일업 전략", cpcBoost: "+$3.10" },
    { original: "부업 추천", replacement: "패시브 인컴 파이프라인 구축", cpcBoost: "+$2.90" }
];

export const getMonetizationInsights = async (text, platform) => {
    // 1. Keyword Swap Recommendations
    const recommendations = HIGH_CPC_KEYWORDS.filter(k => text.includes(k.original));

    // 2. CTA Templates (Behavioral Economics)
    const ctas = [
        { type: 'Scarcity', text: "이 혜택은 오늘 자정까지만 유효합니다. 지금을 놓치면 평생 후회할지도 모릅니다." },
        { type: 'Loss Aversion', text: "남들이 몰래 벌어가는 동안 당신만 손해 보고 있었습니다. 지금 바로 확인하세요." },
        { type: 'Authority', text: "전문가 1,000명이 입증한 가장 빠른 길, 검증된 공식으로 시작하세요." }
    ];

    // 3. Brand Collaboration Estimates
    const estRate = platform === 'YouTube Shorts' ? "₩1,200,000 - ₩3,500,000" : "₩500,000 - ₩1,800,000";

    return {
        recommendations,
        ctas,
        brandGuide: {
            estimatedRate: estRate,
            collabPitch: `안녕하세요, [Brand Name] 담당자님. 귀사의 브랜드 가치를 저의 ${platform} 채널의 찐팬들에게 진정성 있게 전달할 제안을 드립니다.`
        }
    };
};
