# esbuild & ESLint 가이드

## 목차
1. [esbuild 기초](#esbuild-기초)
2. [ESLint 기초](#eslint-기초)
3. [Electron 프로젝트에서의 사용](#electron-프로젝트에서의-사용)
4. [트러블슈팅](#트러블슈팅)
5. [실무 팁](#실무-팁)

---

## esbuild 기초

### esbuild란?

**esbuild**는 Go 언어로 작성된 초고속 JavaScript/TypeScript 번들러입니다.

#### 주요 특징
- ⚡ **매우 빠름**: Webpack이나 Rollup보다 10-100배 빠름
- 📦 **번들링**: 여러 파일을 하나로 합침
- 🔄 **트랜스파일**: TypeScript → JavaScript 변환
- 🗜️ **미니파이**: 코드 압축

#### 왜 빠른가?
```
Webpack/Rollup: JavaScript로 작성 (인터프리터 언어)
esbuild:        Go로 작성 (컴파일 언어) + 병렬 처리
```

### esbuild vs 다른 도구들

| 도구 | 용도 | 속도 | 사용 케이스 |
|------|------|------|-------------|
| **esbuild** | 번들링 + 트랜스파일 | 🚀 매우 빠름 | 개발 환경, 빠른 빌드 |
| **tsx** | TypeScript 실행 | ⚡ 빠름 | 간단한 스크립트 실행 |
| **tsc** | TypeScript 컴파일 | 🐢 느림 | 타입 체크 |
| **Webpack** | 번들링 (고급) | 🐌 매우 느림 | 복잡한 설정 필요 시 |
| **Vite** | 개발 서버 + 번들링 | ⚡ 빠름 (esbuild 사용) | 웹 앱 개발 |

### esbuild 기본 사용법

#### 1. 설치
```bash
npm install -D esbuild
```

#### 2. 간단한 빌드
```bash
# TypeScript → JavaScript 변환
esbuild src/index.ts --outfile=dist/index.js

# 번들링 (모든 import를 하나로)
esbuild src/index.ts --bundle --outfile=dist/bundle.js

# 미니파이 (압축)
esbuild src/index.ts --bundle --minify --outfile=dist/bundle.min.js
```

#### 3. Watch 모드 (파일 변경 감지)
```bash
esbuild src/index.ts --bundle --outfile=dist/bundle.js --watch
```

### esbuild 주요 옵션

```bash
esbuild input.ts \
  --bundle                    # 모든 의존성 포함
  --platform=node             # Node.js용 (기본값: browser)
  --outfile=output.js         # 출력 파일
  --format=esm                # ESM 모듈 (cjs, iife도 가능)
  --external:electron         # electron 패키지는 번들에서 제외
  --watch                     # 파일 변경 감지
  --minify                    # 압축
  --sourcemap                 # 소스맵 생성
  --target=es2020             # 타겟 JavaScript 버전
```

### 모듈 형식 (format)

#### ESM (ES Modules)
```javascript
// 최신 표준, import/export 문법
import { app } from 'electron';
export const foo = 'bar';
```

#### CommonJS (CJS)
```javascript
// 구식이지만 여전히 널리 사용
const { app } = require('electron');
module.exports = { foo: 'bar' };
```

#### IIFE (Immediately Invoked Function Expression)
```javascript
// 브라우저용, 전역 스코프 오염 방지
(function() { /* 코드 */ })();
```

---

## ESLint 기초

### ESLint란?

**ESLint**는 JavaScript/TypeScript 코드의 **정적 분석 도구**입니다.

#### 주요 기능
1. ❌ **에러 감지**: 버그가 될 수 있는 코드 찾기
2. 📏 **코드 스타일 검사**: 일관된 코드 스타일 유지
3. 🔧 **자동 수정**: 일부 문제는 자동으로 고침
4. 🎨 **커스터마이징**: 팀의 규칙 설정 가능

### ESLint 작동 원리

```
1. 코드 파싱    : 코드를 AST(추상 구문 트리)로 변환
2. 규칙 적용    : 설정된 규칙들을 AST에 적용
3. 문제 보고    : 위반 사항 출력
4. 자동 수정    : --fix 옵션으로 수정 가능한 것들 수정
```

### 프로젝트의 ESLint 설정

#### `eslint.config.js` (현재 프로젝트)
```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'dist-electron'] },  // 빌드 폴더 무시
  {
    extends: [
      js.configs.recommended,              // JavaScript 추천 규칙
      ...tseslint.configs.recommended     // TypeScript 추천 규칙
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,           // React Hooks 규칙
      'react-refresh': reactRefresh,       // React Refresh 규칙
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)
```

### 주요 ESLint 명령어

```bash
# 코드 검사
npm run lint

# 자동 수정
npm run lint -- --fix

# 특정 파일만 검사
npx eslint src/App.tsx

# 특정 디렉토리 검사
npx eslint src/
```

### 일반적인 ESLint 에러

#### 1. `'React' is not defined`
```typescript
// ❌ 에러
function App() {
  return <div>Hello</div>;
}

// ✅ 해결 (React 17+에서는 필요 없지만 ESLint가 모를 수 있음)
import React from 'react';
function App() {
  return <div>Hello</div>;
}
```

#### 2. `'variable' is assigned a value but never used`
```typescript
// ❌ 에러
const unusedVar = 42;

// ✅ 해결 1: 사용하기
console.log(unusedVar);

// ✅ 해결 2: 접두사 _ 사용 (의도적으로 안 쓸 때)
const _unusedVar = 42;

// ✅ 해결 3: 해당 줄만 무시
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const unusedVar = 42;
```

#### 3. `Missing return type on function`
```typescript
// ❌ 경고
function add(a: number, b: number) {
  return a + b;
}

// ✅ 해결
function add(a: number, b: number): number {
  return a + b;
}
```

---

## Electron 프로젝트에서의 사용

### 왜 esbuild를 사용하는가?

#### Electron의 특수성
```
Electron = Chromium (브라우저) + Node.js

Main Process    : Node.js 환경 (파일 시스템, OS 접근)
Renderer Process: Chromium 환경 (웹 페이지)
Preload Script  : 중간 다리 (보안 샌드박스)
```

#### esbuild가 필요한 이유

1. **TypeScript 실행 문제**
   ```bash
   # ❌ 직접 실행 불가
   electron electron/main.ts

   # ✅ JavaScript로 변환 필요
   esbuild electron/main.ts --outfile=dist-electron/main.js
   electron dist-electron/main.js
   ```

2. **네이티브 모듈 호환성**
   ```typescript
   // tsx로 실행 시 에러 발생
   import { app, BrowserWindow } from 'electron';
   // SyntaxError: 'electron' does not provide export 'BrowserWindow'

   // esbuild로 번들링 + --external:electron 옵션 사용
   // → 정상 작동
   ```

3. **빠른 개발 사이클**
   ```
   코드 수정 → esbuild (0.1초) → Electron 재시작
   vs
   코드 수정 → tsc (3초) → Electron 재시작
   ```

### 프로젝트의 esbuild 설정 분석

#### 개발 환경 (`npm run electron:dev`)

```json
{
  "electron:watch:main": "esbuild electron/main.ts --bundle --platform=node --outfile=dist-electron/main.js --external:electron --format=esm --watch",
  "electron:watch:preload": "esbuild electron/preload.ts --bundle --platform=node --outfile=dist-electron/preload.js --external:electron --format=cjs --watch",
  "electron:start": "wait-on dist-electron/main.js dist-electron/preload.js && wait-on http://localhost:5173 && cross-env NODE_ENV=development nodemon --watch dist-electron --exec electron .",
  "electron:dev": "concurrently -k \"vite\" \"npm run electron:watch:main\" \"npm run electron:watch:preload\" \"npm run electron:start\""
}
```

**실행 흐름**:
```
1. vite 시작                → React 앱 서빙 (localhost:5173)
2. electron:watch:main      → main.ts 감시 및 빌드
3. electron:watch:preload   → preload.ts 감시 및 빌드
4. electron:start           → 파일 준비 대기 → Electron 실행
```

#### 왜 main과 preload를 분리했는가?

```typescript
// main.ts: ESM 형식 (최신 Node.js)
import { app, BrowserWindow } from 'electron';
export function createWindow() { /* ... */ }

// preload.ts: CJS 형식 (Electron의 요구사항)
const { contextBridge } = require('electron');
module.exports = { /* ... */ }
```

**이유**: Electron의 preload 스크립트는 `contextIsolation: true`일 때 **CommonJS만** 지원

#### 프로덕션 빌드 (`npm run build:win`)

```json
{
  "build:electron:main": "esbuild electron/main.ts --bundle --platform=node --outfile=dist-electron/main.js --external:electron --format=esm",
  "build:electron:preload": "esbuild electron/preload.ts --bundle --platform=node --outfile=dist-electron/preload.js --external:electron --format=cjs",
  "build:win": "npm run build:no-prebuild && npm run build:electron:main && npm run build:electron:preload && electron-builder --win"
}
```

**빌드 순서**:
```
1. vite build                     → React 앱 번들링 (dist/)
2. build:electron:main            → main.ts 번들링 (dist-electron/)
3. build:electron:preload         → preload.ts 번들링 (dist-electron/)
4. electron-builder --win         → .exe 파일 생성
```

---

## 트러블슈팅

### 1. tsx vs esbuild 에러

#### 증상
```bash
npm run electron:dev
# SyntaxError: The requested module 'electron' does not provide an export named 'BrowserWindow'
```

#### 원인
```typescript
// tsx는 TypeScript 실행기이지만,
// Electron 같은 네이티브 모듈을 제대로 처리 못함

import { app, BrowserWindow } from 'electron';
// → tsx가 electron 모듈의 구조를 잘못 이해
```

#### 해결
```bash
# ❌ 이전 (tsx 사용)
"electron:dev": "tsx electron/main.ts"

# ✅ 수정 (esbuild 사용)
"electron:watch:main": "esbuild electron/main.ts --bundle --platform=node --outfile=dist-electron/main.js --external:electron --format=esm --watch"
```

**핵심**: `--external:electron` 옵션으로 electron 모듈을 번들에서 제외

---

### 2. ESM vs CommonJS 에러

#### 증상
```bash
ReferenceError: require is not defined in ES module scope
# 또는
SyntaxError: Cannot use import statement outside a module
```

#### 원인
```javascript
// package.json에 "type": "module"이 있으면 ESM
{
  "type": "module"  // 모든 .js 파일이 ESM으로 취급
}

// ESM 파일에서 require() 사용 불가
const fs = require('fs');  // ❌ 에러
```

#### 해결 방법

**방법 1: import로 변경**
```javascript
// ❌ CommonJS
const fs = require('fs');

// ✅ ESM
import fs from 'fs';
```

**방법 2: .cjs 확장자 사용**
```javascript
// script.cjs (CommonJS 강제)
const fs = require('fs');
module.exports = { /* ... */ };
```

**방법 3: esbuild format 옵션**
```bash
# ESM 출력
esbuild input.ts --format=esm

# CommonJS 출력
esbuild input.ts --format=cjs
```

---

### 3. Watch 모드 작동 안 함

#### 증상
```bash
npm run electron:dev
# 파일 수정해도 Electron이 재시작 안 됨
```

#### 원인 1: nodemon이 파일 변경을 감지 못함
```json
// ❌ watch 경로가 잘못됨
"electron:start": "nodemon --watch src --exec electron ."
```

#### 해결
```json
// ✅ 올바른 경로
"electron:start": "nodemon --watch dist-electron --exec electron ."
```

#### 원인 2: esbuild가 watch 모드가 아님
```bash
# ❌ watch 없음
esbuild electron/main.ts --outfile=dist-electron/main.js

# ✅ watch 추가
esbuild electron/main.ts --outfile=dist-electron/main.js --watch
```

---

### 4. Electron 빌드 후 실행 안 됨

#### 증상
```bash
npm run build:win
# .exe 생성 성공
# 실행 시 창이 안 뜨거나 즉시 종료
```

#### 원인: main.js 경로 문제
```json
// package.json
{
  "main": "dist-electron/main.js"  // ← 이 경로가 정확해야 함
}
```

#### 체크리스트
```bash
# 1. dist-electron/main.js가 존재하는가?
ls dist-electron/

# 2. main.js에서 index.html을 제대로 로드하는가?
cat dist-electron/main.js | grep loadFile

# 3. dist/index.html이 존재하는가?
ls dist/

# 4. electron-builder.json 설정이 맞는가?
cat electron-builder.json
```

---

### 5. ESLint 에러 무시하기

#### 특정 줄 무시
```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = fetchData();
```

#### 특정 블록 무시
```typescript
/* eslint-disable @typescript-eslint/no-unused-vars */
const a = 1;
const b = 2;
/* eslint-enable @typescript-eslint/no-unused-vars */
```

#### 파일 전체 무시
```typescript
/* eslint-disable */
// 전체 파일 검사 안 함
```

#### .eslintignore 사용
```
# .eslintignore
dist/
dist-electron/
node_modules/
*.config.js
```

---

### 6. TypeScript 타입 에러

#### 증상
```typescript
// esbuild는 성공하지만 에디터에서 빨간 줄
import { app } from 'electron';
// Cannot find module 'electron' or its corresponding type declarations.
```

#### 원인
```bash
# @types/electron 패키지가 없음
```

#### 해결
```bash
npm install -D @types/electron
```

---

### 7. 빌드는 되는데 타입 체크 안 됨

#### 문제
```typescript
// esbuild는 타입 체크를 안 함!
const num: number = "string";  // esbuild는 통과시킴
```

#### 해결: tsc로 타입 체크 추가
```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "build": "npm run typecheck && vite build"
  }
}
```

**tsconfig.json**:
```json
{
  "compilerOptions": {
    "noEmit": true,        // JavaScript 출력 안 함 (타입 체크만)
    "skipLibCheck": true   // node_modules 타입 체크 스킵 (빠름)
  }
}
```

---

## 실무 팁

### 1. 개발 속도 최적화

#### esbuild 캐싱 활용
```bash
# 초기 빌드 후 증분 빌드는 매우 빠름
esbuild src/index.ts --bundle --watch
# → 파일 수정 시 0.1초 이내 재빌드
```

#### nodemon 대신 chokidar (더 빠름)
```bash
npm install -D chokidar-cli

# package.json
{
  "electron:start": "chokidar 'dist-electron/**' -c 'electron .'"
}
```

---

### 2. 디버깅 팁

#### Source Map 활성화
```bash
esbuild electron/main.ts \
  --bundle \
  --outfile=dist-electron/main.js \
  --sourcemap  # ← 원본 코드 위치 표시
```

#### Electron DevTools에서 원본 코드 보기
```typescript
// main.ts
if (isDev) {
  mainWindow.webContents.openDevTools();
}
```

#### console.log 대신 디버거 사용
```typescript
// main.ts
debugger;  // ← 브레이크포인트

// 실행:
electron --inspect-brk .
# Chrome에서 chrome://inspect 접속
```

---

### 3. 빌드 크기 최적화

#### Tree Shaking (사용 안 하는 코드 제거)
```bash
esbuild src/index.ts \
  --bundle \
  --minify \
  --tree-shaking=true  # 기본값이지만 명시
```

#### 외부 의존성 제외
```bash
esbuild electron/main.ts \
  --bundle \
  --external:electron \      # Electron
  --external:electron-store  # 네이티브 모듈들
```

#### 번들 분석
```bash
esbuild src/index.ts \
  --bundle \
  --metafile=meta.json

# 분석
npx esbuild-visualizer --metadata meta.json
```

---

### 4. 팀 협업 시 ESLint 활용

#### Pre-commit Hook 설정
```bash
npm install -D husky lint-staged

# package.json
{
  "lint-staged": {
    "*.{ts,tsx}": "eslint --fix"
  }
}

# .husky/pre-commit
npm run lint
```

#### CI/CD에서 ESLint 실행
```yaml
# .github/workflows/ci.yml
- name: Lint
  run: npm run lint

- name: Type Check
  run: npm run typecheck
```

---

### 5. esbuild 플러그인 활용

#### 환경 변수 주입
```javascript
// build.js
import esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/bundle.js',
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.env.API_URL': '"https://api.example.com"'
  }
});
```

#### SVG를 React 컴포넌트로
```bash
npm install -D esbuild-plugin-svgr

# build.js
import svgr from 'esbuild-plugin-svgr';

esbuild.build({
  plugins: [svgr()],
  // ...
});
```

---

### 6. 성능 모니터링

#### esbuild 빌드 시간 측정
```bash
time esbuild src/index.ts --bundle --outfile=dist/bundle.js

# 출력:
# real    0m0.123s
# user    0m0.456s
# sys     0m0.078s
```

#### Vite 빌드 시간 비교
```bash
time npm run build

# esbuild 사용 전: ~30초
# esbuild 사용 후: ~3초
```

---

### 7. 실전 예제: 조건부 컴파일

#### 개발/프로덕션 코드 분리
```typescript
// src/config.ts
const isDev = process.env.NODE_ENV === 'development';

export const API_URL = isDev
  ? 'http://localhost:3000'
  : 'https://api.production.com';

if (isDev) {
  console.log('🚀 Development mode');
}
```

#### esbuild로 빌드
```bash
# 개발 빌드
esbuild src/index.ts --bundle --define:process.env.NODE_ENV=\"development\"

# 프로덕션 빌드 (console.log 제거됨)
esbuild src/index.ts --bundle --define:process.env.NODE_ENV=\"production\" --minify
```

---

## 참고 자료

### esbuild
- 공식 문서: https://esbuild.github.io/
- GitHub: https://github.com/evanw/esbuild
- API 레퍼런스: https://esbuild.github.io/api/

### ESLint
- 공식 문서: https://eslint.org/docs/latest/
- TypeScript ESLint: https://typescript-eslint.io/
- 규칙 검색: https://eslint.org/docs/latest/rules/

### Electron
- 공식 문서: https://www.electronjs.org/docs/latest/
- 보안 가이드: https://www.electronjs.org/docs/latest/tutorial/security
- 프로세스 모델: https://www.electronjs.org/docs/latest/tutorial/process-model

---

## 요약

### esbuild 핵심 개념
✅ 초고속 번들러 (Go로 작성)
✅ TypeScript → JavaScript 변환
✅ `--bundle`: 의존성 포함
✅ `--external:모듈`: 특정 모듈 제외
✅ `--format`: esm / cjs / iife
✅ `--watch`: 파일 변경 감지

### ESLint 핵심 개념
✅ 정적 분석 도구 (버그 예방)
✅ 코드 스타일 통일
✅ `--fix`: 자동 수정
✅ 규칙 커스터마이징 가능
✅ 에디터 통합 (실시간 피드백)

### 프로젝트 명령어
```bash
npm run dev              # 웹만 개발
npm run electron:dev     # 웹 + Electron 개발
npm run build:win        # Windows 빌드
npm run lint             # ESLint 검사
npm run lint -- --fix    # ESLint 자동 수정
```

---

**문제 발생 시 체크리스트**:
1. ☑️ dist-electron/ 폴더에 main.js와 preload.js가 있는가?
2. ☑️ package.json의 "main" 필드가 "dist-electron/main.js"인가?
3. ☑️ esbuild에 `--external:electron` 옵션이 있는가?
4. ☑️ main.ts는 ESM, preload.ts는 CJS 형식인가?
5. ☑️ nodemon이 dist-electron/ 폴더를 감시하는가?
6. ☑️ ESLint가 dist/ 폴더를 무시하는가?

이 가이드로 대부분의 문제를 해결할 수 있습니다! 🚀
