
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Helper to repair common JSON errors from AI
function repairJson(jsonStr) {
  let repaired = jsonStr.trim();

  // 1. Remove Any Markdown Code Blocks
  repaired = repaired.replace(/```json/g, '').replace(/```/g, '').trim();

  // 2. Find the actual JSON block
  const firstBrace = repaired.indexOf('{');
  const lastBrace = repaired.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    repaired = repaired.substring(firstBrace, lastBrace + 1);
  }

  // 3. Handle literal newlines and invalid escapes inside strings
  let processed = "";
  let inString = false;
  for (let i = 0; i < repaired.length; i++) {
    const char = repaired[i];

    // Toggle inString state, respecting escaped quotes
    if (char === '"' && repaired[i - 1] !== '\\') {
      inString = !inString;
      processed += char;
      continue;
    }

    if (inString) {
      if (char === '\n') processed += '\\n';
      else if (char === '\r') processed += '\\r';
      else if (char === '\t') processed += '\\t';
      else if (char === '\\') {
        // Check if next char is a valid escape. If not, double-escape it.
        const nextChar = repaired[i + 1];
        // JSON valid escapes: ", \, /, b, f, n, r, t, uXXXX
        if (!['"', '\\', '/', 'b', 'f', 'n', 'r', 't', 'u'].includes(nextChar)) {
          processed += '\\\\'; // Double-escape invalid backslash
        } else {
          processed += char; // Keep valid backslash
        }
      }
      else processed += char;
    } else {
      processed += char;
    }
  }
  repaired = processed;

  // 4. Handle Mid-stream Cutoffs (ensure last brace/bracket is closed)
  let braceCount = 0;
  let bracketCount = 0;
  inString = false;
  for (let i = 0; i < repaired.length; i++) {
    const char = repaired[i];
    if (char === '"' && repaired[i - 1] !== '\\') inString = !inString;
    if (!inString) {
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
      if (char === '[') bracketCount++;
      if (char === ']') bracketCount--;
    }
  }

  // Close unmatched braces/brackets
  while (braceCount > 0) { repaired += '}'; braceCount--; }
  while (bracketCount > 0) { repaired += ']'; bracketCount--; }

  return repaired;
}

export async function generateContentWithGemini(topic, platform = 'YouTube Shorts', persona = 'witty') {
  if (!API_KEY || API_KEY === 'YOUR_GEMINI_KEY') {
    console.error("Gemini API Key is missing or invalid.");
    return null;
  }

  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
    console.log(`[Gemini] Requesting: ${apiUrl.split('?')[0]}`);

    const prompt = `
    당신은 소셜 미디어 전략가이자 작가입니다. 반드시 유효한 JSON 형식으로만 응답하세요.
    주제: ${topic}
    플랫폼: ${platform}
    페르소나: ${persona}
    
    ${persona === 'ensemble' ? `
    [DREAM TEAM ENSEMBLE MODE]
    당신은 백종원(실전 팁/장사), 스티브 잡스(본질/철학/미니멀리즘), 김태호 PD(예능적 재미/반전) 세 명의 목소리를 하나로 합쳐야 합니다.
    - 서론: 백종원의 구수한 말투로 흥미 유발
    - 본론: 스티브 잡스의 철학적인 통찰로 깊이 추가
    - 결론: 김태호 PD의 센스 넘치는 자막형 반전과 예능 자막 느낌으로 마무리
    콘텐츠 안에서 누구의 목소리인지 명시하세요 (예: [백종원] "...").
    ` : ''}
    
    [중요] JSON 응답 시 모든 따옴표와 특수문자를 적절히 이스케이프하세요. 
    대화 내용이나 본문 안에 큰따옴표가 들어갈 경우 \\" 와 같이 처리해야 합니다.
    
    반환할 JSON 구조:
    {
      "title": "A안 제목",
      "script": [{ "time": "0:00", "type": "intro", "text": "현장감 있는 대사", "visual": "가이드" }],
      "hashtags": ["#태그"],
      "sections": [{ "title": "서론", "content": "블로그 본문..." }],
      "viralScore": 90,
      "titleB": "B안 제목",
      "scriptB": [...],
      "hashtagsB": ["#B태그"],
      "sectionsB": [...],
      "keywords": ["키워드"]
    }
    `;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);

    const data = await response.json();
    if (!data.candidates || !data.candidates[0]) throw new Error("No candidates");

    let text = data.candidates[0].content.parts[0].text;

    // Attempt Robust Parse
    try {
      const repaired = repairJson(text);
      return JSON.parse(repaired);
    } catch (parseError) {
      console.error("Gemini Parse Error, Attempting Rescue:", parseError);

      // Secondary Rescue: Extract content if possible
      const contentMatch = text.match(/"content":\s*"([\s\S]*?)"/);
      const titleMatch = text.match(/"title":\s*"([\s\S]*?)"/);

      return {
        title: titleMatch ? titleMatch[1] : topic,
        sections: [{ title: "콘텐츠 본문", content: contentMatch ? contentMatch[1] : text.substring(0, 2000) }],
        hashtags: ["#트렌드"],
        isFallback: true
      };
    }
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
}

export async function generateCommunityPrompts(query) {
  if (!API_KEY || API_KEY === 'YOUR_GEMINI_KEY') return [];

  const prompt = `
  당신은 전 세계의 소셜 미디어 알고리즘과 트렌드를 분석하는 AI 전략 에이전트입니다.
  사용자가 검색한 '${query}' 주제에 대해, 각 플랫폼별(YouTube, Instagram, Blog, Threads)로 
  가장 성공 확률이 높은 프롬프트 6개를 생성하세요.

  프롬프트는 사용자가 바로 복사해서 사용할 수 있는 구체적인 지시어 형태여야 합니다.

  반드시 다음 JSON 형식만 반환하세요:
  [
    {
      "id": "gen-1",
      "type": "youtube",
      "title": "제목",
      "author": "AI Agent",
      "date": "Just Now",
      "prompt": "프롬프트 내용",
      "likes": 0,
      "shares": 0
    },
    ... (총 6개)
  ]
  `;

  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    const data = await response.json();
    let text = data.candidates[0].content.parts[0].text;
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Community Prompt Generation Error:", error);
    return [];
  }
}

/**
 * [Advanced] AI Algorithm Recon Tool
 * Performs a deep intelligence analysis of the competitive landscape for a specific topic.
 */
export async function analyzeAlgorithmIntelligence(topic, platform) {
  if (!API_KEY || API_KEY === 'YOUR_GEMINI_KEY') return null;

  const prompt = `
  당신은 최첨단 소셜 미디어 알고리즘 분석 시스템입니다. 
  사용자가 입력한 주제 '${topic}'에 대해 '${platform}' 플랫폼에서의 상위 랭킹 콘텐츠들을 정밀 분석한 보고서를 생성하십시오.
  
  [분석 항목]
  1. 상위 노출 포스팅의 평균 본문 길이 (글자수)
  2. 평균 이미지/영상 컷 수
  3. 핵심 키워드의 전략적 반복 횟수
  4. 알고리즘 점유 예상 확률 (0~100 사이의 수치)
  5. 3가지 핵심 전략 프로토콜 (각 항목별 타입: VISUAL, SEMANTIC, RETENTION, STRUCTURE, AUTHORITY, ENGAGEMENT 중 선택)

  응답은 반드시 아래 JSON 형식으로만 하십시오:
  {
    "avgChars": 1500,
    "avgImages": 8,
    "keyFrequency": 5,
    "liveScore": 92.5,
    "strategies": [
      { "type": "SEMANTIC", "text": "상세한 전략 설명..." }
    ]
  }
  
  데이터는 가상이지만, 당신의 학습 데이터를 기반으로 해당 주제와 플랫폼에서 가장 성공적인 실제 트렌드를 반영하여 가장 신뢰도 높은 예측치를 제공해야 합니다.
  `;

  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    const data = await response.json();
    let text = data.candidates[0].content.parts[0].text;
    const repaired = repairJson(text);
    return JSON.parse(repaired);
  } catch (error) {
    console.error("Algorithm Analysis Error:", error);
    return null;
  }
}
