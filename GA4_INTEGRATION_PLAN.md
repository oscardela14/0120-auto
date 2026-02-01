# 📊 Google Analytics (GA4) Intelligence Integration Plan

본 문서는 **Anti-Gravity** 프로젝트에 Google Analytics 4를 MCP(Model Context Protocol) 및 앱 내 대시보드 형태로 통합하기 위한 로드맵입니다.

## 🎯 통합 목표
1.  **AI 분석 자동화**: AI가 실시간 유입 데이터를 읽고 콘텐츠 성과를 스스로 학습하여 최적의 주제 제안.
2.  **수익 정밀 측정**: 시뮬레이션된 데이터가 아닌, GA4의 실제 전환 데이터를 기반으로 한 정확한 ROI 산출.
3.  **지능형 리포팅**: 사용자에게 단순한 수치가 아닌 "지금 이 주제로 블로그를 쓰면 유입이 20% 늘어날 것"이라는 데이터 기반 가이드 제공.

---

## 🏗️ 1단계: Foundation (데이터 엔진 구축)
- [ ] `src/utils/ga4Engine.js` 생성: GA4 API 연동 및 데이터 가공 로직 구현.
- [ ] Mock Data System: API 키 설정 전에도 시스템이 작동하도록 프리미엄 시뮬레이션 모드 지원.
- [ ] **Google Analytics MCP Server** 연동 가이드 제공 (Local AI 분석용).

## 🖼️ 2단계: Visual Excellence (UI/UX 통합)
- [ ] **DashboardPage**: "Real-time Traffic & User Journey" 위젯 추가.
- [ ] **RevenuePage**: "Actual Conversion vs Projected ROI" 비교 분석 섹션 추가.
- [ ] **TrendsPage**: 소셜 트렌드와 내 사이트의 유입 패턴 결합 분석 뷰 제공.

## 🧠 3단계: AI Intelligence Loop (지능화)
- [ ] **GuideView**: GA4 성과 지표(체류 시간, 이탈률)에 따른 맞춤형 AI 조언 기능.
- [ ] **AlgorithmGuardrail**: 유입 급감 시 Emergency Alert 및 카운터 전략 자동 생성.

---

## 🛠️ 사용자 준비 사항 (Action Required)
GA4의 실제 데이터를 불러오기 위해 다음 정보가 필요합니다. (준비 전까지는 '시뮬레이션 모드'로 작동합니다.)
1.  **Google Cloud Project**: 서비스 계정(Service Account) 생성 및 JSON 키.
2.  **GA4 Property ID**: 분석 대상이 되는 GA4 측정 ID.

---

**위 계획대로 진행할까요? 첫 번째 단계인 `ga4Engine.js` 구현을 바로 시작하겠습니다.**
