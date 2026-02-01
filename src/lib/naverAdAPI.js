/**
 * Naver Search Ad API Integration
 * 네이버 검색광고 API 연동 모듈
 * 
 * API 문서: https://naver.github.io/searchad-apidoc
 */

const NAVER_AD_API_BASE = import.meta.env.DEV
    ? '/naver-api'
    : 'https://api.searchad.naver.com';

/**
 * 네이버 광고 API 클라이언트
 */
import { secureProxyCall } from '../services/apiProxy';

/**
 * 네이버 광고 API 클라이언트 (보안 프록시 버전)
 */
class NaverAdAPI {
    /**
     * 키워드 도구 API 호출
     * @param {Array<string>} keywords - 조회할 키워드 배열
     * @returns {Promise<Object>} 키워드 데이터
     */
    async getKeywordStats(keywords) {
        console.log("%c [SECURITY] Naver Keyword Stats via Proxy", "color: green; font-weight: bold;");

        try {
            const response = await secureProxyCall('naver', 'keywordStats', {
                keywords: Array.isArray(keywords) ? keywords : [keywords]
            });

            if (response.success && response.data) {
                return this.formatKeywordData(response.data);
            }

            throw new Error(response.error || "NAVER_PROXY_ERROR");
        } catch (error) {
            console.warn('네이버 광고 API 호출 실패, Mock 데이터를 반환합니다:', error);
            return this.getMockKeywordStats(keywords);
        }
    }

    /**
     * API 응답 데이터 포맷팅
     */
    formatKeywordData(apiResponse) {
        if (!apiResponse || !apiResponse.keywordList) return [];

        return apiResponse.keywordList.map(item => ({
            keyword: item.relKeyword,
            monthlyPcQcCnt: item.monthlyPcQcCnt || 0,
            monthlyMobileQcCnt: item.monthlyMobileQcCnt || 0,
            totalVolume: (item.monthlyPcQcCnt || 0) + (item.monthlyMobileQcCnt || 0),
            compIdx: item.compIdx || 'low',
            plAvgDepth: item.plAvgDepth || 0,
            verified: true,
            source: 'naver_ad_api',
            timestamp: new Date().toISOString()
        }));
    }

    /**
     * Mock 데이터 생성
     */
    getMockKeywordData(keyword, index = 0) {
        const baseVolumes = [14500, 8300, 5600, 3200];
        const competitions = ['low', 'medium', 'high', 'low'];

        return {
            keyword,
            monthlyPcQcCnt: Math.floor(baseVolumes[index % 4] * 0.4),
            monthlyMobileQcCnt: Math.floor(baseVolumes[index % 4] * 0.6),
            totalVolume: baseVolumes[index % 4],
            compIdx: competitions[index % 4],
            plAvgDepth: 3 + (index % 3),
            verified: false,
            source: 'mock_data',
            timestamp: new Date().toISOString()
        };
    }

    getMockKeywordStats(keywords) {
        return keywords.map((keyword, index) => this.getMockKeywordData(keyword, index));
    }

    /**
     * 연관 키워드 추천 API
     */
    async getRelatedKeywords(seedKeyword, limit = 10) {
        try {
            const response = await secureProxyCall('naver', 'relatedKeywords', {
                seedKeyword,
                limit
            });

            if (response.success && response.data) {
                const formatted = this.formatKeywordData(response.data);
                return formatted.slice(0, limit);
            }
            throw new Error(response.error || "NAVER_RELATED_PROXY_ERROR");
        } catch (error) {
            console.error('연관 키워드 조회 실패:', error);
            return this.getMockRelatedKeywords(seedKeyword, limit);
        }
    }

    getMockRelatedKeywords(seedKeyword, limit) {
        const suffixes = ['추천', '방법', '가이드', '팁', '노하우', '순위', '비교', '리뷰', '후기', '정보'];
        return suffixes.slice(0, limit).map((suffix, index) => {
            const keyword = `${seedKeyword} ${suffix}`;
            return this.getMockKeywordData(keyword, index);
        });
    }
}

/**
 * 네이버 광고 API 인스턴스 생성
 */
export const createNaverAdAPI = () => {
    return new NaverAdAPI();
};

/**
 * 키워드 검색량 조회
 */
export const getKeywordVolume = async (keywords) => {
    const api = createNaverAdAPI();
    return await api.getKeywordStats(keywords);
};

/**
 * 연관 키워드 조회
 */
export const getRelatedKeywords = async (seedKeyword, limit = 10) => {
    const api = createNaverAdAPI();
    return await api.getRelatedKeywords(seedKeyword, limit);
};

export default NaverAdAPI;
