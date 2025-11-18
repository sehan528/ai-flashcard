import { app, BrowserWindow } from 'electron';
import * as path from 'path';

// 개발 모드 여부
const isDev = process.env.NODE_ENV === 'development';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
        title: 'AI Flashcard',
        icon: path.join(__dirname, '../public/icon.png'), // 아이콘이 있다면
    });

    // 개발 모드에서는 Vite dev server 사용
    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    } else {
        // 프로덕션에서는 빌드된 파일 로드
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Electron 앱이 준비되면 창 생성
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        // macOS에서 dock 아이콘 클릭 시 창이 없으면 새로 생성
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// 모든 창이 닫히면 앱 종료 (macOS 제외)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
