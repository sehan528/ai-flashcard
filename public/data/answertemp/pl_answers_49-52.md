## 질문 49: Promise의 동작 원리와 상태에 대해 설명해주세요.

**정의:**
Promise는 비동기 작업의 최종 완료 또는 실패를 나타내는 객체로, 콜백 지옥을 해결하고 비동기 코드를 더 직관적으로 작성할 수 있게 합니다. Promise는 pending, fulfilled, rejected 세 가지 상태를 가지며 한 번 결정되면 상태가 변경되지 않습니다.

**특징/원리:**
- 상태 불변성: 한 번 fulfilled나 rejected 상태가 되면 다시 변경되지 않음
- 체이닝: then, catch, finally를 연결하여 순차적인 비동기 작업 처리 가능
- 에러 전파: 체인 중간에 발생한 에러가 가장 가까운 catch로 전파됨
- 비동기 처리: Promise 생성자의 executor 함수는 동기적으로 실행되지만 then은 비동기로 실행

**Promise 상태:**
- pending: 초기 상태로 비동기 작업이 아직 완료되지 않음
- fulfilled: 비동기 작업이 성공적으로 완료되어 결과값을 가짐
- rejected: 비동기 작업이 실패하여 에러를 가짐
- settled: fulfilled나 rejected 상태를 통칭하며 더 이상 상태 변경 안 됨

**주요 메서드:**
- then: fulfilled 상태일 때 실행될 콜백과 rejected 상태일 때 실행될 콜백을 등록
- catch: rejected 상태일 때 실행될 에러 핸들러를 등록하며 then(undefined, onRejected)와 동일
- finally: 상태와 무관하게 항상 실행되는 콜백을 등록하며 리소스 정리에 사용
- Promise.resolve: 주어진 값으로 즉시 fulfilled 상태의 Promise 생성
- Promise.reject: 주어진 이유로 즉시 rejected 상태의 Promise 생성

**정적 메서드:**
- Promise.all: 여러 Promise를 병렬로 실행하고 모두 성공하면 결과 배열 반환, 하나라도 실패하면 즉시 reject
- Promise.allSettled: 모든 Promise의 성공/실패 여부와 관계없이 모든 결과를 배열로 반환
- Promise.race: 가장 먼저 완료된 Promise의 결과를 반환
- Promise.any: 가장 먼저 성공한 Promise의 결과를 반환하며 모두 실패하면 reject

**실무 활용:**
- API 호출 결과를 Promise로 래핑하여 then으로 성공 처리, catch로 에러 처리
- 여러 API를 병렬로 호출할 때 Promise.all로 모든 결과를 기다림
- Promise 체이닝으로 순차적인 비동기 작업을 가독성 좋게 표현

---

## 질문 50: async/await와 Promise의 차이점은 무엇인가요?

**정의:**
async/await는 ES2017에서 도입된 문법으로 Promise를 더 간결하고 동기 코드처럼 작성할 수 있게 합니다. async 함수는 항상 Promise를 반환하며, await는 Promise가 settled될 때까지 함수 실행을 일시 중지합니다.

**특징/원리:**
- 문법적 설탕: 내부적으로 Promise를 사용하지만 동기 코드처럼 작성 가능
- 에러 처리: try-catch 문으로 동기/비동기 에러를 일관되게 처리
- 가독성: 콜백이나 then 체이닝보다 코드 흐름이 직관적이고 이해하기 쉬움
- 디버깅: 스택 트레이스가 명확하여 디버깅이 용이

**async 함수:**
- 선언: function 앞에 async 키워드를 붙여 선언
- 반환값: 함수가 값을 반환하면 자동으로 Promise.resolve로 래핑
- 에러: 함수에서 예외가 발생하면 자동으로 Promise.reject로 래핑
- await 필수: async 함수 내에서만 await 사용 가능

**await 키워드:**
- 일시 중지: Promise가 settled될 때까지 함수 실행을 중지하고 결과를 반환
- 병렬 처리: 여러 await를 순차적으로 사용하면 직렬 처리되므로 Promise.all로 병렬 처리 필요
- 최상위 await: ES2022부터 모듈의 최상위 레벨에서도 await 사용 가능
- 에러: Promise가 reject되면 에러를 throw하므로 try-catch로 처리

**Promise와의 비교:**
- 가독성: async/await가 중첩 없이 순차적으로 작성되어 더 읽기 쉬움
- 에러 처리: Promise는 catch 메서드, async/await는 try-catch로 처리하여 동기 코드와 일관성
- 조건 분기: async/await는 if문, 반복문 등을 자연스럽게 사용 가능
- 디버깅: async/await는 일반 코드처럼 breakpoint를 설정하고 단계별 실행 가능

**실무 활용:**
- API 호출이 많은 코드는 async/await로 작성하여 가독성과 유지보수성 향상
- 에러 처리가 복잡한 경우 try-catch로 여러 await를 한 번에 처리
- 병렬 처리가 필요한 경우 Promise.all과 await를 조합하여 사용

---

## 질문 51: 이벤트 루프(Event Loop)의 동작 원리를 설명해주세요.

**정의:**
이벤트 루프는 JavaScript의 비동기 실행 모델의 핵심으로, 콜 스택과 태스크 큐를 모니터링하며 콜 스택이 비어있을 때 큐의 작업을 스택으로 이동시킵니다. 단일 스레드인 JavaScript가 비동기 작업을 처리할 수 있게 하는 메커니즘입니다.

**특징/원리:**
- 단일 스레드: JavaScript 엔진은 하나의 콜 스택만 가지며 한 번에 하나의 작업만 실행
- 논블로킹: 시간이 오래 걸리는 작업을 백그라운드로 넘기고 다음 코드 계속 실행
- 이벤트 기반: 작업 완료 시 이벤트가 발생하고 등록된 콜백이 큐에 추가됨
- 우선순위: 마이크로태스크가 매크로태스크보다 높은 우선순위를 가짐

**구성 요소:**
- 콜 스택: 현재 실행 중인 함수들이 쌓이는 LIFO 구조의 스택
- 힙: 객체가 할당되는 메모리 영역
- 태스크 큐: 비동기 작업의 콜백이 대기하는 FIFO 구조의 큐
- 마이크로태스크 큐: Promise 콜백 등이 대기하는 우선순위 높은 큐
- Web APIs: 타이머, DOM 이벤트, AJAX 등 브라우저가 제공하는 비동기 API

**동작 과정:**
- 동기 코드 실행: 전역 코드가 콜 스택에서 순차적으로 실행됨
- 비동기 작업 등록: setTimeout, addEventListener 등이 Web API로 전달되고 타이머나 이벤트 대기
- 콜백 큐 추가: 비동기 작업 완료 시 콜백이 태스크 큐에 추가됨
- 이벤트 루프 동작: 콜 스택이 비면 큐에서 콜백을 꺼내 스택에 추가하여 실행

**마이크로태스크와 매크로태스크:**
- 마이크로태스크: Promise의 then/catch/finally, queueMicrotask, MutationObserver 등
- 매크로태스크: setTimeout, setInterval, setImmediate, I/O, UI 렌더링 등
- 실행 순서: 콜 스택 비움 → 모든 마이크로태스크 실행 → 매크로태스크 하나 실행 → 반복
- 렌더링: 마이크로태스크 큐가 비고 매크로태스크 실행 전에 UI 렌더링 발생 가능

**실무 활용:**
- 이벤트 루프를 이해하여 비동기 코드의 실행 순서를 정확히 예측
- 마이크로태스크 큐가 막히지 않도록 주의하여 UI 블로킹 방지
- setTimeout(fn, 0)을 사용하여 현재 실행 흐름을 마치고 나중에 실행되도록 스케줄링

---

## 질문 52: 마이크로태스크와 매크로태스크의 차이점은 무엇인가요?

**정의:**
마이크로태스크와 매크로태스크는 이벤트 루프에서 처리되는 비동기 작업의 두 가지 범주로, 실행 우선순위와 처리 방식이 다릅니다. 마이크로태스크가 매크로태스크보다 항상 먼저 처리되어 Promise 기반 코드가 타이머보다 우선 실행됩니다.

**특징/원리:**
- 우선순위: 마이크로태스크가 매크로태스크보다 높은 우선순위를 가짐
- 처리 방식: 마이크로태스크는 큐가 빌 때까지 모두 처리하지만, 매크로태스크는 한 번에 하나씩 처리
- 렌더링 차단: 마이크로태스크가 많으면 UI 렌더링이 지연될 수 있음
- 재귀적 추가: 마이크로태스크 처리 중 새로운 마이크로태스크가 추가되면 즉시 처리

**마이크로태스크 종류:**
- Promise 콜백: then, catch, finally에 등록된 핸들러
- queueMicrotask: 명시적으로 마이크로태스크 큐에 작업 추가
- MutationObserver: DOM 변경 감지 콜백
- process.nextTick: Node.js의 마이크로태스크로 Promise보다 우선순위 높음

**매크로태스크 종류:**
- setTimeout: 지정된 시간 후 콜백 실행
- setInterval: 지정된 간격마다 콜백 반복 실행
- setImmediate: Node.js의 매크로태스크로 다음 이벤트 루프 사이클에 실행
- I/O 작업: 파일 읽기/쓰기, 네트워크 요청 등
- UI 렌더링: 브라우저의 화면 갱신

**실행 순서:**
- 현재 매크로태스크 완료
- 마이크로태스크 큐의 모든 작업 처리
- 필요시 UI 렌더링 수행
- 다음 매크로태스크 하나 처리
- 위 과정 반복

**실무 활용:**
- Promise 체인이 길면 마이크로태스크가 계속 추가되어 렌더링 블로킹 주의
- 긴급한 작업은 Promise로 래핑하여 마이크로태스크로 우선 처리
- setTimeout을 사용하여 무거운 작업을 여러 매크로태스크로 분할하여 UI 반응성 유지

---
