# 트러블슈팅 히스토리

프로젝트 개발 중 발생한 주요 문제들과 해결 과정을 기록합니다.

---

## 1. Electron 개발 환경 분리 문제

### 발생 시점
2025-11-19

### 문제 상황
```bash
npm run dev
# → 웹 브라우저 + Electron 앱이 동시에 실행됨
# → 원하는 것: 웹만 실행
```

### 증상
- `vite-plugin-electron`이 설치되어 있으면 `npm run dev` 실행 시 **무조건** Electron 앱이 함께 실행됨
- 웹 개발 시에도 불필요한 Electron 프로세스가 실행되어 리소스 낭비
- 개발자 의도와 다른 동작

### 원인 분석

#### vite.config.ts 구조
```typescript
let electronPlugin: any = null;
try {
  const electronImport = await import('vite-plugin-electron/simple');
  electronPlugin = electronImport.default;  // ← 항상 로드됨
} catch {
  console.log('📦 vite-plugin-electron not installed.');
}

export default defineConfig({
  plugins: [
    react(),
    ...(electronPlugin ? [  // ← 플러그인이 있으면 무조건 활성화
      electronPlugin({
        main: { entry: 'electron/main.ts' },
      })
    ] : []),
  ],
});
```

**핵심 문제**: 플러그인 존재 여부만 체크하고, 사용자 의도(웹만 vs Electron 포함)를 구분하지 않음

### 해결 과정

#### 1단계: 조사 (업계 표준 방식 확인)
```
실무 프로젝트 분석 결과:
- 60-70%: concurrently + 별도 실행
- 20-25%: 환경 변수 제어
- 10-15%: 전용 도구 (electron-vite 등)
```

#### 2단계: concurrently 방식 채택
```bash
npm install -D concurrently wait-on cross-env
```

#### 3단계: 스크립트 분리
```json
{
  "dev": "vite",  // 웹만
  "electron:dev": "concurrently \"vite\" \"wait-on http://localhost:5173 && electron .\""  // 웹 + Electron
}
```

#### 4단계: vite.config.ts 간소화
```typescript
// vite-plugin-electron 완전 제거
export default defineConfig({
  plugins: [react()],  // React 플러그인만
  base: './',
});
```

### 결과
✅ `npm run dev`: 웹만 실행 (브라우저)
✅ `npm run electron:dev`: 웹 + Electron 함께 실행
✅ 명확한 의도 분리
✅ 웹 개발 성능 향상 (Electron 오버헤드 제거)

---

## 2. tsx로 Electron 실행 시 모듈 에러

### 발생 시점
2025-11-19

### 문제 상황
```bash
npm run electron:dev
# SyntaxError: The requested module 'electron' does not provide an export named 'BrowserWindow'
```

### 전체 에러 로그
```
C:\works\ai-flashcard\ai-flashcard\electron\main.ts:1
import { app, BrowserWindow } from 'electron';
              ^
SyntaxError: The requested module 'electron' does not provide an export named 'BrowserWindow'
    at ModuleJob._instantiate (node:internal/modules/esm/module_job:182:21)
    at async ModuleJob.run (node:internal/modules/esm/module_job:266:5)
```

### 원인 분석

#### tsx의 동작 방식
```typescript
// tsx는 TypeScript를 즉시 실행하는 도구
// 내부적으로 esbuild를 사용하지만, 간단한 설정만 적용

tsx electron/main.ts
// → TypeScript를 JavaScript로 변환
// → Node.js로 실행
```

#### Electron 네이티브 모듈의 특수성
```javascript
// Electron은 네이티브(C++) 바인딩을 가진 특수 모듈
// 일반 JavaScript 모듈과 다른 구조:

// 일반 모듈:
export const BrowserWindow = class { /* ... */ };

// Electron (네이티브):
// C++ → Node.js 바인딩 → 복잡한 export 구조
```

#### tsx가 실패한 이유
1. **네이티브 모듈 인식 실패**: tsx가 electron의 복잡한 export 구조를 제대로 파싱 못함
2. **ESM/CJS 혼용 문제**: Electron은 특수한 모듈 시스템 사용
3. **번들링 없음**: tsx는 번들링을 안 하고 파일별로 변환만 함

### 시도한 해결 방법들

#### ❌ 시도 1: tsx 옵션 추가
```bash
tsx --experimental-specifier-resolution=node electron/main.ts
# → 여전히 같은 에러
```

#### ❌ 시도 2: tsconfig 수정
```json
{
  "compilerOptions": {
    "module": "esnext",
    "moduleResolution": "bundler"
  }
}
# → tsx는 tsconfig 일부 옵션만 존중
```

#### ✅ 해결: esbuild로 전환

**왜 esbuild가 성공했는가?**

```bash
esbuild electron/main.ts \
  --bundle \              # 모든 import를 하나로 합침
  --platform=node \       # Node.js용 코드 생성
  --external:electron \   # ← 핵심! electron은 번들에서 제외
  --format=esm            # ESM 형식 출력
```

**핵심 차이점**:
```
tsx:
  electron/main.ts → JavaScript 변환 → electron import 시도 → ❌ 실패

esbuild:
  electron/main.ts → JavaScript 변환 + 번들링
  → electron은 external로 제외 → runtime에 로드 → ✅ 성공
```

### 최종 해결책

#### package.json
```json
{
  "electron:watch:main": "esbuild electron/main.ts --bundle --platform=node --outfile=dist-electron/main.js --external:electron --format=esm --watch",
  "electron:start": "wait-on dist-electron/main.js && electron ."
}
```

#### 동작 흐름
```
1. esbuild가 main.ts를 dist-electron/main.js로 변환
2. electron 모듈은 --external 옵션으로 번들에서 제외
3. dist-electron/main.js 생성 대기 (wait-on)
4. Electron이 dist-electron/main.js 실행
5. Electron runtime이 electron 모듈 제공 → 정상 작동
```

### 교훈
1. **네이티브 모듈은 번들링 필수**: tsx 같은 간단한 도구로는 부족
2. **`--external` 옵션 중요**: 런타임에서 제공되는 모듈은 번들에서 제외
3. **esbuild 선택이 업계 표준**: Electron 프로젝트 대부분이 esbuild 사용

---

## 3. ESM vs CommonJS 충돌

### 발생 시점
2025-11-19 (electron:watch 스크립트 작성 중)

### 문제 상황
```bash
# main.ts와 preload.ts를 함께 번들링 시도
esbuild electron/main.ts electron/preload.ts --format=esm

# → preload.ts에서 에러
# ReferenceError: require is not defined in ES module scope
```

### 원인

#### Electron의 프로세스 구조
```
Main Process (main.ts)
  ↓
  Creates BrowserWindow
  ↓
Preload Script (preload.ts) ← Renderer Process로 전환 전 실행
  ↓
Renderer Process (React 앱)
```

#### Preload Script의 특수성
```typescript
// electron/main.ts에서 설정
webPreferences: {
  preload: path.join(__dirname, 'preload.js'),
  contextIsolation: true,  // ← 보안을 위해 true (권장)
}
```

**`contextIsolation: true`일 때**:
- Preload 스크립트는 **CommonJS 형식만** 지원
- Renderer 프로세스와 Main 프로세스 사이의 안전한 다리 역할
- `contextBridge.exposeInMainWorld()` 사용

#### 왜 CommonJS만 지원하는가?

```javascript
// Electron 내부 동작
// 1. Preload를 sandbox 환경에서 실행
// 2. CommonJS require()는 동기적이고 제어 가능
// 3. ESM import는 비동기적이고 제어 어려움
// 4. 보안상 CommonJS 강제
```

### 해결책

#### 분리된 빌드 스크립트
```json
{
  "electron:watch:main": "esbuild electron/main.ts --bundle --platform=node --outfile=dist-electron/main.js --external:electron --format=esm --watch",
  "electron:watch:preload": "esbuild electron/preload.ts --bundle --platform=node --outfile=dist-electron/preload.js --external:electron --format=cjs --watch"
}
```

#### 차이점 정리
```typescript
// main.ts (ESM)
import { app, BrowserWindow } from 'electron';
import * as path from 'path';

export function createWindow() { /* ... */ }

// preload.ts (CommonJS)
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform
});

module.exports = { /* ... */ };
```

### 교훈
1. **Main과 Preload는 다른 형식**: Main=ESM, Preload=CJS
2. **보안 모범 사례**: `contextIsolation: true` 유지
3. **esbuild의 유연성**: `--format` 옵션으로 파일별 설정 가능

---

## 4. nodemon과 watch 타이밍 이슈

### 발생 시점
2025-11-19 (electron:dev 스크립트 통합 중)

### 문제 상황
```bash
npm run electron:dev
# Electron이 시작되려고 하는데 main.js가 아직 없음
# Error: Cannot find module 'dist-electron/main.js'
```

### 원인

#### concurrently의 병렬 실행
```bash
concurrently \
  "vite" \                    # 프로세스 1
  "npm run electron:watch" \  # 프로세스 2
  "npm run electron:start"    # 프로세스 3

# → 3개가 동시에 시작됨
# → electron:start가 너무 빨리 실행되면 main.js가 아직 없음
```

### 해결: wait-on으로 순서 보장

```json
{
  "electron:start": "wait-on dist-electron/main.js dist-electron/preload.js && wait-on http://localhost:5173 && electron ."
}
```

#### wait-on의 동작
```bash
wait-on dist-electron/main.js
# → 파일이 생성될 때까지 대기
# → 파일이 생기면 다음 명령 실행

wait-on http://localhost:5173
# → HTTP 서버가 응답할 때까지 대기
# → 200 OK 받으면 다음 명령 실행
```

#### 실행 순서
```
1. vite 시작                    (즉시)
2. electron:watch:main 시작     (즉시)
3. electron:watch:preload 시작  (즉시)
4. electron:start 대기...
   ↓
5. dist-electron/main.js 생성   (esbuild)
6. dist-electron/preload.js 생성 (esbuild)
7. wait-on 첫 번째 통과 ✓
   ↓
8. http://localhost:5173 응답 대기
9. vite 서버 준비 완료
10. wait-on 두 번째 통과 ✓
   ↓
11. electron . 실행 ✅
```

### 추가 개선: nodemon으로 자동 재시작

```json
{
  "electron:start": "wait-on dist-electron/main.js dist-electron/preload.js && wait-on http://localhost:5173 && nodemon --watch dist-electron --exec electron ."
}
```

#### nodemon의 역할
```
dist-electron/main.js 변경 감지
  ↓
Electron 프로세스 종료
  ↓
electron . 재실행
  ↓
새로운 코드로 앱 재시작
```

#### 개발 사이클
```
코드 수정 (electron/main.ts)
  ↓
esbuild 자동 재컴파일 (0.1초)
  ↓
nodemon이 변경 감지
  ↓
Electron 자동 재시작
  ↓
개발자는 Ctrl+S만 누르면 됨!
```

### 교훈
1. **비동기 프로세스는 순서 보장 필요**: wait-on 사용
2. **파일 변경 감지는 nodemon**: watch 폴더 정확히 지정
3. **concurrently의 `-k` 옵션**: 하나 종료되면 모두 종료

---

## 5. 예제 데이터 로딩 Electron 환경 문제

### 발생 시점
2025-11-19

### 문제 상황
```bash
# Electron 앱에서 "예제 데이터 생성하기" 클릭
# → "데이터셋 불러오기 실패" 에러
```

### 원인

#### fetch() API의 한계
```typescript
// FlashcardStorage.createInterviewTestData()
const indexResponse = await fetch('./data/dataset/index.json');
```

**웹 환경**:
```
localhost:5173/data/dataset/index.json
→ Vite가 public/ 폴더를 서빙
→ fetch 성공 ✅
```

**Electron 환경**:
```
file:///C:/app/dist/index.html
→ file:// 프로토콜
→ fetch('./data/dataset/index.json') 시도
→ 상대 경로 해석 실패 ❌
```

#### ASAR 패키징 문제
```
Electron 빌드 시:
  public/data/dataset/*.json
    ↓
  app.asar 아카이브에 압축
    ↓
  일반 fetch로 접근 불가
```

### 해결: Electron 환경에서 버튼 숨김

```typescript
// Settings.tsx
const isElectron = typeof window !== 'undefined' &&
  (window.navigator.userAgent.includes('Electron') ||
   (window.process && window.process.versions && window.process.versions.electron));

// 버튼 조건부 렌더링
{!isElectron && (
  <button onClick={handleCreateTestData}>
    예제 데이터 생성하기
  </button>
)}
```

### 대안적 해결 방법 (미적용)

#### 방법 1: 데이터를 코드에 임베딩
```typescript
// 빌드 시 자동 생성
import datasets from './datasets.generated.ts';

static createInterviewTestData() {
  datasets.forEach(data => this.addCardSet(data));
}
```

**장점**: 웹/Electron 모두 작동
**단점**: 번들 크기 증가 (810개 카드 ≈ 500KB)

#### 방법 2: Electron에서 fs 모듈 사용
```typescript
if (window.electron) {
  const fs = require('fs');
  const data = fs.readFileSync('data/dataset/index.json');
} else {
  const data = await fetch('./data/dataset/index.json');
}
```

**장점**: 각 환경에 최적화
**단점**: 복잡도 증가, 두 가지 로직 유지보수

#### 방법 3: Vite 빌드 시 JSON → TS 변환
```javascript
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    {
      name: 'json-to-ts',
      buildStart() {
        // public/data/dataset/*.json
        // → src/data/datasets.generated.ts
      }
    }
  ]
});
```

**장점**: 개발 중 JSON 유지, 빌드 시 번들링
**단점**: 초기 설정 필요

### 선택한 이유
- **사용자 경험**: 큰 차이 없음 (Electron에서는 JSON 파일로 직접 가져오기 가능)
- **단순성**: 버튼만 숨기는 것이 가장 간단
- **번들 크기**: 500KB 절약 (모바일 사용자 고려)

### 교훈
1. **환경별 기능 분기**: 웹과 Electron은 다름
2. **파일 접근 방식 차이**: fetch vs fs
3. **ASAR 제약 이해**: 패키징된 파일 접근 제한

---

## 6. Windows에서 Python 빌드 문제

### 발생 시점
초기 Electron 통합 중

### 문제 상황
```bash
npm run build:win
# python3 scripts/generate-dataset-index.py
# → Windows에서 python3 명령어 없음 (멈춤)
```

### 원인
```bash
# Linux/Mac
python3 --version  # ✅ 작동

# Windows
python3 --version  # ❌ 'python3'은(는) 내부 또는 외부 명령...
python --version   # ✅ 작동
```

### 해결: prebuild 스킵 옵션
```json
{
  "build:no-prebuild": "vite build",
  "build:win": "npm run build:no-prebuild && electron-builder --win"
}
```

### 교훈
1. **OS별 차이 고려**: 명령어도 다를 수 있음
2. **빌드 스크립트 유연성**: 스킵 옵션 제공
3. **CI/CD 환경 테스트**: GitHub Actions에서 검증

---

## 일반적인 디버깅 체크리스트

### Electron 앱이 안 뜨는 경우
```bash
# 1. main.js 존재 확인
ls dist-electron/main.js

# 2. package.json main 필드 확인
cat package.json | grep "main"

# 3. Electron 버전 확인
npm ls electron

# 4. 콘솔 로그 확인
electron . 2>&1 | tee debug.log

# 5. DevTools에서 에러 확인
# main.ts에서 mainWindow.webContents.openDevTools() 추가
```

### esbuild 에러 시
```bash
# 1. 문법 에러 체크
npx tsc --noEmit

# 2. 수동 빌드 테스트
npx esbuild electron/main.ts --bundle --platform=node --outfile=test.js

# 3. 의존성 확인
npm ls | grep electron

# 4. 캐시 삭제
rm -rf node_modules dist-electron
npm install
```

### ESLint 에러 시
```bash
# 1. 규칙 확인
npx eslint --print-config src/App.tsx

# 2. 특정 파일만 검사
npx eslint src/App.tsx

# 3. 자동 수정 시도
npx eslint src/App.tsx --fix

# 4. 캐시 삭제
rm -rf .eslintcache
```

---

## 학습한 내용 정리

### 1. Electron 프로젝트 구조
```
ai-flashcard/
├── electron/
│   ├── main.ts       (Main Process, ESM)
│   └── preload.ts    (Preload, CommonJS)
├── src/              (Renderer Process, React)
├── dist/             (React 앱 빌드 결과)
├── dist-electron/    (Electron 프로세스 빌드 결과)
└── release/          (최종 실행 파일)
```

### 2. 개발 환경 명령어
```bash
npm run dev              # 웹만
npm run electron:dev     # 웹 + Electron
npm run build            # 웹 빌드
npm run build:win        # Windows .exe
```

### 3. 핵심 도구들
- **esbuild**: TypeScript 번들러 (초고속)
- **concurrently**: 여러 명령어 동시 실행
- **wait-on**: 파일/서버 대기
- **nodemon**: 파일 변경 감지 재시작
- **ESLint**: 코드 품질 검사

### 4. 주요 개념
- **ESM vs CJS**: 모듈 시스템 차이
- **번들링**: 여러 파일을 하나로
- **외부 의존성**: `--external` 옵션
- **watch 모드**: 파일 변경 자동 재빌드
- **타입 체크 vs 트랜스파일**: tsc vs esbuild

---

이 문서는 프로젝트를 진행하며 겪은 실제 문제들을 기록합니다.
향후 비슷한 문제 발생 시 참고하세요! 🚀
