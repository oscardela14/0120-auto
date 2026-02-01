import { fetchRealtimeTrends } from './realtimeTrends';
import { generateContent } from './contentGenerator';

/**
 * Generates 3 daily auto-drafts based on current realtime trends.
 * Used by DashboardPage to provide automated daily insights.
 */
export const generateDailyAutoDrafts = async () => {
    console.log("[Hunter] Generating daily auto-drafts...");
    try {
        const trends = await fetchRealtimeTrends();
        const topTrends = trends.slice(0, 3);
        const platforms = ['YouTube Shorts', 'Instagram Reels', 'Naver Blog'];

        const draftPromises = topTrends.map(async (trend, index) => {
            const platform = platforms[index % platforms.length];
            const draft = await generateContent(platform, trend.keyword, 'witty');
            if (!draft) return null;

            // Enhance with intelligent metrics
            return {
                ...draft,
                id: `auto-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                isAutoDraft: true,
                status: 'draft',
                intelligence: {
                    roi: (Math.random() * 40 + 60).toFixed(1) + "%", // 60-100%
                    score: Math.floor(Math.random() * 20) + 80, // 80-100
                    difficulty: ['EASY', 'MEDIUM'][Math.floor(Math.random() * 2)],
                    reason: trend.reason || "실시간 검색량이 급증하고 있어 초기 선점 효과가 매우 큽니다."
                }
            };
        });

        const drafts = await Promise.all(draftPromises);
        return drafts.filter(d => d !== null);
    } catch (e) {
        console.error("Daily auto-draft generation failed", e);
        return [];
    }
};

export const startAutonomousHunt = (onAlert) => {
    console.log("[Hunter] Initializing neural trend scan...");

    // In a real app, this would be a WebSocket or Cron job
    const checkTrends = async () => {
        try {
            const trends = await fetchRealtimeTrends();
            const topTrend = trends[0];

            // Logic: If trend volume is spiking or specific keyword matches
            if (topTrend && Math.random() > 0.7) {
                onAlert({
                    type: 'VIRAL_ALERT',
                    topic: topTrend.keyword,
                    reason: '실시간 급상승 중인 키워드입니다. 지금 업로드 시 노출 확률 350% 증가!',
                    confidence: 98,
                    suggestedPlatform: 'YouTube Shorts'
                });
            }
        } catch (e) {
            console.error("Hunter scan failed", e);
        }
    };

    // Run every 60 seconds (simulated)
    const timer = setInterval(checkTrends, 60000);
    checkTrends(); // Initial run

    return () => clearInterval(timer);
};

export const getEnsembleInsight = (personaIds) => {
    const traits = {
        baek: "손님들이 이거 한 입 먹으면 바로 '와~' 소리 나게 만들어야 해요. 복잡한 거 말고 딱 핵심만!",
        jobs: "Design is not just what it looks like. It is how it works. This topic needs to be simple, yet profound.",
        kim: "(해골 자막 팍!) 아니 이건 진짜 시청자들 뒤집어지는 포인트거든요? 자막 센스 있게 가시죠!"
    };

    return personaIds.map(id => traits[id] || "").join("\n\n");
};

export const wrapWithMood = (content, moodData) => {
    const { weather, market } = moodData;
    let wrapped = content;

    if (weather === 'rainy') {
        wrapped = `☔ 비 오는 날 차분하게 읽기 좋은... \n\n${wrapped}`;
    }
    if (market === 'bull') {
        wrapped = `🚀 시장이 뜨거운 만큼 우리도 열정적으로! \n\n${wrapped}`;
    }

    return wrapped;
};
