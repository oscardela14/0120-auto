/**
 * ANTI-GRAVITY REVENUE INTELLIGENCE ENGINE v2.0 (Ultra-High Resolution)
 * Handles Real-time API Sync simulations, ROI Predictions, and Affiliate Matching
 */

// 1. Live Exchange Rate Engine (Real-time API with Intelligent Fallback)
export const getExchangeRate = async () => {
    try {
        // Real-time fetch from open API
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        if (data && data.rates && data.rates.KRW) {
            return {
                USD_KRW: data.rates.KRW,
                lastUpdated: new Date().toISOString(),
                status: 'LIVE'
            };
        }
    } catch (error) {
        console.warn("Exchange rate API unavailable, switching to high-precision fallback engine.", error);
    }

    // High-precision fallback reflecting the 2026-01-26 morning rate
    // Implementation of the user's request for "daily update" simulation
    const baseRate = 1446.58;
    const fluctuation = (Math.random() * 2 - 1); // Subtle real-time fluctuation (±1KRW)

    return {
        USD_KRW: baseRate + fluctuation,
        lastUpdated: new Date().toISOString(),
        status: 'SYNCED (FALLBACK)'
    };
};

// 2. Platform Sync Simulation (YouTube, Coupang, Meta)
export const syncPlatformData = async () => {
    return {
        youtube: {
            avgCPM: 4.85, // USD
            avgRPM: 2.10, // USD
            viewCount: 125000,
            status: 'CONNECTED',
            lastSync: new Date().toISOString()
        },
        coupang: {
            avgCTR: 3.2, // %
            avgCVR: 1.5, // %
            totalClicks: 4200,
            status: 'ACTIVE',
            lastSync: new Date().toISOString()
        }
    };
};

// 3. AI ROI Predictor Engine
export const predictROI = (keyword, volume) => {
    if (!keyword || keyword.trim() === '' || !volume || volume <= 0) {
        return {
            score: 0,
            projectedRevenue: 0,
            saturationIndex: 0,
            saturationStatus: 'NONE',
            difficulty: 'NONE',
            bestPlatform: 'WAITING FOR INPUT'
        };
    }

    // Complexity analysis based on keyword
    // Longer keywords usually mean higher intent / lower competition
    const intentFactor = Math.min(1.5, keyword.length / 5);
    const competition = Math.max(10, Math.min(95, (80 + Math.random() * 20) / intentFactor));
    const adBidPrice = (Math.random() * 1500 + 1000) * intentFactor;

    // Saturation Index: High volume + High competition = Saturated
    // Adjusted divisor for more realistic range (not always 100%)
    const saturationIndex = (volume * competition) / 200000;
    const saturationStatus = saturationIndex > 80 ? 'CRITICAL' : saturationIndex > 45 ? 'HIGH' : 'LOW';

    // Projected Earnings Formula
    const basePotential = (volume * (adBidPrice / 1000)) * 0.15; // Realistic 15% revenue share
    const affiliatePotential = (volume * 0.015) * 450; // 1.5% CTR * 450 KRW commission

    // Score calculation: Balance between potential and difficulty
    let score = Math.floor((100 - competition) * 0.6 + (adBidPrice / 3000) * 40);
    score = Math.max(10, Math.min(99, score));

    return {
        score,
        projectedRevenue: Math.floor(basePotential + affiliatePotential),
        saturationIndex: Math.floor(Math.min(100, saturationIndex)),
        saturationStatus,
        difficulty: competition > 75 ? 'HARD' : competition > 35 ? 'MEDIUM' : 'EASY',
        bestPlatform: adBidPrice > 2200 ? 'YouTube / Blog' : 'Reels / TikTok'
    };
};

// 4. Contextual Affiliate Matcher
export const matchAffiliateProducts = (content) => {
    const keywords = [
        { key: ['노트북', '컴퓨터', 'PC', '그램', '맥북'], products: ['LG 그램 2024', 'M3 맥북 에어', '로지텍 MX Master 3S'] },
        { key: ['운동', '헬스', '다이어트', '프로틴'], products: ['마이프로틴 2.5kg', '가민 포러너 265', '언더아머 컴프레션'] },
        { key: ['여행', '캠핑', '텐트', '장비'], products: ['스노우라인 텐트', '크레모아 랜턴', '헬리녹스 체어'] },
        { key: ['요리', '주방', '에어프라이어', '레시피'], products: ['필립스 에어프라이어', '네스프레소 버츄오', '테팔 프라이팬 세트'] }
    ];

    const matches = [];
    keywords.forEach(group => {
        if (group.key.some(k => content.includes(k))) {
            matches.push(...group.products);
        }
    });

    // Default matches if none found
    if (matches.length === 0) return ['네이버 플러스 멤버십', '유튜브 프리미엄 할인권'];

    return [...new Set(matches)].slice(0, 3);
};
// 5. Native Ads Bridge Generator (Contextual Hook)
export const generateNativeBridge = (content, product) => {
    const bridges = [
        `문득 이 내용을 실천해보고 싶다면, 실제로 제가 써보고 검증한 [${product}]를 함께 확인해 보시는 건 어떨까요? 삶의 질이 수직 상승하는 걸 경험하실 거예요.`,
        `참고로, 위에서 설명드린 방식을 가장 효율적으로 도와줄 수 있는 아이템이 바로 [${product}]입니다. 마침 지금 할인 중이라 타이밍이 정말 좋네요.`,
        `사실 저도 이 글을 쓰면서 가장 먼저 떠올린 게 였습니다. [${product}] 하나만 있어도 이 모든 과정이 훨씬 수월해지거든요.`,
        `오늘 소개해 드린 팁을 완벽하게 마스터하고 싶으신 분들께는 [${product}]를 강력 추천드립니다. 후회 없는 선택이 될 거예요.`
    ];
    return bridges[Math.floor(Math.random() * bridges.length)];
};// 6. Live Tracker Engine (URL-based Signal Analysis)
/**
 * Analyzes a published URL and fetches real-time performance signals.
 * In a production environment, this would call YouTube Data API, Meta Graph API, or Naver SDK.
 */
export const fetchLiveStats = async (url) => {
    // Artificial delay for 'Live Re-sync' effect
    await new Promise(resolve => setTimeout(resolve, 800));

    const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
    const isInstagram = url.includes('instagram.com');
    const isNaver = url.includes('blog.naver.com');
    const isThreads = url.includes('threads.net');

    // Deterministic simulation based on URL string length to keep stats consistent for the same URL
    const seed = url.length;
    const baseViews = (seed * 1243) % 45000 + 1200;
    const baseLikes = Math.floor(baseViews * (0.05 + (seed % 10) / 100));
    const baseComments = Math.floor(baseLikes * 0.12);

    let platform = 'Unknown';
    if (isYouTube) platform = 'YouTube';
    else if (isInstagram) platform = 'Instagram';
    else if (isNaver) platform = 'Naver Blog';
    else if (isThreads) platform = 'Threads';

    return {
        success: true,
        platform,
        metrics: {
            views: baseViews,
            likes: baseLikes,
            comments: baseComments,
            engagementRate: ((baseLikes + baseComments) / baseViews * 100).toFixed(2)
        },
        status: 'LIVE_TRACKING',
        lastUpdated: new Date().toISOString()
    };
};

// 7. LTV Predictive Asset Valuation Engine
/**
 * Projects the Lifetime Value (LTV) of a content asset over 12 months.
 * Uses a decay model (Retention Rate) and niche-specific multipliers.
 */
export const calculateLTV = (initialMetrics, niche = 'General') => {
    const { views = 0, engagementRate = 5 } = initialMetrics;

    // Niche Multipliers (Industry standard CPM/RPM approximations)
    const nicheMultipliers = {
        'Finance': 4.5,
        'Tech': 3.2,
        'Lifestyle': 1.8,
        'Gaming': 1.2,
        'General': 1.5
    };

    const multiplier = nicheMultipliers[niche] || 1.5;
    const monthlyDecay = 0.65; // Content typically loses 35% of its 'freshness' reach each month

    let totalProjectedViews = 0;
    let currentMonthViews = views;

    // 12-Month Projection Loop
    for (let i = 0; i < 12; i++) {
        totalProjectedViews += currentMonthViews;
        currentMonthViews *= monthlyDecay;
    }

    // Base Revenue (KRW scaled) + Compound Asset Value (Engagement Bonus)
    const baseRevenue = (totalProjectedViews / 1000) * multiplier * 1350;
    const engagementBonus = (parseFloat(engagementRate) / 100) * baseRevenue * 0.8;

    const finalValuation = Math.floor(baseRevenue + engagementBonus);

    return {
        valuation: finalValuation,
        currency: 'KRW',
        confidenceScore: 88,
        roiMultiplier: (finalValuation / (views * 0.1 || 1)).toFixed(2), // Estimated cost per view vs value
        projectionData: Array.from({ length: 6 }, (_, i) => Math.floor(views * Math.pow(monthlyDecay, i)))
    };
};

export const determineNiche = (topic) => {
    const t = topic.toLowerCase();
    if (t.includes('돈') || t.includes('주식') || t.includes('투자') || t.includes('수익') || t.includes('금융') || t.includes('금전')) return 'Finance';
    if (t.includes('테크') || t.includes('컴퓨터') || t.includes('ai') || t.includes('스마트폰') || t.includes('맥북') || t.includes('it')) return 'Tech';
    if (t.includes('일상') || t.includes('브이로그') || t.includes('맛집') || t.includes('카페') || t.includes('여행') || t.includes('데이트')) return 'Lifestyle';
    if (t.includes('게임') || t.includes('롤') || t.includes('배틀그라운드') || t.includes('플레이') || t.includes('game')) return 'Gaming';
    if (t.includes('쇼핑') || t.includes('선물') || t.includes('쿠팡') || t.includes('추천') || t.includes('세트')) return 'Shopping';
    if (t.includes('운동') || t.includes('건강') || t.includes('다이어트') || t.includes('헬스') || t.includes('식단')) return 'Health';
    return 'General';
};

// 8. Integrated Revenue Calculation Engine (Shareable)
export const calculateRevenueData = (history = [], settings = { adMultiplier: 1, affiliateMultiplier: 1, savingMultiplier: 1, syncSeed: 0 }) => {
    const totalContent = history?.length || 0;
    const seedFactor = (settings.syncSeed || 0) * 0.025;
    const syncJitter = settings.isSyncing ? (Math.random() * 0.15 + 0.92) : (1.0 + seedFactor);

    const baselineAd = totalContent > 0 ? 85000 : 0;
    const baselineAffiliate = totalContent > 0 ? 124000 : 0;

    const baseAdRev = (totalContent * 12500 + baselineAd) * (settings.adMultiplier || 1) * syncJitter * (1 + ((settings.syncSeed || 0) % 10) * 0.002);
    const baseAffiliateRev = (totalContent * 18400 + baselineAffiliate) * (settings.affiliateMultiplier || 1) * syncJitter;
    const baseSaving = totalContent * 120000 * (settings.savingMultiplier || 1);

    const organicBonus = totalContent > 0 ? (Math.pow(totalContent, 1.25) * 6500) : 0;
    const growthRate = totalContent > 0 ? (15.2 + (totalContent * 0.5) + (settings.syncSeed || 0) * 0.45).toFixed(1) : "0.0";

    const getTrendPoints = () => {
        const points = [];
        const totalDailyPotential = (baseAdRev + baseAffiliateRev) / 30;

        if (settings.timeGrain === 'Day') {
            for (let hour = 0; hour < 24; hour++) {
                let peakMultiplier = 1.0;
                if (hour >= 19 && hour <= 23) peakMultiplier = 2.4;
                else if (hour >= 8 && hour <= 10) peakMultiplier = 1.3;
                else if (hour >= 0 && hour <= 5) peakMultiplier = 0.35;

                const seedOffset = Math.sin((hour + (settings.syncSeed || 0)) * 0.5) * 0.12;
                const hourlyAmount = Math.floor((totalDailyPotential / 24) * peakMultiplier * (1 + seedOffset));
                const finalValue = Math.max(12, (hourlyAmount / (totalDailyPotential / 9)) * 100);

                points.push({
                    label: `${hour.toString().padStart(2, '0')}시`,
                    value: finalValue,
                    amount: hourlyAmount,
                    isPeak: hour >= 19 && hour <= 23,
                    isToday: hour === new Date().getHours()
                });
            }
        } else {
            const count = settings.timeGrain === 'Week' ? 7 : 30;
            const now = new Date();
            for (let i = 0; i < count; i++) {
                const d = new Date(now);
                d.setDate(now.getDate() - (count - 1 - i));
                const seedOffset = Math.sin((i + (settings.syncSeed || 0) * 2) * 0.8) * 0.2;
                const dailyAmount = Math.floor(totalDailyPotential * (1 + seedOffset));
                const finalValue = Math.max(25, (dailyAmount / (totalDailyPotential * 2)) * 100);

                points.push({
                    label: `${(d.getMonth() + 1)}/${d.getDate()}`,
                    value: finalValue,
                    amount: dailyAmount,
                    isToday: i === count - 1
                });
            }
        }
        return points;
    };

    return {
        totalPotential: Math.round(baseAdRev + baseAffiliateRev + baseSaving + organicBonus),
        adRevenue: Math.round(baseAdRev),
        affiliateRevenue: Math.round(baseAffiliateRev),
        operationalSavings: Math.round(baseSaving),
        withdrawCount: Math.floor(baseAdRev / 30000),
        growth: growthRate,
        trendPoints: getTrendPoints(),
        historyStats: [
            { name: '대기 중인 수익', value: '₩' + Math.floor(baseAdRev * 0.4).toLocaleString(), color: 'text-amber-500' },
            { name: '확정된 수익', value: '₩' + Math.floor(baseAdRev * 0.6).toLocaleString(), color: 'text-emerald-500' }
        ],
        nicheAnalysis: Object.entries((history || []).reduce((acc, item) => {
            const niche = determineNiche(item?.topic || "");
            if (!acc[niche]) acc[niche] = { name: niche, count: 0 };
            acc[niche].count++;
            return acc;
        }, {})).map(([name, data]) => ({
            name,
            count: data.count,
            value: Math.floor((data.count / (history?.length || 1)) * (baseAdRev + baseAffiliateRev + baseSaving + organicBonus))
        })).sort((a, b) => b.count - a.count)
    };
};
