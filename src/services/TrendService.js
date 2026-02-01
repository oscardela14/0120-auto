import { fetchRealtimeTrends, getTrendUpdateInfo, getRandomTrends } from '../utils/realtimeTrends';
import { generateContent } from '../utils/contentGenerator';

/**
 * TREND SERVICE
 * 트렌드와 관련된 모든 비즈니스 로직을 중앙 관리합니다.
 */
export const TrendService = {
    /**
     * 실시간 트렌드 목록 로드 (실패 시 랜덤 데이터 폴백)
     */
    async getLiveTrends() {
        try {
            return await fetchRealtimeTrends();
        } catch (e) {
            console.error("[TrendService] Failed to fetch live trends:", e);
            return getRandomTrends(20);
        }
    },

    /**
     * 트렌드 업데이트 정보 (시간, 사이클) 가져오기
     */
    getUpdateStatus() {
        return getTrendUpdateInfo();
    },

    /**
     * 단일 트렌드에 대한 AI 전략 초안 생성 및 저장
     */
    async generateAndSaveDraft(topic, platform, addToHistory) {
        // 플랫폼 명칭 정규화
        const platformMap = {
            '인스타': 'Instagram Reels',
            '네이버 블로그': 'Naver Blog',
            '스레드': 'Threads',
            '유튜브': 'YouTube Shorts'
        };
        const targetPlatform = platformMap[platform] || platform;

        const aiResult = await generateContent(targetPlatform, topic, 'witty');
        if (!aiResult) throw new Error("AI_GENERATION_FAILED");

        const finalResult = { ...aiResult, topic, platform: targetPlatform };

        // 데이터베이스(History) 저장
        await addToHistory(finalResult);

        return finalResult;
    },

    /**
     * 4대 플랫폼 원스톱 일괄 발행 프로세스
     */
    async processOneStopPublish(topic, addToHistory) {
        const platforms = ['YouTube Shorts', 'Instagram Reels', 'Naver Blog', 'Threads'];

        // 병렬 처리 (성능 최적화)
        const promises = platforms.map(platform => generateContent(platform, topic, 'witty'));
        const results = await Promise.all(promises);

        const validResults = results.filter(r => r !== null);
        if (validResults.length === 0) throw new Error("ALL_GENERATIONS_FAILED");

        // 히스토리 일괄 저장
        const historyPromises = validResults.map(result => addToHistory({
            ...result,
            id: Date.now() + Math.random(),
            isOneStop: true,
            originPlatform: result.platform
        }));

        await Promise.all(historyPromises);

        return {
            successCount: validResults.length,
            totalCount: platforms.length
        };
    }
};
