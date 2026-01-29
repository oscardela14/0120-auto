import { Helmet } from 'react-helmet-async';

/**
 * SEO 메타 태그 관리 컴포넌트
 * 각 페이지에서 동적으로 메타 태그를 변경할 수 있습니다.
 */
export const SEOHead = ({
    title = 'ContentStudio AI - AI 기반 콘텐츠 자동 생성 플랫폼',
    description = 'YouTube Shorts, Instagram Reels, Naver Blog 콘텐츠를 AI로 자동 생성하세요. Google Trends 기반 실시간 트렌드 분석과 멀티 플랫폼 자동 배포를 지원합니다.',
    keywords = 'AI 콘텐츠 생성, 유튜브 쇼츠, 인스타그램 릴스, 네이버 블로그, 콘텐츠 자동화, 구글 트렌드, SNS 마케팅',
    image = '/og-image.jpg', // public 폴더에 이미지 추가 필요
    url = typeof window !== 'undefined' ? window.location.href : 'https://contentstudio-ai.com',
    type = 'website',
    author = 'ContentStudio AI',
    locale = 'ko_KR',
    canonical,
    jsonLd // JSON-LD 데이터 추가
}) => {
    // 사이트 기본 URL (실제 도메인으로 변경 필요)
    const siteUrl = 'https://contentstudio-ai.com';
    const fullUrl = canonical || url;
    const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

    // 기본 Website Schema
    const defaultJsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "ContentStudio AI",
        "url": siteUrl,
        "potentialAction": {
            "@type": "SearchAction",
            "target": `${siteUrl}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
        }
    };

    return (
        <Helmet>
            {/* 기본 메타 태그 */}
            <html lang="ko" />
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content={author} />

            {/* Viewport (모바일 최적화) */}
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />

            {/* Canonical URL (중복 콘텐츠 방지) */}
            <link rel="canonical" href={fullUrl} />

            {/* 검색 엔진 크롤링 설정 */}
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            <meta name="googlebot" content="index, follow" />

            {/* 구조화된 데이터 (JSON-LD) */}
            <script type="application/ld+json">
                {JSON.stringify(jsonLd || defaultJsonLd)}
            </script>

            {/* Open Graph (Facebook, KakaoTalk, LinkedIn) */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImageUrl} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:site_name" content="ContentStudio AI" />
            <meta property="og:locale" content={locale} />


            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={fullImageUrl} />
            <meta name="twitter:site" content="@contentstudio_ai" />
            <meta name="twitter:creator" content="@contentstudio_ai" />

            {/* 추가 SEO */}
            <meta name="theme-color" content="#6366f1" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            <meta name="apple-mobile-web-app-title" content="ContentStudio AI" />

            {/* 한국 검색 엔진 (Naver, Daum) */}
            <meta name="naver-site-verification" content="YOUR_NAVER_VERIFICATION_CODE" />
            <meta property="article:author" content={author} />
        </Helmet>
    );
};

// 페이지별 프리셋

// 1. 메인 홈페이지 (Logo, SearchBar)
export const HomePageSEO = () => {
    const homeSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "ContentStudio AI",
        "url": "https://contentstudio-ai.com",
        "description": "AI 기반 멀티 플랫폼 콘텐츠 자동 생성 도구",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://contentstudio-ai.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };
    return (
        <SEOHead
            title="ContentStudio AI - AI 기반 멀티 플랫폼 콘텐츠 자동 생성"
            description="YouTube Shorts, Instagram Reels, Naver Blog를 한 번에! AI가 트렌드를 분석하고 바이럴 콘텐츠를 자동으로 생성합니다. 무료 체험 시작하세요."
            keywords="AI 콘텐츠 생성, 유튜브 쇼츠 자동 생성, 인스타그램 릴스 제작, 네이버 블로그 자동화, SNS 콘텐츠 마케팅"
            jsonLd={homeSchema}
        />
    );
};

// 2. 스튜디오 (SoftwareApplication) - 가장 중요
export const StudioPageSEO = () => {
    const appSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "ContentStudio AI Editor",
        "operatingSystem": "Web, Chrome Extension",
        "applicationCategory": "BusinessApplication",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "KRW"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "1250"
        },
        "featureList": "AI Script Generation, Auto Video Editing, Trend Analysis, Multi-Platform Publishing"
    };

    return (
        <SEOHead
            title="콘텐츠 제작 스튜디오 - AI 자동 생성 | ContentStudio AI"
            description="AI가 제목, 대본, 해시태그까지 자동 생성. YouTube, Instagram, Naver 블로그에 최적화된 콘텐츠를 60초 만에 완성하세요."
            jsonLd={appSchema}
        />
    );
};

// 3. 트렌드 페이지 (Dataset/Article)
export const TrendPageSEO = () => (
    <SEOHead
        title="실시간 트렌드 분석 - Google Trends 기반 | ContentStudio AI"
        description="Google Trends 실시간 데이터로 급상승 키워드를 발굴하고, AI가 바이럴 콘텐츠 아이디어를 제안합니다."
        jsonLd={{
            "@context": "https://schema.org",
            "@type": "Dataset",
            "name": "South Korea Real-time Search Trends",
            "description": "Daily updated Google Trends and viral keywords in South Korea.",
            "creator": {
                "@type": "Organization",
                "name": "ContentStudio AI"
            }
        }}
    />
);

// 4. 요금제 페이지 (Product)
export const PricingPageSEO = () => {
    const productSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "ContentStudio AI Pro Subscription",
        "image": "https://contentstudio-ai.com/og-image.jpg",
        "description": "무제한 AI 콘텐츠 생성 및 프리미엄 분석 도구",
        "brand": {
            "@type": "Brand",
            "name": "ContentStudio AI"
        },
        "offers": [
            {
                "@type": "Offer",
                "name": "Free Starter",
                "price": "0",
                "priceCurrency": "KRW",
                "availability": "https://schema.org/InStock"
            },
            {
                "@type": "Offer",
                "name": "Pro Creator",
                "price": "9900",
                "priceCurrency": "KRW",
                "availability": "https://schema.org/InStock"
            }
        ]
    };

    return (
        <SEOHead
            title="요금제 - Free, Creator, Pro, Team | ContentStudio AI"
            description="무료 체험부터 무제한 플랜까지! 월 ₩9,900부터 시작하는 합리적인 요금제. 7일 무료 체험 제공."
            type="product"
            jsonLd={productSchema}
        />
    );
};

// 5. 가이드 페이지 (HowTo + FAQ)
export const GuidePageSEO = () => {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "AI 콘텐츠 생성은 무료인가요?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "네, 매일 5회 무료 생성을 제공하며, 프로 플랜 업그레이드 시 무제한 생성이 가능합니다."
                }
            },
            {
                "@type": "Question",
                "name": "어떤 플랫폼을 지원하나요?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "현재 YouTube Shorts, Instagram Reels, Naver Blog, Threads를 공식 지원하며 지속적으로 추가 중입니다."
                }
            }
        ]
    };

    return (
        <SEOHead
            title="이용 가이드 - 초보자도 쉽게 | ContentStudio AI"
            description="ContentStudio AI 사용법을 쉽고 빠르게 배우세요. 계정 연결부터 자동 배포까지 단계별 가이드를 제공합니다."
            jsonLd={faqSchema}
        />
    );
};

export const HistoryPageSEO = () => (
    <SEOHead
        title="콘텐츠 보관함 - 생성 히스토리 | ContentStudio AI"
        description="생성한 모든 콘텐츠를 한눈에 관리하세요. 플랫폼별 필터링, 검색, 재사용 기능을 제공합니다."
        jsonLd={{
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "User Content Library",
            "description": "Personalized archive of AI-generated contents."
        }}
    />
);
