/**
 * Style Analyzer Utility
 * Analyzes user-provided text samples to extract stylistic patterns.
 */

export const analyzeStyle = (samples) => {
    if (!samples || samples.length === 0) return null;

    const allText = samples.join(' ');

    // 1. Detect common sentence endings
    const endings = {
        formal: (allText.match(/습니다\.|합니다\.|입니다\./g) || []).length,
        polite: (allText.match(/해요\.|예요\.|지요\./g) || []).length,
        casual: (allText.match(/해\.|야\.|어\./g) || []).length,
        unique: (allText.match(/[가-힣]+(용|염|여|당)\./g) || []).length
    };

    const topEnding = Object.keys(endings).reduce((a, b) => endings[a] > endings[b] ? a : b);

    // 2. Detect Emoji frequency
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E6}-\u{1F1FF}]/gu;
    const emojis = allText.match(emojiRegex) || [];
    const emojiDensity = emojis.length / samples.length; // emojis per post

    // 3. Sentence length avg
    const sentences = allText.split(/[.!?]/).filter(s => s.trim().length > 0);
    const avgLen = sentences.reduce((acc, s) => acc + s.trim().length, 0) / (sentences.length || 1);

    return {
        topEnding,
        emojiDensity,
        avgLen,
        sampleEmojis: [...new Set(emojis)].slice(0, 5),
        learnedAt: new Date().toISOString()
    };
};

/**
 * Applies a learned profile to a new text
 */
export const applyLearnedStyle = (text, profile) => {
    if (!profile || !text) return text;

    let modified = text;

    // Apply endings
    if (profile.topEnding === 'polite') {
        modified = modified.replace(/(습니다|합니다|입니다)\./g, '해요~');
    } else if (profile.topEnding === 'unique') {
        modified = modified.replace(/(습니다|합니다|입니다)\./g, '해용!');
    } else if (profile.topEnding === 'formal') {
        // match formal
    }

    // Inject learned emojis
    if (profile.sampleEmojis.length > 0) {
        const sentences = modified.split(/([.!?])/);
        modified = sentences.map((s, i) => {
            if (i % 4 === 0 && s.trim().length > 5 && Math.random() < 0.5) {
                return s + " " + profile.sampleEmojis[Math.floor(Math.random() * profile.sampleEmojis.length)];
            }
            return s;
        }).join('');
    }

    return modified;
};
