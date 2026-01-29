
/**
 * ANTI-GRAVITY AGENTIC SWARM INTELLIGENCE v1.0
 * Orchestrates multiple specialized AI agents across discrete niches.
 */

export const NICHES = [
    { id: 'finance', name: '금융 & 부업', icon: '💰', agents: 5, health: 98 },
    { id: 'tech', name: 'IT & 가전', icon: '💻', agents: 4, health: 95 },
    { id: 'lifestyle', name: '라이프스타일', icon: '☕', agents: 6, health: 99 },
    { id: 'gaming', name: '게임 트렌드', icon: '🎮', agents: 3, health: 92 },
    { id: 'beauty', name: '뷰티 & 패션', icon: '✨', agents: 4, health: 96 }
];

export const getSwarmInsights = () => {
    return [
        {
            niche: 'finance',
            trend: '엔저 현상 장기화에 따른 소액 외화 투자 전략 급상승',
            score: 92,
            recon: {
                gap: "상위 5개 블로그 평균 대비 키워드 확보율 +45% 우위",
                density: "타겟 키워드 밀도 2.8% (최적 범위 2.5~3.0% 정밀 조준)",
                winProb: 94
            }
        },
        {
            niche: 'tech',
            trend: 'GPT-5 출시 임차 루머에 따른 AI 관련주 검색량 폭증',
            score: 88,
            recon: {
                gap: "경쟁 콘텐츠 누락 데이터(멀티모달 벤치마크) 선점 가능",
                density: "전문 용어 비율 15% 상향 조정으로 알고리즘 신뢰도 확보",
                winProb: 82
            }
        },
        {
            niche: 'lifestyle',
            trend: '무지출 챌린지 2.0: 짠테크 식단 콘텐츠 공유 활발',
            score: 95,
            recon: {
                gap: "심리적 트리거(절약 피로도 해소) 분석 결과 경쟁사 없음",
                density: "감성 키워드와 수익 키워드의 7:3 황금 비율 설계",
                winProb: 98
            }
        },
        {
            niche: 'gaming',
            trend: '신작 오픈월드 RPG 서버 부하 이슈로 인한 커뮤니티 폭발',
            score: 85,
            recon: {
                gap: "서버 이슈 해결 가이드 결합 시 '저장수' 3배 증폭 예측",
                density: "커뮤니티 은어 및 밈(Meme) 데이터 싱크율 100%",
                winProb: 75
            }
        }
    ];
};

export const simulateSwarmAction = (nicheId) => {
    const niche = NICHES.find(n => n.id === nicheId);

    const sampleContents = {
        finance: [
            "실시간 환율 급변동 알림: 엔화 900원선 하회 가능성 포착",
            "글로벌 증시 브리핑: 미 국채 금리 하락에 따른 기술주 반등",
            "재테크 커뮤니티: '공모주 청약' 관련 언급량 300% 급증"
        ],
        tech: [
            "신형 스마트폰 유출 정보: 티타늄 프레임 및 폴더블 힌지 설계 변경",
            "생성형 AI 트렌드: '영상 제작 AI' 검색 인터벌 0.5초 미만으로 단축",
            "가전 리뷰 분석: 저전력 인버터 에어컨 실사용 만족도 지수 상승"
        ],
        lifestyle: [
            "SNS 인기 식단: '귀리 우유' 기반 다이어트 레시피 저장수 폭주",
            "인테리어 트렌드: '미드센추리 모던' 가구 직구 수요 지속",
            "주말 가볼만한 곳: '숲세권 카페' 키워드 지도 검색 순위 1위"
        ],
        gaming: [
            "e스포츠 속보: LOL LCK 결승전 티켓팅 전석 매진 (3초 컷)",
            "신작 기대평: 언리얼 엔진 5 기반 오픈월드 그래픽 수준 논란",
            "스팀 판매 순위: K-인디 게임 '로그라이크' 장르 역주행 시작"
        ]
    };

    const contents = sampleContents[nicheId] || ["데이터 패킷 분석 중... 유의미한 패턴 식별 시 자동 필터링됩니다."];
    const captured = contents[Math.floor(Math.random() * contents.length)];

    return {
        agentId: `Agent-${Math.floor(Math.random() * 1000)}`,
        niche: niche.name,
        action: 'MARKET_SCAN_COMPLETE',
        capturedContent: captured,
        signalsDetected: Math.floor(Math.random() * 15) + 5,
        timestamp: new Date().toISOString()
    };
};

/**
 * [New Feature] Autonomous Morning Report Generator
 * Synthesizes top 3 global opportunities for the day.
 */
export const generateMorningReport = () => {
    const insights = getSwarmInsights();

    // Sort by win probability and score to get the best TOP 3
    const top3 = [...insights]
        .sort((a, b) => (b.recon.winProb + b.score) - (a.recon.winProb + a.score))
        .slice(0, 3)
        .map((item, index) => ({
            ...item,
            rank: index + 1,
            estimatedProfit: `+₩${((item.score * 12500) / 100).toLocaleString()}`,
            reasoning: [
                "검색량 유입 대비 경쟁 게시글의 품질이 낮아 상위 노출이 매우 용이합니다.",
                "특정 커뮤니티에서 시작된 밈이 대중적으로 확산되는 골든 타임입니다.",
                "기존 상위권 데이터가 6개월 이상 노후화되어 신규 정보에 대한 교체 수요가 높습니다."
            ][index],
            tacticalAdvice: [
                "썸네일에서 '수익 인증' 이미지를 강조하여 클릭률을 45% 이상 끌어올리세요.",
                "대본 초반 3초에 '충격적인 진실' 후킹 자막을 넣어 시청 유지율을 확보하세요.",
                "네이버 지식인 및 카페의 '질문' 패턴을 분석해 Q&A 형식으로 구성하세요."
            ][index]
        }));

    return {
        timestamp: new Date().toISOString(),
        reportId: `AMR-${Date.now()}`,
        opportunities: top3,
        overallAtmosphere: "Bullish (공격적 발행 권장)",
        voiceScript: `좋은 아침입니다. 안티그래비티 스웜 에이전트들이 밤사이 전 세계 데이터를 분석한 결과, 오늘 당신이 잡아야 할 최고의 기회 3가지를 찾았습니다. 첫 번째는 ${top3[0].niche} 분야의 '${top3[0].trend}'입니다. ${top3[0].estimatedProfit} 규모의 기대 수익이 예상되니 지금 즉시 발행을 준비하세요.`,
        suggestedFocus: top3[0].niche
    };
};

/**
 * [New Feature] Global Platform Stats Aggregator (Mock -> API Prep)
 * Centralizes platform performance metrics.
 */
export const getPlatformStats = () => {
    // Randomize values to simulate dynamic "live" data
    // Weighted to prioritize YouTube > Instagram > Blog > Threads

    // YouTube
    const ytViews = Math.floor(Math.random() * 40) + 40; // 40k-80k
    const ytGrowth = Math.floor(Math.random() * 15) + 8; // 8-23%

    // Instagram
    const igViews = Math.floor(Math.random() * 25) + 25; // 25k-50k
    const igGrowth = Math.floor(Math.random() * 10) + 5; // 5-15%

    // Blog
    const blogViews = Math.floor(Math.random() * 10) + 8; // 8k-18k
    const blogGrowth = Math.floor(Math.random() * 8) + 2; // 2-10%

    // Threads
    const thViews = Math.floor(Math.random() * 8) + 3; // 3k-11k
    const thGrowth = Math.floor(Math.random() * 15) + 1; // 1-16% (Volatile)

    const totalViews = ytViews + igViews + blogViews + thViews;

    return [
        {
            name: 'YouTube',
            value: Math.round((ytViews / totalViews) * 100),
            color: 'bg-red-500',
            expected: `${ytViews}K`,
            growth: `+${ytGrowth}%`,
            trend: 'Shorts 알고리즘 우대 중'
        },
        {
            name: 'Instagram',
            value: Math.round((igViews / totalViews) * 100),
            color: 'bg-pink-500',
            expected: `${igViews}K`,
            growth: `+${igGrowth}%`,
            trend: 'Reels 체류시간 증가'
        },
        {
            name: 'Blog',
            value: Math.round((blogViews / totalViews) * 100),
            color: 'bg-green-500',
            expected: `${blogViews}K`,
            growth: `+${blogGrowth}%`,
            trend: '스마트블록 노출 확대'
        },
        {
            name: 'Threads',
            value: Math.round((thViews / totalViews) * 100),
            color: 'bg-gray-500',
            expected: `${thViews}K`,
            growth: `+${thGrowth}%`,
            trend: '텍스트 기반 소통 증가'
        }
    ];
};

/**
 * [New Feature] YouTube Trend Scout
 * Mocks the YouTube Data API for trending topics.
 */
export const getYouTubeTrends = () => {
    return [
        { keyword: "AI 뮤직비디오", volume: "Very High", competition: "Medium", opportunityScore: 88 },
        { keyword: "편의점 신상 리뷰", volume: "High", competition: "High", opportunityScore: 72 },
        { keyword: "1분 홈트레이닝", volume: "High", competition: "Medium", opportunityScore: 81 }
    ];
};

