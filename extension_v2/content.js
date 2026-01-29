(function () {
    // GUARD
    if (window.hasAiHybridController) return;
    window.hasAiHybridController = true;

    console.log("%c AI EXTENSION V7.2 (UNDEFINED FIX) READY ", "background: #222; color: #ff00ff; font-size: 20px");

    // =================================================================================
    // 1. LOCALHOST
    // =================================================================================
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        document.body.style.border = "10px solid #ef4444";

        window.addEventListener("message", (e) => {
            if (e.data && e.data.type === "SOCIAL_AUTO_PUBLISH") handleData(e.data.detail);
        });
        window.addEventListener("SOCIAL_AUTO_PUBLISH", (e) => handleData(e.detail));

        function handleData(data) {
            if (!data) return;
            chrome.storage.local.set({ 'pendingPost': data }, () => {
                const old = document.querySelector('.ai-manual-modal');
                if (old) old.remove();

                const div = document.createElement('div');
                div.className = 'ai-manual-modal';
                div.style.cssText = "position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); padding:30px; background:white; border:3px solid #3b82f6; z-index:2147483647; border-radius:15px; text-align:center; box-shadow:0 10px 100px rgba(0,0,0,0.5); font-family: sans-serif; min-width: 320px; pointer-events: auto !important;";
                div.innerHTML = `
                    <h2 style='margin:0 0 10px; color:#3b82f6;'>데이터 전송 준비 완료!</h2>
                    <p style='margin:0 0 20px; color:#555;'>네이버 블로그 에디터로 이동합니다.</p>
                    
                    <button id='ai-go-btn' style='display:block; width:100%; background:#03c75a; color:white; padding:15px; border:none; border-radius:8px; cursor:pointer; font-size:16px; font-weight:bold; margin-bottom: 10px;'>
                        네이버로 이동 🚀
                    </button>
                    
                    <button id='ai-close-btn' style='display:block; width:100%; background:#f3f4f6; color:#4b5563; padding:12px; border:1px solid #d1d5db; border-radius:8px; cursor:pointer; font-size:14px; font-weight:bold;'>
                        닫기 ❌
                    </button>
                `;
                document.body.appendChild(div);

                div.querySelector('#ai-go-btn').onclick = () => {
                    div.remove();
                    setTimeout(() => window.open("https://nid.naver.com/nidlogin.login?mode=form&url=https://www.naver.com/", "_blank"), 100);
                };
                div.querySelector('#ai-close-btn').onclick = (e) => {
                    e.preventDefault(); div.remove();
                };
            });
        }
        return;
    }

    // =================================================================================
    // 2. NAVER AUTOMATION
    // =================================================================================
    if (location.href.includes("naver.com")) {
        // Login Guard
        if (location.hostname.includes("nid.naver.com")) return;

        chrome.storage.local.get(['pendingPost'], (res) => {
            const data = res.pendingPost;
            if (!data) return;

            // 1. Navigation Logic
            if (location.hostname === 'www.naver.com' && window.top === window.self) {
                const loginBtn = document.querySelector('.link_login');
                if (!loginBtn) {
                    if (!document.getElementById('ai-nav-toast')) {
                        const toast = document.createElement('div');
                        toast.id = 'ai-nav-toast';
                        toast.innerHTML = `🚀 에디터로 이동합니다...`;
                        toast.style.cssText = "position:fixed; top:20px; right:20px; background:#03c75a; color:white; padding:15px 25px; border-radius:30px; z-index:999999; font-weight:bold; box-shadow:0 5px 20px rgba(0,0,0,0.2);";
                        document.body.appendChild(toast);
                        setTimeout(() => window.location.href = "https://blog.naver.com/MyBlog.naver", 2000);
                    }
                }
            }
            if (location.href.includes("blog.naver.com") && !location.href.includes("PostWriteForm")) {
                const url = new URL(location.href);
                let blogId = url.pathname.split('/')[1] || url.searchParams.get("blogId");
                if (blogId && !blogId.includes('.') && blogId !== 'MyBlog' && !sessionStorage.getItem('ai_jumped')) {
                    sessionStorage.setItem('ai_jumped', 'true');
                    window.location.href = `https://blog.naver.com/PostWriteForm.naver?blogId=${blogId}&wtype=post`;
                }
            }

            // 2. CONTROLLER UI Injector
            const editorLoop = setInterval(() => {
                const isEditor = document.querySelector('.se-main-container') || document.querySelector('.se_content') || location.href.includes("PostWriteForm");

                if (isEditor) {
                    clearInterval(editorLoop);
                    showControllerUI(data);
                }
            }, 1000);

            function showControllerUI(data) {
                if (document.getElementById('ai-controller-panel')) return;

                const panel = document.createElement('div');
                panel.id = 'ai-controller-panel';
                panel.style.cssText = `
                    position: fixed; 
                    bottom: 20px; 
                    right: 20px; 
                    width: 350px; 
                    background: white; 
                    border: 2px solid #03c75a; 
                    border-radius: 12px; 
                    box-shadow: 0 10px 40px rgba(0,0,0,0.3); 
                    z-index: 2147483647; 
                    padding: 20px;
                    font-family: sans-serif;
                `;

                // SAFEGUARD: Handle undefined content
                const safeContent = data.content || "";
                const safeHashtags = data.hashtags || "";

                const fullContent = safeContent + "<br><br>" + safeHashtags;
                const displayContent = fullContent.length > 50 ? fullContent.substring(0, 50).replace(/<[^>]*>/g, '') + "..." : fullContent.replace(/<[^>]*>/g, '');

                panel.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
                        <h3 style="margin:0; font-size:16px; font-weight:bold; color:#03c75a;">🤖 AI 포스팅 컨트롤러</h3>
                        <button id="ai-panel-close" style="background:none; border:none; cursor:pointer; font-size:18px;">❌</button>
                    </div>
                    
                    <!-- TITLE SECTION -->
                    <div style="margin-bottom:15px;">
                        <div style="font-size:12px; font-weight:bold; color:#555; margin-bottom:5px;">📌 제목 (Title)</div>
                        <div style="background:#f9f9f9; padding:8px; border-radius:6px; font-size:13px; color:#333; margin-bottom:8px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                            ${data.title}
                        </div>
                        <button id="btn-inject-title" style="width:100%; background:#03c75a; color:white; padding:10px; border:none; border-radius:6px; cursor:pointer; font-weight:bold; display:flex; align-items:center; justify-content:center; gap:5px;">
                            <span>👉 제목 넣어주기</span>
                        </button>
                    </div>

                    <!-- CONTENT SECTION -->
                    <div style="margin-bottom:20px;">
                        <div style="font-size:12px; font-weight:bold; color:#555; margin-bottom:5px;">📝 본문 + 해시태그 (Content+Tags)</div>
                        <div style="background:#f9f9f9; padding:8px; border-radius:6px; font-size:12px; color:#666; margin-bottom:8px; height:40px; overflow:hidden; line-height:1.4;">
                            ${displayContent}
                        </div>
                        <button id="btn-inject-body" style="width:100%; background:#03c75a; color:white; padding:10px; border:none; border-radius:6px; cursor:pointer; font-weight:bold; display:flex; align-items:center; justify-content:center; gap:5px;">
                            <span>👉 본문+해시태그 넣어주기</span>
                        </button>
                    </div>
                    
                    <div style="margin-bottom:15px; border-top:1px dashed #ddd; padding-top:15px;">
                        <div style="font-size:12px; font-weight:bold; color:#555; margin-bottom:5px;">📋 수동 복사 (Ctrl+V용)</div>
                        <button id="btn-copy-all" style="width:100%; background:white; border:1px solid #333; color:#333; padding:8px; border-radius:6px; cursor:pointer; font-size:12px; display:flex; align-items:center; justify-content:center;">
                            전체 복사 (제목+본문+태그)
                        </button>
                    </div>

                     <div>
                        <button id="btn-pub-start" style="width:100%; background:#333; color:white; padding:10px; border:none; border-radius:6px; cursor:pointer; font-size:13px;">
                            작업 완료 (종료)
                        </button>
                    </div>
                `;

                document.body.appendChild(panel);

                // --- HELPER FUNCTIONS ---
                const directInject = (element, text, isHTML = false) => {
                    element.focus();
                    if (isHTML) element.innerHTML = text;
                    else element.innerText = text;
                    element.dispatchEvent(new Event('input', { bubbles: true }));
                    element.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
                    element.dispatchEvent(new Event('blur', { bubbles: true }));
                };

                const fallbackCopy = (text) => {
                    const ta = document.createElement("textarea");
                    ta.value = text;
                    ta.style.position = "fixed"; ta.style.left = "-9999px";
                    document.body.appendChild(ta);
                    ta.focus(); ta.select();
                    document.execCommand('copy');
                    document.body.removeChild(ta);
                };

                // 1. INJECT TITLE
                panel.querySelector('#btn-inject-title').onclick = () => {
                    let titleEl = document.querySelector('.se-documentTitle-container') || document.querySelector('[placeholder="제목"]');
                    if (titleEl) {
                        const editTarget = titleEl.querySelector('[contenteditable="true"]') || titleEl.querySelector('input') || titleEl;
                        editTarget.style.border = "3px solid #03c75a";
                        directInject(editTarget, data.title, false);
                    } else {
                        // Fallback Title Copy
                        fallbackCopy(data.title);
                        alert("제목 칸을 못 찾아 '제목'을 복사했습니다.\n붙여넣기(Ctrl+V) 하세요.");
                    }
                };

                // 2. INJECT BODY + HASHTAGS
                panel.querySelector('#btn-inject-body').onclick = async () => {
                    let bodyEl = document.querySelector('.se-main-container');
                    let placeholder = Array.from(document.querySelectorAll('*')).find(el => el.innerText && el.innerText.includes("글감과 함께"));

                    if (placeholder) placeholder.click();
                    else if (bodyEl) bodyEl.click();

                    await new Promise(r => setTimeout(r, 200));

                    let editTarget = document.querySelector('.se-main-container [contenteditable="true"]');
                    if (!editTarget && bodyEl) editTarget = bodyEl.querySelector('[contenteditable="true"]');

                    if (editTarget) {
                        editTarget.style.border = "3px solid #03c75a";
                        // INJECT FULL CONTENT
                        directInject(editTarget, fullContent, true);
                    } else {
                        // Fallback Body Copy
                        try {
                            const htmlBlob = new Blob([fullContent], { type: 'text/html' });
                            const textBlob = new Blob([fullContent], { type: 'text/plain' });
                            const item = new ClipboardItem({ 'text/html': htmlBlob, 'text/plain': textBlob });
                            await navigator.clipboard.write([item]);
                            alert("본문+해시태그를 복사했습니다.\n본문 칸에 붙여넣기(Ctrl+V) 하세요.");
                        } catch (e) {
                            fallbackCopy(fullContent);
                            alert("본문+해시태그(텍스트)를 복사했습니다.\n붙여넣기 하세요.");
                        }
                    }
                };

                // 3. COPY ALL (Title + Content + Tags)
                panel.querySelector('#btn-copy-all').onclick = () => {
                    const allText = `[제목]\n${data.title}\n\n[내용]\n${(safeContent || "").replace(/<[^>]*>/g, '')}\n\n[태그]\n${safeHashtags}`;
                    fallbackCopy(allText);
                    alert("모든 내용(제목+본문+태그)이 복사되었습니다!\n원하는 곳에 Ctrl+V 하세요.");
                };

                // Close
                const closeAction = () => {
                    panel.remove();
                    chrome.storage.local.remove('pendingPost');
                };
                panel.querySelector('#ai-panel-close').onclick = closeAction;
                panel.querySelector('#btn-pub-start').onclick = closeAction;
            }
        });
    }
})();
