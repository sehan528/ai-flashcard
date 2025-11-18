## 질문 57: Map과 Object의 차이점은 무엇인가요?

**정의:**
Map은 ES6에서 도입된 키-값 쌍을 저장하는 컬렉션으로, Object와 유사하지만 여러 측면에서 차이가 있습니다. Map은 어떤 타입이든 키로 사용할 수 있고 순서를 보장하며 크기를 쉽게 알 수 있는 등의 장점이 있습니다.

**특징/원리:**
- 키 타입: Map은 객체, 함수, 원시값 등 모든 타입을 키로 사용 가능하지만, Object는 문자열과 Symbol만 키로 사용
- 순서 보장: Map은 삽입 순서를 유지하지만, Object는 ES2015 이전에는 순서가 보장되지 않음
- 크기: Map은 size 프로퍼티로 크기를 즉시 알 수 있지만, Object는 수동으로 계산 필요
- 반복: Map은 이터러블이라 for-of로 직접 순회 가능하지만, Object는 Object.keys() 등 필요

**Map의 장점:**
- 키 타입 자유: 객체를 키로 사용할 수 있어 복잡한 데이터 구조 표현 가능
- 성능: 빈번한 추가/삭제가 있는 경우 Map이 더 나은 성능
- 크기 확인: size로 O(1) 시간에 요소 개수 확인
- 프로토타입 오염 없음: Object는 프로토타입 체인의 키와 충돌 가능하지만 Map은 안전

**Map 주요 메서드:**
- set(key, value): 키-값 쌍 추가하고 Map 반환하여 체이닝 가능
- get(key): 키에 해당하는 값 반환, 없으면 undefined
- has(key): 키 존재 여부를 불리언으로 반환
- delete(key): 키-값 쌍 삭제하고 성공 여부 반환
- clear(): 모든 요소 제거
- keys(), values(), entries(): 각각 키, 값, 키-값 쌍의 이터레이터 반환

**Object 사용이 적합한 경우:**
- JSON 직렬화: Object는 JSON과 호환되지만 Map은 직렬화 필요
- 단순 구조: 키가 문자열이고 구조가 단순한 경우
- 프로퍼티 접근: 점 표기법이나 대괄호로 편리하게 접근
- 리터럴 생성: 객체 리터럴로 간결하게 생성 가능

**실무 활용:**
- DOM 요소를 키로 사용하는 캐시나 메타데이터 저장에 Map 활용
- 순서가 중요한 키-값 쌍 관리에 Map 사용
- 빈번한 추가/삭제가 있는 동적 컬렉션은 Map으로 성능 향상

---

## 질문 58: Set과 WeakSet, Map과 WeakMap의 차이점을 설명해주세요.

**정의:**
Set과 Map의 Weak 버전은 키에 대한 약한 참조를 사용하여 가비지 컬렉션을 방해하지 않습니다. WeakSet은 객체만 저장 가능하고, WeakMap은 객체만 키로 사용 가능하며, 참조된 객체가 더 이상 사용되지 않으면 자동으로 제거됩니다.

**특징/원리:**
- 약한 참조: Weak 버전은 객체에 대한 약한 참조를 유지하여 다른 참조가 없으면 GC 대상
- 객체 전용: WeakSet과 WeakMap은 원시값을 저장할 수 없고 오직 객체만 가능
- 열거 불가: Weak 버전은 이터러블이 아니라 순회나 크기 확인 불가능
- 메모리 효율: 객체가 더 이상 필요 없어지면 자동으로 정리되어 메모리 누수 방지

**Set vs WeakSet:**
- 저장 타입: Set은 모든 타입 저장 가능, WeakSet은 객체만 가능
- 순회: Set은 이터러블이지만 WeakSet은 순회 불가능
- 크기: Set은 size로 크기 확인 가능, WeakSet은 불가능
- 메서드: WeakSet은 add, has, delete만 제공

**Map vs WeakMap:**
- 키 타입: Map은 모든 타입을 키로 사용 가능, WeakMap은 객체만 키로 사용
- 순회: Map은 이터러블이지만 WeakMap은 순회 불가능
- 크기: Map은 size로 크기 확인 가능, WeakMap은 불가능
- 메서드: WeakMap은 get, set, has, delete만 제공

**사용 사례:**
- WeakMap 메타데이터: DOM 요소에 대한 메타데이터를 WeakMap에 저장하여 요소 제거 시 자동 정리
- WeakSet 방문 추적: 객체의 방문 여부를 추적하되 객체 수명에 영향 주지 않음
- 프라이빗 데이터: WeakMap으로 객체의 private 데이터를 저장하여 캡슐화
- 캐싱: WeakMap으로 계산 결과를 캐시하되 원본 객체가 사라지면 자동 삭제

**실무 활용:**
- React 컴포넌트의 인스턴스 데이터를 WeakMap에 저장하여 컴포넌트 언마운트 시 자동 정리
- DOM 이벤트 핸들러 정보를 WeakMap에 저장하여 엘리먼트 제거 시 메모리 누수 방지
- 순환 참조 감지 시 WeakSet으로 방문한 객체 추적

---

## 질문 59: Symbol의 용도와 사용 방법을 설명해주세요.

**정의:**
Symbol은 ES6에서 도입된 원시 타입으로, 고유하고 변경 불가능한 값을 생성합니다. 주로 객체의 고유한 프로퍼티 키를 만들어 충돌을 방지하고, 내부 동작을 커스터마이징하는 Well-Known Symbol을 제공합니다.

**특징/원리:**
- 고유성: 매번 Symbol()을 호출하면 새롭고 고유한 값이 생성되어 절대 중복되지 않음
- 불변성: Symbol 값은 생성 후 변경할 수 없는 원시 타입
- 은닉성: for-in, Object.keys() 등에서 Symbol 키는 나타나지 않아 의도치 않은 접근 방지
- 설명: 선택적 설명 문자열을 추가할 수 있지만 고유성에는 영향 없음

**Symbol 생성:**
- Symbol(): 새로운 고유 Symbol 생성하며 선택적으로 설명 추가
- Symbol.for(key): 전역 Symbol 레지스트리에서 키로 검색하거나 없으면 생성하여 공유
- Symbol.keyFor(symbol): Symbol.for로 생성된 Symbol의 키를 반환
- 리터럴 불가: Symbol은 리터럴 문법이 없고 함수 호출로만 생성

**Well-Known Symbols:**
- Symbol.iterator: 객체를 이터러블로 만들어 for-of로 순회 가능하게 함
- Symbol.toStringTag: Object.prototype.toString()의 반환값을 커스터마이징
- Symbol.hasInstance: instanceof 연산자의 동작을 커스터마이징
- Symbol.toPrimitive: 객체를 원시값으로 변환하는 방법 정의

**프로퍼티 키로 사용:**
- 충돌 방지: 라이브러리나 프레임워크가 객체에 프로퍼티를 추가할 때 기존 키와 충돌 없음
- 은닉: Symbol 키는 일반적인 열거 메서드로 나타나지 않아 내부 구현 숨김
- 접근: Object.getOwnPropertySymbols()나 Reflect.ownKeys()로만 Symbol 키 접근 가능

**실무 활용:**
- 이터레이터 프로토콜 구현 시 Symbol.iterator로 커스텀 순회 로직 정의
- 라이브러리에서 객체에 메타데이터 추가 시 Symbol 키로 충돌 방지
- 내부 상태나 메서드를 Symbol 키로 정의하여 외부 접근 제한

---

## 질문 60: Proxy와 Reflect API에 대해 설명해주세요.

**정의:**
Proxy는 객체에 대한 기본 연산을 가로채고 재정의할 수 있는 메타프로그래밍 기능입니다. Reflect는 Proxy 핸들러에서 사용할 수 있는 메서드들을 제공하는 내장 객체로, 기본 동작을 수행하거나 객체 조작을 더 명확하게 표현합니다.

**특징/원리:**
- 가로채기: 프로퍼티 읽기, 쓰기, 삭제, 함수 호출 등 기본 연산을 가로채서 커스텀 동작 수행
- 투명성: 프록시는 원본 객체를 감싸지만 외부에서는 투명하게 동작
- 취소 가능: Proxy.revocable()로 생성한 프록시는 나중에 비활성화 가능
- 체이닝: 프록시를 다시 프록시로 감싸서 여러 레이어의 동작 추가 가능

**Proxy 핸들러 트랩:**
- get: 프로퍼티 읽기를 가로채어 기본값 제공, 접근 제어, 로깅 등 수행
- set: 프로퍼티 쓰기를 가로채어 유효성 검증, 변경 감지, 읽기 전용 구현
- has: in 연산자를 가로채어 프로퍼티 존재 여부 커스터마이징
- deleteProperty: delete 연산자를 가로채어 삭제 방지나 로깅
- apply: 함수 호출을 가로채어 인자 검증, 로깅, 결과 변환
- construct: new 연산자를 가로채어 인스턴스 생성 제어

**Reflect API:**
- 메서드 대응: Proxy의 모든 트랩에 대응하는 메서드를 제공
- 기본 동작: Reflect 메서드로 기본 동작을 수행하여 프록시에서 원래 동작 위임
- 일관성: Object의 메서드들보다 일관된 반환값과 에러 처리 제공
- 함수형: Reflect 메서드들은 함수형 프로그래밍 스타일에 더 적합

**Reflect 주요 메서드:**
- Reflect.get(target, key): 프로퍼티 값 반환
- Reflect.set(target, key, value): 프로퍼티 설정하고 성공 여부 반환
- Reflect.has(target, key): 프로퍼티 존재 여부 반환
- Reflect.deleteProperty(target, key): 프로퍼티 삭제하고 성공 여부 반환
- Reflect.apply(func, thisArg, args): 함수 호출
- Reflect.construct(constructor, args): 인스턴스 생성

**실무 활용:**
- Vue 3의 반응성 시스템이 Proxy로 데이터 변경을 감지하고 자동으로 UI 업데이트
- 유효성 검증 프록시로 객체에 값 설정 시 자동으로 검증 수행
- 기본값 프록시로 존재하지 않는 프로퍼티 접근 시 기본값 반환

---
