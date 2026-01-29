
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, 'dist');

// Prerender할 라우트 목록
const ROUTES = [
    '/',
    '/studio',
    '/trends',
    '/pricing',
    '/guide',
    '/history'
];

async function prerender() {
    console.log('🏗️  Starting Prerendering process (Dev Mode)...');

    // Make sure dist directory exists
    if (!fs.existsSync(DIST_DIR)) {
        fs.mkdirSync(DIST_DIR, { recursive: true });
    }

    // 1. Vite Preview 서버 실행 생략 (Dev 서버 5173 사용)
    // const server = spawn('npm', ['run', 'preview', '--', '--port', '4173'], {
    //     shell: true,
    //     stdio: 'pipe'
    // });

    // 서버가 준비될 때까지 대기
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log('🌍 Connecting to active dev server...');

    const browser = await puppeteer.launch({
        headless: "new"
    });
    const page = await browser.newPage();

    const BASE_URL = 'http://localhost:5173'; // Dev Server Port

    for (const route of ROUTES) {
        try {
            console.log(`📸 Capturing: ${route}`);
            await page.goto(`${BASE_URL}${route}`, {
                waitUntil: 'networkidle0', // 네트워크 요청이 멈출 때까지 대기
                timeout: 30000
            });

            // 만약을 위해 조금 더 대기 (React Hydration/Helmet 적용 시간)
            await new Promise(r => setTimeout(r, 1000));

            // HTML 가져오기 (Helmet이 적용된 최종 상태)
            const html = await page.content();

            // 저장 경로 계산
            // route가 '/'면 dist/index.html
            // route가 '/trends'면 dist/trends/index.html
            let filePath;
            if (route === '/') {
                filePath = path.join(DIST_DIR, 'index.html');
            } else {
                const routeDir = path.join(DIST_DIR, route.substring(1)); // Remove leading /
                if (!fs.existsSync(routeDir)) {
                    fs.mkdirSync(routeDir, { recursive: true });
                }
                filePath = path.join(routeDir, 'index.html');
            }

            // DOCTYPE 추가 및 저장
            // 이미 page.content()에 doctype이 있을 수 있으니 확인
            const finalHtml = html.startsWith('<!DOCTYPE html>') ? html : `<!DOCTYPE html>${html}`;

            fs.writeFileSync(filePath, finalHtml);
            console.log(`✅ Saved: ${filePath}`);

        } catch (err) {
            console.error(`❌ Failed to capture ${route}:`, err);
        }
    }

    await browser.close();

    await browser.close();

    // 서버 종료 생략 (외부 서버 사용 중)
    // server.kill();
    console.log('🎉 Prerendering finished successfully!');
    process.exit(0);
}

prerender();
