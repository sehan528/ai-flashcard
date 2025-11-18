## 질문 9: Java 8 이후 인터페이스의 default 메서드와 static 메서드에 대해 설명해주세요.

**정의:**
Java 8에서 인터페이스에 default 메서드와 static 메서드가 추가되어 인터페이스가 구현을 포함할 수 있게 되었습니다. default 메서드는 구현체에서 재정의할 수 있는 기본 구현을 제공하며, static 메서드는 인터페이스 레벨의 유틸리티 메서드를 정의합니다.

**특징/원리:**
- 하위 호환성: 기존 인터페이스에 새로운 메서드를 추가해도 구현 클래스를 수정하지 않아도 되어 API 확장 용이
- 선택적 오버라이딩: default 메서드는 구현 클래스에서 필요에 따라 오버라이드할 수 있어 유연성 제공
- 다중 상속 문제: 여러 인터페이스가 같은 시그니처의 default 메서드를 가질 경우 명시적으로 선택 필요
- 인스턴스 독립: static 메서드는 인터페이스명으로 직접 호출되며 구현 클래스와 독립적으로 동작

**default 메서드 특징:**
- 구현 제공: 인터페이스에서 메서드의 기본 동작을 구현하여 모든 구현 클래스가 사용 가능
- 오버라이딩 가능: 구현 클래스에서 필요 시 재정의하여 커스터마이징 가능
- 다이아몬드 문제: 여러 인터페이스의 default 메서드가 충돌할 경우 컴파일 에러 발생하며 명시적 해결 필요
- 함수형 인터페이스: Stream API 등 함수형 프로그래밍 지원을 위한 핵심 기능

**static 메서드 특징:**
- 유틸리티 기능: 인터페이스와 관련된 헬퍼 메서드를 제공하여 별도 유틸리티 클래스 불필요
- 오버라이딩 불가: 구현 클래스에서 재정의할 수 없으며 인터페이스명으로만 호출
- 상속되지 않음: 인터페이스를 구현한 클래스에서 static 메서드는 상속되지 않음

**실무 활용:**
- 기존 인터페이스에 새로운 기능을 추가할 때 default 메서드로 구현하여 하위 호환성 유지
- Collection 인터페이스의 stream() 메서드처럼 공통 기능을 default 메서드로 제공
- Comparator.comparing()과 같은 팩토리 메서드를 static 메서드로 제공하여 편의성 향상

---

## 질문 10: Checked Exception과 Unchecked Exception의 차이점은 무엇인가요?

**정의:**
Checked Exception은 컴파일 시점에 처리 여부를 확인하는 예외로 Exception 클래스를 상속하며, Unchecked Exception은 런타임 시점에 발생하는 예외로 RuntimeException을 상속합니다. 두 예외의 처리 방식과 사용 목적이 다릅니다.

**특징/원리:**
- 컴파일러 검사: Checked Exception은 컴파일러가 예외 처리를 강제하지만, Unchecked Exception은 선택적으로 처리
- 발생 시점: Checked Exception은 예측 가능한 상황에서 발생하며, Unchecked Exception은 프로그래밍 오류로 발생
- 복구 가능성: Checked Exception은 복구 가능한 상황을 나타내고, Unchecked Exception은 프로그램 로직 오류를 나타냄
- 트랜잭션 처리: Spring 프레임워크에서 Unchecked Exception은 기본적으로 롤백되지만 Checked Exception은 롤백되지 않음

**Checked Exception 특징:**
- 명시적 처리 필요: try-catch 블록으로 처리하거나 throws 키워드로 전파 선언 필수
- 대표 예외: IOException, SQLException, ClassNotFoundException 등
- 복구 시나리오: 파일이 없을 때 재시도, 네트워크 오류 시 재접속 등 복구 로직 구현 가능
- API 계약: 메서드 시그니처에 명시되어 호출자에게 발생 가능한 예외 정보 제공

**Unchecked Exception 특징:**
- 선택적 처리: 명시적 처리가 강제되지 않으며 처리하지 않아도 컴파일 가능
- 대표 예외: NullPointerException, IllegalArgumentException, ArrayIndexOutOfBoundsException 등
- 프로그래밍 오류: 대부분 개발자의 실수나 검증 누락으로 발생하며 코드 수정으로 해결
- 전파 용이: throws 선언 없이도 자동으로 호출 스택을 따라 전파

**실무 활용:**
- 파일 입출력이나 데이터베이스 작업 등 외부 리소스 접근 시 Checked Exception 처리하여 안정성 확보
- 메서드 파라미터 검증 실패 시 IllegalArgumentException 같은 Unchecked Exception 발생시켜 프로그래밍 오류 표시
- 비즈니스 예외는 커스텀 Unchecked Exception으로 정의하여 Spring의 트랜잭션 롤백 기능 활용

---

## 질문 11: try-with-resources 구문의 동작 원리를 설명해주세요.

**정의:**
try-with-resources는 Java 7에서 도입된 구문으로 AutoCloseable 인터페이스를 구현한 리소스를 자동으로 해제하는 기능을 제공합니다. try 블록이 종료될 때 선언된 리소스의 close() 메서드가 자동으로 호출되어 명시적인 리소스 해제 코드가 불필요합니다.

**특징/원리:**
- 자동 리소스 관리: try 괄호 안에 선언된 리소스는 try 블록 종료 시 자동으로 close() 호출되어 메모리 누수 방지
- 예외 안전성: 리소스 해제 중 예외 발생 시에도 원본 예외 정보가 보존되며 suppressed exception으로 추가
- 역순 해제: 여러 리소스가 선언된 경우 선언의 역순으로 close() 호출되어 의존성 문제 해결
- 간결한 코드: finally 블록에서 명시적으로 close()를 호출하는 보일러플레이트 코드 제거

**동작 메커니즘:**
- AutoCloseable 인터페이스: 리소스 클래스는 AutoCloseable 또는 Closeable 인터페이스를 구현해야 함
- 컴파일 변환: 컴파일러가 try-with-resources 구문을 try-finally 블록으로 자동 변환
- 예외 처리 순서: try 블록의 예외가 주 예외가 되고, close() 중 발생한 예외는 suppressed exception으로 추가
- 다중 리소스: 세미콜론으로 구분하여 여러 리소스를 한 번에 선언 가능

**실무 활용:**
- 파일 입출력 시 FileInputStream, BufferedReader 등을 try-with-resources로 선언하여 안전하게 리소스 해제
- 데이터베이스 Connection, Statement, ResultSet을 try-with-resources로 관리하여 커넥션 누수 방지
- 커스텀 리소스 클래스 작성 시 AutoCloseable을 구현하여 try-with-resources 패턴 활용 가능하도록 설계

---

## 질문 12: equals()와 hashCode()의 관계와 오버라이딩 시 주의사항은 무엇인가요?

**정의:**
equals()와 hashCode()는 Object 클래스에 정의된 메서드로 객체의 동등성 비교와 해시 기반 컬렉션에서의 사용을 위한 핵심 메서드입니다. 두 메서드는 밀접한 관계가 있으며, 하나를 오버라이드하면 다른 하나도 함께 오버라이드해야 합니다.

**특징/원리:**
- equals-hashCode 계약: equals()로 같다고 판단된 두 객체는 반드시 같은 hashCode 값을 반환해야 함
- 일관성 유지: equals()와 hashCode()의 계산에 사용되는 필드는 동일해야 하며, 불변 필드 사용 권장
- 성능 영향: hashCode()는 HashMap, HashSet 등에서 버킷 결정에 사용되어 성능에 직접적 영향
- 대칭성과 추이성: equals()는 대칭성, 추이성, 일관성, null 비교 등의 계약을 준수해야 함

**equals() 오버라이딩 규칙:**
- 반사성: x.equals(x)는 항상 true 반환
- 대칭성: x.equals(y)가 true면 y.equals(x)도 true
- 추이성: x.equals(y)와 y.equals(z)가 true면 x.equals(z)도 true
- 일관성: 여러 번 호출해도 동일한 결과 반환
- null 처리: x.equals(null)은 항상 false

**hashCode() 오버라이딩 규칙:**
- 일관성: 동일 객체에 대해 여러 번 호출 시 equals() 비교에 사용된 정보가 변경되지 않았다면 같은 값 반환
- equals 연계: equals()로 같다고 판단되면 hashCode()도 같은 값 반환 필수
- 분산성: 서로 다른 객체는 가능한 한 다른 해시 값을 가져야 해시 충돌 최소화

**실무 활용:**
- HashMap, HashSet 등 해시 기반 컬렉션에 커스텀 객체를 키로 사용할 때 반드시 두 메서드 오버라이드
- IDE의 자동 생성 기능이나 Lombok의 @EqualsAndHashCode 어노테이션으로 안전하게 구현
- 불변 객체로 설계하여 equals()와 hashCode()의 일관성을 보장하고 스레드 안전성 확보

---
