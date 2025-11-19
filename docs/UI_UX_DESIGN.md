# UI/UX 디자인 가이드

이 문서는 AI Flashcard 프로젝트의 UI/UX 디자인 결정사항과 구현 방법을 정리합니다.

## 목차
1. [용어 정의](#용어-정의)
2. [반응형 디자인](#반응형-디자인)
3. [Toast 알림 시스템](#toast-알림-시스템)
4. [애니메이션](#애니메이션)
5. [데이터 검증 및 에러 처리](#데이터-검증-및-에러-처리)
6. [학습 통계 시각화](#학습-통계-시각화)
7. [학습 모드 UX](#학습-모드-ux)
8. [접근성](#접근성)

---

## 용어 정의

### Breakpoint (중단점)
화면 크기에 따라 레이아웃이 변경되는 지점입니다. 이 프로젝트는 Tailwind CSS의 기본 breakpoint를 사용합니다:

| Breakpoint | 최소 너비 | 대상 기기 |
|-----------|----------|-----------|
| `sm` | 640px | 모바일 가로 모드, 작은 태블릿 |
| `md` | 768px | 태블릿 |
| `lg` | 1024px | 데스크톱, 노트북 |
| `xl` | 1280px | 큰 데스크톱 |
| `2xl` | 1536px | 초대형 화면 |

**사용 예시**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* 모바일: 1열, 태블릿: 2열, 데스크톱: 3열 */}
</div>
```

### Toast (토스트 알림)
화면 위에 잠시 나타났다가 자동으로 사라지는 임시 메시지입니다. 사용자 액션에 대한 즉각적인 피드백을 제공합니다.

**특징**:
- 비침습적 (Non-intrusive): 사용자의 현재 작업을 방해하지 않음
- 임시적 (Temporary): 3-5초 후 자동 소멸
- 정보성 (Informational): 성공, 오류, 정보 등의 메시지 전달

### Heatmap (히트맵)
데이터의 밀도나 빈도를 색상의 강도로 시각화한 그래프입니다. 이 프로젝트에서는 일별 학습 활동을 표시하는 데 사용됩니다.

### Streak (연속 기록)
연속으로 특정 활동을 수행한 일수를 나타냅니다. 학습 동기 부여를 위해 사용됩니다.

### Context Menu (컨텍스트 메뉴)
우클릭 또는 롱프레스 시 나타나는 상황별 메뉴입니다.

---

## 반응형 디자인

### 1. 모바일 우선 접근 (Mobile-First Approach)

기본 스타일은 모바일을 기준으로 작성하고, 화면이 커질수록 추가 스타일을 적용합니다.

**원칙**:
```tsx
// ❌ 나쁜 예 (Desktop-First)
<div className="w-1/3 md:w-full">

// ✅ 좋은 예 (Mobile-First)
<div className="w-full md:w-1/3">
```

### 2. 카드 가시성 문제 해결

**문제**: 모바일에서 플래시카드의 내용이 화면 밖으로 벗어나 보이지 않는 이슈

**원인**:
```tsx
// 문제가 있던 코드
<div className="h-[60vh] overflow-y-auto">
  {/* 60vh로 고정되어 있어 키보드가 올라오면 내용이 잘림 */}
</div>
```

**해결책**:
```tsx
// src/domains/flashcard/components/Study/StudyCard.tsx
<div className="flex-1 overflow-y-auto min-h-0">
  {/* flex-1: 남은 공간 모두 차지 */}
  {/* min-h-0: flex item의 최소 높이를 0으로 설정하여 overflow 작동 보장 */}
  {/* overflow-y-auto: 내용이 넘치면 스크롤 */}
</div>
```

**핵심 개념**:
- `flex-1`: 부모 컨테이너의 남은 공간을 모두 차지
- `min-h-0`: Flexbox에서 overflow가 정상 작동하도록 최소 높이 제거
- `overflow-y-auto`: 내용이 넘칠 때만 스크롤 표시

### 3. 그리드 레이아웃

**카드셋 목록** (`src/pages/Home.tsx`):
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* 모바일: 1열, 태블릿: 2열, 데스크톱: 3열 */}
</div>
```

**학습 통계 카드**:
```tsx
<div className="grid grid-cols-3 gap-4">
  {/* 모든 화면에서 3열 (통계 카드는 작아서 문제없음) */}
</div>
```

---

## Toast 알림 시스템

### 1. 구현 위치

**파일**: `src/pages/Settings.tsx` (설정 페이지에서 주로 사용)

### 2. 디자인 원칙

**위치**: 화면 중앙 (모바일/데스크톱 모두 시인성 보장)

```tsx
<div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
  {/*
    fixed: 스크롤과 무관하게 viewport에 고정
    inset-0: top, right, bottom, left 모두 0 (전체 화면)
    flex items-center justify-center: 중앙 정렬
    z-50: 모든 요소 위에 표시
    pointer-events-none: 배경 클릭 가능
  */}
  <div className="pointer-events-auto">
    {/* pointer-events-auto: 메시지 자체는 클릭 가능 */}
  </div>
</div>
```

### 3. 색상 체계

```tsx
const getToastColor = (type: 'success' | 'error' | 'info') => {
  switch (type) {
    case 'success':
      return 'bg-green-50 text-green-800 border-2 border-green-300';
    case 'error':
      return 'bg-red-50 text-red-800 border-2 border-red-300';
    case 'info':
      return 'bg-blue-50 text-blue-800 border-2 border-blue-300';
  }
};
```

**시각적 위계**:
- **녹색**: 성공 (긍정적 피드백)
- **빨간색**: 오류 (주의 필요)
- **파란색**: 정보 (중립적 안내)

### 4. 지속 시간

```typescript
const showMessage = (type, text, duration = 3000) => {
  // 기본 3초, 중요한 메시지는 5초
};
```

**가이드라인**:
- 성공 메시지: 3초 (짧고 긍정적)
- 오류 메시지: 3초 (빠른 확인 필요)
- 정보 메시지: 5초 (읽을 내용이 많을 수 있음)

---

## 애니메이션

### 1. Fade-In (나타나기)

**목적**: 요소가 부드럽게 나타나 갑작스러운 변화를 방지

```css
/* src/index.css */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
```

**효과**:
- `opacity`: 0 → 1 (투명 → 불투명)
- `translateY`: -10px → 0 (위에서 아래로 살짝 이동)
- `duration`: 0.3초 (빠르지만 부드러움)

### 2. Fade-Out (사라지기)

**목적**: 요소가 부드럽게 사라져 갑작스러운 소멸 방지

```css
/* src/index.css */
@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}

.animate-fade-out {
  animation: fadeOut 0.3s ease-in-out;
}
```

**구현 로직**:
```typescript
const showMessage = (type, text, duration = 3000) => {
  setMessage({ type, text });
  setIsMessageExiting(false);  // Fade-in 시작

  setTimeout(() => {
    setIsMessageExiting(true);  // Fade-out 시작
    setTimeout(() => {
      setMessage(null);  // DOM에서 제거
      setIsMessageExiting(false);
    }, 300);  // 애니메이션 시간과 동일
  }, duration);
};
```

**핵심 포인트**:
1. 메시지 표시 → Fade-in 애니메이션
2. `duration` 대기 (3초)
3. Fade-out 애니메이션 시작
4. 애니메이션 완료 (0.3초) 후 DOM에서 제거

### 3. 애니메이션 적용

```tsx
<div className={`
  ${isMessageExiting ? 'animate-fade-out' : 'animate-fade-in'}
`}>
  {message.text}
</div>
```

---

## 데이터 검증 및 에러 처리

### 1. 데이터 타입 자동 감지

**문제**: 사용자가 학습 데이터에 유저 데이터를 넣거나 그 반대로 실수

**해결책**: `detectDataType()` 함수로 자동 감지 (`src/domains/flashcard/utils/storage.ts`)

```typescript
static detectDataType(data: any): 'cardset' | 'studyhistory' | 'unknown' {
  // 학습 기록 타입 체크
  if (data.records !== undefined || data.dailyStats !== undefined) {
    return 'studyhistory';
  }

  // 카드셋 배열
  if (Array.isArray(data) && data[0]?.cards !== undefined) {
    return 'cardset';
  }

  // 단일 카드셋
  if (data.id && data.name && data.cards) {
    return 'cardset';
  }

  return 'unknown';
}
```

### 2. 명확한 에러 메시지

**원칙**: 사용자가 무엇이 잘못되었고 어떻게 해야 하는지 명확히 알려주기

**잘못된 데이터 타입 업로드**:
```typescript
// 학습 데이터에 유저 데이터 넣을 때
return {
  valid: false,
  error: '이 파일은 학습 기록 데이터입니다.\n\'유저 데이터 관리\' 섹션에서 가져오기를 사용하세요.'
};

// 유저 데이터에 학습 데이터 넣을 때
return {
  valid: false,
  error: '이 파일은 카드셋 데이터입니다.\n\'학습 데이터 관리\' 섹션에서 가져오기를 사용하세요.'
};
```

**에러 메시지 구조**:
1. **무엇이 문제인가**: "이 파일은 학습 기록 데이터입니다"
2. **어떻게 해결하는가**: "유저 데이터 관리 섹션에서 가져오기를 사용하세요"

### 3. 필드별 상세 검증

```typescript
static validateCardSet(set: any): { valid: boolean; error?: string } {
  // 1단계: 타입 체크
  if (typeof set !== 'object' || set === null) {
    return { valid: false, error: '올바른 플래시카드 형식이 아닙니다.' };
  }

  // 2단계: 필수 필드
  if (typeof set.id !== 'string' || !set.id) {
    return { valid: false, error: '카드셋 ID가 올바르지 않습니다.' };
  }

  if (typeof set.name !== 'string' || !set.name) {
    return { valid: false, error: '카드셋 이름이 올바르지 않습니다.' };
  }

  // 3단계: 카드 배열 검증
  if (!Array.isArray(set.cards)) {
    return { valid: false, error: '카드 목록이 배열 형태가 아닙니다.' };
  }

  // 4단계: 각 카드 검증
  for (const card of set.cards) {
    if (card.type !== 'essay' && card.type !== 'multiple') {
      return {
        valid: false,
        error: '카드 타입은 "essay" 또는 "multiple"이어야 합니다.'
      };
    }
  }

  return { valid: true };
}
```

**검증 순서의 중요성**:
1. 기본 타입 → 2. 필수 필드 → 3. 구조 검증 → 4. 상세 검증

---

## 학습 통계 시각화

### 1. Heatmap (히트맵)

**파일**: `src/pages/Statistics.tsx`

**목적**: 일별 학습 활동을 색상 강도로 시각화하여 패턴 파악

```tsx
const getHeatColor = (count: number, maxCount: number) => {
  if (count === 0) return 'bg-gray-100';

  const intensity = count / maxCount;
  if (intensity >= 0.75) return 'bg-green-600';
  if (intensity >= 0.5) return 'bg-green-500';
  if (intensity >= 0.25) return 'bg-green-400';
  return 'bg-green-300';
};
```

**색상 단계**:
- **회색** (`bg-gray-100`): 학습 없음 (0개)
- **연한 녹색** (`bg-green-300`): 낮은 활동 (1-25%)
- **중간 녹색** (`bg-green-400`): 보통 활동 (25-50%)
- **진한 녹색** (`bg-green-500`): 높은 활동 (50-75%)
- **매우 진한 녹색** (`bg-green-600`): 최고 활동 (75-100%)

**반응형 디자인**:
```tsx
// 모바일: 최근 84일 (12주)
// 데스크톱: 최근 168일 (24주)
const daysToShow = isSmallScreen ? 84 : 168;
```

### 2. Streak (연속 학습일)

**계산 로직**:
```typescript
static getStudyStreak(): number {
  const history = this.getStudyHistory();
  let streak = 0;
  let currentDate = new Date();

  // 오늘부터 역순으로 체크
  while (true) {
    const dateStr = this.getDateString(currentDate);
    const stat = history.dailyStats[dateStr];

    if (stat && stat.cardsStudied > 0) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;  // 연속 끊김
    }
  }

  return streak;
}
```

**표시 디자인**:
```tsx
<div className="text-center p-4 bg-orange-50 rounded-lg">
  <div className="text-2xl font-bold text-orange-600">
    🔥 {streak}일
  </div>
  <div className="text-sm text-gray-600 mt-1">연속 학습</div>
</div>
```

**동기 부여 효과**:
- 🔥 이모지: 열정을 상징
- 주황색: 따뜻하고 에너지 넘치는 느낌
- 숫자 강조: 큰 폰트와 굵은 글씨

### 3. View 전환 (일별/주별/월별)

```tsx
<div className="flex gap-2 mb-4">
  <button
    onClick={() => setView('daily')}
    className={`px-4 py-2 rounded-lg ${
      view === 'daily'
        ? 'bg-blue-500 text-white'
        : 'bg-gray-200 text-gray-700'
    }`}
  >
    일별
  </button>
  {/* 주별, 월별 버튼 */}
</div>
```

**UX 고려사항**:
- **명확한 선택 상태**: 파란색 배경으로 현재 view 표시
- **빠른 전환**: 즉시 반영 (로딩 없음)
- **데이터 집계**: 각 view에 맞게 데이터 그룹화

---

## 학습 모드 UX

### 1. 셔플 기능

**위치**: `src/components/UI/RandomToggle.tsx`

**디자인**:
```tsx
<button
  onClick={handleToggle}
  disabled={disabled}
  className={`
    relative px-6 py-3 rounded-lg font-medium
    transition-all duration-200
    ${isRandom
      ? 'bg-purple-500 text-white hover:bg-purple-600'
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }
    disabled:opacity-50 disabled:cursor-not-allowed
  `}
>
  🔀 {isRandom ? '셔플 중' : '순차 학습'}
</button>
```

**Toast 피드백**:
```typescript
const handleToggle = () => {
  const newState = !isRandom;
  onToggle(newState);

  // 즉각적인 시각적 피드백
  setShowToast(true);
  setTimeout(() => setShowToast(false), 2000);
};
```

**작은 Toast 디자인** (설정 페이지와 다름):
```tsx
<div className="fixed top-20 left-1/2 transform -translate-x-1/2
              bg-purple-100 text-purple-800 px-4 py-2 rounded-lg
              shadow-lg animate-fade-in z-50">
  🔀 카드 순서가 변경되었습니다!
</div>
```

**차이점**:
- 위치: 상단 (설정 페이지는 중앙)
- 크기: 작음 (한 줄 메시지)
- 지속시간: 2초 (설정은 3초)

### 2. 진행률 표시

```tsx
<div className="flex justify-between items-center mb-4">
  <span className="text-sm text-gray-600">
    {currentIndex + 1} / {totalCards}
  </span>
  <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
    <div
      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
      style={{ width: `${progress}%` }}
    />
  </div>
  <span className="text-sm font-semibold text-blue-600">
    {progress}%
  </span>
</div>
```

**진행률 바 특징**:
- 부드러운 전환: `transition-all duration-300`
- 시각적 피드백: 퍼센트와 바 동시 표시
- 색상: 파란색 (진행 = 긍정적)

### 3. 키보드 단축키

**지원 단축키**:
```typescript
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    // 이전/다음 카드
    if (e.key === 'ArrowLeft') onPrevious();
    if (e.key === 'ArrowRight') onNext();

    // 정답 보기
    if (e.key === 'Enter') onShowAnswer();

    // 객관식 선택 (1-0 = 선택지 1-10)
    if (/^[1-9]$/.test(e.key)) {
      const index = parseInt(e.key) - 1;
      selectOption(index);
    }
    if (e.key === '0') selectOption(9);  // 0 = 10번째
  };

  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

**단축키 표시** (하단에 힌트):
```tsx
<div className="text-xs text-gray-500 text-center mt-4">
  💡 키보드 단축키: ← → (이동) | Enter (정답보기) | 1-0 (객관식 선택)
</div>
```

---

## 접근성

### 1. 키보드 네비게이션

**원칙**: 마우스 없이도 모든 기능 사용 가능

**구현 예시**:
```tsx
<button
  tabIndex={0}
  onKeyDown={(e) => e.key === 'Enter' && onClick()}
  onClick={onClick}
>
  클릭
</button>
```

### 2. 의미론적 HTML

```tsx
// ❌ 나쁜 예
<div onClick={handleClick}>버튼</div>

// ✅ 좋은 예
<button onClick={handleClick}>버튼</button>
```

### 3. Alt 텍스트

```tsx
<img src="logo.svg" alt="AI Flashcard 로고" />
```

### 4. 색맹 고려

**원칙**: 색상만으로 정보를 전달하지 않기

```tsx
// ✅ 좋은 예: 색상 + 아이콘 + 텍스트
<div className="text-red-600">
  ❌ 오류: 파일을 찾을 수 없습니다
</div>

<div className="text-green-600">
  ✅ 성공: 저장되었습니다
</div>
```

---

## 디자인 시스템 요약

### 색상 팔레트

| 용도 | 색상 | Tailwind Class |
|------|------|----------------|
| Primary | 파란색 | `bg-blue-500` |
| Success | 녹색 | `bg-green-500` |
| Error | 빨간색 | `bg-red-500` |
| Warning | 주황색 | `bg-orange-500` |
| Info | 하늘색 | `bg-blue-400` |
| Neutral | 회색 | `bg-gray-500` |

### 간격 (Spacing)

- 작은 간격: `gap-2` (0.5rem / 8px)
- 중간 간격: `gap-4` (1rem / 16px)
- 큰 간격: `gap-6` (1.5rem / 24px)
- 섹션 간격: `mb-8` (2rem / 32px)

### 모서리 (Border Radius)

- 버튼: `rounded-lg` (0.5rem / 8px)
- 카드: `rounded-xl` (0.75rem / 12px)
- 작은 요소: `rounded` (0.25rem / 4px)
- 원형: `rounded-full`

### 그림자 (Shadow)

- 작은 그림자: `shadow-sm`
- 중간 그림자: `shadow-md`
- 큰 그림자: `shadow-lg`
- 매우 큰 그림자: `shadow-2xl` (Toast 등)

---

## 참고 자료

- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [React 접근성 가이드](https://react.dev/learn/accessibility)
- [WCAG 2.1 가이드라인](https://www.w3.org/WAI/WCAG21/quickref/)

---

이 문서는 프로젝트가 발전함에 따라 지속적으로 업데이트됩니다.
