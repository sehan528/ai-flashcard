# 개발 가이드

이 문서는 AI Flashcard 프로젝트와 유사한 새 프로젝트를 처음부터 개발할 때의 순서와 패턴을 설명합니다.

## 목차
1. [프로젝트 구조 이해](#프로젝트-구조-이해)
2. [개발 순서](#개발-순서)
3. [네이밍 컨벤션](#네이밍-컨벤션)
4. [상태 관리 패턴](#상태-관리-패턴)
5. [데이터 흐름](#데이터-흐름)
6. [실전 예시: 플래시카드 기능 개발](#실전-예시-플래시카드-기능-개발)
7. [새 기능 추가하기](#새-기능-추가하기)
8. [체크리스트](#체크리스트)

---

## 프로젝트 구조 이해

### 디렉토리 구조

```
src/
├── components/           # 공용 컴포넌트 (여러 도메인에서 사용)
│   ├── Layout/          # 레이아웃 관련 (Header, Footer 등)
│   │   └── Header.tsx
│   ├── UI/              # 재사용 가능한 UI 컴포넌트
│   │   ├── ContextMenu.tsx
│   │   └── RandomToggle.tsx
│   └── AppRouter.tsx    # 라우팅 컴포넌트
│
├── domains/             # 도메인별 구조 (핵심 비즈니스 로직)
│   └── flashcard/       # 도메인명 (예: flashcard, user, payment 등)
│       ├── components/  # 도메인 전용 컴포넌트
│       │   ├── CardSet/
│       │   ├── FlashCard/
│       │   └── Study/
│       ├── dtos/        # 타입 정의 (Data Transfer Objects)
│       │   └── FlashCard.ts
│       ├── hooks/       # 도메인 전용 커스텀 훅
│       │   ├── useAIEvaluation.ts
│       │   └── useStudySession.ts
│       └── utils/       # 도메인 전용 유틸리티
│           └── storage.ts
│
├── hooks/               # 전역 커스텀 훅
│   ├── useAppState.tsx  # 앱 전역 상태 관리
│   └── useStudyActions.tsx
│
├── pages/               # 페이지 컴포넌트 (라우트별 최상위)
│   ├── Home.tsx
│   ├── CardEdit.tsx
│   ├── StudyMode.tsx
│   ├── Statistics.tsx
│   └── Settings.tsx
│
├── App.tsx              # 최상위 라우터
├── MainApp.tsx          # 메인 앱 컨테이너
├── main.tsx             # 엔트리 포인트
└── index.css            # 전역 스타일
```

### 구조 원칙

1. **도메인 중심 설계 (Domain-Driven Design)**
   - 비즈니스 로직을 도메인별로 분리
   - 각 도메인은 독립적으로 관리 가능

2. **단방향 데이터 흐름**
   - Pages → Components → UI
   - Utils → Hooks → Components → Pages

3. **관심사의 분리 (Separation of Concerns)**
   - DTO: 데이터 구조
   - Utils: 데이터 처리 (저장소, API)
   - Hooks: 비즈니스 로직
   - Components: UI 렌더링

---

## 개발 순서

### 1단계: 요구사항 분석 및 설계

**질문할 사항**:
- 어떤 기능을 만들 것인가?
- 어떤 데이터가 필요한가?
- 사용자는 어떻게 상호작용하는가?
- 데이터는 어디에 저장되는가? (LocalStorage, DB, API)

**산출물**:
- 기능 명세서
- 화면 설계 (와이어프레임)
- 데이터 모델 설계

### 2단계: DTO (타입 정의) 작성

**위치**: `src/domains/{domain}/dtos/`

**목적**: TypeScript 타입 정의로 데이터 구조 명확화

**순서**:
```typescript
// 1. 기본 인터페이스 정의
export interface Card {
  id: string;
  question: string;
  answer: string | string[];
  type: 'essay' | 'multiple';
  // ...
}

// 2. 확장 인터페이스
export interface CardSet {
  id: string;
  name: string;
  cards: Card[];
  // ...
}

// 3. 유틸리티 타입
export type CardType = Card['type'];
```

**체크리스트**:
- [ ] 모든 필드에 타입 지정
- [ ] optional 필드는 `?` 표시
- [ ] 유니온 타입은 명확하게 정의
- [ ] 재사용 가능한 타입은 export

### 3단계: Utils (저장소/API) 작성

**위치**: `src/domains/{domain}/utils/`

**목적**: 데이터 CRUD 로직, API 호출

**순서**:
```typescript
// 1. 상수 정의
const STORAGE_KEY = 'flashcards';

// 2. 기본 CRUD
class FlashcardStorage {
  // Create
  static save(data: CardSet): void { }

  // Read
  static getAll(): CardSet[] { }
  static getById(id: string): CardSet | undefined { }

  // Update
  static update(id: string, data: Partial<CardSet>): void { }

  // Delete
  static delete(id: string): void { }
}

// 3. 비즈니스 로직 메서드
class FlashcardStorage {
  static getStatistics(): Statistics { }
  static importFromJSON(json: string): void { }
  static exportToJSON(): string { }
}
```

**체크리스트**:
- [ ] 에러 처리 (try-catch)
- [ ] 데이터 검증 (validation)
- [ ] 타입 안정성 확보
- [ ] 단위 테스트 가능하도록 순수 함수로 작성

### 4단계: Hooks (비즈니스 로직) 작성

**위치**: `src/domains/{domain}/hooks/` 또는 `src/hooks/`

**목적**: 상태 관리와 비즈니스 로직을 컴포넌트에서 분리

**순서**:
```typescript
// 1. 상태 정의
export const useFlashcard = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. 데이터 로드
  useEffect(() => {
    const loadedCards = FlashcardStorage.getAll();
    setCards(loadedCards);
    setIsLoading(false);
  }, []);

  // 3. 액션 함수
  const addCard = (card: Card) => {
    FlashcardStorage.save(card);
    setCards([...cards, card]);
  };

  const deleteCard = (id: string) => {
    FlashcardStorage.delete(id);
    setCards(cards.filter(c => c.id !== id));
  };

  // 4. 반환
  return {
    cards,
    isLoading,
    addCard,
    deleteCard,
  };
};
```

**체크리스트**:
- [ ] 상태와 액션을 명확히 분리
- [ ] useEffect 의존성 배열 확인
- [ ] 메모이제이션 고려 (useMemo, useCallback)
- [ ] 에러 상태 관리

### 5단계: Components (UI) 작성

**위치**: `src/domains/{domain}/components/`

**목적**: UI 렌더링과 사용자 인터랙션

**순서**:

#### A. 작은 컴포넌트부터 (Bottom-Up)
```typescript
// 1. 가장 작은 단위 (Atomic)
export const CardItem = ({ card }: { card: Card }) => {
  return (
    <div className="card">
      <h3>{card.question}</h3>
      <p>{card.answer}</p>
    </div>
  );
};

// 2. 조합 컴포넌트 (Molecule)
export const CardList = ({ cards }: { cards: Card[] }) => {
  return (
    <div className="card-list">
      {cards.map(card => (
        <CardItem key={card.id} card={card} />
      ))}
    </div>
  );
};

// 3. 섹션 컴포넌트 (Organism)
export const CardSection = () => {
  const { cards, addCard, deleteCard } = useFlashcard();

  return (
    <div className="card-section">
      <CardList cards={cards} />
      <AddCardButton onClick={addCard} />
    </div>
  );
};
```

**체크리스트**:
- [ ] Props 타입 명시
- [ ] 이벤트 핸들러 네이밍: `handle{Event}` (예: handleClick)
- [ ] 콜백 Props 네이밍: `on{Event}` (예: onClick)
- [ ] 반응형 디자인 (Mobile-First)
- [ ] 접근성 고려 (키보드 네비게이션, aria-label)

### 6단계: Pages (페이지 통합) 작성

**위치**: `src/pages/`

**목적**: 여러 컴포넌트를 조합하여 완전한 페이지 구성

**순서**:
```typescript
const Home = () => {
  // 1. 전역 상태 가져오기
  const { cardSets, refreshCardSets } = useAppState();

  // 2. 페이지별 로컬 상태
  const [selectedCardSet, setSelectedCardSet] = useState<string | null>(null);

  // 3. 이벤트 핸들러
  const handleCardSetSelect = (id: string) => {
    setSelectedCardSet(id);
  };

  // 4. 레이아웃 구성
  return (
    <div className="page-container">
      <PageHeader title="홈" />
      <CardSetList
        cardSets={cardSets}
        onSelect={handleCardSetSelect}
      />
      {selectedCardSet && (
        <CardSetDetail id={selectedCardSet} />
      )}
    </div>
  );
};
```

**체크리스트**:
- [ ] 로딩 상태 처리
- [ ] 에러 상태 처리
- [ ] 빈 상태 처리 (Empty State)
- [ ] 페이지 제목 설정

### 7단계: 라우팅 연결

**위치**: `src/App.tsx`, `src/components/AppRouter.tsx`

**순서**:
```typescript
// 1. AppRouter에 새 케이스 추가
switch (currentTab) {
  case 'home':
    return <Home />;
  case 'new-feature':  // 새 탭 추가
    return <NewFeature />;
}

// 2. Header에 탭 추가
export type AppTab = 'home' | 'card-edit' | 'new-feature';

// 3. 네비게이션 버튼 추가
<button onClick={() => onTabChange('new-feature')}>
  새 기능
</button>
```

**체크리스트**:
- [ ] 타입 정의 업데이트
- [ ] 네비게이션 UI 추가
- [ ] 기본 라우트 설정
- [ ] 404 처리

---

## 네이밍 컨벤션

### 파일명

```
✅ 좋은 예
CardEdit.tsx          # PascalCase (컴포넌트)
useFlashcard.ts       # camelCase (훅)
storage.ts            # lowercase (유틸리티)
FlashCard.ts          # PascalCase (DTO)

❌ 나쁜 예
card-edit.tsx
UseFlashcard.ts
Storage.ts
flashCard.ts
```

### 변수/함수명

```typescript
// 상태 변수: 명사
const [isLoading, setIsLoading] = useState(false);
const [cardSets, setCardSets] = useState<CardSet[]>([]);

// 이벤트 핸들러: handle{Event}
const handleClick = () => { };
const handleSubmit = () => { };
const handleCardChanged = () => { };

// 콜백 Props: on{Event}
interface Props {
  onClick: () => void;
  onSubmit: (data: Data) => void;
  onCardChanged: () => void;
}

// Boolean: is/has/should + 형용사
const isVisible = true;
const hasError = false;
const shouldRender = true;

// 함수: 동사 + 명사
const fetchData = () => { };
const saveCard = () => { };
const deleteCardSet = () => { };
```

### 컴포넌트명

```typescript
// 도메인별 접두사 사용 (선택적)
CardSetList
CardSetItem
CardEditor

// 공용 컴포넌트는 일반 이름
Button
Modal
Toast
```

---

## 상태 관리 패턴

### 1. 로컬 상태 (Component State)

**사용 시기**: 해당 컴포넌트에서만 사용하는 UI 상태

```typescript
const [isOpen, setIsOpen] = useState(false);
const [inputValue, setInputValue] = useState('');
```

### 2. 전역 상태 (Global State)

**사용 시기**: 여러 컴포넌트에서 공유하는 데이터

```typescript
// useAppState.tsx
export const useAppState = () => {
  const [cardSets, setCardSets] = useState<CardSet[]>([]);

  const refreshCardSets = () => {
    const loaded = FlashcardStorage.getCardSets();
    setCardSets(loaded);
  };

  return { cardSets, refreshCardSets };
};

// MainApp.tsx
const { cardSets, refreshCardSets } = useAppState();

// Props로 전달
<Home cardSets={cardSets} onRefresh={refreshCardSets} />
```

### 3. Props Drilling 해결

**문제**: Props를 여러 레벨로 전달해야 함

**해결책 1**: 커스텀 훅 사용
```typescript
// ❌ Props Drilling
<A data={data}>
  <B data={data}>
    <C data={data} />
  </B>
</A>

// ✅ 커스텀 훅
const A = () => {
  return <B />;
};

const B = () => {
  return <C />;
};

const C = () => {
  const { data } = useAppState(); // 직접 접근
  return <div>{data}</div>;
};
```

**해결책 2**: Context API (필요시)
```typescript
const AppContext = createContext<AppState | null>(null);

export const AppProvider = ({ children }) => {
  const state = useAppState();
  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
```

---

## 데이터 흐름

### Read (읽기)

```
LocalStorage/API
      ↓
   Utils (storage.ts)
      ↓
   Hooks (useFlashcard)
      ↓
   Components
      ↓
   UI Render
```

### Write (쓰기)

```
User Action (Click, Submit)
      ↓
Event Handler (handleSubmit)
      ↓
   Hooks (addCard)
      ↓
   Utils (storage.save)
      ↓
LocalStorage/API
      ↓
State Update (setCards)
      ↓
   Re-render
```

### 예시: 카드 추가하기

```typescript
// 1. UI에서 사용자 입력
<input value={question} onChange={(e) => setQuestion(e.target.value)} />
<button onClick={handleAddCard}>추가</button>

// 2. 이벤트 핸들러
const handleAddCard = () => {
  const newCard = { id: generateId(), question, answer, type: 'essay' };
  addCard(newCard);  // 훅의 액션 호출
};

// 3. 훅에서 처리
const addCard = (card: Card) => {
  FlashcardStorage.save(card);  // 저장소에 저장
  setCards([...cards, card]);    // 상태 업데이트
  onRefresh?.();                 // 전역 상태 갱신 (있다면)
};

// 4. Utils에서 저장
static save(card: Card): void {
  const cards = this.getAll();
  cards.push(card);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

// 5. 상태 업데이트로 자동 리렌더링
```

---

## 실전 예시: 플래시카드 기능 개발

실제 프로젝트에서 플래시카드 기능이 어떻게 개발되었는지 단계별로 설명합니다.

### 1단계: 요구사항 분석

**기능**:
- 플래시카드 생성, 수정, 삭제
- 서술형/객관식 두 가지 타입 지원
- 학습 모드에서 카드 학습
- AI 기반 답변 평가

**데이터 모델**:
- CardSet: 카드들의 그룹
- Card: 개별 플래시카드
- StudyHistory: 학습 기록

### 2단계: DTO 작성

```typescript
// src/domains/flashcard/dtos/FlashCard.ts

// 기본 타입
export type CardType = 'essay' | 'multiple';

// 카드 인터페이스
export interface Card {
  id: string;
  question: string;
  answer: string | string[];  // 서술형: string, 객관식: string[]
  type: CardType;
  correctIndex?: number;      // 객관식 정답 인덱스
  tags: string[];
  createdAt: Date;
  studyCount: number;
}

// 카드셋 인터페이스
export interface CardSet {
  id: string;
  name: string;
  description: string;
  cards: Card[];
  createdAt: Date;
  lastStudied?: Date;
}

// 학습 기록
export interface StudyRecord {
  id: string;
  cardId: string;
  cardSetId: string;
  timestamp: Date;
  date: string;
}

export interface DailyStats {
  date: string;
  cardsStudied: number;
  sessionsCount: number;
  cardSetIds: string[];
}
```

### 3단계: Utils 작성

```typescript
// src/domains/flashcard/utils/storage.ts

const STORAGE_KEY = 'flashcards';
const STUDY_HISTORY_KEY = 'study-history';

export class FlashcardStorage {
  // === CRUD ===

  static getCardSets(): CardSet[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const parsed = JSON.parse(data);
    // Date 객체 복원
    return parsed.map((set: any) => ({
      ...set,
      createdAt: new Date(set.createdAt),
      lastStudied: set.lastStudied ? new Date(set.lastStudied) : undefined,
      cards: set.cards.map((card: any) => ({
        ...card,
        createdAt: new Date(card.createdAt)
      }))
    }));
  }

  static saveCardSets(cardSets: CardSet[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cardSets));
  }

  // === 비즈니스 로직 ===

  static addCardSet(cardSet: CardSet): void {
    const cardSets = this.getCardSets();
    cardSets.push(cardSet);
    this.saveCardSets(cardSets);
  }

  static deleteCardSet(id: string): void {
    const cardSets = this.getCardSets().filter(set => set.id !== id);
    this.saveCardSets(cardSets);
  }

  // === Import/Export ===

  static exportToJSON(): string {
    const cardSets = this.getCardSets();
    return JSON.stringify(cardSets, null, 2);
  }

  static importFromJSON(jsonString: string): void {
    const data = JSON.parse(jsonString);
    const validation = this.validateImportData(data);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    this.saveCardSets(data);
  }

  // === 통계 ===

  static getStatistics() {
    const cardSets = this.getCardSets();
    return {
      totalCardSets: cardSets.length,
      totalCards: cardSets.reduce((sum, set) => sum + set.cards.length, 0),
      totalStudyCount: cardSets.reduce((sum, set) =>
        sum + set.cards.reduce((cardSum, card) => cardSum + card.studyCount, 0), 0
      )
    };
  }
}
```

### 4단계: Hooks 작성

```typescript
// src/hooks/useAppState.tsx

export const useAppState = () => {
  const [cardSets, setCardSets] = useState<CardSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loaded = FlashcardStorage.getCardSets();
    setCardSets(loaded);
    setIsLoading(false);
  }, []);

  const refreshCardSets = () => {
    const loaded = FlashcardStorage.getCardSets();
    setCardSets(loaded);
  };

  return {
    cardSets,
    isLoading,
    refreshCardSets
  };
};
```

```typescript
// src/domains/flashcard/hooks/useStudySession.ts

export const useStudySession = (cardSet: CardSet, isRandom: boolean) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledCards, setShuffledCards] = useState<Card[]>([]);

  useEffect(() => {
    const cards = isRandom
      ? [...cardSet.cards].sort(() => Math.random() - 0.5)
      : cardSet.cards;
    setShuffledCards(cards);
  }, [cardSet, isRandom]);

  const goNext = () => {
    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return {
    currentCard: shuffledCards[currentIndex],
    currentIndex,
    totalCards: shuffledCards.length,
    goNext,
    goPrevious
  };
};
```

### 5단계: Components 작성

```typescript
// src/domains/flashcard/components/CardSet/CardSetItem.tsx

interface CardSetItemProps {
  cardSet: CardSet;
  onEdit: () => void;
  onDelete: () => void;
  onStudy: () => void;
}

export const CardSetItem = ({ cardSet, onEdit, onDelete, onStudy }: CardSetItemProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-xl font-bold">{cardSet.name}</h3>
      <p className="text-gray-600 mt-2">{cardSet.description}</p>
      <div className="flex gap-2 mt-4">
        <button onClick={onStudy} className="btn-primary">
          학습 시작
        </button>
        <button onClick={onEdit} className="btn-secondary">
          편집
        </button>
        <button onClick={onDelete} className="btn-danger">
          삭제
        </button>
      </div>
    </div>
  );
};
```

```typescript
// src/domains/flashcard/components/CardSet/CardSetList.tsx

interface CardSetListProps {
  cardSets: CardSet[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStudy: (cardSet: CardSet) => void;
}

export const CardSetList = ({ cardSets, onEdit, onDelete, onStudy }: CardSetListProps) => {
  if (cardSets.length === 0) {
    return <EmptyState message="카드셋이 없습니다" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cardSets.map(cardSet => (
        <CardSetItem
          key={cardSet.id}
          cardSet={cardSet}
          onEdit={() => onEdit(cardSet.id)}
          onDelete={() => onDelete(cardSet.id)}
          onStudy={() => onStudy(cardSet)}
        />
      ))}
    </div>
  );
};
```

### 6단계: Pages 작성

```typescript
// src/pages/Home.tsx

interface HomeProps {
  cardSets: CardSet[];
  onRefresh: () => void;
  onStartStudy: (cardSet: CardSet, isRandom: boolean) => void;
  onEditCardSet: (id: string) => void;
}

const Home = ({ cardSets, onRefresh, onStartStudy, onEditCardSet }: HomeProps) => {
  const handleDelete = (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      FlashcardStorage.deleteCardSet(id);
      onRefresh();
    }
  };

  const handleStudy = (cardSet: CardSet) => {
    onStartStudy(cardSet, false);  // 순차 학습
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">플래시카드 홈</h1>
      <CardSetList
        cardSets={cardSets}
        onEdit={onEditCardSet}
        onDelete={handleDelete}
        onStudy={handleStudy}
      />
    </div>
  );
};

export default Home;
```

### 7단계: 라우팅 연결

```typescript
// src/components/AppRouter.tsx

const AppRouter = ({ currentTab, cardSets, onRefresh, ... }) => {
  switch (currentTab) {
    case 'home':
      return (
        <Home
          cardSets={cardSets}
          onRefresh={onRefresh}
          onStartStudy={onStartStudy}
          onEditCardSet={onEditCardSet}
        />
      );
    case 'card-edit':
      return <CardEdit onCardChanged={onRefresh} />;
    // ...
  }
};
```

---

## 새 기능 추가하기

### 예시: "즐겨찾기" 기능 추가

#### 1. DTO 수정

```typescript
// src/domains/flashcard/dtos/FlashCard.ts

export interface CardSet {
  id: string;
  name: string;
  description: string;
  cards: Card[];
  createdAt: Date;
  lastStudied?: Date;
  isFavorite: boolean;  // ✅ 추가
}
```

#### 2. Utils 수정

```typescript
// src/domains/flashcard/utils/storage.ts

export class FlashcardStorage {
  static toggleFavorite(id: string): void {
    const cardSets = this.getCardSets();
    const index = cardSets.findIndex(set => set.id === id);
    if (index !== -1) {
      cardSets[index].isFavorite = !cardSets[index].isFavorite;
      this.saveCardSets(cardSets);
    }
  }

  static getFavorites(): CardSet[] {
    return this.getCardSets().filter(set => set.isFavorite);
  }
}
```

#### 3. Component 수정

```typescript
// src/domains/flashcard/components/CardSet/CardSetItem.tsx

export const CardSetItem = ({ cardSet, onToggleFavorite, ... }) => {
  return (
    <div className="card-set-item">
      <button onClick={() => onToggleFavorite(cardSet.id)}>
        {cardSet.isFavorite ? '⭐' : '☆'}
      </button>
      {/* 나머지 UI */}
    </div>
  );
};
```

#### 4. Page 수정

```typescript
// src/pages/Home.tsx

const Home = ({ ... }) => {
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const displayedCardSets = showOnlyFavorites
    ? cardSets.filter(set => set.isFavorite)
    : cardSets;

  const handleToggleFavorite = (id: string) => {
    FlashcardStorage.toggleFavorite(id);
    onRefresh();
  };

  return (
    <div>
      <button onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}>
        {showOnlyFavorites ? '전체 보기' : '즐겨찾기만 보기'}
      </button>
      <CardSetList
        cardSets={displayedCardSets}
        onToggleFavorite={handleToggleFavorite}
        {...otherProps}
      />
    </div>
  );
};
```

---

## 체크리스트

### 새 프로젝트 시작 시

- [ ] 프로젝트 구조 설정 (domains, components, pages)
- [ ] Tailwind CSS 설정
- [ ] TypeScript 설정
- [ ] ESLint 설정
- [ ] Git 초기화

### 새 기능 개발 시

- [ ] 1. 요구사항 명확화
- [ ] 2. DTO 작성 및 타입 정의
- [ ] 3. Utils (저장소/API) 작성
- [ ] 4. Hooks 작성
- [ ] 5. Components 작성 (작은 것부터)
- [ ] 6. Pages 통합
- [ ] 7. 라우팅 연결
- [ ] 8. 테스트 (수동/자동)
- [ ] 9. 리팩토링
- [ ] 10. 문서화

### 코드 리뷰 시

- [ ] 타입 안정성 (any 사용 최소화)
- [ ] 에러 처리 (try-catch)
- [ ] 로딩 상태 처리
- [ ] 빈 상태 처리 (Empty State)
- [ ] 반응형 디자인 (Mobile-First)
- [ ] 접근성 (a11y)
- [ ] 성능 최적화 (useMemo, useCallback)
- [ ] 네이밍 컨벤션 준수

### 배포 전

- [ ] 모든 기능 테스트
- [ ] 크로스 브라우저 테스트
- [ ] 반응형 테스트 (모바일, 태블릿, 데스크톱)
- [ ] 성능 측정 (Lighthouse)
- [ ] 번들 크기 확인
- [ ] 환경 변수 설정
- [ ] README 업데이트

---

## 추가 리소스

- [React 공식 문서](https://react.dev)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [UI/UX 디자인 가이드](./UI_UX_DESIGN.md)

---

## 자주 묻는 질문 (FAQ)

### Q1: 컴포넌트를 언제 분리해야 하나요?

**A**: 다음 경우에 분리를 고려하세요:
- 100줄 이상의 코드
- 재사용 가능한 UI
- 독립적인 기능
- 테스트가 필요한 로직

### Q2: Hooks와 Utils의 차이는?

**A**:
- **Utils**: 순수 함수, 상태 없음, 재사용 가능한 로직
- **Hooks**: React 상태 관리, 라이프사이클, 비즈니스 로직

### Q3: Props Drilling이 심한데 Context를 써야 하나요?

**A**:
1. 먼저 컴포넌트 구조 개선 시도
2. 커스텀 훅으로 해결 가능한지 확인
3. 정말 필요한 경우에만 Context 사용
4. 이 프로젝트는 Context 없이 커스텀 훅으로 해결

### Q4: 어떤 상태를 전역으로 관리해야 하나요?

**A**: 다음 경우에 전역 상태로 관리:
- 여러 페이지에서 공유하는 데이터
- 사용자 인증 정보
- 앱 설정
- 로딩/에러 상태 (선택적)

---

이 가이드를 따라 개발하면 일관성 있고 유지보수하기 쉬운 코드를 작성할 수 있습니다.
