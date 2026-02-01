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
    // Remove whitespace to get pure content length
    const pureTextLength = fullText.replace(/\s/g, '').length;

    if (!title.trim() && pureTextLength < 10) {
        return {
            overall: 0,
            breakdown: { hook: 0, relevance: 0, readability: 0, engagement: 0 },
            status: 'EMPTY'
        };
    }

    // 1. [HOOK] 제목 후킹 잠재력 (25점)
    let hookPoint = 0;
    const titleLen = title.length;
    // 길이 최적화 (15~35자 선호)
    if (titleLen >= 15 && titleLen <= 35) hookPoint += 8;
    else if (titleLen > 8) hookPoint += 4;

    // 파워 워드 밀도 (가중치 상향)
    const foundPowerWords = POWER_WORDS.filter(word => title.includes(word));
    if (foundPowerWords.length >= 2) hookPoint += 8;
    else if (foundPowerWords.length === 1) hookPoint += 4;

    // 특수문자 및 자극적 요소
    if (title.includes('?') || title.includes('!')) hookPoint += 4;

    // 이모지 활용 여부
    const hasEmoji = /[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u.test(title);
    if (hasEmoji) hookPoint += 3;

    // 숫자가 포함되어 있는지 (후킹 요소)
    if (/\d/.test(title)) hookPoint += 2;

    // 2. [RELEVANCE] 키워드 동기화 및 밀도 (25점)
    let relevancePoint = 0;
    const titleKeywords = title.split(/\s+/).filter(w => w.length > 1); // 2글자 이상만 키워드로 간주

    if (titleKeywords.length > 0) {
        let keywordHits = 0;
        titleKeywords.forEach(keyword => {
            // 본문에 해당 키워드가 몇 번 등장하는지
            const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            const count = (fullText.match(regex) || []).length;
            if (count > 0) keywordHits++;
        });

        const coverage = keywordHits / titleKeywords.length;
        if (coverage >= 0.8) relevancePoint += 15; // 80% 이상 커버
        else if (coverage >= 0.5) relevancePoint += 10;
        else if (coverage > 0) relevancePoint += 5;
    }

    // 도입부(첫 섹션 or 앞 50자) 키워드 배치 필수
    const introText = fullText.substring(0, 50);
    const introMatch = titleKeywords.some(w => introText.includes(w));
    if (introMatch) relevancePoint += 5;

    // 주제 일관성 점수 (본문 길이에 비례한 키워드 분포 보너스)
    if (pureTextLength > 100 && relevancePoint > 10) relevancePoint += 5;

    // 3. [READABILITY] 구조적 가독성 및 볼륨 (25점)
    // 매우 짧은 글에 높은 점수를 주지 않도록 로직 전면 수정
    let readabilityPoint = 0;
    const sectionCount = drafts.length;

    if (platform.includes('Blog')) {
        // [블로그 기준]
        // 1. 섹션 수
        if (sectionCount >= 4) readabilityPoint += 8;
        else if (sectionCount >= 3) readabilityPoint += 5;

        // 2. 텍스트 분량 (최소 1000자 이상이어야 만점)
        if (pureTextLength > 1500) readabilityPoint += 17;
        else if (pureTextLength > 1000) readabilityPoint += 12;
        else if (pureTextLength > 500) readabilityPoint += 7;
        else if (pureTextLength > 200) readabilityPoint += 3;
    } else {
        // [숏츠/릴스/스레드 기준]
        // 1. 적정 섹션 (3~6개)
        if (sectionCount >= 3 && sectionCount <= 7) readabilityPoint += 10;
        else if (sectionCount >= 2) readabilityPoint += 5;

        // 2. 적정 볼륨 (너무 짧으면 감점, 너무 길어도 감점)
        // 영상 대본: 1분 내외 -> 말하는 속도 고려 시 공백 제외 200~500자 권장
        if (pureTextLength >= 250 && pureTextLength <= 600) readabilityPoint += 15;
        else if (pureTextLength >= 150) readabilityPoint += 10;
        else if (pureTextLength >= 80) readabilityPoint += 5;
        // 80자 미만은 점수 없음
    }

    // 4. [ENGAGEMENT] 공유 및 도달 잠재력 (25점)
    let engagementPoint = 0;
    const tags = Array.isArray(hashtags) ? hashtags : (typeof hashtags === 'string' ? hashtags.split(/\s+/) : []);
    const validTags = tags.filter(t => t.startsWith('#') && t.trim().length > 1);

    // 해시태그 점수 강화 (최소 3개 이상이어야 점수 시작)
    if (validTags.length >= 7) engagementPoint += 12;
    else if (validTags.length >= 5) engagementPoint += 8;
    else if (validTags.length >= 3) engagementPoint += 4;

    // CTA 필수 체크
    const CTA_WORDS = ['댓글', '좋아요', '구독', '팔로우', '링크', '공유', '저장', '알림', '신청'];
    const hasCTA = CTA_WORDS.some(word => fullText.includes(word));
    if (hasCTA) engagementPoint += 8;

    // 질문형 문장 포함 여부 (참여 유도)
    if (fullText.includes('?')) engagementPoint += 5;

    // 5. [PENALTY] 중요: 페널티 대폭 강화
    let penalty = 0;

    // 내용 빈약 페널티: 100자 미만이면 치명적
    if (pureTextLength < 50) penalty += 40;
    else if (pureTextLength < 100) penalty += 20;

    // 제목 부실 페널티
    if (titleLen < 8) penalty += 15;

    // 해시태그 누락 페널티
    if (validTags.length === 0) penalty += 10;

    // 반복 단어 도배 감지 (단순 체크)
    const words = fullText.split(/\s+/);
    const uniqueWords = new Set(words);
    if (words.length > 20 && uniqueWords.size < words.length * 0.5) penalty += 15; // 반복이 절반 이상이면

    // 최종 점수 산출
    let overall = Math.floor(hookPoint + relevancePoint + readabilityPoint + engagementPoint - penalty);

    // 최소 점수 10점, 최대 98점 (100점은 AI도 어렵게)
    overall = Math.max(10, Math.min(98, overall));

    return {
        overall: overall,
        breakdown: {
            hook: Math.min(100, Math.floor(hookPoint / 25 * 100)),
            relevance: Math.min(100, Math.floor(relevancePoint / 25 * 100)),
            readability: Math.min(100, Math.floor(readabilityPoint / 25 * 100)),
            engagement: Math.min(100, Math.floor(engagementPoint / 25 * 100))
        },
        validator: {
            textLength: pureTextLength,
            hasCTA: hasCTA,
            tagCount: validTags.length
        }
    };
};


export const getSmartSuggestions = (score, content) => {
    const { title = '', drafts = [], hashtags = [] } = content;
    const suggestions = [];

    if (score.overall === 0) return [{ type: 'info', text: '데이터를 입력하면 AI 분석이 시작됩니다.' }];

    if (title.length < 10) suggestions.push({ type: 'warning', text: '헤드라인 가독성 및 가시성이 부족합니다. CTR 극대화를 위해 15자 이상의 구체적인 키워드 배치를 권장합니다.' });
    if (!POWER_WORDS.some(w => title.includes(w))) suggestions.push({ type: 'info', text: '심리학적 트리거(Power Words)가 누락되었습니다. "비결", "추천" 등 사용자 클릭을 유도하는 단어를 배치하세요.' });

    const fullText = drafts.map(d => d.text).join(' ');
    if (fullText.length < 100) suggestions.push({ type: 'warning', text: '콘텐츠의 정보 밀도가 임계점 미달입니다. 알고리즘 가중치 확보를 위해 상세 내용을 보강하십시오.' });

    const tags = Array.isArray(hashtags) ? hashtags : [];
    if (tags.length < 3) suggestions.push({ type: 'info', text: '시멘틱 인덱싱을 위한 해시태그 네트워크가 불충분합니다. 최소 3개 이상의 연관 태그를 권장합니다.' });

    return suggestions;
};
