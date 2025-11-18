## 질문 29: Method Reference의 종류와 사용 방법을 설명해주세요.

**정의:**
Method Reference는 람다 표현식을 더욱 간결하게 표현하는 문법으로, 이미 존재하는 메서드를 참조하여 사용합니다. 람다가 단순히 메서드를 호출하기만 하는 경우, 메서드 참조로 더 명확하고 간결하게 표현할 수 있습니다.

**특징/원리:**
- 가독성 향상: 람다보다 더 직관적이고 간결한 표현으로 코드 의도 명확화
- 재사용성: 기존 메서드를 재사용하여 중복 코드 제거
- 컴파일러 검증: 메서드 시그니처가 Functional Interface와 일치하는지 컴파일 타임에 검증
- 이중 콜론 연산자: :: 기호를 사용하여 클래스나 인스턴스와 메서드를 연결

**Method Reference 종류:**
- 정적 메서드 참조: ClassName::staticMethod 형태로 클래스의 정적 메서드 참조
- 인스턴스 메서드 참조: instance::instanceMethod 형태로 특정 객체의 인스턴스 메서드 참조
- 타입의 인스턴스 메서드 참조: ClassName::instanceMethod 형태로 첫 번째 파라미터가 메서드 호출 대상
- 생성자 참조: ClassName::new 형태로 생성자를 참조하여 객체 생성

**각 종류의 사용 예시:**
- 정적 메서드: Integer::parseInt는 String을 받아 int를 반환하는 Function으로 사용
- 인스턴스 메서드: System.out::println은 Object를 받아 출력하는 Consumer로 사용
- 타입 메서드: String::toUpperCase는 String을 받아 대문자로 변환하는 Function으로 사용
- 생성자: ArrayList::new는 새로운 ArrayList를 생성하는 Supplier로 사용

**실무 활용:**
- Stream API에서 map(String::trim), forEach(System.out::println) 등으로 간결한 처리
- Comparator.comparing(Person::getName)처럼 getter 메서드 참조로 정렬 기준 정의
- collect(Collectors.toCollection(LinkedList::new))로 특정 컬렉션 타입으로 수집

---

## 질문 30: CompletableFuture의 동작 원리와 사용 방법을 설명해주세요.

**정의:**
CompletableFuture는 Java 8에서 도입된 비동기 프로그래밍을 위한 클래스로, Future 인터페이스를 확장하여 명시적으로 완료 가능하고 함수형 스타일로 조합할 수 있는 기능을 제공합니다. 비동기 작업의 결과를 다루고 여러 비동기 작업을 조합하는 강력한 API를 제공합니다.

**특징/원리:**
- 명시적 완료: complete() 메서드로 수동으로 결과를 설정 가능
- 비블로킹: get() 대신 thenApply, thenAccept 등으로 비블로킹 방식으로 결과 처리
- 함수형 조합: 여러 비동기 작업을 체이닝하거나 병합하여 복잡한 비동기 로직 구성
- 예외 처리: exceptionally, handle 등으로 비동기 작업의 예외를 우아하게 처리

**주요 메서드:**
- supplyAsync: Supplier를 비동기로 실행하고 결과를 CompletableFuture로 반환
- runAsync: Runnable을 비동기로 실행하며 결과가 없는 CompletableFuture 반환
- thenApply: 결과를 변환하는 Function을 적용하여 새로운 CompletableFuture 반환
- thenAccept: 결과를 소비하는 Consumer를 적용하며 void CompletableFuture 반환
- thenCompose: 중첩된 CompletableFuture를 평탄화하여 순차 비동기 작업 체이닝
- thenCombine: 두 CompletableFuture를 병렬로 실행하고 결과를 조합

**비동기 작업 조합:**
- allOf: 여러 CompletableFuture가 모두 완료될 때까지 대기
- anyOf: 여러 CompletableFuture 중 하나라도 완료되면 진행
- 순차 처리: thenCompose로 앞 작업의 결과를 다음 작업의 입력으로 사용
- 병렬 처리: thenCombine으로 독립적인 작업을 동시 실행하고 결과 병합

**예외 처리:**
- exceptionally: 예외 발생 시 기본값 반환하거나 대체 로직 실행
- handle: 정상 결과와 예외를 모두 처리하는 BiFunction 제공
- whenComplete: 결과나 예외를 소비하지만 값을 변경하지 않음
- completeExceptionally: 수동으로 예외 상태로 완료 설정

**실무 활용:**
- 여러 외부 API 호출을 병렬로 수행하고 모든 결과를 조합하여 응답 생성
- 데이터베이스 조회와 캐시 조회를 동시에 수행하고 먼저 완료된 결과 사용
- 긴 실행 시간의 작업을 백그라운드에서 비동기로 처리하고 완료 시 콜백 실행

---

## 질문 31: Java의 리플렉션(Reflection)이란 무엇이고 언제 사용하나요?

**정의:**
리플렉션은 런타임에 클래스, 메서드, 필드 등의 정보를 조사하고 조작할 수 있는 Java API입니다. 컴파일 타임에 알 수 없는 클래스를 동적으로 로드하고 인스턴스를 생성하며, private 멤버에도 접근할 수 있는 강력하지만 신중하게 사용해야 하는 기능입니다.

**특징/원리:**
- 런타임 타입 정보: Class 객체를 통해 클래스의 구조와 메타데이터를 런타임에 확인
- 동적 접근: private, protected 멤버에도 setAccessible(true)로 접근 가능
- 타입 안전성 부재: 컴파일 타임 타입 체크 없이 런타임에 ClassCastException 발생 가능
- 성능 오버헤드: 일반 메서드 호출보다 리플렉션을 통한 호출이 훨씬 느림

**주요 클래스와 메서드:**
- Class: 클래스 정보를 담는 객체로 getClass(), forName(), getName() 등 제공
- Field: 필드 정보를 담으며 get(), set()으로 값을 읽고 쓸 수 있음
- Method: 메서드 정보를 담으며 invoke()로 메서드를 동적으로 호출
- Constructor: 생성자 정보를 담으며 newInstance()로 객체를 동적으로 생성
- Modifier: 접근 제어자, static, final 등의 수정자 정보 확인

**사용 사례:**
- 프레임워크: Spring의 DI 컨테이너가 리플렉션으로 빈을 생성하고 의존성 주입
- 직렬화: Jackson, Gson 등의 라이브러리가 리플렉션으로 객체를 JSON으로 변환
- ORM: Hibernate, JPA가 리플렉션으로 엔티티 객체와 데이터베이스 매핑
- 테스트: Mockito 같은 목 프레임워크가 리플렉션으로 동적 프록시 생성
- 플러그인 시스템: 런타임에 동적으로 클래스를 로드하여 확장 기능 제공

**주의사항:**
- 성능: 자주 호출되는 코드에는 부적합하며 캐싱 등으로 최적화 필요
- 보안: 접근 제어를 우회하므로 SecurityManager가 있는 환경에서 제약
- 캡슐화 위반: private 멤버 접근은 객체지향 원칙을 해치므로 최후의 수단으로만 사용
- 유지보수: 컴파일 타임 검증이 안 되어 리팩토링 시 오류 발견이 어려움

**실무 활용:**
- 애노테이션 기반 설정을 읽어 자동으로 빈을 등록하거나 검증 로직 수행
- 범용 유틸리티 메서드로 임의의 객체를 복사하거나 비교하는 기능 구현
- 레거시 코드의 private 메서드를 테스트하기 위해 제한적으로 리플렉션 사용

---

## 질문 32: 동적 프록시(Dynamic Proxy)의 동작 원리를 설명해주세요.

**정의:**
동적 프록시는 런타임에 인터페이스의 구현체를 동적으로 생성하는 기술로, 원본 객체에 대한 접근을 제어하거나 부가 기능을 추가할 수 있습니다. Java의 Proxy 클래스와 InvocationHandler 인터페이스를 사용하여 구현하며, AOP의 핵심 메커니즘입니다.

**특징/원리:**
- 런타임 생성: 컴파일 타임이 아닌 런타임에 프록시 클래스를 생성하여 유연성 제공
- 인터페이스 기반: Java의 동적 프록시는 인터페이스를 구현하는 방식으로만 동작
- 메서드 가로채기: 모든 메서드 호출이 InvocationHandler의 invoke() 메서드로 전달
- 투명성: 클라이언트는 프록시인지 실제 객체인지 알 필요 없이 인터페이스로 접근

**핵심 구성 요소:**
- Proxy 클래스: newProxyInstance() 정적 메서드로 프록시 인스턴스 생성
- InvocationHandler: invoke() 메서드를 구현하여 메서드 호출 시 실행될 로직 정의
- ClassLoader: 프록시 클래스를 로드할 클래스 로더 지정
- Interfaces: 프록시가 구현할 인터페이스 배열

**동작 흐름:**
- 프록시 인스턴스 생성 시 ClassLoader, 인터페이스 배열, InvocationHandler 전달
- 클라이언트가 프록시의 메서드를 호출하면 InvocationHandler의 invoke() 메서드로 위임
- invoke() 메서드에서 원본 객체의 메서드 호출 전후로 부가 기능 수행
- 메서드 실행 결과를 클라이언트에게 반환

**활용 패턴:**
- 로깅: 메서드 호출 전후로 로그를 기록하여 디버깅이나 모니터링 지원
- 트랜잭션: 메서드 실행 전 트랜잭션 시작하고 완료 후 커밋 또는 예외 시 롤백
- 권한 검사: 메서드 실행 전 사용자 권한을 확인하여 접근 제어
- 캐싱: 메서드 결과를 캐시하여 동일한 요청 시 캐시된 값 반환
- 지연 로딩: 실제 메서드 호출 시점까지 리소스 로딩을 지연

**실무 활용:**
- Spring AOP가 내부적으로 JDK 동적 프록시나 CGLIB을 사용하여 횡단 관심사 구현
- MyBatis의 Mapper 인터페이스가 동적 프록시로 구현되어 SQL 실행
- Mock 프레임워크인 Mockito가 동적 프록시로 테스트 더블 생성

---
