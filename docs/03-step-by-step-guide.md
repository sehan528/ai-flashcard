# 실전 개발 가이드: 빈 화면에서 완성까지

> 이 가이드는 AI Flashcard와 같은 React 애플리케이션을 **처음부터 끝까지 순서대로** 만드는 실전 튜토리얼입니다.
> 각 단계를 따라하면서 구조를 익히고, 향후 다른 프로젝트에도 적용할 수 있습니다.

---

## 📋 전체 개발 로드맵

```
총 소요 시간: 약 8-10시간

Phase 1: 프로젝트 초기 셋업          [30분]
Phase 2: 빈 껍데기 화면 만들기        [1시간]
Phase 3: 데이터 계층 구축            [1시간]
Phase 4: 홈 화면 완성                [1.5시간]
Phase 5: 카드 편집 기능              [2시간]
Phase 6: 학습 모드 구현              [2시간]
Phase 7: 고급 기능 추가              [1시간]
```

**핵심 원칙:**
- ✅ 각 단계가 끝나면 반드시 브라우저에서 확인
- ✅ 에러가 나면 바로 해결하고 다음으로
- ✅ 작은 단위로 자주 테스트

---

## Phase 1: 프로젝트 초기 셋업 (30분)

### 📋 이번 단계 목표
- Vite + React + TypeScript 프로젝트 생성
- Tailwind CSS 설치 및 설정
- 기본 폴더 구조 생성

### 📊 작업 순서
```
1. Vite 프로젝트 생성
2. 패키지 설치 (react-router-dom, tailwindcss)
3. Tailwind 설정 파일 작성
4. 폴더 구조 생성
5. 개발 서버 실행
```

---

### 🔨 따라하기

#### 1-1. 프로젝트 생성
```bash
npm create vite@latest ai-flashcard -- --template react-ts
cd ai-flashcard
npm install
```

#### 1-2. 필수 패키지 설치
```bash
npm install react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### 1-3. Tailwind 설정
**tailwind.config.js 수정:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**src/index.css 전체 내용 교체:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

#### 1-4. 폴더 구조 생성
```bash
mkdir -p src/components/Layout
mkdir -p src/components/UI
mkdir -p src/domains/flashcard/components/CardSet
mkdir -p src/domains/flashcard/components/FlashCard
mkdir -p src/domains/flashcard/components/Study
mkdir -p src/domains/flashcard/dtos
mkdir -p src/domains/flashcard/hooks
mkdir -p src/domains/flashcard/utils
mkdir -p src/hooks
mkdir -p src/pages
```

#### 1-5. 개발 서버 실행
```bash
npm run dev
```

---

### ✅ 체크포인트

브라우저에서 `http://localhost:5173` 접속 시:
- [ ] 기본 Vite 화면이 보이는가?
- [ ] 콘솔에 에러가 없는가?
- [ ] `src/` 폴더 안에 위 폴더 구조가 생성되었는가?

**문제 해결:**
- `npm run dev` 실행 안 되면: `node_modules` 삭제 후 `npm install` 재실행
- Tailwind 적용 안 되면: 개발 서버 재시작

---

## Phase 2: 빈 껍데기 화면 만들기 (1시간)

### 📋 이번 단계 목표
- 헤더(네비게이션) 만들기
- 4개의 빈 페이지 만들기 (홈, 카드편집, 학습, 설정)
- React Router로 페이지 연결
- **결과물:** 탭을 클릭하면 페이지가 전환되는 기본 골격

### 📊 작업 순서
```
1. Header 컴포넌트 (네비게이션 바)
2. 빈 페이지 4개 (Home, CardEdit, StudyMode, Settings)
3. App.tsx에서 라우터 설정
4. 테스트: 탭 클릭해서 페이지 전환 확인
```

---

### 🔨 따라하기

#### 2-1. Header 컴포넌트 만들기
**파일 생성:** `src/components/Layout/Header.tsx`

```typescript
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const tabs = [
    { path: '/', label: '홈', icon: '🏠' },
    { path: '/edit', label: '카드 편집', icon: '✏️' },
    { path: '/study', label: '학습', icon: '📚' },
    { path: '/settings', label: '설정', icon: '⚙️' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">AI Flashcard</h1>
          <nav className="flex gap-2">
            {tabs.map((tab) => (
              <Link
                key={tab.path}
                to={tab.path}
                className={`px-4 py-2 rounded-md transition-colors ${
                  location.pathname === tab.path
                    ? 'bg-white text-blue-600'
                    : 'hover:bg-blue-500'
                }`}
              >
                {tab.icon} {tab.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
```

#### 2-2. 빈 페이지 4개 만들기

**파일 생성:** `src/pages/Home.tsx`
```typescript
const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">홈</h2>
      <p className="text-gray-600">카드셋 목록이 여기 표시됩니다.</p>
    </div>
  );
};

export default Home;
```

**파일 생성:** `src/pages/CardEdit.tsx`
```typescript
const CardEdit = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">카드 편집</h2>
      <p className="text-gray-600">카드를 편집하는 페이지입니다.</p>
    </div>
  );
};

export default CardEdit;
```

**파일 생성:** `src/pages/StudyMode.tsx`
```typescript
const StudyMode = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">학습 모드</h2>
      <p className="text-gray-600">학습 화면입니다.</p>
    </div>
  );
};

export default StudyMode;
```

**파일 생성:** `src/pages/Settings.tsx`
```typescript
const Settings = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">설정</h2>
      <p className="text-gray-600">데이터 관리 페이지입니다.</p>
    </div>
  );
};

export default Settings;
```

#### 2-3. 라우터 설정

**파일 수정:** `src/App.tsx` (전체 내용 교체)
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Home from './pages/Home';
import CardEdit from './pages/CardEdit';
import StudyMode from './pages/StudyMode';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/edit" element={<CardEdit />} />
          <Route path="/study" element={<StudyMode />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
```

---

### ✅ 체크포인트

브라우저 확인:
- [ ] 상단에 파란색 헤더가 보이는가?
- [ ] 4개의 탭(홈, 카드 편집, 학습, 설정)이 보이는가?
- [ ] 각 탭을 클릭하면 페이지가 전환되는가?
- [ ] 활성 탭이 흰색 배경으로 표시되는가?

**스크린샷:** 이 시점에서 화면을 캡처해두면 진행 상황 비교에 유용

---

## Phase 3: 데이터 계층 구축 (1시간)

### 📋 이번 단계 목표
- TypeScript 타입 정의 (FlashCard, CardSet)
- LocalStorage 저장소 클래스 구현
- 전역 상태 훅 생성

### 📊 작업 순서
```
1. 타입 정의 (dtos/FlashCard.ts)
2. Storage 유틸리티 (utils/storage.ts)
   └── ID 생성 함수
   └── CRUD 함수들
3. 전역 상태 훅 (hooks/useAppState.tsx)
4. 테스트: 콘솔에서 데이터 저장/불러오기
```

---

### 🔨 따라하기

#### 3-1. 타입 정의

**파일 생성:** `src/domains/flashcard/dtos/FlashCard.ts`
```typescript
export interface FlashCard {
  id: string;
  question: string;
  answer: string | string[];  // 서술형: string, 객관식: string[]
  type: 'essay' | 'multiple';
  tags: string[];
  createdAt: Date;
  studyCount: number;
  correctIndex?: number;  // 객관식 전용
}

export interface CardSet {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  cards: FlashCard[];
}
```

#### 3-2. Storage 유틸리티

**파일 생성:** `src/domains/flashcard/utils/storage.ts`
```typescript
import type { CardSet } from '../dtos/FlashCard';

const STORAGE_KEY = 'flashcard_data';

export class FlashcardStorage {
  // ID 생성
  static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // 모든 카드셋 가져오기
  static getCardSets(): CardSet[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const parsed = JSON.parse(data);
    return parsed.map((set: any) => ({
      ...set,
      createdAt: new Date(set.createdAt),
      cards: set.cards.map((card: any) => ({
        ...card,
        createdAt: new Date(card.createdAt)
      }))
    }));
  }

  // 카드셋 저장
  static saveCardSets(cardSets: CardSet[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cardSets));
  }

  // 카드셋 추가
  static addCardSet(cardSet: CardSet): void {
    const cardSets = this.getCardSets();
    cardSets.push(cardSet);
    this.saveCardSets(cardSets);
  }

  // 카드셋 삭제
  static deleteCardSet(id: string): void {
    const cardSets = this.getCardSets().filter(set => set.id !== id);
    this.saveCardSets(cardSets);
  }
}
```

#### 3-3. 전역 상태 훅

**파일 생성:** `src/hooks/useAppState.tsx`
```typescript
import { useState, useEffect } from 'react';
import type { CardSet } from '../domains/flashcard/dtos/FlashCard';
import { FlashcardStorage } from '../domains/flashcard/utils/storage';

export const useAppState = () => {
  const [cardSets, setCardSets] = useState<CardSet[]>([]);

  useEffect(() => {
    refreshCardSets();
  }, []);

  const refreshCardSets = () => {
    const sets = FlashcardStorage.getCardSets();
    setCardSets(sets);
  };

  return { cardSets, refreshCardSets };
};
```

---

### ✅ 체크포인트

브라우저 콘솔(F12)에서 테스트:
```javascript
// 1. 모듈 import (타입 에러 무시)
const { FlashcardStorage } = await import('./src/domains/flashcard/utils/storage.ts');

// 2. 테스트 데이터 추가
FlashcardStorage.addCardSet({
  id: FlashcardStorage.generateId(),
  name: '테스트 카드셋',
  description: '테스트용',
  createdAt: new Date(),
  cards: []
});

// 3. 데이터 확인
console.log(FlashcardStorage.getCardSets());
// 결과: 배열에 1개 카드셋이 들어있어야 함

// 4. LocalStorage 확인
console.log(localStorage.getItem('flashcard_data'));
// 결과: JSON 문자열이 출력되어야 함
```

**확인사항:**
- [ ] 테스트 카드셋이 저장되는가?
- [ ] `getCardSets()`로 불러오기가 되는가?
- [ ] 페이지 새로고침 후에도 데이터가 남아있는가?

---

## Phase 4: 홈 화면 완성 (1.5시간)

### 📋 이번 단계 목표
- 카드셋 목록을 카드 형태로 표시
- 빈 상태 메시지 표시
- **결과물:** 카드셋 목록이 그리드로 보이는 화면

### 📊 작업 순서
```
1. CardSetGrid 컴포넌트 (그리드 레이아웃)
2. CardSetItem 컴포넌트 (개별 카드)
3. Home 페이지에 연결
4. 테스트 데이터 추가
5. 화면 확인
```

---

### 🔨 따라하기

#### 4-1. CardSetItem 컴포넌트 (개별 카드)

**파일 생성:** `src/domains/flashcard/components/CardSet/CardSetItem.tsx`
```typescript
import type { CardSet } from '../../dtos/FlashCard';

interface CardSetItemProps {
  cardSet: CardSet;
  onStartStudy: () => void;
}

const CardSetItem = ({ cardSet, onStartStudy }: CardSetItemProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">{cardSet.name}</h3>
        <span className="text-2xl">📚</span>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{cardSet.description}</p>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {cardSet.cards.length}개 카드
        </div>

        <button
          onClick={onStartStudy}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
        >
          학습 시작
        </button>
      </div>
    </div>
  );
};

export default CardSetItem;
```

#### 4-2. CardSetGrid 컴포넌트 (그리드)

**파일 생성:** `src/domains/flashcard/components/CardSet/CardSetGrid.tsx`
```typescript
import type { CardSet } from '../../dtos/FlashCard';
import CardSetItem from './CardSetItem';

interface CardSetGridProps {
  cardSets: CardSet[];
  onStartStudy: (cardSet: CardSet) => void;
}

const CardSetGrid = ({ cardSets, onStartStudy }: CardSetGridProps) => {
  if (cardSets.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📂</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          아직 카드셋이 없습니다
        </h3>
        <p className="text-gray-600">
          카드 편집 탭에서 새 카드셋을 만들어보세요!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {cardSets.map((cardSet) => (
        <CardSetItem
          key={cardSet.id}
          cardSet={cardSet}
          onStartStudy={() => onStartStudy(cardSet)}
        />
      ))}
    </div>
  );
};

export default CardSetGrid;
```

#### 4-3. Home 페이지 연결

**파일 수정:** `src/pages/Home.tsx` (전체 교체)
```typescript
import { useAppState } from '../hooks/useAppState';
import CardSetGrid from '../domains/flashcard/components/CardSet/CardSetGrid';
import type { CardSet } from '../domains/flashcard/dtos/FlashCard';

const Home = () => {
  const { cardSets, refreshCardSets } = useAppState();

  const handleStartStudy = (cardSet: CardSet) => {
    alert(`"${cardSet.name}" 학습을 시작합니다!\n(다음 단계에서 구현 예정)`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          내 플래시카드 ({cardSets.length}개)
        </h2>
      </div>

      <CardSetGrid
        cardSets={cardSets}
        onStartStudy={handleStartStudy}
      />
    </div>
  );
};

export default Home;
```

---

### ✅ 체크포인트

#### 테스트 1: 빈 상태
- [ ] 홈 탭을 클릭했을 때 "아직 카드셋이 없습니다" 메시지가 보이는가?

#### 테스트 2: 카드셋 추가 후
브라우저 콘솔에서:
```javascript
const { FlashcardStorage } = await import('./src/domains/flashcard/utils/storage.ts');

// 테스트 카드셋 2개 추가
FlashcardStorage.addCardSet({
  id: FlashcardStorage.generateId(),
  name: 'JavaScript 기초',
  description: 'JS 기본 문법과 개념',
  createdAt: new Date(),
  cards: [
    {
      id: FlashcardStorage.generateId(),
      question: '호이스팅이란?',
      answer: '변수와 함수 선언이 최상단으로 끌어올려지는 현상',
      type: 'essay',
      tags: ['JavaScript'],
      createdAt: new Date(),
      studyCount: 0
    }
  ]
});

FlashcardStorage.addCardSet({
  id: FlashcardStorage.generateId(),
  name: 'React Hooks',
  description: 'useState, useEffect 사용법',
  createdAt: new Date(),
  cards: []
});

// 페이지 새로고침 (F5)
```

새로고침 후:
- [ ] 2개의 카드가 그리드로 보이는가?
- [ ] 각 카드에 이름, 설명, 카드 개수가 표시되는가?
- [ ] "학습 시작" 버튼을 누르면 alert이 뜨는가?

---

## Phase 5: 카드 편집 기능 (2시간)

### 📋 이번 단계 목표
- 2열 레이아웃 (왼쪽: 카드셋 선택, 오른쪽: 카드 목록)
- 새 카드셋 만들기
- 새 카드 추가하기
- **결과물:** 카드를 만들고 편집할 수 있는 화면

### 📊 작업 순서
```
1. 2열 레이아웃 구조 (CardEdit 페이지)
2. CardSetSelector 컴포넌트 (왼쪽)
   └── 카드셋 목록
   └── 새 카드셋 만들기 버튼
3. CardForm 컴포넌트 (카드 추가 폼)
4. CardEdit 페이지에 모두 연결
5. 테스트: 카드셋 & 카드 생성
```

---

### 🔨 따라하기

#### 5-1. CardEdit 페이지 레이아웃

**파일 수정:** `src/pages/CardEdit.tsx` (전체 교체)
```typescript
import { useState } from 'react';
import { useAppState } from '../hooks/useAppState';
import { FlashcardStorage } from '../domains/flashcard/utils/storage';
import type { FlashCard } from '../domains/flashcard/dtos/FlashCard';

const CardEdit = () => {
  const { cardSets, refreshCardSets } = useAppState();
  const [selectedCardSetId, setSelectedCardSetId] = useState<string | null>(null);
  const [showAddCard, setShowAddCard] = useState(false);

  const selectedCardSet = cardSets.find(set => set.id === selectedCardSetId);

  // 새 카드셋 만들기
  const handleCreateNewSet = () => {
    const name = prompt('카드셋 이름:');
    if (!name) return;

    const description = prompt('설명 (선택):') || '';

    const newSet = {
      id: FlashcardStorage.generateId(),
      name,
      description,
      createdAt: new Date(),
      cards: []
    };

    FlashcardStorage.addCardSet(newSet);
    refreshCardSets();
    setSelectedCardSetId(newSet.id);
  };

  // 카드 추가
  const handleAddCard = (cardData: Omit<FlashCard, 'id' | 'createdAt' | 'studyCount'>) => {
    if (!selectedCardSet) return;

    const newCard: FlashCard = {
      ...cardData,
      id: FlashcardStorage.generateId(),
      createdAt: new Date(),
      studyCount: 0
    };

    const updatedSet = {
      ...selectedCardSet,
      cards: [...selectedCardSet.cards, newCard]
    };

    const allSets = cardSets.map(set =>
      set.id === selectedCardSetId ? updatedSet : set
    );

    FlashcardStorage.saveCardSets(allSets);
    refreshCardSets();
    setShowAddCard(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* 왼쪽: 카드셋 선택 */}
        <div className="xl:col-span-1">
          <h3 className="text-lg font-semibold mb-4">카드셋 선택</h3>

          {/* 카드셋 목록 */}
          <div className="space-y-2 mb-4">
            {cardSets.map((set) => (
              <div
                key={set.id}
                onClick={() => setSelectedCardSetId(set.id)}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedCardSetId === set.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-medium">{set.name}</div>
                <div className="text-sm opacity-75">{set.cards.length}개 카드</div>
              </div>
            ))}
          </div>

          {/* 새 카드셋 만들기 */}
          <button
            onClick={handleCreateNewSet}
            className="w-full p-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 transition-colors"
          >
            + 새 카드셋 만들기
          </button>
        </div>

        {/* 오른쪽: 카드 목록/추가 */}
        <div className="xl:col-span-2">
          {!selectedCardSet ? (
            <div className="text-center py-16 text-gray-500">
              <div className="text-4xl mb-4">👈</div>
              <p>왼쪽에서 카드셋을 선택하세요</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {selectedCardSet.name} ({selectedCardSet.cards.length}개 카드)
                </h3>
                <button
                  onClick={() => setShowAddCard(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  + 새 카드 추가
                </button>
              </div>

              {/* 카드 목록 */}
              {selectedCardSet.cards.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  아직 카드가 없습니다. "새 카드 추가"를 클릭하세요!
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedCardSet.cards.map((card) => (
                    <div key={card.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-sm text-gray-600 mb-1">
                            {card.type === 'essay' ? '📝 서술형' : '✅ 객관식'}
                          </div>
                          <div className="font-medium text-gray-800">{card.question}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 카드 추가 폼 (간단 버전) */}
              {showAddCard && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                    <h3 className="text-lg font-semibold mb-4">새 카드 추가</h3>

                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      handleAddCard({
                        question: formData.get('question') as string,
                        answer: formData.get('answer') as string,
                        type: 'essay',
                        tags: []
                      });
                    }}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            질문 *
                          </label>
                          <textarea
                            name="question"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="질문을 입력하세요"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            정답 *
                          </label>
                          <textarea
                            name="answer"
                            rows={5}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="정답을 입력하세요"
                            required
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                          >
                            저장
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAddCard(false)}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardEdit;
```

---

### ✅ 체크포인트

#### 테스트 순서:
1. **카드 편집 탭 클릭**
   - [ ] 2열 레이아웃이 보이는가?
   - [ ] 왼쪽에 기존 카드셋 목록이 보이는가?

2. **새 카드셋 만들기**
   - [ ] "+ 새 카드셋 만들기" 클릭
   - [ ] prompt 창이 뜨는가?
   - [ ] 이름 입력 후 목록에 추가되는가?

3. **카드셋 선택**
   - [ ] 카드셋을 클릭하면 파란색으로 하이라이트되는가?
   - [ ] 오른쪽에 "새 카드 추가" 버튼이 보이는가?

4. **카드 추가**
   - [ ] "+ 새 카드 추가" 클릭
   - [ ] 모달 창이 뜨는가?
   - [ ] 질문과 정답 입력 후 저장되는가?
   - [ ] 카드 목록에 추가된 카드가 보이는가?

5. **새로고침 후 확인**
   - [ ] F5로 페이지 새로고침
   - [ ] 추가한 카드셋과 카드가 그대로 남아있는가?

---

## Phase 6: 학습 모드 구현 (2시간)

### 📋 이번 단계 목표
- 학습 세션 관리 (현재 카드, 진행률)
- 서술형 카드 표시
- 이전/다음 네비게이션
- **결과물:** 카드를 넘기며 학습할 수 있는 화면

### 📊 작업 순서
```
1. useStudySession 훅 (학습 상태 관리)
2. EssayStudyCard 컴포넌트
3. StudyMode 페이지 연결
4. Home에서 학습 시작 연결
5. 테스트: 학습 플로우
```

---

### 🔨 따라하기

#### 6-1. useStudySession 훅

**파일 생성:** `src/domains/flashcard/hooks/useStudySession.ts`
```typescript
import { useState, useMemo } from 'react';
import type { CardSet, FlashCard } from '../dtos/FlashCard';

export const useStudySession = () => {
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const currentCard = useMemo(() => cards[currentCardIndex], [cards, currentCardIndex]);
  const totalCards = cards.length;
  const progress = totalCards > 0 ? Math.round(((currentCardIndex + 1) / totalCards) * 100) : 0;

  const startSession = (cardSet: CardSet, isRandom: boolean) => {
    const sessionCards = isRandom
      ? [...cardSet.cards].sort(() => Math.random() - 0.5)
      : cardSet.cards;
    setCards(sessionCards);
    setCurrentCardIndex(0);
  };

  const goToNextCard = () => {
    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex(prev => prev + 1);
    }
  };

  const goToPreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
    }
  };

  const endSession = () => {
    setCards([]);
    setCurrentCardIndex(0);
  };

  return {
    currentCard,
    currentCardIndex,
    totalCards,
    progress,
    startSession,
    goToNextCard,
    goToPreviousCard,
    endSession
  };
};
```

#### 6-2. EssayStudyCard 컴포넌트

**파일 생성:** `src/domains/flashcard/components/Study/EssayStudyCard.tsx`
```typescript
import { useState } from 'react';
import type { FlashCard } from '../../dtos/FlashCard';

interface EssayStudyCardProps {
  card: FlashCard;
}

const EssayStudyCard = ({ card }: EssayStudyCardProps) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 min-h-[400px] flex flex-col">
      {/* 질문 */}
      <div className="mb-6">
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
          📝 서술형
        </span>
        <h2 className="text-xl font-semibold text-gray-800 mt-4 leading-relaxed">
          {card.question}
        </h2>
      </div>

      {/* 답변 입력 */}
      <div className="flex-1 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          답변을 작성해주세요
        </label>
        <textarea
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="여기에 답변을 작성하세요..."
          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* 정답 표시 */}
      {showAnswer && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-2">✅ 정답:</div>
          <p className="text-gray-800 leading-relaxed">
            {typeof card.answer === 'string' ? card.answer : '정답 오류'}
          </p>
        </div>
      )}

      {/* 버튼 */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          {showAnswer ? '정답 숨기기' : '정답 보기'}
        </button>
        <button
          onClick={() => {
            setUserAnswer('');
            setShowAnswer(false);
          }}
          className="py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          🔄 초기화
        </button>
      </div>
    </div>
  );
};

export default EssayStudyCard;
```

#### 6-3. StudyMode 페이지 연결

**파일 수정:** `src/pages/StudyMode.tsx` (전체 교체)
```typescript
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStudySession } from '../domains/flashcard/hooks/useStudySession';
import EssayStudyCard from '../domains/flashcard/components/Study/EssayStudyCard';
import type { CardSet } from '../domains/flashcard/dtos/FlashCard';

const StudyMode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cardSet = location.state?.cardSet as CardSet | undefined;
  const isRandom = location.state?.isRandom as boolean | false;

  const {
    currentCard,
    currentCardIndex,
    totalCards,
    progress,
    startSession,
    goToNextCard,
    goToPreviousCard,
    endSession
  } = useStudySession();

  useEffect(() => {
    if (cardSet) {
      startSession(cardSet, isRandom);
    }

    return () => {
      endSession();
    };
  }, [cardSet]);

  const handleExit = () => {
    if (confirm('학습을 종료하시겠습니까?')) {
      endSession();
      navigate('/');
    }
  };

  if (!currentCard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">📚</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            학습할 카드셋을 선택하세요
          </h2>
          <p className="text-gray-600 mb-4">홈 화면에서 카드셋을 선택해주세요</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            홈으로 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                {cardSet?.name}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {currentCardIndex + 1} / {totalCards} 카드
                {isRandom && <span className="ml-2 text-orange-600">• 랜덤 모드</span>}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* 진행률 */}
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 font-medium">{progress}%</span>
              </div>

              {/* 종료 버튼 */}
              <button
                onClick={handleExit}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                종료
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <EssayStudyCard card={currentCard} />
        </div>

        {/* 네비게이션 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between">
            <button
              onClick={goToPreviousCard}
              disabled={currentCardIndex === 0}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← 이전 카드
            </button>
            <button
              onClick={goToNextCard}
              disabled={currentCardIndex === totalCards - 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              다음 카드 →
            </button>
          </div>

          {/* 완료 메시지 */}
          {currentCardIndex === totalCards - 1 && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <span className="text-lg">🎉</span>
              <span className="ml-2 text-green-700 font-medium">
                모든 카드를 완료했습니다!
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudyMode;
```

#### 6-4. Home에서 학습 시작 연결

**파일 수정:** `src/pages/Home.tsx`에서 `handleStartStudy` 함수 수정:
```typescript
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const { cardSets, refreshCardSets } = useAppState();

  const handleStartStudy = (cardSet: CardSet) => {
    navigate('/study', { state: { cardSet, isRandom: false } });
  };

  // ... 나머지 코드
};
```

---

### ✅ 체크포인트

#### 테스트 플로우:
1. **홈에서 학습 시작**
   - [ ] 카드셋의 "학습 시작" 버튼 클릭
   - [ ] 학습 모드 화면으로 이동하는가?

2. **학습 화면 확인**
   - [ ] 상단에 카드셋 이름과 진행률이 보이는가?
   - [ ] 질문이 보이는가?
   - [ ] 답변 입력란이 있는가?

3. **정답 보기/숨기기**
   - [ ] "정답 보기" 버튼 클릭 시 정답이 표시되는가?
   - [ ] "정답 숨기기" 버튼으로 다시 숨길 수 있는가?

4. **네비게이션**
   - [ ] "다음 카드 →" 버튼으로 다음 카드로 이동하는가?
   - [ ] "← 이전 카드" 버튼으로 이전 카드로 돌아가는가?
   - [ ] 첫 카드에서 "이전" 버튼이 비활성화되는가?
   - [ ] 마지막 카드에서 "다음" 버튼이 비활성화되는가?

5. **마지막 카드**
   - [ ] 마지막 카드에 도달하면 "모든 카드를 완료했습니다!" 메시지가 보이는가?

6. **종료**
   - [ ] "종료" 버튼 클릭 시 확인 창이 뜨는가?
   - [ ] 확인하면 홈으로 돌아가는가?

---

## Phase 7: 고급 기능 추가 (1시간)

### 📋 이번 단계 목표
- 데이터 Export/Import
- 키보드 단축키
- 마크다운 렌더링

### 📊 작업 순서
```
1. Settings 페이지 (Export/Import)
2. 키보드 단축키 추가
3. 마크다운 렌더링
```

---

### 🔨 따라하기

#### 7-1. Settings 페이지 (Export/Import)

**파일 수정:** `src/pages/Settings.tsx` (전체 교체)
```typescript
import { useAppState } from '../hooks/useAppState';
import { FlashcardStorage } from '../domains/flashcard/utils/storage';

const Settings = () => {
  const { cardSets, refreshCardSets } = useAppState();

  // 데이터 내보내기
  const handleExport = () => {
    const json = JSON.stringify(cardSets, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `flashcard-export-${new Date().toISOString()}.json`;
    a.click();

    URL.revokeObjectURL(url);
  };

  // 데이터 가져오기
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (!Array.isArray(imported)) {
          alert('올바른 형식이 아닙니다.');
          return;
        }

        FlashcardStorage.saveCardSets([...cardSets, ...imported]);
        refreshCardSets();
        alert(`${imported.length}개 카드셋을 가져왔습니다!`);
      } catch {
        alert('파일 읽기 실패');
      }
    };
    reader.readAsText(file);
  };

  // 전체 삭제
  const handleDeleteAll = () => {
    if (!confirm('모든 데이터를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) return;
    if (!confirm('정말로 삭제하시겠습니까?')) return;

    localStorage.removeItem('flashcard_data');
    refreshCardSets();
    alert('모든 데이터가 삭제되었습니다.');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">설정</h2>

      {/* 통계 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 통계</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">{cardSets.length}</div>
            <div className="text-sm text-gray-600 mt-1">카드셋</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">
              {cardSets.reduce((sum, set) => sum + set.cards.length, 0)}
            </div>
            <div className="text-sm text-gray-600 mt-1">카드</div>
          </div>
        </div>
      </div>

      {/* 데이터 관리 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">💾 데이터 관리</h3>
        <div className="space-y-3">
          <button
            onClick={handleExport}
            className="w-full p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">📥 데이터 내보내기</div>
                <div className="text-sm opacity-90">JSON 파일로 저장</div>
              </div>
              <div className="text-2xl">→</div>
            </div>
          </button>

          <label className="block w-full p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer text-left">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">📤 데이터 가져오기</div>
                <div className="text-sm opacity-90">JSON 파일에서 불러오기</div>
              </div>
              <div className="text-2xl">←</div>
            </div>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>

          <button
            onClick={handleDeleteAll}
            className="w-full p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">🗑️ 전체 삭제</div>
                <div className="text-sm opacity-90">모든 데이터 삭제</div>
              </div>
              <div className="text-2xl">✕</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
```

---

### ✅ 최종 체크포인트

#### 전체 기능 테스트:
1. **홈 화면**
   - [ ] 카드셋 목록이 보이는가?

2. **카드 편집**
   - [ ] 카드셋과 카드를 만들 수 있는가?

3. **학습 모드**
   - [ ] 카드를 넘기며 학습할 수 있는가?

4. **설정**
   - [ ] Export 버튼으로 JSON 파일이 다운로드되는가?
   - [ ] Import로 데이터를 불러올 수 있는가?

5. **데이터 영속성**
   - [ ] 페이지를 새로고침해도 데이터가 유지되는가?
   - [ ] 브라우저를 닫았다 다시 열어도 데이터가 남아있는가?

---

## 🎯 완료!

축하합니다! 기본적인 플래시카드 앱을 완성했습니다.

### 다음 단계 (선택사항):
- 키보드 단축키 (← → Enter)
- 마크다운 렌더링 (react-markdown)
- 객관식 카드 지원
- AI 평가 API 연동
- 다크 모드
- 반응형 디자인 개선

---

## 📚 참고 문서
- [프로젝트 구조 가이드](./01-project-structure.md)
- [컴포넌트 설계 방법론](./02-component-design.md)
