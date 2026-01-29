console.log("Social Auto AI: Naver Connector Active on " + window.location.href);

// Debug: Check if storage has data immediately
chrome.storage.local.get(['pendingPost'], (r) => {
    console.log("Social Auto AI: Initial Storage Check:", r);
});

// Helper: Wait for element
const waitForElement = (selector, timeout = 10000) => {
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(interval);
                resolve(el);
            }
        }, 500);
        setTimeout(() => {
            clearInterval(interval);
            resolve(null);
        }, timeout);
    });
};

const checkAndAutomate = () => {
    console.log("Social Auto AI: Monitoring for pending posts...");

    // Polling to ensure storage is ready or page state changes
    const interval = setInterval(() => {
        chrome.storage.local.get(['pendingPost'], async (result) => {
            if (result.pendingPost) {
                const data = result.pendingPost;
                console.log("Social Auto AI: Found pending post!", data);
                // alert("AI: 데이터 확인됨. 자동화 시작!"); // Optional debug, commented out to be less annoying unless requested.

                // Show a non-blocking toast instead of alert blocking execution?
                // Actually an alert is fine for "No Reaction" debugging.
                const toast = document.createElement('div');
                toast.style.cssText = "position:fixed; top:10px; left:50%; transform:translateX(-50%); background:#22c55e; color:white; padding:10px 20px; border-radius:20px; z-index:9999999; font-weight:bold; box-shadow:0 4px 15px rgba(0,0,0,0.3);";
                toast.innerText = "✅ AI데이터 수신! 자동화를 진행합니다.";
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 3000);

                // --- LOGIC START ---

                // 1. Redirect Logic (If stuck on main page after login)
                const isEditor = window.location.href.includes("PostWriteForm") || window.location.href.includes("editor.naver.com");
                const isLoginPage = window.location.href.includes("nid.naver.com");

                // Define location flags
                const onSectionHome = window.location.href.includes("section.blog.naver.com");
                const onMyBlog = window.location.href.includes("blog.naver.com");
                const onMainNaver = window.location.hostname === "www.naver.com";

                if (!isEditor && !isLoginPage) {
                    console.log("Not in editor. Context:", { onSectionHome, onMyBlog, onMainNaver });

                    // If on Naver Main Page, Go to Blog Section (Click "Blog" as user requested)
                    if (onMainNaver) {
                        clearInterval(interval);
                        console.log("On Naver Main. Looking for 'Blog' link...");

                        // User specifically asked to "Click the Blog text"
                        const findAndClickBlog = () => {
                            // Common selectors for Naver's "Blog" link in nav
                            // 1. Shortcut area
                            const shortcuts = Array.from(document.querySelectorAll('a'));
                            const blogLink = shortcuts.find(el => el.innerText.trim() === '블로그' || el.getAttribute('href')?.includes('section.blog.naver.com'));

                            if (blogLink) {
                                console.log("Found Blog link. Clicking...", blogLink);
                                // Highlight for user to see
                                blogLink.style.border = "2px solid #6366f1";
                                setTimeout(() => blogLink.click(), 500); // Slight delay for visual
                                return true;
                            }
                            return false;
                        };

                        if (!findAndClickBlog()) {
                            // Fallback: Redirect if link not found after 2 seconds
                            const notice = document.createElement('div');
                            notice.style.cssText = "position:fixed;top:0;left:0;width:100%;background:#6366f1;color:white;z-index:999999;text-align:center;padding:10px;font-weight:bold;";
                            notice.innerText = "🚀 AI: 블로그 메뉴 찾는 중... (Redirecting fallback)";
                            document.body.appendChild(notice);
                            setTimeout(() => {
                                window.location.href = "https://section.blog.naver.com";
                            }, 2000);
                        }
                        return;
                    }

                    if (onSectionHome || onMyBlog) {
                        // ... (Existing Write Button Logic is good, keep it) ...
                        clearInterval(interval);
                        console.log("On Blog Home. Clicking Write...");

                        const findAndClickWrite = () => {
                            const writeBtn = document.querySelector('a.button_write');
                            const textBtn = Array.from(document.querySelectorAll('a')).find(el => el.innerText.trim() === '글쓰기');
                            const target = writeBtn || textBtn;

                            if (target) {
                                target.style.border = "2px solid #ef4444"; // Visual cue
                                target.click();
                                return true;
                            }
                            return false;
                        };

                        let attempts = 0;
                        const wInterval = setInterval(() => {
                            attempts++;
                            if (findAndClickWrite()) clearInterval(wInterval);
                            else if (attempts > 10) clearInterval(wInterval);
                        }, 500);
                        return;
                    }

                    // ... (Redirect Fallback) ...
                    clearInterval(interval);
                    // Only redirect if absolutely lost
                    setTimeout(() => {
                        window.location.href = "https://section.blog.naver.com";
                    }, 2000);
                    return;
                }

                if (!isEditor) return;

                // --- EDITOR AUTOMATION ---
                clearInterval(interval);

                // Create Floating UI (Existing)
                if (document.getElementById('ai-auto-fill-btn')) return;

                const ui = document.createElement('div');
                ui.style.cssText = `position: fixed; top: 20px; right: 20px; z-index: 99999; background: #fff; padding: 20px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); width: 320px; border: 1px solid #ddd; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;`;
                ui.innerHTML = `
                    <h3 style="margin:0 0 15px 0; color:#111; font-size:16px;">🤖 AI Auto Publisher</h3>
                    <div style="background:#f3f4f6; padding:10px; border-radius:8px; margin-bottom:15px;">
                        <div style="font-size:12px; color:#666; margin-bottom:4px;">Ready to publish:</div>
                        <div style="font-weight:600; font-size:14px; color:#333; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${data.title}</div>
                    </div>
                    <button id="ai-run-all" style="width:100%; background:#03c75a; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; font-size:15px; cursor:pointer; transition:all 0.2s;">
                        ⚡ Start Auto Publish
                    </button>
                    <button id="ai-cancel" style="width:100%; background:transparent; border:none; color:#999; margin-top:10px; cursor:pointer; font-size:13px;">Cancel</button>
                `;
                document.body.appendChild(ui);

                document.getElementById('ai-cancel').onclick = () => { ui.remove(); chrome.storage.local.remove('pendingPost'); };

                document.getElementById('ai-run-all').onclick = async () => {
                    const btn = document.getElementById('ai-run-all');
                    const updateStatus = (msg) => { btn.innerText = msg; btn.style.background = "#666"; };

                    try {
                        // 1. Fill Title
                        updateStatus("Writing Title...");
                        const titleContainer = document.querySelector('.se-documentTitle-container');
                        if (titleContainer) {
                            titleContainer.click();
                            await navigator.clipboard.writeText(data.title);
                            const titleEl = document.querySelector('.se-documentTitle-container');
                            titleEl.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                            titleEl.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                            titleEl.click();
                            await new Promise(r => setTimeout(r, 300));
                            document.execCommand('paste');
                        } else { throw new Error("Title area not found"); }

                        await new Promise(r => setTimeout(r, 1000));

                        // 2. Fill Body
                        updateStatus("Writing Body...");
                        let bodyHTML = '';
                        if (data.sections) {
                            data.sections.forEach(sec => bodyHTML += `<h3>${sec.title}</h3><p>${sec.content.replace(/\n/g, '<br>')}</p><br>`);
                        } else {
                            bodyHTML = `<p>${(data.content || "").replace(/\n/g, '<br>')}</p>`;
                        }
                        bodyHTML += `<br><br><p style="color:#888">${data.hashtags}</p>`;

                        const blobHtml = new Blob([bodyHTML], { type: 'text/html' });
                        const blobText = new Blob([data.content || "Content"], { type: 'text/plain' });
                        await navigator.clipboard.write([new ClipboardItem({ 'text/html': blobHtml, 'text/plain': blobText })]);

                        const bodyEl = document.querySelector('.se-main-container');
                        if (bodyEl) {
                            bodyEl.click();
                            bodyEl.querySelector('.se-text-paragraph')?.click();
                            await new Promise(r => setTimeout(r, 500));
                            document.execCommand('paste');
                        } else { throw new Error("Body area not found"); }

                        await new Promise(r => setTimeout(r, 1500));

                        // 3. Click Publish (Top Right)
                        updateStatus("Clicking Publish...");
                        const publishBtns = Array.from(document.querySelectorAll('button'));
                        const topPublishBtn = publishBtns.find(b => b.innerText.includes('발행') && !b.className.includes('confirm')); // Avoid final confirm if visible

                        if (topPublishBtn) {
                            topPublishBtn.click();
                        } else {
                            throw new Error("Top Publish button not found");
                        }

                        await new Promise(r => setTimeout(r, 1500));

                        // 4. Click Final Publish (Bottom Overlay)
                        updateStatus("Finalizing...");
                        // Need to re-query buttons as overlay is new
                        const finalBtns = Array.from(document.querySelectorAll('button'));
                        // Look for the specific green confirm button in the footer of the layer
                        const finalPublishBtn = finalBtns.find(b => b.innerText.trim() === '발행' && b.offsetParent !== null && b !== topPublishBtn);

                        if (finalPublishBtn) {
                            finalPublishBtn.click();
                            updateStatus("🎉 Published!");
                            setTimeout(() => ui.remove(), 2000);
                            chrome.storage.local.remove('pendingPost');
                        } else {
                            throw new Error("Final Settings Publish button not found. Please click manually.");
                        }

                    } catch (e) {
                        console.error(e);
                        alert("Auto Publish Paused: " + e.message);
                        btn.style.background = "#ef4444";
                        btn.innerText = "Error - Retry?";
                    }
                };
            }
        });
    }, 1000);

    // Stop polling after 30 seconds to prevent infinite resource usage
    setTimeout(() => clearInterval(interval), 30000);
};

checkAndAutomate();
