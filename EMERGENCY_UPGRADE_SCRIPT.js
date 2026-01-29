/**
 * 긴급 등급 업그레이드 스크립트
 * 브라우저 콘솔에서 실행하여 즉시 Pro 등급으로 변경
 */

// 현재 사용자 정보 가져오기
const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

if (!currentUser.email) {
    console.error('❌ 로그인된 사용자가 없습니다.');
} else {
    // Pro 등급으로 즉시 업그레이드
    const upgradedUser = {
        ...currentUser,
        plan: 'pro',
        subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30일 후
        is_trial: false
    };

    // localStorage 업데이트
    localStorage.setItem('user', JSON.stringify(upgradedUser));

    console.log('✅ Pro 멤버십으로 업그레이드 완료!');
    console.log('📊 현재 플랜:', upgradedUser.plan);
    console.log('📅 만료일:', new Date(upgradedUser.subscription_end).toLocaleDateString('ko-KR'));
    console.log('🔄 3초 후 자동 새로고침...');

    // 페이지 새로고침
    setTimeout(() => {
        window.location.reload();
    }, 3000);
}
