# Electron 데스크톱 앱 빌드 가이드

이 문서는 AI Flashcard를 Windows, macOS, Linux용 데스크톱 애플리케이션으로 빌드하는 방법을 설명합니다.

## 1. 사전 준비

### Electron 패키지 설치

로컬 환경에서 다음 명령어를 실행하세요:

```bash
npm install --save-dev electron electron-builder vite-plugin-electron vite-plugin-electron-renderer
```

## 2. 개발 모드 실행

Electron 앱을 개발 모드로 실행하려면:

```bash
npm run electron:dev
```

이 명령어는 Vite dev server를 실행하고, Electron 창이 자동으로 열립니다.

## 3. 프로덕션 빌드

### Windows용 실행 파일 (.exe)

```bash
npm run build:win
```

빌드 결과물:
- `release/AI Flashcard-1.0.0-x64.exe` (설치 파일)
- `release/AI Flashcard-1.0.0-x64.exe` (portable 버전)

### macOS용 애플리케이션 (.dmg)

```bash
npm run build:mac
```

빌드 결과물:
- `release/AI Flashcard-1.0.0.dmg`
- `release/AI Flashcard-1.0.0-mac.zip`

### Linux용 패키지 (.AppImage, .deb)

```bash
npm run build:linux
```

빌드 결과물:
- `release/AI Flashcard-1.0.0.AppImage`
- `release/ai-flashcard_1.0.0_amd64.deb`

### 모든 플랫폼 동시 빌드

```bash
npm run build:electron
```

⚠️ **주의**: 각 플랫폼 빌드는 해당 OS에서만 가능합니다.
- Windows 빌드: Windows에서
- macOS 빌드: macOS에서
- Linux 빌드: Linux에서

## 4. 프로젝트 구조

```
ai-flashcard/
├── electron/
│   ├── main.ts         # Electron 메인 프로세스
│   └── preload.ts      # 보안을 위한 preload 스크립트
├── src/                # React 앱 소스 코드
├── public/             # 정적 파일 (데이터셋 포함)
├── dist/               # 빌드된 웹 애플리케이션
├── dist-electron/      # 빌드된 Electron 파일
├── release/            # 최종 실행 파일
└── electron-builder.json # Electron 빌드 설정
```

## 5. 주요 변경 사항

Electron 통합을 위해 다음 사항들이 변경되었습니다:

### 1. Router 변경
- `BrowserRouter` → `HashRouter`
- URL 형식: `http://localhost:5173/#/` (개발)
- Electron `file://` 프로토콜과 호환

### 2. 경로 설정
- `vite.config.ts`에서 `base: './'` 설정
- 데이터셋 경로: `./data/dataset/index.json`

### 3. LocalStorage 사용
- Electron의 Chromium 엔진에서 완벽하게 작동
- 데이터는 사용자별 로컬 디렉토리에 저장

## 6. 아이콘 추가 (선택사항)

앱 아이콘을 추가하려면 다음 파일들을 준비하세요:

```
public/
├── icon.ico   # Windows용 (256x256)
├── icon.icns  # macOS용
└── icon.png   # Linux용 (512x512)
```

아이콘 파일이 없어도 빌드는 가능하지만, 기본 아이콘이 사용됩니다.

## 7. 배포

빌드된 파일을 사용자에게 배포하세요:

### Windows
- **설치 파일**: 사용자가 설치 마법사를 통해 설치
- **Portable**: 설치 없이 바로 실행 가능

### macOS
- **DMG 파일**: 드래그 앤 드롭으로 Applications 폴더에 설치

### Linux
- **AppImage**: 실행 권한 부여 후 바로 실행
- **DEB**: `sudo dpkg -i ai-flashcard_1.0.0_amd64.deb`

## 8. 문제 해결

### Electron 다운로드 오류
```bash
# 캐시 삭제 후 재시도
rm -rf node_modules
npm install
```

### 빌드 실패 시
```bash
# dist 폴더 정리
rm -rf dist dist-electron release
npm run build:win
```

### 개발 모드에서 창이 안 열릴 때
1. Vite dev server가 실행 중인지 확인
2. `http://localhost:5173` 접근 가능한지 확인
3. 포트가 다르면 `electron/main.ts`에서 포트 번호 수정

## 9. 고급 기능

### 자동 업데이트 추가
`electron-updater` 패키지를 사용하여 자동 업데이트 기능을 추가할 수 있습니다.

### 메뉴 커스터마이징
`electron/main.ts`에서 네이티브 메뉴를 추가할 수 있습니다.

### 파일 시스템 접근
`electron/preload.ts`에서 안전하게 Node.js API를 노출할 수 있습니다.

## 10. 참고 자료

- [Electron 공식 문서](https://www.electronjs.org/docs)
- [electron-builder 문서](https://www.electron.build/)
- [Vite Electron 플러그인](https://github.com/electron-vite/vite-plugin-electron)

---

## 빠른 시작

```bash
# 1. 패키지 설치
npm install

# 2. 개발 모드 실행
npm run electron:dev

# 3. Windows 실행 파일 빌드
npm run build:win
```

이제 `release/` 폴더에서 `.exe` 파일을 찾을 수 있습니다! 🎉
