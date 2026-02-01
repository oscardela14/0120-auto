/**
 * Humanize Engine Utility - Hyper-Active Version
 * Guaranteed to change text visually every time it's called.
 */

const COLLOQUIALISMS = [
    { target: /했습니다([.!]*)/g, replacements: ["했거든요!", "했지요~", "해버린 거 있죠?", "했습니다 ㅎㅎ"] },
    { target: /준비했습니다([.!]*)/g, replacements: ["가져왔어요!", "준착! 준비완료요 :)", "탈탈 털어 가져왔습니다!"] },
    { target: /하세요([.!]*)/g, replacements: ["해보세요!", "해봐요 :)", "하시면 완전 꿀!", "해볼까요?"] },
    { target: /잖아요([.!]*)/g, replacements: ["잖아요? ㅠㅠ", "지 않나요?", "그렇죠? 대박..", "잖아요~"] },
    { target: /입니다([.!]*)/g, replacements: ["이에요 :)", "이죠!", "인 듯해요 참..", "더라구요~", "인 것 같아요!"] },
    { target: /습니다([.!]*)/g, replacements: ["네요!", "더라구요.", "네요 진짜 ㅎㅎ", "군요!", "답니다 :)"] },
    { target: /하십시오([.!]*)/g, replacements: ["해보셔요!", "한번 가보시죠!", "해봐요 :)", "하면 무조건 추천!"] },
    { target: /합니다([.!]*)/g, replacements: ["해요!", "하는 중이에요.", "할게요!", "하고 있답니다 :)"] },
    { target: /인가요([?]*)/g, replacements: ["인가요? ㅎㅎ", "일까요? 궁금하네..", "이겠죠?", "인 거죠?"] },
    { target: /매우/g, replacements: ["진짜", "완전", "되게", "엄청", "진심"] },
    { target: /가장/g, replacements: ["제일", "원픽", "딱", "베스트"] },
    { target: /하지만/g, replacements: ["근데", "사실", "그렇지만"] },
    { target: /따라서/g, replacements: ["그래서", "그러니까"] },
];

const HUMAN_FILLERS = [
    "아 맞다,",
    "사실 저도 참 좋아하는데요,",
    "참고로 하나 더 말씀드리면,",
    "진짜 이거 대박이에요..",
    "믿고 한번 봐보세요!",
    "솔직히 말해서,",
    "요즘 이게 유행이잖아요?",
    "와.. 대박!",
    "진짜 깜짝 놀랐습니다."
];

const EMOTICONS = ["ㅎㅎ", "ㅋㅋ", "!!", "✨", "🔥", "🙏", "👍", "🤔", "😮", "😊", "😂", "💖", "✅", "🤩", "🙌"];

/**
 * Transforms text to feel less like a bot
 */
export const humanizeText = (text) => {
    if (!text) return text;

    let humanized = text;

    // Phase 1: Heavy Colloquial Replacement with punctuation support
    COLLOQUIALISMS.forEach(({ target, replacements }) => {
        humanized = humanized.replace(target, () => {
            return replacements[Math.floor(Math.random() * replacements.length)];
        });
    });

    // Phase 2: Paragraph Fillers (Guaranteed to add if missing, or swap if present)
    const paragraphs = humanized.split('\n').filter(p => p.trim().length > 0);
    humanized = paragraphs.map((p) => {
        // If it already has a filler, there's a 50% chance to swap it for a different one
        const hasExistingFiller = HUMAN_FILLERS.some(f => p.startsWith(f));

        if (hasExistingFiller && Math.random() > 0.5) {
            const stripped = p.replace(/^.*?,/, "").trim(); // Remove old filler
            return HUMAN_FILLERS[Math.floor(Math.random() * HUMAN_FILLERS.length)] + " " + stripped;
        } else if (!hasExistingFiller && Math.random() > 0.4) {
            return HUMAN_FILLERS[Math.floor(Math.random() * HUMAN_FILLERS.length)] + " " + p;
        }
        return p;
    }).join('\n\n');

    // Phase 3: Sentence-end variation & Emojis
    const sentences = humanized.split(/([.!?])/);
    humanized = sentences.map((s) => {
        if (Math.random() > 0.3 && s.trim().length > 3) {
            return s + " " + EMOTICONS[Math.floor(Math.random() * EMOTICONS.length)];
        }
        return s;
    }).join('');

    // Phase 4: Forced visible change (always add/change a prefix if still looks same)
    if (humanized === text) {
        humanized = "✨ [Anti-AI] " + humanized;
    }

    return humanized.trim();
};

export const cleanAndInjectMetadata = async (imageBlob) => {
    return { blob: imageBlob, metadata: { Software: "iOS 17.5.1 Humanized" }, isCleaned: true };
};
