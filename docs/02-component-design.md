# 컴포넌트 설계 방법론

이 문서는 AI Flashcard 프로젝트에서 사용된 React 컴포넌트 설계 패턴과 방법론을 설명합니다. 실제 코드 예시를 통해 어떻게 컴포넌트를 구조화하고 상태를 관리했는지 배울 수 있습니다.

## 목차
1. [컴포넌트 계층 구조](#컴포넌트-계층-구조)
2. [상태 관리 전략](#상태-관리-전략)
3. [Props 설계 원칙](#props-설계-원칙)
4. [컴포넌트 패턴](#컴포넌트-패턴)
5. [실전 예제 분석](#실전-예제-분석)

---

## 컴포넌트 계층 구조

### 페이지 레벨 컴포넌트
**역할:** 라우트와 매핑되며, 전역 상태를 관리하고 하위 컴포넌트를 조합

**예시:** `StudyMode.tsx`
```typescript
// 학습 모드 페이지 - 최상위 컴포넌트
const StudyMode = ({ cardSet, isRandom, onExit }) => {
  // 전역 훅 사용
  const { currentCard, goToNextCard, goToPreviousCard } = useStudySession();

  // 로컬 상태 관리
  const [isAnswerViewed, setIsAnswerViewed] = useState(false);

  // 비즈니스 로직
  const handleGoToNextCard = () => {
    if (currentCard.type === 'essay' && !isAnswerViewed) {
      alert('정답을 확인한 후 다음 카드로 넘어갈 수 있습니다.');
      return;
    }
    goToNextCard();
  };

  return (
    <div>
      <Header />
      {/* 하위 컴포넌트 조합 */}
      {currentCard.type === 'essay' ? (
        <EssayStudyCard card={currentCard} onAnswerViewed={...} />
      ) : (
        <MultipleStudyCard card={currentCard} />
      )}
      <NavigationControls onNext={handleGoToNextCard} />
    </div>
  );
};
```

**특징:**
- 전역 상태 접근 (`useStudySession`)
- 비즈니스 로직 처리 (정답 확인 검증)
- 컴포넌트 조합 (Composition Pattern)

---

### 기능 레벨 컴포넌트
**역할:** 특정 기능을 담당하며, Props로 데이터와 콜백 전달

**예시:** `EssayStudyCard.tsx`
```typescript
interface EssayStudyCardProps {
  card: FlashCard;
  onAnswerViewed?: () => void;  // 옵셔널 콜백
}

const EssayStudyCard = ({ card, onAnswerViewed }: EssayStudyCardProps) => {
  // 로컬 상태 (이 컴포넌트에서만 사용)
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);

  // 도메인 훅 사용
  const { evaluateAnswer, isLoading, result } = useAIEvaluation();

  // 카드 변경 시 초기화
  useEffect(() => {
    setUserAnswer('');
    setShowAnswer(false);
  }, [card.id]);

  // 정답 보기 핸들러
  const handleShowAnswer = () => {
    setShowAnswer(true);
    onAnswerViewed?.();  // 옵셔널 체이닝
  };

  return (
    <div>
      <QuestionDisplay question={card.question} tags={card.tags} />
      <AnswerInput value={userAnswer} onChange={setUserAnswer} />
      {showAnswer && <AnswerDisplay answer={card.answer} />}
      <ActionButtons onShowAnswer={handleShowAnswer} />
    </div>
  );
};
```

**특징:**
- Props로 데이터 전달 받음
- 로컬 상태 관리 (이 컴포넌트 범위)
- 부모에게 이벤트 전달 (콜백 함수)

---

### UI 레벨 컴포넌트
**역할:** 순수 UI, Props만 사용하고 상태 없음 (Stateless)

**예시:** `RandomToggle.tsx`
```typescript
interface RandomToggleProps {
  isRandom: boolean;
  onToggle: (value: boolean) => void;
}

const RandomToggle = ({ isRandom, onToggle }: RandomToggleProps) => {
  return (
    <div>
      <button
        onClick={() => onToggle(false)}
        className={isRandom ? 'inactive' : 'active'}
      >
        순서대로
      </button>
      <button
        onClick={() => onToggle(true)}
        className={isRandom ? 'active' : 'inactive'}
      >
        랜덤
      </button>
    </div>
  );
};
```

**특징:**
- 상태 없음 (Stateless)
- Props로 모든 동작 제어
- 재사용성 극대화

---

## 상태 관리 전략

### 1. 상태를 어디에 둘 것인가?

#### 규칙 1: 최소 공통 부모에 배치
```typescript
// ❌ 나쁜 예: 각 컴포넌트에 중복 상태
const CardList = () => {
  const [cards, setCards] = useState([]);
  // ...
};

const CardStats = () => {
  const [cards, setCards] = useState([]);  // 중복!
  // ...
};

// ✅ 좋은 예: 공통 부모에 상태
const CardPage = () => {
  const [cards, setCards] = useState([]);

  return (
    <>
      <CardList cards={cards} />
      <CardStats cards={cards} />
    </>
  );
};
```

#### 규칙 2: 전역 vs 로컬 판단 기준
**전역 상태 (Context/Hook):**
- 여러 페이지에서 사용
- 예: 카드셋 목록, 사용자 설정

**로컬 상태 (useState):**
- 한 컴포넌트에서만 사용
- 예: 모달 열림/닫힘, 입력 필드 값

**실제 적용:**
```typescript
// 전역: useAppState.tsx
export const useAppState = () => {
  const [cardSets, setCardSets] = useState<CardSet[]>([]);

  const refreshCardSets = () => {
    const sets = FlashcardStorage.getCardSets();
    setCardSets(sets);
  };

  return { cardSets, refreshCardSets };
};

// 로컬: CardSetEditModal.tsx
const [isOpen, setIsOpen] = useState(false);  // 모달 상태는 로컬
```

---

### 2. 상태 업데이트 패턴

#### 불변성 유지 (Immutability)
```typescript
// ❌ 나쁜 예: 직접 수정
const addCard = (newCard) => {
  cardSet.cards.push(newCard);  // Mutation!
  setCardSet(cardSet);
};

// ✅ 좋은 예: 새 객체 생성
const addCard = (newCard) => {
  setCardSet({
    ...cardSet,
    cards: [...cardSet.cards, newCard]
  });
};
```

#### 함수형 업데이트
```typescript
// 이전 상태에 의존하는 경우
setCount(prev => prev + 1);  // ✅ 안전

// vs
setCount(count + 1);  // ⚠️ 클로저 이슈 가능
```

---

## Props 설계 원칙

### 1. 명시적 Props
```typescript
// ❌ 나쁜 예: 모호한 Props
interface CardProps {
  data: any;  // 너무 추상적
  callback: Function;  // 타입 안전성 없음
}

// ✅ 좋은 예: 명확한 Props
interface CardProps {
  card: FlashCard;
  onEdit: (cardId: string) => void;
  onDelete: (cardId: string) => void;
}
```

### 2. 옵셔널 Props
```typescript
interface ModalProps {
  isOpen: boolean;        // 필수
  onClose: () => void;    // 필수
  title?: string;         // 옵셔널
  footer?: ReactNode;     // 옵셔널
}

const Modal = ({ isOpen, onClose, title = '제목 없음', footer }: ModalProps) => {
  // title에 기본값 제공
};
```

### 3. Props 전파 (Spreading)
```typescript
// 재사용 가능한 버튼 컴포넌트
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const Button = ({ variant = 'primary', children, ...props }: ButtonProps) => {
  return (
    <button
      className={`btn btn-${variant}`}
      {...props}  // onClick, disabled 등 자동 전파
    >
      {children}
    </button>
  );
};
```

---

## 컴포넌트 패턴

### 1. Composition Pattern (조합 패턴)
```typescript
// 유연한 레이아웃 구성
const CardEdit = () => {
  return (
    <TwoColumnLayout>
      <LeftPanel>
        <CardSetSelector />
      </LeftPanel>
      <RightPanel>
        <CardListManager />
      </RightPanel>
    </TwoColumnLayout>
  );
};
```

### 2. Render Props Pattern
```typescript
// 로직 재사용
const DataFetcher = ({ url, render }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url).then(res => res.json()).then(setData);
  }, [url]);

  return render({ data, loading });
};

// 사용
<DataFetcher
  url="/api/cards"
  render={({ data, loading }) => (
    loading ? <Spinner /> : <CardList cards={data} />
  )}
/>
```

### 3. Custom Hook Pattern (이 프로젝트에서 사용)
```typescript
// useAIEvaluation.ts - 로직 분리
export const useAIEvaluation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);

  const evaluateAnswer = async (question: string, userAnswer: string, correctAnswer: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai-evaluate', {
        method: 'POST',
        body: JSON.stringify({ question, userAnswer, correctAnswer })
      });
      const data = await response.json();
      setResult(data);
    } finally {
      setIsLoading(false);
    }
  };

  return { evaluateAnswer, isLoading, result };
};

// 컴포넌트에서 사용
const EssayStudyCard = () => {
  const { evaluateAnswer, isLoading, result } = useAIEvaluation();

  return (
    <button onClick={() => evaluateAnswer(...)}>
      {isLoading ? '평가 중...' : 'AI 평가받기'}
    </button>
  );
};
```

---

## 실전 예제 분석

### 예제 1: CardSetGrid 컴포넌트

**파일:** `src/domains/flashcard/components/CardSet/CardSetGrid.tsx`

```typescript
interface CardSetGridProps {
  cardSets: CardSet[];
  onStartStudy: (cardSet: CardSet) => void;
  onEdit: (cardSet: CardSet) => void;
  onDuplicate: (cardSet: CardSet) => void;
  onDelete: (cardSet: CardSet) => void;
}

const CardSetGrid = ({
  cardSets,
  onStartStudy,
  onEdit,
  onDuplicate,
  onDelete
}: CardSetGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
      {cardSets.map((cardSet) => (
        <CardSetItem
          key={cardSet.id}
          cardSet={cardSet}
          onStartStudy={() => onStartStudy(cardSet)}
          onEdit={() => onEdit(cardSet)}
          onDuplicate={() => onDuplicate(cardSet)}
          onDelete={() => onDelete(cardSet)}
        />
      ))}
    </div>
  );
};
```

**설계 분석:**
1. **Props 주입**: 모든 액션을 콜백으로 전달 받음
2. **상태 없음**: 순수 프레젠테이션 컴포넌트
3. **반복 렌더링**: `map`으로 동적 생성
4. **key 속성**: 리스트 렌더링 최적화

---

### 예제 2: useStudySession 훅

**파일:** `src/domains/flashcard/hooks/useStudySession.ts`

```typescript
export const useStudySession = () => {
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // 계산된 값 (useMemo로 최적화)
  const currentCard = useMemo(() => cards[currentCardIndex], [cards, currentCardIndex]);
  const totalCards = cards.length;
  const progress = totalCards > 0 ? Math.round(((currentCardIndex + 1) / totalCards) * 100) : 0;

  // 세션 시작
  const startSession = (cardSet: CardSet, isRandom: boolean) => {
    const sessionCards = isRandom
      ? [...cardSet.cards].sort(() => Math.random() - 0.5)
      : cardSet.cards;
    setCards(sessionCards);
    setCurrentCardIndex(0);
  };

  // 네비게이션
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

  return {
    currentCard,
    currentCardIndex,
    totalCards,
    progress,
    startSession,
    goToNextCard,
    goToPreviousCard
  };
};
```

**설계 분석:**
1. **캡슐화**: 학습 세션 로직을 하나의 훅으로
2. **useMemo**: 불필요한 재계산 방지
3. **명확한 API**: 필요한 값과 함수만 노출
4. **재사용성**: 여러 컴포넌트에서 같은 로직 사용

---

### 예제 3: 조건부 렌더링

```typescript
// StudyMode.tsx
return (
  <div className="mb-8">
    {currentCard.type === 'essay' ? (
      <EssayStudyCard
        card={currentCard}
        onAnswerViewed={() => setIsAnswerViewed(true)}
      />
    ) : (
      <MultipleStudyCard card={currentCard} />
    )}
  </div>
);
```

**패턴:**
- 삼항 연산자로 타입별 컴포넌트 분기
- 각 타입에 맞는 Props 전달

---

## 컴포넌트 설계 체크리스트

### 새 컴포넌트 작성 시

- [ ] **단일 책임**: 컴포넌트가 하나의 역할만 하는가?
- [ ] **Props 타입**: TypeScript 인터페이스로 정의했는가?
- [ ] **상태 위치**: 적절한 레벨에 상태를 배치했는가?
- [ ] **재사용성**: 다른 곳에서도 사용 가능한가?
- [ ] **성능**: 불필요한 리렌더링이 없는가? (useMemo, useCallback)

### 코드 리뷰 시

- [ ] Props가 명확하게 네이밍되었는가?
- [ ] 옵셔널 Props에 기본값이 있는가?
- [ ] useEffect의 의존성 배열이 올바른가?
- [ ] 이벤트 핸들러가 적절히 전달되는가?
- [ ] key 속성이 리스트에 포함되었는가?

---

## 다음 문서

- [← 프로젝트 구조 가이드](./01-project-structure.md)
- [단계별 구현 가이드 →](./03-step-by-step-guide.md)
