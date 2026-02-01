
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Helper to repair common JSON errors from AI
function repairJson(jsonStr) {
  let repaired = jsonStr.trim();
  repaired = repaired.replace(/```json/g, '').replace(/```/g, '').trim();

  const firstBrace = repaired.indexOf('{');
  const lastBrace = repaired.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    repaired = repaired.substring(firstBrace, lastBrace + 1);
  }
  return repaired;
}

// 🧹 Deep Clean Helper: Same as Cerebras for consistency
function deepCleanOutput(obj) {
  if (typeof obj === 'string') {
    // Remove Hanja, Japanese, Thai
    return obj.replace(/[\u4E00-\u9FFF\u3400-\u4DBF\u3040-\u30FF\u0E00-\u0E7F]/g, '');
  } else if (Array.isArray(obj)) {
    return obj.map(deepCleanOutput);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      acc[key] = deepCleanOutput(obj[key]);
      return acc;
    }, {});
  }
  return obj;
}

import { secureProxyCall } from '../services/apiProxy';

export async function generateContentWithGemini(topic, platform = 'YouTube Shorts', persona = 'witty') {
  console.log("%c [SECURITY] Gemini Request via Proxy", "color: orange; font-weight: bold;");

  const hangeulRule = "\n[CRITICAL RULE] Output MUST be in KOREAN (HANGEUL) only. NEVER use Hanja (Chinese characters), Japanese, or Thai scripts. Use natural, viral Korean.";

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000); // 12 second limit for proxy

  try {
    const response = await Promise.race([
      secureProxyCall('gemini', 'generate', {
        topic,
        platform,
        persona,
        additionalInstruction: hangeulRule
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("PROXY_TIMEOUT")), 10000))
    ]);

    clearTimeout(timeoutId);
    if (response.success && response.data) {
      return deepCleanOutput(response.data);
    }

    throw new Error(response.error || "GEMINI_PROXY_ERROR");
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn("Gemini Proxy Unavailable/Timeout, switching to Direct Client Call:", error.message);

    if (!API_KEY || API_KEY.startsWith('YOUR_')) {
      return {
        title: topic,
        sections: [{ title: "시스템 오류", content: "AI 서버 및 로컬 키를 모두 사용할 수 없습니다." }],
        hashtags: ["#ERROR"],
        isFallback: true
      };
    }

    const prompt = `
      당신은 소셜 미디어 전문가입니다. 주제 '${topic}'에 대해 '${platform}' 콘텐츠를 생성하세요.
      페르소나: ${persona}
      [STRICT RULE]
      - Output MUST be in **KOREAN (HANGEUL)** ONLY.
      - NEVER use Hanja (Chinese characters) under any circumstances.
      - NEVER use Japanese or Thai characters.
      
      반드시 다음 JSON 형식만 반환하세요:
      {
        "title": "클릭을 부르는 제목",
        "sections": [
          { "title": "서론/컷1", "content": "내용..." }
        ],
        "hashtags": ["#태그"]
      }
    `;

    try {
      const directController = new AbortController();
      const directTimeout = setTimeout(() => directController.abort(), 10000); // 10 second limit for direct

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
      const apiResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        signal: directController.signal
      });
      clearTimeout(directTimeout);
      const data = await apiResponse.json();
      const text = data.candidates[0].content.parts[0].text;
      const repaired = repairJson(text);
      return deepCleanOutput(JSON.parse(repaired));
    } catch (directError) {
      console.error("Direct Gemini Call also failed:", directError);
      return {
        title: topic,
        sections: [{ title: "복구 실패", content: "실시간 생성 한계를 초과했습니다." }],
        hashtags: ["#ERROR"],
        isFallback: true
      };
    }
  }
}

export async function generateCommunityPrompts(query) {
  if (!API_KEY || API_KEY === 'YOUR_GEMINI_KEY') return [];
  const prompt = `주제 '${query}'에 대해 소셜 미디어 프롬프트 6개를 JSON 형식으로 생성하세요.`;
  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await response.json();
    let text = data.candidates[0].content.parts[0].text;
    return deepCleanOutput(JSON.parse(repairJson(text)));
  } catch (error) {
    console.error("Community Prompt Generation Error:", error);
    return [];
  }
}

export async function analyzeAlgorithmIntelligence(topic, platform) {
  if (!API_KEY || API_KEY === 'YOUR_GEMINI_KEY') return null;
  const prompt = `주제 '${topic}'에 대해 '${platform}' 알고리즘 분석 보고서를 JSON 형식으로 생성하세요.`;
  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await response.json();
    let text = data.candidates[0].content.parts[0].text;
    return deepCleanOutput(JSON.parse(repairJson(text)));
  } catch (error) {
    console.error("Algorithm Analysis Error:", error);
    return null;
  }
}
