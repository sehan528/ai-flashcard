# AI Flashcard

AI 기반 답변 평가 기능을 갖춘 스마트 플래시카드 학습 애플리케이션입니다.

## 프로젝트 소개

**AI Flashcard**는 React를 활용한 학습 도구로, 사용자가 직접 플래시카드를 만들고 학습할 수 있습니다. 서술형 문제의 경우 AI가 자동으로 답변을 평가하고 피드백을 제공합니다.

이 프로젝트는 **React 사용에 익숙해지기 위한 학습 목적**으로 개발되었으며, LocalStorage 기반의 간단한 데이터 관리와 Vercel Serverless Functions를 활용한 AI 평가 기능을 포함합니다.

## 주요 기능

### 📚 카드셋 관리
- 카드셋 생성, 수정, 삭제, 복제
- 카드셋별 설명 및 메타데이터 관리
- 학습 통계 자동 추적

### 📝 플래시카드 작성
- **서술형 카드**: 자유롭게 답변을 작성하는 문제
- **객관식 카드**: 2~10개의 선택지 중 정답 선택
- 마크다운 형식 답변 지원 (코드 블록 문법 강조 포함)
- 태그 기반 분류
- 카드별 학습 횟수 추적

### 🎓 학습 모드
- **순차 학습**: 카드를 순서대로 학습
- **랜덤 학습**: 카드를 무작위로 섞어서 학습
- 진행률 표시 및 이전/다음 네비게이션
- **키보드 단축키 지원**: 마우스 없이 빠른 학습 가능
  - `←` `→`: 이전/다음 카드 이동
  - `Enter`: 정답 보기 (서술형) / 정답 확인 (객관식)
  - `1-0`: 객관식 선택지 선택
- AI 기반 서술형 답변 자동 평가 (0-100점)
- 구체적인 피드백 및 개선점 제안
- 서술형 카드는 정답 확인 후 다음 카드로 이동 가능

### 💾 데이터 관리
- **예제 데이터 생성**: 13개의 프로그래밍 관련 카드셋 (DB, DS, Elasticsearch, JavaScript, Kafka, Network, OS, PL, React, Redis, Spring, WebSocket 등) 총 830+ 카드
- **Import**: JSON 파일에서 카드셋 가져오기 (병합 모드)
- **Export**: 모든 카드셋을 JSON 파일로 내보내기
- **통계 조회**: 카드셋, 카드, 학습 횟수 확인
- **전체 삭제**: 모든 데이터 초기화 (확인 절차 포함)

## 기술 스택

### Frontend
- **React 19.1.0** - UI 라이브러리
- **TypeScript 5.8.3** - 타입 안정성
- **Vite 7.0.0** - 빌드 도구 (HMR 지원)
- **React Router DOM 7.6.3** - 라우팅
- **Tailwind CSS 3.4.17** - 유틸리티 기반 스타일링
- **React Markdown** - 마크다운 렌더링 (코드 문법 강조 지원)

### Backend
- **Vercel Serverless Functions** - API 엔드포인트
- **Hugging Face API** - DialoGPT-medium 모델 (AI 평가)

### Data Storage
- **LocalStorage** - 브라우저 로컬 저장소

### Development Tools
- **ESLint 9.29.0** - 코드 품질 검사
- **PostCSS & Autoprefixer** - CSS 처리

## 시작하기

### 설치

```bash
# 저장소 클론
git clone https://github.com/sehan528/ai-flashcard.git
cd ai-flashcard

# 의존성 패키지 설치
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

개발 서버가 시작되면 브라우저에서 `http://localhost:5173`으로 접속할 수 있습니다.

### 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

### 프리뷰

```bash
npm run preview
```

빌드된 애플리케이션을 로컬에서 미리 볼 수 있습니다.

## 프로젝트 구조

```
ai-flashcard/
├── api/                          # Vercel Serverless Functions
│   └── ai-evaluate.ts           # AI 답변 평가 API
├── public/                       # 정적 파일
├── src/
│   ├── assets/                   # 이미지, 아이콘 등 리소스
│   ├── components/
│   │   ├── Layout/
│   │   │   └── Header.tsx       # 앱 헤더 (탭 네비게이션)
│   │   ├── UI/
│   │   │   ├── ContextMenu.tsx  # 컨텍스트 메뉴
│   │   │   └── RandomToggle.tsx # 랜덤 모드 토글
│   │   └── AppRouter.tsx        # 탭 기반 라우팅 컴포넌트
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
│   │       │   └── useStudySession.ts  # 학습 세션 관리 훅
│   │       └── utils/
│   │           └── storage.ts   # LocalStorage 데이터 관리
│   ├── hooks/
│   │   ├── useAppState.tsx      # 앱 전역 상태 관리
│   │   └── useStudyActions.tsx  # 학습 관련 액션
│   ├── pages/
│   │   ├── Home.tsx             # 홈 (카드셋 목록)
│   │   ├── CardEdit.tsx         # 카드 편집
│   │   ├── StudyMode.tsx        # 학습 모드
│   │   ├── Settings.tsx         # 설정 (데이터 관리)
│   │   └── Error404.tsx         # 404 페이지
│   ├── App.tsx                  # 최상위 라우터
│   ├── MainApp.tsx              # 메인 앱 컨테이너
│   ├── main.tsx                 # 엔트리 포인트
│   └── index.css                # 전역 스타일
├── package.json
├── tsconfig.json
├── vite.config.ts
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
3. 질문을 보고 답변 작성 (서술형) 또는 선택 (객관식)
4. 서술형의 경우 **AI 평가받기** 클릭하여 즉시 피드백 확인
5. 이전/다음 버튼으로 카드 이동

### 4. 데이터 백업 및 복원
1. **설정** 탭으로 이동
2. **데이터 내보내기** 클릭하여 JSON 파일 다운로드
3. **데이터 가져오기** 클릭하여 JSON 파일 업로드

## 데이터 Import/Export

### Export (데이터 내보내기)
- 모든 카드셋을 JSON 파일로 저장합니다.
- 파일명: `flashcard-export-YYYY-MM-DDTHH-MM-SS.json`
- 백업 또는 다른 기기로 데이터 이동 시 유용합니다.

### Import (데이터 가져오기)
- JSON 파일에서 카드셋을 가져옵니다.
- **병합 모드**: 기존 데이터는 유지하고 새로운 카드셋만 추가됩니다.
- 중복된 ID는 자동으로 필터링됩니다.
- 유효성 검증을 통해 잘못된 데이터는 거부됩니다.

### JSON 파일 형식 예시
```json
[
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
        "studyCount": 0
      }
    ]
  }
]
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

## 배포

이 프로젝트는 Vercel에 배포되도록 설정되어 있습니다.

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

또는 GitHub 저장소를 Vercel에 연결하여 자동 배포를 설정할 수 있습니다.

## 라이선스

MIT License
