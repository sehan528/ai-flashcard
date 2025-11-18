# Electron 빌드 트러블슈팅 가이드

이 문서는 AI Flashcard 프로젝트에 Electron을 통합하는 과정에서 발생한 모든 문제와 해결 방법을 기록합니다.

## 목차
1. [Package 버전 호환성 문제](#1-package-버전-호환성-문제)
2. [Windows Python 의존성 문제](#2-windows-python-의존성-문제)
3. [Window가 표시되지 않는 문제](#3-window가-표시되지-않는-문제)
4. [ES 모듈 환경에서 __dirname 문제 (핵심 원인)](#4-es-모듈-환경에서-__dirname-문제-핵심-원인)
5. [DevTools 자동 열림 문제](#5-devtools-자동-열림-문제)
6. [디버깅 기법](#6-디버깅-기법)

---

## 1. Package 버전 호환성 문제

### 증상
```
npm error code ETARGET
npm error notarget No matching version found for vite-plugin-electron@^0.28.9
npm error notarget No matching version found for vite-plugin-electron-renderer@^0.14.6
```

### 원인
처음 작성된 `package.json`에 존재하지 않는 버전이 지정되어 있었습니다.
- `vite-plugin-electron@^0.28.9` - 실제로는 0.28.8까지만 존재
- `vite-plugin-electron-renderer@^0.14.6` - 실제로는 0.14.5까지만 존재

### 해결 방법
`package.json`에서 정확한 버전으로 수정:

```json
"devDependencies": {
  "electron": "^33.2.0",
  "electron-builder": "^25.1.8",
  "vite-plugin-electron": "^0.28.8",
  "vite-plugin-electron-renderer": "^0.14.5"
}
```

### 예방법
- npm 패키지 버전을 명시할 때는 [npmjs.com](https://www.npmjs.com)에서 실제 존재하는 버전을 확인
- 또는 `npm view <package-name> versions` 명령어로 사용 가능한 버전 확인

---

## 2. Windows Python 의존성 문제

### 증상
Windows PowerShell에서 `npm run build:win` 실행 시 다음과 같이 멈춤:

```powershell
PS C:\works\ai-flashcard> npm run build:win

> ai-flashcard@1.0.0 prebuild
> npm run generate:index

> python3 scripts/generate-dataset-index.py

# 여기서 응답 없음...
```

### 원인
`package.json`의 `prebuild` 스크립트가 `python3` 명령어를 실행하는데, Windows에서는 `python3` 명령어가 기본적으로 설치되어 있지 않습니다.

```json
"scripts": {
  "prebuild": "npm run generate:index",
  "generate:index": "python3 scripts/generate-dataset-index.py",
  "build:win": "npm run build:no-prebuild && electron-builder --win"
}
```

### 해결 방법

#### 방법 1: `build:no-prebuild` 스크립트 사용 (권장)
Python 의존성을 우회하는 별도의 빌드 스크립트 추가:

```json
"scripts": {
  "build:no-prebuild": "vite build",
  "build:win": "npm run build:no-prebuild && electron-builder --win"
}
```

이제 `npm run build:win`은 Python 없이 바로 빌드됩니다.

#### 방법 2: Python 설치 (선택사항)
Windows에서 Python이 필요한 경우:
1. Microsoft Store에서 Python 설치
2. 또는 [python.org](https://www.python.org/downloads/)에서 다운로드
3. 설치 후 `python --version` 또는 `py --version`으로 확인

#### 방법 3: 수동으로 index.json 확인
`public/data/dataset/index.json` 파일이 이미 존재하는 경우 Python 스크립트 실행 불필요:

```powershell
# index.json이 있는지 확인
dir public\data\dataset\index.json

# 있다면 바로 빌드
npm run build:no-prebuild
electron-builder --win
```

### 학습 내용
- 크로스 플랫폼 빌드 스크립트는 OS별 명령어 차이를 고려해야 합니다
- 선택적 의존성(Python 등)은 우회 방법을 제공하는 것이 좋습니다
- `prebuild` 스크립트가 실패하면 전체 빌드가 중단됩니다

---

## 3. Window가 표시되지 않는 문제

### 증상
- `release/AI Flashcard-1.0.0-x64.exe` 실행 시 작업 관리자에는 프로세스가 보이지만 GUI 창이 나타나지 않음
- `release/win-unpacked/AI Flashcard.exe` 실행해도 동일한 현상

### 초기 디버깅 시도

#### 시도 1: ready-to-show 이벤트 추가
`electron/main.ts`에 이벤트 리스너 추가:

```typescript
mainWindow.on('ready-to-show', () => {
    console.log('Window ready to show');
});
```

**결과**: 여전히 창이 나타나지 않음

#### 시도 2: 에러 로깅 강화
```typescript
mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('Failed to load:', {
        errorCode,
        errorDescription,
        validatedURL
    });
});

mainWindow.webContents.on('crashed', () => {
    console.error('Renderer process crashed!');
});
```

**결과**: 로그가 출력되지 않아 실제 원인을 찾을 수 없었음

#### 시도 3: PowerShell에서 직접 실행하여 로그 확인
```powershell
cd release\win-unpacked
.\AI Flashcard.exe
```

**결과**: 핵심 에러 발견! (다음 섹션 참조)

---

## 4. ES 모듈 환경에서 __dirname 문제 (핵심 원인)

### 발견된 에러

PowerShell에서 직접 실행하니 다음 에러가 출력됨:

```
Creating window...
(node:86680) UnhandledPromiseRejectionWarning: ReferenceError: __dirname is not defined
    at a (file:///C:/works/ai-flashcard/ai-flashcard/release/win-unpacked/resources/app.asar/dist-electron/main.js:6:68)
    at async Object.<anonymous> (file:///C:/works/ai-flashcard/ai-flashcard/release/win-unpacked/resources/app.asar/dist-electron/main.js:113:33)
(node:86680) UnhandledPromiseRejectionWarning: Unhandled promise rejection.
```

### 원인 분석

`package.json`에 `"type": "module"`이 설정되어 있어 ES 모듈 시스템 사용:

```json
{
  "type": "module"
}
```

**문제점**: ES 모듈 환경에서는 CommonJS의 `__dirname` 전역 변수가 존재하지 않습니다.

기존 `electron/main.ts` 코드:
```typescript
mainWindow = new BrowserWindow({
    webPreferences: {
        preload: path.join(__dirname, 'preload.js'), // ❌ __dirname이 없음!
    },
});

const indexPath = path.join(__dirname, '../dist/index.html'); // ❌ __dirname이 없음!
```

### 해결 방법

ES 모듈 API를 사용하여 `__dirname` 구현:

```typescript
import { fileURLToPath } from 'url';
import * as path from 'path';

// ES 모듈에서 __dirname 구현
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

**작동 원리**:
1. `import.meta.url`: 현재 모듈의 파일 URL 반환 (예: `file:///C:/path/to/main.js`)
2. `fileURLToPath()`: 파일 URL을 OS별 경로로 변환 (예: `C:\path\to\main.js`)
3. `path.dirname()`: 파일 경로에서 디렉토리 경로 추출 (예: `C:\path\to`)

### 수정된 전체 코드

```typescript
import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ES 모듈에서 __dirname 구현
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV === 'development';
let mainWindow: BrowserWindow | null = null;

function createWindow() {
    console.log('Creating window...');
    console.log('__dirname:', __dirname);
    console.log('app.getAppPath():', app.getAppPath());

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        show: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // ✅ 정상 작동
            contextIsolation: true,
            nodeIntegration: false,
        },
        title: 'AI Flashcard',
        backgroundColor: '#ffffff',
    });

    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
    } else {
        const indexPath = path.join(__dirname, '../dist/index.html'); // ✅ 정상 작동
        mainWindow.loadFile(indexPath);
    }
}

app.whenReady().then(createWindow);
```

### 학습 내용
- **ES 모듈과 CommonJS는 다른 전역 변수를 제공합니다**
  - CommonJS: `__dirname`, `__filename`, `require`, `module.exports`
  - ES 모듈: `import.meta.url`, `import`, `export`
- **Electron에서 ES 모듈을 사용할 때는 항상 `__dirname`을 수동으로 구현해야 합니다**
- **에러가 숨겨질 수 있으므로 PowerShell/터미널에서 직접 실행하여 로그 확인이 중요합니다**

---

## 5. DevTools 자동 열림 문제

### 증상
빌드된 `.exe` 파일 실행 시 애플리케이션과 함께 F12 개발자 도구가 자동으로 열림

### 원인
프로덕션 빌드에서도 `openDevTools()` 호출이 포함되어 있었음:

```typescript
if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
} else {
    mainWindow.loadFile(indexPath).then(() => {
        console.log('File loaded successfully!');
        mainWindow?.webContents.openDevTools(); // ❌ 프로덕션에서 불필요
    });
}
```

### 해결 방법
프로덕션 경로에서 `openDevTools()` 호출 제거:

```typescript
if (isDev) {
    console.log('Loading dev server...');
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools(); // ✅ 개발 모드에서만
} else {
    const indexPath = path.join(__dirname, '../dist/index.html');
    console.log('Loading file:', indexPath);

    mainWindow.loadFile(indexPath).then(() => {
        console.log('File loaded successfully!');
        // ✅ 프로덕션에서는 DevTools 자동 열기 제거
    }).catch((err) => {
        console.error('Failed to load file:', err);
    });
}
```

### 참고
프로덕션 환경에서도 사용자가 원하면 DevTools를 열 수 있습니다:
- Windows/Linux: `Ctrl + Shift + I` 또는 `F12`
- macOS: `Cmd + Option + I`

---

## 6. 디버깅 기법

Electron 앱이 정상적으로 작동하지 않을 때 사용한 효과적인 디버깅 방법들입니다.

### 6.1 PowerShell/터미널에서 직접 실행

GUI로 실행하면 콘솔 로그를 볼 수 없습니다. 터미널에서 실행하면 모든 `console.log`와 에러가 출력됩니다.

**Windows (PowerShell)**:
```powershell
# release 폴더로 이동
cd release\win-unpacked

# 직접 실행 (콘솔 로그가 표시됨)
.\AI` Flashcard.exe

# 또는 절대 경로로
& "C:\works\ai-flashcard\release\win-unpacked\AI Flashcard.exe"
```

**macOS/Linux**:
```bash
cd release/mac/AI\ Flashcard.app/Contents/MacOS
./AI\ Flashcard

# 또는
cd release/linux-unpacked
./ai-flashcard
```

### 6.2 로그 파일로 저장

로그가 너무 길거나 나중에 분석하고 싶을 때:

```powershell
# Windows
.\AI` Flashcard.exe > log.txt 2>&1

# macOS/Linux
./ai-flashcard > log.txt 2>&1

# 로그 확인
cat log.txt
```

### 6.3 주요 로그 포인트 추가

`electron/main.ts`에 다음과 같은 로그를 추가하여 앱의 생명주기 추적:

```typescript
function createWindow() {
    console.log('Creating window...');
    console.log('__dirname:', __dirname);
    console.log('app.getAppPath():', app.getAppPath());

    // ... BrowserWindow 생성 ...

    console.log('Window created, loading content...');
    console.log('Loading file:', indexPath);
}

// 앱 생명주기 이벤트
app.on('ready', () => {
    console.log('App ready event fired');
});

app.whenReady().then(() => {
    console.log('App is ready, creating window...');
    createWindow();
});

// 로드 성공/실패 추적
mainWindow.webContents.on('did-finish-load', () => {
    console.log('Content loaded successfully!');
});

mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', { errorCode, errorDescription });
});
```

### 6.4 에러 페이지 표시

로드 실패 시 사용자에게 디버그 정보를 보여주는 에러 페이지:

```typescript
mainWindow.loadFile(indexPath).catch((err) => {
    console.error('Failed to load file:', err);

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
```

### 6.5 dist 및 dist-electron 폴더 확인

빌드 후 필요한 파일들이 제대로 생성되었는지 확인:

```powershell
# dist 폴더 확인 (React 앱)
dir dist
# 예상: index.html, assets/, data/ 등

# dist-electron 폴더 확인 (Electron 파일)
dir dist-electron
# 예상: main.js, preload.js

# release 폴더 확인 (최종 실행 파일)
dir release
# 예상: win-unpacked/, *.exe 등
```

### 6.6 ASAR 아카이브 내용 확인

프로덕션 빌드에서 파일이 제대로 패키징되었는지 확인:

```bash
# asar 도구 설치
npm install -g asar

# asar 내용 추출
asar extract release/win-unpacked/resources/app.asar extracted/

# 내용 확인
ls extracted/
ls extracted/dist/
ls extracted/dist-electron/
```

### 6.7 작업 관리자로 프로세스 확인

**Windows**:
1. `Ctrl + Shift + Esc`로 작업 관리자 열기
2. "AI Flashcard" 또는 "electron" 프로세스 확인
3. 프로세스가 있지만 GUI가 없다면 → 창 초기화 문제
4. 프로세스가 즉시 종료된다면 → 충돌/에러 발생

**macOS**:
```bash
ps aux | grep "AI Flashcard"
```

**Linux**:
```bash
ps aux | grep ai-flashcard
```

### 6.8 개발 모드에서 먼저 테스트

프로덕션 빌드 전에 개발 모드에서 확인:

```bash
# Vite dev server 실행
npm run dev

# 별도 터미널에서 Electron 실행
npx electron .
```

이렇게 하면:
- Vite의 HMR(Hot Module Replacement) 사용 가능
- 실시간 코드 수정 및 확인
- 빌드 시간 절약

---

## 요약: 트러블슈팅 체크리스트

Electron 앱이 작동하지 않을 때 다음 순서로 확인하세요:

- [ ] **패키지 버전**: npm 설치가 성공했는지 확인
- [ ] **빌드 성공**: `dist/` 및 `dist-electron/` 폴더가 생성되었는지 확인
- [ ] **터미널 실행**: PowerShell/터미널에서 직접 실행하여 로그 확인
- [ ] **에러 메시지**: `ReferenceError`, `TypeError` 등 JavaScript 에러 확인
- [ ] **ES 모듈**: `__dirname` 문제가 있는지 확인
- [ ] **파일 경로**: `index.html`, `preload.js` 등의 경로가 올바른지 확인
- [ ] **프로세스 확인**: 작업 관리자에서 프로세스 상태 확인
- [ ] **개발 모드 테스트**: 프로덕션 빌드 전에 개발 모드에서 확인

---

## 참고 자료

- [Electron 공식 문서](https://www.electronjs.org/docs)
- [ES Modules in Electron](https://www.electronjs.org/docs/latest/tutorial/esm)
- [electron-builder 문서](https://www.electron.build/)
- [Vite Electron 플러그인](https://github.com/electron-vite/vite-plugin-electron)

이 문서는 실제 트러블슈팅 과정에서 발생한 모든 문제와 해결 방법을 기록한 것입니다. 비슷한 문제가 발생하면 이 문서를 참고하세요. 🔧
