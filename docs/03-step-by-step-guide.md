# 단계별 구현 가이드

이 문서는 AI Flashcard와 유사한 React 애플리케이션을 처음부터 구축하는 단계별 가이드입니다. 각 단계를 따라하면서 React 개발 프로세스를 학습할 수 있습니다.

## 목차
1. [프로젝트 초기 설정](#1-프로젝트-초기-설정)
2. [기본 라우팅 구성](#2-기본-라우팅-구성)
3. [데이터 모델 설계](#3-데이터-모델-설계)
4. [LocalStorage 구현](#4-localstorage-구현)
5. [첫 번째 페이지 만들기](#5-첫-번째-페이지-만들기-홈)
6. [CRUD 기능 구현](#6-crud-기능-구현)
7. [학습 모드 구현](#7-학습-모드-구현)
8. [고급 기능 추가](#8-고급-기능-추가)

---

## 1. 프로젝트 초기 설정

### 1-1. Vite로 프로젝트 생성

```bash
# React + TypeScript 템플릿 생성
npm create vite@latest ai-flashcard -- --template react-ts

# 프로젝트 디렉토리 이동
cd ai-flashcard

# 의존성 설치
npm install
```

### 1-2. 필수 패키지 설치

```bash
# 라우팅
npm install react-router-dom

# 스타일링
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 마크다운 렌더링 (나중에 추가)
npm install react-markdown rehype-highlight
```

### 1-3. Tailwind CSS 설정

**tailwind.config.js:**
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

**src/index.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto';
}
```

### 1-4. 폴더 구조 생성

```bash
mkdir -p src/{components/{Layout,UI},domains/flashcard/{components/{CardSet,FlashCard,Study},dtos,hooks,utils},hooks,pages}
```

---

## 2. 기본 라우팅 구성

### 2-1. 페이지 컴포넌트 생성

**src/pages/Home.tsx:**
```typescript
const Home = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">홈</h1>
      <p>카드셋 목록이 여기 표시됩니다.</p>
    </div>
  );
};

export default Home;
```

동일한 방식으로 `CardEdit.tsx`, `StudyMode.tsx`, `Settings.tsx` 생성

### 2-2. 헤더 네비게이션

**src/components/Layout/Header.tsx:**
```typescript
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex gap-4">
          <Link to="/" className="hover:underline">홈</Link>
          <Link to="/edit" className="hover:underline">카드 편집</Link>
          <Link to="/study" className="hover:underline">학습</Link>
          <Link to="/settings" className="hover:underline">설정</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
```

### 2-3. 라우터 설정

**src/App.tsx:**
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

**테스트:** `npm run dev` 실행 후 네비게이션 동작 확인

---

## 3. 데이터 모델 설계

### 3-1. 타입 정의

**src/domains/flashcard/dtos/FlashCard.ts:**
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

**왜 이렇게 설계했나?**
- `answer`를 유니온 타입으로: 서술형과 객관식을 하나의 인터페이스로 처리
- `correctIndex?`: 객관식에만 필요, 옵셔널로 처리
- `Date` 타입: JSON 저장 시 문자열로 변환되므로 파싱 필요

---

## 4. LocalStorage 구현

### 4-1. Storage 유틸리티

**src/domains/flashcard/utils/storage.ts:**
```typescript
import type { CardSet, FlashCard } from '../dtos/FlashCard';

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
    // Date 객체로 변환
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

  // 카드셋 업데이트
  static updateCardSet(id: string, updates: Partial<CardSet>): void {
    const cardSets = this.getCardSets();
    const index = cardSets.findIndex(set => set.id === id);
    if (index !== -1) {
      cardSets[index] = { ...cardSets[index], ...updates };
      this.saveCardSets(cardSets);
    }
  }

  // 카드셋 삭제
  static deleteCardSet(id: string): void {
    const cardSets = this.getCardSets().filter(set => set.id !== id);
    this.saveCardSets(cardSets);
  }
}
```

**테스트:**
```typescript
// 브라우저 콘솔에서 테스트
import { FlashcardStorage } from './storage';

const testSet = {
  id: FlashcardStorage.generateId(),
  name: '테스트 카드셋',
  description: '테스트용',
  createdAt: new Date(),
  cards: []
};

FlashcardStorage.addCardSet(testSet);
console.log(FlashcardStorage.getCardSets());  // [testSet]
```

---

## 5. 첫 번째 페이지 만들기 (홈)

### 5-1. 전역 상태 훅

**src/hooks/useAppState.tsx:**
```typescript
import { useState, useEffect } from 'react';
import type { CardSet } from '../domains/flashcard/dtos/FlashCard';
import { FlashcardStorage } from '../domains/flashcard/utils/storage';

export const useAppState = () => {
  const [cardSets, setCardSets] = useState<CardSet[]>([]);

  // 초기 로드
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

### 5-2. 카드셋 그리드 컴포넌트

**src/domains/flashcard/components/CardSet/CardSetGrid.tsx:**
```typescript
import type { CardSet } from '../../dtos/FlashCard';

interface CardSetGridProps {
  cardSets: CardSet[];
  onStartStudy: (cardSet: CardSet) => void;
}

const CardSetGrid = ({ cardSets, onStartStudy }: CardSetGridProps) => {
  if (cardSets.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">아직 카드셋이 없습니다.</p>
        <p className="mt-2">카드 편집에서 새 카드셋을 만들어보세요!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {cardSets.map((cardSet) => (
        <div key={cardSet.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800">{cardSet.name}</h3>
          <p className="text-sm text-gray-600 mt-2">{cardSet.description}</p>
          <div className="mt-4 text-sm text-gray-500">
            {cardSet.cards.length}개 카드
          </div>
          <button
            onClick={() => onStartStudy(cardSet)}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            학습 시작
          </button>
        </div>
      ))}
    </div>
  );
};

export default CardSetGrid;
```

### 5-3. 홈 페이지 완성

**src/pages/Home.tsx:**
```typescript
import { useAppState } from '../hooks/useAppState';
import CardSetGrid from '../domains/flashcard/components/CardSet/CardSetGrid';

const Home = () => {
  const { cardSets, refreshCardSets } = useAppState();

  const handleStartStudy = (cardSet: CardSet) => {
    // 나중에 구현: 학습 모드로 이동
    console.log('학습 시작:', cardSet.name);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        내 플래시카드 ({cardSets.length}개)
      </h2>
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

## 6. CRUD 기능 구현

### 6-1. 카드셋 생성

**src/pages/CardEdit.tsx:**
```typescript
import { useState } from 'react';
import { useAppState } from '../hooks/useAppState';
import { FlashcardStorage } from '../domains/flashcard/utils/storage';

const CardEdit = () => {
  const { cardSets, refreshCardSets } = useAppState();
  const [selectedCardSetId, setSelectedCardSetId] = useState<string | null>(null);

  const handleCreateNewSet = (name: string, description: string) => {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* 왼쪽: 카드셋 선택 */}
        <div className="xl:col-span-1">
          <h3 className="text-lg font-semibold mb-4">카드셋 선택</h3>
          {cardSets.map((set) => (
            <div
              key={set.id}
              onClick={() => setSelectedCardSetId(set.id)}
              className={`p-3 mb-2 border rounded-lg cursor-pointer ${
                selectedCardSetId === set.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
            >
              <div className="font-medium">{set.name}</div>
              <div className="text-sm text-gray-600">{set.cards.length}개 카드</div>
            </div>
          ))}

          {/* 새 카드셋 만들기 버튼 */}
          <button
            onClick={() => {
              const name = prompt('카드셋 이름:');
              const description = prompt('설명:');
              if (name) handleCreateNewSet(name, description || '');
            }}
            className="w-full mt-4 p-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-gray-400"
          >
            + 새 카드셋 만들기
          </button>
        </div>

        {/* 오른쪽: 카드 관리 */}
        <div className="xl:col-span-2">
          {selectedCardSetId ? (
            <div>
              <h3 className="text-lg font-semibold mb-4">카드 목록</h3>
              {/* 카드 목록 컴포넌트 (다음 단계에서 구현) */}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              왼쪽에서 카드셋을 선택하세요
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardEdit;
```

### 6-2. 카드 추가 폼

**src/domains/flashcard/components/FlashCard/CardForm.tsx:**
```typescript
import { useState } from 'react';
import type { FlashCard } from '../../dtos/FlashCard';

interface CardFormProps {
  onSave: (card: Omit<FlashCard, 'id' | 'createdAt' | 'studyCount'>) => void;
  onCancel: () => void;
}

const CardForm = ({ onSave, onCancel }: CardFormProps) => {
  const [type, setType] = useState<'essay' | 'multiple'>('essay');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [choices, setChoices] = useState(['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [tags, setTags] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) {
      alert('질문을 입력해주세요');
      return;
    }

    const card = {
      question: question.trim(),
      answer: type === 'essay' ? answer.trim() : choices.filter(c => c.trim()),
      type,
      tags,
      ...(type === 'multiple' && { correctIndex })
    };

    onSave(card);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 문제 유형 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          문제 유형
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setType('essay')}
            className={`px-4 py-2 rounded-md ${
              type === 'essay' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            📝 서술형
          </button>
          <button
            type="button"
            onClick={() => setType('multiple')}
            className={`px-4 py-2 rounded-md ${
              type === 'multiple' ? 'bg-green-600 text-white' : 'bg-gray-200'
            }`}
          >
            ✅ 객관식
          </button>
        </div>
      </div>

      {/* 질문 입력 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          질문 *
        </label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="질문을 입력하세요"
          required
        />
      </div>

      {/* 답변 입력 (서술형) */}
      {type === 'essay' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            정답 *
          </label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="정답을 입력하세요 (마크다운 지원)"
            required
          />
        </div>
      )}

      {/* 선택지 입력 (객관식) */}
      {type === 'multiple' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            선택지 * (최소 2개)
          </label>
          {choices.map((choice, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                checked={correctIndex === index}
                onChange={() => setCorrectIndex(index)}
              />
              <input
                type="text"
                value={choice}
                onChange={(e) => {
                  const newChoices = [...choices];
                  newChoices[index] = e.target.value;
                  setChoices(newChoices);
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder={`선택지 ${index + 1}`}
              />
            </div>
          ))}
        </div>
      )}

      {/* 저장/취소 버튼 */}
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          저장
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          취소
        </button>
      </div>
    </form>
  );
};

export default CardForm;
```

---

## 7. 학습 모드 구현

### 7-1. 학습 세션 훅

**src/domains/flashcard/hooks/useStudySession.ts:**
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

### 7-2. 서술형 학습 카드

**src/domains/flashcard/components/Study/EssayStudyCard.tsx:**
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      {/* 질문 */}
      <div className="mb-6">
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
          📝 서술형
        </span>
        <h2 className="text-xl font-semibold text-gray-800 mt-4">
          {card.question}
        </h2>
      </div>

      {/* 답변 입력 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          답변을 작성해주세요
        </label>
        <textarea
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md"
          placeholder="여기에 답변을 작성하세요..."
        />
      </div>

      {/* 정답 표시 */}
      {showAnswer && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-2">✅ 정답:</div>
          <p className="text-gray-800">
            {typeof card.answer === 'string' ? card.answer : '정답 오류'}
          </p>
        </div>
      )}

      {/* 버튼 */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          {showAnswer ? '정답 숨기기' : '정답 보기'}
        </button>
        <button
          onClick={() => {
            setUserAnswer('');
            setShowAnswer(false);
          }}
          className="py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          🔄 초기화
        </button>
      </div>
    </div>
  );
};

export default EssayStudyCard;
```

### 7-3. 학습 모드 페이지

**src/pages/StudyMode.tsx:**
```typescript
import { useEffect } from 'react';
import { useStudySession } from '../domains/flashcard/hooks/useStudySession';
import EssayStudyCard from '../domains/flashcard/components/Study/EssayStudyCard';

const StudyMode = () => {
  const {
    currentCard,
    currentCardIndex,
    totalCards,
    progress,
    startSession,
    goToNextCard,
    goToPreviousCard
  } = useStudySession();

  if (!currentCard) {
    return <div className="p-8 text-center">학습할 카드셋을 선택해주세요</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b p-4">
        <div className="container mx-auto max-w-4xl flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-600">
              {currentCardIndex + 1} / {totalCards} 카드
            </div>
            <div className="text-lg font-semibold">{progress}% 완료</div>
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            종료
          </button>
        </div>
      </header>

      {/* 카드 */}
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
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              ← 이전 카드
            </button>
            <button
              onClick={goToNextCard}
              disabled={currentCardIndex === totalCards - 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              다음 카드 →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudyMode;
```

---

## 8. 고급 기능 추가

### 8-1. 키보드 단축키

**StudyMode.tsx에 추가:**
```typescript
// 키보드 이벤트 리스너
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // 입력 필드에 포커스 있으면 무시
    if ((e.target as HTMLElement).tagName === 'TEXTAREA') return;

    if (e.key === 'ArrowLeft') {
      goToPreviousCard();
    } else if (e.key === 'ArrowRight') {
      goToNextCard();
    } else if (e.key === 'Enter') {
      // 정답 보기
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [currentCardIndex]);
```

### 8-2. 마크다운 렌더링

```typescript
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

// 답변 표시 부분
<ReactMarkdown rehypePlugins={[rehypeHighlight]}>
  {card.answer}
</ReactMarkdown>
```

### 8-3. 데이터 Import/Export

**src/pages/Settings.tsx:**
```typescript
import { FlashcardStorage } from '../domains/flashcard/utils/storage';

const Settings = () => {
  const handleExport = () => {
    const data = FlashcardStorage.getCardSets();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `flashcard-export-${new Date().toISOString()}.json`;
    a.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        // 기존 데이터와 병합
        const existing = FlashcardStorage.getCardSets();
        const merged = [...existing, ...imported];
        FlashcardStorage.saveCardSets(merged);
        alert('가져오기 완료!');
      } catch (error) {
        alert('파일 형식이 올바르지 않습니다.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">설정</h2>

      <div className="space-y-4">
        <button
          onClick={handleExport}
          className="w-full p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          📥 데이터 내보내기
        </button>

        <label className="block w-full p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer">
          📤 데이터 가져오기
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

export default Settings;
```

---

## 다음 단계

이 가이드를 따라 기본적인 플래시카드 앱을 구축했습니다. 추가로 구현할 수 있는 기능:

1. **AI 평가 API 연동** (Vercel Serverless Functions)
2. **학습 통계 대시보드**
3. **카드 검색 및 필터링**
4. **다크 모드**
5. **반응형 디자인 개선**
6. **성능 최적화** (React.memo, useMemo, useCallback)

---

## 참고 문서

- [← 프로젝트 구조 가이드](./01-project-structure.md)
- [← 컴포넌트 설계 방법론](./02-component-design.md)
- [React 공식 문서](https://react.dev)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
