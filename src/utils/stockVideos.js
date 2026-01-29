export const getStockVideo = (topic) => {
    const topicLower = (topic || '').toLowerCase();

    // Curated list of high-quality, copyright-free stock videos (Pexels/Coverr/Mixkit sources)
    // Using direct reliable MP4 links for demo purposes

    // 1. Cooking/Food
    if (topicLower.includes('요리') || topicLower.includes('푸드') || topicLower.includes('food') || topicLower.includes('recipe')) {
        return "https://videos.pexels.com/video-files/3209668/3209668-uhd_1440_2560_25fps.mp4"; // Chef cooking
    }

    // 2. Gaming/Tech
    if (topicLower.includes('게임') || topicLower.includes('game') || topicLower.includes('테크') || topicLower.includes('tech') || topicLower.includes('pc')) {
        return "https://videos.pexels.com/video-files/3174459/3174459-hd_1080_1920_30fps.mp4"; // Neon keyboard/coding
    }

    // 3. Travel/Vlog/Nature
    if (topicLower.includes('여행') || topicLower.includes('travel') || topicLower.includes('sea') || topicLower.includes('beach') || topicLower.includes('trip')) {
        return "https://videos.pexels.com/video-files/4324124/4324124-hd_1080_1920_30fps.mp4"; // Ocean waves vertical
    }

    // 4. Beauty/Fashion
    if (topicLower.includes('뷰티') || topicLower.includes('beauty') || topicLower.includes('makeup') || topicLower.includes('fashion')) {
        return "https://videos.pexels.com/video-files/3998595/3998595-hd_1080_1920_25fps.mp4"; // Skincare usage
    }

    // 5. Health/Fitness
    if (topicLower.includes('운동') || topicLower.includes('헬스') || topicLower.includes('running') || topicLower.includes('gym')) {
        return "https://videos.pexels.com/video-files/4436531/4436531-hd_1080_1920_25fps.mp4"; // Person running
    }

    // 6. Motivation/Success/Finance
    if (topicLower.includes('동기부여') || topicLower.includes('성공') || topicLower.includes('금융') || topicLower.includes('money')) {
        return "https://videos.pexels.com/video-files/3163534/3163534-hd_1080_1920_30fps.mp4"; // City timelapse vertical
    }

    // 7. Animals/Pets
    if (topicLower.includes('동물') || topicLower.includes('강아지') || topicLower.includes('고양이') || topicLower.includes('cat') || topicLower.includes('dog')) {
        return "https://videos.pexels.com/video-files/5125345/5125345-hd_1080_1920_25fps.mp4"; // Cute dog
    }

    // Default Fallback (Abstract/Aesthetic)
    return "https://videos.pexels.com/video-files/5532770/5532770-hd_1080_1920_25fps.mp4"; // Abstract fluid art
};
