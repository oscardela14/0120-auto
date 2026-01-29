/**
 * Real-time SEO & Viral Scoring Engine v2.0
 * 실제 입력된 소스 코드를 바탕으로 알고리즘 점수를 산출합니다.
 */

const POWER_WORDS = [
    '비결', '비밀', '방법', '추천', '리뷰', '충격', '확인', '공개', '수익', '한달', '후기', '정리', '가이드',
    '폭성장', '핵심', '정체', '이유', '주의', '필수', '무조건', '역대급', '최초', '단독', '매직', '치트키',
    '폭로', '경고', '금지', '100%', '당장', '절대', '소름', '드디어', '정답', '완벽', '인생템'
];

export const calculateRealSEOScore = (content, platform) => {
    const { title = '', drafts = [], hashtags = [] } = content;
    const fullText = drafts.map(d => d.text || d.content || '').join(' ');

    if (!title.trim() && (!fullText || fullText.trim().length < 5)) {
        return {
            overall: 0,
            breakdown: { hook: 0, relevance: 0, readability: 0, engagement: 0 },
            status: 'EMPTY'
        };
    }

    // 1. [HOOK] 제목 후킹 잠재력 (25점 만점 -> 현실적으로 22점 만점 수준으로 채점)
    let hookPoint = 0;
    const titleLen = title.length;
    // 길이 최적화 (20~40자 선호)
    if (titleLen >= 20 && titleLen <= 40) hookPoint += 10;
    else if (titleLen > 10) hookPoint += 5;

    // 파워 워드 밀도
    const foundPowerWords = POWER_WORDS.filter(word => title.includes(word));
    if (foundPowerWords.length >= 2) hookPoint += 8;
    else if (foundPowerWords.length === 1) hookPoint += 5;

    // 의문문 또는 느낌표 활용
    if (title.includes('?') || title.includes('!')) hookPoint += 4;

    // 이모지 활용 여부 (소셜 최적화)
    const hasEmoji = /[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u.test(title);
    if (hasEmoji) hookPoint += 3;

    // 2. [RELEVANCE] 키워드 동기화 및 밀도 (25점)
    let relevancePoint = 0;
    const titleKeywords = title.split(/\s+/).filter(w => w.length > 1);
    const matches = titleKeywords.filter(w => fullText.includes(w)).length;

    if (titleKeywords.length > 0) {
        const matchRatio = matches / titleKeywords.length;
        relevancePoint = matchRatio * 20; // 제목 키워드가 본문에 얼마나 있나
    }

    // 도입부 키워드 배치 (첫 100자에 제목 키워드 포함여부)
    const introText = fullText.substring(0, 100);
    const introMatch = titleKeywords.some(w => introText.includes(w));
    if (introMatch) relevancePoint += 5;

    // 키워드 어뷰징 방지
    const density = (matches / (fullText.split(/\s+/).length || 1)) * 100;
    if (density > 20) relevancePoint -= 12;

    // 3. [READABILITY] 구조적 가독성 (25점)
    let readabilityPoint = 0;
    const sectionCount = drafts.length;
    const totalChars = fullText.length;

    if (platform.includes('Blog')) {
        // 블로그: 5개 이상의 섹션, 800자 이상의 충분한 텍스트
        if (sectionCount >= 5) readabilityPoint += 10;
        else if (sectionCount >= 3) readabilityPoint += 5;

        if (totalChars > 800) readabilityPoint += 15;
        else if (totalChars > 400) readabilityPoint += 8;
    } else {
        // 쇼츠/릴스/스레드: 간결한 호흡, 씬 분할
        if (sectionCount >= 5) readabilityPoint += 15;
        if (totalChars < 500) readabilityPoint += 10; // 너무 길면 이탈
    }

    // 4. [ENGAGEMENT] 공유 및 도달 잠재력 (25점)
    let engagementPoint = 0;
    const tags = Array.isArray(hashtags) ? hashtags : (typeof hashtags === 'string' ? hashtags.split(/\s+/) : []);
    const validTags = tags.filter(t => t.startsWith('#') && t.length > 2);

    // 해시태그 최적 개수 (5~10개)
    if (validTags.length >= 5 && validTags.length <= 10) engagementPoint += 15;
    else if (validTags.length > 0) engagementPoint += 8;

    // CTA(Call to Action) 문구 포함 여부
    const CTA_WORDS = ['댓글', '좋아요', '구독', '팔로우', '링크', '공유', '저장'];
    const hasCTA = CTA_WORDS.some(word => fullText.includes(word));
    if (hasCTA) engagementPoint += 10;

    // 5. [PENALTY] 현실적 제약
    let penalty = 0;
    if (fullText.length < 30) penalty += 50; // 성의 부족
    if (titleLen < 5) penalty += 20;

    const overall = Math.floor(hookPoint + relevancePoint + readabilityPoint + engagementPoint - penalty);

    return {
        overall: Math.max(5, Math.min(100, overall)),
        breakdown: {
            hook: Math.min(100, Math.floor(hookPoint / 25 * 100)),
            relevance: Math.min(100, Math.floor(relevancePoint / 25 * 100)),
            readability: Math.min(100, Math.floor(readabilityPoint / 25 * 100)),
            engagement: Math.min(100, Math.floor(engagementPoint / 25 * 100))
        }
    };
};


export const getSmartSuggestions = (score, content, platform) => {
    const { title = '', drafts = [], hashtags = [] } = content;
    const suggestions = [];

    if (score.overall === 0) return [{ type: 'info', text: '데이터를 입력하면 AI 분석이 시작됩니다.' }];

    if (title.length < 10) suggestions.push({ type: 'warning', text: '제목이 너무 짧습니다. 15자 이상의 구체적인 제목을 권장합니다.' });
    if (!POWER_WORDS.some(w => title.includes(w))) suggestions.push({ type: 'info', text: '제목에 "비결", "추천" 같은 파워 워드를 섞어보세요.' });

    const fullText = drafts.map(d => d.text).join(' ');
    if (fullText.length < 100) suggestions.push({ type: 'warning', text: '본문 내용이 부족합니다. 알고리즘은 충분한 정보량을 선호합니다.' });

    const tags = Array.isArray(hashtags) ? hashtags : [];
    if (tags.length < 3) suggestions.push({ type: 'info', text: '해시태그 3개 이상은 노출 범위 확장의 필수 조건입니다.' });

    return suggestions;
};
