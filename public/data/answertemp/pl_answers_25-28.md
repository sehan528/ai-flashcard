## 질문 25: Fork/Join Framework의 동작 원리를 설명해주세요.

**정의:**
Fork/Join Framework는 Java 7에서 도입된 병렬 처리 프레임워크로, 큰 작업을 작은 하위 작업으로 분할(Fork)하고 각각을 병렬로 처리한 후 결과를 합치는(Join) 분할 정복 알고리즘을 구현합니다. Work-Stealing 알고리즘을 사용하여 효율적인 부하 분산을 제공합니다.

**특징/원리:**
- 분할 정복: 작업을 재귀적으로 더 작은 단위로 분할하여 병렬 처리하고 결과를 합침
- Work-Stealing: 유휴 스레드가 다른 스레드의 작업 큐에서 작업을 가져와 처리하여 CPU 활용도 향상
- ForkJoinPool: 작업 스레드들이 자신만의 덱(Deque)을 가지며 LIFO 방식으로 작업 처리
- 재귀 병렬화: 작업이 충분히 작아질 때까지 재귀적으로 분할하여 최적의 병렬성 달성

**핵심 클래스:**
- ForkJoinPool: Fork/Join 작업을 실행하는 특수한 ExecutorService 구현체
- ForkJoinTask: Fork/Join 작업의 추상 클래스로 fork()와 join() 메서드 제공
- RecursiveTask: 결과를 반환하는 작업을 정의하며 compute() 메서드 구현 필요
- RecursiveAction: 결과를 반환하지 않는 작업을 정의하며 compute() 메서드 구현 필요

**Work-Stealing 알고리즘:**
- 각 스레드가 자신의 덱을 가지고 새로운 작업은 덱의 앞쪽에 추가
- 자신의 덱에서 작업을 가져올 때는 LIFO 방식으로 앞쪽에서 꺼냄
- 다른 스레드의 덱에서 작업을 훔칠 때는 FIFO 방식으로 뒤쪽에서 꺼냄
- 이를 통해 큰 작업은 도난당하기 쉽고 작은 작업은 원래 스레드가 빠르게 처리

**실무 활용:**
- 대용량 배열의 정렬, 검색, 변환 등 분할 가능한 데이터 처리 작업에 활용
- Java 8의 parallel Stream이 내부적으로 ForkJoinPool의 common pool 사용
- 재귀적으로 처리 가능한 트리 구조나 그래프 탐색 알고리즘을 병렬화하여 성능 향상

---

## 질문 26: Java의 Stream API 동작 원리와 병렬 처리 방법을 설명해주세요.

**정의:**
Stream API는 Java 8에서 도입된 함수형 프로그래밍 스타일의 데이터 처리 API로, 컬렉션이나 배열의 요소를 선언적으로 처리할 수 있게 합니다. 내부 반복을 사용하고 지연 연산을 통해 효율적인 데이터 처리를 제공하며, 병렬 스트림으로 멀티코어를 활용한 병렬 처리가 가능합니다.

**특징/원리:**
- 선언적 프로그래밍: 무엇을 할지 기술하고 어떻게 할지는 Stream API가 처리
- 지연 연산: 중간 연산은 즉시 실행되지 않고 최종 연산이 호출될 때 한꺼번에 처리
- 내부 반복: 외부 반복자 대신 Stream이 내부적으로 반복을 관리하여 최적화 가능
- 일회용: 스트림은 한 번 사용하면 소비되어 재사용 불가능

**스트림 연산 분류:**
- 중간 연산: filter, map, flatMap, sorted, distinct 등으로 스트림을 변환하며 지연 실행
- 최종 연산: collect, forEach, reduce, count, findFirst 등으로 결과를 생성하며 스트림 소비
- 쇼트 서킷: anyMatch, findFirst 등은 모든 요소를 처리하지 않고 조건 만족 시 즉시 종료
- 상태 기반/무상태: sorted, distinct는 상태를 유지하고, filter, map은 무상태 연산

**병렬 처리 방법:**
- parallel() 메서드: 순차 스트림을 병렬 스트림으로 변환하여 ForkJoinPool의 공통 풀 사용
- parallelStream(): 컬렉션에서 직접 병렬 스트림 생성
- 자동 분할: 소스 데이터를 여러 청크로 분할하여 각 스레드가 독립적으로 처리
- 결과 합치기: 각 스레드의 부분 결과를 combine 함수로 합쳐 최종 결과 생성

**병렬 스트림 주의사항:**
- 공유 상태 회피: 병렬 스트림에서 공유 변수를 수정하면 경쟁 조건 발생하여 부정확한 결과 초래
- 데이터 크기: 작은 데이터셋은 병렬화 오버헤드가 이득보다 클 수 있어 순차 스트림이 더 빠를 수 있음
- 분할 가능성: ArrayList는 분할이 쉽지만 LinkedList는 어려워 병렬화 효과가 적음
- 연산 특성: stateful 연산이나 순서 의존적인 연산은 병렬화 시 성능 저하 가능

**실무 활용:**
- 대용량 데이터 필터링, 변환, 집계 작업을 선언적이고 간결한 코드로 구현
- CPU 집약적인 작업에 병렬 스트림을 적용하여 멀티코어 활용도 향상
- Collectors를 활용하여 groupingBy, partitioningBy 등 복잡한 집계 로직을 간단하게 표현

---

## 질문 27: Optional 클래스의 필요성과 올바른 사용 방법은 무엇인가요?

**정의:**
Optional은 Java 8에서 도입된 컨테이너 클래스로, 값이 있을 수도 없을 수도 있는 상황을 명시적으로 표현합니다. null 참조로 인한 NullPointerException을 방지하고, 값의 존재 여부를 타입 시스템으로 표현하여 안전한 코드 작성을 유도합니다.

**특징/원리:**
- null 안전성: null을 직접 다루지 않고 Optional로 감싸 NullPointerException 위험 감소
- 명시적 표현: 메서드 반환 타입을 Optional로 선언하여 값이 없을 수 있음을 명시
- 함수형 API: map, flatMap, filter, orElse 등 함수형 메서드로 안전하고 간결한 처리
- 불변 컨테이너: Optional 객체는 불변이며 값의 유무만 나타냄

**주요 메서드:**
- of(): null이 아닌 값으로 Optional 생성, null 전달 시 NullPointerException 발생
- ofNullable(): null일 수 있는 값으로 Optional 생성, null이면 empty Optional 반환
- empty(): 빈 Optional 인스턴스 생성
- isPresent(): 값이 있으면 true, isEmpty()는 값이 없으면 true
- get(): 값을 반환하지만 값이 없으면 NoSuchElementException 발생하여 사용 지양
- orElse(): 값이 있으면 반환하고 없으면 기본값 반환
- orElseGet(): 값이 없을 때만 Supplier 실행하여 기본값 생성
- orElseThrow(): 값이 없으면 예외 발생

**잘못된 사용 패턴:**
- isPresent() 확인 후 get() 호출: null 체크와 다를 바 없어 Optional의 이점 상실
- Optional을 필드로 사용: 직렬화 불가하고 메모리 오버헤드 증가
- Optional을 메서드 파라미터로 사용: 호출자에게 부담을 주며 null 전달 가능성 여전히 존재
- 컬렉션을 Optional로 감싸기: 빈 컬렉션으로 충분하며 불필요한 복잡도 증가

**올바른 사용 방법:**
- 메서드 반환 타입으로만 사용하여 값이 없을 수 있음을 명시
- orElse, orElseGet, orElseThrow로 값이 없는 경우를 명시적으로 처리
- map, flatMap을 체이닝하여 null 체크 없이 안전하게 변환
- filter로 조건을 추가하고 ifPresent로 값이 있을 때만 동작 수행

**실무 활용:**
- 데이터베이스 조회 결과가 없을 수 있는 경우 Optional로 반환하여 호출자가 안전하게 처리
- 설정값이 선택적인 경우 Optional로 표현하여 기본값 처리 로직 간결화
- Stream API와 결합하여 findFirst(), findAny() 등의 결과를 안전하게 처리

---

## 질문 28: Functional Interface와 Lambda Expression에 대해 설명해주세요.

**정의:**
Functional Interface는 단 하나의 추상 메서드만 가진 인터페이스로, Java 8의 람다 표현식과 메서드 참조의 타입으로 사용됩니다. Lambda Expression은 익명 함수를 간결하게 표현하는 문법으로, 함수형 프로그래밍 스타일을 Java에 도입합니다.

**특징/원리:**
- SAM 인터페이스: Single Abstract Method를 가진 인터페이스만 Functional Interface로 인정
- @FunctionalInterface: 어노테이션으로 명시하여 컴파일러가 검증하도록 하며 선택사항
- 타입 추론: 람다 표현식의 파라미터 타입은 컨텍스트로부터 추론 가능하여 생략 가능
- 클로저: 람다는 자신이 정의된 스코프의 변수를 캡처할 수 있지만 effectively final이어야 함

**주요 내장 Functional Interface:**
- Predicate: T를 받아 boolean 반환, test() 메서드로 조건 검사
- Function: T를 받아 R 반환, apply() 메서드로 변환 수행
- Consumer: T를 받아 void 반환, accept() 메서드로 소비 동작 수행
- Supplier: 파라미터 없이 T 반환, get() 메서드로 값 공급
- BiFunction, BiConsumer: 두 개의 파라미터를 받는 변형
- UnaryOperator, BinaryOperator: 입력과 출력 타입이 같은 특수 Function

**Lambda 문법:**
- 기본 형식: (파라미터) -> { 실행문 }
- 단일 표현식: (파라미터) -> 표현식, 중괄호와 return 생략 가능
- 파라미터 타입 생략: 타입 추론 가능하면 (x, y) -> x + y 형태로 간결하게 작성
- 단일 파라미터: 괄호 생략 가능하여 x -> x * 2 형태 가능

**실무 활용:**
- Stream API의 filter, map, reduce 등에 람다로 간결한 데이터 처리 로직 전달
- 이벤트 리스너나 콜백을 람다로 구현하여 익명 클래스의 보일러플레이트 제거
- 전략 패턴 구현 시 여러 구현 클래스 대신 람다로 다양한 전략을 간단하게 정의

---
