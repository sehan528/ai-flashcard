#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
pl.json 간략버전 Part 1 (카드 1-40)
"""

import json

# 간략버전 데이터 구조
brief = {
    "name": "프로그래밍 언어 (간략버전)",
    "description": "Programming Language 핵심 개념을 간결하게 정리한 버전",
    "cards": []
}

# 카드 1-40
cards_1_40 = [
    {
        "question": "컴파일 언어와 인터프리터 언어의 차이는?",
        "answer": "**컴파일 언어:**\n- 전체 번역 후 실행\n- 빠름\n- C, C++, Go\n\n**인터프리터 언어:**\n- 한 줄씩 번역/실행\n- 느림, 유연함\n- Python, JavaScript\n\n**JIT:** 혼합 (Java, C#)",
        "type": "essay",
        "tags": ["PL", "Compiler"]
    },
    {
        "question": "정적 타입과 동적 타입의 차이는?",
        "answer": "**정적 타입:**\n- 컴파일 시 타입 결정\n- 안전, 빠름\n- Java, C, TypeScript\n\n**동적 타입:**\n- 런타임에 타입 결정\n- 유연, 느림\n- Python, JavaScript, Ruby",
        "type": "essay",
        "tags": ["PL", "Type"]
    },
    {
        "question": "강타입과 약타입의 차이는?",
        "answer": "**강타입 (Strong):**\n- 암시적 형변환 적음\n- 엄격\n- Python, Java\n\n**약타입 (Weak):**\n- 암시적 형변환 많음\n- 유연\n- JavaScript, C\n\n**예:** \"1\" + 1 = \"11\" (JS) vs Error (Python)",
        "type": "essay",
        "tags": ["PL", "Type"]
    },
    {
        "question": "패러다임의 종류 4가지는?",
        "answer": "1. **명령형** - 어떻게 (How)\n   - 절차형, 객체지향\n2. **선언형** - 무엇을 (What)\n   - 함수형, 논리형\n3. **객체지향** - 캡슐화, 상속, 다형성\n4. **함수형** - 불변성, 순수 함수\n\n**다중 패러다임:** Python, JavaScript",
        "type": "essay",
        "tags": ["PL", "Paradigm"]
    },
    {
        "question": "객체지향의 4대 특징은?",
        "answer": "1. **캡슐화** - 데이터 은닉, 정보 은닉\n2. **상속** - 코드 재사용\n3. **다형성** - 오버로딩, 오버라이딩\n4. **추상화** - 공통 특성 추출\n\n**목적:** 재사용성, 유지보수성",
        "type": "essay",
        "tags": ["PL", "OOP"]
    },
    {
        "question": "오버로딩과 오버라이딩의 차이는?",
        "answer": "**오버로딩 (Overloading):**\n- 같은 이름, 다른 매개변수\n- 컴파일 타임 다형성\n- 메서드 시그니처\n\n**오버라이딩 (Overriding):**\n- 상속, 재정의\n- 런타임 다형성\n- 동적 바인딩",
        "type": "essay",
        "tags": ["PL", "OOP"]
    },
    {
        "question": "추상 클래스와 인터페이스의 차이는?",
        "answer": "**추상 클래스:**\n- 일부 구현 가능\n- 단일 상속\n- is-a 관계\n\n**인터페이스:**\n- 선언만 (Java 8+ default)\n- 다중 구현\n- can-do 관계\n\n**Java 8+:** 인터페이스에 default, static 메서드",
        "type": "essay",
        "tags": ["PL", "OOP"]
    },
    {
        "question": "상속과 조합(Composition)의 차이는?",
        "answer": "**상속:**\n- is-a 관계\n- 강한 결합\n- 화이트박스 재사용\n\n**조합:**\n- has-a 관계\n- 약한 결합\n- 블랙박스 재사용\n- 유연함\n\n**원칙:** 상속보다 조합을 선호",
        "type": "essay",
        "tags": ["PL", "OOP"]
    },
    {
        "question": "함수형 프로그래밍의 특징 4가지는?",
        "answer": "1. **순수 함수** - 부작용 없음\n2. **불변성** - 데이터 변경 안함\n3. **일급 함수** - 함수를 값처럼\n4. **고차 함수** - 함수를 인자/반환\n\n**장점:** 예측 가능, 테스트 쉬움, 병렬 처리",
        "type": "essay",
        "tags": ["PL", "Functional"]
    },
    {
        "question": "순수 함수의 조건 2가지는?",
        "answer": "1. **동일 입력 → 동일 출력** (결정적)\n2. **부작용 없음** (Side Effect Free)\n   - 외부 상태 변경 X\n   - 전역 변수 수정 X\n   - I/O X\n\n**장점:** 예측 가능, 캐싱, 병렬화",
        "type": "essay",
        "tags": ["PL", "Functional"]
    },
    {
        "question": "일급 객체(First-Class Citizen)의 조건 3가지는?",
        "answer": "1. **변수에 할당** 가능\n2. **인자로 전달** 가능\n3. **반환값**으로 사용 가능\n\n**일급 함수:** 함수가 일급 객체\n\n**예:** JavaScript, Python 함수",
        "type": "essay",
        "tags": ["PL", "Functional"]
    },
    {
        "question": "고차 함수(Higher-Order Function)란?",
        "answer": "**개념:** 함수를 인자로 받거나 반환하는 함수\n\n**예:**\n- map, filter, reduce\n- 데코레이터\n- 커링\n\n**장점:** 추상화, 재사용성",
        "type": "essay",
        "tags": ["PL", "Functional"]
    },
    {
        "question": "클로저(Closure)의 개념은?",
        "answer": "**개념:** 외부 함수의 변수를 내부 함수가 참조\n\n**특징:**\n- 렉시컬 스코프\n- 상태 은닉\n- 데이터 캡슐화\n\n**활용:**\n- 팩토리 함수\n- private 변수\n- 이벤트 핸들러",
        "type": "essay",
        "tags": ["PL", "Closure"]
    },
    {
        "question": "커링(Currying)의 개념은?",
        "answer": "**개념:** 여러 인자 함수 → 단일 인자 함수들의 체인\n\n**예:**\n```\nf(a, b, c) → f(a)(b)(c)\n```\n\n**장점:**\n- 부분 적용\n- 재사용성\n\n**vs Partial Application**",
        "type": "essay",
        "tags": ["PL", "Functional"]
    },
    {
        "question": "메모이제이션의 개념과 조건은?",
        "answer": "**개념:** 함수 결과 캐싱\n\n**조건:** 순수 함수\n\n**장점:**\n- 중복 계산 제거\n- 성능 향상\n\n**예:**\n- 피보나치\n- DP\n\n**Trade-off:** 메모리",
        "type": "essay",
        "tags": ["PL", "Memoization"]
    },
    {
        "question": "Call by Value와 Call by Reference의 차이는?",
        "answer": "**Call by Value:**\n- 값 복사\n- 원본 불변\n- Java 기본형\n\n**Call by Reference:**\n- 주소 전달\n- 원본 변경 가능\n- C++ 참조, Python 객체\n\n**Java:** 객체는 참조값의 복사",
        "type": "essay",
        "tags": ["PL", "Parameter"]
    },
    {
        "question": "얕은 복사와 깊은 복사의 차이는?",
        "answer": "**얕은 복사 (Shallow):**\n- 1단계만 복사\n- 중첩 객체는 참조\n\n**깊은 복사 (Deep):**\n- 재귀적 복사\n- 완전히 독립\n\n**방법:**\n- Shallow: Object.assign, spread\n- Deep: JSON.parse(JSON.stringify), lodash",
        "type": "essay",
        "tags": ["PL", "Copy"]
    },
    {
        "question": "Null, Undefined, NaN의 차이는?",
        "answer": "**Null:**\n- 의도적 빈 값\n- typeof null === \"object\"\n\n**Undefined:**\n- 선언만, 할당 안됨\n- typeof undefined === \"undefined\"\n\n**NaN:**\n- Not a Number\n- typeof NaN === \"number\"\n- NaN !== NaN (true)",
        "type": "essay",
        "tags": ["PL", "JavaScript"]
    },
    {
        "question": "== 와 === 의 차이는?",
        "answer": "**== (동등):**\n- 타입 강제 변환 후 비교\n- \"1\" == 1 (true)\n\n**=== (일치):**\n- 타입까지 엄격 비교\n- \"1\" === 1 (false)\n\n**권장:** === 사용",
        "type": "essay",
        "tags": ["PL", "JavaScript"]
    },
    {
        "question": "호이스팅(Hoisting)이란?",
        "answer": "**개념:** 선언이 스코프 최상단으로 끌어올려짐\n\n**var:**\n- 선언 + 초기화 (undefined)\n- 함수 스코프\n\n**let/const:**\n- 선언만 (TDZ)\n- 블록 스코프\n\n**함수 선언문:** 전체 호이스팅",
        "type": "essay",
        "tags": ["PL", "JavaScript"]
    },
    {
        "question": "TDZ(Temporal Dead Zone)란?",
        "answer": "**개념:** let/const 선언 전 접근 불가 구간\n\n**발생:**\n- 호이스팅 되지만 초기화 안됨\n- ReferenceError\n\n**vs var:** var는 undefined\n\n**목적:** 더 안전한 코드",
        "type": "essay",
        "tags": ["PL", "JavaScript"]
    },
    {
        "question": "var, let, const의 차이는?",
        "answer": "**var:**\n- 함수 스코프\n- 재선언 가능\n- 호이스팅 (undefined)\n\n**let:**\n- 블록 스코프\n- 재할당 가능\n- TDZ\n\n**const:**\n- 블록 스코프\n- 재할당 불가 (불변 아님)\n- TDZ",
        "type": "essay",
        "tags": ["PL", "JavaScript"]
    },
    {
        "question": "스코프의 종류 3가지는?",
        "answer": "1. **전역 스코프** - 어디서나 접근\n2. **함수 스코프** - 함수 내부만\n3. **블록 스코프** - {} 내부만 (let/const)\n\n**스코프 체인:** 내부 → 외부 탐색\n**렉시컬 스코프:** 정의된 위치 기준",
        "type": "essay",
        "tags": ["PL", "Scope"]
    },
    {
        "question": "this 바인딩 규칙 4가지는?",
        "answer": "1. **기본** - 전역 객체 (strict: undefined)\n2. **암시적** - 메서드 호출 (.앞 객체)\n3. **명시적** - call/apply/bind\n4. **new** - 새 객체\n\n**화살표 함수:** 렉시컬 this (상위 스코프)\n\n**우선순위:** new > 명시 > 암시 > 기본",
        "type": "essay",
        "tags": ["PL", "JavaScript"]
    },
    {
        "question": "화살표 함수의 특징 4가지는?",
        "answer": "1. **this** - 렉시컬 바인딩 (상위)\n2. **arguments** - 없음 (rest 사용)\n3. **constructor** - new 불가\n4. **간결한 문법**\n\n**용도:** 콜백, 메서드 아닌 함수\n**주의:** 메서드로 사용 X",
        "type": "essay",
        "tags": ["PL", "JavaScript"]
    },
    {
        "question": "프로토타입의 개념은?",
        "answer": "**개념:** 객체가 다른 객체를 참조하는 링크\n\n**프로토타입 체인:**\n- 객체 → 프로토타입 → ... → Object.prototype → null\n\n**상속 구현:**\n- 클래스 없이 상속\n\n**접근:** __proto__, Object.getPrototypeOf()",
        "type": "essay",
        "tags": ["PL", "JavaScript"]
    },
    {
        "question": "프로토타입 체인의 동작 원리는?",
        "answer": "**탐색:**\n1. 객체 자체 속성 확인\n2. 없으면 프로토타입 확인\n3. 재귀적으로 체인 따라 탐색\n4. null까지 없으면 undefined\n\n**성능:** O(depth)\n\n**hasOwnProperty():** 자체 속성만",
        "type": "essay",
        "tags": ["PL", "JavaScript"]
    },
    {
        "question": "클래스와 프로토타입의 관계는?",
        "answer": "**ES6 Class:**\n- Syntactic Sugar\n- 내부는 프로토타입\n\n**차이:**\n- class는 호이스팅 안됨 (TDZ)\n- strict mode 강제\n- new 필수\n\n**본질:** 프로토타입 기반",
        "type": "essay",
        "tags": ["PL", "JavaScript"]
    },
    {
        "question": "이벤트 루프의 동작 원리는?",
        "answer": "**구성:**\n1. **Call Stack** - 실행 중인 함수\n2. **Web APIs** - 비동기 처리\n3. **Task Queue** - 콜백 대기\n4. **Event Loop** - Stack 비면 Queue에서 가져옴\n\n**싱글 스레드 + 비동기**",
        "type": "essay",
        "tags": ["PL", "JavaScript"]
    },
    {
        "question": "매크로태스크와 마이크로태스크의 차이는?",
        "answer": "**마이크로태스크:**\n- Promise, MutationObserver\n- 우선순위 높음\n- 매크로 전에 모두 실행\n\n**매크로태스크:**\n- setTimeout, setInterval, I/O\n- 한 개씩 실행\n\n**순서:** 마이크로 → 렌더링 → 매크로",
        "type": "essay",
        "tags": ["PL", "JavaScript"]
    },
    {
        "question": "Promise의 상태 3가지는?",
        "answer": "1. **Pending** - 대기\n2. **Fulfilled** - 성공 (resolve)\n3. **Rejected** - 실패 (reject)\n\n**settled:** Fulfilled or Rejected\n\n**메서드:** then, catch, finally\n\n**체이닝 가능**",
        "type": "essay",
        "tags": ["PL", "JavaScript"]
    },
    {
        "question": "async/await의 특징은?",
        "answer": "**특징:**\n- Promise의 문법적 설탕\n- 동기 코드처럼 작성\n- try-catch로 에러 처리\n\n**async:** Promise 반환\n**await:** Promise 완료 대기\n\n**주의:** await는 async 내부에서만",
        "type": "essay",
        "tags": ["PL", "JavaScript"]
    },
    {
        "question": "콜백 지옥과 해결책은?",
        "answer": "**콜백 지옥:**\n- 중첩 콜백\n- 가독성 저하\n- 에러 처리 어려움\n\n**해결:**\n1. Promise 체이닝\n2. async/await\n3. 함수 분리\n\n**패턴:** 콜백 → Promise → async/await",
        "type": "essay",
        "tags": ["PL", "JavaScript"]
    },
    {
        "question": "제너레이터(Generator)의 특징은?",
        "answer": "**특징:**\n- function*\n- yield로 일시 중지/재개\n- Iterator 반환\n\n**활용:**\n- 지연 평가\n- 무한 수열\n- 비동기 제어\n\n**메서드:** next(), throw(), return()",
        "type": "essay",
        "tags": ["PL", "JavaScript"]
    },
    {
        "question": "이터레이터(Iterator)와 이터러블(Iterable)의 차이는?",
        "answer": "**Iterator:**\n- next() 메서드 가진 객체\n- {value, done} 반환\n\n**Iterable:**\n- [Symbol.iterator]() 메서드\n- Iterator 반환\n\n**예:** Array, String, Map, Set\n\n**for...of는 Iterable만**",
        "type": "essay",
        "tags": ["PL", "JavaScript"]
    },
    {
        "question": "Spread와 Rest의 차이는?",
        "answer": "**Spread (...):**\n- 펼치기\n- 배열/객체 확장\n- [...arr], {...obj}\n\n**Rest (...):**\n- 모으기\n- 함수 매개변수\n- function(...args)\n\n**위치로 구분**",
        "type": "essay",
        "tags": ["PL", "JavaScript"]
    },
    {
        "question": "구조 분해 할당(Destructuring)의 활용은?",
        "answer": "**배열:**\n```js\nconst [a, b] = [1, 2];\n```\n\n**객체:**\n```js\nconst {x, y} = {x: 1, y: 2};\n```\n\n**활용:**\n- 기본값\n- 나머지 (...rest)\n- 중첩\n- 함수 매개변수",
        "type": "essay",
        "tags": ["PL", "JavaScript"]
    },
    {
        "question": "옵셔널 체이닝(?.)의 용도는?",
        "answer": "**용도:** null/undefined 안전 접근\n\n**예:**\n```js\nobj?.prop?.method?.()\n```\n\n**단락 평가:** null/undefined면 즉시 undefined\n\n**vs && :** 간결함\n\n**ES2020**",
        "type": "essay",
        "tags": ["PL", "JavaScript"]
    },
    {
        "question": "Nullish Coalescing(??)의 특징은?",
        "answer": "**개념:** null/undefined만 대체\n\n**예:**\n```js\nvalue ?? 'default'\n```\n\n**vs || :** 0, '', false도 대체\n\n**활용:** 기본값 설정\n\n**ES2020**",
        "type": "essay",
        "tags": ["PL", "JavaScript"]
    }
]

brief["cards"] = cards_1_40

print(f"Part 1: {len(brief['cards'])}개 카드 생성 완료")

# 저장
with open('public/data/dataset-brief/pl/pl.json', 'w', encoding='utf-8') as f:
    json.dump(brief, f, ensure_ascii=False, indent=2)

print(f"✅ PL 간략버전 Part 1 저장! (진행률: {len(brief['cards'])}/125)")
