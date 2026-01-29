const targetDomains = ['naver.com', 'localhost', '127.0.0.1'];

function injectScript(tabId, url) {
    if (!url) return;
    const isTarget = targetDomains.some(domain => url.includes(domain));

    if (isTarget) {
        console.log(`[Background] Injecting into ${url}`);
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["content.js"]
        }).catch(err => console.error("Injection failed:", err));
    }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        injectScript(tabId, tab.url);
    }
});
