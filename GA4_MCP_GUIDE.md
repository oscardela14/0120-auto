# 🔌 Google Analytics 4 (GA4) MCP Connector Guide

이 가이드는 **Anti-Gravity** 시스템에 실제 GA4 데이터를 연동하여 AI가 실시간으로 학습하게 만드는 방법입니다.

## 🛠️ 준비 사항
1.  **Google Cloud Project**: 서비스 계정(Service Account) 생성 및 JSON 키 다운로드.
2.  **Google Analytics**: 분석 대상 속성(Property)에 해당 서비스 계정 이메일을 '뷰어' 권한으로 추가.
3.  **Property ID**: GA4 관리 메뉴 -> 속성 설정에서 숫자 형태의 속성 ID 확인.

## 🚀 연동 방법 (2가지)

### 방법 A: Model Context Protocol (MCP) 연동 (권장)
로컬에서 작동하는 AI(예: Claude Desktop, Cursor 등)가 내 GA4 데이터를 직접 읽게 설정합니다.

1.  Claude Desktop의 `claude_desktop_config.json` 파일을 엽니다.
2.  `mcpServers` 섹션에 다음 설정을 추가합니다:
    ```json
    {
      "mcpServers": {
        "google-analytics": {
          "command": "npx",
          "args": ["-y", "@modelcontextprotocol/server-google-analytics"],
          "env": {
            "GOOGLE_APPLICATION_CREDENTIALS": "/경로/to/your/service-account-key.json",
            "GA4_PROPERTY_ID": "당신의_속성_ID"
          }
        }
      }
    }
    ```
3.  Antigravity AI 어시스턴트에게 **"내 GA4 최근 트래픽 분석해줘"**라고 요청하면 실시간 데이터를 읽어옵니다.

### 방법 B: 앱 내 API 브릿지 설정
대시보드 위젯에 실제 데이터를 표시하기 위해 `.env` 파일에 다음 항목을 추가하십시오.

```env
VITE_GA4_PROPERTY_ID=당신의_속성_ID
VITE_GA4_CLIENT_EMAIL=서비스_계정_이메일
VITE_GA4_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
```

## 🧠 연동 시 얻는 이점
-   **Neural Topic Selection**: 시뮬레이션이 아닌 실제 유입 키워드를 분석하여 다음 콘텐츠 주제 제안.
-   **ROI 역추적**: 어떤 플랫폼(유튜브/블로그)을 통해 들어온 유저가 가장 결제를 많이 하는지 자동 분석.
-   **이탈률 방어**: 유입 대비 체류시간이 급감하는 콘텐츠를 AI가 먼저 발견하고 수정안 제안.

---
*준비가 완료되면 `ga4Engine.js`의 `SIMULATED` 모드가 자동으로 `LIVE_GA4_SYNC`로 전환됩니다.*
