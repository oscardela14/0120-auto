// CRITICAL DEBUG VERSION (PERMANENT VISIBILITY)
console.log("Social Auto AI: Localhost Connector Active");

// Production Mode: Silent Background Operation
// Visual debug elements removed upon user request.
// To re-enable debugging, define DEBUG_MODE or check console logs.

// 2. Event Listener
window.addEventListener("SOCIAL_AUTO_PUBLISH", (event) => {
    const data = event.detail;
    console.log("Social Auto AI: Received data for publishing", data);

    // Visual Feedback for Event Receipt
    const eventToast = document.createElement('div');
    eventToast.innerText = `📥 데이터 수신: ${data.title}`;
    eventToast.style.cssText = "position:fixed; top:60px; left:50%; transform:translateX(-50%); background:#6366f1; color:white; padding:15px 30px; border-radius:30px; z-index:2147483647; font-weight:bold; font-size:18px; box-shadow:0 10px 25px rgba(0,0,0,0.3);";
    document.body.appendChild(eventToast);

    if (data.platform === 'Naver Blog') {
        chrome.storage.local.set({ 'pendingPost': data }, () => {
            console.log("Social Auto AI: Data saved to storage.");

            // Visual Feedback for Save Success
            eventToast.style.background = "#22c55e"; // Green
            eventToast.innerText = "📋 데이터 저장 완료! 네이버로 이동하세요.";

            setTimeout(() => eventToast.remove(), 3000);
        });
    } else {
        setTimeout(() => eventToast.remove(), 3000);
    }
});
