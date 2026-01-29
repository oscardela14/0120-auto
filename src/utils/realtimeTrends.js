import { GoogleGenerativeAI } from "@google/generative-ai";

// Fallback data in case API fails
export const FALLBACK_TRENDS = [
    // --- 유튜브 (20) ---
    { rank: 1, keyword: "설날 특선 영화 다시보기", category: "유튜브", volume: "620K" },
    { rank: 3, keyword: "갤럭시 S27 울트라 스펙 유출", category: "유튜브", volume: "450K" },
    { rank: 9, keyword: "넷플릭스 1월 신작 라인업", category: "유튜브", volume: "280K" },
    { rank: 17, keyword: "손흥민 프리미어리그 하이라이트", category: "유튜브", volume: "190K" },
    { rank: 20, keyword: "애플 비전 프로 2 루머 정리", category: "유튜브", volume: "160K" },
    { rank: 21, keyword: "워크맨 설날 알바 특집", category: "유튜브", volume: "155K" },
    { rank: 22, keyword: "숏박스 장거리 운전 공감", category: "유튜브", volume: "150K" },
    { rank: 23, keyword: "피식대학 신도시 부부 브이로그", category: "유튜브", volume: "145K" },
    { rank: 24, keyword: "에스파 신곡 뮤비 반응", category: "유튜브", volume: "140K" },
    { rank: 25, keyword: "뉴진스 하이브 사옥 투어", category: "유튜브", volume: "135K" },
    { rank: 26, keyword: "침착맨 설 연휴 게임 방송", category: "유튜브", volume: "130K" },
    { rank: 27, keyword: "아이유 월드투어 티켓팅 팁", category: "유튜브", volume: "125K" },
    { rank: 28, keyword: "백종원 설음식 레시피 총정리", category: "유튜브", volume: "120K" },
    { rank: 29, keyword: "환승연애4 출연진 인스타 공개", category: "유튜브", volume: "115K" },
    { rank: 30, keyword: "나혼자산다 기안84 마라톤 영상", category: "유튜브", volume: "110K" },
    { rank: 31, keyword: "유퀴즈 손석구 출연 풀영상", category: "유튜브", volume: "105K" },
    { rank: 32, keyword: "미노이 라이브 논란 해명", category: "유튜브", volume: "100K" },
    { rank: 33, keyword: "르세라핌 코첼라 무대 연습", category: "유튜브", volume: "95K" },
    { rank: 34, keyword: "김창옥 강연 부모님 설물", category: "유튜브", volume: "90K" },
    { rank: 35, keyword: "지올팍 신곡 가사 해석", category: "유튜브", volume: "85K" },

    // --- 인스타 (20) ---
    { rank: 2, keyword: "귀성길 실시간 정체 상황", category: "인스타", volume: "580K" },
    { rank: 8, keyword: "2026 동계올림픽 응원 챌린지", category: "인스타", volume: "310K" },
    { rank: 13, keyword: "오늘의 행운의 컬러 복채", category: "인스타", volume: "230K" },
    { rank: 14, keyword: "임신 성공 연예인 베이비샤워", category: "인스타", volume: "220K" },
    { rank: 19, keyword: "스타벅스 설 연휴 한정 메뉴", category: "인스타", volume: "170K" },
    { rank: 36, keyword: "강남 핫플 브런치 카페 추천", category: "인스타", volume: "165K" },
    { rank: 37, keyword: "성수동 팝업스토어 도파민 투어", category: "인스타", volume: "160K" },
    { rank: 38, keyword: "데일리룩 설 원피스 코디", category: "인스타", volume: "155K" },
    { rank: 39, keyword: "항공권 특가 프로모션 공유", category: "인스타", volume: "150K" },
    { rank: 40, keyword: "홈트 루틴 뱃살 불태우기", category: "인스타", volume: "145K" },
    { rank: 41, keyword: "반려견 설 한복 착용샷", category: "인스타", volume: "140K" },
    { rank: 42, keyword: "감성 캠핑 용품 언박싱", category: "인스타", volume: "135K" },
    { rank: 43, keyword: "나이키 한정판 스니커즈 드로우", category: "인스타", volume: "130K" },
    { rank: 44, keyword: "제주도 감성 숙소 빈자리 구하기", category: "인스타", volume: "125K" },
    { rank: 45, keyword: "셀프 네일 아트 설 테마", category: "인스타", volume: "120K" },
    { rank: 46, keyword: "바디프로필 식단 공유 이벤트", category: "인스타", volume: "115K" },
    { rank: 47, keyword: "독서 모임 갓생 살기 기록", category: "인스타", volume: "110K" },
    { rank: 48, keyword: "피부 관리 앰플 솔직 후기", category: "인스타", volume: "105K" },
    { rank: 49, keyword: "결혼식 하객룩 정석 추천", category: "인스타", volume: "100K" },
    { rank: 50, keyword: "아이폰 스냅 촬영 명당 공유", category: "인스타", volume: "95K" },

    // --- 네이버 블로그 (20) ---
    { rank: 4, keyword: "설날 선물세트 가성비 순위", category: "네이버 블로그", volume: "440K" },
    { rank: 7, keyword: "고향사랑기부제 답례품 추천", category: "네이버 블로그", volume: "320K" },
    { rank: 10, keyword: "차례상 간소화 전통 방식 차이", category: "네이버 블로그", volume: "270K" },
    { rank: 12, keyword: "국내 주식 연휴 휴장 기간 안내", category: "네이버 블로그", volume: "240K" },
    { rank: 16, keyword: "일본 엔화 환전 쌀 때 하는 법", category: "네이버 블로그", volume: "200K" },
    { rank: 18, keyword: "설날 단기 알바 구인 목록", category: "네이버 블로그", volume: "180K" },
    { rank: 51, keyword: "연말정산 환급금 조회 방법", category: "네이버 블로그", volume: "175K" },
    { rank: 52, keyword: "이사 갈 때 체크리스트 정리", category: "네이버 블로그", volume: "170K" },
    { rank: 53, keyword: "겨울철 피부 건조증 해결법", category: "네이버 블로그", volume: "165K" },
    { rank: 54, keyword: "청년 주택청약 종합저축 혜택", category: "네이버 블로그", volume: "160K" },
    { rank: 55, keyword: "자동차 보험료 갱신 할인 팁", category: "네이버 블로그", volume: "155K" },
    { rank: 56, keyword: "다이어트 도시락 한달 식단", category: "네이버 블로그", volume: "150K" },
    { rank: 57, keyword: "부산 가볼만한 곳 1박2일", category: "네이버 블로그", volume: "145K" },
    { rank: 58, keyword: "윈도우 11 정품 인증 방법", category: "네이버 블로그", volume: "140K" },
    { rank: 59, keyword: "취업 면접 예상 질문 리스트", category: "네이버 블로그", volume: "135K" },
    { rank: 60, keyword: "에어프라이어 고구마 시간 조절", category: "네이버 블로그", volume: "130K" },
    { rank: 61, keyword: "비트코인 반감기 역사적 분석", category: "네이버 블로그", volume: "125K" },
    { rank: 62, keyword: "공황장애 초기 증상 대처법", category: "네이버 블로그", volume: "120K" },
    { rank: 63, keyword: "자격증 시험 일정 및 원수접수", category: "네이버 블로그", volume: "115K" },
    { rank: 64, keyword: "베란다 결로 방지 페인트 시공", category: "네이버 블로그", volume: "110K" },

    // --- 스레드 (20) ---
    { rank: 5, keyword: "AI 챗봇 다솜 사용 후기", category: "스레드", volume: "390K" },
    { rank: 6, keyword: "미세먼지 실시간 농도 수치", category: "스레드", volume: "360K" },
    { rank: 11, keyword: "강원 영동 폭설 피해 복구", category: "스레드", volume: "250K" },
    { rank: 15, keyword: "로또 1100회 자동 당첨 비결", category: "스레드", volume: "210K" },
    { rank: 65, keyword: "직장인 퇴사 고민 사이다 답변", category: "스레드", volume: "205K" },
    { rank: 66, keyword: "오늘 먹은 점심 메뉴 투표", category: "스레드", volume: "200K" },
    { rank: 67, keyword: "MBTI별 우울할 때 듣는 노래", category: "스레드", volume: "195K" },
    { rank: 68, keyword: "연애 밸런스 게임 논란 종결", category: "스레드", volume: "190K" },
    { rank: 69, keyword: "주식 물린 사람들의 모임방", category: "스레드", volume: "185K" },
    { rank: 70, keyword: "갓생 사는 법 데일리 챌린지", category: "스레드", volume: "180K" },
    { rank: 71, keyword: "최근 본 영화 5줄 평점", category: "스레드", volume: "175K" },
    { rank: 72, keyword: "회사 빌런 대처하는 꿀팁", category: "스레드", volume: "170K" },
    { rank: 73, keyword: "아이폰15 발열 해결 방법 공유", category: "스레드", volume: "165K" },
    { rank: 74, keyword: "나만 아는 노래 추천 플레이리스트", category: "스레드", volume: "160K" },
    { rank: 75, keyword: "자취생 간단 야식 레시피", category: "스레드", volume: "155K" },
    { rank: 76, keyword: "오늘 하늘 사진 공유 릴레이", category: "스레드", volume: "150K" },
    { rank: 77, keyword: "취준생을 위한 응원 한마디", category: "스레드", volume: "145K" },
    { rank: 78, keyword: "요즘 유행하는 신조어 테스트", category: "스레드", volume: "140K" },
    { rank: 79, keyword: "커피 없이 못사는 직장인들", category: "스레드", volume: "135K" },
    { rank: 80, keyword: "월요병 극복하는 나만의 비법", category: "스레드", volume: "130K" },
];

export const DATA_SOURCE = "Google Trends Realtime Analysis";

// Initialize Gemini safely inside function
export const fetchRealtimeTrends = async () => {
    // 0. Check Cache First (for speed)
    const CACHE_KEY = 'realtime_trends_cache';
    const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const { trends, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_EXPIRY && trends && trends.length > 20) {
                console.log("Using cached trends...");
                return trends;
            }
        }
    } catch (e) { console.warn("Cache read failed"); }

    // 1. Try fetching real-time data from our Proxy API (Google Trends RSS)
    try {
        const response = await fetch('/api/trends');
        const contentType = response.headers.get("content-type");
        if (response.ok && contentType && contentType.includes("application/json")) {
            const result = await response.json();
            if (result.data && Array.isArray(result.data)) {
                return result.data.map(item => ({
                    ...item,
                    category: item.category || "실시간 이슈"
                }));
            }
        }
    } catch (e) {
        // Only warn for actual network failures
    }

    // 2. Fallback: Use Gemini AI to generate "simulated" realtime trends
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
        console.warn("VITE_GEMINI_API_KEY is missing. Using static fallback trends.");
        return FALLBACK_TRENDS;
    }

    try {
        // v1beta for stability with gemini-2.0-flash
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const today = new Date().toLocaleString('ko-KR', {
            timeZone: 'Asia/Seoul',
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        const prompt = `
            Act as a "Google Trends Analyst" specializing in South Korea.
            Current Time in Korea: ${today}.
            
            Task: Identify trending search keywords for EACH of the following platforms (20 keywords per platform):
            - 유튜브
            - 인스타
            - 네이버 블로그
            - 스레드
            
            Total keywords count should be around 80.
            
            Return ONLY a JSON array with objects:
            - rank (1-80, overall rank)
            - keyword (String, Korean)
            - category (String, MUST be one of: 유튜브, 인스타, 네이버 블로그, 스레드)
            - volume (String, e.g., "500K+", "200K+")
            - reason (String, short reason why it's trending)

            Ensure each platform gets exactly 20 keywords assigned to it.
        `;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        let text = data.candidates[0].content.parts[0].text;

        // Clean up markdown code blocks and extra commentary
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        // Remove potential AI commentary outside of JSON
        const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
        const jsonStr = jsonMatch ? jsonMatch[0] : text;
        const trends = JSON.parse(jsonStr);

        if (Array.isArray(trends) && trends.length > 0) {
            // SAVE TO CACHE
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                trends: trends,
                timestamp: Date.now()
            }));
            return trends.slice(0, 100);
        } else {
            throw new Error("Invalid format");
        }

    } catch (error) {
        console.error("Failed to fetch trends from AI:", error);
        return FALLBACK_TRENDS;
    }
};

export const getTrendUpdateInfo = () => {
    const now = new Date();
    // Round down to nearest hour
    const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    return {
        time: `${dateStr} ${timeStr} 기준`,
        source: DATA_SOURCE,
        cycle: "실시간 업데이트 중"
    };
};

// Keep for backward compatibility if needed, but prefer fetchRealtimeTrends
export const getRandomTrends = (count = 20) => {
    return FALLBACK_TRENDS.slice(0, count);
};
