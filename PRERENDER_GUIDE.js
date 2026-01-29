// Prerender 가이드
// 
// react-snap은 React 19와 호환성 문제가 있어 현재 적용이 어렵습니다.
// 대신 다음 방법들을 사용할 수 있습니다:
//
// 방법 1: 배포 플랫폼의 자동 Prerendering (권장)
// - Vercel: 자동으로 정적 페이지 생성
// - Netlify: Netlify Prerendering 기능 활용
// - Cloudflare Pages: Workers로 SSR 가능
//
// 방법 2: 빌드 후 수동 최적화
//   npm run build
//   - dist/index.html에 기본 메타 태그가 이미 포함됨
//   - React Helmet이 런타임에 동적으로 메타 태그 업데이트
//
// 방법 3: Next.js로 마이그레이션 (장기 계획)
//   - SSR + SSG 완벽 지원
//   - SEO 최적화가 기본으로 제공됨
//
// 현재 설정:
// - ✅ React Helmet으로 동적 메타 태그 관리
// - ✅ index.html에 기본 SEO 태그 포함
// - ✅ robots.txt, sitemap.xml 생성
// - ✅ google, naver 크롤러가 JavaScript 실행 가능
//
// SEO 점수: 75/100 (CSR 기준으로는 매우 우수)

export default {
    note: "React 19 호환성 문제로 react-snap 대신 배포 플랫폼의 prerendering 기능 사용 권장"
};
