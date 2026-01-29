
export class OSMUConverter {
    /**
     * Blog Content -> Instagram Reels / YouTube Shorts Script
     */
    /**
     * Blog Content -> YouTube Shorts (Fast-paced, Hook-driven)
     */
    static blogToShorts(blogData) {
        const topic = blogData.topic || "콘텐츠";
        const content = (blogData.content ||
            blogData.variants?.[blogData.activeVariant]?.content ||
            blogData.variants?.A?.content ||
            blogData.variants?.B?.content ||
            "").replace(/\[이미지:.*?\]/g, '');

        const sentences = content.split(/[.\n]/).filter(s => s.trim().length > 10);
        const hook = `🚨 심쿵주의! ${topic}, 이거 모르고 지나치면 진짜 손해!`;
        const points = sentences.slice(0, 3);
        const cta = `더 꿀팁이 궁금하다면? 구독 버튼 꾹! 👆`;

        const script = [
            { time: '0:00', type: 'HOOK', text: hook, visual: '화면 확대 효과 + 붉은색 굵은 자막 (임팩트 강조)' },
            { time: '0:03', type: 'INTRO', text: `딱 3가지만 기억하세요. 시작합니다!`, visual: '빠른 카운트다운 타이머' },
            { time: '0:10', type: 'CONTENT', text: points[0] || "첫번째 핵심! 이게 진짜 중요해요.", visual: '관련 자료 화면 빠른 전환 (0.5초 컷)' },
            { time: '0:25', type: 'CONTENT', text: points[1] || "두번째! 많은 분들이 놓치는 부분이죠.", visual: 'O/X 퀴즈 형태의 오버레이 그래픽' },
            { time: '0:40', type: 'CONTENT', text: `✨ ${points[2] || "마지막 꿀팁은 댓글로 확인!"}`, visual: '화면 분할로 비교 영상 보여주기' },
            { time: '0:50', type: 'CTA', text: cta, visual: '구독 버튼 애니메이션 + 화살표 포인팅' }
        ];

        return {
            platform: 'YouTube Shorts',
            topic: topic,
            title: `[쇼츠] ${topic} 1분 완벽 정리 🔥 #Shorts`,
            script: script,
            sections: script,
            content: script.map(s => s.text).join('\n\n'),
            hashtags: blogData.hashtags || "#shorts #꿀팁 #유튜브쇼츠 #정보공유"
        };
    }

    /**
     * Blog Content -> Instagram Reels (Aesthetic, Engagement-driven)
     */
    static blogToReels(blogData) {
        const topic = blogData.topic || "콘텐츠";
        const content = (blogData.content ||
            blogData.variants?.[blogData.activeVariant]?.content ||
            blogData.variants?.A?.content ||
            blogData.variants?.B?.content ||
            "").replace(/\[이미지:.*?\]/g, '');

        const sentences = content.split(/[.\n]/).filter(s => s.trim().length > 10);
        const hook = `📌 ${topic} 꿀팁, 나만 알기 아까워서 공유해요! (저장 필수 ✨)`;
        const points = sentences.slice(0, 3);
        const cta = `도움이 되셨다면 좋아요와 친구에게 공유! ✈️`;

        const script = [
            { time: '0:00', type: 'HOOK', text: hook, visual: '감성적인 배경음악 + 깔끔한 고딕체 자막 (서서히 나타나기)' },
            { time: '0:05', type: 'POV', text: `다들 이런 고민 해보셨죠? 😂`, visual: '공감가는 상황 연출 (POV 스타일)' },
            { time: '0:15', type: 'TIP 1', text: `✅ Point 1. ${points[0] || "가장 중요한 핵심입니다."}`, visual: '체크리스트 그래픽이 하나씩 체크되는 애니메이션' },
            { time: '0:30', type: 'TIP 2', text: `✅ Point 2. ${points[1] || "이것도 꼭 챙겨야 해요."}`, visual: '화면이 옆으로 넘어가며 새로운 정보 등장' },
            { time: '0:45', type: 'OUTRO', text: `더 자세한 내용은 캡션을 확인해주세요! 👇`, visual: '아래쪽을 가리키는 손가락 + 블러 처리된 배경' },
            { time: '0:55', type: 'CTA', text: cta, visual: '하트 아이콘 팝업 + 저장 리본 아이콘 강조' }
        ];

        return {
            platform: 'Instagram Reels',
            topic: topic,
            title: `[릴스] ${topic} 감성 정보 모음 🌙`,
            script: script,
            sections: script,
            content: script.map(s => s.text).join('\n\n'),
            hashtags: blogData.hashtags || "#릴스 #인스타꿀팁 #공스타그램 #정보공유 #저장각"
        };
    }

    /**
     * Blog -> Threads (Threaded Posts)
     */
    static blogToThreads(blogData) {
        const topic = blogData.topic || "콘텐츠";
        const content = (blogData.content ||
            blogData.variants?.[blogData.activeVariant]?.content ||
            blogData.variants?.A?.content ||
            blogData.variants?.B?.content ||
            "").replace(/\[이미지:.*?\]/g, '');

        // Split by sentences and group into thread posts (~250 chars each)
        const sentences = content.split(/[.\n]/).filter(s => s.trim().length > 2);
        const posts = [];
        let currentPost = `🧵 ${topic}에 대해 꼭 알아야 할 점들 (타래): \n\n`;

        sentences.forEach(s => {
            if ((currentPost + s).length > 250) {
                posts.push({ text: currentPost.trim() });
                currentPost = "";
            }
            currentPost += s.trim() + ". ";
        });
        if (currentPost) posts.push({ text: currentPost.trim() });

        const enrichedPosts = posts.map(p => ({ ...p, content: p.text }));

        return {
            platform: 'Threads',
            topic: topic,
            title: `${topic} 🧵 Thread`,
            threadPosts: enrichedPosts,
            script: enrichedPosts, // PreviewModal expects .script for list view
            sections: enrichedPosts,
            content: enrichedPosts.map(p => p.text).join('\n\n'),
            hashtags: blogData.hashtags || "#쓰레드 #꿀팁 #정보한입"
        };
    }

    /**
     * Shorts Script -> Blog Post
     */
    static videoToBlog(videoData) {
        const topic = videoData.topic || "콘텐츠";
        const scriptLines = videoData.sections ||
            videoData.script ||
            videoData.variants?.[videoData.activeVariant]?.sections ||
            videoData.variants?.A?.sections ||
            [];

        const fullContent = scriptLines.map(s => s.text || s.content || s).join(' ');

        return {
            platform: 'Naver Blog',
            topic: topic,
            title: `[정보] ${topic} 완벽 가이드 (1분 요약 그 이상)`,
            sections: [
                { title: '인트로', content: `안녕하세요! 오늘은 많은 분들이 궁금해하시는 ${topic}에 대해 심층 분석해 보았습니다.` },
                { title: '핵심 내용', content: fullContent },
                { title: '마치며', content: `${topic}에 대한 궁금증이 풀리셨나요? 댓글로 의견을 남겨주세요!` }
            ],
            content: fullContent,
            hashtags: videoData.hashtags || "#네이버블로그 #정보성 #블로그포스팅"
        };
    }
}

export const convertToPlatform = (data, targetPlatform) => {
    const tp = targetPlatform.toLowerCase();
    if (tp.includes('shorts')) {
        return OSMUConverter.blogToShorts(data);
    } else if (tp.includes('reels')) {
        return OSMUConverter.blogToReels(data);
    } else if (tp.includes('blog')) {
        return OSMUConverter.videoToBlog(data);
    } else if (tp.includes('threads')) {
        return OSMUConverter.blogToThreads(data);
    }
    return { ...data, platform: targetPlatform };
};
