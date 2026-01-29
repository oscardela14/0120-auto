
import { GoogleGenerativeAI } from "@google/generative-ai";

// 이 코드는 Vercel/Netlify와 같은 Serverless 환경에서 실행됩니다.
// 클라이언트에는 절대 API KEY가 노출되지 않습니다.

export default async function handler(req, res) {
    // CORS 설정 (필요시 보안 강화)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { topic, platform, persona } = req.body;

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'Server API Key not configured' });
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
      당신은 전문 콘텐츠 크리에이터 AI입니다.
      다음 주제에 대해 '${platform}' 콘텐츠 대본을 작성해주세요. 
      페르소나: ${persona || '전문적이고 신뢰감 있는'} 말투로 작성하세요.
      반드시 다음 JSON 형식만 반환하세요. 마크다운 포맷팅(\`\`\`json)을 쓰지 마세요.

      주제: ${topic}

      {
        "title": "클릭율을 높이는 자극적인 제목 (이모지 포함)",
        "script": [
          { "time": "0:00-0:05", "type": "intro", "text": "강렬한 오프닝" },
          { "time": "0:05-0:50", "type": "body", "text": "본문 내용" },
          { "time": "0:50-1:00", "type": "cta", "text": "마무리" }
        ],
        "hashtags": ["#태그1", "#태그2"],
        "viralScore": 95
      }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // JSON 정제
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        res.status(200).json(JSON.parse(text));
    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ error: error.message });
    }
}
