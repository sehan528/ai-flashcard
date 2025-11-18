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

### Windows에서 빌드가 중단되는 경우 ⚠️

**증상**: `npm run build:win` 실행 시 로그만 출력되고 exe 파일이 생성되지 않음

```powershell
PS C:\works\ai-flashcard> npm run build:win
> ai-flashcard@1.0.0 prebuild
> npm run generate:index
> python3 scripts/generate-dataset-index.py
# 여기서 멈춤...
```

**원인**: Windows에서 `python3` 명령어를 찾을 수 없어서 prebuild가 실패

**해결 방법**:

#### 방법 1: Python 설치 확인 (권장)
```powershell
# Python이 설치되어 있는지 확인
python --version
# 또는
py --version

# Python이 없다면 Microsoft Store에서 Python 설치
# 또는 https://www.python.org/downloads/ 에서 설치
```

Python 설치 후 다시 시도:
```powershell
npm run build:win
```

#### 방법 2: 데이터셋 인덱스 미리 생성
```powershell
# Python으로 index.json 생성 (한 번만 실행)
python scripts/generate-dataset-index.py

# 또는 py 명령어 사용
py scripts/generate-dataset-index.py

# 이제 빌드 실행 (prebuild 스킵)
npm run build:no-prebuild
electron-builder --win
```

#### 방법 3: 수동으로 index.json 확인
`public/data/dataset/index.json` 파일이 이미 있다면:
```powershell
# prebuild 없이 바로 빌드
npm run build:no-prebuild
electron-builder --win
```

### electron-builder가 실행되지 않는 경우

**증상**: Vite 빌드는 성공했지만 electron-builder가 실행되지 않음

**체크리스트**:

1. **Electron 패키지 설치 확인**
```powershell
# devDependencies에 electron, electron-builder가 있는지 확인
npm list electron electron-builder

# 없다면 설치
npm install --save-dev electron electron-builder vite-plugin-electron vite-plugin-electron-renderer
```

2. **dist 폴더 확인**
```powershell
# dist 폴더가 생성되었는지 확인
dir dist

# dist 폴더가 없거나 비어있다면
npm run build:no-prebuild
```

3. **dist-electron 폴더 확인**
```powershell
# dist-electron 폴더에 main.js가 있는지 확인
dir dist-electron

# 없다면 Vite Electron 플러그인 재설치
npm install --save-dev vite-plugin-electron
npm run build:no-prebuild
```

4. **수동으로 electron-builder 실행**
```powershell
# 빌드가 완료되었다면 직접 실행
npx electron-builder --win
```

### 빌드는 성공했는데 exe를 찾을 수 없는 경우

**확인할 위치**:
```powershell
# release 폴더 확인
dir release

# release 폴더가 없다면 electron-builder가 실행되지 않은 것
```

**예상 결과물 위치**:
```
release/
├── AI Flashcard Setup 1.0.0.exe      # 설치 파일
├── AI Flashcard 1.0.0.exe            # Portable 버전
├── win-unpacked/                      # 압축 해제된 파일들
└── builder-debug.yml                  # 디버그 정보
```

### PowerShell 실행 정책 오류

**증상**: `이 시스템에서 스크립트를 실행할 수 없으므로...`

**해결 방법**:
```powershell
# 현재 세션에서만 실행 정책 변경
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# 이후 빌드 명령어 실행
npm run build:win
```

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
