import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { fileURLToPath } from 'url';

// 개발 모드 여부
const isDev = process.env.NODE_ENV === 'development';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
    console.log('Creating window...');
    console.log('__dirname:', __dirname);
    console.log('app.getAppPath():', app.getAppPath());

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        show: true, // 즉시 표시 (디버깅용)
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            devTools: true, // 개발자 도구 활성화
        },
        title: 'AI Flashcard',
        backgroundColor: '#ffffff', // 흰색 배경
        // icon은 일단 제거 (아이콘 문제 가능성 제거)
    });

    console.log('Window created, loading content...');

    // 개발 모드에서는 Vite dev server 사용
    if (isDev) {
        console.log('Loading dev server...');
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    } else {
        // 프로덕션 경로 계산
        const indexPath = path.join(__dirname, '../dist/index.html');
        console.log('Loading file:', indexPath);

        mainWindow.loadFile(indexPath).then(() => {
            console.log('File loaded successfully!');
            mainWindow?.webContents.openDevTools();
        }).catch((err) => {
            console.error('Failed to load file:', err);

            // 로드 실패 시 에러 페이지 표시
            mainWindow?.loadURL(`data:text/html,
                <html>
                <head><title>Load Error</title></head>
                <body style="font-family: Arial; padding: 20px;">
                    <h1>Failed to load application</h1>
                    <p>Path: ${indexPath}</p>
                    <p>Error: ${err.message}</p>
                    <p>__dirname: ${__dirname}</p>
                    <p>app.getAppPath(): ${app.getAppPath()}</p>
                </body>
                </html>
            `);
        });
    }

    // 로드 완료 이벤트
    mainWindow.webContents.on('did-finish-load', () => {
        console.log('Content loaded successfully!');
    });

    // 로드 에러 처리
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
        console.error('Failed to load:', {
            errorCode,
            errorDescription,
            validatedURL
        });
    });

    // 콘솔 메시지 출력
    mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
        console.log(`[Renderer ${level}]:`, message);
    });

    // 크래시 감지
    mainWindow.webContents.on('crashed', () => {
        console.error('Renderer process crashed!');
    });

    mainWindow.on('closed', () => {
        console.log('Window closed');
        mainWindow = null;
    });

    mainWindow.on('ready-to-show', () => {
        console.log('Window ready to show');
    });

    // 창이 생성되었는지 확인
    console.log('Window object:', mainWindow ? 'exists' : 'null');
}

// 앱 이벤트 로깅
app.on('ready', () => {
    console.log('App ready event fired');
});

// Electron 앱이 준비되면 창 생성
app.whenReady().then(() => {
    console.log('App is ready, creating window...');
    createWindow();

    app.on('activate', () => {
        console.log('App activate event');
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// 모든 창이 닫히면 앱 종료 (macOS 제외)
app.on('window-all-closed', () => {
    console.log('All windows closed');
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// 앱 종료 시
app.on('will-quit', () => {
    console.log('App will quit');
});
