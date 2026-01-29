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
class NaverAdAPI {
    constructor(apiKey, secretKey, customerId) {
        this.apiKey = apiKey;
        this.secretKey = secretKey;
        this.customerId = customerId;
    }

    /**
     * API 요청 서명 생성 (HMAC-SHA256)
     * Naver Search Ad API 규격 준수
     */
    async generateSignature(timestamp, method, uri) {
        const message = `${timestamp}.${method}.${uri}`;
        const secretKey = this.secretKey; // 비밀키

        try {
            const encoder = new TextEncoder();
            const keyData = encoder.encode(secretKey);
            const msgData = encoder.encode(message);

            const key = await window.crypto.subtle.importKey(
                "raw",
                keyData,
                { name: "HMAC", hash: "SHA-256" },
                false,
                ["sign"]
            );

            const signature = await window.crypto.subtle.sign(
                "HMAC",
                key,
                msgData
            );

            // Byt array to Base64
            const signatureArray = new Uint8Array(signature);
            let binary = '';
            for (let i = 0; i < signatureArray.length; i++) {
                binary += String.fromCharCode(signatureArray[i]);
            }
            return btoa(binary);

        } catch (error) {
            console.error("Signature Generation Failed:", error);
            // Fallback for demo only (should not happen in modern browsers)
            return btoa(message);
        }
    }

    /**
     * API 요청 헤더 생성
     */
    async getHeaders(method, uri) {
        const timestamp = Date.now().toString();
        const signature = await this.generateSignature(timestamp, method, uri);

        return {
            'Content-Type': 'application/json',
            'X-API-KEY': this.apiKey,
            'X-Customer': this.customerId,
            'X-Timestamp': timestamp,
            'X-Signature': signature
        };
    }

    /**
     * 키워드 도구 API 호출
     * @param {Array<string>} keywords - 조회할 키워드 배열
     * @returns {Promise<Object>} 키워드 데이터
     */
    async getKeywordStats(keywords) {
        if (!this.apiKey || !this.secretKey) {
            console.warn('네이버 광고 API 키가 설정되지 않았습니다. Mock 데이터를 반환합니다.');
            return this.getMockKeywordStats(keywords);
        }

        const uri = '/keywordstool';
        const method = 'GET';

        try {
            const queryParams = new URLSearchParams({
                hintKeywords: keywords.join(','),
                showDetail: '1'
            });

            const headers = await this.getHeaders(method, uri);
            const response = await fetch(`${NAVER_AD_API_BASE}${uri}?${queryParams}`, {
                method,
                headers
            });

            if (!response.ok) {
                const errorBody = await response.text();
                console.error(`❌ Naver API Error [${response.status}]:`, errorBody);
                try {
                    // Try to parse JSON for better logging
                    const errorJson = JSON.parse(errorBody);
                    console.error("Error Detail:", errorJson);
                } catch (e) { /* Not JSON */ }

                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            return this.formatKeywordData(data);
        } catch (error) {
            console.error('네이버 광고 API 호출 실패 (상세 로그 확인 필요):', error);
            // 에러 발생 시 Mock 데이터로 폴백
            return this.getMockKeywordStats(keywords);
        }
    }

    /**
     * API 응답 데이터 포맷팅
     */
    formatKeywordData(apiResponse) {
        if (!apiResponse.keywordList) return [];

        return apiResponse.keywordList.map(item => ({
            keyword: item.relKeyword,
            monthlyPcQcCnt: item.monthlyPcQcCnt || 0,
            monthlyMobileQcCnt: item.monthlyMobileQcCnt || 0,
            totalVolume: (item.monthlyPcQcCnt || 0) + (item.monthlyMobileQcCnt || 0),
            compIdx: item.compIdx || 'low', // high, medium, low
            plAvgDepth: item.plAvgDepth || 0,
            verified: true,
            source: 'naver_ad_api',
            timestamp: new Date().toISOString()
        }));
    }

    /**
     * Mock 데이터 생성 (API 키 없을 때)
     */
    getMockKeywordData(keyword, index = 0) {
        const baseVolumes = [14500, 8300, 5600, 3200];
        const competitions = ['low', 'medium', 'high', 'low'];
        const scores = [92, 85, 78, 88];

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
        if (!this.apiKey || !this.secretKey) {
            return this.getMockRelatedKeywords(seedKeyword, limit);
        }

        const uri = '/keywordstool';
        const method = 'GET';

        try {
            const queryParams = new URLSearchParams({
                hintKeywords: seedKeyword,
                showDetail: '1'
            });

            const headers = await this.getHeaders(method, uri);
            const response = await fetch(`${NAVER_AD_API_BASE}${uri}?${queryParams}`, {
                method,
                headers
            });

            if (!response.ok) {
                const errorBody = await response.text();
                console.error(`❌ Naver Related API Error [${response.status}]:`, errorBody);
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            const formatted = this.formatKeywordData(data);
            return formatted.slice(0, limit);
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
    const apiKey = import.meta.env.VITE_NAVER_AD_API_KEY?.trim();
    const secretKey = import.meta.env.VITE_NAVER_AD_SECRET_KEY?.trim();
    const customerId = import.meta.env.VITE_NAVER_AD_CUSTOMER_ID?.trim();

    return new NaverAdAPI(apiKey, secretKey, customerId);
};

/**
 * 키워드 검색량 조회 (간편 래퍼)
 */
export const getKeywordVolume = async (keywords) => {
    const api = createNaverAdAPI();
    return await api.getKeywordStats(Array.isArray(keywords) ? keywords : [keywords]);
};

/**
 * 연관 키워드 조회 (간편 래퍼)
 */
export const getRelatedKeywords = async (seedKeyword, limit = 10) => {
    const api = createNaverAdAPI();
    return await api.getRelatedKeywords(seedKeyword, limit);
};

export default NaverAdAPI;
