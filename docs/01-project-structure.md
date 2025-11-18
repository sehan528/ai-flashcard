# 프로젝트 구조 가이드

이 문서는 AI Flashcard 프로젝트의 폴더 및 파일 구조를 설명하여, 향후 유사한 React 프로젝트를 구축할 때 참고할 수 있도록 작성되었습니다.

## 목차
1. [전체 구조 개요](#전체-구조-개요)
2. [주요 디렉토리 설명](#주요-디렉토리-설명)
3. [설계 원칙](#설계-원칙)
4. [파일 명명 규칙](#파일-명명-규칙)

---

## 전체 구조 개요

```
ai-flashcard/
├── api/                          # 백엔드 API (Vercel Serverless Functions)
│   └── ai-evaluate.ts           # AI 평가 엔드포인트
│
├── public/                       # 정적 파일
│   └── data/                    # 데이터 파일
│       ├── dataset/             # 예제 데이터셋
│       │   ├── index.json       # 데이터셋 인덱스
│       │   ├── db/
│       │   ├── ds/
│       │   └── ...              # 기타 카테고리
│       └── answertemp/          # AI 답변 템플릿 (개발용)
│
├── scripts/                      # 유틸리티 스크립트
│   └── generate-dataset-index.py # 데이터셋 인덱스 자동 생성
│
├── src/
│   ├── assets/                   # 정적 리소스
│   │
│   ├── components/               # 공통 컴포넌트
│   │   ├── Layout/
│   │   │   └── Header.tsx       # 상단 네비게이션 바
│   │   ├── UI/
│   │   │   ├── ContextMenu.tsx  # 재사용 가능한 컨텍스트 메뉴
│   │   │   └── RandomToggle.tsx # 순서/랜덤 토글 스위치
│   │   └── AppRouter.tsx        # 탭 기반 라우팅
│   │
│   ├── domains/                  # 도메인 중심 구조
│   │   └── flashcard/           # 플래시카드 도메인
│   │       ├── components/      # 도메인 특화 컴포넌트
│   │       │   ├── CardSet/     # 카드셋 관련
│   │       │   │   ├── CardSetGrid.tsx
│   │       │   │   ├── CardSetItem.tsx
│   │       │   │   ├── CardSetSelector.tsx
│   │       │   │   └── CardSetEditModal.tsx
│   │       │   ├── FlashCard/   # 플래시카드 편집
│   │       │   │   ├── CardForm.tsx
│   │       │   │   ├── CardListManager.tsx
│   │       │   │   └── AIFeedbackModal.tsx
│   │       │   └── Study/       # 학습 모드
│   │       │       ├── EssayStudyCard.tsx
│   │       │       └── MultipleStudyCard.tsx
│   │       ├── dtos/            # 타입 정의
│   │       │   └── FlashCard.ts
│   │       ├── hooks/           # 도메인 훅
│   │       │   ├── useAIEvaluation.ts
│   │       │   └── useStudySession.ts
│   │       └── utils/           # 도메인 유틸리티
│   │           └── storage.ts   # LocalStorage 관리
│   │
│   ├── hooks/                    # 전역 훅
│   │   ├── useAppState.tsx      # 앱 상태 관리
│   │   └── useStudyActions.tsx  # 학습 액션
│   │
│   ├── pages/                    # 페이지 컴포넌트
│   │   ├── Home.tsx             # 홈 - 카드셋 목록
│   │   ├── CardEdit.tsx         # 카드 편집
│   │   ├── StudyMode.tsx        # 학습 모드
│   │   ├── Settings.tsx         # 설정
│   │   └── Error404.tsx         # 404 페이지
│   │
│   ├── App.tsx                  # 루트 라우터
│   ├── MainApp.tsx              # 메인 앱 컨테이너
│   ├── main.tsx                 # 엔트리 포인트
│   ├── index.css                # 전역 스타일 (Tailwind)
│   └── vite-env.d.ts            # Vite 타입 정의
│
├── package.json                  # 의존성 관리
├── tsconfig.json                 # TypeScript 설정
├── vite.config.ts                # Vite 빌드 설정
├── tailwind.config.js            # Tailwind CSS 설정
├── postcss.config.js             # PostCSS 설정
├── vercel.json                   # Vercel 배포 설정
└── README.md                     # 프로젝트 문서
```

---

## 주요 디렉토리 설명

### 1. `/api` - 백엔드 API

**목적:** Vercel Serverless Functions를 사용한 백엔드 로직

**주요 파일:**
- `ai-evaluate.ts`: AI 답변 평가 API 엔드포인트
  - Hugging Face API 호출
  - Rate limiting (IP 기반, 일일 50회 제한)
  - 폴백 로직 (AI 실패 시 키워드 매칭)

**특징:**
- Serverless 아키텍처 (자동 스케일링)
- CORS 설정 포함
- 에러 핸들링 및 로깅

---

### 2. `/public` - 정적 파일

**목적:** 빌드 시 그대로 복사되는 정적 리소스

**구조:**
- `/public/data/dataset/`: 예제 데이터셋 (13개 카테고리, 830+ 카드)
- `/public/data/answertemp/`: AI 답변 생성 템플릿 (개발용)

**주의사항:**
- 이 폴더의 파일은 빌드 시 `/` 경로로 제공됨
- 대용량 파일 주의 (빌드 크기 증가)

---

### 3. `/src/components` - 공통 컴포넌트

**목적:** 여러 페이지에서 재사용되는 범용 컴포넌트

**구조:**
- **Layout/**: 레이아웃 관련 컴포넌트
  - `Header.tsx`: 앱 전체 네비게이션 (홈, 카드편집, 학습, 설정 탭)

- **UI/**: 재사용 가능한 UI 컴포넌트
  - `ContextMenu.tsx`: 우클릭 메뉴 (편집, 삭제 등)
  - `RandomToggle.tsx`: 토글 스위치 컴포넌트

**설계 원칙:**
- 도메인 로직 포함 금지 (순수 UI만)
- Props를 통한 동작 제어
- 재사용성 최대화

---

### 4. `/src/domains` - 도메인 중심 설계

**목적:** 비즈니스 로직을 도메인별로 그룹화

**왜 이 구조를 선택했나?**
- 기능별 응집도 증가 (관련 파일이 한곳에)
- 확장성 향상 (새 도메인 추가 용이)
- 코드 탐색 효율 증가

**flashcard 도메인 구조:**

#### `/components` - 도메인 컴포넌트
플래시카드 기능에만 사용되는 컴포넌트들

#### `/dtos` - 데이터 타입 정의
```typescript
// FlashCard.ts
export interface FlashCard {
  id: string;
  question: string;
  answer: string | string[];  // 서술형: string, 객관식: string[]
  type: 'essay' | 'multiple';
  tags: string[];
  createdAt: Date;
  studyCount: number;
  correctIndex?: number;      // 객관식 전용
}
```

#### `/hooks` - 커스텀 훅
- `useAIEvaluation.ts`: AI 평가 로직 (API 호출, 상태 관리)
- `useStudySession.ts`: 학습 세션 관리 (진행률, 네비게이션)

#### `/utils` - 유틸리티 함수
- `storage.ts`: LocalStorage CRUD 작업 (Create, Read, Update, Delete)

---

### 5. `/src/hooks` - 전역 훅

**목적:** 여러 페이지에서 공유되는 상태와 로직

**주요 파일:**
- `useAppState.tsx`: 앱 전역 상태 (카드셋 목록, 새로고침 함수)
- `useStudyActions.tsx`: 학습 관련 액션 (학습 시작, 종료)

**전역 훅 vs 도메인 훅:**
- **전역 훅**: 여러 도메인에서 사용
- **도메인 훅**: 특정 도메인에서만 사용

---

### 6. `/src/pages` - 페이지 컴포넌트

**목적:** 라우팅 대상이 되는 최상위 페이지

**주요 페이지:**
- `Home.tsx`: 카드셋 목록 및 학습 시작
- `CardEdit.tsx`: 카드 편집 (2열 레이아웃)
- `StudyMode.tsx`: 학습 모드 (카드 표시 + 네비게이션)
- `Settings.tsx`: 데이터 Import/Export, 통계

**페이지 vs 컴포넌트:**
- **페이지**: 라우트와 1:1 매핑, 전역 상태 접근
- **컴포넌트**: 페이지의 일부, Props로 데이터 전달

---

## 설계 원칙

### 1. 관심사의 분리 (Separation of Concerns)
- **UI 컴포넌트**: 렌더링만 담당
- **훅**: 상태 및 로직 관리
- **유틸리티**: 순수 함수 (side-effect 없음)

### 2. 단일 책임 원칙 (Single Responsibility)
- 각 컴포넌트는 하나의 역할만 수행
- 예: `CardSetItem.tsx`는 카드셋 표시만, 편집 로직은 부모에게 위임

### 3. Props Drilling 최소화
- 전역 상태는 훅으로 관리 (`useAppState`)
- 컴포넌트 트리 깊이 제한 (최대 3-4단계)

### 4. 타입 안전성
- 모든 컴포넌트 Props에 TypeScript 인터페이스 정의
- `any` 타입 사용 금지
- 엄격한 타입 체크 (`strict: true`)

### 5. 재사용성 vs 복잡성 균형
- 3번 이상 사용되는 UI는 공통 컴포넌트로 추출
- 과도한 추상화 지양 (YAGNI 원칙)

---

## 파일 명명 규칙

### 컴포넌트
- **PascalCase**: `CardSetGrid.tsx`
- **명사형**: 컴포넌트가 무엇인지 명확히 표현

### 훅
- **camelCase**: `useAIEvaluation.ts`
- **use 접두사**: React 훅 컨벤션 준수

### 유틸리티
- **camelCase**: `storage.ts`
- **동사 또는 명사**: 기능 명확히 표현

### 타입 정의
- **PascalCase**: `FlashCard.ts`
- 인터페이스와 파일명 일치

---

## 확장 시 고려사항

### 새 기능 추가 시
1. 도메인 구분 (기존 도메인 vs 새 도메인)
2. 공통 컴포넌트 재사용 가능 여부 확인
3. 전역 상태 필요 여부 판단

### 새 도메인 추가 시
```
/src/domains/new-domain/
  ├── components/
  ├── dtos/
  ├── hooks/
  └── utils/
```

### 코드 리뷰 체크리스트
- [ ] 폴더 구조가 일관성 있는가?
- [ ] 컴포넌트가 단일 책임을 지키는가?
- [ ] 타입이 명확히 정의되었는가?
- [ ] 재사용 가능한 로직이 훅으로 분리되었는가?

---

## 다음 문서

- [컴포넌트 설계 방법론 →](./02-component-design.md)
- [단계별 구현 가이드 →](./03-step-by-step-guide.md)
