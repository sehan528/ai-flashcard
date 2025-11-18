## 질문 13: String, StringBuilder, StringBuffer의 차이점을 설명해주세요.

**정의:**
String, StringBuilder, StringBuffer는 모두 문자열을 다루는 Java 클래스이지만 가변성과 스레드 안전성 측면에서 차이가 있습니다. String은 불변 객체이고, StringBuilder와 StringBuffer는 가변 객체로 문자열 수정이 가능합니다.

**특징/원리:**
- 불변성: String은 한 번 생성되면 변경 불가능하며, 수정 시 새로운 객체가 생성되어 메모리 낭비 발생 가능
- 성능: StringBuilder가 가장 빠르고, StringBuffer는 동기화로 인해 약간 느리며, String은 연산 시마다 객체 생성으로 가장 느림
- 스레드 안전성: StringBuffer는 synchronized로 스레드 안전하지만, StringBuilder는 스레드 안전하지 않음
- 메모리: String은 String Pool을 사용하여 같은 값의 문자열은 재사용되지만, StringBuilder와 StringBuffer는 힙에 개별 생성

**각 클래스의 특징:**
- String: 불변 객체로 스레드 안전하며, + 연산자 사용 가능하지만 반복적인 문자열 연결 시 성능 저하
- StringBuilder: 가변 객체로 단일 스레드 환경에서 문자열 연산 시 최고 성능 제공
- StringBuffer: 가변 객체로 멀티스레드 환경에서 안전하게 사용 가능하지만 동기화 오버헤드 존재
- 사용 메서드: append(), insert(), delete() 등 다양한 문자열 조작 메서드 제공

**실무 활용:**
- 고정된 문자열이나 상수는 String 사용하여 불변성의 이점 활용
- 단일 스레드에서 반복적인 문자열 연결 작업은 StringBuilder 사용하여 성능 최적화
- 멀티스레드 환경에서 공유되는 문자열 버퍼는 StringBuffer 사용하여 데이터 무결성 보장

---

## 질문 14: Java의 Generic에 대해 설명하고, Type Erasure란 무엇인가요?

**정의:**
Generic은 클래스나 메서드에서 사용할 타입을 파라미터화하여 타입 안전성을 제공하는 기능입니다. Type Erasure는 컴파일 시점에 Generic 타입 정보를 제거하고 원시 타입으로 변환하는 Java의 Generic 구현 방식입니다.

**특징/원리:**
- 타입 안전성: 컴파일 타임에 타입 체크를 수행하여 런타임 ClassCastException 방지
- 코드 재사용성: 동일한 코드로 다양한 타입을 처리할 수 있어 중복 코드 제거
- 하위 호환성: Type Erasure를 통해 Generic이 없던 이전 버전의 Java 코드와 호환성 유지
- 성능: 런타임에 타입 정보가 없어 리플렉션으로 Generic 타입을 알 수 없는 제약 존재

**Type Erasure 동작 방식:**
- 타입 파라미터 제거: 컴파일 시 모든 타입 파라미터를 제거하고 경계 타입이나 Object로 대체
- 타입 캐스팅 추가: 필요한 위치에 자동으로 타입 캐스팅 코드 삽입
- 브릿지 메서드 생성: 다형성 유지를 위해 컴파일러가 자동으로 브릿지 메서드 생성
- 런타임 정보 손실: 런타임에는 타입 파라미터 정보가 없어 instanceof나 new 연산자 사용 불가

**제약사항:**
- 기본 타입 사용 불가: int, double 등 기본 타입은 Generic 타입으로 사용 불가하며 래퍼 클래스 사용 필요
- 타입 배열 생성 불가: new T[]와 같은 Generic 타입의 배열 생성 불가
- static 멤버 제약: static 멤버에서 클래스의 타입 파라미터 사용 불가
- 예외 클래스 불가: Generic 클래스가 Throwable을 상속할 수 없음

**실무 활용:**
- Collection 프레임워크에서 타입 안전한 자료구조 사용하여 런타임 오류 방지
- DAO나 Repository 같은 공통 인터페이스를 Generic으로 정의하여 코드 재사용성 향상
- 와일드카드를 활용하여 유연한 메서드 파라미터 정의 및 공변성/반공변성 구현

---

## 질문 15: Comparable과 Comparator의 차이점을 설명해주세요.

**정의:**
Comparable과 Comparator는 객체의 정렬 기준을 정의하는 인터페이스입니다. Comparable은 객체 자체의 자연스러운 순서를 정의하며, Comparator는 외부에서 별도의 비교 기준을 제공합니다.

**특징/원리:**
- 위치: Comparable은 정렬 대상 클래스 내부에 구현되고, Comparator는 별도 클래스나 람다로 외부에서 제공
- 메서드: Comparable은 compareTo() 하나, Comparator는 compare() 메서드를 구현
- 정렬 기준: Comparable은 단일 정렬 기준(기본 정렬)을 제공하고, Comparator는 다양한 정렬 기준 제공 가능
- 클래스 수정: Comparable은 원본 클래스를 수정해야 하지만, Comparator는 원본 클래스 수정 없이 사용 가능

**Comparable 특징:**
- 자연스러운 순서: 객체의 기본 정렬 순서를 정의하며 Collections.sort()에서 자동 사용
- compareTo() 메서드: 현재 객체와 매개변수 객체를 비교하여 음수, 0, 양수 반환
- 일관성: equals()와 일관된 결과를 제공해야 하며, compareTo()가 0이면 equals()도 true 권장
- String, Integer 등: 대부분의 기본 클래스들이 Comparable 구현하여 자연스러운 정렬 제공

**Comparator 특징:**
- 외부 정렬 기준: 정렬 대상 클래스를 수정하지 않고 다양한 정렬 방식 제공 가능
- compare() 메서드: 두 객체를 비교하여 음수, 0, 양수 반환
- 다중 정렬 기준: 여러 Comparator를 정의하여 상황에 따라 다른 정렬 적용 가능
- Java 8 개선: 람다 표현식과 Comparator.comparing() 등의 유틸리티 메서드로 간결한 구현 가능

**실무 활용:**
- 도메인 객체에 기본 정렬 순서가 명확한 경우 Comparable 구현하여 자연스러운 정렬 제공
- 다양한 정렬 기준이 필요한 경우 여러 Comparator를 정의하여 상황에 맞게 선택
- Stream API에서 Comparator를 활용하여 정렬, 최대/최소값 찾기 등 다양한 연산 수행

---

## 질문 16: Java의 Collection Framework 구조를 설명해주세요.

**정의:**
Java Collection Framework는 데이터 그룹을 효율적으로 저장하고 관리하기 위한 표준화된 아키텍처입니다. 인터페이스, 구현 클래스, 알고리즘으로 구성되어 있으며 다양한 자료구조를 일관된 방식으로 사용할 수 있게 합니다.

**특징/원리:**
- 인터페이스 기반 설계: Collection, List, Set, Queue, Map 등의 인터페이스로 계층 구조 정의
- 다형성 활용: 인터페이스 타입으로 선언하고 구체적인 구현 클래스는 필요에 따라 교체 가능
- 일관된 API: 모든 컬렉션이 유사한 메서드를 제공하여 학습 및 사용 용이
- 성능 최적화: 각 구현 클래스는 특정 상황에 최적화된 내부 구조와 알고리즘 사용

**주요 인터페이스 계층:**
- Collection: 모든 컬렉션의 최상위 인터페이스로 기본 메서드 정의
- List: 순서가 있고 중복을 허용하는 컬렉션으로 ArrayList, LinkedList, Vector 등이 구현
- Set: 순서가 없고 중복을 허용하지 않는 컬렉션으로 HashSet, TreeSet, LinkedHashSet 등이 구현
- Queue: FIFO 구조의 컬렉션으로 PriorityQueue, ArrayDeque 등이 구현
- Map: 키-값 쌍을 저장하는 컬렉션으로 HashMap, TreeMap, LinkedHashMap 등이 구현

**구현 클래스 특징:**
- ArrayList: 동적 배열 기반으로 인덱스 접근이 빠르지만 중간 삽입/삭제는 느림
- LinkedList: 이중 연결 리스트로 삽입/삭제가 빠르지만 인덱스 접근은 느림
- HashSet: 해시 테이블 기반으로 빠른 검색과 삽입 제공하지만 순서 보장 안 됨
- TreeSet: 레드-블랙 트리 기반으로 정렬된 순서 유지하며 O(log n) 성능
- HashMap: 해시 테이블 기반으로 빠른 키-값 검색 제공

**실무 활용:**
- 요구사항에 맞는 적절한 컬렉션 선택하여 성능 최적화 (빠른 검색은 HashSet, 정렬 필요 시 TreeSet)
- 인터페이스 타입으로 변수 선언하여 구현체 교체가 용이한 유연한 코드 작성
- Stream API와 결합하여 선언적이고 간결한 컬렉션 처리 로직 구현

---
