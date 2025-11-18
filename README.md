# AI Flashcard

AI 기반 답변 평가 기능을 갖춘 스마트 플래시카드 학습 애플리케이션입니다.

## 프로젝트 소개

**AI Flashcard**는 React를 활용한 학습 도구로, 사용자가 직접 플래시카드를 만들고 학습할 수 있습니다. 서술형 문제의 경우 AI가 자동으로 답변을 평가하고 피드백을 제공합니다.

이 프로젝트는 **React 사용에 익숙해지기 위한 학습 목적**으로 개발되었으며, LocalStorage 기반의 간단한 데이터 관리와 Vercel Serverless Functions를 활용한 AI 평가 기능을 포함합니다.

## 주요 기능

### 📚 카드셋 관리
- 카드셋 생성, 수정, 삭제, 복제
- 카드셋별 설명 및 메타데이터 관리
- 컨텍스트 메뉴를 통한 빠른 액션
- 학습 통계 자동 추적

### 📝 플래시카드 작성
- **서술형 카드**: 자유롭게 답변을 작성하는 문제
- **객관식 카드**: 2~10개의 선택지 중 정답 선택
- 마크다운 형식 답변 지원 (코드 블록 문법 강조 포함)
- 태그 기반 분류
- 카드별 학습 횟수 추적

### 🎓 학습 모드
- **순차 학습**: 카드를 순서대로 학습
- **셔플 학습**: 카드를 무작위로 섞어서 학습 (Toast 피드백)
- 진행률 표시 및 이전/다음 네비게이션
- **키보드 단축키 지원**: 마우스 없이 빠른 학습 가능
  - `←` `→`: 이전/다음 카드 이동
  - `Enter`: 정답 보기 (서술형) / 정답 확인 (객관식)
  - `1-0`: 객관식 선택지 선택 (1-10번)
- AI 기반 서술형 답변 자동 평가 (0-100점)
- 구체적인 피드백 및 개선점 제안
- 반응형 디자인 (모바일 최적화)

### 📊 학습 통계
- **히트맵 (Heatmap)**: 일별 학습 활동을 색상 강도로 시각화
- **연속 학습일 (Streak)**: 연속으로 학습한 일수 추적
- **일별/주별/월별 View**: 다양한 시간대별 통계 조회
- **학습 기록**: 카드셋별, 날짜별 상세 학습 이력
- **통계 요약**: 총 학습 시간, 카드 수, 세션 수 등

### 💾 데이터 관리

#### 학습 데이터 (카드셋)
- **예제 데이터 생성**: 13개의 프로그래밍 관련 카드셋 (DB, DS, Elasticsearch, JavaScript, Kafka, Network, OS, PL, React, Redis, Spring, WebSocket 등) 총 830+ 카드
- **선택적 Export**: 원하는 카드셋만 선택하여 개별 JSON 파일로 내보내기
- **다중 Import**: 여러 JSON 파일을 한 번에 가져오기 (병합 모드)
- **데이터 검증**: 잘못된 형식의 파일 자동 감지 및 명확한 오류 메시지

#### 유저 데이터 (학습 기록)
- **학습 기록 Export**: 통계 및 학습 이력을 JSON 파일로 백업
- **학습 기록 Import**: 다른 기기에서 학습 기록 가져오기
- **학습 기록 삭제**: 통계만 초기화 (카드셋은 유지)
- **분리된 관리**: 학습 데이터와 유저 데이터 독립적 관리

#### 데이터 보호
- 자동 타입 감지로 잘못된 섹션에 데이터 업로드 방지
- 명확한 피드백 (Toast 알림)
- 삭제 전 확인 절차

### 🖥️ 멀티 플랫폼 지원
- **웹 애플리케이션**: 브라우저에서 바로 실행
- **Electron 데스크톱 앱**: Windows, macOS, Linux 실행 파일 빌드
  - 독립 실행형 .exe, .dmg, .AppImage 파일
  - 오프라인 사용 가능
  - 웹과 동일한 UI/UX

## 기술 스택

### Frontend
- **React 19.1.0** - UI 라이브러리
- **TypeScript 5.8.3** - 타입 안정성
- **Vite 7.0.0** - 빌드 도구 (HMR 지원)
- **React Router DOM 7.6.3** - 라우팅
- **Tailwind CSS 3.4.17** - 유틸리티 기반 스타일링
- **React Markdown** - 마크다운 렌더링 (코드 문법 강조 지원)

### Desktop
- **Electron 33.2.0** - 크로스 플랫폼 데스크톱 앱 프레임워크
- **electron-builder 25.1.8** - 설치 파일 빌드

### Backend
- **Vercel Serverless Functions** - API 엔드포인트
- **Hugging Face API** - DialoGPT-medium 모델 (AI 평가)

### Data Storage
- **LocalStorage** - 브라우저/Electron 로컬 저장소

### Development Tools
- **ESLint 9.29.0** - 코드 품질 검사
- **PostCSS & Autoprefixer** - CSS 처리

## 시작하기

### 웹 애플리케이션

#### 설치
```bash
# 저장소 클론
git clone https://github.com/sehan528/ai-flashcard.git
cd ai-flashcard

# 의존성 패키지 설치
npm install
```

#### 개발 서버 실행
```bash
npm run dev
```

개발 서버가 시작되면 브라우저에서 `http://localhost:5173`으로 접속할 수 있습니다.

#### 빌드
```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

#### 프리뷰
```bash
npm run preview
```

빌드된 애플리케이션을 로컬에서 미리 볼 수 있습니다.

### Electron 데스크톱 앱

#### Electron 의존성 설치
```bash
npm install --save-dev electron electron-builder vite-plugin-electron vite-plugin-electron-renderer
```

#### 개발 모드
```bash
# Vite dev server 실행 (터미널 1)
npm run dev

# Electron 실행 (터미널 2)
npx electron .
```

#### 빌드

**Windows**:
```bash
npm run build:win
```
생성 파일: `release/AI Flashcard Setup 1.0.0.exe`, `release/AI Flashcard 1.0.0.exe` (Portable)

**macOS**:
```bash
npm run build:mac
```
생성 파일: `release/AI Flashcard-1.0.0.dmg`

**Linux**:
```bash
npm run build:linux
```
생성 파일: `release/ai-flashcard_1.0.0_amd64.deb`, `release/AI Flashcard-1.0.0.AppImage`

**모든 플랫폼**:
```bash
npm run build:electron
```

자세한 Electron 설정 및 트러블슈팅은 다음 문서를 참조하세요:
- [Electron 설정 가이드](docs/ELECTRON_SETUP.md)
- [Electron 트러블슈팅](docs/ELECTRON_TROUBLESHOOTING.md)

## 프로젝트 구조

```
ai-flashcard/
├── api/                          # Vercel Serverless Functions
│   └── ai-evaluate.ts           # AI 답변 평가 API
├── docs/                         # 문서
│   ├── ELECTRON_SETUP.md        # Electron 설정 가이드
│   ├── ELECTRON_TROUBLESHOOTING.md  # Electron 트러블슈팅
│   └── UI_UX_DESIGN.md          # UI/UX 디자인 가이드
├── electron/                     # Electron 관련 파일
│   ├── main.ts                  # Electron 메인 프로세스
│   └── preload.ts               # Preload 스크립트
├── public/                       # 정적 파일
│   └── data/dataset/            # 예제 데이터셋
├── src/
│   ├── assets/                   # 이미지, 아이콘 등 리소스
│   ├── components/
│   │   ├── Layout/
│   │   │   └── Header.tsx       # 앱 헤더 (탭 네비게이션)
│   │   ├── UI/
│   │   │   ├── ContextMenu.tsx  # 컨텍스트 메뉴
│   │   │   └── RandomToggle.tsx # 셔플 토글 버튼
│   │   └── AppRouter.tsx        # 탭 기반 라우팅
│   ├── domains/
│   │   └── flashcard/           # 플래시카드 도메인
│   │       ├── components/
│   │       │   ├── CardSet/     # 카드셋 관련 컴포넌트
│   │       │   ├── FlashCard/   # 플래시카드 편집 컴포넌트
│   │       │   └── Study/       # 학습 모드 컴포넌트
│   │       ├── dtos/
│   │       │   └── FlashCard.ts # 타입 정의
│   │       ├── hooks/
│   │       │   ├── useAIEvaluation.ts  # AI 평가 훅
│   │       │   └── useStudySession.ts  # 학습 세션 관리
│   │       └── utils/
│   │           └── storage.ts   # LocalStorage 데이터 관리
│   ├── hooks/
│   │   ├── useAppState.tsx      # 앱 전역 상태 관리
│   │   └── useStudyActions.tsx  # 학습 관련 액션
│   ├── pages/
│   │   ├── Home.tsx             # 홈 (카드셋 목록)
│   │   ├── CardEdit.tsx         # 카드 편집
│   │   ├── StudyMode.tsx        # 학습 모드
│   │   ├── Statistics.tsx       # 학습 통계
│   │   ├── Settings.tsx         # 설정 (데이터 관리)
│   │   └── Error404.tsx         # 404 페이지
│   ├── App.tsx                  # 최상위 라우터
│   ├── MainApp.tsx              # 메인 앱 컨테이너
│   ├── main.tsx                 # 엔트리 포인트
│   └── index.css                # 전역 스타일 (애니메이션 포함)
├── electron-builder.json         # Electron 빌드 설정
├── package.json
├── tsconfig.json
├── vite.config.ts               # Vite 설정 (Electron 플러그인)
├── tailwind.config.js
└── vercel.json                  # Vercel 배포 설정
```

## 사용 방법

### 1. 카드셋 만들기
1. **카드 편집** 탭으로 이동
2. 좌측 패널에서 **+ 새 카드셋** 클릭
3. 카드셋 이름과 설명 입력

### 2. 플래시카드 추가하기
1. 카드셋 선택 후 **+ 카드 추가** 클릭
2. 문제 유형 선택 (서술형 or 객관식)
3. 질문과 답변 입력
4. 태그 추가 (선택사항)
5. **저장** 클릭

### 3. 학습 시작하기
1. **홈** 탭에서 학습할 카드셋 선택
2. **학습 시작** 버튼 클릭
3. **셔플** 버튼으로 순서 변경 (선택사항)
4. 질문을 보고 답변 작성 (서술형) 또는 선택 (객관식)
5. 서술형의 경우 **AI 평가받기** 클릭하여 즉시 피드백 확인
6. 키보드 단축키 (← → Enter 1-0) 또는 버튼으로 카드 이동

### 4. 학습 통계 확인
1. **통계** 탭으로 이동
2. 히트맵에서 일별 학습 활동 확인
3. 연속 학습일 (Streak) 확인
4. 일별/주별/월별 View 전환
5. 상세 학습 기록 확인

### 5. 데이터 백업 및 복원

#### 학습 데이터 (카드셋)
1. **설정** 탭 → **학습 데이터 관리**
2. **카드셋 내보내기**: 원하는 카드셋 선택 후 개별 JSON 파일 다운로드
3. **카드셋 가져오기**: 여러 JSON 파일 선택하여 업로드 (병합 모드)

#### 유저 데이터 (학습 기록)
1. **설정** 탭 → **유저 데이터 관리**
2. **학습 기록 내보내기**: 통계를 JSON 파일로 저장
3. **학습 기록 가져오기**: 다른 기기의 학습 기록 복원

## 데이터 Import/Export

### Export (데이터 내보내기)

#### 카드셋 내보내기
- 선택한 카드셋을 각각 개별 JSON 파일로 저장합니다.
- 파일명: `{카드셋이름}-YYYY-MM-DDTHH-MM-SS.json`
- 다른 기기로 데이터 이동 또는 공유 시 유용합니다.

#### 학습 기록 내보내기
- 모든 학습 통계와 기록을 JSON 파일로 저장합니다.
- 파일명: `study-history-YYYY-MM-DDTHH-MM-SS.json`
- 백업 또는 다른 기기로 학습 기록 이동 시 사용합니다.

### Import (데이터 가져오기)

#### 카드셋 가져오기
- **다중 파일 지원**: 여러 JSON 파일을 한 번에 선택하여 가져오기 가능
- **병합 모드**: 기존 데이터는 유지하고 새로운 카드셋만 추가
- **중복 방지**: 동일한 ID의 카드셋은 자동으로 필터링
- **데이터 검증**:
  - 필수 필드 확인 (id, name, cards)
  - 카드 타입 검증 (essay, multiple)
  - 잘못된 형식 자동 감지
  - 학습 기록 데이터를 잘못 업로드하면 명확한 오류 메시지 제공

#### 학습 기록 가져오기
- **병합 모드**: 기존 학습 기록과 합산
- **중복 제거**: 동일한 기록 ID는 자동 필터링
- **데이터 검증**:
  - 필수 필드 확인 (records, dailyStats)
  - 카드셋 데이터를 잘못 업로드하면 명확한 오류 메시지 제공

### JSON 파일 형식

#### 카드셋 형식
```json
{
  "id": "1234567890-abc123",
  "name": "JavaScript 기초",
  "description": "JavaScript 기본 개념들",
  "createdAt": "2025-01-15T10:30:00.000Z",
  "cards": [
    {
      "id": "1234567891-def456",
      "question": "호이스팅이란 무엇인가요?",
      "answer": "변수와 함수 선언이 스코프 최상단으로 끌어올려지는 JavaScript의 특성",
      "type": "essay",
      "tags": ["JavaScript", "호이스팅"],
      "createdAt": "2025-01-15T10:31:00.000Z",
      "studyCount": 5
    }
  ]
}
```

#### 학습 기록 형식
```json
{
  "records": [
    {
      "id": "record-123",
      "cardId": "card-456",
      "cardSetId": "cardset-789",
      "timestamp": "2025-01-15T14:30:00.000Z",
      "date": "2025-01-15"
    }
  ],
  "dailyStats": {
    "2025-01-15": {
      "date": "2025-01-15",
      "cardsStudied": 10,
      "sessionsCount": 2,
      "cardSetIds": ["cardset-789"]
    }
  }
}
```

## AI 답변 평가

### 평가 시스템
- **AI 모델**: Hugging Face DialoGPT-medium
- **평가 범위**: 0-100점
- **피드백**: 답변에 대한 구체적인 평가 및 개선점 제안

### 사용 제한
- **일일 제한**: 50회 (IP 기반)
- **초당 제한**: 5회
- AI 평가 실패 시 키워드 매칭 기반 폴백 평가 제공

## UI/UX 특징

### 반응형 디자인
- **모바일 우선 (Mobile-First)**: 작은 화면부터 설계
- **Breakpoints**: Tailwind CSS 기본 breakpoints 사용
  - `sm`: 640px (모바일 가로)
  - `md`: 768px (태블릿)
  - `lg`: 1024px (데스크톱)
- **터치 최적화**: 모바일 터치 제스처 지원

### Toast 알림
- **위치**: 화면 중앙 (시인성 보장)
- **애니메이션**: Fade-in/Fade-out (0.3초)
- **색상 구분**:
  - 녹색: 성공
  - 빨간색: 오류
  - 파란색: 정보
- **자동 소멸**: 3-5초 후 자동 사라짐

### 애니메이션
- **Fade-in**: 요소가 부드럽게 나타남
- **Fade-out**: 요소가 부드럽게 사라짐
- **부드러운 전환**: 300ms ease-in-out

자세한 UI/UX 가이드는 [UI/UX 디자인 문서](docs/UI_UX_DESIGN.md)를 참조하세요.

## 배포

### Vercel 웹 배포

이 프로젝트는 Vercel에 배포되도록 설정되어 있습니다.

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

또는 GitHub 저장소를 Vercel에 연결하여 자동 배포를 설정할 수 있습니다.

### Electron 앱 배포

빌드된 실행 파일을 GitHub Releases 또는 웹사이트를 통해 배포할 수 있습니다.

**빌드 결과물**:
- Windows: `.exe` (설치 파일 + Portable)
- macOS: `.dmg`
- Linux: `.deb`, `.AppImage`

## 문서

- [Electron 설정 가이드](docs/ELECTRON_SETUP.md) - Electron 앱 빌드 방법
- [Electron 트러블슈팅](docs/ELECTRON_TROUBLESHOOTING.md) - 알려진 문제와 해결 방법
- [UI/UX 디자인 가이드](docs/UI_UX_DESIGN.md) - 디자인 결정사항과 구현 방법

## 라이선스

MIT License

---

**개발자**: sehan528
**프로젝트 목적**: React 학습 및 실무 경험 쌓기
**피드백**: Issues 탭에서 버그 리포트 및 기능 제안 환영합니다!
