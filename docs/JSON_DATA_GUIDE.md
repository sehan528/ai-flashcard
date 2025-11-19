# JSON 데이터 생성 가이드

AI Flashcard에서 사용할 수 있는 JSON 데이터를 생성하는 방법을 안내합니다.

## 목차
- [개요](#개요)
- [카드셋 JSON 형식](#카드셋-json-형식)
- [필수 필드](#필수-필드)
- [선택 필드](#선택-필드)
- [카드 타입별 예시](#카드-타입별-예시)
- [다중 카드셋 생성](#다중-카드셋-생성)
- [검증 규칙](#검증-규칙)
- [일반적인 실수와 해결법](#일반적인-실수와-해결법)

## 개요

AI Flashcard는 표준 JSON 형식의 카드셋 파일을 가져올 수 있습니다. AI 챗봇이나 다른 학습 자료에서 문제를 추출하여 JSON으로 변환하면 쉽게 가져올 수 있습니다.

### 기본 구조

```json
{
  "id": "고유한-카드셋-ID",
  "name": "카드셋 이름",
  "description": "카드셋 설명",
  "createdAt": "ISO 8601 날짜 형식",
  "cards": [
    // 카드 배열
  ]
}
```

## 카드셋 JSON 형식

### 최소 형식 (필수 필드만)

```json
{
  "id": "javascript-basics-001",
  "name": "JavaScript 기초",
  "description": "JavaScript 기본 개념 학습",
  "createdAt": "2025-01-15T10:00:00.000Z",
  "cards": [
    {
      "id": "card-001",
      "question": "호이스팅이란 무엇인가요?",
      "answer": "변수와 함수 선언이 스코프 최상단으로 끌어올려지는 JavaScript의 특성입니다.",
      "type": "essay",
      "tags": [],
      "createdAt": "2025-01-15T10:00:00.000Z",
      "studyCount": 0
    }
  ]
}
```

### 전체 형식 (모든 필드 포함)

```json
{
  "id": "react-advanced-002",
  "name": "React 고급 개념",
  "description": "React Hooks와 상태 관리 패턴",
  "createdAt": "2025-01-15T14:30:00.000Z",
  "cards": [
    {
      "id": "card-react-001",
      "question": "useEffect의 의존성 배열이 비어있으면 어떻게 동작하나요?",
      "answer": "컴포넌트가 마운트될 때 한 번만 실행되고, 언마운트될 때 정리 함수가 실행됩니다.",
      "type": "essay",
      "tags": ["React", "Hooks", "useEffect"],
      "createdAt": "2025-01-15T14:31:00.000Z",
      "studyCount": 0
    },
    {
      "id": "card-react-002",
      "question": "다음 중 React의 상태 관리 라이브러리가 아닌 것은?",
      "answer": ["Redux", "Zustand", "Recoil", "Express"],
      "type": "multiple",
      "correctIndex": 3,
      "tags": ["React", "상태관리"],
      "createdAt": "2025-01-15T14:32:00.000Z",
      "studyCount": 0
    }
  ]
}
```

## 필수 필드

### 카드셋 레벨

| 필드 | 타입 | 설명 | 예시 |
|------|------|------|------|
| `id` | string | 고유 식별자 (중복 방지용) | `"javascript-basics-001"` |
| `name` | string | 카드셋 이름 (최대 30자) | `"JavaScript 기초"` |
| `description` | string | 카드셋 설명 (최대 150자) | `"JavaScript 기본 개념 학습"` |
| `createdAt` | string (ISO 8601) | 생성 날짜 | `"2025-01-15T10:00:00.000Z"` |
| `cards` | array | 카드 배열 | `[...]` |

### 카드 레벨 (공통)

| 필드 | 타입 | 설명 | 예시 |
|------|------|------|------|
| `id` | string | 고유 식별자 | `"card-001"` |
| `question` | string | 문제 내용 | `"호이스팅이란?"` |
| `answer` | string \| array | 답변 (타입별 상이) | 아래 참조 |
| `type` | "essay" \| "multiple" | 카드 타입 | `"essay"` |
| `tags` | array | 태그 배열 | `["JavaScript", "기초"]` |
| `createdAt` | string (ISO 8601) | 생성 날짜 | `"2025-01-15T10:00:00.000Z"` |
| `studyCount` | number | 학습 횟수 | `0` |

### 카드 레벨 (객관식 전용)

| 필드 | 타입 | 설명 | 예시 |
|------|------|------|------|
| `correctIndex` | number | 정답 인덱스 (0부터 시작) | `2` |

## 선택 필드

### 선택적 메타데이터

```json
{
  "id": "custom-cardset-001",
  "name": "커스텀 카드셋",
  "description": "설명 추가",
  "createdAt": "2025-01-15T10:00:00.000Z",

  // 선택 필드들 (앱이 자동으로 처리)
  "lastModified": "2025-01-16T15:30:00.000Z",  // 마지막 수정 시간
  "metadata": {                                 // 추가 메타데이터
    "difficulty": "intermediate",
    "estimatedTime": "30 minutes"
  },

  "cards": [...]
}
```

**참고**: 위 선택 필드들은 앱에서 무시되지만, 사용자가 자체적으로 관리 목적으로 추가할 수 있습니다.

## 카드 타입별 예시

### 1. 서술형 카드 (Essay)

서술형 카드는 자유롭게 답변을 작성하는 문제입니다. 답변은 문자열이며 **마크다운 형식**을 지원합니다.

#### 기본 서술형

```json
{
  "id": "essay-basic-001",
  "question": "React의 Virtual DOM이란 무엇인가요?",
  "answer": "실제 DOM의 가벼운 복사본으로, React가 UI 변경사항을 효율적으로 관리하기 위해 사용하는 개념입니다.",
  "type": "essay",
  "tags": ["React", "Virtual DOM"],
  "createdAt": "2025-01-15T10:00:00.000Z",
  "studyCount": 0
}
```

#### 마크다운 형식 서술형

```json
{
  "id": "essay-markdown-001",
  "question": "JavaScript의 map() 메서드를 설명하고 예시 코드를 작성하세요.",
  "answer": "# map() 메서드\n\n배열의 각 요소에 함수를 적용하여 **새로운 배열**을 반환합니다.\n\n## 예시 코드\n\n```javascript\nconst numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(num => num * 2);\nconsole.log(doubled); // [2, 4, 6, 8, 10]\n```\n\n## 특징\n- 원본 배열을 변경하지 않음\n- 새로운 배열을 생성하여 반환",
  "type": "essay",
  "tags": ["JavaScript", "배열", "메서드"],
  "createdAt": "2025-01-15T10:00:00.000Z",
  "studyCount": 0
}
```

**마크다운 지원 기능**:
- 제목 (`#`, `##`, `###`)
- 강조 (`**굵게**`, `*기울임*`)
- 코드 블록 (` ```언어 ` ... ` ``` `)
- 인라인 코드 (`` `code` ``)
- 목록 (`-`, `*`, `1.`)
- 링크 (`[텍스트](URL)`)

### 2. 객관식 카드 (Multiple Choice)

객관식 카드는 2~10개의 선택지 중 하나를 고르는 문제입니다.

#### 4지선다형

```json
{
  "id": "multiple-choice-001",
  "question": "다음 중 JavaScript의 원시 타입(Primitive Type)이 아닌 것은?",
  "answer": ["string", "number", "boolean", "object"],
  "type": "multiple",
  "correctIndex": 3,
  "tags": ["JavaScript", "타입"],
  "createdAt": "2025-01-15T10:00:00.000Z",
  "studyCount": 0
}
```

**중요**: `correctIndex`는 0부터 시작합니다!
- `0`: 첫 번째 선택지 ("string")
- `1`: 두 번째 선택지 ("number")
- `2`: 세 번째 선택지 ("boolean")
- `3`: 네 번째 선택지 ("object") ← 정답

#### 2지선다형 (O/X 문제)

```json
{
  "id": "true-false-001",
  "question": "JavaScript는 싱글 스레드 언어이다.",
  "answer": ["O (맞다)", "X (틀리다)"],
  "type": "multiple",
  "correctIndex": 0,
  "tags": ["JavaScript", "개념"],
  "createdAt": "2025-01-15T10:00:00.000Z",
  "studyCount": 0
}
```

#### 10지선다형

```json
{
  "id": "multiple-choice-max-001",
  "question": "다음 중 HTTP 상태 코드 중 '성공'을 나타내는 것은?",
  "answer": [
    "100 Continue",
    "200 OK",
    "300 Multiple Choices",
    "400 Bad Request",
    "401 Unauthorized",
    "403 Forbidden",
    "404 Not Found",
    "500 Internal Server Error",
    "502 Bad Gateway",
    "503 Service Unavailable"
  ],
  "type": "multiple",
  "correctIndex": 1,
  "tags": ["HTTP", "상태코드"],
  "createdAt": "2025-01-15T10:00:00.000Z",
  "studyCount": 0
}
```

## 다중 카드셋 생성

한 번에 여러 카드셋을 가져오려면 각 카드셋을 별도의 JSON 파일로 저장하세요.

### 예시 파일 구조

```
my-flashcards/
├── javascript-basics.json      # JavaScript 기초
├── react-hooks.json            # React Hooks
├── typescript-types.json       # TypeScript 타입
└── algorithm-basics.json       # 알고리즘 기초
```

**가져오기 방법**:
1. 설정 탭 → 학습 데이터 관리
2. "카드셋 가져오기" 클릭
3. 여러 파일 선택 (Ctrl/Cmd + 클릭)
4. "열기" 클릭

앱이 자동으로:
- 모든 파일을 검증
- 유효한 파일만 가져오기
- 중복된 ID 자동 필터링
- 오류 발생 시 명확한 메시지 표시

## 검증 규칙

앱이 자동으로 검증하는 항목들:

### 카드셋 레벨 검증

✅ **통과 조건**:
- `id`, `name`, `description`, `createdAt`, `cards` 필드 존재
- `name`이 30자 이하
- `description`이 150자 이하
- `cards`가 배열
- `createdAt`이 ISO 8601 날짜 형식

❌ **오류 예시**:
```json
{
  // ❌ id 누락
  "name": "JavaScript",
  "description": "설명",
  "createdAt": "2025-01-15",
  "cards": []
}
```

### 카드 레벨 검증

✅ **서술형 통과 조건**:
- `type`이 `"essay"`
- `answer`가 문자열 (string)
- 모든 필수 필드 존재

❌ **서술형 오류 예시**:
```json
{
  "id": "card-001",
  "question": "질문",
  "answer": ["배열로 주면 안됨"],  // ❌ essay는 문자열이어야 함
  "type": "essay",
  "tags": [],
  "createdAt": "2025-01-15T10:00:00.000Z",
  "studyCount": 0
}
```

✅ **객관식 통과 조건**:
- `type`이 `"multiple"`
- `answer`가 배열 (2~10개 요소)
- `correctIndex`가 유효한 범위 (0 ~ answer.length-1)
- 모든 필수 필드 존재

❌ **객관식 오류 예시**:
```json
{
  "id": "card-002",
  "question": "질문",
  "answer": ["선택지1", "선택지2"],
  "type": "multiple",
  "correctIndex": 5,  // ❌ answer는 2개인데 인덱스가 5
  "tags": [],
  "createdAt": "2025-01-15T10:00:00.000Z",
  "studyCount": 0
}
```

### 날짜 형식

ISO 8601 형식을 사용하세요:

✅ **올바른 형식**:
```
"2025-01-15T10:30:00.000Z"
"2025-01-15T14:30:00+09:00"
```

❌ **잘못된 형식**:
```
"2025-01-15"          // ❌ 시간 누락
"2025/01/15 10:30"    // ❌ 잘못된 구분자
"Jan 15, 2025"        // ❌ 텍스트 형식
```

**쉬운 변환 방법** (JavaScript):
```javascript
new Date().toISOString()
// "2025-01-15T10:30:00.000Z"
```

## 일반적인 실수와 해결법

### 1. ID 중복

**문제**:
```json
// 파일1.json
{"id": "cardset-001", ...}

// 파일2.json
{"id": "cardset-001", ...}  // ❌ 같은 ID
```

**해결**:
- 각 카드셋에 고유한 ID 부여
- 형식: `{주제}-{날짜}-{번호}` 추천
- 예시: `"javascript-20250115-001"`

### 2. 타입 불일치

**문제**:
```json
{
  "type": "essay",
  "answer": ["배열"],  // ❌ essay는 문자열이어야 함
  "correctIndex": 0   // ❌ essay에는 correctIndex 불필요
}
```

**해결**:
```json
{
  "type": "essay",
  "answer": "문자열 답변"
}
```

### 3. correctIndex 범위 초과

**문제**:
```json
{
  "type": "multiple",
  "answer": ["A", "B", "C"],
  "correctIndex": 3  // ❌ 인덱스는 0,1,2만 유효
}
```

**해결**:
```json
{
  "type": "multiple",
  "answer": ["A", "B", "C"],
  "correctIndex": 2  // ✅ 세 번째 항목 (C)
}
```

### 4. 태그를 문자열로 지정

**문제**:
```json
{
  "tags": "JavaScript, React"  // ❌ 배열이어야 함
}
```

**해결**:
```json
{
  "tags": ["JavaScript", "React"]  // ✅ 배열 형식
}
```

### 5. 잘못된 JSON 구조

**문제**:
```json
{
  "id": "test",
  "name": "Test"  // ❌ 마지막 쉼표 제거
  "description": "",
}
```

**해결**:
- JSON validator 사용 (https://jsonlint.com)
- 코드 에디터의 JSON 포매터 활용
- 불필요한 쉼표 제거

## AI를 활용한 JSON 생성

### ChatGPT 프롬프트 예시

```
다음 문제집을 AI Flashcard용 JSON 형식으로 변환해줘.

형식:
{
  "id": "고유ID",
  "name": "카드셋 이름",
  "description": "설명",
  "createdAt": "ISO 8601 날짜",
  "cards": [
    {
      "id": "카드ID",
      "question": "질문",
      "answer": "답변" (서술형) 또는 ["선택1", "선택2", ...] (객관식),
      "type": "essay" 또는 "multiple",
      "correctIndex": 숫자 (객관식만),
      "tags": ["태그1", "태그2"],
      "createdAt": "ISO 8601 날짜",
      "studyCount": 0
    }
  ]
}

문제집:
1. JavaScript의 클로저란?
   답변: 함수와 그 함수가 선언된 렉시컬 환경의 조합

2. 다음 중 배열 메서드가 아닌 것은? (정답: 3번)
   1) map
   2) filter
   3) append
   4) reduce
```

### Claude 프롬프트 예시

```
아래 학습 자료를 AI Flashcard 앱용 JSON 카드셋으로 만들어줘.

규칙:
- 서술형 문제는 type: "essay", answer는 문자열
- 객관식 문제는 type: "multiple", answer는 배열, correctIndex 필요
- 모든 날짜는 ISO 8601 형식
- tags는 배열 형식
- studyCount는 0으로 설정

학습 자료:
[여기에 학습 자료 붙여넣기]
```

## 완성 예시

### JavaScript 기초 카드셋

```json
{
  "id": "javascript-basics-20250115",
  "name": "JavaScript 기초 개념",
  "description": "JavaScript의 기본 개념과 주요 특징",
  "createdAt": "2025-01-15T09:00:00.000Z",
  "cards": [
    {
      "id": "js-basic-001",
      "question": "JavaScript의 호이스팅(Hoisting)을 설명하세요.",
      "answer": "변수 선언과 함수 선언이 해당 스코프의 최상단으로 끌어올려지는 JavaScript의 동작 방식입니다. var로 선언된 변수는 호이스팅되지만 초기화는 호이스팅되지 않으며, let과 const는 TDZ(Temporal Dead Zone) 구간에 있어 접근 시 에러가 발생합니다.",
      "type": "essay",
      "tags": ["JavaScript", "호이스팅", "스코프"],
      "createdAt": "2025-01-15T09:01:00.000Z",
      "studyCount": 0
    },
    {
      "id": "js-basic-002",
      "question": "다음 중 JavaScript의 Falsy 값이 아닌 것은?",
      "answer": ["0", "''", "null", "[]"],
      "type": "multiple",
      "correctIndex": 3,
      "tags": ["JavaScript", "타입", "Falsy"],
      "createdAt": "2025-01-15T09:02:00.000Z",
      "studyCount": 0
    },
    {
      "id": "js-basic-003",
      "question": "클로저(Closure)를 설명하고 활용 예시를 작성하세요.",
      "answer": "# 클로저(Closure)\n\n함수와 그 함수가 선언된 렉시컬 환경의 조합입니다.\n\n## 특징\n- 외부 함수의 변수에 접근 가능\n- 데이터 은닉과 캡슐화 가능\n\n## 예시\n\n```javascript\nfunction counter() {\n  let count = 0;\n  return {\n    increment: () => ++count,\n    decrement: () => --count,\n    getCount: () => count\n  };\n}\n\nconst myCounter = counter();\nmyCounter.increment(); // 1\nmyCounter.increment(); // 2\nmyCounter.getCount();  // 2\n```",
      "type": "essay",
      "tags": ["JavaScript", "클로저", "함수"],
      "createdAt": "2025-01-15T09:03:00.000Z",
      "studyCount": 0
    },
    {
      "id": "js-basic-004",
      "question": "Promise는 몇 가지 상태를 가지나요?",
      "answer": ["1개", "2개", "3개", "4개"],
      "type": "multiple",
      "correctIndex": 2,
      "tags": ["JavaScript", "Promise", "비동기"],
      "createdAt": "2025-01-15T09:04:00.000Z",
      "studyCount": 0
    },
    {
      "id": "js-basic-005",
      "question": "const로 선언한 객체의 프로퍼티를 변경할 수 있나요?",
      "answer": ["가능하다", "불가능하다"],
      "type": "multiple",
      "correctIndex": 0,
      "tags": ["JavaScript", "const", "변수"],
      "createdAt": "2025-01-15T09:05:00.000Z",
      "studyCount": 0
    }
  ]
}
```

이 파일을 `javascript-basics.json`으로 저장하고 앱에서 가져오면 됩니다!

## 추가 팁

### 1. ID 생성 규칙

```javascript
// JavaScript로 고유 ID 생성
const cardSetId = `${topic}-${Date.now()}`;
// 예: "react-1736932800000"

// 또는 더 읽기 쉬운 형식
const cardSetId = `${topic}-${new Date().toISOString().split('T')[0]}`;
// 예: "react-2025-01-15"
```

### 2. 파일명 규칙

- 영문 소문자 사용
- 단어는 하이픈(-)으로 구분
- `.json` 확장자

예시:
- ✅ `javascript-basics.json`
- ✅ `react-hooks-advanced.json`
- ❌ `JavaScript 기초.json` (공백, 한글)
- ❌ `react_hooks.json` (언더스코어)

### 3. 버전 관리

```json
{
  "id": "math-algebra-v2",
  "name": "대수학 기초 (v2)",
  "description": "2025년 1월 개정판",
  "createdAt": "2025-01-15T10:00:00.000Z",
  "cards": [...]
}
```

### 4. 카드 개수 권장사항

- **최소**: 5개 (학습 효과를 위해)
- **권장**: 10-30개 (적절한 학습량)
- **최대**: 제한 없음 (하지만 50개 이상은 여러 카드셋으로 나누는 것 권장)

## 도움말

문제가 발생하면:
1. JSON Validator로 구조 확인 (https://jsonlint.com)
2. 위 예시와 비교하여 필드 확인
3. 앱의 에러 메시지 확인 (어떤 필드가 문제인지 알려줌)
4. 간단한 카드셋부터 시작해서 점진적으로 확장

질문이나 피드백은 GitHub Issues를 통해 공유해주세요!
