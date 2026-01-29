
/**
 * Viral Analysis Engine for Heatmap & Retention
 */

export const analyzeRetention = (script) => {
    if (!script || !script.length) return null;

    // Simulate attention scores for each scene (0-100)
    // Generally high at start, dips in middle, high at end/hook
    return script.map((scene, index) => {
        let score = 0;
        const normalizedPos = index / (script.length - 1 || 1);

        if (normalizedPos < 0.2) score = 85 + Math.random() * 15; // Hook
        else if (normalizedPos > 0.8) score = 75 + Math.random() * 20; // Outro/CTA
        else score = 40 + Math.random() * 40; // Body dip

        // Booster Injections based on score
        let booster = null;
        if (score < 60) {
            const tips = [
                "Visual Shake: Add a quick screen zoom here",
                "Curiosity Gap: Ask a rhetorical question",
                "BGM Shift: Drop the bass for emphasis",
                "Text Pop: Use neon highlight on keywords"
            ];
            booster = tips[Math.floor(Math.random() * tips.length)];
        }

        return {
            ...scene,
            attentionScore: Math.floor(score),
            booster
        };
    });
};
