
/**
 * Omni-Channel Campaign Architect Utility
 * Generates a 7-day marketing plan based on a given topic and platform.
 */

export const generateCampaignPlan = (topic, platform) => {
    const days = [
        { day: "Day 1", platform: "YouTube Shorts", type: "Teaser", goal: "Curiosity", action: "가장 자극적인 도입부를 활용하여 본편의 예고를 만듭니다." },
        { day: "Day 2", platform: "Instagram Reels", type: "Behind", goal: "Authenticity", action: "콘텐츠 제작 과정을 보여주며 신뢰도를 쌓습니다." },
        { day: "Day 3", platform: "Naver Blog", type: "Deep-dive", goal: "Knowledge", action: "상세한 정보와 관련 데이터, 참고 문헌을 바탕으로 신뢰성을 높입니다." },
        { day: "Day 4", platform: "Threads", type: "Discussion", goal: "Engagement", action: "주제에 대한 질문을 던져 댓글 소통을 유도합니다." },
        { day: "Day 5", platform: "TikTok", type: "Viral Meme", goal: "Reach", action: "숏폼 특유의 밈과 빠른 호흡으로 파급력을 높입니다." },
        { day: "Day 6", platform: "Facebook", type: "Insight", goal: "Review", action: "기존 콘텐츠의 요약본과 초기 반응을 공유합니다." },
        { day: "Day 7", platform: "Email/News", type: "Call to Action", goal: "Profit", action: "최종적인 상품 링크나 서비스 가입을 유도합니다." }
    ];

    // Customize based on platform (e.g., if platform is Blog, maybe start with Blog)
    if (platform === 'Naver Blog') {
        const blogFirst = [days[2], ...days.slice(0, 2), ...days.slice(3)];
        return blogFirst;
    }

    return days;
};
