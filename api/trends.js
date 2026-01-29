
// 실제 Google Trends RSS를 가져와서 JSON으로 변환해주는 프록시 API
export default async function handler(req, res) {
    // CORS 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // 1시간 캐싱

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // 1. Google Trends RSS 가져오기 (대한민국)
        const rssResponse = await fetch('https://trends.google.co.kr/trends/trendingsearches/daily/rss?geo=KR');

        if (!rssResponse.ok) {
            throw new Error(`Google Trends RSS Error: ${rssResponse.status}`);
        }

        const xmlText = await rssResponse.text();

        // 2. 간단한 XML 파싱 (정규식 활용 - 라이브러리 의존성 제거)
        // <item> 태그 안의 내용을 추출
        const items = xmlText.match(/<item>([\s\S]*?)<\/item>/g) || [];

        const trends = items.map((item, index) => {
            const getTagValue = (tag) => {
                const regex = new RegExp(`<${tag}>(.*?)<\/${tag}>`);
                const match = item.match(regex);
                return match ? match[1].replace(/<!\[CDATA\[(.*?)\]\]>/, '$1') : '';
            };

            const title = getTagValue('title');
            const traffic = getTagValue('ht:approx_traffic');
            const description = getTagValue('description');
            const pubDate = getTagValue('pubDate');

            // 카테고리 추론 (RSS에는 없으므로 랜덤 or AI 매핑 필요하지만 여기선 간단히 '이슈'로 통일하거나 description 기반 추론)
            return {
                rank: index + 1,
                keyword: title,
                category: "실시간 이슈", // RSS 기본 제공 데이터 아님
                volume: traffic,
                link: getTagValue('link'),
                pubDate: pubDate
            };
        }).slice(0, 10); // TOP 10만 추출

        // 3. 응답 반환
        res.status(200).json({
            source: "Google Trends Realtime",
            updated: new Date().toISOString(),
            data: trends
        });

    } catch (error) {
        console.error("RSS Fetch Error:", error);
        res.status(500).json({ error: "Failed to fetch trends", details: error.message });
    }
}
