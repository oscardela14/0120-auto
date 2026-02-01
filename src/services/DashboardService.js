import { generateDailyAutoDrafts } from '../utils/autonomousHunter';
import { fetchLiveStats, calculateLTV } from '../utils/revenueEngine';
import { z } from 'zod';

/**
 * [Schemas] 수익 데이터 및 브리핑 구조 검증
 */
const AutoDraftSchema = z.array(z.object({
    topic: z.string(),
    platform: z.string(),
    intelligence: z.object({
        roi: z.string(),
        difficulty: z.string(),
        reason: z.string()
    }),
    sections: z.array(z.any())
}));

/**
 * [Transformers] 데이터 가공 파이프라인
 */
const transformAutonomousData = (raw) => {
    const result = AutoDraftSchema.safeParse(raw);
    if (!result.success) {
        console.warn("[DashboardService] AutoDraft validation failed:", result.error);
        return null;
    }
    return result.data;
};

const transformRevenueItem = (item) => {
    const niche = item.topic ? (item.topic.includes('돈') ? 'Finance' : 'General') : 'General';
    const ltv = calculateLTV({ views: 5000, engagementRate: 5 }, niche);
    return {
        ...item,
        niche,
        ltv: ltv.valuation
    };
};

/**
 * DashboardService
 * Handles data aggregation, background simulations, and dashboard-specific business logic.
 */
export const DashboardService = {
    /**
     * 생산성 지표 계산 (절약 시간, 예상 조회수 등)
     */
    calculateProductivity(historyCount) {
        // historyCount가 0이거나 유효하지 않으면 수치를 0으로 반환하여 신규/미로그인 사용자의 혼선 방지
        if (!historyCount || historyCount === 0) {
            return {
                savedHours: "0.0",
                potentialViews: "0"
            };
        }

        const savedMinutes = historyCount * 45;
        const savedHours = (savedMinutes / 60).toFixed(1);
        const potentialViews = (historyCount * 1500).toLocaleString();

        return {
            savedHours,
            potentialViews
        };
    },

    /**
     * 전체 자산 가치 및 플랫폼별 수익 분배 계산
     */
    calculateRevenueSnapshot(history) {
        const transformedData = history.map(transformRevenueItem);
        const totalPotentialValue = transformedData.reduce((acc, item) => acc + item.ltv, 0);

        return {
            totalPotential: totalPotentialValue.toLocaleString(),
            totalPotentialRaw: totalPotentialValue,
            breakdown: {
                adsense: Math.round(totalPotentialValue * 0.45).toLocaleString(),
                affiliate: Math.round(totalPotentialValue * 0.35).toLocaleString(),
                sponsorship: Math.round(totalPotentialValue * 0.20).toLocaleString()
            }
        };
    },

    /**
     * 자율 주행 엔진 브리핑 데이터 생성 (30분 주기)
     */
    async getAutonomousBriefing() {
        const lastDraftTime = localStorage.getItem('last_auto_draft_time');
        const now = Date.now();
        const THIRTY_MINUTES = 30 * 60 * 1000;

        if (!lastDraftTime || (now - parseInt(lastDraftTime)) > THIRTY_MINUTES) {
            console.log("[DashboardService] Triggering Intelligence Refresh...");
            try {
                const drafts = await generateDailyAutoDrafts();
                return transformAutonomousData(drafts);
            } catch (e) {
                console.error("[DashboardService] Auto-Draft failed", e);
            }
        }
        return null;
    },

    /**
     * 랜덤 미션 피드 로그 데이터 생성
     */
    generateMissionLog() {
        const missionTypes = [
            { type: 'SCAN', msg: "에이전트 Alpha가 수익 사각지대 발견", color: 'from-indigo-500 to-purple-500', iconColor: 'text-indigo-400' },
            { type: 'RECON', msg: "경쟁 채널 'X' 고수익 패턴 역설계", color: 'from-emerald-500 to-teal-500', iconColor: 'text-emerald-400' },
            { type: 'SYNC', msg: "글로벌 트렌드 데이터 동기화 (30m)", color: 'from-amber-500 to-orange-500', iconColor: 'text-amber-400' },
            { type: 'SEO', msg: "상위 랭커 로직 분석 기반 SEO 추출", color: 'from-pink-500 to-rose-500', iconColor: 'text-pink-400' }
        ];
        return { ...missionTypes[Math.floor(Math.random() * missionTypes.length)], id: Date.now() + Math.random() };
    }
};
